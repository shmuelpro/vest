import enforce from 'enforce';

it('', () => {
  enforce({ user: true }).shape(
    { user: enforce.isBoolean() },
    { message: true }
  );
  // const x = enforce
  //   .shape(
  //     {
  //       user: enforce.anyOf(enforce.isArray(), enforce.isString(), {
  //         message: 2222,
  //       }),
  //     },
  //     { message: 123 }
  //   )
  //   .test({ user: 'example' });

  // console.log(JSON.stringify(x, null, 1));
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
