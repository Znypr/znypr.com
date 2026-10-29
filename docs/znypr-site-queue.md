# znypr.com queue

Ranked: top is next. Each ticket says what is wrong, where, and what done looks like.

## 1. Updater push is rejected by GitHub, and the log still says "pushed"
- **Where:** the local updater at `C:\Users\znypr\znypr-updater\run-update.ps1` (not in this repo).
- **What:** on 2026-10-29 19:17 GitHub refused the push with GH007 ("would publish a private email address"). The script logs `pushed` without checking `git push`'s exit code, so failures look like successes.
- **Done when:** the commit author/committer is an address GitHub accepts, a failed push logs `push FAILED` with the exit code, and one real update reaches `main`.

## 2. Homepage short thumbnail 404s
- **Where:** `index.html` and `assets/youtube-latest.json` reference `assets/thumbs/OirdodUQjYk.jpg`, which is not in the repo (also 404 on the live site, checked 2026-10-29).
- **What:** the updater added the short to the JSON/HTML without committing its thumbnail.
- **Done when:** the thumbnail is committed (or the updater falls back to YouTube's `i.ytimg.com` image), and every `assets/thumbs/*` referenced by a page exists.

## 3. Remove dead motion and style files
- **What:** no page loads `style.css`, `clean.css`, `motion.css`, `motion.js` or `clean-motion.js`; all styles and the motion layer are inline in each page.
- **Done when:** the unused files are deleted after confirming nothing (pages, `pages/*.html`, workflows) references them.
