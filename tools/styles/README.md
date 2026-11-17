# Verify published styles

Build the packages and run `node examples/run-consumer-check.mjs --keep` from the repository root. The command prints its temporary artifact directory. The command checks server portal content and adoption of those same nodes during browser hydration.

Install these isolated bundler tools with `npm ci --prefix tools/styles --ignore-scripts --no-audit --no-fund`. Then run `node tools/styles/bundle-check.mjs <consumer-artifacts>/css [report.json]`.

The checker builds actual installed CSS exports on Vite and webpack. It checks CSS-only imports and Solid component imports without manual CSS. Both paths verify unused imports, selective Button CSS, unrelated-component exclusion and lazy Dialog CSS splitting. The retained consumer directory must contain both css and vite fixtures. It removes its temporary build files after the check.

Run `node tools/styles/parity.mjs <built-fixture> <output> [reference-output]` to capture both themes, three viewport sizes and Switch off/on states. The fixture must contain Vite, Playwright and the consumer App with its named Switch. The comparison includes computed styles, pseudo-elements and exact PNG hashes. Build identical App source against each package version. `CODEUI_PLAYWRIGHT` can select a separately installed Playwright entry. `CODEUI_PARITY_MUTATION=1` injects a deliberate opacity regression to verify that the comparison fails.

Run `node tools/styles/hydration.mjs <consumer-artifacts>/vite` to repeat the packed server-page adoption check in Chromium, Firefox and WebKit. The consumer runner writes the required `dist/ssr.html` with server markup and the browser bundle.
