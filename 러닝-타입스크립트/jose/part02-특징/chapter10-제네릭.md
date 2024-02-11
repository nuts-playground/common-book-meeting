## 10. 제네릭

타입스크립트는 `제네릭`을 사용해 타입 간의 관계를 알 수 있음

### 학심 한 줄 요약

    제네릭을 과도하게 사용하면 코드가 복잡해지고 읽기 어려울 수 있으니 제네릭은 꼭 필요한 경우에만 사용하자.

</br></br>

### 제네릭 함수

매개변수 괄호 바로 앞에 화살표 괄호 (`< >`)로 묶인 타입 매개변수에 별칭을 배치해 함수를 제네릭으로 만들 수 있음.

```typescript
function returnParams<T>(input: T) {
  return input;
}

const numberGeneric = returnParams(1234); // Type: number
const stringGeneric = returnParams('hello'); // Type: string
```

</br>

#### 명시적 제네릭 호출 타입

해당 타입 인수가 무엇인지 명시적으로 알려주는 `명시적 제네릭 타입 인수`

```typescript
function foo<T>(callback: (input: T) => void) {
  return (input: T) => {
    console.log(input);
    callback(input);
  }
}

// Type: (input: string) => void
foo<string>(input => {
  console.log(input)
})
```

</br>

#### 다중 함수 타입 매개변수

임의의 수의 타입 매개변수를 쉼표로 구분해 함수를 정의  
타입 매개변수를 선언하고 입력된 값을 읽기 전용 튜플로 반환

```typescript
function getTuple<Foo, Bar>(first: Foo, second: Bar) {
  return [first, second] as const;
}

// readonly [boolean, string] 타입
let tuple = getTuple(true, 'hello');
```

</br></br>

### 제네릭 인터페이스

```typescript
interface User<T> {
  name: T;
}

const getUsername: User<string> = {
  name: 'hello',
}
```

</br>

타입스크립트 내장 Array 메서드에 제네릭 인터페이스로 정의 가능

```typescript
interface Array<T> {
  pop(): T | undefined;
  push(...items: T[]): number;
}
```

</br>

#### 유추된 제네릭 인터페이스 타입

제네릭 인터페이스의 타입 인수는 사용법마다 유추할 수 있음

```typescript
interface User<T> {
  name: T;
  address?: User<T>;
}

function getUser<T>(params: User<string>): T {
  return params.address ? getUser(params.address) : params.name;
}

// 유추된 타입 인수: string
let getName = getUser({
  name: 'hello',
})

// 유추된 타입 인수: number
let getUserInfo = getUser({
  name: 123,
  address: {
    name: 456,
  }
})
```

</br></br>

### 제네릭 클래스

클래스의 각 인스턴스는 타입 매개변수로 각자 다른 타입 인수 집합을 가짐

```typescript
class Secret<Key, Value> {
  key: Key;
  value: Value;

  constructor(key: Key, value: Value) {
    this.key = key;
    this.value = value;
  }

  getValue(key: Key): Value | undefined {
    return this.key === key ? this.value : undefined;
  }
}

const storage = new Secret(12345, 'helloWorld');
storage.getValue(12345);
```

</br>

#### 명시적 제네릭 클래스 타입

클래스 타입 인수를 유추할 수 없는 경우 타입 인수의 기본값은 `unknown`.  
명시적 타입 인수를 제공하여 기본값이 `unknwon`이 되는 것을 피할 수 있음.

```typescript
class User<T> {
  #callback(input: T) => void;

  constructor(callback: (input: T) => void) {
    this.#callback = (input: T) => {
      console.log('T:', input);
      callback(input);
    }
  }

  call(input: T) {
    this.#callback(input);
  }
}

new User((input: string) => {
  console.log(input.length);
});

new User((input) => {
  console.log(input.length); // unknown 타입이기 때문에 에러
})
```

</br>

#### 제네릭 클래스 확장

제네릭 클래스는 상속 받는 클래스(기본 클래스)로 사용할 수 있음

```typescript
class User<T> {
  name: T;

  constructor(name: T) {
    this.name = name;
  }
}

class People extends User<string[]> {
  logUsers() {
    console.log(this.name.join('\n'));
  }
}

new User('hello').name; // Type: string
new User(12345).name; // Type: number

new People(['hello', 'world']).name;; // Type: string[]



class Parent<T> {
  name: T;

  constructor(name: T) {
    this.name: name;
  }
}

// 파생 클래스에서 기본 클래스로 타입 전달
class Child<T> extends Parent<T> {
  address: string

  constructor(name: T, address: string) {
    super(name);
    this.address = address;
  }
}

new Child('hello', 'address');
```

</br>

#### 제네릭 인터페이스 구현

기본 인터페이스의 모든 타입 매개변수는 클래스에 선언되어야 함

```typescript
interface User<T> {
  name: T;
}

class UserInfo implements User<string> {
  name: string;
  isUser: boolean;

  constructor(name: string, isUser: boolean) {
    this.name = name;
    this.isUser = isUser;
  }
}

const userInfo = new UserInfo('hello', true);
```

</br>

#### 메서드 제네릭

클래스 인스턴스와 별개로 자체 제네릭 타입을 선언할 수 있음

```typescript
class User<T> {
  name: T;

  constructor(name: T) {
    this.name = name;
  }

  getInfo<Value>(value: Value) {
    return { 'USER_NAME': this.name, value }
  }
}

const user = new User('hello'); // Type: User<string>

const userId = user.getInfo(10); // Type: { key: string, value: number }
```

</br>

#### 정적 클래스 제네릭

