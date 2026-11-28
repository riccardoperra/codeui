import { Pagination, SettingsGroup, SettingsRow, Switch, Table, TableScrollArea } from '@codeui/react';

function PaginationExample() {
  return <Pagination pages={12} defaultPage={4} />;
}

function SettingsExample() {
  return (
    <SettingsGroup title="Editor" description="Choose what appears on the canvas.">
      <SettingsRow label="Line numbers" description="Show the number beside each line.">
        {(control) => <Switch {...control} defaultSelected />}
      </SettingsRow>
    </SettingsGroup>
  );
}

function TableExample() {
  return (
    <TableScrollArea aria-label="Export sizes">
      <Table striped>
        <caption>Available export sizes</caption>
        <thead>
          <tr><th scope="col">Scale</th><th scope="col">Width</th></tr>
        </thead>
        <tbody>
          <tr><th scope="row">1×</th><td>1280 px</td></tr>
          <tr><th scope="row">2×</th><td>2560 px</td></tr>
        </tbody>
      </Table>
    </TableScrollArea>
  );
}

export const demos = {
  Pagination: PaginationExample,
  Settings: SettingsExample,
  Table: TableExample,
};
