# Gulp 简介

gulp 是前端工程化中最便捷的工具之一，用户通过配置个性化的插件，来提高工程师的开发效率。

- CSS、JS 文件合并
- LESS 文件解析转换 CSS
- CSS、JS、HTML 文件压缩
- ES6 语法转 ES5
- 改变代码实时同步使页面发生变化



# 安装 Gulp

## 1. 项目结构

创建项目文件夹，如：gulp_test

~~~
c:\wamp64\www\gulp_test
~~~



创建一个简单的项目结构

~~~
|-dist
|-src
	|-js
	|-css
	|-less
|-index.html
|-gupfile.js
~~~



## 2. 安装 Node

首先需要安装 Node，Node 下载地址：

https://nodejs.org/en/



更改源：

~~~
npm config set registry https://registry.npm.taobao.org
~~~



进入 gulp_test ，进行项目初始化，创建packge.json文件

~~~
npm init
~~~



npm 安装插件

~~~
npm install <name> [-g][--save-dev]
~~~

-g：

- 全局安装。在windows系统中将会安装在 C:\Users\Administrator\AppData\Roaming\npm，并且写入系统环境变量；全局安装可以通过命令行在任何地方调用它。  
-  非全局安装：将会安装在当前定位目录；本地安装将安装在定位目录的node_modules文件夹下，通过require()调用；

  --save：

- 将安装信息保存在 pacakge.json 中，package.json 是 npm 的项目配置文件，保存在项目根目录下。（项目开发过程中需要使用的插件大多相同，所以成功配置好 package.json 后应当保留，在有 packge.json 的当前目录下输入`npm install`即可按照配置下载插件）；

 -dev：

- 将插件名版本号保存至 package.json 的 devDependencies 节点，不指定 -dev 将保存至 dependencies 节点。两者的区别在于，前者是生产环境，后者是开发环境。



npm 安装指定版本

~~~
npm install gulp@3.9.1
~~~



## 3. 安装 Gulp

安装 Gulp 命令行工具

~~~
npm install --g gulp-cli
~~~



项目中安装 gulp 库

~~~
npm install gulp --save -dev
~~~



项目根目录创建 gulpfile.js 文件，并引入 gulp 包

~~~js
var gulp = require('gulp')
~~~



## 4. gulp 插件

使用 `npm install --save -dev` 安装以下插件：

- gulp-concat  合并文件 （js/css）
- gulp-uglify  压缩 js 文件
- gulp-rename  文件重命名
- gulp-less  编译 less 文件
- gulp-clean-css  压缩 css 文件
- gulp-htmlmin 压缩 html 文件
- gulp-livereload  实时自动编译刷新
- gulp-connect 创建微服务端
- gulp-open 自动打开页面
- gulp-load-plugins 自动加载插件



## 5. Powershell 无法运行 gulp

VS CODE 配置 cmd

CTRL+SHIFT + P，调用菜单 Terminal: Select Default Profile，选择 cmd.exe 即可



管理员模式运行 powershell

get-ExecutionPolicy，显示Restricted，表示状态是禁止的，如果是RemoteSigned，那么就不用往下执行了

~~~
set-ExecutionPolicy RemoteSigned
~~~





# Gulp API (v4.0.1)

## 1. 引入 gulp

gulpfile.js 中配置 gulp 任务

~~~js
const { series, src, dest, watch } = require('gulp');
~~~

> series, src, dest, watch 是 gulp 中的 API，需要用什么方法则引入什么



## 2. 创建任务

~~~js
function build() {
    return console.log('build');
}
~~~

> 直接使用 function 来创建任务



## 3. 执行任务

### 3.1 公开任务

在 gulp 文件末尾需要导出任务

~~~js
const { series, src, dest, watch } = require('gulp');

function build(){
    return console.log('build');
}

exports.build = build;
~~~



然后在控制台中可以直接调用，如：

~~~shell
gulp build
~~~



