import React, { useCallback, useEffect, useState, useMemo, Suspense } from 'react';
import { FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import { Type, Static } from '@sinclair/typebox';
import { useFormik } from 'formik';
import { GLOBAL_UTIL_METHOD_ID } from '@subscan/widget-runtime';
import { ComponentSchema } from '@subscan/widget-core';
import { WidgetProps } from '../../types/widget';
import { implementWidget, mergeWidgetOptionsIntoSpec } from '../../utils/widget';
import { RecordWidget } from './RecordField';
import { SpecWidget } from './SpecWidget';
import { observer } from 'mobx-react-lite';
import {
  CORE_VERSION,
  CoreWidgetName,
  generateDefaultValueFromSpec,
  MountEvents,
} from '@subscan/widget-shared';
import { JSONSchema7Object } from 'json-schema';
import { PREVENT_POPOVER_WIDGET_CLOSE_CLASS } from '../../constants/widget';
import { Select as ComponentTargetSelect } from '../Select';

const EventWidgetOptions = Type.Object({});

type EventWidgetType = `${typeof CORE_VERSION}/${CoreWidgetName.Event}`;

declare module '../../types/widget' {
  interface WidgetOptionsMap {
    'core/v1/event': Static<typeof EventWidgetOptions>;
  }
}

export const EventWidget: React.FC<WidgetProps<EventWidgetType>> = observer(props => {
  const { value, path, level, component, spec, services, onChange } = props;
  const { registry, editorStore, appModelManager } = services;
  const { components } = editorStore;
  const utilMethods = useMemo(() => registry.getAllUtilMethods(), [registry]);
  const [methods, setMethods] = useState<string[]>([]);

  const formik = useFormik({
    initialValues: value,
    onSubmit: values => {
      onChange(values);
    },
  });
  const findMethodsByComponent = useCallback(
    (component?: ComponentSchema) => {
      if (!component) {
        return [];
      }

      const componentMethods = Object.entries(
        registry.getComponentByType(component.type).spec.methods
      ).map(([name, parameters]) => ({
        name,
        parameters,
      }));
      const traitMethods = component.traits
        .map(trait => registry.getTraitByType(trait.type).spec.methods)
        .flat();

      return ([] as any[]).concat(componentMethods, traitMethods);
    },
    [registry]
  );
  const eventTypes = useMemo(() => {
    return [...registry.getComponentByType(component.type).spec.events, ...MountEvents];
  }, [component.type, registry]);
  const hasParams = useMemo(
    () => Object.keys(formik.values.method.parameters ?? {}).length,
    [formik.values.method.parameters]
  );
  const paramsSpec = useMemo(() => {
    const methodType = formik.values.method.name;
    const componentId = formik.values.componentId;
    let spec: WidgetProps['spec'] = Type.Record(Type.String(), Type.String());

    if (methodType) {
      if (componentId === GLOBAL_UTIL_METHOD_ID) {
        const targetMethod = registry.getUtilMethodByType(methodType)!;

        spec = targetMethod.spec.parameters;
      } else {
        const targetComponent = appModelManager.appModel.getComponentById(componentId);
        const targetMethod = (findMethodsByComponent(targetComponent) ?? []).find(
          ({ name }) => name === formik.values.method.name
        );

        if (targetMethod?.parameters) {
          spec = targetMethod.parameters;
        }
      }
    }

    return spec;
  }, [
    formik.values.method.name,
    formik.values.componentId,
    registry,
    appModelManager,
    findMethodsByComponent,
  ]);
  const params = useMemo(() => {
    const params: Record<string, string> = {};

    for (const key in paramsSpec?.properties ?? {}) {
      const spec = paramsSpec!.properties![key] as JSONSchema7Object;
      const defaultValue = spec.defaultValue;

      params[key] =
        formik.values.method.parameters?.[key] ??
        defaultValue ??
        generateDefaultValueFromSpec(spec);
    }

    return params;
    // only update when params spec change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsSpec]);
  const parametersPath = useMemo(() => path.concat('method', 'parameters'), [path]);
  const parametersSpec = useMemo(
    () =>
      mergeWidgetOptionsIntoSpec<'core/v1/record'>(paramsSpec, { onlySetValue: true }),
    [paramsSpec]
  );
  const disabledPath = useMemo(() => path.concat('disabled'), [path]);
  const disabledSpec = useMemo(
    () =>
      Type.Boolean({
        widget: 'core/v1/boolean',
        widgetOptions: { isShowAsideExpressionButton: true },
      }),
    []
  );

  const updateMethods = useCallback(
    (componentId: string) => {
      if (componentId === GLOBAL_UTIL_METHOD_ID) {
        setMethods(
          utilMethods.map(
            utilMethod => `${utilMethod.version}/${utilMethod.metadata.name}`
          )
        );
      } else {
        const component = components.find(c => c.id === componentId);

        if (component) {
          const methodNames: string[] = findMethodsByComponent(component).map(
            ({ name }) => name
          );

          setMethods(methodNames);
        }
      }
    },
    [components, utilMethods, findMethodsByComponent]
  );

  useEffect(() => {
    formik.setValues(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, formik.setValues]);
  useEffect(() => {
    formik.setFieldValue('method.parameters', params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, formik.setFieldValue]);
  useEffect(() => {
    if (formik.values.componentId) {
      updateMethods(formik.values.componentId);
    }
  }, [formik.values.componentId, updateMethods]);

  const onTargetComponentChange = useCallback(
    (value: unknown) => {
      formik.setValues({
        ...formik.values,
        componentId: value,
        method: { name: '', parameters: {} },
      });
      updateMethods(value as string);
    },
    [updateMethods, formik]
  );
  const onSubmit = useCallback(() => {
    formik.submitForm();
  }, [formik]);
  const onParametersChange = useCallback(
    json => {
      formik.setFieldValue('method.parameters', json);
      formik.submitForm();
    },
    [formik]
  );
  const onDisabledChange = useCallback(
    value => {
      formik.setFieldValue('disabled', value);
      formik.submitForm();
    },
    [formik]
  );

  const typeField = (
    <FormControl>
      <FormLabel fontSize="14px" fontWeight="normal">
        Event Type
      </FormLabel>
      <Select
        name="type"
        onBlur={onSubmit}
        onChange={formik.handleChange}
        placeholder="Select Event Type"
        value={formik.values.type}
      >
        {eventTypes.map(e => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </Select>
    </FormControl>
  );

  const targetField = (
    <FormControl>
      <FormLabel fontSize="14px" fontWeight="normal">
        Target Component
      </FormLabel>
      <Suspense fallback="Loading Component Target Select">
        <ComponentTargetSelect
          showSearch
          onBlur={onSubmit}
          bordered={false}
          onChange={onTargetComponentChange}
          placeholder="Select Target Component"
          dropdownClassName={PREVENT_POPOVER_WIDGET_CLOSE_CLASS}
          style={{ width: '100%' }}
          value={formik.values.componentId === '' ? undefined : formik.values.componentId}
        >
          {[{ id: GLOBAL_UTIL_METHOD_ID }].concat(components).map(c => (
            <ComponentTargetSelect.Option key={c.id} value={c.id}>
              {c.id}
            </ComponentTargetSelect.Option>
          ))}
        </ComponentTargetSelect>
      </Suspense>
    </FormControl>
  );
  const methodField = (
    <FormControl>
      <FormLabel fontSize="14px" fontWeight="normal">
        Method
      </FormLabel>
      <Select
        name="method.name"
        onBlur={onSubmit}
        onChange={formik.handleChange}
        placeholder="Select Method"
        value={formik.values.method.name}
      >
        {methods.map(m => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </Select>
    </FormControl>
  );

  const parametersField = (
    <FormControl>
      <FormLabel fontSize="14px" fontWeight="normal">
        Parameters
      </FormLabel>
      <RecordWidget
        component={component}
        path={parametersPath}
        level={level + 1}
        spec={parametersSpec}
        services={services}
        value={formik.values.method.parameters}
        onChange={onParametersChange}
      />
    </FormControl>
  );

  const waitTypeField = (
    <FormControl>
      <FormLabel fontSize="14px" fontWeight="normal">
        Wait Type
      </FormLabel>
      <Select
        name="wait.type"
        onBlur={onSubmit}
        onChange={formik.handleChange}
        value={formik.values.wait?.type}
      >
        <option value="delay">delay</option>
        <option value="debounce">debounce</option>
        <option value="throttle">throttle</option>
      </Select>
    </FormControl>
  );

  const waitTimeField = (
    <FormControl>
      <FormLabel fontSize="14px" fontWeight="normal">
        Wait Time
      </FormLabel>
      <Input
        name="wait.time"
        type="number"
        onBlur={onSubmit}
        onChange={formik.handleChange}
        value={formik.values.wait?.time}
      />
    </FormControl>
  );

  const disabledField = (
    <FormControl>
      <FormLabel fontSize="14px" fontWeight="normal">
        Disabled
      </FormLabel>
      <SpecWidget
        {...props}
        spec={disabledSpec}
        level={level + 1}
        path={disabledPath}
        value={formik.values.disabled}
        onChange={onDisabledChange}
      />
    </FormControl>
  );

  return (
    <>
      {spec.properties?.type ? typeField : null}
      {targetField}
      {methodField}
      {hasParams ? parametersField : null}
      {waitTypeField}
      {waitTimeField}
      {disabledField}
    </>
  );
});

export default implementWidget<EventWidgetType>({
  version: CORE_VERSION,
  metadata: {
    name: CoreWidgetName.Event,
  },
})(EventWidget);
