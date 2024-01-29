## 4. 함수

### 학심 한 줄 요약

매개변수 타입과 리턴 타입을 잘 정의하고, 함수 오버로드 시 시그니처에 있는 반환 타입과 각 매개변수는 구현 시그니처에 있는 동일한 인덱스의 매개변수에 할당할 수 있어야함.

</br>

### 함수의 매개변수

```typescript
function sing(song: string) {
  console.log(song);
}
```

#### 필수 매개변수

타입스크립트는 함수에 선언된 모든 매개변수가 필수라고 가정  
함수가 잘못된 수의 인수로 호출되면, 타입스크립트 오류

```typescript
function singTwo(first: string, second: string) {
  console.log(`${first} ${second}`);
}

singTwo('ball and chain'); // Error: Expected 2 arguments, but got 1.

singTwo('foo', 'bar'); // ok

singTwo('foo', 'bar', 'baz'); // Error: Expected 2 arguments, but got 3.
```

#### 선택적 매개변수

애너테이션 : 앞에 ?를 추가하여 매개변수를 선택적으로 만듦  
선택적 매개변수는 항상 | undefined 유니언 타입을 가짐

```typescript
function foo(bar: string, baz?: string) {
  console.log(bar);

  if (baz) {
    console.log(baz);
  }
}

foo('bar'); // ok
foo('bar', undefined); // ok
foo('bar', 'baz'); // ok
```

- 함수에서 사용되는 모든 선택적 매개변수는 `마지막 매개변수`여야함

#### 기본 메개변수

자바스크립트에서 선택적 매개변수를 선언할 때 = 연산자를 사용하여 기본값을 지정할 수 있음  
타입스크립트 타입에는 암묵적으로 | undefined 유니언 타입이 포함되어 있음

```typescript
function foo(bar: string, baz = 0) {
  console.log(`${bar} ${baz}`);
}

foo('bar'); // ok
foo('bar', 5); // ok
foo('bar', undefined); // ok

foo('bar', 'baz'); // Error: Argument of type '"baz"' is not assignable to parameter of type 'number | undefined'.
```

#### 나머지 매개변수

자바스크립트의 일부 함수는 임의의 수의 인수로 호출 가능  
`...` 스프레드 연산자는 함수 선언의 마지막 매개변수에 위치하고, 나머지 매개변수를 나타냄

```typescript
function foo(bar: string, ...baz: string[]) {
  for (const b of baz) {
    console.log(b);
  }
}

foo('hello'); // ok
foo('hello', 'world'); // ok
foo('hello', 'world', 'baz'); // ok

foo('hello', 5); // Error: Argument of type 'number' is not assignable to parameter of type 'string'.
```

</br>

### 반환 타입

타입 스크립트는 `지각적`: 함수가 반환하는 값의 타입을 추론할 수 있음

```typescript
function foo(bar: string[]) {
  for (const b of bar) {
    console.log(b);
  }

  return bar.length;
}
```

타입스크립트는 `return type`을 가능한 모든 반환 타입의 조합으로 유추

```typescript
function foo(bar: string[], baz: number) {
  return baz < bar.length ? bar[baz] : undefined;
}
```

#### 명시적 반환 타입

타입 애너테이션을 사용해 함수의 반환타입을 명시적으로 선언할 수 있음

- 가능한 반환값이 많은 함수가 항상 동일한 타입의 값을 반환하도록 강제
- 타입스크립트는 재귀 함수의 반환 타입을 통해 타입을 유추하는 것을 거부
- 수백 개 이상의 타입스크립트 파일이 있는 매우 큰 프로젝트에서 타입스크립트 타입 검사 속도를 높일 수 있음

```typescript
function foo(bar: string[], baz = 0): number {
  return baz.length ? foo(bar.slice(1), baz + 1) : baz;
}
```

</br>

### 함수 타입

함수를 값으로 전달할 수 있음

```typescript
const arr = ['hello', 'world'];

function foo(getBaz: (index: number) => string) {
  for (let i = 0; i < arr.length; i++) {
    console.log(getBaz(i));
  }
}

function getBaz(index: number): string {
  return arr[index];
}

foo(getBaz);
```

함수를 값으로 전달할 때 오류 메세지는 할당 가능성 오류의 예로 몇 가지 상세한 단계를 제공

