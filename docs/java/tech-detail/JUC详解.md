## 一、JMM

JMM（java内存模型Java Memory Model，简称JMM）本身是一种抽象的概念，并不真实存在，它描述的是一组规则或规范，通过这组规范定义了程序中各个变量（包含实例字段，静态字段和构成数组对象的元素）的访问方式。

**JMM关于同步的规定：**

1. 线程解锁前，必须把共享变量的值刷新回主内存
2. 线程加锁前，必须读取主内存的最新值到自己的工作内存
3. 加锁解锁是同一把锁

由于JVM运行程序的实体是线程，而**每个线程创建时JVM都会为其创建一个工作内存**（有些地方称为栈空间），工作内存是每个线程的私有数据区域，而java内存模型中规定所有变量都存储在主内存，主内存是共享内存区域，所有线程都可以访问，但**线程对变量的操作（读取赋值等）必须在工作内存中进行。**

首先要将变量从主内存拷贝的自己的工作内存空间，然后对变量进行操作，操作完成后再将变量写回主内存，不能直接操作主内存中的变量，各个线程中的工作内存中存储着主内存中的变量副本拷贝，因此不同的线程间无法访问对方的工作内存，线程间的通信（传值）必须通过主内存来完成。

其简要访问过程如下图：

<img src="https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634794687-6e6aece8-b41d-49cd-b96f-c7d43f6857e4.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_580%2Climit_0" referrerpolicy="no-referrer"/>



### 1.1 可见性

由于各个线程对主内存中共享变量的操作都是各个线程各自拷贝到自己工作内存中进行操作后再写回到主内存中的，这就可能存在一个线程A修改了共享变量X的值，但还未写回主内存时，另外一个线程B又对主内存中的同一个共享变量X进行操作，但此时A线程工作内存中共享变量X对线程本来说并不可见。

这种工作内存与主内存同步延迟现象就造成了可见性问题。

### 1.2 原子性

原子性是指某个操作是不可分割的，必须作为一个整体执行，不能被中断或分割。换句话说，原子操作要么完全执行，要么完全不执行。

- **在JMM中，有以下几个操作是天然具有原子性的：**

1. 基本数据类型的读取和写入操作

   - 对于int，float，byte，char等基础类型的单次读和写操作是原子的。

   - 示例：

```java
int a = 10; // 写操作是原子的
int b = a;  // 读操作是原子的
```

2. 对引用类型变量的读取和写入

- **在JMM中，以下操作是不具有原子性的：**

1. 非原子符合操作
   - 比如 i++ 或 i = i+1，这些操作实际上包含多个步骤
   - 在多线程环境下，这些步骤可能会被其他线程中断，从而导致竞态条件。
2. 64位长变量的非 volatile 操作
   - 对于 long 和 double 类型的变量，如果它们不是声明为 volatile 的，某些JVM实现可能将它们的读写操作分为两步（高32位和低32位），从而不保证原子性

### 1.3 有序性

JMM的有序性是指**单线程环境里面确保程序最终执行结果和代码顺序执行的结果一致。**

计算机再执行程序时，为了提高性能，编译器和处理器常常会对指令进行重排，一般分为以下三种：

源代码 --> 编译器优化的重排 --> 指令并行的重排 --> 内存系统的重排 --> 最终执行的命令

处理器在进行重排序时必须要考虑指令之间的**数据依赖性。**

多线程环境中，线程交替执行，由于编译器优化重排的存在，两个线程中使用的变量能否保证一致性是无法确定的，结果无法预测。

#### 1.3.1 指令重排

Int a,b,x,y = 0;

| 线程1     | 线程2 |
| --------- | ----- |
| x=a;      | y=b;  |
| b=1;      | a=2;  |
| x=0;  y=0 |       |

如果编译器对这段代码执行重排优化后，可能出现下列情况：

| 线程1     | 线程2 |
| --------- | ----- |
| b=1;      | a=2;  |
| x=a       | y=b;  |
| x=2;  y=1 |       |

这也就说明在多线程环境下，由于编译器优化重排的存在，两个线程中使用的变量能否保证一致性是无法确定的。

#### 1.3.2 指令重排案例

```java
int a = 0;
boolean flag = false;

// Thread A
a = 1;           // 操作1
flag = true;     // 操作2

// Thread B
if (flag) {
    System.out.println(a); // 操作3
}

```

在没有适当同步措施的情况下，Thread B 可能会输出 0 ，因为操作1和操作2可能被重排。

### 1.4 怎样使 JMM线程安全性获得保证

工作内存与主内存同步延迟现象导致的可见性问题，可以使用 **synchronized  或  volatile** 关键字解决，他们都可以使一个线程修改后的变量立即对其他线程可见。

对于指令重排导致的可见性问题和有序性问题，可以利用volatile关键字解决，因为volatile的另外一个作用就是禁止重排序优化。

#### 1.4.1 volatile关键字

Volatile 禁止指令重排，确保写入Volatile 变量的操作对后续读操作可见。

```java
volatile boolean flag = false;
int a = 0;

// Thread A
a = 1;
flag = true;

// Thread B
if (flag) {
    System.out.println(a); // 保证输出1
}

```

