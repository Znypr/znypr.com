# Znypr design lab · dark directions 04

Status: **exploration**. These four full-page reference dashboards are not an approved production style. Review the [private design lab](https://znypr-design-lab.rockypark2.chatgpt.site/) before applying a direction to znypr.com.

## Source assets and reference

- Actual supplied Znypr wordmark and marks: `logo_2.2_w.png`, `logo_3_w(2).png`, `znypr-logo-white-512(3).png` and related variants.
- Actual supplied portrait and Roblox avatar: `w(1).png`, `avatarpfppurple.png` and Roblox screenshots.
- [ATK Phantom page](https://www.atk.store/en-de/products/atk-blazing-sky-phantom-hollow-carbon-fiber-composite-wireless-gaming-mouse): deliberate page pacing, clear product emphasis and motion reference.
- [Znypr Fourthwall store](https://znypr-shop.fourthwall.com/): restrained store layout reference.

No generated portrait or product artwork is used. The preview's gear text is a component example; add original product photos when adapting a chosen style to production. Do not substitute avatar art for a gear product photo.

## Four distinct dark systems

| Direction | Composition | Typography | Geometry / surface | Image role | Best fit / risk |
| --- | --- | --- | --- | --- | --- |
| **01 Vapor** | Floating glass navigation, split hero, immediate social group and two feature panes | Large clean sans, softer body hierarchy | 22px hero, 13px cards, pill actions; translucent dark surfaces over faint purple and blue depth | Real portrait in one controlled frame | Personal and welcoming; too much glass would hurt clarity |
| **02 Slate** | Flat store-like header, 50/50 hero, numbered content section, fixed product frames | Medium-weight sans, large calm headings | Square sections, 1px dividers, 2–8px controls; matte charcoal without glow | Rectangular portrait and catalog-style visuals | Most restrained for gear and merch; can feel severe if copy is sparse |
| **03 Vector** | Logo rail, gaming-first hero, channel strip, contrasting fitness/merch halves | Heavy compressed-feel display with plain body copy | Mostly straight edges, one 10px cut on primary action, controlled purple | Isolated Roblox avatar on gaming hero | Strongest gaming signature; needs restraint on fitness and contact pages |
| **04 Flux** | Narrow nav, full-bleed portrait hero, chapters, social row and image-led gallery | Very large quiet sans, few labels | Square imagery, subtle rules, minimal overlays | Real portrait and avatar carry the structure | Strongest creator presence; requires good source photography and careful mobile crops |

The previous Index and Journal directions were removed. Light variants are out of scope for this comparison. Every dashboard includes navigation, a homepage hero, immediate social routes, secondary destinations, imagery, gear/merch/contact examples, and a component shelf with headings, buttons, badges, an input, a gear detail, image treatment, corner samples and color swatches.

## Shared content and hierarchy

- The first screen establishes Znypr and leads into direct platform links. Avoid extra "connect" calls to action that merely repeat the links beneath them.
- Use the real logo file. The UI font should support the custom Z, not approximate the wordmark in text.
- Keep body text around 17–21px and controls at least 15–17px. Headline sizes vary by system and must compress on narrow viewports.
- Gaming is purple, fitness blue, merch orange and contact yellow. Use the color as a small directional cue, not an equal four-color wash across every section.
- Product cards need the real product image, exact name, short descriptor, current-use or recommendation state, and a distinct shop/details link. Keep affiliate disclosures beside the relevant gear group.
- Portrait belongs to creator context, avatar to gaming. Crop responsively rather than stretching or replacing assets.
- Every contact action must describe its actual destination. If a form is implemented later, include labels, validation and a successful-submission state; the preview input is only a visual specimen.

## Motion proposals

| Direction | Entrance | Interaction |
| --- | --- | --- |
| Vapor | Opacity and 12px rise over about 450ms | Border/brightness shift and up to 2px lift |
| Slate | Minimal reveal, 250–350ms | Underline or matte fill, about 180ms |
| Vector | Short directional reveal along a cut edge | Immediate state and 180–220ms position/color change |
| Flux | Image reveal as chapter enters, 450–650ms | Restrained underline and opacity shift |

Motion must not hide content until a script runs. Respect `prefers-reduced-motion`; avoid sticky scroll traps, large parallax travel and long loading sequences. The preview demonstrates structure and simple hover treatment, not the final entrance animations.

## Decisions before rollout

1. Choose one of Vapor, Slate, Vector or Flux as the base. Combining all four would remove their clarity.
2. Decide whether the primary logo is the full wordmark or the compact Z at desktop and mobile sizes.
3. Check the selected system with the real gear and merch product photos, long product names, and actual link destinations.
4. Review desktop and phone crops, text contrast and interaction focus states.
5. Choose a final licensed font or a stable system stack after comparing it beside the supplied wordmark. The preview uses browser-safe sans stacks, so font selection remains open.

## Rollout

Keep the design lab separate from the production website. After selecting a direction, translate its tokens and components into one representative znypr.com page, review at desktop and phone sizes, then apply to the remaining pages while preserving functioning links and content. This document remains a draft until a direction is chosen.
