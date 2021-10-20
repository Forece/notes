# 搭建 json-server

JSON-Server 是一个 Node 模块，利用 json-server 可以指定一个 json 文件作为数据源,快速的搭建出一个 REST API 风格的简单接口。



## 1. 安装 JSON Server

~~~shell
npm install -g json-server
~~~



## 2. 创建 JSON 数据

在目录下创建一个 db.json 的文件，存放我们的数据

~~~json
{
  "posts": [
    { "id": 1, "title": "json-server", "author": "typicode" }
  ],
  "comments": [
    { "id": 1, "body": "some comment", "postId": 1 }
  ],
  "profile": { "name": "typicode" }
}
~~~



## 3. 启动 JSON Server

~~~shell
json-server --watch db.json
~~~



## 4. 访问数据

现在访问 http://localhost:3000/posts/1 就可以拿到对应数据

~~~
{ "id": 1, "title": "json-server", "author": "typicode" }
~~~



并且可以对数据进行增删改查操作

~~~
GET    /posts
GET    /posts/1
POST   /posts
PUT    /posts/1
PATCH  /posts/1
DELETE /posts/1
~~~



# Axios 概念

Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中。



## 1. 前置知识

- Javascript
- Promise
- Node.js



## 2. Axios 特点

- 从浏览器中创建 [XMLHttpRequests](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
- 从 node.js 创建 [http](http://nodejs.org/api/http.html) 请求
- 支持 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API
- 拦截请求和响应
- 转换请求数据和响应数据
- 取消请求
- 自动转换 JSON 数据
- 客户端支持防御 XSRF



## 3. 安装

~~~
npm install axios
~~~



或直接引用 CDN

~~~html
// jsdelivr CDN
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

// unpkg CDN
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
~~~



或者使用国内的 Bootcdn 服务

~~~
<script src="https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js"></script>
~~~



## 4. 基本使用

GET 请求

~~~html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
        <script src="https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js"></script>
        <title>Document</title>
    </head>
    <body>
        <div class="container">
            <h2 class="page-header">基本使用</h2>
            <button class="btn btn-primary"> 发送 GET 请求 </button>
            <button class="btn btn-warning"> 发送 POST 请求 </button>
            <button class="btn btn-success"> 发送 PUT 请求 </button>
            <button class="btn btn-danger"> 发送 DELETE 请求 </button>
        </div>
        <script>        
            // 获取所有按钮
            const btns = document.querySelectorAll('button');

            // 第一个按钮点击事件
            btns[0].onclick = function(){
                // 发送 AJAX 请求
                axios({
                    methods:'GET',
                    url:'http://localhost:3000/posts/1'
                }).then(response=>{
                    console.log(response);
                })
            }
        </script>
    </body>
</html>
~~~



POST 请求

~~~js
btns[1].onclick = function(){    
    axios({
        methods:'POST',
        url:'http://localhost:3000/posts'
    }).then(response=>{
        console.log(response);
    })
}
~~~



PUT 请求

~~~js
btns[2].onclick = function () {
    axios({
        methods: 'PUT',
        url: "http://127.0.0.1:3000/posts/2",
        data:{
            title: "Hello World",
            author:"Me"
        }
    }).then((response) => {
        console.log(response);
    });
};
~~~



DELETE 请求

~~~js
btns[3].onclick = function () {
    axios({
        methods: 'DELETE',
        url: "http://127.0.0.1:3000/posts/2",
    }).then((response) => {
        console.log(response);
    });
};
~~~



# Axios 请求方法

## 1. get 请求

~~~js
btns[0].onclick = function () {
    axios.post({
        url:'http://localhost:3000/posts/1',
    }).then(response =>{
        console.log(response);
    })
}
~~~





## 2. post 请求

~~~js
btns[1].onclick = function () {
    axios.post({
        url:'http://localhost:3000/posts',
        data:{
            title:'老板',
            author:'生活',
        }
    }).then(response =>{
        console.log(response);
    })
}
~~~

