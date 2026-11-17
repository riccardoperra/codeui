import type { CSSProperties } from 'react';

type Swatch = { id: string; hex: string; oklch: string };

export type ColourPaletteData = {
  ramps: { name: string; label: string; swatches: Swatch[] }[];
  roles: { name: string; cssToken: string; light: Swatch; dark: Swatch }[];
};

function swatchStyle(swatch: Swatch): CSSProperties & Record<'--swatch-srgb' | '--swatch-oklch', string> {
  return { '--swatch-srgb': swatch.hex, '--swatch-oklch': swatch.oklch };
}

export function ColourPalette({ data }: { data: ColourPaletteData }) {
  return (
    <div className="not-prose colour-palette">
      {data.ramps.map((ramp) => (
        <div className="colour-palette__ramp" key={ramp.name}>
          <p className="colour-palette__label">{ramp.label}</p>
          <ul className="colour-palette__grid" data-family={ramp.name} aria-label={ramp.label}>
            {ramp.swatches.map((swatch) => (
              <li key={swatch.id}>
                <span className="colour-palette__swatch" style={swatchStyle(swatch)} aria-hidden="true" />
                <code>{swatch.id}</code>
                <span>{swatch.hex}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <table className="colour-palette__roles">
        <caption>Theme roles</caption>
        <thead>
          <tr>
            <th scope="col">CSS token</th>
            <th scope="col">Light</th>
            <th scope="col">Dark</th>
          </tr>
        </thead>
        <tbody>
          {data.roles.map(({ name, cssToken, light, dark }) => (
            <tr key={name}>
              <th scope="row">
                {name}
                <code>{cssToken}</code>
              </th>
              {Object.entries({ light, dark }).map(([theme, swatch]) => (
                <td key={theme}>
                  <span className="colour-palette__value">
                    <span className="colour-palette__swatch" style={swatchStyle(swatch)} aria-hidden="true" />
                    <span><code>{swatch.id}</code>{swatch.hex}</span>
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
