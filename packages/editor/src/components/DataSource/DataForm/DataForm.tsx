import React, { useState, useEffect } from 'react';
import { VStack, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { ComponentSchema } from '@subscan/widget-core';
import { ObjectField, mergeWidgetOptionsIntoSpec } from '@subscan/widget-editor-sdk';
import { EditorServices } from '../../../types';
import { genOperation } from '../../../operations';
import { css } from '@emotion/css';

interface Props {
  datasource: ComponentSchema;
  services: EditorServices;
  traitType: string;
}

const LabelStyle = css`
  font-weight: normal;
  font-size: 14px;
`;

export const DataForm: React.FC<Props> = props => {
  const { datasource, services, traitType } = props;
  const [name, setName] = useState(datasource.id);
  const { registry, eventBus, editorStore } = services;
  const traitSpec = registry.getTraitByType(traitType);
  const traitIndex = datasource.traits.findIndex(({ type }) => type === traitType);
  const trait = datasource.traits[traitIndex];
  const onChange = (values: any) => {
    eventBus.send(
      'operation',
      genOperation(registry, 'modifyTraitProperty', {
        componentId: datasource.id,
        traitIndex: traitIndex,
        properties: {
          key: 'value',
          ...values,
        },
      })
    );
  };

  const onNameInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value) {
      if (value !== datasource.id) {
        editorStore.changeDataSourceName(datasource, name);
      }
    }
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    // prevent form keyboard events to accidentally trigger operation shortcut
    e.stopPropagation();
  };

  useEffect(() => {
    setName(datasource.id);
  }, [datasource.id]);

  return (
    <VStack
      p="2"
      spacing="2"
      background="gray.50"
      alignItems="stretch"
      onKeyDown={onKeyDown}
    >
      <FormControl>
        <FormLabel>
          <span className={LabelStyle}>Name</span>
        </FormLabel>
        <Input
          value={name}
          onChange={e => {
            setName(e.target.value);
          }}
          onBlur={onNameInputBlur}
        />
      </FormControl>
      <ObjectField
        spec={mergeWidgetOptionsIntoSpec<'core/v1/object'>(traitSpec.spec.properties, {
          ignoreKeys: ['key'],
        })}
        level={0}
        path={[]}
        component={datasource}
        services={services}
        value={trait.properties}
        onChange={onChange}
      />
    </VStack>
  );
};
