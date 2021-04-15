# 一、Node.js 介绍



黑马李鹏周老师视频地址：

bilibili.com/video/BV16E41137ZU



Vue 李鹏周老师视频地址：

https://www.bilibili.com/video/BV1Ab411r7Vt



## 1. 什么是 Node.js

Node.js 是一个可以提供 Javascript 运行的环境平台，它可以脱离浏览器解析和运行 js 文件。在以前 js 文件只能运行在浏览器当中，并且可以操作浏览器中提供的 BOM 和 DOM 对象。但是 Node.js 作为后端软件，它没有 BOM 和 DOM，只有基本的 ECMScript 基本语法以及 Node 提供的一些服务端的 API，如：

- 文件读写
- 网络服务构建
- 网络通信
- http
- ......



Node.js 是基于解析 Javascript 速度最快的 Chrome V8 引擎，将浏览器中V8引擎移植出来，开发的。



## 2. Node.js 的特性

- 事件驱动（Event-driven）
- 非阻塞 I/O 模型（异步）（Non-Blocking I/O Model）
- 轻量和高效



## 3. NPM

npm 是世界上最大的开源生态系统，可以利用 npm 安装各种 js 相关的包，如：

~~~javascript
node install jquery
~~~



## 4. Node.js 可以做什么

- Web 服务器后台
- 命令行工具



## 5. 学习 Node.js 需要的前置知识

- HTML
- CSS
- Javascript 基本语法
- 简单 Linux 命令



## 6. 资源推荐

- 《深入浅出 Node.js》（主要讲解理论底层概念）
- 《Node.js 权威指南》（主要讲解 Node 的 API）
- 《编写可维护的 Javascript》
- 《深入浅出 node.js》
- 《ES6 入门》
- 《深入理解 ES6》
- 《JS 高级程序设计》
- Node.js 入门
- CNode 社区



## 7. Node.js 主要学习什么

- B/S 编程模型（Browser - Server）
- 模块化编程（可以像其他语言一样在 js 文件中进行文件引用）
- Node API
- 异步编程
- Express Web 开发框架
- ES6



> Node.js 是学习其他 Web 框架，如 Vue，React，Angular 的前提条件



# 二、安装 Node.js

## 1. 官方网站

https://nodejs.org/en/



版本选择：

- LTS（Long Term Support） 稳定版
- Current 最新版

> 稳定版一般是企业开发为了避免出现问题所使用的，而最新版具有最新的特性，对于学习和个人使用来说，使用最新版就可以了。



## 2. 安装和升级

直接双击安装包就可以进行安装，如果之前安装过旧版本的 Node.js，会自动判断进行升级。安装完毕后，可以使用以下命令检查是否安装成功，如：

~~~javascript
node --version
~~~

> 如果出现版本号，则代表安装成功，此命令也可以用来查看 Node 的当前版本号。



## 3. 环境变量



# 三、Hello World

## 1. 运行 js 文件

### 1.1 创建js文件

可以在任意路径创建一个 js 文件，如：

~~~javascript
var foo = "hello world";
console.log(foo);
~~~



注意： 文件名不要用 node.js 来命名。



### 1.2 进入js文件所在目录

需要在命令行中，进入到 js 文件的所在目录，可以使用以下几种方式进入

- cmd
- git bash
- shift 右键
- terminal



### 1.3 运行文件

直接使用 node 命令就可以执行 js 文件了，如：

~~~javascript
node hello.js
~~~



## 2. 读写文件操作

浏览器中无法进行文件操作，但是 node 可以，在 node 中如果想进行文件操作，需要引入 fs（file system）这个核心模块，fs 提供文件操作的相关 API



### 2.1 读取文件

1. 使用 require 加载 fs

~~~javascript
var fs = require('fs');
~~~



2. 读取文件

~~~javascript
fs.readFile('./hello.txt', function(error, data){
  console.log(data.toString());
})
~~~

> 默认以二进制读取，正常显示需要用 toString 方法转字符串



也可以用这种方式直接转换，第二个参数是可选的，读取到的文件直接按照 utf8 编码方式解析

~~~javascript
fs.readFile('./hello.txt', 'utf8', function(error, data){
  console.log(data.toString());
})
~~~



参数说明：

- 第一个参数：文件路径

- 回调函数

  

回调函数有两个参数 data、error，可以任意命名，当成功读取文件后

- data -> 文件内容
- error -> null



当读取文件失败后

- data -> undefined
- error -> 错误对象



### 2.2 写入文件

~~~javascript
fs.writeFile('./hello.txt', '写入的字符串', function(error){
  console.log('文件写入成功');
})
~~~



当写入文件成功时：error -> null

当写入文件失败时：error -> 错误对象



可以使用 if 语句作判断，给出友好提示，如：

~~~javascript
fs.writeFile('./hello.txt', '写入的字符串', function(error){
  if(error){
    console.log('文件写入失败');
  }else{
    console.log('文件写入成功');
  }
})
~~~



## 3. http 服务

### 1. 加载 http 模块

~~~javascript
var http = require('http');
~~~



### 2. 创建 Server 实例

使用 http.createServer() 方法创建一个 Web 服务器，返回一个 Server 实例

~~~javascript
var server = http.createServer();
~~~



### 3. 注册 request 事件

