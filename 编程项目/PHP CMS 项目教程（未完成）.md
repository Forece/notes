# 一、CMS系统架构程序设计

程序项目需求分析分析说明书

程序设计说明书

数据库设计说明书



# 项目的开发过程：

## 1. 需求分析

后台：会员模块、分类模块、文章模块…………

前台：首页、列表页、文章详情、搜索、分页、注册、登录…………



## 2. 数据库设计

1. 找实体

   比如说会员、内容都算实体，需要单独创建表单

2. 找实体属性

   比如说会员需要用户名、密码，可以算做字段

3. 找关系

   文章和分类有关系

4. E-R 图

   通过 E-R 图来设计数据库的表单与字段以及字段属性

   

   ![img](./images/phpcms/b151f8198618367a0b9c767e2e738bd4b31ce578.jpg)

   

   ![img](./images/phpcms/img.kanzhun.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg)



## 3. 目录结构

| - CMS  项目目录

​	| ----  admin 网站后台目录

​	|		| ---- layout  后台公共模板文件（header、footer）

​	|		| ---- include  网站后台资源目录

​	|		|		| --- css

​	|		|		| --- js

​	|		|		| --- img

​	|		| ---- view  页面内容（动态显示页面 main）

​	|		|		| --- user

​	|		|		| --- type

​	|		| ---- control  控制器目录（通过控制器调用需要显示的 view 中页面内容）

​	|		|		| --- IndexControl.php  显示后台主页（定义相关函数）

​	|		|		| --- UserControl.php  用户相关操作

​	|		|		| --- ORG  扩展目录

​	|		| ---- index.php  访问后台入口文件

​	| ----  web  网站前台目录

​	|		| ---- layout  前台公共模板文件（header、footer）

​	|		| ---- include  前台资源目录（css、js、img）

​	|		| ---- view  页面内容（每个页面都有单独的内容模板文件 main.html ）

​	|		| ---- control  控制器目录（通过控制器调用需要显示的 view 中页面内容）

​	|		| ---- index.php  前台入口文件

​	| ---- index.php  主页入口文件

​	| ---- public  公共资源目录、图片上传、图片缩放

​	| ---- config  网站配置文件、数据库相关操作、数据库的配置文件



## 4. 编码阶段

## 5. 项目测试

## 6. 验收上线



# 二、 EW_CMS 简介

## 1. 什么是 CMS

CMS是"Content Management System"的缩写,意为"内容管理系统"。一般可以视为文章发布系统。



## 2. EW_CMS 使用技术

- 开发技术：PHP, BroPHP框架, Javascript
- 数据库： MySQL



## 3. EW_CMS 系统的结构

系统总体结构采用了 MVC 的设计模式，使用面向对象的思想与 PHP 过程化两种模式开发。



**MVC 设计结构**

MVC是模型（model)、视图（view)、控制（controller）这三个单词上的首字母组成。它是一种目前广泛流行的应用模型，它的目的是实现Web系统的职能分工。



![img](images/cms/20151223134844508)





# 三、程序开发

## 1. 后台开发

### 1.1 后台模板

因为使用的是 MVC 设计结构，所以需要将页面分割成为不同的部分。

- 将前端 HTML 页面分割成为 header、footer、left（侧边栏） 放入admin/layout 目录

- 将 CSS、JS以及图片文件放入 admin/include 目录中

- 调整 header.html 和 CSS 中的引用位置



### 1.2 设计入口文件

创建 admin/index.php 和 admin/controls/indexController.php 



index.php

```
<?php
    // 后台入口文件
    $method = $_GET['m']??'index';
    $a = $_GET['a']??'show';
    include "./controls/indexController.php";
    $method();
    $a();

?>
```



代码中：

`$method = $_GET['m']??'index';` 的意思是当 index.php 中没有 m 参数的 GET 传值的话（m值为NULL）那么 $method 默认为 index。当 $method = index 后，那么 $method() 就相当于调用了 index() 函数。那么只需要在控制器中写出 index() 函数即可。

> $a 与 $method 同理，只是 $a 调用的是 show() 函数



indexController.php

```
<?php
    function index(){
        function show(){
            include './view/index.html';
        }
    }
```



通过 show() 函数，将 index.html 引用进来

> 如果想要调用 show() 则必须先调用 index()，因为 show() 是 index() 的内部函数。



admin/view/index.html

~~~
<php?
    include './layout/header.html';
    include './layout/left.html';
 ?> 
        <div class="main">
            <div class="page-title">Dashboard</div>
            <div class="content">显示的内容</div>
        </div>
    </div>

<php?
    include './layout/footer.html';
 ?>
~~~

> 因为模板文件是被 php 引用的，所以在html中所写的 php 代码也会被带入到 indexController.php ，并且再次经过 include 进入到 index.php 文件中。



