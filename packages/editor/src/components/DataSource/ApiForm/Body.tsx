import React, { useCallback, useMemo } from 'react';
import { Box, Select, Text, VStack } from '@chakra-ui/react';
import {
  SpecWidget,
  WidgetProps,
  mergeWidgetOptionsIntoSpec,
} from '@subscan/widget-editor-sdk';
import { FormikHelpers, FormikHandlers, FormikState } from 'formik';
import { FetchTraitPropertiesSpec } from '@subscan/widget-runtime';
import { ComponentSchema } from '@subscan/widget-core';
import { Static } from '@sinclair/typebox';
import { EditorServices } from '../../../types';

type Values = Static<typeof FetchTraitPropertiesSpec>;
interface Props {
  api: ComponentSchema;
  spec: WidgetProps['spec'];
  formik: FormikHelpers<Values> & FormikHandlers & FormikState<Values>;
  services: EditorServices;
}

const EMPTY_ARRAY: string[] = [];

export const Body: React.FC<Props> = props => {
  const { api, spec, formik, services } = props;
  const { values } = formik;
  const specWithWidgetOptions = useMemo(
    () =>
      mergeWidgetOptionsIntoSpec<'core/v1/spec' | 'core/v1/record' | any>(spec, {
        minNum: 1,
        isShowHeader: true,
      }),
    [spec]
  );

  const onChange = useCallback(
    (value: Record<string, unknown>) => {
      formik.setFieldValue('body', value);
      formik.submitForm();
    },
    [formik]
  );

  const onBodyTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      formik.setFieldValue('bodyType', e.target.value);
      formik.submitForm();
    },
    [formik]
  );

  return (
    <VStack alignItems="start">
      <Text fontSize="lg" fontWeight="bold">
        BodyType
      </Text>
      <Select value={values.bodyType} onChange={onBodyTypeChange}>
        <option value="json">JSON</option>
        <option value="formData">Form Data</option>
        <option value="raw">Raw</option>
      </Select>

      <Box width="full">
        <SpecWidget
          component={api}
          spec={specWithWidgetOptions}
          path={EMPTY_ARRAY}
          level={1}
          value={values.body}
          services={services}
          onChange={onChange}
        >
          {{
            title: (
              <Text fontSize="lg" fontWeight="bold" display="inline">
                Body
              </Text>
            ),
          }}
        </SpecWidget>
      </Box>
    </VStack>
  );
};
