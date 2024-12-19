## 1 起步
1. python是一种跨平台的编程语言，这意味着它能够运行在所有主要的操作系统中，。在所有安装了python的现代计算机上，都能够运行你编写的任何python程序。

## 2 变量和简单数据类型
### 2.1 运行python
1. 运行hellow_world.py时，末尾的.py指出这是一个python程序，因此编辑器将使用python解释器来运行它。Python解释器读取整个程序，确定其中每个单词的含义。

### 2.2 变量
1. 在程序中可以随时修改变量的值，而python将始终记录变量的最新值。
2. 变量的命名和使用规则：

（1）变量名只能包含字母、数字和下划线。变量名可以字母或下划线打头，但不能以数字打头。

（2）变量名不能包含空格，但是可以使用下划线来分隔其中的单词。

（3）不要将python关键字和函数名用作变量名，即不要使用python保留用于特殊用途的单词。

（4）变量名应既简短又具有描述性。

（5）慎用小写字母l和大写字母O，因为容易和1、0混淆。

（6）就目前而言，建议使用小写的变量名。

（7）Python声明变量不需要指定类型。

### 2.3 字符串
1. 字符串就是一系列字符。在python中，用引号括起来的都是字符串，其中引号可以是单引号也可以是双引号。如：”this is a string.” ‘this is also a string’
2. title()方法以首字母大写的方式显示每个单词，即将每个单词的首字母都改为大写：

```python
name=”ada loveglj”
Print(name.title())
```

将输出：

```python
Ada Loveglj
```

3. 要将字符串改为全部大写或全部小写：

```python
name=”Ada Loveglj”
print(name.upper())
print(name.lower())
```

 输出结果：

```python
ADA LOVEGLJ
Ada loveglj
```

4. python使用+来合并字符串。如：

```python
first_name=”ada”
last_name=”loveglj”
full_name=first_name+” “+last_name
```

5. 在编程中，空白泛指任何非打印字符，如空格、制表符和换行符。要在字符串中添加制表符，可以使用\t，如print(“\tpython”)，则python会缩进，前面会有空白。如果要在字符串中添加换行符，可以使用\n，还可以在同一个字符串中同时包含制表符和换行符。字符串”\n\t”让python换到下一行并在下一行开头添加制表符。
6. python能够找出字符串开头和末尾多余的空白。
7. rstrip()去掉字符串末尾空白 name.rstrip()
8. lstrip()去掉字符串开头空白  name.lstrip()
9. strip()去掉字符串两端空白  name.strip()
10. 如果需要永久删除这个字符串的空白，上述三种方法去掉空白后的结果需要重新赋值给该变量。

### 2.4 数字
1. 在python中，可对整数执行加减乘除运算，并总能得到正常的答案。

```python
2+3=5; 
3-2=1;
2*3=6;
3/2=1.5;
3**2=9;(乘方运算)
```

2. str(e)可以让python将任何非字符串值表示为字符串：

```python
age=23
message=”happay”+str(age)+”birthday”
```

## 3.列表简介
### 3.1 列表是什么
1. 列表由一系列按特定顺序排列的元素组成。鉴于列表通常包含多个元素，给列表指定一个表示复数的名称比较好。在Python中，用方括号[]表示列表，如：

```python
bicycles = [‘trek’,’cannondale’,’redine’,’specializzed’]
print(bicycles)
```



2. 列表是有序集合，所以要访问列表的任何元素，可以根据索引访问，在Python中，索引从0开始而不是1。如：print(bicycles[0])
3. 通过将索引指定为-1可以访问最后一个列表元素，-2访问倒数第二个列表元素，以此类推。

### 3.2 修改、添加和删除元素
1. 要修改列表元素，可以指定列表名和要修改元素的索引，再指定该元素的新值：

```python
ages = [‘1’,’2’,’3’]
ages[0] = ‘4’
```

2. 在列表中添加元素：

```python
#将元素附加到末尾：
ages.append(‘5’)
#在列表索引为0的位置加一条值为6的元素
age.insert(0,’6’)
```

3. 从列表中删除元素

```python
#已知要删除元素在列表中的位置，可使用del语句
#删除索引为0的元素
del ages[0]
#方法pop()可以删除列表末尾的元素并仍然可以访问它
del_age = ages.pop()
#age列表中最后一个元素已删除
#del_age仍可被访问，值为ages列表最后一个元素
```

4. 弹出列表中任何位置的元素

```python
#pop()方法在括号里指定要删除元素的索引，即可删除指定位置的元素
ages.pop(0)
```

5. 根据值删除元素

```python
#使用remove()方法可以删除指定值的元素，只能删除一个值，
#如果有多个重复的值，需要循环判断是否删除了所有重复值
ages.remove(‘1’)
```

### 3.3 组织列表
1. 使用sort()对列表进行永久性排序

```python
cars = [‘bmw’,’audi’,’subaru’]
cars.sort()
#列表变为cars = [‘audi’,bmw’,’subaru’]
#永久改变列表顺序，按首字母升序顺序排列
#使用sort()方法传递参数reverse=True可以将列表按首字母倒序排列
cars.sort(reverse=True)
#列表变为cars = [’subaru’,bmw’,audi’]
```

2. 使用sorted()对列表进行临时排序

```python
temp = sorted(cars)
#temp为[‘audi’,bmw’,’subaru’]
#列表变为cars = [‘bmw’,’audi’,’subaru’]
temp = sorted(cars,reverse=True)
#temp为['subaru', 'bmw', 'audi']
```

3. 倒序排列

```python
cars.reverse()
#列表变为cars = [‘’subaru’,’audi’,'bmw']
```

4. 确定列表长度

```python
len(cars)
#结果为3
```

## 4.操作列表
### 4.1 遍历整个列表
1. for循环遍历列表

```python
names = [‘tom’,’lili’,’wz’]
for name in names:
    print(name)
#循环体内的语句要缩进，不缩进的语句在循环体外
```

### 4.3 创建数值列表
1. 使用函数range()可以生成一系列的数字

```python
for value in range(1,5):
    print(value)
#输出1 2 3 4
```

2. 使用range()创建数字列表

```python
#要创建数字列表可使用list()将range()的结果直接转换为列表
numbers = list(range(1,6))
print(numbers)
#结果为[1,2,3,4,5]
```

3. 使用range()时，可以指定步长，如打印1~10内的偶数

```python
even_numbers = list(range(2,11,2))
print(even_numbers)
#结果为[2,4,6,8,10]
```

4. 使用range()创建一个列表，包含1~10的平方

```python
#在python中，两个*号（**）表示平方
squares = []
for value in range(1,11):
    squares.append(value**2)
print(squares)
#结果为：[1,4,9,16,25,36,49,64,81,100]
```

5. 对数字列表进行简单的统计计算：

```python
digits = [1,2,3,4,5,6,7,8,9,0]
# 找出最大值
max(digits)
# 找出最小值
min(digits)
# 求和
sum(digits)
# 列表解析将for循环和创建新元素的代码合并成一行，并自动附加新元素，如：
#创建1~10的平方列表
squares = [value**2 for value in range(1,11)]
print(squares)
#注意：这里的for循环后面没有 冒号
```

### 4.4 使用列表的一部分
1. 切片——列表的部分元素

```python
#要创建切片，可指定要使用的第一个元素和最后一个元素的索引
#与range()一样，在到达指定的第二个索引前面的元素后停止
#打印索引0~2的三个元素
names = [‘tom’,’jack’,’lili’,’lihua’]
print(names[0:3])
#结果是： [‘tom’,’jack’,’lili’]
```

2. 如果没有指定第一个索引，python将自动从列表开头开始：

