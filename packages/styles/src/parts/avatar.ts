import type { AvatarStyleOptions } from "../generated-appearance/avatar";
import * as styles from "../components/Avatar/Avatar.css";
export const avatarParts = {
	root: "avatar",
	image: "avatar-image",
	fallback: "avatar-fallback",
} as const;

export type AvatarPart = keyof typeof avatarParts;
export type AvatarClasses = Partial<Record<AvatarPart, string>>;
export type AvatarSize = NonNullable<AvatarStyleOptions["size"]>;
export type AvatarVariants = { size?: AvatarSize; unassigned?: boolean };

export type AvatarStyles = { [P in AvatarPart]: () => string };

export const avatarStyles: AvatarStyles = {
	root: styles.root,
	image: styles.image,
	fallback: styles.fallback,
};

/** FNV-1a hash of a stable id, folded to a hue in degrees. Never pass a display name. */
export const avatarHue = (identifier: string): number => {
	let hash = 0x811c9dc5;
	for (let index = 0; index < identifier.length; index++) {
		hash ^= identifier.charCodeAt(index);
		hash = Math.imul(hash, 0x01000193);
	}
	return (hash >>> 0) % 360;
};

/** One or two initials from a name: the first letter of the first and last words. */
export const avatarInitials = (name: string): string => {
	const words = name.trim().split(/\s+/).filter(Boolean);
	if (words.length === 0) return "";
	const first = Array.from(words[0])[0] ?? "";
	const last = words.length > 1 ? (Array.from(words[words.length - 1])[0] ?? "") : "";
	return (first + last).toLocaleUpperCase();
};
