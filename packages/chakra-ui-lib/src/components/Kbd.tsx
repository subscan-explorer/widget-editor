import { useEffect } from 'react';
import { Kbd as BaseKbd } from '@chakra-ui/react';
import { Type } from '@sinclair/typebox';
import {
  implementRuntimeComponent,
  Text,
  TextPropertySpec,
} from '@subscan/widget-runtime';
import { css } from '@emotion/css';

const StateSpec = Type.Object({
  value: Type.String(),
});

const PropsSpec = Type.Object({
  text: TextPropertySpec,
});

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'kbd',
    displayName: 'Kbd',
    description: 'chakra-ui keyboard',
    exampleProperties: {
      text: {
        raw: 'enter',
        format: 'plain',
      },
    },
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: PropsSpec,
    state: StateSpec,
    methods: {},
    slots: {},
    styleSlots: ['content'],
    events: [],
  },
})(({ text, mergeState, customStyle, elementRef }) => {
  useEffect(() => {
    mergeState({ value: text.raw });
  }, [mergeState, text.raw]);

  return (
    <BaseKbd
      className={css`
        ${customStyle?.content}
      `}
      ref={elementRef}
    >
      <Text value={text} />
    </BaseKbd>
  );
});
