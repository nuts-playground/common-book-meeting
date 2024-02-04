# 클래스

## 핵심 한 줄 요약

> 클래스의 경우 앞서 본 다른 내용들보다 훨씬 복잡한 개념들이 많다. 특히 타입스크립트 이전에 자바스크립트 클래스에 대한 이해도가 충분히 있어야 접근 제한, 추상화, 하위 클래스와의 관계에서 생기는 타입 관련 문제들을 관리할 수 있다.

## 클래스 메서드

타입스크립트에서 함수를 정의하는 것과 동일한 방식으로 클래스 메서드를 정의할 수 있다.

```javascript
// 타입 별칭 구문
class Person {
    sayHello(name: string) {
        console.log(`Hello, ${name}`);
    }
}

new Person().sayHello("Theo");
new Person().sayHello();
```

위 코드에서 앞서 함수를 정의하던 것과 동일한 방식으로 클래스 `Person`의 `sayHello`메서드를 정의하고 있다.

## 클래스 속성

타입스크립트에서 클래스의 속성을 사용하기 위해서는 클래스 내부에 명시적으로 선언을 해야한다.

```javascript
// 타입 별칭 구문
class Person {
    // 사용할 클래스 속성 name과 age를 명시적으로 선언했다.
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;

        // date의 경우 명시적으로 선언을 하지 않았기 때문에 타입 에러가 발생한다.
        this.date = new Date(); // NO
    }
}

const theo = new Person("theo", 27);
theo.date; // NO
// 당연히 명시적으로 선언하지 않은 속성에 접근할 경우 에러가 발생한다.
```

### 함수 속성

앞서 인터페이스에서 봤던 메서드 구문과 속성 구문의 차이점을 한 번 더 짚고 가자 앞서 클래스 메서드에서 본 구문은 메서드 구문으로 해당 방식으로 선언된 함수, 즉 메서드는 클래스의 모든 인스턴스가 참조할 수 있는 메서드가 된다.

```javascript
class Person {
    sayHello() {
        console.log("Hello");
    }
}

new Person().sayHello === new Person().sayHello; // true
```

속성 구문으로 선언된 메서드는 클래스의 각 인스턴스마다 새로운 함수가 새롭게 생성된다.

```javascript
class Person {
    sayHello = () => {
        console.log("Hello");
    };
}

new Person().sayHello === new Person().sayHello; // false
```

위 내용은 타입스크립트 관련 내용이 아니라 자바스크립트 구문에 대한 내용이다.

### 초기화 검사

타입스크립트에서 엄격한 컴파일러 설정이 활성화되어 있을 경우 클래스의 각 속성이 생성자`constructor`에서 값을 할당 받는지 검사한다.

```javascript
class Person {
    name: string; // OK constructor에서 할당 됨
    age: number; // NO constructor에서 할당 되지 않음
    job: string | undefined; // OK undefined가 유니언으로 허용됨

    constructor(name: string) {
        this.name = name;
    }
}
```

만약 엄격한 검사를 활성화 하지 않을 경우 위 코드에서 age가 생성자에서 할당되지 않았음에도 에러를 제공하지 않기에 런타임 시 `age` 즉 값을 할당하지 않아 `undefined`로 초기화된 멤버에 접근하여 에러가 발생할 수 있다.

> 💡 자바스크립트에서 선언되지 않은 변수 혹은 초깃값이 주어지지 않은 변수, 클래스 멤버의 값이 `undefined`로 초기화 되는게 되게 유연하고 좋다고 생각했는데 일부 상황에서는 예상하지 못한 오류를 발생시킬 수 있겠구나

클래스 생성자에서 의도적으로 속성을 할당하지 않는 경우 위의 초기화 검사를 우회해야하는데 이때 엄격한 검사를 비활성화 시키는 것이 아닌 해당 속성 이름 뒤에 `!`어서션을 추가하여 우회해야 한다.

