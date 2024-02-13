# 선언 파일

## 핵심 한 줄 요약

> 타입스크립트 내에서 사용할 인터페이스 등의 타입을 `.d.ts`에 정의하여 사용할 수 있으며 이를 이용해 타입스크립트로 정의되지 않은 패키지에 타입을 추가할 수 있다.

## 선언 파일

타입스크립트의 선언 파일은  `.d.ts` 확장자를 가지며 해당 파일 내부에서는 런타임 코드를 포함할 수 없다는 점만 제외하고 `.ts` 파일과 유사하게 작동한다. 즉 선언 파일에는 일반적인 타입의 설명(인터페이스, 모듈 등)만 포함 가능하다.

```javascript
// types.d.ts
export interface Person {
    name: string;
    age: number;
}
```

```javascript
// index.ts
import { Person } from "./types";

export const person: Person = {
    name: "Theo",
    age: 27,
}
```

위 코드 `types.d.ts` 에서는 인터페스를 선언하는 코드만 존재할 뿐 런타임 시 동작하는 코드는 존재하지 않는다. 해당 파일에서 인터페이스 `Person`을 정의하고 `index.ts`에서 이를 불러와 사용하였다.


## 런타임 값 선언

선언 파일 내부에서 함수, 변수를 생성할 수 없으나 `declare`키워드를 이용하여 특정 형태의 구조체가 존재한다고 알릴 수 있다. 다만 초깃값을 할당은 허용하지 않는다.

```javascript
// types.d.ts
declare let declared: string;
declare let initalizer: string = "Theo";
// 초깃값 할당은 허용하지 않는다.
```

> 실제로 해보니 초깃값을 할당해도 에러가 발생하지 않는다?

함수 및 클래스도 동일한 형태로 선언할 수 있다. 다만 함수와 메서드의 본문 즉, 런타임 코드는 작성할 수 없다.

```javascript
// types.d.ts
declare function sayHello(name: string): void;

declare function sayNo() {console.log("NO!")};
// 함수 본문은 허용하지 않는다.

class Person {
    sayHello(name: string): void;

    sayNo() {
        console.log("No!");
    }
    // 메서드 본문은 허용하지 않는다.
}
```
> 이것도 직접 해보니까 오류가 발생하지 않는다?

일반적으로 `declare` 키워드는 `.d.ts`파일에서만 사용되지만 특정 변수가 해당 파일에서만 사용되어야 할 때 모듈, 일반 스크립트 파일에서도 사용이 가능하다.


### 전역 변수

`import`, `export` 구문이 없는 타입스크립트 파일의 코드는 전역으로 취급되기 때문에 `.d.ts.` 파일 내에 해당 구문이 없을 경우 타입스크립트 애플리케이션의 모든 파일에서 사용할 수 있는 전역 타입, 변수를 선언할 수 있다.

> 위험하지 않을까?

### 전역 인터페이스 병합

`import`, `export` 구문이 없는 타입스크립트 내의 인터페이스는 전역적으로 확장되기 때문에 동일한 이름의 전역 인터페이스와 병합된다. 따라서 `Window`타입의 전역 변수 `window`에 인터페이스를 추가하여 해당 변수를 사용할 수도 있다.

```html
<script type="text/javascript">
    window.myVersion = "3.1.1";
</script>
```

```javascript
// types/window.d.ts
interface Window {
    myVersion: string;
}
```

```javascript
// index.ts
export function logWindowVersion() {
    console.log(`현재 버전은 ${window.myVersion}입니다.`);
}
```

### 전역 확장

`.d.ts` 파일의 내부의 특정 선언부만을 전역으로 끌어올리고 싶을 때 해당 파일의 모듈 구문을 모두 제거하여 해당 파일 자체를 전역으로 바꿀 필요는 없다. 이때 `declear global` 블록 구문을 사용하여 일부 선언부만을 전역으로 끌어올리는 것이 가능하다.

```javascript
// types.d.ts
// 이 부분은 모듈 컨텍스트
export interface Person {
    name: string;
    age: number;
}

declare global {
    interface GlobalPerson {
        name: string;
        age: number;
    }
    // 이 부분은 전역 컨택스트
}
```

