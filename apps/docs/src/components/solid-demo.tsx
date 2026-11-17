import { useEffect, useRef } from 'react';

const ssr = import.meta.env.SSR ? await import('@codeui/docs-demos/server') : null;

// Inline demos (a button, a link) sit centered. A flex item sizes to its content, so a block demo
// root (a Stack, an OptionCard grid, a form) gets the full width, or grids collapse to one column
// and width: 100% children resolve to 0.
const blockFill =
  'flex min-h-40 flex-wrap items-center justify-center gap-3 p-8 ' +
  '[&>:is(div,section,form,nav,ul,ol,dl,table,fieldset,article,header,footer,aside,figure)]:w-full';

/** `source="hidden"` stops remark-kit from printing the demo source under it. */
export function SolidDemo({ name }: { name: string; source?: 'hidden' }) {
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
        className={blockFill}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: ssr?.renderDemo(name) ?? '' }}
      />
    </div>
  );
}
