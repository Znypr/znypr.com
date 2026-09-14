import { readFile, writeFile } from 'node:fs/promises';

const STATS_PATH = new URL('../assets/stats.json', import.meta.url);
const checkedAt = new Date().toISOString();
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36';

const accounts = {
  gaming: {
    youtube: { handle: 'znypr', channelId: 'UCdtetXHUd_nPJR2bXxOEyNw', unit: 'subscribers', fetcher: fetchYouTube, min: 50000, max: 500000 },
    tiktok: { handle: 'znypr', unit: 'followers', fetcher: fetchTikTok },
    facebook: { handle: 'znypr', unit: 'followers', fetcher: fetchFacebook },
    twitch: { handle: 'znypr_', unit: 'followers', fetcher: fetchTwitch },
    snapchat: { handle: 'znyprgaming', unit: 'followers', fetcher: fetchSnapchat },
    instagram: { handle: 'znypr_', unit: 'followers', fetcher: fetchInstagram }
  },
  fitness: {
    youtube: { handle: 'znyprfit', unit: 'subscribers', fetcher: fetchYouTube, min: 0, max: 100000 },
    tiktok: { handle: 'znyprfit', unit: 'followers', fetcher: fetchTikTok },
    instagram: { handle: 'znyprfit', unit: 'followers', fetcher: fetchInstagram },
    facebook: { handle: 'znyprfit', unit: 'followers', fetcher: fetchFacebook },
    snapchat: { handle: 'znyprf', unit: 'followers', fetcher: fetchSnapchat },
    twitter: { handle: 'znypr_', unit: 'followers', fetcher: fetchX }
  }
};

const compact = (value) => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

function numeric(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseCount(value) {
  if (!value) return null;
  const match = String(value).replace(/,/g, '').match(/([\d.]+)\s*([KMB])?/i);
  if (!match) return null;
  const multiplier = { K: 1e3, M: 1e6, B: 1e9 }[match[2]?.toUpperCase()] || 1;
  return Math.round(Number(match[1]) * multiplier);
}

function validValue(value, config = {}) {
  const number = numeric(value);
  if (number === null) return null;
  if (Number.isFinite(config.min) && number < config.min) return null;
  if (Number.isFinite(config.max) && number > config.max) return null;
  return number;
}

function firstValid(values, config = {}) {
  for (const value of values) {
    const number = validValue(value, config);
    if (number !== null) return number;
  }
  return null;
}

function result(value, source) {
  if (!Number.isFinite(value)) throw new Error('No verified public count found');
  return { value, display: compact(value), source };
}

async function request(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'user-agent': USER_AGENT,
        'accept-language': 'en-US,en;q=0.9',
        accept: 'text/html,application/json;q=0.9,*/*;q=0.8',
        ...(options.headers || {})
      }
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

async function text(url, options) {
  return (await request(url, options)).text();
}

function exactMatches(html, patterns) {
  const values = [];
  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      const value = numeric(match[1]);
      if (value !== null) values.push(value);
    }
  }
  return values;
}

function candidatesFromText(value, words = ['followers?']) {
  const values = [];
  for (const word of words) {
    const regex = new RegExp(`([\\d,.]+\\s*[KMB]?)\\s+${word}`, 'gi');
    for (const match of String(value || '').matchAll(regex)) {
      const parsed = parseCount(match[1]);
      if (parsed !== null) values.push(parsed);
    }
  }
  return values;
}

async function resolveYouTubeChannel(handle, suppliedHtml) {
  const html = suppliedHtml || await text(`https://www.youtube.com/@${handle}/about?hl=en&gl=US`);
  const marker = html.indexOf('"channelMetadataRenderer"');
  const scoped = marker >= 0 ? html.slice(marker, marker + 50000) : html.slice(0, 250000);
  const id = scoped.match(/"externalId"\s*:\s*"(UC[A-Za-z0-9_-]{22})"/)?.[1]
    || scoped.match(/"channelId"\s*:\s*"(UC[A-Za-z0-9_-]{22})"/)?.[1];
  return { id: id || null, html };
}

