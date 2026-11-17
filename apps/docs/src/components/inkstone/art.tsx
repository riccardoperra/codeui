import type { CSSProperties } from 'react';
import {
  Btn,
  Dot,
  Field,
  Float,
  Head,
  Inset,
  Island,
  Line,
  OptionCard,
  Page,
  Row,
  Seg,
  Setting,
  Switch,
  Tag,
  Work,
} from './mocks';

const border = '1px solid color-mix(in srgb, var(--ink-t2) 45%, transparent)';
const flat: CSSProperties = { background: 'var(--ink-page)', borderRadius: 4 };

/* Colour */

export function ArtIslandsDo() {
  return (
    <Page>
      <Island>
        <Head title="Frame" value="64" open />
        <Inset>
          <Setting title="Padding" control={<Seg options={['16', '32', '64']} on={2} />} />
          <Setting title="Visible" control={<Switch on />} />
        </Inset>
      </Island>
      <Island>
        <Head title="Window" value="macOS" />
      </Island>
    </Page>
  );
}

export function ArtIslandsDont() {
  return (
    <Page style={{ ...flat, gap: 0, padding: 0, border }}>
      <div style={{ padding: 8, borderBottom: border }}>
        <Head title="Frame" value="64" open />
      </div>
      <div style={{ padding: 6, borderBottom: border, margin: 6, border }}>
        <Setting title="Padding" control={<Seg options={['16', '32', '64']} on={2} />} style={{ borderBottom: border }} />
        <Setting title="Visible" control={<Switch on />} />
      </div>
      <div style={{ padding: 8 }}>
        <Head title="Window" value="macOS" />
      </div>
    </Page>
  );
}

export function ArtAccentDo() {
  return (
    <Page>
      <Island>
        <Float>
          <Row label="Fleet Dark" selected end="✓" />
          <Row label="Dracula" />
          <Row label="Night Owl" />
        </Float>
        <Setting title="Line numbers" control={<Switch on />} />
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          <Btn>Copy</Btn>
          <Btn kind="primary">Export</Btn>
        </div>
      </Island>
    </Page>
  );
}

export function ArtAccentDont() {
  return (
    <Page>
      <Island>
        <Float>
          <Row label="Fleet Dark" selected="accent" end="✓" />
          <Row label={<span style={{ color: 'var(--ink-accent)' }}>Dracula</span>} />
          <Row label={<span style={{ color: 'var(--ink-accent)' }}>Night Owl</span>} />
        </Float>
        <Setting title={<span style={{ color: 'var(--ink-accent)' }}>Line numbers</span>} control={<Switch on />} />
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          <Btn kind="primary">Copy</Btn>
          <Btn kind="primary">Export</Btn>
        </div>
      </Island>
    </Page>
  );
}

export function ArtTextDo() {
  return (
    <Page>
      <Island>
        <Inset>
          <Setting title="Language" sub="Menus and labels." control={<Seg options={['IT', 'EN']} on={1} />} />
          <Setting title="Colour mode" sub="Dark, light or system." control={<Seg options={['Dark', 'Light']} on={0} />} />
        </Inset>
      </Island>
    </Page>
  );
}

export function ArtTextDont() {
  const loud: CSSProperties = { color: 'var(--ink-t1)', fontWeight: 600, fontSize: 11 };
  return (
    <Page>
      <Island>
        <Inset>
          <Setting
            title={<span style={{ fontWeight: 700, fontSize: 13 }}>Language</span>}
            sub={<span style={loud}>Menus and labels.</span>}
            control={<Seg options={['IT', 'EN']} on={1} />}
          />
          <Setting
            title={<span style={{ fontWeight: 700, fontSize: 13 }}>Colour mode</span>}
            sub={<span style={loud}>Dark, light or system.</span>}
            control={<Seg options={['Dark', 'Light']} on={0} />}
          />
        </Inset>
      </Island>
    </Page>
  );
}

export function ArtOnDo() {
  return (
    <Page>
      <Island style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
        <Btn kind="primary">▶ Play</Btn>
        <Btn style={{ background: 'var(--ink-wash)', color: 'var(--cui-action-brand-soft-text)' }}>Animate</Btn>
      </Island>
    </Page>
  );
}

export function ArtOnDont() {
  return (
    <Page>
      <Island style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
        <Btn kind="primary">▶ Play</Btn>
        <Btn kind="primary">Animate</Btn>
      </Island>
    </Page>
  );
}

/* Typography */

