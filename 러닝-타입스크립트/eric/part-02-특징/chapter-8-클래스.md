## [ 클래스 ]

### 핵심 한 줄 요약
    타입스크립트의 접근 제어자, 인터페이스, 추상화 등을 통해 더욱 구조적이고 안전한 클래스를 만들 수 있다.

### 클래스
- 나는 클래스를 **설계도** 라고 생각한다.
- 현재 JS 에도 있으며, 타입스크립트는 기존 JS 에서 클래스 기능, 패턴 등이 모두 사용 가능하다.
- 속성(멤버 변수), 메소드(멤버 함수) 등을 가질 수 있다.
- 다양한 접근 제어자 사용도 가능하다.
- 클래스 자체를 타입으로 쓸 수도 있다. => 클래스 안에 동일한 멤버만 포함한 객체면 할당할 수 있다. => 객체의 형태만 고려한다.
- extends 로 확장이 가능하다. => 하위 클래스는 super() 로 상위 생성자의 속성을 호출해야 속성을 사용할 수 있다.
- 하위 클래스에서 메서드, 속성 등 재정의가 가능하다. => 하위 클래스에서 상위 클래스의 메서드, 속성도 사용 할 수 있어야 한다 => 메서드는 매개변수와 반환 타입 동일해야 하며, 속성은 내로잉만 가능하고 확장은 안된다.

### 클래스 속성(멤버 변수)
- 명시적으로 선언되어 있어야 한다.
- 옵셔널 (변수?:값) 키워드도 가능하다.
- 읽기 전용 (readonly 변수: T) 키워드도 가능하다. => 리터럴, 생성자에서만 할당 가능

### 클래스 메서드(멤버 함수)
- 요 놈도 속성 처럼 명시적으로 선언되어 있어야 한다.
- 메서드 선언 방식과 속성 선언 방식이 있다.
- 메서드 접근 방식과 속성 선언 방식이 this 바인딩의 차이로 알고 있었는데 내가 거꾸로 알고 있었던 것 같다.
- 호세, 테오 피드백으로 명확히 알고 넘어가야 겠다. //TODO 155페이지

### 초기화 검사
- 엄격한 초기화 검사를 구성해야 한다.
- 안그러면 멤버 변수를 사용할 때 undefined 접근이 가능해진다. => 있지도 않은 값에 함수를 걸고 사용하고 할 수 있다는 말이다!  
- 12장 IDE 사용 기능 파트에서 알고 바로 적용해놓자.

### 클래스와 인터페이스
- 클래스에 implements 키워드로 인터페이스를 준수한다고 선언할 수도 있다. => 인터페이스의 틀대로 모든 키와 타입이 구현되어 있어야 한다.
- 다중 인터페이스를 선언할 수도 있다. => 대신 두개가 섞이지 못하도록 만든 인터페이스들은 사용하면 안된다.

### 추상 클래스
- 추상화 하려는 클래스 이름이나 메서드 앞에 abstract 키워드를 붙인다.
- 하위 클래스는 abstract 키워드가 붙은 필드를 모두 구현해야 한다.
- 인스턴스 생성은 하위 클래스를 사용해야만 가능하다.

### 접근 제한자
- public: 모든 곳에서 누구나 접근 가능
- protected: 클래스 내부 또는 하위 클래스에서만 접근 가능
- private: 클래스 내부에서만 접근 가능

### 정적 필드 제한자
- static: 클래스를 통해 인스턴스를 생성할 필요 없이 사용 가능

### 추상 클래스와 인터페이스랑 차이가 뭐지?
- 인터페이스는 선언만 존재한다. => 추상 클래스는 멤버에 대한 구현 세부 정보를 포함할 수 있다.
- 인터페이스는 접근 제한자를 설정할 수 없다. => 추상 클래스는 가능하다.
- 인터페이스는 타입 체크의 목적 그 이상도 그 이하도 아니다. => 그래서 객체의 사용할 때 강력하면서 빠르다.
- 인터페이스는 어떤 '행동'에 대한 명세일 뿐, 그 자체가 상속관계를 나타내주진 않는다.

### ex) 클래스
```typescript

// 기본 형태
class User {
    // 속성
    name: string;
    age: number;

    // 메서드
    getAge(): string {
        return `제 나이는 ${this.age}살 입니다.`;
    }
}

// 접근 제한자 추가 형태
class Developer {
    private readonly name: string;
    private readonly age: number;
    private readonly job: 'front' | 'back';

    constructor(name: string, age: number, job: 'front' | 'back') {
        this.name = name;
        this.age = age;
        this.job = job;
    }
    
    getname(): string {
        return this.name;
    }
    
    getAge(): number {
        return this.age;
    }
}
```

### ex) 클래스와 인터페이스
```typescript
interface Developer {
    name: string;
    age: number;
    intro: string;
}

// Developer 라는 인터페이스안에 키들을 모두 구현해야 한다.
// 단 선언만 해줘도 에러는 안난다. => 값을 할당 하지 않아도 에러가 안난다.
class Seokho implements Developer {
    name = 'Seokho Kim';
    age = 28;
    intro = '스크래핑 개발자 김석호 입니다.';
}
```

### ex) 추상 클래스
```typescript
abstract class Maneger {
    name: string
    age: number;
    
    abstract callSign(): string;
}

// abstract 키워드가 붙은 메서드는 반드시 구현해줘야 한다.
class Seokho extends Maneger {
    name = 'Seokho Kim';
    age = 28;
    
    callSign(): string {
        return "eric";
    }
}
```

### 새로 알게된 점
- strict mode 를 얼른 적용해놔야 할 것 같다. 이 md 작성하면서 undefined 참조 하는데 전혀 에러가 안뜬다 ㅜㅜ
- 추상 클래스와 인터페이스 간에 차이를 명확히 설명할 수 없었는데 이제는 가능하다!
