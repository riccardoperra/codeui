import { type LanguageId, tokenize } from "./highlight";

type Source = {
	id: LanguageId;
	name: string;
	file: string;
	code: string;
	/** The caret: a line, counted from 1, and the text it stands after. */
	cursor: [line: number, after: string];
	/** The selected text on a line. */
	select: [line: number, text: string];
	/** The autocomplete popup under the caret. The first entry is the selected one. */
	complete: string[];
};

/*
 * Between them the samples use every key of `highlight`: decorators and a regular expression in
 * TypeScript, tags and attributes in TSX, atoms and colours in CSS, a lifetime in Rust, a quote
 * and a link in Markdown. Every line is plain ASCII, so a column is exactly one `ch` wide.
 */
const sources: Source[] = [
	{
		id: "ts",
		name: "TypeScript",
		file: "resolver.ts",
		code: `import { readFile } from "node:fs/promises";

// Resolve a theme by id, falling back to dark.
@sealed
export class ThemeResolver extends Resolver {
  private cache = new Map<string, Theme>();
  static readonly hex = /^#[0-9a-f]{6}$/i;

  async resolve(id: string, strict = false) {
    const theme = this.cache.get(id) ?? null;
    if (theme !== null) return theme;
    const source = await readFile(\`themes/\${id}.json\`);
    super.track(id, 42);
    return this.parse(source, { strict });
  }
}`,
		cursor: [10, "this.cache.get"],
		select: [7, "/^#[0-9a-f]{6}$/i"],
		complete: ["get", "getOrInsert", "has"],
	},
	{
		id: "tsx",
		name: "TSX",
		file: "Badge.tsx",
		code: `import { Show } from "solid-js";

export function Badge(props: BadgeProps) {
  const tone = () => props.tone ?? "neutral";
  return (
    <span class="badge" data-tone={tone()}>
      <Show when={props.icon}>
        <Icon name={props.icon!} size={14} />
      </Show>
      {props.children}
      <small>New in 2.0</small>
    </span>
  );
}`,
		cursor: [8, "name={props.icon"],
		select: [6, 'class="badge"'],
		complete: ["icon", "children", "tone"],
	},
	{
		id: "css",
		name: "CSS",
		file: "badge.css",
		code: `@import "./tokens.css";

/* A badge keeps one line. */
.badge:hover,
span.badge[data-tone] {
  --badge-gap: 6px;
  display: inline-flex;
  gap: var(--badge-gap);
  padding: 2px 8px;
  border-radius: 999px;
  background: #1d3b53;
  color: rgb(208 216 229 / 90%);
  font: 500 11px/1.2 "Inter", sans-serif;
  transition: opacity 120ms ease-out !important;
}`,
		cursor: [7, "display: inline-flex"],
		select: [11, "#1d3b53"],
		complete: ["inline-flex", "inline-grid", "inline-block"],
	},
	{
		id: "json",
		name: "JSON",
		file: "package.json",
		code: `{
  "name": "@codeimage/highlight",
  "version": "1.4.2",
  "private": false,
  "sideEffects": null,
  "themes": ["oneDark", "nightOwl", "dracula"],
  "exports": {
    ".": "./dist/index.js",
    "./themes/*": "./dist/themes/*.js"
  },
  "peerDependencies": {
    "@codemirror/view": "^6.26.0",
    "@lezer/highlight": "^1.2.0"
  },
  "size": { "limit": 48.5, "gzip": true }
}`,
		cursor: [4, '"private": false'],
		select: [3, '"1.4.2"'],
		complete: ["false", "true", "null"],
	},
	{
		id: "py",
		name: "Python",
		file: "palette.py",
		code: `from dataclasses import dataclass

@dataclass(frozen=True)
class Palette:
    """Named colours of one theme."""
    name: str
    dark: bool = True

    def contrast(self, a: float, b: float) -> float:
        # WCAG 2: the lighter over the darker.
        hi, lo = max(a, b), min(a, b)
        return round((hi + 0.05) / (lo + 0.05), 2)

owl = Palette(name="Night Owl", dark=True)
print(f"{owl.name}: {owl.contrast(0.9, 0.02)}")`,
		cursor: [11, "hi, lo = max"],
		select: [14, '"Night Owl"'],
		complete: ["max", "map", "memoryview"],
	},
	{
		id: "rs",
		name: "Rust",
		file: "theme.rs",
		code: `use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct Theme<'a> {
    name: &'a str,
    colors: HashMap<&'a str, u32>,
}

impl<'a> Theme<'a> {
    // The colour of a key, or white.
    pub fn color(&self, key: &str) -> u32 {
        let found = self.colors.get(key).copied();
        found.unwrap_or(0xFFFFFF)
    }
}`,
		cursor: [12, "self.colors.get"],
		select: [13, "0xFFFFFF"],
		complete: ["get", "get_mut", "get_key_value"],
	},
	{
		id: "md",
		name: "Markdown",
		file: "README.md",
		code: `# Night Owl

A theme for **night owls** and *late* commits.

> Colour is a signal, not a decoration.

## Install

1. Copy \`nightOwl.ts\` into \`themes/\`.
2. Export it from [index.ts](./index.ts).
- [x] 4.5:1 for text
- [ ] 3:1 for the caret

Made with [Theme Studio](https://codeui.dev).`,
		cursor: [9, "1. Copy `nightOwl.ts`"],
		select: [5, "a signal"],
		complete: ["nightOwl.ts", "nightOwl.css", "nightOwl.json"],
	},
];

export const samples = sources.map(source => {
	const rows = source.code.split("\n");
	const column = (line: number, text: string) => rows[line - 1].indexOf(text);
	const [cursorLine, after] = source.cursor;
	const [selectLine, selected] = source.select;
	return {
		id: source.id,
		name: source.name,
		file: source.file,
		lines: tokenize(source.code, source.id),
		// Lines and columns from 0, as the preview places them.
		cursor: { line: cursorLine - 1, column: column(cursorLine, after) + after.length },
		selection: { line: selectLine - 1, column: column(selectLine, selected), length: selected.length },
		complete: source.complete,
	};
});

export type Sample = (typeof samples)[number];
export const findSample = (id: string) => samples.find(sample => sample.id === id) ?? samples[0];
