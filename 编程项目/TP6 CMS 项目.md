# 部署环境

## 1. 安装

~~~shell
composer create-project topthink/think tpcms
~~~

> tp6 为文件夹名称



## 2. 测试

- 访问 `127.0.0.1/tpcms/public/` 可以正常访问



## 3. 域名指向

- 设置域名 tp6blog.com 指向为 127.0.0.1/tpcms/public/
- 修改 host 文件



## 4. 开启开发 debug 模式

修改 `/.example.env` 为 `.env` 文件

然后查看 debug 模式是否打开

~~~
APP_DEBUG = true
~~~



## 5. 开启多应用模式

安装多应用模式扩展

~~~
composer require topthink/think-multi-app
~~~



## 6. 修改入口文件地址（可选）

将 public 文件夹内 index.php 等文件，放到根目录

~~~
.htaccess
favicon.ico
index.php
robots.txt
router.php
~~~

> static 静态资源文件夹不需要移动



如果修改入口文件，需要修改 index.php 中的环境变量

~~~
require __DIR__ . './vendor/autoload.php';
~~~



## 7. 安装模板引擎驱动

新版仅内置了PHP原生模板引擎（主要用于内置的异常页面输出），如果需要使用其它的模板引擎需要单独安装相应的模板引擎扩展。

安装think-view 模板引擎驱动

~~~
composer require topthink/think-view
~~~

> 在项目 tp6 目录下安装



# 数据库结构设计

管理员表 tp_admin

| 字段        | 说明     | 类型    |      |
| ----------- | -------- | ------- | ---- |
| id          | 主键     | INT     |      |
| username    | 用户名   | VARCHAR | 30   |
| password    | 密码     | VARCHAR | 32   |
| nickname    | 昵称     | VARCHAR | 30   |
| email       | 邮箱     | VARCHAR | 30   |
| status      | 状态     | TINYINT | 2    |
| create_time | 添加事件 | INT     | 11   |
| update_time | 更新事件 | INT     | 11   |
| delete_time | 软删除   | INT     | 11   |



会员表 tp_member

| 字段        | 说明     |
| ----------- | -------- |
| id          | 主键     |
| username    | 用户名   |
| password    | 密码     |
| nickname    | 昵称     |
| email       | 邮箱     |
| status      | 状态     |
| create_time | 添加事件 |
| update_time | 更新事件 |
| delete_time | 软删除   |



分类表 tp_cate

| 字段        | 说明     |
| ----------- | -------- |
| id          | 主键     |
| catename    | 分类名   |
| sort        | 排序     |
| create_time | 添加事件 |
| update_time | 更新事件 |
| delete_time | 软删除   |



文章表 tp_article

| 字段        | 说明     |
| ----------- | -------- |
| id          | 主键     |
| title       | 文章标题 |
| desc        | 文章概要 |
| tags        | 标签     |
| content     | 内容     |
| is_top      | 是否置顶 |
| cate_id     | 所属分类 |
| create_time | 添加时间 |
| update_time | 更新时间 |
| delete_time | 软删除   |



评论表 tp_comment

| 字段        | 说明     |
| ----------- | -------- |
| id          | 主键     |
| content     | 内容     |
| article_id  | 评论文章 |
| member_id   | 评论用户 |
| create_time | 添加时间 |
| update_time | 更新时间 |
| delete_time | 软删除   |



系统设置表 tp_system

| 字段         | 说明     |
| ------------ | -------- |
| id           | 主键     |
| website_name | 网站名称 |
| copyright    | 版权信息 |
| cretae_time  | 添加时间 |
| update_time  | 更新时间 |
| delete_time  | 软删除   |



# 部署前端文件

## 1. 创建目录结构

~~~
├─app 应用目录
│ ├─index 主应用
│ │ ├─controller 控制器目录
│ │ ├─model 模型目录
│ │ ├─view 视图目录
│ │ ├─config 配置目录
│ │ ├─route 路由目录
│ │ └─ ... 更多类库目录
│ │
│ ├─admin 后台应用
│ │ ├─controller 控制器目录
│ │ ├─model 模型目录
│ │ ├─view 视图目录
│ │ ├─config 配置目录
│ │ ├─route 路由目录
│ │ └─ ... 更多类库目录
│
├─public WEB目录（对外访问目录）
│ ├─admin.php 后台入口文件
│ ├─index.php 入口文件
│ ├─router.php 快速测试文件
│ ├─.htaccess 用于apache的重写
│ ├─static 静态资源文件夹
│ │ ├─admin 后台前端静态资源
│ │ ├─index 前台前端静态资源
│ │ ├─mobile 移动端前端静态资源
│ │ ├─lib 公用库文件
~~~



## 2. 创建控制器和视图

- 创建控制器，可以通过脚手架进行创建

~~~
php think make:controller admin@Index --plain
~~~

> 创建后台应用主页控制器，--plain 是空的控制器



空的控制器

~~~php
<?php
declare (strict_types = 1);

namespace app\admin\controller;

class Index
{
    //
}

~~~



- 也可以手动创建

app/admin/controller/Index.php

~~~php
<?php

namespace app\admin\controller;

use app\BaseController;
use think\facade\View;

class Index extends BaseController {
    public function index() {
        return View::fetch();
    }
}
~~~

> 命名空间需对应多应用路径



## 3. 创建视图文件

app/admin/index/view/index/index.html

~~~html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    后台应用首页
  </body>
</html>

~~~



访问首页 tpcms.com/admin/ 应该可以看到我们刚才的视图文件



入口文件解析：

http://tpcms.com/index.php/admin/index/index

http://tpcms.com/index.php/index/index/index

~~~
index.php 项目入口文件
admin 控制器命名空间
index 类
index 方法
~~~



## 4. 放入模板文件

将视图文件放入对应的视图文件夹中，如：

HTML 静态页面放入视图文件夹

- app/admin/view/index
- app/index/view/index



