import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Type } from '@sinclair/typebox';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import '../CSSReset.css';

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'root',
    displayName: 'Root',
    description: 'chakra-ui provider',
    exampleProperties: {},
    annotations: {
      category: 'Advance',
    },
  },
  spec: {
    properties: Type.Object({}),
    state: Type.Object({}),
    methods: {},
    slots: {
      root: {
        slotProps: Type.Object({}),
      },
    },
    styleSlots: [],
    events: [],
  },
})(({ slotsElements, elementRef }) => {
  return (
    <div>
      <ChakraProvider
        resetCSS={false}
        theme={extendTheme({
          initialColorMode: 'dark',
          useSystemColorMode: false,
        })}
      >
        <div className="chakraCSSReset" ref={elementRef}>
          {slotsElements.root ? slotsElements.root({}) : null}
        </div>
      </ChakraProvider>
    </div>
  );
});
