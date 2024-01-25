## 2. 타입 시스템

### 학심 한 줄 요약
    타입스크립트는 초깃값을 가지고 타입을 유추하지만, 초깃값이 없는 경우 타입 애너테이션을 사용해야 한다.

### 타입은 자바스크립트에서 다루는 값의 형태에 대한 설명이다.

### 자바스크립트의 7가지 원시 타입
- null
- undefined
- boolean
- string
- number
- bigint
- symbol

### 타입스크립트는 7가지 기본 원시 타입 중 하나로 간주
```typescript
null;               // null
undefined;          // undefined
true;               // boolean
'hello';            // string
3;                  // number
1n;                 // bigint
Symbol('world');    // symbol
```

### 타스크립트의 타입 시스템 작동 방식
1. 코드를 읽고 존재하는 모든 타입과 값을 이해
2. 각 값이 초기 선언에서 가질 수 있는 타입을 확인
3. 각 값이 추후 코드에서 어떻게 사용될 수 있는지 모든 방법을 확인
4. 값의 사용법이 타입과 일치하지 않는 경우 오류를 표시

#### 타입스크립트가 멤버 속성을 잘못 호출하는 경우
```typescript
let foo = 'hello';

foo.length();   // Error: This expression is not callable. Type 'Number' has no call signatures.
```

### 타입스크립트의 오류 표시 순서
1. 코드를 읽고 foo라는 변수를 이해
2. 초깃값이 'hello'이므로 foo가 string 타입이라고 결론
3. foo의 .length 멤버를 함수처럼 호출하는 코드를 확인
4. string의 .length 멤버는 함수가 아닌 숫자라는 오류를 표시 (함수처럼 호출할 수 없음)

### 타입스크립트를 사용하면서 가장 자주 접하는 오류
#### 구문 오류: 타입스크립트가 자바스크립트로 변환되는 것을 차단한 경우
```typescript
let let foo;    // Error: ',' expected.

let let, foo;   // 컴파일된 자바스크립트 코드
```

#### 타입 오류: 타입 검사기에 따라 일치하지 않는 것이 감지된 경우
```typescript
console.hello();    // Error: Property 'hello' does not exist on type 'Console'.
```

### 할당 가능성
#### 함수 호출이나 변수에 값을 제공할 수 있는지 여부를 확인
```typescript
let foo = 'hello';
foo = 12345;    // Error: Type 'number' is not assignable to type 'string'.
```

### 타입 애너테이션
변수에 타입스크립트가 읽어야 할 초깃값이 없는 경우 사용
```typescript
let foo: string;
foo = 'hello';

let bar: string;
bar = 12345;    // Error: Type 'number' is not assignable to type 'string'.

let baz: string = 'hello';  // 불필요한 타입 애너테이션. 타입스크립트가 이미 string 타입임을 유추
```
- 타입 애너티에션은 런타임 코드에 영향을 주지 않고, 자바스크립트로 컴파일하면 해당 코드가 삭제된다.
- 타입스크립트가 타입을 유추할 수 없는 경우에는 **진화하는 any**가 될 수 있으니 주의하자.

### 타입 형태
```typescript
let foo = 'hello';
hello.length;   // ok
hello.push('1');   // Error: Property 'push' does not exist on type 'string'.

let bar = {
    firstName: 'hello',
    lastName: 'world',
}
bar.middleName; // Error: Property 'middleName' does not exist on type '{ firstName: string; lastName: string; }'.
```

### 모듈
```typescript
// a.ts
export const foo = 'hello';

// b.ts
export const foo = 'world';

// c.ts
import { foo } from '.a.ts';    // Error: Import declaration conflicts with local declaration of 'foo'.

export const foo = 'error';     // Error: Individual declarations in merged declaration 'foo' must be all exported or all local.
```
- 스크립트 파일에 선언된 변수는 다른 스크립트 파일에 선언된 변수와 동일한 이름을 가질 수 없음.
### 새로 알게된 점
기존에는 타입스크립트가 초깃값을 가지고 타입을 유추하는 건 알고 있었지만, 초깃값이 있는 경우에 문서화를 위하여 애너테이션을 붙여주는 것이 좋은 줄 알았다. 하지만 이제는 그렇지 않아도 되는 걸 알았다.

### 참고
- 타입스크립트는 일반적으로 CommonJS 스타일의 require 함수에서 반환된 값을 any 타입으로 인식