import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: { title: appName },
    // On every layout, so the examples are one click from the home page and from any docs page.
    links: [{ text: 'React', url: '/docs/react', active: 'nested-url' }, { text: 'Examples', url: '/examples', active: 'nested-url' }],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}

/** The pages without a sidebar (home, examples) list the site's sections in their header. */
export function homeOptions(): BaseLayoutProps {
  const base = baseOptions();
  return {
    ...base,
    links: [{ text: 'Docs', url: '/docs' }, { text: 'Inkstone', url: '/docs/design' }, ...(base.links ?? [])],
  };
}