```python
names = [‘tom’,’jack’,’lili’,’lihua’]
print(names[:3])
#结果是： [‘tom’,’jack’,’lili’]
```

3. 省略终止索引，将自动提取起始位置索引到末尾的元素：

```python
names = [‘tom’,’jack’,’lili’,’lihua’]
print(names[2:])
#结果是： [‘lili’,’lihua’]
```

4. 负数索引将返回距离列表末尾相应距离的元素：

```python
#输出最后两个元素
names = [‘tom’,’jack’,’lili’,’lihua’]
print(names[-2:])
#结果是： [‘lili’,’lihua’]
```

5. 遍历切片：

```python
#遍历前三个名字
names = [‘tom’,’jack’,’lili’,’lihua’]
for name in names[:3]:
    print(name.title())
#结果是：
Tom
Jack
Lili
```

5. 复制列表：

```python
#要复制列表，可以创建一个包含整个列表的切片
#同时省略起始索引和终止索引
names = [‘tom’,’jack’,’lili’,’lihua’]
names_copy = names[:]
print(names)
print(names_copy)
#结果是：
 [‘tom’,’jack’,’lili’,’lihua’]
 [‘tom’,’jack’,’lili’,’lihua’]
#注意：不能通过names_copy = names来复制列表，这样相当于让python新变量names_copy也指向names列表，两个变量指向同一个列表，改一个列表中的元素之后，分别输出两个变量的结果都是更改之后的新列表。
```

### 4.5 元组
1. 元组就是不能修改的列表
2. 定义元组：

```python
#元组看起来类似列表，但使用圆括号而不是方括号来表示。
#定义元组后就可以使用索引来访问其元素
dimensions = (200,50)
print(dimensions[0])
```

3. 遍历元组中的所有值

```python
for dimension in dimensions:
    print(dimension)
```

4. 修改元组变量

```python
#元组的元素不可修改，但是可以给存储元组的变量重新赋值
dimensions = (200,50)
dimensions = (400,100)
for dimension in dimensions:
    print(dimensions)
#结果是:
400
100
```

## 5 if语句
### 5.1 简单实例
1. 对汽车名’bmw’以全大写的方式打印，其他名字以首字母大写方式打印：

```python
cars = [‘audi’,’bmw’,’subaru’,’toyota’]
for car in cars:
    if car == ‘bmw’:
    print(carr.upper())
    else:
    print(car.title())
#结果是：
Audi
BMW
Subaru
Toyota
```

### 5.2 条件测试
1. 每条if语句的核心都是一个值为True或False的表达式，这种表达式被称为条件测试。
2. python检查是否相等时区分大小写，两个大小写不同的值会被视为不相等，如果用于不需要区分大小写的情况，可以先把值都转换为小写，在进行比较：

```python
car == ‘Audi’
print(car.lower() == ‘audi’)
#结果是：True
#lower()方法不改变存储在car变量中的值
print(car)
#结果是：Audi
```

3. 判断是否不相等：

```python
car = ‘Audi’
if car != ‘Audi’:
print(“no”)
else:
print(“yes”)
#结果是：yes
```

4. 检查多个条件(and)

```python
#要检查是否多个条件都为True,可使用关键字and将两个条件测试合二为一
#如果每个条件都通过了，整个表达式就为True，如果至少有一个没通过，	则为False
age_0 = 22
age_1 = 18
print(age_0 > 18 and age_1>18)
#结果是：False
```

5. 检查多个条件(or)

```python
#关键字or也能检查多个条件
#至少有一个条件满足，整个表达式就返回True,当全部条件都没通过，为False
print(age_0 > 18 and age_1>18)
#结果为：True
```

6. 检查特定值是否包含在列表中

```python
cars = [‘audi’,’bmw’,’subaru’,’toyota’]
if ‘audi’ in cars:
print(“True”)
else:
print(“False”)
```

7. 检查特定值是否不包含在列表中

```python
cars = [‘audi’,’bmw’,’subaru’,’toyota’]
car = ‘hk’
if car not in cars:
print(“true”)
else:
print(“false”)
#结果为：true	
```

8. if语句：

```python
age = 18
if age>18:
print(“age>18”)
```

9. if-else语句：

```python
age = 18
if age>18:
print(“age>18”)
else:
print(“age<=18”)
```

10. if-elif-else结构：

```python
age = 18
if age>18:
print(“age>18”)
elif age=18:
print(“age=18”)
else:
print(“age<18”)
```

11. 使用多个elif代码块：

```python
age = 18
if age>18:
print(“age>18”)
elif age=18:
print(“age=18”)
elif age=17:
print(“age=17”)
elif age=16:
print(“age=16”)
else:
print(“age<16”)
```

12. 省略else代码块：

```python
age = 18
if age>18:
print(“age>18”)
elif age=18:
print(“age=18”)
elif age=17:
print(“age=17”)
elif age=16:
print(“age=16”)
```

13. if-elif-else结构功能强大，但仅适用于只有一个条件满足的情况：遇到通过了的测试后，就跳过余下的测试。
14. 如果想要只执行一个代码块，就用if-elif-else结构，如果运行多个代码块，就使用一系列独立的if语句。

### 5.3 使用if语句处理列表
1. 使用for循环中包含if语句可以实现对列表中特殊的元素进行特殊处理

```python
cars = [‘audi’,’bmw’,’subaru’,’toyota’]
for car in cars:
if car == ‘bmw’:
print(carr.upper())
else:
print(car.title())
#结果是：
Audi
BMW
Subaru
Toyota
```

2. 判断列表是不是为空：

```python
#在if语句中将列表名用在条件表达式中时，将在列表至少包含一个元素时	返回True，并在列表为空时返回False
cars = []
if cars:
for car in cars:
    print(car)
else:
print(“it is null”)
```

3. 使用多个列表：

```python
mycars = [‘audi’,’bmw’,’subaru’,’toyota’]
friendcars = [‘audi’,’bmw’,’hk’,’hongqi’]
for mycar in mycars:
    if mycar in friendcars:
    print(“this car ”+mycar+” my friend have one,too”)
    elif mycar not in friendcars:
    print(“this car ”+mycar+” myfriend does not have ,but i have one”)
#结果是：
this car audi my friend have one,too
this car bmw my friend have one,too
this car subaru myfriend does not have ,but i have one
this car toyota myfriend does not have ,but i have one
```

## 6 字典
### 6.1 使用字典
1. 在python中，字典是一系列键-值对。每个键都与一个值相关联，你可以使用键来访问与之相关联的值。与键相关联的值可以是数字、字符串、列表乃至字典。在python中，字典用放在花括号{}中的一系列键值对表示。
2. 访问字典中的值：

```python
alien = {‘color’:’green’,’point’:5}
print(alien[‘color’])
print(alien[‘point’])
#结果是：
green
5
```

3. 添加键-值对：

```python
#字典是一种动态结构，可随时在其中添加键-值对
alien = {‘color’:’green’,’point’:5}
print(alien)
alien[‘x_position’] = 0
alien[‘y_position’] = 25
print(alien)
#结果是：
{‘color’:’green’,’point’:5}
{‘color’:’green’,’point’:5,‘y_position’:25,‘x_position’:0}
#注意：键值对的排列顺序与添加顺序不同，python不关心键值对的添加顺序，只关心键和值之间的关联关系
```

4. 修改字典中的值：

```python
alien = {‘color’:’green’,’point’:5}
print(alien)
alien[‘color’] = ‘yellow’
print(alien)
#结果是：
{'color': 'green', 'point': 5}
{'color': 'yellow', 'point': 5}
```

5. 删除键值对

