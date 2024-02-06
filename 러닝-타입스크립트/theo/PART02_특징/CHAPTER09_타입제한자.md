# 타입제한자

## 핵심 한 줄 요약

> 타입 서술어, 타입 어서션, 타입 연산자 등 다양한 개념이 있지만 일반적인 상황에서 대부분 사용하지 않는 것을 추천하니 해당 개념들을 잘 이해하고 꼭 필요한 상황에서만 사용하자

## TOP 타입

4장 객체에서 `never`타입 설명 시 나왔던 가능한 값이 없고, 접근 불가능한 타입 `bottom`의 반대 개념으로 모든 타입의 데이터를 받아들이는 TOP타입으로는 `any`와 `unknown`이 있다. 이때 `any`타입의 경우 타입스크립트의 타입 검사를 비활성화 시키기 때문에 아래와 같은 특징이 있는 훨씬 안전한 `unknown`타입을 사용하길 권장한다.

-   타입스크립트는 unknown 타입 값의 속성에 직접 접근할 수 없다.
-   unknown 타입은 top 타입이 아닌 타입에는 할당할 수 없다.

```javascript
// any 타입
function sayHello(name: any) {
    console.log(`Hello, ${name.toUpperCase()}`);
}

// 타입 검사 시 에러는 발생하지 않지만 런타임 시 에러가 발생한다.
sayHello({ name: "Theo" });

// unknown 타입
function sayHello(name: unknown) {
    if (typeof name === "string") {
        console.log(`Hello, ${name.toUpperCase()}`);
    } else {
        console.log("이름이 없습니다.");
    }
}

// unknown 타입의 경우 직접 접근이 불가능하므로 내로잉을 통해 타입을 구체화 시켜 더욱 안전하게 코드를 작성할 수 있다.
sayHello({ name: "Theo" });
```

## 타입 서술어

위와 같은 방법으로 `typeof`, `instanceof`등의 키워드를 사용하여 타입을 좁힐 수도 있지만 내로잉 관련 로직이 함수로 묶여있는 경우 불가능하다.

```javascript
function isNumberOrString(value: unknown) {
    return ["number", "string"].includes(typeof value);
}

function logValueIfExists(value: number | string | null | undefined) {
    if (isNumberOrString(value)) {
        // 'value' is possibly 'null' or 'undefined'.
        value.toString();
    } else {
        console.log("Value dose not exist:", value);
    }
}
```

위 코드에서 `isNumberOrString`의 반환 값이 `true`라면 우리는 해당 인수의 타입이 `number` 혹은 `string` 이라는 것을 알 수 있지만 타입스크립트는 그저 `boolean` 타입의 값만 반환할 뿐 그 이상의 정보를 알지 못한다. 이처럼 `boolean`을 반환하는 함수를 위해 타입 서술어를 사용하여 인수가 더욱 구체적인 타입을 갖도록 할 수 있다.

하지만 타입 서술어는 잘못 사용하기 쉬우므로 가능하면 피하는 것이 좋다.

```javascript
function isNumberOrString(value: unknown): value is number | string {
    return ["number", "string"].includes(typeof value);
}

function logValueIfExists(value: number | string | null | undefined) {
    if (isNumberOrString(value)) {
        value.toString();
    } else {
        console.log("Value dose not exist:", value);
    }
}
```

## 타입 연산자

### keyof

객체의 `key`를 활용하여 `value`에 접근하는 경우 `인덱스 시그니처`가 선언되어 있다면 문제가 없지만 그렇지 않을 경우 객체의 `key`로 `string`타입의 값을 사용한다면 타입에러가 발생한다.

```javascript
interface Person {
    name: string;
    age: number;
}

function getPersonInfo(person: Person, key: string) {
    // Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'Person'....
    return person[key];
}
```

이때 `keyof` 키워드를 사용하면 인터페이스 멤버의 이름들의 유니언과 동일한 타입을 얻을 수 있다.

