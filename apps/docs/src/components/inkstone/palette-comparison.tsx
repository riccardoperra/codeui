import { useState } from 'react';
import { Btn, Field, Float, Island, Page, Row } from './mocks';
import '../../../.generated/inkstone-palette.css';

export function PaletteComparison() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [palette, setPalette] = useState<'compatible' | 'shared-gray'>('compatible');

  return (
    <div className="not-prose palette-comparison">
      <div className="palette-comparison__controls">
        <label>
          Palette
          <select
            value={palette}
            onChange={(event) => setPalette(event.target.value === 'shared-gray' ? 'shared-gray' : 'compatible')}
          >
            <option value="compatible">Compatible</option>
            <option value="shared-gray">Shared grey ramp</option>
          </select>
        </label>
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
        data-cui-palette={palette}
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
