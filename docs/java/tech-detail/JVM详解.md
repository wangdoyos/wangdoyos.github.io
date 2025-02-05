## 一、JVM体系结构

<img src="https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634829895-913c7c53-b745-4da9-a0f3-afdd0a61c850.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_527%2Climit_0"/>

灰色线程私有，大概率不发生垃圾回收

橙色线程公有，垃圾回收主要作用域

## 二、 JAVA8 以后的 JVM

<img src="https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634830459-eb0c0a9e-69ad-4f06-9d3f-02f347b128b6.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_830%2Climit_0" />

## 三、如何查看JVM系统默认值

### 3.1 JVM的参数类型

#### 3.1.1 标配参数

1、-version

2、-help

3、java -showversion

<img src="https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634831992-8f348f61-f26d-4625-a5e0-007365b1e9f2.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_486%2Climit_0" />

#### 3.1.2 X参数

1、-Xint：解释执行

2、-Xcomp：第一次使用就编译成本地代码

3、-Xmixed：混合模式

<img src="https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634832411-12928aa6-f285-4c1c-96ee-6b7d7956ea22.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_530%2Climit_0" />

#### 3.1.3 XX参数

**1、 Boolean类型**

（1）公式：-XX:+或者-某个属性值，+表示开启，-表示关闭

（2）示例：

是否打印GC收集细节：-XX:+PrintGCDetails，-XX:-PrintGCDetails

是否使用串行垃圾回收器：-XX:-UseSerialGC，-XX:+UseSerialGC

**2、KV设置类型**

（1）公式：-XX属性key=属性值value

（2）示例：

设置元空间大小：-XX:MetaspaceSize=128m

设置转老年区次数：-XX:MaxTenuringThreshold=15

**3、jinfo，查看当前运行程序的配置**

先通过jps命令查看java后台运行的进程，然后根据进程编号进行查询。

<img src="https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634832634-5a2ee09b-6675-478b-a48d-63249f7c87a0.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_281%2Climit_0" />

（1）公式：jinfo -flag 参数 java进程编号 或 jinfo -flags java进程编号

（2）示例：

<img src="https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634833129-5e0de053-e48c-4332-85c8-2d94fec81346.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_830%2Climit_0" />

**4、题外话**

-Xms：等价于 -XX:InitialHeapSize

-Xmx：等价于 -XX:MaxHeapSize

以上两个参数都是XX参数

### 3.2 查看JVM默认值

#### 3.2.1 -XX:+PrintFlagsInitial

查看参数初始默认值。

（1）公式：java -XX:+PrintFlagsInitial

（2）示例：

<img src="https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634833491-043a4ceb-4d07-4179-aa4d-a97637653fdd.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_705%2Climit_0" />

#### 3.2.2 -XX:+PrintFlagsFinal

主要查看参数修改更新后的值。

（1）公式：java -XX:+PrintFlagsFinal -version

（2）示例： :=表示修改过的值  =表示初始值

![img](https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634833959-da85e168-a1df-4ccc-a20a-4f2b2838ec00.png)

#### 3.2.3 -XX:+PrintFlagsFinal

运行java命令的同时打印出参数  java -XX:+PrintFlagsFinal -Xss128k T （T为运行的java类名字）

#### 4.2.4 -XX:+PrintCommandLineFlags

打印命令行参数

（1）公式：java -XX:+PrintCommandLineFlags -version

（2）示例：

![img](https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634834206-d89d6022-1ba3-44e2-9237-bcdb35392124.png)

## 四、Jvm的常用配置参数

### 4.1 -Xms

**初始大小内存**，默认为物理内存1/64，等价于-XX:InitialHeapSize

### 4.2 -Xmx

**最大分配内存**，默认为物理内存1/4，等价于-XX:MaxHeapSize

### 4.3 -Xss

**设置单个线程栈的大小**，一般默认为512K~1024k，等价于-XX:ThreadStackSize

### 4.4 -Xmn

**设置年轻代大小**

### 4.5 -XX:MetaspaceSize

