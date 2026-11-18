import { Alert, Button, Listbox, Text } from "@codeui/kit";
import Play from "lucide-solid/icons/play";
import { createSignal } from "solid-js";
import { createControlSize } from "../shared/size";
import { formatOutcome, type Outcome, useBench } from "./bench";
import { panels } from "./devtools";
import { setStatus } from "./invoice/commands";
import { type Scenario, scenarios } from "./invoice/scenarios";

/** Named scenarios. Each runs a command, then says which inspector panel shows it and what to look for. */
export function Scenarios() {
	const bench = useBench();
	const size = createControlSize();
	const [selectedId, setSelectedId] = createSignal(scenarios[0].id);
	const [outcomes, setOutcomes] = createSignal<Record<string, Outcome>>({});
	const selected = () => scenarios.find(scenario => scenario.id === selectedId())!;
	const outcome = () => outcomes()[selectedId()];

	// One toast at a time: a new run replaces the result of the last one.
	let toast: number | undefined;
	const notify = (options: Parameters<typeof bench.notifications.show>[0]) => {
		if (toast !== undefined) bench.notifications.dismiss(toast);
		toast = bench.notifications.show(options);
	};

	const run = async (scenario: Scenario) => {
		const wasLocked = bench.locked();
		const result = await bench.perform(scenario.id, () => scenario.run(bench.editor));
		setOutcomes(all => ({ ...all, [scenario.id]: result }));
		if (!result.applied) {
			notify({
				tone: "warning",
				title: "Nothing changed",
				description: wasLocked ? "The invoice is paid, so its document is locked." : "This scenario had nothing to do on the current document.",
				action: wasLocked ? { label: "Reopen as draft", onClick: toast => (setStatus(bench.editor, "draft"), toast.dismiss()) } : undefined,
			});
			return;
		}
		// An open inspector follows the scenario. A closed one stays closed, and the toast offers it.
		if (bench.inspectorOpen()) bench.setPanel(scenario.panel);
		notify({
			title: scenario.title,
			description: `${formatOutcome(result)}. Look in ${panels[scenario.panel]}.`,
			action: bench.inspectorOpen() ? undefined : { label: "Open inspector", onClick: toast => (bench.inspect(scenario.panel), toast.dismiss()) },
		});
	};

	return (
		<div class="pmi-section">
			<section class="pmi-scenario" aria-label="Selected scenario">
				<div>
					<Text as="h3" size="sm" weight="semibold">
						{selected().title}
					</Text>
					<Text as="p" size="xs" tone="muted">
						{selected().description}
					</Text>
				</div>
				<Alert tone="neutral" fluid title={panels[selected().panel]} description={selected().observe} />
				<div class="pmi-scenario-actions">
					<Button variant="primary" size={size()} leftIcon={<Play size={16} />} loading={bench.busy() === selectedId()} disabled={bench.busy() !== null} onClick={() => run(selected())}>
						Run
					</Button>
					<Button variant="secondary" ghost size={size()} onClick={() => bench.inspect(selected().panel)}>
						Open panel
					</Button>
				</div>
				{/* Always one line tall, so the first result does not grow the card. */}
				<Text as="output" size="xs" tone="muted" class="pmi-scenario-outcome ex-tabular" aria-live="polite">
					{outcome() ? (outcome().applied ? `Last run: ${formatOutcome(outcome())}` : "Last run: nothing changed") : "Not run yet"}
				</Text>
			</section>
			<Listbox
				aria-label="Scenarios"
				options={scenarios as Scenario[]}
				optionValue="id"
				optionTextValue="title"
				itemLabel={scenario => scenario.title}
				selectionMode="single"
				disallowEmptySelection
				value={new Set([selectedId()])}
				onChange={keys => setSelectedId([...keys][0] ?? selectedId())}
				size={size()}
			/>
		</div>
	);
}
