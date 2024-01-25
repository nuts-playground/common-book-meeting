## 3. 유니언과 리터럴

### 학심 한 줄 요약
    타입스크립트는 두 개 이상의 타입으로 선언이 가능하고, 강제로 코드를 안전하게 작성할 수 있는 언어이다.

</br>

### 유니언: 값이 허용된 타입을 두 개 이상의 가능한 타입으로 확장하는 것

#### 유니언 타입 추론, 선언
```typescript
let foo = Math.random() > 5     // string | undefined
    ? 'hello'
    : undefined;

let bar: string | null = null;
if (Math.random() > 5) {
    bar = 'hello';
}
```

#### 유니언으로 선언한 모든 타입들에 존재하는 멤버 속성에만 접근 가능
```typescript
let foo = Math.random() > 5
    ? 'hello'
    : 12345;

foo.toString(); // ok

foo.toUpperCase();  // Error: Property 'toUpperCase' does not exist on type 'string | number'. Property 'toUpperCase' does not exist on type 'number'.

foo.toFixed();  // Error: Property 'toFixed' does not exist on type 'string | number'. Property 'toFixed' does not exist on type 'string'.
```

</br>

### 내로잉: 값에 허용된 타입이 하나 이상의 가능한 타입이 되지 않도록 좁히는 것
- 타입 가드: 타입을 좁히는 데 사용할 수 있는 논리적 검사

#### 값 할당을 통한 내로잉
```typescript
let foo: number | string;

foo = 'hello';

foo.toUpperCase();  // ok

foo.toFixed();  // Error: Property 'toFixed' does not type 'string'.
```

#### 조건 검사를 통한 내로잉
```typescript
let foo = Math.random() > 5
    ? 'hello'
    : 12345;

if (foo === 'hello') {
    foo.toUpperCase();  // ok
}

foo.toUpperCase();  // Error: Property 'toUpperCase' does not exist on type 'string | number'. Property 'toUpperCase' does not exist on type 'number'.
```

#### typeof 검사를 통한 내로잉
```typescript
let foo = Math.random() > 5
    ? 'hello'
    : 12345;

if (typeof foo === 'string') {
    foo.toUpperCase();  // ok
}



if (!(typeof foo === 'string')) {
    foo.toFixed();  // ok
} else {
    foo.toUpperCase();
}



typeof foo === 'string'
    ? foo.toUpperCase() // ok: string
    : foo.toFixed();    // ok: number
```

</br>

### 리터럴: 원시 타입 값 중 어떤 것이 아닌 특정 원싯값으로 알려진 타입
```typescript
const foo = 'hello';    // 'hello' 타입

let bar: number | 'hello' | 'world';    // 원시 타입과 리터럴을 섞어서 사용 가능
bar = 12345;    // ok
bar = 'hello';  // ok
```

#### 리터럴 타입은 원시 타입에 할당 가능
```typescript
let foo: 'hello';
let baz: string;

foo = 'hello';  // ok

foo = 'world';  // Error: Type '"world"' is not assignable to type '"hello"'.

let bar = '';   // string type

foo = bar;  // Error: Type 'string' is not assignable to type '"hello"'.

baz = bar;  // ok

foo = baz;  // Error: Type 'string' is not assignable to type '"hello"'.

baz = foo;  // ok
```

</br>

### 엄격한 null 검사
#### 타입스크립트 컴파일러 옵션 중 `strictNullChecks` 옵션을 통해 null과 undefined를 검사할 수 있다.

#### `strictNullChecks` 옵션 비활성화
```typescript
let foo = Math.random() > 5
    ? 'hello'
    : undefined;

foo.toLowerCase();  // Potential runtime error: Cannot read property 'toLowerCase' of undefined.
```

#### `strictNullChecks` 옵션 활성화
```typescript
let foo = Math.random() > 5
    ? 'hello'
    : undefined;

foo.toLowerCase();  // Error: Object is possibly 'undefined'.
```

</br>


### 타입 별칭

#### 타입 별칭을 사용하지 않은 경우
```typescript
let foo: boolean | number | string | null | undefined;
let bar: boolean | number | string | null | undefined;
let baz: boolean | number | string | null | undefined;
```

#### 타입 별칭을 사용한 경우
```typescript
type MyType = boolean | number | string | null | undefined;

let foo: MyType;
let bar: MyType;
let baz: MyType;
```
- 타입 별칭은 타입 애너테이션처럼 자바스크립트로 컴파일되지 않음. 타입 별칭은 타입스크립트 컴파일러가 타입을 검사할 때만 사용됨. (개발할 때만 존재)

### 새로 알게된 점
상수로 선언하면 타입으로 추론되는 것을 알게 되었다. 타입 별칭(`typealias`)을 잘 사용하지 않았는데 코드를 깔끔하게 하려면 자주 사용해야겠다.

### 참고
- [타입스크립트 공식 문서 - 유니온](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
- [타입스크립트 공식 문서 - 리터럴](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types)
- [타입스크립트 공식 문서 - null & undefined](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#null-and-undefined)
- [타입스크립트 공식 문서 - 타입 별칭](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)