import splitOptions from 'splitOptions';

import bindLazyRule from 'bindLazyRule';
import bindExtend from 'enforce.extend';
import bindTemplate from 'enforce.template';
import runner from 'enforceRunner';
import genRuleProxy from 'genRuleProxy';
import runtimeRules from 'runtimeRules';
import withArgs from 'withArgs';

const Enforce = value => {
  const proxy = genRuleProxy({}, ruleName =>
    withArgs(args => {
      const rule = runtimeRules[ruleName];

      runner(rule, value, splitOptions(rule, args));
      return proxy;
    })
  );
  return proxy;
};

const enforce = genRuleProxy(Enforce, bindLazyRule);

bindExtend(enforce, Enforce);
bindTemplate(enforce);

export default enforce;
