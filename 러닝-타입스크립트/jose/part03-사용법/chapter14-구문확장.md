## 14. 구문 확장

### 학심 한 줄 요약

    이 챕터에서는 자바스크립트 소스 코드로 컴파일될 때 좋은 타입스크립트 키워드와 나쁜 키워드가 명확한 것 같으니 잘 숙지해서 사용하자.    

</br></br>

### 클래스 매개변수 속성

클래스를 많이 사용하는 프로젝트나 클래스 이점을 갖는 프레임워크가 아니라면 클래스 매개변수 속성을 사용하지 않는 것이 좋음

```typescript
class Foo {
    readonly area: string;

    constructor(area: string) {
        this.area = area;
    }
}

new Foo('hello').area; // Type: string
```

</br>

타입스크립트는 이러한 종류의 `매개변수 속성`을을 선언하기 위한 단축 구문을 제공  
생성자의 매개변수 앞에 `readonly`, `public`, `protected`, `private` 제한자 중 하나를 배치하면 타입스크립트가 동일한 이름과 타입의 속성도 선언하도록 지시

```typescript
class Foo {
    constructor(readonly area: string) {
        console.log(area);
    }
}

new Foo('hello').area; // Type: string
```

```typescript
class Foo {
    // 일반 속성
    name: string;
    
    // name: 일반 매개변수, area: 매개변수 속성
    constructor(name: string, public area: string) {
        this.name = `${name} ${area}`;
    }
}
```

</br>

명시적으로 할당

```typescript
class Foo {
    name: string;
    area: string;

    constructor(name: string, area: string) {
        this.name = name;
        this.area = `${name} ${area}`;
    }
}
```

</br></br>

### 실험적인 데코레이터

ECMAScript에서 아직 데코레이터는 정상 승인되지 않았으므로 타입스크립트 버전 4.7.2에서는 기본적으로 데코레이터를 지원하지 않음 (현재 stage2 단계)

```typescript
@MyDecorator
class MyClass {  }
```

</br>

`experimentalDecorators` 옵션을 사용하여 데코레이터를 활성화할 수 있음

```json
{
    "compilerOptions": {
        "experimentalDecorators": true
    }
}
```

</br>

데코레이터의 각 사용법은 데코레이팅하는 엔티티가 생성되자마자 한번 실행  
각 종류의 데코레이터(접근다, 클래스, 메서드, 매개변수, 속성)는 데코레이팅하는 엔티티를 설명하는 서로 다른 인수 집합을 받음

```typescript
function logOnCall(target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    console.log('First call', target.constructor.name);

    descriptor.value = function(...args: unknown[]) {
        console.log('Second call', key);

        return original.apply(this, args);
    }
}

class Greeter {
    @logOnCall
    greet(message: string) {
        console.log('Last call', message);
    }
}

new Greeter().greet('hello');

// First call 'Greeter'
// Second call 'hello'
// Last call 'hello'
```

</br></br>

### 열거형

자주 반복되는 리터럴 집합이 있고, 그 리터럴 집합을 공통 이름으로 설명할 수 있으며, 열거형으로 전환했을 때 훨씬 더 읽기 쉽지 않은 경우라면 열겨형을 사용하면 안됨

타입스크립트는 타입이 `number` 또는 `string`인 리터럴 값들을 갖는 객체를 생성하기 위한 `enum` 구문을 제공

```typescript
enum StatusCode {
    InternalServerError = 500,
    NotFound = 404,
    Ok = 200,
}

StatusCode.InternalServerError; // 500

let statusCode: StatusCode;

statusCode = StatusCode.Ok;
statusCode = 200;

// enum StatusCode의 자바스크립트 코드로 컴파일
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["InternalServerError"] = 500] = "InternalServerError";
    StatusCode[StatusCode["NotFound"] = 404] = "NotFound";
    StatusCode[StatusCode["Ok"] = 200] = "Ok";
})(StatusCode || (StatusCode = {}));
```

- 열거형은 `Tree-shaking(사용하지 않는 코드를 삭제하는 기능)`이 되지 않아 `Union Types`를 사용하거나 `const enum`등 을 사용하는 것이 좋음

</br>

#### 자동 숫잣값

열거형의 멤버는 값이 생략되면 첫번째 값을 0으로 시작하고 후속 값을 1씩 증가시킴

```typescript
enum VisualTheme {
    Dark, // 0
    Light, // 1
    System, // 2
}

// Top 멤버의 값이 1이라면 나머지 멤버의 값은 2, 3으로 증가
enum Direction {
    Top = 1,
    Right, // 2
    Bottom, // 3
    Left, // 4
}
```

</br>

#### 문자열 값을 갖는 열거형

열거형은 멤버롤 숫자 대신 문자열을 사용할 수 있음

```typescript
enum StatusCode {
    InternalServerError = 'Internal Server Error',
    NotFound = 'Not Found',
    Ok = 'Ok',
}
```

</br>

#### const 열거형

열거형은 런타임 객체를 생성하므로 리터럴 값 유니언을 사용하는 일반적인 전략보다 더 많은 코드를 생성  
타입스크립트는 `const` 제한자로 열거형을 선언해 컴파일된 자바스크립트 코드에서 객체 정의와 속성 조회를 생략하도록 지시

```typescript
const enum StatusCode {
    InternalServerError = 500,
    NotFound = 404,
    Ok = 200,
}

let statusCode = StatusCode.Ok;

// 컴파일된 자바스크립트 소스 코드: 열거형 선언이 모두 누락되고 열거형의 값에 대한 주석을 사용함
let statusCode = 200; /* StatusCode */
```

- 열거형 객체 정의를 생성하는 것이 바람직한 프로젝트라면 열거형 정의 자체가 존재하도록 만드는 `preserveConstEnums` 옵션을 사용

