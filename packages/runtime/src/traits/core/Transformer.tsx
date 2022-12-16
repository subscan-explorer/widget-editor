import { Type } from '@sinclair/typebox';
import { implementRuntimeTrait } from '../../utils/buildKit';
import { CORE_VERSION, CoreTraitName } from '@subscan/widget-shared';

const TransformerTraitPropertiesSpec = Type.Object({
  value: Type.Any({
    title: 'Value',
  }),
});
const TransformerTraitStateSpec = Type.Object({
  value: Type.Any(),
});

export default implementRuntimeTrait({
  version: CORE_VERSION,
  metadata: {
    name: CoreTraitName.Transformer,
    description: 'transform the value',
  },
  spec: {
    properties: TransformerTraitPropertiesSpec,
    methods: [],
    state: TransformerTraitStateSpec,
  },
})(() => {
  return ({ value, mergeState }) => {
    mergeState({ value });

    return {
      props: {},
    };
  };
});