**设置元空间大小。**元空间的本质和永久代类似，都是对JVM规范中方法区的实现，不过元空间与永久代之间最大的区别在于：元空间并不在虚拟机中，而是使用本地内存。因此，默认情况下，元空间的大小仅受本地内存限制。

### 4.6 典型设置案例

-Xms128m -Xmx4096m -Xss1024k -XX:MetaspaceSize=512m -XX:+PrintCommandLineFlags -XX:+PrintGCDetails -XX:+UseSerialGC

![img](https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634834487-a43cfea2-9e41-4d86-9a3f-70bbd786fd1c.png)

### 4.7 -XX:+PrintGCDetails

输出详细GC收集日志信息。

示例：

先设置最大堆内存

![img](https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634834697-8542cfcf-3d0e-4659-9905-9a9f1c856376.png)

然后运行代码：

```java
public class HelloGC {
    public static void main(String[] args) {         System.out.println("hello GC");
        byte[] bytes = new byte[50*1024*1024];//超出最大内存 触发GC
    }
}
```

结果：

![img](https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634835035-9a2a916f-eade-46fd-a02f-880cad3ca752.png)

GC收集日志信息：

![img](https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634835596-824eeaba-f669-498c-9f24-4337edc689ec.png)

### 4.8 -XX:SurvivorRatio

设置新生代中eden和S0/S1空间的比例。

示例：

默认-XX:SurvivorRatio=8,Eden:S0:S1=8:1:1

![img](https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634836045-c8ce5957-1b56-48a3-a7c2-b3521b7ca2c9.png)

![img](https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634836257-20e2ee68-5b83-4499-9ec6-b859cab662a2.png)

 

假如-XX:SurvivorRatio=4,Eden:S0:S1=4:1:1

![img](https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634836570-844a94ed-fd9a-4302-9ea0-2c40e7e7a6e7.png)

![img](https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634836769-1d5518f9-f94d-4eeb-9139-dae1a45347f3.png)

 

SurvivorRatio值就是设置eden区的比例占多少，S0/S1相同

### 4.9 -XX:NewRatio

配置年轻代和老年代在堆内存的占比。

示例：

默认-XX:NewRatio = 2新生代占1，老年代占2，年轻代占整个堆的1/3

![img](https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634837702-a0e55162-6775-4a06-ae73-0eab49535a9a.png)

![img](https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634838181-661c8541-6fb8-44a2-bdfc-a3d5be8ec488.png)

假如-XX:NewRatio = 4新生代占1，老年代占4，年轻代占整个堆的1/5

![img](https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634838366-a10d63ff-24c9-4e60-98f7-c75f9ae2337e.png)

NewRatio的值就是设置老年代的占比，剩下的1给新生代

### 4.10 -XX:MaxTenuringThreshold

**设置垃圾最大年龄。**如果设置为0的话，则年轻代对象不经过Survivor区，直接进入年老代，对于年老代比较多的应用，可以提高效率。如果将此值设为一个较大值，则年轻代对象会在Survivor区进行多次复制，这样可以增加对象在年轻代的存活时间，增加在年轻代即被回收的概率。

查看默认进入老年代年龄：

![img](https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634838722-d84e4e6d-9d1e-404c-bdb8-11fcb833a774.png)

设置最大年龄：

![img](https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634838924-dd9a9c0c-d260-4308-b991-7a77f8138513.png)

![img](https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634839274-f1f77b0b-b1f2-4e7d-b23a-381383cca503.png)

java8中最大就是15，自己设置也不能超过15

## 五、四种引用

整体架构

![img](https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634839773-3e4fc62d-271b-4517-85ec-0497d6039904.png)

### 5.1 强引用Reference

当内存不足时，JVM开始垃圾回收，**对于强引用的对象，就算是出现了OOM也不会对该对象进行回收**，死都不会收。

强引用是我们最常见的普通对象引用，只要还有强引用指向一个对象，就能表明对象还活着，垃圾收集器不会碰这种对象。在Java中最常见的就是强引用，**把一个对象赋给一个引用变量，这个引用变量就是一个强引用**。

