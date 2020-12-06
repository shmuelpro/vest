import isCompound from 'isCompound';
import { loose, shape } from 'shape';

const hasTwoArgs = rule => [shape.name, loose.name].includes(rule.name);

function twoArgs(args) {
  // this sounds like the right approach. We'll need to test it.
  return args.length === 1 ? [{}].concat(args) : args.reverse();
}

function unknownArgsCount(args) {
  const last = args[args.length - 1];
  const hasOptions = last && !last.hasOwnProperty(InternalIdentifier);

  let options = {};

  if (hasOptions) {
    [options] = args.splice(-1)[0];
  }

  return [options, args];
}

export default function splitOptions(rule, args) {
  return isCompound(rule)
    ? hasTwoArgs(rule)
      ? twoArgs(args)
      : unknownArgsCount(args)
    : args;
}

export const InternalIdentifier = Symbol();
