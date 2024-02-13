## 11. 선언 파일

선언 파일은 `d.ts`확장자로 끝남  
선언 파일은 일반적으로 프로젝트 내에서 작성되고 프로젝트의 컴파일된 `npm` 패키지로 빌드 및 배포되거나 독립실행형 `typings` 패키지로 공유

### 학심 한 줄 요약

    declare 키워드로 타입과 값을 선언하고 전역 변수, 전역 인터페이스 병합 및 전역 확장을 사용해 전역의 타입을 변경할 수 있음

</br></br>

### 선언 파일

`.ds.ts` 파일에는 사용 가능한 `런타입 값`, `인터페이스`, `모듈`, `일반 적인 타입`의 설명만 포함  
자바스크립트로 컴파일할 수 있는 모든 런타임 코드를 포함할 수 없음

```typescript
// types.d.ts
export interface Character {
    catchphrase?: string;
    name: string;
}

// index.ts
import { Character } from './types';

export const characters: Character = {
    catchphrase: 'hello',
    name: 'world',
};
```

- 선언 파일은 값이 아닌 타입만 선언할 수 있는 코드 영역을 의미하는 `앰비언트 컨텍스트(ambient context)`를 생성

</br></br>

### 런타입 값 선언

`declare` 키워드를 사용해 구조체 존재 선언  
`<script>` 태그 같은 일부 외부 작업이 특정 타입의 이름을 사용해 값을 생성했음을 타입 시스템에 알림  
초깃값 허용되지 않음

```typescript
// types.d.ts
declare const declared: string;

declare const initializer: string = 'hello'; // Error: 초기화 불가능
```

</br>

함수와 클래스도 일반적인 형식과 유사하게 선언되지만 함수 또는 메서드의 본문이 없음

```typescript
declare function foo(name: string): boolean;

declare function bar(name: string): boolean {
    return name === 'hello';
} // Error: 메서드 본문이 있기 때문

class Foo {
    helloWorld(name: string): string;

    wrongFunction(name: string): string {
        return name;
    } // Error: 메서드 본문이 있기 때문
}
```

</br>

선언 파일 외부에서도 `declare` 키워드를 사용 가능  
전역으로 사용 가능한 변수가 해당 파일에서만 사용되어야 하는 경우 유용함

```typescript
// index.ts
declare const hello: string;

console.log(hello); // ok
```

</br>

함수나 변수 같은 런타임 구문에 `declare` 키워드가 없다면 타입 오류

```typescript
// index.d.ts
interface Foo {};
declare interface Foo {};

declare const bar: string; // 원시 타입 string
declare const bar: 'hello'; // 타입은 리티럴 값

const baz = 'hello'; // Error: 런타임 구문에 declare 키워드가 없음, 초기화 되었기 때문(?)
```

</br>

#### 전역 변수

`import` 또는 `export` 문이 없는 타입스크립트 파일은 모듈이 아닌 스크립트로 취급되기 때문에 파일에 선언된 타입을 포함한 구문은 전역으로 사용.

```typescript
// global.d.ts
declare const version: string;

// version.ts
export function getVersion() {
    console.log(version);
}
```

- `export` 문을 사용해 전역으로 사용할 수 없게 만들 수 있음.

</br>

#### 전역 인터페이스 병합

인터페이스는 동일한 이름의 다른 인터페이스와 병합되기 때문에 `import`, `export`문이 없는 `.d.ts` 선언 파일 같은 전역 스크립트 컨텍스트에서 인터페이스를 선언하면 전역으로 확장

```typescript
<script type="text/javascript">
    window.myVersion = '3.1.1';
</script>

// window.d.ts
interface Window {
    myVersion: string;
}

// index.ts
export function getWindowVersion() {
    console.log(window.myVersion);
}
```

</br>

#### 전역 확장

경우에 따라서 모듈 파일에 선언된 타입이 전역으로 사용되어야 함