如后台前端登录页面：

~~~
app/admin/view/index/login.html
~~~



## 5. 放入静态资源

静态资源放入 public/static 文件夹

- public/static/admin/css/

- public/static/admin/js/

- public/static/index/css/

- public/static/index/js/

- public/static/mobile

  

静态资源文件还可以创建 upload 文件夹，以备以后需要上传文件使用

- public/upload



## 4. 修改静态资源路径

此时页面已经加载，但是无法正确加载 css, js 文件



修改 config/view.php

添加静态路径替换变量，如：

~~~php
    // 模板输出字符串替换
    'tpl_replace_string' => [
        '__STATIC__' => '/static',
        '__JS__' => '/static/js',
    ],
~~~



添加域名

~~~php
// 模板输出字符串替换
'tpl_replace_string' => [
    '__STATIC__' => 'http://tpcms.com' . '/static',
],
~~~



# 配置数据库

## 1. 修改 .env 文件

可以通过修改 .env 文件来配置数据库（不建议）

~~~
APP_DEBUG = true

[APP]
DEFAULT_TIMEZONE = Asia/Shanghai

[DATABASE]
TYPE = mysql
HOSTNAME = 127.0.0.1
DATABASE = 
USERNAME = username
PASSWORD = password
HOSTPORT = 3306
CHARSET = utf8
DEBUG = true

[LANG]
default_lang = zh-cn
~~~



## 2. 修改 config/database.php

注意 .env 的优先级要比 database.php 要高，为了避免暴露数据，最好将 .env 中的数据库配置删除，然后再 config/database.php 中进行配置

主要修改信息：

- 自动写入时间戳

- 数据库地址

- 数据库名

- 数据库用户名

- 数据库密码

- 数据库端口

- 数据库编码

- 数据库前缀

  

~~~json
<?php

return [
    // 默认使用的数据库连接配置
    'default'         => env('database.driver', 'mysql'),

    // 自定义时间查询规则
    'time_query_rule' => [],

    // 自动写入时间戳字段
    // true为自动识别类型 false关闭
    // 字符串则明确指定时间字段类型 支持 int timestamp datetime date
    'auto_timestamp'  => true,

    // 时间字段取出后的默认时间格式
    'datetime_format' => 'Y-m-d H:i:s',

    // 时间字段配置 配置格式：create_time,update_time
    'datetime_field'  => '',

    // 数据库连接配置信息
    'connections'     => [
        'mysql' => [
            // 数据库类型
            'type'            => env('database.type', 'mysql'),
            // 服务器地址
            'hostname'        => env('database.hostname', '127.0.0.1'),
            // 数据库名
            'database'        => env('database.database', 'tpcms'),
            // 用户名
            'username'        => env('database.username', 'root'),
            // 密码
            'password'        => env('database.password', ''),
            // 端口
            'hostport'        => env('database.hostport', '3306'),
            // 数据库连接参数
            'params'          => [],
            // 数据库编码默认采用utf8
            'charset'         => env('database.charset', 'utf8mb4'),
            // 数据库表前缀
            'prefix'          => env('database.prefix', 'tp_'),

            // 数据库部署方式:0 集中式(单一服务器),1 分布式(主从服务器)
            'deploy'          => 0,
            // 数据库读写是否分离 主从式有效
            'rw_separate'     => false,
            // 读写分离后 主服务器数量
            'master_num'      => 1,
            // 指定从服务器序号
            'slave_no'        => '',
            // 是否严格检查字段是否存在
            'fields_strict'   => true,
            // 是否需要断线重连
            'break_reconnect' => false,
            // 监听SQL
            'trigger_sql'     => env('app_debug', true),
            // 开启字段缓存
            'fields_cache'    => false,
        ],

        // 更多的数据库配置信息
    ],
];

~~~



## 3. 测试数据库

- 创建 tpcms 数据库
- 创建 tp_user 表
- 添加字段 id、user、number



app/index/controller/Index/Index.php

~~~php
<?php

namespace app\index\controller;

use app\BaseController;
use think\facade\View;
// 引入 Db 类
use think\facade\Db;

class Index extends BaseController {
    public function index() {

        // 测试插入数据
        $res = Db::name('users')->insert([
            'name' => '张三',
            'number' => 1
        ]);        
        halt($res);

        // return View::fetch();
    }
}
~~~

> halt() 函数为中断程序，类似 die(), exit()



~~~php
// 测试更新数据
$res = Db::name('user')->where('id', 1)->update([
    'name' => '李四',
    'number' => 1
]);

// 也可以使用数组形式更新，不过一定要有主键，如：
$res = Db::name('user')->update([
    'name' => '王五',
    'number' => 1,
    'id' => 2
]);
~~~



~~~php
// 查询二维数据
$res = Db::name('user')->select()->toArray();
~~~

> select() 返回的是一个对象，转成数组



~~~php
// 查询一维数据
$res = Db::name('user')->find(2);
~~~



~~~php
// 删除数据（按主键删除）
$res = Db::name('user')->delete(1);

// 删除数据（按查询条件删除）
$res = Db::name('user')->delete(1);
~~~



## 4. 通过模型做CRUD

创建模型 app\common\model\User.php

~~~php
<?php

namespace app\common\model;

use think\Model;

class User extends Model {
  protected $name = 'user';
}
~~~



同样在 controller 中操作

~~~php
<?php

namespace app\index\controller;

use app\BaseController;
// 引入模型
use app\common\model\Users;
use think\facade\View;

class Index extends BaseController {
    public function index() {
        
        // 创建模型对象，添加数据
        $user = new User();
        $user->name = 'thinkphp';
        $user->number = 19;
        $res = $user->save();

        halt($res);

        // return View::fetch();
    }
}
~~~



~~~php
// 更新数据
$user = User::find(3);
$user->name = '吕布';
$user->number = 19;
$res = $user->save();
~~~