~~~javascript
server.on('request', function() {
  console.log('收到请求');
}
~~~

> 当客户端请求过来，会触发 request 事件，然后执行回调函数，进行处理。



### 4. 绑定端口号

~~~javascript
server.listen(8080, function(){
  console.log('服务器启动成功');
}
~~~



- IP 定位计算机
- 端口号定位具体应用程序
- 一切互联网应用都会占用至少一个端口号
- 端口号范围 1~65535
- 计算机内部系统默认端口（21，23，80，3389....）



### 5. Web 访问

端口号绑定成功后，就可以运行该 js 文件

~~~javascript
node run.js
~~~

> 文件运行成功后，会出现命令控制台，一直监听该指定的端口，当命令控制台被关闭或者用 CTRL+C 停止程序后，监听结束。



通过 localhost:端口号，或 127.0.0.1:端口号 进行访问，但是我们在服务器上没有给出响应信息，所以在浏览器中会出现卡死的情况。但是在服务端（命令控制台）会出现响应信息。



注意：Node 可以同时启用多个 http 服务，对应不同的端口号



### 6. 响应

request 请求处理事件中的回调函数，有2个参数：

- request 请求对象，用来获取客户端请求信息
- response 响应对象，用来给客户端发送信息



request 对象中的 url 属性用来显示 URL 路径，根路径是 `/`，response 中的 write 方法可以用来给客户端发送信息，可以使用多次 write，但是最后要用 end() 方法关闭，如：

~~~javascirpt
server.on('request', function(request, response){
	console.log('收到客户端请求，请求路径是' + request.url);
	response.write('hello');
	response.write('node.js');
	response.end();
})
~~~



可以使用更简单的方式，发送数据后自动 end，如：

~~~javascript
response.end('hello');
~~~



当代码被修改后，需要重新启动服务器，也就是说需要停止 js 代码运行，再重新运行。



### 7. 简单路由

通过 request.url 可以判断客户端的请求路径，那么通过这个属性可以制作一个简单的路由，通过浏览器的访问地址，我们可以给出不同的响应，如：

~~~javascript
var http = require（'http');
var server = http.createServer();
server.on('request', function(request, response){
  if(request.url == '/'){
    response.end('index');
  }else if(request.url == '/login'){
    response.end('登录');
  }else if(request.url == '/register'){
    response.end('注册');
  }else{
    response.end（'404 NOT FOUND');
  }
})
server.listen(8080,function() {
  console.log('服务器启动成功');
}
~~~



加强版路由

~~~javascript
var fs = require('fs');
var http = require（'http');
var server = http.createServer();
server.on('request', function(req, res){
  var url = req.url;
  if ((url === '/') || (url === './index.html')){
    fs.readFile('./index.html', function(err, data){
      if (err){
        return req.end('404 NOT FOUND');
      }
      res.end(data);
    })
  }else if(url == '/register.html'){
    fs.readFile('./register.html', function(err, data){
      if (err){
        return req.end('404 NOT FOUND');
      }
      res.end(data);
    })
   }else if(url == '/admin/login.html'){
    fs.readFile('./admin/login.html', function(err, data){
      if (err){
        return req.end('404 NOT FOUND');
      }
      res.end(data);
    })
  } 
})
server.listen(8080,function() {
  console.log('服务器启动成功');
}
~~~



封装通用处理

~~~javascript
var fs = require('fs');
var http = require（'http');
var server = http.createServer();
server.on('request', function(req, res){
  var url = req.url;
  var wwwDir = 'C:/www'
  var filePath = '/index.html';
  if (url != '/'){
    filePath = url;
  }
  fs.readFile(wwwDir + filePath, function(err, data){
    if (err){
      return res.end('404 NOT FOUND');
    }
    res.end(data);
    
  })
server.listen(8080,function() {
  console.log('服务器启动成功');
}
~~~



### 8. 简单 API

通过 node.js 可以给前端做简单的API，需要注意的是，响应信息只能是二进制数据或字符串，当我们传递 JSON 数据的时候，需要用 JSON.stringify() 方法转换，如：

~~~javascript
server.on('request', function(request, response){
  if(request.url == 'products'){
    var products = [
    {
      name = 'Apple',
      price = 8888
    },
    {
      name = 'Oppo',
      price = 6888
    }
  ]
    response.end(JSON.stringify(products));
  }else{
    response.end（'404 NOT FOUND');
  }
})
~~~



### 9.中文字符处理 UTF8

在 http 中响应中字符如果包含中文的话，在浏览器中会输出乱码，这是因为服务器没有告诉浏览器需要用什么编码解析。

- 服务端默认发送数据为 UTF8 编码内容
- 浏览器在不知道服务器响应内容编码的情况下，会按照当前操作系统的默认编码去解析
- 中文操作系统默认 GBK



解决方案：

告诉浏览器服务器发送的内容编码，如：

~~~javascript
res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
~~~

> 制定头信息，告诉浏览器服务器返回的响应体内容类型为普通文本，编码为 UTF8 格式。



**Content-Type**

关于 Content-Type 有很多种，比如普通的文本格式，HTML网页格式，或者文件格式，具体可以查看：

https://tool.oschina.net/commons



比如返回一个图片文件：

~~~javascript
var fs = require('fs')
var http = require('http')
var server = http.createServer()
server.on('request'function(req, res){
  if (req.url === '/pic'){
    fs.readFile('./image/ab.jpg', function(err,data){
      if(err){
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        req.end('文件读取失败');
      }else{
        res.setHeader('Content-Type', 'image/jpeg')
        req.end(data)
      }
    }) 
  } else {
    req.end('404 NOT FOUND')
  }
})
server.listen(3000,function(){
  console.log('服务器已经启动成功')
})
~~~



在 Node 中访问的路径是我们自定义的路径，不是真实的路径。我们定义好路由，当浏览器访问到我们指定的路径后，浏览器访问的不是文件本身，而是服务器返回给浏览器的我们读取的文件内容。这些内容可以是图片、文本或者 HTML 文件内容。



## 4. Path 模块

~~~js
var path = require('path')

// 返回文件名 index.js
console.log(path.basename('c:/a/b/c/index.js')) 

// 去除文件扩展名 index
console.log(path.basename('c:/a/b/c/index.js', '.js'))

// 返回路径名 c:/a/b/c
console.log(path.dirname('c:/a/b/c/index.js'))

// 返回扩展名 .js
console.log(path.dirname('c:/a/b/c/index.js'))

// 判断是否是绝对路径 true
console.log(path.isAbsolute('/abc/index.html'))

// 把路径解析成对象，返回一个对象，包含 root, dir, base, ext, name
console.log(path.parse('c:/abc/d/index.js'))

// 拼接路径，可以拼接多个参数 c:\\a\\b\\d\\e
console.log(path.join('c:/a/b/d', 'e'))
~~~





# 四、核心模块

Node 为 js 提供了很多服务器级别的API，这些API绝大多数都被包装到了一个具名的核心模块中，例如：

- fs 文件操作
- http 服务构建核心模块
- path 路径操作
- os 操作系统信息
- .......



关于各种 API 可以查看官方文档：

https://nodejs.org/en/docs/



## 1. 加载核心模块

加载核心模块的方法很简单，之前在 Hello World 中的几个项目中也提到过，只需要用 require 就可以加载核心模块，如：

~~~javascript
var fs = require('fs');
~~~



## 2. 加载自定义模块

在浏览器 js 中，我们不能像 PHP 或 Python 其他语言一样，在一个 js 文件中引入另外一个 js 文件。只可以在 html 中用 script 标签引入多个 js。但是在 Node 中可以实现 js 的嵌套引用。在 Node 中加载我们自制的 js 文件也是利用 require，如：

~~~javascript
require('./hello.js');
~~~

> 在一个js文件中调用另外一个js文件，实现多个文件同时执行。



- 引入 js 文件时需要加上绝对或相对路径（不加路径的则会被认为是核心模块），如果是当前目录必须带上 `./` 不能省略
- 扩展名后缀可以省略，如 `require('./hello')`



## 3. 模块之间的通信

Node 中没有全局作用域，只有模块作用域。也就是说在一个js文件中的变量、函数不能再另外一个文件中使用，只在当前文件中有效。那么如何让一个js文件调用另外一个js文件中的变量、函数呢？



require 第二个作用就是可以拿到被加载文件模块到处的接口对象，每个文件模块中都提供了一个对象 `exports`，如：



a.js

~~~javascript
var ret = require('./b');
console.log(ret);
console.log(ret.foo);
console.log(ret.add(10,20));
console.log(ret.age);
~~~



b.js

~~~javascript
var foo = 20;  // 不会被 a.js 调用，只会在 b.js 中有效
exports.foo = 18;
exports.add = function(x,y){
  return x+y;
}
age = 18;
exports.age = age;  // 可以将变量赋值给 exports 对象中的属性
~~~



# 五、代码风格

- Javascript Standard Style
- Airbnb Javascript Style



分号问题：

当一行代码是以 `(`, `[`, ` 开头的时候，需要在前边补上分号，如：

~~~javascirpt
say()
;`hello`.toString
~~~

> 在 ES6 中， `` 的作用和单引号类似，唯一区别就是反引号支持换行。可以将多行字符串赋值给一个变量。



# 六、模板引擎

利用模板引擎实现一个 Apache 目录索引功能



## 1. 字符串替换法

template.html

~~~html
<!DOCTYPE html>

<html dir="ltr" lang="en">

<head>
    <meta charset="utf-8">
    <meta name="google" value="notranslate">


    <style>
        h1 {
            border-bottom: 1px solid #c0c0c0;
            margin-bottom: 10px;
            padding-bottom: 10px;
            white-space: nowrap;
        }
        
        table {
            border-collapse: collapse;
        }
        
        th {
            cursor: pointer;
        }
        
        td.detailsColumn {
            -webkit-padding-start: 2em;
            text-align: end;
            white-space: nowrap;
        }
        
        a.icon {
            -webkit-padding-start: 1.5em;
            text-decoration: none;
            user-select: auto;
        }
        
        a.icon:hover {
            text-decoration: underline;
        }
        
        a.file {
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAABnRSTlMAAAAAAABupgeRAAABHUlEQVR42o2RMW7DIBiF3498iHRJD5JKHurL+CRVBp+i2T16tTynF2gO0KSb5ZrBBl4HHDBuK/WXACH4eO9/CAAAbdvijzLGNE1TVZXfZuHg6XCAQESAZXbOKaXO57eiKG6ft9PrKQIkCQqFoIiQFBGlFIB5nvM8t9aOX2Nd18oDzjnPgCDpn/BH4zh2XZdlWVmWiUK4IgCBoFMUz9eP6zRN75cLgEQhcmTQIbl72O0f9865qLAAsURAAgKBJKEtgLXWvyjLuFsThCSstb8rBCaAQhDYWgIZ7myM+TUBjDHrHlZcbMYYk34cN0YSLcgS+wL0fe9TXDMbY33fR2AYBvyQ8L0Gk8MwREBrTfKe4TpTzwhArXWi8HI84h/1DfwI5mhxJamFAAAAAElFTkSuQmCC ") left top no-repeat;
        }
        
        a.dir {
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAd5JREFUeNqMU79rFUEQ/vbuodFEEkzAImBpkUabFP4ldpaJhZXYm/RiZWsv/hkWFglBUyTIgyAIIfgIRjHv3r39MePM7N3LcbxAFvZ2b2bn22/mm3XMjF+HL3YW7q28YSIw8mBKoBihhhgCsoORot9d3/ywg3YowMXwNde/PzGnk2vn6PitrT+/PGeNaecg4+qNY3D43vy16A5wDDd4Aqg/ngmrjl/GoN0U5V1QquHQG3q+TPDVhVwyBffcmQGJmSVfyZk7R3SngI4JKfwDJ2+05zIg8gbiereTZRHhJ5KCMOwDFLjhoBTn2g0ghagfKeIYJDPFyibJVBtTREwq60SpYvh5++PpwatHsxSm9QRLSQpEVSd7/TYJUb49TX7gztpjjEffnoVw66+Ytovs14Yp7HaKmUXeX9rKUoMoLNW3srqI5fWn8JejrVkK0QcrkFLOgS39yoKUQe292WJ1guUHG8K2o8K00oO1BTvXoW4yasclUTgZYJY9aFNfAThX5CZRmczAV52oAPoupHhWRIUUAOoyUIlYVaAa/VbLbyiZUiyFbjQFNwiZQSGl4IDy9sO5Wrty0QLKhdZPxmgGcDo8ejn+c/6eiK9poz15Kw7Dr/vN/z6W7q++091/AQYA5mZ8GYJ9K0AAAAAASUVORK5CYII= ") left top no-repeat;
        }
        
        a.up {
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAmlJREFUeNpsU0toU0EUPfPysx/tTxuDH9SCWhUDooIbd7oRUUTMouqi2iIoCO6lceHWhegy4EJFinWjrlQUpVm0IIoFpVDEIthm0dpikpf3ZuZ6Z94nrXhhMjM3c8895977BBHB2PznK8WPtDgyWH5q77cPH8PpdXuhpQT4ifR9u5sfJb1bmw6VivahATDrxcRZ2njfoaMv+2j7mLDn93MPiNRMvGbL18L9IpF8h9/TN+EYkMffSiOXJ5+hkD+PdqcLpICWHOHc2CC+LEyA/K+cKQMnlQHJX8wqYG3MAJy88Wa4OLDvEqAEOpJd0LxHIMdHBziowSwVlF8D6QaicK01krw/JynwcKoEwZczewroTvZirlKJs5CqQ5CG8pb57FnJUA0LYCXMX5fibd+p8LWDDemcPZbzQyjvH+Ki1TlIciElA7ghwLKV4kRZstt2sANWRjYTAGzuP2hXZFpJ/GsxgGJ0ox1aoFWsDXyyxqCs26+ydmagFN/rRjymJ1898bzGzmQE0HCZpmk5A0RFIv8Pn0WYPsiu6t/Rsj6PauVTwffTSzGAGZhUG2F06hEc9ibS7OPMNp6ErYFlKavo7MkhmTqCxZ/jwzGA9Hx82H2BZSw1NTN9Gx8ycHkajU/7M+jInsDC7DiaEmo1bNl1AMr9ASFgqVu9MCTIzoGUimXVAnnaN0PdBBDCCYbEtMk6wkpQwIG0sn0PQIUF4GsTwLSIFKNqF6DVrQq+IWVrQDxAYQC/1SsYOI4pOxKZrfifiUSbDUisif7XlpGIPufXd/uvdvZm760M0no1FZcnrzUdjw7au3vu/BVgAFLXeuTxhTXVAAAAAElFTkSuQmCC ") left top no-repeat;
        }
        
        html[dir=rtl] a {
            background-position-x: right;
        }
        
        #parentDirLinkBox {
            margin-bottom: 10px;
            padding-bottom: 10px;
        }
        
        #listingParsingErrorBox {
            border: 1px solid black;
            background: #fae691;
            padding: 10px;
            display: none;
        }
    </style>

    <title id="title">Index of /Users/forece/Desktop/paretonecapital.com/</title>

</head>

<body>

    <div id="listingParsingErrorBox">Oh, no! This server is sending data Google Chrome can't understand. Please <a href="http://code.google.com/p/chromium/issues/entry">report a bug</a>, and include the <a href="LOCATION">raw listing</a>.</div>

    <h1 id="header">Index of /Users/forece/Desktop/paretonecapital.com/</h1>

    <div id="parentDirLinkBox" style="display: block;">
        <a id="parentDirLink" class="icon up" href="/Users/forece/Desktop/paretonecapital.com/..">
            <span id="parentDirText">[parent directory]</span>
        </a>
    </div>

    <table>
        <thead>
            <tr class="header" id="theader">
                <th id="nameColumnHeader" tabindex="0" role="button">Name</th>
                <th id="sizeColumnHeader" class="detailsColumn" tabindex="0" role="button">
                    Size
                </th>
                <th id="dateColumnHeader" class="detailsColumn" tabindex="0" role="button">
                    Date Modified
                </th>
            </tr>
        </thead>
        <tbody id="tbody">
            <tr>
                <td data-value="css/"><a class="icon dir" href="/Users/forece/Desktop/paretonecapital.com/css/">css/</a></td>
                <td class="detailsColumn" data-value="0"></td>
                <td class="detailsColumn" data-value="1617249249">4/1/21, 11:54:09 AM</td>
            </tr>
            <tr>
                <td data-value="js/"><a class="icon dir" href="/Users/forece/Desktop/paretonecapital.com/js/">js/</a></td>
                <td class="detailsColumn" data-value="0"></td>
                <td class="detailsColumn" data-value="1617357135">4/2/21, 5:52:15 PM</td>
            </tr>
            <tr>
                <td data-value=".DS_Store"><a class="icon file" draggable="true" href="/Users/forece/Desktop/paretonecapital.com/.DS_Store">.DS_Store</a></td>
                <td class="detailsColumn" data-value="6148">6.0 kB</td>
                <td class="detailsColumn" data-value="1617357135">4/2/21, 5:52:15 PM</td>
            </tr>
            <tr>
                <td data-value="index.html"><a class="icon file" draggable="true" href="/Users/forece/Desktop/paretonecapital.com/index.html">index.html</a></td>
                <td class="detailsColumn" data-value="4209">4.1 kB</td>
                <td class="detailsColumn" data-value="1617358066">4/2/21, 6:07:46 PM</td>
            </tr>
            <tr>
                <td data-value="test.html"><a class="icon file" draggable="true" href="/Users/forece/Desktop/paretonecapital.com/test.html">test.html</a></td>
                <td class="detailsColumn" data-value="1490">1.5 kB</td>
                <td class="detailsColumn" data-value="1617285834">4/1/21, 10:03:54 PM</td>
            </tr>
        </tbody>
    </table>

</body>

</html>
~~~



js 文件

利用 fs.readdir 可以拿到路径下所有文件夹、文件的数组信息，然后利用 fs.readFile 可以直接读取模板文件，然后利用模板中的特殊标记，然后进行字符串替换。



读取特殊标记，并进行替换

~~~javascript
  fs.readFile('./template.html', function(err, data){
    data = data.toString();
    data = data.replace('^_^','苹果X');  // ^_^ 为模板中特殊标记
  }
~~~



同理，可以直接生成一段代码，然后动态替换模板文件中的信息。

~~~javascript
var fs = require('fs');
var http = require('http');
var server = http.createServer();
server.on('request', function(req, res) {
    var url = req.url;
    var wwwDir = 'C:/www';
    fs.readFile('./template.html', function(err, data) {
        if (err) {
            return res.end('404 NOT FOUND');
        }
        fs.readdir(wwwDir, function(err, files) {
            if (err) {
                return res.end('Cannot find www dir.')
            }
            var content = '';
            files.forEach(function(item) {
                content += `
<tr>
  <td data-value="css/"><a class="icon dir" href="/Users/forece/Desktop/paretonecapital.com/css/">${item}/</a></td>
  <td class="detailsColumn" data-value="0"></td>
  <td class="detailsColumn" data-value="1617249249">4/1/21, 11:54:09 AM</td>
</tr>
`; // 在这里也可以用 `+ item +` 进行字符串拼接，不过 ES6 这个 ${item} 更加简单
            })
            data = data.toString();
            data = data.replace('^_^', content);
            res.end(data);
        })
    })
})
server.listen(8080, function() {
    console.log('服务器启动成功');
})
~~~



## 2. 模板引擎

安装模板引擎，在需要安装的路径下使用 npm 安装模板引擎

~~~javascript
npm install art-template
~~~



### 2.1 浏览器中模板引擎的使用

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <!-- 浏览器中需要引入 lib/template-web.js 文件 -->
    <script src="node_modules/art-template/lib/template-web.js"></script>
  <!-- 这里的 type 主要是不与 text/javascript 重叠，写什么都可以 -->
    <script type="text/template" id="tpl">  
    hello {{ name }}
    </script>
    <script>
        var ret = template('tpl', {
            name: 'Jack'
        })
        console.log(ret)
    </script>
</body>
</html>
~~~



### 2.2 在 Node 中使用模板引擎

~~~javascript
var template = require('art-template')
// template.render('模板字符串', 替换对象)
var ret = template.render('hello {{ name }}', {
  name: 'Jack'
})
console.log(ret)
~~~



### 2.3 使用模板引擎实现目录索引

~~~javascript
var fs = require('fs');
var http = require('http');
var template = require('art-template');
var server = http.createServer();
server.on('request', function(req, res) {
    var url = req.url;
    var wwwDir = 'C:/www';
    fs.readFile('./template.html', function(err, data) {
        if (err) {
            return res.end('404 NOT FOUND');
        }
        fs.readdir(wwwDir, function(err, files) {
            if (err) {
                return res.end('Cannot find www dir.')
            }
						var htmlStr = template.render(data.toString(), {
              title: '仿 Apache 路径'
              files: files
            })
            res.end(htmlStr);
        })
    })
})
server.listen(8080, function() {
    console.log('服务器启动成功');
})
~~~



模板文件

~~~html
<!DOCTYPE html>

<html dir="ltr" lang="en">

<head>
    <meta charset="utf-8">
    <meta name="google" value="notranslate">


    <style>
        h1 {
            border-bottom: 1px solid #c0c0c0;
            margin-bottom: 10px;
            padding-bottom: 10px;
            white-space: nowrap;
        }
        
        table {
            border-collapse: collapse;
        }
        
        th {
            cursor: pointer;
        }
        
        td.detailsColumn {
            -webkit-padding-start: 2em;
            text-align: end;
            white-space: nowrap;
        }
        
        a.icon {
            -webkit-padding-start: 1.5em;
            text-decoration: none;
            user-select: auto;
        }
        
        a.icon:hover {
            text-decoration: underline;
        }
        
        a.file {
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAABnRSTlMAAAAAAABupgeRAAABHUlEQVR42o2RMW7DIBiF3498iHRJD5JKHurL+CRVBp+i2T16tTynF2gO0KSb5ZrBBl4HHDBuK/WXACH4eO9/CAAAbdvijzLGNE1TVZXfZuHg6XCAQESAZXbOKaXO57eiKG6ft9PrKQIkCQqFoIiQFBGlFIB5nvM8t9aOX2Nd18oDzjnPgCDpn/BH4zh2XZdlWVmWiUK4IgCBoFMUz9eP6zRN75cLgEQhcmTQIbl72O0f9865qLAAsURAAgKBJKEtgLXWvyjLuFsThCSstb8rBCaAQhDYWgIZ7myM+TUBjDHrHlZcbMYYk34cN0YSLcgS+wL0fe9TXDMbY33fR2AYBvyQ8L0Gk8MwREBrTfKe4TpTzwhArXWi8HI84h/1DfwI5mhxJamFAAAAAElFTkSuQmCC ") left top no-repeat;
        }
        
        a.dir {
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAd5JREFUeNqMU79rFUEQ/vbuodFEEkzAImBpkUabFP4ldpaJhZXYm/RiZWsv/hkWFglBUyTIgyAIIfgIRjHv3r39MePM7N3LcbxAFvZ2b2bn22/mm3XMjF+HL3YW7q28YSIw8mBKoBihhhgCsoORot9d3/ywg3YowMXwNde/PzGnk2vn6PitrT+/PGeNaecg4+qNY3D43vy16A5wDDd4Aqg/ngmrjl/GoN0U5V1QquHQG3q+TPDVhVwyBffcmQGJmSVfyZk7R3SngI4JKfwDJ2+05zIg8gbiereTZRHhJ5KCMOwDFLjhoBTn2g0ghagfKeIYJDPFyibJVBtTREwq60SpYvh5++PpwatHsxSm9QRLSQpEVSd7/TYJUb49TX7gztpjjEffnoVw66+Ytovs14Yp7HaKmUXeX9rKUoMoLNW3srqI5fWn8JejrVkK0QcrkFLOgS39yoKUQe292WJ1guUHG8K2o8K00oO1BTvXoW4yasclUTgZYJY9aFNfAThX5CZRmczAV52oAPoupHhWRIUUAOoyUIlYVaAa/VbLbyiZUiyFbjQFNwiZQSGl4IDy9sO5Wrty0QLKhdZPxmgGcDo8ejn+c/6eiK9poz15Kw7Dr/vN/z6W7q++091/AQYA5mZ8GYJ9K0AAAAAASUVORK5CYII= ") left top no-repeat;
        }
        
        a.up {
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAmlJREFUeNpsU0toU0EUPfPysx/tTxuDH9SCWhUDooIbd7oRUUTMouqi2iIoCO6lceHWhegy4EJFinWjrlQUpVm0IIoFpVDEIthm0dpikpf3ZuZ6Z94nrXhhMjM3c8895977BBHB2PznK8WPtDgyWH5q77cPH8PpdXuhpQT4ifR9u5sfJb1bmw6VivahATDrxcRZ2njfoaMv+2j7mLDn93MPiNRMvGbL18L9IpF8h9/TN+EYkMffSiOXJ5+hkD+PdqcLpICWHOHc2CC+LEyA/K+cKQMnlQHJX8wqYG3MAJy88Wa4OLDvEqAEOpJd0LxHIMdHBziowSwVlF8D6QaicK01krw/JynwcKoEwZczewroTvZirlKJs5CqQ5CG8pb57FnJUA0LYCXMX5fibd+p8LWDDemcPZbzQyjvH+Ki1TlIciElA7ghwLKV4kRZstt2sANWRjYTAGzuP2hXZFpJ/GsxgGJ0ox1aoFWsDXyyxqCs26+ydmagFN/rRjymJ1898bzGzmQE0HCZpmk5A0RFIv8Pn0WYPsiu6t/Rsj6PauVTwffTSzGAGZhUG2F06hEc9ibS7OPMNp6ErYFlKavo7MkhmTqCxZ/jwzGA9Hx82H2BZSw1NTN9Gx8ycHkajU/7M+jInsDC7DiaEmo1bNl1AMr9ASFgqVu9MCTIzoGUimXVAnnaN0PdBBDCCYbEtMk6wkpQwIG0sn0PQIUF4GsTwLSIFKNqF6DVrQq+IWVrQDxAYQC/1SsYOI4pOxKZrfifiUSbDUisif7XlpGIPufXd/uvdvZm760M0no1FZcnrzUdjw7au3vu/BVgAFLXeuTxhTXVAAAAAElFTkSuQmCC ") left top no-repeat;
        }
        
        html[dir=rtl] a {
            background-position-x: right;
        }
        
        #parentDirLinkBox {
            margin-bottom: 10px;
            padding-bottom: 10px;
        }
        
        #listingParsingErrorBox {
            border: 1px solid black;
            background: #fae691;
            padding: 10px;
            display: none;
        }
    </style>

    <title id="title">{{ title }}</title>

</head>

<body>

    <div id="listingParsingErrorBox">Oh, no! This server is sending data Google Chrome can't understand. Please <a href="http://code.google.com/p/chromium/issues/entry">report a bug</a>, and include the <a href="LOCATION">raw listing</a>.</div>

    <h1 id="header">Index of /Users/forece/Desktop/paretonecapital.com/</h1>

    <div id="parentDirLinkBox" style="display: block;">
        <a id="parentDirLink" class="icon up" href="/Users/forece/Desktop/paretonecapital.com/..">
            <span id="parentDirText">[parent directory]</span>
        </a>
    </div>

    <table>
        <thead>
            <tr class="header" id="theader">
                <th id="nameColumnHeader" tabindex="0" role="button">Name</th>
                <th id="sizeColumnHeader" class="detailsColumn" tabindex="0" role="button">
                    Size
                </th>
                <th id="dateColumnHeader" class="detailsColumn" tabindex="0" role="button">
                    Date Modified
                </th>
            </tr>
        </thead>
        <tbody id="tbody">
          {{ each files}}
            <tr>
                <td data-value="css/"><a class="icon dir" href="/Users/forece/Desktop/paretonecapital.com/css/">{{$values}}/</a></td>
                <td class="detailsColumn" data-value="0"></td>
                <td class="detailsColumn" data-value="1617249249">4/1/21, 11:54:09 AM</td>
            </tr>
          {{ /each }}
        </tbody>
    </table>

</body>

</html>
~~~



## 3. 客户端渲染与服务端渲染

模板引擎可以看做是渲染。客户端渲染是在浏览器中完成的工作，服务端渲染是在服务器上完成主要工作。



### 3.1 **客户端渲染**

~~~html
<html>
  <head>
    <script type="tpl">
    '模板字符串'</script>
    <body>
      <script>
        // 发送请求，拿数据，模板引擎渲染
      $ajax({});</script>
    </body>
  </head>
</html>
~~~



执行步骤

1. 浏览器向服务器发送请求，拿到页面字符串
2. 浏览器解析页面字符串，成为网页
3. 发现 AJAX 请求，再次对服务器发送请求，拿到 Ajax 请求结果
4. 模板引擎渲染



### 3.2 **服务端渲染**

~~~javascript
var htmlStr = `
<html>
  <head></head>
	<body>
  	<h1> hello {{ name }} </h1>
  </body>
</html>`

var template = template.render(htmlStr, {解析替换对象})
res.end(template)
~~~



执行步骤：

1. 客户端发送请求到服务端
2. 服务端读取 index.html
3. 模板引擎渲染 index.html
4. 发送到客户端



### 3.3 客户端渲染与服务端渲染区别

对于用户来说，服务端渲染更快，但是会对服务端造成压力



在源代码中可以查看到的内容就是服务端渲染，例如商品列表。像 Ajax 这样动态读取数据，无法在源代码中显示的则是客户端渲染，例如评论。另外 Ajax 这样的客户端渲染不利于 SEO，因为不能在源代码中显示，所以爬虫也无法抓取到内容。



一般网站都是综合利用服务端渲染技术和客户端渲染技术。





# 七、留言板项目

## 1. 目录结构

Feedback

- views
  - Index.html
  - post.html
- app.js
- public
  - img
  - css
  - js
  - lib
    - bootstrap



文件信息：images/node/feedback/



## 2. 编写路由

创建服务器 http 模块的简写方式：

~~~javascript
var http = require('http')
http.createServer(function(req, res){
    res.end('hello')
}).listen(3000, function(){
    console.log('Server is Running...')
})

~~~



编写路由：

~~~javascript
var fs = require('fs')
var http = require('http')
http.createServer(function(req, res){
    var url = req.url
    if (url === '/'){
        fs.readFile('./views/index.html', function(err,data){
            if (err){
                res.end('404 NOT FOUND')
            }
            res.end(data)
        })
    }
}).listen(3000, function(){
    console.log('Server is Running...')
})

~~~



## 3. 处理静态资源

通过简单的路由，客户端访问 / 的时候，服务端会读取 views/index.html 内容，然后响应给客户端，浏览器通过解析 html 字符串得到页面。但是在这里浏览器会卡住，这是因为浏览器在解析 html 代码的时候，会遇到一些静态资源，这些资源包括：

- css
- js
- img
- ......

这类需要浏览器引入的静态资源同样需要有路由配置才可以正常访问，否则服务器不会给出任何响应。



解决方法是通过创建一个 public 文件夹，然后将所有的静态资源放在 public 文件夹中，我们通过配置路由将 public 文件夹开放给用户，如：

~~~javascript
else if (url.indexOf('/public/') === 0 ) {
        fs.readfile('.' + url, function(err, data){
            if (err){
                res.end('404 NOT FOUND')
            }
            res.end(data)
        })
    }
~~~



当开放 public 文件夹后，资源引用路径就不能用相对路径了，需要使用 /public/main.js 这样的路径进行发送请求，因为我们的路由规则是读取的文件内容，并不是文件地址，所以如果还使用相对路径的话。服务器没有对这些路径进行解析，依然无法得到相应



## 4. 加入 404 页面的解析

~~~javascript
else {
  fs.readfile('./views/404.html', function(err, data) {
    if (err) {
      res.end('404 NOT FOUND')
    }
    res.end(data)
  })
}
~~~



## 5. 处理 POST 页面路由

~~~javascript
else if (url === '/post') {
  fs.readfile('./views/post.html', function(err, data) {
    if (err) {
      res.end('404 NOT FOUND')
    }
    res.end(data)
  })
~~~



## 6. 匹配页面链接

- 将主页链接换为 `/`  
- 将 post 页面链接换为 `/post`
- 将静态资源链接换为 `/public/xxx` ，如：`/public/lib/bootstrap/css/bootstrap.css` 



## 7. 创建模板引擎

html 标记

~~~html
<li class="list-group-item">{{ $value.name }} 说：{{ $value.message }} <span class="pull-right"> {{ $value.dateTime }} </span></li>
~~~



加载模板引擎模块

~~~javascript
var template = require('art-template')
~~~



渲染数据

~~~javascript
var comments = [{
        name: '张三1',
        message: '你好',
        dateTime: '2021-04-05'
    },
    {
        name: '张三2',
        message: '你好',
        dateTime: '2021-04-05'
    },
    {
        name: '张三3',
        message: '你好',
        dateTime: '2021-04-05'
    }
]
~~~



服务端渲染

~~~javascript
htmlStr = template.render(data.toString(),{
  comments: comments
})
res.end(htmlStr)
~~~



## 8. Get 提交数据

在 form 表单中创建一个 url 用来处理提交数据

~~~html
<form action="/comment-action" method=GET>
~~~



提交表单的 URL 为： `http://127.0.0.1/comment-action?name=张三&message=ABCDEFG`



引入 url 模块，使用 parse 方法解析 GET 提交过来的数据，url.parse() 的使用方法：

~~~javascript
var url = require('url')
obj = url.parse('/comment-action?name=张三&message=ABCDEFG', true)
~~~

> 在命令行模式中进入 node 可以直接使用 url.parse() 进行测试，而不用 require 核心模块，进行快速测试。



在js文件中替换 url

~~~javascript
var parseObj = url.parse(req.url, true)  // 先拿到解析的数据
var pathName = parseObj.pathname  // 将所有url替换为 pathName
~~~



将 GET 数据响应给客户端，并实现跳转

~~~javascript
else if (pathName === '/pinglun'){
        var comment = parseObj.query
        comment.dateTime = '2020-05-01 11:11:22'
  			comments.unshift(comment)  // 在数组头部添加数据
        // comments.push(comment)  // 在数组尾部添加数据
        res.statusCode = 302
        res.setHeader('location', '/')
        res.end()
    }
~~~



## 9. 获取当前时间

~~~javascript
function get_dateTime() {
    var d = new Date(),
        str = '';
    str += d.getFullYear() + '年'; //获取当前年份 
    str += d.getMonth() + 1 + '月'; //获取当前月份（0——11） 
    str += d.getDate() + '日';
    str += d.getHours() + '时';
    str += d.getMinutes() + '分';
    str += d.getSeconds() + '秒';
    return str;
}

comment.dateTime = get_dateTime()
~~~



## 10. 完整代码

~~~
index.html 
post.html
404.html
app.js
~~~



# 八、Node 模块系统

使用 Node 编写应用程序主要就是使用：

- ECMAScript
- 核心模块
- 第三方模块（需要通过 npm 下载）
- 自定义模块（自己编写的模块）



## 1. 模块化

模块化的有以下几个特点：

- 文件作用域
- 通信规则
  - 导入
  - 导出



## 2. Common JS 模块规范

Node 中 js 的模块系统

- 模块作用域
- 使用 `require` 加载模块
- 使用 `exports` 导出模块中的接口对象



### 2.1 模块作用域

Node 中是模块作用域，默认文件中所有成员只在当前模块中有效。



### 2.2 导出 exports 接口对象

对于希望被其他模块访问的成员，需要把这些公开的成员挂载到 exports 接口对象中



如果一个模块需要导出变量或者函数：

~~~javascript
var foo = 'hello'
var fn = function add(x,y){
  return x+y
}

exports.foo = foo
exports.add = fn

// 或直接使用 exports 添加成员
exports.num = 16
exports.arr = [8,2,33,32]
exports.obj = {
  foo: 'bar'
}
~~~



如果一个模块不需要导出整个 exports 对象，只需要导出文件中的一个函数或变量，不能写成：

~~~javascript
function add(x,y){
  return x+y
}
exports.add = add
// 或 exports = add
~~~



应该写成

~~~javascript
module.exports = add
~~~



这样的话，在 main.js 这个调用 js 文件当中，就可以直接使用

~~~javascript
var add = require('./b'){
  console.log(add(10, 20))
}
~~~



原理：

可以看做每个模块内部都有一个自己的 module 对象，module 对象中有一个成员叫做 exports 对象（默认为空），如：

~~~javascript
var module = {
  exports: {}
}
~~~



默认在代码最后有一句：

~~~javascript
return module.exports
~~~

> 最后 return 的是 module 下的 exports 对象



如果需要对外导出成员，只需要把导出的成员挂载到 module.exports 中：

~~~javascript
module.exports.foo = 'bar'
~~~



只不过 Node 为了简化书写，提供了一个变量 exports，这个 exports 引用了 module.exports 的地址，可以看做：

~~~javascript
exports = module.exports
~~~



所以当一个模块需要导出单个成员时，直接给 exports 赋值时就会丢失引用：

~~~javascript
exports = 'hello'
~~~

> exports 被重新赋值，丢失了 module.exports 的引用，而最后返回的是 module.exports，所以 exports 不起作用了。



例1：

~~~javascript
// 相当于对 module.exports 加入属性
exports.a = 123

// 对 module.exports 的引用丢失，这时 exports 是一个新的对象，和 module.exports 没有任何关系
exports = {}
exports.foo = 'bar'

// 最后导出的只是 module.exports.a 这个成员
~~~

> 在 exports 指向新对象之后，之前对 module.exports 定义的成员不会消失



例2：

~~~javascript
obj = {foo: hello}
obj1 = obj
obj1 = {}
obj1.foo = 'bar'
obj.foo = ?  
~~~

> 最后 obj.foo 还是等于 hello，因为 obj1 已经指向了新的对象，它和 obj 的引用关系已经中断。对 obj1.foo 赋值的操作和 obj 没有任何关系



例3：

~~~javascript
module.exports = 'hello'
exports.foo = 123
~~~

最后输出的只是 hello



- 运行代码之前，exports = module.exports
- 第一行代码，module.exports 指向了新的引用
- 第二行代码，exports.foo 还是指向原来的引用对象，并添加了成员 foo
- 最后输出的是 module.exports



例4：

~~~javascript
module.exports = 'hello'
exports.foo = 123
module.exports = {
  foo: 'bar'
}
exports = module.exports
exports.foo = 'hello'
~~~

> 最后导出的结果是 { foo: 'hello' }



- 第三行代码又让 module.exports 指向了新的引用
- 让 exports 与 module.exports 重新建立联系
- 这时候再次操作 exports 实际上就是操作 module.exports



例5：

~~~javascript
exports.foo = 'bar'
module.exports.a = 123
exports = {a: 456}
module.exports.foo = 'haha'
exports.c = 456
exports = module.exports
exports.a = 789
~~~

> 最后导出 [{foo: 'haha'}, {a: 789}]



如果再加一个段：

~~~javascript
module.exports = function() {
  console.log('hello')
}
~~~

> 最后只会输出这个 function，因为不管前边写了什么，最后 module.exports 又指向了最终的对象



最后，也可以使用 module.exports 导出多个成员，如：

~~~javascript
module.exports = {
  a: 'hello'
  b: function(x+y){
    return x+y
  }
}
~~~



### 2.3 require 加载模块

~~~javascript
var 自定义变量 = require('模块名')
~~~



作用：

- 执行被加载模块代码
- 得到加载模块中被导出的 exports 接口对象



require 可以加载：

- 核心模块
  - 模块名
- 第三方模块
  - 模块名
- 自己写的模块
  - 路径+模块文件名（可以省略扩展名）

> 加载自己写的模块需要写路径，路径可以使用绝对路径和相对路径，但是为了兼容性，一般不用绝对路径。



require 模块的加载顺序

- 优先从缓存加载
- 判断模块标识符
- 第三方模块的加载



#### 优先从缓存加载

main.js

~~~javascript
require('./a')
require('./b')  // 不会重复执行，也就是说不会再次执行 console.log('b.js') 这段代码，因为在 a.js 中已经执行过一次了，但是可以调用 b.js 中的 exports 接口对象。
~~~



a.js

~~~javascript
console.log('a.js被加载了')
require('./b')
~~~



b.js

~~~javascript
console.log('b.js')
~~~



这个是 Node 的设计模式，目的是为了避免重复加载，提升模块的加载效率



#### 判断模块标识

~~~javasc
require('fs')  // 这里的 fs 就是模块标识符
~~~



- 非路径模块标识符
  - 核心模块
  - 第三方模块
- 路径模块标识符
  - 自定义模块



##### 加载核心模块

核心模块被编译集成在 node 中，不已代码的形式存在，但是本质上还是代码，可以去 node 的官方 github 上查看相关代码。当检测到非路径标识符的时候，如果是核心模块，会在内部找到相关文件进行加载。



##### 加载第三方模块

不可能有任何一个第三方包与核心模块包名一样，第三方模块的搜索顺序，以 art-template为例：

- 先找当前目录下的 node_modules
- 然后找到 node_modules\art-template
- 找文件夹中的 package.json 文件
- 在 json 文件中找 main 属性
- 找 main 属性对应的入口文件
  - 如： index.js
- 加载入口文件



第三方包的文件结构：

~~~
node_modules
						- package.json  // json 文件中有个main属性，如： main: 'index.js'
						- index.js
~~~



如果有以下情况：

- 没有 package.json
-  json 文件中没有 main 属性
- main 属性配置错误

加载第三方包的时候会默认寻找 index.js



如果以上条件都不成立，会进入上一级目录的 node_modules 中进行查找，如果还找不到则再去上一级的 node_modules 直到根目录。



一个项目有且只有一个 node_modules，放在项目的根目录，不论 js 文件放在哪个文件夹中，在需要调用第三方模块的时候，都会自动按照规则寻找到项目目录中 node_modules 中的第三方包。



##### 加载自定义模块

当模块标识符为路径模块标识符的时候，按照路径直接找到指定 js 文件



## 九、npm

npm 全称 node package manager，也就是 node 包管理器。npm 是一个命令行工具，只要安装了 node 就已经安装了 npm。



查看 npm 版本：

~~~javascript
npm --version
~~~



升级 npm

~~~shell
npm install --global npm
~~~



## 1. npm install

使用 npm install 会在当前目录中创建 node_modules，所有的包以及依赖包都会安装在当前文件夹中。



安装指定包

~~~javascript
npm install jquery
~~~



安装指定版本

~~~javascript
npm install jquery@1.11.0
~~~



安装多个包

~~~javascript
npm install jquery art-template bootstrap
~~~



安装包同时创建 package.json 描述文件

~~~shell
npm install jquery --save
~~~

- 会在当前目录创建 package.json 文件，显示当前项目的依赖关系
- node_modules 中会有很多其他包文件夹，这些事安装包的依赖关系，package.json 只显示项目依赖包名，而不会显示所有依赖



package-lock.json

- npm 5 以后的版本不需要加入 --save 参数，会自动保存依赖信息
- npm 5 以后加入这个新文件，安装包的时候会生成或更新这个文件
- package-lock.json 保存所有 node_modules 里边所有的包信息（版本、下载地址），而 package.json 只保留当前项目
  - 重新下载包会更快，否则还需要重新判断包的依赖关系
- lock 为了锁定版本，防止重新安装包文件会自动升级到最新版本





缩写：

~~~javascript
npm -i
npm -i -S
~~~





## 2. npm init

使用 npm init 会直接创建项目的 package.json 说明文件

~~~javascript
name
version
description
entry point
test command
git respository
keywords
author
license
~~~

> 之后会自动生成项目的说明文件，如果使用 npm install --save 安装包后，还会在这个说明文件中自动添加 dependencies 依赖关系



建议每个项目都有 package.json 文件，如果 node_modules 文件夹被误删，只要 package.json 文件还在，使用 npm install 可以根据里边的依赖关系说明文件直接安装所需要的包。



~~~shell
npm init -y
~~~

> 可以使用 -y 模式快速生成 package.json 文件



## 3. npm uninstall

删除包，保留依赖

~~~shell
npm uninstall 包名
~~~



删除包的同时也删除依赖

~~~shell
npm uninstall --save 包名
~~~



缩写：

~~~shell
npm un
npm un -S
~~~



## 4. npm help

npm help 可以查看 npm 的使用帮助

~~~shell
npm help
~~~



查看指定命令的说明文件

~~~shell
npm install --help
~~~



## 5. 国内源

因为某种关系，国内可能无法直接下载 npmjs.com 上边的包，或者速度很慢，淘宝创建了一个国内源 cnpm，安装 cnpm 可以直接从国内源下载包文件。

~~~shell
npm install --global cnpm
~~~



之后安装包可以直接使用 cnpm 安装包，如：

~~~shell
cnpm install jquery
~~~



如果不想安装 cnpm，可以使用 --registry 参数临时更改 npm 的源

~~~shell
npm install jquery --registry=https://registry.npm.taobao.org
~~~



或者永久性更改 npm 的源

~~~shell
npm config set registry https://registry.npm.taobao.org
~~~

> 之后默认使用 npm 下载淘宝源的包文件



查看 npm 配置文件

~~~shell
npm config list
~~~





# 十、nodemon

nodemon 是一个基于 node.js 开发的第三方命令行工具，使用 nodemon 可以帮助我们频繁修改代码重启服务器的问题。



安装nodemon

~~~shell
npm install --global nodemon
~~~



使用 nodemon 启动脚本

~~~shell
// 原来使用 node xx.js 运行脚本
// 现在用 nodemon 替换 node
nodemon main.js
~~~

> nodemon 会监视运行脚本的变化，当脚本被修改后，nodemon 会自动重启再次运行脚本



# 十一、Express 模块

原生的 http 在某些方面表现不足以应对我们的开发需求，所以我们需要使用框架加快我们的开发效率。框架的目的就是提高效率，让我们的代码高效统一。



Node 中有很多 Web 开发框架，Express 是最常见的一种，作者是 TJ



## 1. 安装 Express 模块

~~~shell
npm install --save express
~~~



## 2. Hello World

项目 main.js

~~~javascript
// 引包
var express = require('express')

// 创建服务器应用，也就是原生的 http.createServer
var app = express()

// 当服务器收到 get 请求，执行回调函数
app.get('/', function(req,res){
  console.log('hello world')
  // 可以使用原生 http 方法，如： res.end()
  res.end('hello world')
  // Express 推荐使用 res.send() 自动转码
  res.send('中文无障碍')
  // 可以直接使用 res.query 拿到 get 参数
  console.log(res.query)
})

// 开放 public 静态资源
app.use('/public/', express.static('./public/'))

// 监听 3000 端口
app.listen(3000,function(){
  console.log('Server is running')
})
~~~



Express 与原生 http 的区别

- 不用依次判断路径
- 找不到的 url 会自动在响应信息中给浏览器输出错误信息



## 3. API

### 3.1 开放静态资源

针对某个 url 路径开放资源

~~~javascript
app.use('/public/', express.static('./public'))
~~~



当然路由也可以不是 public，可以是 /a/

~~~javascript
app.use('/a/', express.static('./public'))
~~~

> 这时候就需要访问 domain.com:3000/a/main.js 来访问 public/main.js 文件了



如果不加第一个参数，则以 / 来调用 public 文件夹中的文件，如：

~~~javascript
app.use(express.static('./public'))
~~~



### 3.2. 重定向

~~~javascript
res.redirect('/')
~~~



### 3.3. 返回文件

~~~javascript
res.sendFile('./views/index.html')
~~~



### 3.4. GET

~~~javascript
res.get('/post', function(req,res){
  console.log('get')
})
~~~



获取 GET 请求参数

~~~javascript
res.query
~~~



### 3.5. POST

~~~javascript
rest.post('/post', function(req,res){
  console.log('post')
})
~~~

> 可以利用不同的请求方法让一个请求路径使用多次



获取 POST 请求参数

需要安装第三方包，body-parser

~~~shell
npm install --save body-parser
~~~



使用方式：

~~~javascript
var express = require('express')
// 引包
var bodyParser = require('body-parser')
var app = express()

// 配置
// 配置完毕后，在 res 属性上会多出来一个属性: body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(function(req,res){
  // res.setHeader('Content-Type', 'text/plain')
  // 通过 req.body 获取 body 数据
  console.log(req.body)
  // res.end(JSON.stringify(res.body, null, 2))
})
~~~



