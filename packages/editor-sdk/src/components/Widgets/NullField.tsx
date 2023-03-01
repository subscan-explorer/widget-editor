import React from 'react';
import { WidgetProps } from '../../types/widget';
import { implementWidget } from '../../utils/widget';
import { CORE_VERSION, CoreWidgetName } from '@subscan/widget-shared';

type NullFieldType = `${typeof CORE_VERSION}/${CoreWidgetName.NullField}`;
type Props = WidgetProps<NullFieldType>;

declare module '../../types/widget' {
  interface WidgetOptionsMap {
    'core/v1/null': {};
  }
}

export const NullField: React.FC<Props> = () => {
  return null;
};

export default implementWidget<NullFieldType>({
  version: CORE_VERSION,
  metadata: {
    name: CoreWidgetName.NullField,
  },
})(NullField);
