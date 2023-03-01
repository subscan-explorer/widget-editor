import { Type } from '@sinclair/typebox';
import { implementRuntimeTrait } from '../../utils/buildKit';
import { CORE_VERSION, CoreTraitName } from '@subscan/widget-shared';
import { FetcherParams } from '@graphiql/toolkit';

export const GraphQLTraitPropertiesSpec = Type.Object({
  url: Type.String({
    title: 'URL',
  }),
  query: Type.String({
    title: 'Query',
  }),
  variables: Type.Object(
    {},
    {
      title: 'Variables',
    }
  ),
});

export default implementRuntimeTrait({
  version: CORE_VERSION,
  metadata: {
    name: CoreTraitName.GraphQL,
    description: 'graphQL trait',
  },
  spec: {
    properties: GraphQLTraitPropertiesSpec,
    state: Type.Object({}),
    methods: [
      {
        name: 'setValue',
        parameters: Type.Object({
          value: Type.Any(),
        }),
      },
    ],
  },
})(() => {
  return ({ url, query, variables, mergeState, subscribeMethods }) => {
    const fetchData = async (url: string, graphQLParams: FetcherParams) => {
      console.log('fetchData', graphQLParams);
      const data = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(graphQLParams),
        credentials: 'same-origin',
      });
      const result = await data.json().catch(() => data.text());
      console.log('graphal traits core result', result);
      mergeState({
        data: result,
      });

      return result;
    };

    if (url && query) {
      fetchData(url, {
        query: query,
        variables: variables || '',
      });
    }

    const setValue = (newValue: any) => {
      mergeState({
        data: newValue,
      });
    };

    subscribeMethods({
      setValue: ({ value: newValue }: { value: any }) => {
        setValue(newValue);
      },
    });

    return {
      props: null,
    };
  };
});
