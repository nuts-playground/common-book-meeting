## [ 타입 제한자 ]

### 핵심 한 줄 요약
    top 타입의 개념을 알고, 서술어, 연산자를 활용해 안전한 코드를 작성하며, 필요한 상황에만 어서션을 적절하게 사용하자 

### top 타입
- 시스템에서 가능한 모든 값을 나타내는 타입
- 모든 타입은 top 타입에 할당할 수 있다.
- 이 책에서는 any 타입, unknown 타입을 가지고 설명한다.
- instanceof, typeof 로 타입을 좁혀가며 사용한다.

### top 타입 - any 타입
- 모든 타입의 위치에 제공될 수 있다는 점에서 top 타입처럼 작동한다.
- console.log()의 매개변수 같이 모든 타입의 데이터를 받을 때 사용한다.
- 해당 값에 대한 할당 가능성, 타입 검사를 수행 하지 않도록 명시적으로 지시한다는 문제를 가진다. => 안전하지 않다, 유용성이 줄어든다.
- 어떤 값이 될 수 있다를 나타내려면 unknown 타입이 훨씬 안전하다.

### top 타입 - unknown 타입
- 진정한 top 타입이다.
- 모든 객체를 unknown 타입의 위치로 전달할 수 있다. => any 와 유사하다.
- 타입스크립트는 unknown 타입의 값의 속성에 직접 접근할 수 없다.
- unknown 타입은 top 타입이 아닌 타입에는 할당할 수 없다.

### 타입 서술어
- 인수가 특정 타입인지 여부를 나타내기 위해 식별할 수 있는 값을 반환하는 함수 => 타입 서술어, 사용자 정의 타입 가드 라고 부른다.
- 너무 디테일한 검사 로직을 안에 넣으면 잘못 사용하기 쉽다. 간단하게만 작성하도록 하자

### 타입 연산자
- 키워드나 기존 타입의 이름만 사용해 모든 타입을 나타낼 수는 없다.
- 기존 타입의 속성 일부를 변환해서 판별을 해야할 상황이 있다.
- keyof, typeof 를 결합해 사용하는 법을 이 책은 설명한다.

### 타입 연산자 - keyof
- 객체의 키를 사용해서 무언가를 하려고 할 때 그 객체의 멤버가 무수히 많다면 표현하기가 상당히 까다롭다 => 무한 리터럴 유니언을 때리는데 너무 비효율적이다.
- keyof 연산자를 사용하면 해당 객체의 모든 키의 조합을 반환하며, 객체가 변경되더라도 수동으로 업데이트 해 줄 필요가 없다.
- ex) (key: keyof TargetObject) => TargetObject 의 키 들을 key 에 할당

### 타입 연산자 - typeof
- 객체 멤버들의 타입을 모두 반환해준다.
- js 의 typeof 와 다르다. => JS는 단순히 타입에 대한 문자열 이름을 반환 해준다.
- ex) (typeof TargetObject) => {key1: keyType, key2: key2Type ...}

### 타입 연산자 - keyof, typeof 결합
- typeof => 값의 타입을 검색
- keyof  => 타입에 허용된 키를 검색
- ex) (key: keyof typeof TargetObject) => TargetObject 의 허용된 키만 검색, 접근 할 수 있다!

### 타입 어서션
- 경우에 따라서는 타입 시스템에 정확하게 알리는 것이 불가능 할 때도 있다.
- 타입 캐스트 라고도 부르며 타입 시스템은 어서션을 따르고 값을 해당 타입으로 처리한다.
- 즉 작성자가 강제로 타입을 선언해준다.
- ex) JSON.parse(rawData) as string[]
- 가능한 타입 어서션을 사용하지 않는 것이 좋다. 하지만 유용할 떄도 있다.
- 이중 타입 어서션 기법도 있지만 피하자.

### 타입 어서션 유용한 경우 - 포착된 오류 타입
- try catch 구문에서 catch 블록에 포착된 오류의 타입을 아는 것은 진짜 힘들다.
- catch 문을 타고온 콜백 인자를 as Error 처리하면 편하게 처리할 수 있다 => instanceof 검사를 하는 것이 더 안전하다.

### 타입 어서션 유용한 경우 - non-null 어서션
- 실제가 아니라 이론적으로만 null 또는 undefined 를 포함할 수 있는 변수에서 null, undefined 를 제거할 때 유용하다.
- ! 키워드를 사용해 null, undefined 를 제외한 전체 타입을 대신 한다.

### const 어서션
- 배열, 원시 타입, 값, 별칭 등 모든 값을 상수로 취급해야 할 때 사용한다.
- 배열에 사용하면 가변 배열이 아니라 읽기 전용 튜플로 취급된다.
- 리터럴은 원시 타입이 아니라 리터럴로만 취급된다.
- 객체의 속성은 읽기 전용이 된다.
- 리터럴 to 원시 타입, 읽기 전용 객체를 이 책에서는 소개한다.

