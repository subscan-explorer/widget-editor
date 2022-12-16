import {
  ComponentValidatorRule,
  ComponentValidateContext,
  ValidateErrorResult,
} from '../interfaces';
import { CORE_VERSION, CoreComponentName } from '@subscan/widget-shared';

class ModuleValidatorRule implements ComponentValidatorRule {
  kind: 'component' = 'component';

  validate({ component, registry }: ComponentValidateContext): ValidateErrorResult[] {
    if (component.type !== `${CORE_VERSION}/${CoreComponentName.ModuleContainer}`) {
      return [];
    }

    const results: ValidateErrorResult[] = [];
    let moduleSpec;
    try {
      moduleSpec = registry.getModuleByType(component.rawProperties.type);
    } catch (err) {
      moduleSpec = undefined;
    }
    if (!moduleSpec) {
      results.push({
        message: `Module is not registered: ${component.rawProperties.type}.`,
        componentId: component.id,
        property: '/type',
      });
    }
    return results;
  }
}
export const ComponentRules = [new ModuleValidatorRule()];
