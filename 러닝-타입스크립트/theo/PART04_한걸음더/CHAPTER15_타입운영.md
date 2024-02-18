# 타입 운영

## 핵심 한 줄 요약

> 앞에서 배운 개념들을 종합하여 보다 논리적으로 타입을 생성할 수 있다.

## 매핑된 타입

타입스크립트는 다른 타입의 속성을 기반으로 새로운 타입을 생성하는 구문을 제공한다.
매핑된 타입은 다른 타입의 각 속성에 대해 특정 작업을 수행한다.

```javascript
type Animals = "alligator" | "baboon" | "cat";

type AnimalCounts = {
    [K in Animals]: number;
};

// 아래 타입과 같다.
// {
//     alligator: number;
//     baboon: number;
//     cat: number;
// }
```

위 코드에서 타입 별칭 `Animals` 은 `"alligator" | "baboon" | "cat"` 유니언 타입이다. 타입 별칭 `AnimalCounts`를 정의할 때 `in`을 사용하여 `"alligator"`, `"baboon"`, `"cat"`에 대해 `number`타입을 선언했다.

유니언 리터럴을 기반으로 새로운 인터페이스를 만들 때 아주 유용하게 쓸 수 있을 것 같다.

### 타입에서 매핑된 타입

`keyof` 연산자를 사용하여 기존에 존재하는 인터페이스의 key에 대해 새로운 타입을 매핑할 수도 있다.

```javascript
interface AnimalVariants {
    alligator: boolean;
    baboon: number;
    cat: string;
}

type AnimalCounts = {
    [K in keyof AnimalVariants]: number;
};

// 아래 타입과 같다.
// {
//     alligator: number;
//     baboon: number;
//     cat: number;
// }
```

만약 위와 같이 `keyof` 연산자를 통해 특정 인터페이스 키에 매핑한 경우 아래 코드처럼 해당 키에 대한 타입을 참조할 수 있다.

```javascript
interface BirdVariants {
    dove: string;
    eagle: boolean;
}

type NullableBirdVariants = {
    [K in keyof BirdVariants]: BirdVariants[K] | null;
};

// 아래 타입과 같다.
// {
//     dove: string | null;
//     eagle: boolean | null;
// }
```

#### 매핑된 타입과 시그니처

-   `member(): void`: 메서드 구문
-   `member: () => void`: 속성 구문

매핑된 타입의 경우 위 두가지 구문을 구분하지 않고 모두 속성 구문으로 취급한다.

```javascript
interface Researcher {
    researchMethod(): void;
    researchProperty: () => string;
}

type JustProperties<T> = {
    [K in keyof T]: T[K];
};

type ResercherProperties = JustProperties<Researcher>;

// 아래 타입으로 취급한다.
// {
//     researchMethod: () => void;
//     researchProperty: () => string;
// }
```

일반적인 경우에서 타입스크립트 코드에서 메서드와 속성 구문의 차이는 잘 나타나지 않으므로 크게 신경쓰지 않아도 된다.

### 제한자 변경

매핑된 타입의 경우 다른 타입 멤버에 대해 접근 제한자 `readonly`, `?` 등을 변경할 수 있다.

```javascript
interface Environmentalist {
    area: string;
    name: string;
}

type ReadonlyEnvironmentalist = {
    readonly [K in keyof Environmentalist]: Environmentalist[K];
};

// 아래 타입과 같다.
// {
//     readonly area: string;
//     readonly name: string;
// }

type OptionalReadonlyEnvironmentalist = {
    [K in keyof ReadonlyEnvironmentalist]?: ReadonlyEnvironmentalist[K];
};
// 아래 타입과 같다.
// {
//     readonly area?: string | undefined;
//     readonly name?: string | undefined;
// }
```

또는 아래 코드처럼 `-`를 사용하여 기존에 있는 제한자를 제거할 수 있다.

```javascript
interface Conservationist {
    name: string;
    catchphrase?: string;
    readonly born: number;
    readonly died?: number;
}

type WritableConservationist = {
    -readonly [K in keyof Conservationist]: Conservationist[K];
};

// 아리 타입과 같다.
// {
//     name: string;
//     catchphrase?: string | undefined;
//     born: number;
//     died?: number | undefined;
// }

type RequiredWritableConservationist = {
    [K in keyof WritableConservationist]-?: WritableConservationist[K];
};

// 아리 타입과 같다.
// {
//     name: string;
//     catchphrase: string;
//     born: number;
//     died: number;
// }
```

