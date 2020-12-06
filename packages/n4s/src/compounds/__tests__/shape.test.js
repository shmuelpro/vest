import faker from 'faker';

import enforce from 'enforce';
import { shape, loose } from 'shape';

describe('Shape validation', () => {
  describe('Base behavior', () => {
    it('Should fail when encountered a mis-shapen property', () => {
      expect(
        enforce
          .shape({
            name: enforce.isString(),
          })
          .test({ name: 99 }).pass
      ).toBe(false);
      expect(
        enforce
          .shape({
            count: enforce.isBetween(10, 20),
          })
          .test({ count: 500 }).pass
      ).toBe(false);
      expect(
        enforce
          .shape({
            count: enforce.equals(500),
            isOnline: enforce.equals(false),
          })
          .test({ count: 500, isOnline: true }).pass
      ).toBe(false);
    });

    it('Should pass when no mis-shapen property', () => {
      expect(
        enforce
          .shape({
            name: enforce.isString(),
          })
          .test({ name: '99' }).pass
      ).toBe(true);
      expect(
        enforce
          .shape({
            count: enforce.isBetween(400, 600),
          })
          .test({ count: 500 }).pass
      ).toBe(true);
      expect(
        enforce
          .shape({
            count: enforce.equals(500),
            isOnline: enforce.equals(true),
          })
          .test({ count: 500, isOnline: true }).pass
      ).toBe(true);
    });

    it('Allows multiple enforcements per field', () => {
      expect(
        enforce
          .shape({
            friendCount: enforce.isNumber().greaterThan(150).equals(200),
          })
          .test({
            friendCount: 200,
          }).pass
      ).toBe(true);
      expect(
        enforce
          .shape({
            friendCount: enforce.isNumber().greaterThan(150).equals(300),
          })
          .test({
            friendCount: 200,
          }).pass
      ).toBe(false);
    });
  });

  describe('shape nesting', () => {
    it('Should allow deeply nested shape calls', () => {
      expect(
        enforce
          .shape({
            user: enforce.shape({
              id: enforce.equals('000'),
              details: enforce.shape({
                age: enforce.isNumber(),
                name: enforce.shape({
                  first: enforce.isString(),
                  last: enforce.isString(),
                }),
              }),
            }),
          })
          .test({
            user: {
              id: '000',
              details: {
                age: 99,
                name: {
                  first: 'John',
                  last: 'Doe',
                },
              },
            },
          }).pass
      ).toBe(true);
      expect(
        enforce
          .shape({
            user: enforce.shape({
              id: enforce.equals('000'),
              details: enforce.shape({
                age: enforce.isNumber(),
                name: enforce.shape({
                  first: enforce.isString(),
                  last: enforce.isString(),
                }),
              }),
            }),
          })
          .test({
            user: {
              id: '000',
              details: {
                age: 99,
                name: {
                  first: 'John',
                  last: null,
                },
              },
            },
          }).pass
      ).toBe(false);
    });
  });

  describe('When field is in data but not in shape', () => {
    it('Should fail', () => {
      expect(
        enforce
          .shape({ user: enforce.isString(), password: enforce.endsWith('23') })
          .test({ user: 'example', password: 'x123' }).pass
      ).toBe(true);
      expect(
        enforce
          .shape({ user: enforce.isString() })
          .test({ user: 'example', password: 'x123' }).pass
      ).toBe(false);
    });
  });

  describe('When field is in data but not in shape with loose option', () => {
    it('Should succeed', () => {
      expect(
        enforce
          .shape(
            { user: enforce.isString(), password: enforce.endsWith('23') },
            { loose: true }
          )
          .test({ user: 'example', password: 'x123' }).pass
      ).toBe(true);
      expect(
        enforce
          .shape({ user: enforce.isString() }, { loose: true })
          .test({ user: 'example', password: 'x123' }).pass
      ).toBe(true);
    });
  });

  describe('When field is in shape but not in data', () => {
    it('Should fail', () => {
      expect(
        enforce
          .shape({
            user: enforce.isString(),
            password: enforce.startsWith('x'),
          })
          .test({ user: 'example' }).pass
      ).toBe(false);
    });
    it('Should fail even with loose', () => {
      expect(
        enforce
          .shape(
            { user: enforce.isString(), password: enforce.startsWith('x') },
            { loose: true }
          )
          .test({ user: 'example' }).pass
      ).toBe(false);
    });
  });

  describe('Behavior of loose compared to shape', () => {
    it('Should succeed', () => {
      expect(
        enforce
          .loose({
            user: enforce.isString(),
            password: enforce.endsWith('23'),
          })
          .test({ user: 'example', password: 'x123' }).pass
      ).toBe(true);
      expect(
        enforce.loose({ user: enforce.isString() }).test({
          user: 'example',
          password: 'x123',
        }).pass
      ).toBe(true);
    });
    it('Should fail even with loose', () => {
      expect(
        enforce
          .loose({
            user: enforce.isString(),
            password: enforce.startsWith('x'),
          })
          .test({ user: 'example' }).pass
      ).toBe(false);
    });
  });

  describe('Handling of optional fields', () => {
    it('Should allow optional fields to not be defined', () => {
      expect(
        enforce
          .shape({
            user: enforce.isString(),
            password: enforce.optional(),
            confirm: enforce.optional(),
          })
          .test({ user: 'example', confirm: 'example' }).pass
      ).toBe(true);
    });

    it('Should allow optional fields to be undefined', () => {
      expect(
        enforce
          .shape({
            user: enforce.isString(),
            confirm: enforce.optional(),
          })
          .test({ user: 'example', confirm: undefined }).pass
      ).toBe(true);
    });
    it('Should allow optional fields to be null', () => {
      expect(
        enforce
          .shape({
            user: enforce.isString(),
            confirm: enforce.optional(),
          })
          .test({ user: 'example', confirm: null }).pass
      ).toBe(true);
    });

    it('enforces rules on optional when value is defined', () => {
      expect(
        enforce
          .shape({
            user: enforce.isString(),
            nickname: enforce.optional(
              enforce.isString(),
              enforce.isNotNumeric()
            ),
          })
          .test({ user: 'example', nickname: '1111' }).pass
      ).toBe(false);
    });
  });

  describe('As part of enforce', () => {
    it('Should validate object shape correctly', () => {
      enforce({
        user: {
          age: faker.random.number(10),
          friends: [1, 2, 3, 4, 5],
          id: faker.random.uuid(),
          name: {
            first: faker.name.firstName(),
            last: faker.name.lastName(),
          },
          username: faker.internet.userName(),
        },
      }).shape(shapeRules());

      enforce({
        user: {
          age: faker.random.number(5),
          id: faker.random.uuid(),
          name: {
            first: faker.name.firstName(),
            middle: 'some name',
            last: faker.name.lastName(),
          },
          username: faker.internet.userName(),
        },
      }).shape(shapeRules());

      expect(() =>
        enforce({
          user: {
            age: 55, // 55 is not between 0-10
            id: faker.random.uuid(),
            name: {
              first: faker.name.firstName(),
              middle: 'some name',
              last: faker.name.lastName(),
            },
            username: faker.internet.userName(),
          },
        }).shape(shapeRules())
      ).toThrow();

      expect(() =>
        enforce({
          user: {
            age: 5,
            id: faker.random.uuid(),
            name: {
              first: faker.name.firstName(),
              middle: 'some name',
              last: faker.name.lastName(),
            },
            username: [1, 2, 3], // array instead of a string
          },
        }).shape(shapeRules())
      ).toThrow();

      expect(() =>
        enforce({
          user: {
            age: 5,
            id: faker.random.uuid(),
            username: 'example',
          },
        }).shape(shapeRules())
      ).toThrow();

      expect(() =>
        enforce({
          user: {
            age: faker.random.number(10),
            friends: [1, 2, 3, 4, 5],
            id: faker.random.uuid(),
            name: {
              first: faker.name.firstName(),
              last: faker.name.lastName(),
            },
            shoeSize: 3,
            username: faker.internet.userName(),
          },
        }).shape(shapeRules())
      ).toThrow();

      enforce({
        user: {
          age: faker.random.number(10),
          friends: [1, 2, 3, 4, 5],
          id: faker.random.uuid(),
          name: {
            first: faker.name.firstName(),
            last: faker.name.lastName(),
          },
          shoeSize: 3,
          username: faker.internet.userName(),
        },
      }).loose(looseRules());
    });
  });
});

const looseRules = () => ({
  user: enforce.loose({
    age: enforce.isNumber().isBetween(0, 10),
    friends: enforce.optional(enforce.isArray()),
    id: enforce.isString(),
    name: enforce.loose({
      first: enforce.isString(),
      last: enforce.isString(),
      middle: enforce.optional(enforce.isString()),
    }),
    username: enforce.isString(),
  }),
});
const shapeRules = () => ({
  user: enforce.shape({
    age: enforce.isNumber().isBetween(0, 10),
    friends: enforce.optional(enforce.isArray()),
    id: enforce.isString(),
    name: enforce.shape({
      first: enforce.isString(),
      last: enforce.isString(),
      middle: enforce.optional(enforce.isString()),
    }),
    username: enforce.isString(),
  }),
});
