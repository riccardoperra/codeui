# Public API snapshot

Run `pnpm api:update` to rebuild and replace `kit.api.md`. Run `pnpm api:check` to rebuild and compare it without changing the report.

The script removes old declarations and forces a fresh build. It follows relative declaration imports and exports from the public entry, sorts the graph by path, and normalizes line endings. It records unresolved references explicitly. The current build does not emit a declaration for `components/Field/fieldStyle`, although the entry exports it. This broken declaration graph prevents a complete API Extractor rollup, so the snapshot preserves the emitted graph instead.

The graph includes internal declarations reachable through public types. Changes to those declarations can require a report update even when consumer signatures stay compatible. External dependency declarations are outside the report.

K0 verification injected `export type K0SnapshotProbe = string` into the declaration emitter through a temporary Rollup config edit. `pnpm api:check` exited 1. After restoring the config, the same command passed. No library source changed for this probe.
