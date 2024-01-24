## [ 유니언과 리터럴 ]

### 핵심 한 줄 요약
    유니언, 내로잉, 리터럴 타입을 잘 활용해서 안전한 코드를 작성하도록 노력하자. 


### 유니언
- '이거 혹은 저거' 와 같은 타입
- 값이 유니언 타입일 때 유니언으로 선언한 모든 가능 타입에 멤버 속성에만 접근 가능하다.

### 타입 가드
- 타입을 좁히는데 사용할 수 있는 논리적 검사

### 내로잉
- 값이 정의, 선언, 이전에 유추한 것보다 더 구체적인 타입임을 코드에서 유추하는 것
- 타입 가드를 통해 특정 코드 블록 내에서 변수의 타입 범위를 좁히는 과정
- '타입을 좁힌다' 가 핵심
- 1. 값 할당을 통한 내로잉&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; => &nbsp;&nbsp;&nbsp; 값을 할당하면서 타입을 추려 간다.
  2. 조건 검사를 통한 내로잉&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; => &nbsp;&nbsp;&nbsp; if 등 조건부 로직을 활용해 타입을 추려 간다.
  3. typeof 검사를 통한 내로잉&nbsp;&nbsp;&nbsp;&nbsp; => &nbsp;&nbsp;  조건 검사에 typeof 를 활용해 타입을 추려 간다.

### 리터럴 타입
- 구체적인 버전의 원시 타입
- 원시 타입 값 중 어떤 것이 아니라, 특정 원싯값으로 알려진 타입
- 0과 1은 다르고, 'name' 과 'fullName' 도 다르게 인식한다.
- 엄격한 null 검사를 유도한다.

### 타입 별칭
- 재사용하는 타입에 이름을 할당한다.
- type ${내가 쓸 이름} = ${내가 쓸 타입}
- 편의상 타입 별칭은 파스칼 케이스로 작성한다.
- 자바스크립트로 컴파일되지 않는다.
- 결합도 가능하다.

### ex) 유니언 예시
```typescript
let userSaleData: number[] | undefined;
// number array 이거나 undefined 이다.

userSaleData = [123, 456, 789]; // ok
userSaleData = undefined        // ok
userSaleData = ['재고량', '금액']; // fail
```

### ex) 내로잉 예시
```typescript
/*값 할당으로 내로잉*/
let userActiveState: string | undefined;
userActiveState = 'active';

userActiveState.length;      // ok
userActiveState.push();      // fail

/*조건 검사, typeof를 통한 내로잉 */
let ranDomNumber = Math.random() > 0.5
                   ? 'big'
                   : false

ranDomNumber.toUpperCase(); // fail 

if(typeof ranDomNumber === 'string') {
    ranDomNumber.toUpperCase(); // ok
}
```

### ex) 리터럴 타입 예시
```typescript
let masterName: 'seokho';    // string이 아니다 'seokho' 이다.

masterName = 'string 입니다.'; // fail
// TS2322: Type "string 입니다." is not assignable to type "seokho"

```

### ex) 타입 별칭 예시
```typescript
type StrOrNum = string | number;

let responseAmountData: StrOrNum;

// 결합
type Id = number | string;
type ResponseId = Id | null;

```
### 새로 알게된 점
- 리터럴 타입이 뭔지 명확하게 알게 되었다.
- 계속 조건문으로 IDE 가 뱉어내는 타입 에러를 지우기 급급했는데 왜 에러가 안나오게 되는지도 알게 되었고, 그것이 내로잉이라는 걸 알게 되었다.
- 나도 모르는 사이 타입스크립트는 null 의 고통을 안겪어주게 도와주고 있었다.