```typescript
// types.d.ts
declare global {
    // 전역 context
}

// types/data.d.ts
export interface Data {
    version: string;
}

// types/globals.d.ts
import { Data } from './data';

declare global {
    const globallyDeclared: Data;
}

declare const locallyDeclared: Data;

// index.ts
import { Data } from './types/data';

function logData(data: Data) {
    console.log(data.version);
}

logData(globallyDeclared);

logData(locallyDeclared); // Error: locallyDeclared 전역으로 선언되지 않음
```

</br></br>

### 내장된 선언

`Array`, `Function`, `Map`, `Set`과 같은 전역 객체는 타입 시스템이 알아야 하지만 코드에서 선언되지 않는 구문  
이와 같은 전역 객체는 디노, Node.js, 웹 브라우저 등에서 실행되는 런타임 코드에 의해 제공

</br>

#### 라이브러리 선언

모든 자바스크립트 런타임에 존재하는 내장된 전역 객체는 `lib.[target].d.ts` 파일 이름으로 선언  
`target`: `ES5`, `ES6`, `ES2015`, `ESNext` 와 같은 프로젝트를 대상으로 하는 자바스크립트의 최소 지원 버전

```typescript
interface Array<T> {
    length: number;
}
```

- `lib` 파일은 타입스크립트 `npm` 패키지의 일부로 배포되며 `node_modules/typescript/lib.es5.d.ts`와 같은 경로의 패키지 내부에서 찾을 수 있음


</br>

#### 라이브러리 `target`

타입스크립트는 기본적으로 `tsc CLI` 또는 프로젝트 `tsconfig.json` (기본값은 es5)에서 제공된 `target` 설정에 따라 적절한 `lib` 파일을 포함  
자바스크립트 최신 버전에 대한 연속적인 `lib` 파일들은 인터페이스 병합을 사용해 서로 빌드

```typescript
interface NumberConstructor {
    // 1과 1보다 큰 가장 작은 부동 소수점 수 사이의 차이
    readonly EPSILON: number;

    // number 타입의 유한한 값만 true
    isFinite(number: unknown): : boolean;
}
```

</br>

#### DOM 선언

`DOM` 타입은 `lib.dom.d.ts` 파일과 다른 `lib.*.d.ts` 선언 파일에도 저장됨

```typescript
// lib.dom.d.ts
interface Storage {
    readonly length: number;
    clear(): void;
    getItem(key: string): string | null;
}
```

</br></br>

### 모듈 선언

모듈의 문자열 이름 앞에 `declare` 키워드를 사용하면 모듈의 상태를 설명하는 내용을 타입 시스템에 알릴 수 있음

```typescript
// module.d.ts
declare module 'my-module' {
    export const value: string;
}

// index.ts
import { value } from 'my-module';

console.log(value);
```

- `declare module` 구문을 자주 사용해서는 안됨.

</br>

#### 와일드카드 모듈 선언

모듈 선언으로 하나의 `*` 와일드카드를 포함해 해당 패턴과 일치하는 모든 모듈을 나타낼 수 있음

```typescript
// styles.d.ts
declare module '*.module.css' {
    const styles: { [i: string]: string };
    export default styles;
}

// component.ts
import styles from './styles.module.css';

styles.anyClasssName; // Type: string
```

- 와일드카드 모듈을 사용해 로컬 파일을 나타내는 방식이 타입 안정성을 완벽하게 보장하지는 않음
- 타입스크립트는 가져온 모듈 경로가 로컬 파일과 일치하는지 확인하는 메커니즘을 제공하지 않기 때문에 일부 프로젝트는 웹팩 같은 빌드 시스템을 사용하거나 로컬 파일에서 `.d.ts`파일을 생성해 가져오기가 가능한지 확인

</br></br>

### 패키지 타입

#### 선언

타입스크립트는 입력된 파일에 대한 `.d.ts` 출력 파일과 자바스크립트 출력 파일을 함께 생성하는 선언 옵션을 제공