async function fetchYouTube(handle, config) {
  if (process.env.YOUTUBE_API_KEY) {
    try {
      const url = new URL('https://www.googleapis.com/youtube/v3/channels');
      url.searchParams.set('part', 'statistics');
      url.searchParams.set('forHandle', `@${handle}`);
      url.searchParams.set('key', process.env.YOUTUBE_API_KEY);
      const json = await (await request(url)).json();
      const value = validValue(json.items?.[0]?.statistics?.subscriberCount, config);
      if (value !== null) return result(value, 'YouTube Data API');
    } catch (error) {
      console.warn(`YouTube Data API fallback for @${handle}: ${error.message}`);
    }
  }

  let html = null;
  let channelId = config.channelId || null;

  if (!channelId) {
    try {
      const resolved = await resolveYouTubeChannel(handle);
      channelId = resolved.id;
      html = resolved.html;
    } catch (error) {
      console.warn(`Could not resolve YouTube channel ID for @${handle}: ${error.message}`);
    }
  }

  // SocialCounts exposes API_sub, which mirrors YouTube's public API count.
  // Do not use est_sub: it is an estimate and should not appear as a factual site metric.
  if (channelId) {
    try {
      const json = await (await request(`https://api.socialcounts.org/youtube-live-subscriber-count/${channelId}`, {
        headers: { accept: 'application/json' }
      })).json();
      const value = validValue(json.API_sub, config);
      if (value !== null) return result(value, 'YouTube public API');
    } catch (error) {
      console.warn(`YouTube public API fallback for @${handle}: ${error.message}`);
    }
  }

  // Final fallback: only inspect the current channel header. Never scan the whole page,
  // because recommended channels can inject unrelated subscriber counts.
  if (!html) html = await text(`https://www.youtube.com/@${handle}/about?hl=en&gl=US`);
  const headerMarker = html.indexOf('"pageHeaderRenderer"');
  const scoped = headerMarker >= 0 ? html.slice(headerMarker, headerMarker + 70000) : html.slice(0, 180000);
  const candidates = [];
  for (const match of scoped.matchAll(/"subscriberCountText"[\s\S]{0,900}?"(?:simpleText|label)"\s*:\s*"([^"]*subscribers?[^"]*)"/gi)) {
    candidates.push(...candidatesFromText(match[1], ['subscribers?']));
  }
  const value = firstValid(candidates, config);
  return result(value, 'YouTube channel header');
}

async function fetchTikTok(handle) {
  const html = await text(`https://www.tiktok.com/@${handle}?lang=en`);
  const values = exactMatches(html, [/"followerCount"\s*:\s*(\d+)/g, /\\"followerCount\\"\s*:\s*(\d+)/g]);
  return result(firstValid(values), 'TikTok public profile');
}

async function fetchTwitch(handle) {
  const body = JSON.stringify({
    operationName: 'ChannelFollowers',
    variables: { login: handle },
    query: 'query ChannelFollowers($login: String!) { user(login: $login) { followers { totalCount } } }'
  });
  const json = await (await request('https://gql.twitch.tv/gql', {
    method: 'POST',
    headers: { 'client-id': 'kimne78kx3ncx6brgo4mv6wki5h1ko', 'content-type': 'application/json' },
    body
  })).json();
  return result(validValue(json.data?.user?.followers?.totalCount), 'Twitch public GraphQL');
}

