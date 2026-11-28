import {
	Accessor,
	createComponent,
	createContext,
	createEffect,
	createSignal,
	ParentProps,
	Setter,
	useContext,
	omit,
} from "solid-js";
import { AnimationControls } from "motion";

interface AnimationContextProps {
	onExitAnimationFinish?: () => void;
	state: boolean;
}

const AnimationContext = createContext<ReturnType<
	typeof createAnimationContextState
> | null>(null);

type AnimationContextState = {
	ref: Accessor<HTMLElement | undefined>;
	setRef: Setter<HTMLElement | undefined>;
	state: Accessor<boolean>;
	registerOnEnter(fn: (ref: HTMLElement) => AnimationControls): void;
	registerOnExit(fn: (ref: HTMLElement) => AnimationControls): void;
	parentContext?: AnimationContextState;
	children?: AnimationContextState;
	forceExit(): void;
};

function exitAnimationRecursive(context: AnimationContextState) {
	context.forceExit();
	if (context.children) {
		exitAnimationRecursive(context.children);
	}
}

function createAnimationContextState(
	props: AnimationContextProps,
	parentContext: AnimationContextState | undefined,
) {
	const [ref, setRef] = createSignal<HTMLElement | undefined>();
	let onEnterCallback: () => AnimationControls;
	let onExitCallback: () => AnimationControls;

	const contextState: AnimationContextState = {
		ref,
		setRef,
		state() {
			return props.state;
		},
		registerOnEnter(fn) {
			onEnterCallback = () => fn(ref()!);
		},
		registerOnExit(fn) {
			onExitCallback = () => fn(ref()!);
		},
		children: undefined,
		parentContext,
		forceExit() {
			if (onExitCallback) onExitCallback();
		},
	} as const;

	createEffect(
		() => ({ element: ref(), state: props.state }),
		({ element, state }) => {
			if (!element) return;
			if (state) {
				onEnterCallback?.();
			} else if (onExitCallback) {
				if (contextState.children) exitAnimationRecursive(contextState.children);
				void onExitCallback().finished.then(props.onExitAnimationFinish);
			}
		},
	);

	if (parentContext) {
		parentContext.children = contextState;
	}

	return contextState;
}

/**
 * @deprecated Should use kobalte presence
 * @param props
 * @constructor
 */
export function AnimationContextProvider(props: ParentProps<AnimationContextProps>) {
	const others = omit(props, "children");
	const context = useContext(AnimationContext);

	return createComponent(AnimationContext, {
		get value() {
			return createAnimationContextState(others, context ?? undefined);
		},
		get children() {
			return props.children;
		},
	});
}

/**
 * @deprecated Should use kobalte presence
 */
export function useAnimationContext() {
	return useContext(AnimationContext)!;
}
