import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor, act } from '@testing-library/react';
import produce from 'immer';
import React from 'react';
import { initWidgetUI } from '../../src';
import { TestLib } from '../testLib';
import { destroyTimesMap, renderTimesMap, clearTesterMap } from '../testLib/Tester';
import {
  SingleComponentSchema,
  ComponentSchemaChangeSchema,
  HiddenTraitSchema,
  MergeStateSchema,
  AsyncMergeStateSchema,
  TabsWithSlotsSchema,
  ParentRerenderSchema,
  MultiSlotsSchema,
} from './mockSchema';

// A pure single sunmao component will render twice when it mount.
// The first one is its first render, the second one is because traitResults and evaledProperties updates.
// If you find the renderTimes in tests is different from what you get in browser,
// please check whether the react is in StrictMode, because in StrictMode, component will render twice by default.
const SingleComponentRenderTimes = '2';

describe('single component condition', () => {
  it('only render one time', () => {
    const { App } = initWidgetUI({ libs: [TestLib] });
    const { unmount } = render(<App options={SingleComponentSchema} />);

    // simple component will render 2 times, because it have to eval trait and properties twice
    expect(screen.getByTestId('single')).toHaveTextContent(SingleComponentRenderTimes);
    expect(screen.getByTestId('single-destroy-times')).toHaveTextContent('0');
    unmount();
    clearTesterMap();
  });
});

describe('after the schema changes', () => {
  it('the component and its siblings will not unmount after schema changes', () => {
    const { App } = initWidgetUI({ libs: [TestLib] });
    const { rerender, unmount } = render(<App options={ComponentSchemaChangeSchema} />);
    expect(screen.getByTestId('staticComponent-destroy-times')).toHaveTextContent('0');
    expect(screen.getByTestId('dynamicComponent-destroy-times')).toHaveTextContent('0');

    const newMockSchema = produce(ComponentSchemaChangeSchema, draft => {
      const c = draft.spec.components.find(c => c.id === 'dynamicComponent');
      if (c) {
        c.properties.text = 'baz';
      }
    });
    rerender(<App options={newMockSchema} />);

    expect(screen.getByTestId('staticComponent-destroy-times')).toHaveTextContent('0');
    expect(screen.getByTestId('dynamicComponent-destroy-times')).toHaveTextContent('0');
    unmount();
    clearTesterMap();
  });
});

describe('hidden trait condition', () => {
  it('the hidden component should not merge state in store', () => {
    const { App, stateManager } = initWidgetUI({ libs: [TestLib] });
    stateManager.mute = true;
    const { unmount } = render(<App options={HiddenTraitSchema} />);
    expect(screen.getByTestId('tester')).toHaveTextContent(SingleComponentRenderTimes);
    expect(screen.getByTestId('tester-text')).toHaveTextContent('');
    expect(stateManager.store['input1']).toBeUndefined();

    unmount();
    clearTesterMap();
  });
});

describe('when parent rerender change', () => {
  it('the children should not rerender', () => {
    const { App, stateManager, apiService } = initWidgetUI({ libs: [TestLib] });
    stateManager.mute = true;
    const { unmount } = render(<App options={ParentRerenderSchema} />);
    const childTester = screen.getByTestId('tester');
    expect(childTester).toHaveTextContent(SingleComponentRenderTimes);
    act(() => {
      apiService.send('uiMethod', {
        componentId: 'input',
        name: 'setValue',
        parameters: 'foo',
      });
    });
    expect(childTester).toHaveTextContent(SingleComponentRenderTimes);
    expect(stateManager.store['input'].value).toBe('foo');

    unmount();
    clearTesterMap();
  });
});

