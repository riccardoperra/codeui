import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { cp, mkdir, readFile, symlink, writeFile } from "node:fs/promises";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");
const require = createRequire(resolve(root, "packages/kit/package.json"));
const { compile, processVanillaFile } = createRequire(
	require.resolve("@vanilla-extract/vite-plugin"),
)("@vanilla-extract/integration");
const scratch = resolve(root, ".artifacts/styles-contract-source");
await mkdir(scratch, { recursive: true });
await cp(resolve(root, "packages/kit/src"), resolve(scratch, "src"), { recursive: true });
await symlink(
	resolve(root, "packages/kit/node_modules"),
	resolve(scratch, "node_modules"),
).catch(() => {});
for (const name of [
	"Button/Button",
	"IconButton/IconButton",
	"Switch/Switch",
	"Dialog/Dialog",
]) {
	const p = resolve(scratch, `src/components/${name}.css.ts`);
	let s = await readFile(p, "utf8");
	s = s.replace(
		/export const (\w+) = (style|recipe)\(/g,
		(_, n, f) => `export const ${n} = ((rule) => ${f}(rule, "${n}"))(`,
	);
	s = s.replace(
		/export const \[(\w+), (\w+)\] = createTheme\(/g,
		(_, n, v) => `export const [${n}, ${v}] = ((rule) => createTheme(rule, "${n}"))(`,
	);
	await writeFile(p, s);
}
const scopes = new Map();
for (const name of [
	"foundation/themes",
	"icons/icon",
	"components/Button/Button",
	"components/IconButton/IconButton",
	"components/Switch/Switch",
	"components/Dialog/Dialog",
]) {
	const filePath = resolve(scratch, `src/${name}.css.ts`);
	const identOption = ({ debugId, filePath, hash }) =>
		"proto_" +
		filePath.split("/").at(-1).replace(".css.ts", "") +
		"_" +
		(debugId ?? hash);
	const { source } = await compile({ filePath, cwd: root, identOption });
	await processVanillaFile({
		source,
		filePath,
		identOption,
		serializeVirtualCssPath: ({ fileScope, source }) => {
			scopes.set(fileScope.filePath, source);
			return "";
		},
	});
}
await writeFile(
	new URL("original.css", import.meta.url),
	[...scopes.values()].join("\n"),
);
const postcss = createRequire(require.resolve("@vanilla-extract/vite-plugin"))("postcss");
const css = postcss.parse([...scopes.values()].join("\n"));
const map = {
	Button: { button: "button", buttonTheme: "button" },
	IconButton: { iconButton: "icon-button" },
	Switch: {
		root: "switch-root",
		control: "switch-control",
		thumb: "switch-thumb",
		label: "switch-label",
		description: "switch-description",
		errorMessage: "switch-error-message",
	},
	Dialog: {
		dialogTheme: "dialog-panel",
		panel: "dialog-panel",
		overlay: "dialog-overlay",
		positioner: "dialog-positioner",
		title: "dialog-panel-title",
		description: "dialog-description",
		panelContent: "dialog-panel-content",
		panelFooter: "dialog-panel-footer",
		main: "dialog-main",
		sidebar: "dialog-sidebar",
		sidebarSearch: "dialog-sidebar-search",
		nav: "dialog-nav",
		navItem: "dialog-nav-item",
		navIcon: "dialog-nav-icon",
		section: "dialog-section",
		sectionTitle: "dialog-section-title",
		sectionContent: "dialog-section-content",
	},
};
css.walkRules(rule => {
	if (rule.parent.type === "atrule" && /keyframes$/.test(rule.parent.name)) return;
	let selector = rule.selector
		.replace(/\.proto_icon_[\w]+/g, ":is(.cui-icon-button,.cui-dialog-close-button) svg")
		.replace(
			/\.proto_(Button|IconButton|Switch|Dialog)_([\w]+)/g,
			(all, component, key) => {
				if (component === "Dialog" && key === "dialogTheme")
					return ":is(.cui-dialog-panel,.cui-dialog-positioner)";
				if (map[component][key]) return `.cui-${map[component][key]}`;
				const m = key.match(
					/^(button|control|panel|section)_(size|theme|variant|chrome|block|pill|loading)_(\w+)$/,
				);
				if (m) return `.cui-${map[component][m[1]]}[data-${m[2]}="${m[3]}"]`;
				if (key === "button_compound_0")
					return '.cui-button[data-variant="ghost"][data-loading="true"]';
				if (key === "panel_compound_0")
					return '.cui-dialog-panel[data-size="settings"][data-chrome="inset"]';
				return all;
			},
		);
	// Keep pseudo-elements outside :where; current sources contain only before/after here.
	rule.selector = selector
		.split(",\n")
		.map(s => {
			const pseudo = s.match(/::(before|after)$/);
			return `:where(${pseudo ? s.slice(0, -pseudo[0].length) : s})${pseudo?.[0] ?? ""}`;
		})
		.join(",\n");
});
// Button defaults are size md only; theme intentionally has no source default.
const defaults = [];
css.walkRules(r => {
	if (r.selector === ':where(.cui-button[data-size="md"])') {
		const copy = r.clone();
		copy.selector = ":where(.cui-button:not([data-size]))";
		defaults.push(copy);
	}
});
const defaultLayer = postcss.atRule({ name: "layer", params: "cui" });
defaultLayer.append(defaults);
css.append(defaultLayer);
// Shared Button contract applies to icon-button; modifier goes last, in the same layer.
css.walkRules(r => {
	r.selector = r.selector.replace(
		/\.cui-button(?=[\[:)\s])/g,
		":is(.cui-button,.cui-icon-button,.cui-dialog-close-button)",
	);
});
css.append(
	postcss.parse(
		"@layer cui { :where(.cui-icon-button,.cui-dialog-close-button) {padding:0; width:var(--proto_Button_buttonHeight);height:var(--proto_Button_buttonHeight);} }",
	).nodes,
);
css.walkAtRules("layer", a => {
	if (a.params === "cui" && a.nodes)
		a.params = a.nodes.some(n => n.type === "rule" && n.selector.includes(":root"))
			? "cui.tokens"
			: "cui.components";
});
css.prepend(
	postcss.parse("@layer cui; @layer cui.tokens, cui.base, cui.components;").nodes,
);
await writeFile(new URL("contract.css", import.meta.url), css.toString());
