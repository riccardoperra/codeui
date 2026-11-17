import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { bundleAsync, Features } from "lightningcss";
import { parse } from "postcss";

export async function bundleComponentTokens({
	source,
	sourcePath,
	media,
	componentAliases,
	emittedAliases,
}) {
	const marker = /^@import "\.\/([a-z0-9-]+)-tokens\.generated\.css";/m.exec(source);
	if (!marker) {
		assert(
			!source.includes("var(--cui-component-"),
			`Missing component token import in ${sourcePath}`,
		);
		return source;
	}
	const fragment = parse(source, { from: sourcePath });

	// Keep aliases on the same elements and in the same cascade contexts as their reads.
	function retainAliases(container) {
		if (container.type === "rule") {
			const names = new Set();
			for (const item of container.nodes) {
				if (item.type !== "decl") continue;
				for (const [, name] of item.value.matchAll(
					/var\(\s*--(cui-component-[a-z0-9-]+)\b/g,
				)) {
					const alias = componentAliases.get(name);
					assert(alias, `Unknown component token ${name} in ${sourcePath}`);
					assert.equal(
						alias.component,
						marker[1],
						`Foreign component token ${name} in ${sourcePath}`,
					);
					names.add(name);
					emittedAliases.add(name);
				}
			}
			for (const item of [...container.nodes]) {
				if (item.nodes) retainAliases(item);
				else item.remove();
			}
			for (const name of names)
				container.prepend({
					prop: `--${name}`,
					value: `var(--${componentAliases.get(name).target})`,
				});
		} else {
			for (const item of [...container.nodes]) {
				if (item.nodes) retainAliases(item);
				else item.remove();
			}
		}
		if (container.parent && container.nodes.length === 0) container.remove();
	}
	retainAliases(fragment);
	const generatedPath = path.join(
		path.dirname(sourcePath),
		`${marker[1]}-tokens.generated.css`,
	);
	const { code } = await bundleAsync({
		filename: sourcePath,
		include: Features.Nesting | Features.MediaQueries,
		drafts: { customMedia: true },
		resolver: {
			read: file => {
				file = path.normalize(file);
				if (file === sourcePath) return source;
				if (file === generatedPath) return `${media}\n${fragment.toString()}`;
				return readFile(file, "utf8");
			},
		},
	});
	return code.toString();
}
