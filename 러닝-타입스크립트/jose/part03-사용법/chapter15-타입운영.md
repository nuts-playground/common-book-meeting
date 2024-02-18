# 15. 타입 운영

## 학심 한 줄 요약

    타입을 동적으로 할당해 주는 경우가 많은 챕터이니 주의해서 사용하자.

</br></br>

## 매핑된 타입

타입스크립트는 하나의 타입에서 다른 타입으로 매핑  
매핑된 타입은 다른 타입을 가져와서 해당 타입의 각 속성에 대해 일부 작업을 수행하는 타입  
매핑된 타입은 키 집합의 각 키에 대한 새로운 속성을 만들어 새로운 타입을 생성

```ts
type Animals = 'alligator' | 'baboon' | 'cat';

type AnimalCounts = [
  [K in Animals]: number;
]

// 아래와 같다.
{
  alligator: number;
  babook: number;
  cat: number;
}
```

- 유니언 리터럴을 기반으로 하는 매핑된 타입은 큰 인터페이스를 선언하는 공간을 절약하는 편리한 방법
- 매핑된 타입은 다른 타입에 대해 작동하고 멤버에서 제한자를 추가하거나 제거할 수 있을 때 유용함

</br>

### 타입에서 매핑된 타입

매핑된 타입은 존재하는 타입에 `keyof` 연산자를 사용해 키를 가져오는 방식으로 작동  
존재하는 타입의 키를 매핑하도록 타입에 지시하면 새로운 타입으로 매핑

```ts
interface AnimalVariants {
  alligator: boolean;
  baboon: number;
  cat: string;
}

type AnimalCounts = {
  [K in keyof AnimalVariants]: number;
}

// 아래와 같다.
{
  alligator: number;
  baboon: number;
  cat: number
}
```

- 각 매핑된 타입 멤버 값은 동일한 키 아래에서 원래 타입의 해당 멤버 값을 참조할 수 있음

</br>

```ts
interface BirdVariants {
  dove: string;
  eagle: boolean;
}

type NullableBridVariants = {
  [K in keyof BirdVariants]: BirdVariants[K] | null;
}

// 아래와 같다.
{
  dove: string | null;
  eagle: boolean | null
}
```

- 매핑된 타입은 멤버 집합을 한 번 정의하고 필요한 만큼 여러 번 새로운 버전으로 다시 생성할 수 있음

</br>

### 매핑된 타입과 시그니처

매핑된 타입은 객체 타입의 메서드와 속성 구문을 구분하지 않음  
매핑된 타입은 메서드를 원래 타입의 속성으로 취급

```ts
interface Foo {
  bar(): void;
  baz: () => string;
}

type FooTypes<T> = {
  [K in keyof T]: T[K];
}

type FooProperties = FooTypes<Foo>;
```

</br>

### 제한자 변경

매핑된 타입은 원래 타읍이 멤버에 대해 접근 제어 제한자인 `readonly`와 `?`도 변경이 가능

```ts
interface User {
  name: string;
  age: number;
}

type ReadonlyUser = {
  readonly [K in keyof User]: User[K];
}

// 아래와 같다.
{
  readonly name: string;
  readonly age: number;
}

type OptionalReadonlyUser = {
  [K in keyof ReadonlyUser]?: ReadonlyUser[K];
}

// 아래와 같다.
{
  readonly name?: string;
  readonly age?: number;
}
```

</br>

`-readonly` 또는 `-?`를 사용하여 제한자를 제거할 수 있음

```ts
interface User {
  name: string;
  age?: number;
  readonly addr: string;
}

type RemoveReadonlyUser = {
  -readonly [K in keyof User]: User[K];
}

// 아래와 같다.
{
  name: string;
  age?: number;
  addr: string;
}

type RemoveOptionalUser = {
  [K in keyof RemoveReadonlyUser]-?: RemoveReadonlyUser[K];
}

// 아래와 같다.
{
  name: string;
  age: number;
  addr: string;
}
```

</br>

### 제네릭 매핑된 타입

매핑된 타입은 매핑된 타입 자체의 타입 매개변수를 포함하 `keyof`로 해당 스코프에 있는 모든 타입 이름에 접근할 수 있다.

