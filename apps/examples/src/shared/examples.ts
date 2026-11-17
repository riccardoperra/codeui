import list from "../../examples.json";

export type Example = { slug: string; title: string; kind: string; description: string; uses: string[] };

export const examples: Example[] = list;

/** The docs site. The docs build serves the examples from its own origin, so the default is a path. */
export const docsUrl: string = import.meta.env.VITE_DOCS_URL ?? "/docs";

export const sourceUrl = (slug: string) =>
	`https://github.com/riccardoperra/codeui/tree/main/apps/examples/src/${slug}`;
