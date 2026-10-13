# ZNYPR website brand direction (working specification)

Status: **selected direction for prototyping; not yet approved for production rollout**.

Tracks [GitHub issue #11](https://github.com/Znypr/znypr.com/issues/11). This document supersedes the square-card styling of the earlier exploratory dashboards without modifying the live website.

## Visual references and selected components
- User-provided image: **ZNYPR Dark Gaming UI Style Guide (1).png**. Use it for visual intent, not as an editable source of artwork. Preserve and later archive an approved copy in the brand-asset library.
- Creator/gaming brand inspired by the pacing and presentation of 100 Thieves; do not copy its marks or protected assets.
- Navigation: desktop **1A**; compact/mobile **1B**.
- Featured work: **4C**; curated showcase, not chronological recent uploads. One dominant long-form and selected shorts/challenges. This section serves brand/business discovery as well as fans.
- Socials: image-led gaming and physique sections with **compact rounded dark-glass social cards**; primary links show platform icon + username; secondary links remain accessible. Avoid plain directory tables.
- Gear: **4A**; large setup photograph and a compact group of **individual, rounded glass product cards** with useful product details. No rigid contiguous numbered table.
- Merch: **5A**; single campaign-like photo banner, rounded corners; do not fragment into generic product tiles on the homepage.
- Footer/contact: **6C**; compact and useful business contact.

## Core material and typography
- Background: near-black charcoal `#080D11`; dark surfaces `#10191F`; restrained blue-gray `#B2C6CF`; text `#F2F4F3`.
- Shadows, borders and glass are **subtle**. Default glass: tinted charcoal `rgba(14,27,35,.70)` or similar, 12–20px backdrop blur where supported, 1px low-contrast border, readable text, solid fallback.
- Geometry: **16–24px** radius on visual containers and photo banners; **12–16px** for cards; small action controls 10–14px; do not force everything into pills.
- Cards should be separated with visible gaps. Avoid a continuous hard-edged row/table with vertical dividers.
- Hover: small brightness/border shift, not heavy lift or glow. Respect reduced motion and maintain legible focus outlines.
- Use brush-style **ZNYPR** and optional brush section headings only as distinct brand moments. Use plain sans-serif for navigation, labels and multi-line text.
- Use the **×** symbol deliberately between distinct brand concepts (e.g., `GAMING × FITNESS × LIFESTYLE`). Do not multiply arbitrary lines/dots/eyebrow labels.
- Hero/content photography provides personality. Avoid generic geometric decoration and repetitive centered marketing CTAs.
- Never turn every section into a dashboard widget: feature sections should remain editorial and image-led.

## Canonical brand asset TODO
See [#11](https://github.com/Znypr/znypr.com/issues/11) for acceptance criteria and checklist.
- Export clean, **transparent high-resolution PNGs**, preferably from editable vector/source artwork, for the wordmark, small Z, X separator, and approved display lockups.
- Store under `assets/brand/v2/` and document dimensions, variants and usage.
- Never use screenshots, AI-generated pseudo-logos, or repeatedly re-created lettering as the final website logo.
- Current prototype image `brush-wordmark.png` was extracted from a *concept reference* and is temporary, not production-ready.

## Review before production
- Compare desktop (1440px), tablet (~820px) and phone (~390px).
- Inspect navigation density, readable text and tap areas.
- Check rounded treatment on video/Shorts, socials overlays/cards, gear hero/product strip, merch and contact.
- Replace imagery with actual approved Znypr photos/videos and source all video targets to individual canonical URLs.
- Ensure glass overlays have readable non-blur fallbacks and adequate contrast.
- Do not deploy to `main` or alter live znypr.com as part of exploration work.