### 1.3 设计配置页面

admin/view/sysinfo.html

显示后台配置（SEO, Description, Logo）

~~~php
<?php
    include './layout/header.html';
    include './layout/left.html';
 ?> 
        <div class="main">
            <div class="page-title">Dashboard</div>
            <div class="content">配置文件</div>
        </div>
    </div>

<?php
    include './layout/footer.html';
 ?>
~~~



admin/index.php

~~~
<?php
    // 后台入口文件
    $method = $_GET['m']??'index';
    $a = $_GET['a']??'show';
    include "./controls/indexController.php";
    include "./controls/sysinfoController.php";
    $method();
    $a();

?>
~~~

> 调用 sysinfoController.php  控制器



controls/sysinfoController.php

~~~
<?php
    function sysinfo(){
        function show(){
            include './view/sysinfo.html';
        }
    }
~~~



如果需要主页面显示为 sysinfo.html 的话，那么就需要调用 sysinfo() 函数，所以在 Index.php 这里，就需要 GET 值中有m参数，并且为sysinfo。所以当用户需要访问 sysinfo 页面的时候，只要给一个 a 链接，将 sysinfo 当做 m 的参数传递即可。如 `<a href="./index.php?m=sysinfo&a=show">网站配置</a>`

> 当 $method = sysinfo 的时，会调用控制器 sysInfoController.php 中的 sysinfo() 函数，然后再调用 sysinfo() 中 show() 函数，将指定页面显示出来。



### 1.4 配置页面提交数据处理

表单提交页面

~~~html
<?php
    include './layout/header.html';
    include './layout/left.html';
 ?> 
        <div class="main">
            <div class="page-title">配置文件</div>
            <div class="content">
                <form action="index.php?m=sysinfo&a=action_data" method="POST" enctype="multipart/form-data">
                    <table>
                        <tr>
                            <td>网站标题</td>
                            <td><input type="text" name="title" value="网站标题" /></td>
                        </tr>
                        <tr>
                            <td>关键字</td>
                            <td><input type="text" name="keywords" value="关键字"></td>
                            <td>多个关键字用逗号隔开</td>
                        </tr>
                        <tr>
                            <td>描述</td>
                            <td><textarea name="description" id="" cols="30" rows="10"></textarea></td>
                        </tr>
                        <tr>
                            <td>LOGO</td>
                            <td><input type="file" name="logo"></td>
                            <td><img src="" alt="网站LOGO"></td>
                        </tr>
                        <tr>
                            <td><input type="submit" value="提交"></td>
                        </tr>
                    </table>
                </form>
            </div>
        </div>
    </div>

<?php
    include './layout/footer.html';
 ?>
~~~

> 设计 form 表单，将表单内容（标题、关键字、描述、LOGO）等内容提交到 index.php。用 $_GET 参数传递 m=sysinfo，a=action_data。代表着需要调用控制器中 sysinfo() 函数中的 action_data 函数。



配置文件

