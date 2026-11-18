import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { breakpoints, themeValues, tokens } from "@codeui/inkstone";
import { wcag } from "gosfuig";

const require = createRequire(import.meta.url);
assert.deepEqual(require("@codeui/inkstone"), { breakpoints, themeValues, tokens });

const read = specifier => readFile(new URL(import.meta.resolve(specifier)), "utf8");
const palette = JSON.parse(await readFile(new URL("../tokens/palette.tokens.json", import.meta.url), "utf8")).palette;
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
	assert.deepEqual(values.action.brand.base.$value, palette.blue[500].$value);
	assert.deepEqual(values.surface.canvas.$value, palette.gray[mode === "dark" ? 950 : 150].$value);
	for (const [role, family] of Object.entries({ danger: "red", caution: "orange", success: "green" })) {
		for (const [state, step] of Object.entries({ base: 500, hover: 600, active: 700 })) {
			const fill = values.action[role][state].$value;
			assert.deepEqual(fill, palette[family][step].$value, `${mode} ${role}.${state}`);
			assert(wcag(themeValues.action[role].text, fill.hex) >= 4.5, `${mode} ${role}.${state} label contrast`);
		}
	}
	assert.deepEqual(values.text.danger.$value, palette.red[mode === "dark" ? 300 : 500].$value);
	assert.equal(values.action.brand.base.$value.components.length, 3);
	assert.equal(values.component, undefined);
	assert.equal(values.palette, undefined);
}
const pkg = JSON.parse(await read("@codeui/inkstone/package.json"));
assert.equal(pkg.dependencies, undefined);
assert.equal(pkg.peerDependencies, undefined);
console.log("Verified Inkstone theme CSS, standalone token data, and ESM/CJS exports.");
