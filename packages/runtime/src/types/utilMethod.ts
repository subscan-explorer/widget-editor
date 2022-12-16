import { UIServices } from './application';
import { RuntimeUtilMethod } from '@subscan/widget-core';

export type UtilMethodImpl<T = any> = (parameters: T, services: UIServices) => void;

export type ImplementedUtilMethod<T = any> = RuntimeUtilMethod & {
  impl: UtilMethodImpl<T>;
};

export type UtilMethodFactory = (sunmaoInstanceKey: string) => ImplementedUtilMethod<any>;
