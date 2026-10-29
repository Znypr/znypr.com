"""Refresh assets/youtube-latest.json from the Znypr YouTube channel feed.

Picks the newest regular upload - never a livestream - for the homepage's "Latest drop"
(from the channel's Videos tab) and the four newest Shorts (from the RSS feed). Each video gets a one- or two-sentence summary written by Claude from its title,
description and thumbnail - once per video; summaries are kept in the JSON and reused.

Runs without an API key too: new videos then simply have no summary until one is set.

usage: python scripts/update_youtube.py assets/youtube-latest.json [--feed FILE]
env:   ANTHROPIC_API_KEY (optional) - enables summaries for new videos
"""
import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone

import defusedxml.ElementTree as ET

CHANNEL_ID = "UCdtetXHUd_nPJR2bXxOEyNw"  # youtube.com/@znypr
FEED_URL = f"https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}"
SHORTS_COUNT = 4
MORE_COUNT = 2  # regular uploads shown under the Latest drop
MAX_CACHED_SUMMARIES = 60
VIEWS_REFRESH_HOURS = 12
MODEL = "claude-opus-5-5"

NS = {"a": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015",
      "m": "http://search.yahoo.com/mrss/"}
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


PAGE_HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", "Accept-Language": "en-US,en;q=0.9",
                "Cookie": "CONSENT=YES+1; SOCS=CAI"}