```python
#对于字典中不再需要的信息，可以用del语句将对应的键值对彻底删除
#使用del语句时必须指定字典名和要删除的键
alien = {‘color’:’green’,’point’:5}
print(alien)
del alien[‘color’]
print(alien)
#结果是：
{'color': 'green', 'point': 5}
{'point': 5}
```

6. 由类似对象组成的字典

```python
#调查每个人最喜欢的编程语言
favorite_languages = {
‘jen’:’python’,
‘sarah’:’c’,
‘edward’:’ruby’,
‘phil’:’pyton’
}
```

### 6.2 遍历字典
1. 字典可用于以各种方式存储信息，因此遍历字典有多种形式：可遍历字典的所有键-值对、键或值
2. 遍历所有的键值对：

```python
user = {
‘username’:’wangzhe’,
‘firstname’:’zhe’,
‘lastname’:’wang’
}
#声明两个变量用于存储键值对中的键和值，这两个变量可以用任何名称
#此处用key和value
#方法items()返回一个键值对列表
for key,value in user.items():
    print(“\nkey:”+key)
    print(“value:”+value)
#结果是：
key:lastname
value:wang
key:firstname
value:zhe
key:username
value:wangzhe
#注意：即便遍历字典时，键值对的顺序也与存储顺序不同。python不关心键值对的存储顺序，只关心键和值的关联关系。
```

3. 遍历字典中的所有键：

```python
#方法keys()可以返回键的列表
user = {
‘username’:’wangzhe’,
‘firstname’:’zhe’,
‘lastname’:’wang’
}
for name in user.keys():
    print(name.title)
#结果是
Username
Firstname
Lastname
#注意：遍历字典时会默认遍历所有的键，因此，如果将keys()方法省略，输	出将不变
#想要按字母排列顺序遍历所有的键，可以改成for name in sorted(user.keys()):	这让python列出字典中的所有键，并在遍历前对这个列表进行排序。
```

4. 遍历字典中的所有值：

```python
#values()方法返回一个值列表
user = {
‘username’:’wangzhe’,
‘firstname’:’zhe’,
‘lastname’:’wang’
}
for name in user.values():
    print(name.title)
#结果是：
wangzhe
zhe
wang
```

5. 去重遍历字典中的所有值

```python
#为去除重复值，可以使用集合(set)。集合类似于列表，但每个元素不重复
user = {
‘username’:’wangwang’,
‘firstname’:’wang’,
‘lastname’:’wang’
}
for name in set(user.values()):
    print(name.title)
#结果是：
wangwang
wang
```

### 6.3 嵌套
1. 在列表中存储字典

```python
#存储成群的外星人信息
alien_0 = {‘color’:’green’,’point’:5}
alien_1 = {‘color’:’yellow’,’point’:10}
alien_2 = {‘color’:’red’,’point’:15}
aliens = [alien_0,alien_1,alien_2]
for alien in aliens:
    print(alien)
#结果是：
{'color': 'green', 'point': 5}
{'color': 'yellow', 'point': 10}
{'color': 'red', 'point': 15}
```

2. 在字典中存储列表

```python
#统计每个人喜欢的语言，每个人可以有多个喜欢的语言
favorite_languages = {
‘jen’:[‘python’,’java’],
‘sarah’:[‘c’],
‘edward’:[‘ruby’,’go’],
‘phil’:[‘python’,’go’],
}
for name,languages in favorite_languages.items():
    print(“\n”+name.title()+”’s favorite languages are:”)
    for language in languages:
        print(“\t”+language.title())
#结果是：
Jenhas favorite languages are:
        Python
        Java

Sarahhas favorite languages are:
        C

Edwardhas favorite languages are:
        Ruby
        Go

Philhas favorite languages are:
        Python
        Go
```

3. 在字典中存储字典

```python
#存储多个用户，每个用户包含姓、名、居住地三种信息。
users = {
‘wangzhe’:{
‘firstname’:’zhe’
‘lastname’:’wang’
‘location:’fushun’
}
‘guolijiao’:{
‘firstname’:’lijiao’
‘lastname’:’guo’
‘location:’linfen’
}
}
for username,user_info in users.items():
    print(“\nusername: ”+username)
    fullname = user_info[‘firstname’]+””+user_info[‘lastname’]
    location = user_info[‘location’]
    print(“\tFull name: ”+fullname.title())
    print(“\tLocation: ”+location.title())
#结果：
username: wangzhe
        Full name: Zhe Wang
        Location: Fushun

username: guolijiao
        Full name: Lijiao Guo
        Location: Linfen
```

## 7.用户输入和while循环
### 7.1 函数input()的工作原理
1. 函数input()让程序暂停运行，等待用户输入一些文本，获取用户输入后，Python将其存储在一个变量中，以方便使用。

```python
#下面的程序让用户输入一些文本，再将这些文本呈现给用户
message = input(“Tell me something,and i will repeat it back to you”)
print(message)
#结果为：
Tell me something,and i will repeat it back to you  Hello everyone
Hello everyone
```

2. 有时候，提示可能超过一行，可以将提示存储在一个变量中，再将该变量传递给函数input()，如：

```python
prompt = “If you tell us who you are,we can personalize the message you see.”
prompt +=”\nWhat is your first name?”
name = input(prompt)
print(“\nHello,”+name+”!”)
#结果为：
If you tell us who you are,we can personalize the message you see.
What is your first name?wang

Hello,wang!
```

3. 使用int()来获取数值输入：

```python
height = input("how tall are you,in inches?  ")
height = int(height)
if height >= 36:
    print("\n you are tall enough to ride!")
else:
    print("\n you are not tall enough to ride")
#结果为：
how tall are you,in inches?  71
you are tall enough to ride!
#注意：将数值用于输入计算和比较前，务必将其转换为数值表示
```

### 7.2  while循环简介
1. 使用while循环

```python
#打印10以内奇数
current_number = 0
while current_number < 10:
    current_number += 1
    if current_number %2 ==0:
#在循环中使用continue，退出此次循环，继续下次循环
        continue
print(current_number)
#结果为：
1
3
5
7
9
```

2. 让用户选择何时退出：

```python
#定义标志，标志为True时继续运行
active = True
while active:
    age = input("how old are you?  ")
    if age == 'quit':
#如果用户输入quit，退出循环
        break
    else:
        if int(age) < 3:
            print("you are be free!")
        elif int(age) >= 3 and int(age) <= 12:
            print("you should pay 10$")
        else:
            print("you should pay 15$")
#结果为：
how old are you?  1
you are be free!
how old are you?  3
you should pay 10$
how old are you?  14
you should pay 15$
how old are you?  quit
```

### 7.3 使用while循环来处理列表和字典
1. 在列表之间移动元素：

```python
#首先，创建一个待验证用户列表
#和一个用于存储已验证用户的空列表
unconfirmed_users = ['alice','brian','candace']
confirmed_users = []
#验证每个用户，直到没有未验证用户为止
#将每个通过验证的列表都转移到已验证用户列表中
#循环不断运行，直到列表unconfirmed_users变成空的
while unconfirmed_users:
    current_user = unconfirmed_users.pop()
    print("Verifying user:"+current_user.title())
    confirmed_users.append(current_user)
#显示所有已验证的用户
print("\nThe following users have been confirmed:")
for confirmed_user in confirmed_users:
    print(confirmed_user.title())
#结果是：
Verifying user:Candace
Verifying user:Brian
Verifying user:Alice

The following users have been confirmed:
Candace
Brian
Alice
```

2. 删除包含特定值的所有列表元素

