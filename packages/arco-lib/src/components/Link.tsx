import { Link as BaseLink } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui-fork/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { LinkPropsSpec as BaseLinkPropsSpec } from '../generated/types/Link';

const LinkPropsSpec = Type.Object(BaseLinkPropsSpec);
const LinkStateSpec = Type.Object({});

const exampleProperties: Static<typeof LinkPropsSpec> = {
  disabled: false,
  hoverable: true,
  status: 'default',
  href: '#',
  content: 'Link',
  openInNewPage: false,
};

const statusMap = {
  default: undefined,
  success: 'success',
  error: 'error',
  warning: 'warning',
} as const;

export const Link = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'link',
    displayName: 'Link',
    annotations: {
      category: 'General',
    },
    exampleProperties,
  },
  spec: {
    properties: LinkPropsSpec,
    state: LinkStateSpec,
    methods: {},
    slots: {
      content: {
        slotProps: Type.Object({}),
      },
    },
    styleSlots: ['content'],
    events: [],
  },
})(props => {
  const { content, status, openInNewPage, ...cProps } = getComponentProps(props);
  const { elementRef, customStyle, slotsElements } = props;

  return (
    <BaseLink
      ref={elementRef}
      status={statusMap[status]}
      className={css(customStyle?.content)}
      {...cProps}
      target={openInNewPage ? '_blank' : '_self'}
    >
      {slotsElements.content ? slotsElements.content({}) : content}
    </BaseLink>
  );
});
