import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";

/** @param {string} name */
export function reactDemoSource(name) {
	for (const group of ["layout", "controls", "interactive"]) {
		const url = new URL(
			`../../apps/docs/src/components/react-examples/${group}.tsx`,
			import.meta.url,
		);
		const file = ts.createSourceFile(
			fileURLToPath(url),
			readFileSync(url, "utf8"),
			ts.ScriptTarget.Latest,
			true,
			ts.ScriptKind.TSX,
		);
		const declarations = file.statements.flatMap(statement => {
			if (
				(ts.isFunctionDeclaration(statement) ||
					ts.isTypeAliasDeclaration(statement) ||
					ts.isInterfaceDeclaration(statement)) &&
				statement.name
			)
				return [{ name: statement.name.text, node: statement, owner: statement }];
			if (!ts.isVariableStatement(statement)) return [];
			return statement.declarationList.declarations.flatMap(node =>
				ts.isIdentifier(node.name)
					? [{ name: node.name.text, node, owner: statement }]
					: [],
			);
		});
		const registry = declarations.find(entry => entry.name === "demos")?.node;
		if (
			!registry ||
			!ts.isVariableDeclaration(registry) ||
			!registry.initializer ||
			!ts.isObjectLiteralExpression(registry.initializer)
		)
			continue;
		const property = registry.initializer.properties.find(
			property => property.name?.getText(file) === name,
		);
		if (!property) continue;
		const example = ts.isShorthandPropertyAssignment(property)
			? property.name
			: ts.isPropertyAssignment(property)
				? property.initializer
				: undefined;
		if (!example || !ts.isIdentifier(example))
			throw new Error(`Register demo ${name} with a named example component.`);

		/** @type {Set<string>} */
		const referenced = new Set();
		function collect(/** @type {ts.Node} */ node) {
			if (ts.isIdentifier(node) && !referenced.has(node.text)) {
				referenced.add(node.text);
				const local = declarations.find(entry => entry.name === node.text);
				if (local) collect(local.owner);
			}
			ts.forEachChild(node, collect);
		}
		collect(example);

		const imports = file.statements.flatMap(statement => {
			if (!ts.isImportDeclaration(statement)) return [];
			const clause = statement.importClause;
			if (!clause) return [statement.getText(file)];
			const parts = [];
			if (clause.name && referenced.has(clause.name.text))
				parts.push(clause.name.getText(file));
			const bindings = clause.namedBindings;
			if (bindings && ts.isNamedImports(bindings)) {
				const specifiers = bindings.elements.filter(element =>
					referenced.has(element.name.text),
				);
				if (specifiers.length)
					parts.push(
						`{ ${specifiers.map(element => element.getText(file)).join(", ")} }`,
					);
			} else if (bindings && referenced.has(bindings.name.text)) {
				parts.push(bindings.getText(file));
			}
			return parts.length
				? [
						`import ${clause.isTypeOnly ? "type " : ""}${parts.join(", ")} from ${statement.moduleSpecifier.getText(file)};`,
					]
				: [];
		});
		const code = [
			...new Set(
				declarations
					.filter(entry => referenced.has(entry.name))
					.map(entry => entry.owner),
			),
		].map(node => node.getText(file));
		return [imports.join("\n"), code.join("\n\n")].filter(Boolean).join("\n\n");
	}
	throw new Error(`Unknown React demo ${name}.`);
}
