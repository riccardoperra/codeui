import type { CSSProperties, ReactNode } from 'react';

type Box = { children?: ReactNode; style?: CSSProperties };

export function Page(props: Box) {
  return <div className="m-page" style={props.style}>{props.children}</div>;
}

export function Island(props: Box) {
  return <div className="m-island" style={props.style}>{props.children}</div>;
}

export function Inset(props: Box) {
  return <div className="m-inset" style={props.style}>{props.children}</div>;
}

export function Float(props: Box) {
  return <div className="m-float" style={props.style}>{props.children}</div>;
}

export function Field(props: Box) {
  return <div className="m-field" style={props.style}>{props.children}</div>;
}

export function Row(props: {
  label: ReactNode;
  end?: ReactNode;
  selected?: boolean | 'accent';
  lead?: boolean;
  style?: CSSProperties;
}) {
  const selected = props.selected === 'accent' ? 'accent' : props.selected ? '' : undefined;
  return (
    <div className="m-row" data-selected={selected} style={props.style}>
      {props.lead === false ? null : <span className="m-row__lead" />}
      <span>{props.label}</span>
      {props.end ? <span className="m-row__end">{props.end}</span> : null}
    </div>
  );
}

export function Setting(props: { title: ReactNode; sub?: ReactNode; control?: ReactNode; style?: CSSProperties }) {
  return (
    <div className="m-setting" style={props.style}>
      <div className="m-setting__text">
        <span className="m-title">{props.title}</span>
        {props.sub ? <span className="m-sub">{props.sub}</span> : null}
      </div>
      {props.control}
    </div>
  );
}

export function Head(props: { title: ReactNode; value?: ReactNode; open?: boolean; style?: CSSProperties }) {
  return (
    <div className="m-head" data-open={props.open ? '' : undefined} style={props.style}>
      <span className="m-head__icon" />
      <span>{props.title}</span>
      {props.value ? <span className="m-head__value">{props.value}</span> : null}
      <span className="m-head__chev" />
    </div>
  );
}

export function Line(props: { w: number | string; tone?: 1 | 2; style?: CSSProperties }) {
  return (
    <span
      className="m-line"
      data-tone={props.tone === 2 ? '2' : undefined}
      style={{ width: typeof props.w === 'number' ? `${props.w}%` : props.w, display: 'block', ...props.style }}
    />
  );
}

export function Btn(props: {
  kind?: 'primary' | 'neutral' | 'ghost' | 'danger';
  full?: boolean;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <span
      className="m-btn"
      data-kind={props.kind ?? 'neutral'}
      data-full={props.full ? '' : undefined}
      style={props.style}
    >
      {props.children}
    </span>
  );
}

export function Seg(props: { options: string[]; on: number; style?: CSSProperties }) {
  return (
    <span className="m-seg" style={props.style}>
      {props.options.map((o, i) => (
        <span key={o} data-on={i === props.on ? '' : undefined}>
          {o}
        </span>
      ))}
    </span>
  );
}

export function Switch(props: { on?: boolean }) {
  return <span className="m-switch" data-on={props.on ? '' : undefined} />;
}

export function Tag(props: { children: ReactNode }) {
  return <span className="m-tag">{props.children}</span>;
}

export function Dot(props: { style?: CSSProperties }) {
  return <span className="m-dot" style={props.style} />;
}

export function OptionCard(props: { name: string; selected?: boolean; children?: ReactNode }) {
  return (
    <div className="m-card" data-selected={props.selected ? '' : undefined}>
      <div className="m-card__well">{props.children}</div>
      <span className="m-title" style={{ fontSize: 10.5 }}>{props.name}</span>
    </div>
  );
}

export function Work(props: { style?: CSSProperties }) {
  return (
    <div className="m-work" style={props.style}>
      <div className="m-work__window">
        <div className="m-work__dots">
          <i />
          <i />
          <i />
        </div>
        <span className="m-work__code" style={{ width: '70%' }} />
        <span className="m-work__code" style={{ width: '90%' }} />
        <span className="m-work__code" style={{ width: '55%' }} />
        <span className="m-work__code" style={{ width: '40%' }} />
      </div>
    </div>
  );
}
