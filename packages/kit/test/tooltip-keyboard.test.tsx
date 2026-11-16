import { cleanup, render, screen } from "solid-testing-library";
import { Tooltip } from "../src/components/Tooltip/Tooltip";
import { press, tick } from "./helpers";

afterEach(cleanup);

it("opens on child keyboard focus and closes on Escape without moving focus", async () => {
 render(() => <Tooltip content="Copy to clipboard"><button>Copy</button></Tooltip>);
 const button = screen.getByRole("button", { name: "Copy" });
 button.focus();
 await tick();
 expect(screen.getByRole("tooltip")).toHaveTextContent("Copy to clipboard");
 expect(document.activeElement).toBe(button);
 press("Escape");
 await tick();
 expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
 expect(document.activeElement).toBe(button);
});