#### 1.4.2 synchronized关键字

synchronized 同步块不仅能保证可见性，还能保证进入和退出同步块时的操作顺序。

```java
synchronized (this) {
    sharedVariable = 1;
}
```

## 二、volatile关键字详解

Volatile关键字是java虚拟机提供的轻量级的同步机制，有以下三个特性：

（1）保证可见性

（2）不保证原子性

（3）禁止指令重排

### 2.1 保证可见性

示例代码：

```java
public class VolatileDemo {
    public static void main(String[] args) {
        MyData myData = new MyData();
        new Thread(() -> {
            System.out.println(Thread.currentThread().getName() + "\t 进入 ");
            //暂停一会线程
            try {
                TimeUnit.SECONDS.sleep(3);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            myData.addT060();
            System.out.println(Thread.currentThread().getName() + "\t 修改number值为: " + myData.number);
        }, "AAA").start();
        //第二个线程就是main线程
        while (myData.number == 0) {
            //main线程就一直在这循环 直到number不等于0
        }
        System.out.println(Thread.currentThread().getName() + "\t 任务结束，main线程获取到值为: " + myData.number);
    }


}

class MyData {
    int number = 0;

    public void addT060() {
        this.number = 60;
    }
}
```

<img src="https://cdn.nlark.com/yuque/0/2024/png/23116580/1734779657731-eb296a4d-d494-4e89-8a3d-b8fe74cf129e.png?x-oss-process=image%2Fformat%2Cwebp" referrerpolicy="no-referrer"/>

添加volatile关键字之后：

```java
public class VolatileDemo {
    public static void main(String[] args) {
        MyData myData = new MyData();
        new Thread(() -> {
            System.out.println(Thread.currentThread().getName() + "\t 进入 ");
            //暂停一会线程
            try {
                TimeUnit.SECONDS.sleep(3);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            myData.addT060();
            System.out.println(Thread.currentThread().getName() + "\t 修改number值为: " + myData.number);
        }, "AAA").start();
        //第二个线程就是main线程
        while (myData.number == 0) {
            //main线程就一直在这循环 直到number不等于0
        }
        System.out.println(Thread.currentThread().getName() + "\t 任务结束，main线程获取到值为: " + myData.number);
    }


}

class MyData {
    volatile int number = 0;

    public void addT060() {
        this.number = 60;
    }
}
```

<img src="https://cdn.nlark.com/yuque/0/2024/png/23116580/1734779559103-cac62b5d-14e2-408b-9a46-745aec5456da.png?x-oss-process=image%2Fformat%2Cwebp"  referrerpolicy="no-referrer"/>

?> **结论：volatile 关键字能保证变量的可见性，多个线程修改同一个变量时，一个线程修改完，另一个线程获取到的是修改后的值。**

### 2.2 不保证原子性

示例代码：

```java
class MyData {
    volatile int number = 0;

    //请注意，此时number前面是加了volatile关键字修饰的，volatile不保证原子性
    public void addPlusPlus() {
        number++;
    }
}

public class VolatileDemo {
    public static void main(String[] args) {
        MyData myData = new MyData();
        for (int i = 0; i < 20; i++) {
            new Thread(() -> {
                for (int j = 1; j <= 1000; j++) {
                    myData.addPlusPlus();
                }
            }, String.valueOf(i)).start();
        }
        //需要等待上面20个线程全都计算完成后，再用main线程取得最终的结果值看是多少
        while (Thread.activeCount() > 2) {
            //2  是指最少有两个线程 main线程和GC线程
            Thread.yield();
        }
        System.out.println(Thread.currentThread().getName() + "\t 最终数值: " + myData.number);
    }
}
```

运行结果：

<img src="https://cdn.nlark.com/yuque/0/2024/png/23116580/1734780107736-345216ce-cf09-4d6e-a667-0280f414373b.png?x-oss-process=image%2Fformat%2Cwebp" referrerpolicy="no-referrer"/>

?> **结论：volatile 关键字不能保证变量的原子性，当多个线程修改一个变量的时候可能会出现写丢失的情况。**

### 2.3 使volatile保证原子性的方法

示例代码：

```java
class MyData {
    AtomicInteger atomicInteger = new AtomicInteger();

    public void addAtomic() {
        atomicInteger.getAndIncrement();//+1
    }
}

public class VolatileDemo {
    public static void main(String[] args) {
        MyData myData = new MyData();
        for (int i = 0; i < 20; i++) {
            new Thread(() -> {
                for (int j = 1; j <= 1000; j++) {
                    myData.addAtomic();
                }
            }, String.valueOf(i)).start();
        }
        //需要等待上面20个线程全都计算完成后，再用main线程取得最终的结果值看是多少
        while (Thread.activeCount() > 2) {
            //2  是指最少有两个线程 main线程和GC线程
            Thread.yield();
        }
        System.out.println(Thread.currentThread().getName() + "\t atomic 数值为: " + myData.atomicInteger);
    }
}
```

