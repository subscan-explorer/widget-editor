import { Type } from '@sinclair/typebox';
import {
  ModuleRenderSpec,
  EventCallBackHandlerSpec,
  LIST_ITEM_EXP,
  LIST_ITEM_INDEX_EXP,
} from '@sunmao-ui-fork/shared';
import { BASIC, APPEARANCE, BEHAVIOR } from '../constants/category';

export const MajorKeyPropertySpec = Type.String({
  title: 'Major key',
  description: 'The key of the data item object to use as the major key',
  category: BASIC,
});
export const RowsPerPagePropertySpec = Type.Number({
  title: 'Per Page Number',
  category: BEHAVIOR,
});
export const DataPropertySpec = Type.Array(Type.Any(), {
  title: 'Data',
  category: BASIC,
});
export const TableSizePropertySpec = Type.KeyOf(
  Type.Object({
    sm: Type.String(),
    md: Type.String(),
    lg: Type.String(),
  }),
  {
    title: 'Size',
    category: APPEARANCE,
  }
);

export const TdTypeSpec = Type.KeyOf(
  Type.Object({
    text: Type.String(),
    component: Type.String(),
    image: Type.String(),
    link: Type.String(),
    button: Type.String(),
    module: Type.String(),
  }),
  {
    title: 'TD Type',
    category: APPEARANCE,
  }
);
export const ColumnSpec = Type.Object(
  {
    key: Type.String({
      title: 'Key',
    }),
    title: Type.String({
      title: 'Title',
    }),
    displayValue: Type.String({
      title: 'Display value',
    }),
    type: TdTypeSpec,
    componentSlotIndex: Type.Number({
      title: 'Component Slot Index',
      conditions: [
        {
          key: 'type',
          value: 'component',
        },
      ],
    }),
    buttonConfig: Type.Object(
      {
        text: Type.String({
          title: 'Button Text',
        }),
        handlers: Type.Array(EventCallBackHandlerSpec, {
          title: 'Button Handlers',
        }),
      },
      {
        title: 'Button Config',
        conditions: [
          {
            key: 'type',
            value: 'button',
          },
        ],
      }
    ),
    module: { ...ModuleRenderSpec, conditions: [{ key: 'type', value: 'module' }] },
  },
  {
    title: 'Column',
  }
);

export const ColumnsPropertySpec = Type.Array(ColumnSpec, {
  title: 'Columns',
  category: BASIC,
  widget: 'core/v1/array',
  widgetOptions: {
    displayedKeys: ['title'],
  },
});
export const IsMultiSelectPropertySpec = Type.Boolean({
  title: 'Enable Multiple Select',
  category: BEHAVIOR,
});

export const TableStateSpec = Type.Object({
  selectedItem: Type.Optional(Type.Object({})),
  selectedItems: Type.Array(Type.Object({})),
});

export const ContentSlotPropsSpec = Type.Object({
  [LIST_ITEM_EXP]: Type.Any(),
  [LIST_ITEM_INDEX_EXP]: Type.Number(),
});
