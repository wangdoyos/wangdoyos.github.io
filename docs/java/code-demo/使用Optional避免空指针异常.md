Optional是 Java 8 引入的一个容器类，用于避免显式的 null 检查，从而减少 NullPointerException 的风险。以下是常见方法的功能和使用方式：

# 1、Optional.ofNullable
+ **功能**：根据传入的值，创建一个 Optional 对象。如果传入值是 null，创建一个空的 Optional；否则，创建一个包含该值的 Optional。
+ **用法**：适合用在不确定值是否为 null 的场景。

**示例**：

```java
String value = null;
Optional<Object> optional = Optional.ofNullable(value);

// 如果 value 为 null，则 optional.isPresent() 为 false。
// 如果 value 不为 null，则 optional 包含该值。

```

```java
String value = "hello world";
Optional<Object> optional = Optional.ofNullable(value);
System.out.println(optional.isPresent());
// 输出 true
System.out.println(optional.get());
// 输出 hello world
```

#  2、.orElse
+ **功能**：如果 Optional 中有值，返回该值；如果为空，返回一个默认值。
+ **用法**：用来提供一个非 null 的默认值。

**示例**：

```java
String value = null;
String result = Optional.ofNullable(value).orElse("Default Value");

// result 的值为 "Default Value"，因为 value 为 null。

```

如果值不为 null：

```java
String value = "Actual Value";
String result = Optional.ofNullable(value).orElse("Default Value");

// result 的值为 "Actual Value"。

```

#  3、.ifPresent
+ **功能**：如果 Optional 中有值，就执行指定的操作；如果为空，则不做任何事情。
+ **用法**：常用于执行一些依赖于非空值的逻辑，而不需要手动进行 null 检查。

**示例**：

```java
String value = "Hello, World!";
Optional.ofNullable(value).ifPresent(System.out::println);

// 输出：Hello, World!

// 如果 value 为 null，什么都不会发生。

```

# 4、综合示例
以下是一个综合示例，展示如何结合 ofNullable、orElse 和 ifPresent 的使用：

```java
public class OptionalExample {
    public static void main(String[] args) {
        String value = null;

        // 使用 ofNullable 包装可能为 null 的值
        Optional<String> optional = Optional.ofNullable(value);

        // 使用 orElse 提供默认值
        String result = optional.orElse("Default Value");
        System.out.println("Result: " + result); // 输出：Result: Default Value

        // 修改 value 为非空
        value = "Actual Value";

        // 再次包装，使用 ifPresent
        Optional.ofNullable(value).ifPresent(val -> System.out.println("Value is present: " + val));
        // 输出：Value is present: Actual Value
    }
}

```

# 5、其他常见方法
## (1)orElseGet
+ 提供一个 Supplier，只有在值为空时才会调用该 Supplier 来生成默认值。

```java
String result = Optional.ofNullable(value).orElseGet(() -> "Generated Default Value");
```

## (2)orElseThrow
+ 如果值为空，则抛出指定异常。

```java
String result = Optional.ofNullable(value).orElseThrow(() -> new IllegalArgumentException("Value must not be null"));
```

## (3)map 和 flatMap
+ 用于对 Optional 中的值进行转换或进一步操作。

```java
Optional<Integer> optionalLength = Optional.ofNullable("Hello").map(String::length);
optionalLength.ifPresent(System.out::println); // 输出：5
```

---

