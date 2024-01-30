## [ 배열 ]

### 핵심 한 줄 요약
    TS에서 타입 시스템이 취약한 부분이 특히 배열 부분이므로 우리가 아는 배열(가변) 과 튜플의 차이를 이해하고 사용하자.

### 기존의 JS는 ...
- 기존의 자바스크립트의 배열은 유연하고 내부에 모든 타입의 값을 혼합해서 저장할 수 있다.
- 벌써부터 어지럽다. TS로 가자

### TS는 ...
- 초기 배열에 어던 타입이 있는지 기억하고, 배열이 해당 타입에서만 작동하도록 제한한다.
- 다른 변수 선언과 마찬가지로 초기값이 필요하지 않다.

### 내가 싫어하지만 친해져야 할 것 같은 스프레드
- 배열을 결합할 때, 객체의 깊은 복사 등 문법이 너무 간결하다.
- 이제는 고집을 꺾고 친해져야겠다.
- 스프레드로 결합한 배열 변수는 (유니언[]) 으로 유추된다.

### 튜플
- TS 에서 튜플은 '길이와 각 요소마다의 타입이 고정된 배열' 로 정의 할 수 있다.
- 사용할 때 배열 리터럴 처럼 보이지만 요소의 값 대신 타입을 적는다.
- 구조분해 할당에 쓰기 좋다.

### TS 에서 배열 다룰 때 주의사항
- 타입 시스템의 타입 이해가 기술적으로 완벽하지 않다.
- 특히 배열을 다룰 때 조심해야 한다. 
- 왜냐? 배열의 멤버가 존재하는지 의도적으로 검사하지 않는다.
- 예시를 꼭 보고 충격받아 보자.

### any 배열
- 처음에 []만 선언해주면 any 배열이 된다.
- 값을 추가할 때마다 그 값을 포함시키는 유니언 배열 타입으로 자동 추론해준다.
- 타입 검사 목적을 부분적으로 무효화한다. => 주의 해서 사용해야 할 것 같다.

### 다차원 배열
- 단어부터가 머리 아프다. 하지만 [] 만 잘 쓰면 문제 없다.
- ex) 2차원 => TYPE[][]
- ex) 3차원 => TYPE[][][]
- ec) n차원 => TYPE([] * n개)

### ex) 배열 타입
```typescript
// 타입[] 형태를 띈다.
let arrayOfNumbers: number[];
let arrayOfString: string[];
let arrayOfBoolean: boolean[];

// string 배열을 반환하는 함수라는 타입 명시 예시
let createStrings: () => string[];

// string 또는 number 배열을 반환하는 함수라는 유니언 타입 명시 예시
let stringOrArrayOfNumbers: (string | number)[];

// 안에 있는 놈들 바탕으로 추론도 자동으로 해준다.
const namesMaybe = [
    'seokho',
    'tim',
    undefined
]   // 이러면 (string | undefined)[] 로 추론해준다.
```

### ex) any 배열 타입 추론 과정
```typescript
let values = [];        // 이 때는 any[]

values.push('seokho');  // 이 때는 string[]
values.push(123);       // 이 때는 (number | string)[]
```

### ex) 다차원 배열
```typescript
let e차원넘버배열: number[][];

let sam차원넘버배열: number[][][];

let sa차원스트링배열: string[][][][];
```

### ex) 주의사항 예시
```typescript
let testLog: (input: string[]) => void

testLog = (input) => {
    console.log(input[555].length);
}

testLog(['seokho1', 'seokho2', 'seokho3']) 
// 엥 왜 이거 에러가 안나?! => 배열의 멤버가 존재하는지 검사 안한다. => 조심해서 써야한다.
```

### ex) 튜플 예시
```typescript
// 길이 2에 타입이 joinAmount[0]: number, joinAmount[1]: string로 고정되어 있다.
let joinAmount: [number, string];
joinAmount = [50000, '원'];


// 명시적 튜플 타입
function firstCharAndSizeExplicit(input: string): [string, number] {
    return [input[0], input.length];
}
const [firstChar, size] = returnSplitAmount('My name is seokho');

// const 어서션 => as
const unionArray = [1157, 'Tom'] // (string | number)[]; => 수정 가능
const readonlyTuple = [1157, 'Tome'] as const; // readonly [1157, 'Tom']; => 수정 불가, 읽기 전용
```

### 새로 알게된 점
- 튜플이 뭔지 너무 아리송 했는데 책에서도 보고 인터넷에서 찾아보고 하니까 좀 더 감이 잡히는 것 같다. (완벽하지는 않다.)
- 배열은 타입 시스템이 완전히 커버 못한다는 걸 처음 알았다. 분기 처리 및 유효성 검사에 신경을 많이 써야 할 것 같다.
- as 키워드를 as string, as number 이런 식으로만 사용했는데 as const 의 쓰임새를 새로 알았다.
