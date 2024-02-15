# 구문 확장

## 핵심 한 줄 요약

> ...

## 클래스 매개변수 속성

자바스크립트 클래스에서는 생성자 매개변수를 즉시 클래스 속성에 할당하는 것이 일반적이다.

```javascript
class Person {
    readonly name: string;

    constructor(name: string) {
        this.name = name;
    }
}

new Person("Theo").name;
```

이때 타입스크립트는 매개변수 속성을 선언하기 위한 단축 구문을 제공한다. 매개변수 앞에 제한자 `readonly`, `public`, `protected`, `private`를 배치하면 해당 매개변수가 클래스의 속성으로 선언된다.

```javascript
class Person {
    readonly name: string;

    constructor(readonly name: string) {}
}

new Person("Theo").name;
```

클래스 생성을 선호하는 프로젝트에서는 일부 유용할 수 있으나 런타임 구문 확장의 단점으로 인한 어려움 때문에 대부분의 프로젝트에서는 **완전히** 사용하지 않는 것을 선호한다.

## 실험적인 데코레이터

다른 클래스를 포함하는 프로그래밍 언어와 마찬가지로 타입스크립트에서도 클래스와 클래스 멤버를 수정하ㅣ 위한 데코레이터를 활용할 수 있다.

```javascript
@myDecorator
class MyClass {/* ... */}
```

그러나 타입스크립트는 이를 기본적으로 지원하지 않으며 데코레이터의 실험적인 버전을 사용할 수 있도록 컴파일러 옵션을 제공한다.

```javascript
{
    "compilerOptions": {
        "experimentalDecorators": true
    }
}
```

## 열거형

대부분의 프로그래밍 언어에서는 연관된 값 집합을 나타내는 enum 또는 열거형 타입 개념을 포함한다. 하지만 자바스크립트에서는 이를 포함하지 않으므로 객체를 사용하여 해당 값을 표현한다.

```javascript
const StatusCodes = {
    InternalServerError: 500,
    NotFound: 404,
    Ok: 200,
} as const;

StatusCodes.InternalServerError;
```

이때 생길 수 있는 문제는 각 키에 매칭되는 값들이 해당 객체의 값 중 하나여야 함을 나타내려면 "타입 제한자"의 `keyof`, `typeof`를 사용하여야 하는데 이는 많은 구문을 추가하게 된다.

```javascript
// 타입 200 | 404 | 500
type StatusCodeValue = (typeof StatusCodes)[keyof typeof StatusCodes];

let statusCodeValue: StatusCodeValue;

statusCodeValue = 200; // Ok

statusCodeValue = -1; // No
```

위 코드는 `typeof`와 `keyof`를 사용하여 `StatusCodes` 객체 속성의 값 집합을 유니언 형태로 만들어 `statusCodeValue`에 지정해주었다.



## 회고

...