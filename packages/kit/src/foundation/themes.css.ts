import { createGlobalTheme, createTheme } from "@vanilla-extract/css";
import { tokens } from "./tokens";
import { tokens as contract } from "./contract.css";
import { getActiveColor, getHoverColor, getLightVariant } from "../utils/color";
import { darken, lighten, tint } from "polished";

export const [theme, themeTokens] = createTheme({
	...tokens,
});

const brand = "#0072d6";
const brandSoft = "#102A4CFF";
const critical = "#E03131FF";
const caution = "#F08C00FF";

const grayDarkScale = {
	gray1: "#111111",
	gray2: "#1d1d1d",
	gray3: "#232323",
	gray4: "#282828",
	gray5: "#2B2B2B",
	gray6: "#333333",
	gray7: "#3e3e3e",
	gray8: "#505050",
	gray9: "#707070",
	gray10: "#7e7e7e",
	gray11: "#a0a0a0",
	gray12: "#ededed",
} as const;

const neutral = "#424242";
const neutralDark = darken(0.02, grayDarkScale.gray4);
const neutralSoft = lighten(0.02, getLightVariant(grayDarkScale.gray5));

const grayLightScale = {
	gray1: "hsl(0, 0%, 97.3%)",
	gray2: "hsl(0, 0%, 95.1%)",
	gray3: "hsl(0, 0%, 93.0%)",
	gray4: "hsl(0, 0%, 90.9%)",
	gray5: "hsl(0, 0%, 85.8%)",
	gray6: "hsl(0, 0%, 78.0%)",
	gray7: "hsl(0, 0%, 56.1%)",
	gray8: "hsl(0, 0%, 52.3%)",
	gray9: "hsl(0, 0%, 43.5%)",
	gray10: "#1d1d1d",
	gray11: "#111111",
} as const;

createGlobalTheme("[data-cui-theme=dark]", contract, {
	background: "#000",
	foreground: "#fff",
	accent1: grayDarkScale.gray1,
	accent2: grayDarkScale.gray2,
	accent3: grayDarkScale.gray3,
	accent4: grayDarkScale.gray4,
	accent5: grayDarkScale.gray5,
	accent6: grayDarkScale.gray7,
	accent7: grayDarkScale.gray8,
	accent8: grayDarkScale.gray9,
	accent9: grayDarkScale.gray10,
	accent10: grayDarkScale.gray11,
	brand: brand,
	brandAccentActive: getActiveColor(brand),
	brandAccentHover: getHoverColor(brand),
	brandSoft: brandSoft,
	brandSoftAccentActive: getActiveColor(brandSoft),
	brandSoftAccentHover: getHoverColor(brandSoft),
	brandLink: lighten(0.2, brand),
	critical: critical,
	criticalAccentActive: getActiveColor(critical),
	criticalAccentHover: getHoverColor(critical),
	caution: caution,
	cautionAccentActive: getActiveColor(caution),
	cautionAccentHover: getHoverColor(caution),
	neutral,
	neutralSoft,
	formAccent: neutralDark,
	separator: grayDarkScale.gray7,
	// dropdown
	dropdownBackground: grayDarkScale.gray4,
	dropdownBoxShadow: "0 1px #0000000d,0 4px 10px rgba(0, 0, 0, .3)",
	dropdownItemTextColor: "#fff",
	dropdownItemHoverBackground: themeTokens.colors.blue9,
	dropdownItemHoverTextColor: "#fff",
	// dialog
	dialogBackground: grayDarkScale.gray4,
	dialogBoxShadow: "0 1px #0000000d,0 4px 10px rgba(0, 0, 0, .3)",
	dialogTextColor: "#fff",
	dialogOverlayBackground: "rgba(0,0,0,.7)",
});

createGlobalTheme("[data-cui-theme=light]", contract, {
	background: "#fff",
	foreground: "#000",
	accent1: grayLightScale.gray1,
	accent2: grayLightScale.gray2,
	accent3: grayLightScale.gray3,
	accent4: grayLightScale.gray4,
	accent5: grayLightScale.gray5,
	accent6: grayLightScale.gray7,
	accent7: grayLightScale.gray8,
	accent8: grayLightScale.gray9,
	accent9: grayLightScale.gray10,
	accent10: grayLightScale.gray11,
	brand: brand,
	brandAccentActive: getActiveColor(brand),
	brandAccentHover: getHoverColor(brand),
	brandSoft: tint(0.85, brand),
	brandSoftAccentActive: getActiveColor(tint(0.85, brand)),
	brandSoftAccentHover: getHoverColor(tint(0.85, brand)),
	brandLink: darken(0.2, brand),
	critical: critical,
	criticalAccentActive: getActiveColor(critical),
	criticalAccentHover: getHoverColor(critical),
	caution: caution,
	cautionAccentActive: getActiveColor(caution),
	cautionAccentHover: getHoverColor(caution),
	neutral,
	neutralSoft,
	formAccent: neutralSoft,
	separator: grayLightScale.gray4,
	// dropdown
	dropdownBackground: "#fff",
	dropdownBoxShadow: "0 1px #0000000d,0 4px 10px rgba(0, 0, 0, .1)",
	dropdownItemTextColor: "#000",
	dropdownItemHoverBackground: themeTokens.colors.blue9,
	dropdownItemHoverTextColor: "#fff",
	// dialog
	dialogBackground: "#fff",
	dialogBoxShadow: "0 1px #0000000d,0 4px 10px rgba(0, 0, 0, .1)",
	dialogTextColor: "#000",
	dialogOverlayBackground: "#091e427d",
});