<img src="https://cdn.nlark.com/yuque/0/2024/png/23116580/1734780362718-c33444dc-2ddd-48b8-9dc0-e637ce7bf536.png?x-oss-process=image%2Fformat%2Cwebp" referrerpolicy="no-referrer" />

?> **结论：通过AtomicInteger包装类可以保证变量的原子性。**

### 2.4 禁止指令重排

volatile能够实现禁止指令重排优化，从而避免多线程环境下程序出现乱序执行的现象。

先了解一个概念：内存屏障——又称内存栅栏，是一个CPU指令，它的作用有两个：

- 保证特定操作的执行顺序
- 保证某些变量的内存可见性（利用该特性实现 volatile 的内存可见性）

由于编译器和处理器都能执行指令重排优化，如果在指令间插入一条内存屏障则会告诉编译器和CPU，不管什么指令都不能和这条内存屏障指令重排序，也就是说 **通过插入内存屏障禁止在内存屏障前后的指令执行重排序优化**。

内存屏障的另外一个作用是强制刷出各种CPU的缓存数据，因此任何CPU上的线程都能读取到这些数据的最新版本。

<img src="https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634799935-632de860-a345-4abd-856e-88520ed4fcf0.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_896%2Climit_0" referrerpolicy="no-referrer"  />

## 三、Volatile的应用场景

### 3.1 单线程环境下的单例模式

代码示例：

```java
public class SingletonDemo {
    private static SingletonDemo instance = null;

    private SingletonDemo() {
        System.out.println(Thread.currentThread().getName() + "\t 我是构造方法SingletonDemo()");
    }

    public static SingletonDemo getInstance() {
        if (instance == null) {
            instance = new SingletonDemo();
        }
        return instance;

    }

    public static void main(String[] args) {
        //单线程的单例模式
        System.out.println(SingletonDemo.getInstance() == SingletonDemo.getInstance());
        System.out.println(SingletonDemo.getInstance() == SingletonDemo.getInstance());
        System.out.println(SingletonDemo.getInstance() == SingletonDemo.getInstance());
    }
}

```

运行结果：

<img src="https://cdn.nlark.com/yuque/0/2024/png/23116580/1734833888684-108628eb-7d20-4ecd-bf5f-0cca6ba8deaa.png?x-oss-process=image%2Fformat%2Cwebp"  referrerpolicy="no-referrer" />

?> **结论：单线程环境下，单例模式正常**

### 3.2 多线程环境下的单例模式

代码示例：

```java
public class SingletonDemo {
    private static SingletonDemo instance = null;

    private SingletonDemo() {
        System.out.println(Thread.currentThread().getName() + "\t 我是构造方法SingletonDemo()");
    }

    public static SingletonDemo getInstance() {
        if (instance == null) {
            instance = new SingletonDemo();
        }
        return instance;
    }

    public static void main(String[] args) {
        //并发多线程后，单例模式出现问题
        for (int i = 1; i <= 10; i++) {
            new Thread(() -> {
                SingletonDemo.getInstance();
            }, String.valueOf(i)).start();
        }
    }
}
```

运行结果：

<img src="https://cdn.nlark.com/yuque/0/2024/png/23116580/1734834124121-9335f100-c67b-4530-b75e-f5028792ce9f.png?x-oss-process=image%2Fformat%2Cwebp" referrerpolicy="no-referrer" >

?> **结论：多线程环境下，单例模式异常**

解决方法代码示例：

```java
  public static SingletonDemo getInstance() {
      //DCL(Double Check Lock 双重检查锁机制)
      if (instance == null) {
          synchronized (SingletonDemo.class) {
              if (instance == null) {
                  instance = new SingletonDemo();
              }
          }
      }
      return instance;
  }
```

运行结果：

<img src="https://cdn.nlark.com/yuque/0/2024/png/23116580/1734834304620-d23e1876-9941-4b85-b7d3-727552eaf8e7.png?x-oss-process=image%2Fformat%2Cwebp" referrerpolicy="no-referrer"/>

**结论：单例模式貌似好使了**

### 3.3 单例模式volatile分析

!> **DCL（双重检查锁）机制不一定线程安全，原因是有指令重排序的存在，加入volatile可以禁止指令重排。**

原因在于某一个线程执行到第一次检测，读取到的instance不为空时，instance的引用对象可能 **没有完成初始化。** 

instance = new SingletonDemo();可以分为以下三步完成（伪代码）

- memory = allocate(); // 1.分配对象内存空间
- instance(memory); // 2.初始化对象
- instance = memory; // 3.将内存地址赋值给instance，此时instance != null

步骤2和步骤3不存在数据依赖关系，而且无论重排前还是重排后程序的执行结果在单线程中并没有改变，因此这种重排优化是允许的。

重排后的步骤如下：

- memory = allocate(); // 1.分配对象内存空间
- instance = memory; // 3.将内存地址赋值给instance，此时instance != null，**其他线程此时进入，是可以直接获取到instance的，但是对象还没有初始化完成。**
- instance(memory); // 2.初始化对象

但是指令重排只会保证单线程环境下执行的一致性，不能保证多线程环境下的一致性。所以当一个线程访问instance不为空时，由于instance未必已经初始化完成，也就造成了线程安全问题。

