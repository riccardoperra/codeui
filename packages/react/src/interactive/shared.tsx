"use client";

import { useRef, type SVGProps } from "react";
import { composeRenderProps, type ClassNameOrFunction } from "react-aria-components";
import { IconButton, type IconButtonProps } from "../controls/icon-button";
import { classes } from "../classes";
import { pointerInitiated } from "../input-modality";
export { pointerInitiated, useInputTracking } from "../input-modality";

type ClassValue = string | false | null | undefined;

export function withClasses<T>(
	className: ClassNameOrFunction<T> | undefined,
	...base: ClassValue[]
) {
	return composeRenderProps<
		string | undefined,
		T & { defaultClassName: string | undefined },
		string
	>(className, value => classes(...base, value));
}

export type Motion = "none" | undefined;

function setMotion(element: HTMLElement, moves: boolean) {
	if (moves) element.removeAttribute("data-motion");
	else element.setAttribute("data-motion", "none");
}

export function popMotionRef(element: HTMLElement | null) {
	if (element) setMotion(element, pointerInitiated());
}

export function hoverMotionRef(element: HTMLElement | null) {
	if (element) setMotion(element, pointerInitiated("hover"));
}

export function useOpenChangeMotion(motion: "auto" | "none" = "auto") {
	const change = useRef<{ open: boolean; moves: boolean } | null>(null);
	return (isOpen: boolean): Motion => {
		if (change.current === null || change.current.open !== isOpen) {
			change.current = { open: isOpen, moves: motion !== "none" && pointerInitiated() };
		}
		return change.current.moves ? undefined : "none";
	};
}

const iconProps = {
	xmlns: "http://www.w3.org/2000/svg",
	"aria-hidden": true,
	focusable: false,
	className: "cui-icon",
} as const;

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...iconProps}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeDasharray="32"
			{...props}
		>
			<path
				style={{
					transition:
						"stroke-dashoffset var(--cui-motion-duration-fast) var(--cui-motion-ease-out)",
				}}
				d="M20 6 9 17l-5-5"
			/>
		</svg>
	);
}

export function SelectorIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...iconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M8 9l4-4 4 4m0 6l-4 4-4-4"
			/>
		</svg>
	);
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...iconProps} viewBox="0 0 20 20" fill="currentColor" {...props}>
			<path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
		</svg>
	);
}

export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...iconProps}
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<path d="m6 3.5 4.5 4.5L6 12.5" />
		</svg>
	);
}

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...iconProps}
			className={undefined}
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			{...props}
		>
			<circle cx="7" cy="7" r="4.25" />
			<path d="m10.25 10.25 3.25 3.25" />
		</svg>
	);
}

export type CloseButtonProps = Omit<IconButtonProps, "aria-label" | "size"> & {
	size?: "xs" | "sm";
	"aria-label"?: string;
	"data-cui"?: string;
};

export function CloseButton({
	size = "xs",
	children,
	"aria-label": label = "Close",
	...props
}: CloseButtonProps) {
	return (
		<IconButton size={size} variant="secondary" {...props} aria-label={label}>
			{children ?? <CloseIcon />}
		</IconButton>
	);
}