### 3.6. 发送响应

~~~javasript
res.send('hello world')
~~~

> 不用 res.end() 关闭，send 会自动关闭



## 4. 在 Express 中使用模板引擎

### 4.1 安装 art-template

~~~shell
npm install --save art-template
npm install --save express-art-template
~~~



### 4.2 配置

~~~javascript
app.engine('art', require('express-art-template'))
~~~

- 参数1：当渲染以 .art 结尾的文件时，使用 art-tempalte 模板引擎，不能写路径，默认去项目中 views 中查找模板文件
- 参数2：使用 express-art-template 包（依赖 art-template 包）

> 这里也可以把后缀改为 html，更方便一些



如果想修改默认 views 目录，可以使用：

~~~javascript
app.set('views', '想要指定的render函数的路径')
~~~





### 4.3 使用

express 为 response 提供了一个方法 render，只有在使用模板引擎的时候才可以使用

~~~javascript
app.get('/', function(req,res){
  res.render('模板名', {模板数据})
})
~~~



例：

~~~javascript
app.get('/admin', function(req,res){
  res.render('admin/index.art', {
    title: '管理系统'
  })
})
~~~





## 3. 利用 Express 更改之前的留言板项目

~~~
feedback-final-express
~~~



~~~javascript
var fs = require('fs')
var express = require('express')
var template = require('express-art-template')


