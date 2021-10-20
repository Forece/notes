# 项目说明

利用 Composer 各种包搭建框架，完成增删改查操作



# 准备工作

- 开发流程
  - Web软件开发的标准流程.docx
- 需求分析
  - EWShop电商系统需求说明书 .docx
- 数据库
  - EWShop电商系统数据库设计说明书 .docx

- 程序说明
  - EWShop电商系统程序设计说明书 .docx
    - 目录结构

```
|-- EWShop目录                          #项目根目录
	|-- index.php                         #主入口路由文件
	|-- config.inc.php                      #项目的主配置文件
	|-- .htaccess                           #项目根下的Apache配置文件
	|-- vendor                             	#Composer组件程序目录
	|-- app                             	#项目的应用程序目录
           |--controllers                    #MVC模式控制器目录
                  |--admin                 #后台控制目录
                  |--home                  #前台控制器目录
                  |--BaseControllers.php     #控制器的基类
           |--models                        #MVC模式Model目录
                  |--BaseDao.php            #数据库操作对象的基类
           |--views                         #MVC模式的视图目录
                  |--admin                 #后台模板文件目录
                  |--home                  #前台第一套模板目录 
                  |--home2                  #前台第一套模板目录
                  |--public                  #前后台公共资源（CSS,JS,images）目录 
           |--helpers.php                    #项目的自定义函数库文件
	|-- class                             	#项目自己定义类库文件
	|-- uploads                             #资源上传保存的目录
```



- 配置虚拟主机 ewshop.com

- 配置 .htacess 文件
  - 使任何无路由定义的 url 自动转向主页

```
# 开启重写引擎
RewriteEngine On

# 从根目录开始
RewriteBase /

# 重写条件(File + Directory)
RewriteCond %{REQUEST_FILENAE}% !-f
RewriteCond %{REQUEST_FILENAE}% !-d

# 重写规则
# 任意字符起始或结尾，转换为 index.php?(.*) 如：
# ewshop.com/user/add
# ewshop.com/index?user/add
RewriteRule ^(.*)$ index.php?$1 [QSA,L]
```

> 相当于实现了一个隐藏 index.php 的功能



# 构建框架

MVC 框架



![image-20210812183331690](images/ewshop/image-20210812183331690.png)



使用 Composer 搭建框架

- 路由 noahbuscher/macaw
- 控制器
- 视图 twig/twig
- 模型 catfan/medoo
- 应用库 jasongrimes/paginator
- 单个文件自动加载 helpers.php



查看 composer 配置

```
composer config -gl
```



更改 composer 源

```
# 官网下载源
composer config -g repo.packagist composer https://packagist.phpcomposer.com

# 阿里云下载源
composer config -g repo.packagist composer https://mirrors.aliyun.com/composer/
```



## 1. noahbuscher/macaw

### 1.1 安装使用

在项目目录中安装

```
composer require noahbuscher/macaw:dev-master
```



### 1.2 重写规则隐藏 index.php

需要定义重写规则：

**Appache .htacess**

```
// 开启重写规则
RewriteEngine On

// 重写规则起始路径
RewriteBase /

// 重写规则条件 -f 文件， -d 文件夹
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

// 对符合条件的路径进行重写
// 不论任何字符起始或结束^(.*)$, 替换为 index.php?(.*)
// https://ewshop.com/admin ，会替换为
// https://ewshop.com/index.php?admin
RewriteRule ^(.*)$ index.php?$1 [QSA,L]
```



**Ngix**

```
rewrite ^/(.*)/$ /$1 redirect;

if (!-e $request_filename){
	rewrite ^(.*)$ /index.php break;
}
```



Examples

~~~php
<?php
// 自动调用 Composer 的组件包
require('vendor/autoload.php');

// 引入包
use NoahBuscher\Macaw\Macaw;

// 响应方式
Macaw::get('/hello/world', function(){
    echo 'hello world';
});
Macaw::post('/contact', function(){});
Macaw::any('/form', function(){})
    
// 路由传入参数
Macaw::get('/post(:num)', function($num){
    echo $num;
})
    
// 加载路由
Macaw::dispatch();
~~~



路由直接调用方法

```php
// 需要引入类文件
require "app/controllers/admin/demo.php";

// 定义路由对应方法（命名空间\类名@方法名）
Macaw::get('/', 'admin\Demo@index');
Macaw::get('page', 'admin\Demo@page');
Macaw::get('view/(:num)', 'admin\Demo@view');
```



demo.php

~~~php
<?php

namespace admin;

final class Demo {
    public function index(){
        echo '666';
    }

    public function page(){
        echo 'page';
    }
}
~~~



### 1.3 自动加载文件

每次载入模块都需要引入文件，可以在 composer.json 中设置

~~~json
{
    "require": {
        "noahbuscher/macaw": "dev-master"
    },
    "autoload": {
        "psr-4": {
            "admin\\" : "app/controllers/admin/"
        }
    }
}
~~~



然后执行 composer 命名，让 autoload 自动配置

~~~
composer dump-autoload
~~~

> vendor/composer/autoload_psr4.php 会自动增加 autoload 配置

此时，在 index.php 就不用加载 app/controllers/admin/demo.php 了，不过每次增加模块文件都需要执行一次 composer 命令



### 1.4 创建基类控制器

controllers\BaseController.php

定义两个简单的跳转方法，成功则跳转和失败则跳转

~~~php
<?php

namespace controllers;

class BaseController
{
    protected function success($url, $msg)
    {
        echo "<script>";
        echo "alert('{$msg}');";
        if (!empty($url)) {
            echo "location.href='{$url}';";
        }
        echo "</script>";
    }

    protected function error($url, $msg)
    {
        echo "<script>";
        echo "alert('ERROR: {$msg}');";
        if (!empty($url)) {
            echo "location.href='{$url}';";
        }
        echo "</script>";
    }
}
~~~



修改 Composer.json

~~~json
{
    "require": {
        "noahbuscher/macaw": "dev-master"
    },
    "autoload": {
        "psr-4": {
            "admin\\" : "app/controllers/admin/",
            "home\\" : "app/controllers/home/",
            "controllers\\": "app/controllers/"
        }
    }
}

~~~



index.php 测试基础控制器

~~~php
<?php

require('vendor/autoload.php');
use NoahBuscher\Macaw\Macaw;

Macaw::get('/admin','\admin\Demo@index');
Macaw::get('/admin/add','\admin\Demo@add');
Macaw::get('/home','\home\Demo@index');


Macaw::dispatch();
~~~



admin/Demo.php

~~~php
<?php
namespace admin;
use controllers\BaseController;

final class Demo extends BaseController{
    public function index(){
        echo 'index';
        $this->success('/home',"成功");
    }

    public function add(){
        echo 'add';
        $this->error('/home',"失败");
    }
}
~~~



- 访问 /admin 弹出成功，并跳转到 /home
- 访问 /admin/add 弹出失败，并跳转到 /home



### 1.5 创建前后台控制器 

创建 admin.php 和 home.php 控制器

~~~php
<?php

namespace admin;

use controllers\BaseController;

class Admin extends BaseController
{

}
~~~



## 2. twig/twig

### 2.1 安装使用

安装 twig

~~~shell
composer require twig/twig
~~~



调用模板

~~~php
$loader = new \Twig\Loader\FilesystemLoader('/app/views');
$twig = new \Twig\Environment($loader, [
    'cache' => '/path/to/compilation_cache',
]);

echo $twig->render('index.html', ['name' => 'Fabien']);
~~~



控制器 admin.php 调用模板文件

~~~php
<?php

namespace admin;

use controllers\BaseController;

final class Admin extends BaseController
{
    public function index()
    {
        // 注意路径（绝对路径）
        $loader = new \Twig\Loader\FilesystemLoader('./app/views');
        $twig = new \Twig\Environment($loader, [
//            'cache' => '/path/to/compilation_cache',
        ]);

        // 注意路径
        echo $twig->render('admin/index/index.html', ['name' => 'Fabien']);
    }


}
~~~



新建模板文件，使用 {{ }} 加载传入的值

/app/views/admin/index/index.html

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title</title>
</head>
<body>
hello {{name}}
</body>
</html>
~~~



### 2.2 传值、调用模板方法

因为每次调用模板都去创建模板类 $loader，并且进行渲染，所以可以将这些方法写在基类控制器中的构造方法中，如：创建模板类

~~~php
namespace controllers;

abstract class BaseController
{
    protected $twig;

    public function __construct()
    {
        $loader = new \Twig\Loader\FilesystemLoader('./app/views');
        $this->twig = new \Twig\Environment($loader, [
//            'cache' => '/path/to/compilation_cache',
        ]);
    }
}
~~~



传值方法 assign，需要创建一个公共数组 $data;

~~~php
protected $data = [];

protected function assign($var, $val=null){
    // 当传入的值是数组时, 将数组合并
    if(is_array($var)){
        $this->data = array_merge($this->data,$var);
    } else {
        // 如果是单个值，则将值加入数组
        $this->data[$var] = $val;
    }
}
~~~



控制器中给模板传值，如：

~~~php
// 传入单值
assign('power', '20');

// $data值
array (size=1)
  'power' => string '20' (length=2)

// 再传入数组
$arr = ['a' => '1', 'b'=>'2'];
assign($arr);

// $data 值
array (size=3)
  'power' => string '20' (length=2)
  'a' => string '1' (length=1)
  'b' => string '2' (length=1)

~~~



创建调用模板方法

~~~php
protected function display($template){
    echo $this->twig->render($template,$this->data);
}
~~~



控制器中模板调用

~~~php
$this->display('admin/index/index.html');
~~~



模板显示传入的值

~~~html
{{power}}
{{a}}
{{b}}
~~~



这样会将所有变量和数组传入公共属性 $data 数组中，如果想分离变量和数组，那么可以直接传值

~~~php
protected function assign($var, $val){
    $this->data[$var] = $val;
}
~~~



传值方法和默认方法类似

~~~php
public function index()
{
    $this->assign('power','20');
    $arr = ['a'=>'1','b'=>'2'];
    $this->assign('arr',$arr);
    $this->display('admin/index/index.html');

}
~~~



模板调用

~~~html
{{power}}
{{arr.a}}
{{arr['b']}}
~~~



### 2.3 helpers.php

配置一个 helpers.php 用来帮助我们输出一些变量，唯一好处就不用我们挨个 var_dump() 输出了，一般用来做调试使用。

app\helpers.php

~~~php
<?php
    // 避免与现有重名 function 冲突
if (!function_exists('dd')) {
    function dd(...$args)
    {
        // 没什么用，返回 500 Status Code
        // 默认返回当前 Code
        http_response_code(500);
        foreach ($args as $x) {
            var_dump($x);
        }
        die(1);
    }
}
~~~



如果想在其他文件中使用 helpers.php，需要引入文件，或者将 helpers.php 文件加入到自动引用配置中

~~~json
{
    "require": {
        "noahbuscher/macaw": "dev-master",
        "twig/twig": "^3.3"
    },
    "autoload": {
        "psr-4": {
            "admin\\" : "app/controllers/admin/",
            "home\\" : "app/controllers/home/",
            "controllers\\": "app/controllers/"
        },
        "files": [
            "app/helpers.php",
        ]
    }
}
~~~



使用命令行工具重新加载 autoload 配置

~~~
composer dump-autoload
~~~



在文件中使用 helpers.php

~~~php
    public function index()
    {
        $this->assign('power','20');
        $arr = ['a'=>'1','b'=>'2'];
        $this->assign('arr',$arr);
        // 输出 $this->data 
        dd($this->data);
        $this->display('admin/index/index.html');

    }
~~~



### 2.4 config.inc.php

添加 config.inc.php 到全局，文件自动引用

~~~php
{
    "require": {
        "noahbuscher/macaw": "dev-master",
        "twig/twig": "^3.3"
    },
    "autoload": {
        "psr-4": {
            "admin\\" : "app/controllers/admin/",
            "home\\" : "app/controllers/home/",
            "controllers\\": "app/controllers/"
        },
        "files": [
            "app/helpers.php",
            "config.inc.php"
        ]
    }
}
~~~



之前使用 twig 的模板路径参数使用的相对路径，如果改变目录结构，那么就需要重写路径

~~~php
$loader = new \Twig\Loader\FilesystemLoader('./app/views');
~~~



在 config.inc.php 中定义常量

~~~php
define('TEMPDIR',__DIR__);
~~~

- getcwd() 运行文件的路径（如使用 include,require 会改变 getcwd 的路径）
- `__DIR__` 写入文件的路径（在哪个文件写了该条语句，就显示该文件的当前路径）

> 所以 config.inc.php 在根目录中，那么 `__DIR__` 就是根目录的绝对路径



改写模板调用路径

~~~php
$loader = new \Twig\Loader\FilesystemLoader(TEMPDIR.'/app/views');
~~~



### 2.5 前后端自动调用对应模板

通过建立 Admin 类和 Home类，重写 __construct 基类方法，调用不同模板，如：

~~~php
<?php

namespace admin;

use controllers\BaseController;

abstract class Admin extends BaseController
{
    public function __construct()
    {
        $loader = new \Twig\Loader\FilesystemLoader(TEMPDIR.'/app/views/admin');
        $this->twig = new \Twig\Environment($loader, [
//            'cache' => '/path/to/compilation_cache',
        ]);
    }

}
~~~



创建 demo 类

~~~php
<?php

namespace admin;

final class Demo extends Admin
{
    public function index()
    {
        $this->assign('title','标题');
        $this->display('index/index.html');

    }
}
~~~



修改 index.php 路由

~~~php
Macaw::get('/admin/demo', '\admin\Demo@index');
~~~



模板

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title</title>
</head>
<body>
{{title}}
</body>
</html>
~~~



通过访问 /admin/demo 会自动调用 views/admin/index/index.html 模板，前台 home 同理



### 2.6 切换模板原理

在 config.inc.php 创建常量模板名

~~~php
define('TEMPNAME','home');  //home1, home2
~~~



在 home.php 类中重写 __construct 方法

~~~php
<?php

namespace home;

use controllers\BaseController;

final class Home extends BaseController
{
    public function __construct()
    {
        // 加入模板名常量
        $loader = new \Twig\Loader\FilesystemLoader(TEMPDIR.'/app/views/'.TEMPNAME);
        $this->twig = new \Twig\Environment($loader, [
//            'cache' => '/path/to/compilation_cache',
        ]);
    }

}
~~~



如果想切换模板，那么就直接修改常量中的 TEMPNAME 值即可，并且创建对应模板文件，如 home2/index/index.html



### 2.7 twig 模板语法

输出变量

~~~twig
// 输出单一变量
{{ title }}

// 输出数组变量
{{ data.id }}
{{ data['username']}}
~~~



注释

