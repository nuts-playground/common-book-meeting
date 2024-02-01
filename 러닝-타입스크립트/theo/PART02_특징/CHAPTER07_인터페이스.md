# 인터페이스

## 핵심 한 줄 요약

> 객체의 형태를 설명하는 인터페이스는 타입 별칭과 매우 닮았다. 하지만 일반적인 상황에서 타입 별칭에 비해 더 읽기 쉬운 에러 메시지, 더 빠른 컴파일 성능, 클래스와의 상호 운용성 및 병합, 확장의 기능이 있으니 잘 이해하고 활용하여야 한다.

## 인터페이스 구문

인터페이스 구문은 타입 별칭 구문과 매우 유사하다.

```javascript
// 타입 별칭 구문
type Person = {
    name: string,
    age: number,
};

// 인터페이스 구문
interface Person {
    name: string;
    age: string;
}
```

매우 유사한 이 두 구문에는 아래와 같은 주요 차이점이 있다.

-   인터페이스는 속성 증가를 위한 **병합** 기능을 활용할 수 있다.
-   인터페이스는 클래스가 선언된 구조 타입을 확인하는 데 사용할 수 있다.
-   인터페이스는 일부 특수한 경우에 나타나는 에러 메시지를 쉽게 읽을 수 있게 해준다.

위의 차이점이 때문에 타입 별칭보다는 인터페이스를 사용하는 것을 선호한다.

**주의**  
아래와 같은 유니언 타입 작성 시 인터페이스 구문으로는 표현이 불가능하므로 이때는 타입 별칭을 활용하면 표현할 수 있다.

```javascript
interface Student {
    name: string;
    age: number;
}

interface Employee {
    name: string;
    job: string;
}

type Person = Student | Employee;
```

## 속성 타입

인터페이스는 타입 별칭에서도 봤던 **선택적 속성**을 포함한 `readonly`, 함수, 메서드, 호출 시그니처, 인덱스 시그니처 등 다양한 속성 타입을 제공한다.

```javascript
// 선택적 속성
// 타입 애너테이션 앞에 ?를 추가하여 해당 속성이 선택적임을 나타낸다.
interface Person {
    name: string;
    age: number;
    job?: string;
}

// 읽기 전용 속성
// 속성 이름 앞에 readonly를 추가해 해당 속성은 읽기만 가능하며 다른 값으로 수정될 수 없음을 나타낸다.
interface Person {
    name: string;
    age: number;
    readonly sex: "남자" | "여자";
}

// 함수와 메서드
// 메서드 구문: member(): void;
// 속성 구문: member: () => void;
interface Person {
    work: () => number;
    workout(): number;
}

// 타입 별칭과 마찬가지로 중첩 형태도 표현 가능하다.
interface Person {
    name: string;
    age: number;
    job: {
        name: string;
        location: string;
    };
}
```

메서드 구문과 속성의 차이점은 아래와 같다.

-   메서드 구문은 `readonly` 로 선언이 가능하다.
-   인터페이스 병합 시 서로 다르게 처리된다.
-   타입에서 수행되는 일부 작업의 경우 서로 다르게 처리된다.

다만 일반적인 상황에서 둘을 혼용해서 사용하더라도 코드에 거의 영향을 주지 않는다.

### 호출 시그니처

~~호출 시그니처란 앞서 본 메서드, 속성 구문처럼 역시 함수에 대한 타입을 지정해주는 방법 중 하나이다. 기존 메서드, 속성 구문의 경우 함수, 즉 메서드의 이름과 해당 메서드가 반환하는 타입만을 지정해주었다면 호출 시그니처의 경우 할당 가능한 매개변수와 반환 타입을 구체적으로 지정할 수 있다. 요약하자면 아래와 같다.> 메서드 이름이 뭔지는 모르겠는데 어쨌든 나는 **이 타입**을 인수로 받아서 **저 타입**을 반환하는 메서드가 있어야 해~~  
아니구나.

이는 함수의 타입을 지정하는 방법 중 하나로 어떤 타입의 값을 매개변수로 받고 어떤 타입의 값을 반환하는지 구체적인 정보를 가진 함수의 형태를 나타낸다.

```javascript
// string을 받아서 string을 반환하는 함수의 형태를 나타낸다.
interface Speak {
    (word: string): string;
}

// 따라서 아래와 같은 형식의 함수만 할당이 가능하다.
const sayWord: Speak = (word) => `I say ${word}`;

// 이때 사용자 정의 속성을 추가로 갖는 함수를 설명할 수도 있다.
// 아래 인터페이스는 매개변수가 없고 반환값이 없는, count를 멤버로 가진 함수를 설명한다.
interface Counter {
    count: number;
    (): void;
}

function counterWithCount() {
    counterWithCount.count++;
}
counterWithCount.count = 0;
const counter: Counter = counterWithCount;
```

