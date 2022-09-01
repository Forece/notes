# 环境部署

## 1. 安装

Composer 的安装与使用

https://www.runoob.com/w3cnote/composer-install-and-usage.html



使用 Composer 安装 thinkphp

~~~shell
composer create-project topthink/think cyshop 6.0.3
~~~

> cyshop 为文件夹名称



## 2. 测试

- 访问 `127.0.0.1/cyshop/public/` 可以正常访问



## 3. 域名指向

- 设置域名 www.cyshop.com 指向为 127.0.0.1/cyshop/public/
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



## 6. 修改入口文件地址

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
│ ├─qingadmin 后台应用
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

> 使用 qingadmin 为了防止后台被任意登录



## 2. 创建控制器

app/qingadmin/controller/Index.php

~~~php
<?php

namespace app\qingadmin\controller;

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

app/qingadmin/view/index/index.html

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



## 4. 访问路径

入口文件解析：

http://cyshop.com/index.php/qingadmin/index/index

http://cyshop.com/index.php/index/index/index

~~~
index.php 项目入口文件
qingadmin 控制器命名空间
index 类
index 方法
~~~



## 5. 放入模板文件

将视图文件放入对应的视图文件夹中，如：

HTML 静态页面放入视图文件夹

- app/qingadmin/view/index
- app/index/view/index



如后台前端登录页面：

~~~
app/qingadmin/view/index/login.html
~~~



## 6. 放入静态资源

静态资源放入 public/static 文件夹

- public/static/admin/css/

- public/static/admin/js/

- public/static/index/css/

- public/static/index/js/

- public/static/mobile

  

静态资源文件还可以创建 upload 文件夹，以备以后需要上传文件使用

- public/upload



## 7. 修改静态资源路径

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



# 隐藏入口文件 index.php

可以通过URL重写隐藏应用的入口文件index.php （也可以是其它的入口文件，但URL重写通常只能设置一个入口文件）,下面是相关服务器的配置参考：



**[ Apache ]**

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



**[ Nginx ]**

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

    // 数据库连接配置信息
    'connections'     => [
        'mysql' => [
            // 数据库类型
            'type'              => env('database.type', 'mysql'),
            // 服务器地址
            'hostname'          => env('database.hostname', '127.0.0.1'),
            // 数据库名
            'database'          => env('database.database', 'forece_cyshop'),
            // 用户名
            'username'          => env('database.username', 'root'),
            // 密码
            'password'          => env('database.password', ''),
            // 端口
            'hostport'          => env('database.hostport', '3306'),
            // 数据库连接参数
            'params'            => [],
            // 数据库编码默认采用utf8
            'charset'           => env('database.charset', 'utf8'),
            // 数据库表前缀
            'prefix'            => env('database.prefix', 'qing_'),

            // 数据库部署方式:0 集中式(单一服务器),1 分布式(主从服务器)
            'deploy'            => 0,
            // 数据库读写是否分离 主从式有效
            'rw_separate'       => false,
            // 读写分离后 主服务器数量
            'master_num'        => 1,
            // 指定从服务器序号
            'slave_no'          => '',
            // 是否严格检查字段是否存在
            'fields_strict'     => true,
            // 是否需要断线重连
            'break_reconnect'   => false,
            // 监听SQL
            'trigger_sql'       => env('app_debug', true),
            // 开启字段缓存
            'fields_cache'      => false,
            // 字段缓存路径
            'schema_cache_path' => app()->getRuntimePath() . 'schema' . DIRECTORY_SEPARATOR,
        ],

        // 更多的数据库配置信息
    ],
];

~~~



# 后台登录界面

## 1. 创建控制器

app\qingadmin\controller\Login.php

~~~php
<?php

namespace app\qingadmin\controller;

use app\BaseController;

class Login extends BaseController {
  public function index() {
    return view();
  }
}
~~~



## 2. 视图文件

app\qingadmin\view\login\index.html



## 3. 安装验证码

安装

~~~shell
composer require topthink/think-captcha
~~~



验证码配置文件

~~~
config/captcha.php
~~~



插入模板文件

~~~
 {:captcha_img()}
~~~



对验证码进行验证需要开启 session 功能

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



Login 控制器进行验证

app\qingadmin\controller\Login.php

~~~php
<?php

namespace app\qingadmin\controller;

use app\BaseController;

class Login extends BaseController {
  public function index() {
    if (request()->isPost()) {
      $data = input('post.');
      if (!captcha_check($data['verifycode'])) {
        echo '验证码错误';
      }
    } else {
      return view();
    }
  }
}

~~~

> 如果返回空页面，则代表验证码验证成功



## 4. 校验用户名密码

~~~php
<?php

namespace app\qingadmin\controller;

use app\BaseController;
use think\facade\Db;

class Login extends BaseController {
  public function index() {
    if (request()->isPost()) {
      $data = input('post.');
      // 验证码校验
      if (!captcha_check($data['verifycode'])) {
        echo '验证码错误';
      }
      // 用户名校验
      $adminData = Db::name('admin')->where('user_name')->find();
      if (!$adminData) {
        echo '用户名错误';
      }
      $salt = 'zxcvbn';
      if ($adminData['password'] != md5($salt . $data['password'])) {
        echo '密码错误';
      }
      // 更新最后登录时间
      Db::name('admin')->where('id', $adminData['id'])->update(['last_login_time' => time()]);
      // 放入Session
      session('adminSessionData', $adminData);
    } else {
      return view();
    }
  }
}

