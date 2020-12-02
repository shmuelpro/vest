import asArray from 'asArray';
import { RUN_RULE } from 'enforceKeywords';
import { isBoolean } from 'isBoolean';

export default function runLazyRules(ruleGroups, value, options) {
  const result = new RuleResult(true);
  for (const chain of asArray(ruleGroups)) {
    if (result.failed && !options.deep) {
      break;
    }

    result.extend(runLazyRule(chain, value, options));
  }

  return result;
}

export function runLazyRule(ruleGroup, value, options) {
  const result = new RuleResult(ruleGroup[RUN_RULE](value, options));
  return result;
}

export class RuleResult {
  constructor(ruleRunResult = {}) {
    if (isBoolean(ruleRunResult)) {
      this.setFailed(!ruleRunResult);
    }

    Object.assign(this, ruleRunResult);
  }

  setFailed(failed) {
    this.failed = failed;
    return this;
  }

  setChild(key, child) {
    if (!child.pass) {
      this.setFailed(true);
    }
    this.children = this.children || {};
    this.children[key] = child;
  }

  getChild(key) {
    return (this.children || {})[key];
  }

  extend(newRes) {
    const res = RuleResult.is(newRes) ? newRes : new RuleResult(newRes);
    const failed = this.failed || res.failed;

    if (res.children && this.children) {
      Object.assign(res.children, this.children);
    }
    Object.assign(this, res, { failed });
  }

  get pass() {
    return !this.failed;
  }

  static is(res) {
    return res instanceof RuleResult;
  }
}

export class Value {
  constructor(value, options = {}) {
    this.value = value;
    Object.assign(this, options);
  }

  static unwrap(value) {
    return Value.is(value) ? value.value : value;
  }

  static wrap(value) {
    return Value.is(value) ? value : new Value(value);
  }

  static is(value) {
    return value instanceof Value;
  }
}
