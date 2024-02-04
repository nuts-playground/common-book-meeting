## 8. 클래스


### 학심 한 줄 요약

    클래스는 기능이 많기 때문에 타입도 중요하지만 특정 키워드 등 사용에 익숙해지자.

</br></br>

### 클래스 메서드

타입스크립트는 독립 함수를 이해하는 것과 동일한 방식으로 메서드를 이해   

```typescript
class Hello {
  greet(name: string) {
    console.log(`${name}`);
  }
}

new Hello().greet('world!');

new Hello().greet(); // Error: Expected 1 arguments, but got 0.
```

- 타입스크립트는 메서드 호출 시 올바른 타입의 인수가 올바른 수로 제공되는지 확인하기 위해 검사 수행

</br></br>

### 클래스 속성

타입스크립트에서 클래스의 속성을 읽거나 쓰려면 클래스에 명시적으로 선언  

```typescript
class Foo {
  bar: string;

  constructor(bar: string) {
    this.bar = bar;

    console.log(`${this.bar}`);
  }
}
```

</br>

#### 함수 속성

클래스의 멤버를 호출 가능한 함수로 선언하는 두 가지 구문
- 메서드 접근 방식의 `this`는 그 메서드를 소유한 인스턴스
- 값이 함수인 속성의 `this`는 그 함수를 호출한 객체 

메서드 접근 방식은 함수를 클래스 프로토타입에 할당하므로 모든 클래스 인서턴스는 동일한 함수 정의를 사용

```typescript
class WithMethod {
  myMethod() {  }
}

new WithMethod().myMethod === new WithMethod().myMethod; // true
```

값이 함수인 속성을 선언하는 방식

```typescript
class WithProperty {
  myProperty: () => {}
}

new WithProperty().myProperty === new WithProperty().myProperty; // false
```

- 클래스 인스턴스당 새로운 함수 생성
- 항상 클래스 인스턴스를 가리켜야 하는 화살표 함수에서 this 스코프를 사용하면 클래스 인스턴스당 새로운 함수를 생성하는 시간과 메모리 비용 측면에서 유용

</br>

#### 초기화 검사

컴파일러 옵션 `'strict': true` 설정이 활성화된 상태에서 타입스크립트는 `undefined` 타입으로 선언된 각 속성이 생성자에 할당되었는지 확인

```typescript
class WithValue {
  foo = 0;
  bar: number;
  baz: number | undefined;

  unused: number; // Error: Property 'unused' has no initializer and is not definitely assigned in the constructor.

  constructor() {
    this.bar = 1;
  }
}
```

- `strictPropertyInitialization` 옵션을 사용하자 

</br>

#### 확실하게 할당된 속성

엄격한 초기화 검사를 적용하면 안 되는 속성인 경우에는 이름 뒤에 `!`를 추가해 검사를 비활성화 할 수 있음 (속성이 처음 사용되기 전 `undefined` 값 할당)

```typescript
class ActivitiesQueue {
  pending!: string[];

  initialize(pending: stringp[]) {
    this.pending = pending;
  }

  next() {
    return this.pending.pop();
  }
}

const activities = new ActivitiesQueue();

activities.initialize(['apple', 'banana', 'cherry']);
activities.next();
```

</br>

#### 선택적 속성

인터페이스와 마찬가지로 클래스는 선언된 속성 뒤에 `?`를 붙여 속성을 옵션으로 선언

```typescript
class User {
  name?: string;
}

new User().name?.length;

new User().name.length; // Error: Object is possibly 'undefined'.
```

</br>

#### 읽기 전용 속성

인터페이스와 마찬가지로 `readonly` 키워드를 추가해 속성을 읽기 전용으로 선언

```typescript
class User {
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }
  
  changeName() {
    this.name = 'hello world'; // Error: Cannot assign to 'name' because it is a read-only property.
  }
}

const user = new User('name!');

user.name = 'wrong'; // Error: Cannot assign to 'name' because it is a read-only property.
```

- 타입스크립트는 자바스크립트로 컴파일하면 `readonly` 키워드는 삭제됨. 읽기 전용 보호가 필요하다면 `private` 필드 또는 `get()` 함수 속성 사용  

</br>

원시 타입의 초깃값을 갖는 readonly로 선언된 속성은 더 넓은 원싯값이 아니라 값의 타입이 가능한 한 좁혀진 리터럴 타입으로 유추

```typescript
class User {
  readonly name: string = 'myName';
  readonly addr = 'MyAddr';

  constructor() {
    if (Math.random() > 0.5) {
      this.name = 'myName2';

      this.addr = 'myAddr'; // Error: addr의 타입이 'MyAddr'
    }
  }
}

const user = new User();
```

- 꼭 타입 애너테이션을 붙이자.

