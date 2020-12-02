import runLazyRules, { RuleResult } from 'runLazyRules';
import { withFirst } from 'withArgs';

/**
 * @param {*} value   Value to be test against rules
 * @param {Function[]} rules    Rules to validate the value with
 */
function oneOf(value, options, rules) {
  let count = 0;

  const result = new RuleResult(true);

  for (let i = 0; i < rules.length; i++) {
    const current = runLazyRules(rules[i], value, options);
    result.extend(current);
    if (current.pass) {
      count++;
    }

    if (count > 1) {
      break;
    }
  }

  return result.setFailed(count !== 1);
}
export default withFirst(oneOf);
