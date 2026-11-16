import {
  createContext,
  useContext,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

const PinContext = createContext<{
  active: number | null;
  setActive: (n: number | null) => void;
}>({ active: null, setActive: () => {} });

export function Figure(props: {
  n: number | string;
  title: string;
  caption?: ReactNode;
  readout?: ReactNode;
  tools?: ReactNode;
  legend?: Array<[string, ReactNode]>;
  children: ReactNode;
}) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <PinContext.Provider value={{ active, setActive }}>
      <figure className="ink ink-fig not-prose">
        <div className="ink-fig__head">
          <span className="ink-fig__n">Fig. {props.n}</span>
          <span className="ink-fig__title">{props.title}</span>
          {props.tools ? <span className="ink-fig__tools">{props.tools}</span> : null}
        </div>
        <div className="ink-fig__stage">{props.children}</div>
        {props.legend ? (
          <ol className="ink-legend">
            {props.legend.map(([label, text], i) => (
              <li
                key={label}
                data-active={active === i + 1 ? '' : undefined}
                onMouseEnter={() => setActive(i + 1)}
                onMouseLeave={() => setActive(null)}
              >
                <b>{String(i + 1).padStart(2, '0')}</b>
                <span>
                  <span style={{ color: 'var(--ink-t1)' }}>{label}.</span> {text}
                </span>
              </li>
            ))}
          </ol>
        ) : null}
        {props.readout ? <div className="ink-fig__readout">{props.readout}</div> : null}
        {props.caption ? <figcaption className="ink-fig__caption">{props.caption}</figcaption> : null}
      </figure>
    </PinContext.Provider>
  );
}

export function Pin(props: { n: number; style?: CSSProperties }) {
  const { active, setActive } = useContext(PinContext);
  return (
    <span
      className="m-pin"
      aria-hidden="true"
      data-active={active === props.n ? '' : undefined}
      onMouseEnter={() => setActive(props.n)}
      onMouseLeave={() => setActive(null)}
      style={props.style}
    >
      {String(props.n).padStart(2, '0')}
    </span>
  );
}

const pinAt: Record<string, CSSProperties> = {
  tl: { left: -9, top: -9 },
  tr: { right: -9, top: -9 },
  l: { left: -28, top: '50%', transform: 'translateY(-50%)' },
  r: { right: -28, top: '50%', transform: 'translateY(-50%)' },
};

export function Pinned(props: { n: number; at?: 'tl' | 'tr' | 'l' | 'r'; style?: CSSProperties; children: ReactNode }) {
  return (
    <div style={{ position: 'relative', minWidth: 0, ...props.style }}>
      {props.children}
      <Pin n={props.n} style={pinAt[props.at ?? 'tl']} />
    </div>
  );
}

export function DoDont(props: { children: ReactNode }) {
  return <div className="ink ink-dd not-prose">{props.children}</div>;
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Cross() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
    </svg>
  );
}

function Card(props: { kind: 'do' | 'dont'; note: ReactNode; children: ReactNode }) {
  return (
    <div className="ink-dd__card" data-kind={props.kind}>
      <div className="ink-dd__label">
        {props.kind === 'do' ? <Check /> : <Cross />}
        {props.kind === 'do' ? 'Do' : "Don't"}
      </div>
      <div className="ink-dd__art">{props.children}</div>
      <div className="ink-dd__note">{props.note}</div>
    </div>
  );
}

export function Do(props: { note: ReactNode; children: ReactNode }) {
  return <Card kind="do" note={props.note}>{props.children}</Card>;
}

export function Dont(props: { note: ReactNode; children: ReactNode }) {
  return <Card kind="dont" note={props.note}>{props.children}</Card>;
}
