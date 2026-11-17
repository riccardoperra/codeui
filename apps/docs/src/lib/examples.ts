import list from '@codeui/examples/examples.json';

export type Example = { slug: string; title: string; kind: string; description: string; uses: string[] };

/** The apps under `/examples/<slug>/`: static Solid pages copied in by `scripts/copy-examples.mjs`. */
export const examples: Example[] = list;

/** A trailing slash, so every host serves the folder's `index.html` without a redirect. */
export const exampleUrl = (slug: string) => `/examples/${slug}/`;

export const exampleShot = (slug: string, theme: 'dark' | 'light') => `/examples/screenshots/${slug}-${theme}.jpg`;
