import { createThemeContract } from "@vanilla-extract/css";

export const tokens = createThemeContract({
	// ================================ tokens ================================ //
	background: null,
	foreground: null,
	accent1: null,
	accent2: null,
	accent3: null,
	accent4: null,
	accent5: null,
	accent6: null,
	accent7: null,
	accent8: null,
	accent9: null,
	accent10: null,
	brand: null,
	brandAccentHover: null,
	brandAccentActive: null,
	brandSecondary: null,
	brandSecondaryAccentHover: null,
	brandSecondaryAccentActive: null,
	brandSoft: null,
	brandLink: null,
	brandSoftAccentHover: null,
	brandSoftAccentActive: null,
	critical: null,
	criticalAccentHover: null,
	criticalAccentActive: null,
	caution: null,
	cautionAccentHover: null,
	cautionAccentActive: null,
	neutral: null,
	neutralSoft: null,
	// ================================ forms ================================ //
	formAccent: null,
	// TODO: default border
	formAccentBorder: null,
	// ================================ component ================================ //
	separator: null,
	// dropdown
	dropdownBackground: null,
	dropdownBoxShadow: null,
	dropdownBorder: null,
	dropdownItemTextColor: null,
	dropdownItemHoverBackground: null,
	dropdownItemHoverTextColor: null,
	// dialog
	dialogBackground: null,
	dialogBoxShadow: null,
	dialogTextColor: null,
	dialogOverlayBackground: null,
} as const);
