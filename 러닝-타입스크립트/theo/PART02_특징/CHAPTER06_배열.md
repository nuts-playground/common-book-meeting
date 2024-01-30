# 배열

## 핵심 한 줄 요약

> 타입스크립트의 배열 타입의 경우 특히나 불안정한 타입이므로 주의해서 사용할 필요가 있다.  
> 정해진 길이와 각 요소의 타입 정보를 가지고 있는 튜플을 함수의 인수 전달 및 함수의 반환 값을 이용한 구조 분해 할당에 안전하고 유용하게 활용할 수 있다.

## 배열 타입

배열 타입 역시 앞서 사용했던 일반 타입과 매우 유사한 형태로 활용할 수 있다. 일반타입 뒤에 `[]`를 추가하면 해당 타입의 배열 타입이 된다 일반 배열 뿐만 아니라 다차원 배열의 타입 역시 지원한다.

배열 타입 역시 유니언 타입이 될 수 있으며 유니언 타입의 배열이 될 수 있다. 당연히 함수의 반환 타입으로도 지정할 수 있다.

**일반적인 배열 타입**

```javascript
// 일반 타입과 마찬가지로 초깃값을 할당하면 타입스크립트가 초깃값을 바탕으로 타입을 유추한다.

// string 배열 타입
const names = ["Theo", "Homin", "Apple", "SAMSUNG"];

// number 배열 타입
const priceList = [9000, 27000, 16000];
```

**다차원 배열 타입**

```javascript
// string 2차원 배열 타입
const arrayOfNames: string[][];

// number 2차원 배열 타입
const arrayOfPriceList: number[][];
```

**유니언 타입 배열**

```javascript
// string 또는 string 배열 유니언 타입
const nameOrNames: string | string[];

// string 또는 number 배열 유니언 타입
const nameOrPriceList: string | number[];

// 요소의 타입이 string 또는 number인 배열 타입
const arrayOfNameOrPrice: (string | number)[];
```

**함수의 반환값으로서 배열 타입**

```javascript
// string 배열을 반환하는 함수 타입
let nameDispenser: () => string[];

// string을 반환하는 함수의 배열 타입
let nameDispenserList: (() => string)[];
```

타입스크립트에서의 빈 배열을 초깃값으로 받고 타입 애너테이션이 없는 변수의 경우 타입이 `any[]`타입, 즉 각 요소가 어떠한 값도 할당받을 수 있는 타입이 되어버린다. 이 경우 해당 배열에 요소가 추가될 때마다 타입이 변경되게 되는데 이는 아래 코드처럼 엄청난 타입을 만들어낸다. 이러한 타입은 타입검사를 무효화시킬 수 있으므로 지양하여야 한다.

```javascript
// 변수 value의 타입, any[]
let value = [];
value.push("");
value.push(1);
value.push(false);
value.push(undefined);
value.push(new Date());
value.push(null);
// 변수 value의 타입, (string | number | boolean | Date | null | undefined)[]
```

### 배열의 멤버

배열의 멤버, 즉 각 요소는 배열 타입을 그대로 가져간다.

```javascript
// string[]
const names = ["Theo", "Homin"];

// string
const myName = names[1];
```