```python
#列表中包含多个值为“cat”的元素，删除所有cat元素
pets = ['dog','cat','cat','rabbit','goldfish']
print(pets)
while 'cat' in pets:
    pets.remove('cat')
print(pets)
#结果是：
['dog', 'cat', 'cat', 'rabbit', 'goldfish']
['dog', 'rabbit', 'goldfish']
```

3. 使用用户输入来填充字典：

```python
responses = {}
#设置一个标志，指出调查是否继续
polling_active = True
while polling_active:
    #提示输入被调查者的名字和回答
    name = input("\nWhat is your name?  ")
    response = input("which mountion would you like to climb someday?")
    #将答卷存储在字典中
    responses[name] = response
    #看看是否还有人要参与调查
    repeat = input("would you like to let another person respond?(yes/no)  ")
    if repeat == 'no':
        polling_active = False
#调查结束，显示结果
print("\n--------Poll Results--------")
for name,response in responses.items():
    print(name+" would like to climb "+response+".")
#结果是：
What is your name?  glj
which mountion would you like to climb someday? huashan
would you like to let another person respond?(yes/no)  yes

What is your name?  wz
which mountion would you like to climb someday? huangshan
would you like to let another person respond?(yes/no)  no

--------Poll Results--------
glj would like to climb huashan.
wz would like to climb huangshan.
```

## 8.函数
### 8.1 定义函数
1. 简单函数：

```python
#使用关键字def来定义函数
def greet_user():
#文档字符串用于描述函数是做什么的
“””显示简单的问候语”””
print(“Hello!”)
#调用函数
greet_user()
1. 向函数传递信息
def greet_user(username):
“””显示简单的问候语”””
print(“Hello!”+username.title()+”!”)
greet_user(‘jesse’)
#结果为：
Hello!Jesse!
```

实参和形参：在函数greet_user()的定义中，变量username是一个形参——函数完成其工作所需要的一项信息。

#在代码greet_user(‘jesse’)中，值’jesse’是一个实参。实参是调用函数时传递给函数的信息。我们调用函数时，将要让函数使用的信息放在括号内。在greet_user(‘jesse’)中，将实参’jesse’传递给了函greet_user()，这个值被存储在形参username中。

### 8.2 传递实参
1. 位置实参

你调用函数时，python必须将函数调用中的每个实参都关联到函数定义中的一个形参。为此，最简单的关联方式是基于实参的顺序。这种关联方式被称为位置实参，如：

```python
def describe_pet(animal_type,pet_name):
    """显示宠物信息"""
    print("\nI have a "+animal_type+".")
    print("My "+animal_type+"'s name is "+pet_name.title()+".")
describe_pet('cat', 'harry')
#结果为：
I have a cat.
My cat's name is Harry.
```

注意：使用位置实参时，要保证实参的顺序与形参的顺序一致，不然会出错。

2. 关键字实参

关键字实参是传递给函数的名称-值对，你直接在实参中将名称和值关联起来了，因此向函数传递实参时不会混淆。关键字实参让你无需考虑函数调用中的实参顺序 ，还清楚的指出了函数调用中各个值的用途。如：

```python
def describe_pet(animal_type,pet_name):
    """显示宠物信息"""
    print("\nI have a "+animal_type+".")
    print("My "+animal_type+"'s name is "+pet_name.title()+".")
describe_pet(pet_name= 'harry',animal_type='cat')
#效果跟上面相同
```

3. 默认值

编写函数时，可以给每个形参指定默认值。在调用函数中给形参提供了实参时，python将使用指定的实参值，否则，将使用形参的默认值。因此，给形参指定默认值后，可在函数调用中省略相应的实参。使用默认值可简化函数调用，还可以清楚地指出函数的典型用法。如：

```python
def describe_pet(pet_name,animal_type=’cat’):
    """显示宠物信息"""
    print("\nI have a "+animal_type+".")
    print("My "+animal_type+"'s name is "+pet_name.title()+".")
#调用时没有传递实参animal_type的值，将使用默认值cat
describe_pet(pet_name= 'harry')
#结果是：
I have a cat.
My cat's name is Harry.
```

注意：使用默认值时，在形参列表中必须先列出没有默认值的形参，在列出有默认值的形参，否则python会将没有默认值的实参视为位置实参，将按顺序与形参对应。

4. 等效的函数调用

下面对函数的所有调用都可行：

```python
#一条名为Willie的小猫
describe_pet(‘willie’)
describe_pet(pet_name=’willie’)
#一条名为Harry的小狗
describe_pet(‘harry’,’dog’)
describe_pet(pet_name=’harry’,animal_type=’dog’)
escribe_pet(pet_name=’harry’,animal_type=’dog’)
```

### 8.3 返回值
函数并非总是直接显示输出，相反，它可以处理一些数据，并返回一个或一组值。函数返回的值被称为返回值。在函数中，可使用return语句将值返回到调用函数的代码行。返回值让你能够将程序的大部分繁重工作移到函数中去完成，从而简化主程序。

1. 返回简单值：

```python
def get_formated_name(first_name,last_name):
    """返回整洁的姓名"""
full_name = first_name+' '+last_name
return full_name.title()
musician = get_formated_name('jimi', 'hendrix')
print(musician)
#结果是：
Jimi Hendrix
```

2. 让实参变成可选的:

```python
def get_formated_name(first_name,last_name,middle_name=''):
    """返回整洁的姓名"""
    if middle_name:
        full_name = first_name+' '+middle_name+' '+last_name
    else:
        full_name = first_name+' '+last_name
    return full_name.title()
musician = get_formated_name('jimi', 'hendrix')
print(musician)
musician = get_formated_name('jhon', 'horker','lee')
print(musician)
#结果是：
Jimi Hendrix
Jhon Lee Horker
```

3. 返回字典：

函数可返回任何类型的值，包括列表和字典等复杂的数据结构。例如下面的函数接受姓名的组成部分，并返回一个表示人的字典：

```python
def build_person(first_name,last_name):
    """返回一个字典，包含有关一个人的信息"""
    person = {'first':first_name,'last':last_name}
    return person
musician = build_person('jimi', 'hendrix')
print(musician)
#结果为：
{'first': 'jimi', 'last': 'hendrix'}
```

4. 结合使用函数和 while循环

```python
def get_formatted_name(first_name,last_name):
    """返回整洁的姓名"""
    full_name = first_name+' '+last_name
    return full_name.title()
while True:
    #这是一个无限循环的代码块,当输入q退出循环
    print("please tell me your name: ")
    print("(enter 'q' at any time to quit)")
    f_name = input("first name: ")
    if f_name == 'q':
        break    
    l_name = input("last name: ")
    if l_name == 'q':
        break
    formatted_name = get_formatted_name(f_name, l_name)
    print("\nHello, "+formatted_name+"!")
#结果是：
please tell me your name: 
(enter 'q' at any time to quit)
first name: zhe
last name: wang

Hello, Zhe Wang!
please tell me your name: 
(enter 'q' at any time to quit)
first name: q
```

### 8.4 传递列表
1. 传递简单列表：

```python
#这个函数问候列表中的每个人
def greet_users(names):
    """向列表中的每位用户都发出简单的问候"""
    for name in names:
        msg = "Hello, "+name.title()+"!"
        print(msg)
usernames = ['wz','glj','lza']
greet_users(usernames)
#结果是：
Hello, Wz!
Hello, Glj!
Hello, Lza!
```

2. 在函数中修改列表：

将列表传递给函数后，函数就可以对其进行修改。在函数中对这个列表所做的任何修改都是永久性的，这让你能够高效的处理大量的数据。

