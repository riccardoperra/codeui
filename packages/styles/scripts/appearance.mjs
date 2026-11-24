import assert from "node:assert/strict";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { transform } from "lightningcss";

const root = fileURLToPath(new URL("../", import.meta.url));
const readJson = async file => JSON.parse(await readFile(path.join(root, file), "utf8"));
export const appearance = (await readJson("contract.json")).$appearance;
const registry = await readJson("entries.json");
const adapterAttributes = new Set([
	"data-active",
	"data-checked",
	"data-closed",
	"data-cui-replaced",
	"data-disabled",
	"data-dragging",
	"data-expanded",
	"data-focus",
	"data-highlighted",
	"data-hover",
	"data-indeterminate",
	"data-invalid",
	"data-loading",
	"data-motion",
	"data-open",
	"data-opened",
	"data-selected",
	"data-swipe",
	"data-visible",
]);
const sharedAttributes = new Set([
	"data-cui",
	"data-cui-density",
	"data-cui-input",
	"data-cui-theme",
]);
// Entry names are one lowercase word (`textfield`). Their JavaScript names keep the camel case of
// the component (`textFieldStyleProps`).
const jsNames = {
	commandmenu: "commandMenu",
	dropdownmenu: "dropdownMenu",
	fielderror: "fieldError",
	fieldlabel: "fieldLabel",
	fieldmessage: "fieldMessage",
	iconbutton: "iconButton",
	numberfield: "numberField",
	optioncard: "optionCard",
	radiolist: "radioList",
	segmentedcontrol: "segmentedControl",
	textarea: "textArea",
	textfield: "textField",
};
const camel = name => jsNames[name] ?? name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
const upper = name => name[0].toUpperCase() + name.slice(1);
const attributeName = name =>
	"data-" + name.replace(/[A-Z]/g, letter => "-" + letter.toLowerCase());
const quote = value => JSON.stringify(value);

function resolveVariant(entry, key) {
	const definition = appearance[entry]?.variants[key];
	assert(definition, `Missing appearance variant ${entry}:${key}`);
	if (definition.use) {
		const [source, variant] = definition.use.split(":");
		assert(
			!appearance[source]?.variants[variant]?.use,
			`Use a canonical variant for ${entry}:${key}`,
		);
		const { kind, values, default: defaultValue } = resolveVariant(source, variant);
		return {
			kind,
			values,
			default: defaultValue,
			...definition,
			attribute: definition.attribute ?? attributeName(key),
		};
	}
	return { ...definition, attribute: definition.attribute ?? attributeName(key) };
}

function allowedValues(variant) {
	if (variant.kind === "boolean") return [null];
	assert(
		variant.kind === "enum" && Array.isArray(variant.values),
		`Invalid variant for ${variant.attribute}`,
	);
	return variant.values;
}

function* dependencyEntries(entry, seen = new Set()) {
	if (seen.has(entry)) return;
	seen.add(entry);
	yield entry;
	for (const dependency of registry[entry].dependencies)
		yield* dependencyEntries(dependency, seen);
}

function selectorMatches(operation, value) {
	if (!operation) return value === null;
	if (value === null) return false;
	const expected = operation.value;
	switch (operation.operator) {
		case "equal":
			return value === expected;
		case "prefix":
			return value.startsWith(expected);
		case "suffix":
			return value.endsWith(expected);
		case "substring":
			return value.includes(expected);
		case "includes":
			return value.split(/\s+/).includes(expected);
		case "dash-match":
			return value === expected || value.startsWith(expected + "-");
		default:
			throw new Error(`Unknown selector operator ${operation.operator}`);
	}
}

function* selectorNodes(node) {
	if (node === null || typeof node !== "object") return;
	if (node.type) yield node;
	for (const child of Object.values(node)) yield* selectorNodes(child);
}

function isAttribute(node, name) {
	return node?.type === "attribute" && node.name === name;
}

