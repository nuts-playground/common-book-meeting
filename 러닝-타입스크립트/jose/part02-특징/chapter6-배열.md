## 6. 배열

### 학심 한 줄 요약
    배열의 길이보다 큰 index로 접근하면 명시적으로 타입을 선언하여도 undefined 를 반환할 수 있으니 주의하고, 튜플 추론의 경우 생각과 다르게 추론될 수 있으니 명시적 타입 선언 또는 const 어서션을 사용하자.

</br>

### 배열 타입

타입스크립트는 변수에 타입 애너테이션을 제공에 배열이 포함해야 하는 값의 타입을 정의

```typescript
let foo: number[];

foo = [1, 2, 3];
```

#### 배열과 함수 타입

어느 부분이 함수 반환 부분이고 어느 부분이 배열 타입 묶음인지 나타내기 위해 사용

```typescript
// string 배열을 반환하는 함수
let foo: () => string[];

// 각각의 string을 반환하는 함수 배열
let bar: () => (() => string)[];
```

#### 유니언 배열 타입

배열의 각 요소가 여러 선택 타입 중 하나일 수 있음을 나타애려면 유니언 타입을 사용  
어느 부분이 배열의 컨텐츠이고 어느 부분이 유니언 타입 묶음인지 나타내기 위해 괄호 사용

```typescript
// string 또는 number 배열
let foo: string | number[];

// string과 number 타입의 값을 가지는 배열
let bar: (string | number)[];
```

#### 배열의 진화

타입스크립트는 타입 애너테이션을 포함하지 않으면 `any[]` 타입으로 추론

```typescript
// any[]
let foo = [];

// string[]
foo.push('hello');

// (string | number)[]
foo[0] = 0;
```

#### 다차원 배열

2차원 배열 또는 배열의 배열은 []를 여러개 사용  
3차원이면 3개, 4차원이면 4개, n차원이면 n개

```typescript
let foo: number[][];

foo = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

let bar: (number[])[];

bar = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
```

</br>

### 배열 멤버

타입스크립트는 배열의 멤버를 찾아서 해당 배열의 타입 요소를 되돌려주는 전형적인 인덱스 기반 접근 방식을 이해

```typescript
const foo = ['hello', 'world'];
const baz = ['hello', new Date(1992, 0, 1)];

// string 타입
const bar = foo[0];

// string | Date 타입
const bazType = baz[0];
```

#### 주의 사항: 불안정한 멤버

배열의 길이보다 큰 인덱스로 접근하면 `undefined`를 반환

```typescript
function foo(arr: string[]) {
  console.log(arr[9999].length);
}

foo(['hello', 'world']);
```

### 스프레드와 나머지 매개변수

`...` 스프레드 연산자를 사용하는 나머지 매개변수와 열 스프레드는 자바스크립트에서 배열과 상호작용하는 핵싱 방법


#### 스프레드

```typescript
const foo = ['hello', 'world'];

const bar = [1, 2, 3];

// (string | number)[]
const baz = [...foo, ...bar];
```

#### 나머지 매개변수 스프레드

타입스크립트는 나머지 매개변수로 배열을 스프레드하는 자바스크립트 실행을 인식하고 이에 대해 검사를 수행  
나머지 매개변수를 위한 인수로 사용되는 배열은 나머지 매개변수와 동일한 배열 타입을 가져야함

```typescript
function foo(str: string, ...arr: string[]) {
  for (const s of arr) {
    console.log(`${str} ${s}`);
  }
}

const arr = ['hello', 'world'];

foo('name', ...arr);

const numberArr = [1, 2, 3];

foo('name', ...numberArr); // Error: Argument of type 'number' is not assignable to parameter of type 'string'.
```

</br>

### 튜플
`튜플`: 고정된 크기의 배열. 튜플 배열은 각 인덱스에 알려진 특정 타입을 가지며 배열의 모든 가능한 멤버를 같은 유니언 타입보다 구체적

```typescript
let foo: [string, number];

foo = ['hello', 1];
```

단일 조건으로 두 개의 변수에 초깃값을 설정하는 것처럼 한 번에 여러 값을 할당하기 위해 튜플과 배열 구조 분해 할당을 사용

```typescript
let [str, num] = Math.random() > 5
  ? ['hello', 1]
  : ['world', 2];
```

#### 튜플 할당 가능성

가변 길이의 배열 타입은 튜플 타입에 할당할 수 없음

