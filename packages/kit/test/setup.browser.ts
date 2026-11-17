import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// The legacy testing library reads this Node environment flag on import.
vi.stubGlobal("process", { env: {} });