### 인덱스 시그니처

인덱스 시그니처란 객체의 `key:value` 쌍 중 임의의 `string` `key`에 특정 타입의 값을 저장하기 위한 객체의 형태를 설명한다.

```javascript
interface PhoneNumbers {
    [name: string]: string;
}

const phoneNumbers: PhoneNumbers = {};
phoneNumbers.theo = "010-1234-1234";
phoneNumbers.homin = "010-1234-1234";
```

위와 같은 형태의 경우 해당 객체의 어느 멤버에 접근을 하든 특정한 타입의 값을 반환해야 함을 나태내고 있다.

이러한 인덱스 시그니처의 경우 해당 객체의 모든 멤버가 특정 타입을 반환한다고 가정하고 있기 때문에 해당 객체에 존재하지 않는 멤버에 접근을 시도하는 경우에도 에러로 감지하지 못한다.

따라서 이후 타입 제한자에서 배울 Map을 사용하는 것이 더 안전하다.

## 인터페이스 확장

인터페이스는 `extends`키워드를 사용하여 다른 인터페이스가 갖고 있는 모든 멤버를 가지면서 추가적인 멤버를 갖는 인터페이스의 형태도 표현할 수 있다.

```javascript
interface Person {
    name: string;
    age: number;
}

// Student 인터페이스는 Person이 갖고 있는 name, age를 포함하여 major도 추가로 갖고 있다.
interface Student extends Person {
    major: string;
}
// 즉 Student의 형태는 아래와 같다.
// {
//     name: string;
//     age: number;
//     major: string;
// }
```

### 재정의된 속성

인터페이스는 기존 인터페이스의 멤버를 재정의할 수 있다. 이때 새롭게 정의되는 멤버의 타입이 기존 멤버 타입에 할당 가능하도록 강제한다. 따라서 유니언 타입에서 더욱 구체적인 타입으로 재정의할 때 주로 사용한다.

```javascript
interface Person {
    name: string | null;
}

// Person의 name은 string | null 타입이었으나 Homin에서 이를 string으로 재정의 하였다. 타입이 좁혀졌다.
interface Homin extends person {
    name: string;
}
```

### 다중 인터페이스 확장

앞에서 `extends`키워드를 사용하여 기존 인테페이스를 확장할 수 있었는데 이때 기존 인터페이스 여러 개를 함께 받아 확장시킬 수도 있다.

```javascript
interface Student {
    major: string;
}

interface Employee {
    job: string;
}

// Student의 major, Employee의 job을 포함하여 age가 추가된, 확장된 인터페이스를 나타낼 수 있다.
interface Person extends Student, Employee {
    age: number;
}
```

## 인터페이스 병합

동일한 이름의 인터페이스가 동일한 스코프에 존재할 경우 해당 인터페이스들이 병합되어 서로의 멤버를 공유하게 되는 인터페이스 병합이 일어나게 된다.

> 🤔 이건 에러가 나도록 처리했어야 하는 거 아니었을까. 외부 인터페이스 혹은 전역 인터페이스를 보강할 때 사용한다고 하더라도 일반적인 상황에서는 의도치 않은 결과를 만들어낼 수도 있을 것 같은데. 병합 관련된 키워드를 하나 만드는 게 나을 것 같다. → 그게 extends 키워드잖아? 물론 확장이랑 병합이랑 개념이 조금 다르긴 하지만 결국 같은 결과를 얻을 수 있게 동작하지 않나?

```javascript
interface Person {
    name: string;
}

interface Person {
    age: number;
}

// Person {
//     name: string;
//     age: number;
// }
```

당연히 저자 역시 일반적으로 사용하지 않는 것이 좋다고 설명하고 있다.

## 회고

인덱스 시그니처의 경우 사이드 프로젝트 `theo playground`를 진행하면서 `users`객체에 접속한 플레이어의 정보를 담기 위해 아래와 같은 형태로 구성하면서 이미 접했던 개념이여서 쉽게 이해할 수 있었다.

```javascript
interface Player {
    id: string;
    name: string;
    // ...
}

interface Users {
    [id: string]: Player;
}
```

근데 호출 시그니처는 아직도 긴가민가하다. 결국 함수도 `Function` 객체이니까 해당 형태를 나타내기 위한 표현 방법이라고 생각하면 될 것같다.

앞서 본 내용들 모두 그렇지만 특히 인터페이스 챕터는 내가 자주 쓰고 있으면서도 모르는 기능들이 여럿 있었다. 특히 그 중에 `extends` 키워드를 활용한 인터페이스 확장은 바로 적용해봐도 좋을 것 같다.
