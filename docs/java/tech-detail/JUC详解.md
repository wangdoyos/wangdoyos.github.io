## 一、JMM

JMM（java内存模型Java Memory Model，简称JMM）本身是一种抽象的概念，并不真实存在，它描述的是一组规则或规范，通过这组规范定义了程序中各个变量（包含实例字段，静态字段和构成数组对象的元素）的访问方式。

**JMM关于同步的规定：**

1、线程解锁前，必须把共享变量的值刷新回主内存

2、线程加锁前，必须读取主内存的最新值到自己的工作内存

3、加锁解锁是同一把锁

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

1、基本数据类型的读取和写入操作

- 对于int，float，byte，char等基础类型的单次读和写操作是原子的。

- 示例：

```java
int a = 10; // 写操作是原子的
int b = a;  // 读操作是原子的
```

2、对引用类型变量的读取和写入

- **在JMM中，以下操作是不具有原子性的：**

（1）非原子符合操作
- 比如 i++ 或 i = i+1，这些操作实际上包含多个步骤
- 在多线程环境下，这些步骤可能会被其他线程中断，从而导致竞态条件。

（2）64位长变量的非 volatile 操作
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

运行结果：

```text
AAA	 进入 
AAA	 修改number值为: 60
```

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

运行结果：

```text
AAA	 进入 
AAA	 修改number值为: 60
main	 任务结束，main线程获取到值为: 60
```

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

```text
main	 最终数值: 19654
```

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

运行结果：

```text
main	 atomic 数值为: 20000
```

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

```text
main	 我是构造方法SingletonDemo()
true
true
true
```

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

```text
7	 我是构造方法SingletonDemo()
1	 我是构造方法SingletonDemo()
5	 我是构造方法SingletonDemo()
6	 我是构造方法SingletonDemo()
4	 我是构造方法SingletonDemo()
3	 我是构造方法SingletonDemo()
2	 我是构造方法SingletonDemo()
```

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

```text
1	 我是构造方法SingletonDemo()
```

**结论：单例模式貌似好使了**

### 3.3 单例模式volatile分析

!> **DCL（双重检查锁）机制不一定线程安全，原因是有指令重排序的存在，加入volatile可以禁止指令重排。**

原因在于某一个线程执行到第一次检测，读取到的instance不为空时，instance的引用对象可能 **没有完成初始化。** 

instance = new SingletonDemo();可以分为以下三步完成（伪代码）

1、memory = allocate(); // 1.分配对象内存空间

2、instance(memory); // 2.初始化对象

3、instance = memory; // 3.将内存地址赋值给instance，此时instance != null

步骤2和步骤3不存在数据依赖关系，而且无论重排前还是重排后程序的执行结果在单线程中并没有改变，因此这种重排优化是允许的。

重排后的步骤如下：

1、memory = allocate(); // 1.分配对象内存空间

2、instance = memory; // 3.将内存地址赋值给instance，此时instance != null，**其他线程此时进入，是可以直接获取到instance的，但是对象还没有初始化完成。**

3、instance(memory); // 2.初始化对象

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

1、**内存值 V**：变量在内存中的当前值。

2、**预期值 A**：线程期望变量的当前值。

3、**更新值 B**：需要将变量更新为的值。

操作过程如下：

1、比较当前内存值  V  是否等于预期值 A。

2、如果相等，则将内存值更新为 B。

3、如果不相等，则说明其他线程已经修改了内存值，CAS操作失败。

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

```text
true	 当前数据: 2019
false	 当前数据: 2019
```

?> 结论：atomicInteger.compareAndSet(5, 2019)方法比较当前atomicInteger对象的值是不是5，如果是则换成2019。

### 4.2 CAS底层原理

#### **4.2.1 Java中的CAS实现**

Java中通过 **Unsafe类** 和 **java.util.concurrent.atomic包** 提供了CAS操作的支持。常用的CAS工具类包括：

1、**AtomicInteger**：操作整数的原子类。

2、**AtomicLong**：操作长整型的原子类。

3、**AtomicReference**：操作对象引用的原子类

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

1、AtomicInteger里面的value原始值为3，即主内存中AtomicInteger的value为3，根据JMM模型，线程A和线程B各自持有一份值为3的value的副本分别到各自的工作内存。

2、线程A通过getIntVolatile(var1,var2)拿到value值为3，这时线程A被挂起

3、线程B也通getIntVolatile(var1,var2)拿到value值为3，此时线程B执行compareAndSwapInt方法，比较内存值也为3，成功修改内存值为4，线程B结束操作

4、现在线程A恢复，执行compareAndSwapInt方法比较发现自己手里的数值3和主内存的值4不一致，说明该值已经被其他线程抢先一步修改过了，那线程A本次修改失败，只能重新读取再来一遍。

5、线程A重新获得value值，因为变量value被volatile修饰，所以其他线程对它的修改，线程A总是能够看见，线程A继续执行compareAndSwapInt进行比较替换，直到成功。

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

```text
T3	第一次版本号： 1
T4	第一次版本号： 1
T3	第二次版本号： 2
T3	第三次版本号： 3
T4	修改成功否false 当前最新版本号： 3
T4	当前实际最新值100
```

?> 结论：时间戳原子引用可以解决ABA问题，版本号不符合将修改失败

compareAndSet方法实现代码：

```java
    public boolean compareAndSet(V expectedReference, V newReference, int expectedStamp, int newStamp) {
        Pair<V> current = this.pair;
        return expectedReference == current.reference && expectedStamp == current.stamp && (newReference == current.reference && newStamp == current.stamp || this.casPair(current, AtomicStampedReference.Pair.of(newReference, newStamp)));
    }
```

比较过程：

1、比较传入的期望值与实际内存中的值是否相等

2、比较当前版本号与内存中最新的版本号是否相等

3、以上两个条件都满足才可以修改

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

1、在 ArrayList 中，有一个字段 modCount，记录集合结构性修改的次数。一个线程在调用 list.add() 修改集合时，modCount 会增加。

```java
 public boolean add(E e) {
        ++this.modCount;
        this.add(e, this.elementData, this.size);
        return true;
 }
```

2、另一个线程尝试输出集合（通过 System.out.println(list)），会调用toString()方法，该方法会创建一个迭代器进行遍历，遍历过程中**E e = it.next()** 方法中的**this.checkForComodification()** 方法会判断 modCount 与 expectedModCount 不一致，就会抛出 ConcurrentModificationException。

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

1、System.out.println(list) 打印操作并不是线程安全的

2、添加元素和打印 list 的内容这是两步操作，合起来不能保证原子性。

假设时间点如下：

**时间点 T1：线程 A**

1、线程 A 执行 list.add("a")，成功将 "a" 添加到 list，当前状态为 ["a"]。

2、线程 A 进入 System.out.println(list)，准备打印。

3、在打印之前，线程 A 会读取 list 的当前内容，即 ["a"]，将其作为打印的输入。

**时间点 T2：线程 B**

1、在线程 A 开始打印之前，线程 B 调用 list.add("b")，将 "b" 添加到 list，更新状态为 ["a", "b"]。

2、线程 B 紧接着执行 System.out.println(list)，读取 list 的状态，打印 ["a", "b"]。

**时间点 T3：线程 A 打印完成**

