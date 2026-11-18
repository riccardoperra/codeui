import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  Button,
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  CommandMenu,
  CommandMenuItem,
  CommandMenuList,
  CommandMenuSearch,
  CommandMenuSection,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogMain,
  DialogNav,
  DialogNavItem,
  DialogSection,
  DialogSidebar,
  DialogTitle,
  DialogCloseButton,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  IconButton,
  Kbd,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SettingsRow,
  Sheet,
  SheetTrigger,
  Stack,
  Switch,
  Tabs,
  TabsContent,
  TabsHeader,
  TabsList,
  Toaster,
  Tooltip,
  TooltipContent,
  VirtualizedListbox,
  createToaster,
} from '@codeui/react';
import { useState } from 'react';

const fieldWidth = { width: 280, maxWidth: '100%' };

const languages = [
  { id: 'css', name: 'CSS' },
  { id: 'go', name: 'Go' },
  { id: 'html', name: 'HTML' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'python', name: 'Python' },
  { id: 'rust', name: 'Rust' },
  { id: 'typescript', name: 'TypeScript' },
];

type Language = (typeof languages)[number];

function AccordionExample() {
  return (
    <Accordion defaultExpandedKeys={['frame']} style={{ width: 360, maxWidth: '100%' }}>
      <AccordionItem id="frame">
        <AccordionTrigger summary="16px · 24px radius">Frame</AccordionTrigger>
        <AccordionPanel>Padding, radius and the background behind the code.</AccordionPanel>
      </AccordionItem>
      <AccordionItem id="editor">
        <AccordionTrigger summary="JetBrains Mono">Editor</AccordionTrigger>
        <AccordionPanel>Font, line numbers and the theme of the code.</AccordionPanel>
      </AccordionItem>
      <AccordionItem id="export" isDisabled>
        <AccordionTrigger summary="PNG">Export</AccordionTrigger>
        <AccordionPanel>Format and scale of the image.</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

function ComboboxExample() {
  return (
    <div style={fieldWidth}>
      <Combobox label="Language" description="Type to filter." defaultItems={languages} allowsEmptyCollection>
        <ComboboxInput placeholder="Search languages" />
        <ComboboxContent emptyContent="No language matches.">
          {(language: Language) => <ComboboxItem>{language.name}</ComboboxItem>}
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

const commands = [
  { id: 'theme-dark', group: 'Theme', name: 'Dark', shortcut: '⌘D' },
  { id: 'theme-light', group: 'Theme', name: 'Light', shortcut: '⌘L' },
  { id: 'export-png', group: 'Export', name: 'Export as PNG' },
  { id: 'export-svg', group: 'Export', name: 'Export as SVG' },
  { id: 'copy-link', group: 'Share', name: 'Copy link' },
];

function CommandMenuExample() {
  const [isOpen, setOpen] = useState(false);
  const [theme, setTheme] = useState('theme-dark');
  const groups = [...new Set(commands.map((command) => command.group))].map((group) => ({
    id: group,
    items: commands.filter((command) => command.group === group),
  }));
  return (
    <Stack direction="row" gap="2" align="center">
      <Button variant="secondary" onPress={() => setOpen(true)}>
        Open command menu
      </Button>
      <Kbd>⌘K</Kbd>
      <CommandMenu title="Commands" isOpen={isOpen} onOpenChange={setOpen}>
        <CommandMenuSearch placeholder="Search commands" hint="↑↓ preview · ↵ apply · esc cancel" />
        <CommandMenuList
          items={groups}
          emptyContent="No command matches."
          onAction={(key) => {
            if (String(key).startsWith('theme-')) setTheme(String(key));
          }}
        >
          {(group) => (
            <CommandMenuSection id={group.id} title={group.id} items={group.items}>
              {(command) => (
                <CommandMenuItem textValue={`${group.id} ${command.name}`} shortcut={command.shortcut} isCurrent={command.id === theme}>
                  {command.name}
                </CommandMenuItem>
              )}
            </CommandMenuSection>
          )}
        </CommandMenuList>
      </CommandMenu>
    </Stack>
  );
}

const sections = ['General', 'Editor', 'Export', 'Experiments'];

function DialogExample() {
  const [section, setSection] = useState('Editor');
  return (
    <Stack direction="row" gap="2" wrap>
      <DialogTrigger>
        <Button variant="secondary">Delete snippet</Button>
        <Dialog size="sm" chrome="inset" role="alertdialog" title="Delete this snippet?">
          {({ close }) => (
            <>
              <p style={{ margin: 0 }}>The snippet and its share link are removed for everyone.</p>
              <DialogFooter>
                <Button variant="secondary" onPress={close}>Cancel</Button>
                <Button variant="negative" onPress={close}>Delete</Button>
              </DialogFooter>
            </>
          )}
        </Dialog>
      </DialogTrigger>
      <DialogTrigger>
        <Button variant="secondary">Open settings</Button>
        <Dialog size="settings" chrome="inset" aria-label="Settings">
          <DialogSidebar>
            <DialogNav aria-label="Settings sections">
              {sections.map((name) => (
                <DialogNavItem key={name} isCurrent={name === section} onPress={() => setSection(name)}>
                  {name}
                </DialogNavItem>
              ))}
            </DialogNav>
          </DialogSidebar>
          <DialogMain>
            <DialogHeader>
              <DialogTitle>{section}</DialogTitle>
              <DialogCloseButton />
            </DialogHeader>
            <DialogBody>
              <DialogSection title="Display">
                <SettingsRow label="Line numbers" description="Show the number beside each line.">
                  {(control) => <Switch {...control} defaultSelected />}
                </SettingsRow>
                <SettingsRow label="Wrap lines" description="Break long lines at the frame edge.">
                  {(control) => <Switch {...control} />}
                </SettingsRow>
              </DialogSection>
            </DialogBody>
          </DialogMain>
        </Dialog>
      </DialogTrigger>
    </Stack>
  );
}

function DropdownMenuExample() {
  return (
    <DropdownMenu>
      <Button variant="secondary">Actions</Button>
      <DropdownMenuContent aria-label="Snippet actions">
        <DropdownMenuItem rightSlot="⌘D">Duplicate</DropdownMenuItem>
        <DropdownMenuItem rightSlot="⌘R">Rename</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuItem>Export</DropdownMenuItem>
          <DropdownMenuSubContent aria-label="Export formats">
            <DropdownMenuItem>PNG</DropdownMenuItem>
            <DropdownMenuItem>SVG</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem isDisabled>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const fonts = Array.from({ length: 2000 }, (_, index) => ({ id: `font-${index + 1}`, name: `Font ${index + 1}` }));

function ListboxExample() {
  return (
    <Stack direction="row" gap="6" wrap align="start">
      <div style={{ width: 220 }}>
        <Listbox aria-label="Language" selectionMode="single" defaultSelectedKeys={['typescript']} items={languages} bordered>
          {(language) => <ListboxItem>{language.name}</ListboxItem>}
        </Listbox>
      </div>
      <div style={{ width: 220 }}>
        <VirtualizedListbox aria-label="Font, 2000 options" selectionMode="single" defaultSelectedKeys={['font-12']} items={fonts} bordered style={{ height: 260 }}>
          {(font) => <ListboxItem>{font.name}</ListboxItem>}
        </VirtualizedListbox>
      </div>
    </Stack>
  );
}

function PopoverExample() {
  return (
    <Popover>
      <Button variant="secondary">Shadow</Button>
      <PopoverContent title="Shadow" description="A soft shadow under the frame.">
        <SettingsRow label="Show shadow">{(control) => <Switch {...control} defaultSelected />}</SettingsRow>
      </PopoverContent>
    </Popover>
  );
}

function SelectExample() {
  return (
    <div style={fieldWidth}>
      <Select label="Language" placeholder="Choose a language" defaultSelectedKey="typescript" description="Sets the highlighting.">
        <SelectTrigger />
        <SelectContent items={languages}>{(language) => <SelectItem>{language.name}</SelectItem>}</SelectContent>
      </Select>
    </div>
  );
}

function SheetExample() {
  return (
    <SheetTrigger>
      <Button variant="secondary">Open sheet</Button>
      <Sheet draggable title="Frame" footer={<Button variant="primary">Apply</Button>}>
        <p style={{ margin: 0 }}>Swipe the sheet down or press Escape to close it.</p>
      </Sheet>
    </SheetTrigger>
  );
}

function TabsExample() {
  return (
    <Tabs variant="inline" defaultSelectedKey="code" style={{ width: 360, maxWidth: '100%' }}>
      <TabsList aria-label="Snippet">
        <TabsHeader id="code">Code</TabsHeader>
        <TabsHeader id="frame">Frame</TabsHeader>
        <TabsHeader id="export">Export</TabsHeader>
      </TabsList>
      <TabsContent id="code">The source and its language.</TabsContent>
      <TabsContent id="frame">Padding, radius and background.</TabsContent>
      <TabsContent id="export">Format and scale.</TabsContent>
    </Tabs>
  );
}

const toaster = createToaster();

function ToastExample() {
  return (
    <Stack direction="row" gap="2" wrap>
      <Button
        variant="secondary"
        onPress={() =>
          toaster.show({
            tone: 'success',
            title: 'Link copied',
            description: 'Anyone with the link can view the snippet.',
            action: { label: 'Undo', onPress: (toast) => toast.dismiss() },
          })
        }
      >
        Show toast
      </Button>
      <Button
        variant="secondary"
        onPress={() =>
          toaster.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
            loading: { description: 'Exporting…' },
            success: { description: 'Exported image.png' },
            error: { description: 'The export failed.' },
          })
        }
      >
        Export
      </Button>
      <Toaster toaster={toaster} closeLabel="Close" />
    </Stack>
  );
}

function TooltipExample() {
  return (
    <Tooltip>
      <IconButton aria-label="Copy link" variant="secondary">
        <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M6.5 9.5 9.5 6.5M7 4.5l1-1a2.8 2.8 0 0 1 4 4l-1 1M9 11.5l-1 1a2.8 2.8 0 0 1-4-4l1-1" strokeLinecap="round" />
        </svg>
      </IconButton>
      <TooltipContent>Copy link</TooltipContent>
    </Tooltip>
  );
}

export const demos = {
  Accordion: AccordionExample,
  Combobox: ComboboxExample,
  CommandMenu: CommandMenuExample,
  Dialog: DialogExample,
  DropdownMenu: DropdownMenuExample,
  Listbox: ListboxExample,
  Popover: PopoverExample,
  Select: SelectExample,
  Sheet: SheetExample,
  Tabs: TabsExample,
  Toast: ToastExample,
  Tooltip: TooltipExample,
};