const durations: Array<[string, string]> = [
  ['Step 1', '1.11 s'],
  ['Step 2', '0.80 s'],
  ['Step 3', '10.48 s'],
  ['Step 4', '4.70 s'],
];

export function ArtNumbers(props: { tabular?: boolean }) {
  return (
    <Page>
      <Island>
        <Float>
          {durations.map(([l, d]) => (
            <Row
              key={l}
              label={l}
              end={
                <span
                  style={{
                    fontVariantNumeric: props.tabular ? 'tabular-nums' : 'proportional-nums',
                    display: 'inline-block',
                    minWidth: 52,
                    textAlign: 'right',
                    color: 'var(--ink-t1)',
                  }}
                >
                  {d}
                </span>
              }
            />
          ))}
        </Float>
      </Island>
    </Page>
  );
}

export function ArtTruncate(props: { good?: boolean }) {
  const label = props.good ? 'Background' : 'Backgr…';
  const value = props.good ? 'linear-gradient(152…' : 'linear-gradient(152deg, #de9b6e 0%)';
  return (
    <Page>
      <Island>
        <div style={{ display: 'grid', gridTemplateColumns: props.good ? '84px 1fr' : '52px 1fr', alignItems: 'center', gap: 8, padding: '0 6px' }}>
          <span className="m-sub" style={{ color: 'var(--ink-t2)' }}>{label}</span>
          <Field>
            <span style={{ width: 12, height: 12, borderRadius: 4, background: 'linear-gradient(152deg,#de9b6e,#7d24f2)', flex: 'none' }} />
            <span style={{ color: 'var(--ink-t1)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
          </Field>
        </div>
      </Island>
    </Page>
  );
}

/* Space and shape */

export function ArtProximity(props: { good?: boolean }) {
  return (
    <Page>
      <Island style={{ gap: props.good ? 16 : 4 }}>
        {['Frame', 'Window'].map((g) => (
          <div key={g} style={{ display: 'grid', gap: props.good ? 4 : 14 }}>
            <span className="m-sub" style={{ padding: '0 6px', fontWeight: 600 }}>{g}</span>
            <Inset style={{ gap: props.good ? 0 : 10 }}>
              <Setting title="Padding" control={<Seg options={['16', '64']} on={1} />} />
              <Setting title="Shadow" control={<Switch on />} />
            </Inset>
          </div>
        ))}
      </Island>
    </Page>
  );
}

export function ArtElevation(props: { good?: boolean }) {
  const lifted: CSSProperties | undefined = props.good
    ? undefined
    : {
        background: 'var(--ink-field)',
        boxShadow: '0 12px 28px rgb(0 0 0 / 0.55), 0 2px 6px rgb(0 0 0 / 0.4), inset 0 1px 0 rgb(255 255 255 / 0.08)',
      };
  return (
    <Page style={{ position: 'relative' }}>
      <Island style={lifted}>
        <Head title="Background" value="Gradient" />
        <Field>Search…</Field>
      </Island>
      <Island style={lifted}>
        <Head title="Window" value="macOS" />
      </Island>
      <Float style={{ position: 'absolute', right: 18, top: 70, width: 130 }}>
        <Row label="Card" />
        <Row label="Editor" selected />
        <Row label="Terminal" />
      </Float>
    </Page>
  );
}

/* Layout */

export function ArtOverlayDo() {
  return (
    <Page style={{ position: 'relative' }}>
      <Island>
        <Setting title="Aspect ratio" control={<Btn>Free ▾</Btn>} />
        <Setting title="Background" control={<Btn>Gradient ▾</Btn>} />
        <Setting title="Signature" control={<Btn>Off ▾</Btn>} />
      </Island>
      <Float style={{ position: 'absolute', right: 14, top: 46, width: 150, zIndex: 1 }}>
        <Row label="Gradient" selected end="✓" />
        <Row label="Colour" />
        <Row label="Image" />
      </Float>
    </Page>
  );
}

export function ArtOverlayDont() {
  return (
    <Page>
      <Island>
        <Setting title="Aspect ratio" control={<Btn>Free ▾</Btn>} />
        <Setting title="Background" control={<Btn>Gradient ▴</Btn>} />
        <Inset>
          <Row label="Gradient" selected end="✓" />
          <Row label="Colour" />
          <Row label="Image" />
        </Inset>
        <Setting
          title={<span>Signature <span style={{ color: 'var(--ink-dont)', fontWeight: 400 }}>↓ pushed</span></span>}
          control={<Btn>Off ▾</Btn>}
        />
      </Island>
    </Page>
  );
}

export function ArtStillDo() {
  return (
    <Page style={{ maxWidth: 300 }}>
      <Island style={{ position: 'relative', padding: '14px 14px 52px' }}>
        <Work />
        <Float style={{ position: 'absolute', left: 14, right: 14, bottom: 10, gridAutoFlow: 'column', justifyContent: 'center' }}>
          <Btn kind="ghost">▶</Btn>
          <Btn kind="ghost">0:02</Btn>
          <Btn kind="ghost">Steps</Btn>
        </Float>
      </Island>
    </Page>
  );
}

export function ArtStillDont() {
  return (
    <Page style={{ maxWidth: 300 }}>
      <Island style={{ padding: 14, gap: 8 }}>
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 6,
              outline: '1.5px dashed var(--ink-dont)',
              transform: 'translateY(26px)',
              opacity: 0.8,
            }}
          />
          <Work style={{ transform: 'scale(0.86)', transformOrigin: 'top center' }} />
        </div>
        <Inset style={{ gridAutoFlow: 'column', justifyContent: 'center' }}>
          <Btn kind="ghost">▶</Btn>
          <Btn kind="ghost">0:02</Btn>
          <Btn kind="ghost">Steps</Btn>
        </Inset>
      </Island>
    </Page>
  );
}