1、尽管线程 B 已经修改了 list，线程 A 打印的内容是它在时间点 T1 读取的状态（["a"]），因为线程 A 的打印输入在时间点 T1 已经确定。

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

1、读操作不加锁，直接访问底层数组，因为底层数组在写操作期间会被复制，不影响原数组的内容。

2、适用于读多写少的场景。

**（2）写操作**

- 写操作通过加锁（早期版本使用ReentrantLock，新版本使用synchronized）来保证线程安全。
- 具体步骤：
  
  1、获取锁，防止多个线程同时写。
  
  2、复制当前数组到一个新数组。
  
  3、在新数组上执行写操作。
  
  4、将新数组替换为底层数组。
  
  5、释放锁。

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

1、**读性能高**：读操作不加锁，多个线程可以同时读取，适合读多写少的场景。

2、**线程安全**：写操作通过复制数组和加锁实现，保证了线程安全性。

3、**迭代安全**：Iterator 迭代器在遍历该集合时，不会抛出 ConcurrentModificationException，因为写操作不会修改原数组。**但依旧会有读取不到最新数据的情况。**

**（5）缺点**

1、**写操作性能低**：每次写操作都需要复制整个数组，占用更多内存，性能低。

2、**不适合写多场景**：在高写操作场景中，性能可能会显著下降。

**（6）使用场景**

1、配置、黑白名单、缓存等场景，数据更新频率较低，但读取频率很高。

2、适合对实时性要求不高的场景，因为读操作可能读到旧的数据。

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

### 5.5 Map并法修改异常

代码示例：

```java
public class ContainerNotSafeDemo {
    public static void main(String[] args) {
        Map<String, String> map = new HashMap();
        for (int i = 1; i <= 30; i++) {
            int finalI = i;
            new Thread(() -> {
                map.put(Thread.currentThread().getName(), finalI + "");
                System.out.println(map);
            }, String.valueOf(i)).start();
        }
    }
}
```

运行结果：

<img src="https://cdn.nlark.com/yuque/0/2024/png/23116580/1735024952712-ed8cebeb-fe8d-4f3a-860c-9d2f60c61050.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_1500%2Climit_0"  referrerpolicy="no-referrer">

### 5.6 Map线程不安全解决办法

#### 5.6.1 使用ConcurrentHashMap

代码示例：

```java
public class ContainerNotSafeDemo {
    public static void main(String[] args) {
        Map<String, String> map = new ConcurrentHashMap<>();
        for (int i = 1; i <= 30; i++) {
            int finalI = i;
            new Thread(() -> {
                map.put(Thread.currentThread().getName(), finalI + "");
                System.out.println(map);
            }, String.valueOf(i)).start();
        }
    }
}
```

运行结果：

<img src="https://cdn.nlark.com/yuque/0/2024/png/23116580/1735025073280-c2f92d2b-cd9d-410a-be4a-101edb78745c.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_1500%2Climit_0"  referrerpolicy="no-referrer">

#### 5.6.2 使用Collections.synchronizedMap

代码示例：

```java
public class ContainerNotSafeDemo {
    public static void main(String[] args) {
        Map<String, String> map = Collections.synchronizedMap(new HashMap<>());
        for (int i = 1; i <= 30; i++) {
            int finalI = i;
            new Thread(() -> {
                map.put(Thread.currentThread().getName(), finalI + "");
                System.out.println(map);
            }, String.valueOf(i)).start();
        }
    }
}
```

运行结果：

<img src="https://cdn.nlark.com/yuque/0/2024/png/23116580/1735025265847-8c2c2e2a-8f51-48b2-b236-e880e4c9e4da.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_1500%2Climit_0"  referrerpolicy="no-referrer">

## 六、Java锁

### 6.1 公平锁和非公平锁

#### 6.1.1 公平锁（Fair Lock）

**定义**：
公平锁的线程获取顺序遵循**先来先服务（FIFO）**的原则，即线程按照请求锁的时间顺序来获得锁。

**特点**：

1、**公平性**：所有线程按时间顺序竞争锁，不会发生“插队”。

2、**避免饥饿**：没有任何线程会因为长期无法获取锁而被饿死。

3、**性能较低**：由于需要维护一个队列来保存等待线程，并在释放锁时通知队列中的下一个线程，开销较大。

**适用场景**：

- 当程序对响应时间要求较高，且希望多个线程公平竞争资源时适合使用公平锁。

**实现方式**：
在Java中，通过ReentrantLock的构造函数指定true即可创建公平锁：

```java
ReentrantLock fairLock = new ReentrantLock(true);
```

#### 6.1.2 非公平锁（Non-Fair Lock）

**定义**：
非公平锁不保证线程获取锁的顺序，任何线程都可以直接尝试获取锁，可能会“插队”。

**特点**：

1、**性能较高**：由于无需维护队列，线程可以直接竞争锁，减少了上下文切换的开销。

2、**可能导致线程饥饿**：某些线程可能长时间无法获取锁。

3、**更适合高并发场景**：在实际使用中，非公平锁通常能够提供更好的吞吐量。

**适用场景**：

- 高并发的场景中，性能优先于公平性时，使用非公平锁。

**实现方式**：
在Java中，通过ReentrantLock的默认构造函数或传入false即可创建非公平锁：

```java
ReentrantLock nonFairLock = new ReentrantLock(); // 默认非公平
ReentrantLock nonFairLockExplicit = new ReentrantLock(false);
```

?> **synchronized也是一种非公平锁**

#### 6.1.3 公平锁与非公平锁的对比

| 特性         | 公平锁                           | 非公平锁             |
| ------------ | -------------------------------- | -------------------- |
| 获取锁顺序   | 按照线程请求锁的时间顺序         | 无序，可能“插队”     |
| 性能         | 较低                             | 较高                 |
| 线程饥饿风险 | 无饥饿                           | 存在饥饿风险         |
| 使用场景     | 响应时间敏感、公平性要求高的场景 | 高并发场景，性能优先 |

### 6.2 可重入锁（递归锁）

#### 6.2.1 什么是可重入锁

**定义**：
可重入锁是指线程在持有锁的情况下，可以再次获取该锁，并在释放锁时只需与获取次数相同的次数释放即可。

**解释**：
如果一个线程已经获得了锁，它再次请求该锁时会自动成功，并将锁的计数器加1；每次释放锁时，计数器减1，直到计数器为0时真正释放锁。

**关键点**：

- 同一个线程可以多次进入受锁保护的代码块。
- 避免了线程死锁问题（特别是在调用自身方法的递归场景中）。

#### 6.2.2 Java中可重入锁的实现

Java中的**synchronized关键字**和**ReentrantLock类**都提供了可重入锁的特性。

**a. synchronized**

synchronized隐式支持可重入性

示例代码：

```java
class Phone {
    public synchronized void senSMS() throws Exception {
        System.out.println(Thread.currentThread().getName() + "\t 执行 sendSMS（）");
        sendEmail();
    }

    public synchronized void sendEmail() throws Exception {
        System.out.println(Thread.currentThread().getName() + "\t 执行 sendEmail（）");

    }
}

public class ReenterLockDemo {
    public static void main(String[] args) {
        Phone phone = new Phone();
        new Thread(() -> {
            try {
                phone.senSMS();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }, "t1").start();

        new Thread(() -> {
            try {
                phone.senSMS();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }, "t2").start();
    }
}
```

运行结果：

