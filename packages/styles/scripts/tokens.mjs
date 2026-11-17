import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { load, Resolver } from "@toghen/lib";
import { build } from "esbuild";

const readJson = async file => JSON.parse(await readFile(file, "utf8"));
const cssName = keys =>
	"cui-" +
	keys
		.map(key =>
			key
				.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
				.replaceAll(".", "-")
				.toLowerCase(),
		)
		.join("-");

function encodeValue(value, type, tokenPath) {
	switch (type) {
		case "color": {
			const { components, alpha = 1, hex } = value;
			assert.equal(value.colorSpace, "srgb", tokenPath);
			const bytes = [...components, ...(alpha === 1 ? [] : [alpha])]
				.map(channel =>
					Math.round(channel * 255)
						.toString(16)
						.padStart(2, "0"),
				)
				.join("");
			if (alpha === 1 && hex?.toLowerCase() === "#" + bytes) return hex;
			const pairs = bytes.match(/../g);
			return (
				"#" +
				(!hex && pairs.every(pair => pair[0] === pair[1])
					? pairs.map(pair => pair[0]).join("")
					: bytes)
			);
		}
		case "dimension":
		case "duration":
			return value.value + value.unit;
		case "number":
			return String(value);
		case "fontFamily":
			return value
				.map(font => (/\s/.test(font) ? JSON.stringify(font) : font))
				.join(", ");
		case "cubicBezier":
			return `cubic-bezier(${value.join(", ")})`;
		default:
			throw new Error(`Unsupported CSS token type "${type}" at ${tokenPath}`);
	}
}

function leaves(tree, prefix = []) {
	return Object.entries(tree).flatMap(([key, value]) => {
		const keys = [...prefix, key];
		return typeof value === "string" || typeof value.dark === "string"
			? [[keys, value]]
			: leaves(value, keys);
	});
}

function assign(tree, keys, value) {
	const group = keys.slice(0, -1).reduce((group, key) => (group[key] ??= {}), tree);
	group[keys.at(-1)] = value;
}

async function generateSource(file, code) {
	const source =
		"// Generated from the token resolver by scripts/tokens.mjs.\n" + code + "\n";
	if (
		(await readFile(file, "utf8").catch(error => {
			if (error.code !== "ENOENT") throw error;
		})) !== source
	)
		await writeFile(file, source);
}

