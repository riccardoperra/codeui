# Avatar

A person shows as a circle: their picture, or one or two initials on a hue derived from a stable id. The name is the accessible name (`role="img"`) and shows in the kit Tooltip on hover. Sizes follow the shared control scale and density; an unassigned owner is a dashed empty circle.

## Sub-features

- `avatar-initials`: initials reach 4.5:1 against the fill on every hue in both themes; hues differ by id, and the same name with different ids gets different hues; neutral fill without an id.
- `avatar-ring`: full radius and a 1px inset ring at 20% of `--cui-text-default` (§2.5 neutral, 16–35% alpha).
- `avatar-sizes`: `xs`, `sm`, `md`, `lg` equal `--cui-control-height-*` at compact, comfortable and touch density.
- `avatar-unassigned`: dashed border in `--cui-text-muted`, no fill, no children, named "Unassigned".
- `avatar-picture`: the picture covers the circle; a failed picture falls back to initials (`designsystem-avatar--states`).
- `avatar-tooltip`: hovering shows the name in `[data-cui=tooltip-content]`.

## How to get to it (user POV)

- `designsystem-avatar--initials`: eight people, three "Sam Lee" with different ids, one guest without an id.
- `designsystem-avatar--sizes`: every size at compact, comfortable and touch density, with initials, picture and unassigned.
- `designsystem-avatar--states`: picture, failed picture, unassigned.

## Driving it with drive.mjs

- `node .claude/skills/verify-codeui/scripts/drive.mjs designsystem-avatar--initials --journey .claude/skills/verify-codeui/journeys/avatar.mjs` checks contrast per avatar by painting the computed fill into a canvas (Chrome reports OKLCH), hue difference, the ring alpha, and the tooltip on hover.
- `node .claude/skills/verify-codeui/scripts/drive.mjs designsystem-avatar--sizes --journey .claude/skills/verify-codeui/journeys/avatar-sizes.mjs` checks heights against the size table, the unassigned border, and that the picture covers the circle.

## Gotchas

- `getComputedStyle().backgroundColor` returns `oklch(...)`; convert through a canvas before computing contrast.
- The avatar is not focusable, so its tooltip opens on hover only. Keyboard users get the name from the accessible name.
- The failed-picture state needs a request that 404s; the static Storybook server answers `/missing-avatar.png` with 404.
