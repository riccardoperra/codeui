import { assignInlineVars } from "@vanilla-extract/dynamic";
import { mergeClasses } from "../../utils/css";
import * as styles from "./Loading.css";

export function Loading() {
	return (
		<div class={styles.wrapper}>
			<span aria-label="Loading" class={styles.pointerGroup}>
				<i class={mergeClasses(styles.pointer)} />
				<i
					class={mergeClasses(styles.pointer)}
					style={assignInlineVars({
						[styles.pointerAnimationDelay]: "0.2s",
					})}
				/>
				<i
					class={mergeClasses(styles.pointer)}
					style={assignInlineVars({
						[styles.pointerAnimationDelay]: "0.4s",
					})}
				/>
			</span>
		</div>
	);
}
