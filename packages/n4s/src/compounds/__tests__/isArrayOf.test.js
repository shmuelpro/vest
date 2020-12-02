import enforce from 'enforce';
import isArrayOf from 'isArrayOf';

let result;
describe('Tests isArrayOf rule', () => {
  it('Should pass if all elements are ture for one or more rules', () => {
    result = isArrayOf(
      [3, 4, 5, 'six', 7],
      {},
      enforce.greaterThan(2),
      enforce.isString()
    );
    expect(result.pass).toBe(true);

    result = isArrayOf(
      [3, 4, 5, 'six', 7],
      {},
      enforce.greaterThan(2),
      enforce.isString()
    );
    expect(result.pass).toBe(true);
  });

  describe('Tests for recursive call', () => {
    it('Should pass only if all elements are ture for one or more rules', () => {
      result = isArrayOf(
        [3, 4, 5, ['s', 'i', 'x'], 7],
        {},
        enforce.greaterThan(2),
        enforce.isArrayOf(enforce.isString())
      );
      expect(result.pass).toBe(true);

      result = isArrayOf(
        [
          [1, 0, 1, 0],
          [0, 0, 1, 0],
          [0, 1, 0, 0],
        ],
        {},
        enforce.isArrayOf(enforce.equals(0), enforce.equals(1))
      );
      expect(result.pass).toBe(true);
    });

    it('Should fail if one element or more fails all rules', () => {
      result = isArrayOf(
        [3, 4, 5, ['s', 'i', 'x'], 7],
        {},
        enforce.greaterThan(2),
        enforce.isArrayOf(enforce.isNumber())
      );
      expect(result.pass).toBe(false);
    });

    result = isArrayOf(
      [
        [1, 0, 1, 0],
        [0, 0, 1, 'not 0/1'],
        [0, 1, 0, 0],
      ],
      {},
      enforce.isArrayOf(enforce.equals(0), enforce.equals(1))
    );
    expect(result.pass).toBe(false);
  });

  describe('as part of enforce', () => {
    it('should return silently when valid', () => {
      enforce([1, 2, '3']).isArrayOf(enforce.isNumber(), enforce.isString());
      enforce([1, 2, '3']).isArrayOf(
        enforce.isNumeric(),
        enforce.lessThan(5).greaterThan(0)
      );
      enforce([
        [0, 1, 0, 1],
        [1, 1, 1, 1],
        [0, 1, 1, 0],
      ]).isArrayOf(
        enforce.isArrayOf(enforce.equals(0), enforce.equals(1)).lengthEquals(4)
      );
    });

    it('should throw an exception when invalid', () => {
      expect(() => enforce([1, 2, '3']).isArrayOf(enforce.isNull())).toThrow();
      expect(() =>
        enforce([1, 2, '3']).isArrayOf(
          enforce.isNumber(),
          enforce.greaterThan(5)
        )
      ).toThrow();
      expect(() =>
        enforce([
          [0, 1, 0, 1],
          [1, 'not 0/1', 1, 1],
          [0, 1, 1, 0],
        ])
          .isArrayOf(enforce.isArrayOf(enforce.equals(0), enforce.equals(1)))
          .lengthEquals(4)
      ).toThrow();
      expect(() =>
        enforce([
          [0, 1, 0, 1],
          [1, 1, 1],
          [0, 1, 1, 0],
        ])
          .isArrayOf(enforce.isArrayOf(enforce.equals(0), enforce.equals(1)))
          .lengthEquals(4)
      ).toThrow();
    });
  });
});