```text
t1	 执行 sendSMS（）
t1	 执行 sendEmail（）
t2	 执行 sendSMS（）
t2	 执行 sendEmail（）
```

**b. ReentrantLock**

ReentrantLock类是Java中显式锁的一种，默认也是可重入锁。

代码示例：

```java
class Phone implements Runnable {
    Lock lock = new ReentrantLock();

    @Override
    public void run() {
        get();
    }

    public void get() {
        lock.lock();
        try {
            System.out.println(Thread.currentThread().getName() + "\t 执行 get（）");
            set();
        } finally {
            lock.unlock();
        }
    }

    public void set() {
        lock.lock();
        try {
            System.out.println(Thread.currentThread().getName() + "\t 执行 set（）");
        } finally {
            lock.unlock();
        }
    }
}

public class ReenterLockDemo {
    public static void main(String[] args) {
        Phone phone = new Phone();
        Thread t3 = new Thread(phone, "t3");
        Thread t4 = new Thread(phone, "t4");
        t3.start();
        t4.start();
    }
}
```

运行结果：

```text
t3	 执行 get（）
t3	 执行 set（）
t4	 执行 get（）
t4	 执行 set（）
```

#### 6.2.3 可重入锁的内部机制

**ReentrantLock**通过内部的**计数器**和**线程记录机制**实现可重入性：

1、**计数器**：每次线程成功获取锁时，计数器加1；释放锁时，计数器减1。当计数器为0时，锁才真正释放。

2、**线程记录**：记录当前持有锁的线程，只有持有锁的线程才能修改计数器。

#### 6.2.4 可重入锁的优点

1、避免死锁：

- 当一个线程在持有锁时调用同一锁保护的方法或递归方法，不需要重新竞争锁。

2、递归调用支持：

- 对递归算法非常友好，特别是需要嵌套调用的方法。

3、灵活性：

- 与显式锁（ReentrantLock）结合使用时，支持公平锁、非公平锁、可中断性等高级功能。

#### 6.2.5  可重入锁与非可重入锁的对比

| 特性             | 可重入锁                     | 非可重入锁                 |
| ---------------- | ---------------------------- | -------------------------- |
| 获取锁的特性     | 同一线程可多次获取锁         | 同一线程无法重复获取锁     |
| 实现复杂度       | 较高，需维护计数器和线程信息 | 较低                       |
| 死锁可能性       | 较低，避免嵌套调用死锁       | 较高，可能在嵌套调用中死锁 |
| 支持的关键字或类 | synchronized、ReentrantLock  | 无直接支持                 |

### 6.3 自旋锁

#### 6.3.1. 什么是自旋锁

**定义**：
自旋锁是一种基于**忙等待**的锁实现方式，线程在尝试获取锁时，如果锁被其他线程持有，它会持续循环检查而不是挂起，直到获取到锁或者达到某种终止条件。

**关键点**：

- 忙等待：线程在获取不到锁时，**反复执行空操作**而不进入阻塞状态。
- 减少上下文切换：避免线程挂起和唤醒的系统开销。

#### 6.3.2. 自旋锁的工作原理

1、尝试获取锁：线程检查锁的状态（通常是一个标志位，如volatile变量）。

2、忙等待：如果锁已被占用，线程反复检查，等待锁释放。

3、获取锁成功：一旦锁可用，线程立即占有锁并继续执行。

代码示例：

```java
public class SpinLockDemo {

    private final AtomicBoolean locked = new AtomicBoolean(false);

    public void lock() {
        System.out.println(Thread.currentThread().getName() + "\t 尝试获取锁 ");
        while (!locked.compareAndSet(false, true)) {
            // 自旋等待
        }
        System.out.println(Thread.currentThread().getName() + "\t 已获取锁 ");
    }

    public void unlock() {
        System.out.println(Thread.currentThread().getName() + "\t 尝试释放锁 ");
        // 释放锁
        locked.set(false);
        System.out.println(Thread.currentThread().getName() + "\t 已释放锁 ");

    }


    public static void main(String[] args) {
        SpinLockDemo spinLockDemo = new SpinLockDemo();
        new Thread(() -> {
            spinLockDemo.lock();
            //暂停一会线程
            try {
                TimeUnit.SECONDS.sleep(5);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            spinLockDemo.unlock();
        }, "AA").start();
        //暂停主线程 保证AA线程比BB线程先执行
        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        new Thread(() -> {
            spinLockDemo.lock();
            spinLockDemo.unlock();
        }, "BB").start();
    }
}
```

运行结果：

```text
AA	 尝试获取锁 
AA	 已获取锁 
BB	 尝试获取锁 
AA	 尝试释放锁 
AA	 已释放锁 
BB	 已获取锁 
BB	 尝试释放锁 
BB	 已释放锁 
```



#### 6.3.3 自旋锁的优缺点

**优点**

1、减少线程上下文切换：线程在等待时不会进入内核态，节省挂起和唤醒的开销。

2、高效的短时间锁竞争：当锁持有时间较短时，自旋锁性能优于阻塞锁。

**缺点**

1、忙等待浪费CPU资源：自旋期间线程会持续占用CPU时间，对系统性能有较大影响。

2、不适合高竞争场景：如果锁持有时间较长或线程竞争激烈，自旋锁会导致CPU资源浪费严重。

3、死锁风险：如果没有设计好退出机制，自旋锁可能导致线程一直自旋。

#### 6.3.4 自旋锁与传统阻塞锁的对比

| 特性             | 自旋锁                                           | 阻塞锁（如ReentrantLock）                    |
| ---------------- | ------------------------------------------------ | -------------------------------------------- |
| 获取不到锁的行为 | 自旋等待，持续占用CPU                            | 线程进入阻塞，释放CPU                        |
| 性能             | 持锁时间短时效率高                               | 持锁时间长时效率高                           |
| 系统开销         | 较低（无上下文切换）                             | 较高（上下文切换）                           |
| 适用场景         | 锁竞争不激烈、锁持有时间较短、实时性要求高的场景 | 竞争激烈、锁持有时间较长、实时性要求低的场景 |

#### 6.3.5 自旋锁的注意事项

1、**避免长时间自旋**：如果锁持有时间长，推荐直接使用阻塞锁。

2、**CPU核心数影响**：自旋锁对多核CPU更友好，单核环境可能会引发性能问题。

3、**高并发场景慎用**：在高并发场景中，过多线程自旋会造成CPU资源浪费，影响系统整体性能。

### 6.4 独占锁/共享锁/互斥锁

#### 6.4.1 独占锁（Exclusive Lock / 写锁）

**定义**：

独占锁是指某一时刻只有一个线程能获取该锁，其它线程必须等待锁释放后才能继续获取。
它通常用于写操作，确保数据一致性。

**特点**：

1、**独占性**：同一时刻仅允许一个线程持有锁。

2、**阻塞其它线程**：未获取到锁的线程必须等待。

3、**写优先**：通常与共享锁（读锁）配合使用时，优先处理写操作。

**实现**：

- Java 中的 ReentrantLock、synchronized 都是典型的独占锁。
- ReentrantReadWriteLock.WriteLock 也属于独占锁。



#### 6.4.2 共享锁（Shared Lock / 读锁）

**定义**：

共享锁允许多个线程同时持有锁，可以并发访问共享资源，但这些线程只能进行**读操作**，不能进行写操作。