</br></br>

### 타입으로서의 클래스

타입스크립트는 클래스의 동일한 멤버를 모두 포함하는 모든 객체 타입을 클래스에 할당할 수 있는 것으로 간주

```typescript
class User {
  readonly name: string;
  
  constructor(name: string) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

let user: User;

user = new User();
```

</br>

타입스크립트의 구조적 타이핑이 선언되는 방식이 아닌 객체 형태만 고려하기 때문

```typescript
class People {
  getPeople() {
    return ['hello', 'world'];
  }
}

function withPeople(people: People) {
  console.log(people.getPeople());
}

withPeople(new People()); // ok

withPeople({ 
  getPeople: () => ['wow'],
}); // ok

withPeople({ 
  getPeople: () => [11213],
}); // Error: 문자열 배열이 아닌 숫자 배열이기 때문
```

</br></br>

### 클래스와 인터페이스

타입스크립트는 클래스 이름 뒤에 `implements` 키워드와 인터페이스 이름을 추가함으로써 클래스의해당 인스턴스가 인터페이스를 준수한다고 선언

```typescript
interface User {
  name: string;
  getName: (name: string) => string;
}

class Users implements User {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  getName(name: string) {
    return name;
  }
}
```
- 타입스크립트는 인터페이스에서 클래스의 메서드 또는 속성 타입을 유추하지 않음 `(애너테이션 필수)`
- 애너테이션을 제공하지 않으면 `any` 타입으로 유추

</br>

#### 다중 인터페이스 구현

```typescript
interface Name {
  name: string;
}

interface GetAge {
  getAge: (age: number) => number;
}

class User implements Name, GetAge {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  getAge(age: number) {
    return age;
  }
}

const user: User = new User('myName');
```

- 주의: 인터페이스 속성의 이름이 같고 타입이 다른 경우에는 구현이 불가.

</br></br>

### 클래스 확장

타입스크립트는 다른 클래스를 확장하거나 하위 클래스를 만드는 자바스크립트 개념에 타입 검사를 추가

```typescript
class Teacher {
  teach() {
    console.log('teach');
  }
}

class StudentTeacer extends Teacher {
  learn() {
    console.log('learn');
  }
}

const teacher = new StudentTeacer();

teacher.teach();
teacher.learn();
```

</br>

#### 할당 가능성 확장

하위 클래스도 기본 클래스의 멤버를 상속  
하위 클래스의 인스턴스는 기본 클래스의 모든 멤버를 가지므로 기본 클래스의 인스턴스가 필요한 모든 곳에서 사용 가능

```typescript
class Lesson {
  subject: string;

  constructor(subject: string) {
    this.subject = subject;
  }
}

class OnlineLesson extends Lesson {
  url: string;

  constructor(subject: string, url: string) {
    super(subject);
    this.url = url;
  }
}

let lesson: Lesson;
lesson = new Lesson('coding');
lesson = new OnlineLesson('coding', 'example.com');

let online: OnlineLesson;

online = new OnlineLesson('coding', 'example.com');
online = new Lesson('coding'); // online 변수는 생성자 매개변수가 2개
// Error: 생성자에 url 매개변수가 없음
```

선택적 속성이 있는 경우에는 사용 가능

```typescript
class PastGrades {
  grades: number[] = [];
}

class LabeledPastGrades extends PastGrades {
  label?: string;
}

let subClass: LabeledPastGrades;

subClass = new LabeledPastGrades();
subClass = new PastGrades();
```

</br>

#### 재정의된 생성자

자바스크립트처럼 자체 생성자가 없는 하위 클래스는 암묵적으로 기본 클래스의 생성자를 사용

```typescript
class Parent {
  foo: string;

  constructor(foo: string) {
    this.foo = foo;
  }
}

class Child extends Parent {
  constructor() {
    super('hello');
  }
}

class WrongChild extends Parent {
  bar: string;

  constructor(foo: string) {
    this.bar = foo; // Error: 'super' must be called before accessing 'this' in the constructor of a subclass.
  }
}
```

- 하위 클래스 생성자는 `this` 또는 `super`에 접근하기 전에 반드시 기본 클래스의 생성자를 호출

</br>

#### 재정의된 메서드

하위 클래스의 메서드가 기본 클래스의 메서드에 할당될 수 있는 한 하위 클래스는 기본 클래스와 동일한 이름으로 새 메서드를 다시 선언할 수 있음

```typescript
class GradeCounter {
  countGrade(grades: string[], letter: string) {
    return grades.filter(grade => grade === letter).length;
  }
}

class FailureCounter extends GradeCounter {
  countGrade(grades: string[]) {
    return super.countGrades(grades, 'F');
  }
}

class AnyFailureChecker extends GradeCounter {
  countGrade(grades: string[]) {
    return super.countGrades(grades, 'F') !== '0'; // Error: 기본 클래스의 메서드와 리턴 타입이 다름
  }
}
```