정적 클래스 메서드는 자체 타입 매개변수를 선언할 수 있지만 클래스에 선언된 어떤 타입 매개변수에도 접근할 수 없음.

```typescript
class User<T> {
  getUser(user: T) {
    console.log(user);

    return user;
  }

  static staticGetUser<T>(user: T) {
    let fromInstance: T; // Error: Static members cannot reference class type arguments.

    return user;
  }
}
```

</br></br>

### 제네릭 타입 별칭

#### 제네릭 판별된 유니언

데이터의 성공적인 결과 또는 오류로 인한 실패를 나타내는 제네릭 '결과'타입을 만들기 위해 타입 인수를 추가

```typescript
type Result<T> = FailResult | SuccessResult<T>;

interface FailResult {
  error: Error;
  successed: false;
}

interface SuccessResult<T> {
  data: T;
  successed: true;
}

function handleResult(result: Result<string>) {
  if (result.successed) {
    console.log(result.data);
  } else {
    console.log(result.error);
  }
}
```

</br></br>

### 제네릭 제한자

#### 제네릭 기본값
매개변수 선언 뒤에 `=`와 기본 타입을 배치해 타입 인수를 명시적으로 제공할 수 있음  
기본값은 타입 인수가 명시적으로 선언되지 않고 유추할 수 없는 모든 후속 타입에 사용

```typescript
interface User<T = string> {
  name: T;
}

let stringInterface: User = { value: 'helloworld' };

let numberInterface: User<number> = { value: 1234 };

let errorInterface = { value: 12345 }; // Error: 기본 타입이 string이기 때문



interface KeyValue<Key, Value = Key> {
  key: Key;
  value: Value;
}

let allType: KeyValue<string, number> = {
  key: 'hello',
  value: 1234,
}

let defaultType: KeyValue<string> = {
  key: 'hello',
  value: 'world',
}
```

</br>

제네릭 타입이 기본값이 있는 타입은 제일 마지막에 있어야함

```typescript
function inTheEnd<First, Second = number, Third = number>() {};

function inTheMiddle<First, Second = number, Third>() {}; // Error: 기본값이 있는 타입이 중간에 있기 때문
```

</br></br>

### 제한된 제네릭 타입

타입스크립트는 타입 매개변수가 타입을 확장해야 한다고 선언할 수 있음. (별칭 타입에만 허용)  
매개변수 이름 뒤이 `extends` 키워드를 사용

```typescript
interface User {
  name: string;
}

function getUserInfo<T extends User>(input: T) {
  console.log(input);

  return input;
}

getUserInfo('hello'); // Type: string
getUserInfo([true, false]); // Type: boolean[]
```

</br>

#### `keyof`와 제한된 타입 매개변수

`extends`와 `keyof`를 함께 사용하면 타입 매개변수를 이전 타입 매개변수의 키로 제한할 수 있음.  
제네릭 타입의 키를 지정하는 유일한 방법

```typescript
function get<T, Key extends keyof T>(container: T, key: Key) {
  return container[key];
}

const container = {
  'hello': 'world',
  'stringArr': ['hello', 'arr'],
}

get(container, 'hello'); // Type: string
get(container, 'stringArr'); // Type: string[]
```

</br></br>

### Promise

Promise에서 resolve된 값을 나타내는 단일 타입 매개변수를 가진 Promise 클래스로 표현

```typescript
const resolveUnknown = new Promise(rs => {
  setTimeout(() => rs('Done'), 1000);
}); // Type: Promise<unknown>

const resolveString = new Promise<string>(rs => {
  setTimeout(() => rs('Done'), 1000);
}); // Type: Promise<string>
```

</br>

#### `async 함수`

```typescript
// Type: (name: string) => Promise<number>
async function getUserNameLength(name: string) {
  await new Promise(rs => setTimeout(rs, 1000));

  return name.length;
}

// Type: (name: string) => Promise<number>
async function getUserName(name: string) {
  return name.length;
}
// async 함수에서 수동으로 선언된 반환 타입은 항상 Promise 타입
```

</br></br>

### 제네릭 올바르게 사용하기

제네릭을 과도하게 사용하면 읽기 혼란스럽고 지나치게 복잡한 코드를 만들 수 있음.  
제네릭을 사용할 때는 무엇을 위해 사용하지는 명확해야함

</br>

#### 제네릭 황금률

개인적인 생각으로는 Util 함수와 같이 공통으로 사용할 함수에 어울리는 것 같음.

```typescript
// 제네릭을 사용할 필요가 없는 함수
function logInput<Input extends string>(input: Input) {
  console.log(input);
}

// 바꾸면 이렇게
function logInput(input: string) {
  console.log(input);
}
```

</br>

#### 제네릭 명명 규칙

보통 `T`, `U`, `V`로, 상태관리 라이브러리에서는 `S`, 키와 값 구조에는 `K`, `V`로 많이 사용하지만 용도를 가리키는 제네릭 타입 이름을 사용하는 것이 가장 좋음

```typescript
// L과 V가 무엇인지 유추할 수 없음
function label<L, V>(l: L, k: V) {};

// 좋은 예
function label<Label, Value>(label: Label, value: Value) {};
```
</br></br>

### 새로 알게된 점

제네릭에서 `extends` 키워드와 기본 타입을 지정해 주는 것.  
`extends`와 `keyof`를 조합하여 필요한 곳에 사용하면 좋을 것 같다.

</br></br>

### 참고
[타입스크립트 핸드북 - 제네릭](https://www.typescriptlang.org/docs/handbook/2/generics.html)