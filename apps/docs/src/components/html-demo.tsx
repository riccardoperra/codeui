import { useEffect, useRef, useState } from 'react';
import {
  frameDocument,
  htmlDemos,
  observeDocsTheme,
  readDocsTheme,
  type FrameDensity,
  type FrameTheme,
} from '@/lib/html-demos';
import { HtmlSource } from './html-source';

type CssFrameProps = {
  html: string;
  /** Follows the docs theme when omitted. */
  theme?: FrameTheme;
  density?: FrameDensity;
  /** The smallest frame height. Overlay demos need room, because fixed content does not add to the page height. */
  minHeight?: number;
  title: string;
  className?: string;
};

/**
 * Renders HTML in a sandboxed iframe that loads only `@codeui/styles/all.css`. The sandbox has no
 * `allow-scripts`, so nothing in the frame can run JavaScript.
 */
export function CssFrame({ html, theme, density, minHeight = 96, title, className }: CssFrameProps) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [docsTheme, setDocsTheme] = useState<FrameTheme | null>(null);
  const [height, setHeight] = useState(minHeight);
  const resolvedTheme = theme ?? docsTheme;
  const themeRef = useRef(resolvedTheme);
  themeRef.current = resolvedTheme;
  const readTheme = () => themeRef.current;

  useEffect(() => {
    setDocsTheme(readDocsTheme());
    return observeDocsTheme(setDocsTheme);
  }, []);

  // The document is written once per markup or density change. A theme change only flips the
  // attribute on the live document, so the frame does not reload and flash.
  const [srcDoc, setSrcDoc] = useState<string | null>(null);
  useEffect(() => {
    if (!resolvedTheme) return;
    setSrcDoc(frameDocument(html, { theme: resolvedTheme, density }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html, density, resolvedTheme === null]);

  useEffect(() => {
    const doc = ref.current?.contentDocument;
    if (resolvedTheme && doc?.documentElement) doc.documentElement.setAttribute('data-cui-theme', resolvedTheme);
  }, [resolvedTheme]);

  const observer = useRef<ResizeObserver | null>(null);
  useEffect(() => () => observer.current?.disconnect(), []);
  const onLoad = () => {
    const doc = ref.current?.contentDocument;
    if (!doc?.body) return;
    const current = readTheme();
    if (current) doc.documentElement.setAttribute('data-cui-theme', current);
    const measure = () => setHeight(Math.max(minHeight, Math.ceil(doc.documentElement.getBoundingClientRect().height)));
    observer.current?.disconnect();
    observer.current = new ResizeObserver(measure);
    observer.current.observe(doc.body);
    measure();
  };

  return (
    <iframe
      ref={ref}
      title={title}
      sandbox="allow-same-origin"
      srcDoc={srcDoc ?? undefined}
      onLoad={onLoad}
      className={className}
      style={{ display: 'block', width: '100%', height, border: 0, colorScheme: 'normal' }}
    />
  );
}

/**
 * A CSS-only demo from `apps/docs/html-demos/<name>.html`, followed by its HTML source. The Markdown
 * route gets the same source as a code block (see `remark-kit.ts`).
 */
export function HtmlDemo({ name, minHeight }: { name: string; minHeight?: number }) {
  const html = htmlDemos[name];
  if (html === undefined) throw new Error(`Unknown HTML demo: ${name}`);
  return (
    <>
      <div className="not-prose my-6 overflow-hidden rounded-2xl bg-fd-card">
        <CssFrame html={html} minHeight={minHeight} title={`${name} demo`} />
      </div>
      <HtmlSource name={name} source={html} />
    </>
  );
}