function isAbsence(node, attribute) {
	if (node.type !== "pseudo-class" || node.kind !== "not") return false;
	const [selector] = node.selectors;
	return (
		node.selectors.length === 1 &&
		selector.length === 1 &&
		isAttribute(selector[0], attribute) &&
		!selector[0].operation
	);
}

function hasDefaultPair(node, { attribute, default: value }) {
	if (node.type !== "pseudo-class" || !["is", "where"].includes(node.kind)) return false;
	const branches = node.selectors.map(([branch]) => branch);
	return (
		node.selectors.every(selector => selector.length === 1) &&
		branches.some(branch => isAbsence(branch, attribute)) &&
		branches.some(
			branch =>
				isAttribute(branch, attribute) &&
				branch.operation?.operator === "equal" &&
				selectorMatches(branch.operation, value),
		) &&
		branches.every(
			branch =>
				isAbsence(branch, attribute) ||
				(isAttribute(branch, attribute) && branch.operation?.operator === "equal"),
		)
	);
}

function checkDefaultSelector(node, variant, scope) {
	if (node === null || typeof node !== "object") return false;
	if (hasDefaultPair(node, variant)) return true;
	if (isAttribute(node, variant.attribute)) {
		assert(
			node.operation && !selectorMatches(node.operation, variant.default),
			`${scope}: pair ${variant.attribute}=${variant.default} with its absence in the same :is() or :where()`,
		);
	}
	let paired = false;
	for (const child of Object.values(node)) {
		if (checkDefaultSelector(child, variant, scope)) paired = true;
	}
	return paired;
}

export async function checkAppearance() {
	const dir = path.join(root, "css/components");
	const entriesByFile = new Map(
		Object.entries(registry).flatMap(([entry, { modules }]) =>
			modules.map(module => [module.replace(/\.ts$/, ""), entry]),
		),
	);
	const selectorsByEntry = new Map();
	for (const file of await readdir(dir, { recursive: true, withFileTypes: true })) {
		if (!file.isFile() || !file.name.endsWith(".css")) continue;
		const filename = path.join(file.parentPath, file.name);
		const scope = path.relative(path.join(root, "css"), filename);
		const entry = entriesByFile.get(scope);
		const variants = Object.keys(appearance[entry]?.variants ?? {}).map(key =>
			resolveVariant(entry, key),
		);
		if (!selectorsByEntry.has(entry))
			selectorsByEntry.set(entry, {
				exact: new Map(),
				baseClasses: new Set(),
				selectors: [],
			});
		const { exact, baseClasses, selectors } = selectorsByEntry.get(entry);
		transform({
			filename,
			code: await readFile(filename),
			visitor: {
				Selector(selector) {
					selectors.push({ selector, scope });
					const nodes = [...selectorNodes(selector)];
					const data = nodes.filter(
						node => node.type === "attribute" && node.name.startsWith("data-"),
					);
					const absence = new Set(
						nodes
							.filter(node => isAbsence(node, node.selectors?.[0]?.[0]?.name))
							.map(node => node.selectors[0][0]),
					);
					if (data.length === 0)
						for (const node of nodes)
							if (node.type === "class") baseClasses.add(node.name);
					for (const node of data) {
						const { name, operation } = node;
						if (adapterAttributes.has(name) || sharedAttributes.has(name)) continue;
						const values = variants
							.filter(variant => variant.attribute === name && !variant.adapterOnly)
							.flatMap(allowedValues);
						assert(
							values.length > 0 &&
								(absence.has(node) ||
									values.some(value => selectorMatches(operation, value))),
							`${scope}: undeclared appearance selector [${name}${operation ? ` ${operation.operator} ${quote(operation.value)}` : ""}]`,
						);
						if (
							(absence.has(node) && !values.includes(null)) ||
							(operation && operation.operator !== "equal")
						)
							continue;
						if (!exact.has(name)) exact.set(name, new Set());
						exact.get(name).add(operation?.value ?? null);
					}
				},
			},
		});
	}
	for (const [entry, { variants }] of Object.entries(appearance)) {
		assert(registry[entry], `Unknown component entry ${entry}`);
		for (const key of Object.keys(variants)) {
			const variant = resolveVariant(entry, key);
			const { attribute, base } = variant;
			const scopes =
				variant.use && !variant.check ? [...dependencyEntries(entry)] : [entry];
			const defaultScopes = scopes.filter(
				scope =>
					scope === entry ||
					scope === variant.use?.split(":")[0] ||
					Object.keys(appearance[scope]?.variants ?? {}).some(key => {
						const inherited = resolveVariant(scope, key);
						return (
							inherited.attribute === attribute && inherited.default === variant.default
						);
					}),
			);
			assert(
				!adapterAttributes.has(attribute) && !sharedAttributes.has(attribute),
				`${entry}: ${attribute} is reserved for the adapter or theme`,
			);
			const values = allowedValues(variant);
			assert(
				values.length > 0 &&
					new Set(values).size === values.length &&
					values.every(
						value => value === null || (typeof value === "string" && value.length > 0),
					),
				`${entry}: invalid ${attribute} values`,
			);
			if (variant.adapterOnly) {
				assert(
					values.includes(variant.default),
					`${entry}: invalid ${attribute} default`,
				);
				continue;
			}
			if (variant.default !== undefined) {
				assert(
					variant.kind === "enum" && values.includes(variant.default),
					`${entry}: invalid ${attribute} default`,
				);
				let paired = false;
				for (const scope of defaultScopes) {
					for (const { selector, scope: filename } of selectorsByEntry.get(scope)
						?.selectors ?? []) {
						if (checkDefaultSelector(selector, variant, filename)) paired = true;
					}
				}
				assert(
					paired || base,
					`${entry}: no CSS fallback for ${attribute}=${variant.default}`,
				);
			}
			if (base)
				assert(
					base.value === variant.default &&
						scopes.some(scope =>
							selectorsByEntry.get(scope)?.baseClasses.has(base.class),
						),
					`${entry}: missing base rule .${base.class} for ${attribute}=${base.value}`,
				);
			for (const value of values)
				assert(
					value === base?.value ||
						scopes.some(scope =>
							selectorsByEntry.get(scope)?.exact.get(attribute)?.has(value),
						),
					`${entry}: missing selector for [${attribute}${value === null ? "" : `=${quote(value)}`}]`,
				);
		}
	}
}

