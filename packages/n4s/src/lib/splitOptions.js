import isCompound from 'isCompound';
import { loose, shape } from 'shape';

const hasTwoArgs = rule => [shape.name, loose.name].includes(rule.name);

function twoArgs(args) {
  return args.length === 1 ? args.concat({}) : args;
}

function unknownArgsCount(args) {
  const last = args[args.length - 1];
  const hasOptions = last && !last.hasOwnProperty(InternalIdentifier);

  let options = {};

  if (hasOptions) {
    [options] = args.splice(-1)[0];
  }

  return [args, options];
}

export default function splitOptions(rule, args) {
  return isCompound(rule)
    ? hasTwoArgs(rule)
      ? twoArgs(args)
      : unknownArgsCount(args)
    : args;
}

export const InternalIdentifier = Symbol();
