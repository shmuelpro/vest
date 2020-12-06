import { isNotArray } from 'isArray';
import runLazyRules, { Value, RuleResult } from 'runLazyRules';
import { withFirst } from 'withArgs';

function isArrayOf(value, options, ruleChains) {
  const plainValue = Value.unwrap(value);

  if (isNotArray(plainValue)) {
    return new RuleResult(false);
  }

  const result = new RuleResult(true);

  for (let i = 0; i < plainValue.length; i++) {
    if (result.failed) {
      break;
    }

    const currentResult = new RuleResult(true);

    for (const chain of ruleChains) {
      const chainResult = runLazyRules(chain, plainValue[i], options);
      currentResult.extend(chainResult);
      if (chainResult.pass) {
        currentResult.setFailed(false);
        result.setFailed(false);
        break;
      }
    }

    result.setChild(i, currentResult);
  }

  return result;
}

export default withFirst(isArrayOf);
