import type { ListboxProps } from "@codeui/kit";
import type { ListboxItemProps } from "../../../kit/src/components/Listbox/Listbox";
import type { PropNotes } from "./notes";
export type Listbox = Pick<ListboxProps<string, never>, "class" | "classes" | "size" | "variant" | "bordered" | "itemLabel">;
export type ListboxItem = Pick<ListboxItemProps<string>, "class" | "classes" | "size" | "itemLabel">;
export type ListboxInherited = Pick<ListboxProps<string, never>, "options" | "value" | "defaultValue" | "onChange" | "selectionMode" | "selectionBehavior" | "disallowEmptySelection" | "optionValue" | "optionTextValue" | "optionDisabled" | "optionGroupChildren" | "renderSection" | "shouldFocusOnHover">;
export type ListboxItemInherited = Pick<ListboxItemProps<string>, "item">;
export const notes = {
 Listbox: {
  class: { description: "Class merged on the ul root." },
  classes: { description: "Classes for root, item, itemLabel, and itemIndicator." },
  size: { description: "Explicit row height. xs is 30px, sm is 36px, and md is 40px." },
  variant: { default: '"neutral"', description: "Highlight palette. Neutral follows Inkstone selection rules." },
  bordered: { default: "false", description: "Adds a legacy border and padding." },
  itemLabel: { description: "Renders an option label from its raw value." },
 },
 ListboxInherited: {
  shouldFocusOnHover: { default: "true", description: "Moves focus to hovered options." },
  selectionMode: { default: '"none"', description: "Allows no selection, one selection, or multiple selections." },
 },
} satisfies PropNotes;
