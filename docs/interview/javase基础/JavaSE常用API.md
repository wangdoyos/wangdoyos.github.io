## 1、Math.round()的使用

Math.round(11.5)等于多少？Math.round(- 11.5) 又等于多少?

Math.round(11.5)的返回值是 12，

Math.round(-11.5)的返回值是-11。

四舍五入的原理是在参数上加 0.5，然后进行取整。

## 2、switch 是否能作用在 byte 上，是否能作用在 long 上，是否能作用在 String上

Java5 以前 switch(expr)中，expr 只能是 byte、short、char、int。

从 Java 5 开始，Java 中引入了枚举类型，expr 也可以是 enum 类型。

从 Java 7 开始，expr 还可以是字符串（String），**但是长整型（long）在目前所有的版本中都是不可以的。**

## 3、数组有没有 length() 方法？String 有没有 length() 方法

数组没有 length()方法，而是有 length 的属性。

String 有 length()方法。

JavaScript 中，获得字符串的长度是通过 length 属性得到的，这一点容易和 Java 混淆。

## 4、String 、StringBuilder 、StringBuffer 的区别

1. **不可变性**

**String**：不可变类。每次对String的修改（如拼接、替换）都会**生成新对象**，原始对象不变。

```java
String str = "Hello";
str += " World"; // 创建新对象，原"Hello"仍存在于内存中
```

**StringBuilder/StringBuffer**：可变类。直接在**原对象上修改**字符序列，避免频繁创建新对象。

```java
StringBuilder sb = new StringBuilder("Hello");
sb.append(" World"); // 原对象被修改
```

2. **线程安全**

**String**：不可变天然线程安全，无法被多线程修改。

**StringBuffer**：线程安全。所有方法用synchronized修饰，保证多线程环境下的同步。

```java
public synchronized StringBuffer append(String str) { ... }
```

**StringBuilder**：非线程安全。单线程下性能更高，但多线程需手动同步。

3. **性能**

**String**：频繁修改时性能最差（因大量对象创建和垃圾回收）。

**StringBuilder**：单线程下性能最优（无同步开销）。

**StringBuffer**：多线程下安全，但同步导致性能略低于StringBuilder。

4. **使用场景**

**String**：适用于字符串常量或无需频繁修改的场景（如配置信息、常量定义）。

**StringBuilder**：单线程下频繁修改字符串（如循环拼接、动态SQL生成）。

**StringBuffer**：多线程下需保证线程安全的字符串操作（较少见，通常用其他同步机制替代）。

5. **其他细节**

**继承关系**：三者均实现CharSequence接口。StringBuilder和StringBuffer继承自AbstractStringBuilder。

**JVM优化**：String的+操作在编译时可能转为StringBuilder，但循环中仍需显式使用StringBuilder避免性能问题。

**初始容量**：StringBuilder和StringBuffer默认容量为16，可动态扩容；String长度固定。

## 5、String的+操作什么场景下性能与 StringBuffer/StringBuilder append 方法连接字符串性能更好

1. **编译器的优化**

Java编译器会对+运算符进行优化，将其转换为StringBuilder的append操作。例如：

```java
String str = "Hello" + " World";
```

编译器会优化为：

```java
String str = new StringBuilder().append("Hello").append(" World").toString();
```

在这种情况下，+运算符的性能与StringBuilder几乎相同。

2. **常量字符串拼接**

如果所有参与拼接的字符串都是**常量**（编译时已知），编译器会直接将它们合并为一个字符串常量，放入字符串常量池。例如：

```java
String str = "Hello" + " World"; // 编译时优化为 "Hello World"
```

此时，+运算符的性能是最好的，因为不需要运行时创建对象或调用方法。

3. **少量字符串拼接**

如果拼接操作**只执行一次或次数很少**，+运算符的性能与StringBuilder/StringBuffer相差不大。例如：

```java
String str = str1 + str2 + str3;
```

编译器会将其优化为：

```java
String str = new StringBuilder().append(str1).append(str2).append(str3).toString();
```

此时，+运算符的代码更简洁，可读性更高，性能损失可以忽略。

4. **代码简洁性与可读性**

在某些情况下，使用+运算符可以使代码更简洁、易读。例如：

```java
String message = "User: " + username + ", Age: " + age;
```

如果性能不是关键问题（如拼接操作很少或字符串长度较短），使用+运算符是更好的选择。

5. **JVM的进一步优化**

现代JVM（如HotSpot）会对字符串操作进行进一步优化，包括逃逸分析、栈上分配等。在某些情况下，+运算符的性能可能会被JVM优化到与StringBuilder相当的水平。

## 6、给出以下代码的运行结果

代码示例：

```java
public class StringEqualTest {
    public static void main(String[] args) {
        String s1 = "Programming";
        String s2 = new String("Programming");
        String s3 = "Program";
        String s4 = "ming";
        String s5 = "Program" + "ming";
        String s6 = s3 + s4;
        System.out.println(s1 == s2); 
        System.out.println(s1 == s5); 
        System.out.println(s1 == s6); 
        System.out.println(s1 == s6.intern()); 
        System.out.println(s2 == s2.intern()); 
    }
}
```

