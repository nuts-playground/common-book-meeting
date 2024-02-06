## 9. 타입 제한자    

</br>

### 학심 한 줄 요약

    타입 제한자는 타입스크립트에서 값의 타입을 제한하는 여러가지 방법을 제공하지만, 어서션 같은 경우에는 사용성에 대해 많은 주의가 필요하다.

</br></br>

### top 타입

top 타입은 시스템에서 가능한 모든 값을 나타내는 타입  
모든 다른 타입의 값은 타입이 top인 위치에 제공될 수 있음

- `top 타입`: 모든 가능한 타입을 포함하는 타입
- `bottom 타입`: 어떤 값도 가질 수 없는 타입

</br>

#### any 다시 보기

any 타입은 모든 타입의 위치에 제공될 수 있다는 점에서 top 타처럼 작동할 수 있음

```typescript

let anyValue: any;
anyValue = "Lucille Ball";
anyValue = 123;

console.log(anyValue);
```

- any는 타입스크립트가 해당 값에 대한 할당 가능성 또는 멤버에 대해 타입 검사를 수행하지 않도록 명시적으로 지시한다는 문제점이 있음

```typescript
function greetComedian(name: any) {
    // 타입 오류 없음
    console.log(`Hello, ${name.toUpperCase()}`);
}

greetComedian({ name: 'hello world' });

// Runtime Error: name.toUpperCase is not a function
```

- `name`이 `any`로 선언되었기 때문에 타입스크립트는 타입 오류를 보고하지 않음
- 어떤 값이든 될 수 있음을 나타내려면 `unknown`타입이 훨씬 안전함

</br>

#### unknown

`unknown` 타입과 `any` 타입의 주요 차이점으로는 타입스크립트는 `unknown` 타입의 값을 훨씬 더 제한적으로 취급

- 타입스크립트는 `unknown` 타입 값의 속성에 직접 접근할 수 없음
- `unknown` 타입은 `top` 타입이 아닌 타입에는 할당할 수 없음

```typescript
function greetComedian(name: unknown) {
    console.log(`hello, ${name.toUpperCase()}`);
    // Error: Object is of type 'unknown'.
}
```

타입스크립트가 unknown 타입인 name에 접근할 수 있는 유일한 방법은 `instanceof`나 `typeof` 또는 타입 어서션을 사용하는 것처럼 값의 타입이 제한된 경우

```typescript
function greetComedianSafety(name: unknown) {
    if (typeof name === 'string') {
        console.log(`hello, ${name.toUpperCase()}`);
    } else {
        console.log('wrong');
    }
}

greetComedianSafety('hello World!!');
greetComedianSafety({});

class Foo {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}

function checkFoo(name: unknown) {
    if (name instanceof Foo) {
        console.log(name);
    } else {
        console.log('wrong');
    }
}

checkFoo(new Foo('hello'));
checkFoo('hello');
```

</br></br>

### 타입 서술어

타입 서술어는 일반적으로 매개변수로 전달된 인수가 매겨변수의 타입보다 더 구체적인 타입인지에 대한 여부

```typescript
function isNumberOrString(value: unknown): value is number | string {
    return ['number', 'string'].includes(typeof value);
}

function logValueIfExists(value: number | string | null | undefined) {
    if (isNumberOrString(value)) {
        value.toString();
    } else {
        console.log('value is not a number or string');
    }
}
```

</br>

타입 서술어는 이미 한 인터페이스의 인스턴스로 알려진 객체가 더 구체적인 인터페이스의 인스턴스인지 여부를 검사하는데 사용

```typescript
interface Comedian {
    funny: boolean;
}

interface StandupComedian extends Comedian {
    routine: string;
}

function isStandupComedian(value: Comedian): value is StandupComedian {
    return 'routine' in value;
}

function workWithComedian(value: Comedian) {
    if (isStandupComedian(value)) {
        console.log(value.routine);
    }

    console.log(value.routine); // Error: Condian 타입이기 때문
}
```

</br></br>

### 타입 연산자

기존 타입의 속성 일부를 변환해서 두 타입을 결합하여 새로운 타입을 생성

