## 7. 인터페이스

연관된 이름으로 객체 형태를 설명하는 또 다른 방법

### 학심 한 줄 요약

    인터페이스 확장으로 코드의 중복을 줄이고 다른 코드 영역에서 객체의 형태를 쉽게 재사용할 수 있음

### 타입 별칭과 인터페이스의 차이

```typescript
interface User {
    name: string;
    age: number;
}

let user: User;

user = {
    name: 'hello',
    age: 20,
}

user = 'helloWorld'; // Error: Type 'string' is not assignable to type 'User'
```

#### 인터페이스와 타입 별칭의 주요 차이점

- 인터페이스는 속성 증가를 위해 병합할 수 있음
- 인터페이스는 클래스가 선언된 구조의 타입을 확인
- 일반적으로 인터페이스에서 타입 검사기가 더 빠르게 동작
  - 객체 리터럴의 동적인 복사 붙여넣기보다 내부적으로 더 쉽게 캐시할 수 있는 명명된 타입을 선언  

- 인터페이스는 이름 없는 객체 리터럴의 별칭이 아닌 명명된 객체로 간주되므로 어려운 특이 케이스에서 나타나는 오류 케이스를 더 쉽게 읽을 수 있음

</br>

### 속성 타입

#### 선택적 속성

```typescript
interface User {
    name: string;
    age?: number;
}

const user: User = {
    name: 'hello',
    age: 20,
}

const missingAgeUser: User = {
    name: 'hello',
}
```

#### 읽기 전용 속성

타입스크립트는 속성 앞에 `readonly` 키워드를 추가해 다른 값으로 설정될 수 없음을 나타냄. (속성을 읽을 수 있지만 재할당 불가)

```typescript
interface User {
    readonly name: string;
}

function readUserName(user: User) {
    console.log(user.name);

    user.name = 'hello'; // Error: Cannot assign to 'name' because it is a read-only property.
}
```
- `readonly` 는 단지 타입스크립트 타입 검사기를 사용해 개발 중 그 속성이 수정되지 못하도록 보호하는 역할

#### 함수와 메서드
- 메서드 구문: 인터페이스 멤버를 `member(): void`와 같이 객체의 멤버로 호출되는 함수로 선언
- 속성 구문: 인터페이스의 멤버를 `member: () => void`와 같이 독립 함수와 동일하게 선언

```typescript
interface User {
    property: () => string;
    method(): string;
    selectProperty?: () => string; // 선택적 속성
}

const user: User = {
    property: () => 'hello',
    method() {
        return 'world';
    }
}
```

- 메서드는 `readonly`로 선언할 수 없지만 속성은 가능
- 인터페이스 병합은 메서드와 속성을 다르게 처리
- 타입에서 수행되는 일부 작업은 메서드와 속성을 다르게 처리
- 현 시점에서 추천하는 스타일 가이드
  - 기본 함수가 `this`를 참조할 수 있다는 것을 알고 있다면 메서드 함수 사용 (가장 일반적으로 클래스의 인스턴스에서 사용)
  - 반대의 경우 속성 함수 사용

#### 호출 시그니처

값을 함수처럼 호출하는 방식에 대한 타입 시스템의 설명  
호출 시그니처가 선언한 방식으로 호출되는 값만 인터페이스에 할당 가능

```typescript
type User = (input: string) => number;

interface CallUser {
    (input: string): number;
}

const user: User = (input) => input.length;

const callUser: CallUser = (input) => input.length;
```

- 호출 시그니처는 사용자 정의 속성을 추가로 갖는 함수를 설명하는데 사용

```typescript
interface User {
    count: number;
    (): void;
}

let user: User;

function userFunction() {
    userFunction.count += 1;
    console.log(`${userFunction.count}`);
}

userFunction.count = 0;

user = userFunction;

function notHaveCount() {
    console.log('not have count');
}

user = notHaveCount; // Error: Property 'count' is missing in type '() => void' but required in type 'User'.
```

#### 인덱스 시그니처

타입스크립트는 인덱스 시그니처를 제공해 인터페이스의 객체가 임으의 키를 받고, 해당 키 아래의 특정 타입을 반환할 수 있음을 나타냄

```typescript
interface User {
    [i: string]: number;
}

const user: User = {};

user.apple = 0;
user.banana = 1;

user.cherry = false; // Error: Type 'boolean' is not assignable to type 'number'.
```

- 인덱스 시그니처는 값을 할당할 때 편리하지만 타입 안정성을 완벽하게 보장하지 않음

```typescript
interface User {
    [i: string]: number;
}

const user: User = {
    getTime: new Date('2024-01-01'),
}

user.getTime; // Date Type
console.log(user.getTime.toString());

user.undefinedKey; // undefined

// 타입 시스템에서는 오류가 나지 않지만 실제 런타임에서는 오류

console.log(user.undefinedKey.toString()); // Runtime Error: Cannot read property 'toString' of undefined (reading user.undefinedKey)
```

- 키/값 한 쌍을 저장하려고 하는데 키를 미리 알 수 없다면 `Map`을 사용하는 것이 안전함

