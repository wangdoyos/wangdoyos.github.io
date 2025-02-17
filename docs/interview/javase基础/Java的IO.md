## 1、Java 中有几种类型的流

Java中的流按不同维度分为：

**1、按流向**：输入流（InputStream、Reader）和输出流（OutputStream、Writer）。

**2、按数据类型**：

**（1）字节流**：以字节（8位）为单位操作，基类为 InputStream 和 OutputStream，用于处理二进制数据（如图片、视频）。

**（2）字符流**：以字符（按编码，如UTF-16）为单位，基类为 Reader 和 Writer，适合处理文本数据，自动处理编码转换，提高效率。

**3、按功能**：节点流（直接操作数据源，如 FileInputStream）、处理流（对现有流封装，如缓冲流 BufferedReader）。

## 2、字节流如何转为字符流

通过 **适配器类** InputStreamReader 和 OutputStreamWriter 实现：

字节转字符输入流

```java
InputStream is = new FileInputStream("file.txt");
Reader reader = new InputStreamReader(is, StandardCharsets.UTF_8); // 指定编码
```

字节转字符输出流

```java
OutputStream os = new FileOutputStream("file.txt");
Writer writer = new OutputStreamWriter(os, StandardCharsets.UTF_8);
```

## 3、如何将一个 java 对象序列化到文件里

步骤：

1、对象类实现 Serializable 接口（标记接口，无需实现方法）。

2、使用ObjectOutputStream写入文件：

```java
try (FileOutputStream fos = new FileOutputStream("object.dat");
     ObjectOutputStream oos = new ObjectOutputStream(fos)) {
    oos.writeObject(yourObject);
}
```

注意：

1、不可序列化的字段需用 transient 修饰。

2、序列化对象的所有成员必须可序列化或标记为 transient。

## 4、字节流和字符流的区别

| **维度**     | 字节流（InputStream/OutputStream） | 字符流（Reader/Writer）            |
| ------------ | ---------------------------------- | ---------------------------------- |
| 数据单位     | 8位字节，处理二进制数据            | 16位字符（按编码），处理文本更高效 |
| 自动编码处理 | 无                                 | 是（需指定字符集如UTF-8）          |
| 典型用途     | 图片、音频、视频等非文本文件       | 文本文件（如TXT、XML、JSON）       |
| 缓冲与性能   | 处理二进制时不建议缓冲             | 通常包装缓冲流（如BufferedReader） |

## 5、如何实现对象克隆

浅拷贝：

1、实现 Cloneable 接口。

2、重写clone()方法（调用super.clone()）：

```java
public class MyClass implements Cloneable {
    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone(); // 默认浅拷贝
    }
}
```

深拷贝：

**（1）手动复制**：逐一复制对象内的引用类型字段。

（2）序列化：通过ObjectOutputStream和ObjectInputStream深克隆对象：

```java
ByteArrayOutputStream bos = new ByteArrayOutputStream();
ObjectOutputStream oos = new ObjectOutputStream(bos);
oos.writeObject(original);
ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray());
ObjectInputStream ois = new ObjectInputStream(bis);
MyClass cloned = (MyClass) ois.readObject();
```

## 6、什么是 java 序列化，如何实现 java 序列化

- **定义**：将对象转换为字节流，以便存储（文件）或传输（网络），反序列化则是将字节流转回对象。

- 实现：

  1、类实现 Serializable 接口。

  2、可选定义 private static final long serialVersionUID 控制版本兼容性。

  3、使用 ObjectOutputStream.writeObject() 序列化，ObjectInputStream.readObject() 反序列化。