修改后的代码示例如下：

```java
public class SingletonDemo {
    // 使用 volatile 防止指令重排序
    private static volatile SingletonDemo instance = null;

    private SingletonDemo() {
        System.out.println(Thread.currentThread().getName() + "\t 我是构造方法SingletonDemo()");
    }

    public static SingletonDemo getInstance() {
        // DCL (Double Check Lock 双重检查锁机制)
        if (instance == null) {
            synchronized (SingletonDemo.class) {
                if (instance == null) {
                    instance = new SingletonDemo();
                }
            }
        }
        return instance;
    }

    public static void main(String[] args) {
        // 并发多线程后，单例模式的测试
        for (int i = 1; i <= 10; i++) {
            new Thread(() -> {
                SingletonDemo.getInstance();
            }, String.valueOf(i)).start();
        }
    }
}

```

## 四、CAS

### 4.1 什么是CAS

CAS指**Compare-And-Swap**（比较并交换），是一种实现**无锁并发编程**的重要技术。它主要用于多线程编程中，通过硬件级别的原子操作来保证共享变量的安全更新，而无需使用传统的锁机制，从而提升性能。

?> 它的功能是判断内存某个位置的值是否为预期值，如果是则更改为新的值，这个过程是原子性的

CAS操作包含以下三个关键值：

1. **内存值 V**：变量在内存中的当前值。
2. **预期值 A**：线程期望变量的当前值。
3. **更新值 B**：需要将变量更新为的值。

操作过程如下：

1. 比较当前内存值  V  是否等于预期值 A。
2. 如果相等，则将内存值更新为 B。
3. 如果不相等，则说明其他线程已经修改了内存值，CAS操作失败。

CAS操作通常由底层的硬件指令支持，例如x86架构的 cmpxchg 指令。

示例代码：

```java
public class CASDemo {
    public static void main(String[] args) {
        AtomicInteger atomicInteger = new AtomicInteger(5);
        //main do thing...
        System.out.println(atomicInteger.compareAndSet(5, 2019) + "\t 当前数据: " + atomicInteger.get());
        System.out.println(atomicInteger.compareAndSet(5, 2014) + "\t 当前数据: " + atomicInteger.get());
    }
}
```

运行结果：

<img src="https://cdn.nlark.com/yuque/0/2024/png/23116580/1734920719405-97079c8a-9545-42fb-ae97-e74bac5eb0e9.png?x-oss-process=image%2Fformat%2Cwebp" referrerpolicy="no-referrer" >

?> 结论：atomicInteger.compareAndSet(5, 2019)方法比较当前atomicInteger对象的值是不是5，如果是则换成2019。

### 4.2 CAS底层原理

#### **4.2.1 Java中的CAS实现**

Java中通过 **Unsafe类** 和 **java.util.concurrent.atomic包** 提供了CAS操作的支持。常用的CAS工具类包括：

1. **AtomicInteger**：操作整数的原子类。
2. **AtomicLong**：操作长整型的原子类。
3. **AtomicReference**：操作对象引用的原子类

AtomicInteger.getAndIncrement()方法可以保证多线程并发情况下的原子性，在多线程情况下也能让atomicInteger的值准确加一。原理如下：

```java
  /**
   * Atomically increments by one the current value.
   *
   * @return the previous value
   */
  public final int getAndIncrement() {
      return unsafe.getAndAddInt(this, valueOffset, 1);
  }

  public final int getAndAddInt(Object var1, long var2, int var4) {
      int var5;
      do {
          var5 = this.getIntVolatile(var1, var2);
      } while(!this.compareAndSwapInt(var1, var2, var5, var5 + var4));

      return var5;
  }
```

compareAndSwapInt方法的参数中：

Var1：当前AtomicInteger对象

Var2：AtomicInteger得引用地址

Var4：需要变动的数量，固定值1，用于与AtomicInteger对象的值相加

Var5：通过var1，var2找出的当前对象在var2引用地址上的值（当前对象在主内存的值）

?> **compareAndSwapInt()  方法的意义：比较当前 atomicInteger 对象的值是否与主内存中的 atomicInteger 值相等，如果相等说明该值没有被别的线程改掉，此时可以进行修改，将原来的值+1返回true，如果不同，重新获取主内存中的值再进行比较，直到更新完成。**

假设线程A和线程B两个线程同时执行 getAndAddInt操作：

1. AtomicInteger里面的value原始值为3，即主内存中AtomicInteger的value为3，根据JMM模型，线程A和线程B各自持有一份值为3的value的副本分别到各自的工作内存。
2. 线程A通过getIntVolatile(var1,var2)拿到value值为3，这时线程A被挂起
3. 线程B也通getIntVolatile(var1,var2)拿到value值为3，此时线程B执行compareAndSwapInt方法，比较内存值也为3，成功修改内存值为4，线程B结束操作
4. 现在线程A恢复，执行compareAndSwapInt方法比较发现自己手里的数值3和主内存的值4不一致，说明该值已经被其他线程抢先一步修改过了，那线程A本次修改失败，只能重新读取再来一遍。
5. 线程A重新获得value值，因为变量value被volatile修饰，所以其他线程对它的修改，线程A总是能够看见，线程A继续执行compareAndSwapInt进行比较替换，直到成功。

