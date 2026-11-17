import { useEffect, useRef, type RefObject } from 'react';

const ssr = import.meta.env.SSR ? await import('@codeui/docs-demos/server') : null;

// Inline demos (a button, a link) sit centered. A flex item sizes to its content, so a block demo
// root (a Stack, an OptionCard grid, a form) gets the full width, or grids collapse to one column
// and width: 100% children resolve to 0.
const blockFill =
  'flex min-h-40 flex-wrap items-center justify-center gap-3 p-8 ' +
  '[&>:is(div,section,form,nav,ul,ol,dl,table,fieldset,article,header,footer,aside,figure)]:w-full';

/**
 * Server-renders the Solid demo `name` into the returned props, then hydrates it in the browser.
 * `onMount` runs once the demo is live, with its host element.
 */
export function useSolidDemo(name: string, onMount?: (host: HTMLElement) => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let dispose: (() => void) | undefined;
    let cancelled = false;
    // A run cleaned up before the import resolves must not mount: under StrictMode its late dispose
    // would empty the element the next run hydrated.
    import('@codeui/docs-demos/client')
      .then((m) => (cancelled ? undefined : m.mount(name, ref.current!)))
      .then((d) => {
        if (!d) return;
        if (cancelled) return d();
        dispose = d;
        onMount?.(ref.current!);
      });
    return () => {
      cancelled = true;
      dispose?.();
    };
    // onMount is read once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);
  return {
    hydration: <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: ssr?.hydrationScript() ?? '' }} />,
    host: {
      ref: ref as RefObject<HTMLDivElement>,
      'data-solid-demo': name,
      suppressHydrationWarning: true,
      dangerouslySetInnerHTML: { __html: ssr?.renderDemo(name) ?? '' },
    },
  };
}

/** `source="hidden"` stops remark-kit from printing the demo source under it. */
export function SolidDemo({ name }: { name: string; source?: 'hidden' }) {
  const demo = useSolidDemo(name);
  return (
    <div className="not-prose my-6 rounded-2xl bg-fd-card">
      {demo.hydration}
      <div {...demo.host} className={blockFill} />
    </div>
  );
}