**特点**：

1、**可并发**：多个线程可以同时持有共享锁。

2、**读写分离**：共享锁通常用于读操作，与独占锁配合使用。

3、**不会修改资源**：持有共享锁的线程只能读取资源，不能修改。

**实现**：

- Java 中的 ReentrantReadWriteLock.ReadLock 是共享锁的实现。

#### 6.4.3 互斥锁（Mutex Lock）

**定义**：

互斥锁是线程同步的基本机制，属于独占锁的一种，确保同一时刻只有一个线程访问临界区资源。

**特点**：

1、**排他性**：同一时刻仅一个线程能够持有互斥锁。

2、**线程安全**：通过互斥锁可以确保线程对共享资源的操作是线程安全的。

3、**通用性**：适用于所有需要线程同步的场景。

**实现**：

- Java 中的 synchronized 关键字和 ReentrantLock 都可以看作互斥锁的实现。

#### 6.4.4 读写锁的使用

未使用读写锁的代码示例：

```java
class MyCache {
    private volatile Map<String, Object> map = new HashMap<>();

    public void put(String key, Object value) {
        System.out.println(Thread.currentThread().getName() + "\t 正在写入： " + key);
        //暂停一会线程
        try {
            TimeUnit.MILLISECONDS.sleep(300);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        map.put(key, value);
        System.out.println(Thread.currentThread().getName() + "\t 写入完成： ");
    }

    public void get(String key) {
        System.out.println(Thread.currentThread().getName() + "\t 正在读取： ");
        //暂停一会线程
        try {
            TimeUnit.MILLISECONDS.sleep(300);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        Object result = map.get(key);
        System.out.println(Thread.currentThread().getName() + "\t 读取完成： " + result);
    }

}

public class ReadWriteLockDemo {
    public static void main(String[] args) {
        MyCache myCache = new MyCache();
        //五个线程写
        for (int i = 1; i <= 5; i++) {
            final int tempInt = i;
            new Thread(() -> myCache.put(tempInt + "", tempInt + ""), String.valueOf(i)).start();
        }
        //五个线程读
        for (int i = 1; i <= 5; i++) {
            final int tempInt = i;
            new Thread(() -> myCache.get(tempInt + ""), String.valueOf(i)).start();
        }
    }
}

```

运行结果：

```text
1	 正在读取： 
2	 正在读取： 
3	 正在读取： 
4	 正在读取： 
5	 正在读取： 
5	 正在写入： 5
4	 正在写入： 4
1	 正在写入： 1
2	 正在写入： 2
3	 正在写入： 3
1	 写入完成： 
1	 读取完成： null
2	 读取完成： null
3	 读取完成： null
4	 读取完成： null
5	 读取完成： null
4	 写入完成： 
5	 写入完成： 
2	 写入完成： 
3	 写入完成： 
```

?> **结论：写操作被中断，一个线程在写的时候，其他线程也在写**

添加了读写锁的代码案例：

```java
class MyCache{//资源类
    private volatile Map<String,Object> map = new HashMap<>();
    private ReentrantReadWriteLock readWriteLock = new ReentrantReadWriteLock();
    public void put(String key,Object value){
        readWriteLock.writeLock().lock();         try {
            System.out.println(Thread.currentThread().getName()+"\t 正在写入： "+key);
            //暂停一会线程
            try {
                TimeUnit.MILLISECONDS.sleep(300);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            map.put(key,value);
            System.out.println(Thread.currentThread().getName()+"\t 写入完成： ");
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            readWriteLock.writeLock().unlock();         }
    }
    public void get(String key){
        readWriteLock.readLock().lock();         try {
            System.out.println(Thread.currentThread().getName()+"\t 正在读取： ");
            //暂停一会线程
            try {
                TimeUnit.MILLISECONDS.sleep(300);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            Object result = map.get(key);
            System.out.println(Thread.currentThread().getName()+"\t 读取完成： "+result);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            readWriteLock.readLock().unlock();         }
    }

}

```

运行结果：

```text
2	 正在写入： 2
2	 写入完成： 
4	 正在写入： 4
4	 写入完成： 
3	 正在写入： 3
3	 写入完成： 
1	 正在写入： 1
1	 写入完成： 
5	 正在写入： 5
5	 写入完成： 
1	 正在读取： 
5	 正在读取： 
4	 正在读取： 
3	 正在读取： 
2	 正在读取： 
1	 读取完成： 1
3	 读取完成： 3
5	 读取完成： 5
2	 读取完成： 2
4	 读取完成： 4
```

?> **结论：加了写锁之后，同时只能有一个线程写入，加了读锁之后，多个线程可以共享读。**

#### 6.4.5 独占锁、共享锁、互斥锁对比

| 特性             | 独占锁（写锁）           | 共享锁（读锁）                  | 互斥锁                       |
| ---------------- | ------------------------ | ------------------------------- | ---------------------------- |
| 同时持有线程数   | 仅允许一个线程           | 多个线程可以同时持有            | 仅允许一个线程               |
| 是否支持并发访问 | 不支持                   | 支持（只读操作）                | 不支持                       |
| 操作限制         | 可读可写                 | 仅允许读操作                    | 可读可写                     |
| 实现类           | ReentrantLock / 写锁     | ReentrantReadWriteLock.ReadLock | synchronized / ReentrantLock |
| 应用场景         | 写操作需要独占资源的场景 | 读操作频繁且需要高并发的场景    | 简单的线程同步               |

## 七、CountDownLatch

### 7.1 CountDownLatch 的定义

**CountDownLatch 是一种线程同步工具类**，它通过一个计数器（count）实现线程的协调工作：

1、初始化时指定计数器的值。

2、每当一个线程完成任务后调用 countDown() 方法，计数器减 1。

3、计数器为 0 时，所有因调用 await() 而等待的线程将被唤醒，继续执行。

### 7.2 CountDownLatch 的主要方法

1、**构造方法**：

```java
public CountDownLatch(int count)
```

参数 count：指定需要等待的事件数，即计数器的初始值。

2、**主要方法**：

**await()：**阻塞当前线程，直到计数器的值变为 0。

- 可以有两种形式：

  ```java
  public void await() throws InterruptedException
  public boolean await(long timeout, TimeUnit unit) throws InterruptedException
  ```

  第二种形式允许设置超时时间。

**countDown()：**每次调用使计数器减 1。如果计数器减到 0，所有阻塞线程将被唤醒。

3、**状态方法**：

**getCount()：**返回当前计数器的值（主要用于调试或日志记录）

### 7.3 CountDownLatch的使用场景

#### 7.3.1 主线程等待多个子线程完成

代码示例：

```java
public class CountDownLatchDemo2 {
    public static void main(String[] args) throws Exception {
        CountDownLatch countDownLatch = new CountDownLatch(6);
        for (int i = 1; i <=6 ; i++) {
            new Thread(()->{
                System.out.println(Thread.currentThread().getName()+"\t 上完自习，离开教室");
                countDownLatch.countDown();
            },String.valueOf(i)).start();
        }
        countDownLatch.await();
        System.out.println(Thread.currentThread().getName()+"\t -----班长最后关门走人------");
    }
}
```

运行结果：

```text
2	 上完自习，离开教室
5	 上完自习，离开教室
6	 上完自习，离开教室
4	 上完自习，离开教室
3	 上完自习，离开教室
1	 上完自习，离开教室
main	 -----班长最后关门走人------
```



