# Upstream issue draft. `scrollIntoViewport` loops forever when the page root has `overflow: hidden`

Not filed. Ready to paste into a new issue at kobaltedev/kobalte. CodeImage branch `fix/kobalte-scroll-freeze` carries the same one-line fix as a `pnpm patch` (see `docs/kit-2026/phase-0/threads.md`, thread 9, and `docs/kit-2026/phase-0/census.md`, finding 6). Kobalte PR #750 may already address it; threads.md records it as open and unmerged on 2026-11-16, and this draft did not re-check that.

---

**Title.** `scrollIntoViewport` hangs the tab when the root has `overflow: hidden` and the target sits in a scroll container

**Version.** `@kobalte/utils@0.9.2`, the latest 0.x, shipped with `@kobalte/core@0.13.14`.

**What happens.** The tab freezes. For example, press Enter, Space or ArrowDown on a `DropdownMenu` or `Select` trigger inside a scrollable panel on a page whose `<html>` has `overflow: hidden`. Nothing renders again until the tab is killed.

**Cause.** When the root has `overflow: hidden`, `scrollIntoViewport` walks up the scroll parents:

```js
let scrollParent = getScrollParent(targetElement);
while (targetElement && scrollParent && targetElement !== root && scrollParent !== root) {
  scrollIntoView(scrollParent, targetElement);
  targetElement = scrollParent;
  scrollParent = getScrollParent(targetElement);
}
```

`getScrollParent(node)` starts its search at `node` itself. After the first step `targetElement` is a scrollable element, so `getScrollParent(targetElement)` returns that same element. `targetElement` and `scrollParent` never change and the loop never ends.

**Minimal repro.** Node with jsdom, using the five functions copied unchanged from `@kobalte/utils@0.9.2` `dist/index.js` (`getScrollParent`, `isScrollable`, `scrollIntoView`, `relativeOffset`, `scrollIntoViewport`):

```js
const dom = new JSDOM(`<!doctype html>
<html style="overflow:hidden"><body>
  <div style="overflow:auto;height:50px">
    <div id="t" style="height:200px">item</div>
  </div>
</body></html>`);
globalThis.window = dom.window;
globalThis.document = dom.window.document;

scrollIntoViewport(document.getElementById("t")); // never returns
```

Run under `timeout 5 node repro.cjs`. With 0.9.2 the process is killed (exit 124). With the fix below it returns at once (exit 0).

**Proposed fix.** One line. Start the next lookup at the parent:

```diff
   targetElement = scrollParent;
-  scrollParent = getScrollParent(targetElement);
+  scrollParent = getScrollParent(targetElement.parentElement);
```

When `parentElement` is `null`, `getScrollParent` returns the root and the loop exits.

**Workaround today.** Patch `@kobalte/utils` with the line above (ESM and CJS builds), or keep menu and select triggers out of scroll containers.
