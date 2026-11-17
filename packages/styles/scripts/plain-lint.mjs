import { readFile } from "node:fs/promises";
import { build } from "esbuild";
// Read the same token source that generates CSS and the public TS token tree.
export async function lintPlain(root) {
	const result = await build({
		stdin: {
			contents: 'export { themeValues } from "./src/foundation/theme-values"',
			resolveDir: root,
		},
		bundle: true,
		write: false,
		platform: "node",
		format: "esm",
	});
	const { themeValues } = await import(
		"data:text/javascript;base64," +
			Buffer.from(result.outputFiles[0].text).toString("base64")
	);
	const registry = JSON.parse(await readFile(root + "/public-registry.json", "utf8"));
	const variables = new Set();
	const parts = new Set();
	const name = segments =>
		"--cui-" +
		segments
			.map(s =>
				s
					.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
					.replaceAll(".", "-")
					.toLowerCase(),
			)
			.join("-");
	function visit(tree, path = []) {
		for (const [key, value] of Object.entries(tree)) {
			if (typeof value === "string" || ("dark" in value && "light" in value))
				variables.add(name([...path, key]));
			else visit(value, [...path, key]);
		}
	}
	visit(themeValues);
	for (const v of JSON.parse(
		await readFile(root + "/src/plain/component-variables.json", "utf8"),
	))
		variables.add(v);
	for (const component of Object.values(registry))
		if (component.parts) {
			Object.values(component.parts).forEach(p => parts.add("cui-" + p));
			Object.values(component.variables ?? {}).forEach(v => variables.add(v));
		}
	for (const file of ["button", "icon-button", "switch", "dialog"]) {
		const css = await readFile(root + "/src/plain/" + file + ".css", "utf8");
		for (const [, variable] of css.matchAll(/var\((--cui-[\w-]+)/g))
			if (!variables.has(variable))
				throw new Error(`${file}.css: undefined token/component variable ${variable}`);
		for (const [, part] of css.matchAll(/\.((?:cui-)[\w-]+)/g)) {
			// Private aliases are explicitly inventoried, never inferred from spelling.
			const aliases = JSON.parse(
				await readFile(root + "/src/plain/private-classes.json", "utf8"),
			);
			if (!parts.has(part) && !aliases.includes(part))
				throw new Error(`${file}.css: unregistered public part ${part}`);
		}
	}
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
	await lintPlain(new URL("..", import.meta.url).pathname.replace(/\/$/, ""));
	console.log("Plain CSS tokens, component variables and parts are registered.");
}
