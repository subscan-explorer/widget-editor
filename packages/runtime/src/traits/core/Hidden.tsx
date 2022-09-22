import { Type } from '@sinclair/typebox';
import { implementRuntimeTrait } from '../../utils/buildKit';
import { CORE_VERSION, CoreTraitName } from '@sunmao-ui-fork/shared';

export const HiddenTraitPropertiesSpec = Type.Object({
  hidden: Type.Boolean(),
  visually: Type.Optional(Type.Boolean()),
});

export default implementRuntimeTrait({
  version: CORE_VERSION,
  metadata: {
    name: CoreTraitName.Hidden,
    description: 'render component with condition',
    annotations: {
      beforeRender: true,
    },
  },
  spec: {
    properties: HiddenTraitPropertiesSpec,
    state: {},
    methods: [],
  },
})(() => {
  return ({ hidden, visually }) => {
    if (visually) {
      return {
        props: {
          customStyle: {
            content: hidden ? '&&&& { display: none }' : '',
          },
        },
      };
    }

    return {
      props: {},
      unmount: hidden,
    };
  };
});
