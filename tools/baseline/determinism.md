# Capture determinism

K0c makes the baseline reliable enough for CodeImage and other Solid apps to use it as a visual regression gate.

The capture record contains the page ID, page type, theme, two SHA-256 hashes, and the body background measured before each screenshot. Both independent contexts must render successfully, produce equal hashes, and match the requested theme. `run.mjs` also validates those records.

The preview initializes stories as dark. Previously, the harness changed the HTML theme after the docs shell appeared, without synchronizing the docs theme store or channel subscribers. The harness now initializes the docs store before navigation, waits for inline story render phases to finish, emits `DARK_MODE`, keeps the requested HTML theme consistent across late mounts with a per-context observer, and checks the HTML attribute, body color, and docs wrapper color. It waits for fonts, image decoding, and docs network idle instead of a 300 ms delay.

A separate Link docs probe isolated unequal hashes to one edge pixel on a native radio control. Its body and docs backgrounds matched. Six fresh-context captures matched after disabling GPU rendering and Skia runtime optimizations. A full pass then isolated one remaining Popover docs difference to a horizontal rounded-control edge. The browser also waits for all compositor stages before drawing and disables partial rasterization. These are rendering controls described in [Chromium’s flag reference](https://github.com/GoogleChrome/chrome-launcher/blob/main/docs/chrome-flags-for-tools.md?plain=1). Exact hash comparison remains enabled. Remote font stylesheets still receive empty CSS, so captures use the local font fallback.

The HTTP server binds port zero by default. The OS reserves a free port for the lifetime of the server. Its URL goes to all browser subprocesses through `BASELINE_URL`. `BASELINE_PORT` selects an explicit port and reports bind errors.

## Verification

Three original screenshot passes used one immutable static build. They compared 282 page/theme pairs twice per pass. There were 51 changing pairs across the six captures, including 26 story pairs and 25 docs pairs. Thirty-two individual light captures had a measured dark body background, across 27 distinct page/theme pairs. [The complete failing-pair list and measured colors](determinism-before.json) retain the evidence.

The three corrected screenshot steps have identical hashes for all 244 story/theme pairs. All 282 pairs match within each run, with 564 correct body-color samples per run. The 1,692 captures have no measured theme mismatches. [The three-run manifests and separate docs results](determinism-after.json) retain the comparison.

Docs are reported separately. Thirty-two of 38 docs/theme hashes match across the three rebuilds. DropdownMenu, Pagination, and Select differ across runs in both themes, although each run's two captures match. Focused captures against two frozen builds match, so a build-generation cause has not been established. This is a remaining limit of exact docs comparison across complete runs.

Full baseline runs still exit nonzero for the pre-existing filtered pack command, direct package imports, and accessibility findings. The compatible pack fallback, build, unit tests, typecheck, screenshot self-check, and CSS layer check pass. No library source or changeset is included.
