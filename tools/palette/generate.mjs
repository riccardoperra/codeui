import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { parsePaletteSpec, resolvePalette, toW3CTokens, wcag } from "gosfuig";

const themes = {
	light: {
		"surface.page": ["gray", "100"],
		"surface.island": ["gray", "150"],
		"surface.field": ["gray", "250"],
		"surface.fieldHover": ["gray", "300"],
		"surface.floating": ["gray", "50"],
		"text.default": ["gray", "900"],
		"text.muted": ["gray", "650"],
		"accent.focus": ["blue", "600"],
		"action.brand.base": ["blue", "500"],
	},
	dark: {
		"surface.page": ["gray", "900"],
		"surface.island": ["gray", "950"],
		"surface.field": ["gray", "750"],
		"surface.fieldHover": ["gray", "700"],
		"surface.floating": ["gray", "850"],
		"text.default": ["gray", "150"],
		"text.muted": ["gray", "450"],
		"accent.focus": ["blue", "300"],
		"action.brand.base": ["blue", "500"],
	},
};

const existingSurfaceTokens = {
	"surface.page": "surface-panel",
	"surface.island": "surface-canvas",
	"surface.field": "surface-input",
	"surface.fieldHover": "surface-field-hover",
	"surface.floating": "surface-dialog",
};
const rampLabels = { gray: "Shared greys", blue: "Accent blue" };

const [output = "palette", outputFile] = process.argv.slice(2);
assert(
	["palette", "css", "docs-css", "reference"].includes(output) ||
		Object.hasOwn(themes, output),
	"Usage: pnpm palette:generate [palette|light|dark|css|docs-css|reference] [output-file]",
);

const config = JSON.parse(
	await readFile(new URL("./inkstone.json", import.meta.url), "utf8"),
);
const palette = resolvePalette(parsePaletteSpec(config));
const tokens = toW3CTokens(palette, { prefix: "palette", precision: 6 });

for (const family of palette.families) {
	assert(family.monotone, `Lightness must decrease through ${family.name}`);
}

const colorAt = ([family, step]) => tokens.palette[family][step].$value;
const cssToken = role =>
	`--cui-${existingSurfaceTokens[role] ?? role.replaceAll(".", "-")}`;
const oklch = ({ components }) => `oklch(${components.join(" ")})`;

function checkContrast(context, foreground, background, minimum) {
	const ratio = wcag(foreground, background);
	assert(
		ratio >= minimum,
		`${context}: ${foreground} on ${background} is ${ratio.toFixed(2)}:1 (expected ${minimum}:1)`,
	);
}

function verifyContrast(theme, roles) {
	for (const surface of Object.keys(existingSurfaceTokens)) {
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

function themeAliases(roles) {
	const aliases = {};
	for (const [role, [family, step]] of Object.entries(roles)) {
		const path = role.split(".");
		const key = path.pop();
		const group = path.reduce((parent, name) => (parent[name] ??= {}), aliases);
		group[key] = { $type: "color", $value: `{palette.${family}.${step}}` };
	}
	return aliases;
}

function colourCss(scopes) {
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

function themeCss() {
	return colourCss(
		Object.entries(themes).map(([theme, roles]) => [
			`[data-cui-theme="${theme}"][data-cui-palette="shared-gray"]`,
			Object.fromEntries(
				Object.entries(roles).map(([role, step]) => [cssToken(role), step]),
			),
		]),
	);
}

function docsCss() {
	return colourCss(
		Object.entries(themes).map(([theme, roles]) => {
			const dark = theme === "dark";
			const text = roles["text.default"];
			const link = ["blue", dark ? "300" : "700"];
			const onLink = ["gray", dark ? "950" : "50"];
			for (const surface of Object.keys(existingSurfaceTokens)) {
				checkContrast(
					`Fumadocs ${theme} primary`,
					colorAt(link).hex,
					colorAt(roles[surface]).hex,
					4.5,
				);
			}
			checkContrast(
				`Fumadocs ${theme} primary label`,
				colorAt(onLink).hex,
				colorAt(link).hex,
				4.5,
			);

			return [
				dark ? ":root.dark" : ":root:not(.dark)",
				{
					"--color-fd-background": roles["surface.page"],
					"--color-fd-foreground": text,
					"--color-fd-muted": roles["surface.field"],
					"--color-fd-muted-foreground": roles["text.muted"],
					"--color-fd-popover": roles["surface.floating"],
					"--color-fd-popover-foreground": text,
					"--color-fd-card": roles["surface.island"],
					"--color-fd-card-foreground": text,
					"--color-fd-border": roles["surface.fieldHover"],
					"--color-fd-primary": link,
					"--color-fd-primary-foreground": onLink,
					"--color-fd-secondary": roles["surface.field"],
					"--color-fd-secondary-foreground": text,
					"--color-fd-accent": roles["surface.fieldHover"],
					"--color-fd-accent-foreground": text,
					"--color-fd-ring": roles["accent.focus"],
					"--cui-docs-action-brand-base": roles["action.brand.base"],
					"--cui-docs-action-brand-hover": ["blue", "600"],
					"--cui-docs-action-brand-active": ["blue", "700"],
				},
			];
		}),
	);
}

function paletteReference() {
	const swatch = (family, step) => {
		const color = colorAt([family, step]);
		return { id: `${family}.${step}`, hex: color.hex, oklch: oklch(color) };
	};
	return {
		ramps: palette.families.map(family => ({
			name: family.name,
			label: rampLabels[family.name] ?? family.name,
			swatches: family.swatches.map(step => swatch(family.name, step.name)),
		})),
		roles: Object.keys(themes.light).map(role => ({
			name: role,
			cssToken: cssToken(role),
			light: swatch(...themes.light[role]),
			dark: swatch(...themes.dark[role]),
		})),
	};
}

const json = data => JSON.stringify(data, null, 2);
const exports = {
	palette: () => json(tokens),
	reference: () => json(paletteReference()),
	light: () => json(themeAliases(themes.light)),
	dark: () => json(themeAliases(themes.dark)),
	css: themeCss,
	"docs-css": docsCss,
};
const result = exports[output]() + "\n";

if (outputFile) {
	await mkdir(dirname(outputFile), { recursive: true });
	await writeFile(outputFile, result);
} else {
	process.stdout.write(result);
}
