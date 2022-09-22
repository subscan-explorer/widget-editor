import { useEffect, useState } from 'react';
import { css } from '@emotion/css';
import {
  Tabs as BaseTabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
} from '@chakra-ui/react';
import { Type } from '@sinclair/typebox';
import { implementRuntimeComponent } from '@sunmao-ui-fork/runtime';
import { BASIC } from './constants/category';

const StateSpec = Type.Object({
  selectedTabIndex: Type.Number(),
});

const PropsSpec = Type.Object({
  tabNames: Type.Array(Type.String(), {
    title: 'Tab Names',
    category: BASIC,
  }),
  initialSelectedTabIndex: Type.Number({
    title: 'Default Selected Tab Index',
    category: BASIC,
  }),
});

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'tabs',
    displayName: 'Tabs',
    description: 'chakra-ui tabs',
    exampleProperties: {
      tabNames: [],
      initialSelectedTabIndex: 0,
    },
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: PropsSpec,
    state: StateSpec,
    methods: {},
    // tab slot is dynamic
    slots: {
      content: {
        slotProps: Type.Object({
          tabIndex: Type.Number(),
        }),
      },
    },
    styleSlots: ['tabItem', 'tabContent'],
    events: [],
  },
})(props => {
  const {
    tabNames,
    mergeState,
    initialSelectedTabIndex,
    customStyle,
    slotsElements,
    elementRef,
  } = props;
  const [selectedTabIndex, setSelectedTabIndex] = useState(initialSelectedTabIndex ?? 0);

  useEffect(() => {
    mergeState({ selectedTabIndex });
  }, [mergeState, selectedTabIndex]);

  const placeholder = (
    <Text color="gray">Slot content is empty.Please drag component to this slot.</Text>
  );
  return (
    <BaseTabs
      defaultIndex={initialSelectedTabIndex}
      onChange={idx => setSelectedTabIndex(idx)}
      ref={elementRef}
    >
      <TabList>
        {tabNames.map((name, idx) => (
          <Tab
            key={idx}
            className={css`
              ${customStyle?.tabItem}
            `}
          >
            {name}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {tabNames.map((_, idx) => {
          return (
            <TabPanel
              key={idx}
              className={css`
                ${customStyle?.tabContent}
              `}
            >
              {slotsElements?.content?.({ tabIndex: idx }, placeholder, `content_${idx}`)}
            </TabPanel>
          );
        })}
      </TabPanels>
    </BaseTabs>
  );
});
