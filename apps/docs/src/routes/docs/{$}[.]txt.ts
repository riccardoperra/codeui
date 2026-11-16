import { createFileRoute } from '@tanstack/react-router';
import { docsLlms } from '@/lib/source';

// Fumadocs serves page Markdown only under `.md`. The `.txt` alias returns the same text as plain text.
export const Route = createFileRoute('/docs/{$}.txt')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const markdown = await docsLlms.serve(new URL(request.url).pathname.replace(/\.txt$/, '.md'));
        if (!markdown) return new Response(null, { status: 404 });
        return new Response(await markdown.text(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      },
    },
  },
});
