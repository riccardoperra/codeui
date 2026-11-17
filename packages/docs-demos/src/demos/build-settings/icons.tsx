import type { JSX } from "solid-js";

// 16px outline icons for the demos. An app uses its own icon set.
function Icon(props: { children: JSX.Element; size?: number }) {
	return (
		<svg
			width={props.size ?? 16}
			height={props.size ?? 16}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.8"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			{props.children}
		</svg>
	);
}

export const SlidersIcon = () => (
	<Icon>
		<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
		<circle cx="16" cy="6" r="2" />
		<circle cx="10" cy="12" r="2" />
		<circle cx="18" cy="18" r="2" />
	</Icon>
);
export const PaletteIcon = () => (
	<Icon>
		<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.8 1.6-1.6 0-.5-.2-.8-.5-1.1-.3-.3-.5-.7-.5-1.1 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5c0-4.1-4-7.6-9-7.6Z" />
		<circle cx="7.5" cy="11.5" r="1" />
		<circle cx="10.5" cy="7.5" r="1" />
		<circle cx="15.5" cy="8.5" r="1" />
	</Icon>
);
export const DownloadIcon = (props: { size?: number } = {}) => (
	<Icon size={props.size}>
		<path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
	</Icon>
);
export const FlaskIcon = () => (
	<Icon>
		<path d="M9 3h6M10 3v6L4.5 18.5A1.6 1.6 0 0 0 5.9 21h12.2a1.6 1.6 0 0 0 1.4-2.5L14 9V3M7 15h10" />
	</Icon>
);
export const SparkleIcon = () => (
	<Icon>
		<path d="M12 3c.5 4.5 2.5 6.5 7 7-4.5.5-6.5 2.5-7 7-.5-4.5-2.5-6.5-7-7 4.5-.5 6.5-2.5 7-7Z" />
	</Icon>
);
export const InfoIcon = () => (
	<Icon>
		<circle cx="12" cy="12" r="9" />
		<path d="M12 11v5M12 8h0" />
	</Icon>
);
export const SearchIcon = () => (
	<Icon>
		<circle cx="11" cy="11" r="6.5" />
		<path d="m20 20-4.2-4.2" />
	</Icon>
);
export const ImageIcon = (props: { size?: number } = {}) => (
	<Icon size={props.size}>
		<rect x="3" y="5" width="18" height="14" rx="2" />
		<circle cx="9" cy="10" r="1.5" />
		<path d="m21 16-5-5-9 8" />
	</Icon>
);
export const CameraIcon = (props: { size?: number } = {}) => (
	<Icon size={props.size}>
		<path d="M4 8h3l2-3h6l2 3h3v11H4Z" />
		<circle cx="12" cy="13" r="3.5" />
	</Icon>
);
export const PenIcon = (props: { size?: number } = {}) => (
	<Icon size={props.size}>
		<path d="M4 20c4-1 6-3 9-6l5-5-3-3-5 5c-3 3-5 5-6 9Z" />
	</Icon>
);
export const ExternalIcon = (props: { size?: number } = {}) => (
	<Icon size={props.size}>
		<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
	</Icon>
);
export const CopyIcon = (props: { size?: number } = {}) => (
	<Icon size={props.size}>
		<rect x="8" y="8" width="12" height="12" rx="2" />
		<path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
	</Icon>
);
export const LayersIcon = (props: { size?: number } = {}) => (
	<Icon size={props.size}>
		<path d="m12 4 9 5-9 5-9-5Z" />
		<path d="m3 14 9 5 9-5" />
	</Icon>
);
export const TextIcon = (props: { size?: number } = {}) => (
	<Icon size={props.size}>
		<rect x="3" y="5" width="18" height="14" rx="3" />
		<path d="M8 10h8M8 14h5" />
	</Icon>
);
export const ResetIcon = () => (
	<Icon>
		<path d="M4 4v5h5" />
		<path d="M4.5 9A8 8 0 1 1 6 16.5" />
	</Icon>
);