```ts
type AddReadonly<T> = {
  readonly [K in keyof T]: T[K];
}

interface User {
  name: string;
  age: number;
}

type ReadonlyUser = AddReadonly<User>;

// 아래와 같다.
{
  readonly name: string;
  readonly age: number;
}
```

</br>

임의의 수의 인터페이스를 받고, 그 인터페이스의 완전히 채워진 인스턴스를 반환하는 함수

```ts
interface User {
  name: string;
  age: number;
}

type MakeOptional<T> = {
  [K in keyof T]?: T[K];
}

// 아래와 같다.
{
  name?: string;
  age?: number;
}

// User의 기본값 위에 모든 {overrides}를 구조 분해 할당
function createUser(overrides?: MakeOptional<User>): User {
  return {
    name: 'hello',
    age: 32,
    ...overrides,
  }
}
```

</br></br>

## 조건부 타입

타입스크립트의 타입 시스템은 `논리 프로그래밍 언어`  
`조건부 타입`의 개념은 기존 타입을 바탕으로 두 가지 가능한 타입 중 하나로 확인되는 타입

```ts
// 예시
FirstType extends SecondType ? true : false
```

```ts
// Type: false
type User = string extends number ? true : false;
```

</br>

### 제네릭 조건부 타입

모든 다른 타입을 기반으로 새로운 타입을 생성하기 위해 재사용 가능한 제네릭 타입을 작성할 수 있음

```ts
type CheckNumber<T> = T extends number ? true : false;

// Type: false
type CheckString = CheckNumber<'hello'>;

// Type: true
type CheckString = CheckNumber<1234>;

// Type: true
type CheckString = CheckNumber<number>;
```

</br>

제네릭 T가 함수인지 아닌지 확인

```ts
type GetUser<T> = 
  T extends () => any 
    ? T 
    : () => T;

// Type: () => number[]
type NumbersSetting = GetUser<() => number[]>;

type StringSetting = GetUser<string>;
```

- 조건부 타입은 객체 멤버 검색 구문을 사용해서 제공된 타입의 멤버에 접근할 수 있고, extends 절과 결과 타입에서 그 정보를 사용할 수 있음

</br>

자바스크립트 라이브러리에서 사용하는 패턴 중 조건부 제네릭 타입에도 적합한 한 가지 패턴은 함수에 제공된 옵션 객체를 기반으로 함수의 반환 타입을 변경하는 것

```ts
interface User {
  isUser: boolean;
}

type UserResult<Options extends User> = Options['throwIfNotFound'] extends true ? string : string | undefined;

declare function retrieve<Options extends User>(key: string, options?: Options): Promise<UserResult<Options>>;

// Return Type: string | undefined
await retrieve('hello');

// Return Type: string | undefined
await retrieve('hello', { throwIfNotFound: Math.random() > 5 });

// Return Type: string
await retrieve('hello', { throwIfNotFound: true });
```

</br>

### 타입 분산

조건부 타입은 유니언에 분산됨  
결과 타입은 각 구성요서(유니언 타입 안의 타입들)에 조건부 타입을 적용하는 유니언이 됨을 의미

```ts
type ArrayifyUnlessString<T> = T extends string ? T : T[];

// Type: string | number[]
type HalfArrayified = ArrayifyUnlessString<string | number>;
```

</br>

### 유추된 타입

조건부 타입은 `extends`절에 `infer` 키워드를 사용해 조건의 임의의 부분에 접근  
`extends`절에 타입에 대한 `infer` 키워드와 새 이름을 배치하면 조건부 타입이 `true`인 경우 새로운 타입을 사용할 수 있음을 의미

```ts
type ArrayItems<T> =
  T extends (infer Item)[]
    ? Item
    : T;

// Type: string
type StringItem = ArrayItems<string>;

// Type: string
type StringArrayItem = ArrayItems<string[]>;

// Type: string[]
type String2DItem = ArrayItems<string[][]>;
```

</br>

유추된 타입은 재귀적 조건부 타입을 생성하는 데에도 사용할 수 있음

```ts
type ArrayItemsRecursive<T> = 
  T extends (infer Item)[]
    ? ArrayItemsRecursive<Item>
    : T;

// Type: string
type StringItem = ArrayItemsRecursive<string>;

// Type: string
type StringArrayItem = ArrayItemsRecursive<string[]>;

// Type: string
type String2DItem = ArrayItemsRecursive<string[][]>
```

