import * as styles from "../components/HoverCard/HoverCard.css";
export const hoverCardParts = {
	trigger: "hovercard-trigger",
	content: "hovercard-content",
	list: "hovercard-list",
	item: "hovercard-item",
	itemIcon: "hovercard-item-icon",
	itemId: "hovercard-item-id",
	itemTitle: "hovercard-item-title",
} as const;

export type HoverCardPart = keyof typeof hoverCardParts;
export type HoverCardClasses = Partial<Record<HoverCardPart, string>>;
export type HoverCardStyles = { [P in HoverCardPart]: () => string };

export const hoverCardStyles: HoverCardStyles = {
	trigger: () => "",
	content: styles.content,
	list: styles.list,
	item: styles.item,
	itemIcon: styles.itemIcon,
	itemId: styles.itemId,
	itemTitle: styles.itemTitle,
};
