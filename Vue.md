# 一、Vue 介绍

## 1. Vue 概要

尤雨溪



cn.vuejs.org





## 2. Vue 特性

- JS 框架
- 简化DOM操作
- 响应式数据驱动



## 3. Hello World

### 3.1 导包

生产环境文件，适用于项目

~~~html
<!-- 生产环境版本，优化了尺寸和速度 -->
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
~~~

开发环境，适用于学习使用

~~~html
<!-- 开发环境版本，包含了有帮助的命令行警告 -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
~~~



### 3.2 基本使用

- 引包
- 创建 vue 对象，设置 el 和 data 属性
- 使用模板语法将数据渲染

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
    <!-- 导包 -->
    <!-- 生产环境版本，优化了尺寸和速度 -->
    <script src="https://cdn.jsdelivr.net/npm/vue"></script>

    <!-- 使用模板语法将数据渲染 -->
    <div id="app">
        {{ message }}
    </div>

    <script>
        // 创建 vue 对象，设置 el 和 data 属性
        var app = new Vue({
            el: "#app",
            data: {
                message: "hello world"
            }
        })
    </script>

</body>

</html>
~~~



el：

- 只针对双标签如：`<div> </div>`
- 可重复使用模板调用，在相同 el 指定的 id 下，可重复使用 {{ message }} 进行调用
- 可直接使用标签，如： `el: div` ，建议使用 id 标签
- 不能使用 html 和 body 标签



data:

- 可以导入普通对象，数组，对象

~~~json
data: {
  msg: "hello",
  school: {
    name: "黑马",
    phone: "800-1234-5678"
  },
  campus: [0,1,2,3,4,5]
}
~~~



- data 如果只有一个属性，直接使用属性名调用 `{{ msg }}` 

- data 属性是对象： `{{ school.name }}`
- data 属性是数组： `{{ campus[0] }}`



# 二、Vue 指令

内容、事件绑定

- v-text
- v-html
- v-on



显示、切换属性绑定

- v-show

- v-if

- v-bind



列表循环表单元素

- v-for
- v-on
- v-model



## 1. v-text

可以直接用 v-text 标签显示 data 内容，而不用使用 {{ message }} 模板语法

~~~html
<h2 id="app" v-text="message"></h2>
~~~



如果需要添加指定文字可以这样写：

~~~html
<h2 id="app" v-text="message + 'abc'"></h2>
<h2 id="app">{{ message + 'abc' }}</h2>
<h2 id="app">{{ message }}abc</h2>
~~~



## 2. v-html

与 v-text 类似，只是用 v-html 可以将 html 代码进行解析显示。

~~~html
<h2 id="app" v-html="msg"></h2>
    <script>
        var app = new Vue({
            el: "#app",
            data: {
                msg: "<hr/><hr/>"
            }
        })
    </script>
~~~



## 3. v-on 绑定事件

~~~html
<input type="button" id="btn" value="单击按钮" v-on:click="doIt">

<script>
  var app = new Vue({
    el: "#btn",
    data: {
      message: "单击按钮"
    },
    methods: {
      doIt: function() {
        console.log(单击按钮);
      }
    }
  })
</script>
~~~



`v-on` 也可以用简写 `@` 来替代，如：

~~~html
<input type="button" id="btn" value="单击按钮" @click="doIt">
~~~



`this` 对象代表着 vue 实例中的 data 属性，用 `.` 的形式可以引用 data 中的属性

~~~js
    <script>
        var app = new Vue({
            el: "#btn",
            data: {
                message: "单击按钮"
            },
            methods: {
                doIt: function() {
                    console.log(单击按钮);
                    console.log(this.message)
                }
            }
        })
    </script>
~~~



