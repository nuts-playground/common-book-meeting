# 객체

## 핵심 한 줄 요약

> 객체 타입의 경우 원시 타입과 유사한 부분도 있으나 훨씬 복잡하고 관련 개념이 많기 때문에 때문에(교차 타입, 객체 타입 유니언, 선택적 속성 등) 오히려 활용제 주의를 해야하고 코드의 및 타입 에러 메시지 가독성을 향상을 위해 타입 별칭 등을 활용하여 작성해야한다.

## 객체 타입 선언

객체 타입 선언은 객체 리터럴과 유사한 형태로, 각 키와 매칭되는 값 대신에 타입을 작성한다.

```javascript
let person: {
    name: string,
    age: number,
};

person = {
    name: "Theo",
    age: 27,
};
```

변수에 위와 같은 객체 타입을 지정한 경우 해당 객체 타입이 갖고 있는 멤버만을 가진 **객체**만 변수에 할당할 수 있다. 위 코드에서는 변수 `person`을 `string`타입 `name`과 `number`타입 `age`멤버를 가진 객체 타입으로 지정했기 때문에 해당 형태의 객체만 할당이 가능하다.

일반적으로 객체 타입의 경우 변수에 매번 직접 선언하는 것이 매우 번거롭고 뿐만 아니라 타입스크립트가 관련 타입 에러를 제공할 때 매우 복잡하기 때문에 일반적으로 타입 별칭을 사용하여 타입을 지정하는 게 일반적이다.

**객체 타입 직접 선언**

```javascript
let person: {
    name: string,
    age: number,
    location: string,
};

person = {
    job: "front-end",
    // Object literal may only specify known properties, and 'job' does not exist in type '{ name: string; age: number; location: string; }'.
};
```

**타입 별칭을 사용한 타입 선언**

```javascript
type Person = {
    name: string,
    age: number,
    location: string,
};

let person: Person;

person = {
    job: "front-end",
    // Object literal may only specify known properties, and 'job' does not exist in type 'Person'.
};
```

**객체에 타입을 지정할 때 타입 별칭인 type 대신에 interface를 사용하는 것이 선호된다. type과 interface는 거의 동일하다.**

## 구조적 타이핑

### 사용 검사

특정 변수에 객체 타입을 지정했다면 해당 변수에 할당되는 객체는 타입으로 지정된 객체 타입의 멤버가 모두 존재해야한다. 예를들어 아래의 코드와 같이 변수 `person`의 타입을 `name`, `age`가 존재하는 `Person`타입으로 지정했다면 `name`, `age`가 모두 존재하는 객체만 해당 변수에 할당할 수 있다. 두 멤버 중에 하나라도 없는 객체라면 할당이 불가능하다.

```javascript
type Person = {
    name: string,
    age: number,
};

const person: Person = {
    name: "Theo",
    age: 27,
};

const notPerson: Person = {
    name: "Theo",
};
// Property 'age' is missing in type '{ name: string; }' but required in type 'Person'
```

### 초과 속성 검사

사용 검사와는 객체 타입으로 지정된 변수에 초깃값에 지정된 타입에 선언되지 않은 멤버가 존재하는 경우 타입 에러가 발생한다.

```javascript
type Person = {
    name: string,
    age: number,
};

const person: Person = {
    name: "Theo",
    age: 27,
    job: "front-end",
};
// Object literal may only specify known properties, and 'job' does not exist in type 'Person'.
```

위 코드에서는 `Person`타입으로 지정된 변수 `person`에는 `Person`타입에는 존재하지 않는 멤버 `job`이 변수 `person`에 초깃값으로 주어졌기 때문에 타입 에러가 발생한다.

이 초과 속성 검사는 변수가 객체 타입으로 지정되는 위치에서 객체 리터럴로 값을 할당받을 때에만 일어나기 때문에 아래의 코드처럼 기존 객체를 할당하는 경우 초과 속성 검사를 우회할 수 있다.