var comments = [{
        name: '张三1',
        message: '你好',
        dateTime: '2021-04-05'
    },
    {
        name: '张三2',
        message: '你好',
        dateTime: '2021-04-05'
    },
    {
        name: '张三3',
        message: '你好',
        dateTime: '2021-04-05'
    }
]

function get_dateTime() {
    var d = new Date(),
        str = '';
    str += d.getFullYear() + '年'; //获取当前年份 
    str += d.getMonth() + 1 + '月'; //获取当前月份（0——11） 
    str += d.getDate() + '日';
    str += d.getHours() + '时';
    str += d.getMinutes() + '分';
    str += d.getSeconds() + '秒';
    return str;
}

var app = express()

app.engine('html', require('express-art-template'))
app.get('/public/', express.static('./public/'))

app.get('/', function(req, res) {
    res.render('index.html', {
        comments: comments
    })
})

app.get('/post', function(req, res) {
    res.render('post.html')
})

app.get('/pinglun', function(req, res) {
    var comment = res.query
    comment.dateTime = get_dateTime()
    comments.unshift(comment) // 在数组头部添加数据
        // comments.push(comment)  // 在数组尾部添加数据
    res.redirect('/')
})

app.listen(3000, function() {
    console.log('Server is Running...')
})
~~~



# 十二、CRUD 学生管理系统