#### 4.2.2 Unsafe

unsafe是CAS的核心类，由于java方法无法直接访问底层系统，需要通过本地（native）方法来访问，Unsafe相当于一个后门，基于该类可以直接操作特定内存的数据。

!> 注意：Unsafe类中的所有方法都是native修饰的，也就是说Unsafe类中的方法都是直接调用底层C语言代码去使用操作系统底层资源执行相应任务的

### 4.3 CAS缺点

#### 4.3.1 自旋消耗资源大

我们可以看到，getAndAddInt方法执行时有个do while循环，如果CAS失败，会一直进行尝试。如果CAS长时间不成功，可能会给CPU带来很大的开销，自旋操作适合冲突较少的场景，冲突频繁时性能会下降。

#### 4.3.2 只能保证单个变量的原子性

当对一个共享变量执行操作时，我们可以使用循环CAS的方式来保证原子操作，但是对多个共享变量操作时，循环CAS就无法保证操作的原子性，这时需要结合其他机制（如 锁 或 AtomicReference）。

#### 4.3.3 ABA问题

CAS算法实现的一个重要前提是需要取出内存中某个时刻的数据并在当下时刻比较并替换，那么在这个时间差，可能会导致数据的变化。

比如线程t1将一个变量值从A变为B，然后又变回A，线程t2获取这个变量执行CAS操作的时候，会认为这个值没有发生过变化。这是可以通过使用版本号（如 AtomicStampedReference）来避免 ABA 问题。

代码示例;

```java
public class ABADemo {
    static AtomicReference<Integer> atomicReference = new AtomicReference<>(100);
    static AtomicStampedReference<Integer> atomicStampedReference = new AtomicStampedReference<>(100, 1);

    public static void main(String[] args) {
        new Thread(() -> {
            int stamp = atomicStampedReference.getStamp();
            System.out.println(Thread.currentThread().getName() + "\t第一次版本号： " + stamp);
            //暂停1秒t3线程 等待T4拿到与T3第一次一样的版本号
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            atomicStampedReference.compareAndSet(100, 101, atomicStampedReference.getStamp(), atomicStampedReference.getStamp() + 1);
            System.out.println(Thread.currentThread().getName() + "\t第二次版本号： " + atomicStampedReference.getStamp());
            atomicStampedReference.compareAndSet(101, 100, atomicStampedReference.getStamp(), atomicStampedReference.getStamp() + 1);
            System.out.println(Thread.currentThread().getName() + "\t第三次版本号： " + atomicStampedReference.getStamp());
        }, "T3").start();

        new Thread(() -> {
            int stamp = atomicStampedReference.getStamp();
            System.out.println(Thread.currentThread().getName() + "\t第一次版本号： " + stamp);
            //暂停线程3秒钟t4线程 保证t3线程完成ABA操作
            try {
                TimeUnit.SECONDS.sleep(3);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            boolean result = atomicStampedReference.compareAndSet(100, 2019, stamp, stamp + 1);
            System.out.println(Thread.currentThread().getName() + "\t修改成功否" + result + " 当前最新版本号： " + atomicStampedReference.getStamp());
            System.out.println(Thread.currentThread().getName() + "\t当前实际最新值" + atomicStampedReference.getReference());
        }, "T4").start();
    }
}
```

运行结果：

<img src="https://cdn.nlark.com/yuque/0/2024/png/23116580/1734925905425-33b9aaf7-dc87-4b95-ad3a-93cce83fcb66.png?x-oss-process=image%2Fformat%2Cwebp" referrerpolicy="no-referrer">

?> 结论：时间戳原子引用可以解决ABA问题，版本号不符合将修改失败

compareAndSet方法实现代码：

```java
    public boolean compareAndSet(V expectedReference, V newReference, int expectedStamp, int newStamp) {
        Pair<V> current = this.pair;
        return expectedReference == current.reference && expectedStamp == current.stamp && (newReference == current.reference && newStamp == current.stamp || this.casPair(current, AtomicStampedReference.Pair.of(newReference, newStamp)));
    }
```

比较过程：

1. 比较传入的期望值与实际内存中的值是否相等
2. 比较当前版本号与内存中最新的版本号是否相等
3. 以上两个条件都满足才可以修改

### 4.4 CAS优点

避免了使用传统锁，（如 synchronized 和 ReentrantLock）的线程阻塞与上下文切换，效率更高。

## 五、集合类线程不安全

### 5.1 List并发修改异常

代码示例：

```java
public class ContainerNotSafeDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        for (int i = 1; i <= 30; i++) {
            int finalI = i;
            new Thread(() -> {
                list.add(finalI + "");
                System.out.println("当前线程:" + Thread.currentThread().getName() + ";集合内容:" + list);
            }, String.valueOf(i)).start();
        }
        //java.util.ConcurrentModificationException
    }
}
```

运行结果：