1. 첫 번째 들여쓰기 단계는 두 함수 타입을 출력
2. 다음 들여쓰기 단계는 일치하지 않는 부분을 지정
3. 마지막 들여쓰기 단계는 일치하지 않는 부분에 대한 정확한 할당 가능성 오류 출력

```typescript
const arr = ['hello', 'world'];

function foo(getBaz: (index: number) => string) {
  for (let i = 0; i < arr.length; i++) {
    console.log(getBaz(i));
  }
}

function wrongGetBaz(name: string): string {
  return name;
}

foo(wrongGetBaz);
// Error: Argument of type '(name: string) => string' is not assignable to parameter of type '(index: number) => string'.
//    Types of parameters 'name' and 'index' are incompatible.
//       Type 'number' is not assignable to type 'string'.
```

#### 함수 타입 괄호

함수 타입은 다른 타입이 사용되는 모든 곳에 배치할 수 있음

```typescript
// string | undefined 유니언을 반환하는 함수
let foo: () => string | undefined;

// undefined나 string을 반환하는 함수
let bar: (() => string) | undefined;
```

#### 매개변수의 타입 추론

타입스크립트는 선언된 타입의 위치에 제공된 함수의 매개변수 타입을 유추할 수 있음

```typescript
let foo: (bar: string) => string;

foo = function (bar) {
  return bar;
};

const arr = ['hello', 'world', 'baz'];

// item: string, index: number
arr.forEach((item, index) => {
  console.log(`${item}, ${index}`);
});
```

#### 함수 타입 별칭

```typescript
type Foo = (bar: string) => number;

let foo: Foo;

foo = (bar) => bar.length;

foo = (bar) => bar.toUpperCase(); // Error: Type 'string' is not assignable to type 'number'.
```

함수 매개변수도 함수 타입을 참조하는 별칭 가능

```typescript
type Foo = (foo: string) => number;

function bar(foo: Foo) {
  return foo(1234);
}

bar((input) => `${input}, hello!`);
```

</br>

### 그 외 반환 타입

#### void 반환 타입

return 문이 없는 함수이거나 값을 반환하지 않는 return 문을 가진 함수의 경우

```typescript
function foo(bar: string | undefined): void {
  if (!bar) {
    return;
  }

  console.log(bar);

  return true; // Error: Type 'true' is not assignable to type 'void'.
}
```

#### never 타입 반환

never 반환 함수는 의도적으로 항상 오류를 발생시키거나 무한 루프를 실행하는 함수

```typescript
function fail(message: string): never {
  throw new Error(message);
}
```

</br>

### 함수 오버로드

`오버로드 시그니처`: 함수의 다른 시그니처를 나타내는 함수 타입  
하나의 최종 `구현 시그니처`와 그 함수의 본문 앞에 서로 다른 버전의 함수 이름, 매개변수, 반환 타입을 여러번 선언

```typescript
function foo(bar: number): Date;
function foo(bar: string, baz: number): Date;

// 시그니처 함수의 구현
function foo(bar: string, baz: number, year?: number) {
  return baz === 0 ? new Date() : new Date(year, 0, 1);
}

foo(12345); // ok
foo('hello', 12345); // ok

foo(1, 4); // Error: No overload matches this call.
```

- 함수를 단순하게 유지하고 가능하면 함수 오버로드를 사용하지 않는 것을 권장

#### 호출 시그니처 호환성

함수의 오버로드 시그니처에 있는 반환 타입과 각 매개변수는 구현 시그니처에 있는 동일한 인덱스의 매개변수에 할당할 수 있어야함

```typescript
function foo(bar: string): string;
function foo(bar: string, baz: number): string;

function foo(bar: () => string): string; // Error: This overload signature is not compatible with its implementation signature.

function foo(bar: string, baz?: number) {
  return baz ? baz : bar;
}
```

</br>

### 새로 알게된 점

함수 오버로드 시 오버로드 시그니처와 구현 시그니처에 대해 알게 되었고, 함수 오버로드 시 시그니처에 있는 반환 타입과 각 매개변수는 구현 시그니처에 있는 동일한 인덱스의 매개변수에 할당할 수 있어야함을 알게 되었다.

</br>

### 참고

[타입스크립트 핸드북 - 함수](https://www.typescriptlang.org/docs/handbook/functions.html)
