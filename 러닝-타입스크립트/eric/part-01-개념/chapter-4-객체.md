## [ 객체 ]

### 핵심 한 줄 요약
    앞서 배운 내용을 잘 이해하면 객체도 어렵지 않게 다룰 수 있다.


### 객체 타입
- 객체 리터럴도 생성 가능하지만 나는 별로 선호하지 않는다.
- 생성하고자 하는 객체의 키 들의 타입을 미리 선언한다.
- 해당 키의 속성으로 있는 메서드, 이름만 접근 가능하다.
- 대부분의 타입스크립트 프로젝트는 객체 타입을 interface 키워드를 사용하는 것을 선호한다.
- 속성 누락, 초과 속성은 허용하지 않는다.

### 별칭 객체 타입
- chapter-3 에서 배운 타입 별칭을 활용한다.
- 그냥 객체 타입을 타입 별칭화 해서 사용하면 된다.
- 오류 메시지가 좀 더 읽기 쉬워지는 이점이 있다.

### 구조적 타이핑
- 타입스크립트의 타입 시스템은 구조적으로 타입화 되어있다.
- 정적 시스템이 타입을 검사한다. 즉 먼저 선언 후 선언에 맞춰서 검사한다.
- 선언 후 할당 되는 변수에 현재 타입에 포함되는 키와 타입이 일치하면 통과한다.
- 변수에 바로 에너테이션을 추가하는 걸 좋아하지는 않지만 사용한다면 , 즉 명시한다면 타입의 속성값이 누락, 초과 되어서는 안된다. 바로 에러를 뱉어준다.

### 선택적 속성
- 타입 애너테이션 앞에 ? 을 붙여 선택적 속성임을 명시한다.
- ?를 붙인 속성은 존재하지 않아도 된다. 하지만 undefined 를 포함한 유니언 타입 속성은 선언 목록 중 하나가 반드시 존재해야 한다.

### 객체 타입 유니언
- 객체 타입을 여러개 선언해서 유니언 형태로 나타낸 것
- 타입을 미리 선언을 안하더라도 초기값이 있으면 해당 타입을 자동 유추해준다.
- 각 키에 있는 메서드를 명확히 사용하기 위해 내로잉을 꼭 해주자.

### 객체 타입 내로잉
- 객체 타입을 여러개 선언해서 유니언 형태로 나타낸 것
- 타입을 미리 선언을 안하더라도 초기값이 있으면 해당 타입을 자동 유추해준다.
- 각 키에 있는 메서드를 명확히 사용하기 위해 내로잉을 꼭 해주자.
- ( 판별값 => 객체의 타입이 가리키는 속성 ) 객체의 형태를 공통된 키에 담아두고 사용하면 더욱 좋다. 
- ( '속성' In 변수 ) or ( 변수.type === '속성' )


### 교차 타입
- 교차 타입을 사용해 여러 타입을 동시에 나타낼 수도 있다.
- & 키워드를 사용한다.
- 유용한 개념이지만 코드를 간결하게 유지하지 않으면 혼란을 야기할 수도 있다.
- 원시타입을 교차하면 never 타입이 된다.
- never 타입은 bottom 타입 또는 empty 타입이라고 분리는데 어떤 값도, 참조도 불가능하다.

### ex) 객체 리터럴 예시
```typescript
let payMethod = {
    date: '2024-01-28',
    name: 'seokho',
}

typeof payMethod.date // 접근 가능
typeof payMethod.name // 접근 가능
typeof payMethod.age  // 접근 불가
```

### ex) 객체 타입 선언 예시
```typescript
let payMethod: {
    date: string;
    name: string;
}

payMethod = {
    date: '2024-01-28',
    name: 'seokho'
} // ok

payMethod = {
    date: '2024-01-28',
    name: 'seokho',
    age: 19
} // age 쓰려는 순간부터 바로 에러
```

### ex) 별칭 객체 타입 예시
```typescript
type PayMethod = {
    date: string;
    name: string;
}

type UserInfo = {
    name: string;
    email: string;
    age: number;
}
```

### ex) 구조적 타이핑 예시
```typescript
type UserCardNum = {
    cardNumber: number;
}

type UserCvcNum = {
    cvcNumber: number;
}

const userCardInfo = {
    cardNumber: 1110224045679980,
    cvcNumber: 111
}

let userCardNum: UserCardNum = userCardInfo // cardNumber 키랑 타입이 포함되서 ok
let userCvcNum: UserCvcNum = userCardInfo   // cvcNumber 키랑 타입이 포함되서 ok
```

### ex) 객체 타입 내로잉 예시
```typescript
type PoemWithPages = {
    name: string;
    pages: number;
    type: string;
}

type PoemWithRhymes = {
    name: string;
    rhymes: boolean;
    type: string;
}

type Poem = PoemWithPages | PoemWithRhymes;

const poem: Poem = Math.random() > 0.5
    ? { name: 'seokho', pages: 7, type: 'pages' }
    : { name: 'seokhokim', rhymes: true, type: 'thymes' };


if('pages' in poem) {
    poem.pages;
} else {
    poem.rhymes;
} // in 키워드로 내로잉

if(poem.type === 'pages') {
    console.log(poem.pages)
} else {
    console.log(poem.rhymes)
} // 공통된 키로 속성이 객체의 형태를 나타내게 하고 그것을 추려간다.
```

### ex) 교차 타입 예시
```typescript
type Artwork = {
    genre: string;
    name: string;
}

type Writing = {
    pages: number;
    name: string;
}

type WrittenArt = Artwork & Writing;
// => { gener: string; name: string; pages: number} 와 같다.

// 원시 값 교차 타입 에러
type StringAndNumber = string & number;
let str: StringAndNumber = 'string'  // never 타입으로 변환되어 그 어떤 값도 할당 불가 
let num: StringAndNumber = 123       // never 타입으로 변환되어 그 어떤 값도 할당 불가
```

### 새로 알게된 점
- 판별값을 활용한 내로잉 기법을 새로 알게 되었고, 앞으로 유니언 설계에 써먹어야 겠다.
- 원시 값을 교차 타입으로 선언하면 안되는 이유를 명확하게 알게 되었다.
- 앞에 내용들을 보면서 읽으니 이번 챕터는 유독 막히는 단어 없이 술술 읽힌 것 같다.
