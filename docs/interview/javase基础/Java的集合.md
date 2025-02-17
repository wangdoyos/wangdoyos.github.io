## 1、ArrayList 内部用什么实现的

### 1. 内部数据结构

**（1）底层实现**：Object[] elementData 数组。

**（2）默认容量**：初始容量为 10（首次添加元素时初始化）。

**（3）扩容机制**：当数组容量不足时，按当前容量的 **1.5 倍** 扩容（int newCapacity = oldCapacity + (oldCapacity >> 1)）。

### 2. 核心方法实现原理

**（1）add(E e) 方法**

流程：

1. 检查是否需要扩容：若当前元素数量 size ≥ 数组长度 elementData.length，触发扩容。
2. 扩容：创建新数组（大小为原容量的 1.5 倍），通过 Arrays.copyOf 复制旧数组到新数组。
3. 将新元素插入数组末尾：elementData[size++] = e。

时间复杂度：

- 平均 O(1)（均摊时间复杂度，扩容操作分摊到多次插入中）。

- 最坏 O(n)（触发扩容时需要复制整个数组）。

**（2）add(int index, E element) 方法（指定位置插入）**

流程：

1. 检查索引是否越界。
2. 检查是否需要扩容。
3. 将 index 之后的元素整体右移一位：System.arraycopy(elementData, index, elementData, index + 1, size - index)。
4. 插入新元素：elementData[index] = element。

时间复杂度**：**O(n)（移动元素的开销与插入位置后的元素数量成正比）。

**（3）remove(int index) 方法**

流程：

1. 检查索引是否越界。
2. 获取被删除元素：E oldValue = elementData[index]。
3. 将 index 之后的元素整体左移一位：System.arraycopy(elementData, index + 1, elementData, index, size - index - 1)。
4. 清空末尾引用（避免内存泄漏）：elementData[--size] = null。

时间复杂度**：**O(n)（移动元素的开销与删除位置后的元素数量成正比）。

**（4）clear() 方法**

流程：

1. 遍历数组，将所有元素置为 null（帮助 GC 回收对象）。
2. 重置 size 为 0：size = 0。

**注意**：数组容量 elementData.length 不变，仅清空引用。

时间复杂度**：**O(n)（需遍历数组置空引用）。

### 3. 性能特点

优点：

- **随机访问高效**：通过索引直接访问数组，时间复杂度 **O(1)**。
- **尾部插入高效**：均摊时间复杂度 **O(1)**。

缺点：

- **插入/删除中间元素慢**：需移动大量元素（时间复杂度 **O(n)**）。
- **内存连续分配**：扩容时可能产生内存碎片。

### 4. 使用场景建议

- **适合**：频繁随机访问、尾部插入/删除。
- **不适合**：频繁在中间位置插入/删除（可改用 LinkedList）。

如果需要线程安全，可使用 CopyOnWriteArrayList 或用 Collections.synchronizedList 包装。