### 3.2 默认任务

exports 的 default 属性为默认执行任务，将任务赋值给该属性时，直接执行 gulp 就可以执行指定任务，不需要指定任务名

~~~js
const { series, src, dest, watch } = require('gulp');

function output(){
    return console.log('output');
}

exports.output = output;
exports.default = output;
~~~



执行任务

~~~
gulp
~~~



任务没有做 exports 时，被称为私有任务，这些任务不可以在控制台直接调用，但是可以使用 default 加载这些任务

~~~js
const { series, src, dest, watch } = require('gulp');

function output(){
    return console.log('output');
}

exports.default = output;
~~~



执行任务：

~~~
gulp
~~~



## 4. 任务池

### 4.1 同步任务

当有多个任务时，可以将他们添加到 series 队列当中

~~~js
const { series } = require('gulp');

function build(){
    return console.log('build');
}

function output(){
    return console.log('output');
}

exports.default = series(build, output);
~~~



### 4.2 异步任务

series 类似于同步任务，任务按照顺序执行，gulp 还提供一个 parallel 方法，可以并发执行任务

~~~js
const { parallel } = require('gulp');

function build(){
    return console.log('build');
}

function output(){
    return console.log('output');
}

exports.default = parallel(build, output);
~~~



## 5. src

寻找路径，指向指定路径的文件，返回文件流对象，用于读取文件

~~~js
src('src/js/*.js')
~~~



## 6. dest

将对象写入指向指定的所有文件夹

~~~js
dest('dist/js/')
~~~



## 7. pipe

将返回的对象进行管道传送

~~~js
src('src/js/**/*.js')
.pipe(concat('build.js'))
.pipe(gulp.dest('dist/js/'))
~~~



## 8. watch

监听事件

~~~js
watch('src/js/*.js', js);
watch(['src/css/*.css', 'src/less/*.less'],css);
~~~



加参数

~~~js
var watcher1 = watch('src/js/*.js')
.on('all', js)

var watcher2 = watch(['src/css/*.css', 'src/less/*.less'])
.on('all', series(less, css));
~~~



# 综合

~~~js
const { parallel, series, src, dest, watch } = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var cssClean = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');
var open = require('open');
const gulpLoadPlugins = require('gulp-load-plugins');

