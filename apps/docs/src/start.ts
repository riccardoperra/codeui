import { createMiddleware, createCsrfMiddleware, createStart } from '@tanstack/react-start';
import { isMarkdownPreferred } from 'fumadocs-core/negotiation';
import { redirect } from '@tanstack/react-router';
import { docsRoute } from '@/lib/shared';

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === 'serverFn',
});

const llmMiddleware = createMiddleware().server(({ next, request }) => {
  const url = new URL(request.url);

  // The prerender requests every path with a trailing slash, which the `{$}.md` routes do not match.
  if (/\.(md|txt)\/$/.test(url.pathname)) {
    url.pathname = url.pathname.slice(0, -1);
    throw redirect({ href: url.href });
  }

  // files like `/docs/page.md` are served by their routes
  if (
    url.pathname.startsWith(docsRoute) &&
    !/\.(md|txt)$/.test(url.pathname) &&
    isMarkdownPreferred(request)
  ) {
    url.pathname += '.md';

    // this URL has two representations, selected by `Accept`
    throw redirect({ href: url.href, headers: { Vary: 'Accept' } });
  }

  return next();
});

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [csrfMiddleware, llmMiddleware],
  };
});