~~~



## 5. 引入 common.php

~~~php
<?php
use think\facade\Db;
// 应用公共文件

/**
 * $msg 待提示的消息
 * $url 待跳转的链接
 * $icon 这里主要有两个，5和6，代表两种表情（哭和笑）
 * $time 弹出维持时间（单位秒）
 */

function alert($msg='',$url='',$icon='',$time=3){ 

    $str='<meta name="viewport" content="initial-scale=1, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta http-equiv="Access-Control-Allow-Origin" content="*" />
    <meta http-equiv="pragma" content="no-cache" />
    <script type="text/javascript" src="/static/index/js/jquery-3.4.1.min.js"></script><script type="text/javascript" src="/static/index/layer/2.4/layer.js"></script>';//加载jquery和layer

    $str.='<script>$(function(){layer.msg("'.$msg.'",{icon:'.$icon.',time:'.($time*1000).'});setTimeout(function(){self.location.href="'.$url.'"},2000)});</script>';//主要方法

    return $str;

}
~~~



## 6. 跳转页面

~~~php
<?php

namespace app\qingadmin\controller;

use app\BaseController;
use think\facade\Db;

class Login extends BaseController {
  public function index() {
    if (request()->isPost()) {
      $data = input('post.');
      // 验证码校验
      if (!captcha_check($data['verifycode'])) {
        return alert('验证码错误', 'index', 5);
      }
      // 用户名校验
      $adminData = Db::name('admin')->where('user_name', $data['username'])->find();
      if (!$adminData) {
        return alert('用户名或密码错误', 'index', 5);
      }
      // 密码校验
      $salt = 'zxcvbn';
      if ($adminData['password'] != md5($salt . $data['password'])) {
        return alert('用户名或密码错误', 'index', 5);
      }
      // 更新最后登录时间
      Db::name('admin')->where('id', $adminData['id'])->update(['last_login_time' => time()]);
      // 放入Session
      session('adminSessionData', $adminData);
      return alert('登录成功', '/qingadmin/index/index', 6);
    } else {
      return view();
    }
  }
}

~~~



## 7. 安全验证

除了前端需要对表单进行验证外，后端也需要对用户提交的数据进行安全验证，并过滤

### 1. 验证器限制字符

创建验证器

app\common\validate\Admin.php

~~~php
<?php

namespace app\common\validate;

use think\Validate;

class Admin extends Validate {
  protected $rule = [
    'username' => 'require|length:4,16|chsDash',
    'password' => 'require|length:6,16|alphaDash',
    'verifycode' => 'require|max:4|alphaNum'
  ];
  protected $message = [
    'username.require' => '用户名不能为空',
    'username.length' => '用户名长度为 4-16 个字符',
    'username.chsDash' => '用户名中只可以使用汉字、字母、数字、下划线、破折号',
    'password.require' => '密码不能为空',
    'password.length' => '密码长度为 6-16 个位',
    'password.alphaDash' => '密码中只可以使用字母、数字、下划线、破折号',
    'verifycode.require' => '验证码不能为空',
    'verifycode.max' => '验证码最多不能超过4个字符',
    'verifycode.alphaNum' => '验证码中只可以使用字母、数字',
  ];
}

~~~



对 post 数据进行验证

~~~php
      // 验证器验证
      try {
        validate(\app\common\validate\Admin::class)->check($data);
      } catch (ValidateException $e) {
        return alert($e->getError(), 'index', 5);;
      }
~~~



### 2. 过滤字符

对用户提交的数据进行过滤

- strip_tags 去除 HTML 标签
- htmlspecialchars 将特殊字符转换实体
- trim 过滤掉首尾空格

~~~php
// 过滤掉空格
$data = input('post.', '', 'trim');
~~~



### 3. 只保存需要的 Session

~~~php
session('adminSessionData',
        [
            'admin_id' => $adminData['id'],
            'admin_nickname' => $adminData['user_name'],
            'admin_group_id' => $adminData['group_id'],
            'admin_status' => $adminData['status'],
        ]);
~~~





### 3. 输出过滤

数据提取到模板中，也需要进行安全过滤





## 8. 后台登陆控制器完整代码

~~~php
<?php

namespace app\qingadmin\controller;

use think\exception\ValidateException;
use app\BaseController;
use think\facade\Db;

class Login extends BaseController {
  public function index() {
    if (request()->isPost()) {
      // 过滤掉空格
      $data = input('post.', '', 'trim');
      // 验证器验证
      try {
        validate(\app\common\validate\Admin::class)->check($data);
      } catch (ValidateException $e) {
        return alert($e->getError(), 'index', 5);;
      }

      // 验证码校验
      if (!captcha_check($data['verifycode'])) {
        return alert('验证码错误', 'index', 5);
      }
      // 用户名校验
      $adminData = Db::name('admin')->where('user_name', $data['username'])->find();
      if (!$adminData) {
        return alert('用户名或密码错误', 'index', 5);
      }
      // 密码校验
      $salt = 'zxcvbn';
      if ($adminData['password'] != md5($salt . $data['password'])) {
        return alert('用户名或密码错误', 'index', 5);
      }
      // 更新最后登录时间
      Db::name('admin')->where('id', $adminData['id'])->update(['last_login_time' => time()]);
      // 放入Session
      session(
        'adminSessionData',
        [
          'admin_id' => $adminData['id'],
          'admin_nickname' => $adminData['user_name'],
          'admin_group_id' => $adminData['group_id'],
          'admin_status' => $adminData['status'],
        ]
      );
      return alert('登录成功', '/qingadmin/index/index', 6);
    } else {
      return view();
    }
  }
}

