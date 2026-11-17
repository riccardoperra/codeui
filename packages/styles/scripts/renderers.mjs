import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

export function checkRenderers(root, registry, manifest) {
	const kit = path.resolve(root, "../kit/src");
	const styles = path.join(root, "src");
	const theme = new Set(manifest.entries.theme.scopes);
	const failures = [];
	const resolve = file =>
		[
			file,
			`${file}.ts`,
			`${file}.tsx`,
			path.join(file, "index.ts"),
			path.join(file, "index.tsx"),
		].find(candidate => existsSync(candidate) && /\.tsx?$/.test(candidate));
	const collect = (file, seen, scopes) => {
		if (seen.has(file)) return;
		seen.add(file);
		if (file.endsWith(".css.ts")) {
			const sourceRoot = file.startsWith(kit + path.sep) ? kit : styles;
			const key = path.relative(sourceRoot, file).split(path.sep).join("/");
			assert(manifest.modules[key], `${file} has no extracted style module`);
			for (const scope of manifest.modules[key]) if (!theme.has(scope)) scopes.add(scope);
			return;
		}
		const ast = ts.createSourceFile(
			file,
			readFileSync(file, "utf8"),
			ts.ScriptTarget.Latest,
			true,
		);
		for (const statement of ast.statements) {
			if (!ts.isImportDeclaration(statement) && !ts.isExportDeclaration(statement))
				continue;
			if (
				statement.isTypeOnly ||
				statement.importClause?.isTypeOnly ||
				!statement.moduleSpecifier
			)
				continue;
			const bindings = statement.importClause?.namedBindings ?? statement.exportClause;
			if (
				bindings &&
				ts.isNamedImports(bindings) &&
				bindings.elements.every(element => element.isTypeOnly)
			)
				continue;
			const specifier = statement.moduleSpecifier.text;
			const next = specifier.startsWith(".")
				? resolve(path.resolve(path.dirname(file), specifier))
				: specifier.startsWith("@codeui/styles/internal/")
					? resolve(path.join(styles, specifier.slice("@codeui/styles/internal/".length)))
					: undefined;
			if (next) collect(next, seen, scopes);
		}
	};
	for (const [name, entry] of Object.entries(registry)) {
		if (name === "theme") continue;
		const roots = entry.modules
			.map(file => resolve(path.join(kit, file.replace(/\.css\.ts$/, ".tsx"))))
			.filter(Boolean);
		if (name === "icon") roots.push(path.join(kit, "icons/SvgIcon.tsx"));
		if (name === "toast") roots.push(path.join(kit, "components/Toast/Toaster.tsx"));
		if (name === "listbox")
			roots.push(path.join(kit, "components/Listbox/VirtualizedListbox.tsx"));
		if (name === "radio-list")
			roots.push(path.join(kit, "components/RadioList/RadioList.tsx"));
		const expected = new Set();
		for (const file of roots) collect(file, new Set(), expected);
		for (const scope of expected)
			if (!manifest.entries[name].scopes.includes(scope))
				failures.push(`${name}.css omits rendered style module ${scope}`);
	}
	assert.deepEqual(
		failures,
		[],
		"Component CSS must include styles reached by Solid renderer imports",
	);
}
