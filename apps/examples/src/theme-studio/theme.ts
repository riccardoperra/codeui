import { colorToken, composite, contrast, hexOf, parseColor, type Rgba, toHex } from "./color";

/**
 * A CodeImage theme, as `createTheme` and `defineEditorTheme` take it in `@codeimage/highlight`.
 * The nested shape is what the app exports and imports. Inside the app the colours are one flat
 * map, so a row, the picker and the command menu all address a colour by one key.
 */
export const requiredHighlight = ["base", "keywords", "strings", "comments", "numbers", "regexp", "tag", "variableName", "delimiters"] as const;
export const optionalHighlight = ["background", "function", "variableNameSpecial", "boolean", "quote", "meta", "punctuation", "paren", "brackets", "moduleKeyword", "propertyName", "annotation", "attrName", "attrValue", "className", "operators", "self", "typeName", "atom"] as const;
export const highlightKeys = [...requiredHighlight, ...optionalHighlight];
export type HighlightKey = (typeof highlightKeys)[number];

/** The groups of the nested shape, in the order the export writes them. */
const shape = {
	terminal: ["main", "text", "accent"],
	tabs: ["background", "activeTabBackground", "inactiveTabBackground", "textColor"],
	selection: ["backgroundColor", "color", "activeLine"],
	cursor: ["color"],
	lineNumbers: ["color"],
	autocomplete: ["background", "border", "selectedBackground", "selectedColor"],
	highlight: highlightKeys,
} as const;
type Shape = typeof shape;
export type ColorKey = { [G in keyof Shape]: `${G}.${Shape[G][number]}` }[keyof Shape];
/** A colour row's key: a colour of the map, or one stop of the preview background. */
export type SlotKey = ColorKey | `previewBackground.${number}`;

export const colorKeys = Object.entries(shape).flatMap(([group, keys]) => keys.map(key => `${group}.${key}` as ColorKey));
const required: ColorKey[] = ["terminal.main", "terminal.text", "autocomplete.background", "autocomplete.selectedBackground", ...requiredHighlight.map(key => `highlight.${key}` as ColorKey)];

export type Theme = {
	id: string;
	label: string;
	darkMode: boolean;
	/** Any CSS background: CodeImage paints it behind the theme card and uses it as the frame's default. */
	previewBackground: string;
	colors: Partial<Record<ColorKey, string>>;
};

export const sameTheme = (a: Theme, b: Theme) => a.id === b.id && a.label === b.label && a.darkMode === b.darkMode && a.previewBackground === b.previewBackground && colorKeys.every(key => a.colors[key] === b.colors[key]);

/* Fallbacks */

/**
 * What an unset colour falls back to, as in CodeImage's `styledHighlight` and `defineEditorTheme`:
 * the first key of the list that is set. The last key of a list is always a required one.
 */
const inherits: Partial<Record<ColorKey, ColorKey[]>> = {
	"highlight.background": ["terminal.main"],
	"highlight.function": ["highlight.base"],
	"highlight.variableNameSpecial": ["highlight.base"],
	"highlight.boolean": ["highlight.strings"],
	"highlight.quote": ["highlight.base"],
	"highlight.meta": ["highlight.keywords"],
	"highlight.punctuation": ["highlight.delimiters"],
	// `paren ?? punctuation`: with neither set, the rule has no colour and the text keeps the base.
	"highlight.paren": ["highlight.punctuation", "highlight.base"],
	"highlight.brackets": ["highlight.delimiters"],
	"highlight.moduleKeyword": ["highlight.keywords"],
	"highlight.propertyName": ["highlight.base"],
	"highlight.annotation": ["highlight.keywords"],
	"highlight.attrName": ["highlight.base"],
	"highlight.attrValue": ["highlight.strings"],
	"highlight.className": ["highlight.function", "highlight.base"],
	"highlight.operators": ["highlight.delimiters"],
	"highlight.self": ["highlight.keywords"],
	"highlight.typeName": ["highlight.keywords"],
	"highlight.atom": ["highlight.base"],
	"terminal.accent": ["terminal.text"],
	"tabs.textColor": ["terminal.text"],
	"tabs.activeTabBackground": ["terminal.main"],
	"selection.color": ["highlight.base"],
	"autocomplete.selectedColor": ["highlight.base"],
};

