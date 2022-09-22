import React from 'react';
import {
  RuntimeApplication,
  RuntimeComponentSchema,
  PropsBeforeEvaled,
} from '@sunmao-ui-fork/core';
import { Static } from '@sinclair/typebox';
import { ColumnSpec, ColumnsPropertySpec, ContentSlotPropsSpec } from './TableTypes';
import { Button, Link, Td, Text } from '@chakra-ui/react';
import {
  LIST_ITEM_EXP,
  LIST_ITEM_INDEX_EXP,
  ModuleRenderer,
  UIServices,
  ExpressionError,
  ImplWrapper,
  SlotsElements,
  formatSlotKey,
} from '@sunmao-ui-fork/runtime';

export const TableTd: React.FC<{
  index: number;
  item: any;
  column: Static<typeof ColumnSpec>;
  rawColumns: string | PropsBeforeEvaled<Static<typeof ColumnsPropertySpec>>;
  onClickItem: () => void;
  services: UIServices;
  component: RuntimeComponentSchema;
  app: RuntimeApplication;
  slotsElements: SlotsElements<{
    content: {
      slotProps: typeof ContentSlotPropsSpec;
    };
  }>;
}> = props => {
  const {
    item,
    index,
    component,
    column,
    rawColumns,
    onClickItem,
    services,
    app,
    slotsElements,
  } = props;
  const evalOptions = {
    evalListItem: true,
    scopeObject: {
      [LIST_ITEM_EXP]: item,
    },
  };
  let value = item[column.key];
  let buttonConfig = column.buttonConfig;

  if (column.displayValue) {
    const result = services.stateManager.deepEval(column.displayValue, evalOptions);

    value = result instanceof ExpressionError ? '' : result;
  }

  if (column.buttonConfig) {
    buttonConfig = services.stateManager.deepEval(column.buttonConfig, evalOptions);
  }

  let content = value;

  switch (column.type) {
    case 'text':
      content = <Text whiteSpace="pre-wrap">{value}</Text>;
      break;
    case 'image':
      content = <img src={value} />;
      break;
    case 'link':
      content = (
        <Link href={value} color="blue.600">
          {value}
        </Link>
      );
      break;
    case 'button':
      const onClick = () => {
        onClickItem();
        const evaledColumns = services.stateManager.deepEval(
          rawColumns,
          evalOptions
        ) as Static<typeof ColumnsPropertySpec>;

        evaledColumns[index].buttonConfig.handlers.forEach(evaledHandler => {
          services.apiService.send('uiMethod', {
            componentId: evaledHandler.componentId,
            name: evaledHandler.method.name,
            parameters: evaledHandler.method.parameters,
          });
        });
      };
      content = <Button onClick={onClick}>{buttonConfig.text}</Button>;
      break;
    case 'module':
      content = (
        <ModuleRenderer
          id={column.module.id}
          type={column.module.type}
          properties={column.module.properties}
          handlers={column.module.handlers}
          services={services}
          evalScope={{
            [LIST_ITEM_EXP]: item,
            [LIST_ITEM_INDEX_EXP]: index,
          }}
          app={app}
        />
      );
      break;
    case 'component':
      const childrenSchema = app.spec.components.filter(c => {
        return c.traits.find(
          t =>
            t.type === 'core/v1/slot' &&
            (t.properties.container as any).id === component.id
        );
      });

      const childSchema = childrenSchema[column.componentSlotIndex];
      if (!childSchema) {
        return (
          <div>Cannot find child with index {column.componentSlotIndex} in slot.</div>
        );
      }

      const _childrenSchema = {
        ...childSchema,
        id: `${component.id}_${childSchema.id}_${index}`,
      };

      /**
       * FIXME: temporary hack
       */
      slotsElements.content?.({
        [LIST_ITEM_EXP]: item,
        [LIST_ITEM_INDEX_EXP]: index,
      });

      content = (
        <ImplWrapper
          key={_childrenSchema.id}
          component={_childrenSchema}
          app={app}
          services={services}
          childrenMap={{}}
          isInModule
          evalListItem
          slotContext={{
            renderSet: new Set(),
            slotKey: formatSlotKey(_childrenSchema.id, 'td', `td_${index}`),
          }}
        />
      );
      break;
  }

  return (
    <Td paddingX="4" paddingY="2">
      {content}
    </Td>
  );
};