```typescript
// index.ts
export const greet = (text: string) => {
    console.log(text);
}

// module은 es2015, target은 es2015인 선언 옵션을 사용해 다음 출력 파일을 생성
// index.d.ts
export declare const greet: (text: string) => void;

// index.js
export const greet = (text) => {
    console.log(text);
}
```

- 자동으로 생성된 `.d.ts` 파일은 프로젝트에서 사용자가 사용할 타입 정의를 생성하는게 가장 좋은 방법
- 일반적으로 .js 파일을 생성하는 타입스크립트로 작성된 대부분의 패키지도 해당 파일과 함께 `.d.ts`를 번들로 묶는 것이 좋음

</br>

#### 패키지 타입 의존성

타입스크립트는 프로젝트의 `node_modules` 의존성 내부에서 번들로 제공되는 `.d.ts` 파일을 감지하고 활용할 수 있음  

</br>

**파일구조**
```bash
lib/
    index.js
    index.d.ts
pacakge.json
```

</br>

**jest를 예시로**
```json
// package.json
{
    "devDependencies": {
        "jest": "^32.1.0"
    }
}
```

```typescript
// using-global.d.ts
describe('MyAPI', () => {
    it('works', () => { })
})

// using-imported.d.ts
import { describe, it } from '@jest/globals';

describe('MyAPI', () => {
    it('works', () => { })
})
```

</br>

`@jest/globals` 패키지는 `describe`와 `it`를 내보내고 `jest` 패키지는 해당 함수를 가져오고 해당 함수 타입이 `describe`와 `it` 변수를 가지고 전역 스코프로 확장

```typescript
// node_modules/@jest/globals/index.d.ts
export function describe(name: string, fn: () => void): void;
export function it(name: string, fn: () => void): void;

// node_modules/jest/index.d.ts
import * globals from '@jest/globals';

declare global {
    const describe: typeof globals.describe;
    const it: typeof globals.it;
}
```

</br>

#### 패키지 타입 노출

프로젝트가 npm에 배포되고 사용자를 위한 타입을 제공하려면 패키지의 `package.json` 파일에 `types` 필드를 추가해 루트 선언 파일을 가리킴.  
`types` 필드는 `.js`확장자 대신에 `.d.ts`확장자를 사용함

```json
// main 런타임 파일인 ./lib/index.js는 types 파일인 ./lib/index.d.ts와 병렬 처리
{
    "author": "author",
    "main": "./lib/index.js",
    "name": "my-package",
    "types": "index.d.ts",
    "version": "1.0.0",
}
```

</br></br>

### DefinitelyTyped

`DefinitelyTyped(DT)`: 패키지 정의를 수용하기 위한 저장소  
npm에 `@types` 범위로 게시됨

</br>

**`@types/loadash`를 예시로**
```json
// package.json
{
    "devDependencies": {
        "@types/lodash": "^4.14.168",
        "lodash": "^4.17.21",
    }
}
```

</br>

**`react`를 예시로**

```json
// package.json
{
    "dependencies": {
        "react": "^17.0.1",
    },
    "devDependencies": {
        "@types/react": "^17.0.0",
    }
}
```

</br>

#### 타입 사용 가능성

아직 사용 가능한 타입이 없는 패키지에서 타입을 얻는 일반적인 세 가지 옵션
- `@types/` 패키지를 생성하기 위해 `DT`애 pull request 를 보냄
- `declare module` 구문을 사용해 프로젝트 내에서 타입을 작성
- 구성 옵션 `noImplicitAny` 옵션을 비활성하고 강력하게 경고

</br></br>

### 새로 알게된 점

이 챕터는 정말 생소한 챕터였음. 라이브러리나 모듈을 만들 때 정말 유용할 것 같음. 미리 선언해 놓고 구현부는 사용자의 취향대로 작성하게 하면 될 것 같다. 아직 생소하지만 조금 더 사용해 보자.

</br></br>

### 참고
[타입스크립트 공식문서 - Declaration Reference](https://www.typescriptlang.org/ko/docs/handbook/declaration-files/by-example.html)