</br></br>

### 네임스페이스

    ❗️기존 패키지에 대한 DefinitelyTyped 타입 정의를 작성하지 않는 한 네임스페이스는 최신 자바스크립트 모듈 의미 체계가 일치하지 않으므로 사용하지 않는 것이 좋음

</br>

네임스페이스는 객체의 멤버로 호출할 수 있는 내보낸 콘텐츠가 있는, 전역으로 사용 가능한 객체

```typescript
namespace User {
    const name = 'hello';

    console.log(name);
}

// 출력된 자바스크립트 코드
var User;
(function (User) {
    var name = 'hello';
    console.log(name);
})(User || (User = {}));
```

</br>

#### 네임스페이스 내보내기

콘텐츠를 네임스페이스 객체 멤버로 만들어 내보낼 수 있음

```typescript
namespace User {
    export const name = 'hello';
    export const age = 30;

    export function getName() {
        return name;
    }
    console.log(User.name);
}
console.log(User.getName());

// 출력된 자바스크립트 코드
var User;
(function (User) {
    User.name = 'hello';
    User.age = 30;
    function getName() {
        return User.name;
    }
    User.getName = getName;
    console.log(User.name);
})(User || (User = {}));
console.log(User.getName());
```

</br>

네임스페이스가 여러 파일에 분할되어 작성되었더라도 컴파일된 자바스크립트 코드는 하나의 네임스페이스로 합쳐짐

```typescript
// settings/constants.ts
namespace Settings {
    export const name = 'hello';
}

// settings/describe.ts
namespace Settings {
    export function getName() {
        return name;
    }
}

// 출력된 자바스크립트 코드
var Settings;
(function (Settings) {
    Settings.name = 'hello';
})(Settings || (Settings = {}));

(function (Settings) {
    function getName() {
        return Settings.name;
    }
    Settings.getName = getName;
})(Settings || (Settings = {}));


// 런타임에 출력된 자바스크립트
const Settings = {
    name: 'hello',
    getName: function() {
        return this.name;
    }
}
```

</br>

#### 중첩된 네임스페이스

네임스페이스는 다른 네임스페이스 내에서 네임스페이스를 내보내거나 무한으로 중첩할 수 있음

```typescript
namespace User.Settings {
    export const addr = 'Seoul';
}

namespace User {
    export namespace Settings {
        export const age = 30;
    }
}
```

</br>

#### 타입 정의에서 네임스페이스

네임스페이스는 `DefinitelyTyped` 타입 정의에 유용함  
네임스페이스를 사용할 때는 모든 코드에 사용 가능한 전역 변수, 즉, 네임스페이스로 완벽하게 감싼 구조를 생성한다는 것을 나타내야함

```typescript
// 선언 파일
export const value: number;
export as namespace example;

// 사용 파일
import * as example from 'example';
const value = window.example.value;
```

</br>

#### 네임스페이스보다 모듈을 선호함

네임스페이스로 구조화된 타입스크립트 코드는 웹팩과 같은 최신 빌더에서 사용하지 않는 파일을 제거하는 것이 쉽지 않음. 명시적이 아니라 암시적으로 연결을 생성하기 때문.  
네임스페이스가 아닌 `ECMA스크립트` 모듈을 사용해 런타임 코드를 작성하는 것이 좋음

```javascript
// settings/constants.ts
export const name = 'hello';

// settings/describe.ts
import { name } from './constants';

export function getName() {
    return name;
}

// index.ts
import { getName } from './settings/describe';

console.log(getName());
```

</br></br>

### 타입 전용 가져오기와 내보내기

타입스크립트의 트랜스파일러는 자바스크립트 런타임에서 사용되지 않으므로 파일의 가져오기와 내보내기에서 타입 시스템에서만 사용되는 값을 제거

```typescript
// index.ts
const userInfo = { name: 'hello', age: 30 };

type UserContury = 'KR' | 'US';

export { userInfo, UserContury };

// index.js
const userInfo = { name: 'hello', age: 30 };

export { userInfo };
```

- 한 번에 하나의 파일에서 작동하는 babel 같은 트랜스파일러는 타입스크립트 타입 시스템에 접근할 수 없음
- `isolatedModules` 컴파일러 옵션은 코드가 타입스크립트가 아닌 다른 도구에서 변환되는지 확인할 때 사용

</br>

타입스크립트는 `export`, `import` 선언에서 개별적으로 가져온 이름 또는 전체 { ... } 객체 앞에 `type 제한자`를 추가할 수 있음 (타입 시스템에서만 사용된다는 것을 나타냄)

```typescript
// index.ts
import { type TypeUser, value } from './example';
import type { TypeOther } from './example';
import type DefaultType from './example';

// index.js
import { value } from './example';

export { value };
```

- 타입 전용 가져오기와 내보내기는 잘 사용하지 않음
- 개인적인 생각으로는 코드가 복잡해 질 것 같다.

</br></br>

### 새로 알게된 점

얼거형 같은 경우에는 tree-shaking이 되지 않아 다른 방법을 사용한다는 글을 본적이 있다. 이 부분에 대해서는 더 정리를 해야겠다.  

모듈 같은 것을 만들거나 모듈의 타입을 정의할 때는 유용하게 쓰일 것 같음.

</br></br>

### 참고

[타입스크립트 핸드북 - 데코레이터](https://www.typescriptlang.org/ko/docs/handbook/decorators.html)  
[타입스크립트 핸드북 - 열거형](https://www.typescriptlang.org/ko/docs/handbook/enums.html)  
[타입스크립트 핸드북 - 네임스페이스](https://www.typescriptlang.org/ko/docs/handbook/namespaces.html)