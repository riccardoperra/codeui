import { createRoot, createSignal } from "solid-js"
import { isServer } from "solid-js/web"
import { createHello, Hello } from "../src"
import { render } from "solid-testing-library"

describe("environment", () => {
	it("runs on server", () => {
		expect(typeof window).toBe("object")
		expect(isServer).toBe(false)
	})
})

describe("createHello", () => {
	it("Returns a Hello World signal", () =>
		createRoot(dispose => {
			const [hello] = createHello()
			expect(hello()).toBe("Hello World!")
			dispose()
		}))

	it("Changes the hello target", () =>
		createRoot(dispose => {
			const [hello, setHello] = createHello()
			setHello("Solid")
			expect(hello()).toBe("Hello Solid!")
			dispose()
		}))
})

describe("Hello", () => {
	it("renders a hello component", () => {
		const { container } = render(() => <Hello />)
		expect(container.innerHTML).toBe("<div>Hello World!</div>")
	})

	it("changes the hello target", () =>
		createRoot(dispose => {
			const [to, setTo] = createSignal("Solid")
			const { container } = render(() => <Hello to={to()} />)
			expect(container.innerHTML).toBe("<div>Hello Solid!</div>")
			setTo("Tests")

			// rendering is async
			queueMicrotask(() => {
				expect(container.innerHTML).toBe("<div>Hello Tests!</div>")
				dispose()
			})
		}))
})
