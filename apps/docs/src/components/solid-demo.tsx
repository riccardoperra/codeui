import { useEffect, useRef } from 'react';

const ssr = import.meta.env.SSR ? await import('@codeui/docs-demos/server') : null;

export function SolidDemo({ name }: { name: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let dispose: (() => void) | undefined;
    let cancelled = false;
    import('@codeui/docs-demos/client')
      .then((m) => m.mount(name, ref.current!))
      .then((d) => (cancelled ? d() : (dispose = d)));
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [name]);
  return (
    <div className="not-prose my-6 rounded-2xl bg-fd-card">
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: ssr?.hydrationScript() ?? '' }} />
      <div
        ref={ref}
        data-solid-demo={name}
        className="flex min-h-40 flex-wrap items-center justify-center gap-3 p-8"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: ssr?.renderDemo(name) ?? '' }}
      />
    </div>
  );
}
