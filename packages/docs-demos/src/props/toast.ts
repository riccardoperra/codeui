import type { CreateToasterOptions, ToasterProps, ToastOptions } from "@codeui/kit";
import type { RegionProps, RootProps } from "@codeui/kit/toast";
import type { PropNotes } from "./notes";

/** Props that Toaster adds on top of the styled toast region. */
export type Toaster = Pick<ToasterProps, "toaster" | "closeLabel" | "position" | "class" | "classes">;

/** Kobalte toast region options that Toaster passes through. */
export type ToasterInherited = Pick<
	ToasterProps,
	"limit" | "hotkey" | "swipeDirection" | "pauseOnInteraction" | "pauseOnPageIdle" | "aria-label" | "translations"
>;

/** The options createToaster takes. */
export type CreateToaster = Pick<CreateToasterOptions, "duration">;

/** The options of one toast, passed to show, update and promise. */
export type ToastShowOptions = Pick<
	ToastOptions,
	"title" | "description" | "tone" | "icon" | "action" | "closeable" | "duration" | "theme" | "class" | "classes" | "style"
>;

/** Props that the Region part adds to Kobalte's toast region. */
export type ToastRegionPart = Pick<RegionProps, "regionId" | "position" | "class">;

/** Props that the Root part adds or changes on Kobalte's toast root. */
export type ToastRootPart = Pick<RootProps, "toastId" | "tone" | "priority" | "duration" | "persistent" | "class">;

export const notes = {
	Toaster: {
		toaster: { description: "The controller whose toasts this region shows." },
		closeLabel: { description: "Accessible name of each toast's close button, in the app's language." },
		position: { default: '"bottom-center"', description: "Viewport edge and alignment of the region." },
		class: { description: "Class merged after the kit styles on the region." },
		classes: { description: "Classes for the region and list parts. Per-toast classes go in the toast options." },
	},
	ToasterInherited: {
		limit: { default: "3", description: "Most toasts shown at once. Later toasts wait in the queue." },
		hotkey: { default: '["altKey", "KeyT"]', description: "Keys that move focus to the toast list." },
		swipeDirection: { default: '"right"', description: "Direction of the swipe that dismisses a toast." },
		pauseOnInteraction: { default: "true", description: "Pauses every timer while the pointer is over the list or focus is inside it." },
		pauseOnPageIdle: { default: "true", description: "Pauses every timer while the window is not focused." },
		"aria-label": { default: '"Notifications (alt+T)"', description: "Accessible name of the region." },
	},
	CreateToaster: {
		duration: { default: "5000", description: "Milliseconds before a toast closes, when the toast sets no duration." },
	},
	ToastShowOptions: {
		title: { description: "Bold first line. JSX, or a callback that receives the toast context." },
		description: { description: "The message. JSX, or a callback that receives the toast context." },
		tone: { default: '"neutral"', description: "Status the toast reports. Sets the icon, the accent color, and the announcement priority." },
		icon: { description: "Replaces the tone icon. `null` hides it. Neutral has no tone icon." },
		action: { description: "An inline text button. Its `onClick` receives the toast context. The toast stays open." },
		closeable: { default: "true", description: "Shows the close button." },
		duration: { default: "createToaster duration", description: "Milliseconds before the toast closes. `Infinity` keeps it open." },
		theme: { description: "Renders the toast in this theme, whatever the page theme." },
		class: { description: "Class merged after the kit styles on the toast root." },
		classes: { description: "Classes for the parts of this toast, keyed by part name." },
	},
	ToastRegionPart: {
		regionId: { description: "Kobalte region id. Toasts shown with the same `region` render here." },
		position: { default: '"bottom-center"', description: "Viewport edge and alignment. Sets `data-position`." },
	},
	ToastRootPart: {
		toastId: { description: "The id Kobalte passes to the toast component." },
		tone: { default: '"neutral"', description: "Sets the accent color and `data-tone`." },
		priority: { default: '"low", or "high" for danger', description: '"high" announces with `aria-live="assertive"`, "low" with "polite".' },
		duration: { description: "Milliseconds before the toast closes. Defaults to the region duration." },
		persistent: { description: "Keeps the toast open until it is closed." },
	},
} satisfies PropNotes;
