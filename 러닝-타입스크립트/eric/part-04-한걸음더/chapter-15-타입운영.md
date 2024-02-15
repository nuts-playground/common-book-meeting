## [ 타입 운영 ]

### 핵심 한 줄 요약
    여기서 소개하는 방법으로 멋지게 타입을 운영하고, 이 방법이 쓰이지 않도록 읽기 쉬운 좋은 코드를 작성해보자.

### 타입 운영?
- 용어 자체가 와닿지가 않는다.
- 검색을 이것저것 해보니 '코드의 타입을 다루고 관리하는 과정 전반을 의미하는 것' 으로 이해하고 읽어보면 될 것 같다.
- 이 챕터에서 소개하는 다양한 방법을 너무 많이 적용시키면 코드가 읽기 어려워질 수 있다고 한다.

### 매핑된 타입(Mapped Type)
- 다른 타입의 속성을 기반으로 새로운 타입을 생성하는 방법
- 제네릭과 같이 사용하는게 아주 강력하다고 한다.
- 중복을 방지할 수 있는 특징이 있다.
- readonly, optional 같은 제한자를 변경하면서 새로운 타입을 생성할 수도 있다.
- 인덱스 시그니처에 안에 사용하려고 하는 상위 타입의 시그니처는 메서드 구문, 속성 구문을 구분하지 않는다.

### 조건부 타입(Conditional Type)
- 입력된 타입의 조건에 따라 결정되는 타입
- ex) T extends TargetType ? TrueType : FalseType => 요런식으로 삼항 연산자 같은 형태이다.
- 제네릭을 적용할 수도 있다.
- 위에 매핑된 타입을 안에 넣어서 사용할 수도 있다.

### 분산 조건부 타입
- 제네릭에 유니언 타입을 할당하면 추론되는 형태이다.
- 어떻게 작동하는지 예제에 작성을 잘 해놔야겠다. => 어우 복잡해...

### 조건부 타입 추론
- extends 절 뒤에 infer 키워드를 사용하여 임의의 부분에 접근할 수 있다. 
- ex) T extends (infer I)[] ? I : never => 아 복잡하다...
- 들어오는 타입이 조건부 타입의 infer 의 형식과 일치할 경우 true 의 타입 아니면 else 의 타입으로 진행한다.  

### never 활용법
- never 를 유니언과 교차 타입에 섞어서 사용할 수도 있다.
- 조건부 타입과 결합해서 false 인 경우를 절대 방어할 때 유용하게 쓸 수 있다.

### 템플릿 리터럴 타입
- 문자열의 패턴을 검사하기 위해 사용하는 예제를 소개하고 있다.
- ex) type Greeting = \`Hello${string}` => Hello 로 시작하는 패턴!
- 원시값으로 된 타입을 위에 예제처럼 할당시켜 사용도 가능하다 => \`Hello${할당할 리터럴 Type}`
- 문자열의 경우 고유 제네릭 유틸도 들어있다.
  - Uppercase\<문자열>: 대문자로 문자열을 변환한다. 
  - Lowercase\<문자열>: 소문자로 문자열을 변환한다. 
  - Capitalize\<문자열>: 문자열의 첫번째 문자를 대문자로 변환한다. 
  - Uncapitalize\<문자열>: 문자열의 첫번째 문자를 소문자로 변환한다.
- 위에 매핑된 타입에 넣어서 사용할 수도 있다. => \[K in \`check${할당할 리터럴 Type}`]: () => boolean;

### 이거 전부 좀 복잡하긴 하다..
- 글쓴이는 소개한 타입 운영이 강력한 기능이지만 최소한으로 사용하기를 바란다.
- 코드를 읽는 측면에서 어려워지므로 좀 길어지더라도 쉬운 구문들과 함께 잘 조합해서 멋지게 작성해보자.

