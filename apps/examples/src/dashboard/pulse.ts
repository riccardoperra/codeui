import type { ToastController } from "@codeui/kit";
import { createContext, createMemo, createSignal, useContext } from "solid-js";
import { createStore } from "solid-js";
import {
	bucketSeries,
	createBuckets,
	createCustomers,
	type Customer,
	dailyMetrics,
	initialMembers,
	type Member,
	type PlanId,
	planOf,
	type RangeId,
	rangeOf,
	recentActivity,
	type Role,
	signupsBySource,
	summarize,
	type WeekStart,
} from "./data";

export type ViewId = "overview" | "customers";
export type SectionId = "general" | "appearance" | "notifications" | "members";

/** The app's state. Every figure derives from `customers`, `range` and `weekStart`, so the views always agree. */
export function createPulse(notifications: ToastController) {
	const [customers, setCustomers] = createSignal(createCustomers());
	const [view, setView] = createSignal<ViewId>("overview");
	const [range, setRange] = createSignal<RangeId>("30d");
	const [weekStart, setWeekStart] = createSignal<WeekStart>("monday");
	const [compare, setCompare] = createSignal(true);
	const [workspace, setWorkspace] = createSignal("Acme Analytics");
	const [members, setMembers] = createSignal(initialMembers);
	const [section, setSection] = createSignal<SectionId>();
	const [openCustomer, setOpenCustomer] = createSignal<string>();
	const [customersLoaded, setCustomersLoaded] = createSignal(false);
	const [alerts, setAlerts] = createStore({ digest: true, signups: true, trialEnding: true, paymentFailed: true, cancellations: false });

	// The sheet can redraw the row it was opened from, so the opener is kept as a selector, not as an element.
	let customerOpener = "";
	const showCustomer = (id: string, opener: string) => {
		customerOpener = opener;
		setOpenCustomer(id);
	};

	const days = () => rangeOf(range()).days;
	const daily = createMemo(() => dailyMetrics(customers()));
	const buckets = createMemo(() => createBuckets(range(), weekStart()));

	const update = (id: string, change: Partial<Customer>) => setCustomers(list => list.map(c => (c.id === id ? { ...c, ...change } : c)));

	const archive = (ids: readonly string[]) => {
		const removed = customers().filter(c => ids.includes(c.id));
		if (!removed.length) return;
		setCustomers(list => list.filter(c => !ids.includes(c.id)));
		if (ids.includes(openCustomer()!)) setOpenCustomer(undefined);
		notifications.show({
			description: removed.length === 1 ? `${removed[0].company} archived.` : `${removed.length} customers archived.`,
			action: { label: "Undo", onClick: toast => (setCustomers(list => [...list, ...removed]), toast.dismiss()) },
		});
	};

	const setPlan = (id: string, plan: PlanId) => {
		const before = customers().find(c => c.id === id);
		if (!before || before.plan === plan) return;
		update(id, { plan });
		notifications.show({
			tone: "success",
			description: `${before.company} moved to ${planOf(plan).name}.`,
			action: { label: "Undo", onClick: toast => (update(id, { plan: before.plan }), toast.dismiss()) },
		});
	};

	const retryPayment = (id: string) => {
		const customer = customers().find(c => c.id === id);
		if (!customer) return;
		update(id, { pastDue: false });
		notifications.show({
			tone: "success",
			description: `Payment collected from ${customer.company}.`,
			action: { label: "Undo", onClick: toast => (update(id, { pastDue: true }), toast.dismiss()) },
		});
	};

	const invite = (email: string) => {
		const member: Member = { id: `invite-${email}`, name: email.split("@")[0], email, role: "Member", invited: true };
		setMembers(list => [...list, member]);
		notifications.show({
			tone: "success",
			description: `Invite sent to ${email}.`,
			action: { label: "Undo", onClick: toast => (setMembers(list => list.filter(m => m.id !== member.id)), toast.dismiss()) },
		});
	};

	const setRole = (id: string, role: Role) => setMembers(list => list.map(m => (m.id === id ? { ...m, role } : m)));

	const removeMember = (id: string) => {
		const index = members().findIndex(m => m.id === id);
		const removed = members()[index];
		if (!removed) return;
		setMembers(list => list.filter(m => m.id !== id));
		notifications.show({
			description: `${removed.name} removed.`,
			action: {
				label: "Undo",
				onClick: toast => (setMembers(list => [...list.slice(0, index), removed, ...list.slice(index)]), toast.dismiss()),
			},
		});
	};

	return {
		customers,
		view,
		setView,
		range,
		setRange,
		weekStart,
		setWeekStart,
		compare,
		setCompare,
		workspace,
		setWorkspace,
		members,
		alerts,
		setAlerts,
		/** The settings section on screen. `undefined` while the dialog is closed. */
		section,
		setSection,
		openCustomer,
		setOpenCustomer,
		showCustomer,
		customerOpener: () => customerOpener,
		/** The customer table loads once per visit. */
		customersLoaded,
		setCustomersLoaded,
		summary: createMemo(() => summarize(daily(), days())),
		summaryBefore: createMemo(() => summarize(daily(), days(), 1)),
		series: createMemo(() => bucketSeries(daily(), buckets(), days())),
		sources: createMemo(() => signupsBySource(customers(), days())),
		activity: createMemo(() => recentActivity(customers(), days())),
		archive,
		setPlan,
		retryPayment,
		invite,
		setRole,
		removeMember,
	};
}

export type Pulse = ReturnType<typeof createPulse>;

export const PulseContext = createContext<Pulse>();

export function usePulse() {
	const pulse = useContext(PulseContext);
	if (!pulse) throw new Error("usePulse needs the PulseContext provider.");
	return pulse;
}