제한자 변경이라기보다는 기존 인터페이스 기반으로 새로운 타입을 선언한다고 보는 게 맞을 것 같다.

### 제네릭 매핑된 타입

매핑된 타입은 제네릭과 결합하였을 때 진정한 힘을 발휘할 수 있다. 타입 매개변수로 특정 타입을 전달 받아 해당 타입의 멤버에 접근할 수 있다.

```javascript
type MakeReadonly<T> = {
    readonly [K in keyof T]: T[K];
};

interface Species {
    genus: string;
    name: string;
}

type readonlySpecies = MakeReadonly<Species>;

// 아래 타입과 같다.
// {
//     readonly genus: string;
//     readonly name: string;
// }
```

위 코드에서는 제네릭 타입 `MakeReadonly<T>`가 타입 매개변수로 받은 타입의 멤버에 접근하여 모두 `readonly`를 적용시킨다. 또는 아래 코드처럼 특정 인터페으를 받아 완천히 채워진 인스턴스를 반환할 수도 있다.

```javascript
interface GenusData {
    family: string;
    name: string;
}

type MakeOptional<T> = {
    [K in keyof T]?: T[K];
};

function createGenusData(overrides?: MakeOptional<GenusData>): GenusData {
    return {
        family: "unknown",
        name: "unknown",
        ...overrides,
    };
}

const person: MakeOptional<GenusData> = {};
const createdPerson = createGenusData(person);

// {
//     family: "unknown",
//     name: "unknown"
// }
```

## 조건부 타입

타입스크립트는 논리적인 조건에 따라 타입을 생성하는 것도 가능하다. 조건부 타입은 삼항 연산자와 비슷한 구문으로 `extends` 키워드를 기준으로 왼쪽 타입이 오른쪽 타입에 할당 가능하지 여부에 따라 타입 할당이 달라지게 된다.

```javascript
type CheckStringAgainstNumber = string extends number ? true : false;
```

위 코드에서는 `string` 타입을 `number` 타입에 할당 가능하지 검사한 후 `true`, `false` 타입을 할당하게 되는데 `string` 타입은 `number` 타입에 할당 불가능하므로 `false` 타입이 할당된다.

### 제네릭 조건부 타입

조건부 타입은 제네릭과 결합하여 특정 타입에 대한 조건에 따라 새로운 타입을 생성할 수도 있다.

```javascript
type CheckAgainstNumber<T> = T extends number ? true : false;

// 타입: false
type CheckString = CheckAgainstNumber<"parakeet">;

// 타입: true
type CheckString = CheckAgainstNumber<1891>;

// 타입: true
type CheckString = CheckAgainstNumber<number>;
```

### 타입 분산

조건부 타입은 유니언에서 분산된다. 즉 타입 매개변수로 들어오는 유니언 타입의 경우 유니언 타입의 각 타입이 조건 검사를 통해 새로운 타입을 생성하고 그렇게 생성된 각 타입이 다시 유니언 타입으로 생성된다.

```javascript
type ArrayifyUnlessString<T> = T extends string ? T : T[];

// 타입: string | number[] | undefined[]
type HalfArrayified = ArrayifyUnlessString<string | number | undefined>;
```

### 매핑된 조건부 타입

매핑된 타입과 조건부 타입, 제네릭을 결합하여 아래와 같은 형태로 사용할 수도 있다.

```javascript
type MakeAllMembersFunctions<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : () => T[K];
};

type MemberFunctions = MakeAllMembersFunctions<{
    alreadyFunction: () => string;
    notYetFunction: number;
}>;

// 아래 타입과 같다.
// {
//     alreadyFunction: () => string;
//     notYetFunction: () => number;
// }
```

위 코드에서 `MakeAllMembersFunctions` 타입은 타입 매개변수로 받은 타입의 멤버에 접근하여 해당 멤버의 타입이 함수가 아니라면 함수 타입으로 바꾼다.

## never

### never와 교차, 유니언 타입

`never`는 `bottom`타입으로 존재할 수 없는 타입이라는 의미를 가지고 있다. 이 `never`가 교차, 유니언 타입과 함께 쓰이면 아래와 같이 작동한다.

```javascript
type NeverIntersection = never & string; // 타입 :never
type NeverUnion = never | string; // 타입 :string
```

-   교차 타입에 있는 `never`는 타입 자체를 `never`로 만든다.
-   유니언 타입에 있는 `never`는 무시된다.

### never와 조건부 타입

