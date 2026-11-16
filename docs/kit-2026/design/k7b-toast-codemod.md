# Toast codemod: `@codeimage/ui` toast to `createToaster`

This note maps each current CodeImage call shape to the kit API. It covers the 13 files that import `toast` from `@codeimage/ui` and the one `SnackbarHost` in `apps/codeimage/src/index.tsx`, read at CodeImage `origin/main`. The migration itself is C1 and does not ship in the kit PR.

## Setup

Create one controller for the app in a module that every caller imports, for example `apps/codeimage/src/ui/notifications.ts`:

```ts
import { createToaster } from "@codeui/kit";
export const notifications = createToaster();
```

CodeImage renders only on the client, so a module-level controller is safe. An app that renders on the server creates the controller per request, inside its root component.

Replace `<SnackbarHost containerClassName={snackbarHostAppStyleCss} />` with a `Toaster` inside the locale and theme providers. Toast content renders inside the `Toaster`, so `useI18n` in a content callback keeps working.

```tsx
<Toaster
	toaster={notifications}
	position="bottom-center"
	closeLabel={t("common.close")}
	class={snackbarHostAppStyleCss}
/>
```

`snackbarHostAppStyleCss` sets `inset` with `!important` for solid-toast's container. Rewrite it to offset the kit region, for example `bottom: 80px`. App CSS outside `@layer cui` overrides the kit without `!important`.

## Call shapes

| Current call | Kit call |
| --- | --- |
| `toast.success(message, opts)` | `notifications.show({ description: message, tone: "success", ...mapped })` |
| `toast.error(message, opts)` | `notifications.show({ description: message, tone: "danger", ...mapped })` |
| `toast.success(() => t("key"))` | `notifications.show({ description: () => t("key"), tone: "success" })` |
| `toast.success(active => render(active.id), opts)` | `notifications.show({ description: toast => render(toast.id), tone: "success", ...mapped })` |
| `toast.dismiss(id)` | `notifications.dismiss(id)` |
| `let id: string \| null` holding a returned id | `let id: ToastId \| null` (a number) |

`mapped` is `opts` after this table:

| solid-toast option | Kit option |
| --- | --- |
| `position: "bottom-center"` | Remove it. The `Toaster` sets the position. |
| `duration: 8000` | `duration: 8000`. `Infinity` keeps the toast open. |
| `theme: getUiStore().invertedThemeMode()` | `theme: getUiStore().invertedThemeMode()`. It sets `data-cui-theme` on the toast. |
| `style: { "max-width": "min(480px, calc(100vw - 32px))" }` | Remove it. The kit toast already has that width limit. |
| `className` | `class` |

## File notes

- `presets.ts` (12 calls), `ProjectItem.tsx`, `CreateNewProjectButton.tsx`, `PresetSwitcher.tsx`, `activeEditor.ts`, `createEditorSync.ts`, `AnimationPreview.tsx`, `notify-font-fallback.ts`, `CopyAltTextButton.tsx` and `signatures.ts` use only the string and callback shapes. `signatures.ts` passes a shared `toastPosition` object, which goes away.
- Calls with no `position` showed at solid-toast's default, top-center. They now show bottom-center with the rest. This is deliberate. An app that needs a second position creates a second controller and `Toaster`.
- `export.tsx` wraps `toast.error` in `runWithOwner` so that `t` resolves. The content callback now renders under the `Toaster`, so the wrapper is optional.
- `ExportSuccessToast.tsx` puts `data-cui-theme` on its content `div`. Move it to the `theme` option and keep `CopyAltTextButton` in the description JSX, with `onCopy={() => notifications.dismiss(toast.id)}`.
- `CanvasEditor.tsx` renders a format `Button` inside the message. It can become `action: { label: t("canvas.format"), onClick: toast => { format(); toast.dismiss(); } }`, or stay as description JSX. The undo listener keeps calling `notifications.dismiss(activeToastId)`.
- No caller uses `toast.remove` or `toast.custom`. The kit has no immediate-removal method.
- Save flows in `presets.ts` that show success or error after a promise can use `notifications.promise(promise, { loading, success, error })` if they want a loading state. This is optional.
