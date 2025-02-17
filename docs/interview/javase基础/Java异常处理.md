## 1、Java 中异常分为哪些种类

Java 中的异常体系结构主要围绕 Throwable 这一根基类展开，其中最核心的两大分支分别为 **Error** 和 **Exception**。

### 1. Throwable

Throwable 是 Java 异常体系的根类，所有可以被抛出的对象都必须继承自这个类。它定义了获取错误信息、栈追踪等基本方法。

### 2. Error

**Error** 类代表严重的错误，一般由 JVM 抛出，表示系统级的问题或资源耗尽等情况。

- 通常不建议在应用程序中捕获或处理 Error，因为它们表示的往往是无法恢复的错误（如 OutOfMemoryError、StackOverflowError）。
- 捕获 Error 可能会使程序处于不稳定状态。

### 3. Exception

Exception 是应用程序中常见的异常类别，用于表示程序中出现的问题。这一类又可以细分为两大类：

#### 1、检查型异常（Checked Exception）

- 必须在编译时显式地进行捕获或声明抛出，否则编译器将报错。
- 主要用于描述那些外部环境引起的、可以预见并合理处理的异常，如文件 I/O、数据库操作异常等（例如 IOException、SQLException）。

**示例代码**：

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class CheckedExceptionDemo {
    public static void main(String[] args) {
        try {
            readFile("data.txt");
        } catch (IOException e) {
            System.out.println("捕获到检查型异常：" + e.getMessage());
        }
    }

    // 声明抛出 IOException，必须在方法签名中体现
    public static void readFile(String fileName) throws IOException {
        try (BufferedReader reader = new BufferedReader(new FileReader(fileName))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        }
    }
}