~~~php
<?php
    // 设置网站配置常量
    define('TITLE, '网站标题123');
    define('KEYWORDS, '关键字123');
    define('DESCRIPTION, '123');
    define('LOGO', '');
~~~

> 将配置写入文件，方便每次提取（也可以写入数据库）



admin/controls/sysinfoController.php

~~~php
<?php
    function sysinfo(){
        function show(){
            include './view/sysinfo.html';
        }
        function action_data(){
            // 1. 读取配置文件(sysconfig.php)
            $config = file_get_contents('../config/sysconfig.php');
            // 2. 判断是否有文件上传，如有文件上传，则需要替换文件上传
            if(!empty($_FILES['logo']['name'])){
                include './ORG/upload_func.php';
                // $fileName = upload(pic:'logo', path:'../public/upload');
                $_POST['logo'] = $fileName['name'];                
            }
            // 2. 将配置文件中的信息替换成$_POST中传递过来的值
            foreach ($_POST as $k=>$v) {
                $search[] = "/define\(\'".$k."\', \'(.*?)\'\);/i";
                $replace[] = "define('".strtoupper($k).", '".$v."');";
            }
            $str = preg_replace($search, $replace, $config);
            // 3. 写入源文件中保存
            if(file_put_contents('../config/sysconfig.php',$str)){
                echo '<script>alert("保存成功");location="?m=sysinfo&a=show"</script>';
            }else{
                echo '<script>alert("保存失败");location="?m=sysinfo&a=show"</script>';
                }
            
        }
    }
~~~



## 2.  前台调用

### 1. 前台模板

和后台一样，将前台的 header.html , footer.html 放入到 home/layout 文件夹中

在  home/view 中放入 main.html 文件

在 main.html 中 include 头部和底部文件



### 2. 前台入口文件

和后台一样，在 home 中创建 index.php，然后利用 $method 和 $a 函数调用控制器

~~~php
<?php
    // 前台入口文件
    $method = $_GET['m']??'index';
    $a = $_GET['a']??'show';
    include "./home/controls/indexController.php";
    $method();
    $a();

?>
~~~



### 3. 前台主页控制器

~~~php
<?php
    // 前台首页控制器
    function index(){
        function show(){
            include './config/sysconfig.php';
            include './home/view/main.html';
        }
    }

?>
~~~

> 这里引入配置文件，以便于调用配置文件中的全局变量



### 4. 调用全局变量

main.html

~~~php
<?php
    include './home/layout/header.html';
?>
    <body>
        <img src="./home/public/upload/<?=LOGO?>" alt="LOGO">

<?php
    include './home/layout/footer.html';
?>     
~~~

> 调用 ./config/sysconfig.php 中的全局变量 LOGO 地址



home/layout/header.html

~~~php
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="<?php echo KEYWORDS; ?>" content="">
    <meta name="<?php echo DESCRIPTION; ?>" content="">
    <title><?php echo TITLE; ?></title>
</head>


~~~

> 调用 ./config/sysconfig.php 中的全局变量 KEYWORDS, DESCRIPTION, TITLE



## 3. MySQL 开发

### 3.1 找实体

通过实体，找属性，设计数据库，如用户模块



![image-20210322194032650](images/cms/image-20210322194032650.png)



### 3.2 列出数据库结构

数据库设计表格：

表名：user

| 字段名    | 数据类型    | 属性                  | 约束条件                | 说明                          |
| --------- | ----------- | --------------------- | ----------------------- | ----------------------------- |
| id        | INT         | 自增                  | 主键                    | 用户编号                      |
| username  | varchar(15) | 非空                  | 不能有重复用户名 Unique |                               |
| psw       | char(32)    | 非空                  |                         |                               |
| email     | varchar(60) | 非空                  |                         |                               |
| avatar    | char(40)    | 非空，默认default.jpg |                         |                               |
| sex       | tinyint     | 非空，默认1           |                         | 0代表女，1代表男              |
| age       | tinyint     | 非空                  | 无符号                  |                               |
| phone     | char(11)    | 非空，默认空字符串""  |                         |                               |
| level     | tinyint     | 非空，默认1           |                         | 0超级管理员，1普通用户，2禁用 |
| addtime   | int         | 非空                  | 无符号                  | 注册时间                      |
| lastlogin | int         | 非空                  | 无符号                  | 上次登录时间                  |



### 3.3 创数据库语句

以用户表为例：

```
DROP TABLE IF EXISTS ew_user;
CREATE TABLE ew_user(
id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(15) NOT NULL,
psw CHAR(32) NOT NULL,
email VARCHAR(60) NOT NULL,
avatar CHAR(60) DEFAULT "default.jpg" NOT NULL,
sex TINYINT DEFAULT 1 NOT NULL UNSIGNED,
age TINYINT NOT NULL UNSINGED,
phone CHAR(11) DEFAULT "" NOT NULL,
level TINYINT DEFAULT 1 NOT NULL,
addtime INT UNSIGNED NOT NULL,
lastlogin INT UNSIGNED NOT NULL
)ENGINE=MYSIAM DEFAULT CHARSET=UTF8MB4;
```

> 然后利用这些SQL语句进行分类、文章、评论、广告、公告、友情链接等表的创建



### 3.4 数据库设计约定

- 所用命名一定要具有描述性，杜绝一切拼音或者英文混杂的命名方式
- 字符集采用 UTF8MB4，注意字符的转换
- 所有数据表第一个字段都是系统内部使用，主键列，自增字段，不可空，名称为id，确保不把此字段暴露给最终用户
- 除特别说明外，所有日期格式都采用 int 格式，无时间值
- 除特别说明外，所有字段默认都设置不允许为空，需要设置默认值
- 所有普通索引的命名都是表名加索引的字段组合，例如用户表 User 中 name 字段设置普通索引，则索引名称命名方式为 user_name。



### 3.5 找关联

![image-20210322195232282](images/cms/image-20210322195232282.png)

### 3.6 综合E-R图

确定对应关系（1对1，1对多，多对多）最后综合成为一个全局 E-R 图

![image-20210322200040577](images/cms/image-20210322200040577.png)





### 3.7 前端相关数据对应SQL

通过关系，写出对应显示数据的 SQL 语言，如：

```
// 注册SQL

// 登录SQL

// 导航栏分类、子分类

// 最新文章

// 栏目文章

// 广告位

// 公告位
```





### 3.8 后端相关对应SQL

```
// 添加用户

// 查询用户

// 查询用户分页功能

// 禁用用户

// 恢复用户

// 删除用户

// 添加栏目

// 添加子栏目

// 修改栏目名称

// 添加文章


```



## 4. 功能开发

#### 4.1 