#### 7.3.2 多线程并行起点

多个线程需要同时开始任务（常用于模拟并发压力测试）。

代码示例：

```java
public class CountDownLatchDemo {
    public static void main(String[] args) throws InterruptedException {
        int threadCount = 3;
        CountDownLatch readyLatch = new CountDownLatch(1); // 控制线程启动
        CountDownLatch doneLatch = new CountDownLatch(threadCount); // 控制任务完成

        for (int i = 0; i < threadCount; i++) {
            new Thread(() -> {
                try {
                    System.out.println(Thread.currentThread().getName() + " 已经准备好");
                    readyLatch.await(); // 等待主线程释放启动信号
                    System.out.println(Thread.currentThread().getName() + " 已经开始");
                    Thread.sleep(1000); // 模拟任务
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    doneLatch.countDown(); // 任务完成
                }
            }).start();
        }

        Thread.sleep(1000); // 模拟准备工作
        System.out.println("main线程开始等待");
        readyLatch.countDown(); // 释放启动信号
        doneLatch.await(); // 等待所有线程完成
        System.out.println("所有线程执行完毕");
    }
}
```

运行结果：

```text
Thread-0 已经准备好
Thread-2 已经准备好
Thread-1 已经准备好
main线程开始等待
Thread-1 已经开始
Thread-2 已经开始
Thread-0 已经开始
所有线程执行完毕
```

### 7.4 CountDownLatch 的优缺点

**优点**

1、简洁：使用简单，代码逻辑清晰。

2、灵活：适用于多线程依赖关系的同步场景。

3、线程安全：内部通过 AQS（AbstractQueuedSynchronizer）实现，保证并发安全。

**缺点**

1、不可重用：计数器在变为 0 后不能被重置，如果需要重复使用，需要创建新的实例。

2、限制较多：功能上不如 CyclicBarrier 灵活，CyclicBarrier 支持复用和更多高级功能。

## 八、CyclicBarrier

### 8.1 CyclicBarrier 的定义

**CyclicBarrier 是一种同步工具**，它允许一组线程互相等待，直到所有线程都到达屏障点后再继续执行。

**屏障点**：线程需要到达的公共同步点。

**可重复使用**：屏障点可以多次重置，支持循环使用。



### 8.2 CyclicBarrier 的主要方法

1、**构造方法**：

- 基础版本：

  ```java
  public CyclicBarrier(int parties)
  ```

  参数 parties：参与的线程数。

- 带屏障操作的版本：

  ```java
  public CyclicBarrier(int parties, Runnable barrierAction)
  ```

  参数说明：

  - parties：参与的线程数。
  - barrierAction：一个 Runnable，当所有线程到达屏障时优先执行该任务。

2、**主要方法**：

- **await()：**

  - 阻塞当前线程，直到所有线程都调用了 await() 方法。

  - 两种形式：

    ```java
    public int await() throws InterruptedException, BrokenBarrierException
    public int await(long timeout, TimeUnit unit) throws InterruptedException, BrokenBarrierException, TimeoutException
    ```

    第一种没有超时，第二种允许设置超时时间。

- **getNumberWaiting()：**

  - 返回当前在屏障处等待的线程数。

- **getParties()：**

  - 返回屏障要求的线程总数。

- **isBroken()：**

  - 检查屏障是否被破坏（如某线程超时或中断）。

- **reset()：**

  - 重置屏障，将屏障状态恢复为初始状态，所有等待线程会收到 BrokenBarrierException。

### 8.3 CyclicBarrier 的工作原理

1、CyclicBarrier 内部维护了一个计数器，初始值为指定的线程数（parties）。

2、每个线程调用 await() 方法后，计数器减 1。

3、当计数器减到 0 时：

- 可选的屏障任务（barrierAction）会先执行。

- 所有等待线程被唤醒，继续执行。

4、屏障会自动重置，允许下一次使用。

### 8.4 CyclicBarrier的使用场景

#### 8.4.1 线程并发起点

代码示例：

```java
public class CyclicBarrierExample1 {
    public static void main(String[] args) {
        int threadCount = 5;
        CyclicBarrier barrier = new CyclicBarrier(threadCount, () ->
                System.out.println("所有线程已就位，开始工作!")
        );

        for (int i = 0; i < threadCount; i++) {
            new Thread(() -> {
                System.out.println(Thread.currentThread().getName() + " 已就位");
                try {
                    // 等待其他线程到达屏障
                    barrier.await();
                } catch (InterruptedException | BrokenBarrierException e) {
                    e.printStackTrace();
                }
                System.out.println(Thread.currentThread().getName() + " 开始工作");
            }).start();
        }
    }
}
```

运行结果：

```text
Thread-0 已就位
Thread-1 已就位
Thread-2 已就位
Thread-3 已就位
Thread-4 已就位
所有线程已就位，开始工作!
Thread-4 开始工作
Thread-1 开始工作
Thread-0 开始工作
Thread-2 开始工作
Thread-3 开始工作
```



#### 8.4.1 多阶段任务

线程分为多个阶段协同完成任务。

代码示例：

```java
public class CyclicBarrierExample2 {
    public static void main(String[] args) {
        int threadCount = 3;
        CyclicBarrier barrier = new CyclicBarrier(threadCount, () ->
                System.out.println("屏障已到达。进入下一阶段!")
        );

        for (int i = 0; i < threadCount; i++) {
            new Thread(() -> {
                try {
                    System.out.println(Thread.currentThread().getName() + " 完成阶段 1");
                    barrier.await(); // 第一阶段的屏障

                    System.out.println(Thread.currentThread().getName() + " 完成阶段 2");
                    barrier.await(); // 第二阶段的屏障

                } catch (InterruptedException | BrokenBarrierException e) {
                    e.printStackTrace();
                }
            }).start();
        }
    }
}
```

运行结果：

```text
Thread-2 完成阶段 1
Thread-1 完成阶段 1
Thread-0 完成阶段 1
屏障已到达。进入下一阶段!
Thread-0 完成阶段 2
Thread-2 完成阶段 2
Thread-1 完成阶段 2
屏障已到达。进入下一阶段!
```



### 8.5 CyclicBarrier 的优缺点

**优点**：

1、**灵活性**：支持在屏障处执行特定的任务（barrierAction）。

2、**可复用**：支持循环使用，适用于多阶段任务。

3、**线程协作**：非常适合需要线程同时到达某个点后再执行的场景。

**缺点**：

1、**阻塞所有线程**：如果一个线程未能到达屏障，其它线程都会被阻塞。

2、**破坏屏障**：如果某线程因超时或中断未能到达屏障，会抛出 BrokenBarrierException 并破坏屏障。

### 8.6 与 CountDownLatch 的对比

| 工具             | CyclicBarrier                 | CountDownLatch                  |
| ---------------- | ----------------------------- | ------------------------------- |
| 用途             | 线程相互等待，协同前进        | 主线程等待其他线程完成任务      |
| 是否可复用       | 是                            | 否                              |
| 触发条件         | 指定数量线程调用 await() 方法 | 指定次数的 countDown() 方法调用 |
| 线程间是否需协作 | 是                            | 否                              |
| 适合场景         | 多线程阶段性任务协调          | 单次任务的线程同步              |

