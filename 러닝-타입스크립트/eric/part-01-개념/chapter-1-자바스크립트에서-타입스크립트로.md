## [ 자바스크립트에서 타입스크립트로 ]

### 핵심 한 줄 요약
    타입스크립트는 자바스크립트의 단점은 보완하고, 장점은 살려주는 멋진 언어이다.


### 자바스크립트는 ...
- 1995년 브렌던 아이크가 자바스크립트를 10일 만에 만들었다.
- 자바스크립트 운영위원회 TC39는 js 언어 사양인 ecma script의 버전을 2015년 부터 매년 출시한다.
- 동적 타입 언어는 에러가 컴파일 단계가 아니라 런타임 단계에 출몰해서 잘 짜야 한다.
- JSDoc은 /* */ 을 이용해 주석을 코드 힌트도 주면서 설명할 수 있지만 완벽하지 않다.

### 타입스크립트는 ...
- 타입스크립트는 코드 구조에 대해 절대 강요하지 않는다.
- 타입스크립트는 오래된 브라우저 런타임 환경에 대응하기 위한 코드를 컴파일 할 때 조금 느리다.
- 빌드 시에 오류 분석 구문 때문에 살짝 시간이 있다. 하지만 코드 파일 생성과는 무관하다.
- 웹의 진화가 끝날 떄까지 지속적으로 업데이트 중이다.   

### ex) 예측 불가능한 코드 작성 예방   
```typescript
function testLog(method) {
    console.log(method);
};

testLog('method1', 'method2');
// TS2554: Expected 1 arguments, but got 2
```

### ex) 정확한 문서화
```typescript
interface UserInfo {
    name: string;
    age: number;
}

type StringOrNull = string | null;

function insertUser(info: UserInfo): StringOrNull { 
    /*
    * 
    * inserUser 함수를 사용하려 할 때 name, age가 없는 obj가 들어온다?
    * => 코드 치는 순간 부터 에러야
    * 
    * 이 함수의 반환 값을 boolean 으로 하려고 한다?
    * => 바로 또 잡아서 에러로 뱉어주지 빨간 줄
    * 
    * */
    return '스트링이지롱' | null
}

// insertUser 함수의 매개변수 object의 키와 타입,
// insertUser 함수의 반환되는 값을 한 번에 볼 수 있다는게 너무 좋다.
// 파일이 흩어져 있어도 커서만 올리면 IDE가 바로 띄워준다.
```

### 새로 알게된 점
- 타입스크립트가 느리다는 게 정확히 뭔지 몰랐는데 빌드 타임, 구 버전 런타임 컴파일 때 라는 걸 알게 되었다.
- 코드 구조에 대해 강하게 강제 하는 줄 알았는데 그냥 내가 못 쓰는거 였다.
