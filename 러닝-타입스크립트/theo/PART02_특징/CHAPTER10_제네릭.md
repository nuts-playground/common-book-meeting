# 제네릭

## 핵심 한 줄 요약

> 함수, 메서드, 클래스 등에서 타입을 활용할 때 타입도 함수의 인수처럼 활용할 수 있다.

## 제네릭 함수

제네릭이란 함수 내부에서 사용할 타입을 함수 외부에서 지정하는 **타입을 변수화 한 기능**이라고 이해할 수 있다.

함수 정의 시 매개변수 바로 앞에 홑화살괄호`(<, >)`로 묶인 타입 매개변수에 별칭일 배치하여 함수를 제네릭으로 만든다.

이때 타입 매개변수는 전형적으로 T나 U 혹은 Key, Value와 같은 파스칼 케이스 이름을 갖는다.

```javascript
function identity<T>(input: T) {
    return input;
}

const numeric = identity("me"); // 타입: "me"
const stringy = identity(123); // 타입: 123
```

### 명시적 제네릭 호출 타입

앞 서 본 예시에서는 인수로 받은 값의 타입이 곧 타입 인수이기에 타입스크립트는 해당 정보를 통해 타입 인수를 유추할 수 있다. 하지만 모든 코드가 타입 인수를 유추하기 위한 충분한 정보를 갖고 있는 것은 아니다. 따라서 명시적 제네릭 타입 인수를 사용하여 함수를 **호출**할 수 있다.

```javascript
function someFunction<T>(input: T) {
    return input;
}

someFunction<string>("Theo");
```
> 위 예시에서는 인수의 타입을 기준으로 타입 인수를 유추할 수 있으나 명시적 제네릭 타입의 예시를 나타내기 위해 사용

### 다중 함수 타입 매개변수
타입 매개변수 역시 여러 개를 선언할 수 있다. 이때 쉼표`(,)`로 구분하여 선언한다.

```javascript
function makeTuple<First, Second>(first: First, second: Second) {
    return [first, second] as const;
}

// 타입: readonly ["Theo", boolean]
const tuple makeTuple("Theo", true);
```

다중 함수 타입 매개변수를 사용한 경우 만약 해당 함수를 호출할 때 호출 타입을 명시적으로 지정한다면 두 타입 모두 작성해야 한다.

## 제네릭 인터페이스
타입스크립트에서 인터페이스는 제네릭으로 선언할 수도 있다. 이때 인터페이스 이름 뒤에 타입 매개변수를 선언해준다.

```javascript
interface Box<T> {
    inside: T;
}

const stringBox: Box<string> = {
    inside: "abc",
};

const numberBox: Box<number> = {
    inside: 123,
};

const incorrectBox: Box<number> = {
    inside: false,
    // Type 'boolean' is not assignable to type 'number'.
};
```

## 제네릭 클래스
클래스도 인터페이스처럼 타입 매개변수를 선언할 수 있다.
```javascript
class Secreat<Key, Value> {
    key: Key;
    value: Value;

    constructor(key: Key, value: Value) {
        this.key = key;
        this.value = value
    }

    getValue(key: Key): Value | undefined {
        return this.key === key ? this.value : undefined;
    }
}

const storage = new Secreat(12345, "luggage") // 타입: Secret<number, string>

storage.getValue(1987); // 타입: string | undefined
```
앞서 봤던 것과 동일하게 타입 변수가 constructor 매개변수 타입, 메서드의 매개변수, 반환 타입으로 사용되었다.

### 명시적 제네릭 클래스
인터페이스와 마찬가지로 제네릭 클래스 역시 constructor에 전달된 인수의 타입을 기준으로 유추된 타입을 사용하는데 해당 정보로 클래스 타입을 유추할 수 없는 타입 인수의 기본 타입은 `unknown`이 된다. 따라서 타입스크립트가 타입 인수의 타입을 알 수 있도록 명시적으로 제공해야한다.

