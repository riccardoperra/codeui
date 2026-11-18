import { createSwitchProps, type SwitchProps } from "@codeui/kit";
import * as S from "@codeui/kit/switch/parts";
import { createSignal } from "solid-js";
export default function Demo() {
	const [checked, setChecked] = createSignal(true);
	const props = (): SwitchProps => ({
		label: "Line numbers",
		checked: checked(),
		onChange: setChecked,
		name: "lines",
		value: "include",
	});
	const field = createSwitchProps(props);
	return (
		<S.Root {...field.root()}>
			<S.Input {...field.input()} />
			<S.Control>
				<S.Thumb />
			</S.Control>
			<S.Label {...field.label()}>{props().label}</S.Label>
		</S.Root>
	);
}
