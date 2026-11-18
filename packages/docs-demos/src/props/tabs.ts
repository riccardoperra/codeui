import type { Tabs as Root, TabsList as List, TabsHeader as Header, TabsContent as Content } from "@codeui/kit";
import type { PropNotes } from "./notes";
export type Tabs = Pick<Parameters<typeof Root>[0], "variant">;
export type TabsInherited = Pick<Parameters<typeof Root>[0], "value" | "defaultValue" | "onChange" | "orientation" | "activationMode" | "disabled" | "class">;
export type TabsList = Pick<Parameters<typeof List>[0], "class">;
export type TabsHeader = Pick<Parameters<typeof Header>[0], "class">;
export type TabsHeaderInherited = Pick<Parameters<typeof Header>[0], "value" | "disabled">;
export type TabsContent = Pick<Parameters<typeof Content>[0], "class">;
export type TabsContentInherited = Pick<Parameters<typeof Content>[0], "value" | "forceMount">;
export const notes = {
 Tabs: { variant: { default: '"default"', description: "Inline inserts the indicator into TabsList." } },
 TabsInherited: {
  orientation: { default: '"horizontal"', description: "Sets layout and the arrow-key direction." },
  activationMode: { default: '"automatic"', description: "Automatic selects on focus. Manual requires Enter or Space." },
  class: { description: "Class merged on the root." },
 },
 TabsList: { class: { description: "Class merged on the tablist." } },
 TabsHeader: { class: { description: "Class merged on the trigger button." } },
 TabsContent: { class: { description: "Class merged on the panel." } },
} satisfies PropNotes;
