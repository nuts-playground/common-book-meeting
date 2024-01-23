## [ 타입 시스템 ]

### 핵심 한 줄 요약
    타입스크립트는 변수의 *초기값* 을 읽고 해당 변수의 허용 타입을 결정한다.


### 자바스크립트의 원시타입
- null
- undefined
- boolean
- string
- number
- bigint
- symbol

### 타입스크립트의 타입 시스템
- 코드를 읽고 존재하는 모든 타입과 값을 이해한다.
- 각 값이 초기 선언에서 가질 수 있는 타입을 확인한다.
- 각 값이 추후 코드에서 어떻게 사용될 수 있는지 모든 방법을 확인한다.
- 값의 사용법이 타입과 일치하지 않으면 사용자에게 오류를 표시한다.

### 타입스크립트의 오류 종류
- 구문 오류: ts -> js 변환되는 것을 차단
- 타입 오류: 타입 검사기에 따라 일치하지 않으면 차단

### 타입 에너테이션
- 초깃값을 할당하지 않고 변수의 타입을 선언하는 구문
- 내가 제일 좋아한다. => 코드가 보기 좋아진다.

### ex) 멋진 타입 확인 후 방법 제시 (디펄트로? 이야)
```typescript
let userName = 'seokho';
userName.length()
/*
* TS2349: This expression is not callable.
  Type Number has no call signatures
* */
```

### ex) 할당 가능성 예시
```typescript
let userName = 'seokho';
userName = 12345

// TS2322: Type number is not assignable to type string
```

### ex) 타입 에너테이션 올바른 예시
```typescript
let resultAmount: number;
resultAmount = 1000000
```

### ex) 타입 에너테이션 불필요한 타입 예시
```typescript
let userName: string = 'seokho';
// 이렇게 되면 중복 선언과 비슷하다.
```

### ex) 객체의 멤버 속성까지도 미리 파악해준다
```typescript
let insertName = {
    firstName: 'seokho',
    lastName: 'kim'
}

// TS2339: Property age does not exist on type { firstName: string; lastName: string; }
```

### 새로 알게된 점
- 타입 시스템을 더욱 잘 활용하기 위해서는 초기값이 중요하다는 걸 알게 되었다.
- 타입 에너테이션을 불필요하게 사용하는 예시는 최대한 피해보자.