```javascript
class Person {
    name: string;
    age!: number;
    // OK ! 어서션을 추가했기 때문에 constructor에서 할당 되지 않아도 에러가 발생하지 않음
    job: string | undefined;

    constructor(name: string) {
        this.name = name;
    }
}
```

### 선택적 속성과 읽기 전용 속성

타입 별칭, 인터페이스에서 본 것과 마찬가지로 클래스 멤버에 `readonly`, `?`를 추가하여 해당 속성이 읽기 전용, 선택적 속성임을 나타낼 수 있다.

```javascript
class Person {
    readonly name: string;
    job?: string;

    constructor(name: string) {
        this.name = name;
    }
}
```

위 코드에서 `job`은 `string | undefined`과 거의 유사한 선택적 속성이 되었으며 `name`의 경우 최초 생성자에서 할당된 뒤 값을 수정할 수 없는 읽기 전용 속성이 되었다.

## 타입으로서의 클래스

클래스의 이름은 변수에 타입을 알려주는 타입 에너테이션으로 선언하는 데 사용된다. 즉 변수에 클래스 이름으로 타입 애너테이션을 선언했다면 변수에는 해당 클래스에 할당할 수 있는 값만 할당해야함을 알려준다.

```javascript
class Person {
    sayHello() {
        console.log("Hello");
    }
}

// 클래스 이름 Person을 타입 에너테이션으로 선언하였다.
let theo: Person;
theo = new Person(); // OK;
theo = "Theo";
// 당연히 Person 타입이 아닌 경우 타입 에러가 발생한다.

// 그러나 할당되는 값이 해당 클래스의 인스턴스가 아닌 객체더라도 해당 객체의 구조 즉 멤버가 클래스의 멤버와 동일하다면 할당을 허용한다.
theo = {
    sayHello() {
        console.log("Hello");
    },
};
```

## 클래스와 인터페이스

앞서 봤던 인터페이스는 클래스의 형태를 예측할 수 있도록 `implements` 키워드를 사용하여 나타낼 수 있다.

```javascript
interface Person {
    name: string;
    age: number;
}
class Student implements Person {
    name: string;
    age: number;

    job?: string; // NO 인터페이스 Person에 정의된 속성에는 job이 없으므로 타입 에러가 발생한다.

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}
```

인터페이스를 구현하여 클래스를 작성하는 것은 순전히 안전성을 위한 것이다. 따라서 모든 클래스의 구조를 그대로 복사하여 매번 인터페이스를 만들 필요가 없다는 것.

초깃값이 있는 변수에 타입 에너테이션을 붙이는 경우와 용도가 비슷하다.

### 다중 인터페이스

타입스크립트의 클래스는 다중 인터페이스를 구현해 선언할 수 있다. 앞서 `implements`키워드를 활용하여 클래스에 인터페이스를 지정한 것처럼 동일하게 선언하는데 이때 각 인터페이스마다 쉼표 `,`로 구분하여 개수 제한 없이 인터페이스를 추가할 수 있다.

```javascript
interface Person {
    name: string;
    age: number;
}

interface Student {
    major: string;
}

class Theo implements Person, Student {
    name: string;
    age: number;
    // major 속성이 없으므로 타입 에러가 발생한다.

    constructor(name: string, age: number, major: string) {
        this.name = name;
        this.age = age;
    }
}
```

위 코드에서 class `Theo`는 `Person`, `Student`를 통해 다중 인터페이스로 선언되었다. 따라서 `name`, `age`, `major` 속성이 모두 존재해야하는데 `major`속성이 없기 때문에 타입 에러가 발생한다.

```javascript
interface Person {
    name: string;
    age: number;
}

interface Student {
    age: string;
}

class Theo implements Person, Student {
    name: string;
    age: number;
    // age가 중복으로 정의되어 있기 때문에 타입 에러가 발생한다,

    constructor(name: string, age: number, major: string) {
        this.name = name;
        this.age = age;
    }
}
```