describe('when component merge state synchronously', () => {
  it('it will not cause extra render', () => {
    const { App, stateManager } = initWidgetUI({ libs: [TestLib] });
    const { unmount } = render(<App options={MergeStateSchema} />);
    expect(screen.getByTestId('tester')).toHaveTextContent(SingleComponentRenderTimes);
    expect(screen.getByTestId('tester-text')).toHaveTextContent('foo-bar-baz');
    expect(stateManager.store['input'].value).toBe('foo');

    unmount();
    clearTesterMap();
  });

  it(`the components' order will not affect render result`, () => {
    const newMergeStateSchema = produce(MergeStateSchema, draft => {
      const temp = draft.spec.components[0];
      draft.spec.components[0] = draft.spec.components[1];
      draft.spec.components[1] = temp;
    });
    const { App, stateManager } = initWidgetUI({ libs: [TestLib] });
    stateManager.mute = true;
    const { unmount } = render(<App options={newMergeStateSchema} />);
    expect(screen.getByTestId('tester')).toHaveTextContent(SingleComponentRenderTimes);
    expect(screen.getByTestId('tester-text')).toHaveTextContent('foo-bar-baz');
    expect(stateManager.store['input'].value).toBe('foo');

    unmount();
    clearTesterMap();
  });
});

describe('when component merge state asynchronously', () => {
  const timeoutPromise = () =>
    new Promise<any>(res => {
      setTimeout(() => res(true), 30);
    });

  it('it will cause extra render', async () => {
    const { App, stateManager } = initWidgetUI({ libs: [TestLib] });
    stateManager.mute = true;
    const { unmount } = render(<App options={AsyncMergeStateSchema} />);
    await waitFor(timeoutPromise);
    // 4 = 2 default render times + timeout trait run twice causing another 2 renders
    expect(await screen.findByTestId('tester')).toHaveTextContent('4');

    unmount();
    clearTesterMap();
  });

  it(`the components' order may cause extra render`, async () => {
    const newMergeStateSchema = produce(AsyncMergeStateSchema, draft => {
      const temp = draft.spec.components[0];
      draft.spec.components[0] = draft.spec.components[1];
      draft.spec.components[1] = temp;
    });
    const { App, stateManager } = initWidgetUI({ libs: [TestLib] });
    stateManager.mute = true;
    const { unmount } = render(<App options={newMergeStateSchema} />);
    await waitFor(timeoutPromise);
    // 5 = 2 default render times + timeout trait run twice causing another 2 renders + order causing change
    expect(await screen.findByTestId('tester')).toHaveTextContent('5');

    unmount();
    clearTesterMap();
  });
});

describe('slot trait if condition', () => {
  it('only teardown component state when it is not hidden before the check', () => {
    const { App, stateManager, apiService } = initWidgetUI({ libs: [TestLib] });
    stateManager.mute = true;
    const { unmount } = render(<App options={TabsWithSlotsSchema} />);
    expect(screen.getByTestId('tabs')).toHaveTextContent(`Tab OneTab Two`);

    act(() => {
      apiService.send('uiMethod', {
        componentId: 'input',
        name: 'setValue',
        parameters: 'new-value',
      });
    });
    expect(stateManager.store).toMatchInlineSnapshot(`
      Object {
        "input": Object {
          "value": "new-value",
        },
        "tabs": Object {
          "selectedTabIndex": 0,
        },
      }
    `);
    act(() => {
      screen.getByTestId('tabs-tab-1').click();
    });
    expect(stateManager.store).toMatchInlineSnapshot(`
      Object {
        "input": Object {
          "value": "new-value",
        },
        "tabs": Object {
          "selectedTabIndex": 1,
        },
      }
    `);

    unmount();
    clearTesterMap();
  });

  it('only teardown component state in the last render', () => {
    const { App, stateManager } = initWidgetUI({ libs: [TestLib] });
    stateManager.mute = true;
    const { unmount } = render(<App options={MultiSlotsSchema} />);

    expect(stateManager.store).toMatchInlineSnapshot(`
      Object {
        "input1": Object {
          "value": "1",
        },
        "input2": Object {
          "value": "2",
        },
        "testList0": Object {},
      }
    `);

    unmount();
    clearTesterMap();
  });
});