```



#### 2、 运行时异常（Unchecked Exception）

- 继承自 RuntimeException，编译器不要求必须捕获或声明抛出。
- 通常由程序逻辑错误引起，如空指针引用、数组下标越界等（例如 NullPointerException、ArrayIndexOutOfBoundsException）。
- 虽然可以捕获，但最好通过编写健壮的代码来避免这些异常的出现。

**示例代码**：

```java
public class UncheckedExceptionDemo {
    public static void main(String[] args) {
        try {
            String str = null;
            // 访问空对象的属性会引发 NullPointerException
            System.out.println("字符串长度：" + str.length());
        } catch (NullPointerException e) {
            System.out.println("捕获到运行时异常：" + e.getMessage());
        }
    }
}
```



## 2、error 和 exception 的区别

Error 类和 Exception 类的父类都是 **Throwable** 类，他们的区别如下

### 1. Error

**Error** 用于表示严重的、通常无法恢复的系统级错误或虚拟机错误。例如：OutOfMemoryError、StackOverflowError 等。

**特点**：

**1、不建议捕获**：通常不在应用程序中捕获或处理 Error，因为它们代表了底层系统的问题，程序无法合理恢复。

**2、系统级问题**：错误往往是由 JVM 自身或硬件故障引起，程序员通常无能为力。

### 2. Exception

**Exception** 用于表示程序中可能发生的异常情况，通常是由程序逻辑错误或外部因素（如 I/O 操作失败）引起的。
Exception 又分为：

**1、检查型异常（Checked Exception）**：必须在编译时处理或声明抛出，例如 IOException、SQLException。

**2、运行时异常（Unchecked Exception）**：继承自 RuntimeException，不要求强制捕获或声明，如 NullPointerException、ArrayIndexOutOfBoundsException。

**特点**：

**1、可以捕获并处理**：通过 try-catch 块捕获后，程序可以根据具体情况进行恢复或提示用户。

**2、预期问题**：通常用于表示业务逻辑中可预见的异常情况，程序员可以提前设计相应的处理逻辑。



## 3、调用下面的方法，得到的返回值是什么

```java
public int getNum(){
  try {
  	int a = 1/0;
  	return 1;
  } catch (Exception e) {
  	return 2;
  }finally{
  	return 3;
}
```

代码在走到第 3 行的时候遇到了一个 MathException，这时第四行的代码就不会执行了，代码直接跳转到 catch语句中。

走到第 6 行的时候，异常机制有这么一个原则如果在 catch 中遇到了 return 或者异常等能使该函数终止的话那么有 finally 就必须先执行完 finally 代码块里面的代码然后再返回值。因此代码又跳到第 8 行。

可惜第 8 行是一个return 语句，那么这个时候方法就结束了，因此第 6 行的返回结果就无法被真正返回。

如果 finally 仅仅是处理了一个释放资源的操作，那么该道题最终返回的结果就是 2。因此上面返回值是 3。

## 4、介绍Java 异常处理机制

Java 对异常进行了分类，不同类型的异常分别用不同的 Java 类表示，所有异常的根类为 java.lang.Throwable。

Throwable 下面又派生了两个子类：Error 和 Exception。

Error 表示应用程序本身无法克服和恢复的一种严重问题。

Exception 表示程序还能够克服和恢复的问题，其中又分为系统异常和普通异常：系统异常是软件本身缺陷所导致的问题，也就是软件开发人员考虑不周所导致的问题，软件使用者无法克服和恢复这种问题，但在这种问题下还可以让软件系统继续运行或者让软件死掉，例如，数组脚本越界（ArrayIndexOutOfBoundsException），空指针异常（NullPointerException）、类转换异常（ClassCastException）；普通异常是运行环境的变化或异常所导致的问题，是用户能够克服的问题，例如，网络断线，硬盘空间不够，发生这样的异常后，程序不应该死掉。

java 为系统异常和普通异常提供了不同的解决方案，编译器强制普通异常必须 try..catch 处理或用 throws 声明继续抛给上层调用方法处理，所以普通异常也称为 checked 异常，而系统异常可以处理也可以不处理，所以，编译器不强制用 try..catch 处理或用 throws 声明，所以系统异常也称为 unchecked 异常。

## 5、请写出你最常见的 5 个 RuntimeException

下面列举几个常见的 RuntimeException。

1、java.lang.NullPointerException 空指针异常；出现原因：调用了未经初始化的对象或者是不存在的对象。

2、java.lang.ClassNotFoundException 指定的类找不到；出现原因：类的名称和路径加载错误；通常都是程序试图通过字符串来加载某个类时可能引发异常。

3、java.lang.NumberFormatException 字符串转换为数字异常；出现原因：字符型数据中包含非数字型字符。

4、java.lang.IndexOutOfBoundsException 数组角标越界异常，常见于操作数组对象时发生。

5、java.lang.IllegalArgumentException 方法传递参数错误。

6、java.lang.ClassCastException 数据类型转换异常。

7、java.lang.NoClassDefFoundException 未找到类定义错误。

8、SQLException SQL 异常，常见于操作数据库时的 SQL 语句错误。

9、java.lang.InstantiationException 实例化异常。

10、java.lang.NoSuchMethodException 方法不存在异常

## 6、throw 和 throws 的区别

**throw：**

1、throw 语句用在方法体内，表示抛出异常，由方法体内的语句处理。

2、throw 是具体向外抛出异常的动作，所以它抛出的是一个异常实例，执行 throw 一定是抛出了某种异常。

**throws**：

1、throws 语句是用在方法声明后面，表示如果抛出异常，由该方法的调用者来进行异常的处理。

2、throws 主要是声明这个方法会抛出某种类型的异常，让它的使用者要知道需要捕获的异常的类型。

3、throws 表示出现异常的一种可能性，并不一定会发生这种异常

## 7、final、finally、finalize 的区别

**1、final**：用于声明属性，方法和类，分别表示属性不可变，方法不可覆盖，被其修饰的类不可继承。

**2、finally**：异常处理语句结构的一部分，表示总是执行。

**3、finalize**：Object 类的一个方法，在垃圾回收器执行的时候会调用被回收对象的此方法，可以覆盖此方法提供垃圾收集时的其他资源回收，例如关闭文件等。该方法更像是一个对象生命周期的临终方法，当该方法被系统调用则代表该对象即将“死亡”，但是需要注意的是，我们主动行为上去调用该方法并不会导致该对象“死亡”，这是一个被动的方法（其实就是回调方法），不需要我们调用。

## 8、如何设计一个自定义异常类？请说明其设计原则和使用场景。

**1、设计原则**

**（1）继承选择**：根据业务需要决定是继承自 Exception（检查型异常）还是 RuntimeException（运行时异常）。

**（2）构造方法**：建议提供至少两个构造方法，一个只接收异常消息，一个同时接收异常消息和异常原因（用于异常链）。

**（3）序列化**：若异常需要跨 JVM 传递，建议实现序列化接口（通常由 Exception 自身实现）。

**2、使用场景**

（1）当业务逻辑中出现特定的错误场景，且需要明确提示调用者时，可以使用自定义异常。

（2）可以利用异常链技术，将底层异常信息包装到自定义异常中。

示例代码：

```java
/**
 * 自定义检查型异常类，用于表示数据处理过程中的错误。
 */
class CustomCheckedException extends Exception {

    /**
     * 构造方法，传入异常消息。
     *
     * @param message 异常消息
     */
    public CustomCheckedException(String message) {
        super(message);
    }

    /**
     * 构造方法，传入异常消息和异常原因，用于异常链。
     *
     * @param message 异常消息
     * @param cause   异常原因
     */
    public CustomCheckedException(String message, Throwable cause) {
        super(message, cause);
    }
}
```



## 9、多重捕获与异常链（Multi-catch & Exception Chaining）

**1、多重捕获（Multi-catch）**

允许在一个 catch 块中捕获多个异常，例如：

```java
try {
    // 可能抛出 IOException 或 SQLException 的代码
} catch (IOException | SQLException e) {
    // 统一处理这两类异常
}
```

优点在于减少重复代码，但需要注意捕获的异常类型不应有父子关系，否则编译器会报错。

**2、异常链（Exception Chaining）**

当捕获到一个异常后，如果需要抛出另一个异常来更清晰地描述错误原因，可以使用异常链，将原始异常作为新异常的原因传递：

```java
try {
    // 可能抛出异常的代码
} catch (IOException e) {
    throw new CustomCheckedException("数据读取失败", e);
}
```

这样做可以保留原始异常的信息，方便调试和问题定位。

## 10、try-with-resources 语句的工作原理及其优势

**1、工作原理**

（1）在 try 语句中声明的资源必须实现 AutoCloseable 接口。

（2）当 try 块执行完毕后，资源会自动调用 close() 方法，无需在 finally 块中手动释放资源。

**2、优势**

**代码简洁**：无需显式写出 finally 块来释放资源。

**减少错误**：自动管理资源，降低因忘记释放资源导致的内存泄漏风险。

**3、代码示例**

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class TryWithResourcesExample {
    public static void main(String[] args) {
        // 使用 try-with-resources 自动关闭资源
        try (BufferedReader br = new BufferedReader(new FileReader("test.txt"))) {
            String line;
            // 逐行读取文件内容并输出
            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            // 处理可能的异常（如文件不存在）
            System.err.println("读取文件时出错: " + e.getMessage());
        }
    }
}
```

**关键点说明：**

**（1）自动资源管理**：BufferedReader 和 FileReader 在 try 后的括号内声明，实现了 AutoCloseable 接口，退出 try 块时会**自动关闭**，无需手动调用 close()。

**（2）处理多个资源**：可以同时管理多个资源，用分号分隔

```java
try (Resource1 r1 = new Resource1(); Resource2 r2 = new Resource2()) {
    // 使用 r1 和 r2
}
```

**（3）异常处理**：

- 如果 try 块和资源关闭都抛出异常，优先保留 try 块的异常，资源关闭的异常通过 addSuppressed 附加。

- 通过 catch 块统一处理所有可能的 IOException。

**4、对比传统方式（Java 7 前）：**

```java
// 需要手动关闭资源
BufferedReader br = null;
try {
    br = new BufferedReader(new FileReader("test.txt"));
    // 读取文件...
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (br != null) {
        try {
            br.close(); // 需要额外的 try-catch
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

**优势**：try-with-resources 代码更简洁，且能避免资源泄漏。

## 11、异常处理的最佳实践与性能影响

**1、最佳实践**

**（1）不要滥用异常**：异常应当用于处理真正的异常情况，而非作为业务逻辑控制手段。

**（2）捕获具体异常**：尽可能捕获特定异常，避免使用 catch(Exception e) 泛捕所有异常。

**（3）保留异常信息**：在捕获异常时应记录日志或重新抛出异常，防止信息丢失。

**（4）合理使用自定义异常**：在业务逻辑中遇到特殊情况时，使用自定义异常更能表达问题的语义。

**（5）利用 try-with-resources**：自动管理资源，避免冗长的 finally 块。

**2、性能影响**

（1）异常的抛出和捕获会带来一定的性能开销，因此应当避免在正常流程中频繁抛出异常。

（2）建议通过预判条件来避免异常的发生，而不是依赖异常机制来控制业务逻辑。
