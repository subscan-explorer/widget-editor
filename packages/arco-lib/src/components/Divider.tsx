import { Divider as BaseDivider } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui-fork/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { DividerPropsSpec as BaseDividerPropsSpec } from '../generated/types/Divider';

const DividerPropsSpec = Type.Object({
  ...BaseDividerPropsSpec,
});
const DividerStateSpec = Type.Object({});

const exampleProperties: Static<typeof DividerPropsSpec> = {
  type: 'horizontal',
  orientation: 'center',
};

export const Divider = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'divider',
    displayName: 'Divider',
    exampleProperties,
    annotations: {
      category: 'Layout',
    },
  },
  spec: {
    properties: DividerPropsSpec,
    state: DividerStateSpec,
    methods: {},
    slots: {},
    styleSlots: ['content'],
    events: [],
  },
})(props => {
  const { elementRef, customStyle } = props;
  const { ...cProps } = getComponentProps(props);

  return (
    <BaseDivider ref={elementRef} className={css(customStyle?.content)} {...cProps} />
  );
});
