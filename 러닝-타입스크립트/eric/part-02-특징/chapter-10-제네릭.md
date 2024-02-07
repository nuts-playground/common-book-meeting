## [ 제네릭 ]

### 핵심 한 줄 요약
    제네릭을 적재적소에 사용하여 안전한 코드, 편한 관리, 재사용성을 높일 수 있다.

### 제네릭의 다양한 정의
- 컴파일 시간에 자료형을 검사해 적당한 자료형을 선택할 수 있게 해주는 것
- 데이터의 타입을 일반화 한다는 것
- 클래스나 메소드에서 사용할 내부 데이터 타입을 컴파일 시에 미리 지정하는 방법
- **데이터의 타입을 클래스 내부에서 지정하는 것이 아닌 외부에서 사용자에 의해 지정되는 것** => 아 이게 제일 잘 와닿는다.

### 타입스크립트에서 제네릭
- 호출하는 방식에 따라 다양한 타입으로 구문이 실행되도록 의도하기 위해 사용한다.
- 매개변수, 반환값 등 타입의 관계를 정의할 수 있다.
- <> 요 안에 타입을 넣어서 정의한다.
- 여러 타입을 넣을 수도 있다.
- <> 요 안에 정의된 타입을 '타입 매개변수' 라고 한다
- 타입 매개변수는 주로 T, U 등 단일 문자나 Key, Value 같은 파스칼 케이스로 작성한다.
- 기본값 즉 기본 타입도 넣어서 작성할 수 있다.

### 제네릭의 장점
- 잘못된 타입이 들어올 수 있는 것을 컴파일 단계에서 방지할 수 있다.
- 외부에서 타입을 지정해주기 때문에 따로 타입을 체크하고 변환해줄 필요가 없다. => 관리가 편하다.
- 코드의 재사용성이 높아진다 => 이거 내가 계속 해보면서 느껴야 할 것 같다 와닿지는 않는다.

### 제네릭의 단점
- 코드가 빠르게 복잡해질 수 있다.
- 사전 지식이 없으면 혼란스럽다.

### 제네릭 - 함수
- 함수명 뒤에 <> 요거 넣는다.
- ex) function test\<T>(input: T) { ... } => 이런 형식이다.
- 명시적 제네릭 타입 인수 => 함수가 정의된 후 \<T> 요 T 안에 명시적으로 타입을 넣으면서 작성한다
- 다중 함수 타입 인수 => \<T, U> 이런식으로 여러개 선언해둔 형식이다.

### 제네릭 - 인터페이스
- 인터페이스 키워드 뒤에 <> 요거 넣는다.
- ex) interface Box\<T> { key: T }
- T에 타입 넣고, 스코프 안에 value 부분에 넣은 타입 리터럴 작성하면 된다!

### 제네릭 - 클래스
- 클래스 이름 뒤에 <> 요거 넣는다.
- ex) class Secret<Key, Value> { ... }
- extends 로 확장도 가능하다. 근데 타입 인수 꼭 넣어줘야 한다.
- 인터페이스 구현할 때도 똑같다. implements 사용 가능하며 타입 인수 꼭 넣어주자.
- static 키워드가 붙은 정적 멤버는 클래스에 선언된 타입 인수를 받을 수 없다. => 왜? 클래스 인스턴스랑 연결이 안되어 있기 때문에

### 제네릭 - 타입 별칭
- 주로 함수의 타입을 설명하는 함수와 자주 사용된다.
- ex) type CreateValue<Input, Output> = (input: Input) => Output;

### 제한된 제네릭 타입
- 제네릭 선언 구문에서 (타입 extends 타입) 이런식으로 선언하면 뒤에 오는 타입으로 타입 매개변수를 제한할 수 있다.
- ex) \<T extends UserInfo> => UserInfo 로 제한
- keyof 와 조합해서 사용할 수도 있다.
- ex) \<T extends keyof UserInfo> => UserInfo 의 키들의 유니언으로 제한

### 갑자기 프로미스?
- 타입스크립트에서 Promise 생성자는 단일 매개변수를 받도록 되어 작성 되어 있다.
- 타입스크립트의 제네릭과 자연스럽게 융합된다고 한다.
- 아 resolve 될 떄의 반환 타입이 필요하다고 생각하니 무슨 말인지 알 것 같다.
- async 함수도 동일하다. => 왜? 자동으로 프로미스를 반환하니까

### 제네릭 황금률 - 제네릭을 유용하게 쓰고 있는가?
- 타입 매개변수가 최소 두 번 이상 사용되었는지 확인한다. => 타입 간의 관계니까 한 군데만 존재하면 크게 효과가 없다.
- 이펙티브 타입스크립트 책에 좀 더 깊게 소개되어 있다고 한다.

### 제네릭 명명규칙 - 표준
- 첫번째 타입 인수 => T
- 후속은 U, V ... 등 단일 문자
- 정보를 좀 더 주고 싶으면 사용되는 타입의 첫글자를 사용하기도 한다.
- ex) Key => K, Value => V

