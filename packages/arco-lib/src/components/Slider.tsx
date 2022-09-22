import { Slider as BaseSlider } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui-fork/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { SliderPropsSpec as BaseSliderPropsSpec } from '../generated/types/Slider';

const SliderPropsSpec = Type.Object(BaseSliderPropsSpec);
const SliderStateSpec = Type.Object({});

const exampleProperties: Static<typeof SliderPropsSpec> = {
  min: 0,
  max: 100,
  disabled: false,
  tooltipVisible: true,
  range: false,
  vertical: false,
  marks: {},
  onlyMarkValue: false,
  reverse: false,
  step: 1,
  showTicks: false,
};

export const Slider = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'slider',
    displayName: 'Slider',
    exampleProperties,
    annotations: {
      category: 'Data Entry',
    },
  },
  spec: {
    properties: SliderPropsSpec,
    state: SliderStateSpec,
    methods: {},
    slots: {
      tooltip: {
        slotProps: Type.Object({
          value: Type.Number(),
        }),
      },
    },
    styleSlots: ['content'],
    events: ['onChange', 'onAfterChange'],
  },
})(props => {
  const { ...cProps } = getComponentProps(props);
  const { customStyle, slotsElements, elementRef, callbackMap, mergeState } = props;

  return (
    <BaseSlider
      ref={elementRef}
      onChange={val => {
        mergeState({ value: val });
        callbackMap?.onChange?.();
      }}
      onAfterChange={val => {
        mergeState({ value: val });
        callbackMap?.onAfterChange?.();
      }}
      formatTooltip={val =>
        slotsElements.tooltip ? slotsElements.tooltip({ value: val }) : <span>{val}</span>
      }
      className={css(customStyle?.content)}
      {...cProps}
    />
  );
});
