import { createFileRoute } from '@tanstack/react-router';
import { kitIndex, text } from '@/lib/llms';

export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: () => text(kitIndex()),
    },
  },
});
