import { implementRuntimeComponent } from '../../src/utils/buildKit';
import { Type } from '@sinclair/typebox';
import { useState, useEffect } from 'react';

export default implementRuntimeComponent({
  version: 'test/v1',
  metadata: {
    name: 'input',
    displayName: 'Input',
    description: 'for test',
    isDraggable: false,
    isResizable: false,
    exampleProperties: {},
    exampleSize: [1, 1],
    annotations: {
      category: 'Advance',
    },
  },
  spec: {
    properties: Type.Object({
      defaultValue: Type.String(),
    }),
    state: Type.Object({
      value: Type.String(),
    }),
    methods: {
      setValue: Type.String(),
    },
    slots: {},
    styleSlots: [],
    events: [],
  },
})(({ component, defaultValue, mergeState, elementRef, subscribeMethods }) => {
  const [value, setValue] = useState(defaultValue || '');
  useEffect(() => {
    mergeState({ value });
  }, [mergeState, value]);

  useEffect(() => {
    subscribeMethods({
      setValue,
    });
  }, [subscribeMethods]);

  return (
    <input
      ref={elementRef}
      data-testid={component.id}
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  );
});
