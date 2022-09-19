import React from 'react';
import { WidgetProps, implementWidget } from '@sunmao-ui/editor-sdk';
import { ColumnSpec } from '../generated/types/Table';
import { Static } from '@sinclair/typebox';
import { Select } from '@arco-design/web-react';
import { ARCO_V1_VERSION } from '../constants/widgets';

type TablePrimaryKeyWidgetID = 'arco/v1/primaryKey';

declare module '@sunmao-ui/editor-sdk' {
  interface WidgetOptionsMap {
    'arco/v1/primaryKey': Record<string, unknown>;
  }
}

export const _TablePrimaryKeyWidget: React.FC<
  WidgetProps<TablePrimaryKeyWidgetID, string>
> = props => {
  const { value, onChange, component } = props;
  const { properties } = component;
  const columns = properties.columns as Static<typeof ColumnSpec>[];

  const keys = columns.map(c => c.dataIndex);

  return (
    <Select
      value={value}
      allowCreate
      onChange={value => {
        onChange(value);
      }}
    >
      {keys.map(key => {
        return (
          <Select.Option key={key} value={key}>
            {key}
          </Select.Option>
        );
      })}
    </Select>
  );
};

export const TablePrimaryKeyWidget = implementWidget<TablePrimaryKeyWidgetID>({
  version: ARCO_V1_VERSION,
  metadata: {
    name: 'primaryKey',
  },
})(_TablePrimaryKeyWidget);
