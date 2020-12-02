import compounds from 'compounds';

const CompoundsRegex = new RegExp(Object.keys(compounds).join('|'));

export default function isCompound({ name }) {
  return name.match(CompoundsRegex);
}