运行结果为：

```text
false
true
false
true
false
```

> 补充：解答上面的面试题需要知道如下两个知识点：
>
> 1. String 对象的 intern()方法会得到字符串对象在常量池中对应的版本的引用（如果常量池中有一个字符串与String 对象的 equals 结果是 true），如果常量池中没有对应的字符串，则该字符串将被添加到常量池中，然后返回常量池中字符串的引用；
>
> 2. 字符串的+操作其本质是创建了 StringBuilder 对象进行 append 操作，然后将拼接后的 StringBuilder 对象用 toString 方法处理成 String 对象，这一点可以用 javap -c StringEqualTest.class 命令获得 class 文件对应的 JVM 字节码指令就可以看出来





## 7、Java 中的日期和时间

1、 如何取得年月日、小时分钟秒？

在Java 8及以后版本中，可以使用LocalDateTime或LocalDate和LocalTime来获取年月日、小时分钟秒。

```java
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;

public class DateTimeExample {
    public static void main(String[] args) {
        // 获取当前日期和时间
        LocalDateTime now = LocalDateTime.now();
        int year = now.getYear();          // 年
        int month = now.getMonthValue();   // 月
        int day = now.getDayOfMonth();     // 日
        int hour = now.getHour();           // 小时
        int minute = now.getMinute();     // 分钟
        int second = now.getSecond();      // 秒

        System.out.println("年: " + year + ", 月: " + month + ", 日: " + day);
        System.out.println("时间: " + hour + ":" + minute + ":" + second);
    }
}

```

2、 如何取得从 1970年1 月 1 日 0 时 0 分 0 秒到现在的毫秒数？

可以使用System.currentTimeMillis()或Java 8的Instant类。

```java
// 方法1：使用System.currentTimeMillis()
long currentTimeMillis = System.currentTimeMillis();
System.out.println("毫秒数: " + currentTimeMillis);

// 方法2：使用Java 8的Instant类
import java.time.Instant;
long epochMilli = Instant.now().toEpochMilli();
System.out.println("毫秒数: " + epochMilli);
```

3、如何取得某月的最后一天？

使用LocalDate的with(TemporalAdjusters.lastDayOfMonth())方法。

```java
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;

public class LastDayOfMonth {
    public static void main(String[] args) {
        LocalDate today = LocalDate.now();
        LocalDate lastDayOfMonth = today.with(TemporalAdjusters.lastDayOfMonth());
        System.out.println("本月最后一天: " + lastDayOfMonth);
    }
}
```

4、如何格式化日期？

使用DateTimeFormatter类来格式化日期。

```java
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DateFormatting {
    public static void main(String[] args) {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formattedDate = now.format(formatter);
        System.out.println("格式化后的日期: " + formattedDate);
    }
}
```

5、打印昨天的当前时刻？ 

使用LocalDateTime的minusDays()方法。

```java
import java.time.LocalDateTime;

public class YesterdayTime {
    public static void main(String[] args) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime yesterday = now.minusDays(1);
        System.out.println("昨天的当前时刻: " + yesterday);
    }
}
```

6、Java8 的日期特性？

Java 8引入了全新的日期时间API（java.time包），主要特性包括：

**不可变性**：所有日期时间类都是不可变的，线程安全。

**清晰的类设计**：

- LocalDate：只包含日期（年、月、日）。
- LocalTime：只包含时间（时、分、秒）。
- LocalDateTime：包含日期和时间。
- ZonedDateTime：包含时区的日期和时间。
- Instant：时间戳（从1970-01-01T00:00:00Z开始的秒和纳秒）。

- **时区支持**：通过ZoneId和ZonedDateTime处理时区。
- **格式化与解析**：通过DateTimeFormatter实现。
- **时间调整器**：通过TemporalAdjusters实现复杂的日期调整（如获取某月的最后一天）。

7、Java8 之前的日期和时间使用的槽点 

**（1）java.util.Date和java.util.Calendar的设计问题**：

- 可变性：线程不安全。
- 难用的API：Calendar的月份从0开始，Date的年份从1900年开始。
- 时区处理复杂：Date不包含时区信息，Calendar的时区支持不够直观。

**（2）格式化问题**：SimpleDateFormat是非线程安全的。

**（3）缺乏直观的操作**：如加减日期、获取某月的最后一天等操作需要手动计算。

8、Java8 日期实现 JSR310 规范 

Java 8的日期时间API是基于**JSR 310**规范实现的，由Stephen Colebourne（Joda-Time的作者）主导设计。JSR 310的核心思想是：

**清晰的设计**：将日期、时间、时区等概念分离。

**不可变性**：所有类都是不可变的，线程安全。

**扩展性**：支持自定义日期时间操作和格式化。

**国际化**：内置对时区、日历系统的支持。

JSR 310的引入解决了Java 8之前日期时间处理的诸多问题，成为现代Java开发中的首选日期时间API。