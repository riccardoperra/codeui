export interface SlotProp<T extends string> {
	/** CSS classes to be passed to the component slots. */
	slotClasses?: Partial<Record<T, string>>;
}