```python
#首先创建一个列表，其中 包含一些要打印的设计
unprinted_designs = ['iphone case','robot pendant','rose']
completed_models = []
#模拟打印每个涉及，直到没有 未打印的设计为止
#打印每个设计后，将其转移到列表completed_models中
while unprinted_designs:
    current_design = unprinted_designs.pop()
    #模拟打印的过程
    print("Print model: "+current_design)
    completed_models.append(current_design)
#显示打印好的模型
print("\nThe following moddels have been printed: ")
for completed_model in completed_models:
    print(completed_model)
#结果是：
Print model: rose
Print model: robot pendant
Print model: iphone case

The following moddels have been printed: 
rose
robot pendant
iphone case
```

3. 禁止函数修改列表：

可以采用创建副本的方式，将副本列表传递给函数，函数修改的是副本而不是原件。

```python
print_models(unprinted_designs[:],completed_models)
```

这样传递的是unprinted_designs列表的副本，列表completed_models也将包含打印好的模型的名称，但函数所做的修改不会影响到unprinted_designs列表。

虽然向函数传递列表的副本可以保留原始列表的内容，但除非有充分的理由需要传递副本，否则还是应该将原始列表传递给函数，因为让函数使用现成列表可避免花时间和内存创建副本，从而提高效率，在处理大型列表时尤其如此。

### 8.5 传递任意数量的实参
1. 通过形参前面加*可以传递任意数量的实参：

```python
def make_pizza(*toppings):
    """打印顾客点的所有配料"""
    print(toppings)
make_pizza('pepper')
make_pizza('green pepers','extra cheese')
#结果是：
('pepper',)
('green pepers', 'extra cheese')
```

形参名*toppings中的星号让python创建一个名为toppings的空元组，并将收到的所有值都封装到这个元组中。

2. 结合使用位置实参和任意数量实参：

如果要让函数接受不同类型的实参，必须在函数定义中将接纳任意数量实参的形参放在最后。python优先匹配位置实参和关键字实参，再将余下的实参都收集到最后一个形参中。如：

```python
def make_pizza(size,*toppings):
    """打印顾客点的所有配料"""
    print("\nmake a "+str(size)+"-inch pizza with the following toppings: ")
    for topping in toppings:
        print("- "+topping)
make_pizza(16,'pepper')
make_pizza(12,'green pepers','extra cheese')
#结果是：
make a 16-inch pizza with the following toppings: 
- pepper

make a 12-inch pizza with the following toppings: 
- green pepers
- extra cheese
```

3. 使用任意数量的关键字实参：

有时候，需要接受任意数量的实参，但预先不知道传递给函数的会是什么样的信息。在这种情况下，可将函数编写成能够接受任意数量的键-值对——调用语句提供了多少就接受多少。一个这样的示例是创建用户简介：你知道你将收到有关用户的信息，但不确定会是什么样的信息。在下面的示例中，函数build_profile()接受名和姓，同时还接受任意数量的关键字实参。

```python
def build_profile(first,last,**user_info):
    """创建一个字典，其中包含我们知道的 有关用户的一切"""
    profile = {}
    profile['first_name'] = first
    profile['last_name'] = last
    for key,value in user_info.items():
        profile[key] = value
    return profile
user_profile = build_profile('albert', 'einstein',location='princeton',
                             field='physics')
print(user_profile)
#结果是：
{'first_name': 'albert', 'last_name': 'einstein', 'location': 'princeton', 'field': 'physics'}
```

形参**user_info中的两个星号让python创建一个命名为user_info的空字典，并将所有收到的名称-值对都封装到这个字典中。

### 8.6 将函数存储在模块中
1. 导入整个模块

要让函数是可导入的，得先创建模块。模块是扩展名为.py的文件，包含要导入到程序中的代码。下面创建一个包含函数make_pizza()的模块pizza.py。

```python
def make_pizza(size,*toppings):
    """概述要做的披萨"""
    print("\nMaking a "+str(size)+"-inch  pizza with  the following toppings:")
    for topping in toppings:
        print("- "+topping)
接下来在pizza.py所在目录下创建另一个模块making_pizzas.py，导入刚创建的模块，并调用make_pizza()方法两次：
import pizza
make_pizza(16,'pepper')
make_pizza(12,'green pepers','extra cheese')
#结果是：
make a 16-inch pizza with the following toppings: 
- pepper

make a 12-inch pizza with the following toppings: 
- green pepers
- extra cheese
```

2. 导入特定的函数：

```python
from pizza import make_pizza
make_pizza(16,'pepper')
make_pizza(12,'green pepers','extra cheese')
```

若使用这种语法，调用函数时就无须使用句点。由于我们在import语句中显式的导入了函数make_pizza()，因此调用它时只需要指定其名称。

3. 使用as 给函数指定别名:

如果要导入的函数名称可能与程序中现有的名称冲突，或者函数的名称太长，可以给函数指定一个别名：

```python
from pizza import make_pizza as mp
mp(16,'pepper')
mp(12,'green pepers','extra cheese')
```

4. 使用as给模块指定别名：

给模块指定别名可以让你更轻松地调用模块中的函数：

```python
import pizza as p
p.make_pizza(16,'pepper')
p.make_pizza(12,'green pepers','extra cheese')
```

5. 导入模块中的所有函数：

```python
from pizza import *
make_pizza(16,'pepper')
make_pizza(12,'green pepers','extra cheese')
```

import语句中的星号让python将模块pizza中的每个函数都复制到这个程序文件中，由于导入了每个函数，可通过名称常来调用每个函数，而无需使用句点表示法。然而，最好不要使用这种方法，如果模块中有函数的名称与你的项目中使用的名称相同，可能会覆盖函数。

最佳的做法是：要么只导入你需要使用的函数，要么导入整个模块并使用句点表示法。

## 9 类
### 9.1 创建和使用类
1. 创建简单dog类

```python
class Dog():
    """一次模拟小狗的简单尝试"""
    def __init__(self,name,age):
        """初始化属性name和age"""
        self.name = name
        self.age = age
    def sit(self):
        """模拟小狗被命令时蹲下"""
        print(self.name.title(+"is now sitting"))
    def roll_over(self):
        """模拟小狗被命令时打滚"""
        print(self.name.title(+" rolled over!"))
```

在python中，首字母大写的名称指的是类。在这个类的定义中括号是空的，因为我们要从空白创建这个类。

2. 方法_init_()：类中的函数称为方法，前面有关函数的一切都适用于方法，目前而言唯一重要的差别是调用方法的方式。方法_init_()是一个特殊的方法，每当创建Dog类的新实例时，都会自动运行它。在这个方法中，形参self必不可少，还必须位于其他形参的前面，因为调用这个_init_()方法来创建实例时，将自动传入实参self，它是一个指向实例本身的引用，让实例能够访问类中的属性和方法。每当我们通过实参向Dog()传递名字和年龄，self会自动传递因此我们不需要传递它，只需要给最后两个形参传值。
3. 以self为前缀的变量都可供类中的所有方法使用，我们还可以通过	类的任何实例来访问这些变量。self.name = name获取存储在形参name	中的值，并将其存储到变量name中，这样可以通过实例访问的变量称	为属性。
4. 根据类创建实例

```python
class Dog():
    """一次模拟小狗的简单尝试"""
    def __init__(self,name,age):
        """初始化属性name和age"""
        self.name = name
        self.age = age
    def sit(self):
        """模拟小狗被命令时蹲下"""
        print(self.name.title(+"is now sitting"))
    def roll_over(self):
        """模拟小狗被命令时打滚"""
        print(self.name.title(+" rolled over!"))
my_dog = Dog('willie',6)
print("My dog's name is "+my_dog.name.title())
print("My dog is "+str(my_dog.age).title()+" years old" )
#结果是：
My dog's name is Willie
My dog is 6 years old
```