다중 인터페이스로 클래스를 구현할 경우 각 인터페이스에 중복되는 속성이 있을 때 타입 에러가 발생할 수 있다.

## 클래스 확장

`extends` 키워드를 활용한 자바스크립트 클래스 확장 개념에 타입스크립트는 타입 검사를 추가한다.

```javascript
class Person {
    sayHello() {
        console.log("Hello");
    }
}

class Student extends Person {
    sayBye() {
        console.log("Bye");
    }
}

const theo = new Student();

theo.sayHello(); // OK 기본 클래스에 정의된 메서드
theo.sayHello(); // OK 하위 클래스에 정의된 메서드

theo.study(); // 어느 클래스에도 정의되지 않은 메서드이기 때문에 타입 에러가 발생한다.
```

### 할당 가능성 확장

하위 클래스의 경우 기본 클래스가 갖고 있는 모든 멤버를 모두 가지고 있기 때문에 기본 클래스 타입에 할당이 가능하지만 기본클래스의 경우 하위 클래스가 갖고 있는 멤버 중 일부를 갖고 있지 않을 수 있기 때문에 그 반대의 경우는 불가능하다.

```javascript
class Person {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
}

class Student extends Person {
    major: string;
    constructor(name: string, major: string) {
        super(name);
        this.major = major;
    }
}

let theo: Person;
theo = new Person("Theo"); // OK
theo = new Student("Theo", "Computer"); // OK

let homin: Student;
homin = new Student("Theo", "Computer"); // OK
homin = new Person("Theo"); // NO
```

위 코드에서 변수 `theo`의 경우 클래스 `Person` 클래스 타입으로 선언되었기에 해당 클래스가 갖고 있는 모든 멤버를 갖고 있는 `Person`, `Student` 클래스 타입의 인스턴스를 모두 할당 가능하다. 하지만 변수 `homin`의 경우 `Student` 클래스 타입으로 선언되었기에 해당 클래스 멤버를 모두 갖고 있는 `Student` 클래스 타입 인스턴스만 할당이 가능하다.

### 재정의된 생성자

자바스크립트에서 하위 클래스가 생성자를 선언하면 `super`키워드를 통해 기본 클래스의 생성자를 호출해야한다. 이때 기본 클래스의 생성자를 호출하지 않으면 타입 에러가 발생한다.

```javascript
class Person {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
}

class Student extends Person {
    major: string;
    // Constructors for derived classes must contain a 'super' call.
    constructor(name: string, major: string) {
        this.major = major;
    }
}
```

### 재정의된 메서드

하위 클래스의 경우 기본 클래스의 메서드를 새롭게 재정의 할 수 있다. 이때 메서드의 반환 타입이 기본 클래스 메서드의 반환타입에 할당할 수 있는 경우만 가능하다.

```javascript
class Person {
    sayHello() {
        return "Hello";
    }
}

class Student extends Person {
    sayHello() {
        return "안녕하세요.";
    }
}

class Theo extends Person {
    // 기본 클래스 Person의 sayHello메서드의 반환타입과 동일하지 않으므로 타입 에러가 발생한다.
    sayHello() {
        return 0;
    }
}
```

### 재정의된 속성

클래스의 속성 역시 메서드와 마찬가지로 하위 클래스에서 재정의될 수 있다. 이 경우도 역시 재정의 되는 속성의 타입이 기본 클래스의 속성 타입에 할당 가능한 타입이어야 한다.

```javascript
class Person {
    name: string | undefined;
    constructor(name: string) {
        this.name = name;
    }
}

class Student extends Person {
    name: string;
    constructor(name: string) {
        super(name);
        this.name = name;
    }
}

class Wrong extends Person {
    name: number;
    // Property 'name' in type 'Wrong' is not assignable to the same property in base type 'Person'. Type 'number' is not assignable to type 'string'.
}
```

