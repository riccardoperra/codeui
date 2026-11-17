import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parsePaletteSpec, resolvePalette, toW3CTokens, wcag } from "gosfuig";

const rolePaths = {
	"surface.page": "surface.panel",
	"surface.island": "surface.canvas",
	"surface.field": "surface.input",
	"surface.fieldHover": "surface.fieldHover",
	"surface.floating": "surface.dialog",
	"text.default": "text.default",
	"text.muted": "text.muted",
	"accent.focus": "accent.focus",
	"action.brand.base": "action.brand.base",
	"action.danger.base": "action.danger.base",
	"action.danger.hover": "action.danger.hover",
	"action.danger.active": "action.danger.active",
	"action.caution.base": "action.caution.base",
	"action.caution.hover": "action.caution.hover",
	"action.caution.active": "action.caution.active",
	"action.success.base": "action.success.base",
	"action.success.hover": "action.success.hover",
	"action.success.active": "action.success.active",
	"text.danger": "text.danger",
};

const readTokenFile = async file =>
	JSON.parse(await readFile(new URL(`../tokens/${file}`, import.meta.url), "utf8"));
const [foundation, dark, config] = await Promise.all([
	readTokenFile("foundation.tokens.json"),
	readTokenFile("dark.tokens.json"),
	readTokenFile("inkstone.palette.json"),
]);
const valueAt = (tree, path) => path.split(".").reduce((value, key) => value?.[key], tree);
export const themes = Object.fromEntries(
	Object.entries({ light: foundation, dark }).map(([mode, source]) => [
		mode,
		Object.fromEntries(
			Object.entries(rolePaths).map(([role, path]) => {
				const value = (valueAt(source, path) ?? valueAt(foundation, path)).$value;
				const ref = /^\{palette\.(\w+)\.(\w+)\}$/.exec(value);
				assert(ref, `Expected a palette alias for ${mode} ${path}`);
				return [role, ref.slice(1)];
			}),
		),
	]),
);

export const surfaceRoles = Object.keys(rolePaths).filter(role => role.startsWith("surface."));
const rampLabels = {
	gray: "Shared greys",
	blue: "Accent blue",
	red: "Danger red",
	orange: "Caution orange",
	green: "Success green",
};

const palette = resolvePalette(parsePaletteSpec(config));
export const tokens = toW3CTokens(palette, { prefix: "palette", precision: 6 });
tokens.palette.wash = {
	$type: "color",
	...Object.fromEntries(["500", "700"].map(step => [
		step,
		{ $value: { ...tokens.palette.blue[step].$value, alpha: 38 / 255 } },
	])),
};

for (const family of palette.families) {
	assert(family.monotone, `Lightness must decrease through ${family.name}`);
}

export const colorAt = ([family, step]) => tokens.palette[family][step].$value;
const cssToken = path =>
	`--cui-${path.replaceAll(".", "-").replace(/([A-Z])/g, "-$1").toLowerCase()}`;
const oklch = ({ components }) => `oklch(${components.join(" ")})`;

export function checkContrast(context, foreground, background, minimum) {
	const ratio = wcag(foreground, background);
	assert(
		ratio >= minimum,
		`${context}: ${foreground} on ${background} is ${ratio.toFixed(2)}:1 (expected ${minimum}:1)`,
	);
}

function verifyContrast(theme, roles) {
	for (const surface of surfaceRoles) {
		const background = colorAt(roles[surface]).hex;
		checkContrast(theme, colorAt(roles["text.default"]).hex, background, 4.5);
		checkContrast(theme, colorAt(roles["text.muted"]).hex, background, 4.5);
		checkContrast(theme, colorAt(roles["accent.focus"]).hex, background, 3);
	}

	const action = colorAt(roles["action.brand.base"]).hex;
	checkContrast(theme, "#ffffff", action, 4.5);
	checkContrast(theme, action, colorAt(roles["surface.floating"]).hex, 3);
}

for (const [theme, roles] of Object.entries(themes)) {
	verifyContrast(theme, roles);
}

export function themeAliases(roles) {
	const aliases = {};
	for (const [role, [family, step]] of Object.entries(roles)) {
		const path = role.split(".");
		const key = path.pop();
		const group = path.reduce((parent, name) => (parent[name] ??= {}), aliases);
		group[key] = { $type: "color", $value: `{palette.${family}.${step}}` };
	}
	return aliases;
}

export function colourCss(scopes) {
	const rules = formatColor =>
		scopes.map(([selector, variables]) => {
			const declarations = Object.entries(variables).map(
				([name, step]) => `  ${name}: ${formatColor(colorAt(step))};`,
			);
			return [`${selector} {`, ...declarations, "}"].join("\n");
		});

	const srgb = rules(({ hex }) => hex);
	return [
		...srgb,
		"@supports (color: oklch(0.5 0 0)) {",
		...rules(oklch).flatMap(rule => rule.split("\n").map(line => "  " + line)),
		"}",
	].join("\n");
}

function tokenLeaves(tree, prefix = []) {
	return Object.entries(tree).flatMap(([key, value]) => {
		if (!value || typeof value !== "object" || key.startsWith("$")) return [];
		const path = [...prefix, key];
		return Object.hasOwn(value, "$value") ? [[path.join("."), value.$value]] : tokenLeaves(value, path);
	});
}

function rampUsage(leaves) {
	const usage = new Map();
	for (const [path, value] of leaves) {
		if (typeof value !== "string") continue;
		const ref = /^\{palette\.(\w+\.\w+)\}$/.exec(value);
		if (!ref) continue;
		const step = ref[1];
		const aliases = usage.get(step) ?? [];
		aliases.push(cssToken(path));
		usage.set(step, aliases);
	}
	return usage;
}

export function paletteReference() {
	const light = tokenLeaves(foundation);
	const lightUsage = rampUsage(light);
	const darkUsage = rampUsage(new Map([...light, ...tokenLeaves(dark)]));
	const swatch = (family, step) => {
		const color = colorAt([family, step]);
		return { id: `${family}.${step}`, hex: color.hex, oklch: oklch(color) };
	};
	return {
		ramps: palette.families.map(family => ({
			name: family.name,
			label: rampLabels[family.name] ?? family.name,
			swatches: family.swatches.map(step => {
				const colour = swatch(family.name, step.name);
				return {
					...colour,
					aliases: { light: lightUsage.get(colour.id) ?? [], dark: darkUsage.get(colour.id) ?? [] },
				};
			}),
		})),
		roles: Object.keys(themes.light).map(role => ({
			name: role,
			cssToken: cssToken(rolePaths[role]),
			light: swatch(...themes.light[role]),
			dark: swatch(...themes.dark[role]),
		})),
	};
}
