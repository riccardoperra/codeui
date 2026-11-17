/**
 * Authored defaults and descriptions for generated props tables, keyed by projection name, then prop.
 * `type` replaces a shown type that is still too long after the generator shortens it. The table
 * keeps the full type behind it.
 */
export type PropNotes = Record<string, Record<string, { default?: string; description?: string; type?: string }>>;
