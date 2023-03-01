import { Divider } from '@chakra-ui/react';
import { css } from '@emotion/css';
import { Type } from '@sinclair/typebox';
import { implementRuntimeComponent } from '@subscan/widget-runtime';

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'divider',
    displayName: 'Divider',
    description: 'chakra-ui divider',
    exampleProperties: {},
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: Type.Object({}),
    state: Type.Object({}),
    methods: {},
    slots: {},
    styleSlots: ['content'],
    events: [],
  },
})(({ customStyle, elementRef }) => {
  return (
    <Divider
      className={css`
        ${customStyle?.content}
      `}
      ref={elementRef}
    />
  );
});