## 1. 项目初始化

### 1.1. 项目初始化

~~~shell
npm init -y
~~~



### 1.2. 文件结构

~~~
crud
| ---- |
|			 views
|			 |		index.html
|			 |		
|			 |
|			 |
|			 |
|			 |
|			 |
|			 |
|			 app.js

~~~



### 1.2. 安装包

~~~shell
npm install --save express
npm install --save art-template express-art-template
npm install --save bootstrap@3.3.7
npm install --save body-parser
~~~



### 1.3 app.js 创建服务器

~~~javascript
var fs = require('fs')
var express = require('express')
var template = require('express-art-template')

var app = express()

app.get('/', function(req, res){
  res.send('hello world')
})

app.listen(3000,function(){
  console.log('Server is running...')
})
~~~



### 1.4 渲染页面

~~~javascript
var fs = require('fs')
var express = require('express')
var template = require('express-art-template')

var app = express()

app.engine('html', require('express-art-template'))
app.get('/', function(req, res){
  res.render('index.html')
})

app.listen(3000,function(){
  console.log('Server is running...')
})
~~~



### 1.5 开放静态资源

~~~javascript
app.use('/public/', express.stastic('./public/'))
app.use('/node_modules/', express.static('./node_modules/'))
~~~



替换 views 中所有 html 中的静态资源路径

~~~html
<link href="/node_modules/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="/public/css/dashboard.css" rel="stylesheet">
~~~



### 1.6. 对模板做简单修改

添加按钮

~~~html
<a class="btn btn-success" href="/post">添加学生</a>
~~~



## 2. 读取文件中数据

创建 db.json 文件

~~~json
{
    "students": [
        { "id": 1, "name": "张三", "gender": 0, "age": 18, "hobbies": "吃饭、睡觉、打豆豆、lol" },
        { "id": 2, "name": "张三", "gender": 0, "age": 18, "hobbies": "吃饭、睡觉、打豆豆、lol" },
        { "id": 3, "name": "张三", "gender": 0, "age": 18, "hobbies": "吃饭、睡觉、打豆豆、lol" },
        { "id": 4, "name": "张三", "gender": 0, "age": 18, "hobbies": "吃饭、睡觉、打豆豆、lol" },
        { "id": 5, "name": "张三", "gender": 0, "age": 18, "hobbies": "吃饭、睡觉、打豆豆、lol" },
        { "id": 6, "name": "张三", "gender": 0, "age": 18, "hobbies": "吃饭、睡觉、打豆豆、lol" },
        { "id": 7, "name": "张三", "gender": 0, "age": 18, "hobbies": "吃饭、睡觉、打豆豆、lol" }
    ]
}
~~~



修改文件模板：

~~~html
<table class="table table-striped">
  <thead>
    <tr>
      <th>#</th>
      <th>姓名</th>
      <th>性别</th>
      <th>年龄</th>
      <th>爱好</th>
    </tr>
  </thead>
  <tbody>
    {{ each students}}
    <tr>
      <td> {{$value.id}} </td>
      <td> {{$value.name}} </td>
      <td> {{$value.gender}} </td>
      <td> {{$value.age}} </td>
      <td> {{$value.hobbies}} </td>
    </tr>
    {{ /each }}
  </tbody>
</table>
~~~



app.js 文件

~~~javascript
app.get('/', function(req, res) {
  // 以UTF8编码方式读取文件，返回字符串（而不是默认的二进制）
    fs.readFile('./db.json', 'utf8', function(err, data) {
      // 如果错误，给出500错误
        if (err) {
            return res.status(500).send('Server Error.')
        }
      // 渲染 index.html 文件，并且将字符串转成JSON格式，调用里边的 students 属性
        res.render('index.html', {
            students: JSON.parse(data).students
        })
    })
})
~~~



## 3. 路由设计

如果需要处理的页面太多，可以将路由部分分离出来，单独列出一个文件，形成模块化如：

| 请求方法 | 请求路径         | get 参数 | post 参数                      | 说明         |
| -------- | ---------------- | -------- | ------------------------------ | ------------ |
| GET      | /students        |          |                                | 渲染首页     |
| GET      | /students/new    |          |                                | 渲染添加页面 |
| POST     | /students/new    |          | name, gender, age, hobbies     | 处理添加请求 |
| GET      | /students/edit   | id       |                                | 渲染编辑页面 |
| POST     | /students/edit   |          | id, name, gender, age, hobbies | 处理编辑请求 |
| GET      | /students/delete | id       |                                | 处理删除请求 |



路由模块职责：

- 处理路由
- 根据不同请求方法、路径设置具体处理函数



### 3.1 自己封装路由分离

router.js

~~~javascript
// 页面中需要 fs 核心模块，将这句从 app.js 移动过来
var fs = require('fs')

module.exports = function(app) {
    app.get('/student', function(req, res) {

        fs.readFile('./db.json', 'utf8', function(err, data) {
            if (err) {
                return res.status(500).send('Server Error.')
            }
            res.render('index.html', {
                students: JSON.parse(data).students
            })
        })

    })

    app.get('/student/new', function(req, res) {})

    app.post('/student/new', function(req, res) {})

    app.get('/student/edit', function(req, res) {})

    app.post('/student/edit', function(req, res) {})

    app.get('/student/delete', function(req, res) {})
}
~~~



app.js 调用路由🔥（加强理解）

~~~javascript
var router = require('./router')

// 将服务器实例 app 传入 router.js 文件导出的函数就相当于调用了 router.js 文件
router(app)
~~~



### 3.2 Express 路由分离方法

router.js

~~~javascript
var fs = require('fs')
var express = require('express')

// 创建路由对象
var router = express.Router()

router.get('/student', function(req, res) {

    fs.readFile('./db.json', 'utf8', function(err, data) {
        if (err) {
            return res.status(500).send('Server Error.')
        }
        res.render('index.html', {
            students: JSON.parse(data).students
        })
    })

})

router.get('/student/new', function(req, res) {})

router.post('/student/new', function(req, res) {})

router.get('/student/edit', function(req, res) {})

router.post('/student/edit', function(req, res) {})

router.get('/student/delete', function(req, res) {})

// 导出路由对象
module.exports = router
~~~



app.js

~~~javascript
var router = require('./router')
// 把路由容器挂载到 app 中
app.use(router)
~~~



### 3.3 app.js 入口文件职能

- 创建服务
- 模块相关配置
  - 模板引擎
  - body-parser 解析 post 表单请求
  - 提供静态资源服务
- 挂载路由
- 监听端口



## 4. 处理 POST 数据

new.html

~~~html
<form action="/student/new" method="POST">
~~~



app.js 

引入 body-parser 并且进行配置

~~~javascript
var fs = require('fs')
//引入
var bodyParser = require('body-parser')
var express = require('express')
var template = require('express-art-template')
var router = require('./router')

var app = express()
app.engine('html', require('express-art-template'))

app.use('/public/', express.static('./public/'))
app.use('/node_modules/', express.static('./node_modules/'))
//配置
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(router)


app.listen(3000, function() {
    console.log('server is running')
})
~~~



router.js

~~~javascript
// 渲染添加页面
router.get('/student/new', function(req, res) {
    res.render('new.html')
})

// 对 POST 数据进行处理
router.post('/student/new', function(req, res) {
    fs.readFile('./db.json', 'utf8', function(err, data) {
        if (err) {
            return res.status(500).send('Server Error.')
        }
        var students = JSON.parse(data)
        students.students.push(req.body)
        fs.writeFile('./db.json', JSON.stringify(students), function() {

        })
        res.redirect('/student')
    })
})
~~~



## 5. 封装读取文件函数

可以看到，在GET 和 POST 请求当中我们需要多次对 db.json 文件进行操作，为了避免代码重复，我们创建 students.js 针对数据进行处理：

- 获取学生列表
- 添加学生
- 更新学生
- 删除学生



### 5.1. 异步获取函数内部返回值

异步执行

~~~javascript
console.log(1)

setTimeout(function(){
  console.log(2)},1000)

console.log(3)
~~~

> 输出 1、3、2，程序不会等待 setTimeout 函数执行完再往下继续执行。



~~~javascript
function add(x,y){
  console.log(1)
  setTimeout(function(){
    console.log(2)
    var ret = x + y
    return ret
  }, 1000)
  console.log(3)
}

console.log(add(10, 20))
~~~

> 不会拿到 return 的 ret，因为异步机制，程序都执行完1秒后才会执行 setTimeout 函数。所以整个函数瞬间执行完毕，1秒后才能拿到返回值，但是函数已经执行完毕，return 的值无人能接。



当一个函数想要调用一个异步函数内部变量的时候，诸如：

- fs.readFile
- fs.writeFile
- setTimeout
- ajax
- .....

> 往往异步API都都一个回调函数



需要使用回调函数

~~~javascript
function fn(callback){
  setTimeout(function(){
    var data = 'hello'  
    callback(data)
  }, 1000)
}

fn(function(data)){
   console.log(data)
   }
~~~



1. 将这个函数传入一个回调函数当做参数
2. 当调用 fn 函数，function(data) 这个函数以参数的形式传入 fn(callback)
3. 延迟1秒后执行 fn(callback) 内部函数
4. 内部函数定义了一个变量 data
5. 在函数内部调用参数 callback(data)，实际上就是执行 function('hello')
6. 显示 hello



~~~javascript
function add(x, y, callback){
  // var x = 10
  // var y = 20
  // var callback = function(ret){ console.log(ret) }
  setTimeout(function(){
      var ret = x + y
  		return callback(ret)  // 将ret结果当做参数传给回调函数 callback，将结果 return 给异步函数 setTimeout
  })
}

// 传一个函数过去，这个函数的功能就是显示 ret
// 其实这里传的参数就是我们想要拿到的 return 结果
add(10,20, function(ret){
  // 函数内部就可以直接使用异步函数中的变量
  console.log(ret)
})

~~~



- 使用回调函数目的就是为了拿到返回值，如果在异步函数中只用 return 的话，程序会不等异步函数执行就往下走了。造成函数已经执行但是没有拿到 return 的结果。

- 如果使用 callback，不论异步函数什么时候执行，都会去调用 callback 函数，所以一直都可以拿到 return 结果。



### 5.2. 封装查看学生函数🔥

students.js

~~~javascript
exports.find = function(callback) {
    fs.readFile(dbPath, 'utf8', function(err, data) {
        // 这时候 err 和 data 实际上已经拿到实参了
        if (err) {
            // 调用 callback 函数，实际上调用的就是 find() 穿过来的参数，也就是 function(err, data)
            // 这里我们只需要 err，所以只传一个参数，就可以了
            return callback(err)
        }
        // 这里我们需要拿到 data 数据，所以让 err = null，第二个参数传入转为 JSON 格式的 data
        callback(null, JSON.parse(data).students)
    })
}
~~~



app.js

调用封装的方法

~~~javascript
// 引入模块，注意大写
var Students = require('./students')

router.get('/students', function(req, res) {
  // 当我们需要调用 find 方法，想拿到 err 和 data，在 app.js 中调用封装的函数
    Students.find(function(err, data) {
      // 这里的 err 和 data 实际上已经是 fs.readFile 中的 err 和 data 了
        if (err) {
            return res.status(500).send('Server Internal Error')
        }
        res.render('index.html', {
            students: data
        })
    })
})
~~~



### 5.3 添加学生

students.js

~~~javascript
exports.save = function(student, callback) {
    fs.readFile(dbPath, 'utf8', function(err, data) {
        if (err) {
            return callback(err)
        }
        // 拿到 json 文件中 students 对应的数组
        var students = JSON.parse(data).students
            // 给新建的学生添加 id 
        student.id = students[students.length - 1].id + 1
            // 将新成员添加到 JSON 对象
        students.push(student)
            // JSON 对象处理完毕，将 JSON 对象写入 db.json 文件
            // 首先将 JSON 对象转成字符串，不能忘了前边还有个 students
        fileData = JSON.stringify({
            students: students
        })
        fs.writeFile(dbPath, fileData, function(err) {
            if (err) {
                return callback(err)
            }
            // 成功返回空
            callback(null)
        })
    })
}
~~~



router.js

~~~javascript
router.post('/students/new', function(req, res) {
    Students.save(req.body, function(err) {
        if (err) {
            return res.status(500).send('Server Internal Error')
        }
        res.redirect('/students')
    })
})
~~~



### 5.3 更新学生

首先要想要传什么参数进去

~~~javascript
router.post('/students/edit', function(req, res) {
  
  // 需要传入一个类似这样的学生的对象
    Students.updateById(
        {
            id:1,
            name:xxx,
            gender:xxx,
            age: xx,
            hobbies: xx
	// 再来就是需要判断是否出错
    }, function(err){
        if (err){
            return res.status(500).send('Server Internal Error')
        }
        res.redirect('/students')
    })
})
~~~



创建 edit.html，页面类似 new.html 

- 提交地址
- id 属性
- value 显示学生信息

~~~html
<form action="/students/edit" method="POST">
  <input type="hidden" name="id" value="{{ student.id }}">
  <div class="form-group">
    <label for="">姓名</label>
    <input type="text" class="form-control" id="" name="name" placeholder="姓名" value="{{ student.name }}">
  </div>
