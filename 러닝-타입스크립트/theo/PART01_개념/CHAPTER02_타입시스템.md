# 타입시스템

## 핵심 한 줄 요약

> 타입스크립트는 초깃값을 갖는 변수의 타입을 유추하거나 개발자가 타입 애너테이션`Type annotation`을 사용하여 명시한 타입을 기준으로 함수 호출, 변수에 값 할당이 가능 여부를 파악한다. `할당 가능성`

## 타입스크립트의 기본적인 타입

-   null
-   undefined
-   boolean
-   string
-   number
-   bigint
-   symbol

타입스크립트의 기본적인 타입은 위 자바스크립트의 일곱가지 원시타입과 동일하다.

### 타입스크립트는 어떻게 타입을 이해하는가

프로그래밍 언어가 프로그램에서 가질 수 있는 타입을 이해하는 방법에 대한 규칙 집합을 `타입 시스템`이라고 한다. 타입스크립트의 타입 시스템은 아래와 같이 작동한다.

`1. 소스코드에 존재하는 모든 타입과 값을 이해하고` 변수의 초깃값의 타입 또는 스스로 타입을 유추하거나 개발자가 명시한 타입을 토대로 `2. 모든 변수들의 타입을 확인하고` `3. 각 타입을 가진 추후에 어떻게 사용될 수 있는지 모든 방법을 확인`(string타입의 변수가 어떤 속성과 메소드를 사용할 수 있는지 등)하고 만약 `4. 타입과 일치하지 않는 사용법을 사용한 경우 개발자에게 오류를 표시`한다.

위 과정에서 타입스크립트가 표시하는 오류를 `타입 오류`라고 한다.

### 할당 가능성

> 타입스크립트에서 함수 호출 혹은 변수에 값을 할당할 수 있는지 여부를 확인하는 것을 `할당 가능성`이라고 한다.

```javascript
let firstName = "Theo";
firstName = "Homin";
```

위 코드에서는 타입스크립트는 `firstName`의 초깃값 `"Theo"`를 보고 해당 변수는 `string`타입을 갖는다고 이해한다. 그 후 `"Homin"`이 재할당 될 때 이 역시 `string`타입이므로 아무런 문제를 제기하지 않는다. 하지만 아래의 경우는 다르다.

```javascript
let firstName = "Theo";
firstName = true;
```

`string`타입인 변수에 `boolean`타입을 할당하려고 했기에 이 부분에서 에러가 발생한다.

지금은 초깃값과 재할당 될 값의 타입을 비교하는 상당히 심플한 내용이지만 이후 할당 가능성에 대한 더욱 복잡한 문제들이 있으므로 해당 개념을 놓치지 말고 잘 따라가야한다.

### 타입 애너테이션 Type annotation

초깃값을 알 수 없는 변수의 경우 암묵적으로 `any`타입이 할당된다. 즉 어떠한 값도 들어올 수 있는 타입이 되는 것인데 이 변수에 새로운 값이 할당될 때 타입스크립트는 해당 변수의 타입에 대한 이해를 발전 시킨다. 그러나 이러한 경우 타입 검사 기능을 십분 활용할 수 없기에 타입 애너테이션을 활용하여 초깃값이 없는 변수에 타입을 명시해줄 수 있다.

```javascript
let firstName: string;
```

> 💡 초깃값이 있는 변수의 경우 타입스크립트가 해당 변수의 타입을 유추할 수 있으므로 타입 에너테이션을 추가하는 것은 중복이라고 볼 수 있다. 따라서 일반적으로 이런 경우에는 추가하지 않는 것을 선호

### 타입스크립트의 모듈

타입스크립트 프로젝트의 경우 서로 다른 파일에 있는 변수더라도 타입스크립트는 각 파일을 전역 스코프로 간주하기에 동일한 이름을 가질 수 없다?!

```javascript
// a.ts
const firstName = "Theo";
```

```javascript
// b.ts
const firstName = "Theo";
```

위의 경우 서로 다른 파일임에도 이를 충돌로 감지하고 `Cannot redeclare block-scoped variable 'test'.` 이와 같은 오류를 확인할 수 있다.

하지만 아래와 같이 각 파일에 스크립트 모듈 구문 `import` `export` 가 선언되어 있다면 충돌로 간주하지 않는다.

```javascript
// a.ts
export const firstName = "Theo";
```

```javascript
// b.ts
export const firstName = "Theo";
```

## 회고

타입스크립트 사용 시 따로 타입을 선언하지 않아도 아무런 오류를 제기하지 않는 경우가 더러 있었는데 이것은 타입스크립트가 스스로 변수의 타입을 유추할 수 있었기에 가능한 것이었다. 그래서 타입스크립트에 대한 이해도가 떨어지는 내가 지 멋대로 애너테이션을 남발하거나 혹은 애너테이션을 제공하지 않더라도 얼추 문제 없이(일부 미친듯이 에러를 뿜어내기도 했지만) 타입스크립트가 타입 검사를 수행할 수 있었던 것이었다.

할당 가능성이 이후에 어떤 복잡한 문제로 나타날지 궁금하다.