<img src="https://cdn.nlark.com/yuque/0/2024/png/23116580/1735011676815-c34dbd9b-bc29-4218-9ddd-aae4ad06cbba.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_1500%2Climit_0" referrerpolicy="no-referrer">

!> 为什么会抛异常 ConcurrentModificationException？

1. 在 ArrayList 中，有一个字段 modCount，记录集合结构性修改的次数。一个线程在调用 list.add() 修改集合时，modCount 会增加。

```java
 public boolean add(E e) {
        ++this.modCount;
        this.add(e, this.elementData, this.size);
        return true;
 }
```

2. 另一个线程尝试输出集合（通过 System.out.println(list)），会调用toString()方法，该方法会创建一个迭代器进行遍历，遍历过程中**E e = it.next()** 方法中的**this.checkForComodification()** 方法会判断 modCount 与 expectedModCount 不一致，就会抛出 ConcurrentModificationException。

   ArrrayList的 toString()方法源码如下，该方法继承自 AbstractCollection ：

```java
 public String toString() {
        Iterator<E> it = this.iterator();
        if (!it.hasNext()) {
            return "[]";
        } else {
            StringBuilder sb = new StringBuilder();
            sb.append('[');

            while(true) {
                E e = it.next();
                sb.append(e == this ? "(this Collection)" : e);
                if (!it.hasNext()) {
                    return sb.append(']').toString();
                }

                sb.append(',').append(' ');
            }
        }
    }
```

```java
public E next() {
    this.checkForComodification();
    int i = this.cursor;
    if (i >= ArrayList.this.size) {
        throw new NoSuchElementException();
    } else {
        Object[] elementData = ArrayList.this.elementData;
        if (i >= elementData.length) {
            throw new ConcurrentModificationException();
        } else {
            this.cursor = i + 1;
            return elementData[this.lastRet = i];
        }
    }
}

final void checkForComodification() {
    if (SubList.this.root.modCount != this.expectedModCount) {
        throw new ConcurrentModificationException();
    }
}
```



### 5.2 List集合线程不安全的解决办法

#### 5.2.1 使用Vector代替ArrayList

代码示例：

```java
public class ContainerNotSafeDemo {
    public static void main(String[] args) {
        List<String> list = new Vector<>();
        for (int i = 1; i <= 30; i++) {
            int finalI = i;
            new Thread(() -> {
                list.add(finalI + "");
                System.out.println("当前线程:" + Thread.currentThread().getName() + ";集合内容:" + list);
            }, String.valueOf(i)).start();
        }
    }
}
```

源代码：

```java
public synchronized boolean add(E e) {
      ++this.modCount;
      this.add(e, this.elementData, this.elementCount);
      return true;
}
```

?> Vector在add方法添加了synchronized锁来保证写入集合时的线程安全

```java
public synchronized String toString() {
    return super.toString();
}
```

?> Vector的toString()方法也是线程安全的，在遍历输出元素时，不能对list集合进行修改。所以不会抛出异常：ConcurrentModificationException。

运行结果：

<img src="https://cdn.nlark.com/yuque/0/2024/png/23116580/1735011770417-192ca23d-8bab-43f0-888e-f0b79c58a04c.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_1500%2Climit_0"  referrerpolicy="no-referrer">

#### 5.2.2 使用Collections.synchronizedList()

代码示例：

```java
public class ContainerNotSafeDemo {
    public static void main(String[] args) {
        List<String> list = Collections.synchronizedList(new ArrayList<>());
        for (int i = 1; i <= 30; i++) {
            int finalI = i;
            new Thread(() -> {
                list.add(finalI + "");
                System.out.println("当前线程:" + Thread.currentThread().getName() + ";集合内容:" + list);
            }, String.valueOf(i)).start();
        }
    }
}
```

源代码：

```java
public boolean add(E e) {
    synchronized(this.mutex) {
        return this.c.add(e);
    }
}
```

?>   是在插入数据时使用了synchronized来保证线程安全。

```java
public String toString() {
    synchronized(this.mutex) {
        return this.c.toString();
    }
}
```

?>  Collections.synchronizedList 的toString()方法也是线程安全的，在遍历输出元素时，不能对list集合进行修改。所以不会抛出异常：ConcurrentModificationException。

运行结果：

<img src="https://cdn.nlark.com/yuque/0/2024/png/23116580/1735011870513-46a312e9-e112-4d31-8119-7992affdbd45.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_1500%2Climit_0"  referrerpolicy="no-referrer">



#### 5.2.3 为什么输出内容忽长忽短

!> 观察上面两种方式的运行结果可以看见，虽然输出结果不抛异常了，但是多个线程输出的集合内容忽长忽短的。

这是因为：

1. System.out.println(list) 打印操作并不是线程安全的
2. 添加元素和打印 list 的内容这是两步操作，合起来不能保证原子性。

假设时间点如下：

**时间点 T1：线程 A**

1. 线程 A 执行 list.add("a")，成功将 "a" 添加到 list，当前状态为 ["a"]。
2. 线程 A 进入 System.out.println(list)，准备打印。
3. 在打印之前，线程 A 会读取 list 的当前内容，即 ["a"]，将其作为打印的输入。

**时间点 T2：线程 B**