> [타입스크립트 깃허브](https://github.com/microsoft/TypeScript)에 5천 개의 이슈가 생성되어 있듯이 타입스크립트도 결국 사람이 만든 것이기 때문에 자체적인 결함 혹은 미비한 부분이 존재한다. 그 중에서도 배열 타입의 경우 특히나 불안정한 요소이기 때문에 주의해야한다.

```javascript
function toLocaleStringLog(elements: number[]) {
    console.log(element[9000].toLocaleString());
}

toLocaleStringLog([100, 200, 300]);
```

위 코드에서 매개변수 `elements`의 타입은 `number[]`이지만 배열의 해당 배열의 길이보다 큰 인덱스를 참조할 경우 `undefined`를 반환하게 된다. 타입스크립트에서는 이러한 개념에 대해 대비가 되어있지 않기 때문에 위 코드를 실행했을 때 `Cannot read properties of undefined` 해당 오류가 나는 것을 사전에 타입 검사를 통해 타입 에러를 미리 제공하지 못한다.

## 스프레드와 나머지 매개변수

스프레드 연산자`...`를 통해 서로 다른 타입의 배열을 합쳐 새로운 배열을 생성할 경우 서로 다른 타입들의 유니언 배열 타입이 해당 배열의 타입으로 지정된다. 또한 앞서 함수에서 살펴봤던 나머지 매개변수처럼 스프레드 연산자를 통해 나머지 매개변수의 타입 역시 지정할 수 있다.

**스프레드 연산자를 통한 배열 Join시 새 배열의 타입**

```javascript
// string[]
const names = ["Theo", "Homin"];

// number[]
const priceList = [1000, 2000];

// (string | number)[]
const arrayOfNameOrPrice = [...names, ...priceList];
```

## 튜플

튜플의 경우 일반 배열타입과 다르게 배열 요소의 갯수와 각 요소의 타입이 지정되어 있어 더욱 구체적인 타입 지정이 가능하다. 이러한 튜플 타입은 구조분해 할당과 함께 자주 쓰인다.  
_react의 useState와 같은 hook들이 모두 이런 식으로 쓰이는구나_

```javascript
// 튜플 타입 지정
// [string, number] 튜플 타입
let nameAndAge: [string, number];
nameAndAge = ["Theo", 27]; // OK

nameAndAge = [27, "Theo"]; // No
// 배열의 각 멤버가 튜플 타입과 다르기 때문에 할당 불가능
```

앞서 초깃값이 주어진 배열은 타입스크립트가 초깃값을 바탕으로 타입을 지정한다고 했다. 이때 초깃값인 배열의 형태가 튜플과 유사하더라도 타입스크립트는 이를 일반 배열 타입 혹은 유니언 타입으로 이해한다.

```javascript
// 위 코드에서 본 nameAndAge와 같은 값이 할당되었지만 아래 변수의 타입은 튜플이 아닌
// (string | number)[], 유니언 타입 배열 타입이다.
const nameAndAge = ["Theo", 27];

const myNameAndAge: [string, number] = nameAndAge; // No
// 배열의 구조가 같더라도 튜플 타입과 유니언 타입 배열 타입은 전혀 다른 타입이므로 서로간에 할당할 수 없다.
```

### const 어서션

타입 애너테이션을 활용하여 타입을 지정하지 않고 `const 어서션`을 활용하여 해당 배열이 튜플 타입이라는 정보를 타입스크립트에게 제공할 수 있다. 아래 코드와 같이 배열 리터럴 뒤에 `as const`가 추가되면 해당 배열은 튜플 타입이며 해당 튜플은 읽기 전용임을 나타낼 수 있다.

```javascript
// 읽기 전용 [string, number] 튜플 타입
const nameAndAge = ["Theo", 27] as const;

nameAndAge[0] = "Homin"; // No
// nameAndAge은 const 어서션을 추가하여 읽기 전용 타입으로 지정되었기 때문에 값 수정이 불가능하다.
```

## 회고

배열은 생각보다 내용이 그렇게 복잡하지 않을 거라고 생각했지만 튜플이라는 개념이 나오면서 의외로 조금 복잡했다. 튜플이라는 개념은 파이썬을 잠깐 공부할 적에 접했던 개념인데 타입스크립트에서는 이것을 타입으로 만들고 활용할 수 있도록 구현했다는 것이 신기했다. 특히 이 튜플같은 경우는 react의 useState와 같은 훅에서 많이 볼 수 있는 구조 분해 할당과 자주 사용된다고 하는데 확실히 유용할 것 같다는 생각이 들었다.

구름 커밋에서 들었던 것처럼 타입스크립트에도 수많은 오류 및 미비한 부분이 있다는 것을 이번 배열 챕터에서 느끼게 되었다.
