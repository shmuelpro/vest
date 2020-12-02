import runLazyRules, { RuleResult } from 'runLazyRules';
import { withFirst } from 'withArgs';

function allOf(value, options, rules) {
  const result = new RuleResult(true);

  for (const chain of rules) {
    const currentResult = runLazyRules(chain, value, options);

    result.extend(currentResult);

    if (currentResult.failed) {
      break;
    }
  }
  return result;
}

export default withFirst(allOf);
