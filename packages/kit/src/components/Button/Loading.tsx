import * as styles from "./Loading.css";
import { mergeClasses } from "../../utils/css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

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
