import type { LinkStyleOptions } from "../../generated-appearance/link";
export const link = (): string => "cui-link";

export type LinkVariants = Omit<LinkStyleOptions, "class"> | undefined;