/** The key whose colour `key` shows: itself when set, else the first set key it inherits. */
export function sourceOf(theme: Theme, key: ColorKey): ColorKey {
	if (theme.colors[key] !== undefined) return key;
	const chain = inherits[key];
	return chain ? (chain.find(next => theme.colors[next] !== undefined) ?? chain.at(-1)!) : key;
}

const mix = (a: Rgba, b: Rgba, amount: number): Rgba => ({ r: a.r + (b.r - a.r) * amount, g: a.g + (b.g - a.g) * amount, b: a.b + (b.b - a.b) * amount, a: 1 });

/** The colours that have no key to inherit: CodeImage's and CodeMirror's own defaults. */
const defaults: Partial<Record<ColorKey, { hint: string; value: (theme: Theme) => string }>> = {
	"cursor.color": { hint: "default", value: theme => (theme.darkMode ? "#ffffff" : "#000000") },
	// CodeImage sets no gutter colour then, and CodeMirror's base theme shows through.
	"lineNumbers.color": { hint: "CodeMirror default", value: () => "#6c6c6c" },
	// `${highlight.keywords}50` upstream.
	"selection.backgroundColor": { hint: "keywords at 31%", value: theme => toHex({ ...(parseColor(theme.colors["highlight.keywords"]) ?? { r: 0, g: 0, b: 0 }), a: 0x50 / 255 }) },
	"selection.activeLine": { hint: "none", value: () => "transparent" },
	"autocomplete.border": { hint: "none", value: () => "transparent" },
	"tabs.background": { hint: "none", value: () => "transparent" },
	// CodeImage shades the window for an inactive tab; this is the same idea, not its exact value.
	"tabs.inactiveTabBackground": {
		hint: "default",
		value: theme => {
			const main = parseColor(theme.colors["terminal.main"]);
			const text = parseColor(theme.colors["terminal.text"]);
			return main && text ? toHex(mix(main, text, 0.1)) : "transparent";
		},
	},
};

/** The colour a key shows, fallbacks applied. Always a CSS colour; `transparent` for "none". */
export function resolve(theme: Theme, key: ColorKey): string {
	const source = sourceOf(theme, key);
	return theme.colors[source] ?? defaults[source]?.value(theme) ?? "transparent";
}

/** Where an unset colour comes from, for the row: `inherits keywords`, `default`, `none`. */
export function fallbackHint(theme: Theme, key: ColorKey) {
	const source = sourceOf(theme, key);
	if (source !== key) return `inherits ${slot(source).label.toLowerCase()}`;
	return defaults[key]?.hint ?? "none";
}

/* Slots: the colour rows */

export type SectionId = "theme" | "window" | "syntax" | "editor";
export type Slot = {
	key: ColorKey;
	label: string;
	section: Exclude<SectionId, "theme">;
	group: string;
	optional: boolean;
	/** The fills CodeImage paints over the code, where a translucent colour is the norm. */
	alpha?: boolean;
};

const define = (section: Slot["section"], group: string, rows: [ColorKey, string, boolean?][]): Slot[] => rows.map(([key, label, alpha]) => ({ key, label, section, group, optional: !required.includes(key), alpha }));