~~~



GET 方法查看指定id学生信息

router.js

~~~javascript
router.get('/students/edit', function(req, res) {
    Students.findById(parseInt(req.query.id), function(err, student) {
        if (err) {
            return res.status(500).send('Server Internal Error')
        }
        res.render('edit.html', {
            student: student
        })
    })

})
~~~



students.js

~~~javascript
exports.findById = function(id, callback) {
    fs.readFile(dbPath, 'utf8', function(err, data) {
        if (err) {
            return callback(err)
        }

        var students = JSON.parse(data).students
        var ret = students.find(function(item) {
            return item.id === parseInt(id)
        })
        callback(null, ret)
    })
}
~~~



POST 方法修改学生信息

router.js

~~~javascript
router.post('/students/edit', function(req, res) {
    Students.updateById(req.body, function(err) {
        if (err) {
            return res.status(500).send('Server Internal Error')
        }
        res.redirect('/students')
    })
})
~~~



students.js

~~~javascript
exports.updateById = function(student, callback) {
    fs.readFile(dbPath, 'utf8', function(err, data) {
        if (err) {
            return callback(err)
        }
        var students = JSON.parse(data).students
        student.id = parseInt(student.id)
            // ES6 新方法（当某个遍历项符合条件时，终止遍历，返回这个遍历项）
        var stu = students.find(function(item) {
                return item.id === student.id
            })
            // 遍历这个对象属性，将POST传过来的新对象属性覆盖到读出来的对象中
        for (var key in student) {
            stu[key] = student[key]
        }
        // 将数组转为 students: [{}, {}, ...] JSON 字符串格式
        var fileData = JSON.stringify({
            students: students
        })
        fs.writeFile(dbPath, fileData, function(err) {
            if (err) {
                return callback(err)
            }
            callback(null)
        })

    })
}
~~~







### 5.4 删除学生

- 获取学生id
- 根据 id 执行删除操作
- 根据操作发送响应数据



## 6. 项目的处理步骤

- 处理模板
- 配置静态资源
- 配置模板引擎
- 简单路由
- 路由设计
- 提取路由模块
- students.js 文件结构
  - find
  - findById
  - save
  - updateById
  - deleteById
- 实现细节
  - 通过路由收到请求
  - 接受请求中的数据（get，post）
    - req.query
    - req.body
  - 调用数据操作 API 处理数据
  - 根据操作结果给客户端发送响应



# 十三、MongoDB

## 1. 开启和关闭 MongoDB

可以根据文档配置 Windows 服务，右键开启和关闭服务，也可以直接在命令行开启或关闭



- Windows 配置服务
  - https://www.runoob.com/mongodb/mongodb-window-install.html
- 命令行模式（注意配置环境变量）
  - 开启
  - 关闭



开启数据库

~~~shell
# 在命令行模式中执行 mongod 会默认所处盘符的根目录 /data/db 作为自己的数据存储目录
# 第一次执行需要手动创建该目录
mongod
~~~



如果想要修改默认数据存储目录，可以：

~~~shell
mongod -dbpath=数据存储路径
~~~

> 一般保持默认即可



停止数据库

~~~shell
CTRL + C
~~~

> 或直接关闭窗口也可以



## 2. 连接和退出数据库

连接：

~~~shell
# 默认连接本地数据库
mongo
~~~



退出：

~~~shell
exit
~~~



## 3. 基本命令

~~~shell
# 查看数据库，默认 admin 和 local 系统创建数据库
show dbs

# 查看当前操作的数据库
db

# 切换到指定数据库（如果没有会自动新建）
use 数据库名

# 插入数据
db.表名.insert({"key":"value"})

# 查看集合（显示数据库中所有表）
show collections

# 查看表内数据
db.表名.find()
~~~



## 4. Node 操作 MongoDB

### 4.1. 使用官方 mongodb 包操作

原生只提供了基础功能，不利于开发效率，具体可以查看官方文档：

> http://mongodb.github.io/node-mongodb-native/



### 4.2. 使用第三方包 mongoose

mongoose 是基于官方提供的 mongodb 包进行再次封装

> https://mongoosejs.com/



安装

~~~shell
npm i --save mongoose
~~~



Hello World

~~~js
// 引包
const mongoose = require('mongoose');

// 连接并创建数据库（test为数据库名），不是马上创建，在插入第一条数据库自动创建
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

// 创建模型并实例化对象（相当于以对象方式设计并创建表，Cat 会以复数的形式 cats 当做表名）
const Cat = mongoose.model('Cat', { name: String });

// 插入数据，持久化保存，创建一个新的实例（更方便操作数据）
const kitty = new Cat({ name: 'Zildjian' });
kitty.save().then(() => console.log('meow'));
~~~



### 4.3. MongoDB 基本概念

和 MySQL 类似，MongoDB 由数据库、集合和文档组成。

- 可以有多个数据库
- 一个数据库可以有多个集合（表）
- 一个集合中可以有多个文档（表记录）
- 文档结构很灵活，没有任何限制
- MongoDB 非常灵活，不需要像 MySQL 一样先创建数据库、表、设计表结构
  - 当需要插入数据的时候，只需要指定往哪个数据库的哪个集合操作就可以了
  - 一切都由 MongoDB 自动完成建库建表



可以将整个数据库看成一个大的对象：

~~~json
{
  qq:{  # 数据库
    users: [  # 集合
      {name: '张三', password: '123456'},  # 文档
      {name: '李四'},
      {name: '王五'}
      ],
    products:[
      {name: '苹果', price: '778'},
      {name: '李子'},
      {name: '栗子'}
    ]
  }
  
  baidu: {
  
}

	taobao: {
    
  }

}
~~~



### 4.4. 连接数据库

~~~js
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test:27017')
~~~

> 默认端口 27017，可以省略



### 4.5. 设计集合结构（表结构）

即使 MongoDB 是一个灵活的结构，为了保证数据的完整性和安全性，我们还是需要设计一下数据库结构。

~~~js
var Schema = mongoose.Schema
var userSchema = new Schema({
    // username: String,  // 可以指定类型，但是无法给数据进行约束
    username: {
        type: String,
        required: true  // 必须填写 
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String
    }
})

~~~



### 4.6. 将文档结构发布为模型

用 mongoose.Model 方法将一个架构发布为 Model

~~~js
var User = mongoose.Model('User', userSchema)
~~~

- 第一个参数：传入一个大写名词单数字符串，Mongoose 会自动将大写名字字符串生成小写复数的集合 `User -> users`
- 第二个参数：传入一个设计架构
- 返回值：构造模型（构造模型函数）



### 4.7. 插入文档

当我们有了模型构造函数之后，就可以使用这个构造函数对这个生成的 users 集合（表）进行文档操作了。

~~~js
// 新建一个文档，但是文档需要按照之前设计的构造来创建
var admin = new User({
    username: 'admin',
    password: '123456',
    email: ''
})

// 用实例中的 save 方法将文档保存数据到数据库中
admin.save(function(err, ret) {
    if (err) {
        console.log('存储失败');
    } else {
        console.log('存储成功');
        console.log(ret);  // ret 是插入的数据对象本身
    }
})
~~~



### 4.8. 查询数据

#### 4.8.1. 查询所有文档

~~~js
User.find(function(err, ret){
    if (err) {
        console.log('查询失败');
    } else {
        console.log('查询成功');
        console.log(ret);  // 所有文档，以列表方式显示
    }
})
~~~



#### 4.8.2. 按条件查询

find 方法返回所有匹配数据

~~~js
User.find({
  username: 'admin'
}, function(err, ret){
    if (err) {
        console.log('查询失败');
    } else {
        console.log('查询成功');
        console.log(ret);  // 依然以数组方式返回
    }
})
~~~



findOne 方法是只返回匹配的第一个文档，返回值不是数组，只是单个对象。如果 findOne 没有条件，默认返回第一个数据

~~~js
User.find({
  username: 'admin'
}, function(err, ret){
    if (err) {
        console.log('查询失败');
    } else {
        console.log('查询成功');
        console.log(ret);  // 依然以数组方式返回
    }
})
~~~



匹配多个条件只需要在条件中写入匹配条件即可

~~~js
User.find({
  username: 'admin',
  password: '123456'
}, function(err, ret){
    if (err) {
        console.log('查询失败');
    } else {
        console.log('查询成功');
        console.log(ret);  // 依然以数组方式返回
    }
})
~~~



#### 4.8.3. 删除数据

删除所有匹配条件的数据

~~~js
User.remove({
    username: 'admin'
},function(err, ret){
    if (err) {
        console.log('查询失败');
    } else {
        console.log('查询成功');
        console.log(ret);  // 返回删除信息结果对象
    }
})
~~~



#### 4.8.4. 更新数据

~~~js
// 按照 ID 更新指定文档信息
User.findByIdAndUpdate('5a001b23d219eb00c8581184', {
    password: '123'  // 更新文档对象内容（可以是一个也可以是多个）
}, function(err, ret){
    if (err) {
        console.log('更新失败');
    } else {
        console.log('更新成功');
        console.log(ret);  // 更新结果信息对象
    }
})
~~~



## 5. MongoDB 补完 CRUD 项目

### 5.1. 重新编写 students 处理数据js

~~~js
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/students')

var Schema = mongoose.Schema
var studentSchema = new Schema({
    // username: String,  // 可以指定类型，但是无法给数据进行约束
    name: {
        type: String,
        required: true // 必须填写 
    },
    gender: {
        type: Number,
        enum: [0, 1],
        default: 0
    },
    age: {
        type: Number,
        required: true
    },
    hobbies: {
        type: String,
        default: ''
    }
})

module.exports = moongoose.Model('Student', studentSchema)
~~~



### 5.2. 模板文件

因为 id 在 MongoDB 中显示的是自动生成的 unique id，所以我们将页面显示的 id 改为 index

~~~html
{{ $index + 1}}
~~~



另外`编辑`和`删除`的链接也需要改变，mongoDB 中的 id 叫做 `_id`：

~~~html
<a href="/students/edit?{{ $value._id }}">编辑</a>
<a href="/students/delete?{{ $value._id }}">删除</a>
~~~





### 5.3. 路由调用方法

~~~js
// 保存学生数据
router.post('/student/new', function (req, res){
  new Student(req.body).save(function (err) {
    if (err) {
      return res.status(500).send('Server Error')
    }
    res.redirect('/students')
	})
})

// 渲染学生页面
router.get('/student/edit', function (req, res){
  // 使用正则删除 _id 中的双引号
  Student.findById(req.query.id.replace('/"/g',''), function (err, student) {
    if (err) {
      return res.status(500).send('Server Error')
    }
    res.render('edit.html', {
      student: student
    })
  })
})

// 处理学生函数
router.post('/student/edit', function (req, res){
  Student.findByIdAndUpdate(req.body.id.replace('/"/g', ''), function (err) {
    if (err) {
      return res.status(500).send('Server Error')
    }
    res.redirect('/students')
  })
})

router.get('/student/delete', function (req, res){
  Student.findByIdAndRemove(req.body.id.replace('/"/g', ''), function (err) {
    if (err) {
      return res.status(500).send('Server Error')
    }
    res.redirect('/students')
  })
})
~~~





# 十四、Node 操作 MySQL

## 1. 安装 mysql 包

~~~shell
npm i --save mysql
~~~



## 2. 使用

~~~js
// 引包
var mysql      = require('mysql');

// 创建连接对象（配置）
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'me',
  password : 'secret',
  database : 'my_db'
});
 
// 连接数据库
connection.connect();
 
// 操作数据库，增删改查都在这个 QUERY 里写
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
 
// 关闭数据库
connection.end();
~~~



# 十五、Promise

## 1. 同步和异步

在计算机领域，同步就是指一个进程在执行某个请求的时候，若该请求需要一段时间才能返回信息，那么这个进程将会一直等待下去，直到收到返回信息才继续执行下去；异步是指进程不需要一直等下去，而是继续执行下面的操作，不管其他进程的状态。当有消息返回时系统会通知进程进行处理，这样可以提高执行的效率。



- 同步可以理解为顺序执行，当碰到一个耗时比较长的操作，主线程会一直等待该操作完成再执行下边的代码
- 异步可以理解为同时执行，当碰到一个耗时比较常的操作，主线程不会等待，继续执行下边的代码（同时耗时程序也在继续执行）



### 1.1 同步

~~~js
var a = 1
var b = 2
function add (x, y) {
    return x + y
}

function sub (x, y) {
    return x - y
}
add (a, b)
sub (a, b)
~~~

> 由上到下依次执行，add() 函数执行完毕后再执行 sub()



### 1.2 异步

~~~js
var fs = require('fs')
fs.readFile('./a.txt', 'utf8', function (err, data) {
    err ? console.log(err) : console.log(data)
})
fs.readFile('./b.txt', 'utf8', function (err, data) {
    err ? console.log(err) : console.log(data)
})
fs.readFile('./c.txt', 'utf8', function (err, data) {
    err ? console.log(err) : console.log(data)
})
~~~

> 无法保证执行顺序，取决于调用机制



## 2. 让异步操作按照代码顺序执行

由于 node 中很多操作都是异步的，比如：

- fs
- ajax
- ......



有些特殊情况我们需要让异步函数按照特定顺序来执行，就需要将异步函数进行嵌套

~~~js
var fs = require('fs')
fs.readFile('./a.txt', 'utf8', function(err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
        fs.readFile('./b.txt', 'utf8', function(err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log(data);
                fs.readFile('./c.txt', 'utf8', function(err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(data);
                    }
                })
            }
        })
    }
})
~~~

> 这种嵌套叫做地狱嵌套，对于维护和书写非常困难



## 3. Promise

ES6 中出现了一个新的方法，叫做 Promise， Promise 是一个构造函数，它本身并不是异步，但是它的内部往往是异步函数。可以把 Promise 看做成一个容器：容器中存放了一个异步任务，任务有3种状态：

- pending
- resolved
- rejected

