import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function contract(value, callFunctions = false) {
	if (typeof value === "string") return value;
	if (typeof value === "function")
		return callFunctions || value.length === 0
			? { default: value() }
			: { function: true };
	if (value && typeof value === "object")
		return Object.fromEntries(
			Object.entries(value).map(([name, child]) => [
				name,
				contract(child, callFunctions || name.endsWith("Styles")),
			]),
		);
	return value;
}

export async function collectContracts(directory) {
	const registry = JSON.parse(await readFile(path.join(root, "entries.json"), "utf8"));
	const result = {};
	for (const name of Object.keys(registry)) {
		const module = await import(
			pathToFileURL(path.join(directory, "esm", `${name}.js`)).href
		);
		result[name] = Object.fromEntries(
			Object.entries(module).map(([key, value]) => [key, contract(value)]),
		);
	}
	return result;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const actual = await collectContracts(path.join(root, "dist"));
	const json = JSON.stringify(actual, null, 2) + "\n";
	const contractFile = path.join(root, "contract.json");
	if (process.argv.includes("--update")) await writeFile(contractFile, json);
	else
		assert.deepEqual(
			actual,
			JSON.parse(await readFile(contractFile, "utf8")),
			"Public CSS contract changed. Review the diff and run node scripts/contracts.mjs --update.",
		);
	console.log("Public class, variant, part, and variable contract matches.");
}
