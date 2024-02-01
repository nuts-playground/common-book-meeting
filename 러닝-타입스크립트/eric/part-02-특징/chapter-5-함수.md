## [ 함수 ]

### 핵심 한 줄 요약
    자바스크립트로 자유롭게 짜던 함수를 타입을 이용해 더욱 안전한 코드를 작성할 수 있다.


### 함수 매개변수
- 기존의 자바스크립트는 매개변수에 타입을 선언할 수 없어서 사용자 작성 위주로 동작한다.
- 타입스크립트는 매개변수에 타입을 선언할 수 있으며, 작성한 매개변수는 필수라고 기본 가정한다.
- 옵셔널 키워드를 줄 수도 있다.
- 기본값을 제공할 수 있다.( default function parameter ) => js에도 있는 기능이다.
- 속성 누락, 초과 속성은 허용하지 않는다.
- 나머지 매개변수는 크게 다루지 않으려고 한다. => 나라면 좀 더 명시적으로 만들 것 같다.

### 함수 반환 타입
- 함수에서는 반환 타입을 명시적으로 선언하는게 유용한 경우가 많다.
- 실제 값이 반환되지 않으면 모두 undefined 를 반환한다.
- 명시함으로써 타입의 반환 값을 강제할 수 있다.
- 큰 프로젝트에서 타입 검사 속도를 높일 수 있다.
- 함수에서 잘못된 반한 값이 나오는 경우 에러를 자동으로 표시해준다.

### 함수 타입
- 말 그대로 변수에 함수 형태의 타입을 선언할 수 있다.
- ex) let returnString: ( count: number ) => string;
- 매개변수를 설명하는데 보기 좋다.
- 별칭으로 묶어 사용해도 좋다.

### 함수 타입 void
- 어떤 값도 반환하지 않는다. => 반환 값을 허용하지 않는다. === 반환되는 모든 값을 무시한다.
- undefined 와 다르다.
- 나는 주로 함수 상위 스코프에 상태를 바꾸는 함수나 상태를 확인하는 함수에 주로 사용한다.

### 함수 타입 never
- 항상 오류를 발생시키거나 무한 루프를 실행하는 함수를 명시한다.
- 의도적 오류를 발생시키는 함수에 활용하면 좋을 것 같다.
- /* 호세, 테오와 리뷰 후 추가 한 내용 */
- never 타입은 점유할 수 없는 또는 바닥 타입이라고 불린다.
- 타입에는 **`불가능`**을 나타내는 타입도 필요하다.
- 숫자는 0이 있고 문자에는 never 가 있다.
- 함수를 사용하면 불가능한 위치에 추가적인 코드를 사용하게끔 해 준다. => 더 나은 에러 메시지를 보여주거나 파일 또는 반복문과 같은 자원을 닫는 데 유용하다.
- /* 호세, 테오와 리뷰 후 추가 한 내용 */

### 오버로드 (시그니처)
- 함수의 이름은 같고 매개변수가 다른 함수를 만드는 것이다. 
- 어려운 함수 타입에 사용하는 최후의 수단이라고 한다.
- 나는 잘 모르겠다. 가져다 쓰는 입장에서는 좋은 것 같다. => 폭 넓은 내용을 포괄하는 측면에서 => 아 그래서 그런가...?
- (함수명, 매개변수, 반환 타입) 만 있는 선언적 함수들을 오버로드 시그니처, 마지막 구현 함수는 구현 시그니처 라고 한다.
- 구현 시그니처는 모든 오버로드 시그니처와 호환되어야 한다 => 즉 동일한 인덱스의 매개변수를 할당할 수 있어야 한다.

### ex) 함수 매개변수 예시
```typescript
function systemLog(param: string) {
    console.log('param: ' + param);
}

systemLog();                // 작성된 매개변수는 옵셔널이 아니니 필수값으로 이 구문은 실행되지 않는다
systemLog(1234);            // 매개변수는 string 타입을 받기로 작성해서 반드시 string이 와야 한다.
systemLog('안녕하세요!');      // ok
```

