export type ShowcaseTile = {
  /** A Solid demo at `packages/docs-demos/src/demos/showcase/<name>.tsx`. */
  demo: `showcase/${string}`;
  title: string;
  href: `/docs/${string}`;
};

/** The homepage tiles. CSS columns fill top to bottom, so this order also sets which tile starts each column. */
export const showcase: readonly ShowcaseTile[] = [
  { demo: 'showcase/buttons', title: 'Button', href: '/docs/components/button' },
  { demo: 'showcase/badges', title: 'Badge', href: '/docs/components/badge' },
  { demo: 'showcase/overlays', title: 'Overlays', href: '/docs/components#overlays' },
  { demo: 'showcase/alerts', title: 'Alert', href: '/docs/components/alert' },
  { demo: 'showcase/invite-form', title: 'Build forms', href: '/docs/patterns/build-forms' },
  { demo: 'showcase/members', title: 'Dropdown menu', href: '/docs/components/dropdown-menu' },
  { demo: 'showcase/text', title: 'Text', href: '/docs/components/text' },
  { demo: 'showcase/settings', title: 'Settings row', href: '/docs/components/settings-row' },
  { demo: 'showcase/window-style', title: 'Option card', href: '/docs/components/option-card' },
  { demo: 'showcase/tabs', title: 'Tabs', href: '/docs/components/tabs' },
  { demo: 'showcase/command-menu', title: 'Command menu', href: '/docs/components/command-menu' },
  { demo: 'showcase/icon-buttons', title: 'Icon button', href: '/docs/components/icon-button' },
  { demo: 'showcase/accordion', title: 'Accordion', href: '/docs/components/accordion' },
  { demo: 'showcase/preferences', title: 'Segmented control', href: '/docs/components/segmented-control' },
  { demo: 'showcase/pagination', title: 'Pagination', href: '/docs/components/pagination' },
  { demo: 'showcase/radio-list', title: 'Radio list', href: '/docs/components/radio-list' },
  { demo: 'showcase/progress', title: 'Progress', href: '/docs/components/progress' },
  { demo: 'showcase/checkbox', title: 'Checkbox', href: '/docs/components/checkbox' },
];
