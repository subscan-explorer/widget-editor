import { Application, Module } from '@subscan/widget-core';
import {
  initSunmaoUI,
  RegistryInterface,
  StateManagerInterface,
} from '@subscan/widget-runtime';
import { WidgetManager } from '@subscan/widget-editor-sdk';
import { EditorStore } from './services/EditorStore';
import { EventBusType } from './services/eventBus';
import { AppModelManager } from './operations/AppModelManager';

type ReturnOfInit = ReturnType<typeof initSunmaoUI>;

export type EditorServices = {
  App: ReturnOfInit['App'];
  registry: RegistryInterface;
  apiService: ReturnOfInit['apiService'];
  stateManager: StateManagerInterface;
  appModelManager: AppModelManager;
  widgetManager: WidgetManager;
  eventBus: EventBusType;
  editorStore: EditorStore;
};

export type StorageHandler = {
  onSaveApp?: (app: Application) => void;
  onSaveModules?: (module: Module[]) => void;
};
