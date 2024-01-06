import * as styles from "./NumberField.css";
import { Button } from "../Button/Button";
import { ChevronDownIcon, ChevronUpIcon } from "../../icons";

interface NumberFieldControlsProps {
	canIncrement: boolean;
	canDecrement: boolean;
	increment: () => void;
	decrement: () => void;
	step: number;
}

export function NumberFieldControls(props: NumberFieldControlsProps) {
	return (
		<div class={styles.controlsContainer}>
			<Button
				disabled={!props.canIncrement}
				type={"button"}
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