**当一个对象被强引用变量引用时，它处于可达状态，它是不可能被垃圾回收机制回收的，即使该对象以后永远都不会被用，JVM也不会回收**。因此强引用是造成Java内存泄露的主要原因之一。

对于一个普通的对象，如果没有其他的引用关系，只要超过了引用的作用域或者显式的将相应（强）引用赋值为null，一般认为就是可以被垃圾回收的。（当然具体回收时机还是要看垃圾收集策略）

代码示例：

```java
public class StrongReferenceDemo {
    public static void main(String[] args) {
        Object obj1 = new Object();//这样定义的默认就是强引用
        Object obj2 = obj1;//obj2引用赋值
        obj1 = null;//置空
        System.gc();
        System.out.println(obj2);
    }
}
```

结果：

```text
java.lang.Object@6acbcfc0
```

### 5.2 软引用SoftReference

软引用是一种相对强引用弱化了一些的引用，需要用java.lang.ref.SoftReference类来实现，可以让对象豁免一些垃圾收集。

对于只有软引用的对象来说，**当系统内存充足时，它不会被回收，当系统内存不足时，它会被回收。**

软引用通常用在对内存敏感的程序中，比如高速缓存就有用到软引用，内存够用的时候保留，不够用就回收。

内存够用代码示例：

```java
public static void softRef_Memory_Enough(){
    Object o1 = new Object();
    SoftReference<Object> softReference = new SoftReference<>(o1);
    System.out.println(o1);
    System.out.println(softReference.get());
    o1  = null;
    System.gc();
    System.out.println(o1);
    System.out.println(softReference.get());
}
```

结果：

```text
java.lang.Object@6acbcfc0
java.lang.Object@6acbcfc0
null
java.lang.Object@6acbcfc0
```

**结论：内存够用时，软引用不会被回收。**

内存不够用代码示例：

```java
    //JVM配置，故意产生大对象并配置小内存，让它内存不够用了导致OOM，看软引用的回收情况 //-Xms5m -Xmx5m -XX:+PrintGCDetails
    public static void softRef_Memory_NotEnough() {
        Object o1 = new Object();
        SoftReference<Object> softReference = new SoftReference<>(o1);
        System.out.println(o1);
        System.out.println(softReference.get());
        o1 = null;

        try {
            byte[] bytes = new byte[30 * 1024 * 1024];
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            System.out.println(o1);
            System.out.println(softReference.get());
        }
    }
```

结果：

 ![img](https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634840302-f22ecdd6-7b11-4f32-aa7f-045cefb176de.png)

**结论：内存不足时，软引用会被回收。**

### 5.3 弱引用WeakReference

弱引用需要java.lang.ref.WeakReference类来实现，它比软引用的生存期更短。

**对于只有弱引用的对象来说，只要垃圾回收机制一运行，不管JVM内存空间是否足够，都会回收该对象占用的内存。**

代码示例：

```java
public class WeakReferenceDemo {
    public static void main(String[] args) {
        Object o1 = new Object();
        WeakReference<Object> weakReference = new WeakReference<>(o1);
        System.out.println(o1);
        System.out.println(weakReference.get());
        o1=null;
        System.gc();
        System.out.println("=========");
        System.out.println(o1);
        System.out.println(weakReference.get());
    }
}
```

结果：

```text
java.lang.Object@6acbcfc0
java.lang.Object@6acbcfc0
=========
null
null
```

**结论：不管JVM内存是否充足，只要垃圾回收了，弱引用就会被回收。**

### 5.4 弱引用和软引用的使用场景

假如有一个应用需要读取大量本地图片时面临以下两个问题：

1、如果每次读取图片都从硬盘读取则会严重影响性能。

2、如果一次性全部加载到内存中又可能造成内存溢出

此时使用软引用可以解决这个问题

设计思路是：用一个HashMap来保存图片的路径和相应图片对象关联的软引用之间的映射关系，在内存不足时，JVM会自动回收这些缓存图片对象所占用的空间，从而有效的避免了OOM问题。

