import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { htmlDemos, type FrameDensity, type FrameTheme } from '@/lib/html-demos';
import { CssFrame } from './html-demo';

const DEFAULT_PRESET = 'playground/starter';

const groups = Object.keys(htmlDemos).reduce<Record<string, string[]>>((acc, name) => {
  const [group] = name.split('/');
  (acc[group] ??= []).push(name);
  return acc;
}, {});

const label = (name: string) => name.split('/').slice(1).join('/').replace(/-/g, ' ');

const control =
  'h-9 rounded-lg border border-fd-border bg-fd-background px-2.5 text-sm text-fd-foreground ' +
  'focus-visible:outline-2 focus-visible:outline-fd-primary';

/**
 * Edit HTML on the left, see it on the right. The preview frame loads `@codeui/styles/all.css` and
 * runs no scripts, so anything that renders here works with the stylesheet alone.
 */
export function CssPlayground() {
  const [preset, setPreset] = useState(htmlDemos[DEFAULT_PRESET] !== undefined ? DEFAULT_PRESET : Object.keys(htmlDemos)[0]);
  const [source, setSource] = useState(htmlDemos[preset]);
  const [html, setHtml] = useState(source);
  const [theme, setTheme] = useState<FrameTheme | 'docs'>('docs');
  const [density, setDensity] = useState<FrameDensity>('comfortable');
  const [copied, setCopied] = useState(false);
  const escapedRef = useRef(false);

  // Rewriting the frame on every keystroke reloads it. Wait for a short pause in typing.
  useEffect(() => {
    const timer = setTimeout(() => setHtml(source), 250);
    return () => clearTimeout(timer);
  }, [source]);

  const choose = (name: string) => {
    setPreset(name);
    setSource(htmlDemos[name]);
    setHtml(htmlDemos[name]);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab indents inside the editor. Escape first, then Tab, moves focus out as usual.
    const escaped = escapedRef.current;
    escapedRef.current = event.key === 'Escape';
    if (event.key !== 'Tab' || escaped || event.shiftKey || event.altKey || event.metaKey || event.ctrlKey) return;
    const el = event.currentTarget;
    event.preventDefault();
    const { selectionStart: start, selectionEnd: end, value } = el;
    const next = `${value.slice(0, start)}  ${value.slice(end)}`;
    setSource(next);
    requestAnimationFrame(() => el.setSelectionRange(start + 2, start + 2));
  };

  const copy = async () => {
    await navigator.clipboard.writeText(source);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const dirty = source !== htmlDemos[preset];
  const options = useMemo(
    () =>
      Object.entries(groups).map(([group, names]) => (
        <optgroup key={group} label={group.replace(/-/g, ' ')}>
          {names.map((name) => (
            <option key={name} value={name}>
              {label(name)}
            </option>
          ))}
        </optgroup>
      )),
    [],
  );

  return (
    <div className="not-prose my-6 flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs text-fd-muted-foreground">
          Preset
          <select className={control} value={preset} onChange={(e) => choose(e.target.value)}>
            {options}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-fd-muted-foreground">
          Theme
          <select className={control} value={theme} onChange={(e) => setTheme(e.target.value as FrameTheme | 'docs')}>
            <option value="docs">Follow docs</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-fd-muted-foreground">
          Density
          <select className={control} value={density} onChange={(e) => setDensity(e.target.value as FrameDensity)}>
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
            <option value="touch">Touch</option>
          </select>
        </label>
        <div className="ms-auto flex gap-2">
          <button type="button" className={`${control} disabled:opacity-50`} disabled={!dirty} onClick={() => choose(preset)}>
            Reset
          </button>
          <button type="button" className={control} onClick={copy}>
            {copied ? 'Copied' : 'Copy HTML'}
          </button>
        </div>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <textarea
          aria-label="HTML source"
          spellCheck={false}
          wrap="off"
          autoCapitalize="off"
          autoCorrect="off"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          onKeyDown={onKeyDown}
          className="min-h-[480px] w-full resize-y rounded-2xl border border-fd-border bg-fd-card p-4 font-mono text-[13px] leading-relaxed text-fd-foreground focus-visible:outline-2 focus-visible:outline-fd-primary"
        />
        <div className="overflow-hidden rounded-2xl bg-fd-card">
          <CssFrame
            html={html}
            theme={theme === 'docs' ? undefined : theme}
            density={density}
            minHeight={480}
            title="Playground preview"
          />
        </div>
      </div>
      <p className="text-xs text-fd-muted-foreground">
        The preview is a sandboxed frame. It loads <code>@codeui/styles/all.css</code> and blocks scripts, so the
        markup renders with CSS alone. Press Escape, then Tab, to leave the editor.
      </p>
    </div>
  );
}
