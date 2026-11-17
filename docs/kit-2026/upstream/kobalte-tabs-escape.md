# Tabs prevents Escape when selection cannot be cleared

Tested with @kobalte/core 0.13.14 and solid-js 1.9.19.

## Reproduction

Place a Tabs root with two triggers inside a Dialog or Popover. Open the layer, focus a trigger, and press Escape.

Expected behavior is that Escape dismisses the enclosing layer because tabs cannot clear their selection. Actual behavior is that the layer stays open.

The selectable collection Escape handler calls preventDefault even when disallowEmptySelection prevents it from clearing selection. Tabs always disallows empty selection. The dismissable layer respects defaultPrevented, so it does not dismiss.

## Suggested fix

Call preventDefault only when Escape actually clears selection. Preserve caller cancellation and test Tabs inside both Dialog and Popover.

## Kit workaround

SegmentedControl installs releaseEscape on its root during capture. It stops the original event and dispatches a bubbling, cancelable Escape from the root's parent. A caller can cancel this through onEscapeKeyDown. Remove the workaround when the installed Kobalte version includes the upstream fix.

The kit regression tests cover dismissal, caller cancellation, arrow navigation, and Enter selection. No upstream issue has been posted.
