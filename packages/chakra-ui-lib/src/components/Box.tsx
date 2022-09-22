import { Type } from '@sinclair/typebox';
import { Box as BaseBox } from '@chakra-ui/react';
import { implementRuntimeComponent } from '@sunmao-ui-fork/runtime';
import { pick } from 'lodash';
import { css } from '@emotion/css';
import { LAYOUT, BACKGROUND, BORDER } from './constants/category';

const StyleSpec = Type.Partial(
  Type.Object({
    // Layout
    w: Type.Union([Type.String(), Type.Number()], {
      title: 'Width',
      category: LAYOUT,
    }),
    h: Type.Union([Type.String(), Type.Number()], {
      title: 'Height',
      category: LAYOUT,
    }),
    minW: Type.Union([Type.String(), Type.Number()], {
      title: 'Min Width',
      category: LAYOUT,
    }),
    maxW: Type.Union([Type.String(), Type.Number()], {
      title: 'Max Width',
      category: LAYOUT,
    }),
    minH: Type.Union([Type.String(), Type.Number()], {
      title: 'Min Height',
      category: LAYOUT,
    }),
    maxH: Type.Union([Type.String(), Type.Number()], {
      title: 'Max Height',
      category: LAYOUT,
    }),
    // Margin and padding
    m: Type.Union([Type.String(), Type.Number(), Type.Array(Type.Number())], {
      title: 'Margin',
      category: LAYOUT,
    }),
    p: Type.Union([Type.String(), Type.Number(), Type.Array(Type.Number())], {
      title: 'Padding',
      category: LAYOUT,
    }),
    overflow: Type.String({
      title: 'Overflow',
      category: LAYOUT,
    }),
    // Background
    bg: Type.String({
      title: 'Background',
      category: BACKGROUND,
    }),
    bgColor: Type.String({
      title: 'Background Color',
      category: BACKGROUND,
    }),
    opacity: Type.Union([Type.String(), Type.Number()], {
      title: 'Opacity',
      category: BACKGROUND,
    }),
    bgGradient: Type.String({
      title: 'Background Gradient',
      category: BACKGROUND,
    }),
    bgClip: Type.String({
      title: 'Background Clip',
      category: BACKGROUND,
    }),
    bgImage: Type.String({
      title: 'Background Image',
      category: BACKGROUND,
    }),
    bgSize: Type.Union([Type.String(), Type.Number()], {
      title: 'Background Size',
      category: BACKGROUND,
    }),
    bgPosition: Type.Union([Type.String(), Type.Number()], {
      title: 'Background Position',
      category: BACKGROUND,
    }),
    bgRepeat: Type.String({
      title: 'Background Repeat',
      category: BACKGROUND,
    }),
    bgAttachment: Type.String({
      title: 'Background Attachment',
      category: BACKGROUND,
    }),
    boxShadow: Type.Union([Type.String(), Type.Number()], {
      title: 'Box Shadow',
      category: BACKGROUND,
    }),
    // Borders
    border: Type.Union([Type.String(), Type.Number()], {
      title: 'Border',
      category: BORDER,
    }),
    borderRadius: Type.Union([Type.String(), Type.Number()], {
      title: 'Border Radius',
      category: BORDER,
    }),
  })
);
const StyleProps = Object.keys(StyleSpec.properties);

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'box',
    displayName: 'Box',
    description: 'chakra-ui box',
    exampleProperties: {
      w: 0,
      h: 0,
      minW: '',
      maxW: '',
      minH: '',
      maxH: '',
      m: '',
      p: '',
      overflow: '',
      bg: '',
      bgColor: '',
      opacity: '',
      bgGradient: '',
      bgClip: '',
      bgImage: '',
      bgSize: '',
      bgPosition: '',
      bgRepeat: '',
      bgAttachment: '',
      boxShadow: '',
      border: '1px solid black',
      borderRadius: '',
    },
    annotations: {
      category: LAYOUT,
    },
  },
  spec: {
    properties: StyleSpec,
    state: Type.Object({}),
    methods: {},
    slots: {
      content: { slotProps: Type.Object({}) },
    },
    styleSlots: ['content'],
    events: [],
  },
})(({ customStyle, slotsElements, elementRef, ...restProps }) => {
  const styleProps = pick(restProps, StyleProps);
  return (
    <BaseBox
      width="full"
      height="full"
      background="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="base"
      {...styleProps}
      className={css`
        ${customStyle?.content}
      `}
      ref={elementRef}
    >
      {slotsElements.content ? slotsElements.content({}) : null}
    </BaseBox>
  );
});
