import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { useSolidDemo } from './solid-demo';

/** One row of a page's Anatomy table that has a `data-cui` marker. remark-kit passes them in table order. */
export type AnatomyPart = { name: string; cui: string; key: string | null };

type Box = { x: number; y: number; w: number; h: number };
type Point = { x: number; y: number };
type Callout = { box: Box; marker: Point; anchor: Point; line: string };

/**
 * At or above this stage width, markers sit in a left and a right gutter with leader lines. The
 * gutter matches the stage padding in anatomy.css. Below it (a phone) a gutter squeezes the demo and
 * bundles a dozen leaders into one fan, and markers pinned on the parts cover their text. So a narrow
 * figure shows the bare demo over a numbered legend, and the legend row that is hovered, focused or
 * tapped outlines its part and pins its number on it.
 */
const WIDE = 560;
const GUTTER = 56;
const STEP = 22;

/** A part counts as drawn when it has an area and is not clipped away (visually hidden inputs). */
function boxOf(el: Element, stage: DOMRect): Box | null {
  const r = el.getBoundingClientRect();
  if (r.width < 2 || r.height < 2) return null;
  if (getComputedStyle(el).clipPath !== 'none' || getComputedStyle(el).clip.startsWith('rect')) return null;
  return { x: r.left - stage.left, y: r.top - stage.top, w: r.width, h: r.height };
}

/** Spreads marker positions `ys` (sorted) at least STEP apart inside [min, max]. */
function spread(ys: number[], min: number, max: number) {
  const out = [...ys];
  for (let i = 0; i < out.length; i++) out[i] = Math.max(out[i], i ? out[i - 1] + STEP : min);
  for (let i = out.length - 1; i >= 0; i--) out[i] = Math.min(out[i], i < out.length - 1 ? out[i + 1] - STEP : max);
  return out;
}

/** A narrow figure's callouts: the marker on the part's top-left corner, kept inside the stage. */
function pinned(boxes: (Box | null)[], width: number, height: number): (Callout | null)[] {
  const clamp = (v: number, max: number) => Math.min(Math.max(v, 11), max - 11);
  return boxes.map((box) =>
    box ? { box, marker: { x: clamp(box.x, width), y: clamp(box.y, height) }, anchor: { x: box.x, y: box.y }, line: '' } : null,
  );
}

function layout(boxes: (Box | null)[], width: number, height: number): (Callout | null)[] {
  if (width < WIDE) return pinned(boxes, width, height);
  const out: (Callout | null)[] = boxes.map(() => null);
  const drawn = boxes.flatMap((box, i) => (box ? [{ box, i }] : []));
  const gutter = GUTTER;
  // A part goes to the gutter on its side. A wide part (a root, a block label) goes left, where its
  // text starts. A side that runs out of room hands its most central parts to the other side.
  const centre = (box: Box) => box.x + box.w / 2;
  const right = (box: Box) => box.w < width / 2 && centre(box) > width * 0.55;
  const room = Math.max(1, Math.floor((height - 24) / STEP) + 1);
  const sides = { l: drawn.filter((d) => !right(d.box)), r: drawn.filter((d) => right(d.box)) };
  const byCentre = (a: { box: Box }, b: { box: Box }) => centre(a.box) - centre(b.box);
  sides.l.sort(byCentre);
  sides.r.sort(byCentre);
  while (sides.l.length > room && sides.r.length < room) sides.r.unshift(sides.l.pop()!);
  while (sides.r.length > room && sides.l.length < room) sides.l.push(sides.r.shift()!);
  for (const [side, group] of [['l', sides.l], ['r', sides.r]] as const) {
    const anchors = group
      .map(({ box, i }) => ({ i, box, x: side === 'l' ? box.x : box.x + box.w, y: box.y + Math.min(box.h / 2, 14) }))
      .sort((a, b) => a.y - b.y);
    const ys = spread(anchors.map((a) => a.y), 12, height - 12);
    anchors.forEach((a, k) => {
      const mx = side === 'l' ? gutter / 2 - 6 : width - gutter / 2 + 6;
      const ex = side === 'l' ? Math.min(a.x, gutter - 8) : Math.max(a.x, width - gutter + 8);
      const tip = side === 'l' ? mx + 11 : mx - 11;
      out[a.i] = { box: a.box, marker: { x: mx, y: ys[k] }, anchor: { x: a.x, y: a.y }, line: `M${a.x},${a.y}H${ex}L${tip},${ys[k]}` };
    });
  }
  return out;
}

/**
 * The live demo with numbered callouts on each part it renders. Parts are found by their `data-cui`
 * marker, so the drawing follows the kit's markup. A part the demo does not render logs an error,
 * which the docs crawler reports.
 */