### ex) 선택적(옵셔널) 매개변수 예시
```typescript
function systemLog(param: string, plusParam?: string) {
    console.log('param: ' + param);
    if(plusParam) {
        console.log('plus param: ' + plusParam);
    }
}

systemLog('안녕하세요!');          // ok
systemLog('안녕하세요!', '냐옹');   // ok
```

### ex) 기본 매개변수 예시
```typescript
function systemLog(param: string, plusParam: string = '멍멍') {
    console.log('param: ' + param);
    console.log('plus param: ' + plusParam);
}

systemLog('안녕하세요!');          // ok => 두번째 매개변수는 기본값이 있어 자동 string | undefined 타입이 된다
systemLog('안녕하세요!', '짹짹');   // ok => 짹짹도 정상 출력된다.
```

### ex) 함수 타입
```typescript
let returnString: ( count: number ) => string;
let returnStringOrNull: ((input: number) => string) | null; // 이렇게 쓸 수도 있다.

type ArrayToNumber = (input: any[]) => number; // 별칭으로 묶어도 좋다.

function calculator(amountList: (data: number) => number) {} // 이렇게 보니까 강력하다.
```

### ex) 함수 타입 void
```typescript
class loopCheck {
    private count: number;

    constructor() {
        this.count = 0;
    }

    plusCount(): void {
        this.count++; // 리턴하지 않고 스코프 안에 상태만 바꾸는데 사용한다. 
    }
    
    getCurCount(): void {
        console.log(this.count);    // 반환 값이 필요 없는 경우에도 사용한다.
    }
}
```

### ex) 함수 타입 never
```typescript
function fail(msg: string): never {
    const resMsg = '에러 포착' + '\n' + 'CATCH_MSG: ' + msg; 
    throw new Error(resMsg);
}
// 이렇게 절대 값을 반환하지 않고 이 함수가 호출된 후 뒤에 모든 함수가 실행하지 않게 한다.

/* 리뷰 후 추가한 내용 */
/*
* never 타입의 쓰임새
* 허용할 수 없는 함수 파라미터에 제한을 한다 => 이거 진짜 중요한 것 같다.
* 추가 내용은 개발 하면서 추가하자
* */
function teamErrorFormatNever(input: never): never {
    let obj = {
        path: ss,
        timestamp: 21312
    }
    throw new Error('우리팀의 로그 내용');
}

type UserLevel = 'normal' | 'maneger' 

function action(ipnut: UserLevel): number {
    try {
        switch (input) {
            case 'normal': { return 1; }
            case 'maneger': { return 2; }
            default: { throw new Error('없음')}
        }
    } catch () {
        teamErrorFormatNever() // 에러 메시지 넣어서 보낸다? => 불가 이미 정해져 있는 포맷이 있기 때문에
    }
}

```

### ex) 오버로드
```typescript
function createDate(timestamp: number): Date                                    // 오버로드 시그니처
function createDate(month: number, day: number, year: number): Date             // 오버로드 시그니처
function createDate(month: string, year: number): Date   // fail => 구현 시그니처에 매개변수 인덱스와 동일한 타입이어야 한다.
function createDate(monthOrTimestamp: number, day?: number, year?: number) {    // 구현 시그니처 => 모든 오버로드 시그니처와 호환되어야 한다.
    return day === undefined || year === undefined
        ? new Date(monthOrTimestamp)
        : new Date(year, monthOrTimestamp, day)
} // 구현 시그니처가 없으면 사용할 수 없다.
```

### 새로 알게된 점
- void 와 never 타입의 정확한 개념을 알게 되었다.
- 오버로드의 정확한 개념을 알게 되어 더 유용하게 사용할 수 있겠다.
- 역시 함수 만드는게 제일 재밌다.
