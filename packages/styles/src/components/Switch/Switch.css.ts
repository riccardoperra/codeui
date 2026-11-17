// Compatibility metadata frozen from #126; declarations are authored in src/plain.
import type * as Contract from "./Switch.css.contract";
import { recipe } from "../../plain/recipe";
export const control: typeof Contract.control = recipe(
	{
		base: "cui-switch-ohc8hx5",
		variants: {
			size: { sm: "cui-switch-control_size_sm", md: "cui-switch-control_size_md" },
		},
	},
	{},
	"cui-switch-control",
);
export const description: typeof Contract.description = "cui-switch-description";
export const errorMessage: typeof Contract.errorMessage = "cui-switch-error-message";
export const input: typeof Contract.input = "cui-switch-input";
export const label: typeof Contract.label = "cui-switch-label";
export const mediumRoot: typeof Contract.mediumRoot = "cui-switch-mediumRoot";
export const root: typeof Contract.root = "cui-switch-root";
export const smallRoot: typeof Contract.smallRoot = "cui-switch-smallRoot";
export const thumb: typeof Contract.thumb = recipe(
	{
		base: "cui-switch-ohc8hxc",
		variants: {
			size: { sm: "cui-switch-thumb_size_sm", md: "cui-switch-thumb_size_md" },
		},
	},
	{},
	"cui-switch-thumb",
);
