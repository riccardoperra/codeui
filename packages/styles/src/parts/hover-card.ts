import * as styles from "../components/HoverCard/HoverCard.css";
export const hoverCardParts = {
	trigger: "hovercard-trigger",
	content: "hovercard-content",
} as const;

export type HoverCardPart = keyof typeof hoverCardParts;
export type HoverCardClasses = Partial<Record<HoverCardPart, string>>;
export type HoverCardStyles = { [P in HoverCardPart]: () => string };

export const hoverCardStyles: HoverCardStyles = {
	trigger: () => "",
	content: styles.content,
};