### 제네릭 명명규칙 - 표준 말고
- 사용되는 타입의 첫글자를 사용한다고 했는데 이거 되게 보기 어려울 수 있다.
- 그냥 사용하는 타입 이름 첫글자 따지 말고 전체 다 쓰자
- ex) Key => Key, Value => Value

### ex) 제네릭 기본 형태
```typescript
// 이 말이 무엇이냐 타입인수에 따라 함수 안에서 쓰는 로직의 타입이 결정 된다.
function identity<T>(input: T) {
    return input;
}

identity('seokho') // string 타입으로 추론된다.
identity<string>('seokho') // 이것이 명시적 제네릭 호출 타입 => 그냥 명시하자 이 말이다.

// 이렇게 여러개의 타입인수를 받을 수도 있다.
function makeTuple<First, Second>(first: First, second: Second) {
    return [first, second] as const;
}
```

### ex) 제네릭 인터페이스

```typescript
// 선언
interface Box<T> {
    inside: T;
}

// string 타입을 타입인수로 넣어주고 스코프 안에서 string 리터럴 사용 가능
let stringBox: Box<string> = {
    inside: 'stringBox';
}

// 바로 에러 number 타입 인수라 false 값이 저기에 들어갈 수 없다.
let numberBox: Box<number> = {
    inside: false;
}

// 클래스에도 적용 가능하다.
class Container implements Box<string> {
    inside: string; // Box에 타입 인수 string을 줬으니 여기의 멤버도 동일하게 해야 한다.

    constructor(inside: string) { // 요 부분도 위 주의사항과 마찬가지다.
        this.inside = inside
    }
}
```

### ex) 제네릭 클래스
```typescript
// 선언
class SetData<Key, Value> {
    private readonly _key: Key;
    private readonly _value: Value

    constructor(key: Key, value: Value) {
        this._key = key;
        this._value = value;
    }

    getValue(key: Key): Value | undefined {
        const isNotUndefined = this._key === key;
        return isNotUndefined ? this._value : undefined
    }
    
    ...
}

// 타입 인수 넣어서 new 인스턴스 생성!
const seokhoData = new SetData<string,boolean>('seokhoKey', true)

//확장
class addSecretData<T> extends SetData<string, boolean> {
    private readonly _secret: T;

    constructor(t: T) {
        super('seokho', true);
        this._secret = t;
    }

    getSecretValue(): string {
        return '시크릿 키를 왜 보려고 해 ㅋㅋ 저리가세요';
    }
    
    ...
}
```

### ex) 제네릭 클래스 - 메서드는 생성과 다르게 타입 인수를 받을 수 있다.
```typescript
// 선언
class Create<Key> {
    _key: Key;

    constructor(key: Key) {
        this._key = key
    }
    
    setValue<Value>(value: Value) { // 생성 타입 인수랑 다르게 가능
        return {
            key: this._key,
            val: value,
        }
    }

    static staticGetKey<newKey>(key: newKey) {
        let curKey = Key // 요 부분이 절대 안됨 => 왜? static 키워드는 이 클래스가 생성되는 거랑 관련이 없으니까
    }
}
```

### ex) 제한된 제네릭 타입 => 강제 하자!
```typescript
interface WithLength {
    length: number;
}

// 와 보면 볼수록 좀 괴랄하다.
// 하지만 logWithLength 함수에 length 속성이 없는 케이스를 차단한다.
function logWithLength<T extends WithLength>(input: T) {
    console.log(input.length);
    return input;
}

// keyof를 활용할 수도 있다.
// 이 말이 무슨 말이냐 => T = 찾으려는 대상, Key = keyof T => T의 키 값들 유니언
// 즉 T의 key를 찾아 리턴 시켜주는 함수이며, 사용하려고 할 때 T의 없는 키를 가져오려고 하면 에러가 난다! => 미쳤다
function get<T, Key extends keyof T>(parent: T, key: Key){ 
    return parent[key];
} 
```

### ex) Promise 에서 제네릭
```typescript
// 가능
async function returnString(): Promise<string> { 
    return 'string';
}

// 불가능  => 아니 명시 해줬잖아 => async 함수는 Promise Type을 return하므로 Promise<요기>에 return type을 적어줘야 한다.
async function returnString(): string {
    return 'string';
} 
```

### ex) 제네릭 표준 명명 규칙 - 강제로 안지켜도 된다. 
```typescript
// 음 이게 정석이라는데 T는 타입을 나타내니까 그럴 수 있는데 이거는 너무 알아보기 어렵다.
function labelBox<L, V>(l: L, v: V){ ... }

// 바로 알아보기 힘들 때는 그냥 이렇게 단어 풀로 쓰자!
function labelBox<Label, Value>(label: Label, value: Value){ ... }
```
### 새로 알게된 점
- 제네릭을 그냥 "타입 나중에 할당" 으로 알고만 썻는데 명확하게 알게 된 것 같다.
- 제네릭에서 extends 키워드가 제한을 하는 키워드 라는 걸 새로 알았다.
- 클래스 안에 static 메서드에서는 클래스의 생성 제네릭을 쓰지 못한다는 것을 새로 알았다.
