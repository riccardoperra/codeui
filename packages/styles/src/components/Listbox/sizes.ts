import type { ListboxItemStyleOptions } from "../../generated-appearance/listbox";
export const LISTBOX_ITEM_SIZE: Record<ListboxItemSizeKey, number> = {
	xs: 30,
	sm: 36,
	md: 40,
};

export type ListboxItemSizeKey = NonNullable<ListboxItemStyleOptions["size"]>;
