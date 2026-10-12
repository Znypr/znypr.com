# Znypr visual system · directions 03

Status: **exploration, not an approved sitewide specification**. Compare the two foundation boards and four distinct design directions before applying these rules to znypr.com.

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
| Main heading | System sans, 700–800; desktop 64–72px; mobile 38–48px | Strong, legible display without filling the viewport |
| Section heading | 34–50px | Clear hierarchy with larger type |
| Body | 17–19px, line-height about 1.5; 16px minimum in cards | User prefers comfortable, larger text |
| Eyebrow | 12px uppercase, 0.12–0.16em tracking | Small navigation cue, still readable |
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

## Boards 03–06: distinct design directions

These are alternative page compositions, not color variants. The same creator content is deliberately expressed through different typography, structure, shape, and visual rhythm. All are mockups for comparison.

| Board | Design language | Layout and type | Surface and motion | Tradeoff |
| --- | --- | --- | --- | --- |
| 03 / Lumen | Personal light glass | Plainspoken large sans headline, split hero with real portrait, four direct social tiles | Cool daylight gradient, translucent white panels, soft corners and quiet fades | Most approachable; less distinctive if applied without the real brand assets |
| 04 / Journal | Creator editorial | Oversized serif headline, portrait column, underlined two-column social index | Warm paper, thin rules, nearly square edges and image reveal | Strongest personal story; may be less natural for dense gear specifications |
| 05 / Index | Graphic utility | Heavy sans display, numbered directory and strict asymmetrical grid | Black and white, 2px dividers, square panels and immediate fills | Fastest scanning; most severe and least atmospheric |
| 06 / Velocity | Gaming energy | Compressed italic headline, Roblox avatar, three large horizontal channel routes | Pale violet field, one blade cut, dark utility strip and short directional movement | Strong gaming character; can overpower fitness and merch without restrained section treatment |

**Type comparison matters.** Board 01 remains a neutral foundation study, but no universal UI font is approved. Lumen uses a friendly sans, Journal pairs serif display with sans utility text, Index uses an assertive sans, and Velocity uses compressed italic display type with plain body text. We should judge the designs on desktop and phone, then choose actual font files or a proven web-safe stack.

**Color comparison remains separate.** Board 02 maps purple to gaming, blue to fitness, orange to merch, and yellow to contact. The four directions show possible base treatments; the final accent mapping can be applied after a direction is chosen. Avoid treating every concept's mockup color as a new brand rule.

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
2. Which direction is strongest: Lumen, Journal, Index, or Velocity? Board 01 tests basic geometry, and Board 02 tests accent mapping separately.
3. Is the 12px card radius the right balance, or should panels be sharper?
4. Confirm accent shades and glass contrast on a phone and against real product photos.
5. Choose the final UI font and licensed font files after comparing the four distinct type treatments beside the real wordmark.

## Rollout rule

The design lab is a separate private preview. This document is a draft reference. After the direction is chosen, translate approved tokens into the production stylesheet, update one representative page, review desktop and mobile, then apply consistently to the remaining pages. Preserve the functioning social, gear, fitness, merch, and contact content.