export const slots: Slot[] = [
	...define("window", "Window", [
		["terminal.main", "Window"],
		["terminal.text", "Title text"],
		["terminal.accent", "Accent"],
	]),
	...define("window", "Tabs", [
		["tabs.background", "Tab bar"],
		["tabs.activeTabBackground", "Active tab"],
		["tabs.inactiveTabBackground", "Inactive tab"],
		["tabs.textColor", "Tab text"],
	]),
	...define("syntax", "Required", [
		["highlight.base", "Text"],
		["highlight.keywords", "Keywords"],
		["highlight.strings", "Strings"],
		["highlight.comments", "Comments"],
		["highlight.numbers", "Numbers"],
		["highlight.regexp", "Regex"],
		["highlight.tag", "Tags"],
		["highlight.variableName", "Variables"],
		["highlight.delimiters", "Delimiters"],
	]),
	...define("syntax", "Names", [
		["highlight.function", "Functions"],
		["highlight.className", "Classes"],
		["highlight.typeName", "Types"],
		["highlight.propertyName", "Properties"],
		["highlight.variableNameSpecial", "Special variables"],
		["highlight.self", "Self"],
		["highlight.attrName", "Attribute names"],
		["highlight.attrValue", "Attribute values"],
	]),
	...define("syntax", "Keywords and literals", [
		["highlight.moduleKeyword", "Module keywords"],
		["highlight.boolean", "Booleans"],
		["highlight.atom", "Atoms"],
		["highlight.annotation", "Annotations"],
		["highlight.meta", "Meta"],
		["highlight.quote", "Quotes"],
	]),
	...define("syntax", "Punctuation", [
		["highlight.operators", "Operators"],
		["highlight.punctuation", "Punctuation"],
		["highlight.paren", "Parentheses"],
		["highlight.brackets", "Brackets"],
	]),
	...define("editor", "Selection", [
		["selection.backgroundColor", "Selection", true],
		["selection.activeLine", "Active line", true],
	]),
	...define("editor", "Caret and gutter", [
		["cursor.color", "Cursor"],
		["lineNumbers.color", "Line numbers"],
	]),
	...define("editor", "Autocomplete", [
		["autocomplete.background", "Popup"],
		["autocomplete.border", "Popup border"],
		["autocomplete.selectedBackground", "Selected item", true],
		["autocomplete.selectedColor", "Selected text"],
	]),
];

// Two colours of the format have no row. CodeImage reads neither `selection.color` nor
// `highlight.background`, so a control for them would do nothing. They are kept and exported.
const hidden: Slot[] = [
	{ key: "selection.color", label: "Selection text", section: "editor", group: "Selection", optional: true },
	{ key: "highlight.background", label: "Background", section: "syntax", group: "Required", optional: true },
];

const slotByKey = new Map([...slots, ...hidden].map(item => [item.key, item]));
export const slot = (key: ColorKey) => slotByKey.get(key)!;

/* The preview background */

export type Backdrop = { gradient: boolean; angle: number | null; stops: string[] };