function helperSource(entry, { parts }) {
	const name = camel(entry);
	const imports = new Map();
	function reference(expression, marker = false) {
		const [component, symbol] = expression.includes(":")
			? expression.split(":")
			: [entry, expression];
		if (marker && !symbol.includes(".")) return `${quote(symbol)} as const`;
		const { modules, helpers } = registry[component];
		const file = symbol.includes(".") ? helpers : modules[0];
		assert(file, `Cannot resolve ${component}:${symbol}`);
		if (!imports.has(file)) imports.set(file, `source${imports.size}`);
		return `${imports.get(file)}.${symbol}`;
	}
	const functions = Object.entries(parts).map(([part, definition]) => {
		const type = `${upper(name)}${part === Object.keys(parts)[0] ? "" : upper(part)}StyleOptions`;
		const fields = definition.options.map(key => ({
			key,
			...resolveVariant(entry, key),
		}));
		const options = [
			"class?: string;",
			...fields.map(
				({ key, option = key, kind, values }) =>
					`${option}?: ${kind === "boolean" ? "boolean" : values.map(quote).join(" | ")};`,
			),
		];
		const marker = definition.marker ?? entry;
		const classes = [
			...definition.classes.map(value => reference(value)),
			"options.class",
		];
		if (definition.afterClass) classes.push(reference(definition.afterClass));
		const attributes = fields.map(
			({ key, option = key, kind, attribute, default: defaultValue }) => {
				const value = `options.${option}`;
				const expression =
					kind === "boolean"
						? `${value} ? "" : undefined`
						: defaultValue === undefined
							? value
							: `${value} === undefined ? ${quote(defaultValue)} : ${value}`;
				return `\t${quote(attribute)}: ${expression},`;
			},
		);
		return (
			`export type ${type} = { ${options.join(" ")} };\nconst ${part} = (options: ${type} = {}) => ({\n` +
			`\tclass: mergeClasses(${classes.join(", ")}),\n\t"data-cui": ${reference(marker, true)},\n` +
			attributes.join("\n") +
			"\n});"
		);
	});
	const [primary, ...others] = Object.keys(parts);
	const helper = others.length
		? `Object.assign((options: Parameters<typeof ${primary}>[0] = {}) => ${primary}(options), { ${[primary, ...others].join(", ")} })`
		: primary;
	return (
		"// Generated from contract.json by scripts/appearance.mjs.\n" +
		'import { mergeClasses } from "../utils/css";\n' +
		[...imports]
			.map(
				([file, alias]) =>
					`import * as ${alias} from "../${file.replace(/\.ts$/, "")}";\n`,
			)
			.join("") +
		"\n" +
		functions.join("\n\n") +
		`\n\nexport const ${name}StyleProps = ${helper};\n`
	);
}

