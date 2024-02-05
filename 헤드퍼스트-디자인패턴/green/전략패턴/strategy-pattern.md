# 전략패턴 (Strategy-Pattern)

### ✔️ 상황
몇몇 서브클래스에만 적용이 되어야 하는 메서드를 슈퍼클래스에 추가함으로써 모든 서브클래스에 적용된 상황


### ✔️ 문제점
슈퍼클래스에 메서드 변경 및 추가 시, 모든 서브클래스가 영향을 받는다.

몇몇의 서브클래스가 메서드의 동작을 다르게 가지려면 상속받은 메서드를 오버라이딩 해야한다.

오버라이딩 방법으로는 상속의 **코드 재사용성이란 장점을 누릴 수 없다.**


### ✔️ 해결 방법

1. 달라져야 하는 부분을 슈퍼클래스에서 분리한다. 상위 형식, 예를 들어 인터페이스에 맞춰서 각각의 동작들을 클래스로 구현한다.
```
interface QuackBehavior {  void quack();  }

class Quack implements QuackBehavior {

    public void quack() {
        // 꽥꽥
    }

}

class Squeak implements QuackBehavior {

    public void quack() {
        // 삑삑
    }

}
```
2. 슈퍼클래스에 상위 형식(인터페이스 형식)의 인스턴스 변수를 추가한다.
```
public abstract class Duck {

    QuackBehavior quackBehavior;
    //....

    public void performQuack() {
        quackBehavior.quack();
    }
}
```
3. 서브클래스 구현 시, 동작 클래스를 사용하여 인스턴스 변수로 설정 한다.
```
public class MallardDuck extends Duck {

    public MallardDuck {
        quackBehavior = new Quck();
    }

    //....
}
```

### ✔️ 전략패턴 한 마디로 정의
변화될 수 있는 부분을 정의하고, 캡슐화 해서 쓸 수 있게 하는 패턴.

독립적으로 변경할 수 있기 때문에 코드재사용성의 장점을 누리면서 유연한 구조를 가질 수 있다.

-------

### 📌 
인건비 신고는 **대상년월**과 사업장의 **신고유형**에 따라 다르게 동작한다.

자료수집 후, 신고유형이 변경될 수 있다.

변경되는 환경에 따라 동적으로 신고동작을 변경할 수 있어서 **전략패턴**을 적용시킨다면 코드재사용성과 유연성 장점을 누릴 수 있을 것 같다.