#### 속성 인덱스 시그니처 혼합

인터페이스는 명시적으로 명명된 속성과 포괄적인 용도의 string 인덱스 시그니처를 한번에 포함할 수 있음

```typescript
interface User {
    age: number;
    born: number;
}

const user: User = {
    age: 20,
    born: 2000,
}

const missingAge: User = {
    // Error: Property 'age' is missing in type '{ born: number; }' but required in type 'User'.
    born: 2000,
}

interface NumberValue {
    preface: 0;
    [i: string]: number;
}

const numberValue: NumberValue = {
    preface: 0,
    apple: 1,
    banana: 2,
}

const wrongNumberValue: NumberValue = {
    preface: 1, // Error: Type '1' is not assignable to type '0'.
}
```

#### 숫자 인덱스 시그니처

타입스크립트 인덱스 시그니처는 키로 string 대신 number 타입을 사용할 수 있지만, 명명된 속성은 그 타입을 포괄적인 용도의 string 인덱스 시그니처의 타입으로 할당할 수 있음  

```typescript
interface User {
    [i: number]: string;
    [i: string]: string | undefined;
}

const user: User = {
    0: 'hello',
    1: 'world',
    apple: 'apple',
    banana: undefined,
}

interface MoreNarrowStrings {
    [i: number]: string | undefined; // Error: 'number' index type 'string | undefined' is not assignable to string index type 'string'.
    [i: string]: string; // 타입이 string인 키를 기준으로 인터페이스 속성의 모든 타입을 포괄적으로 정의해야함
}
```

#### 중첩 인터페이스

인터페이스 타입은 자체 인터페이스 타입 혹은 객체 타입을 속성으로 가질 수 있음

```typescript
interface Novel {
    author: {
        name: string;
    };
    setting: Setting;
}

interface Setting {
    place: string;
    year: number;
}

let myNovel: Novel;

myNovel = {
    author: {
        name: 'hello',
    },
    setting: {
        place: 'korea',
        year: 2021,
    }
}

myNovel = {
    author: {
        name: 'hello',
    },
    setting: {
        // Error: Property 'year' is missing in type '{ place: string; }' but required in type 'Setting'.
        place: 'korea',
    }
}
```

</br>

### 인터페이스 확장

타입스크립트는 인터페이스가 다른 인터페이스의 모든 멤버를 복사해서 선언할 수 있는 확장된 인터페이스 사용 가능

```typescript
interface Writing {
    title: string;
}

interface Novella extends Writing {
    pages: number;
}

let myNovella: Novella = {
    pages: 100,
    title: 'hello',
}
```

#### 재정의된 속성

`override` 파생 인터페이스는 다른 타입으로 속성을 다시 선언해 기본 인터페이스의 속성을 재정의

```typescript
interface User {
    name: string | null;
}

interface UserName extends User {
    name: string;
}
```

#### 다중 인터페이스 확장

타입스크립트 인터페이스는 여러 개의 다른 인터페이스를 확장해서 선언 가능

```typescript
interface User {
    getName(): string;
}

interface UserInfo {
    getAge(): number;
}

interface UserDetail extends User, UserInfo {
    getUserInfo(): string;
}
```

- 인터페이스를 확장하는 방식으로 사용하면 코드의 중복을 줄이고 다른 코드 영역에서 객체의 형태를 쉽게 재사용할 수 있음

</br>

### 인터페이스 병합

두 개의 인터페이스가 동일한 이름으로 동일한 스코프에 선언된 경우 타입스크립트는 두 인터페이스를 병합

```typescript
interface User {
    name: string;
}

interface User {
    age: number;
}

// 실제로는 하나의 인터페이스로 병합
// interface User {
//     name: string;
//     age: number
// }
```

- 인터페이스의 병합은 사용하지 않는 것을 권장

#### 이름이 충돌되는 멤버

병합된 인터페이스는 타입이 다른 동일한 이름의 속성을 여러 번 선언할 수 없음

```typescript
interface User {
    getName: (input: string) => string;
    getAge: (input: string) => number;
}

interface User {
    getName: (input: string) => string; 
    getAge: (input: number) => number; //Error: Subsequent variable declarations must have the same type.  Variable 'getAge' must be of type '(input: string) => number', but here has type '(input: number) => number'.
}
```

### 새로 알게된 점

같은 이름으로 같은 스코프 안에 인터페이스를 정의하면 인터페이스가 병합된다는 것은 이번에 처음 알게 되었다.  
그리고 숫자 인덱스 시그니처에서 string 타입으로 선언된 키가 모든 타입을 포괄적으로 포함되어야 한다는 것도 처음 알게 되었다.  
사실 interface 병합이라던지 숫자 인덱스 시그니처, 문자 인덱스 시그니처 같은 경우에는 잘 사용하지 않을 것 같다.  
이런 것이 있다 정도만 알아두자.
 
### 참고
[타입스크립트 핸드북 - 인터페이스](https://www.typescriptlang.org/docs/handbook/interfaces.html)