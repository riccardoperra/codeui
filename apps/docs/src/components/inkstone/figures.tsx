import { useState, type ReactNode } from 'react';
import { Figure, Pinned } from './frame';
import { Btn, Field, Float, Head, Inset, Island, Page, Row, Seg, Setting, Switch, Tag, Work } from './mocks';

export function FigInkstone(props: { n?: number; caption?: ReactNode }) {
  return (
    <Figure
      n={props.n ?? 1}
      title="The stone and the ink"
      caption={props.caption}
      legend={[
        ['Page', 'The lightest surface. The header sits directly on it.'],
        ['Island', 'Carved into the page: darker, borderless, no shadow.'],
        ['The work', "The user's content. The only colourful thing on screen."],
        ['Panel', 'Controls on their own island, quiet and grey.'],
        ['One signal', 'Blue only for the single primary action.'],
      ]}
    >
      <Pinned n={1} style={{ width: '100%', maxWidth: 520 }}>
        <Page style={{ maxWidth: 520, gridTemplateColumns: '1fr 150px', gridTemplateRows: 'auto 1fr' }}>
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 6, padding: '0 4px' }}>
            <span className="m-title" style={{ fontWeight: 600 }}>CodeImage</span>
            <span style={{ flex: 1 }} />
            <Btn kind="ghost">⌘K</Btn>
            <Pinned n={5} at="tr">
              <Btn kind="primary">Export</Btn>
            </Pinned>
          </div>
          <Pinned n={2} style={{ display: 'grid' }}>
            <Island style={{ padding: 22, placeItems: 'center' }}>
              <Pinned n={3} at="tr" style={{ width: '100%', maxWidth: 220 }}>
                <Work />
              </Pinned>
            </Island>
          </Pinned>
          <Pinned n={4} at="tr" style={{ display: 'grid' }}>
            <Island>
              <Head title="Theme" value="Fleet" />
              <Head title="Frame" value="64" open />
              <Inset>
                <Setting title="Visible" control={<Switch on />} />
              </Inset>
              <Head title="Window" />
            </Island>
          </Pinned>
        </Page>
      </Pinned>
    </Figure>
  );
}

export function FigSurfaces(props: { n?: number; caption?: ReactNode }) {
  return (
    <Figure
      n={props.n ?? 2}
      title="Surface levels"
      caption={props.caption}
      legend={[
        ['Page', '#151516 in dark. Behind everything.'],
        ['Island', '#0f0f10. Recessed into the page.'],
        ['Inset', 'The open section, back to the page colour.'],
        ['Field', '#232323. Fields, tiles, hover and selection.'],
        ['Floating', '#1d1d1d with a ring and a shadow. Menus and dialogs.'],
      ]}
    >
      <div style={{ position: 'relative', width: '100%', maxWidth: 380, paddingRight: 40 }}>
        <Pinned n={1} at="tl">
          <Page>
            <Pinned n={2} at="tr" style={{ display: 'grid' }}>
              <Island>
                <Head title="Background" value="Gradient" open />
                <Pinned n={3} at="l" style={{ display: 'grid' }}>
                  <Inset>
                    <Pinned n={4} at="r">
                      <Field>Search themes…</Field>
                    </Pinned>
                    <Setting title="Opacity" control={<Seg options={['50', '100']} on={1} />} />
                  </Inset>
                </Pinned>
              </Island>
            </Pinned>
          </Page>
        </Pinned>
        <div style={{ position: 'absolute', right: 0, bottom: -20, width: 150 }}>
          <Pinned n={5} at="tr">
            <Float>
              <Row label="Gradient" selected end="✓" />
              <Row label="Colour" />
            </Float>
          </Pinned>
        </div>
      </div>
    </Figure>
  );
}

export function FigSettingsRow(props: { n?: number; caption?: ReactNode }) {
  return (
    <Figure
      n={props.n ?? 5}
      title="Anatomy of a settings row"
      caption={props.caption}
      legend={[
        ['Title', '14px, weight 500, primary tone.'],
        ['Description', 'One line, 12px, secondary tone.'],
        ['Control', 'Right-aligned. Segmented, switch or cards.'],
        ['Group island', 'Rows touch inside it. No lines between them.'],
        ['Default tag', 'One word, 11px, on the current default.'],
      ]}
    >
      <div style={{ width: '100%', maxWidth: 440, padding: '0 28px' }}>
        <Page style={{ maxWidth: 440 }}>
          <span className="m-title" style={{ fontSize: 13, fontWeight: 600, padding: '4px 6px 0' }}>Editor</span>
          <Pinned n={4} at="tr" style={{ display: 'grid' }}>
            <Island style={{ gap: 0, padding: '4px 6px' }}>
              <div className="m-setting">
                <div className="m-setting__text">
                  <Pinned n={1} at="l">
                    <span className="m-title">Layout</span>
                  </Pinned>
                  <Pinned n={2} at="l">
                    <span className="m-sub">Where the controls sit.</span>
                  </Pinned>
                </div>
                <Pinned n={3} at="r">
                  <Seg options={['Sidebar', 'Dock']} on={0} />
                </Pinned>
              </div>
              <div className="m-setting">
                <div className="m-setting__text">
                  <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span className="m-title">Navigation</span>
                    <Pinned n={5} at="tr">
                      <Tag>Default</Tag>
                    </Pinned>
                  </span>
                  <span className="m-sub">How the sidebar moves between sections.</span>
                </div>
                <Switch on />
              </div>
            </Island>
          </Pinned>
        </Page>
      </div>
    </Figure>
  );
}