~~~





# 后台首页

## 1. 创建控制器

~~~php
<?php

namespace app\qingadmin\controller;

use app\BaseController;

class Index extends BaseController {
    public function index() {
        return view();
    }
}
~~~



## 2. 视图文件

- app\qingadmin\view\index\index.html
- app\qingadmin\view\index\welcome.html



将 index.html 做模块分离，其中公用部分放到 app\qingadmin\view\public 当中

- app\qingadmin\view\public\head.html
- app\qingadmin\view\public\foot.html



然后在 index.html 中用 include 引入

~~~php
{include file="public/head"}
{include file="public/left"}
{include file="public/foot"}
~~~



## 3. 主体页面控制器

主体页面是 welcome.html，通过 iframe 引入，所以还需要创建一个 welcome 的控制器

~~~php
    public function welcome() {
        return view('', [
            'count1' => 100,
            'count2' => 100,
            'count3' => 100,
            'count4' => 100,

        ]);
    }
~~~

> count 数组是统计数据，之后会用数据库中的数据代替



## 4. 首页显示用户名

将 session 中的 username 传入模板

~~~php
public function index() {
    $loginAdmin = session('adminSessionData');
    return view('', [
        'adminUsername' => $loginAdmin['admin_user_name']
    ]);
}
~~~



# 中间件登录认证

- 没有登录状态时，访问后台任何页面都应该是跳转到登录页面
- 已经登录状态时，访问登录页面，应该跳转到后台首页



## 1. 创建中间件

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



## 2. 测试中间件

这样创建的中间件是全局中间件，如果想让该中间件只针对后台，复制中间件到 admin 目录

- qingadmin\middleware
- qingadmin\middleware.php



在 middleware.php 中打开刚刚定义的中间件（注意不要删除全局中间件文件）

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
    \app\qingadmin\middleware\Check::class
];
~~~



在 middleware\Check.php 中定义

~~~php
<?php

declare(strict_types=1);

namespace app\qingadmin\middleware;

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

> 可以看到在载入 index 页面之前会先执行中间件的逻辑，之后我们可以把对用户登录的验证写入



## 3. 前置中间件登录认证

中间件中判断逻辑