```javascript
interface Person {
    name: string;
    age: number;
}

function getPersonInfo(person: Person, key: keyof Person) {
    // key: "name" | "age"
    return person[key];
}
```

### typeof

자바스크립트의 `typeof`와 동일한 이름을 갖고 있을 뿐인 `typeof`는 제공된 값의 타입을 반환한다.

```javascript
const theo = {
    name: "theo",
    age: 27,
};

let testTheo: typeof theo;
// testTheo: {
//     name: string;
//     age: number;
// }
```

위 코드에서 `theo`는 초깃값이 주어졌기에 타입스크립트는 해당 객체의 타입을 이해한다. 이때 `testTheo`에 `typeof` 키워드로 `theo`를 제공할 경우 `theo`의 타입을 `testTheo`에게 선언한다. `theo` 자체가 인터페이스를 대신하여 타입을 나타내는 것이다.

## 타입 어서션

타입스크트는 모든 코드의 타입이 정확하게 알려졌을 경우 가장 잘 작동하는데 현실적으로 모든 코드에 대한 타입을 정확하게 알리는 것이 불가능할 때도 있다. 이때 `as`키워드를 배치하여 타입 어서션을 제공할 수 있다.

```javascript
const rawData = '["theo", "homin"]';

// 타입: any
JSON.parse(rawData);

// 타입: string[]
JSON.parse(rawData) as string[];

// 타입: [string, string]
JSON.parse(rawData) as [string, string];

// 타입: ["theo", "homin"]
JSON.parse(rawData) as ["theo", "homin"];
```

`JSON.parse`는 `string` 타입의 값을 인수로 받아 특정 타입의 값을 반환한다. 이때 반환 타입은 top 타입인 `any`을 반환하게 되는데 타입스크립트가 더 잘 작동하도록 해당 위 처럼 타입 어서션을 사용하여 타입을 전환해줄 수 있다.

이 역시 가능한 사용하지 않는 것이 좋으나 때에 따라 유용하거나 필요한 경우가 있다.

-   포착된 오류 타입 어서션
-   non-null 어서션

## const 어서션

배열 챕터에서 봤던 const 어서션은 모든 값을 상수로 취급해야 함을 나타낼 때 사용한다. 이때 아래와 같은 규칙을 적용한다.

-   배열은 읽기 전용 튜플로 취급된다.
-   리터럴은 원시 타입이 아닌 리터럴로 취급된다.
-   객체의 속성은 읽기 전용으로 간주된다.

### 리터럴에서 원시 타입으로

앞서 말했듯이 const 어서션을 제공할 경우 원시 타입이 아닌 더욱 구체적인 리터럴 타입을 갖게 된다.

```javascript
// 타입: () => string
const getName = () => "Theo";

// 타입: () => "Theo"
const getConstName = () => "Theo" as const;
```

### 읽기 전용 객체

객체 리터럴에 const 어서션을 제공할 경우 해당 객체의 모든 속성들이 readonly, 즉 읽기 전용이 되며 앞서 본 내용과 같이 각 속성의 타입은 초깃값을 기준으로 원시 타입이 아닌 리터럴 타입이 되며 배열의 경우 튜플 타입이 된다.

```javascript
const theo = {
    name: "Theo",
    age: 27,
    subject: ["인공지능", "알고리즘", "선형대수"]
};
// 타입: {
//     name: string;
//     age: number;
//     subject: string[];
// }

const constTheo = {
    name: "Theo",
    age: 27,
} as const;
// 타입: {
//     readonly name: "Theo";
//     readonly age: 27;
//     readonly subject: readonly ["인공지능", "알고리즘", "선형대수"];
// }
```

## 회고

타입스크립트를 알아가면서 그동안 몰랐던 기능에 대해서도 많이 알게 됐지만 그만큼 **있지만 쓰지 말아야 할 기능** 역시 상당히 많다는 것을 이번 챕터에서 더 느꼈다. 이전에 호세의 **타입스크립트를 공부할 수록 기존에 쓰던대로 쓰면 될 것 같다.** 이 말이 확실히 와 닿는 것 같다.
