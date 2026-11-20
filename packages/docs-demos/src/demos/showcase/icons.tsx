import type { JSX } from "@solidjs/web";

// 16px outline icons for the homepage vignettes. An app brings its own icon set.
function Icon(props: { children: JSX.Element }) {
	return (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			{props.children}
		</svg>
	);
}

export const PlusIcon = () => <Icon><path d="M12 5v14M5 12h14" /></Icon>;
export const CopyIcon = () => <Icon><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" /></Icon>;
export const DownloadIcon = () => <Icon><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></Icon>;
export const ShareIcon = () => <Icon><path d="M12 15V4M8 8l4-4 4 4M5 13v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6" /></Icon>;
export const MoreIcon = () => <Icon><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></Icon>;
export const ArchiveIcon = () => <Icon><rect x="3" y="4" width="18" height="5" rx="1" /><path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M10 13h4" /></Icon>;
export const TrashIcon = () => <Icon><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></Icon>;
export const PinIcon = () => <Icon><path d="M12 17v5M8 3h8l-1 6 3 4H6l3-4z" /></Icon>;
export const BellIcon = () => <Icon><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4" /></Icon>;
export const CardIcon = () => <Icon><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></Icon>;
export const LockIcon = () => <Icon><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></Icon>;
