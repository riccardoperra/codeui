import type { HighlightKey } from "./theme";

export type LanguageId = "ts" | "tsx" | "css" | "json" | "py" | "rs" | "md";
/** A run of text and the key of `defineEditorTheme({ highlight })` that colours it. */
export type Token = { text: string; key: HighlightKey; style?: "bold" | "italic" };

/*
 * A small scanner per language, not a parser. Each token gets the key CodeImage's
 * `styledHighlight` gives the matching lezer tag (`plugins/highlight-style.ts`): `import` is a
 * module keyword, `this` is self, `{` is a bracket, a CSS unit is a keyword, a CSS colour is a
 * function, a markdown link is a delimiter.
 *
 * Two keys are read by their name instead. Upstream, `variableName` colours `local(variableName)`
 * and `propertyName` colours `definition(propertyName)` only, tags the lezer grammars seldom
 * emit, so a plain variable or a JSON key keeps the base colour there. Here every variable and
 * every property shows its key, so the row has something to show.
 */

type Script = {
	line: string;
	block?: [open: string, close: string];
	keywords: Set<string>;
	module?: Set<string>;
	self?: Set<string>;
	booleans: Set<string>;
	atoms?: Set<string>;
	/** Built-in type names. */
	types?: Set<string>;
	/** The key of the name that follows a keyword: `class Name`, `fn name`. */
	declares: Record<string, HighlightKey>;
	/** A capitalised name is a type. */
	typed?: boolean;
	regexp?: boolean;
	jsx?: boolean;
	/** Rust: a lone `'` starts a lifetime, `#[…]` is an attribute, `name!` is a macro. */
	rust?: boolean;
	/** Python: string prefixes, and `@name` is an annotation after its `@`. */
	python?: boolean;
};

const words = (list: string) => new Set(list.split(" "));
const typeScript: Script = {
	line: "//",
	block: ["/*", "*/"],
	keywords: words("abstract any as async await break case catch class const continue declare default delete do else enum extends finally for function if implements in instanceof interface is keyof let namespace new null of override private protected public readonly return satisfies static switch throw try type typeof undefined var void while yield"),
	module: words("import export from"),
	self: words("this"),
	booleans: words("true false"),
	atoms: words("super"),
	types: words("string number boolean unknown never object symbol bigint"),
	declares: { class: "className", new: "className", extends: "className", function: "function", interface: "typeName", type: "typeName", enum: "typeName" },
	typed: true,
	regexp: true,
};

const scripts: Record<"ts" | "tsx" | "py" | "rs", Script> = {
	ts: typeScript,
	tsx: { ...typeScript, jsx: true },
	py: {
		line: "#",
		keywords: words("and as assert async await break class continue def del elif else except finally for global if in is lambda None nonlocal not or pass raise return try while with yield"),
		module: words("import from"),
		booleans: words("True False"),
		declares: { class: "className", def: "function" },
		python: true,
	},
	rs: {
		line: "//",
		block: ["/*", "*/"],
		keywords: words("as async await break const continue crate dyn else enum extern fn for if impl in let loop match mod move mut pub ref return static struct super trait type unsafe use where while"),
		self: words("self"),
		booleans: words("true false"),
		types: words("Self bool char f32 f64 i8 i16 i32 i64 isize str u8 u16 u32 u64 usize"),
		declares: { fn: "function", struct: "typeName", enum: "typeName", trait: "typeName", type: "typeName", impl: "typeName" },
		typed: true,
		rust: true,
	},
};

const number = /(?:0[xXbBoO][\da-fA-F_]+|\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?)[a-zA-Z]*/y;
const word = /[A-Za-z_$][\w$]*/y;
const space = /\s+/y;
const operator = /[-+*/%=!<>&|^~?]+/y;
const regexpLiteral = /\/(?:\\.|\[(?:\\.|[^\]\n])*\]|[^/\\\n[])+\/[a-z]*/y;
const charLiteral = /'(?:\\.|[^\\'\n])'/y;
const lifetime = /'[A-Za-z_]\w*/y;
const attribute = /#!?\[[^\]\n]*\]/y;
const tagName = /[A-Za-z][\w.-]*/y;
const attributeName = /[\w:-]+/y;

