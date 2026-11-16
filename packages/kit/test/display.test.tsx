import { cleanup, render, screen } from "solid-testing-library";
import { Badge } from "../src/components/Badge/Badge";
import { Kbd } from "../src/components/Kbd/Kbd";
import { Skeleton } from "../src/components/Skeleton/Skeleton";
import { Spinner } from "../src/components/Spinner/Spinner";
import * as B from "../src/parts/badge";
import * as S from "../src/parts/skeleton";

afterEach(cleanup);

describe("Kbd", () => {
	it("renders the key in a kbd element", () => {
		render(() => <Kbd>⌘K</Kbd>);
		expect(screen.getByText("⌘K").tagName).toBe("KBD");
	});

	it("keeps aria-hidden for a decorative hint", () => {
		render(() => (
			<label>
				Search
				<Kbd variant="hint" aria-hidden="true">
					/
				</Kbd>
				<input />
			</label>
		));
		expect(screen.getByRole("textbox")).toHaveAccessibleName("Search");
	});

	it("puts class and classes.root on the key", () => {
		render(() => (
			<Kbd class="own" classes={{ root: "keyed" }}>
				?
			</Kbd>
		));
		expect(screen.getByText("?")).toHaveClass("own", "keyed");
	});
});

describe("Badge", () => {
	it("names the badge with its text, not its icon", () => {
		render(() => <Badge icon={<svg role="img" aria-label="flask" />}>Experimental</Badge>);
		expect(screen.getByRole("status")).toHaveTextContent("Experimental");
		expect(screen.queryByRole("img", { name: "flask" })).not.toBeInTheDocument();
	});

	it("uses textValue as the name when the content is not text", () => {
		render(() => (
			<Badge textValue="3 unread">
				<svg />
			</Badge>
		));
		expect(screen.getByRole("status", { name: "3 unread" })).toBeInTheDocument();
	});

	it("puts each class from classes on its part", () => {
		render(() => (
			<Badge icon={<svg />} classes={{ root: "r", icon: "i", label: "l" }}>
				New
			</Badge>
		));
		const root = screen.getByRole("status");
		expect(root).toHaveClass("r");
		expect(root.querySelector('[data-cui="badge-icon"]')).toHaveClass("i");
		expect(screen.getByText("New")).toHaveClass("l");
	});

	it("exposes tone, size and variant as attributes for app CSS", () => {
		render(() => (
			<B.Root tone="danger" size="md" variant="outline">
				Failed
			</B.Root>
		));
		const root = screen.getByRole("status");
		expect(root).toHaveAttribute("data-tone", "danger");
		expect(root).toHaveAttribute("data-size", "md");
		expect(root).toHaveAttribute("data-variant", "outline");
	});
});

describe("Spinner", () => {
	it("announces a labelled spinner as a status", () => {
		render(() => <Spinner label="Loading projects" />);
		expect(screen.getByRole("status", { name: "Loading projects" })).toBeInTheDocument();
	});

	it("hides an unlabelled spinner inside a control that names the busy state", () => {
		render(() => (
			<button aria-busy="true">
				<Spinner size="sm" />
				Exporting
			</button>
		));
		expect(screen.queryByRole("status")).not.toBeInTheDocument();
		expect(screen.getByRole("button")).toHaveAccessibleName("Exporting");
	});
});

describe("Skeleton", () => {
	it("hides placeholder content from assistive technology while visible", () => {
		render(() => (
			<Skeleton>
				<button>Save</button>
			</Skeleton>
		));
		expect(screen.queryByRole("button")).not.toBeInTheDocument();
	});

	it("shows its content once it is no longer visible", () => {
		render(() => (
			<Skeleton visible={false}>
				<button>Save</button>
			</Skeleton>
		));
		expect(screen.getByRole("button", { name: "Save" })).toBeVisible();
	});

	it("takes CSS lengths for its size and radius", () => {
		const { container } = render(() => <Skeleton width="12rem" height="1.25rem" radius="50%" />);
		const block = container.querySelector<HTMLElement>('[data-cui="skeleton-root"]')!;
		expect(block.style.width).toBe("12rem");
		expect(block.style.height).toBe("1.25rem");
		expect(block.style.borderRadius).toBe("50%");
	});

	it("draws a circle as wide as it is high", () => {
		const { container } = render(() => <Skeleton circle height="2rem" />);
		const block = container.querySelector<HTMLElement>('[data-cui="skeleton-root"]')!;
		expect(block.style.width).toBe("2rem");
		expect(block.style.height).toBe("2rem");
	});

	it("keeps the engine's numeric px sizes on the styled part", () => {
		const { container } = render(() => <S.Root width={40} height={8} />);
		const block = container.querySelector<HTMLElement>('[data-cui="skeleton-root"]')!;
		expect(block.style.width).toBe("40px");
		expect(block.style.height).toBe("8px");
	});
});
