import { Value, runLazyRule, RuleResult } from 'runLazyRules';
/**
 * @param {Object} inputObject  Data object that gets validated
 * @param {Object} shapeObj  Shape definition
 * @param {Object} options
 * @param {boolean} options.loose Ignore extra keys not defined in shapeObj
 */
export function shape(inputObject, options, shapeObj) {
  const obj = Value.unwrap(inputObject);

  const result = new RuleResult(true);

  for (const key in shapeObj) {
    const current = shapeObj[key];
    const value = obj[key];

    result.setChild(
      key,
      runLazyRule(current, new Value(value, { obj, key }), {
        ...options,
        loose: undefined,
      })
    );

    if (!result.getChild(key).pass) {
      return result.setFailed(true);
    }
  }

  // TODO: Add result
  if (!options.loose) {
    for (const key in obj) {
      if (!shapeObj.hasOwnProperty(key)) {
        return result.setFailed(true);
      }
    }
  }

  return result;
}

export const loose = (obj, options, shapeObj) =>
  shape(obj, Object.assign({}, options, { loose: true }), shapeObj);
