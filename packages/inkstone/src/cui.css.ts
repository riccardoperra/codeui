// Generated from the token resolver by scripts/tokens.mjs.
type CssRefs<T> = T extends string ? `var(--${string})` : { -readonly [K in keyof T]: CssRefs<T[K]> };
const values = {
	"shadow": {
		"dialog": "var(--cui-shadow-dialog)",
		"menu": "var(--cui-shadow-menu)",
		"none": "var(--cui-shadow-none)",
		"sm": "var(--cui-shadow-sm)",
		"md": "var(--cui-shadow-md)",
		"thumb": "var(--cui-shadow-thumb)",
		"lg": "var(--cui-shadow-lg)"
	},
	"border": {
		"input": "var(--cui-border-input)",
		"dialogTitle": "var(--cui-border-dialog-title)",
		"divider": "var(--cui-border-divider)",
		"menu": "var(--cui-border-menu)",
		"width": "var(--cui-border-width)",
		"widthStrong": "var(--cui-border-width-strong)"
	},
	"space": {
		"0": "var(--cui-space-0)",
		"1": "var(--cui-space-1)",
		"2": "var(--cui-space-2)",
		"3": "var(--cui-space-3)",
		"4": "var(--cui-space-4)",
		"5": "var(--cui-space-5)",
		"6": "var(--cui-space-6)",
		"8": "var(--cui-space-8)",
		"10": "var(--cui-space-10)",
		"12": "var(--cui-space-12)",
		"16": "var(--cui-space-16)",
		"20": "var(--cui-space-20)",
		"24": "var(--cui-space-24)",
		"32": "var(--cui-space-32)",
		"40": "var(--cui-space-40)",
		"48": "var(--cui-space-48)",
		"56": "var(--cui-space-56)",
		"64": "var(--cui-space-64)",
		"auto": "var(--cui-space-auto)",
		"px": "var(--cui-space-px)",
		"0.5": "var(--cui-space-0-5)",
		"1.5": "var(--cui-space-1-5)",
		"2.5": "var(--cui-space-2-5)"
	},
	"font": {
		"tracking": {
			"normal": "var(--cui-font-tracking-normal)"
		},
		"size": {
			"badge": "var(--cui-font-size-badge)",
			"xs": "var(--cui-font-size-xs)",
			"caption": "var(--cui-font-size-caption)",
			"sm": "var(--cui-font-size-sm)",
			"md": "var(--cui-font-size-md)",
			"lg": "var(--cui-font-size-lg)",
			"xl": "var(--cui-font-size-xl)",
			"2xl": "var(--cui-font-size-2xl)"
		},
		"weight": {
			"normal": "var(--cui-font-weight-normal)",
			"medium": "var(--cui-font-weight-medium)",
			"semibold": "var(--cui-font-weight-semibold)"
		},
		"lineHeight": {
			"compact": "var(--cui-font-line-height-compact)",
			"snug": "var(--cui-font-line-height-snug)",
			"normal": "var(--cui-font-line-height-normal)",
			"badge": "var(--cui-font-line-height-badge)",
			"xs": "var(--cui-font-line-height-xs)",
			"caption": "var(--cui-font-line-height-caption)",
			"sm": "var(--cui-font-line-height-sm)",
			"md": "var(--cui-font-line-height-md)"
		},
		"family": {
			"sans": "var(--cui-font-family-sans)",
			"mono": "var(--cui-font-family-mono)"
		}
	},
	"surface": {
		"canvas": "var(--cui-surface-canvas)",
		"toolbar": "var(--cui-surface-toolbar)",
		"scrim": "var(--cui-surface-scrim)",
		"dialog": "var(--cui-surface-dialog)",
		"inputAccent": "var(--cui-surface-input-accent)",
		"input": "var(--cui-surface-input)",
		"fieldHover": "var(--cui-surface-field-hover)",
		"menuHover": "var(--cui-surface-menu-hover)",
		"menu": "var(--cui-surface-menu)",
		"panel": "var(--cui-surface-panel)",
		"scrollThumb": "var(--cui-surface-scroll-thumb)",
		"scrollThumbHover": "var(--cui-surface-scroll-thumb-hover)",
		"secondary": "var(--cui-surface-secondary)",
		"toast": "var(--cui-surface-toast)",
		"track": "var(--cui-surface-track)"
	},
	"text": {
		"default": "var(--cui-text-default)",
		"toolbar": "var(--cui-text-toolbar)",
		"muted": "var(--cui-text-muted)",
		"dialog": "var(--cui-text-dialog)",
		"dialogTitle": "var(--cui-text-dialog-title)",
		"label": "var(--cui-text-label)",
		"hint": "var(--cui-text-hint)",
		"tertiary": "var(--cui-text-tertiary)",
		"disabled": "var(--cui-text-disabled)",
		"input": "var(--cui-text-input)",
		"selected": "var(--cui-text-selected)",
		"menu": "var(--cui-text-menu)",
		"panelMuted": "var(--cui-text-panel-muted)",
		"panel": "var(--cui-text-panel)",
		"toast": "var(--cui-text-toast)",
		"danger": "var(--cui-text-danger)"
	},
	"action": {
		"neutral": {
			"active": "var(--cui-action-neutral-active)",
			"base": "var(--cui-action-neutral-base)",
			"hover": "var(--cui-action-neutral-hover)",
			"text": "var(--cui-action-neutral-text)"
		},
		"danger": {
			"active": "var(--cui-action-danger-active)",
			"base": "var(--cui-action-danger-base)",
			"hover": "var(--cui-action-danger-hover)",
			"text": "var(--cui-action-danger-text)"
		},
		"brand": {
			"active": "var(--cui-action-brand-active)",
			"base": "var(--cui-action-brand-base)",
			"hover": "var(--cui-action-brand-hover)",
			"text": "var(--cui-action-brand-text)"
		},
		"brandSoft": {
			"base": "var(--cui-action-brand-soft-base)",
			"hover": "var(--cui-action-brand-soft-hover)",
			"text": "var(--cui-action-brand-soft-text)",
			"active": "var(--cui-action-brand-soft-active)"
		},
		"caution": {
			"base": "var(--cui-action-caution-base)",
			"hover": "var(--cui-action-caution-hover)",
			"active": "var(--cui-action-caution-active)",
			"text": "var(--cui-action-caution-text)"
		},
		"success": {
			"base": "var(--cui-action-success-base)",
			"hover": "var(--cui-action-success-hover)",
			"active": "var(--cui-action-success-active)",
			"text": "var(--cui-action-success-text)"
		}
	},
	"accent": {
		"selection": "var(--cui-accent-selection)",
		"focus": "var(--cui-accent-focus)"
	},
	"focus": {
		"width": "var(--cui-focus-width)",
		"offset": "var(--cui-focus-offset)",
		"color": "var(--cui-focus-color)"
	},
	"radius": {
		"scale": "var(--cui-radius-scale)",
		"none": "var(--cui-radius-none)",
		"badge": "var(--cui-radius-badge)",
		"xs": "var(--cui-radius-xs)",
		"sm": "var(--cui-radius-sm)",
		"nav": "var(--cui-radius-nav)",
		"md": "var(--cui-radius-md)",
		"lg": "var(--cui-radius-lg)",
		"card": "var(--cui-radius-card)",
		"xl": "var(--cui-radius-xl)",
		"command": "var(--cui-radius-command)",
		"dialog": "var(--cui-radius-dialog)",
		"full": "var(--cui-radius-full)"
	},
	"control": {
		"height": {
			"xs": "var(--cui-control-height-xs)",
			"sm": "var(--cui-control-height-sm)",
			"md": "var(--cui-control-height-md)",
			"lg": "var(--cui-control-height-lg)"
		}
	},
	"motion": {
		"duration": {
			"none": "var(--cui-motion-duration-none)",
			"fast": "var(--cui-motion-duration-fast)",
			"normal": "var(--cui-motion-duration-normal)",
			"panel": "var(--cui-motion-duration-panel)",
			"slow": "var(--cui-motion-duration-slow)",
			"rise": "var(--cui-motion-duration-rise)"
		},
		"ease": {
			"out": "var(--cui-motion-ease-out)"
		}
	}
} as const;
export const tokens: CssRefs<typeof values> = values;
