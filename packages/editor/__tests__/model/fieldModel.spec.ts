import { AppModel } from '../../src/AppModel/AppModel';
import { FieldModel } from '../../src/AppModel/FieldModel';
import { ComponentId } from '../../src/AppModel/IAppModel';
import { registry } from '../services';
import { ChangeIdMockSchema } from './mock';
import { CORE_VERSION, CoreTraitName } from '@subscan/widget-shared';

describe('Field test', () => {
  it('parse static property', () => {
    const field = new FieldModel('Hello, world!');
    expect(field.isDynamic).toEqual(false);
    expect(field.refComponentInfos).toEqual({});
    expect(field.rawValue).toEqual('Hello, world!');
  });

  it('parse expression', () => {
    const field = new FieldModel('{{input.value}} + {{list[0].text}}');
    expect(field.isDynamic).toEqual(true);
    expect(field.refComponentInfos['input' as ComponentId].refProperties).toEqual([
      'value',
    ]);
    expect(field.refComponentInfos['list' as ComponentId].refProperties).toEqual([
      '0',
      '0.text',
    ]);
    expect(field.rawValue).toEqual('{{input.value}} + {{list[0].text}}');
  });

  it('allow using question mask in expression', () => {
    const field = new FieldModel('{{api.fetch?.data }}');
    expect(field.isDynamic).toEqual(true);
    expect(field.refComponentInfos['api' as ComponentId].refProperties).toEqual([
      'fetch',
      'fetch.data',
    ]);
  });

  it('stop member expression when meeting other expression ast node', () => {
    const field = new FieldModel('{{ Array.from([]).fill() }}');
    expect(field.isDynamic).toEqual(true);
    expect(field.refComponentInfos['Array' as ComponentId].refProperties).toEqual([
      'from',
    ]);
  });

  it('parse inline variable in expression', () => {
    const field = new FieldModel('{{ [].length }}');
    expect(field.isDynamic).toEqual(true);
    expect(field.refComponentInfos).toEqual({});
  });

  it('parse object property', () => {
    const field = new FieldModel({ raw: '{{input.value}}', format: 'md' });
    expect(field.isDynamic).toEqual(false);
    expect(field.refComponentInfos).toEqual({});
    expect(field.rawValue).toEqual({ raw: '{{input.value}}', format: 'md' });
    expect(field.getProperty('raw')!.rawValue).toEqual('{{input.value}}');
    expect(field.getProperty('raw')!.isDynamic).toEqual(true);
    expect(
      field.getProperty('raw')!.refComponentInfos['input' as ComponentId].refProperties
    ).toEqual(['value']);
    expect(field.getProperty('format')!.rawValue).toEqual('md');
    expect(field.getProperty('format')!.isDynamic).toEqual(false);
    expect(field.getProperty('format')!.refComponentInfos).toEqual({});
  });

  it('parse array property', () => {
    const field = new FieldModel({ data: [1, '{{fetch.data}}'] });
    expect(field.isDynamic).toEqual(false);
    expect(field.refComponentInfos).toEqual({});
    expect(field.rawValue).toEqual({ data: [1, '{{fetch.data}}'] });
    expect(field.getProperty('data')!.rawValue).toEqual([1, '{{fetch.data}}']);
    expect(field.getProperty('data')!.isDynamic).toEqual(false);
    expect(field.getProperty('data')!.refComponentInfos).toEqual({});
    expect(field.getProperty('data')!.getProperty(0)!.rawValue).toEqual(1);
    expect(field.getProperty('data')!.getProperty(0)!.isDynamic).toEqual(false);
    expect(field.getProperty('data')!.getProperty(1)!.rawValue).toEqual('{{fetch.data}}');
    expect(field.getProperty('data')!.getProperty(1)!.isDynamic).toEqual(true);
    expect(
      field.getProperty('data')!.getProperty(1)!.refComponentInfos['fetch' as ComponentId]
        .refProperties
    ).toEqual(['data']);
  });

  it('parse iife expression', () => {
    const field = new FieldModel('{{(function(foo) {return foo})("bar") }}');
    expect(field.isDynamic).toEqual(true);
    expect(field.refComponentInfos).toEqual({});
  });

  it('should not count variables declared in iife in refs', () => {
    const field = new FieldModel('{{(function() {const foo = "bar"})() }}');
    expect(field.isDynamic).toEqual(true);
    expect(field.refComponentInfos).toEqual({});
  });

  it('should not count object keys in refs', () => {
    const field = new FieldModel('{{ {foo: 1, bar: 2, baz: 3, } }}');
    expect(field.isDynamic).toEqual(true);
    expect(field.refComponentInfos).toEqual({});
  });

  it('should not count keys of object destructuring assignment in refs', () => {
    const field = new FieldModel('{{ ({foo: bar}) => bar }}');
    expect(field.isDynamic).toEqual(true);
    expect(field.refComponentInfos).toEqual({});
  });

  it('should not count keys of array destructuring assignment in refs', () => {
    const field = new FieldModel('{{ ([bar]) => bar }}');
    expect(field.isDynamic).toEqual(true);
    expect(field.refComponentInfos).toEqual({});
  });

  it('get value by path', () => {
    const field = new FieldModel({ foo: [{}, { bar: { baz: 'Hello, world!' } }] });
    expect(field.getPropertyByPath('foo.1.bar.baz')?.getValue()).toEqual('Hello, world!');
  });

  it('update array property', () => {
    const field = new FieldModel({ data: ['A', 'B'] });

    expect(field.rawValue).toEqual({ data: ['A', 'B'] });
    field.update({ data: ['B'] });
    expect(field.rawValue).toEqual({ data: ['B'] });
    field.update({ data: ['C'] });
    expect(field.rawValue).toEqual({ data: ['C'] });
  });

  it('update object property', () => {
    const field = new FieldModel({ data: { a: 1, b: 2 }, value: '' });

    expect(field.rawValue).toEqual({ data: { a: 1, b: 2 }, value: '' });
    field.update({ data: { a: 1 } });
    expect(field.rawValue).toEqual({ data: { a: 1 }, value: '' });
    field.update({ data: { a: 2 } });
    expect(field.rawValue).toEqual({ data: { a: 2 }, value: '' });
    field.update({ value: 'text' });
    expect(field.rawValue).toEqual({ data: { a: 2 }, value: 'text' });
  });

  it('change component id', () => {
    const appModel = new AppModel(ChangeIdMockSchema, registry);
    const input = appModel.getComponentById('input' as ComponentId);
    const text = appModel.getComponentById('text' as ComponentId);
    const button = appModel.getComponentById('button' as ComponentId);

    input!.changeId('input1' as ComponentId);

    expect(input!.id).toEqual('input1' as ComponentId);
    expect(text!.properties.rawValue).toEqual({
      value: {
        raw: "pre {{(function () {\n    const object = { value: input1.value + input1.notExistKey };\n    return '-' + object.value + '-';\n}());}} end",
        format: 'plain',
      },
      string: 'Please input here',
      expressionString: "{{ 'input' }}",
      array: ['input'],
      expressionArray: "{{['input']}}",
      object: { input: 'input' },
      expressionObject: "{{{'input': 'input'}}}",
    });
    expect(
      button!.traits.find(
        trait => trait.type === `${CORE_VERSION}/${CoreTraitName.Event}`
      )!.properties.rawValue
    ).toEqual({
      handlers: [
        {
          type: 'onClick',
          componentId: 'input1',
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
    });
  });
});
