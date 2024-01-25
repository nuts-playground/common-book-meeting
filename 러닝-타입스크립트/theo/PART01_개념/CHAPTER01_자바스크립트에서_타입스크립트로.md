# 자바스크립트에서 타입스크립트로

## 핵심 한 줄 요약

> 타입스크립트의 강력한 기능을 통해 자바스크립트 코드를 더욱 안전하게 실행할 수 있다.

## 타입스크립트란?

타입스크립트는 따로 시간을 내어 공부한 적은 없고 NextJS를 학습하고 활용하면서 자연스럽게 접하게 되었는데 덕분에 막힐 때마다 구글링을 통해 해결하거나 냅다 `any`를 때려박고 넘어갔다. 그러니까 잘 모르는 상태로 지금까지 타입스크립트를 꾸역꾸역 써왔다.

> 타입이 있는 자바스크립트

내가 기존에 이해하고 있던 타입 스크립트는 대충 이런 이미지였다.

-   프로그래밍 언어
-   타입 검사기
-   컴파일러
-   언어 서비스

이 책에서는 타입스크립트를 위 네가지로 설명하고 있다. 그저 타입이 있는 자바스크립트로만 설명하기에 타입스크립트는 너무나 강력한 기능을 포함하고 있는 프로그래밍 언어이자 타입 검사기, 컴파일러, 언어 서비스이다. 이 타입스크립트는 아래와 같은 기능을 수행할 수 있다.

### 코드 실행 전 타입 에러 갑지

```javascript
const firstName = "Theo";
const nameLength = firstName.length();
// Uncaught TypeError: firstName.length is not a function
```

위 코드를 실행하면 타입 에러가 발생한다. 문자열 객체의 length 프로퍼티는 메소드가 아니기에 실행할 수 없기 때문이다. 타입스크립트는 이러한 간단한 오류를 실행 전 미리 알려주어 유용하다.

### 예측 불가능한 코드 작성 예방

```javascript
const sayMyName = (fullName) => {
    console.log(`Hello, ${fullName}`);
};

sayMyName("Theo", "Homin");
// Error: Expected 1 argument, but got 2.
```

`sayMyName`은 하나의 매개변수가 있는 함수인데 위에서는 해당 함수 호출 시 두 개의 인수를 전달하고 있다. 위 코드는 실제 실행 시 아무런 에러가 발생하지 않지만 만약 `sayMyName`함수 내부 코드를 모르고 있었다면 두 번째 인수로 전달한 `"Homin"`이 같이 출력될 것이라 생각할 수 있다. 그러나 함수는 예상과 다른 결과를 출력한다.  
타입스크립트는 실제 에러가 발생하지 않더라도 예측 불가능한 코드를 예방한다.

### 정확한 문서화

```javascript
const paintPainting(painter, painting) {
    return painter.prepare().paint(painting, painter.ownMaterials).finish();
}
```

위 함수를 봤을 때 `painter`, `painting`이 각각 어떤 객체, 값일지 어떠한 프로퍼티를 갖고 있는지, 메소드 실행 시 어떠한 값을 반환하는지 알 수가 없다.

```javascript
interface Painter {
    finish(): boolean;
    ownMaterials: Material[];
    paint(painting: string, meterials: Material[]): boolean;
}

const paintPainting(painter: Painter, painting: string): boolean {
    return painter.prepare().paint(painting, painter.ownMaterials).finish();
}
```

타입스크립트를 활용하면 `painter`가 어떤 프로퍼티를 갖고 있는 객체인지 알 수 있고 `painter`가 `string`이었다는 것을 알 수 있다. 즉 타입스크립트 구문을 통해 객체의 형태를 문서화하여 객체의 형태를 설명할 수 있다.

### 개발자 도구

타입스크립트는 직접 소스코드 내 변수의 타입을 추론하거나 개발자가 지정한 타입을 토대로 강력한 자동완성을 제공한다.

## 회고

최근에 사이드 프로젝트를 진행하면서 미친듯이 때려박았던 `any`를 하나씩 제대로 된 타입으로 선언하여 리팩토링을 하였다. 그 후 추가로 리팩토링을 진행하며 각 함수의 매개변수 등을 몇 번 수정할 일이 생겼었는데. 함수 하나의 매개변수, 혹은 로직을 수정하는 것이 생각보다 더 많은 곳에 영향을 미치게 되었다. 다행히 미리 `any`타입을 제거한 덕분에 타입스크립트가 미리 뿜어내는 오류를 따라가며 코드를 수정했더니 큰 리스크 없이 리팩토링을 할 수 있었다. 타입스크립트의 강력한 기능을 몸소 체감할 수 있었던 경험이었다. 만약 타입스크립트가 없었다면 런타임 오류를 하나씩 추적하며 수정했을 것이다.

그러나 타입스크립트에 대해 제대로 아는 것이 거의 없었다. `tsc`라는 명령어도 이 책에서 처음 봤다. NextJS에서는 알아서 컴파일되도록 다 설정이 되어 있으니 알아보려고 하지도 않았다. 이번 기회에 타입스크립트를 천천히 공부하여 강력한 스킬로 활용할 수 있을 것 같다.
