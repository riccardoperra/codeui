import { globSync } from 'node:fs';

/** Every docs URL, derived the way Fumadocs derives it: `(group)` folders drop out, `index` is the folder URL. */
export function docsUrls() {
  return globSync('**/*.mdx', { cwd: 'content/docs' }).map((file) => {
    const slugs = file.replace(/\.mdx$/, '').split('/').filter((s) => !/^\(.*\)$/.test(s));
    if (slugs.at(-1) === 'index') slugs.pop();
    return ['/docs', ...slugs].join('/');
  });
}

/** The static files the prerender writes for one docs URL. Only pages under `/docs/` have a `.txt` route. */
export const staticFiles = (url) => [`${url}.html`, `${url}.md`, ...(url.startsWith('/docs/') ? [`${url}.txt`] : [])];
