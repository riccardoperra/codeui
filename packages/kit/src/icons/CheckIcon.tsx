import { SvgIcon, SvgIconProps } from "./SvgIcon";

export function CheckIcon(props: SvgIconProps) {
	return (
		<SvgIcon
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-dasharray="32"
			stroke-dashoffset="0"
			{...props}
		>
			<path style="transition: stroke-dashoffset var(--cui-motion-duration-fast) var(--cui-motion-ease-out);" d="M20 6 9 17l-5-5" />
		</SvgIcon>
	);
}
