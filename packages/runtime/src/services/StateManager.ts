import { mapValues, isArray, set } from 'lodash';
import dayjs from 'dayjs';
import produce from 'immer';
import 'dayjs/locale/zh-cn';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import relativeTime from 'dayjs/plugin/relativeTime';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { isProxy, reactive, toRaw } from '@vue/reactivity';
import { watch } from '../utils/watchReactivity';
import {
  parseExpression,
  consoleError,
  ConsoleType,
  ExpChunk,
} from '@subscan/widget-shared';
import { type PropsAfterEvaled } from '@subscan/widget-core';

dayjs.extend(relativeTime);
dayjs.extend(isLeapYear);
dayjs.extend(LocalizedFormat);
dayjs.locale('zh-cn');

type EvalOptions = {
  evalListItem?: boolean;
  scopeObject?: Record<string, any>;
  overrideScope?: boolean;
  fallbackWhenError?: (exp: string) => any;
  // when ignoreEvalError is true, the eval process will continue after error happens in nests expression.
  ignoreEvalError?: boolean;
  slotKey?: string;
};

type EvaledResult<T> = T extends string ? unknown : PropsAfterEvaled<Exclude<T, string>>;

// TODO: use web worker
const DefaultDependencies = {
  dayjs,
};

const EcmascriptBuildInObjectsKey = [
  '!name',
  '!define',
  'Infinity',
  'undefined',
  'NaN',
  'Object',
  'Array',
  'String',
  'Number',
  'Boolean',
  'RegExp',
  'Date',
  'Error',
  'SyntaxError',
  'ReferenceError',
  'URIError',
  'RangeError',
  'TypeError',
  'parseInt',
  'parseFloat',
  'isNaN',
  'isFinite',
  'encodeURI',
  'encodeURIComponent',
  'decodeURI',
  'decodeURIComponent',
  'Math',
  'JSON',
  'ArrayBuffer',
  'DataView',
  'Float32Array',
  'Float64Array',
  'Int16Array',
  'Int32Array',
  'Int8Array',
  'Map',
  'Promise',
  'Proxy',
  'Reflect',
  'Set',
  'Symbol',
  'Uint16Array',
  'Uint32Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'WeakMap',
  'WeakSet',
];

const sandboxProxy = new Proxy(
  {},
  {
    has(_target, key) {
      if (key === 'store') return false;
      if (key === 'dependencies') return false;
      if (key === 'scopeObject') return false;
      if (EcmascriptBuildInObjectsKey.indexOf(key.toString()) > -1) return false;
      return true;
    },
    get(_target, _key) {
      // if (key === Symbol.unscopables) return undefined;
      // return target[key];
      // return undefined;
      throw Error('no function');
    },
  }
);

export class ExpressionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExpressionError';
  }
}

export type StateManagerInterface = InstanceType<typeof StateManager>;

export class StateManager {
  store = reactive<Record<string, any>>({});
  slotStore = reactive<Record<string, any>>({});

  /**
   * In `initStateAndMethod`, we setup all components' state with a
   * default value.
   *
   * If some components were unmounted later, the `UnmountImplWrapper`
   * will teardown the state.
   *
   * So we provide this flag set for the `UnmountImplWrapper`, let
   * it know whether the component's state is setup by the init process.
   */
  initSet = new Set<string>();

  dependencies: Record<string, unknown>;

  mute = true;

  constructor(dependencies: Record<string, unknown> = {}) {
    this.dependencies = { ...DefaultDependencies, ...dependencies };
  }

  clear = () => {
    this.store = reactive<Record<string, any>>({});
  };

  evalExp = (expChunk: ExpChunk, options: EvalOptions): unknown => {
    if (typeof expChunk === 'string') {
      return expChunk;
    }

    const { scopeObject = {}, overrideScope = false, ignoreEvalError = false } = options;
    const evalText = expChunk.map(ex => this.evalExp(ex, { scopeObject })).join('');

    try {
      // eslint-disable-next-line no-useless-call, no-new-func
      const evaled = new Function(
        'sandbox, store, dependencies, scopeObject',
        // trim leading space and newline
        `with(sandbox) { with(store) { with(dependencies) { with(scopeObject) { return ${evalText.replace(
          /^\s+/g,
          ''
        )} } } } }`
      ).call(
        null,
        sandboxProxy,
        overrideScope ? {} : this.store,
        overrideScope ? {} : this.dependencies,
        scopeObject
      );

      return evaled;
    } catch (error) {
      if (ignoreEvalError) {
        // convert it to expression and return
        return `{{${evalText}}}`;
      }
      throw error;
    }
  };

