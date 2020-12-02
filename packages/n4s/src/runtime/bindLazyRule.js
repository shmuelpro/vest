import { RUN_RULE } from 'enforceKeywords';
import genRuleProxy from 'genRuleProxy';
import isCompound from 'isCompound';
import optional from 'optional';
import { RuleResult, Value } from 'runLazyRules';
import runtimeRules from 'runtimeRules';
import setFnName from 'setFnName';
import withArgs from 'withArgs';

// Initiates a chain of functions directly from the `enforce`
// function - that's even though we do not have any closure
// there to store that data.
export default function bindLazyRule(ruleName) {
  const registeredRules = [];

  const addFn = fnName =>
    withArgs(args => {
      registeredRules.push(
        setFnName(
          (value, options) =>
            runtimeRules[fnName].apply(
              null,
              [value].concat(options ? options : [], args)
            ),
          fnName
        )
      );

      const returnvalue = genRuleProxy({}, addFn);

      return Object.assign(returnvalue, {
        [RUN_RULE]: (value, options = {}) => {
          const result = new RuleResult(true);
          for (const fn of registeredRules) {
            try {
              if (isCompound(fn)) {
                if (fn.name === optional.name) {
                  result.extend(
                    fn(Value.wrap([value.obj, value.key]), options)
                  );
                } else {
                  result.extend(fn(Value.wrap(value), options));
                }
              } else {
                result.extend(fn(Value.unwrap(value)));
              }

              if (!result.pass) {
                return result;
              }
            } catch (e) {
              return false;
            }
          }
          return result;
        },
      });
    });

  return addFn(ruleName);
}
