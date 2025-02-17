## 1、面向对象都有哪些特性

（1）继承：继承是从已有类得到继承信息创建新类的过程。

提供继承信息的类被称为父类（超类、基类）；

得到继承信息的类被称为子类（派生类）。

继承让变化中的软件系统有了一定的延续性，同时继承也是封装程序中可变因素的重要手段。

（2） 封装：通常认为封装是把数据和操作数据的方法绑定起来，对数据的访问只能通过已定义的接口。

面向对象的本质就是将现实世界描绘成一系列完全自治、封闭的对象。

**我们在类中编写的方法就是对实现细节的一种封装；我们编写一个类就是对数据和数据操作的封装。可以说，封装就是隐藏一切可隐藏的东西，只向外界提供最简单的编程接口。**

（3） 多态性：多态性是指允许不同子类型的对象对同一消息作出不同的响应。

简单的说就是用同样的对象引用调用同样的方法但是做了不同的事情。多态性分为编译时的多态性和运行时的多态性。

如果将对象的方法视为对象向外界提供的服务，那么运行时的多态性可以解释为：当 A 系统访问 B 系统提供的服务时，B 系统有多种提供服务的方式，但一切对 A 系统来说都是透明的。

**方法重载（overload）实现的是编译时的多态性（也称为前绑定），而方法重写（override）实现的是运行时的多态性（也称为后绑定）。**

运行时的多态是面向对象最精髓的东西，要实现多态需要做两件事：

1. 方法重写（子类继承父类并重写父类中已有的或抽象的方法）；
2. 对象造型（用父类型引用去指向子类型对象，这样同样的引用调用同样的方法就会根据子类对象的不同而表现出不同的行为）。

（4）抽象：抽象是将一类对象的共同特征总结出来构造类的过程，包括数据抽象和行为抽象两方面。抽象只关注对象有哪些属性和行为，并不关注这些行为的细节是什么。

**注意**：默认情况下面向对象有 3 大特性，封装、继承、多态，如果面试官问让说出 4 大特性，那么我们就把抽象

加上去。

## 2、访问权限修饰符 public、private、protected、default

| 修饰符    | 当前类 | 同 包 | 子 类 | 其他包 |
| --------- | ------ | ----- | ----- | ------ |
| public    | ✅      | ✅     | ✅     | ✅      |
| protected | ✅      | ✅     | ✅     | ❌      |
| default   | ✅      | ✅     | ❌     | ❌      |
| private   | ✅      | ❌     | ❌     | ❌      |

## 3、如何理解 clone 对象

### 3.1 为什么要用clone

在实际编程过程中，我们常常要遇到这种情况：

有一个对象 A，在某一时刻 A 中已经包含了一些有效值，此时可能会需要一个和 A 完全相同新对象 B，并且此后对 B 任何改动都不会影响到 A 中的值。也就是说，A 与 B 是两个独立的对象，但 B 的初始值是由 A 对象确定的。

在 Java 语言中，用简单的赋值语句是不能满足这种需求的。要满足这种需求虽然有很多途径，但实现 clone（）方法是其中最简单，也是最高效的手段。

### 3.2 new 一个对象的过程和 clone 一个对象的过程区别

new 操作符的本意是分配内存。程序执行到 new 操作符时，首先去看 new 操作符后面的类型，因为知道了类型，才能知道要分配多大的内存空间。分配完内存之后，再调用构造函数，填充对象的各个域，这一步叫做对象的初始化，构造方法返回后，一个对象创建完毕，可以把他的引用（地址）发布到外部，在外部就可以使用这个引用操纵这个对象。

clone 在第一步是和 new 相似的，都是分配内存，调用 clone 方法时，分配的内存和原对象（即调用 clone 方法的对象）相同，然后再使用原对象中对应的各个域，填充新对象的域，填充完成之后，clone 方法返回，一个新的相同的对象被创建，同样可以把这个新对象的引用发布到外部。

### 3.3 clone 对象的使用

#### 3.3.1 复制对象和复制引用的区别

示例代码：

```java
public class CloneDemo {
    public static void main(String[] args) {
        Person p = new Person("zhang", 23);
        Person p1 = p;
        System.out.println(p);
        System.out.println(p1);
    }


    static class Person {
        private String name;
        private int age;

        public Person(String name, int age) {
            this.name = name;
            this.age = age;
        }
    }
}
```

当 Person p1 = p;执行之后， 是创建了一个新的对象吗？ 首先看打印结果：

```text
org.doyo.javase.CloneDemo$Person@5f184fc6
org.doyo.javase.CloneDemo$Person@5f184fc6
```

可以看出，打印的地址值是相同的，既然地址都是相同的，那么肯定是同一个对象。p 和 p1 只是引用而已，他们都指向了一个相同的对象 Person("zhang", 23) 。 可以把这种现象叫做引用的复制。上面代码执行完成之后， 内存中的情景如下图所示：

<img src="https://cdn.nlark.com/yuque/0/2025/png/23116580/1739263829190-434c6b37-509b-4e61-9304-fa1cd8d57247.png?x-oss-process=image%2Fformat%2Cwebp" width="30%" referrerpolicy="no-referrer"/>

而下面的代码是真真正正的克隆了一个对象。

