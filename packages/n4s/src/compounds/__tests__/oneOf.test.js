import enforce from 'enforce';

describe('OneOf validation', () => {
  describe('Base behavior', () => {
    it('Should fail when all rules fail', () => {
      expect(
        enforce.oneOf(enforce.isNumber(), enforce.isUndefined()).test('test')
          .pass
      ).toBe(false);
    });
    it('Should succeed when EXACTLY one rule applies', () => {
      expect(
        enforce
          .oneOf(enforce.isString(), enforce.isNumber(), enforce.isUndefined())
          .test(5).pass
      ).toBe(true);
    });
    it('Should fail when more than one rule applies', () => {
      expect(
        enforce
          .oneOf(enforce.isNumber(), enforce.isNumber().greaterThan(3))
          .test(5).pass
      ).toBe(false);
    });
    it('Should succeed when rule chaining', () => {
      expect(
        enforce
          .oneOf(
            enforce.isArray().isNotEmpty().longerThan(2),
            enforce.isUndefined()
          )
          .test([1, 2, 3]).pass
      ).toBe(true);
    });
    it('Should fail with no rules', () => {
      expect(enforce.oneOf().test(5).pass).toBe(false);
    });
  });

  describe('As part of enforce', () => {
    it('Should validate the rules correctly', () => {
      enforce(77).oneOf(
        enforce.isString(),
        enforce.isNumber(),
        enforce.isUndefined()
      );

      expect(() =>
        enforce({ test: 4 }).oneOf(enforce.isNumber(), enforce.isUndefined())
      ).toThrow();
    });
  });
});
