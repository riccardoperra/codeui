import "@testing-library/jest-dom/vitest";
import { configure } from "@solidjs/testing-library";
import { flush } from "solid-js";

// A dispatched DOM event completes its reactive update before an assertion.
configure({
	eventWrapper: callback => {
		flush();
		return flush(callback);
	},
});
