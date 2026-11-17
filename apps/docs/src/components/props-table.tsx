import { TypeTable } from 'fumadocs-ui/components/type-table';

/** One prop, as scripts/generate-props.mjs writes it. remark-kit passes the rows of one table. */
export type PropRow = {
  name: string;
  type: string;
  fullType: string | null;
  typeLink: string | null;
  default: string | null;
  required: boolean;
  deprecated: boolean;
  description: string;
};

/** Text with `code` spans, as JSDoc writes it. */
const phrasing = (text: string) =>
  text.split(/`([^`]+)`/).map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part));

export function PropsTable({ rows }: { name: string; rows: PropRow[] }) {
  return (
    <TypeTable
      type={Object.fromEntries(
        rows.map((row) => [
          row.name,
          {
            type: <code>{row.type}</code>,
            // The type column is hidden in a narrow table, so the detail always carries the type.
            typeDescription: <code>{row.fullType ?? row.type}</code>,
            typeDescriptionLink: row.typeLink ?? undefined,
            default: row.default ? <code>{row.default}</code> : undefined,
            required: row.required,
            deprecated: row.deprecated,
            description: phrasing(row.description),
          },
        ]),
      )}
    />
  );
}
