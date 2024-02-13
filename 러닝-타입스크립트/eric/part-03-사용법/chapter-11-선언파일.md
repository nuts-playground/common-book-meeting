## [ 선언 파일 ]

### 핵심 한 줄 요약
    .d.ts의 구성 요소 및 짜임새를 알아야 순수 JS 패키지도 TS 패키지로 만들 수 있다. 

### 선언 파일(.d.ts)
- 구현과 별도로 타입 정의만 적어 놓은 파일
- 선언만 해놓은 파일이기 때문에 런타임 코드를 포함 할 수 없다.
- 임포트해서 사용할 수도 있다.
- JS 코드로 컴파일 되지 않는다.

### 런타임 선언
- 구현 코드, 런타임 값을 작성할 수는 없지만 declare 키워드를 사용해서 구조체가 있다고 선언은 가능하다.
- 이 말이 무엇이냐 => 선언 해놔서 코드 자동 완성 도움말 등 목록에 보여진다.
- 꼭 선언 파일에서만 사용하지 않고 .ts 파일 등에서도 사용가능

### 전역변수 - 선언
- import, export 문이 없는 ts 파일은 모듈이 아닌 스크립트로 취급된다.
- 위의 이점을 이용해서 타입을 전역으로 선언할 수 있다.
- ex) declare const version: string;
- 특히 DOM 요소 다뤄야 하는 브라우저 앱 에서 많이 사용한다.

### 전역변수 - 확장
- 때로는 모듈 파일에 있는 선언을 전역으로 사용해야 할 경우가 있다.
- global 키워드를 사용하여 전역 컨텍스트를 표시할 수 있다.
- declare 와 global 키워드를 적절히 사용하여 멋지게 전역 타입 정의를 설명하자.

### 내장 선언
- 이미 내장되어 있는 슈퍼 객체들에 대해서 알아보자.
- ex) Array, Function, Map, Set
- 이 놈들은 타입 시스템에서 알아야 하지만 코드에 선언되어 있지 않다.
- 런타임 코드에서 제공된다 => node_modules 같은 놈들
- lib.[ecma 버전].d.ts 파일 이름으로 선언된다.
- 요 ecma 버전보다 높은 구문은 해당 프로젝트에 설치 안되어 있으면 사용 못한다.

### 모듈(패키지) 선언
- 선언 파일로 모듈의 상태를 설명할 수도 있다.
- declare module 키워드로 사용한다. => 자주 사용해서는 안된다. 뒤에 내용과 겹치기 때문이다.
- \* 표시로 와일드카드를 포함해서 선언할 수 도 있다.

### 패키지 타입
- 지금까지는 프로젝트 내에서 declare 를 사용하는 방법이었다.
- export declare 키워드로 모듈(패키지) 타입을 선언해서 내보낸다. => 이거 때문에 위에 모듈 선언에서 언급했다.
- npm 에 배포할 타입을 제공하려면 package.json 안에 type 필드를 추가해 루트 선언 파일을 적어줘야 한다. (.d.ts)
- => 기본값은 index.d.ts 이다.

### DefinitelyTyped
- 기존 JS로 만들어진 서드파티 모듈들을 TS 환경에서도 사용할 수 있도록 따로 타입만 정리해서 넣어둔 파일 및 저장소
- 왜? => JS 기반의 라이브러리들은 TS 환경에서 타입이 지정되지 않았기 때문에 타입체킹이 제대로 되지 않아서 정상적으로 인식되지 못하는 문제가 발생한다.
- @types/ 가 붙은 모듈들이 타입 선언만 포함된 모듈이다.
- 대상 패키지와 DT의 버전이 무조건 일치하지 않을 수도 있다.
- DT는 만들어 제공하는게 좋다. => 어렵지만 ㅜ 그래도 다른 개발자에게 큰 도움이 된다.


### ex) 선언 파일 기본 틀 (별거 없다)
```typescript
// 똑같다 근데 구현을 안하고 이렇게 선언만 한다.
// 이렇게 타입만 선언할 수있는 코드 영역을 앰비언트 컨텍스트라고 한다.
export interface CommonDate {
    format?: string;
    date: Date
}
// 이거만 내보냄 타입이니까

// 에러
// .d.ts 에서는 이런 함수나 변수 같은 런타임 구문에는 declare 키워드가 꼭 붙어야 한다. 
const date = new Date();
```

### ex) 런타임 선언 (declare)
```typescript
// 이러한 구조체가 존재한다고 선언한다.
// declare 키워드로 선언한다.
declare function getName(): boolean; 
```

### ex) 전역 변수 - 선언
```typescript
// globals.d.ts
declare const globalVersion: string;

// version.ts
export function logVersion() {
    console.log(globalVersion) => 현재 값은 할당되어 있지만 사용 가능하다. 
}
```

### ex) 전역 변수 - 확장
```typescript
// types/data.d.ts
export inteface Data {
    version: string;
}

// types/globals.d.ts
// 다른 곳에서 import 없이 globalData 를 사용할 수 있게 한다. 
import { Data } from './data';
declare global {            // => 요게 요게 핵심이다.
    const globalData: Data; // => 받아서 글로벌로 선언한다.
}

declare const localData: Data; // => 요거는 이 파일 안에서만 사용 가능
```

### 새로 알게된 점
- @types/ 뭔지 이제야 명확하게 알게 되었다.
- declare 키워드도 이제야 명확하게 알게 되었다.
- 라이브러리 보는 법을 조금 더 알게된 계기가 된 것 같다.
