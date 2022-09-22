import { Timeline as BaseTimeline } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui-fork/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { TimelinePropsSpec as BaseTimelinePropsSpec } from '../generated/types/Timeline';

const TimelinePropsSpec = Type.Object(BaseTimelinePropsSpec);
const TimelineStateSpec = Type.Object({});

const exampleProperties: Static<typeof TimelinePropsSpec> = {
  reverse: false,
  direction: 'vertical',
  mode: 'alternate',
  labelPosition: 'same',
  items: [
    {
      label: '2017-03-10',
      content: 'The first milestone',
      dotColor: '#00B42A',
      lineType: 'dashed',
      lineColor: '#00B42A',
      dotType: 'hollow',
    },
    {
      label: '2018-05-12',
      content: 'The second milestone',
      dotColor: '',
      lineType: 'solid',
      lineColor: '',
      dotType: 'hollow',
    },
    {
      label: '2020-06-22',
      content: 'The third milestone',
      dotColor: '#F53F3F',
      lineType: 'dotted',
      dotType: 'solid',
      lineColor: '',
    },
    {
      label: '2020-09-30',
      content: 'The fourth milestone',
      dotColor: '#C9CDD4',
      lineType: 'dotted',
      dotType: 'solid',
      lineColor: '',
    },
  ],
};

export const Timeline = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'timeline',
    displayName: 'Timeline',
    exampleProperties,
    annotations: {
      category: 'Data Display',
    },
  },
  spec: {
    properties: TimelinePropsSpec,
    state: TimelineStateSpec,
    methods: {},
    slots: {},
    styleSlots: ['content'],
    events: [],
  },
})(props => {
  const { items, ...cProps } = getComponentProps(props);
  const { elementRef, customStyle } = props;

  return (
    <BaseTimeline ref={elementRef} className={css(customStyle?.content)} {...cProps}>
      {items?.map((item, idx) => (
        <BaseTimeline.Item
          key={idx}
          label={item.label}
          dotColor={item.dotColor}
          lineType={item.lineType}
          lineColor={item.lineColor}
          dotType={item.dotType}
        >
          {item.content}
        </BaseTimeline.Item>
      ))}
    </BaseTimeline>
  );
});
