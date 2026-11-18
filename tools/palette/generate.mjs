import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import {
	checkContrast,
	colorAt,
	colourCss,
	paletteReference,
	surfaceRoles,
	themeAliases,
	themes,
	tokens,
} from "../../packages/inkstone/scripts/palette.mjs";

const [output = "palette", outputFile] = process.argv.slice(2);
assert(
	["palette", "docs-css", "reference"].includes(output) ||
		Object.hasOwn(themes, output),
	"Usage: pnpm palette:generate [palette|light|dark|docs-css|reference] [output-file]",
);

function docsCss() {
	return colourCss(
		Object.entries(themes).map(([theme, roles]) => {
			const dark = theme === "dark";
			const text = roles["text.default"];
			const link = ["blue", dark ? "300" : "700"];
			const onLink = ["gray", dark ? "950" : "50"];
			for (const surface of surfaceRoles) {
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

const json = data => JSON.stringify(data, null, 2);
const exports = {
	palette: () => json(tokens),
	reference: () => json(paletteReference()),
	light: () => json(themeAliases(themes.light)),
	dark: () => json(themeAliases(themes.dark)),
	"docs-css": docsCss,
};
const result = exports[output]() + "\n";

if (outputFile) {
	await mkdir(dirname(outputFile), { recursive: true });
	await writeFile(outputFile, result);
} else {
	process.stdout.write(result);
}