```java
Map<String,SoftReference<Bitmap>> imageCache = new HashMap<String,SoftReference<Bitmap>>();
```

### 5.5 什么是WeakHashMap

代码示例：

```java
public class WeakHashMapDemo {
    public static void main(String[] args) {
        myHashMap();
        System.out.println("==============");
        myWeakHashMap();
    }
    private static void myHashMap(){
        HashMap<Integer,String> map = new HashMap<>();
        Integer key = new Integer(1);
        String value = "HashMap";
        map.put(key,value);
        System.out.println(map);
        key = null;
        System.out.println(map);
        System.gc();
        System.out.println(map+"\t"+map.size());
    }
    private static void myWeakHashMap(){
        WeakHashMap<Integer,String> map = new WeakHashMap<>();
        Integer key = new Integer(2);
        String value = "WeakHashMap";
        map.put(key,value);
        System.out.println(map);
        key = null;
        System.out.println(map);
        System.gc();
        System.out.println(map+"\t"+map.size());
    }
}
```

运行结果;

```text
{1=HashMap}
{1=HashMap}
{1=HashMap}	1
==============
{2=WeakHashMap}
{2=WeakHashMap}
{}	1
```

结论：WeakHashMap在垃圾回收之后，会被回收

### 5.6 虚引用（幽灵引用）

虚引用是通过  java.lang.ref.PhantomReference 类来实现的。它是一种特殊的引用类型，对对象的生命周期几乎没有影响，无法通过虚引用来获取对象实例。创建虚引用时，除了要指定被引用的对象，还必须关联一个引用队列（ReferenceQueue）。

**特点：**

1、与强引用、软引用和弱引用不同，不能通过虚引用来访问其所引用的对象。也就是说，即使虚引用指向了一个对象，你也没办法通过这个虚引用获取该对象的具体内容或调用其方法。

2、虚引用的存在与否不会阻止对象被垃圾回收器回收。即使有虚引用指向某个对象，该对象在其他强引用、软引用和弱引用都不存在时，仍会被正常回收。

3、创建虚引用时，需要传入一个 ReferenceQueue 对象。**当其所引用的对象被垃圾回收后，该虚引用会被加入到与之关联的引用队列中，开发者可以通过检查引用队列来得知对象是否已被回收。**

**使用场景：**

1、资源管理：在某些情况下，当对象被垃圾回收时，需要执行一些额外的资源释放操作，比如关闭文件、释放网络连接等。可以使用虚引用来跟踪对象的回收状态，当虚引用被加入到引用队列时，说明对象已被回收，此时可以在引用队列的处理逻辑中进行资源释放操作。

2、内存监控：通过虚引用和引用队列，可以监控对象的生命周期和垃圾回收情况，帮助开发者更好地了解内存使用状况，进行性能调优。

引用队列代码示例：

```java
public class ReferenceQueueDemo {
    public static void main(String[] args) throws Exception {
        Object o1 = new Object();
        ReferenceQueue<Object> referenceQueue = new ReferenceQueue<>();
        WeakReference<Object> weakReference = new WeakReference<>(o1, referenceQueue);
        System.out.println(o1);
        System.out.println(weakReference.get());
        System.out.println(referenceQueue.poll());
        System.out.println("===================");
        o1 = null;
        System.gc();
        Thread.sleep(500);
        System.out.println(o1);
        System.out.println(weakReference.get());
        System.out.println(referenceQueue.poll());
    }
}
```

运行结果：

```text
java.lang.Object@6acbcfc0
java.lang.Object@6acbcfc0
null
===================
null
null
java.lang.ref.WeakReference@5b480cf9
```

结论：

**引用对象被回收之前会被放到引用队列里面。**

虚引用代码示例：

