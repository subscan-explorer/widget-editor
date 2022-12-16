import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { RegistryInterface } from '@subscan/widget-runtime';
import {
  sunmaoChakraUILib,
  widgets as chakraWidgets,
} from '@subscan/widget-chakra-ui-lib';
import { initSunmaoUIEditor } from './init';
import { LocalStorageManager } from './LocalStorageManager';

type Options = Partial<{
  components: Parameters<RegistryInterface['registerComponent']>[0][];
  traits: Parameters<RegistryInterface['registerTrait']>[0][];
  modules: Parameters<RegistryInterface['registerModule']>[0][];
  container: Element;
}>;

const lsManager = new LocalStorageManager();
const { Editor, registry } = initSunmaoUIEditor({
  widgets: [...chakraWidgets],
  storageHandler: {
    onSaveApp(app) {
      lsManager.saveAppInLS(app);
    },
    onSaveModules(modules) {
      lsManager.saveModulesInLS(modules);
    },
  },
  defaultApplication: lsManager.getAppFromLS(),
  defaultModules: lsManager.getModulesFromLS(),
  runtimeProps: {
    libs: [sunmaoChakraUILib],
    isInEditor: true,
  },
  registerCoreComponent: false,
});

export default function renderApp(options: Options = {}) {
  const {
    components = [],
    traits = [],
    modules = [],
    container = document.getElementById('root'),
  } = options;
  components.forEach(c => registry.registerComponent(c));
  traits.forEach(t => registry.registerTrait(t));
  modules.forEach(m => registry.registerModule(m));

  ReactDOM.render(
    <StrictMode>
      <Editor />
    </StrictMode>,
    container
  );
}
