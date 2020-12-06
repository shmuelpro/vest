import enforce from 'enforce';

describe('AnyOf validation', () => {
  describe('Base behavior', () => {
    it('Should fail when all rules fail', () => {
      expect(
        enforce.anyOf(enforce.isNumber(), enforce.isUndefined()).test('test')
          .pass
      ).toBe(false);
    });
    it('Should succeed when at least one rule applies', () => {
      expect(
        enforce
          .anyOf(enforce.isString(), enforce.isNumber(), enforce.isUndefined())
          .test(5).pass
      ).toBe(true);
    });
    it('Should succeed when rule chaining', () => {
      expect(
        enforce
          .anyOf(
            enforce.isArray().isNotEmpty().longerThan(2),
            enforce.isUndefined()
          )
          .test([1, 2, 3]).pass
      ).toBe(true);
    });
    it('Should fail with no rules', () => {
      expect(enforce.anyOf().test(5).pass).toBe(true);
    });
  });
  describe('As part of enforce', () => {
    it('Should validate anyof the rules correctly', () => {
      enforce(77).anyOf(
        enforce.isString(),
        enforce.isNumber(),
        enforce.isUndefined()
      );
      expect(() =>
        enforce({ test: 4 }).anyOf(enforce.isNumber(), enforce.isUndefined())
      ).toThrow();
    });
  });
});