当开始执行容器内部的异步操作时，任务状态处于 pending，当任务执行完毕后，状态变为 resolved，如果任务失败，状态为 rejected



### 3.1. 创建一个 Promise 容器

~~~js
var fs = require('fs')

var p1 = new Promise(function (resolve, reject) {
    fs.readFile('./a.txt', 'utf8', function (err, data) {
        if (err) {
            // 如果失败，将状态从 pending 改为 rejected
            reject (err)
        } else {
            // 如果成功，将状态从 pending 改为 resolved
            resolve (data)
        }
    })
})
~~~



### 3.2. 使用 Promise

~~~js
p1.then(function(data) {
    console.log(data)
}, function(err) {
    console.log(err)
})
~~~

> 当 p1 成功执行完毕后，然后做接下来的指定操作，then 中接受的两个函数分别是 p1 中的 resolve 和 reject 函数

- 参数1: 整个函数就是 p1 的 resolve(data) 
- 参数2: 整个函数就是 p1 的 reject(data)



可以看做将 resolve 中的 data 传递给 then 里 function 中的 data



### 3.3. 例子

~~~js
var fs = require('fs')

var p1 = new Promise(function(resolve, reject) {
    fs.readFile('./a.txt', 'utf8', function(err, data) {
        if (err) {
            // 如果失败，将状态从 pending 改为 rejected
            reject(err)
        } else {
            // 如果成功，将状态从 pending 改为 resolved
            resolve(data)
        }
    })
})

var p2 = new Promise(function(resolve, reject) {
    fs.readFile('./b.txt', 'utf8', function(err, data) {
        if (err) {
            reject(err)
        } else {
            resolve(data)
        }
    })
})

var p3 = new Promise(function(resolve, reject) {
    fs.readFile('./c.txt', 'utf8', function(err, data) {
        if (err) {
            reject(err)
        } else {
            resolve(data)
        }
    })
})

p1.then(function(data) {
    console.log(data);
  // 这里 return 什么，后边 then 中 function 参数的 data 就是什么
  // 如果 return 的是一个 promise 对象，后边 then 中的 function 就是这个 promise 对象的 resolve 方法
  // 这个 p1.then(function...) 相当于就变成了 p1.then(p2).then(p3)，使用 data 参数只是为了拿到 promise 对象中
  // 异步函数的 resolve 处理结果，即 data
    return p2
}, function(err) {
    console.log(err)
}).then(function(data) {
    console.log(data);
    return p3
}).then(function(data) {
    console.log(data);
})
~~~



### 3.4. 封装

~~~js
var fs = require('fs')

function pReadFile(filePath) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filePath, 'utf8', function(err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}


pReadFile('./a.txt').then(function(data) {
    console.log(data);
    return pReadFile('./b.txt')
}, function(err) {
    console.log(err)
}).then(function(data) {
    console.log(data);
    return pReadFile('./c.txt')
}).then(function(data) {
    console.log(data);
})
~~~



## 4. Promise 应用场景

### 4.1. 读取多表操作

比如说一个表单操作，需要读取 User 和 Job 两个表，但是只有先读取 User 表之后才可以进行 Job 表进行对比查询。



html

~~~html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <form action="">
        <div>
            <label for="">用户名</label>
            <input type="text" value= "">
        </div>
        <div>
            <label for="">年龄</label>
            <input type="text" value="">
        </div>
        <div>
            <label for="">职业</label>
            <select name="" id="">
                <option value="">学生</option>
                <option value="">老师</option>
                <option value="">司机</option>
            </select>
        </div>
    </form>
</body>

</html>
~~~



~~~json
{
    "users": [{
        "id": 1,
        "username": "admin",
        "age": 18,
        "job": 3
    }, {
        "id": 2,
        "username": "user1",
        "age": 21,
        "job": 2
    }, {
        "id": 3,
        "username": "user2",
        "age": 32,
        "job": 1
    }],
    "jobs": [{
            "id": 1,
            "name": "老师"
        },
        {
            "id": 2,
            "name": "学生"
        },
        {
            "id": 3,
            "name": "司机"
        }
    ]
}
~~~



用  Json-Server 开启简单接口服务

~~~shell
json-server --watch db.json
~~~

> 自动创建 API



- localhost/users
  - localhost/users/1 
- localhost/jobs



封装 ajax 请求

~~~html
<script>
  function get(url, callback) {
  var oReq = new XMLHttpRequest()
  oReq.onload = function() {
    callback(oReq.responseText)
  }
  oReq.open("get", url, true)
  oReq.send()
}
</script>
~~~



启动服务

~~~shell
hs -s-l -o 
~~~



调用 get 函数，测试可以拿到接口数据

~~~js
get("http://localhost/users/1", function(data) {
  console.log(data)
})
~~~



添加 art-template 模板

~~~html
<form action="" id="user_form">
</form>

<script type="text/template" id="tpl">
        <div>
            <label for="">用户名</label>
            <input type="text" value= "{{ user.username }}">
        </div>
        <div>
            <label for="">年龄</label>
            <input type="text" value="{{ user.age }}">
        </div>
        <div>
            <label for="">职业</label>
            <select name="" id="">
                <option value="">学生</option>
                <option value="">老师</option>
                <option value="">司机</option>
            </select>
        </div>
</script>
<script src="node_modules/art-template/lib/template-web.js"></script>
~~~



调用封装 get 方法拿到数据，但是只能拿到 users 的表单，

~~~html
<script>get(get("http://localhost/users/1", function(data) {
    data = JSON.parse(data)
    var htmlStr = template('tpl', {
      user: data
    })
    document.querySelector('#user_form').innerHtml(htmlStr)    
})</script>
~~~



如果想拿到对应 users 的 jobs 表单，必须先确定 user 才可以确定 job。这时候就需要在一个 get 中使用另外一个 get，形成嵌套地狱

~~~html
<script>get("http://localhost/users/1", function(userData) {
    get("http://localhost/jobs", function(jobsData){
      console.log(userData, jobsData)
    })  
})</script>
~~~



~~~html
<script>get("http://localhost/users/1", function(userData) {
    get("http://localhost/jobs", function(jobsData){
      userData = JSON.parse(userData)
      jobsData = JSON.parse(jobsData)
      var htmlStr = template('tpl', {
        user: userData
        jobs: jobsData
      })
      document.querySelector('#user_form').innerHTML(htmlStr)
    })  
})</script> 
~~~



之后修改模板后就可以正常显示了 jobs 的数据了

~~~html
<div>
  <label for="">职业</label>
  <select name="" id="">
    {{ each jobs }}
    <option value="{{$value.id}}">{{$value.name}}</option>
    {{ /each }}
  </select>
</div>
~~~



最后判断是哪个 user 被选中，就显示哪个 jobs

~~~html
<div>
  <label for="">职业</label>
  <select name="" id="">
    {{ each jobs }}
    {{ if user.job === $value.id }}
    <option value="{{$value.id}}" selected>{{$value.name}}</option>
    {{ else }}
    <option value="{{$value.id}}">{{$value.name}}</option>
    {{ /if }}
    {{ /each }}
  </select>
</div>
~~~



### 4.2. aJax 中的 Promise 异步

改造 get 函数，变成 promise 方式

~~~html
<script>
  function pGet(url) {
    return new Promise(function(resolve, reject){
      var oReq = new XMLHttpRequest()
      oReq.onload = function() {
        resolve(oReq.responseText)
        // 读取字符串时需要转对象
        // resolve(JSON.parse(oReq.responseText))
      }
      oReq.onerror = function(err){
        reject(err)
      }
      oReq.open("get", url, true)
      oReq.send()
    })
}
</script>
~~~



测试封装函数

~~~html
<script>
	pGet('http://localhost/users/1')
  .then(function(userData){
    console.log(userData)
  })
</script>

~~~



~~~html
<script>
  var data = {}
  $pGet('http://localhost/users/4')
    .then(function(userData) {
    data.user = userData
    return $pGet('http://localhost/jobs')
  })
    .then(function(jobsData) {
    data.jobs = jobsData
    var htmlStr = template('tpl', data)
    document.querySelector('#user_form').innerHTML(htmlStr)
  })
</script>
~~~



让这个函数既支持 Promise 模式也可以使用 callback 模式

~~~html
<script>
  function pGet(url, callback) {
    return new Promise(function(resolve, reject){
      var oReq = new XMLHttpRequest()
      oReq.onload = function() {
        // 相当于 if (callback) { callback() }
        callback && callback(oReq.responseText)
        resolve(oReq.responseText)
        // 读取字符串时需要转对象
        // resolve(JSON.parse(oReq.responseText))
      }
      oReq.onerror = function(err){
        reject(err)
      }
      oReq.open("get", url, true)
      oReq.send()
    })
}
</script>
~~~



ajax 原生支持 promise

~~~html
<script src="node_modules/jquery/dist/jquery.js"></script>
<script>
  var data = {}
  $.get('http://localhost/users/4')
    .then(function(userData) {
    data.user = userData
    return $.get('http://localhost/jobs')
  })
    .then(function(jobsData) {
    data.jobs = jobsData
    var htmlStr = template('tpl', data)
    document.querySelector('#user_form').innerHTML(htmlStr)
  })
</script>
~~~



### 4.3. MongoDB 中的 Promise

~~~js
user.find()
.then(function(data){
  console.log(data)
})
~~~



~~~js
user.findOne({
    username: 'admin'
  })
  .then(function(user){
    if (user) {
      console.log('用户已存在，无法注册')
    } else {
      console.log('用户不存在，可以注册')
      return new User({
        username: 'aaa',
        password: 'bbb',
        email: 'aaa@aaa.com'
      }).save()
    }
  }).then(function(ret){
      // 可以继续 then 下去，ret 是之前 return 的 new User
  })
~~~



# 十六、BLOG 项目

## 1. 初始化项目

开启 express 服务器

~~~js
var express = require('express')

var app = express()

app.get('/', function(req, res){
    res.send('hello')
})

app.listen(3000,function(){
    console.log('Server is running');
})
~~~



静态资源

~~~js
app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))
~~~



- `__dirname` 可以用来获取当前文件模块所属目录的绝对路径
- `__filename` 可以用来获取当前文件的绝对路径

> 文件操作中的路径， 相对路径不是根据当前文件的文件路径，而是相对于执行 node 命令所处的终端路径



配置模板引擎

~~~js
app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/'))  // 方便以后修改

app.get('/', function(req, res){
    res.render('index.html')
})
~~~



## 2. Header Footer 分离

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    {{ include './header.html' }}
    <h1>body</h1>
    {{ include './footer.html' }}
</body>
</html>
~~~



### 2.1. 模板继承

index.html、list.html、register.html 等页面基本上都使用同一个 header 和 footer。为了使代码更简洁，可以是用模板继承。



layout.html

~~~html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    {{ include './header.html' }}
    
    {{ block 'content'}}
    <h1>body 默认内容</h1>
    {{ /block }}

    {{ include './footer.html' }}
</body>

</html>
~~~



index.html

~~~html
{{ extend './layout.html'}} 
{{ block 'content'}}
<h1>改动内容</h1>
{{ /block }}
~~~



可以留多个填充标签如：

~~~html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.css"> 
    {{ block 'head'}} {{/block}}
    <title>Document</title>
</head>

<body>
    {{ include './header.html' }} 
    {{ block 'content'}}
    <h1>body 默认内容</h1>
    {{ /block }} {{ include './footer.html' }}

    <script src="/node_modules/jquery/dist/jquery.js"></script>
    <script src="/node_modules/bootstrap/dist/js/bootstrap.js"></script>
    {{ block 'foot'}}
    {{ /block}}
</body>

</html>
~~~



## 3. 目录结构

- node_modules
- public
- controllers
- Models
- views
  - _layout
    - home.html
  - _partials
    - header.html
    - footer.html
  - settings
  - topic
  - index.html
  - login.html
  - register.html
- app.js
- package.json
- package-lock.json
- README.md



## 4. 路由设计

| 请求地址  | 请求方式 | get参数 | post参数                  | 登录权限 | 备注         |
| --------- | -------- | ------- | ------------------------- | -------- | ------------ |
| /         | GET      |         |                           |          | 渲染首页     |
| /register | GET      |         |                           |          | 渲染注册页面 |
| /register | POST     |         | username, password, email |          | 处理注册信息 |
| /login    | GET      |         |                           |          | 渲染登录页面 |
| /login    | POST     |         | username, password        |          | 处理登录信息 |
| /logout   | GET      |         |                           |          | 处理登出信息 |



## 5. 处理路由

router.js

~~~js
var express = require('express')
var router = express.Router()

router.get('/', function (req, res) {
  res.render('index.html')
})

router.get('/login', function (req, res) {
  res.render('login.html')
})

router.post('/login', function (req, res) {
  
}) 

router.get('/register', function (req, res) {
  res.render('reigster.html')
})

router.post('/register', function (req, res) {
  
}) 

router.get('/logout', function (req, res) {
  
})

module.exports = router

~~~



## 6. register 页面

### 6.1 获取POST数据

- 安装 body-parser 插件
- 配置 body-parser 插件

~~~js
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
~~~



- 测试 post 数据

~~~js
router.post('/register', function (req, res) {
  console.log(req.body)
})
~~~



### 6.2 Ajax 提交数据

~~~js
  <script>
    $('#register_form').on('submit', function (e) {
      e.preventDefault()
      var formData = $(this).serialize()
      $.ajax({
        url: '/register',
        type: 'post',
        data: formData,
        dataType: 'json',
        success: function (data) {
          var err_code = data.err_code
          if (err_code === 0) {
            // window.alert('注册成功！')
            // 服务端重定向针对异步请求无效
            window.location.href = '/'
          } else if (err_code === 1) {
            window.alert('邮箱已存在！')
          } else if (err_code === 2) {
            window.alert('昵称已存在！')
          } else if (err_code === 500) {
            window.alert('服务器忙，请稍后重试！')
          }
        }
      })
    })
  </script>
~~~



### 6.3 设计数据库模型

在 model/user.js 中设计对应数据库模型

