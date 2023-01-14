import {
	createTheme,
	createVar,
	fallbackVar,
	style,
	StyleRule,
} from "@vanilla-extract/css";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { themeTokens } from "../../foundation/themes.css";
import { mapFontSizeValue, mapSizeValue } from "../../foundation/sizes.css";

export const inputHeight = createVar();
export const fontSize = createVar();

export const [textFieldTheme, textFieldVars] = createTheme({
	borderColor: themeTokens.colors.gray7,
	background: themeTokens.colors.gray3,
	color: themeTokens.colors.gray12,
	inputHeight: inputHeight,
	fontSize: fontSize,
	descriptionColor: themeTokens.colors.gray11,
	disabledBackground: themeTokens.colors.gray2,
});

const FieldSizes = {
	xs: "xs",
	sm: "sm",
	md: "md",
	lg: "lg",
	xl: "xl",
} as const;

export const baseField = style([
	textFieldTheme,
	{
		appearance: "none",
		border: `1px solid ${textFieldVars.borderColor}`,
		backgroundColor: textFieldVars.background,
		borderRadius: themeTokens.radii.md,
		width: "100%",
		minWidth: "0px",
		fontSize: textFieldVars.fontSize,
		height: fallbackVar(textFieldVars.inputHeight, "100%"),
		color: "currentcolor",
		":focus": {
			borderColor: themeTokens.colors.blue8,
		},
		":focus-visible": {
			borderColor: themeTokens.colors.blue9,
		},
		selectors: {
			"&[data-invalid]": {
				borderColor: themeTokens.colors.red9,
				color: themeTokens.colors.red9,
			},
			"&[data-disabled]": {
				cursor: "not-allowed",
				opacity: 0.4,
			},
		},
	},
]);

export const baseFieldContainer = style([
	textFieldTheme,
	{
		display: "flex",
		flexDirection: "column",
		gap: themeTokens.spacing["3"],
	},
]);

export const textField = recipe({
	base: [
		baseField,
		{
			paddingRight: themeTokens.spacing["3"],
			paddingLeft: themeTokens.spacing["3"],
			paddingTop: 0,
			paddingBottom: 0,
			outline: "none",
		},
	],
	variants: {
		theme: {
			filled: {
				vars: {
					[textFieldVars.borderColor]: "transparent",
				},
			},
			outline: {},
			inline: {
				backgroundColor: "transparent",
				border: "none",
				borderBottom: `2px solid ${textFieldVars.background}`,
				borderRadius: 0,
				paddingLeft: 0,
				paddingRight: 0,
				selectors: {
					"&[data-disabled]": {
						backgroundColor: "transparent",
					},
				},
			},
		},
		size: {
			[FieldSizes.xs]: {
				vars: {
					[inputHeight]: mapSizeValue("xs"),
					[fontSize]: mapFontSizeValue("xs"),
				},
			},
			[FieldSizes.sm]: {
				vars: {
					[inputHeight]: mapSizeValue("sm"),
					[fontSize]: mapFontSizeValue("sm"),
				},
			},
			[FieldSizes.md]: {
				vars: {
					[inputHeight]: mapSizeValue("md"),
					[fontSize]: mapFontSizeValue("md"),
				},
			},
			[FieldSizes.lg]: {
				vars: {
					[inputHeight]: mapSizeValue("lg"),
					[fontSize]: mapFontSizeValue("md"),
				},
			},
			[FieldSizes.xl]: {
				vars: {
					[inputHeight]: mapSizeValue("xl"),
					[fontSize]: mapFontSizeValue("lg"),
				},
			},
		},
	},
	defaultVariants: {
		theme: "filled",
		size: "md",
	},
});

const labelSizes = {
	xs: "xs",
	sm: "sm",
	md: "sm",
	lg: "md",
	xl: "md",
} as const;

function makeLabelSize(size: keyof typeof labelSizes): StyleRule["selectors"] {
	return {
		[`[data-field-size=${size}] &`]: {
			fontSize: mapFontSizeValue(labelSizes[size]),
		},
	};
}

export const label = style([
	{
		fontWeight: themeTokens.fontWeight.medium,
		userSelect: "none",
	},
	{
		selectors: {
			...makeLabelSize("xs"),
			...makeLabelSize("sm"),
			...makeLabelSize("md"),
			...makeLabelSize("lg"),
			...makeLabelSize("xl"),
		},
	},
]);

const descriptionSizes = {
	xs: "xs",
	sm: "xs",
	md: "xs",
	lg: "sm",
	xl: "md",
} as const;

function makeDescriptionSize(
	size: keyof typeof descriptionSizes,
): StyleRule["selectors"] {
	return {
		[`[data-field-size=${size}] &`]: {
			fontSize: mapFontSizeValue(descriptionSizes[size]),
		},
	};
}

export const description = style([
	{
		color: textFieldVars.descriptionColor,
		userSelect: "none",
	},
	{
		selectors: {
			...makeDescriptionSize("xs"),
			...makeDescriptionSize("sm"),
			...makeDescriptionSize("md"),
			...makeDescriptionSize("lg"),
			...makeDescriptionSize("xl"),
		},
	},
]);

const errorMessageSizes = {
	xs: "xs",
	sm: "xs",
	md: "xs",
	lg: "sm",
	xl: "sm",
} as const;

function makeErrorMessageSize(
	size: keyof typeof errorMessageSizes,
): StyleRule["selectors"] {
	return {
		[`[data-field-size=${size}] &`]: {
			fontSize: mapFontSizeValue(errorMessageSizes[size]),
		},
	};
}

export const errorMessage = style([
	{
		userSelect: "none",
		color: themeTokens.colors.red9,
	},
	{
		selectors: {
			...makeErrorMessageSize("xs"),
			...makeErrorMessageSize("sm"),
			...makeErrorMessageSize("md"),
			...makeErrorMessageSize("lg"),
			...makeErrorMessageSize("xl"),
		},
	},
]);

export type TextFieldVariants = RecipeVariants<typeof textField>;
