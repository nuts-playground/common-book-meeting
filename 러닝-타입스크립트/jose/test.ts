// // let foo: 'hello';
// // let baz: string;

// // foo = 'hello'; // ok

// // foo = 'world'; // Error: Type '"world"' is not assignable to type '"hello"'.

// // let bar = ''; // string type

// // foo = bar; // Error: Type 'string' is not assignable to type '"hello"'.

// // baz = bar; // ok

// // foo = baz; // Error: Type 'string' is not assignable to type '"hello"'.

// // baz = foo; // ok

// type User = {
//   name: string;
//   age?: number;
// };

// const user: User = {
//   name: 'hello',
//   age: 30,
// };

// const secondUser: User = {
//   name: 'world',
// };

// // type WrittenArt = Artwork | Writing;

// // 교차 타입은 유니언과 결합 가능
// type ShortPoem = { author: string } & (
//   | { kigo: string; type: 'haiku' }
//   | { meter: number; type: 'villanelle' }
// );

// // 필수 멤버 속성의 값이 할당되지 않음
// // const wrongUser: User = {
// //   // Error: Property 'name' is missing in type '{ name: string; }' but required in tyep User.
// //   age: 30,
// // };

// const arr = ['hello', 'world'];

// function foo(getBaz: (index: number) => string) {
//   for (let i = 0; i < arr.length; i++) {
//     console.log(getBaz(i));
//   }
// }

// function getBaz(index: number): string {
//   return arr[index];
// }

// foo(getBaz);

// let foo: () => string | undefined;

// let bar: (() => string) | undefined;

// function bar2(): string {
//   return 'hello';
// }

// bar = () => {
//   return 'hello';
// };

// function foo(bar: string): string;
// function foo(bar: string, baz: number): string;

// function foo(bar: string, baz?: number) {
//   return baz ? baz : bar;
// }
