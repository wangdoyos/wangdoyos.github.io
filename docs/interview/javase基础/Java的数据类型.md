## 1、Java的基本数据类型有哪些，各占几个字节

| 四类   | 八种    | 字节数 | 数据表示范围                          |
| ------ | ------- | ------ | ------------------------------------- |
| 整型   | byte    | 1      | -128~127                              |
|        | short   | 2      | -32768～32767                         |
|        | int     | 4      | -2147483648～2147483647               |
|        | long    | 8      | -2的63次方～2的63次方 -1              |
| 浮点型 | float   | 4      | -3.403E38～3.403E38                   |
|        | double  | 8      | -1.798E308～1.798E308                 |
| 字符型 | char    | 2      | 表示一个字符，如('a'，'A'，'0'，'家') |
| 布尔型 | boolean | 1      | true false                            |

## 2、String 是基本数据类型吗

String 是引用类型，底层用 char 数组实现的。

## 3、short s1 = 1; s1 = s1 + 1; 有错吗?short s1 = 1; s1 += 1 有错吗

前者不正确，后者正确。

对于 short s1 = 1; s1 = s1 + 1;由于 1 是 int 类型，因此 s1+1 运算结果也是 int 型，需要强制转换类型才能赋值给 short 型。

而 short s1 = 1; s1 += 1;可以正确编译，因为 s1+= 1;相当于 s1 = (short)(s1 + 1);其中有隐含的强制类型转换。

## 4、int 和 和 Integer 有什么区别

Java 是一个近乎纯洁的面向对象编程语言，但是为了编程的方便还是引入了基本数据类型，为了能够将这些基本数据类型当成对象操作，Java 为每一个基本数据类型都引入了对应的包装类型（wrapper class），int 的包装类就是Integer，从 Java 5 开始引入了自动装箱/拆箱机制，使得二者可以相互转换。

Java 为每个原始类型提供了包装类型：

\- 原始类型: boolean，char，byte，short，int，long，float，double

\- 包装类型：Boolean，Character，Byte，Short，Integer，Long，Float，Double

示例代码：

```java
public class AutoUnboxingTest {
    public static void main(String[] args) {
        Integer a = new Integer(3);
        Integer b = 3; // 将3自动装箱成Integer类型
        int c = 3;
        System.out.println(a == b); // false 两个引用没有也能用同一对象 
        System.out.println(a == c); // true a自动拆箱成int类型再和c比较
        
    }
}
```

## 5、下面代码输出结果是什么

```java
public class AutoUnboxingTest {
    public static void main(String[] args) {
        Integer f1 = 100, f2 = 100, f3 = 150, f4 = 150;
        System.out.println(f1 == f2); //true
        System.out.println(f3 == f4); //false
    }
}
```

考点为int的取值范围和自动装箱。

当我们给一个 Integer 对象赋一个 int 值的时候，会调用 Integer 类的静态方法 valueOf，在这个方法中如果整型字面量的值在-128 到 127 之间，那么不会 new 新的 Integer 对象，而是直接引用常量池中的 Integer 对象，所以上面的面试题中 f1==f2 的结果是 true，而 f3==f4 的结果是 false。

## 6、String 类常用方法

| 方法                                          | 说明                                                 |
| --------------------------------------------- | ---------------------------------------------------- |
| int length()                                  | 返回当前字符串的长度                                 |
| int indexOf(String str)                       | 查找str字符串在当前字符串中第一次出现的位置          |
| int lastIndexOf(String str)                   | 查找str字符串在当前字符串中最后一次出现的位置        |
| String subString(int beginIndex,int endIndex) | 截取从beginIndex位置到endIndex位置的字符串           |
| String trim()                                 | 获取去空格后的字符串                                 |
| boolean equals(Object obj)                    | 将该字符串与指定对象比较，返回true或false            |
| String toLowerCase()                          | 返回小写字符串                                       |
| String toUpperCase()                          | 返回大写字符串                                       |
| char charAt(int index)                        | 获取字符串中指定位置的字符                           |
| String[] split(String regex,int limit)        | 将字符串根据指定符号进行分隔，返回分隔后的字符串数组 |

## 7、数据类型之间的转换

（1）字符串如何转基本数据类型？

调用基本数据类型对应的包装类中的方法 parseXXX(String)或 valueOf(String)即可返回相应基本类型。

（2）基本数据类型如何转字符串？

一种方法是将基本数据类型与空字符串（“”）连接（+）即可获得其所对应的字符串；另一种方法是调用 String 类中的 valueOf()方法返回相应字符串。