/** Collects tokens into lines. Every scanner pushes through one of these. */
function createLines(code: string) {
	const lines: Token[][] = [[]];
	return {
		lines,
		at: 0,
		/** The last text that was not white space, to tell `a.b` from `b`. */
		last: "",
		push(text: string, key: HighlightKey, style?: Token["style"]) {
			text.split("\n").forEach((part, index) => {
				if (index) lines.push([]);
				if (part) lines.at(-1)!.push(style ? { text: part, key, style } : { text: part, key });
			});
			if (text.trim()) this.last = text.trim();
			this.at += text.length;
		},
		match(pattern: RegExp, from?: number) {
			pattern.lastIndex = from ?? this.at;
			return pattern.exec(code)?.[0];
		},
		/** From the cursor to the end of `close`, or to the end of the code. */
		until(close: string, from: number) {
			const end = code.indexOf(close, from);
			return code.slice(this.at, end < 0 ? code.length : end + close.length);
		},
		quoted(quote: string) {
			const triple = quote.repeat(3);
			if (code.startsWith(triple, this.at)) return this.until(triple, this.at + 3);
			let end = this.at + 1;
			while (end < code.length && code[end] !== quote && (quote === "`" || code[end] !== "\n")) end += code[end] === "\\" ? 2 : 1;
			return code.slice(this.at, Math.min(end + 1, code.length));
		},
	};
}

