let foo: 'hello';
let baz: string;

foo = 'hello';  // ok

foo = 'world';  // Error: Type '"world"' is not assignable to type '"hello"'.

let bar = '';   // string type

foo = bar;  // Error: Type 'string' is not assignable to type '"hello"'.

baz = bar;  // ok

foo = baz;  // Error: Type 'string' is not assignable to type '"hello"'.

baz = foo;  // ok

