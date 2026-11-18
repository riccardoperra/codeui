import type { LinkStyleOptions } from "../../generated-appearance/link";
export const link = (): string => "cui-link-link cui-link-linkTheme";

export type LinkVariants = Omit<LinkStyleOptions, "class"> | undefined;