~~~php
// 删除数据
$user = User::find(4);
$res = $user->delete();
halt($res);
~~~



~~~php
// 查询数据
$res = User::find(4)->toArray();
halt($res);


// 查询多条数据
$res = Users::select([2, 3, 4, 5])->toArray();
halt($res);
~~~



# 渲染模板

将 php 文件中的数据（变量）渲染在视图模板文件中（HTML）



- 通过 View 类进行渲染
- 通过助手函数进行渲染（推荐）



## 1. 通过 View 类进行渲染

~~~php
<?php

namespace app\index\controller;

use app\BaseController;
// 需要引入 View 类
use think\facade\View;

class Index extends BaseController {
    public function index() {

        // 定义变量
        $test = 'test data';

        // 渲染 index 文件夹中对应模板（index.html）
        return View::fetch('index', [
            // 定义模板字符串对应的变量
            'test' => $test
        ]);
    }
}
~~~

> 调用当前控制器下面的 index 模板



在对应路径中创建模板文件，如 Index 控制器中对应模板则是 `app\index\view\index\index.html`

在模板文件中使用 `{$test}` 调用变量

~~~html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    {$test}
  </body>
</html>

~~~



如果想渲染其他控制器的模板，需要加上路径，如：

~~~php
return View::fetch('member/read');
~~~

> 表示调用Member控制器下面的read模板。



如果是默认 index 文件，则可以用空字符串使用默认值

