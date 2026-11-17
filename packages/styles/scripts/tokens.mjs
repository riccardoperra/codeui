import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load, Resolver } from "@toghen/lib";
import { tokens } from "@codeui/inkstone";

const read = file => readFile(file, "utf8");
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

export async function readInkstoneTheme(root) {
	const [theme, layerOrder, media, foundation, components] = await Promise.all([
		read(fileURLToPath(import.meta.resolve("@codeui/inkstone/theme.css"))),
		read(fileURLToPath(import.meta.resolve("@codeui/inkstone/layers.css"))),
		read(fileURLToPath(import.meta.resolve("@codeui/inkstone/custom-media.css"))),
		load(fileURLToPath(import.meta.resolve("@codeui/inkstone/resolver.json")), { read }),
		load(path.join(root, "tokens/components.resolver.json"), { read }),
	]);
	assert(
		theme.startsWith(layerOrder),
		"Inkstone theme must declare the shared layer order",
	);
	const document = foundation.document;
	const component = components.document;
	assert.equal(component.version, document.version);
	assert.equal(document.version, "2025.10");
	const resolver = new Resolver({
		...document,
		// Toghen 0.1.1 uses this spelling for DTCG 2025.10.
		version: "2025-11-01",
		sets: { ...document.sets, ...component.sets },
		resolutionOrder: [...document.resolutionOrder, ...component.resolutionOrder],
	});
	const system = resolver.resolveContextsToDesignSystem();
	const collection = system.getCollection(document.name);
	const componentAliases = new Map();
	for (const name of collection.getAllPaths()) {
		if (!name.startsWith("component.")) continue;
		const aliasIn = mode => {
			const context = `theme=${mode}`;
			const raw = collection.getToken(name, context).$value;
			const match = /^\{([^{}]+)\}$/.exec(raw);
			assert(match, `Expected a shared token reference for ${name}`);
			system.resolveValue(`${document.name}.${name}`, context);
			return match[1];
		};
		const target = aliasIn("light");
		assert.equal(
			aliasIn("dark"),
			target,
			`Theme must not change the reference for ${name}`,
		);
		const targetKeys = target.split(".");
		if (targetKeys[0] === "space") targetKeys[1] = targetKeys[1].replace("-", ".");
		const reference = targetKeys.reduce((group, key) => group?.[key], tokens);
		const property =
			typeof reference === "string" && /^var\(--(cui-[\w-]+)\)$/.exec(reference);
		assert(
			property,
			`Component alias references an unpublished Inkstone token: ${target}`,
		);
		const keys = name.split(".");
		const alias = cssName(keys);
		assert(!componentAliases.has(alias), `Duplicate component token: ${alias}`);
		componentAliases.set(alias, { component: keys[1], target: property[1] });
	}
	return { css: theme.slice(layerOrder.length), layerOrder, media, componentAliases };
}
