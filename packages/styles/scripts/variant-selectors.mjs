const pseudo = (kind, ...selectors) => ({ type: "pseudo-class", kind, selectors });
const presence = attribute => ({ ...attribute, operation: null });

export function variantSelectorVisitor(contracts) {
	const variants = new Map();
	const legacyClasses = new Set();
	for (const symbols of Object.values(contracts))
		for (const { classNames } of Object.values(symbols)) {
			if (!classNames) continue;
			variants.set(classNames.base, classNames.variants);
			for (const group of Object.values(classNames.variants))
				for (const name of Object.values(group)) legacyClasses.add(name);
		}

	function compatibilitySelector(base, attribute, ...prefix) {
		if (
			!base ||
			attribute?.type !== "attribute" ||
			!attribute.name.startsWith("data-") ||
			(attribute.operation && attribute.operation.operator !== "equal")
		)
			return;
		const axis = attribute.name.slice(5);
		const value = attribute.operation?.value ?? "true";
		const axes = variants.get(base);
		const group = axes && Object.hasOwn(axes, axis) && axes[axis];
		const legacy = group && Object.hasOwn(group, value) && group[value];
		if (!legacy) return;
		return pseudo(
			"is",
			[...prefix, attribute],
			[
				{ type: "class", name: legacy },
				pseudo("where", [pseudo("not", [presence(attribute)])]),
			],
		);
	}

	function expand(selector, compoundBase) {
		const [first, second] = selector;
		const scopedCompound =
			selector.length === 2 && first.type === "class" && second.kind === "where"
				? first.name
				: undefined;
		const expanded = [];
		for (let index = 0; index < selector.length; index++) {
			const item = selector[index];
			if (item.type === "class" && legacyClasses.has(item.name))
				throw new Error(`Write a data attribute selector for .${item.name}`);
			const base =
				item.kind === "where" &&
				item.selectors.length === 1 &&
				item.selectors[0].length === 1 &&
				item.selectors[0][0].type === "class"
					? item.selectors[0][0].name
					: undefined;
			const withClass = base && compatibilitySelector(base, selector[index + 1], item);
			if (withClass) {
				expanded.push(withClass);
				index++;
			} else if (item.selectors) {
				expanded.push({
					...item,
					selectors: item.selectors.map(child => expand(child, scopedCompound)),
				});
			} else {
				expanded.push(compatibilitySelector(compoundBase, item) ?? item);
			}
		}
		return expanded;
	}
	return { Selector: selector => expand(selector) };
}