export async function generateAppearance() {
	const dir = path.join(root, "src/generated-appearance");
	await mkdir(dir, { recursive: true });
	for (const [entry, definition] of Object.entries(appearance)) {
		assert(registry[entry], `Unknown component entry ${entry}`);
		if (definition.selectorOnly) continue;
		assert(
			Object.values(definition.parts).length > 0,
			`${entry} needs an appearance part`,
		);
		for (const key of Object.keys(definition.variants))
			assert(
				Object.values(definition.parts).some(part => part.options.includes(key)),
				`${entry}: ${key} is unused by its appearance helpers`,
			);
		await writeFile(path.join(dir, `${entry}.ts`), helperSource(entry, definition));
	}
}

const docsStart = "<!-- appearance:start -->";
const docsEnd = "<!-- appearance:end -->";
function renderAppearanceDocs() {
	const lines = ["| Entry | Helper calls | Options |", "| --- | --- | --- |"];
	for (const [entry, { parts }] of Object.entries(appearance)) {
		for (const [index, [part, { options }]] of Object.entries(parts).entries()) {
			const helper = `${camel(entry)}StyleProps`;
			const call = index === 0 ? helper : `${helper}.${part}`;
			const primaryPart =
				index === 0 && Object.keys(parts).length > 1 ? ` (${part})` : "";
			const choices = options.map(key => {
				const {
					kind,
					option = key,
					values,
					default: defaultValue,
				} = resolveVariant(entry, key);
				const type =
					kind === "boolean" ? "boolean" : values.map(value => `\`${value}\``).join(", ");
				const fallback = defaultValue ? ` (default \`${defaultValue}\`)` : "";
				return `\`${option}\` ${type}${fallback}`;
			});
			lines.push(
				`| \`@codeui/styles/${entry}\` | \`${call}()\`${primaryPart} | ${choices.join(" · ")} |`,
			);
		}
	}
	return lines.join("\n");
}

export async function checkAppearanceDocs(update = false) {
	const filename = path.join(root, "README.md");
	const markdown = await readFile(filename, "utf8");
	const start = markdown.indexOf(docsStart);
	const end = markdown.indexOf(docsEnd);
	assert(start >= 0 && end > start, "README is missing the appearance table markers");
	const expected =
		markdown.slice(0, start) +
		docsStart +
		"\n\n" +
		"<!-- prettier-ignore -->\n" +
		renderAppearanceDocs() +
		"\n\n" +
		markdown.slice(end);
	if (update) await writeFile(filename, expected);
	else
		assert(
			markdown === expected,
			"README appearance table drifted. Run node scripts/appearance.mjs --update-docs.",
		);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	if (process.argv.includes("--update-docs")) await checkAppearanceDocs(true);
	else await generateAppearance();
}