### ex) top 타입
```typescript
// any 타입 => 모든 타입의 위치를 받아들인다.
// 모든 타입 다 할당할 수 있다.
let anyValue: any;

// 근데 이러면 에러가 안난다 주의해야 한다. => unknown 타입을 쓰도록 해보자
anyValue = 123;
anyValue.toUpperCase();

//unknown 타입
let unknownValue: unknown;

unknownValue = 123;
unknownValue.toUpperCase() // => 와 이러면 바로 unknown 타입에 쓸 수 없는 메서드라는 에러가 뜬다.

// 이렇게 명확하게 내로잉 해주면 사용 가능하다! => any 보다 훨씬 안정적이다.
if(typeof unknownValue === 'string') {
    unknownValue.toUpperCase()
}

// instanceof 키워드로도 판별 가능하다 => (변수 instanceof 최상위 패키지) => 근데 주로 엘리먼트 요소에 많이 쓴다.
let unknownValueCheckString = unknownValue instanceof String;
```

### ex) 타입 서술어
```typescript
interface NormalUserInfo {
    name: string;
    age: number;
}

interface ManagerUserInfo {
    name: string;
    age: number;
    authNum: number;
}

// 요놈이 타입 서술어
// true면 ManagerUserInfo 타입, 아니면 NormalUserInfo 타입 
function isManager(userInfo: NormalUserInfo | ManagerUserInfo) {
    return (userInfo as ManagerUserInfo).authNum !== undefined;
}

const reqUserInfo = {
    name: 'seokho',
    age: 28,
    authNum: 12345
}

isManager(reqUserInfo) // true가 나온다.
```

### ex) 타입 연산자 - keyof
```typescript
// keyof

interface Ratings {
    audiencs: number;
    critics: number;
}

// 이렇게 키에 접근해야 하는데 2개니까 망정이지 10개면 벌써 피곤하다.
function getCountKeyof(ratings: Ratings, key: 'audiencs' | 'critics'): number {
    return ratings[key];
};

// key: keyof Ratings 요 부분이 중요하다 
// key => Ratings의 audiencs | critics 가 할당된다.
function getCountKeyof(ratings: Ratings, key: keyof Ratings): number {
    return ratings[key];
};


const ratings: Ratings = {
    audiencs: 66,
    critics: 95,
};

getCountKeyof(ratings, 'audiencs') // 이러면 66이 반환된다.
```

### ex) 타입 연산자 - typeof
```typescript
// typeof

const original = {
    name: 'seokho',
    age: 123
}

//  {name: string, age: number} 으로 인식되어서 사용할 수 있다.
const after = typeof original;
```

### ex) 타입 연산자 - keyof typeof 결합
```typescript
const ratings = {
    imdb: 8.4,
    metacritic: 82,
}

//  keyof typeof 를 사용해 ratings 값의 키 중 하나여야 함을 나타낸다.
function logRating(key: keyof typeof ratings) {
    console.log(ratings[key])
}

logRating('imdb'); // 노 에러
logRating('seokho'); // 작성하면 바로 에러
```

### ex) 타입 어서션 - 가급적 쓰지 않도록 하자
```typescript
const rawData = "['grace','frankie']";
JSON.parse(rawData) // => any 타입으로 취급된다.

JSON.parse(rawData) as string[] // => 이렇게 명시해주자

// 다만 이렇게 오류 타입에는 쓸만하다.
try {
    ... // 에러가 터짐 펑
} catch (e) {
    console.warn('error', (e as Error).message)
}

// 이렇게 not-null 즉 null과 undefined를 강제로 없앨 수도 있다.
let maybeDate = Math.random() > 0.5 ? undefined : new Date();

maybeDate as Date;

maybeDate!
```

### ex) const 어서션
```typescript
// 모든 값을 상수로 만들 때 사용한다.
// 이 예시는 배열에 적용해서 튜플이 된다.
[0, ''] // => 타입으로 치면 (number | string)[]
[0, ''] as const // => 타입으로 치면 [0, '']

// 리터럴 to 원시 타입
const getName = () => 'seokho'; // string을 반환하는 함수 타입
const getNameConst = () => 'seokho' as const; // 'seokho'를 반환하는 함수 타입

// 객체에 사용하면 읽기 전용 으로
const userInfo = {
    name: 'seokho',
    age: 28,
} as const; // => 모든 속성이 readonly로 변한다.

userInfo.name = 'eric' // 바로 에러 readonly 제한 속성에 수정은 금지 되어 있다.
```

### 새로 알게된 점
- top 타입의 명확한 정의를 알게 되었고 unknown 타입을 잘 활용해서 코드를 작성할 수 있을 것 같다.
- 타입 서술어 => 내가 만드는 타입 가드 느낌으로 잘 외우고 있어야 겠다.
- keyof, typeof 가 TS 에서 어떻게 쓰이는지 알게 되었다.
- as 키워드가 어떤 의미인지 알게 되었고 최대한 안쓰도록 노력해야겠다.
