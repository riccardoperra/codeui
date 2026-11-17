export declare const root: string;
export declare const input: string;
/**
 * Track 36×22 with a 16px thumb (CodeImage), 28×16 with a 12px thumb at `sm`,
 * 44×26 with a 20px thumb on touch screens (Inkstone §6).
 */
export declare const control: import("../../types.js").RuntimeFn<{
	size: {
		sm: {
			"@media": {
				"(pointer: fine), (pointer: none)": {
					vars: {
						[x: string]: `var(--${string})`;
					};
				};
			};
		};
		md: {};
	};
}>;
export declare const smallRoot: string;
export declare const mediumRoot: string;
export declare const thumb: import("../../types.js").RuntimeFn<{
	size: {
		sm: {};
		md: {};
	};
}>;
export declare const label: string;
export declare const description: string;
export declare const errorMessage: string;
