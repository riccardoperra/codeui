# Public API snapshot

Run `pnpm api:update` to rebuild and replace `kit.api.md`. Run `pnpm api:check` to rebuild and compare it without changing the report.

The script removes old declarations and forces a fresh build. It follows relative declarations and @codeui/styles reexports from the public entries, sorts the graph by path, and normalizes line endings. Style declaration changes remain visible across the package boundary. It records unresolved references explicitly. Use `--no-build` only to inspect an already completed build.

The graph includes internal declarations reachable through public types. Changes to those declarations can require a report update even when consumer signatures stay compatible. Other external dependency declarations are outside the report.

K0 verification injected `export type K0SnapshotProbe = string` into the declaration emitter through a temporary Rollup config edit. `pnpm api:check` exited 1. After restoring the config, the same command passed. No library source changed for this probe.