/* Patterns */

export function ArtActionsDo() {
  return (
    <Page>
      <Float style={{ padding: 12, gap: 10 }}>
        <span className="m-title" style={{ fontSize: 13, fontWeight: 600 }}>Export image</span>
        <Line w={90} tone={2} />
        <Line w={60} tone={2} />
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 6 }}>
          <Btn kind="ghost">✎ Alt text</Btn>
          <span style={{ flex: 1 }} />
          <Btn>Close</Btn>
          <Btn kind="primary">Export</Btn>
        </div>
      </Float>
    </Page>
  );
}

export function ArtActionsDont() {
  return (
    <Page>
      <Float style={{ padding: 12, gap: 8 }}>
        <span className="m-title" style={{ fontSize: 13, fontWeight: 600 }}>Export image</span>
        <Line w={90} tone={2} />
        <Line w={60} tone={2} />
        <Btn full style={{ marginTop: 6 }}>✎ Add alt text</Btn>
        <Btn full kind="primary">Export</Btn>
        <Btn full>Close</Btn>
      </Float>
    </Page>
  );
}

function Schematic(props: { a: string; b: string; bg: string }) {
  return (
    <span style={{ display: 'grid', gap: 2, width: 46, padding: 4, borderRadius: 4, background: props.bg }}>
      <span style={{ height: 3, width: '60%', borderRadius: 2, background: props.a }} />
      <span style={{ height: 3, width: '85%', borderRadius: 2, background: props.b }} />
      <span style={{ height: 3, width: '45%', borderRadius: 2, background: props.a }} />
    </span>
  );
}

function Miniature() {
  return (
    <span style={{ display: 'grid', gap: 1, width: 46, padding: 3, borderRadius: 3, background: '#1d1d1f', fontFamily: 'var(--ink-mono)', fontSize: 3.5, lineHeight: 1.2, color: '#9ca3af', overflow: 'hidden' }}>
      <span>function Count() {'{'}</span>
      <span>&nbsp;const [c, s] =</span>
      <span>&nbsp;return {'<'}div{'>'}</span>
    </span>
  );
}

export function ArtCards(props: { good?: boolean }) {
  const themes: Array<[string, string, string, string]> = [
    ['Fleet', '#7dd3fc', '#f9a8d4', '#1e1e24'],
    ['Dracula', '#bd93f9', '#50fa7b', '#282a36'],
    ['Night Owl', '#82aaff', '#c792ea', '#011627'],
  ];
  return (
    <Page>
      <Island style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {themes.map(([n, a, b, bg], i) => (
          <OptionCard key={n} name={n} selected={i === 0}>
            {props.good ? <Schematic a={a} b={b} bg={bg} /> : <Miniature />}
          </OptionCard>
        ))}
      </Island>
    </Page>
  );
}

export function ArtNew(props: { good?: boolean }) {
  return (
    <Page>
      <Island>
        <Setting title="Line marks" control={props.good ? <Dot /> : <Tag>NEW</Tag>} />
        <Setting title="Signature" control={props.good ? <Dot /> : <Tag>NEW</Tag>} />
        {props.good ? null : (
          <Float style={{ padding: 10 }}>
            <span className="m-title">Settings has 7 new things</span>
            <Btn kind="primary" style={{ justifySelf: 'start' }}>Open settings</Btn>
          </Float>
        )}
      </Island>
    </Page>
  );
}