1. 在线程 A 开始打印之前，线程 B 调用 list.add("b")，将 "b" 添加到 list，更新状态为 ["a", "b"]。
2. 线程 B 紧接着执行 System.out.println(list)，读取 list 的状态，打印 ["a", "b"]。

**时间点 T3：线程 A 打印完成**

1. 尽管线程 B 已经修改了 list，线程 A 打印的内容是它在时间点 T1 读取的状态（["a"]），因为线程 A 的打印输入在时间点 T1 已经确定。

**结果：线程 B 更早完成打印，导致后打印的线程 A 输出了一个“早期状态”的 list，看起来变短了。**

?> **为了解决这一问题，我们需要对读取和打印操作显式进行同步，确保同一时刻只有一个线程能进行读取与打印：**

```java
public class ContainerNotSafeDemo {
    public static void main(String[] args) {
        List<String> list = new Vector<>();
        for (int i = 1; i <= 30; i++) {
            int finalI = i;
            new Thread(() -> {
                list.add(finalI + "");
                // 显式同步
                synchronized (list) {
                    System.out.println("当前线程:" + Thread.currentThread().getName() + ";集合内容:" + list);
                }
            }, String.valueOf(i)).start();
        }
    }
}

public class ContainerNotSafeDemo {
    public static void main(String[] args) {
        List<String> list = Collections.synchronizedList(new ArrayList<>());
        for (int i = 1; i <= 30; i++) {
            int finalI = i;
            new Thread(() -> {
                list.add(finalI + "");
                // 显式同步
                synchronized (list) {
                    System.out.println("当前线程:" + Thread.currentThread().getName() + ";集合内容:" + list);
                }
            }, String.valueOf(i)).start();
        }
    }
}
```

运行结果：

<img src="https://cdn.nlark.com/yuque/0/2024/png/23116580/1735012070356-0c56d396-1a16-4a85-b353-3b50bef2a959.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_1500%2Climit_0"  referrerpolicy="no-referrer">

可以发现，在给打印操作添加了锁之后，同一时刻只能有一个线程去读取并打印，这样每次打印的数据都是最新的，所以是递增的，但是有的时候会增加一条，有的时候会增加两条，有的时候不增加。

?> **这是因为添加元素和打印 list 的内容这是两步操作，合起来不能保证原子性，需要将添加元素的操作和打印操作都添加到锁代码块中。这样能够确保所有的线程都是按顺序先执行add操作，再执行读取和打印操作。**

```java
public class ContainerNotSafeDemo {
    public static void main(String[] args) {
        List<String> list = new Vector<>();
        for (int i = 1; i <= 30; i++) {
            int finalI = i;
            new Thread(() -> {
                // 显式同步
                synchronized (list) {
                    list.add(finalI + "");
                    System.out.println("当前线程:" + Thread.currentThread().getName() + ";集合内容:" + list);
                }
            }, String.valueOf(i)).start();
        }
    }
}

public class ContainerNotSafeDemo {
    public static void main(String[] args) {
        List<String> list = Collections.synchronizedList(new ArrayList<>());
        for (int i = 1; i <= 30; i++) {
            int finalI = i;
            new Thread(() -> {
                // 显式同步
                synchronized (list) {
                    list.add(finalI + "");
                    System.out.println("当前线程:" + Thread.currentThread().getName() + ";集合内容:" + list);
                }
            }, String.valueOf(i)).start();
        }
    }
}
```

运行结果:

<img src="https://cdn.nlark.com/yuque/0/2024/png/23116580/1735012156725-6202aa76-f1e0-48c4-a76e-65803f1742d7.png?date=1735012158337"  referrerpolicy="no-referrer">



#### 5.2.4 Vector 与 Collections.synchronizedList() 对比

| 特性             | Collections.synchronizedList()                             | Vector                           |
| ---------------- | ---------------------------------------------------------- | -------------------------------- |
| **线程安全机制** | 使用 synchronized 包装底层 List                            | 直接在方法级别使用 synchronized  |
| **性能**         | 比 Vector 更灵活，可以选择更高效的底层实现（如 ArrayList） | 相对较低，因为同步机制内置方法中 |
| **灵活性**       | 支持包装任何 List 类型，实现灵活                           | 固定实现，无法替换底层结构       |
| **扩展性**       | 可以通过继承包装类实现额外功能                             | 扩展性有限                       |
| **历史背景**     | 后续添加，用于替代早期线程安全类                           | 早期类（JDK 1.0），逐渐被取代    |

1、相似点：

- 两者都通过synchronized 实现线程安全。
- 适合多线程场景下的安全访问。

2、不同点：

- Vector 是线程安全的类，线程安全机制直接嵌入方法内部。
- Collections.synchronizedList() 是一种包装器，可以对任意 List 实现（如 ArrayList）进行线程安全包装，灵活性更高。

3、推荐使用：

- 如果需要线程安全的 List，优先选择 Collections.synchronizedList() 或更高效的并发集合类（如 CopyOnWriteArrayList）。
- Vector 已逐渐过时，通常不推荐在新项目中使用。