```java
public class PhantomReferenceDemo {
    public static void main(String[] args) throws Exception {
        Object o1 = new Object();
        ReferenceQueue<Object> referenceQueue = new ReferenceQueue<>();
        PhantomReference<Object> phantomReference = new PhantomReference<>(o1, referenceQueue);
        System.out.println(o1);
        System.out.println(phantomReference.get());
        System.out.println(referenceQueue.poll());
        System.out.println("==========");
        o1 = null;
        System.gc();
        Thread.sleep(500);
        System.out.println(o1);
        System.out.println(phantomReference.get());
        System.out.println(referenceQueue.poll());
    }
}
```

运行结果：

```text
java.lang.Object@6acbcfc0
null
null
==========
null
null
java.lang.ref.PhantomReference@5b480cf9
```

### 5.7 总结

<img src="https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634843504-bc619a0d-ddf6-4b2a-b5b3-ef9b64b4df81.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_720%2Climit_0" />

## 六、OOM

<img src="https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634843960-920ab963-3966-4b56-a77f-2ed7d99fa112.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_648%2Climit_0" />

### 6.1  java.lang.StackOverflowError

异常内容：栈内存溢出。

产生原因：方法调用太多

代码示例：

```java
public class StackOverflowErrorDemo {
    public static void main(String[] args) {
        stackOverflowError();
    }

    private static void stackOverflowError() {
        stackOverflowError();//Exception in thread "main" java.lang.StackOverflowError
    }
}
```

运行结果：

```text
Exception in thread "main" java.lang.StackOverflowError
	at org.doyo.gc.StackOverflowErrorDemo.stackOverflowError(StackOverflowErrorDemo.java:16)
	at org.doyo.gc.StackOverflowErrorDemo.stackOverflowError(StackOverflowErrorDemo.java:16)
	at org.doyo.gc.StackOverflowErrorDemo.stackOverflowError(StackOverflowErrorDemo.java:16)
	at org.doyo.gc.StackOverflowErrorDemo.stackOverflowError(StackOverflowErrorDemo.java:16)
	at org.doyo.gc.StackOverflowErrorDemo.stackOverflowError(StackOverflowErrorDemo.java:16)
	at org.doyo.gc.StackOverflowErrorDemo.stackOverflowError(StackOverflowErrorDemo.java:16)
	at org.doyo.gc.StackOverflowErrorDemo.stackOverflowError(StackOverflowErrorDemo.java:16)
```

### 6.2  java.lang.OutofMemoryError:Java heap space

异常内容：堆内存溢出

产生原因：对象创建过多或对象创建过大，超过内存限制

代码示例：

先设置JVM内存：-Xms5m -Xmx5m

```java
public class JavaHeapSpaceDemo {
    public static void main(String[] args) {
       byte[] bytes = new byte[80*1024*1024];//80M
    }
}
```

结果：

```text
Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
	at org.doyo.gc.JavaHeapSpaceDemo.main(JavaHeapSpaceDemo.java:12)
```

### 6.3 java.lang.OutofMemoryError:GC overhead limit exceeded

异常内容：GC回收时间过长。

产生原因：超过98%的时间用来做GC但是回收了不到2%的堆内存，连续多次GC都只回收了不到2%的内存极端情况下才会抛出。CPU利用率一直是100%，而GC没有任何成果。

代码示例：

先设置JVM参数：-Xms10m -Xmx10m -XX:+PrintGCDetails -XX:MaxDirectMemorySize=5m

```java
public class GCOverheadDemo {
    public static void main(String[] args) {
        int i = 0;
        List<String> list = new ArrayList<>();
        try {
            while (true) {
                list.add(String.valueOf(++i));
            }
        } catch (Exception e) {
            System.out.println("**********************i:" + i);
            e.printStackTrace();
            throw e;
        }
    }
}
```

### 6.4  java.lang.OutofMemoryError:Direct buffer memory

异常内容：直接内存溢出（物理内存溢出）。

产生原因：写NIO程序经常使用ByteBuffer来读取或者写入数据，这是一种基于通道与缓冲区的I/O方式，他可以使用Native函数库直接分配堆外内存，然后通过一个存储在java堆里面的DirectByteBuffer对象作为这块内存的引用进行操作。

这样能够在一些场景中显著提高性能，因为避免了在java堆和Native堆中来回复制数据。

