import { Accessor, createContext, useContext } from "solid-js";

export interface SegmentedFieldItemDataSet {
	"data-valid": string | undefined;
	"data-invalid": string | undefined;
	"data-checked": string | undefined;
	"data-disabled": string | undefined;
}

export interface SegmentedFieldItemContextValue {
	value: Accessor<string>;
	dataset: Accessor<SegmentedFieldItemDataSet>;
	isSelected: Accessor<boolean>;
	isDisabled: Accessor<boolean>;
	generateId: (part: string) => string;
	setIsFocused: (isFocused: boolean) => void;
}

export const SegmentedFieldItemContext = createContext<SegmentedFieldItemContextValue>();

export function useSegmentedFieldItemContext() {
	const context = useContext(SegmentedFieldItemContext);

	if (context === undefined) {
		throw new Error(
			"[kobalte][@codeui/core]: `useSegmentedFieldItemContext` must be used within a `SegmentedField.Item` component",
		);
	}

	return context;
}
