# 环境安装

## 1. Flutter 安装

Flutter是谷歌的移动UI框架，可以快速在iOS和Android上构建高质量的原生用户界面。 Flutter可以与现有的代码一起工作。在全世界，Flutter正在被越来越多的开发者和组织使用，并且Flutter是完全免费、开源的。



**下载地址**

https://flutter.dev/docs/get-started/install

> 找自己需要的平台，下载稳定版

下载下来的 Flutter 工具就是一个压缩包，直接解压就可以使用了，注意不要将压缩包放在一些需要权限的地方（如：C:\Program Files\）



**设置环境变量**

将 flutter\bin 这个路径加入到环境变量中



**检查 Flutter 环境**

在 cmd 命令行模式中输入 `flutter doctor` 可以检查生产环境，然后会给一个提示报告。如：

```
Doctor summary (to see all details, run flutter doctor -v):
[√] Flutter (Channel stable, 1.20.2, on Microsoft Windows [Version 10.0.18363.1016], locale en-US)

[!] Android toolchain - develop for Android devices (Android SDK version 29.0.3)
    X Android licenses not accepted.  To resolve this, run: flutter doctor --android-licenses
[!] Android Studio (version 3.6)
    X Flutter plugin not installed; this adds Flutter specific functionality.
    X Dart plugin not installed; this adds Dart specific functionality.
[!] VS Code (version 1.47.3)
    X Flutter extension not installed; install from
      https://marketplace.visualstudio.com/items?itemName=Dart-Code.flutter
[!] Connected device
    ! No devices available

! Doctor found issues in 4 categories.
```

> 给出各种提示信息



- Flutter 已经可以正常运行
- Android toolchain 中的 Android Licenses 不被认可，可以直接输入 flutter doctor --android-licenses 解决问题
- Android Studio 中的 Flutter 插件没有安装，Dart 插件没有安装
- VS Code 插件没有安装
- 没有可用设备



根据提示信息，解决各种问题。



**升级 Flutter**

```
flutter upgrade
```



## 2. 新建 Flutter 项目

- 打开 Android Studio
- File - New - New Flutter Project
- Flutter Application
- 填入项目基本信息（指定 SDK 路径，注意这里不是bin目录，是bin的上一级目录）
- 填写包名



创建虚拟机

- 进入 AVD Manager
- 创建新的虚拟机
- 选择手机类型
- 选择 Android 版本
- 给虚拟机起名，设置横屏或竖屏



运行演示代码

- 运行虚拟机

- 在项目中选择虚拟机
- Shift + F10 运行



Android Studio 提供热加载功能，可以使用小闪电图标或者快捷键 `Ctrl + \ ` 就可以即时查看修改过的效果。



## 3. Dart 安装

**下载地址**

安装包： https://gekorm.com/dart-windows/

ZIP包： https://dart.dev/tools/sdk/archive



## 4. IntelliJ 安装

**下载地址**

https://www.jetbrains.com/idea/

> 下载完然后安装 Flutter 插件



## 5. 新建 Dart 项目

- 进入 IntelliJ
- New Project - Dart
- 选择 Dart SDK 路径（D:\SDK\Dart\dart-sdk）
- Console Application



# Dart 语言

## 1. 变量类型

Dart 中可以声明数字、浮点、字符串类型，和 Javascript 一样，用 var 声明

```
var username = 'usr1';
usrname = 'usr2';
```

> 用 var 声明变量后，变量会根据数据自动判断数据类型。声明变量类型后，就无法更改数据类型。



```
Object password = 123;
password = '456'
```

> 用 Object 声明的变量，可以改变类型，在使用数据类型内置方法时，只会引用 Object 类中拥有的属性和方法



```
dynamic password = 123;
```

> 用 dynamic 声明的变量，会动态的判断变量数据类型，调用方法的时候，会推断所有可能的属性和方法。



用object 和 dynamic 虽然对变量限制更宽松，但是会使变量类型不可控，最好不要使用，尽量精确使用变量类型。

```
void main() {
  Object a = 'usr1';
  dynamic b = 'usr1';
  print(a.length);
  print(b.length);
}
```

- 对象 a 没有length方法
- 对象 b 会被 dynamic 自动判断为字符串类型，则拥有 length 方法



常量

只能被初始化一次，就无法改变内容的变量。在 dart 中用 `final` 或 `const` 关键词来设置常量

```
final psw = 'good';
const psw = 'good';
```

> final 与 const 的区别：final 在被调用的时候才会在内存开辟空间生成常量，而 Const 在编译阶段就已经在内存中生成常量了。



## 2. 数据类型

### 2.1 基本数据类型

**int 整型**

```
int a = 10;
```



**double 双精度浮点类型**

```
double b = 10.1;
```



**string 字符串类型**

```
String c = "S";
```



**bool 布尔型**

```
bool results = false;
bool results = 123 > 110;
```



**list 类型**

```
List list = [1, 3, 5, 7 ,9];

// 创建 List
List newList = [];
List newList = new List();

// 添加元素
newList.add(11);
// 将另一个数组里边的所有元素添加到该数组中
newList.addAll([4,6,8,10]);

// 查看数组长度
print(newList.length);

// 查看指定元素
print(newList.first);
print(newList.last);
print(newList[1]);
```



**Map 类型**

Map 类型有些类似于 Python 中的字典

```
  Map obj = {'x':1, 'y':2, 'z':3};
  Map obj2 = new Map();
  obj2['x'] = 1;
  obj2['y'] = 2;
```



```
// 查看是否包含键，返回布尔型
print(obj.containsKey('x'));

// 删除键值对
obj.remove('y')
```



### 2.2 数据类型转换

**字符串转其他类型**

```
int a = int.parse("110");
double b = double.parse("111.222");
```

> 将字符串类型转换为整型、双精度类型



**其他类型转字符串**

```
String a = 123.toString();

// 双精度转字符串并保留2位小数（自动四舍五入）
String b = 123.2222.toStringAsFixed(2);
```



## 3. 函数

### 3.1 main() 主函数

每个程序都需要一个主函数，程序运行时会自动调用 main() 函数。

```
void main() {
	代码段
}
```

> void 代表没有返回值



### 3.2 定义函数

如果函数没有返回值，则用 void 类型定义函数。

```
void func1() {
	print('This is func1');
}
```



### 3.3 返回值

```
void main() {
  String usr = getUserName();
  print(usr);
}

String getUserName() {
  return 'usr1';
}
```

> 注意有返回值的函数，定义的时候需要加上数据类型。需要与返回值的数据类型相符合。



### 3.4 参数

和其他语言一样，函数中也可以传入参数，因为是强类型语言，所以也需要定义参数的类型。

```
void main() {
  print(getUserPsw('zhangsan'));
}

String getUserPsw(String user) {
  Map userInfo = {
    'zhangsan':'123456',
    'lisi':'777777'
  };
  return userInfo['lisi'];
}
```



**可选参数**

定义函数的时候，将参数用中括号包裹起来，就变成了可选参数，在调用函数的时候可以不用传入该参数。

```
int addAge(int age1, [int age2]) {
	retrun age1 + age2 != null ? age2 : 0;
}
```



**参数默认值**

定义函数的时候，如果需要给参数设置默认值，还需要将参数部分用大括号包裹起来。

```
int addAge({int age1, int age2 = 16} {
	return age1 + age2;
}
```



**多参数调用**

传参的时候用冒号给参数赋值

```
int age2 = addAge(age1:119, age2:1);
```