async function fetchInstagram(handle) {
  for (const host of ['www.instagram.com', 'i.instagram.com']) {
    try {
      const json = await (await request(`https://${host}/api/v1/users/web_profile_info/?username=${encodeURIComponent(handle)}`, {
        headers: { 'x-ig-app-id': '936619743392459', referer: `https://www.instagram.com/${handle}/` }
      })).json();
      const value = validValue(json.data?.user?.edge_followed_by?.count ?? json.data?.user?.follower_count);
      if (value !== null) return result(value, 'Instagram public profile API');
    } catch (error) {
      console.warn(`Instagram API fallback for @${handle}: ${error.message}`);
    }
  }
  return fetchFromPages(
    [`https://www.instagram.com/${handle}/embed/`, `https://www.instagram.com/${handle}/?hl=en`],
    [/"edge_followed_by"\s*:\s*\{"count"\s*:\s*(\d+)/g, /"follower_count"\s*:\s*(\d+)/g],
    ['followers?'],
    'Instagram public profile'
  );
}

async function fetchFacebook(handle) {
  if (process.env.META_ACCESS_TOKEN) {
    try {
      const url = new URL(`https://graph.facebook.com/v23.0/${handle}`);
      url.searchParams.set('fields', 'followers_count,fan_count');
      url.searchParams.set('access_token', process.env.META_ACCESS_TOKEN);
      const json = await (await request(url)).json();
      const value = validValue(json.followers_count ?? json.fan_count);
      if (value !== null) return result(value, 'Meta Graph API');
    } catch (error) {
      console.warn(`Meta Graph fallback for ${handle}: ${error.message}`);
    }
  }
  return fetchFromPages(
    [`https://www.facebook.com/${handle}?locale=en_US`, `https://m.facebook.com/${handle}/about`, `https://mbasic.facebook.com/${handle}`],
    [/"followers_count"\s*:\s*(\d+)/g, /"follower_count"\s*:\s*(\d+)/g, /"profile_plus_followers_count"\s*:\s*(\d+)/g],
    ['followers?'],
    'Facebook public page'
  );
}

async function fetchSnapchat(handle) {
  return fetchFromPages(
    [`https://www.snapchat.com/@${handle}`, `https://www.snapchat.com/add/${handle}`],
    [/"subscriberCount"\s*:\s*(\d+)/g, /"subscriber_count"\s*:\s*(\d+)/g, /"followerCount"\s*:\s*(\d+)/g],
    ['subscribers?', 'followers?'],
    'Snapchat public profile'
  );
}

async function fetchX(handle) {
  try {
    const json = await (await request(`https://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names=${encodeURIComponent(handle)}&lang=en`, {
      headers: { referer: 'https://platform.twitter.com/' }
    })).json();
    const value = validValue(json?.[0]?.followers_count);
    if (value !== null) return result(value, 'X public syndication API');
  } catch (error) {
    console.warn(`X syndication fallback for @${handle}: ${error.message}`);
  }
  return fetchFromPages(
    [`https://x.com/${handle}?lang=en`, `https://twitter.com/${handle}?lang=en`],
    [/"followers_count"\s*:\s*(\d+)/g, /"followersCount"\s*:\s*(\d+)/g],
    ['followers?'],
    'X public profile'
  );
}

async function fetchFromPages(urls, patterns, words, source) {
  for (const url of urls) {
    try {
      const html = await text(url);
      const value = firstValid([...exactMatches(html, patterns), ...candidatesFromText(html, words)]);
      if (value !== null) return result(value, source);
    } catch (error) {
      console.warn(`${source} fallback failed: ${error.message}`);
    }
  }
  throw new Error(`${source} count is not publicly exposed`);
}

async function main() {
  const previous = JSON.parse(await readFile(STATS_PATH, 'utf8'));
  const stats = { version: 3, updatedAt: checkedAt, metrics: {} };

  for (const [groupName, group] of Object.entries(accounts)) {
    stats.metrics[groupName] = {};
    for (const [platform, config] of Object.entries(group)) {
      try {
        const fresh = await config.fetcher(config.handle, config);
        stats.metrics[groupName][platform] = {
          ...fresh,
          unit: config.unit,
          checkedAt,
          status: 'live'
        };
        console.log(`Updated ${groupName}.${platform}: ${fresh.value}`);
      } catch (error) {
        console.warn(`Could not verify ${groupName}.${platform}: ${error.message}`);
        stats.metrics[groupName][platform] = {
          value: null,
          display: null,
          unit: config.unit,
          checkedAt,
          status: 'unavailable'
        };
      }
    }
  }

  // Keep only structural compatibility with the previous file; never carry a failed
  // old count forward as "stale". An unavailable metric is safer than a wrong one.
  void previous;
  await writeFile(STATS_PATH, `${JSON.stringify(stats, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
