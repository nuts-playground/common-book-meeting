## 1. 자바스크립트에서 타입스크립트로

### 학심 한 줄 요약
    자바스크립트의 큰 단점인 코드 문서화를 해결한 타입스크립트

### 자바스크립트의 단점
- 코드를 구성할 때 자유도가 높지만, 파일이 점점 늘어날수골 예측 불가능한 코드가 나올 수 있다.
- JSDoc을 이용해 코드를 문서화 할 수 있지만, 코드가 잘못되는 것을 막지 못하고 관련된 JSDoc을 찾기도 어렵다.

### 자바스크립트의 단점을 보완하는 타입스크립트 (타입이 있는 자바스크립트)
- 자바스크립트의 모든 구문과 타입을 정의한다.
- 자바스크립트 및 타입스크립트로 작성된 모든 구셩 요소(함수, 변수)를 이해하고, 잘못된 부분을 알려준다.
- 타입 검사기를 실행하여 코드를 검사하고, 문제를 알려준 후 자바스크립트 코드로 컴파일한다.

### 자바스크립트에서는 오류 없이 실행되지만, 타입스크립트에서는 오류가 발생하는 코드
```typescript
function paramsTest(foo) {
    console.log(`Params: ${foo}`)
}

paramsTest('hello', 'world')
// TS2554: Expected 1 arguments, but got 2.
```

- 예측 불가능한 코드를 사전에 방지할 수 있다.

### 코드를 통해 코드를 문서화 할 수 있다.
```typescript
interface Material {
    materialType: string;
    color: string;
}

interface Painter {
    finish(isFinish: boolean, callback: () => void): boolean;
    useMaterials: Material[];
    paint(painting: string, materials: Material[]): Material[];
}

function paintPainting(painter: Painter): boolean {
    painter.paint('Start Painting', painter.useMaterials);

    return painter.finish(true, () => {
        console.log('Finish!')
    });
}

const painter: Painter = {
    finish: (isFinish: boolean, callback): boolean => {
        callback();
        return isFinish;
    },
    useMaterials: [
        {
            materialType: 'cubic',
            color: 'white',
        }
    ],
    paint: (painting: string, materials: Material[]): Material[] => {
        const useMaterial = materials[0];

        console.log(`${painting} with ${useMaterial.color} ${useMaterial.materialType}`);

        return materials;
    }
}

paintPainting(painter);
```

- 함수의 매개변수와 반환값의 타입을 정의하여 코드를 문서화 할 수 있다.

### 새로 알게된 점
기존에 NestJS 프로젝트를 진행하면서 NestJS안에 있는 모듈, 라이브러리를 사용할 때 상위 폴더까지 확인을 해도 어떤 타입의 파라미터를 받고 어떤 타입을 리턴하는지 잘 이해가 되지 않았다.
이제는 조금씩 이해가 되어가는중... VSCode나 IDE 같은 툴이 있어서 정말 다행이다. 재미있다!

### 참고
#### 타입스크립트 전역으로 설치
    npm i -g typescript

#### 타입스크립트 버전 확인
    tsc --version

#### tsconfing.json 파일 생성
    tsc --init
    
#### 타입스크립트 컴파일 시, js 파일 생성
    tsc

#### * 주의: 에러가 있는 타입스크립트 파일을 컴파일해도 콘솔 상에 오류는 나오지만 js 파일은 정상 컴파일되니 참고하자.