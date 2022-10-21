import { Static, Type } from '@sinclair/typebox';
import { debounce, throttle, delay } from 'lodash';
import { EventCallBackHandlerSpec } from '@sunmao-ui-fork/shared';
import { type PropsBeforeEvaled } from '@sunmao-ui-fork/core';
import { UIServices } from '../types';

const CallbackSpec = Type.Array(EventCallBackHandlerSpec);

export const runEventHandler = (
  handler: Omit<Static<typeof EventCallBackHandlerSpec>, 'type'>,
  rawHandlers: string | PropsBeforeEvaled<Static<typeof CallbackSpec>>,
  index: number,
  services: UIServices,
  slotKey: string,
  evalListItem?: boolean
) => {
  const { stateManager } = services;
  const send = () => {
    // Eval before sending event to assure the handler object is evaled from the latest state.
    const evalOptions = {
      slotKey,
      evalListItem,
    };
    const evaledHandlers = stateManager.deepEval(rawHandlers, evalOptions) as Static<
      typeof EventCallBackHandlerSpec
    >[];
    const evaledHandler = evaledHandlers[index];

    if (evaledHandler.disabled && typeof evaledHandler.disabled === 'boolean') {
      return;
    }

    services.apiService.send('uiMethod', {
      componentId: evaledHandler.componentId,
      name: evaledHandler.method.name,
      parameters: evaledHandler.method.parameters,
    });
  };
  const { wait } = handler;

  if (!wait || !wait.time) {
    return send;
  }

  return wait.type === 'debounce'
    ? debounce(send, wait.time)
    : wait.type === 'throttle'
    ? throttle(send, wait.time)
    : wait.type === 'delay'
    ? () => delay(send, wait!.time)
    : send;
};