function js() {
    return src('src/js/*.js')
        .pipe(concat('build.js'))
        .pipe(dest('dist/js/'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('dist/js'))
        .pipe(connect.reload())
}


function lessparse() {
    return src('src/less/*.less')
        .pipe(less())
        .pipe(dest('src/css/'))
        .pipe(connect.reload())
}


function css() {
    return src('src/css/*.css')
        .pipe(concat('build.css'))
        .pipe(dest('dist/css/'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssClean({ compatibility: 'ie8' }))
        .pipe(dest('dist/css/'))
        .pipe(connect.reload())
}

function html() {
    return src('index.html')
        .pipe(htmlmin({ collapseWhitespace: 'true' }))
        .pipe(dest('dist/'))
        .pipe(connect.reload())
}


function server() {
    connect.server({
        root: 'dist/',
        livereload: true,
        port: 5000
    })
    open('http://localhost:5000');
    watch('src/js/*.js', js);
    watch('src/less/*.less', lessparse);
    watch('src/css/*.css',css);
    watch('index.html', html);

}

exports.default = server

~~~







# Gulp API（v3.9.1）

## 1. task

gulpfile.js 中配置 gulp 任务

~~~js
var gulp = require('gulp');

// 注册任务
gulp.task('build',function(){
	return
})

// 注册默认任务
gulp.task('default', ['build'])
~~~



## 2. 执行任务

~~~shell
# 执行指定任务
gulp build

# 默认执行 default 中注册的所有任务
gulp
~~~



## 3. src

寻找路径，指向指定路径的文件，返回文件流对象，用于读取文件

~~~js
gulp.src('src/js/*.js')
~~~



递归遍历寻找路径

~~~js
gulp.src('src/js/**/*.js')	
~~~



## 4. dest

指向指定的所有文件夹

~~~js
gulp.dest('dist/js/')
~~~



## 5. pipe

gulp 返回的对象进行管道传递参数中的方法

~~~js
gulp.src('src/js/**/*.js')
.pipe(concat('build.js'))
.pipe(gulp.dest('dist/js/'))
~~~



# JS 文件合并并压缩

- 合并文件将多个文件合并为一个文件
- 压缩文件减少空白及注释

~~~js
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// 注册合并压缩 js 的任务
gulp.task('js', function () {
    return gulp.src('src/js/*.js')  // 找到目标文件，将数据读取到 gulp 内存
        .pipe(concat('build.js'))  // 临时合并文件
        .pipe(gulp.dest('dist/js/'))  // 输出文件到本地
        .pipe(uglify())  // 压缩文件
        // .pipe(rename('build.min.js'))  // 重命名文件
        .pipe(rename({ suffix: ".min" }))  // 添加后缀方式重命名文件
        .pipe(gulp.dest('dist/js'))  // 输出最终文件

})

// 注册默认任务
gulp.task('default', ['js'])
~~~



# CSS 文件合并压缩

~~~js
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var less = require('gulp-less');
var cssClean = require('gulp-clean-css');

// 解析 less 文件
gulp.task('less', function () {
    return gulp.src('src/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('src/css/'))
})

// 压缩合并 css 文件
gulp.task('css', function(){
    return gulp.src('src/css/*.css')
    .pipe(concat('build.css'))
    .pipe(rename({suffix:'.min'}))
    .pipe(cssClean({compatibility:'ie8'}))
    .pipe(gulp.dest('dist/css/'))
})

// 注册默认任务
gulp.task('default', ['less', 'css'])
~~~



# Gulp 异步操作

- 当 task 方法有 return 时，执行异步操作
- 没有 return 时，执行同步操作



压缩合并 CSS 文件前，需要将 less 文件解析后再进行压缩合并任务，可以在 task 添加依赖关系

~~~js
gulp.task('less', function () {
    return gulp.src('src/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('src/css/'))
})

// 添加依赖关系
gulp.task('css', ['less'], function(){
    return gulp.src('src/css/*.css')
    .pipe(concat('build.css'))
    .pipe(rename({suffix:'.min'}))
    .pipe(cssClean({compatibility:'ie8'}))
    .pipe(gulp.dest('dist/css/'))
})
~~~

> css 任务需要依赖 less 任务，只有当 less 任务完成后才开始执行 css 任务



# HTML 压缩

~~~js
var gulp = require('gulp');

var htmlmin = require('gulp-htmlmin');

// 压缩 html 文件
gulp.task('css', function(){
    return gulp.src('index.html')
    .pipe(htmlmin({collapseWhitespace:'true'}))
    .pipe(gulp.dest('dist/'))
})
~~~

> 注意更改 index.html 的引用路径



# 动态改变文件

~~~js
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var less = require('gulp-less');
var cssClean = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var livereload = require('gulp-livereload');

// 注册合并压缩 js 的任务
gulp.task('js', function () {
    return gulp.src('src/js/*.js')  // 找到目标文件，将数据读取到 gulp 内存
        .pipe(concat('build.js'))  // 临时合并文件
        .pipe(gulp.dest('dist/js/'))  // 输出文件到本地
        .pipe(uglify())  // 压缩文件
        // .pipe(rename('build.min.js'))  // 重命名文件
        .pipe(rename({ suffix: ".min" }))  // 添加后缀方式重命名文件
        .pipe(gulp.dest('dist/js'))  // 输出最终文件

})

// 解析 less 文件
gulp.task('less', function () {
    return gulp.src('src/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('src/css/'))
})

// 压缩合并 css 文件
gulp.task('css', ['less'], function () {
    return gulp.src('src/css/*.css')
        .pipe(concat('build.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssClean({ compatibility: 'ie8' }))
        .pipe(gulp.dest('dist/css/'))
})

// 压缩 html 文件
gulp.task('html', function () {
    return gulp.src('index.html')
        .pipe(htmlmin({ collapseWhitespace: 'true' }))
        .pipe(gulp.dest('dist/'))
})

// 开启监听
gulp.task('watch', ['default'], function(){
    livereload.listen();
    // 确定监听的目标以及绑定响应的任务
    gulp.watch('src/js/*.js', ['js']);
    gulp.watch(['src/css/*.css', 'src/less/*.less'], ['css']);
})

// 注册默认任务
gulp.task('default', ['js', 'less', 'css', 'html'])
~~~



执行监听任务

~~~
gulp watch
~~~



# 浏览器实时刷新

开启微系统服务，自动刷新页面

~~~js
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var less = require('gulp-less');
var cssClean = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');
var open = require('open');

// 注册合并压缩 js 的任务
gulp.task('js', function () {
    return gulp.src('src/js/*.js')  // 找到目标文件，将数据读取到 gulp 内存
        .pipe(concat('build.js'))  // 临时合并文件
        .pipe(gulp.dest('dist/js/'))  // 输出文件到本地
        .pipe(uglify())  // 压缩文件
        // .pipe(rename('build.min.js'))  // 重命名文件
        .pipe(rename({ suffix: ".min" }))  // 添加后缀方式重命名文件
        .pipe(gulp.dest('dist/js'))  // 输出最终文件
        .pipe(livereload())
        .pipe(connect.reload())

})

// 解析 less 文件
gulp.task('less', function () {
    return gulp.src('src/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('src/css/'))
        .pipe(livereload())
        .pipe(connect.reload())


})

// 压缩合并 css 文件
gulp.task('css', ['less'], function () {
    return gulp.src('src/css/*.css')
        .pipe(concat('build.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssClean({ compatibility: 'ie8' }))
        .pipe(gulp.dest('dist/css/'))
        .pipe(livereload())
        .pipe(connect.reload())


})

// 压缩 html 文件
gulp.task('html', function () {
    return gulp.src('index.html')
        .pipe(htmlmin({ collapseWhitespace: 'true' }))
        .pipe(gulp.dest('dist/'))
        .pipe(livereload())
        .pipe(connect.reload())


})

// 开启监听
gulp.task('watch', ['default'], function () {
    livereload.listen();
    // 确定监听的目标以及绑定响应的任务
    gulp.watch('src/js/*.js', ['js']);
    gulp.watch(['src/css/*.css', 'src/less/*.less'], ['css']);
})

gulp.task('server', ['default'], function () {
    connect.server({
        root: 'dist/',
        livereload: true,
        port: 5000
    })

    gulp.watch('src/js/*.js', ['js']);
    gulp.watch(['src/css/*.css', 'src/less/*.less'], ['css']);
})

// 注册默认任务
gulp.task('default', ['js', 'less', 'css', 'html'])
~~~



需要访问对应端口，如：

~~~
http://localhost:5000
~~~



# 自动打开页面

不是 gulp 插件，是独立包

~~~
npm install --save -dev open
~~~



~~~js
var open = require('open');

gulp.task('server', ['default'], function () {
    connect.server({
        root: 'dist/',
        livereload: true,
        port: 5000
    })
    open('http://localhost:5000');
    gulp.watch('src/js/*.js', ['js']);
    gulp.watch(['src/css/*.css', 'src/less/*.less'], ['css']);
})
~~~



# 自动加载 gulp 插件

需要安装 gulp-load-plugins

~~~js
npm install --save -dev gulp-load-plugins
~~~



引入 gulpfile.js

~~~js
var $ = require('gulp-load-plugins')();
~~~



将所有方法替换为 $.方法名，如：

~~~
$.uglify()
~~~



移除所有引入文件即可自动调用