</br>

#### `keyof`

타입스크립트는 기존에 존재하는 타입을 사용하고, 해당 타입에 허용되는 모든 키의 조합을 반환하는 `keyof` 연산자를 제공

```typescript
interface Ratings {
    audience: number;
    critic: number;
}

function getCountKeyof(ratings: Ratingd, key: keyof Ratings) {
    return ratings[key];
}

const ratings: Ratings = { audience: 66, critic: 84 };

getCountKeyof(ratings, 'audience');
getCountKeyof(ratings, 'any'); // Error
```

- `keyof`는 존재하는 타입의 키를 바탕으로 유니언 타입을 생성

</br>

#### `typeof`

제공되는 값의 타입을 반환  
값의 타입을 수동으로 작성할 때 유용하게 쓰임

```typescript
const original = {
    foo: 'foo',
    bar: 'bar',
}

let foo: typeof original;

if (Math.random() > 5) {
    foo = { ...original, 'foo': 'hello' };
} else {
    foo = { ...original, 'foo': 1 }; // Error: 타입 에러
}
```

</br>

#### `keyof`와 `typeof`

`keyof`: 캆의 타입을 검색  
`typeof`: 타입에 허용된 키를 검색  

두 키워드를 함께 연결해 값의 타입에 허용된 키를 간결하게 검색할 수 있음

```typescript
const ratings = {
    foo: 8.4,
    bar: 10.1,
}

function logRating(key: keyof typeof ratings) {
    console.log(ratings[key]);
}

logRating('foo');

logRating('any'); // Typescript Error: 존재하지 않는 키
```

</br></br>

### 타입 어서션

값의 타입에 대한 타입 시스템의 이해를 재정의하기 위함  
다른 타입을 의하는 값의 타입 다음에 `as` 키워드 사용

```typescript
const testData = '["hello", "world"]';

// Type: any
JSON.parse(testData);

// Type: string[]
JSON.parse(testData) as string[];

// Type: [string, string]
JSON.parse(testData) as [string, string];

// Type: ['hello', 'world']
JSON.parse(testData) as ['hello', 'world'];
```

</br>

#### 포착된 오류 타입 어서션

코드 영역이 Error 클래스의 인스턴스를 발생시킬 거라 확신한다면 타입 어서션을 사용해 포착된 어서션을 오류로 처리할 수 있음

```typescript
try {
    // Error 발생
} catch(error) {
    throw new Error('Error: ' + (error as Error).message);
}
```

</br>

발생된 오류가 예상된 오류 타입인지 확인하기 위해 `instanceof` 검사와 같은 타입 내로잉을 사용하는 것이 안전

```typescript
try {
    // Error 발생
} catch(error) {
    throw new Error('Error: ' + error instanceof Error ? error.message : error);
}
```

</br>

#### `non-null` 어서션

이론적으로만 `null` 또는 `undefined`를 포함할 수 있는 변수에서 `null`과 `undefined`를 제거할 때 타입 어서션을 사용

```typescript
// Type: Date | undefined이라 유추
let maybeDate = Math.random() > 5 ? undefined : new Date();


// Type: Date이라 간주
maybeDate as Date;

// Type: Date이라 간주
maybeDate!;


// Type: Map<string, number>
const seasonCounts = new Map([
    ['winter', 0],
    ['spring', 0],
    ['summer', 0],
    ['fall', 0],
]);

// Type: string | undefined
const maybeValue = seasonCounts.get('winter');
console.log(maybeValue.toUpperCase()); // Error: maybeValue가 undefined일 수 있음

// Type: string
const maybeValue = seasonCounts.get('winter')!;
console.log(maybeValue.toUpperCase());
```

</br>

#### 타입 어서션 주의 사항

- `any` 타입을 사용할 때 처럼 꼭 필요한 경우가 아니라면 가능한 한 사용하지 않은 것이 좋음
- 값의 타입에 대해 어셔선하는 것보다 코드를 나타내는 더 정확한 타입을 갖는 것이 좋음

