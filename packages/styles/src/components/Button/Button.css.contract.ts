import { RecipeVariants } from "../../types.js";
export declare const buttonTheme: string,
	buttonVars: {
		buttonHeight: `var(--${string})`;
		fontSize: `var(--${string})`;
		background: `var(--${string})`;
		hoverBackground: `var(--${string})`;
		activeBackground: `var(--${string})`;
		color: `var(--${string})`;
		borderColor: `var(--${string})`;
		padding: `var(--${string})`;
		borderRadius: `var(--${string})`;
	};
export declare const button: import("../../types.js").RuntimeFn<{
	readonly size: {
		readonly xl: {
			readonly vars: {
				readonly [x: string]: string;
			};
		};
		readonly lg: {
			readonly vars: {
				readonly [x: string]: string;
			};
		};
		readonly md: {
			readonly vars: {
				readonly [x: string]: string;
			};
		};
		readonly sm: {
			readonly vars: {
				readonly [x: string]: string;
			};
		};
		readonly xs: {
			readonly vars: {
				readonly [x: string]: string;
			};
		};
	};
	readonly theme: {
		readonly primary: {
			readonly vars: {
				readonly [x: string]: `var(--${string})`;
			};
		};
		readonly tertiary: {
			readonly vars: {
				readonly [x: string]: `var(--${string})`;
			};
		};
		readonly secondary: {
			readonly vars: {
				readonly [x: string]: `var(--${string})`;
			};
		};
		readonly negative: {
			readonly vars: {
				readonly [x: string]: `var(--${string})`;
			};
		};
		readonly caution: {
			readonly vars: {
				readonly [x: string]: `var(--${string})`;
			};
		};
	};
	readonly variant: {
		readonly ghost: {
			readonly background: "transparent";
			readonly selectors: {
				readonly "&:not(:hover)": {
					readonly borderColor: "transparent";
					readonly color: `var(--${string})`;
				};
			};
		};
	};
	readonly block: {
		readonly true: {
			readonly width: "100%";
			readonly flex: 1;
		};
	};
	readonly pill: {
		readonly true: {
			readonly vars: {
				readonly [x: string]: `var(--${string})`;
			};
		};
	};
	readonly loading: {
		readonly true: {
			readonly pointerEvents: "none";
			readonly overflow: "hidden";
		};
	};
}>;
export declare const buttonIcon: string;
export declare const buttonText: string;
export type ButtonVariants = RecipeVariants<typeof button>;
export declare const buttonDefaults: {
	readonly size: "md";
};
export declare const buttonPart: "button";