/** The colours of a preview background, in order. A plain colour is one stop. */
export function readBackdrop(value: string): Backdrop {
	const angle = /(-?[\d.]+)deg/.exec(value);
	return { gradient: /gradient\(/.test(value), angle: angle ? Number(angle[1]) : null, stops: value.match(colorToken) ?? [] };
}

/** The same background with one stop replaced. Everything else in the string stays as written. */
function withStop(value: string, index: number, color: string) {
	let at = -1;
	return value.replace(colorToken, found => (++at === index ? color : found));
}

export const withAngle = (value: string, angle: number) => value.replace(/-?[\d.]+deg/, `${angle}deg`);

export const gradientOf = (from: string, to: string, angle = 135) => `linear-gradient(${angle}deg, ${from} 0%, ${to} 100%)`;

const stopIndex = (key: SlotKey) => (key.startsWith("previewBackground.") ? Number(key.split(".")[1]) : -1);

export const slotLabel = (key: SlotKey) => (stopIndex(key) < 0 ? slot(key as ColorKey).label : `Backdrop stop ${stopIndex(key) + 1}`);
export const slotAlpha = (key: SlotKey) => stopIndex(key) < 0 && !!slot(key as ColorKey).alpha;

/** The colour a row shows, set or inherited. */
export function slotColor(theme: Theme, key: SlotKey): string {
	const stop = stopIndex(key);
	return stop < 0 ? resolve(theme, key as ColorKey) : (readBackdrop(theme.previewBackground).stops[stop] ?? "transparent");
}

/** A copy of the theme with one colour set, or cleared back to its fallback with `undefined`. */
export function withSlot(theme: Theme, key: SlotKey, value: string | undefined): Theme {
	const stop = stopIndex(key);
	if (stop >= 0) return value === undefined ? theme : { ...theme, previewBackground: withStop(theme.previewBackground, stop, value) };
	const colors = { ...theme.colors, [key]: value };
	if (value === undefined) delete colors[key as ColorKey];
	// `highlight.background` repeats the window colour in the themes that set it, so the two move together.
	if (key === "terminal.main" && value !== undefined && theme.colors["highlight.background"] === theme.colors["terminal.main"]) colors["highlight.background"] = value;
	return { ...theme, colors };
}

/* Contrast */

export type Contrast = { ratio: number; minimum: number; of: string; on: string };

/**
 * The WCAG contrast that matters for a colour. A text colour is measured on the fill it is drawn
 * on; a fill is measured against the text drawn on it. `null` for a colour that carries no text.
 */
export function contrastOf(theme: Theme, key: SlotKey): Contrast | null {
	if (stopIndex(key) >= 0 || key === "autocomplete.border") return null;
	const color = (name: ColorKey) => parseColor(resolve(theme, name));
	const main = color("terminal.main");
	if (!main) return null;
	/** A fill painted over the window, or the window itself when the fill is "none". */
	const over = (name: ColorKey, under: Rgba = main) => {
		const fill = color(name);
		return fill ? composite(fill, under) : under;
	};
	const measure = (text: ColorKey, background: Rgba, on: string, minimum = 4.5): Contrast | null => {
		const foreground = color(text);
		return foreground ? { ratio: contrast(foreground, background), minimum, of: slot(text).label.toLowerCase(), on } : null;
	};
	const popup = over("autocomplete.background");
	const [group] = key.split(".");
	switch (key) {
		case "terminal.main":
			return measure("highlight.base", main, "the window");
		case "terminal.text":
			return measure(key, over("tabs.background"), "the title bar");
		case "terminal.accent":
			return measure(key, main, "the window", 3);
		case "tabs.textColor":
			return measure(key, over("tabs.activeTabBackground", over("tabs.background")), "the active tab");
		case "tabs.background":
			return measure("terminal.text", over(key), "the tab bar");
		case "tabs.activeTabBackground":
		case "tabs.inactiveTabBackground":
			return measure("tabs.textColor", over(key, over("tabs.background")), key === "tabs.activeTabBackground" ? "the active tab" : "an inactive tab");
		case "selection.backgroundColor":
			return measure("highlight.base", over(key), "the selection");
		case "selection.activeLine":
			return measure("highlight.base", over(key), "the active line");
		// A caret is a mark, not text: 3:1 is its target (DESIGN.md §10).
		case "cursor.color":
			return measure(key, main, "the code background", 3);
		case "autocomplete.background":
			return measure("highlight.base", popup, "the popup");
		case "autocomplete.selectedBackground":
		case "autocomplete.selectedColor":
			return measure("autocomplete.selectedColor", over("autocomplete.selectedBackground", popup), "the selected item");
	}
	return group === "highlight" || group === "lineNumbers" ? measure(key as ColorKey, main, "the code background") : null;
}

/** `warning` under the target, `danger` when even large text would fail (3:1). */
export const contrastTone = (value: Contrast): "warning" | "danger" | null => (value.ratio >= value.minimum ? null : value.ratio < 3 ? "danger" : "warning");

/** Every row that fails its target, for a section's summary. */
export const lowContrast = (theme: Theme, section: Slot["section"]) =>
	slots.filter(item => {
		if (item.section !== section) return false;
		const value = contrastOf(theme, item.key);
		return value !== null && contrastTone(value) !== null;
	}).length;

/* The id */

const reserved = new Set("break case catch class const continue debugger default delete do else enum export extends false finally for function if import in instanceof new null return super switch this throw true try typeof var void while with yield let static await".split(" "));

export const idError = (id: string) => (!id ? "Give the theme an id." : !/^[A-Za-z_$][\w$]*$/.test(id) ? "Use letters, digits, _ and $, and do not start with a digit." : reserved.has(id) ? `“${id}” is a reserved word in JavaScript.` : null);

/** `Night owl 2` → `nightOwl2`. The export names its constant after the id, so it is an identifier. */
export function deriveId(label: string) {
	const words = label.normalize("NFKD").match(/[A-Za-z0-9]+/g) ?? [];
	const id = words.map((word, index) => (index ? word[0].toUpperCase() + word.slice(1) : word[0].toLowerCase() + word.slice(1))).join("");
	return idError(id) ? `theme${id[0]?.toUpperCase() ?? ""}${id.slice(1)}` : id;
}

/* Export */

type Plain = { [key: string]: string | boolean | Plain };

/** The theme in CodeImage's nested shape. Unset optional keys are left out. */
export function toObject(theme: Theme): Plain {
	const group = (name: keyof Shape) => {
		const result: Plain = {};
		for (const key of shape[name]) {
			const value = theme.colors[`${name}.${key}` as ColorKey];
			if (value !== undefined) result[key] = value;
		}
		return result;
	};
	const optional = (name: keyof Shape) => (Object.keys(group(name)).length ? { [name]: group(name) } : {});
	return {
		id: theme.id,
		editorTheme: { darkMode: theme.darkMode, ...optional("selection"), ...optional("cursor"), ...optional("lineNumbers"), autocomplete: group("autocomplete"), highlight: group("highlight") },
		properties: { label: theme.label, previewBackground: theme.previewBackground, darkMode: theme.darkMode, terminal: { ...group("terminal"), ...optional("tabs") } },
	};
}

export const toJson = (theme: Theme) => `${JSON.stringify(toObject(theme), null, 2)}\n`;

const quote = (text: string) => `'${text.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n")}'`;

/** A module for `packages/highlight/src/lib/themes/<id>/` in the CodeImage repository. */
export function toTypeScript(theme: Theme) {
	const print = (value: Plain[string], depth: number): string => {
		if (typeof value !== "object") return typeof value === "string" ? quote(value) : String(value);
		const pad = "  ".repeat(depth + 1);
		const rows = Object.entries(value).map(([key, item]) => `${pad}${key}: ${key === "editorTheme" ? `defineEditorTheme(${print(item, depth + 1)})` : print(item, depth + 1)},\n`);
		return `{\n${rows.join("")}${"  ".repeat(depth)}}`;
	};
	return `import {createTheme, defineEditorTheme} from '../../core';\n\nexport const ${theme.id} = createTheme(${print(toObject(theme), 0)} as const);\n`;
}

/* Import */

/**
 * Reads the object literal of a `createTheme({...})` module without running it: strings,
 * booleans, nested objects, and a call such as `defineEditorTheme({...})`, which stands for its
 * argument. Anything else, a variable or a template with `${}`, is an error that names it.
 */
function readLiteral(source: string): unknown {
	let at = 0;
	const fail = (message: string): never => {
		throw new Error(message);
	};
	const skip = () => {
		for (;;) {
			const rest = source.slice(at);
			const found = /^(?:\s+|\/\/[^\n]*|\/\*[\s\S]*?\*\/)/.exec(rest);
			if (!found) return;
			at += found[0].length;
		}
	};
	const word = () => /^[A-Za-z_$][\w$]*/.exec(source.slice(at))?.[0];
	const string = () => {
		const mark = source[at++];
		let text = "";
		while (at < source.length && source[at] !== mark) {
			if (mark === "`" && source.startsWith("${", at)) fail("A template string with ${…} cannot be read. Write the colour out.");
			if (source[at] === "\\") at++;
			text += source[at++];
		}
		at++;
		return text;
	};
	const value = (): unknown => {
		skip();
		const char = source[at];
		if (char === "{") {
			at++;
			const result: Record<string, unknown> = {};
			for (;;) {
				skip();
				if (source[at] === "}") break;
				const quoted = "'\"`".includes(source[at]);
				const key = quoted ? string() : (word() ?? fail(`Expected a key at “${source.slice(at, at + 12)}”.`));
				if (!quoted) at += key.length;
				skip();
				if (source[at] !== ":") fail(`“${key}” has no value. Shorthand and spread cannot be read.`);
				at++;
				result[key] = value();
				skip();
				if (source[at] === ",") at++;
				else if (source[at] !== "}") fail(`Expected “,” or “}” after “${key}”.`);
			}
			at++;
			return result;
		}
		if ("'\"`".includes(char)) return string();
		const name = word();
		if (!name) return fail(`“${source.slice(at, at + 12)}” cannot be read.`);
		at += name.length;
		if (name === "true" || name === "false") return name === "true";
		skip();
		if (source[at] !== "(") return fail(`“${name}” is a variable. Replace it with its colour, then import again.`);
		at++;
		const inner = value();
		skip();
		if (source.startsWith("as const", at)) at += "as const".length;
		skip();
		if (source[at] === ",") at++;
		skip();
		if (source[at] !== ")") fail(`“${name}(…)” takes more than one object.`);
		at++;
		return inner;
	};
	return value();
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

/** A theme from CodeImage's nested shape, or the list of what is wrong with it. */
export function fromObject(input: unknown): { theme: Theme } | { errors: string[] } {
	const errors: string[] = [];
	const root = isRecord(input) ? input : {};
	const editor = isRecord(root.editorTheme) ? root.editorTheme : {};
	const properties = isRecord(root.properties) ? root.properties : {};
	const terminal = isRecord(properties.terminal) ? properties.terminal : {};
	const groups: Record<keyof Shape, [path: string, value: unknown]> = {
		terminal: ["properties.terminal", terminal],
		tabs: ["properties.terminal.tabs", terminal.tabs],
		selection: ["editorTheme.selection", editor.selection],
		cursor: ["editorTheme.cursor", editor.cursor],
		lineNumbers: ["editorTheme.lineNumbers", editor.lineNumbers],
		autocomplete: ["editorTheme.autocomplete", editor.autocomplete],
		highlight: ["editorTheme.highlight", editor.highlight],
	};
	if (!isRecord(input)) return { errors: ["This is not a theme. Paste the JSON or the TypeScript module that Theme Studio exports."] };
	if (!isRecord(root.editorTheme)) errors.push("editorTheme is missing.");
	if (!isRecord(root.properties)) errors.push("properties is missing.");

	const text = (path: string, value: unknown) => {
		if (typeof value === "string" && value.trim()) return value;
		errors.push(`${path} is missing.`);
		return "";
	};
	const id = text("id", root.id);
	if (id && idError(id)) errors.push(`id: ${idError(id)}`);
	const label = text("properties.label", properties.label);
	const previewBackground = text("properties.previewBackground", properties.previewBackground);
	if (previewBackground && !readBackdrop(previewBackground).stops.length) errors.push(`properties.previewBackground: “${previewBackground}” has no hex or rgb() colour.`);
	const darkMode = typeof editor.darkMode === "boolean" ? editor.darkMode : properties.darkMode;
	if (typeof darkMode !== "boolean") errors.push("editorTheme.darkMode is missing. Set it to true or false.");

	const colors: Theme["colors"] = {};
	for (const name of Object.keys(shape) as (keyof Shape)[]) {
		const [path, group] = groups[name];
		for (const key of shape[name]) {
			const value = isRecord(group) ? group[key] : undefined;
			const colorKey = `${name}.${key}` as ColorKey;
			if (value === undefined) {
				if (required.includes(colorKey)) errors.push(`${path}.${key} is missing.`);
			} else if (typeof value !== "string" || !parseColor(value)) errors.push(`${path}.${key}: “${String(value)}” is not a hex or rgb() colour.`);
			else colors[colorKey] = value;
		}
	}
	return errors.length ? { errors } : { theme: { id, label, darkMode: darkMode === true, previewBackground, colors } };
}

/** Reads what the export dialog writes: the JSON, or the TypeScript module. */
export function parseTheme(source: string): { theme: Theme } | { errors: string[] } {
	const text = source.trim();
	if (!text) return { errors: ["Paste a theme first."] };
	try {
		if (text.startsWith("{")) return fromObject(JSON.parse(text));
	} catch {
		return { errors: ["The JSON does not parse. Copy it again from the export dialog."] };
	}
	const call = text.indexOf("createTheme(");
	if (call < 0) return { errors: ["No createTheme({…}) call found. Paste the JSON or the TypeScript module that Theme Studio exports."] };
	try {
		return fromObject(readLiteral(text.slice(call)));
	} catch (error) {
		return { errors: [(error as Error).message] };
	}
}

/** A colour as the rows print it: lower-case hex, whatever form the theme wrote it in. */
export const printColor = (value: string) => (value === "transparent" ? "none" : hexOf(value));
