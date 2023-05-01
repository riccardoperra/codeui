import { SvgIcon, SvgIconProps } from "./SvgIcon";

export function SelectorIcon(props: SvgIconProps) {
	return (
		<SvgIcon fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M8 9l4-4 4 4m0 6l-4 4-4-4"
			/>
		</SvgIcon>
	);
}
