import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import { PropsTable } from './props-table';
import { SolidDemo } from './solid-demo';
import { Anatomy } from './anatomy';
import { Do, DoDont, Dont, Figure } from './inkstone/frame';
import * as InkArt from './inkstone/art';
import * as InkFigures from './inkstone/figures';
import { PaletteComparison } from './inkstone/palette-comparison';
import { ColourPalette, PaletteMatrix } from './inkstone/colour-palette';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    SolidDemo,
    Anatomy,
    Figure,
    DoDont,
    Do,
    Dont,
    ...InkArt,
    ...InkFigures,
    PaletteComparison,
    ColourPalette,
    PaletteMatrix,
    TypeTable,
    PropsTable,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
