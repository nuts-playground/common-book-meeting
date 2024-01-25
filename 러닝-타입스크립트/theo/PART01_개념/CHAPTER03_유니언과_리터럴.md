# 유니언과 리터럴

## 핵심 한 줄 요약

> 유니언 타입을 활용하여 변수의 타입 범위를 늘리거나 리터럴타입, 내로잉을 활용하여 타입의 범위를 제한하거나 좁힐 수 있다.

## 유니언 타입

> 하나의 변수에 할당 가능한 타입을 두 개 이상으로 확장하는 것 변수의 타입이 "이거 혹은 저거 아님 요거 혹시 저거"가 될 수 있다.

### 유니언 타입 선언

```javascript
let myAge: string | number = Math.random() > 0.5 ? "27" : 27;

myAge.toLocaleString(); // OK
myAge.split(","); // NO!
```

위 코드에서는 변수 `myAge`는 `string | number` 유니언 타입으로 선언했다. 따라서 `string`혹은 `number`타입의 값이 할당될 수 있는 변수이다. 이때 타입스크립트는 해당 변수가 두 타입 중 어떤 타입이 할당될지 미리 알 수 없기 때문에 변수의 멤버에 접근할 경우 두 타입 모두에 존재하는 멤버에만 접근할 수 있으며 자동 완성 역시 두 타입에 모두 존재하는 멤버만 표시해준다.

![유니언 자동 완성](/러닝-타입스크립트/theo/images/0103_01.png)

어느 한 쪽에만 존재하는 멤버에 접근할 경우 타입 에러를 반환하고 당연히 컴파일되지 않는다. 그렇다면 변수 `myAge`는 최초 선언된 이후 `toLocaleString, toString, valueOf` 세 멤버에만 접근 가능한 것일까?

### 내로잉

> 타입의 범위를 늘렸던 유니언과 다르게 타입의 범위를 좁혀 구체화키는 것이다.

#### 값 할당을 통한 내로잉

```javascript
let myAge: string | number = Math.random() > 0.5 ? "27" : 27;

myAge = "27";
myAge.toLocaleString(); // OK
myAge.split(","); // OK
```

위 코드에서는 `myAge` 변수가 `string | number` 유니언 타입으로 선언되었지만 초기화 이후에 `string` `"27"`을 할당했다. 이때 타입스크립트는 해당 변수가 `string`타입임을 인지하게 된다. 따라서 최초 코드 예시와는 달리 자동 완성으로 제공하는 멤버가 `string`에서 접근 가능한 모든 변수로 늘어나게 되었다. 이것이 내로잉이다.

![내로잉 후 자동 완성](/러닝-타입스크립트/theo/images/0103_02.png)

이 외에 **&&** 연산자를 활용한 단축 평가나 **?** 연산자를 활용하여 내로잉하는 것도 가능하다.

#### 조건 검사를 통한 내로잉

```javascript
let myAge: string | number = Math.random() > 0.5 ? "27" : 27;

if (myAge === "27") {
    myAge.split(""); // OK
}

myAge.split(""); // NO
```

위 코드에서는 `myAge === "27"`이 조건인 `if` 블록이 하나 있는데 해당 조건을 통과할 경우는 `myAge`가 `string`타입이어야 가능하므로 타입스크립트는 해당 블록 안에서 해당 변수의 타입을 `string`으로 좁힌다.

`typeof` 연산자를 활용한 `if` 블록으로도 동일한 결과를 얻을 수 있다.

### 리터럴 타입

> 원시 타입이 아닌 특정 원싯 "값"이 곧 타입인 것을 리터럴 타입이라고 한다.

```javascript
let myName: "Theo";
myName = "Theo"; // OK
myName = "Homin"; // NO
```

위 코드에서 `myName`은 리터럴 타입`"Theo"`로 선언되었다. `"Theo"` 자체는 그저 `string`이나 여기에서는 하나의 타입이며 이후 해당 변수는 `"Theo"`이외의 다른 값은 할당할 수 없게 된다.

리터럴 타입과 유니언 타입을 조합하여 사용할 수도 있다.

### 엄격한 null 검사

타입스크립트에는 `strictNullChecks`를 통해 엄격한 null 검사가 가능하다. 이는 타입에 `undefined`, `null` 따로 추가를 해야지만 `undefined`, `null`를 각각 할당할 수 있도록 제한한다.

### 타입 별칭

> 유니언 타입의 경우 여러번 반복해서 타입을 지정할 일이 생기게 되면 배우 불편할 수 있다. 이를 한 번 선언하고 재사용할 수 있도록 하는 것이 타입 별칭이다.

```javascript
let myName: "Homin" | "Theo" | "Jieun";
let yourName: "Homin" | "Theo" | "Jieun";
let heName: "Homin" | "Theo" | "Jieun";
```

위 코드처럼 동일한 타입을 이러한 방식으로 반복하면 매우 불편하기 때문에 타입 별칭을 활용하여 아래처럼 바꿀 수 있다.

```javascript
type NameType = "Homin" | "Theo" | "Jieun";
let myName: NameType;
let yourName: NameType;
let heName: NameType;
```

## 회고

![리터럴 타입과 유니언 타입을 활용한 NextUi 컴포넌트](/러닝-타입스크립트/theo/images/0103_03.png)
리터럴, 유니언 타입은 최근 사이드 프로젝트에서 [NextUI](https://nextui.org/)를 활용할 때 그 강력함을 느낄 수 있었다. `size` `color` 등 해당 컴포넌트의 `props`에 타입을 지정해놓으니 컴포넌트 사용 시 필요한 다양한 옵션을 모두 기억할 필요도, 매번 문서를 확인해야 할 필요도, 잘못된 값을 넣었을 때의 리스크도 없어졌다. 타입스크립를 통해 해당 `prop`에 넘길 수 있는 값은 어떤 것이 있는지 다 알려주기 때문에 많은 도움이 됐다.