  private _maskedEval(raw: string, options: EvalOptions = {}): unknown | ExpressionError {
    const { evalListItem = false, fallbackWhenError } = options;
    let result: unknown[] = [];

    try {
      const expChunk = parseExpression(raw, evalListItem);

      if (typeof expChunk === 'string') {
        return expChunk;
      }

      result = expChunk.map(e => this.evalExp(e, options));

      if (result.length === 1) {
        if (isProxy(result[0])) return toRaw(result[0]);
        return result[0];
      }
      return result.join('');
    } catch (error) {
      if (error instanceof Error) {
        const expressionError = new ExpressionError(error.message);

        if (!this.mute) {
          consoleError(ConsoleType.Expression, raw, expressionError.message);
        }

        return fallbackWhenError ? fallbackWhenError(raw) : expressionError;
      }
      return undefined;
    }
  }

  /**
   * @deprecated please use the `deepEval` instead
   */
  maskedEval(raw: string, options: EvalOptions = {}): unknown | ExpressionError {
    return this.deepEval(raw, options);
  }

  mapValuesDeep<T extends object>(
    obj: T,
    fn: (params: {
      value: T[keyof T];
      key: string | number;
      obj: T;
      path: Array<string | number>;
    }) => void,
    path: Array<string | number> = []
  ): PropsAfterEvaled<T> {
    return mapValues(obj, (val, key: string | number) => {
      return isArray(val)
        ? val.map((innerVal, idx) => {
            return innerVal && typeof innerVal === 'object'
              ? this.mapValuesDeep(innerVal, fn, path.concat(key, idx))
              : fn({ value: innerVal, key, obj, path: path.concat(key, idx) });
          })
        : val && typeof val === 'object'
        ? this.mapValuesDeep(val as unknown as T, fn, path.concat(key))
        : fn({ value: val, key, obj, path: path.concat(key) });
    }) as PropsAfterEvaled<T>;
  }

  deepEval<T extends Record<string, unknown> | any[] | string>(
    value: T,
    options: EvalOptions = {}
  ): EvaledResult<T> {
    const store = this.slotStore;
    const redirector = new Proxy(
      {},
      {
        get(_, prop) {
          return options.slotKey ? store[options.slotKey][prop] : undefined;
        },
      }
    );

    options.scopeObject = {
      ...options.scopeObject,
      $slot: redirector,
    };
    // just eval
    if (typeof value !== 'string') {
      return this.mapValuesDeep(value, ({ value }) => {
        if (typeof value !== 'string') {
          return value;
        }
        return this._maskedEval(value, options);
      }) as EvaledResult<T>;
    } else {
      return this._maskedEval(value, options) as EvaledResult<T>;
    }
  }

  deepEvalAndWatch<T extends Record<string, unknown> | any[] | string>(
    value: T,
    watcher: (params: { result: EvaledResult<T> }) => void,
    options: EvalOptions = {}
  ) {
    const stops: ReturnType<typeof watch>[] = [];

    // just eval
    const evaluated = this.deepEval(value, options) as T extends string
      ? unknown
      : PropsAfterEvaled<Exclude<T, string>>;

    const store = this.slotStore;
    const redirector = new Proxy(
      {},
      {
        get(_, prop) {
          return options.slotKey ? store[options.slotKey][prop] : undefined;
        },
      }
    );
    options.scopeObject = {
      ...options.scopeObject,
      $slot: redirector,
    };
    // watch change
    if (value && typeof value === 'object') {
      let resultCache = evaluated as PropsAfterEvaled<Exclude<T, string>>;

      this.mapValuesDeep(value, ({ value, path }) => {
        const isDynamicExpression =
          typeof value === 'string' &&
          parseExpression(value).some(exp => typeof exp !== 'string');

        if (!isDynamicExpression) return;

        const stop = watch(
          () => {
            const result = this._maskedEval(value as string, options);

            return result;
          },
          newV => {
            resultCache = produce(resultCache, draft => {
              set(draft, path, newV);
            });
            watcher({ result: resultCache as EvaledResult<T> });
          }
        );
        stops.push(stop);
      });
    } else {
      const stop = watch(
        () => {
          const result = this._maskedEval(value, options);
          return result;
        },
        newV => {
          watcher({ result: newV as EvaledResult<T> });
        },
        {
          deep: true,
        }
      );
      stops.push(stop);
    }

    return {
      result: evaluated,
      stop: () => stops.forEach(s => s()),
    };
  }

  setDependencies(dependencies: Record<string, unknown> = {}) {
    this.dependencies = { ...DefaultDependencies, ...dependencies };
  }
}
