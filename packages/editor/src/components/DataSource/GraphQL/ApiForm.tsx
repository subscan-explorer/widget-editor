import React, { useState, useMemo, useCallback } from 'react';
import { ComponentSchema } from '@sunmao-ui-fork/core';
import {
  VStack,
  CloseButton,
  FormLabel,
  FormControl,
  Stack,
  Box,
} from '@chakra-ui/react';
import { Static, Type } from '@sinclair/typebox';
import { EditorServices } from '../../../types';
import GraphiQL from '../../../graphiql';
import { css, cx } from '@emotion/css';
import { CORE_VERSION, CoreTraitName } from '@sunmao-ui-fork/shared';
import { genOperation } from '../../../operations';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphQLTraitPropertiesSpec } from '@sunmao-ui-fork/runtime';
import { ExpressionWidget } from '@sunmao-ui-fork/editor-sdk';

const CssResetStyle = css`
  & .graphiql-container * {
    box-sizing: content-box;
  }
`;

interface Props {
  api: ComponentSchema;
  services: EditorServices;
  store: Record<string, any>;
  className: string;
}

const EMPTY_ARRAY: string[] = [];

export const GraphQL: React.FC<Props> = props => {
  const { api, className, services } = props;
  const { registry, eventBus, editorStore, stateManager } = services;
  const traitIndex = useMemo(
    () =>
      api.traits.findIndex(
        ({ type }) => type === `${CORE_VERSION}/${CoreTraitName.GraphQL}`
      ),
    [api.traits]
  );
  const trait = useMemo(() => api.traits[traitIndex], [api.traits, traitIndex]);

  const [query, setQuery] = useState<string | undefined>(
    trait?.properties.query as Static<typeof GraphQLTraitPropertiesSpec>['query']
  );
  const [variables, setVariables] = useState<string>(
    (
      (trait?.properties.variables as Static<
        typeof GraphQLTraitPropertiesSpec
      >['variables']) || '{{{}}}'
    ).toString()
  );

  const [url, setUrl] = useState<string>(
    trait?.properties.url as Static<typeof GraphQLTraitPropertiesSpec>['url']
  );
  const fetcher = createGraphiQLFetcher({
    url: stateManager.deepEval<string>(url) as string,
  });

  const evalVariables = useMemo(() => {
    try {
      return JSON.stringify(stateManager.deepEval<string>(variables) as string);
    } catch (error) {
      console.error('evalVariables', error);
      return variables.toString();
    }
  }, [stateManager, variables]);

  const executeCallback = useCallback(() => {
    eventBus.send(
      'operation',
      genOperation(registry, 'modifyTraitProperty', {
        componentId: api.id,
        traitIndex: traitIndex,
        properties: {
          url: url,
          query: query,
          variables: variables,
        },
      })
    );
  }, [api.id, eventBus, query, registry, traitIndex, url, variables]);

  const compactOptions = useMemo(
    () => ({
      height: '40px',
      paddingY: '6px',
    }),
    []
  );

  const URLSpec = Type.String({
    widget: 'core/v1/expression',
    widgetOptions: { compactOptions },
  });

  const VariablesSpec = Type.Object(
    {},
    {
      widget: 'core/v1/expression',
    }
  );

  const onURLChange = useCallback((value: string) => {
    setUrl(value);
  }, []);

  const onVariablesChange = useCallback((value: string) => {
    console.log(value);
    setVariables(value);
  }, []);

  return (
    <VStack
      className={cx(className, CssResetStyle)}
      backgroundColor="#fff"
      align="stretch"
    >
      <Stack p="10px">
        <FormControl display="flex" alignItems="center">
          <FormLabel margin="0" marginRight="2">
            URL:
          </FormLabel>
          <Box flex={1}>
            <ExpressionWidget
              component={api}
              spec={URLSpec}
              value={url}
              path={EMPTY_ARRAY}
              level={1}
              services={services}
              onChange={onURLChange}
            />
          </Box>
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel margin="0" marginRight="2">
            Variables:
          </FormLabel>
          <Box flex={1}>
            <ExpressionWidget
              component={api}
              spec={VariablesSpec}
              value={variables}
              path={EMPTY_ARRAY}
              level={1}
              services={services}
              onChange={onVariablesChange}
            />
          </Box>
        </FormControl>
      </Stack>

      <GraphiQL
        executeCallback={executeCallback}
        query={trait?.properties.query as string}
        variables={evalVariables}
        onEditQuery={data => {
          setQuery(data);
        }}
        toolbar={{
          additionalContent: (
            <>
              <CloseButton
                onClick={() => {
                  editorStore.setActiveDataSourceId(null);
                }}
              />
            </>
          ),
        }}
        fetcher={fetcher}
      />
    </VStack>
  );
};
