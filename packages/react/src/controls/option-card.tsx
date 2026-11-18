"use client";

import {
	itemName,
	itemText,
	optionCardParts,
	optionCardStyleProps,
	optionCardStyles,
	type OptionCardClasses,
	type OptionCardPart,
	type OptionCardVariant,
} from "@codeui/styles/optioncard";
import { createContext, useContext, type ComponentProps, type ReactNode } from "react";
import {
	FieldError,
	Label,
	Radio,
	RadioGroup,
	Text,
	composeRenderProps,
	type FieldErrorProps,
} from "react-aria-components";
import { classes } from "../classes";
import { Badge } from "./badge";
import { flag } from "./utils";

export type { OptionCardClasses, OptionCardVariant };

export type OptionCardEntry = {
	value: string;
	label: ReactNode;
	description?: ReactNode;
	/** A schematic of the option in its own colours (DESIGN.md §9.4). */
	preview?: ReactNode;
	badge?: ReactNode;
	isDisabled?: boolean;
};

type Appearance = { variant?: OptionCardVariant; classes?: OptionCardClasses };
const AppearanceContext = createContext<Appearance>({});

export type OptionCardProps = Omit<ComponentProps<typeof Radio>, "children" | "value"> &
	OptionCardEntry &
	Appearance;

/** One option of an OptionCardGroup: a card the whole of which is the radio's label. */
export function OptionCard({
	label,
	description,
	preview,
	badge,
	variant,
	classes: own,
	className,
	...props
}: OptionCardProps) {
	const group = useContext(AppearanceContext);
	const tile = (variant ?? group.variant) === "tile" ? "tile" : undefined;
	const part = (name: OptionCardPart) => classes(group.classes?.[name], own?.[name]);
	const { class: item, ...itemAttributes } = optionCardStyleProps.item({ variant: tile });
	const { class: itemLabel, ...labelAttributes } = optionCardStyleProps.itemLabel({
		variant: tile,
	});
	return (
		<Radio
			{...itemAttributes}
			{...props}
			className={composeRenderProps(className, className =>
				classes(item, part("item"), className),
			)}
		>
			{({ isSelected, isDisabled }) => (
				<span
					{...labelAttributes}
					data-checked={flag(isSelected)}
					data-disabled={flag(isDisabled)}
					className={classes(itemLabel, part("itemLabel"))}
				>
					{preview ? (
						<span
							aria-hidden="true"
							data-cui={optionCardParts.preview}
							className={classes(optionCardStyles.preview(), part("preview"))}
						>
							{preview}
						</span>
					) : null}
					<span className={itemText}>
						<span className={itemName}>
							<span>{label}</span>
							{badge ? (
								<Badge
									data-cui={optionCardParts.badge}
									className={classes(optionCardStyles.badge(), part("badge"))}
								>
									{badge}
								</Badge>
							) : null}
						</span>
						{description ? (
							<span
								data-cui={optionCardParts.itemDescription}
								className={classes(
									optionCardStyles.itemDescription(),
									part("itemDescription"),
								)}
							>
								{description}
							</span>
						) : null}
					</span>
				</span>
			)}
		</Radio>
	);
}

export type OptionCardGroupProps = Omit<
	ComponentProps<typeof RadioGroup>,
	"children" | "orientation"
> &
	Appearance & {
		/** The options. Without `items`, compose OptionCard children. */
		items?: readonly OptionCardEntry[];
		children?: ReactNode;
		label?: ReactNode;
		description?: ReactNode;
		/** Shown while the group is invalid. */
		errorMessage?: FieldErrorProps["children"];
		/** Three across by default; `vertical` stacks the cards. */
		orientation?: "horizontal" | "vertical";
	};

/** React Aria's RadioGroup as option cards, three across (DESIGN.md §9.1, §9.4). */
export function OptionCardGroup({
	items,
	children,
	label,
	description,
	errorMessage,
	orientation = "horizontal",
	variant,
	classes: parts,
	className,
	...props
}: OptionCardGroupProps) {
	const { class: root, ...rootAttributes } = optionCardStyleProps({
		orientation: orientation === "vertical" ? "vertical" : undefined,
	});
	return (
		<RadioGroup
			{...rootAttributes}
			{...props}
			orientation={orientation}
			className={composeRenderProps(className, className =>
				classes(root, parts?.root, className),
			)}
		>
			{label ? (
				<Label
					data-cui={optionCardParts.label}
					className={classes(optionCardStyles.label(), parts?.label)}
				>
					{label}
				</Label>
			) : null}
			{description ? (
				<Text
					slot="description"
					data-cui={optionCardParts.description}
					className={classes(optionCardStyles.description(), parts?.description)}
				>
					{description}
				</Text>
			) : null}
			<AppearanceContext.Provider value={{ variant, classes: parts }}>
				{items ? items.map(item => <OptionCard key={item.value} {...item} />) : children}
			</AppearanceContext.Provider>
			<FieldError
				data-cui={optionCardParts.errorMessage}
				className={classes(optionCardStyles.errorMessage(), parts?.errorMessage)}
			>
				{errorMessage}
			</FieldError>
		</RadioGroup>
	);
}