위 코드에서 기본 클래스의 `name`속성은 `string | undefined` 타입이다. 이때 `Student`의 경우 `name`을 `string` 타입으로 축소시켰다. 이는 기본 클래스의 속성 타입에 할당 가능하므로 문제가 없으나 `Wrong` 클래스의 경우 `name`을 `number`타입으로 재정의 했다. 이는 기본 클래스의 속성에 할당이 불가능하므로 타입 에러가 발생한다.

## 추상 클래스

기본 클래스에 메서드를 구현하지 않고 하위 클래스가 해당 이름의 메서드를 정의할 것이라고 예상하는 경우 해당 클래스를 추상화 하기 위해 클래스 이름과 메서드 앞에 `abstract` 키워드를 추가한다.

```javascript
abstract class Person {
    readonly name: string;
    constructor(name: string) {
        this.name = name;
    }

    abstract sayHello(): string;
}

class Student extends Person {
    sayHello() {
        return "Hello I'm Student";
    }
}

class Theo extends Person {}
// 구현해야할 메서드 sayHello를 구현하지 않았기에 에러가 발생한다.
// Non-abstract class 'Theo' does not implement inherited abstract member 'sayHello' from class 'Person'.
```

## 멤버 접근성

타입스크립트에서는 타입 시스템의 아래 키워드를 활용하여 클래스 멤버에 접근성을 결정한다.

-   public(기본값): 모든 곳에서 접근 가능
-   protected: 클래스 내부, 하위 클래스에서 접근 가능
-   private: 클래스 내부에서만 접근 가능

이러한 타입스크립트 구문은 자바스크립트로 컴파일 시 제거되는데 이때 `private`의 경우 자바스크립트에도 존재하는 키워드이므로 런타임에서도 `private`으로 평가된다.

```javascript
class Base {
    public isPublic = true;
    protected isProtected = true;
    private isPrivate = true;
}

class SubClass extends Base {
    examples() {
        this.isPublic;
        this.isProtected;
        this.isPrivate; // NO private은 기본 클래스 내부에서만 접근 가능하므로 에러가 발생한다.
    }
}

new SubClass().isPublic;
new SubClass().isProtected; // NO protected은 기본, 하위 클래스 "내부"에서만 접근 가능하므로 에러가 발생한다.
new SubClass().isPrivate; // NO 역시 private은 기본 클래스 내부에서만 접근 가능하므로 에러가 발생한다.
```

### 정적 필드 제한자

자바스크립트에서는 `static`키워드를 사용하여 클래스 자체의 멤버를 정의할 수 있는데 이때 `readonly`혹은 접근성 키워드를 함께 사용할 수 있다.

```javascript
class Question {
    protected static readonly answer: "다이아몬드";
    protected static readonly prompt = "아몬드가 죽으면?";

    guess(getAnswer: (prompt: string) => string) {
        const answer = getAnswer(Question.answer);

        if (answer === Question.answer) {
            console.log("맞췄어요!");
        } else {
            console.log("맞추지 못했습니다!");
        }
    }
}

Question.answer;
// answer는 기본, 하위 클래스에서만 접근 가능하도록 protected 키워드가 붙어 있기 때문에 static으로 선언되었어도 클래스 외부에서는 직접 접근할 수가 없다.
```

## 회고

앞서 본 인터페이스 챕터에서 인터페이스가 클래스와의 상호운용성이 있다고 했는데 막상 이번 챕터를 보고 나니까 클래스를 구현할 때는 인터페이스를 꼭 작성하지 않아도 되는 것 같아 보인다. 저자도 말했듯이 말이다.

클래스의 경우 이전에 봤던 타입들보다 더욱 복잡하고 손이 많이 갈 것 같은 구조처럼 보인다. 물론 그 결과로 더욱 뛰어난 안정성을 얻겠지만 말이다.

특히 클래스 내부에서 사용할 멤버들을 미리 정의하는 부분은 손을 두 번 가게 만들지만 인터페이스와 마찬가지로 클래스의 구조를 한 눈에 파악할 수 있게 해주는 좋은 패턴같다고 느꼈다.