```javascript
class Secreat<Key, Value> {
    key: Key;
    value: Value;

    constructor(key: Key, value: Value) {
        this.key = key;
        this.value = value
    }

    getValue(key: Key): Value | undefined {
        return this.key === key ? this.value : undefined;
    }
}

const storage = new Secreat<number, string>(12345, "luggage");
```
> 위 예시에서는 인수의 타입을 기준으로 타입 인수를 유추할 수 있으나 명시적 제네릭 타입의 예시를 나타내기 위해 사용

### 제네릭 클래스 확장
제네릭 클래스는 클래스 확장 시 기본 클래스로 사용할 수 있다. 이때 타입스크립트는 기본 클래스에 대한 타입 인수를 유추하지 않기 때문에 기본값이 없는 타입 인수는 명시적 타입 애너테이션을 사용해 지정해야 한다.

```javascript
class Quote<T> {
    lines: T;

    constructor(lines: T) {
        this.lines = lines;
    }
}

class SpokenQuote extends Quote<string[]> {
    speak() {
        console.log(this.lines.join("\n"));
    }
}

new Quote("안녕하세요").lines;
new Quote([4, 1, 2]).lines;

new SpokenQuote([
    "안녕하세요",
    "반갑습니다."
]).lines;

new SpokenQuote([1, 2, 3, 4]);
// Type 'number' is not assignable to type 'string'.
```

위 코드에서 `Quote`는 제네릭 클래스이므로 constructor의 인수를 기준으로 타입 인수를 유추하지만 이 클래스를 기본 클래스로 하여 다른 클래스를 만들 때는 타입스크립트에서 타입 인수를 유추하지 않으므로 타입 애너테이션으로 `string[]`를 전달했다. 따라서 `SpokenQuote`의 경우 constructor의 인수로 `string[]`만 받을 수 있는 것이다.

### 제네릭 인터페이스 구현
클래스 정의 시 인터페이스를 사용할 경우 제네릭 클래스를 기본 클래스로 사용하는 것과 유사하게 작동한다.

```javascript
interface ActingCredit<Role> {
    role: Role;
}

class MoviePart implements ActingCredit<string> {
    role: string;
    speaking: boolean;

    constructor(role: string, speaking: boolean) {
        this.role = role;
        this.speaking = speaking
    }
}

const part = new MoviePart("Miranda Priestly", true);
part.role; // 타입: string

class incorrectExtension implements ActingCredit<string> {
    role: boolean;
    // Property 'role' in type 'incorrectExtension' is not assignable to the same property in base type 'ActingCredit<string>'. 
    // Type 'boolean' is not assignable to type 'string'.
}
```

### 메서드 제네릭
클래스 메서드는 제네릭 클래스와 별개로 함수처럼 자체 제네릭 타입을 가질 수 있다.

```javascript
class CreatePairFactory<Key> {
    key: Key;

    constructor(key: Key) {
        this.key = key;
    }

    createPair<Value>(value: Value) {
        return {key: this.key, value};
    }
}
```

### 정적 메서드 제네릭

클래스의 정적 메서드 즉, static 메서드는 앞서 본 것과 같이 제네릭 타입을 가질 수 있지만, 클래스 자체에 선언된 타입 매개변수에 접근할 수 없다는 특징이 있다.

```javascript
class CreatePairFactory<Key> {
    key: Key;

    constructor(key: Key) {
        this.key = key;
    }

    static createPair<Value>(value: Value) {
        let key: Key
        // 정적 메서드는 클래스 자체의 타입 매개변수에 접근할 수 없다.
    }
}
```

## 제네릭 타입 별칭

타입스크립트의 타입 별칭을 선언할 때 타입 인수를 사용하여 선언할 수 있다. 이러한 타입 별칭은 주로 제네릭 함수의 타입을 설명할 때 사용한다.

```javascript
type CreatesValue<Input, Output> = (input: Input) => Output;

let creator: CreatesValue<string, number>;

creator = text => text.length;

creator = text => text.toUpperCase();
// Type 'string' is not assignable to type 'number'.
```

