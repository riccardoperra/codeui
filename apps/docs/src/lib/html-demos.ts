import allCssUrl from '@codeui/styles/all.css?url';

/**
 * The CSS-only demos in `apps/docs/html-demos/`, keyed by name (`button/themes`).
 * Each file is a plain HTML fragment that uses classes and `data-*` attributes from
 * `@codeui/styles` and nothing else: no framework, no script.
 */
const files = import.meta.glob<string>('../../html-demos/**/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export const htmlDemos: Record<string, string> = Object.fromEntries(
  Object.entries(files)
    .map(([file, source]) => [file.replace('../../html-demos/', '').replace(/\.html$/, ''), source.trim()] as const)
    .sort(([a], [b]) => a.localeCompare(b)),
);

export type FrameTheme = 'light' | 'dark';
export type FrameDensity = 'compact' | 'comfortable' | 'touch';

// Harness styles for the frame: a transparent page with Inkstone's font and text colour. The demo
// markup itself carries every component style through its `cui-` classes.
const frameStyles = `
html { background: transparent; }
body {
  margin: 0;
  padding: 32px 24px;
  font-family: var(--cui-font-family-sans);
  font-size: var(--cui-font-size-sm);
  color: var(--cui-text-default);
}
`;

/**
 * A complete HTML document for an `<iframe srcdoc>`. It links `@codeui/styles/all.css` and nothing
 * else, so a demo proves the markup works without the kit or any framework.
 */
export function frameDocument(body: string, options: { theme: FrameTheme; density?: FrameDensity }) {
  const density = options.density && options.density !== 'comfortable' ? ` data-cui-density="${options.density}"` : '';
  return `<!doctype html>
<html lang="en" data-cui-theme="${options.theme}"${density}>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" href="${new URL(allCssUrl, location.href).href}" />
<style>${frameStyles}</style>
</head>
<body>
${body}
</body>
</html>`;
}

/** The docs theme, which the root route mirrors onto `<html data-cui-theme>`. */
export function readDocsTheme(): FrameTheme {
  return document.documentElement.getAttribute('data-cui-theme') === 'light' ? 'light' : 'dark';
}

/** Calls `onChange` whenever the docs theme changes. Returns the cleanup. */
export function observeDocsTheme(onChange: (theme: FrameTheme) => void) {
  const observer = new MutationObserver(() => onChange(readDocsTheme()));
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-cui-theme'] });
  return () => observer.disconnect();
}