但如果不断分配本地内存，堆内存很少使用，nameJVM就不需要执行GC，DirectByteBuffer对象们就不会被回收。这时候堆内存充足，但本地内存可能已经使用光了，再次尝试分配本地内存就会出现OutOfMemoryError，那程序就直接崩溃了。

示例代码：

```java
public class DirectBufferMemoryDemo {
    public static void main(String[] args) {
        System.out.println("配置的maxDirectMemory:"+(sun.misc.VM.maxDirectMemory()/(double)1024/1024)+"MB");
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        //-XX:MaxDirectMemorySize=5m
        ByteBuffer bb = ByteBuffer.allocateDirect(6*1024*1024);
    }
}
```

运行结果：

```text
Exception in thread "main" java.lang.OutOfMemoryError: Cannot reserve 6291456 bytes of direct buffer memory (allocated: 8192, limit: 5242880)
	at java.base/java.nio.Bits.reserveMemory(Bits.java:178)
	at java.base/java.nio.DirectByteBuffer.<init>(DirectByteBuffer.java:127)
	at java.base/java.nio.ByteBuffer.allocateDirect(ByteBuffer.java:360)
	at org.doyo.gc.DirectBufferMemoryDemo.main(DirectBufferMemoryDemo.java:20)
```

### 6.5 java.lang.OutofMemoryError:unable to create new native thread

异常内容：不能创建更多线程

产生原因：

（1）应用创建太多线程了，一个应用进程创建多个线程，超过系统承载极限

（2）服务器不允许应用程序创建这么多线程，linux默认允许单个进程创建的最大线程数是1024个，应用创建超过这个数量就会抛出该异常

解决办法：

（1）想办法降低应用程序创建线程的数量，分析应用是否真的需要创建这么多线程，如果不是，改代码将线程数量降到最低。

（2）对于有的应用，确实需要创建很多线程，远超过linux系统的默认1024个线程的限制，可以通过修改linux服务器配置，扩大linux默认限制。

代码示例：

```java
public class UnableCreateNewThreadDemo {
    public static void main(String[] args) {
        for (int i = 1; ; i++) {
            System.out.println("********i = " + i);
            new Thread(() -> {
                try {
                    Thread.sleep(Integer.MAX_VALUE);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }, "" + i).start();
        }
    }
}
```

运行结果：

```text
[0.362s][warning][os,thread] Failed to start the native thread for java.lang.Thread "4075"
Exception in thread "main" java.lang.OutOfMemoryError: unable to create native thread: possibly out of memory or process/resource limits reached
	at java.base/java.lang.Thread.start0(Native Method)
	at java.base/java.lang.Thread.start(Thread.java:1526)
	at org.doyo.gc.UnableCreateNewThreadDemo.main(UnableCreateNewThreadDemo.java:20)
```

### 6.6  java.lang.OutofMemoryError:Metaspace

异常内容：元空间内存溢出

本机初始化元空间大小：

```bash
java -XX:+PrintFlagsInitial
```

可以看到输出中包含：MetaspaceSize = 22020096 

代码示例：

```java
public class MetaspaceOOMtest {
    static class OOMTest{ }
    public static void main(String[] args) {
        int i=0;//模拟计数多少次以后发生异常
        try {
            while (true){
                i++;
                Enhancer enhancer = new Enhancer();
                enhancer.setSuperclass(OOMTest.class);
                enhancer.setUseCache(false);
                enhancer.setCallback(new MethodInterceptor() {
                    @Override
                    public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
                        return methodProxy.invokeSuper(0,args);
                    }
                });
                enhancer.create();
            }
        } catch (Exception e) {
  
            e.printStackTrace();
        }finally {
            System.out.println("******多少次后发生了异常"+i);
        }
    }
}
```

运行结果：

<img src="https://cdn.nlark.com/yuque/0/2022/png/23116580/1657634849162-760a96e8-afef-4617-9939-b8e18c508f48.png?x-oss-process=image%2Fformat%2Cwebp%2Fresize%2Cw_567%2Climit_0" />