/** Where a `/` or a `<` starts a literal or a tag, not a division or a comparison. */
const startsExpression = (last: string) => !last || /[(,=:[!&|?{};>]$/.test(last) || last === "return";

function scanScript(code: string, grammar: Script): Token[][] {
	const out = createLines(code);
	/** Open brackets, to tell an object key from a parameter. */
	const brackets: string[] = [];
	/** JSX: `tag` inside `<…>`, `text` between tags, `expression` inside `{…}`. */
	const modes: ("tag" | "text" | "expression")[] = [];
	const depths: number[] = [];
	let closing = false;
	let generics = 0;
	let declared: HighlightKey | undefined;

	const openTag = () => {
		closing = code[out.at + 1] === "/";
		if (closing && modes.at(-1) === "text") modes.pop();
		out.push(closing ? "</" : "<", "brackets");
		const name = out.match(tagName);
		if (name) out.push(name, "tag");
		modes.push("tag");
	};
	const openExpression = () => {
		brackets.push("{");
		out.push("{", "brackets");
		modes.push("expression");
		depths.push(0);
	};

	while (out.at < code.length) {
		const i = out.at;
		const char = code[i];
		const mode = modes.at(-1);
		let found: string | undefined;

		if ((found = out.match(space))) out.push(found, "base");
		else if (mode === "text") {
			if (char === "<") openTag();
			else if (char === "{") openExpression();
			else out.push(/^[^<{]+/.exec(code.slice(i))![0], "base");
		} else if (mode === "tag") {
			if (code.startsWith("/>", i) || char === ">") {
				const selfClosing = char === "/";
				out.push(selfClosing ? "/>" : ">", "brackets");
				modes.pop();
				if (!selfClosing && !closing) modes.push("text");
			} else if (char === "{") openExpression();
			else if (char === '"' || char === "'") out.push(out.quoted(char), "attrValue");
			else if (char === "=") out.push(char, "operators");
			else out.push(out.match(attributeName) ?? char, "attrName");
		} else if (grammar.block && code.startsWith(grammar.block[0], i)) out.push(out.until(grammar.block[1], i + grammar.block[0].length), "comments");
		else if (code.startsWith(grammar.line, i)) out.push(out.until("\n", i).replace(/\n$/, ""), "comments");
		else if (grammar.rust && (found = out.match(attribute))) out.push(found, "meta");
		else if (grammar.python && (found = /^[fFrRbB]{1,2}(?=["'])/.exec(code.slice(i, i + 3))?.[0])) {
			// `f"…"`: the prefix belongs to the string.
			out.at += found.length;
			const body = out.quoted(code[out.at]);
			out.at = i;
			out.push(found + body, "strings");
		}
		else if (char === '"' || char === "`" || (char === "'" && (!grammar.rust || out.match(charLiteral)))) out.push(out.quoted(char), "strings");
		else if (grammar.rust && (found = out.match(lifetime))) out.push(found, "variableNameSpecial");
		else if (grammar.regexp && char === "/" && startsExpression(out.last) && (found = out.match(regexpLiteral))) out.push(found, "regexp");
		else if (grammar.jsx && char === "<" && startsExpression(out.last) && /[A-Za-z/>]/.test(code[i + 1] ?? "")) openTag();
		else if ((found = out.match(number))) out.push(found, "numbers");
		else if (char === "@" && (found = out.match(word, i + 1))) {
			// A decorator. In lezer's Python grammar the `@` is meta and the name an annotation.
			if (grammar.python) {
				out.push("@", "meta");
				out.push(found, "annotation");
			} else out.push(`@${found}`, "meta");
		} else if ((found = out.match(word))) {
			const after = code.slice(i + found.length).trimStart();
			let key: HighlightKey;
			if (grammar.module?.has(found)) key = "moduleKeyword";
			else if (grammar.keywords.has(found)) key = "keywords";
			else if (grammar.self?.has(found)) key = "self";
			else if (grammar.booleans.has(found)) key = "boolean";
			else if (grammar.atoms?.has(found)) key = "atom";
			else if (declared) key = declared;
			else if (grammar.types?.has(found)) key = "typeName";
			// A Rust path such as `std::collections` is a namespace, which takes the class colour.
			else if (grammar.rust && after.startsWith("::") && /^[a-z]/.test(found)) key = "className";
			// `name!(…)` is a macro, a tag CodeImage gives no colour.
			else if (grammar.rust && after[0] === "!") key = "base";
			else if (after[0] === "(") key = "function";
			else if (out.last === "." || out.last === "?.") key = "propertyName";
			else if (!grammar.python && brackets.at(-1) === "{" && /^[:?]/.test(after) && /[{,;]$/.test(out.last)) key = "propertyName";
			else if (grammar.typed && /^[A-Z]/.test(found) && !/^[A-Z][A-Z\d_]+$/.test(found)) key = "typeName";
			else key = "variableName";
			declared = grammar.declares[found];
			// `impl<'a> Theme<'a>`: the name comes after the generics.
			if (grammar.rust && found === "impl" && after[0] === "<") declared = undefined;
			out.push(found, key);
			if (after[0] === "<" && code[i + found.length] === "<" && (key === "typeName" || key === "className" || key === "function" || found === "impl")) generics++;
		} else if (generics && char === "<") out.push(char, "brackets");
		else if (generics && char === ">") {
			generics--;
			out.push(char, "brackets");
		} else if (code.startsWith("=>", i)) out.push("=>", "punctuation");
		else if (code.startsWith("...", i)) out.push("...", "punctuation");
		else if (code.startsWith("?.", i)) out.push("?.", "operators");
		else if (char === ".") out.push(char, "operators");
		else if ((found = out.match(operator))) out.push(found, "operators");
		else if (char === "(" || char === ")") {
			if (char === "(") brackets.push(char);
			else brackets.pop();
			out.push(char, "paren");
		} else if ("[]{}".includes(char)) {
			if (mode === "expression") {
				if (char === "{") depths[depths.length - 1]++;
				else if (char === "}" && depths.at(-1)! === 0) {
					modes.pop();
					depths.pop();
				} else if (char === "}") depths[depths.length - 1]--;
			}
			if (char === "{" || char === "[") brackets.push(char);
			else brackets.pop();
			out.push(char, "brackets");
		} else out.push(char, "punctuation");
	}
	return out.lines;
}

const cssNumber = /[-+]?(?:\d*\.)?\d+/y;
const cssUnit = /[a-zA-Z%]+/y;
const cssName = /-{0,2}[A-Za-z_][\w-]*/y;
const cssHex = /#[\da-fA-F]{3,8}\b/y;

function scanCss(code: string): Token[][] {
	const out = createLines(code);
	let inValue = false;
	/** A name before the next `{` is part of a selector; before the next `;` or `}`, a property. */
	const inSelector = () => {
		const rest = code.slice(out.at);
		const brace = rest.indexOf("{");
		const end = rest.search(/[;}]/);
		return brace >= 0 && (end < 0 || brace < end);
	};
	while (out.at < code.length) {
		const i = out.at;
		const char = code[i];
		let found: string | undefined;
		if (code.startsWith("/*", i)) out.push(out.until("*/", i + 2), "comments");
		else if ((found = out.match(space))) out.push(found, "base");
		else if (char === '"' || char === "'") out.push(out.quoted(char), "strings");
		else if (char === "@" && (found = out.match(cssName, i + 1))) out.push(`@${found}`, "keywords");
		else if (char === "!" && (found = out.match(cssName, i + 1))) out.push(`!${found}`, "keywords");
		else if (inValue && (found = out.match(cssHex))) out.push(found, "function");
		else if ((inValue || char !== ".") && (found = out.match(cssNumber))) {
			out.push(found, "numbers");
			// A unit is a keyword to lezer, so it takes the keyword colour, not the number's.
			if ((found = out.match(cssUnit))) out.push(found, "keywords");
		} else if (!inValue && (char === "." || char === ":") && (found = out.match(cssName, i + (code[i + 1] === ":" ? 2 : 1))) && inSelector()) out.push(code.slice(i, code.indexOf(found, i) + found.length), "className");
		else if (!inValue && char === "#" && (found = out.match(cssName, i + 1))) out.push(`#${found}`, "base");
		else if ((found = out.match(cssName))) {
			const call = code[i + found.length] === "(";
			if (inValue) out.push(found, call ? "keywords" : found.startsWith("--") ? "variableName" : "atom");
			else if (inSelector()) out.push(found, out.last === "[" ? "attrName" : out.last === "(" ? "propertyName" : "tag");
			else out.push(found, found.startsWith("--") ? "variableName" : "propertyName");
		} else if (char === "(" || char === ")") out.push(char, "paren");
		else if ("[]{}".includes(char)) {
			inValue = false;
			out.push(char, "brackets");
		} else if (char === ":" || char === ";" || char === ",") {
			if (char === ":" && !inSelector()) inValue = true;
			if (char === ";") inValue = false;
			out.push(char, "punctuation");
		} else out.push(char, "operators");
	}
	return out.lines;
}

function scanJson(code: string): Token[][] {
	const out = createLines(code);
	while (out.at < code.length) {
		const i = out.at;
		const char = code[i];
		let found: string | undefined;
		if ((found = out.match(space))) out.push(found, "base");
		else if (char === '"') {
			const value = out.quoted(char);
			out.push(value, /^\s*:/.test(code.slice(i + value.length)) ? "propertyName" : "strings");
		} else if ((found = out.match(/-?\d[\d.eE+-]*/y))) out.push(found, "numbers");
		else if ((found = out.match(word))) out.push(found, found === "null" ? "keywords" : "boolean");
		else out.push(char, "[]{}".includes(char) ? "brackets" : "punctuation");
	}
	return out.lines;
}

const inline = /(\*\*[^*\n]+\*\*)|(\*[^*\n]+\*|_[^_\n]+_)|(`[^`\n]+`)|(\[[^\]\n]*\]\([^)\n]*\))/g;

function scanMarkdown(code: string): Token[][] {
	let fenced = false;
	return code.split("\n").map(line => {
		const tokens: Token[] = [];
		const push = (text: string, key: HighlightKey, style?: Token["style"]) => text && tokens.push(style ? { text, key, style } : { text, key });
		const fence = line.startsWith("```");
		if (fence) fenced = !fenced;
		// The marks of a fence and of a list are processing instructions, which take the string colour.
		if (fence) push(line, "strings");
		else if (fenced) push(line, "base");
		else if (/^#{1,6} /.test(line)) push(line, "keywords", "bold");
		else if (line.startsWith(">")) push(line, "quote");
		else {
			const marker = /^\s*(?:[-*+]|\d+\.)(?: \[[ x]\])? /.exec(line)?.[0] ?? "";
			push(marker, "strings");
			let at = marker.length;
			for (const found of line.matchAll(inline)) {
				push(line.slice(at, found.index), "base");
				if (found[1]) push(found[1], "base", "bold");
				else if (found[2]) push(found[2], "base", "italic");
				else if (found[3]) push(found[3], "base");
				else push(found[4], "delimiters");
				at = found.index + found[0].length;
			}
			push(line.slice(at), "base");
		}
		return tokens;
	});
}

/** One array of tokens per line. */
export function tokenize(code: string, language: LanguageId): Token[][] {
	if (language === "css") return scanCss(code);
	if (language === "json") return scanJson(code);
	if (language === "md") return scanMarkdown(code);
	return scanScript(code, scripts[language]);
}
