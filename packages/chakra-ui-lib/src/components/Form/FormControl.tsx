import { useEffect, useMemo, useState } from 'react';
import { first } from 'lodash';
import { Static, Type } from '@sinclair/typebox';
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Text,
} from '@chakra-ui/react';
import { css } from '@emotion/css';
import { implementRuntimeComponent, watch } from '@sunmao-ui-fork/runtime';
import { CheckboxStateSpec } from '../Checkbox';
import { BASIC, BEHAVIOR } from '../constants/category';

const FormItemCSS = {
  flex: '0 0 auto',
  width: '66%',
};

const PropsSpec = Type.Object({
  label: Type.String({
    title: 'Label',
    category: BASIC,
  }),
  fieldName: Type.String({
    title: 'Field Name',
    category: BASIC,
  }),
  helperText: Type.String({
    title: 'Helper Text',
    category: BASIC,
  }),
  isRequired: Type.Boolean({
    title: 'Required',
    category: BEHAVIOR,
  }),
});

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'formControl',
    displayName: 'Form Control',
    description: 'chakra-ui formControl',
    exampleProperties: {
      label: 'name',
      fieldName: 'name',
      isRequired: false,
      helperText: '',
    },
    annotations: {
      category: 'Layout',
    },
  },
  spec: {
    properties: PropsSpec,
    state: Type.Object({
      inputId: Type.String(),
      fieldName: Type.String(),
      isInvalid: Type.Boolean(),
      value: Type.Any(),
    }),
    methods: {},
    slots: {
      content: { slotProps: Type.Object({}) },
    },
    styleSlots: ['content'],
    events: [],
  },
})(
  ({
    label,
    fieldName,
    isRequired,
    helperText,
    mergeState,
    services,
    customStyle,
    slotsElements,
    childrenMap,
    component,
    elementRef,
  }) => {
    const [inputValue, setInputValue] = useState('');
    // don't show Invalid state on component mount
    const [hideInvalid, setHideInvalid] = useState(true);
    const inputId = useMemo(
      () => first(childrenMap[component.id]?.content)?.id || '',
      [component.id, childrenMap]
    );
    const [validResult, setValidResult] = useState({
      isInvalid: false,
      errorMsg: '',
    });
    const { isInvalid, errorMsg } = validResult;

    useEffect(() => {
      if (!inputId) return;
      const stop = watch(
        () => {
          const inputState = services.stateManager.store[inputId];
          if (!inputState) return '';
          if (inputState.checked !== undefined) {
            // special treatment for checkbox
            return (inputState as Static<typeof CheckboxStateSpec>).checked;
          } else {
            return inputState.value;
          }
        },
        newV => {
          setInputValue(newV);
        }
      );
      setInputValue(services.stateManager.store[inputId].value);
      return stop;
    }, [inputId, services.stateManager.store, setInputValue]);

    useEffect(() => {
      if (!inputId) return;
      const stop = watch(
        () => {
          return services.stateManager.store[inputId]?.validResult;
        },
        newV => {
          setValidResult(newV);
        }
      );
      if (services.stateManager.store[inputId]?.validResult) {
        setValidResult(services.stateManager.store[inputId].validResult);
      }
      return stop;
    }, [inputId, services.stateManager.store, setValidResult]);

    useEffect(() => {
      if (!inputId) return;
      if (inputValue) {
        // After inputValue first change, begin to show Invalid state
        setHideInvalid(false);
      }
      mergeState({
        inputId: inputId,
        fieldName,
        isInvalid: !!(isInvalid || (!inputValue && isRequired)),
        value: inputValue,
      });
    }, [inputId, fieldName, isInvalid, isRequired, inputValue, mergeState]);

    const placeholder = <Text color="gray.200">Please Add Input Here</Text>;
    const slotView = slotsElements.content ? slotsElements.content({}) : null;

    return (
      <FormControl
        isRequired={isRequired}
        isInvalid={!hideInvalid && (isInvalid || (!inputValue && isRequired))}
        display="flex"
        flexDirection="column"
        alignItems="end"
        className={css`
          ${customStyle?.content}
        `}
        ref={elementRef}
      >
        <HStack width="full">
          <FormLabel flex="0 0 auto" width="33%" margin="auto 0">
            {label}
          </FormLabel>
          {inputId ? slotView : placeholder}
        </HStack>
        {errorMsg ? (
          <FormErrorMessage {...FormItemCSS}>{errorMsg}</FormErrorMessage>
        ) : undefined}
        {helperText ? (
          <FormHelperText {...FormItemCSS}>{helperText}</FormHelperText>
        ) : undefined}
      </FormControl>
    );
  }
);
