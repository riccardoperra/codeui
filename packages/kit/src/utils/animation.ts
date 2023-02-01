import {
	Accessor,
	createComponent,
	createContext,
	createEffect,
	createSignal,
	on,
	ParentProps,
	Setter,
	splitProps,
	useContext,
} from "solid-js";
import { AnimationControls } from "motion";

interface AnimationContextProps {
	onExitAnimationFinish?: () => void;
	state: boolean;
}

const AnimationContext = createContext<ReturnType<typeof createAnimationContextState>>();

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
		on(ref, ref => {
			if (ref) {
				createEffect(
					on(
						() => props.state,
						state => {
							if (state && onEnterCallback) {
								onEnterCallback();
							}
							if (!state && onExitCallback) {
								if (contextState.children) {
									exitAnimationRecursive(contextState.children);
								}
								onExitCallback().finished.then(props.onExitAnimationFinish);
							}
						},
					),
				);
			}
		}),
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
	const [local, others] = splitProps(props, ["children"]);
	const context = useContext(AnimationContext);

	return createComponent(AnimationContext.Provider, {
		get value() {
			return createAnimationContextState(others, context);
		},
		get children() {
			return local.children;
		},
	});
}

/**
 * @deprecated Should use kobalte presence
 */
export function useAnimationContext() {
	return useContext(AnimationContext)!;
}