```typescript
const seasonCounts = new Map([
    ['winter', 0],
    ['spring', 0],
    ['summer', 0],
    ['fall', 0],
]);

// Type: string
const knownValue = seasonCounts.get('winter')!;

console.log(knownValue.toUpperCase()); // RuntimeError: knownValue가 undefined일 수 있음
```

</br>

#### 어서션 vs 선언

`변수의 타입 애너테이션과 초깃값이 있을 때`: 타입스크립트의 타입 검사기는 변수의 타입 애너테이션에 대한 변수의 초깃값에 대한 할당 가능성 검사 수행  
`타입 어서션`: 타입스크립트에 타입 검사 중 일부를 건너뛰도록 명시적으로 지시

```typescript
interface Foo {
    name: string;
    acts: string[];
}

const declared: Foo = {
    name: 'hello', // Error: acts 속성이 없음
}

const asserted = {
    name: 'hello',
} as Foo; // 허용되지만 런타임 시 오류 발생
```

- `타입 애너테이션을 사용하거나 타입스크립트가 초깃값에서 변수의 타입을 유추하도록 하는 것이 좋음`

</br>

#### 어서션 할당 가능성

하나의 타입에서 값을 완전히 관련 없는 타입으로 전환해야 하는 경우 이중 타입 어서션을 사용

```typescript
let myValueDouble = '1992' as unknown as number; // 허용은 되지만 사용하면 안 됨
```

</br></br>

### `const` 어서션

`const` 어서션은 배열, 원시 타입, 값, 별칭 등 모든 값을 상수로 취급해야 함을 나타내는 데 사용함

- 배열은 가변 배열이 아니라 읽기 전용 튜플로 취급
- 리터럴은 일반적인 원시타입과 동등하지 않고 리터럴로 취급
- 객체의 속성은 읽기 전용으로 간주

</br>

#### 리터럴에서 원시타입으로

타입 시스템이 리터럴 값을 일반적인 원시타입으로 확장하기보다 특정 리터럴로 이해하는 것이 유용할 수 있음

```typescript
// return type: string
const getName = () => 'hello';

// return type: 'hello'
const getNameConst = () => 'hello' as const;
```

</br>

값의 특정 필드가 더 구체적인 리터럴 값을 갖도록 하는 것도 유용

```typescript
interface Joke {
    quote: string;
    style: 'story' | 'one-liner';
}

function tellJoke(joke: Joke) {
    if (joke.style === 'one-liner') {
        console.log(joke.quote);
    } else {
        console.log(joke.quote.split('\n'));
    }
}

const narrowJoke = {
    quote: 'hello',
    style: 'one-liner' as const,
}

tellJoke(narrowJoke);

const wideObject = {
    quote: 'hello',
    style: 'one-liner',
}

tellJoke(wideObject); // Error: 타입 에러, style이 'one-liner' 타입이 아님
```

</br>

#### 읽기 전용 객체

`as const를 사용해 값 리터럴을 어서션하면 유추된 타입이 가능한 한 구체적으로 전환됨.  
모든 속성은 `readonly`가 되고, 리터럴은 일반적인 원시 타입 대신 고유한 리터럴 타입으로 취급됨.  
배열은 읽기 전용 튜플로 취급됨

```typescript
function foo(preference: 'maybe' | 'no' | 'yes') {
    switch(preference) {
        case 'maybe':
            console.log('maybe');
            break;
        case 'no':
            console.log('no');
            break;
        case 'yes':
            console.log('yes');
            break;
    }
}

const preferencesMutable = {
    movie: 'maybe',
    standup: 'yes',
}

foo(preferencesMutable.movie); // Error: 타입 에러, preferencesMutable.movie가 string 타입이기 때문

const preferences = {
    movie: 'maybe',
    standup: 'yes',
} as const;

foo(preferences.movie);

preferences.movie = 'no'; // Error: 읽기 전용 속성이기 때문
```

</br></br>

### 새로 알게된 점

타입 제한자 같은 경우에는 아직 많이 생소하다. 타입 애너테이션으로 명시적 타입을 지정하고, 타입 어서션 같은 경우에는 사용할 때 주의하도록 하자.

### 참고

[타입스크립트 핸드북 - More on Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions)