import { createFileRoute } from '@tanstack/react-router';
import { kitFull, text } from '@/lib/llms';

export const Route = createFileRoute('/llms-full.txt')({
  server: {
    handlers: {
      GET: async () => text(await kitFull()),
    },
  },
});