export function Anatomy({ demo, parts }: { demo: string; parts: AnatomyPart[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLElement | null>(null);
  const observeRef = useRef<() => void>(() => {});
  const [callouts, setCallouts] = useState<(Callout | null)[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [active, setActive] = useState<number | null>(null);

  const measure = useCallback(() => {
    const stage = stageRef.current;
    const host = hostRef.current;
    if (!stage || !host) return;
    const rect = stage.getBoundingClientRect();
    const boxes = parts.map((p) => {
      const el = host.querySelector(`[data-cui="${p.cui}"]`);
      return el ? boxOf(el, rect) : null;
    });
    setSize({ w: rect.width, h: rect.height });
    setCallouts(layout(boxes, rect.width, rect.height));
  }, [parts]);

  const live = useSolidDemo(demo, (host) => {
    hostRef.current = host;
    const missing = parts.filter((p) => !host.querySelector(`[data-cui="${p.cui}"]`)).map((p) => p.cui);
    if (missing.length) console.error(`Anatomy ${demo}: the demo renders no ${missing.join(', ')}.`);
    observeRef.current();
    measure();
  });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    // The stage keeps its size when a part inside it changes (a list that sizes itself, a font that
    // loads), so every part is observed too. Attribute changes in the demo (an overlay positioned
    // by inline style) move parts without resizing them.
    const resize = new ResizeObserver(schedule);
    const observeParts = () => {
      resize.disconnect();
      resize.observe(stage);
      hostRef.current?.querySelectorAll('[data-cui]').forEach((el) => resize.observe(el));
    };
    observeParts();
    observeRef.current = observeParts;
    const mutate = new MutationObserver((records) => {
      if (records.some((r) => r.type === 'childList')) observeParts();
      schedule();
    });
    const demo = stage.querySelector('.cui-anatomy__demo');
    if (demo) mutate.observe(demo, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class', 'hidden', 'data-expanded', 'data-closed'] });
    document.fonts?.ready.then(schedule);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      mutate.disconnect();
    };
  }, [measure]);

  const pick = (i: number | null) => ({
    onMouseEnter: () => setActive(i),
    onMouseLeave: () => setActive(null),
  });
  // A phone has no hover: a tap or focus outlines the part, a second tap clears it.
  const select = (i: number) => ({
    ...pick(i),
    tabIndex: 0,
    onFocus: () => setActive(i),
    onBlur: () => setActive(null),
    onClick: () => setActive((current) => (current === i ? null : i)),
  });
  const wide = size.w >= WIDE;
  const shown = (c: Callout | null, i: number): c is Callout => !!c && (wide || active === i);
  const number = (i: number) => String(i + 1).padStart(2, '0');
  // Reserve the gutter height for every marker before the demo is measured, so nothing moves.
  const rows = { '--anatomy-rows': Math.ceil(parts.length / 2) };

  return (
    <figure className="ink cui-anatomy not-prose" data-anatomy={demo}>
      {live.hydration}
      <div ref={stageRef} className="cui-anatomy__stage" style={rows as CSSProperties}>
        <div {...live.host} className="cui-anatomy__demo" inert />
        <svg className="cui-anatomy__lines" width={size.w} height={size.h} aria-hidden="true">
          {callouts.map((c, i) =>
            shown(c, i) ? (
              <g key={parts[i].cui} data-part={parts[i].cui} data-active={active === i ? '' : undefined}>
                {active === i ? (
                  <rect x={c.box.x + 0.5} y={c.box.y + 0.5} width={c.box.w - 1} height={c.box.h - 1} rx={4} />
                ) : null}
                {c.line ? <path d={c.line} /> : null}
                {c.line ? <circle cx={c.anchor.x} cy={c.anchor.y} r={2} /> : null}
              </g>
            ) : null,
          )}
        </svg>
        {callouts.map((c, i) =>
          shown(c, i) ? (
            <span
              key={parts[i].cui}
              className="cui-anatomy__marker"
              aria-hidden="true"
              data-active={active === i ? '' : undefined}
              style={{ left: c.marker.x, top: c.marker.y }}
              {...pick(i)}
            >
              {number(i)}
            </span>
          ) : null,
        )}
      </div>
      <p className="cui-anatomy__hint">Tap a part to outline it in the demo.</p>
      <ol className="cui-anatomy__legend">
        {parts.map((p, i) => (
          <li
            key={p.cui}
            data-part={p.cui}
            data-active={active === i ? '' : undefined}
            data-hidden={callouts.length && !callouts[i] ? '' : undefined}
            {...select(i)}
          >
            <b>{number(i)}</b>
            <span className="cui-anatomy__name">{p.name}</span>
            <span className="cui-anatomy__codes">
              <code>{p.cui}</code>
              {p.key ? <code>{p.key.includes('.') ? p.key : `classes.${p.key}`}</code> : null}
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
