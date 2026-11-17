import type { VirtualizedListboxProps } from "@codeui/kit";
import type { PropNotes } from "./notes";
export type VirtualizedListbox = Pick<VirtualizedListboxProps<never>, "options" | "virtualizerOptions" | "class" | "classes" | "size" | "theme" | "bordered" | "itemLabel">;
export type VirtualizedListboxInherited = Pick<VirtualizedListboxProps<never>, "value" | "defaultValue" | "onChange" | "selectionMode" | "selectionBehavior" | "disallowEmptySelection">;
export const notes = {
 VirtualizedListbox: {
  options: { description: "Flat array of objects with value, label, and optional disabled." },
  virtualizerOptions: { type: "{ estimateSize?, overscan?, enableSmoothScroll?: false }", description: "Row estimate and overscan settings. Overscan defaults to 5. Smooth scrolling is unsupported." },
  size: { description: "Row estimate defaults to md at 40px. xs is 30px and sm is 36px." },
  theme: { default: '"neutral"', description: "Inherited list highlight palette." },
  class: { description: "Class on the scrolling list root." },
  classes: { description: "Classes for root, item, itemLabel, and itemIndicator." },
  bordered: { default: "false", description: "Adds a legacy border and padding." },
  itemLabel: { description: "Renders a label from an option object." },
 },
} satisfies PropNotes;
