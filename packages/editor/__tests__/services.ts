import { initWidgetUIEditor } from '../src';
import { sunmaoChakraUILib } from '@subscan/widget-chakra-ui-lib';
export const { registry } = initWidgetUIEditor({
  runtimeProps: { libs: [sunmaoChakraUILib] },
});
