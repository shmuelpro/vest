import enforce from 'enforce';

it('', () => {
  const x = enforce
    .shape({
      // id: enforce.isNumber(),
      // name: enforce.optional(
      //   enforce.loose({ first: enforce.isString() }),
      //   enforce.loose({ last: enforce.isString() }),
      //   enforce.loose({ middle: enforce.isString() })
      // ),
      // age: enforce.oneOf(enforce.isString(), enforce.isNumber()),
      // age: enforce.anyOf(enforce.greaterThan(1), enforce.isString()),
      // meta: enforce.anyOf(enforce.isString(), enforce.isEmpty())
      items: enforce.isArrayOf(
        enforce.isString(),
        enforce.shape({
          age: enforce.isNumber(),
        })
      ),
    })
    .test(
      {
        /*id: 2, name: { first: 'evyatar', last: ' evyatar', middle: 'h.' },*/
        // age: 27,
        items: [
          '2',
          {
            age: 55,
          },
        ],
      },
      { deep: true }
    );

  console.log(JSON.stringify(x, null, 1));
});

/*

{
  rule: 'shape',
  failed: true,
  keys: {
    meta: {
      failed: true,
    },
    id: {
      failed: true
    },
    name: {
      failed: true,
      keys: {
        first: {
          failed: true
        }
      }
    }
  }
}




*/
