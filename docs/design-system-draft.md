# Znypr visual system · draft 01

Status: **exploration, not an approved sitewide specification**. Review the two reference boards before applying these rules to znypr.com.

Private preview: https://znypr-design-lab.rockypark2.chatgpt.site/

## Source of the direction

- Primary supplied mark: `logo_2.2_w.png` (custom angular Z with a curved stroke and clean italic wordmark).
- Supporting supplied variants: `logo_3_w(2).png`, `znypr-logo-white-512(3).png`, `znypr-logo-black-512.png`, and the circular marks.
- Real creator assets: `avatarpfppurple.png`, `Screenshot 2026-08-21 192419(2).png`, `w(1).png`.
- External references: [ATK Phantom product page](https://www.atk.store/en-de/products/atk-blazing-sky-phantom-hollow-carbon-fiber-composite-wireless-gaming-mouse) for deliberate section pacing and product emphasis; [Znypr Fourthwall store](https://znypr-shop.fourthwall.com/) for a simple merchandise destination. These are references, not templates to copy.

The custom Z carries the distinctive shape. The interface should be minimal so the mark, products, avatar, and portrait have space. Use a tapered or diagonal detail sparingly. Do not skew every card or repeat a huge decorative Z behind every section.

## Board 01: black and white foundation

| Element | Draft rule | Why |
| --- | --- | --- |
| Logo | Use the actual supplied wordmark or mark asset | Recreating it with a font loses the custom Z |
| Main heading | System sans, 700–800; desktop up to 64px; mobile 34–44px | Strong but readable, with less oversized copy |
| Section heading | 30–42px | Keeps hierarchy below the brand |
| Body | 16px, line-height about 1.5; 14px minimum for dense cards | Comfortable scan length |
| Eyebrow | 11px uppercase, 0.12–0.16em tracking | A small navigation cue |
| Large panel | 16px radius | Soft field behind sharp logo |
| Card | 12px radius | Repeatable default |
| Button | 8px radius | Clear and compact |
| Edge | 1px low-contrast border | Definition without white outlines |
| Special shape | 2px/18px asymmetric corner or a short diagonal cut | Echoes the Z in one focal component |
| Spacing | 8px base; 16–24px within cards; 48–72px between sections | Lets content breathe without an empty first screen |

The first screen should show the identity and begin the social links. Avoid repeated "watch live" and "watch videos" calls to action when the corresponding platform links are already directly below.

## Board 02: color and depth

| Destination | Draft accent | Use |
| --- | --- | --- |
| Gaming | `#8052E8` purple | Roblox avatar, active navigation, selected button, restrained glow |
| Fitness | `#3E95DD` blue | Training and diet section cues |
| Merch | `#CF7837` orange | Product/store action |
| Contact | `#DEC056` yellow | Business contact action, with dark text for contrast |

Neutral base: `#111827` ink, `#202638` elevated surface, `#F7F7F5` off-white text/background counterpart. Use one accent in each section, not four colors on the same card. Keep long copy on an opaque or nearly opaque panel. Frosted glass is reserved for the navigation, hero, and occasional highlighted group. Use real supplied media only where it adds context; gear and merch retain their actual product imagery.

## Example component behavior

- One primary action per section. Link copy should name the destination or action.
- Social cards should show platform and handle clearly, with optional verified metrics. Missing metrics must not leave a misleading placeholder claim.
- Product cards include the image, product name, short descriptor, offer if relevant, and a distinct shop link. Keep affiliate disclosure near the group.
- Use the portrait for creator context and the Roblox avatar for gaming context. Do not substitute generated portraits or product photos.
- Entrance: opacity and up to 16px vertical movement over 450–650ms, once as content enters view.
- Hover: border/background transition around 180–240ms; button lift no more than 2px.
- Respect `prefers-reduced-motion`. No long loader or animation that hides content until a script completes.

## Decisions still open

1. Which wordmark variant should become the primary website identity: custom `logo_2.2_w` or simpler `logo_3_w`?
2. Should the site remain dark with translucent panels, or use the high-contrast monochrome board as the main interface?
3. Is the 12px card radius the right balance, or should panels be sharper?
4. Confirm accent shades on a phone and against real product photos.
5. Choose the final UI font after comparing legibility with the real wordmark; the preview uses system sans to avoid premature font commitment.

## Rollout rule

The design lab is a separate private preview. This document is a draft reference. After the direction is chosen, translate approved tokens into the production stylesheet, update one representative page, review desktop and mobile, then apply consistently to the remaining pages. Preserve the functioning social, gear, fitness, merch, and contact content.