### ex) 매핑된 타입
```typescript
// 일반 유니언과 인덱스 시그니처로
type Animals = 'dog' | 'cat';

type AnimalCounts = {
    [K in Animals]: number;
} 
// 위에 구문이 아래처럼 바뀐다 오오
/*
* type AnimalCounts = {
*   dog: number;
*   cat: number;
* }
* */

// 타입과 인덱스 시그니처로
interface AnimalInterface {
    dog: string;
    cat: string;
    call: () => void;
}

type AnimalCounts = {
    [K in keyof AnimalInterface]: number;
}
// 위에 구문이 아래처럼 바뀐다 오오
/*
* type AnimalCounts = {
*   dog: number;
*   cat: number;    
*   call: number
* }
* */

// 제한자를 변경할 수도 있다.
interface AnimalInterface {
    dog: string;
    cat: string;
    call: () => void;
}

type ReadOnlyAnimalCounts = {
    // 와 readonly 추가
    readonly [K in keyof AnimalInterface]: number;

    // 와 옵셔널 추가
    [K in keyof AnimalInterface]?: number;

    // 와 이러면 AnimalInterface 에 readonly 키워드가 있을 때 그걸 빼버릴 수 있다.
    -readonly [K in keyof AnimalInterface]: number;

    // 와 이러면 AnimalInterface 에 옵셔널 키워드가 있을 때 그걸 빼버릴 수 있다.
    [K in keyof AnimalInterface]-?: number;
}

// 궁합이 좋은 제네릭
type MakeReadonly<T> = {
    readonly [K in keyof T]: T[K];
}

interface Species {
    genus: string;
    name: string;
}    

type ReeadonlySpecies = MakeReadonly<Species>;
// 이러면 이렇게 바뀐다.
/*
* type ReeadonlySpecies = {
*   readonly genus: string;
*   readonly name: string;
* }
* */
```

### ex) 조건부 타입
```typescript
// 무조건 false 이지만 요런 형식이다.
// extends Type ? 키워드가 핵심이다.
type CheckStringAgainsNumber = string extends number ? true : false;

// 제네릭과 함께
type CheckAgainsNumber<T> = T extends number ? true : false;

// false로 탄다
type CheckString = CheckAgainsNumber<'김석호'>;

// true로 탄다.
type CheckNumber = CheckAgainsNumber<12345>;

```

### ex) 조건부 타입의 분산
```typescript
type CheckString<T> = T extends string ? true : false;
// 자 요런 식으로 유니언을 조건부 타입에 넣어보자
type TestType = CheckString<string | number>;

/*
* type TestType = true 를 기대하지만 아니다.
* type TestType = true | false 가 된다.
* */

// ** 주의점
// 맨 위와 같은 타입이 아니다 이건
type CheckString = string | number extends string ? true : false;
/*
* type CheckString = false가 된다.
* 왜? => 조건부 타입은 naked type parameter 가 사용된 경우에만 분산 된다.
* naked type parameter => T 처럼 의미없는 명시적 타입 => 리터럴 타입이나 T[] 처럼 변환된 타입은 아니다.
* */
```

### ex) 조건부 타입의 추론
```typescript
// infet 키워드
// 여기서 U는 그저 접근 가능 타입 변수
ex) => T extends infter U ? true : false;

// 그냥 T가 Type[] 니? 그러면 Type이 할당되고 아니면 T 에 넣은게 할당
type ArrayItems<T> =  T extends (infer U)[] ? U : T;

// 책에 예제가 너무 좋게 설명되어 있다.
// type StringItem = string
type StringItem = ArrayItems<string>;
// type StringArrayItem = string
type StringArrayItem = ArrayItems<string[]>;
// type String2ArrayItem = string[]
type String2ArrayItem = ArrayItems<string[][]>;
```

### ex) Again never
```typescript
// 교차 타입, 유니언 타입과 같이 쓸 수도 있다.
type NeverAndString = never & string;
type NverOrString = never | string;

// 조건부 타입에서 쓰면 never가 할당되는 쪽을 강력하게 막을 수 있다.
// never 쪽으로 타면 할당이 전혀 안된다 string 만 가능
type OnlyString<T> = T extends string ? T : never;
```

### ex) 템플릿 리터럴
```typescript
type HelloStringCheck = `Hello ${string}`;

let checkSeokho: PattenCheck = "Hello seokho" // 가능가능

let checkEric: PattenCheck = "Hi Eric" // 불가능 Hello로 시작해야함

// 인덱스 시그니처에 활용도 가능
type DataKey = 'location' | 'name' | 'year';

type KeyChangeFunction = {
    [K in `check-${DataKey}`]: () => boolean;
}
/*
* 이렇게 바뀐다
* {
*   check-location: () => boolean;
*   check-name: () => boolean;
*   check-year: () => boolean;
* }
* */
```


### 새로 알게된 점
- 포괄적이지만 이 챕터에서 소개하는 다양한 응용 쓰임새를 알게 되었다.
- 조건부 타입에서는 나오는 extends 키워드는 앞에 타입 제한 용도로 쓰이는 것과 잘 구분해서 사용해야겠다.
- 조건부 타입이 분산되는 경우를 이번에 알게 되어서 키워드인 'naked type parameter' 를 꼭 기억해야 겠다.
- never 가 살짝 아쉽게 이해 됐는데 이제는 좀 더 잘 쓸 수 있을 것 같다.
- 템플릿 리터럴 제네릭의 다양한 유틸이 들어 있다는 것도 알게 되서 유용하게 쓸 수 있을 것 같다.