~~~twig
{# xxxx #}
~~~



包含文件

~~~twig
{% include "public/header.html" %}
~~~



循环

~~~twig
// 遍历值
{% for v in data %}
{{ v }}
{% endfor %}

// 遍历下标与值
{% for k,v in data %}
{{ k }}
{{ v }}
{% endfor %}

// 遍历指定次数
{% for i in 0..8 %}
&nbsp;
{% endfor %}
~~~



条件

~~~twig
// 基本条件
{% if flag == 1 %}
	xxxx
{% endif %}

// 复杂条件
{% if flag == 1 and flag2 ==2 %}
xxx
{% elseif flag3 == 3 %}
xxx
{% else %}
xxx
{% endif %}
~~~



时间戳格式化

~~~twig
{{creat_time|date('Y-m-d H:i:s')}}
~~~



## 3. catfan/medoo

http://packagist.p2hp.com/packages/catfan/medoo



安装

~~~
composer require catfan/medoo
~~~



配置自动加载 composer.json

~~~
{
    "require": {
        "noahbuscher/macaw": "dev-master",
        "twig/twig": "^3.3",
        "catfan/medoo": "^2.1"
    },
    "autoload": {
        "psr-4": {
            "admin\\" : "app/controllers/admin/",
            "home\\" : "app/controllers/home/",
            "controllers\\": "app/controllers/",
            "models\\": "app/models"
        },
        "files": [
            "app/helpers.php",
            "config.inc.php"
        ]
    }
}
~~~

> 之后执行 composer dump-autoload 命令加载



### 3.1. 创建基础模型类

app\models\BaseModel.php

~~~php
<?php

namespace models;

use Medoo\Medoo;

class BaseModel extends Medoo{
    public function __construct()
    {
        $options = [
            'database_type' => 'mysql',
            'database_name'=> 'ewshop',
            'server'=>'localhost',
            'username'=>'root',
            'password'=>'',
            'port'=>'3306',
            'prefix'=>'ew_'
        ];
        parent::__construct($options);
    }
}
~~~

> 如果 port 是默认 3306，可以不写，prefix 表前缀，如果填写后，之后使用数据库模型的时候可以省略不写表前缀，否则每次使用模型的时候都需要写全表名



### 3.2. 使用模型

app\controllers\home\demo.php

~~~php
<?php

namespace home;
use models\BaseModel;

final class Demo extends Home
{
    public function index()
    {
        $db = new BaseModel;
        $data = $db->select('product','*');
        dd($data);
    }
}
~~~



### 3.3. 关闭错误报告

在 index.php 中关闭

~~~php
error_reporting(E_ALL &~ E_NOTICE);

~~~



### 3.4. 数据库配置信息

为了避免用户随便修改类，将数据库配置信息写在 config.inc.php 文件中

~~~php
<?php
define('TEMPDIR',__DIR__);
define('TEMPNAME','home');

define('DBTYPE', 'mysql');
define('DBNAME', 'ewshop');
define('DBHOST', 'localhost');
define('DBUSER', 'root');
define('DBPASS', '');
define('DBPORT', '3306');
define('DBPREFIX', 'ew_');

~~~



BaseModel

~~~php
<?php

namespace models;

use Medoo\Medoo;

class BaseModel extends Medoo{
    public function __construct()
    {
        $options = [
            'database_type' => DBTYPE,
            'database_name'=> DBNAME,
            'server'=>DBHOST,
            'username'=>DBUSER,
            'password'=>DBPASS,
            'port'=>DBPORT,
            'prefix'=>DBPREFIX
        ];
        parent::__construct($options);
    }
}
~~~



另外还可以配置一些如 PAGESIZE 等常量



### 3.5. medoo 用法

$db 为 medoo 的实例，通过实例调用各种数据库模型方法

手册：https://medoo.in/doc



#### **select **

~~~php
$data = $db->select('table_name', '*');
~~~



参数：

- 表名（如果定义 prefix 则不用加前缀）
- 查询字段，* 为所有字段。可指定查询字段，如：['id', 'username'] ，别名 ['link(linkname)', 'username']
- 查询条件
  - ['id' => 1], ['id[>]'=>1]
  - ['name[~]']=>张三，相当于 LIKE '%张三% '
  - ['ORDER'=>['ord'=>'DESC', 'id'=> 'ASC']]
  - ['LIMIT'=>[2,3]]



#### **debug**

调试，输出原生 SQL 语句

~~~php
$data = $db->debug()->select('link','*');
~~~



#### **get**

查询单条语句

~~~php
$data = $db->get('table','*');
~~~



#### **count**

统计数量

~~~php
$data = $db->count('link','id');
$data = $db->count('link',['id[>]'=>3]);
~~~



#### **sum**

求和

~~~php
$data = $db->sum('order','money');
~~~



#### **delete**

~~~php
$data = $db->delete('order',['id[>]'=>6]);
~~~



#### **insert**

~~~php
// 数据需要对应数据表结构，不能插入不存在的 field
$data = [
	"user_name" => "foo",
	"email" => "foo@bar.com",
	"age" => 25
]
    
$data = $db->insert('user', $data);
~~~



获取插入记录成功后的 id

~~~php
$db->id();
~~~



#### **update**

~~~php
// 数据需要对应数据表结构，不能插入不存在的 field
$data = [
	"user_name" => "foo",
	"email" => "foo@bar.com",
	"age" => 25
]
    
$data = $db->update('user', $data,['id'=>1]);
~~~



#### rowCount() 

~~~php
// rowCount() 返回影响行数  
$data = $db->update('user', ['username'=>'zhangsan'],['id'=>1]);
var_dump($data->rowCount());
~~~



# 后台管理平台

## 1. 初始化

### 1.1 导入后台模板

- app\views\admin
  - index\index.html
  - resources  - admin 独占资源
    - js
    - css
    - images
- app\views\public - 公共资源
  - js
  - css
  - images



### 1.2 控制器调用模板

app/controllers/index.php

~~~php
<?php

namespace admin;

final class Index extends Admin
{
    public function index()
    {
        $this->display('index/index.html');

    }
}
~~~



### 1.3 路由设置

/index.php

~~~php
<?php

require('vendor/autoload.php');

use NoahBuscher\Macaw\Macaw;

Macaw::get('/admin', '\admin\Index@index');

Macaw::dispatch();
~~~



此时已经可以通过 ewshop.com/admin 访问后台页面了，但是资源文件由于路由没有设置还不能访问，如：

~~~html
<link type="text/css" rel="stylesheet" href="/app/views/admin/resource/css/style.css" />
<script type="text/javascript" src="app/views/public/js/jquery.js"></script>
<script type="text/javascript" src="./app/views/public/js/global.js"></script>
~~~

> 由于是 index.php 入口调用这些文件，所以绝对路径、相对路径都是对的（但是 PHP 中的绝对路径是针对系统的，不要轻易使用 /app 这种绝对路径）



需要针对这些资源改写 .htaccess 的伪静态规则

~~~
RewriteCond %{REQUEST_URI} !^.*(\.css|\.js|\.png|\.gif|\.jpg|\.jpeg)
~~~

> 禁止伪静态重写以上文件的 url 规则



### 1.4 getCurUrl()

其实直接改写伪静态规则就可以了

在 helpers.php 中自定义方法获取当前访问地址的基础路径

~~~php
function getCurUrl(){
    $url = 'http://';
    if(isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on'){
        $url = 'https://';
    }
    if($_SERVER['SERVER_PORT'] != '80'){
        $url.= $_SERVER['SERVER_NAME'].':'.$_SERVER['SERVER_PORT'];
    } else {
        $url.= $_SERVER['SERVER_NAME'];
    }
    return $url;
}
~~~

> 当访问地址后，返回的 $url 应该是 `https://ewshop.com:443` 网站的绝对路径



控制器中传入对应文件夹的 $url 

~~~php
<?php

namespace admin;

final class Index extends Admin
{
    public function index()
    {
        $this->assign('url',$url.'/app/views/admin/resource');  // 后台模板资源路径
        $this->assign('public', $url.'/app/views/public');  // 公共资源路径
        $this->assign('uploads',$url.'/uploads');  // 上传文件路径
        $this->display('index/index.html');

    }
}
~~~



在模板文件中更改路径

~~~twig
<link type="text/css" rel="stylesheet" href="{{url}}/css/style.css" />
<script type="text/javascript" src="{{public}}/js/jquery.js"></script>
<script type="text/javascript" src="{{public}}/js/global.js"></script>
~~~



由于很多页面都会调用这些 $url，所以可以在 Admin 父类中定义

~~~php
<?php

namespace admin;

use controllers\BaseController;

abstract class Admin extends BaseController
{
    public function __construct()
    {
        $loader = new \Twig\Loader\FilesystemLoader(TEMPDIR.'/app/views/admin');
        $this->twig = new \Twig\Environment($loader, [
//            'cache' => '/path/to/compilation_cache',
        ]);
    }

    protected function display($template){
        $url = getCurUrl();
        $this->assign('url',$url.'/app/views/admin/resource');  // 后台模板资源路径
        $this->assign('public', $url.'/app/views/public');  // 公共资源路径
        $this->assign('uploads',$url.'/uploads');  // 上传文件路径
        echo $this->twig->render($template,$this->data);
    }

}
~~~



前台也是一样，如果想要实现模板更换功能在前台模板资源路径 url 加上常量 TEMPNAME

~~~html
$this->assign('url',$url.'/app/views/'.TEMPNAME.'/resource');  // 前台模板资源路径
~~~



### 1.5 分离头部、尾部

~~~html
{% include "public/header.html" %}

main

{% include "public/footer.html" %}
~~~



### 1.6 模板细节

1. 页面 title

直接在控制器中传入 title 值即可

~~~php
$this->assign('title','后台主页');
~~~



模板文件

~~~html
<title>ewshop后台管理 - {{ title }}</title>
~~~



2. 针对侧边栏点击变色问题

传入 flag，当控制器中存在 flag 值时，显示对应 class，如：

~~~php
$this->assign('menumark','category');
~~~



模板中判断 menumark 值

~~~html
<li {% if menumark == 'category' %} class="sel" {% endif %} ><a href="/admin/category">商品分类</a></li>
~~~



在控制器中，还会有其他方法，调用其他方法时，也需要传入 menumark 的值，那么就需要将代码写在构造方法中

~~~php
public function __construct()
{
    $this->assign('menumark', 'category');
    parent::__construct();  // 调用父类构造方法，防止重写

}
~~~



## 2. 后台首页统计信息

修改后台首页视图，给需要动态显示的数值添加变量，如：

~~~html
<div class="admin_t_info admin_t_info1 mat10 mal10">
    <h3>访客统计</h3>
    <ul>
        <li><a href="#" target="_blank">今日访客</a><span class="strong cgreen num">{{iplog_today}}</span>人</li>
        <li><a href="#" target="_blank">昨日访客</a><span class="strong cgreen num">{{iplog_yesterday}}</span>人</li>
        <li><a href="#" target="_blank">累计访客</a><span class="strong cgreen num">{{iplog_all}}</span>人</li>
        <li style="border-bottom:0"><a href="/admin/user" target="_blank">累计注册</a><span class="strong cgreen num">{{iplog_users}}</span>人</li>
    </ul>
</div>
~~~



控制器获取数据，并将数据传入视图

~~~php
public function index()
    {
        $db= new BaseModel();
        $data = [];

        // 上架商品
        $data['product_up'] = $db->count('product',['state'=>1]);
        // 下架商品
        $data['product_down'] = $db->count('product',['state'=>0]);
        // 缺货商品
        $data['product_empty'] = $db->count('product',['state'=>1 ,'num[<]'=>1]);
        // 推荐商品
        $data['product_rec'] = $db->count('product',['state'=>1 ,'istuijian'=>1]);


        // 将今天日期转换为时间戳
        $today = strtotime(date('Y-m-d'));
        // 将昨天日期转换为时间戳
        $yesterday = strtotime(date('Y-m-d', strtotime('-1 day')));

        // 今日访客
        $data['iplog_today'] = $db->count('iplog',['atime[>=]'=>$today]);
        // 昨日访客
        $data['iplog_yesterday'] = $db->count('iplog',['atime[>=]'=>$yesterday, 'atime[<]'=>$today]);
        // 累计访客
        $data['iplog_all'] = $db->count('iplog','*');
        // 累计注册
        $data['iplog_users']=$db->count('user','*');

        // 今日订单
    
            // 订单总数
        $data['order_today']=$db->count('order',['atime[>=]'=>$today]);
            // 订单总额
        $money_today = $db->sum('order',['atime[>=]'=>$today],'productmoney',);
            // 保留两位小数
        $data['money_today']= number_format($money_today,2,'.','');

        // 昨日订单
        $data['order_yesterday']=$db->count('order',['atime[>=]'=>$yesterday,'atime[<]'=>$today]);
        $money_yesterday = $db->sum('order',['atime[>=]'=>$yesterday,'atime[<]'=>$today],'productmoney');
        $data['money_yesterday']= number_format($money_yesterday,2,'.','');

        // 全部订单
        $data['order_total'] = $db->count('order','*');
        $money_total = $db->sum('order','productmoney');
        $data['money_total']= number_format($money_total,2,'.','');




        $this->assign('data',$data);
        $this->assign('title', '后台主页');
        $this->display('index/index.html');

    }
~~~



## 3. 友情链接

### 3.1 初始化

定义路由

~~~php
Macaw::get('/admin/link','\admin\Link@index');
~~~



控制器框架

~~~php
<?php

namespace admin;

final class Link extends Admin{
    public function __construct()
    {
        parent::__construct();
        $this->assign('menumark','link');
    }

    public function index(){
        $this->display('link/index.html');
    }

    public function add(){

    }

    public function mod(){

    }

    public function update(){

    }

    public function del(){
        
    }
    
}
~~~



修改视图

- 前后端分离
- 资源链接



### 3.2 显示友情链接页面

控制器

~~~php
public function index(){
    $db = new BaseModel();
    $data = $db->select('link','*',['ORDER'=>['order'=>'ASC','id'=>'DESC']]);
    $this->assign('data',$data);
    $this->assign('title','友情链接');
    $this->display('link/index.html');
}
~~~



视图

~~~html
{% for v in data %}
<tr>
    <td>{{v.id}}</td>
    <td><input type="text" name="ord[{{v.id}}]" value="{{v.ord}}" class="inputtext input40" /></td>
    <td>{{v.name}}</td>
    <td><a href="{{v.url}}" target="_blank">{{v.url}}</a></td>
    <td>
        <a href="/admin/link/mod/{{v.id}}" class="admin_edit mar3">修改</a>
        <a href="/admin/link/del/{{v.id}}" class="admin_del" onclick="return confirm('你确定要删除链接{{v.name}}吗？')">删除</a>
    </td>
</tr>
{% endfor %}
~~~



### 3.3 添加友情链接

路由，GET 显示添加页面，POST 处理添加请求

~~~php
Macaw::any('/admin/link/add','\admin\Link@add');
~~~



控制器

~~~php
public function add(){
    if(isset($_POST['do_submit'])){
        $db=new BaseModel();
        // 因为是直接提交 POST 数据，所以需要清空不在表中的字段
        unset($_POST['do_submit']);
        if($db->insert('link',$_POST)){
            $this->success('/admin/link','链接添加成功');
        } else {
            $this->error('/admin/link/add','链接添加失败');
        }
    }
    $this->assign('title','添加友情链接');
    $this->display('link/add.html');
}
~~~



视图

~~~html
<form method="post" action="/admin/link/add">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" class="wenzhang">
        <tr>
            <td class="bg_f8" align="right" width="100">链接名称：</td>
            <td><input type="text" name="name" value="" class="inputall input300" /> <span class="c888">(如：学习猿地)</span></td>
        </tr>
        <tr>
            <td class="bg_f8" align="right">链接地址：</td>
            <td><input type="text" name="url" value="" class="inputall input300" /> <span class="c888">(如：https://www.lmonkey.com)</span></td>
        </tr>
        <tr>
            <td class="bg_f8" align="right">链接排序：</td>
            <td><input type="text" name="ord" value="" class="inputall input50" /></td>
        </tr>
        <tr>
            <td class="bg_f8">&nbsp;</td>
            <td><input type="submit" name="do_submit" value="提 交" class="tjbtn"></td>
        </tr>
    </table>
</form>
~~~



### 3.4 修改友情链接

路由

~~~php
Macaw::get('/admin/link/mod/(:num)','\admin\Link@mod');
~~~



~~~php
public function update(){
    $db=new BaseModel();
    $id = $_POST['id'];
    unset($_POST['id']);
    if($db->update('link',$_POST, ['id'=>$id])){
        $this->success('/admin/link','更新成功');
    } else {
        $this->success('/admin/link','更新失败');
    }

}
~~~



视图

~~~php
<form method="post" action="/admin/link/update">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" class="wenzhang">
    <input type="hidden" name="id" value="{{link.id}}" />
    <tr>
    <td class="bg_f8" align="right" width="100">链接名称：</td>
    <td><input type="text" name="name" value="{{link.name}}" class="inputall input300" /> <span class="c888">(如：学习猿地)</span></td>
    </tr>
    <tr>
    <td class="bg_f8" align="right">链接地址：</td>
    <td><input type="text" name="url" value="{{link.url}}" class="inputall input300" /> <span class="c888">(如：https://www.lmonkey.com)</span></td>
                                                                                                            </tr>
                                                                                                            <tr>
                                                                                                            <td class="bg_f8" align="right">链接排序：</td>
                                                                                                            <td><input type="text" name="ord" value="{{link.ord}}" class="inputall input50" /></td>
                                                                                                            </tr>
                                                                                                            <tr>
                                                                                                            <td class="bg_f8">&nbsp;</td>
                                                                                                            <td><input type="submit" value="提 交" class="tjbtn"></td>
                                                                                                            </tr>
                                                                                                            </table>
                                                                                                            </form>
~~~



### 3.5 删除友情链接

路由

~~~php
Macaw::get('/admin/link/del/(:num)','\admin\Link@del');
~~~



控制器

~~~php
public function del($id){
    $db=new BaseModel();
    if($db->delete('link',['id'=>$id])){
        $this->success('/admin/link','删除成功');
    } else {
        $this->success('/admin/link','删除失败');
    }

}
~~~



视图

~~~html
<a href="/admin/link/del/{{v.id}}" class="admin_del" onclick="return confirm('你确定要删除链接{{v.name}}吗？')">删除</a>
~~~



### 3.6 整体排序

路由

~~~php
Macaw::post('/admin/link/order','\admin\Link@order');
~~~





控制器

~~~php
public function order()
{
    $db = new BaseModel();
    $num = 0;
    foreach ($_POST['ord'] as $id => $ord) {
        $num += $db->update('link', ['ord' => $ord], ['id' => $id])->rowCount();
    }
    if ($num > 0) {
        $this->success('/admin/link', '排序成功');
    } else {
        $this->success('/admin/link', '排序失败');
    }

}
~~~



## 4. 管理员用户

路由，都是增删改查，与友情链接类似

~~~php
// 管理员路由
Macaw::get('/admin/adminuser','\admin\AdminUser@index');
Macaw::any('/admin/adminuser/add','\admin\AdminUser@add');
Macaw::get('/admin/adminuser/mod/(:num)','\admin\AdminUser@mod');
Macaw::post('/admin/adminuser/update','\admin\AdminUser@update');
Macaw::get('/admin/adminuser/del/(:num)','\admin\AdminUser@del');
Macaw::post('/admin/adminuser/del/(:num)','\admin\AdminUser@del');
~~~



控制器

~~~php
<?php

namespace admin;

use models\BaseModel;

final class AdminUser extends Admin
{
    public function __construct()
    {
        parent::__construct();
        $this->assign('menumark', 'adminuser');
    }

    public function index()
    {
        $db = new BaseModel();
        $data = $db->select('admin', '*', ['ORDER' => ['id' => 'DESC']]);
        $this->assign('data', $data);
        $this->assign('title', '管理员用户管理');
        $this->display('adminuser/index.html');
    }

    public function add()
    {
        // 判断是否有提交表单
        if (isset($_POST['name'])) {
            $db = new BaseModel();
            // MD5 加密
            $_POST['pw'] = md5(md5('ew_&Kl' . $_POST['pw']));
            $_POST['atime'] = $_POST['ltime'] = time();

            if ($db->insert('admin', $_POST)) {
                $this->success('/admin/adminuser', '添加成功');
            } else {
                $this->error('/admin/adminuser/add', '添加失败');
            }
        }

        $this->assign('title', '添加管理员');
        $this->display('adminuser/add.html');
    }

    public function mod($id)
    {
        $db = new BaseModel();
        $data = $db->get('admin', '*', ['id' => $id]);
        $this->assign('data', $data);
        $this->assign('title', '修改管理员');
        $this->display('adminuser/mod.html');
    }

    public function update()
    {
        $db = new BaseModel();
        $id = $_POST['id'];
        unset($_POST['id']);
        // 判断密码是否为空
        if(!empty($_POST['pw'])){
            $_POST['pw'] = md5(md5('ew_&Kl' . $_POST['pw']));
        } else {
            unset($_POST['pw']);
        }
        if ($db->update('admin', $_POST, ['id' => $id])) {
            $this->success('/admin/adminuser', '更新成功');
        } else {
            $this->success('/admin/adminuser', '更新失败');
        }

    }

    public function del($id)
    {
        // 判断默认管理员
        if ($id == 9 ){
            $this->error('/admin/adminuser','默认管理员无法删除');
            die;
        }
        $db = new BaseModel();
        if ($db->delete('admin', ['id' => $id])) {
            $this->success('/admin/adminuser', '删除成功');
        } else {
            $this->success('/admin/adminuser', '删除失败');
        }

    }

}
~~~



index 视图

~~~html
{% include "public/header.html" %}
		<div class="right">
			<div class="now">
				<div class="now_l"></div>
				<div class="now_m">
					<span class="fl">管理员列表</span>
					<span class="fr fabu"><a href="/admin/adminuser/add">增加管理</a></span>
				</div>
				<div class="now_r"></div>
				<div class="clear"></div>
			</div>
			<form method="post" id="form">
				<table width="100%" border="0" cellspacing="0" cellpadding="0" class="list mat5">
					<tr>
						<td class="bgtt" width="50">ID号</td>
						<td class="bgtt">管理帐号</td>
						<td class="bgtt" width="150">上次登录</td>
						<td class="bgtt" width="88">操作</td>
					</tr>
					{% for v in data %}
					<tr>
						<td>{{v.id}}</td>
						<td>{{v.name}}</td>
						<td>{{v.ltime|date('Y-m-d H:i')}}</td>
						<td>
							<a href="/admin/adminuser/mod/{{v.id}}" class="admin_edit mar3">修改</a>

							{% if v.id != 9 %}
							<a href="/admin/adminuser/del/{{v.id}}" class="admin_del" onclick="return confirm('你确定要删除 {{v.name}} 吗？')">删除</a>
							{% endif %}
						</td>
					</tr>
					{% endfor %}
				</table>
			</form>
		</div>

{% include "public/footer.html" %}

~~~



add 视图

~~~html
{% include "public/header.html" %}
		<div class="right">
			<div class="now">
				<div class="now_l"></div>
				<div class="now_m">
					<span class="fl">添加管理员</span>
					<span class="fr fabu"><a href="/admin/adminuser/add">增加管理</a></span>
				</div>
				<div class="now_r"></div>
				<div class="clear"></div>
			</div>
			<form method="post" action="/admin/adminuser/add">
				<table width="100%" border="0" cellspacing="0" cellpadding="0" class="wenzhang">
					<tr>
						<td class="bg_f8" align="right" width="100">管理帐号：</td>
						<td><input type="text" name="name" value="" class="inputall input200" /></td>
					</tr>
					<tr>
						<td class="bg_f8" align="right">管理密码：</td>
						<td><input type="password" name="pw" class="inputall input200" autocomplete="off" /></td>
					</tr>

					<tr>
						<td class="bg_f8">&nbsp;</td>
						<td><input type="submit"  value="提 交" class="tjbtn" /></td>
					</tr>
				</table>
			</form>
		</div>

{% include "public/footer.html" %}

~~~



mod 视图

~~~html
{% include "public/header.html" %}
<div class="right">
			<div class="now">
				<div class="now_l"></div>
				<div class="now_m">
					<span class="fl">修改管理员</span>
					<span class="fr fabu"><a href="/admin/adminuser/add">增加管理</a></span>
				</div>
				<div class="now_r"></div>
				<div class="clear"></div>
			</div>
			<form method="post" action="/admin/adminuser/update">
				<table width="100%" border="0" cellspacing="0" cellpadding="0" class="wenzhang">
					<input type="hidden" name="id" value="{{data.id}}">
					<tr>
						<td class="bg_f8" align="right" width="100">管理帐号：</td>
						<td><input type="text" name="name" value="{{data.name}}" class="inputall input200" /></td>
					</tr>
					<tr>
						<td class="bg_f8" align="right">管理密码：</td>
						<td><input type="password" name="pw" class="inputall input200" autocomplete="off" /> <span class="c888">如无需修改请留空</span></td>
					</tr>
					<tr>
						<td class="bg_f8" align="right">上次登录：</td>
						<td>{{data.ltime|date('Y-m-d H:i')}}</td>
					</tr>
					<tr>
						<td class="bg_f8">&nbsp;</td>
						<td><input type="submit"  value="提 交" class="tjbtn" /></td>
					</tr>
				</table>
			</form>
		</div>
{% include "public/footer.html" %}
~~~



## 5. 管理员登录

### 5.1. 路由

~~~php
Macaw::get('/admin/login','\admin\Login@index');
~~~



### 5.2 显示登录页面

~~~php
<?php
namespace admin;

final class Login extends Admin{
    public function index(){
        $this->display('login/index.html');
    }
}
~~~



由于登录视图独立于后台视图，所以就不做头尾分离了，但是需要修改视图中的 url 路径

~~~html
<link type="text/css" rel="stylesheet" href="{{url}}/css/style.css" />
<script type="text/javascript" src="{{public}}/js/jquery.js"></script>
<script type="text/javascript" src="{{public}}/js/global.js"></script>
~~~



### 5.3 验证码

验证码功能需要下载 composer 插件 gregwar/captcha

http://packagist.p2hp.com/packages/gregwar/captcha



安装：

~~~shell
composer require gregwar/captcha
~~~



定义验证码路由

~~~php
Macaw::get('/admin/login/vcode','\admin\Login@vcode');
~~~



在控制器中调用验证码库

~~~php
<?php
namespace admin;
use Gregwar\Captcha\CaptchaBuilder;

final class Login extends Admin{
    public function index(){
        $this->display('login/index.html');
    }

    public function vcode(){
        $builder = new CaptchaBuilder;
        $builder->build();

        // 将验证码保存到 Session，并将验证码转为小写
        $_SESSION['code'] = strtolower($builder->getPhrase());

        header('Content-type: image/jpeg');
        $builder->output();
    }
}
~~~



在 index.php 入口文件开启 session

~~~php
session_start();
~~~



访问 https://ewshop.com/admin/login/vcode 即可获得验证码图像，并将验证码保存在 session['code'] 中



改写视图，让视图显示验证码

~~~html
<img src="/admin/login/vcode" class="authcode" style="cursor:pointer; position:absolute; left:128px; top:0" />
~~~



JS 控制输入字符自动转换为小写

~~~js
<input class="fl" type="text" maxlength="6" onkeyup="if(this.value!=this.value.toLowerCase()) this.value=this.value.toLowerCase()" name="code" />
~~~



JS 控制点击更换验证码

~~~js
$(function(){
    $(".authcode").click(function(){
    $(this).attr("src", $(this).attr("src") + '?time=' + new Date().getTime());
	});
}
~~~



### 5.4 提交登录信息

路由

~~~php
Macaw::post('/admin/login/dologin','\admin\Login@dologin');
~~~



登录方法

~~~php
public function dologin(){
    // 验证验证码是否正确
        if(strtolower($_POST['code']) != $_SESSION['code']){
            $this->error('/admin/login','验证码不正确');
            die;
    }
	
    // 获取 POST 登录字段
    $name = $_POST['name'];
    $pw = md5(md5('ew_$%^'.$_POST['pw']));

    $db = new BaseModel();
    // 查询用户名密码是否一致，如果一直提取 id与name字段值
    $user = $db->get('admin',['id','name'],['name'=>$name,'pw'=>$pw]);
    // 如果查询到数据，更新登录时间，并将 $user 数据保存在 Session 中，跳转
    if($user){
        $db->update('admin',['ltime'=>time()],['id'=>$user['id']])
            $_SESSION = $user;
        $this->success('/admin','用户登录成功');
	// 否则提示登录失败，跳转到登录页面
    }else{
        $this->error('/admin/login','用户登录失败');
    }

}
~~~



### 5.5 显示用户信息

需要在模板中用 {{ session.name }} 显示用户名，就需要在控制器中用 assign 传入 session，由于每个页面都需要用到 session 中的 user 信息，所以在 admin 类中的构造方法中传入 session ，全局通用。

~~~php
$this->assign('session',$_SESSION);
~~~



header 中显示用户名、用户链接

~~~html
<b>欢迎您-</b><a title="" target="_top" href="/admin/adminuser/mod/{{session.id}}">{{session.name}}</a>&nbsp;【超级管理员】 &nbsp;&nbsp;

~~~



### 5.6 验证登录信息

此时已经可以进行登录，但是如果用户直接访问 /admin 还是可以跳过登录



可以在 admin 类中简单验证一下 SESSION 中是否有 name 存在，即存在登录状态

~~~php
if (!isset($_SESSION['name'])) {
    $this->error('/admin/login', '用户必须登录才可以访问');
}
~~~



由于 login 继承 admin ，所以当用户登录时也会验证是否登录，造成死循环，需要让 login 继承 admin 上级 BaseController 绕过 admin，或者重写构造函数。

- 重写构造函数（其实就是把有关 SESSION 的去掉就可以了）

~~~php
public function __construct()
{
    $loader = new \Twig\Loader\FilesystemLoader(TEMPDIR . '/app/views/admin');
    $this->twig = new \Twig\Environment($loader, [
        //            'cache' => '/path/to/compilation_cache',
    ]);
}
~~~



- 继承 BaseController，虽然可以绕过 SESSION 验证，但是 Admin 中的 display 中定义的 $url 方法就需要重写

~~~php
final class Login extends BaseController{

    protected function display($template){
        $url = getCurUrl();
        $this->assign('url',$url.'/app/views/admin/resource');  // 后台模板资源路径
        $this->assign('public', $url.'/app/views/public');  // 公共资源路径
        $this->assign('uploads',$url.'/uploads');  // 上传文件路径
        echo $this->twig->render($template,$this->data);
    }
}

~~~



### 5.7 Token 验证

login 登录控制器给 session 加入 token 字段，加入 SERVER 信息防止 XSS，跨站攻击

~~~php
$_SESSION['admin_token'] = md5($user['id'].$_SERVER['HTTP_HOST']);
~~~



helpers.php 定义方法验证 token

~~~php
// $utype 为 admin 或 user，前后台通用方法
function ew_login($utype)
{
    return md5($_SESSION['id'] . $_SERVER['HTTP_HOST']) == $_SESSION[$utype . '_token'] ? 1 : 0;
}
~~~

> 返回1代表登录成功，0为失败



之后回到 admin 类控制器进行验证

~~~php
if(!ew_login('admin')){
    $this->error('/admin/login', '用户必须登录才可以访问');
}
~~~



### 5.8 注销

路由

~~~php
Macaw::get('/admin/logout','\admin\Login@logout');
~~~



控制器

~~~php
public function logout(){
    $_SESSION = array();
    if(!isset($_COOKIE[session_name()])){
        setcookie(session_name(),'',time()-3600,'/');
    }
    session_destroy();
    $this->success('/admin/login','管理员已退出');
}
~~~



## 6. 广告模块

- 设置广告路由，与友情链接类似
- 控制器复制友情链接
- admin 类传入 allposition 值，定义广告位置

~~~PHP
$this->assign('allposition',[1=>'首页顶部广告(980*80)',2=>'首页底部广告(980*80)',3=>'所有页面顶部广告(980*80)',4=>'所有页面底部广告(980*80)',5=>'首页焦点图广告(730*300)']);
~~~



- 显示广告

~~~html
{% for v in data %}
<tr height="60">
    <td>{{v.id}}</td>
    <td><input type="text" name="ord[{{v.id}}]" value="{{v.ord}}" class="inputtext input40" /></td>
    <td><a href="" target="_blank"><img src="" width="400" /></a></td>
    <td>{{allposition[v.position]}}</td>
    <td>
        <a href="/admin/ad/mod/{{v.id}}" class="admin_edit mar3">修改</a>
        <a href="/admin/ad/del/{{v.id}}" class="admin_del" onclick="return confirm('你确定要删除吗？')">删除</a>
    </td>
</tr>
{% endfor %}
<tr>
~~~



- 添加广告

~~~html
<td>
    <select name="position" class="inputselect">
        {% for k,v in allposition%}
        <option value="{{k}}">{{v}}</option>
        {% endfor %}
    </select>
</td>
~~~



- 修改广告（下拉菜单，id 字段，submit 删除）

~~~html
<select name="position" class="inputselect">
    {% for k,v in allposition%}
    <option {% if ad.position == k %} selected {%endif%} value="{{k}}">{{v}}</option>
    {% endfor %}
</select>
~~~



## 7. 上传文件

安装组件 slince/upload

https://packagist.p2hp.com/packages/slince/upload



### 7.1 上传图片

~~~php
public function add()
{
    if (isset($_POST['do_submit'])) {

        // 设置上传路径
        $path = TEMPDIR."/uploads/ad";
		
        // 创建文件对象
        $builder = new \Slince\Upload\UploadHandlerBuilder(); //create a builder.
        $handler = $builder
            //add constraints
            ->allowExtensions(['jpg', 'jpeg','png','gif'])
            ->allowMimeTypes(['image/*'])

            ->saveTo($path) //save to local
            ->getHandler();

        $files = $handler->handle();
        
        // 获取文件名
        $fileName = $files['logo']->getUploadedFile()->getClientOriginalName();
        
        // 新文件名
        $newFileName = date('Y-md').'-'.uniqid().'.'.$files['logo']->getUploadedFile()->getClientOriginalExtension();
        
        // 改名
        rename($path.'/'.$fileName,$path.'/'.$newFileName);

        $db = new BaseModel();
        unset($_POST['do_submit']);
        // 将文件地址传入数据库
        $_POST['logo'] = $newFileName;
        if ($db->insert('ad', $_POST)) {
            $this->success('/admin/ad', '广告添加成功');
        } else {
            $this->error('/admin/ad/add', '广告添加失败');
        }
    }
    $this->assign('title', '添加广告');
    $this->display('ad/add.html');
}
~~~



模板显示

~~~html
<td><a href="" target="_blank"><img src="{{uploads}}/ad/{{v.logo}}" width="400" /></a></td>
~~~



### 7.2 删除图片

~~~php
public function del($id)
{
    // 定义路径
    $path = TEMPDIR.'/uploads/ad';
    $db = new BaseModel();
	// 查询文件名
    $fileName = $db->get('ad','logo',['id'=>$id]);
    // 删除文件
    @unlink($path.'/'.$fileName);

    if ($db->delete('ad', ['id' => $id])) {
        $this->success('/admin/ad', '删除成功');
    } else {
        $this->success('/admin/ad', '删除失败');
    }

}
~~~



更新图片删除原有图片

~~~php
public function update()
{

    $id = $_POST['id'];
    unset($_POST['id']);
    $db = new BaseModel();

	// 当有上传文件时
    if($_FILES['logo']['error'] == 0){
        $path = TEMPDIR."/uploads/ad";

        $builder = new \Slince\Upload\UploadHandlerBuilder(); //create a builder.
        $handler = $builder
            //add constraints
            ->allowExtensions(['jpg', 'jpeg','png','gif'])
            ->allowMimeTypes(['image/*'])

            ->saveTo($path) //save to local
            ->getHandler();

        $files = $handler->handle();
        $fileName = $files['logo']->getUploadedFile()->getClientOriginalName();
        $newFileName = date('Y-md').'-'.uniqid().'.'.$files['logo']->getUploadedFile()->getClientOriginalExtension();
        rename($path.'/'.$fileName,$path.'/'.$newFileName);
        $_POST['logo'] = $newFileName;

        // 删除原图片
        $oldName = $db->get('ad','logo',['id'=>$id]);
        @unlink($path.'/'.$oldName);

    }

    if ($db->update('ad', $_POST, ['id' => $id])) {
        $this->success('/admin/ad', '更新成功');
    } else {
        $this->success('/admin/ad', '更新失败');
    }

}
~~~



## 8. 基本信息

路由（显示、修改）

~~~php
Macaw::get('/admin/setting','\admin\Setting@index');
Macaw::post('/admin/setting/update','\admin\Setting@update');
~~~



控制器（修改链接，显示方法）

~~~php
public function index()
{
    $db = new BaseModel();
    $res = $db->select('setting', '*');
    $data = [];
    foreach($res as $v){
        $data[$v['skey']] = $v['svalue'];
    }


    $this->assign('data', $data);
    $this->assign('title', '基本信息');
    $this->display('setting/mod.html');
}
~~~



- 视图（添加字段）

~~~html
<table width="100%" border="0" cellspacing="0" cellpadding="0" class="wenzhang">
    <tr>
        <td class="bg_f8" align="right" width="100">网站标题：</td>
        <td><input type="text" name="web_title" value="{{data.web_title}}" class="inputall input500" /></td>
    </tr>
    <tr>
        <td class="bg_f8" align="right">关 键 词：</td>
        <td><input type="text" name="web_keywords" value="{{data.web_keywords}}" class="inputall input500" /></td>
    </tr>
    <tr>
        <td class="bg_f8" align="right">网站描述：</td>
        <td><textarea name="web_description" style="width:500px;height:100px;">{{data.web_description}}</textarea></td>
    </tr>
    <tr>
        <td class="bg_f8" align="right">网站LOGO：</td>
        <td>
            <p class="mab5"><img src="{{uploads}}/{{data.web_logo}}" height="60" style="border:1px solid #ddd" /></p>
            <p><input type="file" name="web_logo" /></p>
        </td>
    </tr>
~~~



控制器添加修改方法

~~~php
public function update()
    {

        $db = new BaseModel();

        if($_FILES['web_logo']['error'] == 0 ){
            $path = TEMPDIR."/uploads";

            $builder = new \Slince\Upload\UploadHandlerBuilder(); //create a builder.
            $handler = $builder
                //add constraints
                ->allowExtensions(['jpg', 'jpeg','png','gif'])
                ->allowMimeTypes(['image/*'])

                ->saveTo($path) //save to local
                ->getHandler();

            $files = $handler->handle();
            $fileName = $files['web_logo']->getUploadedFile()->getClientOriginalName();
            $newFileName = date('Y-md').'-'.uniqid().'.'.$files['web_logo']->getUploadedFile()->getClientOriginalExtension();
            rename($path.'/'.$fileName,$path.'/'.$newFileName);
            $_POST['web_logo'] = $newFileName;

            // 查询 svalue 字段，条件为 skey = web_logo
            $oldName = $db->get('setting','svalue',['skey'=>'web_logo']);
            @unlink($path.'/'.$oldName);

        }

    	// 遍历更新字段
        $num = 0;
        foreach($_POST as $k=>$v){
            $num+=$db->update('setting',['svalue'=>$v],['skey'=>$k])->rowCount();
        }
        if($num>0){
            $this->success('/admin/setting','基本信息设置成功');
        } else {
            $this->error('/admin/setting','基本信息设置失败');

        }

    }
~~~



## 9. 文章分类

### 9.1 显示分类

路由

~~~php
// 文章分类
Macaw::get('/admin/aclass','\admin\Aclass@index');
Macaw::any('/admin/link/aclass','\admin\Aclass@add');
Macaw::get('/admin/aclass/mod/(:num)','\admin\Aclass@mod');
Macaw::post('/admin/aclass/update','\admin\Aclass@update');
Macaw::get('/admin/aclass/del/(:num)','\admin\Aclass@del');
Macaw::post('/admin/aclass/del/(:num)','\admin\Aclass@del');
Macaw::post('/admin/aclass/order','\admin\Aclass@order');
~~~



控制器，显示页面

~~~php
<?php

namespace admin;

use models\BaseModel;

final class Aclass extends Admin{
    public function __construct()
    {
        parent::__construct();
        $this->assign('menumark', 'ad');
    }

    public function index(){
        $db = new BaseModel();
        $data = $db->select('class','*',['ORDER'=>['ord'=>'DESC']]);
        $this->assign('title', '文章分类');
        $this->assign('data',$data);
        $this->display('aclass/index.html');
    }
}
~~~



模板，循环变量输出

~~~html
{% for v in data%}
<tr>
    <td>{{v.id}}</td>
    <td><input type="text" name="ord[{{v.ord}}]" value="{{v.ord}}" class="inputtext input40" /></td>
    <td>{{v.catname}}</td>
    <td>
        <a href="/admin/aclass/mod/{{v.id}}" class="admin_edit mar3">修改</a>
        <a href="/admin/aclass/del/{{v.id}}" class="admin_del" onclick="return confirm('你确定要删除吗？')">删除</a>
    </td>
</tr>
{% endfor %}
<tr>
~~~



### 9.2 添加分类

~~~php
    public function add(){
        if(isset($_POST['do_submit'])){
            unset($_POST['do_submit']);
            $db = new BaseModel();
            if($db->insert('class',$_POST)){
                $this->success('/admin/aclass','添加成功');
            } else{
                $this->error('/admin/aclass','添加失败');
            };
        }
        $this->assign('title','添加分类');
        $this->display('aclass/add.html');
    }
~~~



### 9.3 修改分类

~~~php
    public function mod($id){
        $db = new BaseModel();
        $data = $db->get('class','*',['id'=>$id]);
        $this->assign('data',$data);
        $this->assign('title','修改分类');
        $this->display('aclass/mod.html');
    }

    public function update(){
        $id = $_POST['id'];
        $db = new BaseModel();
        if($db->update('class',$_POST,['id'=>$id])){
            $this->success('/admin/aclass','更新成功');
        } else{
            $this->error('/admin/aclass','更新失败');
        };
    }
~~~





### 9.4 删除分类

~~~php
    public function del($id){
        $db = new BaseModel();
        if($db->delete('class',['id'=>$id])){
            $this->success('/admin/aclass','删除成功');
        } else{
            $this->error('/admin/aclass','删除失败');
        };
    }
~~~



### 9.5 分类排序

~~~php
    public function order(){
        unset($_POST['do_submit']);
        $db = new BaseModel();
        $num = 0;
        foreach($_POST['ord'] as $k=>$v){
            $num+=$db->update('class',['ord'=>$v],['id'=>$k])->rowCount();
        }
        if($num>0){
            $this->success('/admin/aclass','排序成功');
        } else{
            $this->error('/admin/aclass','排序失败');
        }
    }
~~~



## 10. 文章列表

### 10.1 显示文章

路由，没有排序，但是增加了一个批量删除

~~~php
// 文章列表
Macaw::get('/admin/article','\admin\Article@index');
Macaw::any('/admin/article/add','\admin\Article@add');
Macaw::get('/admin/article/mod/(:num)','\admin\Article@mod');
Macaw::post('/admin/article/update','\admin\Article@update');
Macaw::get('/admin/article/del/(:num)','\admin\Article@del');
Macaw::post('/admin/article/del/(:num)','\admin\Article@del');
Macaw::post('/admin/article/alldel','\admin\Article@order');
~~~



- 复制友情链接控制器，进行修改
  - 类名
  - menumark 标记名
  - 模型查询表名
  - 视图模板路径名



index 方法中，查询文章指定字段数据（id，文章名称，发布日期，浏览量）

~~~php
$data = $db->select('article',['id','name','atime','clicknum'],['ORDER'=>['id'=>'DESC']]);
~~~



- 遍历修改模板

~~~html
{% for v in data%}
<tr>
    <td><input type="checkbox" name="id[]" value="{{v.id}}"></td>
    <td>{{v.id}}</td>
    <td class="aleft"><a href="/article/{{data.id}}" target="_blank">{{v.name}}</a></td>
    <td>{{v.atime|date('Y-m-d')}}</td>
    <td>{{v.clicknum}}</td>
    <td>
        <a href="/admin/article/mod/{{v.id}}" class="admin_edit mar3">修改</a>
        <a href="/admin/article/del/{{v.id}}" class="admin_del" onclick="return confirm('你确定要删除吗?')">删除</a>
    </td>
</tr>
{% endfor %}
~~~



- 构造方法中获取文章分类

~~~php
public function __construct()
{
    parent::__construct();
    $db = new BaseModel();
    $fenlei = $db->select('class','*');
    $this->assign('fenlei',$fenlei);
    $this->assign('menumark', 'article');
}
~~~



- 视图显示分类

~~~html
<option value="0">全部分类</option>
{% for v in fenlei %}
<option  value="{{v.ord}}" >{{v.catname}}</option>
{% endfor %}
~~~



### 10.2 分页组件

jasongrimes/paginator



- use 库

~~~php
use JasonGrimes\Paginator;
~~~



- 创建分页对象，并设置参数

~~~php
$db = new BaseModel();
// 如果传递页码则使用页码，否则为1
$pagenum = $_GET['pagenum'] ?? 1;
$totalItems = $db->count('article','*');
$itemsPerPage = 10;
$currentPage = $pagenum;

// 计算每页起始编号
$start = ($currentPage - 1) * $itemsPerPage;

// GET 传参
$urlPattern = '/admin/article/?pagenum=(:num)';

$paginator = new Paginator($totalItems, $itemsPerPage, $currentPage, $urlPattern);
~~~



- 获取文章添加 LIMIT，设置 $start

~~~php
$data = $db->select('article',['id','name','atime','clicknum'],['ORDER'=>['id'=>'DESC'],'LIMIT'=>[$start,$itemsPerPage]]);
~~~



- 将分页数据传给模板

~~~php
$this->assign('fpage',$paginator);
~~~



- 前台视图显示，由于返回的是实体，而不是字符串，所以在模板中将转义关掉

~~~php
{% autoescape false %}
{{fpage}}
{% endautoescape %}
~~~



- 修改上一页下一页源代码

目前上一页、下一页都是英文，所以需要到源码中修改，\vendor\jasongrimes\paginator\src\JasonGrimes\Paginator.php

~~~php
protected $previousText = 'Previous';
protected $nextText = 'Next';
~~~



### 10.3 搜索

保存搜索关键字

~~~php
$get = $_GET;
$this->assign('get',$get);
~~~



模板保存关键字，分类

~~~html
文章名称：<input type="text" name="name" value="{{get.name}}" class="inputtext inputtext_200" />
~~~

~~~html
<option {% if get.cid == v.ord %} selected {% endif %} value="{{v.ord}}" >{{v.catname}}</option>
~~~



将搜索条件提出来

~~~php
$sql['ORDER']= ['id'=>'DESC'];
$sql['LIMIT']= [$start, $itemsPerPage];
$data = $db->select('article',['id','name','atime','clicknum'],$sql);
~~~



搜索统计需要按照搜索条件来统计总数

~~~php
// 按分类查找
$where = [];
// 当 cid 不为空时，并且 cid 不等于 0  时
if (!empty($_GET['cid']) || $_GET['cid'] != 0 ){
    $where['cid'] = $_GET['cid'];
}

// 查询文章总数
$totalItems = $db->count('article','*',$where);
~~~



文章列表查询

~~~php
// 将分类条件和普通条件合并
$sql = array_merge($sql, $where);
$data = $db->select('article',['id','name','atime','clicknum'],$sql);
~~~



按搜索关键字条件查询

~~~php
if (!empty($_GET['name'])){
    $where['name[~]'] = $_GET['name'];
}
~~~



分页传递 cid 和 name 参数

~~~php
$name = '';
$cid = $_GET['cid'];
if (!empty($_GET['cid']) || $_GET['cid'] != 0 ){
    $where['cid'] = $_GET['cid'];
    $cid = '&cid='.$_GET['cid'];
}

if (!empty($_GET['name'])){
    $where['name[~]'] = $_GET['name'];
    $name = '&name='.$_GET['name'];
}
~~~



让分页带上参数

~~~php
$urlPattern = '/admin/article?pagenum=(:num)'.$cid.$name;
~~~



### 10.4 添加文章

- 修改页面内调用的富文本编辑器、日期 js 组件的路径

~~~html
<script src="{{public}}/js/laydate.js"></script>
~~~



- 配置富文本编辑器 upload 路由

~~~php
Macaw::post('/admin/article/upload','\admin\Article@upload');
~~~



- upload 方法

~~~php
public function upload(){
    $path = TEMPDIR."/uploads/article";
    $builder = new \Slince\Upload\UploadHandlerBuilder(); //create a builder.
    $handler = $builder
        //add constraints
        ->allowExtensions(['jpg', 'jpeg','png','gif'])
        ->allowMimeTypes(['image/*'])

        ->saveTo($path) //save to local
        ->getHandler();

    $files = $handler->handle();
    $fileName = $files['file']->getUploadedFile()->getClientOriginalName();
    $newFileName = date('Y-md').'-'.uniqid().'.'.$files['file']->getUploadedFile()->getClientOriginalExtension();
    rename($path.'/'.$fileName,$path.'/'.$newFileName);


    $url = getCurUrl();
    $arr['src'] = $url.'/uploads/article/'.$newFileName;
    echo json_encode($arr);
}
~~~



添加文章加入时间戳

~~~php
public function add(){

    if(isset($_POST['do_submit'])){
        unset($_POST['do_submit']);
        $db = new BaseModel();
        // 加入时间戳
        $_POST['atime'] = time();
        if($db->insert('article',$_POST)){
            $this->success('/admin/article','添加成功');
        } else{
            $this->error('/admin/article','添加失败');
        };
    }
    $this->assign('title','添加文章');
    $this->display('article/add.html');
}
~~~





### 10.5 修改文章

- 修改 js 链接地址
- 修改传递过来的值
  - 分类信息

~~~html
<select name="cid" class="inputselect">
    {% for v in fenlei %}
    <option {% if v.id == data.cid %} selected {% endif %} value="{{v.id}}" >{{v.catname}}</option>
    {% endfor %}
</select>
~~~



- 注意时间戳转换

~~~html
<input type="text" name="atime" class="inputall input200" value = "{{data.atime|date('Y-m-d')}}" placeholder="{{data.atime|date('Y-m-d')}}" id="date">
~~~



- $_POST 中时间要转换为时间戳，存入数据库

~~~php
$_POST['atime'] = strtotime($_POST['atime']);
~~~



- 删除 do_submit 字段



### 10.6 删除文章

~~~php
public function del($id){
    $db = new BaseModel();
    if($db->delete('article',['id'=>$id])){
        $this->success('/admin/article','删除成功');
    } else{
        $this->error('/admin/article','删除失败');
    };
}
~~~



### 10.7 批量删除

~~~php
public function alldel(){
    unset($_POST['do_submit']);
    $db = new BaseModel();
    $num = 0;
    foreach($_POST['id'] as $v){
        $num+=$db->delete('article',['id'=>$v])->rowCount();
    }
    if($num>0){
        $this->success('/admin/article',$num.'篇文章删除成功');
    } else{
        $this->error('/admin/article',$num.'篇文章删除失败');
    }
}
~~~



## 11. 单页管理

路由

~~~php
// 单页列表
Macaw::get('/admin/page','\admin\Page@index');
Macaw::any('/admin/page/add','\admin\Page@add');
Macaw::get('/admin/page/mod/(:num)','\admin\Page@mod');
Macaw::post('/admin/page/update','\admin\Page@update');
Macaw::get('/admin/page/del/(:num)','\admin\Page@del');
Macaw::post('/admin/page/del/(:num)','\admin\Page@del');
Macaw::post('/admin/page/order','\admin\Page@order');

~~~



- 修改控制器
  - 类名
  - 菜单标记
  - 表名
  - 链接
  - index 页面不需要获取所有数据，指定字段

~~~php
$data = $db->select('page', ['id','name','ord'], ['ORDER' => ['ord' => 'ASC', 'id' => 'DESC']]);
~~~





- 修改模板
  - 首尾分类
  - 代入数据

~~~html
{% for v in data%}
<tr>
    <td>{{v.id}}</td>
    <td><input type="text" name="ord[{{v.id}}]" value="{{v.ord}}" class="inputtext input40" /></td>
    <td><a href="/page/{{v.id}}" target="_blank">{{v.name}}</a></td>
    <td>
        <a href="/admin/page/mod/{{v.id}}" class="admin_edit mar3">修改</a>
        <a href="/admin/page/del/{{v.id}}" class="admin_del" onclick="return confirm('你确定要删除吗？')">删除</a>
    </td>
</tr>
{% endfor %}
~~~



- js 资源路径



## 12. 无限级分类

### 12.1 初始化

- 路由

~~~php
// 商品分类
Macaw::get('/admin/category','\admin\Category@index');
Macaw::any('/admin/category/add','\admin\Category@add');
Macaw::get('/admin/category/mod/(:num)','\admin\Category@mod');
Macaw::post('/admin/category/update','\admin\Category@update');
Macaw::get('/admin/category/del/(:num)','\admin\Category@del');
Macaw::post('/admin/category/del/(:num)','\admin\Category@del');
Macaw::post('/admin/category/order','\admin\Category@order');
~~~



- 复制 aclass 控制器，并修改
  - menumark
  - 表名
  - 模板路径
  - 跳转链接路径



- 将分类查询数据放在构造方法中

~~~php
public function __construct()
{
    parent::__construct();
    $this->assign('menumark', 'category');
    $db = new BaseModel();
    $data = $db->select('category','*');
    $this->assign('data',$data);

}
~~~





### 12.2 无限级分类原理

数据库表结构增加 pid 父类，然后利用递归，重建数据结构，如：

~~~
C:\wamp64\www\ewshop\app\helpers.php:9:
array (size=13)
  14 => 
    array (size=7)
      'id' => string '14' (length=2)
      'pid' => string '0' (length=1)
      'catname' => string '前沿' (length=6)
      'ord' => string '1' (length=1)
      'path' => string '0' (length=1)
      'childs' => string '20,21' (length=5)
      'level' => int 0
  20 => 
    array (size=7)
      'id' => string '20' (length=2)
      'pid' => string '14' (length=2)
      'catname' => string '区块链' (length=9)
      'ord' => string '1' (length=1)
      'path' => string '0,14' (length=4)
      'childs' => string '' (length=0)
      'level' => int 1
~~~

> path 为父级路径，childs 为子分类，level 为几级分类



- 无限极分类库

~~~php
<?php
/** ******************************************************************************
 * lmonkey.com 无限分类处理类。                     *
 * *******************************************************************************
 * 许可声明：学习猿地教育案例
 * *******************************************************************************
 * 版权所有 (C) 2018-2020 学习猿地，并保留所有权利。           *
 * 网站地址: http://www.lmonkey.com 【学习猿地】                                       *
 * *******************************************************************************
 * $Author: 高洛峰 (g@lmonkey.com) $                                                *
 * $Date: 2019-11-20 10:00:00 $                                                  *
 * *******************************************************************************/

namespace lmonkey;

class CatTree
{
    private static $order = 'ord';  //有排序字段和表的对应，如果没有这个字段可以不写
    private static $id = 'id';      //表的id字段
    private static $pid = 'pid';    //表的父级pid字段
    private static $son = 'subcat'; //如果有子数组，子数组下标， 可以自定义值
    private static $level = 'level'; //默认的新加级别下标, 可以自定义值
    private static $path = 'path';  //默认的路径下标，可以自定义
    private static $ps = ',';     //默认的路径分隔符号，可以自己定义
    private static $childs = 'childs'; //默认的子数组下标，可以自己定义
    private static $i;               //临时的一个记数
    private static $narr = array();  //放分完级别后的数组


    /**
     *
     *  获取分类数结构
     *
     */
    public static function getTree($items)
    {
        if (empty($items))
            return array();

        $tree = array();    //格式化的树
        $tmpMap = array();    //临时扁平数据

        //如果数组中有排序字段则先排序
        if (array_key_exists(self::$order, $items[0])) {
            usort($items, array(__CLASS__, "compare"));
        }

        foreach ($items as $item) {
            $tmpMap[$item[self::$id]] = $item;
        }

        foreach ($items as $item) {
            if (isset($tmpMap[$item[self::$pid]])) {
                $tmpMap[$item[self::$pid]][self::$son][] = &$tmpMap[$item[self::$id]];
            } else {
                $tree[] = &$tmpMap[$item[self::$id]];
            }
        }
        return self::pathchild($tree);
    }


    /**
     * 设置类路路径， 和获取全部子类
     */
    private static function pathchild($arr, $path = '')
    {
        $xarr = array();


        foreach ($arr as $k => $v) {
            $xarr[$k] = $v;
            $xarr[$k][self::$path] = $path . self::$ps . $v[self::$pid];
            $xarr[$k][self::$childs] = '';

            if (isset($xarr[$k][self::$son])) {

                $xarr[$k][self::$son] = self::pathchild($xarr[$k][self::$son], $xarr[$k][self::$path]);

                foreach ($xarr[$k][self::$son] as $vv) {
                    $xarr[$k][self::$childs] .= $vv[self::$id];

                    $xarr[$k][self::$childs] .= self::$ps . $vv[self::$childs];


                }

            }


        }

        return $xarr;
    }


    /**
     *
     * 返回带有层数级别的二维数组
     * @param array $arr 从表中获取的数组
     * @return array 处理过的数组
     */

    public static function getList($arr)
    {
        return self::clevel(self::getTree($arr));
    }


    /**
     * 转多层数组为二维数组， 并加上层数组别
     */
    private static function clevel($arr, $num = 0)
    {


        self::$i = $num;
        foreach ($arr as $v) {
            if (isset($v[self::$son])) {
                $v[self::$level] = self::$i++;
                $subcat = $v[self::$son];
                unset($v[self::$son]);
                $v[self::$childs] = trim($v[self::$childs], self::$ps);
                $v[self::$path] = trim($v[self::$path], self::$ps);
                self::$narr[$v[self::$id]] = $v;
                self::clevel($subcat, self::$i);
            } else {
                $v[self::$level] = self::$i;
                $v[self::$childs] = trim($v[self::$childs], self::$ps);
                $v[self::$path] = trim($v[self::$path], self::$ps);
                self::$narr[$v[self::$id]] = $v;
            }
        }
        self::$i--;

        return self::$narr;
    }


    /**
     * 内部使用方法， 将按二维数组中的指定排序字段排序
     */

    private static function compare($x, $y)
    {

        if ($x[self::$order] == $y[self::$order])
            return 0;
        elseif ($x[self::$order] < $y[self::$order])
            return -1;
        else
            return 1;
    }

}

~~~



- 在构造函数中读取分类数据，然后利用库对原数据进行处理

需要在 index.php 引入自定义库

~~~php
require('class/cattree.php');
~~~



并且在调用库的时候引入命名空间

~~~php
use lmonkey\CatTree as CT;
~~~



实现方法

~~~php
public function __construct()
{
    parent::__construct();
    $this->assign('menumark', 'category');
    $db = new BaseModel();
    $cats = $db->select('category','*');
    $catas = CT::getList($cats);
    $this->assign('cats',$cats);

}
~~~



### 12.3 视图

- 首尾分离

- index.html 显示分类数据

~~~html
<td class="aleft">
    {% for i in 0..v.level*2%}
    &nbsp;
    {% endfor %}
    |-{{v.catname}}
</td>
~~~



- add.html 视图

~~~html
<td>
    <select name="pid" class="inputselect">
        <option value="0" selected>--根分类--</option>
        {% for v in cats %}
        <option value="{{v.id}}">
            {% for i in 0..v.level*2%}
            &nbsp;
            {% endfor %}
            |-{{v.catname}}
        </option>
        {% endfor %}
    </select>
</td>
~~~



### 12.4 分类修改

- mod.html 视图

~~~html
<select name="pid" class="inputall">
    <option value="0" {{ pid== 0 ? 'selected' : '' }}>--根分类--</option>
    {% for v in cats %}
    <option {% if data.pid == v.id %} selected {% endif %} value="{{v.id}}">
        {% for i in 0..v.level*2%}
        &nbsp;
        {% endfor %}
        |-{{v.catname}}
    </option>
    {% endfor %}
</select>
~~~



分类修改不能将现有分类放到本分类的子分类当中，也不能自己当自己的子分类，那么在修改页面就需要获取该分类的子分类信息，可以通过 index.html 中用 GET 提交这些数据

~~~html
<a href="/admin/category/mod/{{v.id}}?pid={{v.pid}}&childs={{v.childs}}" class="admin_edit mar3">修改</a>
~~~

> 建议用不要携带这些参数在 GET 中，而是在控制器中从数据库中查找



控制器拿到 childs

~~~php
$data['childs'] == $_GET['childs'];
~~~



视图传递 POST

~~~html
<input type="hidden" name="id" value="{{data.id}}" -->
<input type="hidden" name="childs" value="{{data.childs}}">
~~~



控制器进行判断

~~~php
// 将子类、自己
$_POST['childs'] .= ','.$_POST['id'];

// 当传递过来的父类等于自己子类或自己时，跳转
if(in_array($_POST['pid'], explode(',',$_POST['childs']))){
    $this->error('/admin/category','不能将分类修改到自己或自己的子类中');
    exit;
}
~~~



控制器

~~~php
public function update(){
    $id = $_POST['id'];
    $_POST['childs'] .= ','.$_POST['id'];
    if(in_array($_POST['pid'], explode(',',$_POST['childs']))){
        $this->error('/admin/category','不能将分类修改到自己或自己的子类中');
        exit;
    }
    
    // 删掉数据库中没有字段
    unset($_POST['childs']);

    $db = new BaseModel();
    if($db->update('category',$_POST,['id'=>$id])){
        $this->success('/admin/category','更新成功');
    } else{
        $this->error('/admin/category','更新失败');
    };
}
~~~



### 12.5 删除

防止删除会出现断链情况

- 分类中有文章或商品不能删
- 分类中有子分类不能删



~~~html
<a href="/admin/category/del/{{v.id}}?childs={{v.childs}}" class="admin_del" onclick="return confirm('你确定要删除分类吗?')">删除</a>
~~~

> 感觉利用 get 删除好危险，如果删除 childs 参数，那么可以直接删



控制器

~~~php
if($_GET['childs'] != ''){
        $this->error('/admin/category','不能删除非空分类');
        exit;
    };
}
~~~



另外视图隐藏有子类的删除按钮

~~~html
{% if v.childs == '' %}
<a href="/admin/category/del/{{v.id}}?childs={{v.childs}}" class="admin_del" onclick="return confirm('你确定要删除分类吗?')">删除</a>
{% endif %}
~~~



## 13. 商品列表

### 13.1 初始化

- 路由（增加上下架、推荐路由）

~~~php
// 商品列表
Macaw::get('/admin/product','\admin\Product@index');
Macaw::any('/admin/product/add','\admin\Product@add');
Macaw::get('/admin/product/mod/(:num)','\admin\Product@mod');
Macaw::post('/admin/product/update','\admin\Product@update');
Macaw::get('/admin/product/del/(:num)','\admin\Product@del');
Macaw::post('/admin/product/del/(:num)','\admin\Product@del');
Macaw::post('/admin/product/alldel','\admin\Product@alldel');
Macaw::post('/admin/product/state/(:num)','\admin\Product@state');
Macaw::post('/admin/product/tujian/(:num)','\admin\Product@tuijian');
~~~



- 构造方法拿到产品分类信息

~~~php
public function __construct()
{
    parent::__construct();
    $db = new BaseModel();
    $cats = $db->select('category','*');
    $cats = CT::getList($cats);
    $this->assign('cats',$cats);
    $this->assign('menumark', 'product');
}
~~~



- 处理模板
  - 首尾分离



### 13.2 搜索框分类部分

当按搜索按钮时，会通过 get 参数传递 cid 值，通过判断 cid 值，来给 selected 属性

~~~html
<select name="cid" class="inputselect">
    <option value="0" {{get.cid == 0?'selected':''}}>--根分类--</option>
    {% for v in cats %}
    <option {{get.cid == v.id?'selected':''}} value="{{v.id}}" >
        {% for i in 0..v.level %}
        &nbsp;
        {% endfor %}
        |-{{v.catname}}
    </option>
    {% endfor %}
</select>
~~~



特价商品

查看视图，前端已经做好了表单 value 形式为

~~~html
<option  value="istuijian|1" >推荐商品</option>
~~~

当提交查询的时候，会以 get 方式传参，如： `&filter=istuijian|1 `



所以创建数组 filter_arr

~~~php
// 过滤信息
$filter_arr = ['istuijian|1'=>'推荐商品', 'istj|1'=>'特价商品','wlmoney|0'=>'包邮商品','num|0'=>'售空商品'];
$this->assign('filter_arr',$filter_arr) ;
~~~



视图显示

同样需要保留 get 搜索的记录

~~~html
<select name="filter" class="inputselect">
    <option value="">全部商品</option>
    {%for k,v in filter_arr%}
    <option {{get.filter == k?'selected':''}} value="{{k}}" >{{v}}</option>
    {%endfor%}
</select>
~~~



同理排序过滤

~~~php
$orderby_arr = array(
    'clicknum|desc'=>'浏览量(多到少)',
    'sellnum|desc'=>'销售量(少到多)',
    'num|desc'=>'库存量(多到少)',
    'num|asc'=>'库存量(少到多)',
    'collectnum|desc' => '收藏数(多到少)',
    'collectnum|asc' => '收藏数(少到多)',
    'asknum|desc'=> '咨询数(多到少)',
    'asknum|asc'=> '咨询数(少到多)',
    'commentnum|desc' => '评价数(多到少)',
    'commentnum|asc' => '评价数(少到多)',
);
$this->assign('orderby_arr',$orderby_arr);
~~~



视图显示

~~~html
<select name="orderby" class="inputselect">
    <option value="">默认排序</option>
    {% for k,v in orderby_arr%}
    <option {{get.orderby == k?'selected':''}} value="{{k}}"  > {{v}} </option>
    {%endfor%}
</select>
~~~



商品名称保存搜索记录

原来的控制器已经保存了所有传递的 $_GET 参数

~~~php
$get = $_GET;
$this->assign('get',$get);
~~~



视图只要把 name 值传回去就可以了

~~~php
商品名称：<input type="text" name="name" value="{{get.name}}" class="inputtext" />
~~~



上架、下架商品保存标记

~~~html
<a href="/admin/product?state=1" {{get.state == '1'?'class="sel"':''}}>出售中商品</a>
| <a href="/admin/product?state=0" {{get.state == '0'?'class="sel"':''}}>下架的商品</a>
~~~



点击搜索后，get 参数中没有 state

~~~html
https://ewshop.com/admin/product?name=&cid=0&filter=&orderby=
~~~



需要添加隐藏表单，把 state 传回来即可

~~~html
<input type="hidden" name="state" value="{{get.state}}"/>
~~~



### 13.3 添加查询条件

~~~php
// 按出售下架查找
$where = [];
if(isset($_GET['state']) && $_GET['state'] != ''){
    $where['state']= $_GET['state'];
    $state = "&state=".$_GET['state'];
}

// 按商品名称查找
if(!empty($_GET['name'])){
    $where['name[~]']= $_GET['name'];
    $name = "&name=".$_GET['name'];
}

// 按商品分类查找
if(!empty($_GET['cid'])){
    $where['cid']= $_GET['cid'];
    $cid = "&cid=".$_GET['cid'];
}

// 商品特价查找
if(!empty($_GET['filter'])){
    list($field, $value) = explode('|', $_GET['filter']);
    $where[$field]= $value;
    $filter = "&filter=".$_GET['filter'];
}

// 按排序查找
if(!empty($_GET['orderby'])){
    list($field, $value) = explode('|', $_GET['orderby']);
    // $sql['ORDER']= [$field => strtoupper($value)];
    // 多排序查询  ['ORDER'=>['ord'=>'DESC', 'id'=> 'ASC']]
    // 如果之前还有 ORDER 条件的话，可以追加
    $sql['ORDER'][$field] = strtoupper($value);
    $orderby = '&orderby='.$_GET['orderby'];
} else {
    $sql['ORDER']= ['id'=>'DESC'];
}
~~~



- 查询商品所有字段

~~~php
$data = $db->select('product','*',$sql);
~~~



### 13.4 插入数据到模板

~~~html
{% for v in data %}
<tr>
    <td><input type="checkbox" name="id[]" value="{{v.id}}" /></td>
    <td>{{v.id}}</td>
    <td class="aleft">
        <span class="fl mar5" style="border:1px solid #ddd"><img src="/uploads/product/{{v.logo}}" width="45" height="45"></span>
        <a class="cblue" href="/product/{{v.id}}" target="_blank">{{v.name}}</a>{%if v.istuijian == 1 %}<span class="cred">[荐]</span>{%endif%} {%if v.istj == 1 %}<span class="cgreen">[特]</span>{%endif%}		</td>
    <td class="font13">{{cats[v.cid].catname}}</td>
    <td><span class="num font16 cred strong">{{v.money}}</span></td>
    <td><span class="font14 corg num strong">{{v.sellnum}}</span>/{{v.num}}</td>
    <td>10</td>
    <td>
        <a href="/admin/product/mod/{{v.id}}" class="admin_edit mar3">修改</a>
        <a href="/admin/product/del/{{v.id}}" class="admin_del" onclick="confirm('你确定要删除 {{v.name}} 吗？')">删除</a>
    </td>
</tr>
{% endfor %}
~~~



### 13.5 处理分页

~~~php
$urlPattern = '/admin/product?pagenum=(:num)'.$state.$name.$cid.$filter.$orderby;
~~~



视图

~~~html
{% autoescape false %}
{{fpage}}
{% endautoescape %}
~~~



### 13.6 发布商品

Logo 上传

~~~php
if($_FILES['logo']['error'] == 0){
    $path = TEMPDIR."/uploads/product";
    $builder = new \Slince\Upload\UploadHandlerBuilder(); //create a builder.
    $handler = $builder
        //add constraints
        ->allowExtensions(['jpg', 'jpeg','png','gif'])
        ->allowMimeTypes(['image/*'])

        ->saveTo($path) //save to local
        ->getHandler();

    $files = $handler->handle();
    $fileName = $files['logo']->getUploadedFile()->getClientOriginalName();
    $newFileName = date('Y-md').'-'.uniqid().'.'.$files['logo']->getUploadedFile()->getClientOriginalExtension();
    rename($path.'/'.$fileName,$path.'/'.$newFileName);
    $_POST['logo'] = $newFileName;
}
~~~



单选框处理

~~~php
$_POST['istj'] = isset($_POST['istj']) ? 1:0;
~~~



视图处理分类、链接

~~~html
<select name="cid" class="inputall">
    <option value="0" selected>--根分类--</option>
    {% for v in cats %}
    <option value="{{v.id}}" >
        {%for i in 0..v.level*2%}
        &nbsp;
        {%endfor%}
        |-{{v.catname}}
    </option>
    {% endfor %}
</select>
~~~



~~~html
<script src="{{public}}/js/tinymce/tinymce.min.js"></script>
<script src="{{public}}/js/fwb.js"></script>
<script src="{{public}}/js/laydate.js"></script>
~~~



### 13.7 修改商品

视图读取分类，并添加 selected 标签

~~~html
<select name="cid" class="inputall">
    <option value="0" {{data.cid == 0?'selected':''}}>--根分类--</option>
    {% for v in cats %}
    <option value="{{v.id}}" {{ data.cid == v.id?'selected' : '' }}>
        {%for i in 0..v.level*2%}
        &nbsp;
        {%endfor%}
        |-{{v.catname}}
    </option>
    {% endfor %}
</select>
~~~



单选框

~~~html
<td><input type="checkbox"  name="istj"  {{data.istj == 1?'checked':''}}  value="1"/></td>
~~~



控制器

~~~php
public function update(){
    $id = $_POST['id'];

    if($_FILES['logo']['error'] == 0){
        $path = TEMPDIR."/uploads/product";
        $builder = new \Slince\Upload\UploadHandlerBuilder(); //create a builder.
        $handler = $builder
            //add constraints
            ->allowExtensions(['jpg', 'jpeg','png','gif'])
            ->allowMimeTypes(['image/*'])

            ->saveTo($path) //save to local
            ->getHandler();

        $files = $handler->handle();
        $fileName = $files['logo']->getUploadedFile()->getClientOriginalName();
        $newFileName = date('Y-md').'-'.uniqid().'.'.$files['logo']->getUploadedFile()->getClientOriginalExtension();
        rename($path.'/'.$fileName,$path.'/'.$newFileName);
        $_POST['logo'] = $newFileName;
    }

    $_POST['atime'] = strtotime($_POST['atime']);
    $_POST['istj'] = isset($_POST['istj']) ? 1:0;

    $db = new BaseModel();
    if($db->update('product',$_POST,['id'=>$id])){
        $this->success('/admin/product','更新成功');
    } else{
        $this->error('/admin/product','更新失败');
    };
}
~~~



### 13.8 批量操作商品

~~~php
public function alldel(){
    unset($_POST['do_submit']);
    $db = new BaseModel();
    $num = 0;
    foreach($_POST['id'] as $v){
        $num+=$db->delete('product',['id'=>$v])->rowCount();
    }
    if($num>0){
        $this->success('/admin/product','删除成功');
    } else{
        $this->error('/admin/product','删除失败');
    }
}

public function state($state){
    unset($_POST['do_submit']);
    $db = new BaseModel();
    $num = 0;
    foreach($_POST['id'] as $v){
        $num+=$db->update('product',['state'=>$state],['id'=>$v])->rowCount();
    }
    if($num>0){
        $this->success('/admin/product','批量更新成功');
    } else{
        $this->error('/admin/product','批量更新失败');
    }
}

public function tuijian($tuijian){
    unset($_POST['do_submit']);
    $db = new BaseModel();
    $num = 0;
    foreach($_POST['id'] as $v){
        $num+=$db->update('product',['istuijian'=>$tuijian],['id'=>$v])->rowCount();
    }
    if($num>0){
        $this->success('/admin/product','批量更新成功');
    } else{
        $this->error('/admin/product','批量更新失败');
    }
}
~~~



## 14. 支付模块

因为支付比较固定，并且每个支付模块字段都不一样，所以一般不写添加支付方式，而支付模块的参数用 JSON 传递

~~~php
// 支付模块
Macaw::get('/admin/payway','\admin\Payway@index');
Macaw::get('/admin/payway/mod/(:num)','\admin\Payway@mod');
Macaw::post('/admin/payway/update','\admin\Payway@update');
Macaw::post('/admin/payway/order','\admin\Payway@order');
~~~



列表页面

~~~html
{%for v in data%}
<td><input type="text" name="ord[{{v.id}}]" value="{{v.ord}}" class="inputtext input40" /></td>
<td>{{v.name}}</td>
<td class="aleft">{{v.ptext}}</td>
{% if v.state == 1 %}
<td><span class="cgreen">启用</span></td>
{% else %}
<td><span class="cred">停用</span></td>
{% endif %}
<td><a href="/admin/payway/mod/{{v.id}}" class="admin_edit">修改</a></td>
</tr>
{% endfor %}
~~~



修改页面

~~~php
<option value="1" {{ data.state ==1 ?'selected':''}}>启用</option>
<option value="0" {{ data.state ==0 ?'selected':''}}>停用</option>
~~~



如果选项过多的话

~~~php
$opt = array(
    '1'=>'启用',
    '0'=>'停用'
);

$this->assign('opt',$opt);
~~~



~~~html
<select name="state" class="inputselect">
    {% for k,v in opt %}
    <option value="{{k}}" {{ data.state == k ?'selected':''}} > {{v}} </option>
    {% endfor %}
</select>
~~~



# 前端

## 1. 首页

Home 父类控制器

~~~php
<?php

namespace home;

use controllers\BaseController;

abstract class Home extends BaseController
{
    public function __construct()
    {
        $loader = new \Twig\Loader\FilesystemLoader(TEMPDIR.'/app/views/home');
        $this->twig = new \Twig\Environment($loader, [
//            'cache' => '/path/to/compilation_cache',
        ]);
    }

    // 子类调用 display 方法时，传递 url
    protected function display($template){
        $url = getCurUrl();
        $this->assign('res',$url.'/app/views/home/resource');  // 前台模板资源路径
        $this->assign('public', $url.'/app/views/public');  // 公共资源路径
        $this->assign('uploads',$url.'/uploads');  // 上传文件路径
        echo $this->twig->render($template,$this->data);
    }

}
~~~



首页路由

~~~php
// 首页
Macaw::get('/','\home\Index@index');
~~~



- 创建 public 文件夹，做首尾分离，改写 url
  - home\public\header.html
  - home\public\footer.html
- 修改 home\index\index.html 主体文件



## 1. 获取数据



## 2. 公共数据

有一些公共数据的获取，每个页面都需要，可以将获取数据的方法放在 home 类下，然后再构造方法中调用该方法，前台每个控制器都会自动调用

~~~php
public function __construct()
{
    $loader = new \Twig\Loader\FilesystemLoader(TEMPDIR.'/app/views/home');
    $this->twig = new \Twig\Environment($loader, [
        //            'cache' => '/path/to/compilation_cache',
    ]);
    $this->init();
}

protected function init(){
    
}
~~~

> 经常调用，可以使用缓存，用户读取先从缓存读取，如果缓存中没有才执行 PHP



### 2.1 setting 数据

setting 表中存放着网站标题、备案、LOGO 等信息，修改视图文件

~~~php
protected function init(){
    // 获取设置信息
    $db = new BaseModel();
    $allsettings = $db->select('setting','*');

    $settings =[];
    foreach($allsettings as $v){
        $settings[$v['skey']] =  $v['svalue'];
    }
    // 添加 QQ 数组
    $settings['web_qqs'] = explode(',',$settings['web_qq']);

    $this->assign('settings',$settings);
}
~~~



- 视图调用

~~~html
<title>EWShop - {{settings.web_title}}</title>
<meta name="keywords" content="{{settings.web_keywords}}"/>
<meta name="description" content="{{settings.web.description}}"/>
~~~



### 2.2 分类信息

控制器

~~~PHP
$this->assign('cats',$db->select('category','*',['pid'=>'0', 'ORDER'=>['ord'=>'ASC','id'=>'ASC']],['LIMIT'=>'8']));
~~~

> pid = 0 根分类，排序按 ord 正序，如果 ord 相等按 id 正序，限量8个



视图

~~~html
{% for v in cats %}
<li><a href="/plist/{{v.id}}">{{v.catname}}</a></li>
{% endfor %}
~~~



### 2.3 广告信息

~~~php
$this->assign('ads',$db->select('ad','*'));
~~~



之前定义过广告类型

~~~
$this->assign('allposition',[1=>'首页顶部广告(980*80)',2=>'首页底部广告(980*80)',3=>'所有页面顶部广告(980*80)',4=>'所有页面底部广告(980*80)',5=>'首页焦点图广告(730*300)']);
~~~



首页页面顶部广告  == 1，如果 url 为空则只显示图片

~~~html
{% for v in ads %}
{% if v.position == '1' %}
<div class="ad980">
    {% if v.url == '' %}
    <img src="{{uploads}}/ad/{{v.logo}}" width="980" height="80"/>
    {%else%}
    <a href="{{v.url}}" target="_blank">
        <img src="{{uploads}}/ad/{{v.logo}}" width="980" height="80"/>
    </a>
    {%endif%}
</div>
{% endif %}
{% endfor %}
~~~

> 同理在对应位置插入其他广告区域



### 2.4 单页信息

~~~php
$this->assign('pages',$db->select('page',['id','name'],['ORDER'=>['ord'=>'DESC']]));
~~~



~~~html
{% for i in 0..2 %}
<li><a href="/page/{{pages[i]}}" title="订单查询">{{pages[i].name}}</a></li>
{% endfor %}
~~~



### 2.5 友情链接

~~~php
$this->assign('links',$db->select('link','*',['ORDER'=>['ord'=>'DESC']]));
~~~



~~~php
<div class="flink">
    <span class="strong">友情链接：</span>
{% for v in links %}
<a href="{{v.url}}" title="{{v.name}}" target="_blank">{{v.name}}</a>
{% endfor %}
</div>
~~~



### 2.6 公共信息其他数据

- 用户登录信息
- 购物车信息
- 访客统计信息



登录信息和购物车需要将会员模块做好后再编写，访客统计代码如下：

- 在 helpers 中添加获取用户IP函数

~~~php
//获取用户IP， 定义一个函数getIP()
function getClientIP(){
    if (getenv("HTTP_CLIENT_IP")) {
        $ip = getenv("HTTP_CLIENT_IP");
    }elseif(getenv("HTTP_X_FORWARDED_FOR")) {
        $ip = getenv("HTTP_X_FORWARDED_FOR");
    }elseif(getenv("REMOTE_ADDR")) {
        $ip = getenv("REMOTE_ADDR");
    }else{
        $ip = "Unknow";
    }
    return $ip;
}
~~~



~~~php
$db->insert('iplog',['ip'=> getClientIP(), 'atime'=>time()]);
~~~



## 3. 首页数据

### 3.1 幻灯片广告

集成在了广告列表当中，但是最好将幻灯片单独做一个模块出来

~~~html
<!--幻灯片 Start -->
<div class="jdt fl">
    <div id="jdtslide" style="visibility:hidden;">
        {% for v in ads %}
        {% if v.position == '5' %}
        {% if v.url == '' %}
        <a href="https://www.eduwork.cn">
            <img src="{{uploads}}/ad/{{v.logo}}" width="533" height="300"/>
        </a>
        {%else%}
        <a href="{{v.url}}" target="_blank">
            <img src="{{uploads}}/ad/{{v.logo}}" width="533" height="300"/>
        </a>
        {%endif%}
        {% endif %}
        {% endfor %}
    </div>
</div>
<!--幻灯片 end -->
~~~



### 3.2 商品信息

- 特价商品
  - istj => 1, state=> 1, ORDER => ['id'=>'DESC'], LIMIT=>'3'

~~~php
$this->assign('tjs',$db->select('product','*',['istuijian'=>'1', 'state'=>'1', 'ORDER'=>['id'=>'DESC'],'LIMIT'=>3]));
~~~



~~~html
<div class="tj_list">
    <ul class="hotlist index_tj" style="height:421px;border:0px">
        {% for v in tjs %}
        <li>
            <span class="fl hotimg">
                <a href="/product/{{v.id}}" title="{{v.name}}" target="_blank">
                    <img src="{{public}}/images/load.gif" data-original="{{uploads}}/product/{{v.logo}}" width="60" height="60" title="{{v.name}}"/>
                </a>
            </span>
            <span class="fl hotname tjname_index">
                <a href="/product/{{v.id}}" title="{{v.name}}" target="_blank">{{v.name}}</a>
                <span class="lh20">
                    <span class="cred num strong"><small>￥</small></span>
                    <span class="num1 cred">{{v.money}}</span>
                    <s class="num c888"><small>￥</small> {{v.smoney}}</s>
                </span>
            </span>
            <div class="clear"></div>
        </li>
        {% endfor %}
    </ul>
</div>
~~~



- 网站公告

~~~php
$this->assign('notices',$db->select('article',['id','name'],['cid'=>'1','ORDER'=>['id'=>'DESC'],'LIMIT'=>8]));
~~~



~~~html
<ul>
    {% for v in notices %}
    <li><a href="/article/{{v.id}}" title="{{v.name}}" target="_blank">{{v.name}}</a></li>
    {% endfor %}
</ul>
~~~



- 新品推荐

~~~php
$this->assign('tuijians',$db->select('product',['id','name','logo','money','smoney'],['istuijian'=>'1','state'=>'1','ORDER'=>['id'=>'DESC'],'LIMIT'=>5]));
~~~



~~~html
{% for v in tuijians %}
<div class="prolist_1">
    <p class="prolist_img">
        <a href="/product/{{v.id}}" title="{{v.name}}" target="_blank">
            <img  src="{{public}}/images/load.gif" data-original="{{uploads}}/product/{{v.logo}}" width="150" height="150" title="{{v.name}}"/>
        </a>
    </p>
    <p class="prolist_name">
        <a href="/product/{{v.id}}" title="{{v.name}}" target="_blank">{{v.name}}</a>
    </p>
    <p>
        <span class="money1"><small>￥</small>{{v.money}}</span>
        <s class="num c888"><small>￥</small>{{v.smoney}}</s>
    </p>
</div>
{% endfor %}}
~~~



- 分类数据
  - 可以通过联表查询，不过有些耗费资源，所以使用 PHP 对数据进行处理

~~~php
$allcats = [];
foreach ($cats as $cat){
    $cat['newlist'] = $db->select('product',['id','name','logo','money','smoney'],
                                  ['cid'=>$cat['id'],'state'=>'1','ORDER'=>['id'=>'DESC'],'LIMIT'=>8]);
    array_push($allcats,$cat);
}
$this->assign('allcats',$allcats);
~~~



~~~html
<!--所有分类 和对应分类热销排行 Start-->
{% for v in allcats %}
<div class="index_fenlei mat10">
    <div class="index_fenlei_tt">
        <h3 class="fl">{{v.catname}}</h3>
        <span class="fr"><a href="/plist/{{v.id}}" title="{{v.name}}"target="_blank">更多>></a></span>
    </div>

    <div class="index_prolist">
        <div class="fl prolist_left">
            {% for i in v.newlist %}
            <div class="prolist_1">
                <p class="prolist_img">
                    <a href="/product/{{i.id}}" title="{{i.name}}" target="_blank">
                        <img src="{{public}}/images/load.gif" data-original="{{uploads}}/product/{{i.logo}}" width="150" height="150" title="{{i.name}}"/>
                    </a>
                </p>
                <p class="prolist_name">
                    <a href="/product/{{i.id}}" title="{{i.name}}" target="_blank">{{i.name}}</a>
                </p>
                <p>
                    <span class="money1"><small>￥</small>{{i.money}}</span>
                    <s class="num c888"><small>￥</small> {{i.smoney}}</s>
                </p>
            </div>
            {% endfor %}
        </div>


        <div class="fr prolist_right">
            <div class="prolist_right_tt"><h3>{{v.name}}热销排行</h3></div>
            <ul class="hotlist index_hot" style="height:421px;">
                {% for sl in v.sellnum %}
                <li>
                    <span class="fl hotimg">
                        <a href="/product/{{sl.id}}" title="{{sl.name}}" target="_blank">
                            <img src="{{public}}/images/load.gif" data-original="{{uploads}}/product/{{sl.logo}}" width="60" height="60" title="{{sl.name}}"/>
                        </a>
                    </span>

                    <span class="fl hotname hotname_index">
                        <a href="/product/{{sl.id}}" title="{{sl.name}}" target="_blank">{{sl.name}}</a>
                        <span class="lh20">
                            <span class="cred num strong"><small>￥</small></span>
                            <span class="num1 cred">{{sl.money}}</span>
                        </span>
                    </span>

                    <div class="clear"></div>
                </li>
                {% endfor %}
            </ul>
        </div>
        <div class="clear"></div>
    </div>
</div>
{%endfor%}
<!--所有分类 和对应分类热销排行 End-->
~~~





## 4. 列表页面

路由

~~~php
Macaw::get('/plist/(:num)','\home\Product@plist');
~~~



控制器

~~~php
<?php
namespace home;

use models\BaseModel;

final class Product extends Home{
    public function plist($pid=0){
        $db= new BaseModel();
        $this->display('/product/plist.html');

    }
}
~~~



### 4.1 分类信息

~~~php
<?php
namespace home;

use models\BaseModel;

final class Product extends Home{
    public function plist($pid=0){
        $db= new BaseModel();
        // 获取根分类
        $cats = $db->select('category','*',['pid'=>'0']);
		
        // 准备空数组
        $allcats = [];
        
        // 遍历每个分类，遍历该分类下的子分类，给 $cats 下的子分类增加新的索引
        foreach ($cats as $cat){
            $cat['subcats'] = $db->select('category','*',
                ['pid'=>$cat['id']]);
            // 将每个 cat 压入空数组
            array_push($allcats,$cat);
        }
        $this->assign('allcats',$allcats);
        $this->display('/product/plist.html');

    }
}
~~~



列表页分类视图

~~~html
<div class="hotlist spfl">
    {% for v in allcats %}
    <div class="zhulei"><a href="/plist/{v.id}" class="sel">{{v.catname}}</a></div>
    <div class="clear"></div>
    <div class="zilei">
        {% for zl in v.subcats %}
        <a href="/plist/{zl.id}" class="sel">{{zl.catname}}</a>
        {% endfor %}
        <div class="clear"></div>
    </div>
    {% endfor %}
</div>
~~~



每个页面显示全部分类，如果想要每个页面显示对应分类，并且显示该分类下的子类的话，那么需要将 $pid 传入查询语句

~~~php
$cats = $db->select('category','*',['pid'=>$pid]);
~~~



看了下模板调用，也用不到那么多字段，精简一下，只查询 ['id', 'catname']



### 4.2 面包屑导航

先将首页地址传过去

~~~php
$nowpath = "您现在的位置：<a href='/'>首页</a>";
$this->assign('nowpath',$nowpath);
~~~



视图

~~~html
{% autoescape false %}
{{nowpath}}
{% endautoescape %}
~~~



查询所有分类数据

~~~php
$fullcats = $db->select('category','*');
$newcats = CatTree::getList($fullcats);
// 获得路径
dd($newcats[$pid]['path']);
~~~

> 0,16,25



因为已经有了顶级路径 0， 将 0, 去掉，然后加上自己本身的分类

~~~php
// 按逗号分解成为数组
$breadlist = explode(',',$newcats[$pid]['path']);
// 将本身分类id添加到数组中
$breadlist[] = $pid;
// 移除根分类
array_shift($breadlist);
~~~



现在有了分类 id 数组，进行遍历，拼接 nowpath

~~~php
foreach($breadlist as $cat){
    $tmp_id = $newcats[$cat]['id'];
    $tmp_name = $newcats[$cat]['catname'];
    $nowpath.= " &gt; <a href='/plist/{$tmp_id}'>{$tmp_name}</a>";
}
~~~



### 4.3 热销排行

热销排行里边的数据是该分类下所有商品数据

~~~php
// 热销排行（需要查询该分类下的所有子分类）
$childs = explode(',',$fullcats[$pid]['childs']);
// 当没有子类的时候，移除数组中的第一个数据
if ($childs[0] == ''){
    array_shift($childs);
}
$childs[] = $pid;

// 如果传入的是根分类，pid == 0  的情况下，那么查询所有子类数据
if ($childs[0] == '0') {
    $sell_data = $db->select('product', ['id', 'name', 'logo', 'money', 'smoney'], ['ORDER' => ['sellnum' => 'DESC','id'=>'ASC'], 'LIMIT' => '6']);
} else {
    // 否则查看该分类的所有子类数据
    $sell_data = $db->select('product', ['id', 'name', 'logo', 'money', 'smoney'], ['cid' => $childs, 'ORDER' => ['sellnum' => 'DESC','id'=>'ASC'], 'LIMIT' => '6']);
}
$this->assign('sell_data',$sell_data);
~~~



视图

~~~html
<ul class="hotlist">
    {% for v in sell_data %}
    <li>
        <span class="fl hotimg">
            <img src="{{public}}/images/load.gif" data-original="{{uploads}}/product/{{v.logo}}" width="60" height="60" title="{{v.name}}" />
        </span>
        <span class="fl hotname">
            <a href="/product/{{v.id}}" title="{{v.name}}" target="_blank">{{v.name}}</a>
            <span class="cred num strong lh20"><small>￥</small>{{v.money}}</span>
        </span>
        <div class="clear"></div>
    </li>
    {% endfor %}
</ul>
~~~





### 4.4 商品列表

首先把所有数据获取出来

~~~php
// 主体列表数据
$data = $db->select('product', ['id', 'name', 'logo', 'money', 'smoney'],['ORDER'=>['id'=>'ASC'], 'LIMIT'=>'12']);
$this->assign('data',$data);
~~~



然后再视图中填充数据

~~~html
<div class="prolist">
    {% for v in data %}
    <div class="prolist_1 prolist_border">
        <p class="prolist_img prolist_img1">
            <a href="/product/{{v.id}}" title="{{v.name}}" target="_blank">
                <img src="{{public}}/images/load.gif" data-original="{{uploads}}/product/{{v.logo}}"  width="150" height="150" title="{{v.name}}" style="display:block" />
            </a>
        </p>
        <p class="prolist_name">
            <a href="/product/{{v.id}}" title="{{v.name}}" target="_blank">{{v.name}}</a>
        </p>
        <p>
            <span class="money1"><small>￥</small>{{v.money}}</span> <s class="num c888"><small>￥</small> {{v.smoney}}</s>
        </p>
    </div>
    {% endfor %}
</div>
~~~



修改分页问题

~~~php
// 分页
$pagenum = $_GET['pagenum'] ?? 1;
$totalItems = $db->count('product', '*');
$itemsPerPage = 12;
$currentPage = $pagenum;
$start = ($currentPage - 1) * $itemsPerPage;
$urlPattern = "/plist/{$pid}?pagenum=(:num)";
$paginator = new Paginator($totalItems, $itemsPerPage, $currentPage, $urlPattern);
$this->assign('fpage',$paginator);
~~~



视图

~~~html
{% autoescape false %}
{{fpage}}
{% endautoescape %}
~~~



再来处理排序，先把排序中的 URL pid 传递过去

~~~php
$this->assign('pid',$pid);
~~~



~~~html
<ul class="fr">
    <li class="prolist_px">
        <a href="/plist/{{pid}}?">默认排序</a>
    </li>
    <li class="prolist_px">
        <a href="/plist/{{pid}}?orderby=clicknum_desc">按人气</a>
    </li>
    <li class="prolist_px">
        <a href="/plist/{{pid}}?orderby=sellnum_desc">按销量</a>
    </li>
    <li class="prolist_px">
        <a href="/plist/{{pid}}?orderby=money_desc">按价格</a>
    </li>
</ul>
~~~



将查询语句中的 ['ORDER'=>***] 变量提取出来

~~~php
// 获取 orderby 参数
if(!empty($_GET['orderby'])){
    // 构建查询中的排序参数
    list($key, $value) = explode('_',$_GET['orderby']);
    $ordersql[$key] = strtoupper($value);
    $ordersql['id']='ASC';
    
    // 构建 URL GET 参数
    $orderby = "&orderby=".$_GET['orderby'];
}
~~~



然后查询的时候带入变量

~~~php
$data = $db->select('product', ['id', 'name', 'logo', 'money', 'smoney'],['ORDER'=>$ordersql, 'LIMIT'=>'12']);
~~~



然后将让分页携带 orderby 参数

~~~php
$urlPattern = "/plist/{$pid}?pagenum=(:num)".$orderby;
~~~



处理分类

~~~php
// 子类数据（直接CV之前的推荐）
if ($childs[0] == '0') {
    $sell_data = $db->select('product', ['id', 'name', 'logo', 'money', 'smoney'], ['ORDER' => ['sellnum' => 'DESC','id'=>'ASC'], 'LIMIT' => '6']);
} else {
    // 否则查看该分类的所有子类数据
    $sell_data = $db->select('product', ['id', 'name', 'logo', 'money', 'smoney'], ['cid' => $childs, 'ORDER' => ['sellnum' => 'DESC','id'=>'ASC'], 'LIMIT' => '6']);
}
~~~



最后看到分页一直是 20 页，页面缺没显示数据是因为，$totalItems 的问题，把条件加进去就可以了

~~~php
$where = [];
if($pid != 0){
    $where['cid'] = $childs;
}

$totalItems = $db->count('product', '*',$where);
~~~



因为已经判断了 cid，所以之前的语句也可以进行优化，不过需要写在分页功能的下方

~~~php
$where['ORDER'] = $ordersql;
$where['LIMIT']= "12";
$data = $db->select('product', ['id', 'name', 'logo', 'money', 'smoney'], $where);
$this->assign('data',$data);
~~~



发现每个分页都是显示同样的内容，是因为 LIMIT 条件没有给偏移

~~~php
$where['LIMIT']= [$start,$itemsPerPage];
~~~



增加功能，点击排序改变升序降序

把 get 参数传入模板

~~~php
$this->assign('order',$_GET);
~~~



修改模板

~~~html
<ul class="fr">
    <li class="prolist_px">
        <a href="/plist/{{pid}}">默认排序</a>
    </li>
    <li class="prolist_px">
        {% if get.orderby == "clicknum_asc" %}
        <a href="/plist/{{pid}}?orderby=clicknum_desc"><i class="i1"></i>按人气</a>
        {% elseif get.orderby == "clicknum_desc" %}
        <a href="/plist/{{pid}}?orderby=clicknum_asc"><i class="i2"></i>按人气</a>
        {% else %}
        <a href="/plist/{{pid}}?orderby=clicknum_desc">按人气</a>
        {% endif %}
    </li>
    <li class="prolist_px">
        {% if get.orderby == "sellnum_asc" %}
        <a href="/plist/{{pid}}?orderby=sellnum_desc"><i class="i1"></i>按销量</a>
        {% elseif get.orderby == "sellnum_desc" %}
        <a href="/plist/{{pid}}?orderby=sellnum_asc"><i class="i2"></i>按销量</a>
        {% else %}
        <a href="/plist/{{pid}}?orderby=sellnum_desc">按销量</a>
        {% endif %}
    </li>
    <li class="prolist_px">
        {% if get.orderby == "money_asc" %}
        <a href="/plist/{{pid}}?orderby=money_desc"><i class="i1"></i>按价格</a>
        {% elseif get.orderby == "money_desc" %}
        <a href="/plist/{{pid}}?orderby=money_asc"><i class="i2"></i>按价格</a>
        {% else %}
        <a href="/plist/{{pid}}?orderby=money_desc">按价格</a>
        {% endif %}
    </li>
</ul>
~~~



### 4.5 搜索模块

增加搜索条件，是 get 参数中的 keyword

~~~php
if(isset($_GET['keyword'])){
    $where['name[~]'] = $_GET['keyword'];
    $keyword = "&keyword=".$_GET['keyword'];
}
~~~



构造分页 url 加入 keyword

~~~php
$urlPattern = "/plist/{$pid}?pagenum=(:num)".$orderby.$keyword;
~~~



模板携带 keyword 参数

~~~html
<form method="get" action="/plist/{{pid}}?keywords={{get.keyword}}&orderby={{get.orderby}}">
    <div class="inputbg fl">
        <input type="text" name="keyword" value="{{get.keyword}}" class="fl searinput c666"/>
    </div>
    <input type="submit" class="fl sear_btn" onclick="this.form.submit();return false;" value="搜索"/>
</form>
~~~



排序携带 keyword 

~~~html
<ul class="fr">
    <li class="prolist_px">
        <a href="/plist/{{pid}}?keyword={{get.keyword}}">默认排序</a>
    </li>
    <li class="prolist_px">
        {% if get.orderby == "clicknum_asc" %}
        <a href="/plist/{{pid}}?orderby=clicknum_desc&keyword={{get.keyword}}"><i class="i1"></i>按人气</a>
        {% elseif get.orderby == "clicknum_desc" %}
        <a href="/plist/{{pid}}?orderby=clicknum_asc&keyword={{get.keyword}}"><i class="i2"></i>按人气</a>
        {% else %}
        <a href="/plist/{{pid}}?orderby=clicknum_desc&keyword={{get.keyword}}">按人气</a>
        {% endif %}
    </li>
    <li class="prolist_px">
        {% if get.orderby == "sellnum_asc" %}
        <a href="/plist/{{pid}}?orderby=sellnum_desc&keyword={{get.keyword}}"><i class="i1"></i>按销量</a>
        {% elseif get.orderby == "sellnum_desc" %}
        <a href="/plist/{{pid}}?orderby=sellnum_asc&keyword={{get.keyword}}"><i class="i2"></i>按销量</a>
        {% else %}
        <a href="/plist/{{pid}}?orderby=sellnum_desc&keyword={{get.keyword}}">按销量</a>
        {% endif %}
    </li>
    <li class="prolist_px">
        {% if get.orderby == "money_asc" %}
        <a href="/plist/{{pid}}?orderby=money_desc&keyword={{get.keyword}}"><i class="i1"></i>按价格</a>
        {% elseif get.orderby == "money_desc" %}
        <a href="/plist/{{pid}}?orderby=money_asc&keyword={{get.keyword}}"><i class="i2"></i>按价格</a>
        {% else %}
        <a href="/plist/{{pid}}?orderby=money_desc&keyword={{get.keyword}}">按价格</a>
        {% endif %}
    </li>
</ul>
~~~



当然也可以把 keyword 做成动态参数，如果有传入 keyword 就构造 url，否则不显示，比如：

~~~php
if(isset($_GET['keyword'])){
    $where['name[~]'] = $_GET['keyword'];
    $keyword = "&keyword=".$_GET['keyword'];
    $this->assign('keyword', $keyword)
}
~~~

然后模板里修改对应位置即可



## 5. 产品详情页面

- 路由

~~~php
Macaw::get('/product/(:num)','\home\Product@index');
~~~



- 获取商品信息

~~~php
public function index($cid = 0) {
    $db = new BaseModel();
    $data = $db->get('product','*',['id'=>$cid]);
    $this->assign('data', $data);
    $this->display('product/product.html');
}
~~~



- 视图填充基本信息


~~~html
<div class="fl proimg">
    <img src="{{public}}/images/load.gif" data-original="{{uploads}}/product/{{data.logo}}" width="400" height="400" />
</div>
<div class="fl proinfo">
    <h3>{{data.name}}</h3>
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr style="color:#fff;background:#d83228; background:url(../app/views/home/resource/images/jg_bg.gif) repeat;">
            <td style="height:50px;" valign="top" width="60"><p class="mat5">价 格</p></td>
            <td style="height:50px;">
                <span style="color:yellow" class="jg_price"><small>￥</small>  <span id="product_money">{{data.money}}</span></span>
                <p>市场价 <s class="num"><small>￥</small> {{data.smoney}}</s>　　运费：卖家包邮</p>
            </td>
        </tr>

        <tr>
            <td style="color:#666">销 量</td>
            <td>共售出 <span class="cred num strong">{{data.sellnum}}</span> 件 <a href="javascript:find_comment();" class="cblue">(已有{{data.commentnum}}人评价)</a></td>
        </tr>

        <tr>
            <td style="color:#666">数 量</td>
            <td class="shuliang">
                <input type="hidden" name="prorule_id" />
                <span class="img1" onclick="bro_numchange('product_num', '-', 1);">-</span>
                <div class="shuliang_box"><input type="text" name="product_num" value="1" readonly /></div>
                <span class="img2" onclick="bro_numchange('product_num', '+', {{data.num}});">+</span>
                <span class="fl c888 mal5 mat2">　库存<span id="product_num">{{data.num}}</span>件</span>
            </td>
        </tr>

        <tr>
            <td>&nbsp;</td>
            <td>
                <a href="javascript:;" onclick="cart_add('898');" class="fl">
                    <img src="../app/views/home/resource/images/buy.gif" />
                </a>
                <a href="javascript:collect_add('898');" class="sctj fl">添加到收藏夹</a>
            </td>
        </tr>
    </table>

    <p style="margin:10px 20px; border-top:1px #ddd dotted; padding-top:5px;">
        上架时间：{{data.atime|date("Y-m-d H:i-s")}}　　浏览次数：{{data.clicknum}}　　收藏人数：{{data.collectnum}}
    </p>

    <div class="clear"></div>
</div>
~~~



- 判断是否包邮

~~~html
<p>市场价 <span class="num"><small>￥</small> {{data.smoney}}</span>　　
    运费：
    {% if data.wlmoney == 0 %}
    卖家包邮
    {% else %}
    <span class="num"><small>￥</small> {{ data.wlmoney}}</span>
    {% endif %}
</p>
~~~



- 判断下架商品、售空产品，以及正常商品的购物车

~~~html
<tr>
    <td>&nbsp;</td>
    <td>{% if data.state == 0 %}
        <img src="{{res}}/images/selldown.gif" class = "fl"/>
        {% elseif data.state == 1 and data.sellnum == 0 %}
        <img src="{{res}}/images/sellout.gif" class = "fl"/>
        {% else %}
        <a href="javascript:;" onclick="cart_add('{{data.id}}');" class="fl">
            <img src="{{res}}/images/buy.gif" />
        </a>
        {% endif %}
        <a href="javascript:collect_add('{{data.id}}');" class="sctj fl">添加到收藏夹</a>
    </td>
</tr>
~~~



- 浏览次数

~~~php
$db->update('product',['clicknum[+]'=>1],['id'=>$cid]);
~~~



- 面包屑

~~~php
// 面包屑导航
$cats = $db->select('category','*');
$fullcats = CatTree::getList($cats);
$nowpath = $fullcats[$data['cid']]['path'].",".$data['cid'];
$nowpath = explode(',',$nowpath);
array_shift($nowpath);
$breadlist = "您现在的位置：<a href='/'>首页</a>";
foreach ($nowpath as $breadlist_item) {
    $breadlist .= " > "."<a href='/plist/{$breadlist_item}' title='{$fullcats[$breadlist_item]['catname']}'>{$fullcats[$breadlist_item]['catname']}</a>";
}
$breadlist.= " > ".$data['name'];

$this->assign('breadlist',$breadlist);
~~~



视图

~~~html
{% autoescape false %}
{{breadlist}}
{% endautoescape %}
~~~



- 商品分类，直接显示所有分类

~~~php
// 侧边栏分类
$rootcats = $db->select('category',['id','catname'],['pid'=>'0', 'ORDER'=>['ord'=>'ASC','id'=>'ASC']]);
$allcats = [];

foreach ($rootcats as $cat) {
    $cat['subcats'] = $db->select('category',['id','catname'],['pid'=>$cat['id']]);
    array_push($allcats,$cat);
}

$this->assign('allcats',$allcats);
~~~



视图

~~~html
<div class="hotlist spfl">
    {% for v in allcats %}
    <div class="zhulei"><a href="/plist/{{v.id}}" class="sel">{{v.catname}}</a></div>
    <div class="clear"></div>
    <div class="zilei">
        {% for i in v.subcats %}
        <a href="/plist/{{i.id}}" class="sel">{{i.catname}}</a>
        {% endfor %}
        <div class="clear"></div>
    </div>
    {% endfor %}
</div>
~~~



- 热门产品

~~~php
$sellrank = $db->select('product',['id','name','logo','money','smoney'],['cid'=>$data['cid'],'state'=>'1', 'ORDER'=>['sellnum'=>'DESC', 'id'=>'DESC'],'LIMIT'=>'6']);
$this->assign('sellrank',$sellrank);
~~~



~~~html
<ul class="hotlist">
    {% for v in sellrank %}
    <li>
        <span class="fl hotimg">
            <img src="{{public}}/images/load.gif" data-original="{{uploads}}/product/{{v.logo}}" width="60" height="60" title="{{v.name}}" />
        </span>
        <span class="fl hotname">
            <a href="/product/{{v.id}}" title="{{v.name}}" target="_blank">{{v.name}}</a>
            <span class="cred num strong lh20"><small>￥</small>{{v.money}}</span>
        </span>
        <div class="clear"></div>
    </li>
    {% endfor %}
</ul>
~~~



- 页面标题

~~~php
$this->assign('title',$data['name']);
~~~



~~~html
<title>{{title}} - EWShop</title>
~~~





- TAB 页面等做完响应模块再处理

  



## 6. 单页页面

- 路由

~~~php
// 文章页面/单页
Macaw::get('/page/(:num)','\home\article@page');
~~~



- 获取页面信息

~~~php
$db = new BaseModel();
$data = $db->get('page','*',['id'=>$id]);
$this->assign('data',$data);
~~~



视图

~~~php
<div class="page_tt">{{data.name}}</div>
    <div class="danye_main">
{% autoescape false %}
{{data.content}}
{% endautoescape %}
</div>
~~~



- 面包屑

因为页面较少，所以可以直接写

~~~html
<div class="now">您现在的位置：<a href="/">首页</a>
    &gt; 帮助中心 &gt; {{data.name}}</a>
</div>
~~~



- 侧边栏

同样，写死即可

~~~html
<ul>
    <li><a href="/page/12" title="订单查询">订单查询</a></li>
    <li><a href="/page/13" title="退换货流程">退换货流程</a></li>
    <li><a href="/page/15" title="用户协议">用户协议</a></li>
</ul>
<h3>配送方式</h3>
<ul>
    <li><a href="/page/17" title="联系我们">联系我们</a></li>
    <li><a href="/page/18" title="诚聘英才">诚聘英才</a></li>
    <li><a href="/page/8" title="支付方式">支付方式</a></li>
</ul>
<h3>售后服务</h3>
<ul>
    <li><a href="/page/9" title="常见问题">常见问题</a></li>
    <li><a href="/page/10" title="配送时间及运费">配送时间及运费</a></li>
    <li><a href="/page/11" title="验货与签收">验货与签收</a></li>
</ul>
<h3>关于我们</h3>
<ul>
    <li><a href="/page/7" title="购物指南">购物指南</a></li>
    <li><a href="/page/16" title="公司简介">公司简介</a></li>
    <li><a href="/page/14" title="退换货条款">退换货条款</a></li>
</ul>
~~~



- 页面标题

~~~php
$this->assign('title',$data['name']);
~~~





## 7. 文章页面

### 7.1 文章列表

- 路由

~~~php
Macaw::get('/alist/(:num)','\home\Article@alist');
~~~



- 读取内容

~~~php
$data = $db->select('article',['id','name','atime','clicknum'],['cid'=>$cid,'ORDER'=>'id']);
$this->assign('data',$data);
~~~



~~~html
<ul class="wenzhang_list">
    {% for v in data %}
    <li><a href="/article/{{v.id}}" title="{{v.name}}">{{v.name}}</a><span class="fl c888">(浏览量：{{v.clicknum}})</span> <span class="fr">{{v.atime|date("Y-m-d H:i:s")}}</span><div class="clear"></div></li>
    {% endfor %}
</ul>
~~~



- 分页

~~~php
// 分页
$where = array(
    'cid'=>$cid,
    'ORDER'=>'id'
);
$pagenum = $_GET['pagenum'] ?? 1;
$totalItems = $db->count('article','*', $where);
$itemsPerPage = 10;
$currentPage = $pagenum;
$start = ($currentPage - 1) * $itemsPerPage;
$urlPattern = "/alist/{$cid}?pagenum=(:num)";
$paginator = new Paginator($totalItems, $itemsPerPage, $currentPage, $urlPattern);
$this->assign('fpage',$paginator);
~~~



每页查询

~~~php
$where['LIMIT'] = [$start, $itemsPerPage];
$data = $db->select('article',['id','name','atime','clicknum'],$where);
~~~



视图

~~~html
{% autoescape false %}
{{fpage}}
{% endautoescape %}}
~~~



- 侧边栏

~~~php
// 侧边栏
$cats = $db->select('class', ['id','catname'],['ORDER'=>['ord'=>'ASC','id'=>'ASC']]);
$this->assign('cats',$cats);
~~~



~~~html
{% for v in cats %}
<li><a href="/alist/{{v.id}}" title="{{v.catname}}">{{v.catname}}</a></li>
{% endfor %}
~~~



- 面包屑导航

~~~php
// 面包屑
$class = [];
foreach ($cats as $v){
    $class[$v['id']] = $v['catname'];
}
$this->assign('cid',$cid);
$this->assign('cname',$class[$cid]);
~~~



~~~html
<div class="now">您现在的位置：<a href="/">首页</a>
    &gt; 资讯中心 &gt; <a href='/alist/{{cid}}'>{{cname}}</a>
</div>
~~~



- 分类标题

~~~php
$this->assign('title', '资讯中心');
~~~



### 7.2 文章详情

- 路由

~~~php
Macaw::get('/article/(:num)','\home\Article@article');
~~~



- 文章数据

~~~php
$data = $db->get('article','*',['id'=>$id]);
$this->assign('data',$data);
~~~



~~~html
<div class="page_tt">网站公告</div>
<h3 class="mat20 font16" style="text-align:center;">{{data.name}}</h3>
<p class="c888 mat10 mab20" style="text-align:center;">发布日期：{{data.atime|date("Y-m-d H:i:s")}}　浏览量：{{data.clicknum}}</p>
<div class="danye_main">
    {% autoescape false %}
    {{data.content}}
    {% endautoescape %}
</div>
~~~



- 侧边栏

~~~php
// 侧边栏
$cats = $db->select('class', ['id','catname'],['ORDER'=>['ord'=>'ASC','id'=>'ASC']]);
$this->assign('cats',$cats);
~~~



~~~html
{% for v in cats %}
<li><a href="/alist/{{v.id}}" title="{{v.catname}}">{{v.catname}}</a></li>
{% endfor %}
~~~





面包屑

~~~php
// 面包屑
$class = [];
foreach ($cats as $v){
    $class[$v['id']] = $v['catname'];
}
$this->assign('cid',$data['cid']);
$this->assign('cname',$class[$data['cid']]);
~~~



~~~html
<div class="now">您现在的位置：<a href="/">首页</a>
    &gt; 资讯中心 &gt; <a href='/alist/{{cid}}'>{{cname}}</a> &gt; {{data.name}}
</div>
~~~



- 浏览量

~~~php
// 点击量
$db->update('article',['clicknum[+]'=>1],['id'=>$id]);
~~~



- 相关文章

~~~php
// 相关文章
$link_article = $db->select('article',['id','name'],['cid'=>$data['cid'], 'ORDER'=>['id'=>'DESC'], 'LIMIT'=>6]);
$this->assign('link_article',$link_article);
~~~



~~~html
<ul>
    {% for v in link_article %}
    <li><a style="padding-left:10px;overflow: hidden" href="/article/{{v.id}}" title="{{v.name}}">{{v.name}}</a></li>
    {% endfor %}
</ul>
~~~



- 文章标题

~~~php
$this->assign('title',$data['name']);
~~~



## 8. 用户注册

### 8.1 注册

- 路由

~~~php
Macaw::any('/user/login','\home\User@login');
~~~



- 标题

~~~php
$this->assign('title','用户注册');
~~~



- 唯一性验证，验证空、验证是否有特殊字符

用户注册验证是由 ajax 进行判定

~~~js
Ajax('html',false).get("/user/register?name="+val, function(data){
...
}
~~~



所以需要判定 get 传过来的用户名是否为空、是否唯一、是否有特殊字符

~~~php
if(!empty($_GET['name'])){
    $username = $_GET['name'];
    // 验证用户名是否存在
    $is_user_exist = $db->get('user',['name'],['name'=>$username]);
    if ($is_user_exist){
        echo 'flase';
    } else {
        echo 'true';
    }
    die();
}
~~~



同理验证其他表单



- 构造表单发送数据库请求

~~~php
if(!empty($_POST['do_submit'])){
    unset($_POST['do_submit']);
    unset($_POST['pw1']);
    $_POST['pw'] = md5(md5('ew_$%^' . $_POST['pw']));
    $_POST['atime'] = time();
    if($db->insert('user',$_POST)){
        $this->success('/','注册成功');
    } else {
        $this->error('/user/register','注册失败');
    }
}
~~~



### 8.2 登录

- 路由

~~~php
Macaw::get('/user/login','\home\User@login');
~~~



- 标题

~~~php
$this->assign('title','用户登录');
~~~



- 查找用户并把用户信息加入 session，父类赋值 session

~~~php
$db = new BaseModel();
if(!empty($_POST['do_submit'])){
    $_POST['pw'] = md5(md5('ew_$%^' . $_POST['pw']));
    $user = $db->get('user',['id','name'], ['name'=>$_POST['name'], 'pw'=>$_POST['pw']]);
    if ($user){
        $_SESSION = $user;
        $this->success('/','登录成功');
    } else {
        $this->error('/user/login', '登录失败');
    }
}
~~~



- session 加入 token

~~~php
$_SESSION['user_token'] = md5($user['id'].$_SERVER['HTTP_HOST']);
~~~



- 更改用户登录时间

~~~php
$db->update('user',['ltime'=>time()],['id'=>$user['id']]);
~~~



- 前端验证 token

登录完， SESSION 已经存在 session['user_token'] 字段，所以只要验证这个字段是否存在，并且字段值符合 Token 加密规则即可。利用之前在 helpers.php 定义的验证 token 函数。

~~~php
function ew_login($utype)
{
    return md5($_SESSION['id'] . $_SERVER['HTTP_HOST']) == $_SESSION[$utype . '_token'] ? 1 : 0;
}
~~~

> 判断验证方式是否等于 $_SESSION['user_token']



所以在 home.php 父类中直接调用该函数即可，即：

~~~php
$this->assign('islogin',ew_login('user'));  // 返回登录状态 1 或 0
$this->assign('session',$_SESSION);
~~~



- 头部携带用户登录信息

~~~html
<div class="quick_menu">
    <p>
        {% if islogin %}
        <span class="fl">您好 <a style="border:0px;padding:0px" href="/user/order" title="会员中心"><span class="cred">{{session.name}}</span></a>， {{setting.web_title}}</span>
        <span class="fr">
            <a href="/user/order" title="会员中心">会员中心</a>
            <a href="/order/add" title="购物车" class="gwc">购物车 <span class="cred">0</span> 件</a>
            <a href="/order/plist" title="订单查询" style="border:0">订单查询</a>
            <a href="/user/logout" title="退出" style="border:0">退出</a>
        </span>
        {% else %}
        <span class="fl">您好，{{settings.web_title}}</span>
        <span class="fr">
            <a href="/user/login?fromto=http%3A%2F%2Fshop.eduwork.cn%2F" title="登录">登录</a>
            <a href="/user/register?fromto=http%3A%2F%2Fshop.eduwork.cn%2F" title="注册">注册</a>
            <a href="/order/add" title="购物车" class="gwc">购物车 <span class="cred">0</span> 件</a>
            <a href="/order/plist" title="订单查询" style="border:0">订单查询</a>
        </span>
        {% endif %}
    </p>
</div>
~~~



- 注册以后直接登录





### 8.3 登出

- 清空 session
- 清空 用户 cookie
- 销毁 session

~~~php
public function logout(){
    $_SESSION = array();

    // 清空用户 cookie
    if(isset($_COOKIE[session_name()])) {
        setcookie(session_name(), '', time()-3600, '/');
    }

    session_destroy();
    $this->success('/','登出成功');
}
~~~



### 8.4 注册后自动登录

在插入数据后，获取刚插入的数据记录，然后和登陆一样，存入 SESSION 即可

~~~php
$user = $db->get('user',['id','name'],['id'=>$db->id()]);
$_SESSION = $user;
$_SESSION['user_token'] = md5($user['id'].$_SERVER['HTTP_HOST']);
~~~



### 8.5 前后端用户分离

因为前后端都是用 session 存储的用户登录数据，防止前端用户 logout 或者登录，影响后端用户，在 session 中使用数组来存储对应数据

- session 添加 user 和 admin 数组

~~~php
$_SESSION['user'] = $user;
$_SESSION['admin'] = $admin;
~~~



登出时不要销毁所有 session，只清空对应数组字段即可。



### 8.6 登陆界面判断是否登录

虽然登录后隐藏了登录窗口，但是还是可以进入登陆页面的，可以在登录界面进行验证并跳转

~~~php
if(ew_login('user')){
    $this->success('/','您已经登录');
}
~~~



## 9. 后台会员管理

- 后台路由

~~~php
// 后台用户
Macaw::get('/admin/user', '\admin\User@index');
Macaw::any('/admin/user/add', '\admin\User@add');
Macaw::get('/admin/user/mod/(:num)', '\admin\User@mod');
Macaw::post('/admin/user/update', '\admin\User@update');
Macaw::get('/admin/user/del/(:num)', '\admin\User@del');
Macaw::post('/admin/user/alldel', '\admin\User@alldel');
~~~



- 创建 controllers/admin/user.php，引用命名空间，继承父类

~~~php
<?php

namespace admin;

use models\BaseModel;
use JasonGrimes\Paginator;

final class User extends Admin{
    public function __construct()
    {
        parent::__construct();
        $this->assign('menumark', 'user');
    }
}
~~~



### 9.1 显示页面

~~~php
public function index(){

    $db = new BaseModel();
    $data = $db->select('user','*');
    $this->assign('title', '用户列表');
    $this->assign('data',$data);
    $this->display('user/index.html');
}
~~~



- 修改模板文件
  - header, footer
  - 将  data 数据放到页面中

~~~html
{% for v in data %}
<tr>
    <td><input type="checkbox" name="id[]" value="{{v.id}}"></td>
    <td>{{v.id}}</td>
    <td>{{v.name}}</td>
    <td>{{v.phone}}</td>
    <td>{{v.email}}</td>
    <td><span>{{v.atime|date("Y-m-d H:i")}}</span></td>
    <td><span>{{v.ltime|date("Y-m-d H:i")}}</span></td>
    <td>
        <a href="/admin/user/mod/{{v.id}}" class="admin_edit mar3">修改</a>
        <a href="/admin/user/del/{{v.id}}" class="admin_del" onclick="return confirm('确定要删除会员{{v.name}}吗？')">删除</a>
    </td>
</tr>
{% endfor %}
~~~



- 处理分页信息

~~~php
// 分页
$totalItems = $db->count('user','*');
$itemsPerPage = 5;
$currentPage = $_GET['pagenum'] ?? 1;
$urlPattern = '/admin/user?pagenum=(:num)';
$paginator = new Paginator($totalItems, $itemsPerPage, $currentPage, $urlPattern);
$this->assign('fpage', $paginator);

// 计算每页起始编号
$start = ($currentPage - 1) * $itemsPerPage;
$sql['LIMIT']= [$start, $itemsPerPage];

$data = $db->select('user','*', $sql);
~~~



- 添加分页信息

~~~html
{% autoescape false %}
{{fpage}}
{% endautoescape %}
~~~

> 没有记录是因为分页显示 item 数量太多了，设置小点即可，如：$itemsPerPage = 5;



- 过滤、排序

~~~php
public function index(){
    $db = new BaseModel();

    // 获取 GET 信息
    $get = $_GET;
    $this->assign('get',$get);

    // 过滤查找
    $where = [];
    // 按用户查找
    if(!empty($_GET['name'])){
        $where['name[~]'] = $_GET['name'];
        $name = '&name='.$_GET['name'];
    }

    // 按电话搜索
    if (!empty($_GET['phone'])){
        $where['phone[~]'] = $_GET['phone'];
        $phone = '&phone='.$_GET['phone'];
    }

    // 按 Email 搜索
    if (!empty($_GET['email'])){
        $where['email[~]'] = $_GET['email'];
        $email = '&email='.$_GET['email'];
    }

    // 排序
    if(!empty($_GET['orderby'])){
        $sql['ORDER']= [$_GET['orderby']=>'DESC'];
        $orderby = '&orderby='.$_GET['orderby'];
    } else {
        $sql['ORDER']= ['id'=>'ASC'];
    }

    // 分页
    $totalItems = $db->count('user','*',$where);
    $itemsPerPage = 5;
    $currentPage = $_GET['pagenum'] ?? 1;
    $urlPattern = '/admin/user?pagenum=(:num)'.$orderby.$name.$phone.$email;
    $paginator = new Paginator($totalItems, $itemsPerPage, $currentPage, $urlPattern);
    $this->assign('fpage', $paginator);

    // 计算每页起始编号
    $start = ($currentPage - 1) * $itemsPerPage;
    $sql['LIMIT']= [$start, $itemsPerPage];
    $sql = array_merge($sql, $where);

    $data = $db->select('user','*', $sql);
    $this->assign('title', '用户列表');
    $this->assign('data',$data);
    $this->display('user/index.html');
}
~~~



页面下拉菜单保持提交后数据

~~~html
<option value=""  {{ get.orderby == '' ? 'selected' : '' }}  >默认排序</option>
<option value="ltime" {{ get.orderby == 'ltime' ? 'selected' : '' }} >最近登录</option>
~~~



视图提交数据后保持参数

~~~html
用户名：<input type="text" name="name" value="{{get.name}}" class="inputtext inputtext_150" />
联系电话：<input type="text" name="phone" value="{{get.phone}}" class="inputtext inputtext_150" />
常用邮箱：<input type="text" name="email" value="{{get.email}}" class="inputtext inputtext_150" />
~~~



### 9.2 修改页面

- 修改视图 header, footer
- 获取数据

~~~php
public function mod($id){
    $db = new BaseModel();
    $data = $db->get('user','*',['id'=>$id]);
    $this->assign('data',$data);
    $this->assign('title','修改用户');
    $this->display('user/mod.html');
}
~~~



- 渲染模板

~~~html
<form method="post" action="/admin/user/update">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" class="wenzhang">
        <input type="hidden" name="id" value="{{data.id}}">
        <tr>
            <td class="bg_f8" align="right" width="100">用 户 名：</td>
            <td>{{data.name}}</td>
        </tr>
        <tr>
            <td class="bg_f8" align="right">密　　码：</td>
            <td><input type="password" name="pw" class="inputall input200" autocomplete="off" /> <span class="c888">如无需修改请留空</span></td>
        </tr>
        <tr>
            <td class="bg_f8" align="right">收货地址：</td>
            <td><input type="text" name="address" value="{{data.address}}" class="inputall input400" /></td>
        </tr>
        <tr>
            <td class="bg_f8" align="right">收货姓名：</td>
            <td><input type="text" name="tname" value="{{data.tname}}" class="inputall input200" /></td>
        </tr>
        <tr>
            <td class="bg_f8" align="right">联系电话：</td>
            <td><input type="text" name="phone" value="{{data.phone}}" class="inputall input200" /></td>
        </tr>
        <tr>
            <td class="bg_f8" align="right">常用邮箱：</td>
            <td><input type="text" name="email" value="{{data.email}}" class="inputall input200" /></td>
        </tr>
        <tr>
            <td class="bg_f8" align="right">注册日期：</td>
            <td>{{data.atime|date('Y-m-d H:i')}}</td>
        </tr>
        <tr>
            <td class="bg_f8" align="right">上次登录：</td>
            <td>{{data.atime|date('Y-m-d H:i')}}</td>
        </tr>
        <tr>
            <td class="bg_f8">&nbsp;</td>
            <td><input type="submit" value="提 交" class="tjbtn" /></td>
        </tr>
    </table>
</form>
~~~



- 处理提交业务

~~~php
public function update(){
    $id = $_POST['id'];
    unset($_POST['id']);

    if(!empty($_POST['pw'])){
        $_POST['pw'] = md5(md5('ew_$%^' . $_POST['pw']));
    } else {
        unset($_POST['pw']);
    }

    $db = new BaseModel();
    if($db->update('user',$_POST,['id'=>$id])){
        $this->success('/admin/user','更新成功');
    } else{
        $this->error('/admin/user','更新失败');
    };
}
~~~



### 9.3 删除用户

~~~php
// 删除单个用户
public function del($id){
    $db = new BaseModel();
    if($db->delete('user',['id'=>$id])){
        $this->success('/admin/user','删除成功');
    } else{
        $this->error('/admin/user','删除失败');
    };
}

// 批量删除
public function alldel(){
    unset($_POST['do_submit']);
    $db = new BaseModel();
    $num = 0;
    foreach($_POST['id'] as $v){
        $num+=$db->delete('user',['id'=>$v])->rowCount();
    }
    if($num>0){
        $this->success('/admin/user','删除成功');
    } else{
        $this->error('/admin/user','删除失败');
    }
}
~~~



## 10. 商品的收藏功能

路由

~~~php
Macaw::get('/product/collectadd', '\home\Product@collectadd');
~~~



通过 Ajax 实现发送请求

~~~html
<a href="javascript:collect_add('{{data.id}}');" class="sctj fl">添加到收藏夹</a>
~~~



~~~js
function collect_add(id) {
    if (!{{islogin}}) {
        alert('抱歉：只有登录用户才能收藏商品！请先登录...');
        return;
    }
    $.getJSON("/product/collectadd", {"pid":id},function(json){
        alert(json.show);
    })
}
~~~



收藏功能涉及到两个表，一个是收藏表的记录，另外一个是商品表中的收藏总数

- 收藏表字段，uid, pid, atime
- 商品表中字段, collectnum



~~~php
public function collectadd(){
    // 获取字段值
    $collect['uid'] = $_SESSION['id'];
    $collect['pid'] = $_GET['pid'];

    $db = new BaseModel();
    // 判断是否收藏过该商品
    $count = $db->count('collect',['uid'=>$collect['uid'], 'pid'=>$collect['pid']]);    
    if($count>0){
        $show = "您已经收藏过该商品了";
    } else {        
        $collect['atime'] = time();
        // 插入记录
        if($db->insert('collect',$collect)){
            // 更新商品表收藏总数
            $db->update('product',['collectnum[+]'=>1],['id'=>$_GET['pid']]);
            $show = "商品收藏成功";
        } else {
            $show = "商品收藏失败";
        }
    }
    echo json_encode(['show'=>$show]);
    die;
}
~~~



## 11. 商品评价

路由

~~~php
Macaw::post('/product/commentadd', '\home\Product@commentadd');
~~~



显示评价数目，共有两处

~~~html
<td>共售出 <span class="cred num strong">{{data.sellnum}}</span> 件 <a href="javascript:find_comment();" class="cblue">(已有{{data.commentnum}}人评价)</a></td>
~~~



~~~html
<li><a href="javascript:;">顾客评价({{data.commentnum}})</a></li>
~~~



获取评价数据

~~~php
$comment_list = $db->select('comment',['id','uname','atime','content'],['pid'=>$cid,'ORDER'=>['atime'=>'DESC']]);
$this->assign('comment_list',$comment_list);
~~~



显示评价信息

~~~html
{% for v in comment_list %}
<ul class="mat5">
    <li class="fl">会员：{{v.uname}}</li>
    <li class="fr">评价日期：{{v.atime|date('Y-m-d')}}</li>
</ul>
<div class="pingjia font14">{{v.content}}</div>
{% endfor %}
~~~



判断用户是否登录

~~~html
<td>{% if islogin %} {{ session.name }}  {% else %} 游客 {% endif %}</td>
~~~



处理评论 ajax

~~~js
//评价发表
$("#js_commenthtml").find(":button").click(function(){
    if (!{{islogin}}) {
        alert('抱歉：只有登录用户才能发表评价！请先登录...');
        return;
    }

    var comment_text = $(":input[name='content']").val();
    if (comment_text == '') {
        alert('评价内容必须填写');
        return;
    }

    $.post("/product/commentadd", {"pid": {{data.id}},"content":comment_text,"do_submit":true}, function(json){
    if (json.result) {
        $("#js_commenthtml").prepend(json.html);
        $(":input[name='content']").val('');
        alert('感谢您的支持，评价提交成功！');
    }
    else {
        alert('抱歉，评价提交失败，请重新提交...')
    }
}, "json")
});
~~~



评论业务处理

~~~php
// 添加评论
public function commentadd(){
    $db = new BaseModel();
    if(isset($_POST['do_submit'])){
        $_POST['atime'] = time();
        $_POST['uid'] = $_SESSION['id'];
        $_POST['uname'] = $_SESSION['name'];
        $_POST['uip'] = getClientIP();
        unset($_POST['do_submit']);
        if($db->insert('comment',$_POST)){
            $db->update('product',['commentnum[+]'=>1],['id'=>$_POST['pid']]);
            $atime = date('Y-m-d',$_POST['atime']);
            $commenttext = htmlspecialchars($_POST['content']);
            $html = <<<html
<ul class="mat5">
    <li class="fl">会员：{$_POST['uname']}</li>
    <li class="fr">评价日期：{$atime}</li>
</ul>
<div class="pingjia font14">{$commenttext}</div>
html;
            $result = true;
        } else {
            $result = false;
        }
        echo json_encode(['result'=>$result,'html'=>$html]);
    }
}
~~~



## 12. 商品咨询

路由

~~~php
Macaw::post('/product/askadd', '\home\Product@askadd');
~~~



咨询数目

~~~html
<li><a href="javascript:;">售前咨询({{data.asknum}})</a></li>
~~~



获取咨询数据

~~~php
// 资讯
$ask_list = $db->select('ask',['id','uname','atime','asktext','replytext','replytime'],['pid'=>$cid,'ORDER'=>['atime'=>'DESC']]);
$this->assign('ask_list',$ask_list);
~~~



显示咨询

~~~html
{% for v in ask_list %}
<ul class="mat5">
    <li class="fl">会员：{{v.uname}}</li>
    <li class="fr">咨询日期：{{v.atime|date('Y-m-d H:i')}}</li>
</ul>
<div class="padb10 mal10 lh18">
    <div class="mat10 font14">{{v.asktext}}</div>
    {% if v.replytext %}
    <div class="mat10 huifu">
        <strong class="corg">卖家回复：</strong> {{v.replytime|date('Y-m-d H:i')}}<br/>
        <div class="mat5">{{v.replytext}}</div>
    </div>
    {% endif %}
</div>
{% endfor %}
~~~



识别用户

~~~html
<td> {{ login?session.name:'游客'}} </td>
~~~



ajax 发送咨询问题

~~~js
//咨询发表
$("#js_askhtml").find(":button").click(function(){
    //判断登陆
    if (!{{islogin}}) {
        alert('抱歉：只有登录用户才能发表咨询！请先登录...');
        return;
    }
    var ask_text = $(":input[name='asktext']").val();
    if (ask_text == '') {
        alert('咨询内容必须填写');
        return;
    }


    $.post("/product/askadd", {"pid":{{data.id}},"asktext":ask_text, "do_submit":true}, function(json){

        if (json.result) {
            $("#js_askhtml").prepend(json.html);
            $(":input[name='asktext']").val('');
            alert('咨询提交成功！卖家会尽快答复...');
        }else {
            alert('抱歉，咨询提交失败，请重新提交...');
        }
    }, 'json');
});
~~~



创建方法

~~~php
public function askadd(){
    $db = new BaseModel();
    if(isset($_POST['do_submit'])){
        $_POST['atime'] = time();
        $_POST['uid'] = $_SESSION['id'];
        $_POST['uname'] = $_SESSION['name'];
        $_POST['uip'] = getClientIP();
        unset($_POST['do_submit']);
        if($db->insert('ask',$_POST)){
            $db->update('product',['asknum[+]'=>1],['id'=>$_POST['pid']]);
            $atime = date('Y-m-d',$_POST['atime']);
            $asktext = htmlspecialchars($_POST['asktext']);
            $html = <<<html
<ul class="mat5">
    <li class="fl">会员：{$_POST['uname']}</li>
    <li class="fr">咨询日期：{$atime}</li>
</ul>
<div class="padb10 mal10 lh18">
    <div class="mat10 font14">{$asktext}</div>
</div>
html;

            $result = true;
        } else {
            $result = false;
        }
        echo json_encode(['result'=>$result,'html'=>$html]);
    }
}
~~~



## 13. 售后服务

售后服务，可以直接获取单页信息

~~~php
// 售后服务
$pagetext = $db->get('page',['content'],['id'=>13]);
$this->assign('pagetext',$pagetext);
~~~



页面显示

~~~html
{% autoescape false %}
{{pagetext.content}}
{% endautoescape %}
~~~



## 14. 后台咨询管理

路由

~~~php
// 后台咨询
Macaw::get('/admin/ask', '\admin\Ask@index');
Macaw::get('/admin/ask/reply/(:num)', '\admin\Ask@reply');
Macaw::post('/admin/ask/update', '\admin\Ask@update');
Macaw::get('/admin/ask/del/(:num)', '\admin\Ask@del');
Macaw::post('/admin/ask/alldel', '\admin\Ask@alldel');
~~~



复制 user.php

- 替换 user 为 ask
- 替换 类名 Ask
- 替换 '用户' 为 '咨询'



修改模板

- 添加 header, footer



取数据需要联表查询，查询咨询表与商品表

~~~php
$data = $db->debug()->select('ask',
                             ['[>]product'=>['pid'=>'id']],                           ['ask.id','ask.pid','ask.uid','ask.uip','ask.atime','ask.uname','ask.replytext','ask.replytime','ask.state','ask.asktext','product.name','product.logo'],
                             $sql);
~~~



相当于

~~~mysql
SELECT `ew_ask`.`id`,`ew_ask`.`pid`,`ew_ask`.`uid`,`ew_ask`.`uip`,`ew_ask`.`atime`,`ew_ask`.`uname`,`ew_ask`.`replytext`,`ew_ask`.`replytime`,`ew_ask`.`state`,`ew_ask`.`asktext`,`ew_product`.`name`,`ew_product`.`logo` FROM `ew_ask` LEFT JOIN `ew_product` ON `ew_ask`.`pid` = `ew_product`.`id` ORDER BY `id` ASC LIMIT 5 OFFSET 0
~~~



填充数据

~~~html
{% for v in data %}
<tr>
    <td><input type="checkbox" name="id[]" value="{{v.id}}" /></td>
    <td>{{v.id}}</td>
    <td class="aleft">
        <a href="/product/{{v.pid}}" target="_blank" class="fl mat3" style="border:1px solid #ddd"><img src="{{uploads}}/product/{{v.logo}}" width="60" height="60"></a>
        <div class="fl" style="width:530px;margin-left:15px; display:inline;">
            <p><a href="/product/{{v.pid}}" target="_blank" class="cblue font13">{{v.name}}</a></p>
            <p class="c333 mat5 font13">[{{v.atime|date('Y-m-d H:i')}}]咨询：{{v.asktext}}</p>
            {% if v.replytext != null %}
            <div class ="cred mat5 font13">
                <strong class="corg">回复：</strong>[{{v.replytime|date('Y-m-d H:i')}}]
                <div class="mat5">{{v.replytext}}</div>
            </div>
            {% endif %}
        </div>
    </td>
    <td>{{v.uname}}</td>
    <td>
        <a href="/admin/ask/reply/{{v.id}}" class="admin_edit mar3">回复</a>
        <a href="/admin/ask/del/{{v.id}}" class="admin_del" onclick="return confirm('你确定要删除吗？')">删除</a>
    </td>
</tr>
{% endfor %}
~~~



分页

~~~php
{% autoescape false %}
{{fpage}}
{% endautoescape %}
~~~



条件查询

~~~php
// 过滤查找
$where = [];

// 按状态查询
if(isset($_GET['state']) && !empty($_GET['state'])){
    $where['ask.state'] = $_GET['state'];
    $state = '&state='.$_GET['state'];
}

// 按商品名称
if(!empty($_GET['name'])){
    $where['product.name[~]'] = $_GET['name'];
    $name = '&name='.$_GET['name'];
}

// 按咨询内容
if (!empty($_GET['asktext'])){
    $where['ask.asktext[~]'] = $_GET['asktext'];
    $asktext = '&asktext='.$_GET['asktext'];
}

// 按用户名
if (!empty($_GET['uname'])){
    $where['ask.uname[~]'] = $_GET['uname'];
    $uname = '&uname='.$_GET['uname'];
}

// 排序
$sql['ORDER']= ['ask.atime'=>'DESC'];
~~~



携带参数

~~~html
<div class="search">
    <div class="fl qiehuan">
        <a href="/admin/ask?state=0" {{ get.state == 0 ? 'class="sel"' :'' }}>待回复咨询</a>
        <a href="/admin/ask?state=1" {{ get.state == 1 ? 'class="sel"' :'' }}>已回复咨询</a>
    </div>
    <div class="fr searbox">
        <form method="get">
            <input type="hidden" name="state" value="{{get.state}}" />
            商品名称：<input type="text" name="name" value="{{get.name}}" class="inputtext inputtext_150" />
            咨询详情：<input type="text" name="asktext" value="{{get.asktext}}" class="inputtext inputtext_150" />
            用户名：<input type="text" name="uname" size="10" value="{{get.uname}}" class="inputtext" />
            <input type="submit" value="搜索" class="input2 tjbtn" />
        </form>
    </div>
    <div class="clear"></div>
</div>
~~~



商品名称统计数目不对，因为统计的是 ask 表中的数据，而 ask 表中没有 product.name 的数据，需要修改 count 统计

~~~php
$totalItems = $db->count('ask',
                         ['[>]product'=>['pid'=>'id']],
                         ['product.name'],
                         $where);
~~~





## 15. 后台回复管理

- 添加模板 footer ，header



- 获取资讯数据

~~~php
public function reply($id){
    $db = new BaseModel();
    $data = $db->get('ask',
                     ['[>]product'=>['pid'=>'id']],
                     ['ask.id','ask.pid','ask.atime','ask.uname','ask.replytext','ask.replytime','ask.state','ask.asktext','product.name'],
                     ['ask.id'=>$id]);
    $this->assign('data',$data);
    $this->assign('title','修改咨询');
    $this->display('ask/reply.html');
}
~~~



- 模板渲染

~~~html
<form  method="post" action="/admin/ask/doreply">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" class="wenzhang">
        <tr>
            <input type="hidden" name="id" value="{{data.id}}"/>
            <td class="bg_f8" align="right" width="100">商品名称：</td>
            <td class="font14"><a href="/product/{{data.pid}}" target="_blank" class="cblue">{{data.name}}</a></td>
        </tr>
        <tr>
            <td class="bg_f8" align="right">用 户 名：</td>
            <td class="font14"><a href="" target="_blank">{{data.uname}}</a></td>
        </tr>
        <tr>
            <td class="bg_f8" align="right">咨询时间：</td>
            <td class="font14">{{data.atime|date('Y-m-d')}}</td>
        </tr>
        <tr>
            <td class="bg_f8" align="right">咨询内容：</td>
            <td class="font14">{{data.asktext}}</td>
        </tr>
        <tr>
            <td class="bg_f8" align="right">管理回复：</td>
            <td><textarea name="replytext" style="width:450px;height:160px"></textarea></td>
        </tr>
        <tr>
            <td class="bg_f8">&nbsp;</td>
            <td><input type="submit" value="提 交" class="tjbtn" /></td>
        </tr>
    </table>
</form>
~~~



- 处理提交数据

~~~php
public function doreply(){
    $id = $_POST['id'];
    unset($_POST['id']);

    if(!empty($_POST['replytext'])){
        $_POST['replytime'] = time();
        $_POST['state'] = 1;
    } else {
        $_POST['replytime'] = $_POST['state'] = 0;
    }

    $db = new BaseModel();
    if($db->update('ask',$_POST,['id'=>$id])){
        $this->success('/admin/ask?status=1','更新成功');
    } else{
        $this->error('/admin/ask/reply/{$id}','更新失败');
    };
}
~~~



## 16. 后台评价

路由

~~~php
// 后台评价
Macaw::get('/admin/comment', '\admin\Comment@index');
Macaw::get('/admin/comment/mod/(:num)', '\admin\Comment@mod');
Macaw::post('/admin/comment/doupdate', '\admin\Comment@doupdate');
Macaw::get('/admin/comment/del/(:num)', '\admin\Comment@del');
Macaw::post('/admin/comment/alldel', '\admin\Comment@alldel');
~~~



复制修改后台资讯模块 ask.php

- 替换 ask 为 comment
- 修改类名 Ask 为 Comment
- 资讯替换为评价



获取首页数据

~~~php
public function index(){
    $db = new BaseModel();

    // 获取 GET 信息
    $get = $_GET;
    $this->assign('get',$get);

    // 过滤查找
    $where = [];

    // 按商品名称
    if(!empty($_GET['name'])){
        $where['product.name[~]'] = $_GET['name'];
        $name = '&name='.$_GET['name'];
    }

    // 按评价内容
    if (!empty($_GET['content'])){
        $where['comment.content[~]'] = $_GET['content'];
        $content = '&content='.$_GET['content'];
    }

    // 按用户名
    if (!empty($_GET['uname'])){
        $where['comment.uname[~]'] = $_GET['uname'];
        $uname = '&uname='.$_GET['uname'];
    }

    // 排序
    $sql['ORDER']= ['comment.atime'=>'DESC'];

    // 分页
    //        $totalItems = $db->count('comment','*',$where);
    $totalItems = $db->count('comment',
                             ['[>]product'=>['pid'=>'id']],
                             '*',
                             $where);
    $itemsPerPage = 5;
    $currentPage = $_GET['pagenum'] ?? 1;
    $urlPattern = '/admin/comment?pagenum=(:num)'.$name.$content.$uname;
    $paginator = new Paginator($totalItems, $itemsPerPage, $currentPage, $urlPattern);
    $this->assign('fpage', $paginator);

    // 计算每页起始编号
    $start = ($currentPage - 1) * $itemsPerPage;
    $sql['LIMIT']= [$start, $itemsPerPage];
    $sql = array_merge($sql, $where);

    $data = $db->select('comment',
                        ['[>]product'=>['pid'=>'id']],
                        ['comment.id','comment.pid','comment.uid','comment.uip','comment.atime','comment.uname','comment.content','product.name','product.logo'],
                        $sql);
    $this->assign('title', '评价列表');
    $this->assign('data',$data);
    $this->display('comment/index.html');
}
~~~



模板渲染

~~~html
{% for v in data %}
<tr>
    <td><input type="checkbox" name="id[]" value="{{v.id}}" /></td>
    <td>{{v.id}}</td>
    <td class="aleft">
        <a href="/product/{{v.pid}}" target="_blank" class="fl mat3" style="border:1px solid #ddd"><img src="{{uploads}}/product/{{v.logo}}" width="60" height="60"></a>
        <div class="fl" style="width:530px;margin-left:15px; display:inline;">
            <p><a href="/product/{{v.pid}}" target="_blank" class="cblue font14">{{v.name}}</a></p>
            <p class="c333 mat5 font13">[{{v.atime|date('Y-m-d')}}]评价：{{v.content}}</p>

        </div>
    </td>
    <td>{{v.uname}}</td>
    <td>
        <a href="/admin/comment/mod/{{v.id}}" class="admin_edit mar3">修改</a>
        <a href="/admin/comment/del/{{v.id}}" class="admin_del" onclick="return confirm('你确定要删除吗？')">删除</a>
    </td>
</tr>
{% endfor %}
~~~



携带条件筛选参数

~~~html
商品名称：<input type="text" name="name" value="{{get.name}}" class="inputtext inputtext_150" />
评价详情：<input type="text" name="content" value="{{get.content}}" class="inputtext inputtext_150" />
用户名：<input type="text" name="uname" value="{{get.uname}}" class="inputtext inputtext_100" />
~~~



修改页面

~~~php
public function mod($id){
    $db = new BaseModel();
    $data = $db->get('comment',
                     ['[>]product'=>['pid'=>'id']],
                     ['comment.id','comment.pid','comment.atime','comment.uname','comment.content','product.name'],
                     ['comment.id'=>$id]);
    $this->assign('data',$data);
    $this->assign('title','修改评价');
    $this->display('comment/mod.html');
}
~~~



渲染页面

~~~html
<form method="post" action="/admin/comment/doupdate">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" class="wenzhang">
        <tr>
            <input type="hidden" name="id" value="{{data.id}}">
            <td class="bg_f8" align="right" width="100">商品名称：</td>
            <td class="font14"><a href="/product/{{data.pid}}" target="_blank" class="cblue">{{data.name}}</a></td>
        </tr>
        <tr>
            <td class="bg_f8" align="right">评价日期：</td>
            <td class="font14">{{data.atime|date('Y-m-d')}}</td>
        </tr>
        <tr>
            <td class="bg_f8" align="right">用 户 名：</td>
            <td class="font14"><a href="http://www.ip138.com/ips.asp?ip={{data.uip}}" target="_blank">{{data.uname}}</a></td>
        </tr>
        <tr>
            <td class="bg_f8" align="right">评价内容：</td>
            <td><textarea name="content" style="width:450px;height:160px">{{data.content}}</textarea></td>
        </tr>
        <tr>
            <td class="bg_f8">&nbsp;</td>
            <td><input type="submit"  value="提 交" class="tjbtn" /></td>
        </tr>
    </table>
</form>
~~~



处理业务

~~~php
public function doupdate(){
    $id = $_POST['id'];
    unset($_POST['id']);

    $db = new BaseModel();
    if($db->update('comment',$_POST,['id'=>$id])){
        $this->success('/admin/comment?status=1','更新成功');
    } else{
        $this->error('/admin/comment/reply/{$id}','更新失败');
    };
}
~~~



更新评价个数

~~~php
~~~



# 个人中心

路由

~~~php
// 个人中心
Macaw::get('/user/order', '\home\User@order');
Macaw::get('/user/orderview', '\home\User@orderview');
Macaw::get('/user/orderdel', '\home\User@orderdel');
Macaw::get('/user/collect', '\home\User@collect');
Macaw::get('/user/collectdel', '\home\User@collectdel');
Macaw::get('/user/ask', '\home\User@ask');
Macaw::get('/user/comment', '\home\User@comment');
Macaw::any('/user/profile', '\home\User@profile');
Macaw::any('/user/pw', '\home\User@pw');
~~~



## 1. 设置模板文件

- 创建 public/sidebar.html 模板文件

~~~html
<div class="now">您现在的位置：<a href="../../../../index.php">首页</a> > 会员中心 > 我的咨询</div>
<div class="danye_left">
    <div class="danye_help">
        <div class="danye_tt"><s></s>会员中心</div>
        <div class="danye_list">
            <h3 class="fl_tb3"><s></s>交易管理</h3>
            <ul>
                <li class="fl_tb1"><a href="/user/order" >我的订单</a></li>
            </ul>
            <h3 class="fl_tb5"><s></s>信息管理</h3>
            <ul>
                <li><a href="/user/collect" >我的收藏</a></li>
                <li><a href="/user/ask"  class="sel" >我的咨询</a></li>
                <li><a href="/user/comment" >我的评价</a></li>
            </ul>
            <h3 class="fl_tb4"><s></s>个人信息</h3>
            <ul>
                <li class="fl_tb1"><a href="/user/profile" >基本资料</a></li>
                <li class="fl_tb1"><a href="/user/pw" >修改密码</a></li>
            </ul>
        </div>
    </div>
</div>
~~~



- 每个模板设置 header, footer, sidebar

- assign 传输模板标题

~~~php
$this->assign("title","基本资料");
~~~



- 给 sidebar 添加菜单标记位 class

~~~php
$this->assign("menumark","profile");
~~~



- sidebar 模板文件中携带标记位、标题

~~~html
<div class="now">您现在的位置：<a href="../../../../index.php">首页</a> > 会员中心 > {{title}}</div>
<div class="danye_left">
    <div class="danye_help">
        <div class="danye_tt"><s></s>会员中心</div>
        <div class="danye_list">
            <h3 class="fl_tb3"><s></s>交易管理</h3>
            <ul>
                <li class="fl_tb1"><a href="/user/order" {{ menumark == "order" ? 'class="sel"' : '' }}>我的订单</a></li>
            </ul>
            <h3 class="fl_tb5"><s></s>信息管理</h3>
            <ul>
                <li><a href="/user/collect" {{ menumark == "collect"? 'class="sel"' : '' }}>我的收藏</a></li>
                <li><a href="/user/ask"  {{ menumark == "ask" ? 'class="sel"' : '' }} >我的咨询</a></li>
                <li><a href="/user/comment" {{ menumark == "comment" ? 'class="sel"' : '' }}>我的评价</a></li>
            </ul>
            <h3 class="fl_tb4"><s></s>个人信息</h3>
            <ul>
                <li class="fl_tb1"><a href="/user/profile" {{ menumark == "profile" ? 'class="sel"' : '' }}>基本资料</a></li>
                <li class="fl_tb1"><a href="/user/pw" {{ menumark == "pw" ? 'class="sel"' : '' }}>修改密码</a></li>
            </ul>
        </div>
    </div>
</div>
~~~



- 加载模板

~~~html
$this->display("user/profile.html");
~~~





## 2. 个人资料

- 提取个人信息数据

~~~php
$db = new BaseModel();
$data = $db->get('user',['name','address','tname','phone','email','atime'],['id'=>$_SESSION['id']]);
$this->assigin('data',$data);
~~~



- 渲染模板
  
  - 标题信息
  - 表单信息
  
  

~~~html
 <h3 class="hy_rtt">{{title}}</h3>
~~~



~~~html
<tr>
    <td class="bg_f8" style="text-align:right;" width="100">用 户 名：</td>
    <td style="text-align:left;">{{data.id}}</td>
</tr>
<tr>
    <td class="bg_f8" style="text-align:right;">收货地址：</td>
    <td style="text-align:left;"><input type="text" name="address" value="{{data.address}}" class="inputall input400" /></td>
</tr>
<tr>
    <td class="bg_f8" style="text-align:right;">收货姓名：</td>
    <td style="text-align:left;"><input type="text" name="tname" value="{{data.tname}}" class="inputall input200" /></td>
</tr>
<tr>
    <td class="bg_f8" style="text-align:right;">联系电话：</td>
    <td style="text-align:left;"><input type="text" name="phone" value="{{data.phone}}" class="inputall input200" /></td>
</tr>
<tr>
    <td class="bg_f8" style="text-align:right;">常用邮箱：</td>
    <td style="text-align:left;"><input type="text" name="email" value="{{data.email}}" class="inputall input200" /></td>
</tr>
<tr>
    <td class="bg_f8" style="text-align:right;">注册日期：</td>
    <td style="text-align:left;">{{data.atime|date('Y-m-d')}}</td>
</tr>
~~~



- 处理修改业务
  - 如果有 do_submit，执行 update
  - unset do_submit
  - update 指定 id 信息
  - 更新成功/失败跳转

~~~php
// 个人信息的设置
public function profile(){
    $db = new BaseModel();
    $data = $db->get('user',['name','address','tname','phone','email','atime'],['id'=>$_SESSION['id']]);
    $this->assign('data',$data);

    if(!empty($_POST['do_submit'])){
        unset($_POST['do_submit']);
        if($db->update('user',$_POST,['id'=>$_SESSION['id']])){
            $this->success('/user/profile','更新成功');
        } else {
            $this->error('/user/profile','更新失败');
        }
    }
~~~



## 3. 修改密码

- 渲染模板
  - 标题信息
  - 用户名信息
  - 密码表单留空

~~~html
<h3 class="hy_rtt">{{title}}</h3>
~~~



~~~html
<td style="text-align:left;">{{session.name}}</td>
~~~



- 处理修改业务
  - 判断 do_submit
  - 判断 pw 是否一致（失败进行跳转）
  - 更新当前用户数据库密码字段

~~~php
public function pw(){
    $db = new BaseModel();

    if(isset($_POST['do_submit'])){
        if($_POST['pw'] != $_POST['pw1']){
            $this->error('/user/profile','两次密码输入不一致');
        }
        if($db->update('user',['pw'=>md5(md5('ew_$%^' . $_POST['pw']))],['id'=>$_SESSION['id']])){
            $this->success('/user/pw','更新成功');
        } else {
            $this->error('/user/pw','更新失败');
        }
    }

    $this->assign("title","我的密码");
    $this->assign("menumark","pw");
    $this->display("user/pw.html");
}
~~~





## 4. 我的评价

- 引入分页命名空间

~~~php
use JasonGrimes\Paginator;
~~~



- 评论业务处理

~~~php
// 我的评价
public function comment(){
    $db = new BaseModel();
    // 过滤查找
    $where['uid'] = $_SESSION['id'];

    // 排序
    $sql['ORDER']= ['comment.atime'=>'DESC'];

    // 分页
    $totalItems = $db->count('comment','*',$where);
    $itemsPerPage = 5;
    $currentPage = $_GET['pagenum'] ?? 1;
    $urlPattern = '/admin/comment?pagenum=(:num)';
    $paginator = new Paginator($totalItems, $itemsPerPage, $currentPage, $urlPattern);
    $this->assign('fpage', $paginator);

    // 计算每页起始编号
    $start = ($currentPage - 1) * $itemsPerPage;
    $sql['LIMIT']= [$start, $itemsPerPage];
    $sql = array_merge($sql, $where);

    $data = $db->select('comment',
                        ['[>]product'=>['pid'=>'id']],
                        ['comment.id','comment.pid','comment.uid','comment.uip','comment.atime','comment.uname','comment.content','product.name','product.logo'],
                        $sql);
    $this->assign("data",$data);
    $this->assign("title","我的评价");
    $this->assign("menumark","comment");
    $this->display("user/comment.html");
}
~~~



- 渲染页面

~~~HTML
{% for v in data %}
<div style="border-bottom:1px #ddd dashed;padding:20px 0 15px">
    <a href="/product/{{v.pid}}" target="_blank" class="fl mat3" style="border:1px solid #ddd"><img src="{{uploads}}/product/{{v.logo}}" width="60" height="60"></a>
    <div class="fl" style="width:695px; margin-left:15px; display:inline;">
        <p><a href="/product/{{v.pid}}" target="_blank" class="cblue font14">{{v.name}}</a></p>
        <p class="corg mat5 font13"> [{{v.atime|date('Y-m-d')}}]评价：{{v.content}}</p>
    </div>
    <div class="clear"></div>
</div>
{% endfor %}
~~~



- 标题

~~~html
<h3 class="hy_rtt">{{title}}</h3>
~~~



- 分页

~~~html
{% autoescape false %}
{{fpage}}
{% endautoescape %}
~~~





## 5. 我的咨询

- 处理业务

~~~php
// 我的咨询
public function ask(){
    $db = new BaseModel();

    // 排序
    $sql['ORDER']= ['ask.atime'=>'DESC'];

    $where['uid'] = $_SESSION['id'];
    // 分页
    $totalItems = $db->count('ask',
                             ['[>]product'=>['pid'=>'id']],
                             ['product.name'],
                             $where);
    $itemsPerPage = 5;
    $currentPage = $_GET['pagenum'] ?? 1;
    $urlPattern = '/user/ask?pagenum=(:num)';
    $paginator = new Paginator($totalItems, $itemsPerPage, $currentPage, $urlPattern);
    $this->assign('fpage', $paginator);

    // 计算每页起始编号
    $start = ($currentPage - 1) * $itemsPerPage;
    $sql['LIMIT']= [$start, $itemsPerPage];
    $sql = array_merge($sql, $where);

    $data = $db->select('ask',
                        ['[>]product'=>['pid'=>'id']],
                        ['ask.id','ask.pid','ask.uid','ask.uip','ask.atime','ask.uname','ask.replytext','ask.replytime','ask.state','ask.asktext','product.name','product.logo'],
                        $sql);
    $this->assign('data',$data);
    $this->assign("title","我的咨询");
    $this->assign("menumark","ask");
    $this->display("user/ask.html");
}
~~~



- 渲染模板

~~~html
{% for v in data %}
<div style="border-bottom:1px #ddd dashed;padding:20px 0 15px">
    <a href="/product/{{v.pid}}" target="_blank" class="fl mat3" style="border:1px solid #ddd"><img src="{{uploads}}/product/{{v.logo}}" width="60" height="60"></a>
    <div class="fl" style="width:695px; margin-left:15px; display:inline;">
        <p><a href="/product/{{v.pid}}" target="_blank" class="cblue font14">{{v.name}}</a></p>
        <p class="mat5 font13">[{{v.atime|date('Y-m-d')}}]咨询：{{v.asktext}}</p>
        {% if replytext != null %}
        <p class="mat5 cred font13" style="text-align:left">[{{v.atime|date('Y-m-d')}}]回复：{{v.replytext}}</p>
        {% endif %}
    </div>
    <div class="clear"></div>
</div>
{% endfor %}
~~~



- 标题

~~~html
<h3 class="hy_rtt">{{title}}</h3>
~~~



- 分页

~~~html
{% autoescape false %}
{{fpage}}
{% endautoescape %}
~~~



## 6. 我的收藏

- 处理业务

~~~php
public function collect(){
    $db = new BaseModel();

    // 排序
    $sql['ORDER']= ['atime'=>'DESC'];
    $where['uid'] = $_SESSION['id'];

    // 分页
    $totalItems = $db->count('collect','*',$where);
    $itemsPerPage = 5;
    $currentPage = $_GET['pagenum'] ?? 1;
    $urlPattern = '/user/collect?pagenum=(:num)';
    $paginator = new Paginator($totalItems, $itemsPerPage, $currentPage, $urlPattern);
    $this->assign('fpage', $paginator);

    // 计算每页起始编号
    $start = ($currentPage - 1) * $itemsPerPage;
    $sql['LIMIT']= [$start, $itemsPerPage];
    $sql = array_merge($sql, $where);

    $data = $db->select('collect',
                        ['[>]product'=>['pid'=>'id']],
                        ['collect.id','collect.pid','collect.atime','product.name','product.logo', 'product.money'],
                        $sql);

    $this->assign('data',$data);
    $this->assign("title","我的收藏");
    $this->assign("menumark","collect");
    $this->display("user/collect.html");
}
~~~



- 渲染模板

~~~html
{% for v in data %}
<tr>
    <td class="hotimg">
        <a class="fl mar5" href="/product/{{v.pid}}"><img src="{{v.uploads}}/product/{{v.logo}}" width="60" height="60" /></a>
        <a href="/product/{{v.pid}}" title="{{v.name}}" target="_blank" class="cblue fl mat20 mal5">{{v.name}}</a>
        <div class="clear"></div>
    </td>
    <td class="money1"<small>￥</small>{{v.money}}</td>
<td class="c666">{{v.atime|date('Y-m-d H:i:s')}}</td>
<td><a class="cblue" href="/user/collectdel?id={{v.uid}}&pid={{v.pid}}" onclick="return confirm('确定要删除这个收藏吗?')">删除</a></td>
</tr>
{% endfor %}
~~~





- 标题

~~~html
<h3 class="hy_rtt">{{title}}</h3>
~~~



- 分页

~~~html
{% autoescape false %}
{{fpage}}
{% endautoescape %}
~~~



- 删除收藏

~~~php
public function collectdel(){
    $db = new BaseModel();
    if($db->delete('collect',['id'=>$_GET['id'],'pid'=>$_GET['pid']])){
        $db->update('product',['collect[-]'=>1],['id'=>$_GET['pid']]);
        $this->success('/user/collect','更新成功');
    } else {
        $this->error('/user/collect','更新失败');
    }
}
~~~



# 购物车

## 1. 无登录状态购物车

使用数组存储没有登录用户的购物车数据，存放在 SESSION 中，例：

~~~php
$cart[721] = array('atime'=>time(), 'pnum'=>3);
$cart[898] = array('atime'=>time(), 'pnum'=>1);
$_SESSION['cart'] = $cart;
~~~

> $cart 下标为商品 id



存放在 Cookie 中

~~~php
$cart[721] = array('atime'=>time(), 'pnum'=>3);
$cart[898] = array('atime'=>time(), 'pnum'=>1);
setcookie('cart_list', serialize($cart), 0, '/');

// 获取时需要反序列化
$cart_list = unserialize(stripcslashes($_COOKIE['cart_list']));
~~~



- 路由
- home/order.php
- function ordderadd()
  - 通过 get 创建购物车数组
  - 通过 get 数据拿到商品信息
  - 存放到 cookie



前端按钮，点击按钮指向 js 中的 cart_add 方法

~~~html
<a href="javascript:;" onclick="cart_add('{{data.id}}');" class="fl">
~~~



- 访问后端 /order/cartadd，传递数据 商品ID（pid），商品数量（pnum）
  - 如果拿到返回 JSON 数据中 result 为 true，弹出对话框
  - 如果 result 为 -1，提示商品库存不足
  - 否则提示加入购物车失败

~~~js
function cart_add(id) {
    $.getJSON("/order/cartadd", {"pid":id,"pnum":$(":input[name='product_num']").val()},function(json){

        if (json.result == true) {
            art.dialog({
                id: 'cart_add',
                lock: true,
                content: '<div class="gw"><p>商品已成功加入购物车！</p><a class="gw2" href="/order/add"></a><a class="gw1" href="javascript:dialog_close();"></a></div>'
            });
        }else if (json.result == -1) {
            alert('商品库存不足...')
        } else {
            alert('抱歉，加入购物车失败，请重新加入...')
        }
    })
}
~~~



创建 /order/cartadd 路由

~~~php
Macaw::get('/order/cartadd', '\home\order@cartadd');
~~~



创建控制器

~~~php
<?php
    namespace home;

use models\BaseModel;

final class Order extends home {
    public function cartadd(){
        $db = new BaseModel();

        // 构建单商品购物车数组
        $cart['atime']= time();
        $cart['pid']= intval($_GET['pid']);
        $cart['pnum']= intval($_GET['pnum']);

        // 获取商品信息
        $product = $db->get('product','*',['id'=>$_GET['pid']]);

        // 检查购物车中商品数量必须小于库存
        if($product['num'] >= $cart['pnum']){
            // 取出 cookie 中的购物车记录
            $cart_list = unserialize(stripcslashes($_COOKIE['cart_list']));

            $product_index = $cart['pid'];

            // 如果购物车已经添加过该商品，则增加数量
            if(is_array($cart_list[$product_index])){
                $cart_list[$product_index]['pnum']  += $cart['pnum'];
            } else {
                // 将商品添加到购物车数组中（一条数据，下标为商品ID）
                $cart_list[$product_index] = $cart;
            }

            $result = true;

            // 将购物车数据，添加到 Cookie 中
            setcookie('cart_list',serialize($cart_list),0,'/');
        } else {
            $result = -1;
        }
        echo json_encode(array('result'=>$result));
        exit;


    }
}
~~~



## 2. 登录状态购物车

首先需要判断登录状态

~~~php
if(ew_login('user')){

} else {

}
~~~

> true 则将购物车记录插入数据库中， false 则是用 cookie 记录购物车记录（将上方代码放到 else 代码段）



~~~php
if(ew_login('user')){
    $cart['uid']= $_SESSION['id'];
    // 查询当前用户已经添加该商品
    $carttab = $db->get('cart','*',['uid'=>$_SESSION['id'], 'pid'=>$cart['pid']]);
    // 如果已经添加过购物车，那么更新商品数量
    if($carttab['pnum']){
        $result = $db->update('cart',['pnum[+]'=>$cart['pnum']],['id'=>$carttab['id']]) ? true : false;
    } else{
        $result = $db->insert('cart',$cart) ? true : false;
    }
~~~



完整代码：

~~~php
public function cartadd(){
    $db = new BaseModel();

    // 构建单商品购物车数组
    $cart['atime']= time();
    $cart['pid']= intval($_GET['pid']);
    $cart['pnum']= intval($_GET['pnum']);

    // 获取商品信息
    $product = $db->get('product','*',['id'=>$_GET['pid']]);

    $result = -1;

    // 检查购物车中商品数量必须小于库存
    if($product['num'] >= $cart['pnum']){

        // 如果是登录用户
        if(ew_login('user')){
            $cart['uid']= $_SESSION['id'];
            // 查询当前用户已经添加该商品
            $carttab = $db->get('cart','*',['uid'=>$_SESSION['id'], 'pid'=>$cart['pid']]);
            // 如果已经添加过购物车，那么更新商品数量
            if($carttab['pnum']){
                $result = $db->update('cart',['pnum[+]'=>$cart['pnum']],['id'=>$carttab['id']]) ? true : false;
            } else{
                $result = $db->insert('cart',$cart) ? true : false;
            }

        } else {
            // 取出 cookie 中的购物车记录
            $cart_list = unserialize(stripcslashes($_COOKIE['cart_list']));

            $product_index = $cart['pid'];

            // 如果购物车已经添加过该商品，则增加数量
            if(is_array($cart_list[$product_index])){
                $cart_list[$product_index]['pnum']  += $cart['pnum'];
            } else {
                // 将商品添加到购物车数组中（一条数据，下标为商品ID）
                $cart_list[$product_index] = $cart;
            }

            $result = true;

            // 将购物车数据，添加到 Cookie 中
            setcookie('cart_list',serialize($cart_list),0,'/');
        }
    }
    echo json_encode(array('result'=>$result));
    exit;

}
~~~



## 3. 合并状态

获取购物车数量信息，显示在页面头部，因为是全局的，可以放在 home 基类中

~~~php
// 购物车信息
// 如果是用户登录
if(ew_login('user')){
    $cartnum = $db->count('cart',['uid'=>$_SESSION['id']]);
} else {
    // 读取 Cookie 中购物车数据
    if(unserialize(stripcslashes($_COOKIE['cart_list']))){
        $cartnum = count(unserialize(stripcslashes($_COOKIE['cart_list'])));
    } else {
        $cartnum = 0;
    }
}
$this->assign('cartnum',$cartnum);
~~~



在登录后，进行合并操作，user 控制器

~~~php
$cart_list = unserialize(stripcslashes($_COOKIE['cart_list']));
if(is_array($cart_list)){
    // 取出表中购物车数据
    $cartinfo = $db->select('cart','*',['uid'=>$user['id']]);

    // 将表的数组格式转换为 COOKIE 格式
    $cart_row = [];
    foreach($cartinfo as $v){
        $cart_row[$v['pid']] = $v;
    }

    // 比较两个数组
    foreach($cart_list as $k=>$v){
        // 如果cookie中存在与表中
        if(array_key_exists($k,$cart_row)) {
            // 更新表中数据，pnum 增加
            $db->update('cart',['pnum'=>intval($cart_row[$k]['pnum'] + $cart_list[$k]['pnum'])], ['id'=>$cart_row[$k]['id']]);
            // 否则将 cookie 中数据插入到数据库
        } else {
            $cart_info['atime'] = time();
            $cart_info['pid'] = intval($k);
            $cart_info['pnum'] = intval($v['pnum']);
            $cart_info['uid'] = $user['id'];
            $db->insert('cart',$cart_info);
        }
    }

    // 清空购物车信息
    setcookie('cart_list','',time()-3600,'/');

}
~~~



## 4. 显示订单

路由

~~~php
Macaw::any('/order/add', '\home\Order@add');
~~~



- 添加 header, footer











# 未解决问题：

- macaw 路由: xxx.com/admin 和 xxx.com/admin/ 路由不一致
- 为什么直接访问 config.inc.php 不可以（未定义路由），但是如果在该文件使用 dd 方法就可以访问
- 没有前台后台验证管理员空密码
- 后台批量更新排序是采取事务模式吗？
- composer 上传组件图片视频压缩切片工具
- 上传文件扩展名大写会被认为是 INVALID
- 用户登录失败表单没有记录
- 搜索，name 字段传值为空，应该隐藏 get 字段 https://ewshop.com/admin/article?name=&cid=1
- 真正项目中实际上是没有删除的，而是做隐藏标记
- 修改和删除时，需要进一步在后端查看是否有子类，不能光靠 GET 参数来验证
- 删除商品、文章时，需要删除关联资源文件（图片）
- 经常调用的数据，可以使用缓存，用户读取先从缓存读取，如果缓存中没有才执行 PHP
- 获取图片通过 PHP 方法，将原图压缩成指定大小，并调用压缩后的图片。如果存在就直接调用
- 访客信息刷新一次就增加一条记录，最好根据 session 给定时间来判断
- 广告位上架、下架、过期时间
- 删除商品评价和咨询没有同步数量
- 个人中心密码没有原密码验证，没有做密码强度检查







