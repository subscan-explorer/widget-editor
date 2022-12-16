import { css } from '@emotion/css';
import { Type } from '@sinclair/typebox';
import { VStack as BaseVStack } from '@chakra-ui/react';
import { implementRuntimeComponent } from '@subscan/widget-runtime';
import {
  DirectionSpec,
  FlexWrapSpec,
  AlignItemsSpec,
  JustifyContentSpec,
  SpacingSpec,
} from './Stack';

const PropsSpec = Type.Object({
  direction: DirectionSpec,
  wrap: FlexWrapSpec,
  align: AlignItemsSpec,
  justify: JustifyContentSpec,
  spacing: SpacingSpec,
});

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'vstack',
    displayName: 'VStack',
    description: 'chakra-ui vstack',
    exampleProperties: {
      spacing: '24px',
    },
    annotations: {
      direction: 'column',
      wrap: 'wrap',
      align: '',
      justify: '',
      category: 'Layout',
    },
  },
  spec: {
    properties: PropsSpec,
    state: Type.Object({}),
    slots: {
      content: { slotProps: Type.Object({}) },
    },
    styleSlots: ['content'],
    methods: {},
    events: [],
  },
})(
  ({
    direction,
    wrap,
    align,
    justify,
    spacing,
    slotsElements,
    customStyle,
    elementRef,
  }) => {
    return (
      <BaseVStack
        width="full"
        height="full"
        padding="4"
        background="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="4"
        className={css`
          ${customStyle?.content}
        `}
        ref={elementRef}
        {...{ direction, wrap, align, justify, spacing }}
      >
        {slotsElements.content ? slotsElements.content({}) : null}
      </BaseVStack>
    );
  }
);
