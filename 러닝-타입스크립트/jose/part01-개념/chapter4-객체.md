## 4. 객체

### 학심 한 줄 요약

    객체 타입 선택적 속성에서 내로잉을 잘 사용하자.

### 4.1 객체 타입

객체 리터럴을 생성하면, 타입스크립트는 해당 속성을 기반으로 새로운 객체 타입 또는 타입 형태를 고려함

```typescript
const foo = {
  born: 1992,
  name: 'hello',
};

foo['born']; // type: number
foo.name; // type: string

foo.end;
// Error: Property 'end' does not exist on type '{ born: number; name: string; }'
```

#### 객체 타입 선언

```typescript
let foo: {
  born: number;
  name: string;
};

foo = {
  born: 1992,
  name: 'hello',
};

foo = 'hello'; // Error: Type 'string' is not assignable to type '{ born: number; name: string; }'
```

#### 별칭 객체 타입

```typescript
type User = {
  born: number;
  name: string;
};

let user: User;

user = {
  born: 1992,
  name: 'hello',
};
```

- 대부분의 객체 타입은 `interface` 키워드를 사용

</br>

### 4.2 구조적 타이핑

타입스크립트 타입 시스템은 `구조적으로 타입화`: 타입을 충족하는 모든 값을 해당 타입의 값으로 사용할 수 있음

```typescript
type FirstName = {
  firstName: string;
};

type LastName = {
  lastName: string;
};

const userName = {
  firstName: 'world',
  lastName: 'hello',
};

// 두 개의 별칭 객체 타입 내에 선언된 변수를 모두 제공 가능
let firstName: FirstName = userName; // ok
let laseName: LastName = userName; // ok
```

- 타입스크립트의 타입 검사기에서 구조적 타이핑은 정적 시스템이 타입을 검사하는 경우
- 덕 타이핑은 런타임에서 사용될 때까지 객체 타입을 검사하지 않음

#### 사용 검사

객체 타입으로 애너테이션된 위치에 값을 할당할 때 타입스크립트는 값을 해당 객체 타입에 할당할 수 있는지 확인

```typescript
type UserName = {
  firstName: string;
  lastName: string;
};

const name: UserName = {
  firstName: 'world',
  lastName: 'hello',
};

// 객체에 필수 속성이 없음
const wrongName: UserName = {
  // Error: Property 'lastName' is missing in type '{ firstName: string; }', but required in type 'UserName'.
  firstName: 'world',
};
```

물론 타입이 일치하지 않아도 에러

```typescript
type TimeRange = {
  start: Date;
};

const stDate: TimeRange = {
  start: new Date('1990-01-01'),
};

const startDate: TimeRange = {
  start: '1990-01-01',
  // Error: Type 'string' is not assignable to type 'Date'.
};
```

#### 초과 속성 검사

초깃값에 객체 타입에서 정의된 것보다 많은 필드가 있다면 타입스크립트 에러

```typescript
type User = {
  born: number;
  name: string;
};

const user: User = {
  born: 1992,
  name: 'hello',
};

const wrongUser: User = {
  address: 'where',
  // Error: Type '{ address: string; born: string; name: string; }' is not assignable to type 'User'. Object literal may only specify known properties, and 'address' does not exist in type 'User'.

  born: 1992,
  name: 'hello',
};
```

#### 중첩된 객체 타입

자바스크립트 객체는 다른 객체의 멤버로 중첩될 수 있으므로 타입스크립트 객체 타입도 타입 시스템에서 중첩된 객체 타입을 나타낼 수 있음

```typescript
type User = {
  name: {
    firstName: string;
    lastName: string;
  };
  age: number;
};

const user: User = {
  user: {
    firstName: 'world',
    lastName: 'hello',
  },
  age: 30,
};

const wrongUser: User = {
  user: {
    name: 'hello world',
    // Error: Type '{ name: string; }' is not assignable to type '{ firstName: string; lastName: string; }'. Object literal may only specify known properties, and 'name' does not exist in type '{ firstName: string; lastName: string; }'
  },
  age: 30,
};
```

중첩 객체 타입을 고유한 타입 이름으로 바꿔서 사용하면 코드와 오류 메세지의 가독성이 좋아짐

```typescript
type Name = {
  firstName: string;
  lastName: string;
};

type User = {
  name: Name;
  age: number;
};

const wrongUser: User = {
  user: {
    name: 'hello world',
    // Error: Type '{ name: string; }' is not assignable to type 'Name'. Object literal may only specify known properties, and 'name' does not exist in type 'Name'
  },
  age: 30,
};
```