## 案例：简单购物车计数器

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
    <!-- 导包 -->
    <!-- 生产环境版本，优化了尺寸和速度 -->
    <script src="https://cdn.jsdelivr.net/npm/vue"></script>

    <!-- 使用模板语法将数据渲染 -->
    <div id="app">
        <button @click="sub">-</button>
        <span> {{ num }} </span>
        <button @click="add">+</button>
    </div>
    <script>
        var app = new Vue({
            el: "#app",
            data: {
                num: 1
            },
            methods: {
                sub: function() {
                    if (this.num > 0) {
                        this.num--
                    } else {
                        alert('数值不能小于0')
                    }
                },
                add: function() {
                    if (this.num < 10) {
                        this.num++
                    } else {
                        alert('库存不足')
                    }
                }
            }
        })
    </script>

</body>

</html>
~~~



## 4. v-show

v-show 可以切换元素的显示和隐藏，一般常见网页效果是广告、遮罩层等等。操作CSS样式，修改 display 属性

~~~html
    <div id="app">
        <!-- 永久显示 -->
        <img src="图片地址" alt="" v-show="true">
        <!-- 在 Vue 中 Methods 设置方法改变 isShow 的值，相当于 flag -->
        <button @click="showImg">切换图片状态</button>
        <img src="图片地址" alt="" v-show="isShow">
        <!-- 用 Vue 中其他属性判断 -->
        <button @click="addAge">增加年龄</button>
        <img src="图片地址" alt="" v-show="age>=18">
    </div>
~~~



~~~js
    <script>
        var app = new Vue({
            el: "#app",
            data: {
                isShow: true,
                age: 16
            },
          methods: {
            showImg: function(){
              this.isShow = !this.isShow
            }
          })
    </script>
~~~



## 5. v-if

可以根据表达式的真假，切换元素的显示和隐藏，和 v-show 不同的是，v-if 是直接操纵DOM元素，直接删除页面元素

~~~html
<div id="app">
  <img src="图片地址" v-if="true">
  <img src="图片地址" v-if="isShow">
  <img src="图片地址" v-if="表达式">
</div>
~~~



> 频繁切换使用 v-show，反之使用 v-if。 v-show 消耗资源较少。



## 6. v-bind

设置元素属性，如：src, title, alt, href, class 等等

~~~html
<!-- 直接绑定属性 -->
<img src="图片地址" alt="" v-bind:src="imgSrc">
<!-- 属性中拼接字符串 -->
<img src="图片地址" alt="" v-bind:title="imgTitle + '添加字符串'">
<!-- 三元表达式判断属性 -->
<img src="图片地址" alt="" v-bind:class="isActive?'active':''">
<!-- 对象方式判断属性 -->
<img src="图片地址" alt="" v-bind:class="{active:isActive}">
~~~

> 可以直接将 v-bind 省略，简写成 `:class="imgSrc"`



## 案例：幻灯图片切换



## 7. v-for

根据 Vue 中实例中的数据生成列表结构，如数据中有个列表：

~~~json
data: {
  arr: ["北京", "天津", "上海", "深圳"]
}
~~~



~~~html
<ul>
  <li v-for="(item, index) in arr">{{ index + 1 }} {{ item }}</li>
</ul>
~~~

> index 为可选参数，如果不用可以不写



如果数组里边的元素是对象元素，则需要使用 `.` 方法显示对象内容

~~~html
<ul>
  <li v-for="(item) in objArr">{{ item.name }}</li>
</ul>
~~~



## 8. v-on 补充

传参以及修饰符的使用，如 `.enter` 可以绑定回车键



## 9. v-model

获取和设置表单元素的值（双向数据绑定）



## 案例：toDoList



## 三、axios

## 1. 基本语法

导包

~~~html
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
~~~



用法：

GET 请求

~~~js
axios.get(url?key=value&key2=value2).then(function(response){
	console.log(response)  
}, function(err){
  if (err) {
    console.log("出现错误")
  }
})
~~~



POST 请求：

~~~js
axios.post(url, {key=value&key2=value2}).then(function(response){
	console.log(response)  
}, function(err){
  if (err) {
    console.log("出现错误")
  }
})
~~~



## 2. axios + vue



