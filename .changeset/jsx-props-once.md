---
"@codeui/kit": patch
---
Build each JSX content prop once, so server-rendered Alert, Badge, Button, Progress, Switch, Slider, OptionCardGroup and the form fields hydrate without a mismatch, and Select no longer writes an `errorMessage` attribute.