export async function generateTheme(root) {
	const dir = path.join(root, "tokens");
	const resolverPath = path.join(dir, "inkstone.resolver.json");
	const { document } = await load(resolverPath, { read: file => readFile(file, "utf8") });
	assert.equal(document.version, "2025.10");
	// Toghen 0.1.1 validates against this spelling. Keep source files interoperable.
	const resolver = new Resolver({
		...document,
		version: "2025-11-01",
	});
	const system = resolver.resolveContextsToDesignSystem();
	const collection = system.getCollection(document.name);
	const values = await readJson(path.join(dir, "web-values.json"));
	const references = {};
	const breakpoints = {};
	const componentAliases = new Map();
	for (const name of collection.getAllPaths()) {
		if (name.startsWith("palette.")) continue;
		const keys = name.split(".");
		if (name.startsWith("component.")) {
			const aliasIn = mode => {
				const raw = collection.getToken(name, `theme=${mode}`).$value;
				const match = /^\{([^{}]+)\}$/.exec(raw);
				assert(match, `Expected a shared token reference for ${name}`);
				system.resolveValue(`${document.name}.${name}`, `theme=${mode}`);
				return match[1];
			};
			const target = aliasIn("light");
			assert.equal(
				aliasIn("dark"),
				target,
				`Theme must not change the reference for ${name}`,
			);
			const cssAlias = cssName(keys);
			assert(!componentAliases.has(cssAlias), `Duplicate component token: ${cssAlias}`);
			componentAliases.set(cssAlias, {
				component: keys[1],
				target: cssName(target.split(".")),
			});
			continue;
		}
		const valueIn = mode => {
			const target = `${document.name}.${name}`;
			const token = collection.getToken(name, `theme=${mode}`);
			if (token.$extensions?.["com.codeui"]?.cssReference) {
				const reference = /^\{([^{}]+)\}$/.exec(token.$value);
				assert(reference, `Runtime CSS token ${name} must reference a single token`);
				system.resolveValue(target, `theme=${mode}`);
				return `var(--${cssName(reference[1].split("."))})`;
			}
			return encodeValue(
				system.resolveValue(target, `theme=${mode}`),
				system.resolveToken(target, `theme=${mode}`).$type,
				name,
			);
		};
		if (keys[0] === "breakpoint") {
			const breakpoint = valueIn("light");
			assert.match(breakpoint, /^\d+px$/);
			assert.equal(
				breakpoint,
				valueIn("dark"),
				"Breakpoints must be shared across themes",
			);
			breakpoints[keys[1]] = Number.parseInt(breakpoint, 10);
			continue;
		}
		const light = valueIn("light");
		const dark = valueIn("dark");
		const scoped = dark !== light || resolver.dependsOn(name).direct.includes("theme");
		const publicKeys = keys[0] === "space" ? [keys[0], keys[1].replace("-", ".")] : keys;
		assign(values, publicKeys, scoped ? { dark, light } : light);
	}
	const entries = leaves(values);
	const names = new Set();
	for (const [keys] of entries) {
		const name = cssName(keys);
		assert(!names.has(name), `Duplicate CSS token: ${name}`);
		names.add(name);
		assign(references, keys, `var(--${name})`);
	}

	for (const { target } of componentAliases.values())
		assert(
			names.has(target),
			`Component alias references an unpublished token: ${target}`,
		);

	const src = path.join(root, "src/foundation");
	const object = data => JSON.stringify(data, null, "\t");
	await Promise.all([
		generateSource(
			path.join(src, "theme-values.ts"),
			`export const themeValues = ${object(values)} as const;`,
		),
		generateSource(
			path.join(src, "cui.css.ts"),
			`type CssRefs<T> = T extends string ? \`var(--\${string})\` : { -readonly [K in keyof T]: CssRefs<T[K]> };\nconst values = ${object(references)} as const;\nexport const tokens: CssRefs<typeof values> = values;`,
		),
		generateSource(
			path.join(src, "breakpoints.ts"),
			`export const breakpoints = ${object(breakpoints)} as const;\nexport type Breakpoint = keyof typeof breakpoints;`,
		),
	]);
	const { outputFiles } = await build({
		entryPoints: [path.join(src, "derived.ts")],
		bundle: true,
		write: false,
		format: "esm",
	});
	const { derivedRadius, derivedColors, relativeColorSupport } = await import(
		"data:text/javascript;base64," +
			Buffer.from(outputFiles[0].contents).toString("base64")
	);
	const assignments = (mode, scopedOnly) => ({
		...Object.fromEntries(
			entries.flatMap(([keys, value]) => {
				if (scopedOnly && typeof value === "string" && !value.includes("var(")) return [];
				return [[`--${cssName(keys)}`, typeof value === "string" ? value : value[mode]]];
			}),
		),
		...derivedRadius(cssName),
	});
	const rootLight = ":root";
	const rootDark = ":root:not([data-cui-theme=light])";
	const lightScope = "[data-cui-theme=light]";
	const darkScope = "[data-cui-theme=dark]";
	const darkScheme = "(prefers-color-scheme: dark)";
	const rule = (selector, vars, mode) =>
		`${selector} {\n${mode ? `  color-scheme: ${mode};\n` : ""}${Object.entries(vars)
			.map(([name, value]) => `  ${name}: ${value};`)
			.join("\n")}\n}`;
	const darkMedia = css => `@media ${darkScheme} {\n${css}\n}`;
	const css = [
		rule(rootLight, assignments("light", false), "light"),
		darkMedia(rule(rootDark, assignments("dark", true), "dark")),
		rule(darkScope, assignments("dark", true), "dark"),
		rule(lightScope, assignments("light", true), "light"),
		`@supports ${relativeColorSupport} {\n${[
			rule(rootLight, derivedColors("light", cssName)),
			darkMedia(rule(rootDark, derivedColors("dark", cssName))),
			rule(darkScope, derivedColors("dark", cssName)),
			rule(lightScope, derivedColors("light", cssName)),
		].join("\n")}\n}`,
	].join("\n");
	const media = Object.entries(breakpoints)
		.filter(([name]) => name !== "xs")
		.map(([name, width]) => `@custom-media --cui-${name} (min-width: ${width}px);`)
		.join("\n");
	return { css: `@layer cui.components {\n${css}\n}\n`, media, componentAliases };
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
	await generateTheme(path.resolve(path.dirname(process.argv[1]), ".."));
}