앞에서 본 `never`의 특징을 활용하여 조건부 타입에서는 유니언 타입을 필터링 하기 위한 용도로 사용된다.

```javascript
type OnlyStrings<T> = T extends string ? T : never;
type RedOrBlue = OnlyStrings<"red" | "blue" | 0 | false>;
// 타입: "red"| "blue"
```

위 코드에서 유니언 타입을 타입 매개변수로 받아서 그 중에 `string`에 포함되는 타입을 제외한 나머지는 `never` 타입으로 만들어 무시한다.

### never와 매핑된 타입

같은 이유로 never는 매핑된 타입에서 타입 멤버를 필터링할 때도 사용할 수 있다.

```javascript
type OnlyStringProperties<T> = {
    [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

interface AllEventData {
    participants: string[];
    location: string;
    name: string;
    year: number;
}
type OnlyStringEventData = OnlyStringProperties<AllEventData>;
// 타입: "location" | "name"
```

위 코드에서 `OnlyStringProperties<T>` 제네릭 타입은 타입 매개변수를 받아 해당 타입 멤버에 접근하여 멤버의 타입이 `string`인 경우 해당 키를 유니언에 추가하고 아닌 경우 `never`를 추가해 무시되도록 한다.

## 템플릿 리터럴 타입

지금까지는 문자열 관련된 타입은 아래 두 가지였다.

-   원시 string
-   ""와 "abc" 같은 리터럴 타입

템플릿 리터럴 타입이란 문자열이 특정 패턴과 맞는지를 나타내는 구문이다.

```javascript
type Greeting = `Hello${string}`;

const matches: Greeting = "Hello, world!"; // Ok

const outOfOrder: Greeting = "World! Hello!"; // No
```

위 코드에서 `Greeiting` 타입은 템플릿 리터럴 타입으로 문자열 `Hello`로 시작하고 그 이후에는 다른 모든 문자열이 들어올 수 있다. 템플릿 리터럴 타입은 문자열 뿐만이 아니라 `number`가 들어오게 작성할 수도 있다.

```javascript
type ExtolNumber = `much ${number} wow`;
function extol(extolee: ExtolNumber) {
    /* ... */
}

extol("much 0 wow"); // Ok
extol("much -7 wow"); // Ok
extol("much false wow"); // No
```

### 고유 문자열 조작 타입

타입스크립트는 내장된 제네릭 유틸리티 타입을 제공한다.

-   Uppercase: 문자열 리터럴 타입을 대문자로 변환합니다
-   Lowercase: 문자열 리터럴 타입을 소문자로 변환합니다
-   Capitalize: 문자열 리터럴 타입의 첫번째 문자를 대문자로 변환합니다
-   Uncapitalize: 문자열 리터럴 타입의 첫번째 문자를 소문자로 변환합니다

```javascript
type Upper = Uppercase<"hello.">; // 타입: "HELLO."
type Lower = Lowercase<"HELLO.">; // 타입: "hello."
type Capital = Capitalize<"hello.">; // 타입: "Hello."
type Uncapital = Uncapitalize<"HELLO.">; // 타입: "hELLO."
```

### 템플릿 리터럴 키

템플릿 리터럴 타입은 원시 문자열과 리터럴의 중간, 여전히 문자열이므로 문자열 리터럴을 사용할 수 있는 모든 곳에서 사용 가능하다.

```javascript
type DataKey = "location" | "name" | "year";

type ExistenceChecks = {
    [K in `check${Capitalize<DataKey>}`]: () => boolean;
};

// 아래 타입과 같다.
// {
//     checkLocation: () => boolean;
//     checkName: () => boolean;
//     checkYear: () => boolean;
// }
```

위 코드에서는 템플릿 리터럴 타입을 활용하여 `DateKey` 유니언 타입을 기반으로 각 리터럴 타입에 `check`를 추가한 새로운 키를 가진 타입을 생성한다.

## 타입 운영과 복잡성

위와 같은 타입 운영을 사용해야 하는 경우에는 향후 유지보수 용이성을 위하여 최소한으로 사용하고 코드를 이해하기 쉽도록 주석을 잘 달아놓도록 하자.

## 회고

이번 챕터는 보면서 감탄사가 절로 나왔다. 제네릭보다 더욱 논리적으로 타입을 생성할 수 있는 화려한 방법이 있다니! 다만 여럿이서 작업하는 경우 타입 이해를 어렵게 만들 수 있으니 조심해야겠으나 나 혼자 하는 프로젝트에서는 적극적으로 활용해보고 싶다. 멋있으니까.
