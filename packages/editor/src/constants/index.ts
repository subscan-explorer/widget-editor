import { Application } from '@sunmao-ui-fork/core';
import { ImplementedRuntimeModule } from '@sunmao-ui-fork/runtime';
import { CORE_VERSION, CoreTraitName } from '@sunmao-ui-fork/shared';

export const unremovableTraits = [`${CORE_VERSION}/${CoreTraitName.Slot}`];

export const hideCreateTraitsList = [
  `${CORE_VERSION}/${CoreTraitName.Event}`,
  `${CORE_VERSION}/${CoreTraitName.Style}`,
  `${CORE_VERSION}/${CoreTraitName.Fetch}`,
  `${CORE_VERSION}/${CoreTraitName.Slot}`,
];

export const hasSpecialFormTraitList = [
  `${CORE_VERSION}/${CoreTraitName.Event}`,
  `${CORE_VERSION}/${CoreTraitName.Style}`,
  `${CORE_VERSION}/${CoreTraitName.Fetch}`,
];

export const RootId = '__root__';

export const EmptyAppSchema: Application = {
  kind: 'Application',
  version: 'example/v1',
  metadata: { name: 'sunmao application', description: 'sunmao empty application' },
  spec: {
    components: [],
  },
};

// need not add moduleId, because it is used in runtime of editor
export const DefaultNewModule: ImplementedRuntimeModule = {
  kind: 'Module',
  parsedVersion: { category: 'custom/v1', value: 'myModule' },
  version: 'custom/v1',
  metadata: { name: 'myModule', description: 'my module', exampleProperties: {} },
  spec: {
    stateMap: {},
    events: [],
    properties: { type: 'object', properties: {} },
  },
  impl: [
    {
      id: 'text1',
      type: 'core/v1/text',
      properties: { value: { raw: 'Hello, world!', format: 'plain' } },
      traits: [],
    },
  ],
};
