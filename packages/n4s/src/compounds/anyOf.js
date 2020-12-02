import runLazyRules, { RuleResult } from 'runLazyRules';
import { withFirst } from 'withArgs';

/**
 * @param {*} value   Value to be test against rules
 * @param {Function[]} rules    Rules to validate the value with
 */
function anyOf(value, options, rules) {
  const result = new RuleResult(true);
  for (const chain of rules) {
    const currentResult = runLazyRules(chain, value, options);

    if (currentResult.pass) {
      return currentResult;
    }

    result.extend(currentResult);
  }

  return result;
}

export default withFirst(anyOf);