~~~js
var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/test', { useMongoClient: true })

var Schema = mongoose.Schema

var userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  created_time: {
    type: Date,
    // 注意：这里不要写 Date.now() 因为会即刻调用
    // 这里直接给了一个方法：Date.now
    // 当你去 new Model 的时候，如果你没有传递 create_time ，则 mongoose 就会调用 default 指定的Date.now 方法，使用其返回值作为默认值
    default: Date.now
  },
  last_modified_time: {
    type: Date,
    default: Date.now
  },
  avatar: {
    type: String,
    default: '/public/img/avatar-default.png'
  },
  bio: {
    type: String,
    default: ''
  },
  gender: {
    type: Number,
    enum: [-1, 0, 1],
    default: -1
  },
  birthday: {
    type: Date
  },
  status: {
    type: Number,
    // 0 没有权限限制
    // 1 不可以评论
    // 2 不可以登录
    enum: [0, 1, 2],
    default: 0
  }
})

module.exports = mongoose.model('User', userSchema)

~~~



### 6.4 处理注册请求

查看是否数据库中已经有相同邮件注册

~~~js
app.post('/register', function(req,res){
  var body = req.body
  User.findOne({
    email: body.email
  }, function(err, data){
    if (err){
      return res.status(500).send("Server Error")
    }
    console.log(data)
  })
})
~~~



判断完相同邮件，还需要判断用户名是否相同，mongoDB 的条件查询方式

~~~js
app.post('/register', function(req,res){
  var body = req.body
  User.findOne({
    $or: [{email: body.email}, {nickname: body.nickname}]
  }, function(err, data){
    if (err){
      return res.status(500).send("Server Error")
    }
    // 如果邮箱已存在，data 存在数据
    if (data){
      return res.status(200).send("Email or nickname already exists")
    }
    res.status(200).send("ok")
  })
})
~~~



当服务器返回数据的时候，返回给 ajax 请求，ajax 要求返回时 json 数据，所以这里 send(ok)，浏览器得不到响应，也就不会产生变化。几种发送 json 格式数据的方法

~~~js
res.status(200).send('{"success": true}')
res.status(200).send(JSON.stringify({success:true}))
res.status(200).json({success:true})
~~~



将所有 send 改为 json

~~~js
app.post('/register', function(req,res){
  var body = req.body
  User.findOne({
    $or: [{email: body.email}, {nickname: body.nickname}]
  }, function(err, data){
    if (err){
      return res.status(500).json({
        success: false
        message: 服务端错误
      })
    }
    // 如果邮箱已存在，data 存在数据
    if (data){
      return res.status(200).json({
        success: true
        message: "Email or nickname already exists"
      })
    }
    res.status(200).json({
      success: true
      message: "ok"
    })
  })
})
~~~



如果没有记录，则插入一条用户记录

~~~js
new User(body).save(function(err, user){
  if (err){
    return res.status(500).json({
      success: false
      message: 服务端错误
    })
  }
  res.status(200).json({
    success: true
    message: 'ok'
  })
})
~~~



因为 ajax 需要根据服务器返回的数据判断，邮箱已存在和不存在返回的都是 success: true ，虽然可以根据字符串判断，但是一般不建议这么做。可以将这个没有意义的 success 改造成 err_code 模式，0代表无错误，1代表邮箱有问题，500 代表服务端错误，这样就可以区分开了。

~~~js
res.status(200).json({
  err_code: 0
  message: 'ok'
})
~~~



ajax判断

~~~js
success: function (data) {
  var err_code = data.err_code
  if (err_code === 0) {
    // window.alert('注册成功！')
    // 服务端重定向针对异步请求无效
    window.location.href = '/'
  } else if (err_code === 1) {
    window.alert('邮箱已存在！')
  } else if (err_code === 2) {
    window.alert('昵称已存在！')
  } else if (err_code === 500) {
    window.alert('服务器忙，请稍后重试！')
  }
}
~~~



### 6.5 MD5 加密

现在密码是明文存在数据库中的，需要给 MD5 加密，安装 Javascript-MD5 加密包

~~~js
npm i blueimp-md5
~~~



引入使用

~~~js
var md5 = require('blueimp-md5')
// 双层 + salt md5 加密
body.password = md5(md5(body.password + 'encrypted string'))
~~~

> 还可以添加 salt



## 7. 同步提交和异步提交

### 7.1. 同步提交的进化史

最原始的网站提交数据，直接渲染错误信息，如果想重新填写表单，按返回

~~~js
app.post('/register', function(req, res){
  if (req.body.username === '张三'){
    res.send('用户已经存在，请重新注册')
  }
})
~~~



后来可以将错误信息放在提交页面

~~~js
app.post('/register', function(req, res){
  if (req.body.username === '张三'){
    res.render('./register.html', {
      err_msg: 用户已经存在，请重新注册
    })
  }
})
~~~



模板：

~~~html
<p>
  {{ err_msg }}
</p>
~~~



同理，可以将用户输入信息保留

~~~js
app.post('/register', function(req, res){
  if (req.body.username === '张三'){
    res.render('./register.html', {
      err_msg: 用户已经存在，请重新注册
      data: req.body
    })
  }
})
~~~



模板：

~~~html
<input type="email" class="form-control" id="email" name="email" placeholder="Email" value="{{data && data.email}}">
~~~



> 以上所有方式都是服务端来处理，前端几乎不怎么动，稳定，不用 js ，但是对服务器有压力。



### 7.2. 服务端异步请求

~~~js
router.post('/register', async function (req, res) {
  var body = req.body
  try {
    if (await User.findOne({ email: body.email })) {
      return res.status(200).json({
        err_code: 1,
        message: '邮箱已存在'
      })
    }

    if (await User.findOne({ nickname: body.nickname })) {
      return res.status(200).json({
        err_code: 2,
        message: '昵称已存在'
      })
    }

    // 对密码进行 md5 重复加密
    body.password = md5(md5(body.password))

    // 创建用户，执行注册
    await new User(body).save()

    res.status(200).json({
      err_code: 0,
      message: 'OK'
    })
  } catch (err) {
    res.status(500).json({
      err_code: 500,
      message: err.message
    })
  }
})
~~~



### 7.3. 异步跳转

当客户端是异步请求，服务端的 redirect 是无效的，需要客户端拿到响应数据之后在前端进行跳转。

~~~js
if (err_code === 0 ){
  alert('注册成功')
  windows.location.href = '/'
}

~~~



## 8. Session 和 Cookies

- Session 是服务端保存的一些用户数据。
- Cookies 是服务端给客户端的一把钥匙，只有拿着钥匙去服务端请求，服务端验证后才可以确认你是你自己。



Express 这个框架中，默认不支持 Cookie 和 Session ，需要使用第三方中间件： express - session 来解决



### 8.1. 安装

~~~shell
npm i express-session
~~~



### 8.2. 配置

~~~js
var session = require('express-session')

app.use(session({
  // 加密字符串，类似 salt，增加安全性
  secret: 'keyboard cat',
  resave: false,
  // 无论是否使用 session，服务器都会给你分配一个 cookie
  saveUninitialized: true
}))
~~~

>所有的配置信息一定要在引入路由代码 `app.use(Router)` 之前



### 8.3. 使用

配置好之后，就可以使用 `req.session` 来访问和设置 session 成员了

- 添加 session 数据

~~~js
req.session.foo = 'bar'
~~~



- 访问 session 数据

~~~js
req.session.foo
~~~



注册成功后，记录用户的当前状态

~~~js
req.session.isLogin = true
~~~



一般把 user 数据存储到 session 中，这样 session 就保存了用户的所有信息

~~~js
req.session.user = user
~~~



然后在 get 请求的时候做判断，查看用户 session

~~~js
console.log(req.session.user)
~~~



在渲染的时候，可以直接拿 session.user 的数据

~~~js
app.get('/',function(req, res){
	res.render('./index.html', {
    user: req.session.user
  })
})
~~~



模板就可以直接调用

~~~html
当前登录用户： {{ user.nickname }}
~~~



可以利用模板引擎做登录判断

~~~html
{{ if user }}
<a class="btn btn-default navbar-btn" href="/topics/new">发起</a>
<li class="dropdown">
  <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><img width="20" height="20" src="../public/img/avatar-max-img.png" alt=""> <span class="caret"></span></a>
  <ul class="dropdown-menu">
    <li class="dropdown-current-user">
      当前登录用户: {{ user.nickname }}
    </li>
    <li role="separator" class="divider"></li>
    <li><a href="#">个人主页</a></li>
    <li><a href="/settings/profile">设置</a></li>
    <li><a href="/logout">退出</a></li>
  </ul>
</li>
{{ else }}
<a class="btn btn-primary navbar-btn" href="/login">登录</a>
<a class="btn btn-success navbar-btn" href="/register">注册</a>
{{ /if }}
~~~



### 8.4. session 持久化处理



### 8.5. 设置 cookie 过期时间

js-cookie



## 9. login 页面

测试是否能拿到 post 数据

~~~js
app.post('/login', function(req, res){
	console.log(req.body)
})
~~~



ajax 请求

~~~js
$('#login_form').on('submit', function (e) {
  e.preventDefault()
  var formData = $(this).serialize()
  $.ajax({
    url: '/login',
    type: 'post',
    data: formData,
    dataType: 'json',
    success: function (data) {
      var err_code = data.err_code
      if (err_code === 0) {
        // window.alert('注册成功！')
        // 服务端重定向针对异步请求无效
        window.location.href = '/'
      } else if (err_code === 1) {
        window.alert('邮箱或者密码错误')
      } else if (err_code === 500) {
        window.alert('服务器忙，请稍后重试！')
      }
    }
  })
})
~~~



处理请求

~~~js
router.post('/login', function (req, res) {
  // 1. 获取表单数据
  // 2. 查询数据库用户名密码是否正确
  // 3. 发送响应数据
  var body = req.body

  User.findOne({
    email: body.email,
    password: md5(md5(body.password))
  }, function (err, user) {
    if (err) {
      return res.status(500).json({
        err_code: 500,
        message: err.message
      })
    }
    
    // 如果邮箱和密码匹配，则 user 是查询到的用户对象，否则就是 null
    if (!user) {
      return res.status(200).json({
        err_code: 1,
        message: 'Email or password is invalid.'
      })
    }

    // 用户存在，登陆成功，通过 Session 记录登陆状态
    req.session.user = user

    res.status(200).json({
      err_code: 0,
      message: 'OK'
    })
  })
})
~~~



## 10. 退出请求

登出只需要清空 session 即可

~~~js
router.get('/logout', function (req, res) {
  // 清除登陆状态
  req.session.user = null

  // 重定向到登录页
  res.redirect('/login')
})
~~~

> 最好是清空 req.session.user 这个对象



# 十七、中间件

## 1. 概念

中间件实际上是对数据做预处理的一些方法，以 http 为例

~~~js
var http = require（'http');
var server = http.createServer(function(req,res){
  // 解析 req.query，通过方法给 req 加入 query 属性
  // 解析 req.body， 通过方法给 req 加入 body 属性
  // 解析 cookie
  // 解析 session
  // render
});
server.listen(8080,function() {
  console.log('服务器启动成功');
}
~~~



本质上 http 中的 res 或 req 并不具备这些属性，通过中间件，可以将这些属性加载到原本的 res 或 req 中。类似于调用函数。所以必须放在引入路由的前边，因为路由会对 res 和 req 进行调用。



## 2. express 中的中间件

在 express 中，对中间件有几种分类：

不关心请求路径和请求方法的中间件

~~~js
app.use(function(req, res){
  console.log('请求进来了')
})
~~~

> 不管用 get 还是 post，不管访问的是 / 还是 /register，任何请求都会触发这个中间件方法。



中间件本身是一个方法，该方法接受三个参数：

- req
- res
- next



中间件调用默认只执行一次，只有当运行 next() 方法时，才会调用下一个 中间件方法：

~~~js
app.use(function(req, res, next){
  console.log('1')
  next()
})

app.use(function(req, res, next){
  console.log('2')
})
~~~



- 关心请求路径的中间件，或以 /xxx 开头的中间件

~~~js
app.use('/', function(req, res, next){
  console.log('1')
  next()
})
~~~



- 如果没有匹配路径的中间件，默认输出

~~~html
Cannot GET /
~~~



- 严格匹配请求方法和请求路径的中间件

其实 app.get 和 app.post 也算是中间件，这两个方法就是严格匹配请求方法和路径

~~~js
app.get('/', function(req,res, next){
  res.send('hello')
})
app.post('/register', function(req,res, next){
  res.send('register')
})
~~~



同一个中间件可以对同一个地址进行多次请求

~~~js
// 模拟 res.body 解析
app.post('/', function(req,res, next){
  req.body = {}
  next()
})

// 经过中间件解析，req 就有了 body 属性
app.post('/', function(req,res, next){
  console.log(req.body)
  next()
})
~~~





404 页面

~~~js
// 可以使用 use 忽略所有条件，但一定要放在最下边（也需要放在路由下边，因为路由也算是中间件，对 url 进行处理）
router.use(function(req,res){
  res.render('./404.html')
})

// 也可以使用 get + 通配符
router.get('*', function(req, res){
  res.sendfile('./public/404.html');
});
~~~



## 3. 中间件分类

- 应用级别中间件
- 路由级别中间件
- 错误处理中间件
- 内置中间件
- 第三方中间件



错误处理中间件

~~~js
app.get('/', function(req, res){
  fs.readFile('./3.html', function(err, data){
    if (err){
      // 直接跳到 err 中间件
      next(err)
    }
  })
})

app.use(function(err, req, res, next){
  // console.log('Error')
  res.status(500).send(err.message)
})
~~~







# 附录：VS CODE 快捷键

选中多个标签内容

CTRL + ALT + 左右 切换标签

CTRL + ALT + 上下 选中多个标签

SHIFT + 左右 选中一个字符

CTRL + SHIFT + 右 选中单词（不论长度）

CTRL + D 选中单词

ALT + 上下  移动换行



