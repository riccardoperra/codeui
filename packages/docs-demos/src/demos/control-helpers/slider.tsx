import { createSliderProps, type SliderProps } from "@codeui/kit";
import * as S from "@codeui/kit/slider";
import { createSignal } from "solid-js";
export default function Demo() {
	const [value, setValue] = createSignal(75);
	const props = (): SliderProps => ({
		label: "Opacity",
		value: value(),
		onChange: setValue,
		name: "opacity",
	});
	const field = createSliderProps(props);
	return (
		<S.Root {...field.root()}>
			<S.Label {...field.label()}>Opacity</S.Label>
			<S.Track>
				<S.Fill />
				<S.Thumb aria-label="Opacity">
					<S.Input {...field.input()} />
				</S.Thumb>
			</S.Track>
		</S.Root>
	);
}
