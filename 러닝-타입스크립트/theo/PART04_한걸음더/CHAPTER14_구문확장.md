# 구문 확장

## 핵심 한 줄 요약

> 클래스 매개변수 속성, 데코레이터, enum, 네임스페이스 모두 현 시점에서는 사용하지 않는 것이 좋다.

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
class MyClass {
    /* ... */
}
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
```

위 코드는 `typeof`와 `keyof`를 사용하여 `StatusCodes` 객체 속성의 값 집합을 유니언 형태로 만들어 `statusCodeValue`에 지정해주었다. 이때 타입스크립트는 타입이 `number`, `string` 리터럴 값을 갖는 객체를 생성하기 위한 `enum` 구문을 제공한다.

```javascript
enum StatusCodes {
    InternalServerError = 500,
    NotFound = 404,
    Ok = 200,
}

statusCodeValue = 200; // Ok
```

위와 같은 형태로 선언된 `enum`은 클래스 이름과 마찬가지로 그 자체가 타입 에너테이션으로 사용될 수 있다.

```javascript
let statusCode: StatusCodes;

statusCode = StatusCodes.Ok;
statusCode = 200;
```

이 열거형은 자바스크립트로 컴파일 시 아래와 같은 코드를 생성한다.

```javascript
var StatusCodes;
(function (StatusCodes) {
    StatusCodes[(StatusCodes["InternalServerError"] = 500)] =
        "InternalServerError";
    StatusCodes[(StatusCodes["NotFound"] = 404)] = "NotFound";
    StatusCodes[(StatusCodes["Ok"] = 200)] = "Ok";
})(StatusCodes || (StatusCodes = {}));
```

열거형 `enum`의 경우 자바스크립트가 아닌 새로운 구문이며 타입스크립트가 자바스크립트 런타임에 영향을 줄 수 있는 코드를 생성하므로 논란의 여지가 있다.

> 타입스크립트 만트라: 자바스크립트에 새로운 런타임 구문 구조를 절대 추가하지 않는다.

### 자동 숫잣값

열거형의 멤버는 초깃값을 가질 필요가 없는데 이때 각 멤버의 값을 0부터 순서대로 1씩 증가시켜 값으로 할당한다.

```javascript
enum VisualTheme {
    Dark,
    Light,
    System,
}
```

위 열거형은 자바스크립트로 컴파일 시 아래와 같은 코드를 생성한다.

```javascript
var VisualTheme;
(function (VisualTheme) {
    VisualTheme[(VisualTheme["Dark"] = 0)] = "Dark";
    VisualTheme[(VisualTheme["Light"] = 1)] = "Light";
    VisualTheme[(VisualTheme["System"] = 2)] = "System";
})(VisualTheme || (VisualTheme = {}));
```

만약 숫자값이 있는 열거형이라면 초깃값이 할당되지 않은 멤버는 이전 멤버보다 1 더 큰 값을 갖게된다.

열거형은 문자열 값을 사용할 수도 있다.

### const 열거형

열거형은 `const` 연산자를 사용하여 런타임 시 열거형 선언 코드가 모두 제거되고 그 대신 주석을 제공한다.

```javascript
// index.ts
const enum DisplayHint {
    Opaque = 0,
    Semitransparent,
    Transparent,
}

const displayHint = DisplayHint.Transparent;
```

```javascript
// index.js
"use strict";
const displayHint = 2; /* Transparent */
```

### 네임스페이스

네임스페이스란 자바스크립트에 모듈 개념이 없을 때 모듈 개념으로 제공했던 해결책이다.

```javascript
namespace Randomized {
    const value = Math.random();
    console.log(`My value is ${value}`);
}
```

위 코드에서 네임스페이스 `Randomized` 내부에서 변수 `value`를 생성하고 사용할 수 있다. 이때 해당 코드는 컴파일 시 아래와 같은 즉시 실행 함수 코드를 생성하므로 네임스페이스 내부 블록은 모두 클로저 내에서 평가된다.

```javascript
"use strict";
var Randomized;
(function (Randomized) {
    const value = Math.random();
    console.log(`My value is ${value}`);
})(Randomized || (Randomized = {}));
```

### 네임스페이스 내보내기

네임스페이스 내부에서 `export` 키워드를 사용하여 네임스페이스 객체의 멤버로 만들어 네임스페이스 외부에서도 네임스페이스를 참조하여 멤버에 접근할 수 있도록 한다.

```javascript
namespace Settings {
    export const name = "My Applicatuon";
    export const version = "1.2.3";
    export function describe() {
        return `${Settings.name} at version ${Settings.version}`;
    }
    console.log("Initializing", describe());
}
console.log("Initializing", Settings.describe());
```

이러한 네임스페이스는 여러 파일에 나누어 작성되어도하나의 네임스페이스 객체로 합쳐지게 된다.

### 중첩된 네임스페이스

네임스페이스 내부에서 네임스페이스를 `export`하거나 `.`을 사용하여 중첩시킬 수 있다.

```javascript
namespace Root.Nested {
    export const value1 = true;
}

namespace Root {
    export namespace Nested {
        export const value2 = true;
    }
}
```

위 두 코드는 동일한 코드로 컴파일 된다.

이러한 네임스페이스 중첩은 규모가 큰 프로젝트에서 각 구역을 자세하게 설명할 수 있는 편리한 방법으로 사용된다.

### 타입 정의에서 네임스페이스

네임스페이스는 특히 DT 타입 정의 시 유용하다.
`export as namespace` 뒤에 모듈의 전역 이름을 포함하여 해당 모듈을 전역으로 사용할 수 있음을 나타낼 수 있다.

```javascript
// node_modules/@types/my-example-lib/index.d.ts
export const value: number;
export as namespace libExample;
```

```javascript
// src/index.ts
import * as libExample from "my-example-lib";
const value = window.libExample.value;
```

> 타입스크립트 사용시 제이쿼리 `$`, 언더스코어JS `_` 등의 모듈을 사용할 경우 DT 정의 시 해당 모듈을 현재 타입스크립트 프로젝트 내에서 전역으로 사용할 수 있다는 뜻이다.

### 네임스페이스보다 모듈을 선호함

네임스페이스를 사용하는 것보다 ECMA 스크립트 모듈 `export`, `import`를 사용하는 것이 더 좋다. 기존에 네임스페이스로 작성된 타입스크립트 조차 이미 22년 11월에 모듈로 마이그레이션 되었다!

## 타입 전용 가져오기와 내보내기

`export` 구문으로 타입을 가져올 때 해당 런타임에서 사용되지 않는 타입 코드는 자바스크립트로 컴파일 시 모두 제거된다. 또는 아래와 같이 `import` 구문 뒤에 `type` 제한자를 추가하여 해당 모듈이 타입 시스템에서만 사용되는 것이라는 것을 명시적으로 나타낼 수 있다.

```javascript
// index.ts
import { type TypeOne, value } from "my-example-types";
import type { TypeTwo } from "my-example-types";
import type DefaultType from "my-example-types";
```

당연히 타입으로 가져온 모듈은 런타임에서 사용할 수 없다.

## 회고

타입 전용 가져오기의 겨우 해당 모듈이 타입으로만 사용된다는 것을 명확하게 하기 위하여 사용한다고 했는데 사실 그냥 `import` 하더라도 동일한 동작을 하며 만에 하나 타입을 함수처럼 호출한다던가 변수처럼 사용하는 실수를 한다 하더라도 어차피 타입스크립트가 알아서 에러 메시지를 제공할텐데 그 명확함이 의미가 있나 싶다.

타입스크립트에는 사용하지 않는 것을 선호하는 기능들이 참 많다.
