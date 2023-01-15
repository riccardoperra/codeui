import { access, accessWith, MaybeAccessor } from "@kobalte/utils";
import { createMemo, createSignal, untrack } from "solid-js";

export interface CreateControllableSignalProps<T> {
	/**
	 * The value to be used, in controlled mode.
	 */
	value?: MaybeAccessor<T | undefined>;

	/**
	 * The initial value to be used, in uncontrolled mode.
	 */
	defaultValue?: MaybeAccessor<T | undefined>;

	/**
	 * The callback fired when the value changes.
	 */
	onChange?: (value: T) => void;
}

export function createControllableSignal<T>(props: CreateControllableSignalProps<T>) {
	// Internal uncontrolled value
	const [internalValue, setInternalValue] = createSignal(access(props.defaultValue));
	const isControlled = createMemo(() => access(props.value) !== undefined);
	const value = createMemo(() =>
		isControlled() ? access(props.value) : internalValue(),
	);
	const setValue = (next: Exclude<T, Function> | ((prev: T) => T)) => {
		untrack(() => {
			const nextValue = accessWith(next, value() as T);

			if (!Object.is(nextValue, value())) {
				if (!isControlled()) {
					setInternalValue(nextValue as Exclude<T, Function>);
				}
				props.onChange?.(nextValue);
			}
			return nextValue;
		});
	};

	return [value, setValue] as const;
}