~~~php
return View::fetch('', [
    'test' => $test
~~~



## 2. 通过助手函数

通过助手函数不需要引入 View 类，直接使用 view 函数，如：

~~~php
<?php

namespace app\index\controller;

use app\BaseController;

class Index extends BaseController {
    public function index() {

        // 定义变量
        $test = 'test data';

        // 渲染 index 文件夹中对应模板（index.html）
        return view('index', [
            // 定义模板字符串对应的变量
            'test' => $test
        ]);
    }
}
~~~



## 3. 遍历数据库中的数据

将数据库中的数据遍历渲染在模板上，控制器读取数据库 users 表中所有数据，并定义模板变量

~~~php
<?php

namespace app\index\controller;

use app\BaseController;
use think\facade\Db;

class Index extends BaseController {
    public function index() {

        $data = Db::name('users')->select()->toArray();

        return view('index', [
            'data' => $data
        ]);
    }
}
~~~



模板

~~~html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    {volist name='$data', id='vo'}
    <li>{$vo.name} - {$vo.number}</li>
    {/volist}
  </body>
</html>

~~~

> 模板中遍历方法，name 为传入变量，$id 为遍历项



# Ajax 提交数据

通过 Ajax 提交数据，经过控制器来对数据库进行 CRUD



## 1. 提交数据

在 index 控制器中创建一个 form 方法

~~~php
public function form() {
    return view('form');
}
~~~



创建一个对应模板，如：view/index/form.html

~~~html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="__STATIC__\lib\jquery-3.4.1\jquery-3.4.1.min.js"></script>
    <title>Document</title>
  </head>
  <body>
    <form action="POST">
      姓名：<input type="text" name="name" /> <br />
      编号：<input type="text" name="number" /><br />
      <a id="submit" href="javascript:;">提交</a>
    </form>

    <script>
      $('#submit').click(function () {
        var name = $("input[name='name").val()
        var number = $("input[name='number").val()

        // ajax 提交
        var url = 'user'
        postData = {
          name,
          number,
        }

        $.post(
          url,
          postData,
          function (result) {
            if (result.code == 1) {
              alert('提交成功')
            }
          },
          'json'
        )
      })
    </script>
  </body>
</html>

~~~



url 提交为 'user' 代表为当前控制器中的方法，如果需要调用其他应用或其他控制器下的方法的话，那么需要加上路径，如：

~~~html
var url = 'admin/index/user'
~~~



创建对应的 user 方法

~~~php
    public function user() {
        // input 助手函数，接受 post 传递过来的所有参数
        $data = input('post.');
        $res = Db::name('users')->insert($data);
        if ($res) {
            // json 助手函数，将数组转换为 json 格式
            return json(['msg' => 'success', 'code' => 1]);
        } else {
            return json(['msg' => 'error', 'code' => 0]);
        }
    }
~~~



## 2. 检验数据是否合法

所有提交的数据都需要做数据检验，避免无效数据以及有害数据

- 前端验证
- 后端验证



### 2.1 前端验证

编号必须是数字，将 type 改为 number

~~~html
编号：<input type="number" name="number" /><br />
~~~



但是这里有一个缺陷，我们可以输入字母 e、+、-，这是因为字母 e 算是科学计数法，比如 `1.87e+27`，解决办法：

~~~html
编号：<input type="number" name="number" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" /><br />
~~~



### 2.2 后端验证

后端验证需要创建 thinkphp 的验证器





# 隐藏入口文件 index.php

可以通过URL重写隐藏应用的入口文件index.php （也可以是其它的入口文件，但URL重写通常只能设置一个入口文件）,下面是相关服务器的配置参考：

[ Apache ]

1. httpd.conf 配置文件中加载了mod_rewrite.so 模块
2. AllowOverride None 将None 改为 All
3. 把下面的内容保存为.htaccess 文件放到应用入口文件的同级目录下

~~~
<IfModule mod_rewrite.c>
Options +FollowSymlinks -Multiviews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^(.*)$ index.php/$1 [QSA,PT,L]
</IfModule>
~~~



[ Nginx ]

在Nginx低版本中，是不支持PATHINFO的，但是可以通过在Nginx.conf 中配置转发规则实现：

~~~
location / { 
// …..省略部分代码
    if (!-e $request_filename) {
    rewrite ^index.php(.*)$ /index.php?s=/$1 last;
    rewrite ^(.*)$ /index.php?s=/$1 last;
    }
}
~~~







# 开启路由

在 config\route.php 开启强制路由和强制路由匹配

~~~
// 是否强制使用路由
'url_route_must' => true,
// 路由是否完全匹配
'route_complete_match' => true,
~~~



定义路由

- 删除全局路由 route\app.php
- 在每个应用中创建 route\app.php



设置后台登陆页面路由

app\admin\route\app.php

~~~php
<?php

use think\facade\Route;

// 主页
Route::get('index','Index/index');

// 登录页
Route::get('login','Login/index');

// 登录验证
Route::post('login/check','Login/check');

// 验证码
Route::get('verify/index','Verify/index');
Route::get('verify/index/&k=:id','Verify/index');

// 统计页面
Route::get('welcome','Index/welcome');
~~~



验证码路由

~~~html
<img id="refreshCaptcha" class="validateImg" src="{:url('verify/index')}"
     onclick="this.src='/admin/verify/index/&k='+Math.random();"/>
~~~

> url 助手函数返回的 URL 默认是带 .html 后缀的，要么修改路由规则，把所有路由加上 .html 要么就改配置



confg\route.php

~~~
<?php

return [
    // pathinfo分隔符
    'pathinfo_depr' => '/',
    // URL伪静态后缀
    'url_html_suffix' => '',
~~~

> 伪静态后缀为空



验证码路由

~~~php
Route::get('verify/index','Verify/index');
Route::get('verify/index/&k=:id','Verify/index');
~~~







# 后台登陆页面

## 1. 创建控制器对应方法

app\admin\controller\Login.php

~~~php
<?php

namespace app\admin\controller;

use app\BaseController;

class Login extends BaseController {
  public function index() {
    return view();
  }
}
~~~



## 2. 创建模板

app\admin\view\Login\index.html



## 3. 引入静态资源

- public\static\admin\images
- public\static\admin\lib
- public\static\admin\css
- public\static\admin\js



## 4. 修改模板文件中静态资源地址

~~~html
<link rel="stylesheet" href="__STATIC__/admin/lib/layui-v2.6.3/css/layui.css" media="all" />
<script src="__STATIC__/admin/lib/layui-v2.6.3/layui.js" charset="utf-8"></script>
~~~

> 还有 css 中 background 中的图片地址



## 5. 增加验证码

安装

~~~shell
composer require topthink/think-captcha
~~~



验证码配置文件

~~~
config/captcha.php
~~~



填入模板文件，两种方法

- 使用 div 标签

~~~html
<div>{:captcha_img()}</div>
~~~



- 直接引用 src 地址

~~~html
<div><img src="{:captcha_src()}" alt="captcha" /></div>
~~~

>使用 src 有验证码刷新问题，需要加上 onclick 事件



~~~html
<img id="refreshCaptcha" class="validateImg" src="{:captcha_src()}" onclick="this.src=this.src+'&k='+Math.random();" />
~~~



## 6. 自定义验证码

admin\controller\Verify.php

~~~php
<?php

namespace app\admin\controller;

use think\captcha\facade\Captcha;

class Verify
{
    public function index()
    {
        // 自定义设置 verify
        return Captcha::create('verify');
    }
}
~~~

> 访问 admin\verify 即可访问自定义验证码



修改 config\captcha.php 配置，最后添加

~~~php
'verify' => [
    'length' => 4,
],
~~~

> 新的验证码规则就生效了，http://tpcms.com/index.php/admin/verify/index



在 HTML 中引入的时候直接使用该 url 即可，即

~~~html
<img src="{:url('verify/index')}"/>
~~~



自动刷新

~~~html
<img id="refreshCaptcha" class="validateImg" src="{:url('verify/index')}" onclick="this.src='/admin/verify/index/&k='+Math.random();"/>
~~~





# 后台登陆验证

## 1. 控制器验证

### 1.1 验证码验证

需要开启中间件中的 session 功能

app\middleware.php

~~~php
<?php
// 全局中间件定义文件
return [
    // 全局请求缓存
    // \think\middleware\CheckRequestCache::class,
    // 多语言加载
    // \think\middleware\LoadLangPack::class,
    // Session初始化
     \think\middleware\SessionInit::class
];

~~~



控制器中进行验证码验证

~~~php
<?php
declare (strict_types=1);

namespace app\admin\controller;

use app\BaseController;

class Login extends BaseController
{
    public function index()
    {
        return view();
    }

    public function check()
    {
        if (request()->isPost()) {
            $data = input('post.');
            if (!captcha_check($data['captcha'])) {
                echo '验证码错误';
            };
            halt($data);
        }
        return view();
    }
}

~~~



### 1.2 用户名密码校验

创建后台数据库 tp_admin



创建一条数据

~~~php
// 显示当前时间戳
halt(time());

// 显示加密密码
$salt = 'tpcms_';
halt(md5($salt . '123456'));
~~~



插入一条数据

~~~sql
INSERT INTO `tp_admin` (`id`, `username`, `password`, `nickname`, `email`, `status`, `create_time`, `update_time`, `delete_time`) VALUES ('1', 'admin', '633456870eb24fb47b299cb9e1ee9b43', 'admin', 'admin@tpcms.com', '1', '1642567198', '1642567198', '0');
~~~



校验

~~~php
public function check() {
    if (request()->isPost()) {

        // 验证码校验
        $data = input('post.');
        if (!captcha_check($data['captcha'])) {
            return json(['msg' => '验证码错误', 'code' => 3]);
        };

        // 用户名密码校验
        $salt = 'tpcms_';
        $adminData = Db::name('admin')->where('username', $data['username'])->find();
        if (!$adminData) {
            return json(['msg' => '用户名错误', 'code' => 1]);
        }
        if ($adminData['password'] != md5($salt . $data['password'])) {
            return json(['msg' => '密码错误', 'code' => 2]);
        }

        // 更新最后登录时间
        Db::name('admin')->where('id', $adminData['id'])->update(['last_login_time' => time()]);
        return json(['msg' => '登录成功', 'code' => 0]);
    } else {
        return view();
    }
}
~~~



### 1.3 保存 Session

~~~php
// 放入 Session
session('adminSessionData', $adminData);
~~~



其实没必要把所有数据都放到 Session 中，留一些会用到的即可。

~~~php
session('adminSessionData',
        [
            'admin_id' => $adminData['id'],
            'admin_nickname' => $adminData['nickname'],
            'admin_status' => $adminData['status'],
        ]);
~~~





### 1.4 前台校验

~~~js
// 进行登录操作
form.on('submit(login)', function (data) {
    url = '/admin/login/check'
    data = data.field
    if (data.username == '') {
        layer.msg('用户名不能为空')
        return false
    }
    if (data.password == '') {
        layer.msg('密码不能为空')
        return false
    }
    if (data.captcha == '') {
        layer.msg('验证码不能为空')
        return false
    }
    $.post(
        url,
        data,
        function (result) {
            if (result.code == 1) {
                layer.msg('没有找到该用户')
            }
            if (result.code == 2) {
                layer.msg('密码错误')
            }
            if (result.code == 3) {
                layer.msg('验证码错误')
            }
            if (result.code == 0) {
                layer.msg('登录成功', function () {
                    window.location = '/admin/index'
                })
            }
        },
        'json'
    )
    return false
})
~~~





## 2. 模型验证

控制器负责拿到数据，并且传递给模型

~~~php
<?php
    declare (strict_types=1);

namespace app\admin\controller;

use app\BaseController;
use app\common\model\Admin;

class Login extends BaseController
{
    public function index()
    {
        return view();
    }

    public function check()
    {
        if (request()->isPost()) {
            $data = input('post.');
            $admin = new Admin();
            return $admin->check($data);
            // 上边代码也可以直接写成一行
            // return new Admin()->check(input('post.'));
        }
    }
}

~~~



创建模型

app\common\Admin.php

~~~php
<?php
    declare (strict_types=1);

namespace app\common\model;

use think\Model;


class Admin extends Model
{


    protected $name = 'admin';

    public function check($data)
    {
        // 执行验证
        $salt = 'tpcms_';
        $adminData = $this->where('username', $data['username'])->find()->toArray();
        if (!$adminData) {
            return json(['msg' => '用户名不存在', 'code' => 1]);
        }
        if ($adminData['password'] != md5($salt . $data['password'])) {
            return json(['msg' => '密码不正确', 'code' => 2]);
        }
        if (!captcha_check($data['captcha'])) {
            return json(['msg' => '验证码不正确', 'code' => 3]);
        }
        // 将数据放入 Session
        session('adminSessionData',
                [
                    'admin_id' => $adminData['id'],
                    'admin_nickname' => $adminData['nickname'],
                    'admin_status' => $adminData['status'],
                ]);
        return json(['msg' => '登录成功', 'code' => 0]);
    }
}

~~~



另外也可以增加最后登录时间

~~~php
$adminData->update_time = time();
$adminData->save();
~~~

> $adminData 不能被转换为数组，需要删除 toArray() 方法，只有数据库对象才可以对数据库进行操作。





前端优化

~~~js
$.post(
    url,
    data,
    function (result) {
        if (result.code != 0) {
            layer.msg(result.msg)
        } else {
            layer.msg('登录成功', function () {
                window.location = '/admin/index/'
            })
        }
    },
    'json'
)
~~~





# 验证器

为了保证数据干净，我们还需要对用户提交的数据进行验证

- 不能提交空数据
- 不能提交特殊字符
- 数据不能带空格



## 1. 手写验证

接受数据的时候需要对每个字段的数据进行验证，如：

~~~php
if (input('?post.username')){
    if(input('post.username').length<4 || input('post.username').length>16){
        return json(['msg' => '用户名长度为 4-16 个字符', 'code' => 5]); 
    }
    // 正则验证特殊字符
} else {
    return json(['msg' => '用户名不能为空', 'code' => 5]); 
}
~~~



## 2. 过滤

~~~php
$data = input('post.', '', 'htmlspecialchars,trim');
~~~



过滤函数：

- htmlspecialchars
- trim
- strip_tags
- stripslashes



## 3. TP 验证器

### 3.1 创建验证器

app\common\validate\Admin.php

~~~php
<?php

namespace app\common\validate;

use think\Validate;

class Admin extends Validate
{
    protected $rule = [
        'username' => 'require|length:4,16|chsDash',
        'password' => 'require|length:6,16|alphaDash',
        'captcha' => 'require|max:4|alphaNum'
    ];
    protected $message = [
        'username.require' => '用户名不能为空',
        'username.length' => '用户名长度为 4-16 个字符',
        'username.chsDash' => '用户名中只可以使用汉字、字母、数字、下划线、破折号',
        'password.require' => '密码不能为空',
        'password.length' => '密码长度为 6-16 个位',
        'password.alphaDash' => '密码中只可以使用字母、数字、下划线、破折号',
        'captcha.require' => '验证码不能为空',
        'captcha.max' => '验证码最多不能超过4个字符',
        'captcha.alphaNum' => '验证码中只可以使用字母、数字',
    ];

}
~~~

> 注意 between 指的是值，而 length 是长度，不要搞混了



### 3.2 控制器中验证

~~~php
<?php
declare (strict_types=1);

namespace app\admin\controller;

use app\BaseController;
use app\common\model\Admin;
use think\exception\ValidateException;

class Login extends BaseController
{
    public function index()
    {
        return view();
    }

    public function check()
    {
        if (request()->isPost()) {
            $data = input('post.');
            try {
                // 由于与 Model 类重名，所以在这直接引入了
                // 也可以用 use app\common\validate\Admin as VAdmin 重命名
                validate(\app\common\validate\Admin::class)->check($data);
            } catch (ValidateException $e) {
                return json(['msg' => $e->getError(), 'code' => 5]);
            }
            $admin = new Admin();
            return $admin->check($data);
        }
    }
}

~~~

> 也可以放到 Model 中进行验证



手册上写的是 try 和 catch，不过感觉下边这个对初学者友好

~~~php
$validate = new \app\common\validate\Admin();
if (!$validate->scene('login')->check($data)) {
    return json(['msg' => $validate->getError(), 'code' => 5]);
}
~~~





### 3.3 验证场景

在验证器中定义场景

~~~php
protected $scene = [
    'login' => ['username','password','captcha'],
];
~~~



在控制器中使用验证场景

~~~php
try {
    validate(\app\common\validate\Admin::class)->scene('login')->check($data);
} catch (ValidateException $e) {
    return json(['msg' => $e->getError(), 'code' => 5]);
}
~~~



# 后台首页

app\admin\view\index\index.html



## 1. 分离模板

- app\admin\view\public



使用{include}标签来加载公用重复的文件，比如头部、尾部和导航部分；

在模版 view 目录创建一个public 公共目录，分别创建header、footer 和 nav；

然后创建Block 控制器，引入控制器模版index，这个模版包含三个公用文件；

~~~php
{include file='public/header,public/nav'/}
index
{include file='public/footer'/}
~~~



## 2. 创建页面主体控制器

~~~php
public function welcome() {
    return view();
}
~~~



## 3. 注销控制器

~~~php
public function logout() {
    session('adminSessionData', null);
    return redirect('/admin/login/index');
}
~~~



# 登录认证

- 传统登录认证
  - 传统父类控制器，后台所有控制器都去继承该控制器，在父类控制器中做登录拦截
- 中间件登录认证



## 1. Base 父类控制器认证

### 1.1 创建父类控制器

app\admin\controller\AdminBase.php

~~~php
<?php

namespace app\admin\controller;

use app\BaseController;

class AdminBase extends BaseController {
  public function initialize() {
    echo '我是父类控制器';
  }
}
~~~

> 当子类继承父类时，会自动运行 initilaize() 方法中的代码



### 1.2 判断是否登录

判断 session 中是否有 adminSessionData 字段，如果有返回真，否则返回假

~~~php
public $adminUser = null;
public function isLogin()
{
    $this->adminUser = session('adminSessionData');
    if (empty($this->adminUser)) {
        return false;
    }
    return true;
}
~~~



### 1.3 控制器中加载方法

~~~php
<?php
declare (strict_types=1);

namespace app\admin\controller;

use app\BaseController;

class Index extends AdminBase
{
    public function index()
    {
        // 判断是否有 Session，如果没有则跳转到登录页面
        if (empty($this->isLogin())) {
            return redirect('/admin/login');
        }
        return view();
    }

    public function welcome()
    {
        return view();
    }

    public function logout()
    {
        session('adminSessionData', null);
        return redirect('/admin/login');
    }
}

~~~



### 1.4 父类控制器控制所有后台页面

由于我们需要对所有后台页面都需要做一个判断，所以需要在父类控制器中加载这个方法，让所有继承 AdminBase 的子类控制器都进行判断。

redirect 助手函数不能直接在父类中使用，需要自定义一个方法



~~~php
<?php


namespace app\admin\controller;

use app\BaseController;
use think\exception\HttpResponseException;

class AdminBase extends BaseController
{
    public $adminUser = null;

    public function initialize()
    {
        parent::initialize();
        if (empty($this->isLogin())) {
            return $this->redirect('/admin/login');
        }
    }

    public function isLogin()
    {
        $this->adminUser = session('adminSessionData');
        if (empty($this->adminUser)) {
            return false;
        }
        return true;
    }

    // 定义重定向方法
    public function redirect(...$args)
    {
        throw new HttpResponseException(redirect(...$args));
    }
}
~~~

> 在类中调用不存在的方法会抛出错误，我们利用这个异常来进行跳转



### 1.5 禁止登录页面判断 Session

如果登录页面也是继承的 AdminBase 类，则会造成死循环，有两种方法可以解决这个问题：

- 登录控制器继承 BaseController
- 重写 Login 控制器的 initialize 方法



如：依旧继承 AdminBase，但是在初始化方法我们不用父类的，而是自己重写，对 Session 进行判断，如果有 Session，那么我们进行跳转

~~~php
    public function initialize()
    {
        if ($this->isLogin()) {
            return redirect('/admin/index');
        }
    }
~~~



## 2. Middleware 中间件登录认证

### 2.1 创建中间件

~~~
php think make:middleware Check
~~~



这个指令会 app/middleware 目录下面生成一个Check 中间件，如：

~~~php
<?php
    namespace app\middleware;
class Check
{
    public function handle($request, \Closure $next)
    {
        if ($request->param('name') == 'think') {
            return redirect('index/think');
        }
        return $next($request);
    }
}
~~~



### 2.2 测试中间件

这样创建的中间件是全局中间件，如果想让该中间件只针对后台，复制中间件到 admin 目录

- admin\middleware
- admin\middleware.php



在 middleware.php 中打开刚刚定义的中间件

~~~php
<?php
// 全局中间件定义文件
return [
    // 全局请求缓存
    // \think\middleware\CheckRequestCache::class,
    // 多语言加载
    // \think\middleware\LoadLangPack::class,
    // Session初始化
    \think\middleware\SessionInit::class,
    \app\admin\middleware\Check::class
];
~~~



在 middleware\Check.php 中定义

~~~php
<?php

declare(strict_types=1);

namespace app\admin\middleware;

class Check {
    /**
     * 处理请求
     *
     * @param \think\Request $request
     * @param \Closure       $next
     * @return Response
     */
    public function handle($request, \Closure $next) {
        echo '我是前置应用中间件';
        return $next($request);
    }
}
~~~



Index 控制器测试

~~~php
public function index() {
    halt('后台首页');
    return view();
}
~~~



可以看到在载入 index 页面之前会先执行中间件的逻辑，之后我们可以把对用户登录的验证写入



后置中间件与前置类似，只是先会执行 index 中的逻辑，然后再运行中间件，如：

~~~php
<?php
    namespace app\middleware;
class After
{
    public function handle($request, \Closure $next)
    {
        $response = $next($request);
        // 添加中间件执行代码
        return $response;
    }
}
~~~



### 2.3 前置中间件登录认证

中间件中判断逻辑

~~~php
public function handle($request, \Closure $next) {
    if (empty(session('adminDataSession'))) {
        return redirect((string)url('login/index'));
    }
    return $next($request);
}
~~~



登录界面不需要用中间件来判断，判断 $request->pathinfo() 中的当前路径

~~~php
public function handle($request, \Closure $next) {
    if (empty(session('adminSessionData')) && !preg_match('/login/', $request->pathinfo())) {
        return redirect((string)url('login/index'));
    }
    return $next($request);
}
~~~

>不用正则的话也可以使用 `$request->pathinfo() != 'login'` 但是必须要是在定义路由的情况下，否则我们用 /admin/Login/index 也同样会造成死循环



最后如果已经登录的话，再访问登录界面应该需要直接跳转到后台，在 Login 控制器中进行判断

~~~php
public function index()
{
    if (session('adminSessionData')) {
        return redirect('/admin/index');
    } else return view();
}
~~~



如果使用了自定义的验证码控制器也在 admin 下，还需要把验证码的 API 也过滤一下

~~~php
public function handle($request, \Closure $next)
{
    if (empty(session('adminSessionData')) && !preg_match('/login/', $request->pathinfo()) && !preg_match('/verify/', $request->pathinfo())) {
        return redirect((string)url('login/index'));
    }
    return $next($request);
}
~~~





# Token 令牌

Token 令牌防止 CSRF 攻击

- 在前端生成一个 token 令牌
- 提交数据时，带上这个 token 令牌
- 在后端验证这个 token 令牌是否与后端生成 token 令牌一致，如果一致则代表该请求是合法的



## 1. 前端放入 Token

验证规则支持对表单的令牌验证，首先需要在你的表单里面增加下面隐藏域：

~~~
<input type="hidden" name="__token__" value="{:token()}" />
~~~



也可以直接使用

~~~
{:token_field()}
~~~



如果是 Ajax 提交数据，可以把 Token 放在 meta 中

~~~
<meta name="csrf-token" content="{:token()}">
~~~



或者直接使用

~~~
{:token_meta()}
~~~



然后在全局Ajax中使用这种方式设置X-CSRF-Token 请求头并提交：

~~~js
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
~~~



## 2. 后端验证 Token

然后在路由规则定义中，使用

~~~
Route::post('blog/save','blog/save')->token();
~~~



或者在控制器中验证

~~~php
namespace app\controller;
use think\exception\ValidateException;
use think\Request;
class Index
{
    public function index(Request $request)
    {
        $check = $request->checkToken('__token__');
        if(false === $check) {
            throw new ValidateException('invalid token');
        }
        // ...
    }
}
~~~



验证器中验证

~~~php
protected $rule = [
    'name' => 'require|max:25|token',
    'email' => 'email',
];
~~~



## 2. Ajax 发送请求无刷新 Token

http://twbweb.com/3365.html



# JWT 登录认证

## 1. JWT简介

JSON Web Token ( 缩写 JWT ) ,是目前最流行的時域认证解决方案



- Session登录认证方案：用户从客户端传递用户名、空码等信息，服务端认证后将信息存储在 session中，将 session id放到 cookie中。以后访问其他页面，自动从 cookie中取到 session id,再从 session中取认证信息。
- JWT 解决方案，将认证信息，返回喜户端，存储到喜户端。下次访问其他页面，需要从客户端传递认证信息回服务端。



## 2. JWT的原理

JWT 的原理是，服务器认证以后，生成一个JSON对象，发回给客户端，就像下面这样

~~~json
{
"用户名":"admin",
"角色":"超级管理员",
"到期时间":"2019-07-13 00:00:00"
}
~~~


以后，客户与服务通信的时候，都要发回这个 Json 对象。服务器完全只靠这个对象认定用户身份

为了防止用户算改数据，服务器在生成这个对象的时候，会加上签名（详见后文）。

服务器不再保存任何 session数据，也就是服务器变成无状态了，从而比较容易实现扩展



## 3. JWT的数据结构

实际的 JWT是一个很长的字符串，中间用点 `.` 分隔成三个部分。就像下面这样

~~~
GZINISIMAI6IMM1NE5MMHIN.YXQ0E1NI4MZMOMDGSIMZCYI6IMHODHA60930CUYMYE1NI4MZMMDSIM4I6MT2MKXOTWOC anrpijom2yyzzu3ytyyweil1c2vy21kijoxfq.Nfq1gq-z5c4pwit8zkywewx6sbxmnhcc6zdgsd5nhu
~~~



JWT 三个部分依次如下：

- Header（头部）
- Payload（负载）
- Signature（签名）



写成一行就成了

~~~
Header.Payload.Signature
~~~



### 3.1 Header

Header部分是一个 JSON对象，描述WMT的元数据，通常是下面的样子。

~~~~js
{
"alg": "HS256",
"typ": "JWT"
}
~~~~


上面代码中，alg属性表示签名的算法( algorithm)，默认是 HMAC SHA256 (写成HS256)，typ 属性表示这个令牌 (token) 的类型 (type) , JWT 令牌统一写为 JWT。

最后，将上面的 JSON 对象使用 Base64URL 算法（详见后文）转成字符



### 3.2 Payload

Payload 部分也是一个 JSON 对象，用来存放实际需要传递的数据。JWT 规定了7个官方字段，供选用。

| 名称            | 说明     | 解释                                                         |
| --------------- | -------- | ------------------------------------------------------------ |
| iss(issuer)     | 签发人   | issuer 请求实体，可以是发起请求的用户的信息，也可以是 jwt 的签发者 |
| sub(subject)    | 主题     | 设置主题，类似于发邮件时的主题                               |
| aud(audience)   | 受众     | 接收jwt的一方，接收人                                        |
| exp(expire)     | 过期时间 | token过期时间，时间戳                                        |
| nbf(not before) | 生效时间 | 当前时间再nb设定时间之前，该token无法使用                    |
| iat(issued at)  | 签发时间 | token创建时间                                                |
| jti(JWT ID)     | 编号     | 对当前token设置唯一标识                                      |



除了官方字段，你还可以在这个部分定义私有字段，下面就是一个例子。

~~~json
{
    "sub":"主题",
    "name":"张三",
    "status":"1"
}
~~~

注意，JWT 默认是不加密的，任何人都可以读到，所以不要把秘密信息放在这个部分。

这个 JSON 对象也要使用 Base64URL 算法转成字符。



### 3.3 Signature

Signature 部分是对前两部分的签名，防止数据纂改。

首先，需要指定一个空钥( secret)。这个密钥只有服务器才知道，不能泄露给用户。然后，使用 Header里面指定的签名算法（默认是 HMAC SHA256),按照下面的公式产生签名。

~~~
HMACSHA256(
base64UrlEncode(header) + "." +
base64UrlEncode(payload),
secret)
~~~

算出签名以后，把 Header、 Payload、 Signature三个部分拼成一个字符，每个部分之间用"点"(.)分隔，就可以返回给用户



### 3.4 Base64URL

前面提到，Header和 Payload 串型化的算法是Base64URL这个算法眼Base64算法基本类似，但有一些小的不同。
JWT作为一个令牌(token)，有些场合可能会放到URL (比如apl.example.com/?token=xxx)。Base64有三个字符+、/和 = 在URL里面有特殊含义，所以要被替换掉：=被省略、+皆换成-，/替换成_。这就是Base64URL算法。



## 4. JWT 使用方式

客户收到服务返回的 JWT，可以储存在 Cookie 里面，也可以储存在 localstorage。
此后，用户每次与服务器通信，都要芾上这个JWT。你可以把它放在 Cookie里面自动发送，但是这样不能域，所以更好的做法是放在HTTP请求的头信息Authorization 字段里面。

~~~
Authorization: Bearer <token>
~~~

> 另一种做法是，跨域的时候，JWT 就放在 POST 请求的数据体里边



## 5. JWT 特点

(1) JWT 默认是不加密，但也是可以加密的，生成原始 Token以后，可以用空钥再加密一次

(2) JWT 不加密的情况下，不能将秘数据写入JWT 

(3) JWT 不仅可以用认证，也可以用于交换信息，有效使用 JWT ,可以降低服务查间数库的次数

(4) JWT 的最大缺点是，由于服务器不保存 session 状态，因此无法在使用过程中废止某个 token,或者更改 token的权限。也就是说，一且 JWT 签发了，在到期之前就会始终有效，除非服务器部额外的逻辑。

(5 )JWT 本身包含了认证信息，一旦池露，任何人都可以获得该令牌的所有权限。为了减少盗用，JWT的有效期应该设置得比较短。对于一些比较重要的权限，使用时应该再次对用户进行认证。

(6)为了减少盗用，JWT 不应该使用 HTTP 协议明码传難，要使用 HTTPS 协议传输。



## 6. 功能实现

### 6.1 安装 JWT 功能组件

使用 Composer 安装 JWT 功能组件

~~~
composer require lcobucci /jwt 3.3
~~~



extend/tools/jwt/Token.php



# 模板渲染

## 1. 显示管理员

将 admin 用户名传入到模板中，Index 控制器

~~~php
    public function index()
    {
        return view('index', [
            'admin_nickname' => session('adminSessionData')['admin_nickname']
        ]);
    }
~~~



前端 header.html 模板

~~~html
<a href="javascript:;">{$admin_nickname}</a>
~~~



更简单的方法就是直接使用模板语法调用 session

~~~html
<a href="javascript:;">{:session('adminSessionData.admin_nickname')}</a>
~~~

> 这样控制器就不用传输变量了



## 2. 修改管理员信息

前端打开页面

~~~html
<dd>
    <a onclick="xadmin.open('个人信息','profile.html')">个人信息</a>
</dd>
~~~



在 Index 控制器中创建 profile 方法

~~~php
public function profile()
{
    return view();
}
~~~



移动模板文件到 view\index\profile.html

> 修改 CSS、JS 等静态资源路径



修改路由

~~~php
// 管理员个人信息
Route::get('profile','Index/profile');
~~~



至此，可以正确弹出管理员个人信息页面





# 清空缓存

清空缓存即情况 tp 下的 runtime 缓存

创建 Config.php 控制器

~~~php
<?php

namespace app\admin\controller;

use app\BaseController;

class Config extends Base {
  public function index() {
    return view();
  }

  public function del_cache() {
  }
}
~~~



在 app\common.php 添加公共方法

~~~php
<?php
// 应用公共文件

// 删除目录
function delFileByDir($dir) {
  $dh = opendir($dir);
  while ($file = readdir($dh)) {
    if ($file != "." && $file != "..") {

      $fullpath = $dir . "/" . $file;
      if (is_dir($fullpath)) {
        delFileByDir($fullpath);
      } else {
        unlink($fullpath);
      }
    }
  }
  closedir($dh);
}
~~~



添加删除逻辑

~~~php
public function del_cache() {
    $path = runtime_path();
    delFileByDir($path);
}
~~~

> 删除当前应用下的缓存，即 admin 下的缓存



如果想清空整个 runtime 缓存

~~~php
public function del_cache() {
    $path = root_path().'runtime';
    delFileByDir($path);
}
~~~