### 8.7 注意事项

1、线程未到达屏障的影响：

​	如果某个线程未能到达屏障（例如超时或中断），屏障会被破坏，所有线程会收到 BrokenBarrierException。

2、适配任务数：

​	参与的线程数必须与初始化的 parties 数一致，否则可能导致死锁。

3、避免重复调用 await()：

​	每个线程在一个屏障点只能调用一次 await()。

4、屏障动作中断风险：

​	屏障动作（barrierAction）如果抛出异常，会中断所有线程。

## 九、Semaphore

### 9.1 Semaphore 的定义

**Semaphore 是一种计数信号量**，可以用来控制对共享资源的访问，通过许可机制实现：

1、每个线程在访问资源前必须从信号量中获得一个许可。

2、当线程释放资源时，会将许可归还信号量。

3、如果没有可用许可，线程会被阻塞，直到有可用许可。

### 9.2 Semaphore 的主要方法

1、**构造方法**：

```java
public Semaphore(int permits)
public Semaphore(int permits, boolean fair)
```

- permits：初始化许可的数量，代表可以同时访问资源的线程数。

- fair：是否使用公平模式。默认是非公平模式。
  - **公平模式**：
  
    线程按照请求的顺序获得许可。
  
  - **非公平模式**：
  
    可能让后来的线程插队，提高吞吐量。

2、**主要方法**：

- acquire()：

  - 从信号量中获取一个许可，如果没有许可可用，则阻塞直到有许可可用。

    ```java
    public void acquire() throws InterruptedException
    public void acquire(int permits) throws InterruptedException
    ```

- tryAcquire()：

  - 尝试获取一个许可，如果没有可用许可，则立即返回 false。

    ```java
    public boolean tryAcquire()
    public boolean tryAcquire(int permits)
    public boolean tryAcquire(long timeout, TimeUnit unit) throws InterruptedException
    ```

- release()：

  - 释放一个许可，归还给信号量。

    ```java
    public void release()
    public void release(int permits)
    ```

- availablePermits()：

  - 返回当前可用许可的数量。

- hasQueuedThreads()：

  - 返回是否有线程正在等待获取许可。

- getQueueLength()：

  - 返回正在等待许可的线程数。

### 9.3 Semaphore 的工作原理

1、内部通过计数器（permits）维护可用许可的数量。

2、线程调用 acquire()  时，尝试减少计数器：

- 如果计数器大于 0，则减 1，线程获得许可。
- 如果计数器等于 0，线程会进入等待状态。

3、线程调用 release()  时，计数器加 1，释放许可：

- 如果有等待线程，会唤醒一个等待线程。

### 9.4 使用场景

#### **9.4.1 限制资源访问的并发线程数**

限制同时访问某个资源的线程数量，比如连接池、打印机、数据库连接等。

**示例代码**：

```java
import java.util.concurrent.Semaphore;

public class SemaphoreExample1 {
    public static void main(String[] args) {
        int permits = 3; // 许可数量
        Semaphore semaphore = new Semaphore(permits);

        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                try {
                    System.out.println(Thread.currentThread().getName() + " trying to acquire...");
                    semaphore.acquire(); // 获取许可
                    System.out.println(Thread.currentThread().getName() + " acquired a permit.");
                    Thread.sleep(2000); // 模拟任务
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    System.out.println(Thread.currentThread().getName() + " releasing permit.");
                    semaphore.release(); // 释放许可
                }
            }).start();
        }
    }
}
```

**输出结果**：

```text
Thread-0 试图 获取 许可...
Thread-1 试图 获取 许可...
Thread-0 获取 了一个许可.
Thread-3 试图 获取 许可...
Thread-4 试图 获取 许可...
Thread-2 试图 获取 许可...
Thread-1 获取 了一个许可.
Thread-0 释放 了一个许可
Thread-1 释放 了一个许可
Thread-4 获取 了一个许可.
Thread-3 获取 了一个许可.
Thread-4 释放 了一个许可
Thread-2 获取 了一个许可.
Thread-3 释放 了一个许可
Thread-2 释放 了一个许可
```



#### **9.4.2 多线程模拟停车场**

模拟一个有固定车位数量的停车场，车辆进入停车场后占用车位，离开后释放车位。

**示例代码**：

```java
public class SemaphoreDemo {
    public static void main(String[] args) {
        Semaphore semaphore = new Semaphore(3);//模拟3个停车位
        for (int i = 1; i <= 6; i++) {//模拟6部汽车
            new Thread(() -> {
                try {
                    semaphore.acquire();
                    System.out.println(Thread.currentThread().getName() + "\t抢到车位");
                    //暂停一会线程
                    try {
                        TimeUnit.SECONDS.sleep(3);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    System.out.println(Thread.currentThread().getName() + "\t停车三秒离开");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    semaphore.release();
                }
            }, String.valueOf(i)).start();
        }
    }
}
```

**输出结果**：

```text
1	抢到车位
2	抢到车位
3	抢到车位
3	停车三秒离开
1	停车三秒离开
5	抢到车位
4	抢到车位
2	停车三秒离开
6	抢到车位
4	停车三秒离开
5	停车三秒离开
6	停车三秒离开
```



### 9.5 Semaphore 的优缺点

**优点**：

1、**灵活控制并发**：适用于任何需要控制访问资源数量的场景。

2、**线程安全**：通过内部的 AbstractQueuedSynchronizer (AQS) 实现线程安全。

3、**公平模式支持**：可以确保线程按照顺序获取许可。

**缺点**：

1、**高等待成本**：线程在没有许可时会进入阻塞状态。

2、**不适合复杂同步**：适合限制资源访问的简单场景，不如 Lock 和 Condition 灵活。



### 9.6 Semaphore 与其他同步工具的对比

| 工具         | Semaphore          | CountDownLatch   | CyclicBarrier          |
| ------------ | ------------------ | ---------------- | ---------------------- |
| 用途         | 控制资源访问线程数 | 等待线程完成任务 | 线程间同步，分阶段执行 |
| 是否可复用   | 是                 | 否               | 是                     |
| 是否阻塞线程 | 是                 | 是               | 是                     |
| 支持公平模式 | 是                 | 否               | 是                     |
| 线程间协作   | 否                 | 否               | 是                     |



### 9.7 注意事项

1、**许可数量的管理**：确保 release() 方法与 acquire() 调用次数匹配，否则可能导致许可过多或不足。

2、**公平模式的性能**：公平模式可能会降低性能，因为线程需要排队获取许可。

3、**避免死锁**：如果线程在持有许可时无法释放（如异常退出），可能导致其他线程永久阻塞。

## 十、阻塞队列

### 10.1 **BlockingQueue** 的定义

**阻塞队列**是一种线程安全的队列，提供了以下两种阻塞操作：

1、**当队列为空时，获取元素的线程会被阻塞，直到队列中有可用元素**。

2、**当队列已满时，插入元素的线程会被阻塞，直到队列有空闲空间**。

它是一个接口，主要实现类包括：

- 有界阻塞队列：

  ArrayBlockingQueue

  LinkedBlockingQueue

  PriorityBlockingQueue

- 无界阻塞队列：

  LinkedBlockingQueue（可以指定容量，也可以不指定）

  SynchronousQueue

  DelayQueue

------

### 10.2 **BlockingQueue** 的核心方法

