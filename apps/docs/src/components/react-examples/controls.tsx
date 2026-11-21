import {
  Alert,
  Badge,
  Button,
  Checkbox,
  FieldDescription,
  FieldError,
  FieldInput,
  FieldLabel,
  IconButton,
  Kbd,
  Link,
  NumberField,
  OptionCardGroup,
  Progress,
  RadioList,
  RadioListItem,
  SegmentedControl,
  SegmentedControlItem,
  Skeleton,
  Slider,
  Spinner,
  Stack,
  SvgIcon,
  Switch,
  Text,
  TextArea,
  TextField,
} from '@codeui/react';
import { useEffect, useState } from 'react';

const fieldWidth = { width: 280, maxWidth: '100%' };

function AlertExample() {
  return (
    <Alert
      tone="warning"
      title="Unsaved changes"
      showIcon
      action={<Button size="xs" variant="secondary">Review</Button>}
    >
      Your edits are stored in this browser only.
    </Alert>
  );
}

function BadgeExample() {
  return (
    <Stack direction="row" gap="2" align="center">
      <Badge>Draft</Badge>
      <Badge tone="info">New</Badge>
      <Badge tone="success" variant="outline">Saved</Badge>
    </Stack>
  );
}

function ButtonExample() {
  const [isPending, setPending] = useState(false);

  useEffect(() => {
    if (!isPending) return;
    const timer = setTimeout(() => setPending(false), 1500);
    return () => clearTimeout(timer);
  }, [isPending]);

  return (
    <Stack direction="row" gap="2">
      <Button variant="secondary">Cancel</Button>
      <Button variant="primary" isPending={isPending} onPress={() => setPending(true)}>
        Export
      </Button>
    </Stack>
  );
}

function CheckboxExample() {
  return (
    <Checkbox defaultSelected description="Show the number beside each line.">
      Line numbers
    </Checkbox>
  );
}

function FieldExample() {
  return (
    <TextField
      defaultValue="my snippet"
      validationBehavior="aria"
      validate={(value) => (/^[\w-]*$/.test(value) ? null : 'Use letters, numbers, and dashes.')}
      style={fieldWidth}
    >
      <FieldLabel>File name</FieldLabel>
      <FieldInput />
      <FieldDescription>Used when you download the image.</FieldDescription>
      <FieldError />
    </TextField>
  );
}

function IconButtonExample() {
  return (
    <IconButton aria-label="Close" ghost variant="secondary">
      <CloseIcon />
    </IconButton>
  );
}

function KbdExample() {
  return (
    <Stack direction="row" gap="2" align="center">
      <Stack direction="row" gap="1">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </Stack>
      <Text size="xs" tone="muted">Open the command menu</Text>
    </Stack>
  );
}

function LinkExample() {
  return (
    <Text>
      Read the <Link href="/docs/design">Inkstone specification</Link>.
    </Text>
  );
}

function NumberFieldExample() {
  return (
    <NumberField
      label="Padding"
      defaultValue={32}
      minValue={0}
      maxValue={128}
      step={8}
      description="Space around the code, in pixels."
      style={{ width: 240, maxWidth: '100%' }}
    />
  );
}

function OptionCardExample() {
  return (
    <OptionCardGroup
      label="Window style"
      defaultValue="mac"
      style={{ width: 420, maxWidth: '100%' }}
      items={[
        { value: 'mac', label: 'macOS', preview: <WindowPreview controls="dots" /> },
        { value: 'windows', label: 'Windows', preview: <WindowPreview controls="squares" /> },
        { value: 'none', label: 'None', preview: <WindowPreview /> },
      ]}
    />
  );
}

function ProgressExample() {
  return <Progress label="Exporting" value={64} showValue style={{ width: 240, maxWidth: '100%' }} />;
}

function RadioListExample() {
  return (
    <RadioList label="Line endings" defaultValue="lf">
      <RadioListItem value="lf">LF</RadioListItem>
      <RadioListItem value="crlf">CRLF</RadioListItem>
    </RadioList>
  );
}

