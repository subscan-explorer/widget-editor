import { initSunmaoUIEditor } from '../src';
import { sunmaoChakraUILib } from '@subscan/widget-chakra-ui-lib';
export const { registry } = initSunmaoUIEditor({
  runtimeProps: { libs: [sunmaoChakraUILib] },
});
