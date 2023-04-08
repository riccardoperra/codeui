import { Accessor, createContext, useContext } from "solid-js";

export interface SegmentedFieldContextValue {
	ariaDescribedBy: Accessor<string | undefined>;
	isSelectedValue: (value: string) => boolean;
	setSelectedValue: (value: string) => void;
}

export const SegmentedFieldContext = createContext<SegmentedFieldContextValue>();

export function useSegmentedFieldContext() {
	const context = useContext(SegmentedFieldContext);

	if (context === undefined) {
		throw new Error(
			"[@codeui/core]: `useSegmentedFieldContext` must be used within a `SegmentedField` component",
		);
	}

	return context;
}