#### 10.2.1 方法分类

| 方法类型     | 方法名称                                | 描述                                                         |
| ------------ | --------------------------------------- | ------------------------------------------------------------ |
| 插入元素     | put(E e)                                | 队列已满时阻塞，直到有空闲空间。                             |
|              | offer(E e)                              | 插入元素，如果队列已满立即返回 false。                       |
|              | offer(E e, long timeout, TimeUnit unit) | 队列已满时等待指定时间后放弃。                               |
| 删除元素     | take()                                  | 队列为空时阻塞，直到有可用元素。                             |
|              | poll()                                  | 获取并删除队头元素，如果队列为空立即返回 null。              |
|              | poll(long timeout, TimeUnit unit)       | 队列为空时等待指定时间后放弃。                               |
| 查询队头元素 | peek()                                  | 获取队头元素但不删除，如果队列为空返回 null。                |
| 其他操作     | size()                                  | 返回当前队列中的元素数量。                                   |
|              | remainingCapacity()                     | 返回队列剩余的可用空间数量（对于无界队列，返回 Integer.MAX_VALUE）。 |

#### 10.2.2 阻塞操作常用方法

1、put() 和 take()：

put()：插入元素，队列已满时阻塞。

take()：移除并返回队头元素，队列为空时阻塞。

2、offer() 和 poll()：

offer()：非阻塞插入操作，队列已满时立即返回 false。

poll()：非阻塞移除操作，队列为空时立即返回 null。

------

### 10.3 **常见实现类**

#### **10.3.1 ArrayBlockingQueue**

1、特性：

（1）基于数组的有界阻塞队列。

（2）队列容量在初始化时指定，无法动态调整。

（3）支持公平模式（通过构造函数指定）。

2、**适用场景**：固定大小的任务池、生产者-消费者模型。

#### **10.3.2 LinkedBlockingQueue**

1、特性：

（1）基于链表的阻塞队列，默认容量为 Integer.MAX_VALUE。

（2）插入和移除操作分别使用独立的锁，性能较 ArrayBlockingQueue 更高。

2、**适用场景**：高吞吐量的任务队列。

#### **10.3.3 PriorityBlockingQueue**

1、特性：

（1）基于优先级的无界阻塞队列。

（2）元素按照自然顺序或自定义比较器排序。

（3）插入操作不会阻塞，只有移除操作支持阻塞。

2、**适用场景**：任务优先级调度。

#### **10.3.4 SynchronousQueue**

1、特性：

（1）不存储任何元素，每个插入操作必须等待对应的移除操作。

（2）使用场景：一对一线程直接交互。

2、**适用场景**：线程间直接传递数据。

#### **10.3.5 DelayQueue**

1、特性：

（1）基于优先级队列，只有延时时间到期的元素才可以被获取。

（2）元素必须实现 Delayed 接口。

2、**适用场景**：定时任务调度。

### 10.4 **使用场景**

#### 10.4.1 生产者-消费者模型（ArrayBlockingQueue）

阻塞队列常用于生产者-消费者模式，自动处理线程同步问题。

**示例代码**：

```java
public class ProducerConsumerExample {
    public static void main(String[] args) {
        BlockingQueue<Integer> queue = new ArrayBlockingQueue<>(5);

        // 生产者线程
        Thread producer = new Thread(() -> {
            try {
                for (int i = 1; i <= 10; i++) {
                    System.out.println("生产中: " + i);
                    queue.put(i); // 队列满时阻塞
                    Thread.sleep(500); // 模拟生产时间
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        // 消费者线程
        Thread consumer = new Thread(() -> {
            try {
                while (true) {
                    Integer item = queue.take(); // 队列空时阻塞
                    System.out.println("消费中: " + item);
                    Thread.sleep(1000); // 模拟消费时间
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        producer.start();
        consumer.start();
    }
}
```

**输出结果**：

```text
生产中: 1
消费中: 1
生产中: 2
生产中: 3
消费中: 2
生产中: 4
消费中: 3
生产中: 5
生产中: 6
消费中: 4
生产中: 7
生产中: 8
消费中: 5
生产中: 9
生产中: 10
消费中: 6
消费中: 7
消费中: 8
消费中: 9
消费中: 10
```

------

#### 10.4.2 多线程任务调度（PriorityBlockingQueue）

使用 PriorityBlockingQueue 管理具有不同优先级的任务。

**示例代码**：

```java
public class PriorityBlockingQueueExample {
    public static void main(String[] args) {
        PriorityBlockingQueue<Task> taskQueue = new PriorityBlockingQueue<>();

        // 添加任务
        taskQueue.offer(new Task("低优先级", 3));
        taskQueue.offer(new Task("高优先级", 1));
        taskQueue.offer(new Task("中优先级", 2));

        // 消费任务
        while (!taskQueue.isEmpty()) {
            System.out.println("处理中: " + taskQueue.poll());
        }
    }
}

class Task implements Comparable<Task> {
    private String name;
    private int priority;

    public Task(String name, int priority) {
        this.name = name;
        this.priority = priority;
    }

    @Override
    public int compareTo(Task o) {
        // 自定义优先级比较规则
        return Integer.compare(this.priority, o.priority);
    }

    @Override
    public String toString() {
        return name + " (优先级: " + priority + ")";
    }
}
```

**输出结果**：

```text
处理中: 高优先级 (优先级: 1)
处理中: 中优先级 (优先级: 2)
处理中: 低优先级 (优先级: 3)
```



#### 10.4.3 线程间任务直接传递（SynchronousQueue）

假设有一个生产者线程生成任务，消费者线程直接消费任务，二者通过 SynchronousQueue 进行数据传递。

示例代码：

```java
public class SynchronousQueueExample {
    public static void main(String[] args) {
        // 创建一个 SynchronousQueue
        SynchronousQueue<String> queue = new SynchronousQueue<>();

        // 生产者线程
        Thread producer = new Thread(() -> {
            String[] tasks = {"Task-1", "Task-2", "Task-3"};
            for (String task : tasks) {
                try {
                    System.out.println("生产: " + task);
                    queue.put(task); // 将任务放入队列（阻塞直到消费者获取）
                    System.out.println("任务 " + task + " 交付.");
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    System.out.println("生产者被中断!");
                }
            }
        });

        // 消费者线程
        Thread consumer = new Thread(() -> {
            try {
                while (true) {
                    String task = queue.take(); // 获取任务（阻塞直到生产者放入）
                    System.out.println("消费: " + task);
                    Thread.sleep(1000); // 模拟任务处理时间
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.out.println("消费者被中断!");
            }
        });

        // 启动线程
        producer.start();
        consumer.start();
    }
}
```

运行结果：

```text
生产: Task-1
消费: Task-1
任务 Task-1 交付.
生产: Task-2
消费: Task-2
任务 Task-2 交付.
生产: Task-3
消费: Task-3
任务 Task-3 交付.
```

#### 10.4.4 线程间数据交换（SynchronousQueue）

示例代码：