</br>

#### 재정의된 속성

하위 클래스는 새 타입을 기본 클래스의 타입에 할당할 수 있는 한 동일한 이름으로 기본 클래스의 속성을 명시적으로 다시 선언할 수 있음  
하위 클래스는 기본 클래스와 구조적으로 일치해야 함

```typescript
class Assignment {
  grade?: number;
}

class GradedAssignment extends Assignment {
  grade: number;

  constructor(grade: number) {
    super();

    this.grade = grade;
  }
}
```

</br></br>

### 추상 클래스

추상화하려는 클래스 이름과 메서드 앞에 타입스크립트의 `abstract` 키워드를 추가  
추상화 메서드 선언은 추상화 기본 클래스에서 메서드의 본문을 제공하는 것을 건너뛰고, 대신 `인터페이스와 동일한 방식으로 선언`

`추상 클래스 (Abstract Class)`: 추상 클래스는 직접 인스턴스화할 수 없는 클래스. 대신, 추상 클래스를 상속하는 하위 클래스를 통해 인스턴스화 해야함.  

`추상 메서드 (Abstract Method)`: 추상 메서드는 선언만 있고 구현이 없는 메서드. 반드시 추상 클래스 내부에서 선언. 추상 메서드는 하위 클래스에서 반드시 구현 해야함.



```typescript
abstract class School {
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract getStudentTypes(): string[];
}

class Preschool extends School {
  getStudentTypes() {
    return ['preschooler'];
  }
}
```

</br></br>

### 멤버 접근성

자바스크립트에서는 클래스 멤버 이름 앞에 `#`을 추가해 private 클래스 멤버임을 나타냄  
타입스크립트는 private 클래스 멤버를 지원하지만, 타입 시스템에만 존재하는 클래스 메서드와 속성에 대해 조금 더 미묘한 프라이버시 정의 집합을 허용.

타입스크립트 타입 시스템 내부에서만 존재하는 키워드

- `public` (default): 모든 곳에서 누구나 접근 가능
- `protected`: 클래스 내부 또는 하위 클래스에서만 접근 가능
- `private`: 클래스 내부에서만 접근 가능

```typescript
class Base {
  isPublic = 0;
  public isPublicFoo = 1;
  protected isProtected = 2;
  private isPrivate = 3;
  #privateFoo = 4;
}

class SubClass extends Base {
  example() {
    this.isPublic;
    this.isPublicFoo;
    this.isProtected;

    this.isPrivate; // Error: Base 클래스에서만 사용 가능
    this.#privateFoo; // Error: Base 클래스에서만 사용 가능
  }
}
```

- 타입스크립트의 멤버 접근성은 타입 시스템에서만 존재하지만 private 선언은 자바스크립트 런타임에도 존재
- `#` 키워드 즉, private 필드만 진짜 private

</br>

접근성 제한자는 `readonly`와 함께 표시 가능

```typescript
class TwoKeywords {
  private readonly name: string;

  constructor() {
    this.name = 'hello world';
  }

  log() {
    console.log(this.name);
  }
}

const two = new TwoKeywords();

two.name = 'wrong'; // Error: readonly 속성이기 때문
```

</br>

#### 정적 필드 제한자

자바스크립트는 `static` 키워드를 사용해 클래스 자체에 멤버를 선언  
타입스크립트는 `static` 키워드를 단독으로 사용하거나 `readonly`와 접근성 키워드를 함께 사용

```typescript
class Question {
  protected static readonly answer: 'bash';
  protected static readonly prompt = 'hello World!';

  guess(getAnswer: (prompt: string) => string) {
    const answer = getAnswer(Question.prompt);

    if (answer === Question.answer) {
      console.log('got it');
    } else {
      console.log('error');
    }
  }
}
```

- `static` 클래스 필드에 대해 `readonly`와 접근성 제한자를 사용하면 해당 필드가 해당 클래스 외부에서 접근되거나 수정되는 것을 제한할 수 있음

</br></br>

### 새로 알게된 점
 
메서드 형태의 함수와 선언형 함수에서 `this`가 가지는 스코프가 다른 것을 이번에 알았다. 그리고 접근성을 제한하는 키워드와 읽기 전용 키워드에 `private` 키워드를 많이 사용했었는데 이제는 코드를 작성하면서 필요한 키워드를 작성해 주는 것이 좋을 것 같다.
`캡상추다!`

</br></br>

### 참고

[타입스크립트 핸드북 - 클래스](https://www.typescriptlang.org/docs/handbook/classes.html)