#### 선택적 속성

타입속성 애너테이션 : 앞에 ?를 추가하면 선택적 속성 (Optional)

```typescript
type User = {
  name: string | undefined;
  age?: number;
};

const user: User = {
  name: 'hello',
  age: 30,
};

const secondUser: User = {
  name: 'world',
};

// 객체의 필수 멤버 속성의 값이 할당되지 않음
// 필수로 선언된 속성의 타입이 유니언 undefined라도 반드시 존재해야함
const wrongUser: User = {
  // Error: Property 'name' is missing in type '{ name: string; }' but required in tyep User.
  age: 30,
};
```

</br>

### 4.3 객체 타입의 유니언

#### 유추된 객체 타입 유니언

```typescript
const user = Math.random() > 5 ? { name: 'hello', age: 30 } : { name: 'world', born: 1992 };

// 유추된 타입
{
  name: string;
  age: number;
  born?: undefined;
}

{
  name: string;
  born: number;
  age?: undefined;
}
```

#### 명시된 객체 타입 유니언

```typescript
type ageTypeUser = {
  name: string;
  age: number;
};

type bornTypeUser = {
  name: string;
  born: number;
};

type User = ageTypeUser | bornTypeUser;

const user = Math.random() > 5 ? { name: 'hello', age: 30 } : { name: 'world', born: 1992 };

user.name; // ok

// 객체 타입 내로잉 필요
user.age; // Error: Property 'age' does not exist on type 'User'.

user.born; // Error: Property 'born' does not exist on type 'User'.
```

#### 객체 타입 내로잉

타입 스크립트는 if (user.age)와 같은 형식으로 참 여부를 확인하는 것을 허용하지 않음

```typescript
if ('age' in user) {
  user.age;
} else {
  user.born;
}

if (user.age) {
  /* ... */
}
// Error: Property 'age' does not exist on tyep 'ageTypeUser | bornTypeUser'.
```

#### 판별된 유니언

`판별된 유니언`: 자바스크립트와 타입스크립트에서 유니언 타입으로 된 객체의 또 다른 인기 있는 형태는 객체의 속성이 객체의 형태를 나타내도록 하는 것, 객체의 타입이 가리키는 속성이 `판별값`

```typescript
type ageTypeUser = {
  name: string;
  age: number;
  type: 'age';
};

type bornTypeUser = {
  name: string;
  born: number;
  type: 'born';
};

type User = ageTypeUser | bornTypeUser;

const user: User = Math.random() > 5 ? { name: 'hello', age: 30 } : { name: 'world', born: 1992 };

if (user.type === 'age') {
  console.log(user.age);
} else {
  console.log(user.born);
}

user.age; // Error
user.born; // Error
```

</br>

### 교차 타입

타입스크립트에서도 `& 교차타입` 을 사용해 여러 타입을 동시에 나타냄.

```typescript
type Artwork = {
  genre: string;
  age: number;
};

type Writing = {
  pages: number;
  name: string;
};

type WrittenArt = Artwork | Writing;

// 교차 타입은 유니언과 결합 가능
type ShortPoem = { author: string } & ({ kigo: string; type: 'haiku' } | { meter: number; type: 'villanelle' });
```

#### 교차 타입의 위험성

교차 타입을 사용할 때는 가능한 코드를 간결하게 유지

```typescript
type ShortPoemBase = { author: string };
type Haiku = ShortPoemBase & { kigo: string; type: 'haiku' };
type Villanelle = ShortPoemBase & { meter: number; type: 'villanelle' };
type ShortPoem = Haiku | Villanelle;
```

#### `never` 타입

원시 타입의 값은 동시에 여러 타입이 될 수 없기 때문에 교차 타입의 구성 요소와 함께 결합할 수 없음.

```typescript
type NotPossible = number & string; // type: never

let notNumber: NotPossible = 0; // Error: Type 'number' is not assignable to type 'never';
```

</br>

### 새로 알게된 점

원시 타입의 값은 동시에 여러 타입이 될 수 없다는 것은 알고 있었지만, `never` 타입이 있다는 것에 대해 처음 알게 되었다.

### 참고

- [타입스크립트 핸드북 - 객체](https://www.typescriptlang.org/docs/handbook/2/objects.html)
