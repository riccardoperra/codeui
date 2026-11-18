import { Button, NumberField, SegmentedControl, SegmentedControlItem, Slider, Switch, Text } from "@codeui/kit";
import { createSignal, For } from "solid-js";
import { formatNumber } from "../shared/format";
import { createControlSize } from "../shared/size";
import { formatOutcome, type Outcome, useBench } from "./bench";
import { loadStressInvoice, repriceDispatchLimit, repriceInOneTransaction, repriceRowByRow, resetDocument, setSlowPlugin } from "./invoice/commands";

const delays = [0, 10, 40, 100];

/** The knobs: how many rows, how slow the validation plugin is, and how a bulk edit is dispatched. */
export function LoadLab() {
	const bench = useBench();
	const size = createControlSize();
	const [stressRows, setStressRows] = createSignal(300);
	const [plantInvalid, setPlantInvalid] = createSignal(true);
	const [percent, setPercent] = createSignal(5);
	const [single, setSingle] = createSignal<Outcome>();
	const [perRow, setPerRow] = createSignal<Outcome>();

	const lockedNotice = () => bench.notifications.show({ tone: "warning", title: "Nothing changed", description: "The invoice is paid, so its document is locked." });
	const run = async (id: string, command: () => boolean, done?: (outcome: Outcome) => void) => {
		const outcome = await bench.perform(id, command);
		if (!outcome.applied) return lockedNotice();
		done?.(outcome);
	};
	const result = (outcome: Outcome | undefined) => (outcome ? formatOutcome(outcome) : "Not run yet");

	return (
		<div class="pmi-section pmi-lab">
			<Text as="p" size="xs" tone="muted" class="ex-tabular">
				{formatNumber(bench.rows())} rows · {formatNumber(bench.pages())} pages · {formatNumber(bench.invalidRows())} invalid
			</Text>

			<div class="pmi-lab-group">
				<Slider label="Stress invoice rows" minValue={300} maxValue={2000} step={100} value={stressRows()} onChange={setStressRows} showValue getValueLabel={({ values }) => formatNumber(values[0])} />
				<Switch label="Plant invalid rows" description="Every 25th row fails validation." size={size()} checked={plantInvalid()} onChange={setPlantInvalid} />
				<Button
					variant="secondary"
					size={size()}
					loading={bench.busy() === "stress"}
					disabled={bench.busy() !== null}
					onClick={() => run("stress", () => loadStressInvoice(bench.editor, stressRows(), plantInvalid() ? 25 : 0))}
				>
					Load stress invoice
				</Button>
			</div>

			<div class="pmi-lab-group">
				<Text as="h3" id="pmi-delay-label" size="sm" weight="medium">
					Validation plugin delay
				</Text>
				<SegmentedControl aria-labelledby="pmi-delay-label" size={size()} value={String(bench.validationDelay())} onChange={value => setSlowPlugin(bench.editor, Number(value))}>
					<For each={delays}>{delay => <SegmentedControlItem value={String(delay)}>{delay === 0 ? "Off" : `${delay} ms`}</SegmentedControlItem>}</For>
				</SegmentedControl>
			</div>

			<div class="pmi-lab-group">
				<NumberField label="Price increase (%)" postfix="%" min={1} max={50} size={size()} value={percent()} onChange={value => setPercent(value ?? 5)} />
				<div class="pmi-lab-compare">
					<Button
						variant="secondary"
						size={size()}
						loading={bench.busy() === "single"}
						disabled={bench.busy() !== null}
						onClick={() => run("single", () => repriceInOneTransaction(bench.editor, percent()), setSingle)}
					>
						One transaction
					</Button>
					<Text as="output" size="xs" tone="muted" class="ex-tabular">
						{result(single())}
					</Text>
					<Button
						variant="secondary"
						size={size()}
						loading={bench.busy() === "per-row"}
						disabled={bench.busy() !== null}
						onClick={() => run("per-row", () => repriceRowByRow(bench.editor, percent()), setPerRow)}
					>
						Row by row
					</Button>
					<Text as="output" size="xs" tone="muted" class="ex-tabular">
						{result(perRow())}
					</Text>
				</div>
				<Text as="p" size="xs" tone="muted">
					Row by row stops at {repriceDispatchLimit} rows: every dispatch pays for a validation pass.
				</Text>
			</div>

			<div>
				<Button variant="secondary" ghost size={size()} onClick={() => resetDocument(bench.editor)}>
					Reset document
				</Button>
			</div>
		</div>
	);
}