```java
public class CloneDemo {
    public static void main(String[] args) throws CloneNotSupportedException {
        Person p = new Person("zhang", 23);
        Person p1 = (Person) p.clone();
        System.out.println(p);
        System.out.println(p1);
    }


    static class Person implements Cloneable {
        private String name;
        private int age;

        @Override
        protected Object clone() throws CloneNotSupportedException {
            return super.clone();
        }

        public Person(String name, int age) {
            this.name = name;
            this.age = age;
        }
    }
}
```

从打印结果可以看出，两个对象的地址是不同的，也就是说创建了新的对象， 而不是把原对象的地址赋给了一个新的引用变量：

```text
org.doyo.javase.CloneDemo$Person@5f184fc6
org.doyo.javase.CloneDemo$Person@3feba861
```

以上代码执行完成后， 内存中的情景如下图所示：

<img src="https://cdn.nlark.com/yuque/0/2025/png/23116580/1739264338792-17e6782d-0676-4ff6-9d43-b7ca8a2a6098.png?x-oss-process=image%2Fformat%2Cwebp" width="30%" referrerpolicy="no-referrer"/>

#### 3.3.2 深拷贝和浅拷贝

上面的示例代码中，Person 中有两个成员变量，分别是 name 和 age， name 是 String 类型， age 是 int 类型。

由于 age 是基本数据类型，那么对它的拷贝没有什么疑议，直接将一个 4 字节的整数值拷贝过来就行。

但是 name 是 String 类型的， 它只是一个引用， 指向一个真正的 String 对象，那么对它的拷贝有两种方式：

1、直接将原对象中的 name 的引用值拷贝给新对象的 name 字段

2、根据原 Person 对象中的 name 指向的字符串对象创建一个新的相同的字符串对象，将这个新字符串对象的引用赋给新拷贝的 Person 对象的 name 字段。

这两种拷贝方式分别叫做浅拷贝和深拷贝。深拷贝和浅拷贝的原理如下图所示：

<img src="https://cdn.nlark.com/yuque/0/2025/png/23116580/1739264587571-c3b776c9-550c-417c-979a-9836762eedc7.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_1500%2Climit_0" width="30%" referrerpolicy="no-referrer"/>

下面通过代码进行验证。如果两个 Person 对象的 name 的地址值相同， 说明两个对象的 name 都指向同一个String 对象，也就是浅拷贝， 而如果两个对象的 name 的地址值不同， 那么就说明指向不同的 String 对象， 也就是在拷贝 Person 对象的时候， 同时拷贝了 name 引用的 String 对象， 也就是深拷贝。验证代码如下：

```java
public class CloneDemo {
    public static void main(String[] args) throws CloneNotSupportedException {
        Person p = new Person("zhang", 23);
        Person p1 = (Person) p.clone();
        String result = p.getName() == p1.getName() ? "clone 是浅拷贝的" : "clone 是深拷贝的";
        System.out.println(result);
        System.out.println(p);
        System.out.println(p1);
    }


    static class Person implements Cloneable {
        private String name;
        private int age;

        @Override
        protected Object clone() throws CloneNotSupportedException {
            return super.clone();
        }

        public Person(String name, int age) {
            this.name = name;
            this.age = age;
        }

        public String getName() {
            return name;
        }

        public Person setName(String name) {
            this.name = name;
            return this;
        }

        public int getAge() {
            return age;
        }

        public Person setAge(int age) {
            this.age = age;
            return this;
        }
    }
}

```

打印结果为：

```text
clone 是浅拷贝的
org.doyo.javase.CloneDemo$Person@5f184fc6
org.doyo.javase.CloneDemo$Person@3feba861
```

所以，clone 方法执行的是浅拷贝， 在编写程序时要注意这个细节。

#### 3.3.3 如何进行深拷贝

由上一节的内容可以得出如下结论：如果想要深拷贝一个对象，这个对象必须要实现 Cloneable 接口，实现 clone方法，并且在 clone 方法内部，把该对象引用的其他对象也要 clone 一份，这就要求这个被引用的对象必须也要实现Cloneable 接口并且实现 clone 方法。

那么，按照上面的结论，实现以下代码 Body 类组合了 Head 类，要想深拷贝Body 类，必须在 Body 类的 clone 方法中将 Head 类也要拷贝一份。代码如下：

```java
public class CloneDemoV2 {
    static class Body implements Cloneable {
        public Head head;

        public Body() {
        }

        public Body(Head head) {
            this.head = head;
        }

        @Override
        protected Object clone() throws CloneNotSupportedException {
            Body newBody = (Body) super.clone();
            newBody.head = (Head) head.clone();
            return newBody;
        }
    }

    static class Head implements Cloneable {
        public Face face;

        public Head(Face face) {
        }

        @Override
        protected Object clone() throws CloneNotSupportedException {
            return super.clone();
        }
    }

    static class Face implements Cloneable {
        public Face() {
        }

        @Override
        protected Object clone() throws CloneNotSupportedException {
            return super.clone();
        }
    }

    public static void main(String[] args) throws CloneNotSupportedException {
        Body body = new Body(new Head(new Face()));
        Body body1 = (Body) body.clone();
        System.out.println("body == body1 : " + (body == body1));
        System.out.println("body.head == body1.head : " + (body.head == body1.head));
    }
}

```

输出的结果为：

```text
body == body1 : false
body.head == body1.head : false
```

head对象的引用不相同，说明实现了深拷贝。