function SegmentedControlExample() {
  return (
    <SegmentedControl aria-label="Preview size" defaultSelectedKeys={['md']}>
      <SegmentedControlItem id="sm">Small</SegmentedControlItem>
      <SegmentedControlItem id="md">Medium</SegmentedControlItem>
      <SegmentedControlItem id="lg">Large</SegmentedControlItem>
    </SegmentedControl>
  );
}

function SkeletonExample() {
  return (
    <Stack direction="row" gap="3" align="center" aria-busy="true" style={{ width: 240 }}>
      <Skeleton circle height={32} />
      <Stack gap="2" style={{ flex: 1 }}>
        <Skeleton height={14} width="60%" />
        <Skeleton height={12} />
      </Stack>
    </Stack>
  );
}

function SliderExample() {
  return <Slider label="Opacity" defaultValue={80} showValue style={{ width: 240, maxWidth: '100%' }} />;
}

function SpinnerExample() {
  return <Spinner label="Loading themes" />;
}

function StackExample() {
  return (
    <Stack gap="1">
      <Text weight="medium">Export</Text>
      <Text size="xs" tone="muted">PNG at 2× scale</Text>
    </Stack>
  );
}

function SvgIconExample() {
  return (
    <SvgIcon size="20px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" role="img" aria-label="Code">
      <path d="m8 6-6 6 6 6M16 6l6 6-6 6" />
    </SvgIcon>
  );
}

function SwitchExample() {
  return (
    <Switch defaultSelected description="Wrap long lines to fit the frame.">
      Word wrap
    </Switch>
  );
}

function TextExample() {
  return (
    <Stack gap="1">
      <Text as="h3" size="md" weight="semibold">Snippet settings</Text>
      <Text size="xs" tone="muted">Changes apply to the open snippet.</Text>
    </Stack>
  );
}

function TextAreaExample() {
  return <TextArea label="Notes" placeholder="Add context for reviewers" style={fieldWidth} />;
}

function TextFieldExample() {
  return (
    <TextField
      label="File name"
      defaultValue="snippet"
      description="Used when you download the image."
      style={fieldWidth}
    />
  );
}

function CloseIcon() {
  return (
    <SvgIcon viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M4 4l8 8M12 4l-8 8" />
    </SvgIcon>
  );
}

/** A schematic of a window frame in its own colours, not a miniature of real content. */
function WindowPreview({ controls }: { controls?: 'dots' | 'squares' }) {
  return (
    <svg viewBox="0 0 72 40" width="72" height="40" fill="none">
      <rect x="0.5" y="0.5" width="71" height="39" rx="6" fill="#1c1c1c" stroke="#3a3a3a" />
      {controls === 'dots' && (
        <g>
          <circle cx="8" cy="7" r="2" fill="#ff5f57" />
          <circle cx="14" cy="7" r="2" fill="#febc2e" />
          <circle cx="20" cy="7" r="2" fill="#28c840" />
        </g>
      )}
      {controls === 'squares' && (
        <g fill="#8c8c8c">
          <rect x="52" y="5" width="4" height="4" />
          <rect x="58" y="5" width="4" height="4" />
          <rect x="64" y="5" width="4" height="4" />
        </g>
      )}
      <rect x="8" y="16" width="36" height="3" rx="1.5" fill="#63b3ed" />
      <rect x="8" y="23" width="52" height="3" rx="1.5" fill="#aaaaaa" />
      <rect x="8" y="30" width="28" height="3" rx="1.5" fill="#aaaaaa" />
    </svg>
  );
}

export const demos = {
  Alert: AlertExample,
  Badge: BadgeExample,
  Button: ButtonExample,
  Checkbox: CheckboxExample,
  Field: FieldExample,
  IconButton: IconButtonExample,
  Kbd: KbdExample,
  Link: LinkExample,
  NumberField: NumberFieldExample,
  OptionCard: OptionCardExample,
  Progress: ProgressExample,
  RadioList: RadioListExample,
  SegmentedControl: SegmentedControlExample,
  Skeleton: SkeletonExample,
  Slider: SliderExample,
  Spinner: SpinnerExample,
  Stack: StackExample,
  SvgIcon: SvgIconExample,
  Switch: SwitchExample,
  Text: TextExample,
  TextArea: TextAreaExample,
  TextField: TextFieldExample,
};
