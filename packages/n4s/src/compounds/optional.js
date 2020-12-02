import { isNull } from 'isNull';
import { isUndefined } from 'isUndefined';
import runLazyRules, { Value } from 'runLazyRules';
import { withFirst } from 'withArgs';

/**
 * @param {Array} ObjectEntry   Object and key leading to current value
 * @param {Function[]} rules    Rules to validate the value with
 */
function optional(inputObject, options, ruleGroups) {
  const [obj, key] = Value.unwrap(inputObject);
  if (
    !Object.prototype.hasOwnProperty.call(obj, key) ||
    isUndefined(obj[key] || isNull(obj[key]))
  ) {
    return true;
  }

  return runLazyRules(ruleGroups, obj[key], options);
}

export default withFirst(optional);
