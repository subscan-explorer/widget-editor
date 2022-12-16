import { ComponentSchema } from '@subscan/widget-core';
import { RegistryInterface } from '@subscan/widget-runtime';
import WidgetManager from '../models/WidgetManager';
import type { Operations } from '../types/operation';

type EvalOptions = {
  evalListItem?: boolean;
  scopeObject?: Record<string, any>;
  overrideScope?: boolean;
  fallbackWhenError?: (exp: string) => any;
  ignoreEvalError?: boolean;
};

export interface EditorServices {
  registry: RegistryInterface;
  editorStore: {
    components: ComponentSchema[];
  };
  appModelManager: {
    appModel: any;
    doOperations: (operations: Operations) => void;
  };
  stateManager: {
    store: Record<string, any>;
    deepEval: (value: any, options?: EvalOptions) => any;
  };
  widgetManager: WidgetManager;
}
