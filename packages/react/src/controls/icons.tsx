import { SvgIcon, type SvgIconProps } from "./svg-icon";

export function CheckIcon(props: SvgIconProps) {
	return (
		<SvgIcon
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<path d="M20 6 9 17l-5-5" />
		</SvgIcon>
	);
}

export function MinusIcon(props: SvgIconProps) {
	return (
		<SvgIcon
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			{...props}
		>
			<path d="M5 12h14" />
		</SvgIcon>
	);
}

export function ChevronUpIcon(props: SvgIconProps) {
	return (
		<SvgIcon viewBox="0 0 20 20" fill="currentColor" {...props}>
			<path
				fillRule="evenodd"
				d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z"
				clipRule="evenodd"
			/>
		</SvgIcon>
	);
}

export function ChevronDownIcon(props: SvgIconProps) {
	return (
		<SvgIcon viewBox="0 0 20 20" fill="currentColor" {...props}>
			<path
				fillRule="evenodd"
				d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
				clipRule="evenodd"
			/>
		</SvgIcon>
	);
}

/** The status icon for a tone. Neutral has none. */
export function ToneIcon({
	tone,
}: {
	tone?: "neutral" | "info" | "success" | "warning" | "danger";
}) {
	if (tone === "success") return <CheckIcon />;
	if (tone === "info")
		return (
			<SvgIcon viewBox="0 0 20 20" fill="currentColor">
				<path
					fillRule="evenodd"
					d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
					clipRule="evenodd"
				/>
			</SvgIcon>
		);
	if (tone === "warning" || tone === "danger")
		return (
			<SvgIcon viewBox="0 0 20 20" fill="currentColor">
				<path
					fillRule="evenodd"
					d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a1 1 0 01.993.883L11 6v4a1 1 0 01-1.993.117L9 10V6a1 1 0 011-1zm0 8a1 1 0 100 2 1 1 0 000-2z"
					clipRule="evenodd"
				/>
			</SvgIcon>
		);
	return null;
}
