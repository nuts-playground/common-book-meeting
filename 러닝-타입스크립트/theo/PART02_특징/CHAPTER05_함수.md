# 함수

## 핵심 한 줄 요약

> 함수의 경우 특별한 경우가 아니라면 애너테이션을 활용하여 함수의 반환 타입을 명시적으로 선언하지 않는 것이 좋다.

## 함수의 매개변수

기본적으로 타입스크립트에서는 함수에 선언된 모든 매개변수가 필수라고 가정한다. 따라서 함수 호출 시 각 매개변수에 해당하는 인수를 전달하지 않거나 필요 이상의 인수를 전달하게 되면 타입 에러를 발생 시킨다.

```javascript
function sayHello(person1: string, person2: string) {
    console.log(`Hello, ${person1}, ${person2}`);
}

sayHello("Theo", "Homin"); // OK
sayHello("Theo"); // NO
sayHello("Theo", "Homin", "Hero"); // NO
```

### 선택적 매개변수

객체 타입에서 봤던 것과 유사하게 `?`를 활용하여 선택적 매개변수를 지정할 수 있다. 이때 선택적 매개변수로 지정된 매개변수의 경우 지정된 타입 + `| undefined`가 유니언으로 추가된다. 기본적으로 자바스크립트에서 인수가 주어지지 않은 매개변수는 `undefined`로 초기화 되기 때문이다.

```javascript
function sayHello(person1: string, person2?: string) {
    console.log(`Hello, ${person1}, ${person2}`);
}

sayHello("Theo", "Homin"); // OK
sayHello("Theo"); // OK
sayHello("Theo", "Homin", "Hero"); // NO
```

선택적 매개변수의 경우 해당 매개변수에 인수가 주어지지 않아도 되지만 다른 `undefined`를 포함하는 유니언 타입의 경우 `undefined`라도 항상 인수가 주어져야 한다는 점이 서로 다르다.

### 기본 매개변수

자바스크립트와 같이 함수의 매개변수에 기본 값을 지정할 수 있다.

```javascript
function sayHello(person1: string, person2 = "Theo") {
    console.log(`Hello, ${person1}, ${person2}`);
}

sayHello("Theo", "Homin"); // OK
sayHello("Theo"); // OK
```

기본값을 지정한 매개변수의 경우 선택적 `type | undefined`가 된다. 이 역시 인수가 주어지 않은 매개변수의 경우 `undefined`로 초기화 된다는 특성 때문이다.

### 나머지 매개변수

임의의 수의 인수로 함수를 호출할 수 있도록 나머지 매개변수에 대한 타입도 지정할 수 있다.

```javascript
function sayHello(...people: string[]) {
    for (const person of people) {
        console.log(`Hello, ${people}`);
    }
}

sayHello("Theo", "Homin", "Hero", "Dex"); // OK
```

### 함수의 반환 타입

일반적으로 함수는 함수 내에서 반환될 수 있는 값을 모두 확인하고 해당 합수의 타입을 파악할 수 있다. 따라서 특별한 경우가 아니라면 애너테이션을 활용하여 함수의 타입을 지정해주지 않는 것이 좋다.

**특별한 경우**

-   가능한 반환값이 많은 함수가 항상 동일한 타입의 값을 반환하도록 강제합니다.
-   타입스크립트는 재귀 함수의 반환 타입을 통해 타입을 유추하는 것을 거부합니다.
-   수백 개 이상의 타입스크립트 파일이 있는 매우 큰 프로젝트에서 타입스크립트 타입 검사 속도를 높일 수 있습니다.  
    _애너테이션을 추가해도 어차피 함수가 반환할 수 있는 값은 다 체크해야하는데 왜 속도가 빠라지지?_

🤔 근데 애너테이션을 붙여서 명시적으로 선언하는 게 코드를 읽고 이해할 때, 즉 가독성 측면에서는 더 좋지 않나? 그리고 특정 함수를 만들겠다고 계획했을 때 미리 반환될 값을 알고 있다면 선언해주는 게 잘못된 타입의 값을 반환할 실수를 방지할 수도 있을텐데

```javascript
// 일반 함수
function numberToString(num: number): string {
    return num.toLocaleString();
}

// 화살표 함수
const numberToString = (num: number): string => num.toLocaleString();
```

### 함수의 타입

자바스크립트에서는 함수 역시 원싯값, 객체 등과 마찬가지로 하나의 **값**이기에 변수에 함수를 할당하거나, 객체의 멤버에 함수를 할당하여 메소드를 만들기 위해 함수에 타입을 지정할 수 있다. 함수의 타입을 지정하는 방법은 화살표 함수와 유사하다.

```javascript
// number 타입 매개변수를 받고 string을 반환하는 함수 타입
let numberToString: (num: number) => string;

// 유니언 타입 역시 지정 가능하다.
let numberOrString: (num: number) => number | string;
```

### void와 never

함수의 경우 반환하는 값이 없는 함수도 존재할 수 있다. 이때 `void` 반환 타입은 이를 나타낼 수 있는 반환 타입이다.

**void**

```javascript
// 반환하는 값 없이 log만 출력하고 있다.
function greeting(): void {
    console.log("Hello how are you?");
}

function shouting(): void {
    console.log("으아아아아아악!!!!!");
    return false; // void는 값 반환을 허용하지 않기 때문에 이 부분에서 타입 에러가 발생한다.
}
```

`never` 타입의 경우 값을 반환하지 않는 `void`와 다르게 반환할 생각이 전혀 없는 타입이다. 일반적으로 오류를 발생시키거나 무한루프를 발생시키는 함수인 경우 해당 타입을 지정한다.

> void는 아무것도 반환하지 않는 함수를 위한 것, naver는 절대 반환하지 않는 함수

🤔 이게 무슨 소리지 함수가 정상적으로 종료되지 않았기에 무언가를 반환하지 못한다는 소리인가

**never**

```javascript
// 함수 실행 도중 에러가 발생하므로 함수가 정상적으로 종료되지 않음 따라서 무언가를 반환할 수 없기에 never
function fail(): never {
    throw new Error("에러가 발생했습니다.");
}
```

## 회고

기존에 타입스크립트를 사용하면서 함수를 값으로 변수 혹은 객체의 멤버에 할당할 때 아래와 같이 작성했다.

```javascript
interface Person {
    sayHello: Function;
}
```

이것과 관련해서 타입 에러가 발생하는 등 문제가 생기지는 않았지만 진짜 자기 멋대로 쓰고 있었다.

저자는 함수의 반환 타입의 경우 일반적으로 애너테이션을 작성하지 않아도 된다고 했는데 이 부분에 대해서 나는 생각이 조금 다르다. 애너테이션으로 명시적으로 반환 타입을 작성해주는 게 함수를 만들 때도, 읽을 때도 더 편하지 않나 하는 생각이 든다.

---

아래는 책에서 나온 타입 에러 번역 본인데 한글로 보니까 에러가 상당히 명확하다. 이전 챕터에서 타입 별칭을 사용해도 타입 에러 메시지가 장황하다고 했던 건 영어라서 그랬던 것 같다. 이렇게 보니 되게 직관적인 에러 메시지다.

1. logsongs: (song: string)=>string은getSongAt: (index: number)=>string에할당되도 록 제공된 타입입니다.
2. Logsong의song매개변수는getSongAt의index매개변수로할당됩니다.
3. song의string타입은index의number타입에할당할수없습니다.

---

함수 오버로드의 경우 해당 개념 자체를 이해하지 못하고 있어서 내용을 이해하는 데 어려움이 있었다.
