import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { breakpoints, themeValues, tokens } from "@codeui/inkstone";

const require = createRequire(import.meta.url);
assert.deepEqual(require("@codeui/inkstone"), { breakpoints, themeValues, tokens });

const read = specifier => readFile(new URL(import.meta.resolve(specifier)), "utf8");
const theme = await read("@codeui/inkstone/theme.css");
assert(theme.startsWith(await read("@codeui/inkstone/layers.css")));
assert.match(theme, /:root\s*\{/);
assert.match(theme, /\[data-cui-theme=dark\]/);
assert.match(theme, /--cui-action-brand-base:/);
assert.doesNotMatch(theme, /\.cui-|--cui-component-/);

for (const mode of ["light", "dark"]) {
	const values = JSON.parse(await read(`@codeui/inkstone/${mode}.json`));
	assert.equal(values.breakpoint.md.$value.value, breakpoints.md);
	assert.equal(values.action.brand.base.$type, "color");
	assert.equal(values.action.brand.base.$value.components.length, 3);
	assert.equal(values.component, undefined);
	assert.equal(values.palette, undefined);
}
const pkg = JSON.parse(await read("@codeui/inkstone/package.json"));
assert.equal(pkg.dependencies, undefined);
assert.equal(pkg.peerDependencies, undefined);
console.log("Verified Inkstone theme CSS, standalone token data, and ESM/CJS exports.");