export function FigRadius(props: { n?: number; caption?: ReactNode }) {
  const [pad, setPad] = useState(8);
  const [concentric, setConcentric] = useState(true);
  const outer = 22;
  const inner = concentric ? Math.max(4, outer - pad) : outer;
  const inner2 = concentric ? Math.max(4, inner - 6) : outer;
  return (
    <Figure
      n={props.n ?? 3}
      title="Concentric radius"
      caption={props.caption}
      tools={
        <button type="button" className="ink-tool" onClick={() => setConcentric((c) => !c)} aria-pressed={!concentric}>
          {concentric ? 'Show same radius' : 'Show concentric'}
        </button>
      }
      readout={
        <span>
          outer {outer} − padding {pad} = inner <em>{inner}</em>
          {concentric ? '' : ' · same radius everywhere'}
        </span>
      }
    >
      <div style={{ display: 'grid', gap: 14, justifyItems: 'center', width: '100%' }}>
        <div
          style={{
            width: '100%',
            maxWidth: 300,
            padding: pad,
            borderRadius: outer,
            background: 'var(--ink-island)',
            outline: '1px solid color-mix(in srgb, var(--ink-t2) 25%, transparent)',
          }}
        >
          <div style={{ padding: 6, borderRadius: inner, background: 'var(--ink-page)' }}>
            <div style={{ height: 56, borderRadius: inner2, background: 'var(--ink-field)' }} />
          </div>
        </div>
        <label style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 12, color: 'var(--ink-t2)' }}>
          Padding
          <input
            className="ink-range"
            type="range"
            min={0}
            max={18}
            value={pad}
            onChange={(e) => setPad(Number(e.currentTarget.value))}
          />
          <span style={{ fontVariantNumeric: 'tabular-nums', minWidth: 28 }}>{pad}px</span>
        </label>
      </div>
    </Figure>
  );
}

const lanes: Array<{ name: string; ease: string; best?: boolean; note: string }> = [
  { name: 'Inkstone', ease: 'cubic-bezier(0.23, 1, 0.32, 1)', best: true, note: 'ease-out' },
  { name: 'ease-in', ease: 'cubic-bezier(0.42, 0, 1, 1)', note: 'slow start' },
  { name: 'linear', ease: 'linear', note: 'mechanical' },
];

export function FigEasing(props: { n?: number; caption?: ReactNode }) {
  const [go, setGo] = useState(false);
  return (
    <Figure
      n={props.n ?? 6}
      title="The curve"
      caption={props.caption}
      tools={
        <button type="button" className="ink-tool" onClick={() => setGo((g) => !g)}>
          ↻ Replay
        </button>
      }
      readout={<span>slowed 3× to 600ms so the difference is visible</span>}
    >
      <div className="ink-lanes" data-go={go ? '' : undefined}>
        {lanes.map((l) => (
          <div key={l.name} className="ink-lane" data-best={l.best ? '' : undefined}>
            <span>
              <b>{l.name}</b> · {l.note}
            </span>
            <div className="ink-lane__track">
              <div className="ink-lane__puck" style={{ transition: `transform 600ms ${l.ease}` }} />
            </div>
          </div>
        ))}
      </div>
    </Figure>
  );
}

export function FigPress(props: { n?: number; caption?: ReactNode }) {
  return (
    <Figure n={props.n ?? 7} title="Press" caption={props.caption} readout={<span>press and hold each button</span>}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ display: 'grid', gap: 8, justifyItems: 'center', fontSize: 12, color: 'var(--ink-t2)' }}>
          <button type="button" className="ink-press" data-kind="inkstone">
            Export
          </button>
          <span>Inkstone · 120ms ease-out</span>
        </div>
        <div style={{ display: 'grid', gap: 8, justifyItems: 'center', fontSize: 12, color: 'var(--ink-t2)' }}>
          <button type="button" className="ink-press" data-kind="slow">
            Export
          </button>
          <span>Kit today · 200ms ease</span>
        </div>
      </div>
    </Figure>
  );
}

export function FigPop(props: { n?: number; caption?: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <Figure
      n={props.n ?? 8}
      title="Pop from the trigger"
      caption={props.caption}
      tools={
        <button type="button" className="ink-tool" onClick={() => setOpen((o) => !o)}>
          {open ? 'Close' : 'Open'} both
        </button>
      }
    >
      <div className="ink-pop-stage">
        {(['trigger', 'center'] as const).map((origin) => (
          <div key={origin} className="ink-pop-col">
            <span>{origin === 'trigger' ? 'Grows from its trigger' : 'Grows from its centre'}</span>
            <Btn>Background ▾</Btn>
            <div className="ink-pop" data-open={open ? '' : undefined} data-origin={origin}>
              <Float>
                <Row label="Gradient" selected end="✓" />
                <Row label="Colour" />
              </Float>
            </div>
          </div>
        ))}
      </div>
    </Figure>
  );
}