```java
public class DataExchangeExample {
    public static void main(String[] args) {
        SynchronousQueue<String> queue = new SynchronousQueue<>();

        // 线程 A
        Thread threadA = new Thread(() -> {
            try {
                System.out.println("线程 A 发送: Hello B");
                queue.put("Hello B"); // 发送给B
                String response = queue.take(); // 等待 B 的响应
                System.out.println("线程 A 收到: " + response);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.out.println("线程 A 被中断!");
            }
        });

        // 线程 B
        Thread threadB = new Thread(() -> {
            try {
                System.out.println("线程 B 收到: " + queue.take());
                queue.put("Hello A"); // 发送响应给 A
                System.out.println("线程 B 发送: Hello A");

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.out.println("线程 B 被中断!");
            }
        });

        threadA.start();
        threadB.start();
    }
}
```

运行结果：

```text
线程 A 发送: Hello B
线程 B 收到: Hello B
线程 B 发送: Hello A
线程 A 收到: Hello A
```

#### 10.4.5 任务延迟调度（DelayQueue）

创建一个任务调度系统，每个任务在指定的延迟时间后才会被执行。DelayQueue 确保任务按照到期时间排序，并且只有到期的任务才会被消费。

代码示例：

```java
class DelayedTask implements Delayed {
    private final String taskName;
    private final long executionTime; // 任务的执行时间（以毫秒为单位）

    public DelayedTask(String taskName, long delayInMilliseconds) {
        this.taskName = taskName;
        this.executionTime = System.currentTimeMillis() + delayInMilliseconds;
    }

    @Override
    public long getDelay(TimeUnit unit) {
        long remainingDelay = executionTime - System.currentTimeMillis();
        return unit.convert(remainingDelay, TimeUnit.MILLISECONDS);
    }

    @Override
    public int compareTo(Delayed other) {
        if (other instanceof DelayedTask) {
            return Long.compare(this.executionTime, ((DelayedTask) other).executionTime);
        }
        return 0;
    }

    public String getTaskName() {
        return taskName;
    }
}

public class DelayQueueExample {
    public static void main(String[] args) throws InterruptedException {
        DelayQueue<DelayedTask> delayQueue = new DelayQueue<>();

        // 添加延迟任务
        delayQueue.put(new DelayedTask("Task-1", 3000)); // 延迟 3 秒
        delayQueue.put(new DelayedTask("Task-2", 5000)); // 延迟 5 秒
        delayQueue.put(new DelayedTask("Task-3", 1000)); // 延迟 1 秒

        System.out.println("任务添加到延迟队列，等待执行...");

        // 消费者线程处理任务
        while (!delayQueue.isEmpty()) {
            DelayedTask task = delayQueue.take(); // 阻塞直到任务到期
            System.out.println("已执行: " + task.getTaskName() + " ；时间： " + System.currentTimeMillis());
        }

        System.out.println("全部任务执行完毕");
    }
}
```

运行结果：

```text
任务添加到延迟队列，等待执行...
已执行: Task-3 ；时间： 1735122952664
已执行: Task-1 ；时间： 1735122954664
已执行: Task-2 ；时间： 1735122956666
全部任务执行完毕
```

**代码解析**

1、**自定义任务类 (DelayedTask)**：

（1）实现 Delayed 接口。

（2）通过 getDelay 方法计算剩余延迟时间。

（3）compareTo 方法用于队列内的任务排序。

2、**DelayQueue 的特点**：

（1）任务按照剩余延迟时间排序。

（2）阻塞的 take 方法确保任务在到期前无法被取出。

3、**延迟任务调度逻辑**：

（1）任务被添加到 DelayQueue 中后，会根据到期时间排序。

（2）消费者线程通过 take 方法阻塞式获取到期任务并处理。



#### 10.4.6 缓存过期管理

实现一个简单的缓存系统，使用 DelayQueue 自动清理过期的缓存数据。

示例代码：

```java
class CacheItem<K, V> implements Delayed {
    private final K key;
    private final V value;
    private final long expirationTime;

    public CacheItem(K key, V value, long ttlInMilliseconds) {
        this.key = key;
        this.value = value;
        this.expirationTime = System.currentTimeMillis() + ttlInMilliseconds;
    }

    @Override
    public long getDelay(TimeUnit unit) {
        long remainingDelay = expirationTime - System.currentTimeMillis();
        return unit.convert(remainingDelay, TimeUnit.MILLISECONDS);
    }

    @Override
    public int compareTo(Delayed other) {
        return Long.compare(this.expirationTime, ((CacheItem<?, ?>) other).expirationTime);
    }

    public K getKey() {
        return key;
    }

    public V getValue() {
        return value;
    }
}

class Cache<K, V> {
    private final DelayQueue<CacheItem<K, V>> delayQueue = new DelayQueue<>();

    public void put(K key, V value, long ttlInMilliseconds) {
        CacheItem<K, V> item = new CacheItem<>(key, value, ttlInMilliseconds);
        delayQueue.put(item);
        System.out.println("添加缓存: " + key + "  TTL: " + ttlInMilliseconds + "ms");
    }

    public void startEvictionThread() {
        Thread evictionThread = new Thread(() -> {
            while (true) {
                try {
                    CacheItem<K, V> expiredItem = delayQueue.take(); // 获取过期项
                    System.out.println("缓存已被清理，key: " + expiredItem.getKey());
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        });
        evictionThread.setDaemon(true); // 守护线程
        evictionThread.start();
    }
}

public class DelayQueueCacheExample {
    public static void main(String[] args) throws InterruptedException {
        Cache<String, String> cache = new Cache<>();

        // 启动过期清理线程
        cache.startEvictionThread();

        // 添加缓存数据
        cache.put("key1", "value1", 3000); // TTL 3 秒
        cache.put("key2", "value2", 5000); // TTL 5 秒
        cache.put("key3", "value3", 1000); // TTL 1 秒

        Thread.sleep(7000); // 主线程等待，观察过期清理
    }
}
```

运行结果：

```text
添加缓存: key1  TTL: 3000ms
添加缓存: key2  TTL: 5000ms
添加缓存: key3  TTL: 1000ms
缓存已被清理，key: key3
缓存已被清理，key: key1
缓存已被清理，key: key2
```

**代码解析**

1、**CacheItem 类**：

（1）表示缓存数据，包含键、值及过期时间。

（2）实现 Delayed 接口，用于 DelayQueue 中排序和延迟处理。

2、**Cache 类**：

（1）封装 DelayQueue 实现缓存管理。

（2）提供 put 方法添加缓存数据，并启动守护线程定时清理过期数据。

3、**守护线程**：

（1）独立线程定期检查 DelayQueue，自动清理过期缓存项。



------

### 10.5 **BlockingQueue 的优缺点**

**优点**：

1、**线程安全**：所有操作均为线程安全，无需手动同步。

2、**自动阻塞**：处理线程等待逻辑，简化代码。

3、**多种实现**：满足不同场景需求。

4、**高效**：内部使用锁分离机制（如 LinkedBlockingQueue）。

**缺点**：

1、**延迟**：阻塞操作可能导致性能下降。

2、**非公平性**：部分实现类默认非公平模式，可能导致线程饥饿。

------

### 10.6 注意事项

1、**队列大小的设置**：

（1）对于有界队列，合理设置容量避免频繁阻塞。

（2）对于无界队列，避免队列无限增长导致内存溢出。

2、**公平性选择**：

（1）在高吞吐量场景优先选择非公平模式。

（2）对公平性要求高的场景选择公平模式。

3、**避免死锁**：

（1）确保生产者和消费者的速率平衡，防止长时间阻塞。

## 十一、synchronized与lock有什么区别

