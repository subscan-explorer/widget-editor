import { Application, ComponentSchema } from '@subscan/widget-core';

export const AppSchema: Application = {
  kind: 'Application',
  version: 'example/v1',
  metadata: { name: 'dialog_component', description: 'dialog component example' },
  spec: {
    components: [
      {
        id: 'hstack1',
        type: 'chakra_ui/v1/hstack',
        properties: { spacing: '24px' },
        traits: [],
      },
      {
        id: 'vstack1',
        type: 'chakra_ui/v1/vstack',
        properties: {},
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'hstack1', slot: 'content' } },
          },
        ],
      },
      {
        id: 'text3',
        type: 'core/v1/text',
        properties: { value: { raw: 'VM1', format: 'plain' } },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'vstack1', slot: 'content' } },
          },
        ],
      },
      {
        id: 'text4',
        type: 'core/v1/text',
        properties: { value: { raw: '虚拟机', format: 'plain' } },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'vstack1', slot: 'content' } },
          },
        ],
      },
      {
        id: 'hstack2',
        type: 'chakra_ui/v1/hstack',
        properties: { spacing: '24px', align: '' },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'hstack1', slot: 'content' } },
          },
        ],
      },
      {
        id: 'text1',
        type: 'core/v1/text',
        properties: { value: { raw: 'text', format: 'plain' } },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'hstack2', slot: 'content' } },
          },
        ],
      },
      {
        id: 'text2',
        type: 'core/v1/text',
        properties: { value: { raw: 'text', format: 'plain' } },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'hstack2', slot: 'content' } },
          },
        ],
      },
      {
        id: 'button1',
        type: 'chakra_ui/v1/button',
        properties: {
          text: { raw: 'text', format: 'plain' },
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'hstack2', slot: 'content' } },
          },
          {
            type: 'core/v1/state',
            properties: { key: 'value' },
          },
        ],
      },
      {
        id: 'moduleContainer1',
        type: 'core/v1/moduleContainer',
        properties: { id: 'myModule', type: 'custom/v1/module' },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'hstack1', slot: 'content' } },
          },
        ],
      },
      {
        id: 'apiFetch',
        type: 'core/v1/dummy',
        properties: {},
        traits: [
          {
            type: 'core/v1/fetch',
            properties: {
              url: 'https://6177d4919c328300175f5b99.mockapi.io/users',
              method: 'get',
              lazy: false,
              headers: {},
              body: {},
              onComplete: [],
            },
          },
        ],
      },
    ],
  },
};

export const DuplicatedIdSchema: ComponentSchema[] = [
  {
    id: 'hstack1',
    type: 'chakra_ui/v1/hstack',
    properties: { spacing: '24px' },
    traits: [],
  },
  {
    id: 'hstack1',
    type: 'chakra_ui/v1/hstack',
    properties: { spacing: '24px' },
    traits: [],
  },
  {
    id: 'hstack3',
    type: 'chakra_ui/v1/hstack',
    properties: { spacing: '24px' },
    traits: [],
  },
];

export const EventHandlerMockSchema: ComponentSchema[] = [
  {
    id: 'button1',
    type: 'chakra_ui/v1/button',
    properties: {},
    traits: [
      {
        type: 'core/v1/event',
        properties: {
          handlers: [
            {
              type: 'onClick',
              componentId: 'input1',
              method: {
                name: 'setInputValue',
                parameters: {
                  value: '666',
                },
              },
            },
            {
              type: 'onClick',
              componentId: 'input2',
              method: {
                name: 'setInputValue',
                parameters: {
                  value: '666',
                },
              },
            },
          ],
        },
      },
    ],
  },
];

export const ChangeIdMockSchema: ComponentSchema[] = [
  {
    id: 'stack',
    type: 'core/v1/stack',
    properties: {
      spacing: 12,
      direction: 'horizontal',
      align: 'auto',
      wrap: '',
      justify: '',
    },
    traits: [],
  },
  {
    id: 'button',
    type: 'chakra_ui/v1/button',
    properties: {
      text: {
        raw: 'text',
        format: 'plain',
      },
      isLoading: false,
      colorScheme: 'blue',
    },
    traits: [
      {
        type: 'core/v1/event',
        properties: {
          handlers: [
            {
              type: 'onClick',
              componentId: 'input',
              method: {
                name: 'setInputValue',
                parameters: {
                  value: 'Hello',
                },
              },
              disabled: false,
              wait: {
                type: 'delay',
                time: 0,
              },
            },
          ],
        },
      },
      {
        type: 'core/v1/slot',
        properties: {
          container: {
            id: 'stack',
            slot: 'content',
          },
        },
      },
    ],
  },
  {
    id: 'text',
    type: 'core/v1/text',
    properties: {
      value: {
        raw: "pre {{(function () {\n    const object = { value: input.value + input.notExistKey };\n    return '-' + object.value + '-';\n}());}} end",
        format: 'plain',
      },
      string: 'Please input here',
      expressionString: "{{ 'input' }}",
      array: ['input'],
      expressionArray: "{{['input']}}",
      object: { input: 'input' },
      expressionObject: "{{{'input': 'input'}}}",
    },
    traits: [
      {
        type: 'core/v1/style',
        properties: {
          styles: [
            {
              styleSlot: 'content',
              style: '',
              cssProperties: {
                padding: '8px 0px 9px 0px ',
              },
            },
          ],
        },
      },
      {
        type: 'core/v1/slot',
        properties: {
          container: {
            id: 'stack',
            slot: 'content',
          },
        },
      },
    ],
  },
  {
    id: 'input',
    type: 'chakra_ui/v1/input',
    properties: {
      variant: 'outline',
      placeholder: 'Please input value',
      size: 'md',
      focusBorderColor: '',
      isDisabled: false,
      isRequired: false,
      defaultValue: '',
    },
    traits: [
      {
        type: 'core/v1/slot',
        properties: {
          container: {
            id: 'stack',
            slot: 'content',
          },
        },
      },
    ],
  },
];