```javascript
// index.ts
const globalPerson: GlobalPerson = {
    name: "Theo",
    age: 27,
}

// Person은 모듈 컨텍스트에서 선언되었기에 에러가 발생한다.
const person: Person = {
    name: "Theo",
    age: 27,
}
```

## 내장된 선언
### 라이브러리 선언

자바스크립트 런타임에 존재하는 `Array`, `Function` 등 전역 객체는 `lib.[target].d.ts`에 선언된다.

```javascript
interface Array<T> {
    // ...
    length: number;
}
```
> 타입스크립트를 지원하는 일부 라이브러리를 사용할 때 타입 에러가 나면 처음 보는 파일 위치를 안내해주던게 이런 이유였구나.

### DOM 선언

타입스크립트는 DOM의 타입 형태도 다룬다. `lib.dom.d.ts` 및 기타 선언 파일에도 저장된다.

> React.reactElement ~~ 이런 타입이 다 이렇게 선언되어 있었던 거구나.

## 모듈 선언

특정 모듈의 상태를 설명할 때 앞서 본 `declear`키워드와 함께 모듈의 내용을 타입 시스템에 알릴 수 있다.

```javascript
// modules.d.ts
declear module "my-module-lib" {
    export const value: string;
}
```

```javascript
// index.ts
import { value } form "my-module-lib";

console.log(value);
```

> React, Next 를 쓰면서 많이 봤던 형태다. 예전에 자바스크립트로 작성된 라이브러리에 타입스크립트를 입히는 작업이 오픈소스 진영에서 활발하게 이루어진다는 내용을 봤었는데 아마 이런 식으로 `.d.ts`파일을 작성하는 거였구나.

### 와일드카드 모듈 선언

자바스크립트 및 타입스크립트에서 확장자가 아닌 특정 파일의 내용을 코드로 가져올 수 있음을 알릴 `*.module.css`등과 같은 형태로 모듈을 정의한다.

```javascript
// styles.d.ts
declear module "*.moudle.css" {
    const styles: { [i: string]: string};
    export declear styles;
}
```

```javascript
// component.ts
import styles form "./styles.module.css";
styles.anyClassName; // 타입: string
```

## 패키지 타입
### 선언

타입스크립트에서 `.ts` 파일 컴파일 시 해당 파일에 대한 `.d.ts`를 자동으로 생성한다.
이와 관련된 내용은 13장에서 자세히...

### 패키지 타입 의존성

### 패키지 타입 노출
특정 라이브러리 등 패키지를 npm등에 배포되고 사용자에게 타입을 제공하려면 `package.json`파일에 `types`필드를 추가하여 해당 루틀를 가리킬 수 있다.

```javascript
{
    "author": "Theo",
    "main": "./lib/index.js",
    "name": "예제",
    "types": "./lib/index.d.ts",
    "verion": "0.0.1",
}
```

## Definitely Typed

타입스크립트로 작성되지 않은 자바스크립트 패키지의 경우 해당 프로젝트에 맞는 정의된 타입 패키지가 따로 필요하다 이때 Definitely Typed, 줄여서 DT에서 수많은 자바스크립트 라이브러리의 타입 패키지를 가져와서 사용할 수 있다.

```javascript
{
    "dependencies": {
        "@types/lodash": "^4.14.182",
        "lodash": "^4.17.21",
    }
}
```

> 일부 라이브러리의 경우 npm으로 해당 패키지를 설치하고 추가로 `@types`도 설치했던 경험이 있는데 이게 DT에서 해당 라이브러리에 맞는 선언 파일을 가져온 것이었다.

### 타입 사용 가능성

만약 사용하고자 하는 패키지에 아직 타입이 없다면 

- DT에 해당 패키지의 `@types`를 만들어달라고 풀리퀘를 작성한다.
- declear module 구문을 사용하여 직접 프로젝트 내에 타입을 작성한다.
- 13장에서 배울 '구성 옵션'에서 `noImplicitAny` 옵션을 비활성화한다.

## 회고

자바스크립트 및 타입스크립트를 더 심도 있게 배워서 나도 `Definitely Typed`에 기여해보고 싶다.