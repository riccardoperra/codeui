import { blueDark, grayDark, greenDark, redDark } from "@radix-ui/colors";

export const tokens = {
	colors: {
		...grayDark,
		...blueDark,
		...redDark,
		...greenDark,
	},
	fontSize: {
		xs: `0.8rem`,
		sm: `0.875rem`,
		md: `1rem`,
		lg: `1.25rem`,
		xl: `1.5rem`,
	},
	fontWeight: {
		hairline: "100",
		thin: "200",
		light: "300",
		normal: "400",
		medium: "500",
		semibold: "600",
		bold: "700",
		extrabold: "800",
		black: "900",
	},
	spacing: {
		auto: "auto",
		px: "1px",
		0: "0",
		1: "0.25rem",
		2: "0.5rem",
		3: "0.75rem",
		4: "1rem",
		5: "1.25rem",
		6: "1.5rem",
		8: "2rem",
		10: "2.5rem",
		12: "3rem",
		16: "4rem",
		20: "5rem",
		24: "6rem",
		32: "8rem",
		40: "10rem",
		48: "12rem",
		56: "14rem",
		64: "16rem",
	},
	radii: {
		none: "0",
		xs: "7px",
		sm: "9px",
		default: "14px",
		md: "12px",
		lg: "14px",
		xl: "18px",
		full: "9999px",
	},
	boxShadow: {
		default: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
		md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
		lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
		xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
		"2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
		inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
		outline: "0 0 0 3px rgba(66, 153, 225, 0.5)",
		none: "none",
	},
	zIndex: {
		"-1": "-1",
		0: "0",
		10: "10",
		20: "20",
		30: "30",
		40: "40",
		50: "50",
		auto: "auto",
	},
} as const;
