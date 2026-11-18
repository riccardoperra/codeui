import { useState } from 'react';
import { Btn, Field, Float, Island, Page, Row } from './mocks';

export function PaletteComparison() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <div className="not-prose palette-comparison">
      <div className="palette-comparison__controls">
        <label>
          Theme
          <select
            value={theme}
            onChange={(event) => setTheme(event.target.value === 'dark' ? 'dark' : 'light')}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>
      <div
        className="ink palette-comparison__stage"
        data-cui-theme={theme}
      >
        <Page>
          <span className="m-title">Export</span>
          <Island>
            <span className="m-sub">Format</span>
            <Field>PNG</Field>
            <Row
              label="JPEG"
              selected
              lead={false}
              end={<span role="img" aria-label="Selected">✓</span>}
              style={{
                background: 'var(--cui-surface-field-hover)',
                outline: '2px solid var(--cui-accent-focus)',
                outlineOffset: -2,
              }}
            />
          </Island>
          <Float>
            <span className="m-title">Save image</span>
            <span className="m-sub">1920 × 1080 px</span>
            <Btn kind="primary" style={{ justifySelf: 'start' }}>Export</Btn>
          </Float>
        </Page>
      </div>
    </div>
  );
}