```javascript
type Person = {
    name: string,
    age: number,
};

const person = {
    name: "Theo",
    age: 27,
    job: "front-end",
};

const newPerson: Person = person;
```

### 중첩된 객체 타입

객체의 멤버가 또 다른 멤버를 가지고 있는 객체, 즉 중첩된 객체의 경우 `:{...}` 구문을 사용하여 타입을 표현할 수 있다. 이때 중첨된 타입의 경우 앞서 [객체 타입 선언](#객체-타입-선언)에서 본 것과 마찬가지로 타입 별칭을 활용하여 독립적으로 추출하는 것이 가독성, 에러메시지 해석 측면에서 유리하므로 적극적으로 활용할 수 있어야 한다.

**중첩된 객체 타입 선언**

```javascript
type Person = {
    name: {
        firstName: string,
        lastName: string,
    },
    age: 27,
};
```

**타입 별칭을 활용한 객체 타입 선언**

```javascript
type Name = {
    firstName: string,
    lastName: string,
};
type Person = {
    name: Name,
    age: 27,
};
```

### 선택적 속성

객체의 모든 멤버가 타입으로 지정되어야 하는 것은 아니기 때문에 `?`를 활용하여 특정 멤버가 선택적인 멤버라고 나타낼 수 있다. 즉 있어도 되고 없어도 되는 멤버임을 명시적으로 표현할 수 있는 것이다.

```javascript
type Person = {
    name: string,
    age: number,
    job?: string,
};

const person: Person = {
    name: "Theo",
    age: 27,
};
```

위 코드에서 타입 `Person`은 `job`멤버를 가지고 있지만 해당 멤버는 `?`로 선택적인 멤버임을 나타냈기 때문에 이후에 해당 타입으로 지정된 변수에 `job`멤버가 없는 객체를 할당해도 타입에러가 나지 않는다.

**선택적 속성의 경우 해당 멤버가 존재하지 않아도 되지만 undefined를 포험한 유니언 타입의 경우 해당 멤버의 값이 undefined라도 존재해야한다는 차이가 있다.**

## 객체 타입 유니언

객체 역시 **이거 혹은 저거**가 될 수 있음을 설명하는 유니언 타입이 존재한다. 객체 타입 유니언의 경우 타입스크립트가 주어진 초깃값을 바탕으로 타입을 유추하는 **유추된 객체 타입 유니언**과 개발자가 직접 명시적으로 지정하는 **명시된 객체 타입 유니언**이 있다.

```javascript
// 유추된 객체 타입 유니언
const person =
    Math.random() > 0.5
        ? { name: "Theo", age: 27 }
        : { name: "Theo", job: "front-end" };

// 이거 혹은
// {
//     name: string;
//     age: number;
//     job?: string;
// }
// 저거
// {
//     name: string;
//     job: string;
//     age?: number;
// }
```

```javascript
// 명시된 객체 타입 유니언
type PersonWithAge = {
    name: string,
    age: number,
};

type PersonWithJob = {
    name: string,
    job: string,
};

type Person = PersonWithAge | PersonWithJob;

const person: Person =
    Math.random() > 0.5
        ? { name: "Theo", age: 27 }
        : { name: "Theo", job: "front-end" };

person.job;
// Property 'job' does not exist on type 'Person'. Property 'job' does not exist on type 'PersonWithAge'.
```

위 코드에서 객체의 멤버 `name`은 공통으로 항상 존재하기 때문에 접근하는 것에 문제가 있지만 `age`와 `job`의 경우 객체 타입 유니언으로 인해 `?`을 사용하여 지정한 것과 같이 선택적 멤버가 되었으므로 **있을 수도, 없을 수도**있기 때문에 해당 멤버에 접근할 경우 타입 에러가 발생한다. 이 경우 앞서 살펴봤던 **내로잉**을 적용하여 객체의 타입을 좁혀야 한다.

### 객체 타입 내로잉

객체 타입의 내로잉 역시 앞서 본 리터럴 타입, 원시 타입과 동일하게 조건 검사를 통해 해당 객체의 타입에 대한 정보를 타입스크립트에게 제공하면 해당 조건 블록에서 타입스크립트는 해당 객체의 타입 범위를 좁혀 이해할 수 있게 된다.

```javascript
if ("job" in person) {
    person.job;
} else {
    person.age;
}
```

### 판별된 유니언

객체 타입 내로잉을 수행하는 또 하나의 패턴은 객테의 멤버가 해당 객체의 타입을 가리키는 **판별값**을 보유하고 있는 형태이다.

```javascript
type Employee = {
    name: string,
    job: string,
    type: "employee",
};

type Student = {
    name: string,
    age: number,
    type: "student",
};

type Person = Employee | Student;

const person: Person =
    Math.random() > 0.5
        ? { name: "Theo", age: 27, type: "student" }
        : { name: "Theo", job: "front-end", type: "employee" };

if (person.type === "employee") {
    person.job;
} else {
    person.age;
}
```

객체의 멤버 `type`의 타입이 `"employee" | "student"`으로 멤버의 값이 객체의 타입을 나타내고 있다. 조건 검사를 통해 해당 멤버의 값을 이용하면 이 역시 내로잉이 발생하여 객체의 타입이 좁혀지게 된다. 개체의 타입이 유니언 타입을 갖고 있는 멤버 `type`에 명시적으로 지정되어 있기 때문에 필자의 주장으로 **아름다운 패턴**이며 좋아하는 기능이라고 한다. 이 말에 동의한다.

## 교차 타입

> & 연산자를 활용하여 앞 뒤 객체 타입을 결합한, 즉 각 멤버의 합집합을 가진 새로운 객체 타입을 생성한다.

```javascript
type Student = {
    name: string,
    age: number,
};

type Employee = {
    name: string,
    job: string,
};

type StudentWorker = Student & Employee;

// StudentWorker의 타입은 아래와 같다.
// {
//     name: string,
//     age: number,
//     job: string,
// }
```

교차 타입의 경우 유용한 기능이지만 타입 코드를 더욱 복잡하게 만들어 개발자 혹은 타입스크립트 컴파일러를 혼동시킬 수 있으므로 주의하여 사용해야한다.

### never

원시 값은 동시에 여러 타입을 가질 수 없기 때문에 이를 교차 타입의 구성요소로 활용할 경우 `never`타입이 된다. 해당 타입에는 어떠한 값을 할당할 수도 없고 참조할 수도 없다.

## 회고

교차 타입 챕터에 나온 예제 코드를 읽으면서 교차 타입을 활용한 타입 정의 부분이 바로바로 읽히지가 않았다. 교차 타입으로 인한 타입 에러 메시지 역시 너무 장황했다. "이거 가독성이 너무 떨어지는데?"라고 생각한 순간 바로 다음 장에 교차 타입은 코드를 복잡하게 만들기 쉽고 이는 스스로를 혼동시킬 수 있다는 주의가 적혀있었다. 뿐만 아니라 타입 별칭을 활용하여 장황한 타입 에러 메시지를 더욱 읽기 쉽게 만들 수 있다는 것도 알 수 있었다.`(사실 읽기 쉽게 개선한 에러 메시지도 내 기준에서는 너무 장황했다.)`

타입스크립트를 이해하고 활용하여 코드를 더욱 안전하게 작성하기 위해 도움을 받을 수 있지만 이 역시 **잘** 활용하여야 그 이점을 누릴 수 있지 타입을 더욱 복잡하게 만들거나 제대로 이해하지 못한다면 타입 에러때문에 코드 실행도 못하고 하루 종일 시간낭비만 하고 있을 수도 있겠다 싶었다.