```typescript
// (boolean | number)[]
const foo = [false, 123];

const bar: [boolean, number] = foo; // Error: Type '(boolean | number)[]' is not assignable to type '[boolean, number]'.
```

#### 나머지 매개변수로서의 튜플

타입스크립트는 `...` 스프레드 연산자로 전달된 튜플에 정확한 타입을 제공할 수 있음

```typescript
function foo(name: string, value: number) {
  console.log(`${name}: ${value}`);
}

const arr1 = ['hello', 1];

foo(...arr1); // Error: A spread argument must either have a tuple type or be passed to a rest parameter.

const arr2: [number, string] = [1, 'hello'];

foo(...arr2); // Error: Argument of type 'number' is not assignable to parameter of type 'string'.

const arr3: [string, number] = ['hello', 1];

foo(...arr3); // ok
```

스프레드 연산자 매개변수 튜플을 사용하고 싶다면 여러 번 함수를 호출하는 인수 목록을 배열에 저장해 함께 사용할 수 있음

```typescript
function foo(name: string, value: [number, boolean]) {
  console.log(`${name}: ${value}`);
}

const arr: [string, [number, boolean]][] = [
  ['bar', [1, false]],
  ['baz', [2, true]],
];

arr.forEach(item => foo(...item)); // ok

arr.forEach(arr); // Error: Argument of type '(name: string, value: [number, boolean]) => void' is not assignable to parameter of type '(value: [number, boolean], index: number, array: [string, [number, boolean]][]) => void'.
//  Types of parameters 'name' and 'value' are incompatible.
//     Type '[string, [number, boolean]]' is not assignable to type 'string'.
```

#### 튜플 추론

타입스크립트는 생성된 배열을 튜플이 아닌 가변 길이의 배열로 취급  
배열이 변수의 초깃값 또는 함수에 대한 반환값으로 사용되는 경우, 고정된 크기의 튜플이 아니라 유연한 크기의 배열로 가정

```typescript
// return (string | number)[]
function foo(input: string) {
  return [input[0], input.length];
}

// char: string | number
// size: string | number
const [char, size] = foo('hello');
```

#### 명시적 튜플 타입
함수가 튜플 타입을 반환한다고 선언되고, 배열 리터럴을 반환한다면 해당 배열 리터럴은 일반적인 가변 길이의 배열 대신 튜플로 간주

```typescript
function foo(input: string): [string, number] {
  return [input[0], input.length];
}

// char: string
// size: number
const [char, size] = foo('hello');
```

#### const 어서션

const 어서션은 타입스크립트에 타입을 유추할 때 읽기 전용 `raedonly` 이 가능한 값 형식을 사용하도록 지시

```typescript
// (string | number)[]
const foo = [123, 'hello'];

// readonly [123, 'world']
const bar = [123, 'world'];
```

const 어서션은 해당 튜플이 읽기 전용이고 값 수정이 예상되는 곳에서 사용할 수 없음을 나타냄

```typescript
const foo: [number, string] = [123, 'hello'];
foo[0] = 123456;

const bar: [number, string] = [123, 'hello'] as const; // Error: The type 'readonly [123, "hello"]' is 'readonly' and cannot be assigned to the mutable type '[number, string]'.

const baz = [123, 'hello'] as const;
baz[0] = 123456; // Error: Cannot assign to '0' because it is a read-only property.
```

튜플을 반환하는 함수로부터 반환된 값은 보통 즉시 구조회되지 않으므로 읽기 전용인 튜플은 함수를 사용하는 데 방해가 되지 않는다.

```typescript
function foo(input: string) {
  return [input[0], input.length] as const;
}

// char: string
// size: number
const [char, size] = foo('hello');
```

- 해당 튜플에서 값을 찾을 수 있음

</br> 

### 새로 알게된 점

튜플이라는 타입은 Javascript에서 없는 타입이라 이해가 잘 되지 않았다. 타입스크립트에서는 정적 코드일 때 타입 검사기에서 타입을 검사하니 튜플이라는 타입을 인지하고 오류가 발생하면 오류를 보여줄 수 있는 것 같다. 튜플의 경우에는 조금 더 사용해 보아야 알겠지만, `const 어서션` 이나 `명시적 애너테이션으로 타입을 정의` 해 주는 것이 좋을 것 같다.

### 참고
[타입스크립트 핸드북 - 배열](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays)  
[타입스크립트 핸드북 - 튜플](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types)  
[타입스크립트 핸드북 - 튜플 읽기 전용](https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-tuple-types)