</br>

### 매핑된 조건부 타입

매핑된 타입은 기존 타입의 모든 멤버에 변경 사항을 적용하고 조건부 타입은 하나의 기존 타입에 변경 사항을 적용  
매핑된 타입과 조건부 타입을 사용하면 제네릭 템플릿 타입의 각 멤버에 조건부 로직을 적용할 수 있음

```ts
type MakeAllMembersFunctions<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? T[K]
    : () => T[K]
}

type MemberFunctions = MakeAllMembersFunctions<{
  alreadyFunction: () => string,
  notFunction: number,
}>

// Type
// {
//   alreadyFunction: () => string,
//   notFunction: () => number,
// }
```

</br></br>

## never

### never와 교차, 유니언 타입

never가 교차타입(&)과 유니언 타입(|)을 함께 사용하면
- 교차타입(&)에 있는 never는 교차 타입을 never로 만든다.
- 유티언 타입(|)에 있는 never는 무시된다.

```ts
// Type: never
type NeverIntersection = never & string;

// Type: string
type NeverUnion = never | string;
```

</br>

### never와 조건부 타입

never는 유니언에서 무시되기 때문에 유니언 타입에서 제네릭 조건부의 결과는 never가 아닌 것이 된다.

```ts
type OnlyString<T> = T extends string ? T : never;

// Type: 'red' | 'blue'
type RedOrBlue = OnlyString<'red' | 'blue' | 0 | false>;
```

</br>

never는 제네릭 타입에 대한 타입 유틸리티를 만들 때 유추된 조건부 타입과 결합된다.  
infer가 있는 타입 추론은 조건부 타입이 true가 되어야 하므로 false인 경우를 절대 사용하지 않아야 할 때 never를 사용하면 좋다.

```ts
type FirstParameter<T extends (...args: any[]) => any> =
  T extends (arg: infer Arg) => any
    ? Arg
    : never;

// Type: string
type GetsString = FirstParameter<(arg0: string) => void>;
```

</br>

### never와 매핑된 타입

유니언에서 never의 동작은 매핑된 타입에서 멤버를 필터링할 때 유용함

- 유니언에서 never는 무시
- 매핑된 타입은 타입의 멤버릴 매핑할 수 있음
- 조건부 타입은 조건이 충족되는 경우 타입을 never로 변환하는 데 사용할 수 있음

```ts
type OnlyStringProperties<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

interface AllEventData {
  participants: string[];
  location: string;
  name: string;
  year: string;
}

// 'location' | 'name'
type OnlyStringEventData = OnlyStringProperties<AllEventData>;
```

</br></br>

## 템플릿 리터럴 타입

경우에 따라 문자열이 일부 문자열 패턴과 일치함을 확인할 때 타입스크립트 구문인 `템플릿 리터럴 타입`을 사용할 수 있음

```ts
type Greeting = `hello${string}`;

let matches: Greeting = 'hello, world!';

// Error
let outOfOrder: Greeting = 'world!, hello';

// Error
let missingAltogether: Greeting = 'hi';
```

</br>

텝플릿 리터럴 타입을 더 좁은 문자열 패턴으로 제한하기 위해 포괄적인 string 원시 타입 대신 문자열 리터럴 타입과 그 유니언을 타입 보간법에 사용할 수 있음

```ts
type Brightness = 'dark' | 'light';
type Color = 'blue' | 'red';

type BrightnessAndColor = `${Brightness}-${Color}`;

let colorOk: BrightnessAndColor = 'dark-blue';

// Error
let colorWrongStart: BrightnessAndColor = 'medium-blue';

// Error
let colorWrongEnd: BrightnessAndColor = 'light-green';
```

</br>

타입스크립트는 템플릿 리터럴 타입이 string, number, bigint, boolean, null, undefined와 같은 모든 원시 타입(symbol 제외) 또는 그 조합을 포함하도록 허용

```ts
type ExtolNumber = `much ${number} hello`;

function extol(extolee: ExtolNumber) {  }

extol('much 0 hello');
extol('much -7 hello');
extol('much 9.001 hello');

// Error
extol('much false hello');
```

