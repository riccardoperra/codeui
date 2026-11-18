import defaultMdxComponents from 'fumadocs-ui/mdx';
import { tableParts, tableStyles } from '@codeui/styles/table';
import type { ComponentProps } from 'react';
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
import { cn } from '@/lib/cn';

function MdxTable({ className, ...props }: ComponentProps<'table'>) {
  return (
    <div
      className={`mdx-table not-prose my-6 ${tableStyles.scrollArea()}`}
      data-cui={tableParts.scrollArea}
      role="group"
      aria-label="Scrollable table"
      tabIndex={0}
    >
      <table
        {...props}
        className={cn(tableStyles.root(), className)}
        data-cui={tableParts.root}
      />
    </div>
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    table: MdxTable,
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