~~~php
public function handle($request, \Closure $next) {
    if (empty(session('adminSessionData'))) {
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



## 4. 阻止登录用户再次访问登录页面

如果已经登录的话，再访问登录界面应该需要直接跳转到后台，在 Login 控制器中进行判断

~~~php
if (session('adminSessionData')) {
    return redirect('/qingadmin/index');
}
~~~





# 创建父类控制器

创建父类控制器，可以给子类控制器用来继承一些公共方法

app\qingadmin\controller\Base.php

~~~php
<?php

namespace app\qingadmin\controller;

use app\BaseController;
use think\facade\Db;

class Base extends BaseController {
}

~~~



调用顺序：

- 父类控制器
- 子类控制器



子类继承父类控制器，如：

app\qingadmin\controller\Index.php

~~~php
<?php

namespace app\qingadmin\controller;

// 继承父类控制器
class Index extends Base {
...
}

~~~



然后将目前所有的后台控制器继承父类控制器

- qingadmin/Index.php
- qingadmin/Login.php





# 清空缓存

创建系统设置控制器 Config.php

app\qingadmin\controller\Config.php

~~~php
<?php

namespace app\qingadmin\controller;

class Config extends Base {
  public function index() {
    return view();
  }

  public function del_cache() {
  }
}

~~~



使用 path_runtime() 获取缓存路径

~~~
\runtime\qingadmin\
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



添加跳转

~~~php
public function del_cache() {
    $path = root_path() . 'runtime';
    delFileByDir($path);
    return alert('清空缓存成功', '/qingadmin/index/welcome', 6);
}
~~~



# 友情链接

## 1. 创建控制器

app\qingadmin\controller\Flink.php

~~~php
<?php

namespace app\qingadmin\controller;

class Flink extends Base {
  public function index() {
    return view();
  }
}

~~~



## 2. 视图

app\qingadmin\view\flink\add.html

app\qingadmin\view\flink\edit.html

app\qingadmin\view\flink\index.html



## 3. 增删改查

~~~php
<?php

namespace app\qingadmin\controller;

use think\facade\Db;

class Flink extends Base {
  public function index() {
    $flinkData = Db::name('flink')->paginate(10);
    return view('', ['flinkData' => $flinkData]);
  }

  public function add() {
    if (request()->isPost()) {
      $data = input('post.');
      $res = Db::name('flink')->insert($data);
      if ($res) {
        return alert('操作成功', 'index', '6');
      } else {
        return alert('操作失败', 'index', '5');
      }
    } else {
      return view();
    }
  }

  public function edit() {
    $id = input('id');
    $flinkData = Db::name('flink')->find($id);
    return view('', [
      'flinkData' => $flinkData
    ]);
  }

  public function update() {
    $data = input('post.');
    $res = Db::name('flink')->update($data);
    if ($res) {
      return alert('操作成功', 'index', '6');
    } else {
      return alert('操作失败', 'index', '5');
    }
  }

  public function del() {
    $id = input('id');
    $res = Db::name('flink')->delete($id);
    if ($res) {
      return alert('操作成功', 'index', '6');
    } else {
      return alert('操作失败', 'index', '5');
    }
  }
}

~~~



## 4. 增加确认框

在做删除的时候，为了防止手滑误删数据，可以使用 layer 做一个弹窗，再次进行确定



前端需要引入：

~~~html
<script type="text/javascript" src="/public/static/admin/lib/layer/2.4/layer.js"></script>
~~~



在公共 js 中定义删除方法

public\static\admin\js\common.js

~~~js
//公共删除弹出框
function delete_confirm(url){
    layer.confirm('您确定删除吗？', {
        btn: ['确定','取消'] //按钮
      }, function(){
        window.location.href=url;
      });
}
~~~



添加删除事件

~~~html
<a onclick="delete_confirm('{:url('flink/del',array('id'=>$vo.id))}')" title="删除"></a>
~~~



## ！！！！5. 数据校验



# 发票管理

发票信息由用户添加，后台不做处理，当发票已开具时，点击未开具切换状态



## 1. 创建控制器

~~~php
<?php

namespace app\qingadmin\controller;

use think\facade\Db;


class Fapiao extends Base {
  public function index() {
    $fapiaoData = Db::name('fapiao')->order('id desc')->paginate(10);
    // halt($fapiaoData);
    return view('', ['fapiaoData' => $fapiaoData]);
  }

  // 更改发票状态
  public function status() {
    $id = input('id');
    $res = Db::name('fapiao')->where('id', $id)->update([
      'status' => 1
    ]);
    return redirect('index');
  }
}

~~~



## 2. 视图

app\qingadmin\view\fapiao\index.html



## ！！！！3.  数据校验



# 系统设置

## 1. 创建控制器

之前清空缓存的功能就是放在了 Config.php 控制器中

app\qingadmin\controller\Config.php

~~~php
<?php

namespace app\qingadmin\controller;

class Config extends Base {
  public function index() {
    return view();
  }

  public function del_cache() {
    $path = root_path() . 'runtime';
    delFileByDir($path);
    return alert('清空缓存成功', '/qingadmin/index/welcome', 6);
  }
}

~~~



## 2. 视图文件

app\qingadmin\view\config\index.html



## 3. 增删改查

~~~php
<?php

namespace app\qingadmin\controller;

use think\facade\Db;

class Config extends Base {
  public function index() {
    $configData1 = Db::name('config')->where('config_type', '1')->select();
    $configData2 = Db::name('config')->where('config_type', '2')->select();
    return view('', [
      'configData1' => $configData1,
      'configData2' => $configData2
    ]);
  }

  public function update() {
    if (request()->isPost()) {
      $data = input('post.');
      foreach ($data as $k => $v) {
        Db::name('config')->where('id', $k)->update(['value' => $v]);
      }
      return alert('操作成功', 'index', '6');
    }
  }

  public function del_cache() {
    $path = root_path() . 'runtime';
    delFileByDir($path);
    return alert('清空缓存成功', '/qingadmin/index/welcome', 6);
  }
}

~~~



## ！！！！4. 数据校验



# 关键词设置

热销关键词设置

## 1. 创建控制器

app\qingadmin\controller\Search.php

~~~php
<?php

namespace app\qingadmin\controller;

use think\facade\Db;

class Search extends Base {
  public function index() {
    $searchData = Db::name('search')->order('id desc')->paginate(10);
    return view('', [
      'searchData' => $searchData
    ]);
  }
~~~



## 2. 视图

- app\qingadmin\view\search\add.html
- app\qingadmin\view\search\edit.html
- app\qingadmin\view\search\index.html



## 3. 增删改查

~~~php
<?php

namespace app\qingadmin\controller;

use think\facade\Db;

class Search extends Base {
  public function index() {
    $searchData = Db::name('search')->order('id desc')->paginate(10);
    return view('', [
      'searchData' => $searchData
    ]);
  }

  public function add() {
    if (request()->isPost()) {
      $data = input('post.');
      $id = Db::name('search')->where('name', $data['name'])->value('id');
      if ($id) {
        return alert('已经添加过了', 'index', 5, 3);
      }

      $res = Db::name('search')->insert($data);
      if ($res) {
        return alert('添加成功', 'index', 6, 3);
      } else {
        return alert('添加失败', 'index', 5, 3);
      }
    } else {
      return view();
    }
  }

  public function edit() {
    $id = input('id');
    // $searchData = Db::name('search')->find($id);
    // 也可以使用 where 从句查找
    $searchData = Db::name('search')->where('id', $id)->find();
    if (request()->isPost()) {
      $data = input('post.');
      $res = Db::name('search')->update($data);
      if ($res) {
        return alert('修改成功', 'index', 6, 3);
      } else {
        return alert('修改失败', 'index', 5, 3);
      }
    } else {
      return view('', [
        'searchData' => $searchData
      ]);
    }
  }

  public function del() {
    $id = input('id');
    $res = Db::name('search')->delete($id);
    if ($res) {
      return alert('操作成功', 'index', '6');
    } else {
      return alert('操作失败', 'index', '5');
    }
  }
}

~~~



## ！！！！4. 数据校验



# 系统通知

## 1. 创建控制器

~~~php
<?php

namespace app\qingadmin\controller;

use think\facade\Db;

class Notice extends Base {
  public function index() {
      return view();
  }
~~~



## 2. 视图

- app\qingadmin\view\notice\index.html
- app\qingadmin\view\notice\send.html
- app\qingadmin\view\notice\edit.html



## 3. 增删改查

~~~php
<?php

namespace app\qingadmin\controller;

use think\facade\Db;

class Notice extends Base {
  //通知消息列表
  public function index() {
    $noticeData = Db::name('notice')->order('id desc')->paginate(10);
    return view('', [
      'noticeData' => $noticeData,
    ]);
  }

  //发送通知消息
  public function send() {
    if (request()->isPost()) {
      $data = input('post.');
      $data['time'] = time();
      $res = Db::name('notice')->insertGetId($data);
      if ($res) {
        return alert('操作成功', 'index', '6');
      } else {
        return alert('操作失败', 'index', '5');
      }
    }
    return view();
  }

  //查看消息
  public function edit() {
    $id = request()->param('id');
    $noticeData = Db::name('notice')->find($id);
    if (request()->isPost()) {
      $data = input('post.');
      $res = Db::name('notice')->update($data);
      if ($res) {
        return alert('操作成功', 'index', '6');
      } else {
        return alert('操作失败', 'index', '5');
      }
    }
    return view('', [
      'noticeData' => $noticeData
    ]);
  }

  public function del() {
    $id = input('id');
    $res = Db::name('notice')->delete($id);
    if ($res) {
      return alert('操作成功', 'index', '6');
    } else {
      return alert('操作失败', 'index', '5');
    }
  }
}

~~~



## ！！！！4. 数据校验



## ！！！！5. 通知阅读情况



# 管理员列表

## 1. 创建控制器

~~~php
<?php

namespace app\qingadmin\controller;

use think\facade\Db;

class Admin extends BaseController {
  public function index() {
    return view();
  }
}

~~~



## 2. 视图

- app\qingadmin\view\admin\add.html
- app\qingadmin\view\admin\edit.html
- app\qingadmin\view\admin\index.html



## 3. CRUD

管理员列表中，group_id  是管理员分组，其名称是保存在 auth_group 这个表中，所以我们要做连表查询

~~~php
<?php

    namespace app\qingadmin\controller;

use think\facade\Db;

class Admin extends Base {
    public function index() {
        // 判断该管理员是否具有查看并编辑其他管理员的权限
        $loginAdmin = session('adminSessionData');
        if ($loginAdmin['admin_group_id'] == 1) {
            $adminData = Db::name('admin')->alias('a')->join('auth_group b', 'a.group_id=b.id')->field('a.*, b.title')->select();
        } else {
            // 其他管理员只具有查看并编辑自己的权限
            $adminData = Db::name('admin')->alias('a')->join('auth_group b', 'a.group_id=b.id')->field('a.*, b.title')->where('a.id', $loginAdmin['admin_id'])->select();
        }
        return view('', ['adminData' => $adminData]);
    }

    public function add() {
        // 判断该管理员是超级管理员权限
        $loginAdmin = session('adminSessionData');
        if ($loginAdmin['admin_group_id'] != 1) {
            return alert('没有权限添加', 'index', '5');
        }
        $authGroup = Db::name('auth_group')->field('id,title')->select();
        if (request()->isPost()) {
            $data = input('post.');
            $salt = 'zxcvbn';
            $data['password'] = md5($salt . $data['password']);
            $data['last_login_time'] = time();
            $res = Db::name('admin')->insert($data);
            if ($res) {
                return alert('操作成功', 'index', '6');
            } else {
                return alert('操作失败', 'index', '5');
            }
        }
        return view('', [
            'authGroup' => $authGroup,
        ]);
    }

    //更改状态
    public function status() {
        // 权限验证
        $loginAdmin = session('adminSessionData');
        if ($loginAdmin['admin_group_id'] != 1) {
            return alert('没有权限修改', 'index', '5');
        }
        $id = input('get.id');
        $status = input('get.status');
        $res = Db::name('admin')->where('id', $id)->update(['status' => $status]);
        if ($res) {
            return alert('操作成功', 'index', '6');
        } else {
            return alert('操作失败', 'index', '5');
        }
    }

    public function edit() {
        $loginAdmin = session('adminSessionData');
        $id = input('get.id');
        // 验证权限
        if ($loginAdmin['admin_group_id'] != 1 && $loginAdmin['admin_id'] != $id) {
            return alert('没有权限编辑', 'index', '5');
        }

        // 提交数据
        if (request()->post()) {
            $data = input('post.');
            if (!empty($data['password'])) {
                $salt = 'zxcvbn';
                $data['password'] = md5($salt . $data['password']);
            } else {
                unset($data['password']);
            }
            $res = Db::name('admin')->update($data);
            if ($res) {
                return alert('修改成功！', 'index', 6, 3);
            } else {
                return alert('修改失败！', 'index', 5, 3);
            }
        }

        // 展示数据
        $adminData = Db::name('admin')->where('id', $id)->find();
        $authGroupData = Db::name('auth_group')->select();
        return view('', [
            'adminData' => $adminData,
            'authGroupData' => $authGroupData
        ]);
    }

    public function del() {
        $loginAdmin = session('adminSessionData');
        $id = input('get.id');
        // 验证权限
        if ($loginAdmin['admin_group_id'] != 1 && $loginAdmin['admin_id'] != $id) {
            return alert('没有权限编辑', 'index', '5');
        }
        $res = Db::name('admin')->delete($id);
        if ($res) {
            return alert('操作成功', 'index', '6');
        } else {
            return alert('操作失败', 'index', '5');
        }
    }
}

~~~



## 4. 提取公共方法

关于 salt 我们看到在很多地方都重复用到，可以将 salt 添加到系统设置中，也可以提取到 Base 控制器中，如：

app\qingadmin\controller\Base.php

~~~php
<?php

namespace app\qingadmin\controller;

use app\BaseController;
use think\facade\Db;

class Base extends BaseController {
  public function initialize() {
  }

  //后台密码加密Salt
  public function password_salt($str) {
    $salt = 'zxcvbn';
    return md5($salt . $str);
  }
}

~~~



然后在子类中调用即可：

~~~php
$data['password'] = $this->password_salt($data['password']);
~~~





## 5. 登录时验证管理员权限

登录时，需要判断管理员权限，状态是否是禁用状态，如果是禁用状态，则不允许登录，所以在 Login 控制器中，需要添加一个判断。

app\qingadmin\controller\Login.php

~~~php
if ($adminData['status'] == 0) {
    return alert('该管理员被禁用', 'index', 5);
}
~~~



# 用户组管理

## 1. 创建控制器

~~~php
<?php

namespace app\qingadmin\controller;

use think\facade\Db;

class Admin extends BaseController {
  public function index() {
    return view();
  }
}

~~~



## 2. 视图

- app\qingadmin\view\admin\group.html
- app\qingadmin\view\admin\group_add.html
- app\qingadmin\view\admin\group_edit.html
- app\qingadmin\view\admin\group_power.html



## 3. CRUD

~~~php
<?php

namespace app\qingadmin\controller;

use think\facade\Db;

class AuthGroup extends Base {
  public function index() {
    $authGroupData = Db::name('auth_group')->select();
    return view('admin/group', [
      'authGroupData' => $authGroupData
    ]);
  }

  public function add() {
    if (request()->isPost()) {
      $data = input('post.');
      $res = Db::name('auth_group')->insert($data);
      if ($res) {
        return alert('操作成功', 'index', '6');
      } else {
        return alert('操作失败', 'index', '5');
      }
    }
    return view('admin/group_add');
  }

  public function edit() {
    $id = input('get.id');
    if (request()->isPost()) {
      $data = input('post.');
      $res = Db::name('auth_group')->where('id', $id)->update($data);
      if ($res) {
        return alert('操作成功', 'index', '6');
      } else {
        return alert('操作失败', 'index', '5');
      }
    }
    $authGroupData = Db::name('auth_group')->find($id);
    return view('admin/group_edit', [
      'authGroupData' => $authGroupData
    ]);
  }

  public function power() {
    $id = input('get.id');
    $authGroupData = Db::name('auth_group')->find($id);
    // 获取父级
    $authRuleData = Db::name('auth_rule')->where('parent_id', 0)->where('status', 1)->select()->toArray();
    // 给父级添加子集（子集 parent_id == 父级 id）
    foreach ($authRuleData as $k => $v) {
      $authRuleData[$k]['children'] = Db::name('auth_rule')->where('parent_id', $v['id'])->where('status', 1)->select()->toArray();
    }
    if (request()->isPost()) {
      $data = input('post.');
      // 数组转字符串（保存在数据库中）
      $data['rules'] = implode(',', $data['rules']);
      $res = Db::name('auth_group')->update($data);
      if ($res) {
        return alert('操作成功', 'index', '6');
      } else {
        return alert('操作失败', 'index', '5');
      }
    }
    // 字符串转数组（需要遍历在模板中）
    $rulesArr = explode(',', $authGroupData['rules']);
    return view('admin/group_power', [
      'authGroupData' => $authGroupData,
      'authRuleData' => $authRuleData,
      'rulesArr' => $rulesArr
    ]);
  }

  public function del() {
    $id = input('id');
    $res = Db::name('auth_group')->delete($id);
    if ($res) {
      return alert('操作成功', 'index', '6');
    } else {
      return alert('操作失败', 'index', '5');
    }
  }
}

~~~



# 用户权限列表

## 1. 创建控制器

~~~php
<?php

namespace app\qingadmin\controller;

use app\BaseController;

class AuthRule extends Base {
  public function index() {
    return view('admin/authrule');
  }
}

~~~



## 2. 视图

- app\qingadmin\view\admin\authrule.html
- app\qingadmin\view\admin\authrule_add.html
- app\qingadmin\view\admin\authrule_edit.html



## 3. 无限分类

创建模型，处理无限级分类

~~~php
<?php

namespace app\common\model;

use think\Model;

class AuthRule extends Model {

    // 传入分类数组
  public function sort($ruleRes, $parent_id = 0, $level = 0) {
    static $arr = array();
      // 遍历分类项
    foreach ($ruleRes as $k => $v) {
        // 遍历元素 pid 所属，在数组中加入 level 层级
      if ($v['parent_id'] == $parent_id) {
        $v['level'] = $level;
          // 加入新数组，重新排序
        $arr[] = $v;
          // 递归，将遍历项的 id 当做 pid，level + 1
        $this->sort($ruleRes, $v['id'], $level + 1);
      }
    }

    return $arr;
  }
}

~~~



控制器

~~~php
<?php

namespace app\qingadmin\controller;

use think\facade\Db;
// 与控制器同名，需要起别名
use app\common\model\AuthRule as AuthRuleModel;

class AuthRule extends Base {
  public function index() {
    // 数据库提取分类数据
    $ruleData = Db::name('auth_rule')->where('status', 1)->select();
    // 调用模型中的分类方法，加入 level 层级
    $authRuleModel = new AuthRuleModel();
    $ruleDataTree = $authRuleModel->sort($ruleData);
    return view('admin/authrule', [
      'ruleDataTree' => $ruleDataTree
    ]);
  }
}

~~~



视图

通过 str_repeat 函数，按照 level 值加入不同的缩进

~~~php
{volist name="$ruleDataTree" id="vo"}

<tr class="text-c">


    <td>{$vo.id}</td>
    <td style="text-align: left;{if condition='$vo.level eq 0'}font-weight:bold;{/if}{if condition='$vo.status eq 0'}color:#aaa{/if}"><?php echo str_repeat('-', $vo['level']*6);?>
    </td>

    <td><a title="编辑" href="{:url('authrule/edit',array('id'=>$vo.id))}" class="ml-5" style="text-decoration:none"><i class="Hui-iconfont">&#xe6df;</i></a> <a title="删除" href="javascript:;" onclick="admin_permission_del(this,'1')" class="ml-5" style="text-decoration:none"><i class="Hui-iconfont">&#xe6e2;</i></a></td>

    </tr>

{/volist}
~~~



## 4. CRUD

~~~php
<?php

namespace app\qingadmin\controller;

use think\facade\Db;
use app\common\model\AuthRule as AuthRuleModel;

class AuthRule extends Base {
  public function index() {
    // 搜索关键字
    // 相当于  $searchKey = input('post.searchKey') ? input('post.searchKey') : '';
    $searchKey = input('post.searchKey') ?? '';

    // 拼接 where 搜索条件
    $where = [];
    if ($searchKey) {
      $where[] = ['title', 'like', '%' . $searchKey . '%'];
    }

    // 数据库提取分类数据
    $ruleData = Db::name('auth_rule')->where('status', 1)->where($where)->select();
    // 调用模型中的分类方法，加入 level 层级
    $authRuleModel = new AuthRuleModel();
    $ruleDataTree = $authRuleModel->sort($ruleData);

    return view('admin/authrule', [
      'ruleDataTree' => $ruleDataTree,
      'searchKey' => $searchKey
    ]);
  }

  public function add() {
    if (request()->isPost()) {
      $data = input('post.');
      $res = Db::name('auth_rule')->insert($data);
      if ($res) {
        return alert('操作成功', 'index', '6');
      } else {
        return alert('操作失败', 'index', '5');
      }
    }
    $ruleData = Db::name('auth_rule')->where('status', 1)->select();
    $authRuleModel = new AuthRuleModel();
    $ruleDataTree = $authRuleModel->sort($ruleData);
    return view('admin/authrule_add', [
      'ruleDataTree' => $ruleDataTree
    ]);
  }
  public function edit() {
    if (request()->isPost()) {
      $data = input('post.');
      $res = Db::name('auth_rule')->update($data);
      if ($res) {
        return alert('操作成功！', 'index', 6);
      } else {
        return alert('操作失败！', 'index', 5);
      }
    }
    $id = input('id');
    $ruleData = Db::name('auth_rule')->find($id);
    $ruleRes = Db::name('auth_rule')->where('status', 1)->select();
    $authRuleModel = new AuthRuleModel();
    $ruleDataTree = $authRuleModel->sort($ruleRes);

    return view('admin/authrule_edit', [
      'ruleDataTree' => $ruleDataTree,
      'ruleData' => $ruleData
    ]);
  }

  public function del() {
    $id = input('id');
    $res = Db::name('auth_rule')->delete($id);
    if ($res) {
      return alert('操作成功', 'index', '6');
    } else {
      return alert('操作失败', 'index', '5');
    }
  }
}

~~~



# 权限控制

## 1. 检测权限

在父类控制器中的 initialize 中调用权限控制方法，当所请求页面控制器匹配当前用户所属用户组的权限时，返回 true，否则进行跳转或停止代码运行。

~~~php
<?php

namespace app\qingadmin\controller;

use app\BaseController;
use think\facade\Db;
use think\exception\HttpResponseException;

class Base extends BaseController {
  public function initialize() {
    $loginAdmin = session('adminSessionData');
    // 权限控制
    $this->adminAuth($loginAdmin);
  }

  //后台密码加密Salt
  public function password_salt($str) {
    $salt = 'zxcvbn';
    return md5($salt . $str);
  }

  //抛出异常的方式进行跳转（redirect 只在控制器中生效）
  public function redirect(...$args) {
    throw new HttpResponseException(redirect(...$args));
  }

  //权限控制
  public function adminAuth($loginAdmin) {
    // 获取当前请求的控制器
    $currentRule = request()->controller() . '/' . request()->action();
    // 拿到当前用户所属用户组的规则字符串
    $rulesArrTmp = Db::name('auth_group')->field('rules')->find($loginAdmin['admin_group_id']);
    // 将字符串转为数组
    $rulesArr = explode(',', $rulesArrTmp['rules']);
    foreach ($rulesArr as $k => $v) {
      // 遍历所拥有的访问权限的控制器是否与当前请求控制器一致
      $authRuleData = Db::name('auth_rule')->find($v);
      if ($authRuleData['name'] == $currentRule) {
        return true;
      }
    }
    // halt('你没有权限');
    // 调用异常调转方式
    $this->redirect('/qingadmin/index/welcome');
  }
}

~~~



## 2. 隐藏无权限菜单



# 数据统计

原理就是将后台数据拿到，然后传入视图，利用 Echarts 生成图表



## 1. 控制器

~~~php
<?php

namespace app\qingadmin\controller;

class Stats extends Base {

  public function index() {
    return view();
  }
}

~~~



## 2. 视图

- app\qingadmin\view\stats\index.html



# 分佣管理

## 1. 控制器

~~~php
<?php

namespace app\qingadmin\controller;

use think\facade\Db;

class Fenyong extends  Base {
  public function index() {
    $userData = Db::name('user')->field('id, username, create_time, parent_id')->where('parent_id', '<>', 0)->paginate(20);
    return view('', [
      'userData' => $userData
    ]);
  }
}

~~~



## 2. 视图

- app\qingadmin\view\fenyong\index.html



## 3. 创建 getUserById 方法

在 app\common.php 创建公共方法

~~~php
// 获取用户名
function getUserById($id){    
    $userData = Db::name('user')->find($id);
    return $userData['username'];
    
}
~~~



## 4. 管道符

- 视图中利用管道符将 id 传入函数，返回用户名
- 管道符也可以用来格式化时间

~~~html
<td>{$vo.parent_id|getUserById}</td>
<td>{$vo.create_time|date='Y-m-d'}</td>
~~~



# 优惠券

## 1. 控制器

~~~php
<?php

namespace app\qingadmin\controller;

use think\facade\Db;

class Notice extends Base {
~~~



## 2. 视图

- app\qingadmin\view\coupons\add.html
- app\qingadmin\view\coupons\edit.html
- app\qingadmin\view\coupons\index.html



## 2. CRUD

主要就是注意时间戳的转换

- POST 拿到数据用 PHP 函数 strtotime 把字符串转换成时间戳
- 从数据库拿到数据渲染到页面，利用通道符，将时间戳转换为时间格式。

~~~php
<?php

namespace app\qingadmin\controller;

use think\facade\Db;

class Coupons extends Base {
  public function index(){
    $couponsData = Db::name('coupons')->order('id desc')->paginate(15);
    return view('',[
      'couponsData'=>$couponsData
    ]);
  }

  public function add(){
    if(request()->isPost()){
      $data = input('post.');
      $data['start_time'] = $data['start_time'] ? strtotime($data['start_time']) : time();
      $data['end_time'] = $data['end_time'] ? strtotime($data['end_time']) : time();
      $res = Db::name('coupons')->insert($data);
      if ($res) {
        return alert('操作成功', 'index', '6');
      } else {
        return alert('操作失败', 'index', '5');
      }
    }
    return view();

  }

  public function edit(){
    $id = input('get.id');
    $couponsData = Db::name('coupons')->where('id',$id)->find();
    return view('',[
      'couponsData'=>$couponsData
    ]);
  }

  public function update(){
    $data = input('post.');
    $data['start_time'] = $data['start_time'] ? strtotime($data['start_time']) : time();
    $data['end_time'] = $data['end_time'] ? strtotime($data['end_time']) : time();
    $res = Db::name('coupons')->update($data);
    if ($res) {
      return alert('操作成功', 'index', '6');
    } else {
      return alert('操作失败', 'index', '5');
    }
  }

  public function del(){
    $id = input('get.id');
    $res = Db::name('coupons')->where('id',$id)->delete();
    if ($res) {
      return alert('操作成功', 'index', '6');
    } else {
      return alert('操作失败', 'index', '5');
    }
  }
}
~~~



# 文章系统

## 1. 控制器

## 2. 视图

## 3. 多文本编辑器 Ueditor

## 4. 图片上传 Webuploader

### 4.1 更改上传路径

### 4.2 上传文件验证

## 5. CRUD





# 后续问题

路由重构

robots.txt 抓取规则

Model 模型

Token 使用防止 XSS

runtime 缓存权限，禁止访问 log

更改默认 Session 名称，（PHPSESSID)

只提取需要的字段 field

添加管理员时需要判断是否有重名

添加、修改、删除管理员时需要判断当前管理员是否有权限

- 前台删除按钮
- 无权限管理员只能查看、编辑自己的管理员信息
- 无权限管理员不能删除其他用户
- 禁止超级管理员更改自己的管理员组