</br>

### 고유 문자열 조작 타입

타입스크립트는 문자열을 가져와 문자열에 일부 조작을 적용하고 고유 제네릭 유틸리티 타입을 제공

- Uppercase: 대문자 변환
- Lowercase: 소문자 변환
- Capitalize: 첫 번째 문자를 대문자로 변환
- Uncapitalize: 첫 번째 문자를 소문자로 변환

```ts
// Type: Hello
type FormalGreeting = Capitalize<'hello'>;
```

</br>

### 템플릿 리터럴 키

템플릿 리터럴 타입은 문자열 리터럴을 사용할 수 있는 모든 위치에서 사용 가능

```ts
type DateKey = 'location' | 'name' | 'year';

type ExistenceChecks = {
  [K in `check${Capitalize<DataKey>}`]: () => boolean;
}

// 아래와 같음
{
  checkLocation: () => boolean;
  checkName: () => boolean;
  checkYear: () => boolean;
}
```

</br>

### 매핑된 타입 키 다시 매핑하기

매핑된 타입에는 인덱스 시그니처에 대한 템플릿 리터럴 타입 다음에 `as` 키워드를 배치하면 결과 타입의 키는 템플릿 리터럴 타입과 일치하도록 변경됨  
이렇게 하면 매핑된 타입은 원래 값을 계속 참조하면서 각 매핑된 타입 속성에 대한 다른 키를 가질 수 있음

```ts
interface DataEntry<T> {
  key: T;
  value: string;
}

type DataKey = 'location' | 'name' | 'year';

type DataEntryGetters = {
  [K in DataKey as `get${Capitalize<K>}`]: () => DataEntry<K>;
}

// 아래와 같다.
{
  getLocation: () => DataEntry<'location'>;
  getName: () => DataEntry<'name'>;
  getYear: () => DataEntry<'year'>;
}
```

</br>

키를 다시 매핑하는 작업과 다른 타입 운영을 결합해 기존 타입 형태를 기반으로 하는 매핑된 타입을 생성할 수 있음  
기존 객체에 `keyof typeof`를 사용해 해당 객체의 타입에서 매핑된 타입을 만들 수 있음

```ts
const config = {
  location: 'unknown',
  name: 'anonymous',
  year: 0,
}

type LazyValues = {
  [K in keyof typeof config as `${K}Lazy`]: () => Promise<typeof config[K]>;
}

// 아래와 같다.
{
  location: Promise<string>;
  name: Promise<string>;
  year: Promise<number>;
}
```

</br>

자바스크립트에서 객체 키는 `string` 또는 `Symbol`이 될 수 있고, `Symbol` 키는 원시 타입이 아니므로 템플릿 리터럴 타입으로 사용할 수 없음

```ts
// Error: symbol을 사용할 수 없음
type TurnIntoGettersDirect<T> = {
  [K in keyof T as `get${K}`]: () => T[K];
}
```

</br>

이러한 제한 사항을 피하기 위해 string과 교차타입(&)을 사용하여 문자열이 될 수 있는 타입만 사용하도록 강제  
string & symbol은 never가 되므로 전체 템플릿 문자열은 never가 되고 무시함

```ts
const someSymbol = Symbol('');

interface HasStringAndSymbol {
  StringKey: string;
  [someSymbol]: number;
}

type TurnIntoGetters<T> = {
  [K in keyof T as `get${string & K}`]: () => T[K];
}

type GettersJustString = TurnIntoGetters<HasStringAndSymbol>;

// 아래와 같다.
{
  getStringKey: () => string;
}
```

</br></br>

## 새로 알게된 점

이번 챕터는 전부 처음 접하는 타입스크립트의 기능이다. 동적으로 타입을 할당해 주는 부분이라던지 동적으로 함수를 생성하는 부분이라던지 주의할 점이 많은 챕터이니 다시 한번 살펴보자. (글쓴이는 최소한으로 사용하라고 하는 챕터)  
개인적인 생각으로 다수가 참여하는 프로젝트에서는 문서화가 제대로 되어 있지 않다면 복잡할 것 같다.

</br></br>

## 참고

[타입스크립트 공식 문서 - Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)  
[타입스크립트 공식 문서 - Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)  
[타입스크립트 공식 문서 - Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)  