import allOf from 'allOf';
import enforce from 'enforce';

describe('allOf validation', () => {
  describe('Base behavior', () => {
    it('Should fail when at least one rule fails', () => {
      expect(
        enforce.allOf(enforce.isString(), enforce.longerThan(10)).test('test')
          .pass
      ).toBe(false);
    });
    it.only('Should succeed when all of the rules apply', () => {
      expect(
        enforce.allOf(enforce.isString(), enforce.longerThan(3)).test('test')
          .pass
      ).toBe(true);
    });
    it('Should pass when no rules are provided', () => {
      expect(allOf(3, {}).pass).toBe(true);
    });
  });

  describe('As part of enforce', () => {
    const User = enforce.template(
      enforce.loose({
        id: enforce.isNumber(),
        name: enforce.shape({
          first: enforce.isString(),
          last: enforce.isString(),
          middle: enforce.optional(/*enforce.isString()*/),
        }),
      })
    );

    const DisabledAccount = enforce.template(
      enforce.loose({
        disabled: enforce.equals(true),
      })
    );

    it('Should validate allof the rules correctly', () => {
      enforce({
        id: 123,
        name: { first: 'Albert', last: 'Einstein' },
        disabled: true,
      }).allOf(User /*, DisabledAccount*/);
    });

    it('Should throw if one of the rules fail', () => {
      expect(() => {
        enforce({
          id: 123,
          name: { first: 'Albert', last: 0 },
          disabled: true,
        }).allOf(User, DisabledAccount);
      }).toThrow();

      expect(() => {
        enforce({
          id: 123,
          name: { first: 'Albert', last: 'Einstein' },
          disabled: false,
        }).allOf(User, DisabledAccount);
      }).toThrow();
    });
  });
});
