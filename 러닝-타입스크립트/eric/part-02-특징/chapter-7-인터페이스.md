## [ 인터페이스 ]

### 핵심 한 줄 요약
 타입 별칭과 유사하지만 클래스와 궁합이 좋은 인터페이스의 특징을 잘 알고 사용하자

### 인터페이스 특징
- 별칭으로 된 객체 타입과 유사하다. => 타입 별칭 객체 형태
- 읽기 쉬운 오류 메시지
- 더 빠른 컴파일러 성능
- 클래스와의 더 나은 상호 운용성
- 중첩도 가능하다.
- 인터페이스끼리 병합도 가능하다.

### 인터페이스 속성 타입
- 옵셔널 사용 가능 => ? 키워드
- 읽기 전용 속성 명시 가능 => readonly => 처음 할당 후 변경 불가, 읽기만 가능

### 인터페이스 함수 멤버
- 메서드 구문, 속성 구문 두가지로 선언 가능
- 옵셔널 사용 가능 => ? 키워드
- 메서드 구문 => member(): string;
- 속성 구문 => member: () => string;

### 호출 시그니처
- 말이 어렵다. 함수를 정의하는 방식 중 하나일 뿐이다.
- 함수의 매개변수와 반환값의 타입을 명시하는 방법이다.
- ex) (input) => string, (): void

### 인덱스 시그니처
- TS는 기본적으로 객체의 속성을 읽을 때 string 타입의 key 를 허용하지 않는다.
- 인덱스 시그니처는 객체가 여러 Key를 가질 수 있으며 Key와 매칭되는 value를 가지는 경우 사용한다.
- ex) { [i: string]: T } 요런 모양이다.
- 객체에 값을 할당할 때 편리하지만 타입 안전성을 완벽하게 보장하지는 않는다.
- 타입 시스템이 어떤 속성에 접근하든 값을 반환한다고 인지하기 때문이다. => 키를 미리 알 수 없다면 Map을 사용하는 걸 추천한다.
- 일반 속성과 혼합해서 사용도 가능하다. => 대신 할당되는 변수에 일반 속성은 필수이다.
- 일반 속성과 혼합해서 사용할 때 일반 속성의 타입을 원시 타입이 아니라 구체적 속성 타입 리터럴로 선언해서 판별값처럼 사용하기도 한다.

## 인터페이스 확장
- extends 키워드를 사용해서 확장한다. -> (허위 인터페이스 extends 상위 인터페이스)
- 받는 인터페이스는 상위 인터페이스의 모든 멤버를 가져야 한다.

## 다중 인터페이스 확장 => 다중 상속?
- extends 키워드 뒤에 쉼표로 구분하여 쭉 나열가능하다. -> (하위 인터페이스 extends 상위 인터페이스1, 상위 인터페이스2)

## 인터페이스 병합
- 자주 사용하지는 않는다.
- 똑같은 인터페이스 이름으로 재정의 하면 속성, 메서드가 병합된다.
- 하지만 동일한 멤버명에 다른 속성 타입은 허용하지 않는다.

### ex) 타입 별칭과 인터페이스
```typescript
type UserInfo = {
    name: string;
    age: number;
};  // <- 타입 별칭 뒤에는 ; 을 넣는 사람들이 많다고 한다.

interface UserInfo {
    name: string;
    age: number;
}
```

### ex) 인터페이스 
```typescript
// 옵셔널 가능
interface UserInfo {
    name: string;
    age: number;
    phone?: string;
}

// 읽기 전용 명시 가능
interface UserInfo {
    readonly name: string;
    age: number;
}
// 속성 구문과 메서드 구문
interface Cafe {
    maneger: string;
    guide: () => string;  // 속성 구문    
    call(): string;       // 메서드 구문
}
```
### ex) 호출 시그니처
```typescript
(input) => string || () : void
```

### ex) 인덱스 시그니처
```typescript
{ [i: string]: T }
=> 객체 안에 string으로 된 키, 벨류는 타입
```

### ex) 인터페이스 확장
```typescript
interface UserBaseInfo {
    name: string;
    age: number;
}

interface UserPrivateInfo {
    cardNum: number;
    cardPw: number;
}

interface UserInfo extends UserBaseInfo {
    // name과 age가 포함된 상태이다.
    phone: string;
    method: string;
    
    // 멤버명이 겹침 => 재정의 => 타입 변경 안됨
    age: string;
}

// 다중 인퍼페이스 확장
interface saveUserInfo extends UserBaseInfo, UserPrivateInfo {
    uuid: string;
}
```
### ex) 인터페이스 병합 
```typescript
interface UserInfo {
    name: string;
    age: number;
}

interface UserInfo {
    phone: string;
}

const user: UserInfo {
    /*
    * name: string;
    * age: number;
    * phone: string;
    * 이 포함되어야 한다.
    * */
}
```

### 새로 알게된 점
- 호출 시그니처, 인덱스 시그니처가 뭔지 책에서 보고 찾아보면서 알게 되었다. 
- 다중 상속이 된다니 갓 TS
- 인터페이스에도 읽기 전용 속성을 명시할 수 있다는 걸 알게 되서 자주 사용할 것 같다.
