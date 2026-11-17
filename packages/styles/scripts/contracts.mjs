import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function contract(value, callFunctions = false, publicParts) {
	const classes = text =>
		text
			.split(/\s+/)
			.filter(name => publicParts.has(name))
			.sort();
	if (typeof value === "string") {
		if (publicParts && /^cui-[\w-]+(?:\s+cui-[\w-]+)*$/.test(value)) {
			const parts = classes(value);
			return parts.length ? { parts } : { privateIdentifier: true };
		}
		return value;
	}
	if (typeof value === "function") {
		if (value.classNames && publicParts) {
			const defaultClasses = value();
			const defaults = new Set(defaultClasses.split(/\s+/));
			return {
				parts: classes(defaultClasses),
				variants: Object.fromEntries(
					Object.entries(value.classNames.variants).map(([axis, values]) => [
						axis,
						Object.keys(values),
					]),
				),
				defaults: Object.fromEntries(
					Object.entries(value.classNames.variants).flatMap(([axis, values]) =>
						Object.entries(values)
							.filter(([, names]) => names.split(/\s+/).every(name => defaults.has(name)))
							.map(([name]) => [axis, name]),
					),
				),
			};
		}
		return value.classNames
			? { classNames: value.classNames }
			: callFunctions
				? { default: contract(value(), false, publicParts) }
				: { function: true };
	}
	if (value && typeof value === "object")
		return Object.fromEntries(
			Object.entries(value).map(([name, child]) => [
				name,
				contract(child, callFunctions || name.endsWith("Styles"), publicParts),
			]),
		);
	return value;
}

export async function collectContracts(directory) {
	const registry = JSON.parse(await readFile(path.join(root, "entries.json"), "utf8"));
	const authored = JSON.parse(
		await readFile(path.join(root, "public-registry.json"), "utf8"),
	);
	const publicParts = new Set(
		Object.values(authored).flatMap(value =>
			value?.parts ? Object.values(value.parts).map(part => "cui-" + part) : [],
		),
	);
	const pilots = new Set(["button", "button-loading", "icon-button", "switch", "dialog"]);
	const result = {};
	for (const name of Object.keys(registry)) {
		const module = await import(
			pathToFileURL(path.join(directory, "esm", `${name}.js`)).href
		);
		result[name] = Object.fromEntries(
			Object.entries(module).map(([key, value]) => [
				key,
				contract(value, false, pilots.has(name) ? publicParts : undefined),
			]),
		);
	}
	return result;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const actual = await collectContracts(path.join(root, "dist"));
	const json = JSON.stringify(actual, null, 2) + "\n";
	const contractFile = path.join(root, "contract.json");
	if (process.argv.includes("--update")) await writeFile(contractFile, json);
	else if ((await readFile(contractFile, "utf8")) !== json)
		throw new Error(
			"Public CSS contract changed. Review class and variable changes, then run node scripts/contracts.mjs --update.",
		);
	console.log("Public class, variant, part, and variable contract matches.");
}