5. 访问属性：

```python
my_dog.name
```

6. 调用方法：

```python
my_dog.sit()
```

8. 创建多个实例

```python
#可以根据需求创建任意数量的实例:
my_dog = Dog('willie',6)
your_dog = Dog('Tom',7)
```

### 9.2 使用类和实例
1. Car类

```python
class Car():
    """一次模拟汽车的简单尝试"""
    def __init__(self,make,model,year):
        """初始化描述汽车的属性"""
        self.make = make
        self.model= model
        self.year = year
    def get_descriptive_name(self):
        """返回整洁的描述性信息"""
        long_name = str(self.year)+' '+self.make+' '+self.model
        return long_name.title()
my_new_car = Car('audi','a4',2016)
print(my_new_car.get_descriptive_name())
#结果是：
2016 Audi A4
```

2. 给属性指定默认值

类中的每个属性都必须有初始值，哪怕这个值是0或者空字符串。在有些景况下，如设置默认值时，在方法_init_()内指定这种初始值是可行的；如果你对某个属性这样做了，就无须包含为它提供初始值的形参。

下面添加一个名为odometer_reading的属性，其初始值总是为0，添加一个名为read_odometer()的方法，用于读取汽车的里程表：

```python
class Car():
    """一次模拟汽车的简单尝试"""
    def __init__(self,make,model,year):
        """初始化描述汽车的属性"""
        self.make = make
        self.model= model
        self.year = year
        self.odometer_reading = 0
    def read_odometer(self):
        """打印一条指出汽车里程的消息"""
        print("This car has "+str(self.odometer_reading)+" miles on it.")
    def get_descriptive_name(self):
        """返回整洁的描述性信息"""
        long_name = str(self.year)+' '+self.make+' '+self.model
        return long_name.title()
my_new_car = Car('audi','a4',2016)
print(my_new_car.get_descriptive_name())
my_new_car.read_odometer()
#结果是：
2016 Audi A4
This car has 0 miles on it.
```

3. 修改属性的值

可以以三种不同的方式修改属性的值：直接通过实例进行修改；通过方法进行修改；通过方法进行递增（增加特定的值）

```python
#1.直接修改属性的值：
my_new_car = Car('audi','a4',2016)
print(my_new_car.get_descriptive_name())
my_new_car.odometer_reading = 23
my_new_car.read_odometer()
#结果是：
2016 Audi A4
This car has 23 miles on it.

#2.通过方法修改属性的值
def update_odometer(self,mileage):
        """将里程表读数设定为指定的值"""
        self.odometer_reading = mileage
my_new_car.update_odometer(23)
#结果为：
2016 Audi A4
This car has 23 miles on it.

#3.通过方法递增
def increment_odometer(self,miles):
        """将里程表读数增加指定的量"""
        self.odometer_reading+=miles
my_new_car = Car('audi','a4',2016)
print(my_new_car.get_descriptive_name())
my_new_car.update_odometer(23)
my_new_car.read_odometer()
my_new_car.increment_odometer(100)
my_new_car.read_odometer()
#结果是：
2016 Audi A4
This car has 23 miles on it.
This car has 123 miles on it.
```

### 9.3 继承
编写类时，并非总是要从空白开始。如果你要编写的类是另一个 现成累的特殊版本，可使用继承。一个类继承另一个类时，它将自动获得另一个类的所有属性和方法；原有的类称为父类，而新的类称为子类。子类继承了其父类的所有属性和方法，同时还可以定义自己的属性和方法。

1. 子类的方法__init__()

创建子类的实例时，python首先需要完成的任务是给父类的所有属性赋值。为此，子类的方法__init()__()需要父类施以援手。

如，下面来模拟电动汽车，电动汽车是一种特殊的汽车，因此我们可以在前面创建的Car类的基础上创建新类ElectricCar，这样我们就只需为电动汽车特有的属性和行为编写代码。

```python
class ElectricCar(Car):
    """电动汽车的独特之处"""
    def __init__(self,make,model,year):
        """初始化父类的属性"""
        super().__init__(make, model, year)
my_tesla = ElectricCar('tesla','model s',2016)
print(my_tesla.get_descriptive_name())
#结果是：
2016 Tesla Model S
```

注意：

（1）创建子类时，父类必须包含在当前文件中，且位于子类前面。

（2）定义子类时，必须在括号内指定父类的名称。方法__init()__接受创建Car实例所需的信息。

（3）super()是一个特殊函数，帮助python把父类和子类关联起来。这行代码让python调用父类的方法__init()__，让子类实例包含父类的所有属性。



2. 给子类定义属性和方法

```python
class ElectricCar(Car):
    """电动汽车的独特之处"""
    def __init__(self,make,model,year):
        """初始化父类的属性"""
        super().__init__(make, model, year)
#子类的特有属性，父类的实例没有这个属性
        self.battery_size = 70
    def describe_battery(self):
        """打印一条描述电瓶容量的消息"""
        print("This car has a "+str(self.battery_size)+"-kwh battery.")
my_tesla = ElectricCar('tesla','model s',2016)
print(my_tesla.get_descriptive_name())
my_tesla.describe_battery()
#结果是：
2016 Tesla Model S
This car has a 70-kwh battery.
```

3. 重写父类的方法

对于父类的方法，只要它不符合子类模拟实物的行为，都可以对其进行重写。为此，可在子类中定义一个这样的方法，即它与要重写的方法同名。

假设Car类有一个名为fill_gas_tank()的方法，它对电动汽车来说毫无意义，下面演示一种重写方式：

```python
class ElectricCar(Car):
--snip--
def fill_gas_tank():
“””电动汽车没有油箱”””
print(“This car doesn’t need a gas tank!”)
```

4. 将实例用作属性

使用代码模拟实物时，你可能会发现自己给类添加的细节越来越多：属性和方法清单以及文件都越来越长。在这种情况下，可能需要将类的一部分作为一个独立的类提取出来。可以将大型类拆分成多个协同工作的小类。

例如，不断给ElectricCar类添加细节时，我们可能会发现其中包含很多专门针对汽车电瓶的属性和方法。在这种情况下，我们可将这些属性和方法提取出来，放到另一个名为Battery的类中，并将一个Battery实例用作ElectricCar类的一个属性：

```python
class Car():
    """一次模拟汽车的简单尝试"""
    def __init__(self,make,model,year):
        """初始化描述汽车的属性"""
        self.make = make
        self.model= model
        self.year = year
        self.odometer_reading = 0
    def read_odometer(self):
        """打印一条指出汽车里程的消息"""
        print("This car has "+str(self.odometer_reading)+" miles on it.")
    def get_descriptive_name(self):
        """返回整洁的描述性信息"""
        long_name = str(self.year)+' '+self.make+' '+self.model
        return long_name.title()
    def update_odometer(self,mileage):
        """将里程表读数设定为指定的值"""
        self.odometer_reading = mileage
    def increment_odometer(self,miles):
        """将里程表读数增加指定的量"""
        self.odometer_reading+=miles
class Battery():
    """一次对模拟电动汽车电瓶的简单尝试"""
    def __init__(self,battery_size=70):
        """初始化电瓶的属性"""
        self.battery_size = battery_size
    def describe_battery(self):
        """打印一条描述电瓶容量的消息"""
        print("This car has a "+str(self.battery_size)+"-kwh battery.")
class ElectricCar(Car):
    """电动汽车的独特之处"""
    def __init__(self,make,model,year):
        """初始化父类的属性,在初始化电动汽车特有的属性"""
        super().__init__(make, model, year)
        self.battery = Battery()
my_tesla = ElectricCar('tesla','model s',2016)
print(my_tesla.get_descriptive_name())
my_tesla.battery.describe_battery()
#结果是：
2016 Tesla Model S
This car has a 70-kwh battery.
```

