import "@codeui/styles/theme.css";
import "@codeui/styles/number-field.css";
import * as styles from "./NumberField.css";
import { Button } from "../Button/Button";
import { ChevronDownIcon } from "../../icons/ChevronDownIcon";
import { ChevronUpIcon } from "../../icons/ChevronUpIcon";
import { mergeClasses } from "../../utils/css";

interface NumberFieldControlsProps {
	class?: string;
	canIncrement: boolean;
	canDecrement: boolean;
	increment: () => void;
	decrement: () => void;
	step: number;
}

/** Step buttons. They stay out of the tab order: the input steps with the arrow keys. */
export function NumberFieldControls(props: NumberFieldControlsProps) {
	return (
		<div class={mergeClasses(styles.controlsContainer, props.class)}>
			<Button
				disabled={!props.canIncrement}
				type={"button"}
				tabIndex={-1}
				variant={"ghost"}
				theme={"secondary"}
				aria-label={`Increment by ${props.step}`}
				class={styles.controlButton}
				onClick={props.increment}
			>
				<ChevronUpIcon class={styles.control} />
			</Button>
			<Button
				disabled={!props.canDecrement}
				type={"button"}
				tabIndex={-1}
				variant={"ghost"}
				theme={"secondary"}
				aria-label={`Decrement by ${props.step}`}
				class={styles.controlButton}
				onClick={props.decrement}
			>
				<ChevronDownIcon class={styles.control} />
			</Button>
		</div>
	);
}