def fetch(url, headers=None):
    req = urllib.request.Request(url, headers=headers or {"User-Agent": "znypr-site-updater"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read()


def fetch_feed(path):
    if path:
        with open(path, "rb") as f:
            return f.read()
    # YouTube's RSS endpoint answers 404/5xx now and then; retry before giving up.
    for attempt in range(4):
        try:
            return fetch(FEED_URL)
        except (urllib.error.HTTPError, urllib.error.URLError) as e:
            print(f"feed attempt {attempt + 1} failed: {e}", file=sys.stderr)
            time.sleep(5 * (attempt + 1))
    return None


def latest_uploads(count):
    """Newest regular uploads: the channel's Videos tab lists uploads without Shorts and
    streams; the watch page's isLiveContent flag double-checks each is not a stream."""
    page = fetch(f"https://www.youtube.com/channel/{CHANNEL_ID}/videos", PAGE_HEADERS).decode("utf8", "replace")
    ids = list(dict.fromkeys(re.findall(r'"lockupViewModel":\{"contentImage".*?"contentId":"([\w-]{11})"', page)
                             or re.findall(r'"videoRenderer":\{"videoId":"([\w-]{11})"', page)))
    uploads = []
    for video_id in ids[:count + 5]:
        if len(uploads) == count:
            break
        watch = fetch(f"https://www.youtube.com/watch?v={video_id}", PAGE_HEADERS).decode("utf8", "replace")
        field = lambda name: (re.search(r'"%s":"((?:[^"\\]|\\.)*)"' % name, watch) or [None, None])[1]
        if field("isLiveContent") == "true" or re.search(r'"isLiveContent":true', watch):
            continue
        length = int(re.search(r'"lengthSeconds":"(\d+)"', watch).group(1))
        if length <= 60:
            continue
        published = field("publishDate")
        day = datetime.fromisoformat(published)
        views = int(re.search(r'"viewCount":"(\d+)"', watch).group(1))
        uploads.append({
            "id": video_id,
            "title": json.loads('"%s"' % field("title")),
            "description": clean_description(json.loads('"%s"' % (field("shortDescription") or ""))),
            "published": published[:10],
            "date": f"{day.day} {MONTHS[day.month - 1]} {day.year}",
            "views": views,
            "viewsDisplay": compact_views(views),
            "length": f"{length // 60}:{length % 60:02d}",
            "type": "video",
            "url": f"https://www.youtube.com/watch?v={video_id}",
            "thumb": f"https://i.ytimg.com/vi/{video_id}/maxresdefault.jpg",
        })
    return uploads


def compact_views(n):
    if n >= 1_000_000:
        return f"{n / 1_000_000:.1f}M".replace(".0M", "M")
    if n >= 1_000:
        return f"{n / 1_000:.1f}K".replace(".0K", "K")
    return str(n)


def clean_description(text):
    # Drop the channel's boilerplate (like/subscribe line, hashtags, playlist footer).
    text = text.split("───")[0]
    text = re.sub(r"LIKE.*?SUBSCRIBE.*?video!", "", text, flags=re.S | re.I)
    text = re.sub(r"#\w+", "", text)
    return re.sub(r"\s+", " ", text).strip()


def parse(feed_xml):
    root = ET.fromstring(feed_xml)
    videos = []
    for entry in root.findall("a:entry", NS):
        group = entry.find("m:group", NS)
        video_id = entry.find("yt:videoId", NS).text
        link = entry.find("a:link", NS).get("href")
        published = entry.find("a:published", NS).text
        views = int(group.find("m:community/m:statistics", NS).get("views"))
        day = datetime.fromisoformat(published.replace("Z", "+00:00"))
        is_short = "/shorts/" in link
        videos.append({
            "id": video_id,
            "title": entry.find("a:title", NS).text.strip(),
            "description": clean_description(group.find("m:description", NS).text or ""),
            "published": published[:10],
            "date": f"{day.day} {MONTHS[day.month - 1]} {day.year}",
            "views": views,
            "viewsDisplay": compact_views(views),
            "type": "short" if is_short else "video",
            "url": f"https://www.youtube.com/shorts/{video_id}" if is_short else f"https://www.youtube.com/watch?v={video_id}",
            "thumb": f"https://i.ytimg.com/vi/{video_id}/{'oardefault' if is_short else 'maxresdefault'}.jpg",
        })
    videos.sort(key=lambda v: v["published"], reverse=True)
    return videos


SUMMARY_PROMPT = """You write the one-line blurb under a video on a gaming creator's website (Znypr, Roblox Rivals videos, streams and Shorts).

Video type: {kind}
Title: {title}
Description: {description}

Using only the title, the description and the thumbnail image, write one or two plain sentences (max 30 words) saying what the video is about: the topic, the game moment or the thing being shown.
- Describe the content, never the format: don't mention facecam, gameplay footage, editing, camera, reactions or that it is a Short or a video.
- No jokes, attitude or flavour that the title or description doesn't contain.
- Refer to the creator as Znypr and don't use he or she.
- Don't invent details you cannot see or read. No hashtags, no emoji, no quotes around the text.
Reply with the blurb only."""


def summarize(client, video):
    import anthropic

    prompt = SUMMARY_PROMPT.format(kind="Short" if video["type"] == "short" else "video or stream",
                                   title=video["title"], description=video.get("description") or "(none)")
    try:
        response = client.beta.messages.create(
            model=MODEL,
            max_tokens=4000,
            output_config={"effort": "low"},
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",
            messages=[{"role": "user", "content": [
                {"type": "image", "source": {"type": "url", "url": video["thumb"]}},
                {"type": "text", "text": prompt},
            ]}],
        )
    except anthropic.RateLimitError:
        print(f"rate limited, skipping summary for {video['id']}", file=sys.stderr)
        return None
    except anthropic.APIStatusError as e:
        print(f"API error {e.status_code} for {video['id']}: {e.message}", file=sys.stderr)
        return None
    except anthropic.APIConnectionError:
        print(f"network error, skipping summary for {video['id']}", file=sys.stderr)
        return None
    if response.stop_reason == "refusal":
        print(f"summary declined for {video['id']}", file=sys.stderr)
        return None
    text = " ".join(b.text for b in response.content if b.type == "text").strip()
    return text.strip('"') or None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("out")
    ap.add_argument("--feed", help="read the feed from a file instead of YouTube (testing)")
    args = ap.parse_args()

    previous = {}
    if os.path.exists(args.out):
        with open(args.out, encoding="utf8") as f:
            previous = json.load(f)
    summaries = dict(previous.get("summaries", {}))

    feed = fetch_feed(args.feed)
    if feed is None:
        print("feed unavailable this run; keeping the previous Shorts")
        shorts = previous.get("shorts", [])
    else:
        shorts = [v for v in parse(feed) if v["type"] == "short"][:SHORTS_COUNT]
    # Latest drop = newest regular upload, never a livestream; "more" = the next ones.
    # If YouTube's pages can't be read this run, keep the previous ones rather than
    # fall back to streams.
    try:
        uploads = [] if args.feed else latest_uploads(1 + MORE_COUNT)
    except Exception as e:  # page layout changes, network errors
        print(f"could not read the Videos tab: {e}", file=sys.stderr)
        uploads = []
    feature = uploads[0] if uploads else previous.get("feature")
    more = uploads[1:] if uploads else previous.get("more", [])
    if not feature or not shorts:
        sys.exit("no regular upload or no Shorts found; keeping the previous file")

    client = None
    if os.environ.get("ANTHROPIC_API_KEY"):
        import anthropic
        client = anthropic.Anthropic()
    shown = [feature, *more, *shorts]
    for video in shown:
        if video["id"] not in summaries and client is not None:
            summary = summarize(client, video)
            if summary:
                summaries[video["id"]] = summary
        video["summary"] = summaries.get(video["id"])
        video.pop("description", None)

    keep = [v["id"] for v in shown]
    trimmed = {k: summaries[k] for k in list(summaries)[-MAX_CACHED_SUMMARIES:]}
    trimmed.update({k: summaries[k] for k in keep if k in summaries})

    data = {"source": FEED_URL, "feature": feature, "more": more, "shorts": shorts, "summaries": trimmed}
    # New videos, titles or summaries publish right away; view counts alone refresh at
    # most every VIEWS_REFRESH_HOURS, so the scheduled job doesn't commit every run.
    def content(d):
        pick = lambda v: [v["id"], v["title"], v.get("summary")]
        return json.dumps([pick(d["feature"]), [pick(v) for v in d.get("more", [])], [pick(s) for s in d["shorts"]]], sort_keys=True)
    def views(d):
        return [v["viewsDisplay"] for v in [d["feature"], *d.get("more", []), *d["shorts"]]]
    if previous.get("feature") and content(previous) == content(data):
        last = datetime.fromisoformat(previous.get("updatedAt", "1970-01-01T00:00:00Z").replace("Z", "+00:00"))
        age_hours = (datetime.now(timezone.utc) - last).total_seconds() / 3600
        if views(previous) == views(data) or age_hours < VIEWS_REFRESH_HOURS:
            print("no change to publish")
            return
    data["updatedAt"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    with open(args.out, "w", encoding="utf8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print(f"updated: {feature['title']} + {len(more)} more + {len(shorts)} shorts")


if __name__ == "__main__":
    main()