### 9.4 导入类
python允许你将类存储在模块中，然后在主程序中导入所需的模块。

1. 导入单个类

假设上面的Car()类在文件car.py中，现在创建另一个文件my_car.py，在其中导入Car类并创建其实例：

```python
from car import Car
my_new_car = Car(‘audi’,’a4’,’2016’)
print(my_new_car.get_descriptive_name())
my_new_car.odometer_reading = 23
my_new_car.read_odometer()
#结果是：
2016 Audi A4
This car has 23 miles on it
```

2. 在一个模块中存储多个类

虽然同一个模块中的类之间应存在某种相关性，但可根据需要在一个模块中存储任意数量的类。类Battery和ElectricCar都可以帮助模拟汽车，因此他们都加入到car.py中。现在，创建一个名为my_electric_car.py的文件，导入ElectricCar类，并创建一辆电动汽车：

```python
from car import ElectricCar
my_tesla = ElectricCar(‘tesla’,’model s’,2016)
print(my_tesla.get_descriptive_name())
my_tesla.battery.describe_battery()
my_tesla.battery.get_range()
```

3. 从一个模块中导入多个类

可根据需要在程序文件中导入任意数量的类。如果我们需要在同一个程序中创建普通汽车和电动汽车，就需要将Car和ElectricCar类都导入：

```python
from car import Car,ElectricCar
my_beetle = Car(‘tiger’,’beetle’,2016)
print(my_beetle.get_descriptive_name())
my_tesla = ElectricCar(‘tesla’,’roadster’,2016)
print(my_tesla.get_descriptive_name())
```

4. 导入整个模块

你还可以导入整个模块，再使用句点表示法访问需要的类。这种导入方法很简单，代码也易于阅读。由于创建类实例的代码都包含模块名，因此不会与当前文件使用的任何名称发生冲突。

```python
import car
my_beetle = car.Car(‘tiger’,’beetle’,2016)
print(my_beetle.get_descriptive_name())
my_tesla = car.ElectricCar(‘tesla’,’roadster’,2016)
print(my_tesla.get_descriptive_name())
```

5. 导入模块中的所有类

要导入模块中的所有类，可使用下面的语法：

```python
from module_name import*
```

不推荐用这种导入方式。  
	（1）如果只要看一下文件开头的import语句就清楚地知道程序使用了哪些类，将非常方便，而这种方式没有明确指出使用了模块中的哪些类。

（2）这种导入方式可能引发名称方面的困惑，容易与程序中的其他东西重名。需要从一个模块中导入很多类时，最好导入整个模块，并使用句点表示法来访问类。

### 9.5  python标准库
python标准库是一组模块，安装的python都包含它。可使用标准库中的任何函数和类，为此只需要在程序开头包含一条简单的import语句。

1. 要创建字典并记录其中的键-值对的添加顺序，可使用模块collections中的OrderedDict类。OrderDict实例的行为几乎与字典相同，区别只在于记录了键值对的添加顺序

```python
from collections import OrderedDict
favorite_languages = OrderedDict()
favorite_languages['jen']='python'
favorite_languages['sarah']='c'
favorite_languages['edward']='ruby'
favorite_languages['phil']='python'
for name,language in favorite_languages.items():
    print(name.title()+" 's favorite language is "+language.title()+".")
#结果是：
Jen 's favorite language is Python.
Sarah 's favorite language is C.
Edward 's favorite language is Ruby.
Phil 's favorite language is Python.
```

与添加时候的顺序相同

2. 模块random包含以各种方式生成随机数的函数，其中的randint()返回一个位于指定范围内的整数：

```python
#返回一个1-6内的整数
from random import randint
x=randint(1,6)
```