!> **由于这两种操作都使用了synchronized，所以进行读写操作时会互相阻塞，一个线程正在读的时候，其他线程无法写入。**



#### 5.2.5 使用CopyOnWriteArrayList

代码示例：

```java
public class ContainerNotSafeDemo {
    public static void main(String[] args) {
        List<String> list = new CopyOnWriteArrayList<>();
        for (int i = 1; i <= 30; i++) {
            int finalI = i;
            new Thread(() -> {
                list.add(finalI + "");
                System.out.println("当前线程:" + Thread.currentThread().getName() + ";集合内容:" + list);
            }, String.valueOf(i)).start();
        }
    }
}
```

运行结果：

<img src="https://cdn.nlark.com/yuque/0/2024/png/23116580/1735012235493-355cfde9-3a73-4247-bd47-a0db9db53395.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_1500%2Climit_0"  referrerpolicy="no-referrer">

写时复制的原理：

**（1）读操作**

- 读操作不加锁，直接访问底层数组，因为底层数组在写操作期间会被复制，不影响原数组的内容。
- 适用于读多写少的场景。

**（2）写操作**

- 写操作通过加锁（早期版本使用ReentrantLock，新版本使用synchronized）来保证线程安全。
- 具体步骤：
  1. 获取锁，防止多个线程同时写。
  2. 复制当前数组到一个新数组。
  3. 在新数组上执行写操作。
  4. 将新数组替换为底层数组。
  5. 释放锁。

**（3）源码分析**

```java
public boolean add(E e) {
    synchronized(this.lock) { // 使用 synchronized 对锁对象加锁
        Object[] es = this.getArray(); // 获取当前数组
        int len = es.length; // 数组长度
        es = Arrays.copyOf(es, len + 1); // 复制数组
        es[len] = e; // 添加新元素
        this.setArray(es); // 替换原数组
        return true;
    }
}
```

**（4）优点**

1. **读性能高**：读操作不加锁，多个线程可以同时读取，适合读多写少的场景。
2. **线程安全**：写操作通过复制数组和加锁实现，保证了线程安全性。
3. **迭代安全**：Iterator 迭代器在遍历该集合时，不会抛出 ConcurrentModificationException，因为写操作不会修改原数组。**但依旧会有读取不到最新数据的情况。**

**（5）缺点**

1. **写操作性能低**：每次写操作都需要复制整个数组，占用更多内存，性能低。
2. **不适合写多场景**：在高写操作场景中，性能可能会显著下降。

**（6）使用场景**

- 配置、黑白名单、缓存等场景，数据更新频率较低，但读取频率很高。
- 适合对实时性要求不高的场景，因为读操作可能读到旧的数据。

### 5.3 Set并发修改异常

代码示例：

```java
public class ContainerNotSafeDemo {
    public static void main(String[] args) {
        Set<String> set = new HashSet<>();
        for (int i = 1; i <= 30; i++) {
            int finalI = i;
            new Thread(() -> {
                set.add(finalI + "");
                System.out.println("当前线程:" + Thread.currentThread().getName() + ";集合内容:" + set);
            }, String.valueOf(i)).start();
        }
    }
}
```

运行结果：

<img src="https://cdn.nlark.com/yuque/0/2024/png/23116580/1735010948671-9256bf02-ff35-441b-9b7e-9fefb7ebacf4.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_1500%2Climit_0"  referrerpolicy="no-referrer">

### 5.4 Set线程不安全解决方法

#### 5.4.1 使用Collections.synchronizedSet()方法

代码示例：

```java
public class ContainerNotSafeDemo {
    public static void main(String[] args) {
        Set<String> set = Collections.synchronizedSet(new HashSet<>());
        for (int i = 1; i <= 30; i++) {
            int finalI = i;
            new Thread(() -> {
                set.add(finalI + "");
                System.out.println("当前线程:" + Thread.currentThread().getName() + ";集合内容:" + set);
            }, String.valueOf(i)).start();
        }
    }
}
```

运行结果：

<img src="https://cdn.nlark.com/yuque/0/2024/png/23116580/1735011121156-14ce955c-140d-4030-994f-55a7783a1d32.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_1500%2Climit_0"  referrerpolicy="no-referrer">

#### 5.4.2 使用CopyOnWriteArraySet

代码示例：

```java
public class ContainerNotSafeDemo {
    public static void main(String[] args) {
        Set<String> set = new CopyOnWriteArraySet<>();
        for (int i = 1; i <= 30; i++) {
            int finalI = i;
            new Thread(() -> {
                set.add(finalI + "");
                System.out.println("当前线程:" + Thread.currentThread().getName() + ";集合内容:" + set);
            }, String.valueOf(i)).start();
        }
    }
}
```

运行结果：

<img src="https://cdn.nlark.com/yuque/0/2024/png/23116580/1735024295055-751b5262-89ec-48de-aab3-cd95767e6c1e.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_1500%2Climit_0"  referrerpolicy="no-referrer">

?> **注意：这个类底层使用的是 CopyOnWriteArrayList**

```java
public CopyOnWriteArraySet() {
    this.al = new CopyOnWriteArrayList();
}
```

