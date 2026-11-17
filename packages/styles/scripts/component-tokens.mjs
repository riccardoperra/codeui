import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { bundleAsync, Features } from "lightningcss";
import { parse } from "postcss";

export async function compileStylesheet({
	source,
	sourcePath,
	media,
	componentAliases,
	emittedAliases,
	visitor,
}) {
	const marker = /^@import "\.\/([a-z0-9-]+)-tokens\.generated\.css";/m.exec(source);
	if (!marker)
		assert(
			!source.includes("var(--cui-component-"),
			`Missing component token import in ${sourcePath}`,
		);
	const stylesheet = parse(source, { from: sourcePath });

	// Define aliases in the rules that read them to preserve scope without duplicating selectors.
	if (marker)
		stylesheet.walkRules(rule => {
			const names = new Set();
			rule.each(item => {
				if (item.type !== "decl") return;
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
			});
			for (const name of names)
				rule.prepend({
					prop: `--${name}`,
					value: `var(--${componentAliases.get(name).target})`,
				});
		});
	const mediaFile = marker ? `${marker[1]}-tokens.generated.css` : ".codeui-media.css";
	const generatedSource = marker
		? stylesheet.toString()
		: `@import "./${mediaFile}";\n${source}`;
	const generatedPath = path.join(path.dirname(sourcePath), mediaFile);
	const { code } = await bundleAsync({
		filename: sourcePath,
		visitor,
		include: Features.Nesting | Features.MediaQueries,
		drafts: { customMedia: true },
		resolver: {
			read: file => {
				file = path.normalize(file);
				if (file === sourcePath) return generatedSource;
				if (file === generatedPath) return media;
				return readFile(file, "utf8");
			},
		},
	});
	return code.toString();
}