3. 要了解其他标准库内容可以访问[http://pymotw.com/](http://pymotw.com/)

## 10.文件和异常
### 10.1 从文件中读取数据
1. 读取整个文件

首先创建一个pi_digits.txt文件，在其中写入：

3.1415926535

   8979323846

   2643383279

然后写代码读取整个文件：

```python
with open('pi_digits.txt') as file_object:
    contents = file_object.read()
    print(contents)
#结果是：
3.1415926535
   8979323846
   2643383279
```

函数open()接受一个参数：要打开的文件的名称。python在当前执行的文件所在的目录中查找指定的文件。函数open()返回一个标识文件的对象。

关键字with在不在需要访问文件后将其关闭。（也可以手动调用close()方法关闭，但容易掌握不好时机，不推荐）

read()方法可以读取文件的全部内容，并将其作为一个长长的字符串存储在变量contents中。通过打印contents就可以将这个文本的全部内容显示出来。read()到达文件末尾时会返回一个空字符串，将这个空字符串打印出来就是个空行，可以使用rstrip()方法去掉空行。



2. 文件路径

（1）绝对路径

通过绝对路径，可以读取计算机任何位置的文件，因为绝对路径通常比较长，所以可以把它存储在一个变量里

```python
file_path = ‘C:\Users\ehmatthes\other_files\text_files\filename.txt’
with poen(ifle_path) as file_object:
```

（2）相对路径

相对路径是相对于当前程序文件所在位置，访问其他位置的文件的路径。如带当前程序文件所在文件夹下，有一个名为text_files的文件夹,要访问其中的文件代码如下：

```python
with open(‘text_files\filename.txt’) as file_object：
```

3. 逐行读取

要以每次一行的方式检查文件，可对文件对象使用for循环：

```python
filename = 'pi_digits.txt'
with open(filename) as file_object:
    for line in file_object:
        print(line.rstrip())
#结果跟第一个例子相同
```

4. 创建一个包含文件各行内容的列表

使用关键字with时，open()返回的对象文件只在with代码块内可用。如果要在with代码块外访问文件的内容，可在with代码块内将文件的各行存储在一个列表中，并在with代码块外使用该列表：你可以立即处理文件的各个部分，也可推迟到程序后面再处理。

```python
filename = 'pi_digits.txt'
with open(filename) as file_object:
#readlines()方法从文件中读取每一行并将其存储在一个列表中
    lines = file_object.readlines()
for line in lines:
    print(line.rstrip())
```

5. 使用文件的内容

将文件读取到内存中后，就可以以任何方式使用这些数据了

```python
filename = 'pi_digits.txt'
with open(filename) as file_object:
    lines = file_object.readlines()
pi_string = ''
for line in lines:
    pi_string+=line.strip()
print(pi_string)
print(len(pi_string))
```

注意：读取文本文件时，python将其中的所有文本都解读为字符串。如果你读取的是数字，并要将其作为数值使用，就必须使用函数int()将其转换为整数，或者使用float()将其转换为浮点数。

### 10.2 写入文件
1. 写入空文件

要将文本写入文件，你在调用open()时需要提供另一个实参，告诉python你要写入打开的文件。

```python
filename = 'programming.txt'
with open(filename,'w') as file_object:
    file_object.write("i love programming")
```

调用open()时提供了两个实参，第一个实参也是要打开的文件的名称，第二个实参（‘w’）告诉python，我们要以写入模式打开这个文件。打开文件时，可以指定读取模式（‘r’）、写入模式（‘w’）、附加模式（‘a’）货哦让你能够读取和写入文件的模式（‘r+’），如果你省略了模式实参，python将以默认的只读模式打开文件。

如果你要写入的文件不存在，函数open()将自动创建它。然而，以写入模式打开文件时千万要小心，因为如果指定的文件已存在，python将在返回文件对象前清空该文件。

注意：python只能将字符串写入文本文件，要将数值数据存储到文本文件中，必须先使用函数str()将其转换为字符串格式。

2. 写入多行

函数write()不会再你写入的文本末尾添加换行符，如果想要写入多行，可以在需要换行的位置添加换行符：

```python
file_object.write("i love programming\n")
file_object.write("i love games\n")
```

还可以使用空格、制表符和空行来设置这些输出的格式。

3. 附加到文件

如果要给文件添加内容而不是覆盖原有的内容，可以附加模式打开文件。以附加模式打开文件时，python不会在返回文件对象前清空文件。而你写入到文件的行都将添加到文件末尾。如果指定的文件不存在，python将为你创建一个空文件。

```python
filename = 'programming.txt'
with open(filename,'a') as file_object:
    file_object.write("because i am a boy\n")
现在文件programming.txt又多了一行because i am a boy的字符串
```

### 10.3 异常
1. python 使用被称为异常的特殊对象来管理程序执行期间发生的错误。每当发生让python不知所措的错误时，它都会创建一个异常对象。如果你编写了处理该异常的代码，程序将继续运行；如果你未对异常进行处理，程序将停止，并显示一个traceback，其中包含有关异常的报告。
2. 使用try-except代码块：

当你认为可能发生了错误时，可编写一个try-except代码块来处理可能引发的异常。

```python
try:
    print(5/0)
except ZeroDivisionError:
    print("不能这么除")
```

如果try-except代码块后面还有其它的代码，程序将接着运行。

3. else代码块：

依赖于try代码块成功执行的代码都应放到else代码块中。

```python
print("请输入两个数字，我将计算他俩的除法")
print("输入q退出")
while True:
    first_number = input("\n请输入第一个数")
    if first_number == 'q':
        break
    second_number = input("请输入第二个数")
    if second_number == 'q':
        break
    try:
        answer = int(first_number)/int(second_number)
    except ZeroDivisionError:
        print("不能这么除")
    else:
        print(answer)
```

如果除法运算成功，就使用else代码块来打印结果。

try-except-else代码块的工作原理大致如下：python尝试执行try代码块中的代码；只有可能引发异常的代码才需要放在try语句中。有时候有一些仅在try代码块成功执行时才需要运行的代码，这些代码应该在else代码块中。except代码块告诉python，如果try中的代码块发生了异常该怎么办。

4. 分析文本

我们将使用方法split()，它根据一个字符创建一个单词列表。下面是对只包含童话名“Alice in Wonderland”的字符串调用方法split()的结果：

```python
title = “Alice in Wonderland”
title.split()
#结果是：
[‘Alice’,’in’,’Wonderland’]
```

方法split()以空格为分隔符将字符串分拆成多个部分，并将这些部分存储到一个列表中，结果是一个包含字符串中所有单词的列表，虽然有些单词可能包含标点。为计算Alice in Wonderland包含多少个单词，我们将对整篇小说调用split()，在计算得到的列表包含多少元素，从而确定整篇童话大致包含多少个单词:

```python
filename='alice.txt'
try:
    with open(filename) as f_obj:
        contents = f_obj.read()
except FileNotFoundError:
    msg="对不起，文件："+filename+"不存在"
    print(msg)
else:
    #计算文件大致包含多少个单词
    words = contents.split()
    num_words = len(words)
    print("文件："+filename+"有"+str(num_words)+"个字")
```

现在可以编写一个简单的循环，计算要分析的任何文本包含多少单词了：

```python
def count_words(filename):
    """计算一个文件大致包含多少单词"""
    try:
        with open(filename) as f_obj:
            contents = f_obj.read()
    except FileNotFoundError:
        msg="对不起，文件："+filename+"不存在"
        print(msg)
    else:
        #计算文件大致包含多少个单词
        words = contents.split()
        num_words = len(words)
        print("文件："+filename+"有"+str(num_words)+"个字")

filenames = ['alice.txt','sidd.txt','moby.txt','hhh.txt']
for filename in filenames:
    count_words(filename)
#结果是：
文件：alice.txt有4个字
对不起，文件：sidd.txt不存在
对不起，文件：moby.txt不存在
对不起，文件：hhh.txt不存在
```

5. 失败时一声不吭

有时候你希望程序在发生异常时一声不吭，就像什么都没发生一样继续运行。可在except代码块中明确告诉python什么都不要做。python有一个pass语句，可在代码块中使用它来让python什么都不要做：

```python
def count_words(filename):
    """计算一个文件大致包含多少单词"""
    try:
        with open(filename) as f_obj:
            contents = f_obj.read()
    except FileNotFoundError:
        pass
    else:
        #计算文件大致包含多少个单词
        words = contents.split()
        num_words = len(words)
        print("文件："+filename+"有"+str(num_words)+"个字")

filenames = ['alice.txt','sidd.txt','moby.txt','hhh.txt']
for filename in filenames:
    count_words(filename)
#结果是：
文件：alice.txt有4个字
```

### 10.4 存储数据
模块json让你能够将简单的python数据结构转储到文件中，并在程序再次运行时加载该文件中的数据。

1. 使用json.dump()和json.load()

我们来编写一个存储一组数字的简短程序，再编写一个将这些数字读取到内存中的程序。第一个程序将使用json.dump()来存储这组数字，而第二个程序将使用json.load()。

函数json.dump()接受两个实参：要存储的数据以及可用于存储数据的文件对象。下面演示了如何使用json.dump()来存储数字列表：

```python
import json
numbers = [2,3,5,7,11,13]
filename = 'numbers.json'
with open(filename,'w') as f_obj:
    json.dump(numbers, f_obj)
#numbers.json文件中内容是：
[2, 3, 5, 7, 11, 13]
```

下面再编写一个程序，使用json.load()将这个列表读取到内存中

```python
mport json
numbers = [2,3,5,7,11,13]
filename = 'numbers.json'
with open(filename) as f_obj:
    numbers = json.load(f_obj)
print(numbers)
#结果是：
[2, 3, 5, 7, 11, 13]i
```

2. 保存和读取用户生成的数据

对于用户生成的数据，使用json保存它们大有裨益，因为如果不以某种方式进行存储，等程序停止运行时用户的信息将丢失。下面来看一个这样的例子：用户首次运行程序时被提示输入自己的名字，这样再次运行程序时就记住他了。

```python
import json
username = input("你叫啥名： ")
filename = 'username.json'
with open(filename,'w') as f_obj:
    json.dump(username, f_obj)
    print("当你再次回来我们将记住你的名字，"+username+"!")
#结果是：
你叫啥名： wz
当你再次回来我们将记住你的名字，wz!
```

现在编写一个程序，向其名字被存储的用户发出问候：

```python
import json
filename = 'username.json'
with open(filename) as f_obj:
    username = json.load(f_obj)
    print("欢迎回来，"+username+"!")
#结果是：
欢迎回来，wz!
```

我们需要将这两个程序合并成一个程序，这个程序运行时，我们尝试从文件username.json中获取用户名，因此我们首先编写一个尝试恢复用户名的try代码块，如果这个文件不存在，我们就在except代码块中提示用户输入用户名，并将其存储在username.json中，以便程序再次运行时能够获取它：

```python
import json
#如果以前存储了用户名，就加载它
#否则就提示用户输入用户名并存储它
filename = 'username.json'
try:
    with open(filename) as f_obj:
        username = json.load(f_obj)
except FileNotFoundError:
    username = input("你叫啥名： ")
    filename = 'username.json'
    with open(filename,'w') as f_obj:
        json.dump(username, f_obj)
        print("当你再次回来我们将记住你的名字，"+username+"!")
else:
    print("欢迎回来，"+username+"!")
```