### 제네릭 판별된 유니언
4장, 객체에서 봤던 판별된 유니언의 사용법 중 필자는 데이터의 성공적인 결과 또는 오류로 인한 실패를 나타내는 제내릭 결과 타입을 만드는 것을 좋아한다고 한다. 

```javascript
type Result<Data> = FailureResult | SuccessfulResult<Data>;

interface FailureResult {
    error: Error;
    succeeded: false;
}

interface SuccessfulResult<Data> {
    data: Data;
    succeeded: true;
}

function handleResult(result: Result<string>) {
    if(result.succeeded) {
        console.log(`We did it! ${result.data}`);
    } else {
        console.log(`Awww... ${result.error}`);
    }

    result.data;
    // Property 'data' does not exist on type 'Result<string>'.
    // Property 'data' does not exist on type 'FailureResult'.
}
```



## 제네릭 제한자

타입스크립트는 제네릭 타입 매개변수의 동작을 수정하는 구문을 제공한다.

### 제네릭 기본값

함수의 매개변수의 기본 값을 지정하듯이 타입 매개변수 역시 기본 타입을 명시적으로 제공할 수 있다.

```javascript
interface Quote<T = string> {
    value: T;
}

// 타입 인수를 number로 지정했기에 에러가 나지 않는다.
let explicit: Quote<number> = { value: 123 };

// 타입 인수를 지정하지 않았기에 기본 타입인 string으로 지정됐기에 에러가 나지 않는다.
let implicit: Quote = { value: "생산성 : 어떤 사람들은 다른 사람들보다 5배나 우수하다디버깅 : 어떤 사람들은 다른 사람들보다 28배나 우수하다." };

// 타입 인수를 지정하지 않았기에 기본 타입인 string으로 지정됐기에 에러가 발생한다.
let mismatch: Quote = { value: 123 };
// Type 'number' is not assignable to type 'string'.
```

## 제한된 제네릭 타입
타입스크립트는 타입 매개변수가 타입을 확장해야 한다고 선언할 수 있다. 이때 타입 매개변수 이름 뒤에 `extends`키워드를 배치한 후 그 뒤에 제한할 타입을 배치한다.

```javascript
interface WithLength {
    length: number;
}

function logWithLength<T extends WithLength>(input: T) {
    console.log(`Length: ${input.length}`);
    return input;
}

logWithLength("No one Can figure out your worth but you"); // 타입: string
logWithLength([false, true]);
logWithLength({length: 123});

logWithLength(new Date());
// Argument of type 'Date' is not assignable to parameter of type 'WithLength'.
// Property 'length' is missing in type 'Date' but required in type 'WithLength'.
```

위 코드에서는 타입 매개변수 `T`는 `WithLength`인터페이스로 확장하여 `legnth: number`를 가진 캑체에 대한 타입을 받을 수 있도록 구현하였다.


## Promise

## 제네릭 올바르게 사용하기

타입스크립트에서 제네릭 사용 시 코드를 지나치게 복잡하게 만들 수 있으니 제네릭은 필요할 때만 사용해야한다.

### 제네릭 명명 규칙

첫 번째 타입 인수를 `T`로 사용하고 후속 타입 매개변수가 존재할 경우 `U`, `V`를 사용한다.

타입 인수가 어떻게 활용되는지 정보가 알려진 경우 경우에 따라 해당 용어의 첫 글자를 사용하기도 한다.

ex) State는 S, Key는 K, Value는 V

하지만 단일 문자로 제네릭의 의도가 제대로 파악되지 않는 경우 설명적인 이름을 붙이는 것이 가장 좋다.

## 회고

제네릭이라는 용어가 주는 생소함 때문에 지레 겁먹었는데 막상 내용을 보고 나니 의외로?! 간단한 개념이었다(물론 내가 깊게 이해하지 못하고 얕게 이해해서 그런 거겠지만). 타입 인수! 타입 매개변수! 라고 생각하니 간단하게 이해되었다. 

react의 useState에서 쓰던 `useState<string>("")` 이런 구문들이 뭔지도 모르고 쓰고 있었는데 이제는 알고 쓸 수 있겠다.

Promise 관련 제네릭은 이해가 정말 안됐다.
