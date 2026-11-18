# CodeUI React

Inkstone components for React 19. React Aria Components provides the behavior and `@codeui/styles` provides the visual contract.

```sh
pnpm add @codeui/react react react-dom
```

Import the stylesheet in your app entry or root layout.

```tsx
import "@codeui/react/style.css";
import { Button } from "@codeui/react";

export function ExportButton() {
  return <Button>Export</Button>;
}
```

Set `data-cui-theme` on `<html>` to choose a theme. Use the [React documentation](https://codeui-docs.pages.dev/docs/react) for component examples, API reference, and theming.
