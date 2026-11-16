import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import { SolidDemo } from './solid-demo';
import { Do, DoDont, Dont, Figure } from './inkstone/frame';
import * as InkArt from './inkstone/art';
import * as InkFigures from './inkstone/figures';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    SolidDemo,
    Figure,
    DoDont,
    Do,
    Dont,
    ...InkArt,
    ...InkFigures,
    TypeTable,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
