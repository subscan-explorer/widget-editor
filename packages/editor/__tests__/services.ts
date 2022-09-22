import { initSunmaoUIEditor } from '../src';
import { sunmaoChakraUILib } from '@sunmao-ui-fork/chakra-ui-lib';
export const { registry } = initSunmaoUIEditor({
  runtimeProps: { libs: [sunmaoChakraUILib] },
});
