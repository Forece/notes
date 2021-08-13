# Jquery 简介

## 1. Javascript 库概念

JavaScript开发的过程中，处理浏览器的兼容很复杂而且很耗时，于是一些封装了这些操作的库应运而生。这些库还会把一些常用的代码进行封装。把一些常用到的方法写到一个单独的js文件，使用的时候直接去引用这js文件就可以了。（animate.js、common.js）

常见的 JavaScript 库：

- jQuery（常用）
- Prototype
- MooTool

jQuery其实就是一个js文件，里面封装了一大堆的方法方便我们的开发，其实就是一个加强版的 common.js，因此我们学习jQuery，其实就是学习jQuery这个js文件中封装的一大堆方法。



## 2. jQuery的特性

jQuery 设计的宗旨是 'Write Less，Do More'，即倡导写更少的代码，做更多的事情。它封装 JavaScript 常用的功能代码，提供一种简便的操作，优化HTML文档操作、事件处理、动画设计和Ajax交互。



jQuery的核心特性可以总结为：

- 具有独特的链式语法和短小清晰的多功能接口；
- 具有高效灵活的css选择器
- 并且可对CSS选择器进行扩展；
- 拥有便捷的插件扩展机制和丰富的插件
- jQuery兼容各种主流浏览器。
- 极大地简化了 JavaScript 编程。



## 3. jQuery的版本

jQuery版本有很多，分为 1.x、2.x、 3.x

- 1.x 版本：能够兼容 IE6, 7, 8 浏览器
- 2.x 版本：不兼容 IE6, 7, 8 浏览器
- 3.x版本：不兼容 IE6, 7, 8，更加的精简（在国内不流行，因为国内使用 jQuery 的主要目的就是兼容 IE6, 7, 8）

> 1.x 和 2.x 版本 jquery 都不再更新版本了，现在只更新3.x版本



## 4. 下载 jQuery

官网：https://jquery.com/

- production （压缩过的版本，体积小，上线用）
- develepment（未压缩版本，开发时使用，适合查找）



## 5. 使用 jQuery

在页面中引入 jQuery 库

~~~html
<script src="./jquery-3.6.0.js"></script>
~~~



在 script 标签中使用 jquery 语法即可，如：

~~~html
<div>Content</div>
<script src="./jquery-3.6.0.js"></script>
<script>
    $('div').hide();
</script>
~~~



## 6. 入口函数

一般代码写在页面底部，等元素加载完，才能执行 jQuery 代码，或者可以使用下方入口函数解决

~~~html
<script src="./jquery-3.6.0.js"></script>
<script>
    $(document).ready(function () {
        //
    });
</script>
~~~

> 等待页面 DOM 加载完毕后执行，相当于原生 js 中 DOMContentLoaded



或

~~~html
<script src="./jquery-3.6.0.js"></script>
<script>
    $(function(){
        //
    })
</script>
~~~



或

~~~html
<script src="./jquery-3.6.0.js"></script>
<script>
    $().ready(function() {
		//
    });
</script>
~~~



jQuery 入口函数与 window.onload 的对比

- JavaScript 的入口函数要等到页面中所有资源（包括图片、文件）加载完成才开始执行。
- jQuery 的入口函数只会等待文档树加载完成就开始执行，并不会等待图片、文件的加载。



## 7. jQuery 顶级对象

jQuery 中的顶级对象是 `$` 或 `jQuery` ，一般用于：

- 获取 jquery 对象
- 入口函数
- 高级功能



注意： $ 是 JQuery 的别称，本身为同一对象，有些页面使用 $ 符号有冲突的情况下，可以使用 jQuery 代替，如：

~~~js
jQuery(document).ready(function(){
	//
})
~~~

> 一般情况通常直接使用 $



# 选择器

jQuery 选择器是 jQuery 为我们提供的一组方法，让我们更加方便的获取到页面中的元素



## 1. 基本选择器

| 名称       | 用法                      | 描述                                          |
| ---------- | ------------------------- | :-------------------------------------------- |
| ID选择器   | $('#id');                 | 获取指定ID的元素                              |
| 类选择器   | $('.class');              | 获取同一类class的元素                         |
| 标签选择器 | $('div');                 | 获取同一类标签的所有元素                      |
| 并集选择器 | $('div,p,li');            | 使用逗号分隔，只要符合条件之一就可。          |
| 交集选择器 | $('div.redClass');        | 获取class为redClass的div元素                  |
| 属性选择器 | $('input[name=username]') | 获取 input 标签中 name 属性为 username 的元素 |

注意：jQuery选择器返回的是jQuery对象。



~~~html
<script type="text/javascript">
	//常用选择器
	//根据id获取元素 获取到的结果：类数组对象
	console.log( $('#div0') );
	console.log( $('#div0')[0] );
	//根据class获取元素
	console.log( $('.div_1') );
	//根据标签名称来获取元素
	console.log( $('div') );
	//根据属性获取元素
	console.log( $('input[name=username]') );
	//根据表单元素属性获取元素
	console.log( $(':checked') );
</script>
~~~





## 2. 层级选择器

| 名称       | 用法          | 描述                                                         |
| ---------- | ------------- | :----------------------------------------------------------- |
| 子代选择器 | $('ul > li'); | 使用 > 号，获取儿子层级的元素，注意，并不会获取孙子层级的元素 |
| 后代选择器 | $('ul li');   | 使用空格，代表后代选择器，获取ul下的所有li元素，包括孙子等   |



## 3. 过滤选择器

这类选择器都带冒号:

| 名称         | 用法                               | 描述                                                        |
| ------------ | ---------------------------------- | :---------------------------------------------------------- |
| :eq（index） | $('li:eq(2)').css('color', 'red'); | 获取到的li元素中，选择索引号为2的元素，索引号index从0开始。 |
| :odd         | $('li:odd').css('color', 'red');   | 获取到的li元素中，选择索引号为奇数的元素                    |
| :even        | $('li:even').css('color', 'red');  | 获取到的li元素中，选择索引号为偶数的元素                    |



## 4. jQuery 筛选方法

- 筛选选择器的功能与过滤选择器有点类似，但是用法不一样，筛选选择器主要是方法。

| 名称               | 用法                        | 描述                             |
| ------------------ | --------------------------- | :------------------------------- |
| children(selector) | $('ul').children('li')      | 相当于$('ul>li')，子类选择器     |
| find(selector)     | $('ul').find('li');         | 相当于$('ul li'),后代选择器      |
| siblings(selector) | $('#first').siblings('li'); | 查找兄弟节点，不包括自己本身。   |
| parent()           | $('#first').parent();       | 查找父亲                         |
| parents()          | $('li').parents();          | 查找祖先元素                     |
| eq(index)          | $('li').eq(2);              | 相当于$('li:eq(2)'),index从0开始 |
| next()             | $('li').next()              | 找下一个兄弟                     |
| prev()             | $('li').prev()              | 找上一次兄弟                     |
| closest            | $('li').closest('ul')       | 找最近一个祖先元素               |



## 5. this 和 当前索引

在对象的事件中，$(this) 表示当前操作的 jQuery 对象，$(this).index() 表示当前元素的索引号

~~~js
$("li").click(function () {
	console.log($(this).index());
}
~~~



## 案例：下拉菜单

~~~html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }

      li {
        list-style-type: none;
      }

      a {
        text-decoration: none;
        font-size: 14px;
      }

      .nav {
        margin: 100px;
      }

      .nav > li {
        position: relative;
        float: left;
        width: 80px;
        height: 41px;
        text-align: center;
      }

      .nav li a {
        display: block;
        width: 100%;
        height: 100%;
        line-height: 41px;
        color: #333;
      }

      .nav > li > a:hover {
        background-color: #eee;
      }

      .nav ul {
        display: none;
        position: absolute;
        top: 41px;
        left: 0;
        width: 100%;
        border-left: 1px solid #fecc5b;
        border-right: 1px solid #fecc5b;
      }

      .nav ul li {
        border-bottom: 1px solid #fecc5b;
      }

      .nav ul li a:hover {
        background-color: #fff5da;
      }
    </style>
  </head>
  <body>
    <ul class="nav">
      <li>
        <a href="#">微博</a>
        <ul>
          <li><a href="#">下拉菜单</a></li>
          <li><a href="#">下拉菜单</a></li>
          <li><a href="#">下拉菜单</a></li>
        </ul>
      </li>
      <li>
        <a href="#">微博</a>
        <ul>
          <li><a href="#">下拉菜单</a></li>
          <li><a href="#">下拉菜单</a></li>
          <li><a href="#">下拉菜单</a></li>
        </ul>
      </li>
      <li>
        <a href="#">微博</a>
        <ul>
          <li><a href="#">下拉菜单</a></li>
          <li><a href="#">下拉菜单</a></li>
          <li><a href="#">下拉菜单</a></li>
        </ul>
      </li>
    </ul>
    <script src="./jquery-3.6.0.js"></script>
    <script>
      $(function () {
        // 鼠标经过
        $(".nav>li").mouseover(function () {
          // 显示元素（this 表示当前元素）
          $(this).children("ul").show();
        });

        // 鼠标离开
        $(".nav>li").mouseout(function () {
          $(this).children("ul").hide();
        });
      });
    </script>
  </body>
</html>

~~~



## 案例：排他思想

~~~html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="jquery.min.js"></script>
</head>

<body>
    <button>快速</button>
    <button>快速</button>
    <button>快速</button>
    <button>快速</button>
    <button>快速</button>
    <button>快速</button>
    <button>快速</button>
    <script>
        $(function() {
            // 1. 隐式迭代 给所有的按钮都绑定了点击事件
            $("button").click(function() {
                // 2. 当前的元素变化背景颜色
                $(this).css("background", "pink");
                // 3. 其余的兄弟去掉背景颜色 隐式迭代
                $(this).siblings("button").css("background", "");
            });
        })
    </script>
</body>

</html>
~~~



链式编程

~~~js
$(this).css("color", "red").siblings().css("color", "");
~~~









# jQuery 对象和 Dom 对象

## 1. jQuery 和 Dom 对象的区别

用原生 JavaScript 获取的 DOM 对象

~~~js
document.getElementById()			// 返回的是 DOM 对象
document.getElementsByTagName()		// 伪数组集合，集合中每一个对象是 DOM 对象
~~~



jQuery 获取的对象为 jQuery 对象

~~~js
$('div')		// 返回 jQuery 对象
~~~



当不止一个 div 元素时，返回的是一个 jQuery 对象集合

~~~html
<div>1</div>
<div>2</div>
<script>
    console.log($('div'));
</script>
~~~



jQuery 对象不能使用 DOM 对象的成员，DOM 对象不能使用 jQuery 对象的成员



## 2. jQuery 对象和 DOM 对象的相互转换

jQuery 对象转换成 DOM 对象

~~~
jQuery对象.get(索引值)
jQuery对象[索引值]
~~~



例：

~~~html
<video src="mov.mp4" muted></video>
    <script src="./jquery-3.6.0.js"></script>
    <script>
        // 获取 jQuery 对象中没有 play 这个方法
        // $('video').play();

        // 将 jQuery 对象转换为 DOM 对象
        $('video')[0].play()
        $('video').get(0).play()
    </script>
~~~



DOM 对象转换成 jQuery 对象：

~~~
$(DOM对象)
~~~



例：

~~~html
<div id='tag'>Content</div>
<script src="./jquery-3.6.0.js"></script>
<script>
    var tag = document.getElementById('tag');
    $(tag).css('color','red')
</script>
~~~



# 事件绑定

所有 js 事件在 jquery 中都是 jquery 对象的方法

~~~
click(handler)			单击事件
mouseover(handler)		鼠标悬浮事件
mouseout(handler)		鼠标离开事件
...
~~~



例：

~~~html
<input type="button" value="我是一个按钮" id="btn">
<script>
	$(function(){
    	$('#btn').click(function(){
            alert("来了老弟~");
        });
	});	  
</script>
~~~

> 绑定事件时，jquery对象中有多个dom元素，则自动给所有元素均绑定事件。



# jQuery 操作属性

## 1. attr 操作

设置单个属性  attribute

~~~js
// 第一个参数：需要设置的属性名
// 第二个参数：对应的属性值
// $obj.attr(name, value);
// 用法举例
$('img').attr('title','哎哟，不错哦');
$('img').attr('alt','哎哟，不错哦');
~~~



设置多个属性

~~~js
// 参数是一个对象，包含了需要设置的属性名和属性值
// $obj.attr(obj)
// 用法举例
$('img').attr({
    title:'哎哟，不错哦',
    alt:'哎哟，不错哦',
    style:'opacity:.5'
});
~~~



获取属性

~~~js
// 传需要获取的属性名称，返回对应的属性值
// $obj.attr(name)
// 用法举例
var oTitle = $('img').attr('title');
alert(oTitle);
~~~



移除属性

```javascript
// 参数：需要移除的属性名，
// $obj.removeAttr(name);
// 用法举例
$('img').removeAttr('title');
```



## 2. prop 操作

prop 操作也可以获取或设置元素属性值

~~~js
$('a').prop('href')								// 获取属性
$('a').prop('href','http://www.baidu.com')		// 设置属性
~~~



在 jQuery1.6 之后支持，对于 checked、selected、disabled 这类 boolean 类型的属性来说，不能用attr方法，只能用prop方法。

~~~js
// 设置属性
$(':checked').prop('checked',true);
// 获取属性
$(':checked').prop('checked');	// 返回true或者false
~~~



注意：元素的自定义属性无法通过 porp() 方法获取，如：

~~~html
<div index="1"></div>		// 自定义 index 属性无法被 prop() 获取
~~~

> 可以用 attr() 来获取



## 3. val()/text()/html()值操作

~~~js
$obj.val()		获取或者设置表单元素的value属性的值
$obj.html() 	对应innerHTML
$obj.text()		对应innerText
~~~

> 以上三个方法：不传参数表示获取值； 传递一个参数值，表示设置



## 4. class 操作

添加样式类

```javascript
// name：需要添加的样式类名，注意参数不要带点.
// $obj.addClass(name);
// 例子,给所有的div添加one的样式。
$('div').addClass('one');
```

> 追加 class，不会影响原本的 class 样式



移除样式类

```javascript
// name:需要移除的样式类名
// $obj.removeClass('name');
// 例子，移除div中one的样式类名
$('div').removeClass('one');
```



判断是否有某个样式类

```javascript
// name:用于判断的样式类名，返回值为true false
// $obj.hasClass(name)
// 例子，判断第一个div是否有one的样式类
$('div').hasClass('one');
```



切换样式类

```javascript
// name:需要切换的样式类名，如果有，移除该样式，如果没有，添加该样式。
// $obj.toggleClass(name);
// 例子
$('div').toggleClass('one');
```



## 5. 隐式迭代(批量操作自动遍历)

1. 设置操作的时候（绑定事件），如果是多个元素，那么给所有的元素设置相同的值
2. 获取操作的时候，如果是多个元素，那么只会返回第一个元素的值。
3. 如果想要获取多个值，需要手动进行遍历操作。



## 案例：Tab 栏

1. 点击 li 获取 index
2. 添加 current 类，移除兄弟类
3. 显示 div 内容，其他隐藏



~~~html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }

      li {
        list-style-type: none;
      }

      .tab {
        width: 978px;
        margin: 100px auto;
      }

      .tab_list {
        height: 39px;
        border: 1px solid #ccc;
        background-color: #f1f1f1;
      }

      .tab_list li {
        float: left;
        height: 39px;
        line-height: 39px;
        padding: 0 20px;
        text-align: center;
        cursor: pointer;
      }

      .tab_list .current {
        background-color: #c81623;
        color: #fff;
      }

      .item_info {
        padding: 20px 0 0 20px;
      }

      .item {
        display: none;
      }
    </style>
    <script src="jquery.min.js"></script>
  </head>

  <body>
    <div class="tab">
      <div class="tab_list">
        <ul>
          <li class="current">商品介绍</li>
          <li>规格与包装</li>
          <li>售后保障</li>
          <li>商品评价（50000）</li>
          <li>手机社区</li>
        </ul>
      </div>
      <div class="tab_con">
        <div class="item" style="display: block">商品介绍模块内容</div>
        <div class="item">规格与包装模块内容</div>
        <div class="item">售后保障模块内容</div>
        <div class="item">商品评价（50000）模块内容</div>
        <div class="item">手机社区模块内容</div>
      </div>
    </div>
    <script>
      $(function () {
        // 1.点击上部的li，当前li 添加current类，其余兄弟移除类
        $(".tab_list li").click(function () {
          // 链式编程操作
          $(this).addClass("current").siblings().removeClass("current");
          // 2.点击的同时，得到当前li 的索引号
          var index = $(this).index();
          console.log(index);
          // 3.让下部里面相应索引号的item显示，其余的item隐藏
          $(".tab_con .item").eq(index).show().siblings().hide();
        });
      });
    </script>
  </body>
</html>

~~~



## 案例：购物车

~~~js
$(function() {
    // 1. 全选 全不选功能模块
    // 就是把全选按钮（checkall）的状态赋值给 三个小的按钮（j-checkbox）就可以了
    // 事件可以使用change
    $(".checkall").change(function() {
        // console.log($(this).prop("checked"));
        $(".j-checkbox, .checkall").prop("checked", $(this).prop("checked"));
        if ($(this).prop("checked")) {
            // 让所有的商品添加 check-cart-item 类名
            $(".cart-item").addClass("check-cart-item");
        } else {
            // check-cart-item 移除
            $(".cart-item").removeClass("check-cart-item");
        }
    });
    // 2. 如果小复选框被选中的个数等于3 就应该把全选按钮选上，否则全选按钮不选。
    $(".j-checkbox").change(function() {
        // if(被选中的小的复选框的个数 === 3) {
        //     就要选中全选按钮
        // } else {
        //     不要选中全选按钮
        // }
        // console.log($(".j-checkbox:checked").length);
        // $(".j-checkbox").length 这个是所有的小复选框的个数
        if ($(".j-checkbox:checked").length === $(".j-checkbox").length) {
            $(".checkall").prop("checked", true);
        } else {
            $(".checkall").prop("checked", false);
        }
        if ($(this).prop("checked")) {
            // 让当前的商品添加 check-cart-item 类名
            $(this).parents(".cart-item").addClass("check-cart-item");
        } else {
            // check-cart-item 移除
            $(this).parents(".cart-item").removeClass("check-cart-item");
        }
    });
    // 3. 增减商品数量模块 首先声明一个变量，当我们点击+号（increment），就让这个值++，然后赋值给文本框。
    $(".increment").click(function() {
        // 得到当前兄弟文本框的值
        var n = $(this).siblings(".itxt").val();
        // console.log(n);
        n++;
        $(this).siblings(".itxt").val(n);
        // 3. 计算小计模块 根据文本框的值 乘以 当前商品的价格  就是 商品的小计
        // 当前商品的价格 p  
        var p = $(this).parents(".p-num").siblings(".p-price").html();
        // console.log(p);
        p = p.substr(1);
        console.log(p);
        var price = (p * n).toFixed(2);
        // 小计模块 
        // toFixed(2) 可以让我们保留2位小数
        $(this).parents(".p-num").siblings(".p-sum").html("￥" + price);
        getSum();
    });
    $(".decrement").click(function() {
        // 得到当前兄弟文本框的值
        var n = $(this).siblings(".itxt").val();
        if (n == 1) {
            return false;
        }
        // console.log(n);
        n--;
        $(this).siblings(".itxt").val(n);
        // var p = $(this).parent().parent().siblings(".p-price").html();
        // parents(".p-num") 返回指定的祖先元素
        var p = $(this).parents(".p-num").siblings(".p-price").html();
        // console.log(p);
        p = p.substr(1);
        console.log(p);
        // 小计模块 
        $(this).parents(".p-num").siblings(".p-sum").html("￥" + (p * n).toFixed(2));
        getSum();
    });
    //  4. 用户修改文本框的值 计算 小计模块  
    $(".itxt").change(function() {
        // 先得到文本框的里面的值 乘以 当前商品的单价 
        var n = $(this).val();
        // 当前商品的单价
        var p = $(this).parents(".p-num").siblings(".p-price").html();
        // console.log(p);
        p = p.substr(1);
        $(this).parents(".p-num").siblings(".p-sum").html("￥" + (p * n).toFixed(2));
        getSum();
    });
    // 5. 计算总计和总额模块
    getSum();

    function getSum() {
        var count = 0; // 计算总件数 
        var money = 0; // 计算总价钱
        $(".itxt").each(function(i, ele) {
            count += parseInt($(ele).val());
        });
        $(".amount-sum em").text(count);
        $(".p-sum").each(function(i, ele) {
            money += parseFloat($(ele).text().substr(1));
        });
        $(".price-sum em").text("￥" + money.toFixed(2));
    }
    // 6. 删除商品模块
    // (1) 商品后面的删除按钮
    $(".p-action a").click(function() {
        // 删除的是当前的商品 
        $(this).parents(".cart-item").remove();
        getSum();
    });
    // (2) 删除选中的商品
    $(".remove-batch").click(function() {
        // 删除的是小的复选框选中的商品
        $(".j-checkbox:checked").parents(".cart-item").remove();
        getSum();
    });
    // (3) 清空购物车 删除全部商品
    $(".clear-all").click(function() {
        $(".cart-item").remove();
        getSum();
    })
})
~~~





# jQuery 操作样式

## 1. CSS 操作

设置或者修改样式，操作的是 style 属性

操作单个样式

```javascript
// name：需要设置的样式名称
// value：对应的样式值
// $obj.css(name, value);
// 使用案例
$('#one').css('background','gray');// 将背景色修改为灰色
```



设置多个样式

```javascript
// 参数是一个对象，对象中包含了需要设置的样式名和样式值
// $obj.css(obj);
// 使用案例
$('#one').css({
    'background':'gray',
    'width':'400px',
    'height':'200px'
});
```



获取样式

```javascript
// name:需要获取的样式名称
// $obj.css(name);
// 案例
$('div').css('background-color');
```

> 注意：获取样式操作只会返回第一个元素对应的样式值。



## 2. jQuery 尺寸和位置操作

width 方法与 height 方法，设置或者获取高度，不包括内边距、边框和外边距

~~~js
// 带参数表示设置高度
$('img').height(200);
// 不带参数获取高度
$('img').height();
~~~

> 传参时可以不用带 px 单位



获取网页的可视区宽高

~~~js
// 获取可视区宽度
$(window).width();
// 获取可视区高度
$(window).height();
~~~



innerWidth/innerHeight/outerWidth/outerHeight

~~~js
innerWidth()/innerHeight()	方法返回元素的宽度/高度（包括内边距）。
outerWidth()/outerHeight()  方法返回元素的宽度/高度（包括内边距和边框）。
outerWidth(true)/outerHeight(true)  方法返回元素的宽度/高度（包括内边距、边框和外边距）。
~~~



scrollTop 与 scrollLeft

设置或者获取垂直滚动条的位置

~~~js
// 获取页面被卷曲的高度
$(window).scrollTop();
// 获取页面被卷曲的宽度
$(window).scrollLeft();
~~~



offset 方法与 position 方法

offset 方法获取元素距离 document 的位置，position 方法获取的是元素距离有定位的父元素 (offsetParent) 的位置。

~~~js
// 获取元素距离document的位置,返回值为对象：{left:100, top:100}
$(selector).offset();
// 获取相对于其最近的有定位的父元素的位置。
$(selector).position();
~~~



## 案例：回到顶部

~~~html
~~~





# 遍历操作

jQuery 的隐式迭代会对所有的 DOM 对象设置相同的值，但是如果我们需要给每一个对象设置不同的值的时候，就需要自己进行迭代了。

~~~js
// 函数中的参数
// 参数一表示当前元素在所有匹配元素中的索引号
// 参数二表示当前元素（DOM对象）
$(selector).each(function(index,element){});

$.each(数组或对象, function(index, value){});
~~~

> 遍历的元素是 DOM 元素，如果想用 jquery 方法，需要做转换



例：

~~~html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="./jquery.min.js"></script>
    <title>Document</title>
  </head>
  <body>
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <script>
      $("div").each(function (index, domEle) {
        var arr = ["red", "blue", "pink"];
        $(domEle).css("color", arr[index]);
      });
    </script>
  </body>
</html>

~~~





# 事件机制

JavaScript中已经学习过了事件，jQuery对JavaScript事件进行了封装，增加并扩展了事件处理机制。jQuery不仅提供了更加优雅的事件处理语法，而且极大的增强了事件的处理能力。



## 1. jQuery事件发展历程

- 简单事件绑定
- bind事件绑定
- delegate事件绑定
- on事件绑定(推荐)



简单事件注册

~~~js
click(handler)			单击事件
mouseenter(handler)		鼠标进入事件
mouseleave(handler)		鼠标离开事件
mouseover
mouseout
blur
focus
change
keydown
keyup
resize
scroll
~~~



bind方式注册事件（不用）

~~~js
// 第一个参数：事件类型
// 第二个参数：事件处理程序
$('p').bind('click mouseenter', function(){
    // 事件响应方法
});
~~~



delegate注册委托事件（不用）

~~~js
// 第一个参数：selector，要绑定事件的元素
// 第二个参数：事件类型
// 第三个参数：事件处理函数
$('.parentBox').delegate('p', 'click', function(){
    // 为 .parentBox下面的所有的p标签绑定事件
});
~~~



## 2. on 注册事件

- jQuery1.7 之后，jQuery 用 on 统一了所有事件的处理方法。
- 强烈建议使用。



on 注册简单事件

```javascript
// 表示给$(selector)绑定事件，并且由自己触发，不支持动态绑定。
$(selector).on( 'click', function() {});
```



on 注册事件委托

```javascript
// 表示给$(selector)绑定代理事件，当必须是它的内部元素 span 才能触发这个事件，支持动态绑定
$(selector).on( 'click','span', function() {});
```



on 注册事件的语法：

```javascript
// 第一个参数：events，绑定事件的名称可以是由空格分隔的多个事件（标准事件或者自定义事件）
// 第二个参数：selector, 执行事件的后代元素（可选），如果没有后代元素，那么事件将由自己执行。
// 第三个参数：data，传递给处理函数的数据，事件触发的时候通过event.data来使用（不常使用）
// 第四个参数：handler，事件处理函数
$(selector).on(events[,selector][,data],handler);
```



多个处理

~~~js
$("div").on({
    mouseover: function(){	 };
    click: function() {  };
})
~~~



多个处理统一处理

~~~html
<script>
    $("div").on("mouseover mouseout", function () {
        $(this).toggleClass("current");
    });
</script>
~~~



绑定一次性事件

~~~js
$('div').one('click', function() {})
~~~





## 3. 事件解绑

unbind方式（不用）

```javascript
$(selector).unbind(); // 解绑所有的事件
$(selector).unbind('click'); // 解绑指定的事件
```



undelegate方式（不用）

```javascript
$( selector ).undelegate(); // 解绑所有的delegate事件
$( selector).undelegate( 'click' ); // 解绑所有的click事件
```



off方式（推荐）

```javascript
// 解绑匹配元素的所有事件
$(selector).off();
// 解绑匹配元素的所有click事件
$(selector).off('click');
```



## 4. 触发事件

```javascript
$(selector).click(); 						// 触发 click事件
$(selector).trigger('click');
$(selector).triggerhanddler('click');		// 不会触发元素的默认行为
```





## 5. jQuery事件对象

jQuery事件对象其实就是js事件对象的一个封装，处理了兼容性。



~~~html
<div></div>
<script>
    $("div").on("click", function (e) {
        console.log(e);
    });
</script>
~~~



```javascript
// screenX和screenY			对应屏幕最左上角的值
// clientX和clientY			距离页面左上角的位置（忽视滚动条）
// pageX和pageY				距离页面最顶部的左上角的位置（会计算滚动条的距离）
// event.keyCode			按下的键盘代码
// event.data				存储绑定事件时传递的附加数据
// event.stopPropagation()	阻止事件冒泡行为
// event.preventDefault()	阻止浏览器默认行为
// return false:			既能阻止事件冒泡，又能阻止浏览器默认行为。
```



## 6. 事件委托

当父元素事件被触发，执行子元素的事件

~~~js
$("ul").on("click", "li", function(){
  //  
})
~~~

> 对 ul 进行 click 触发 li 事件



例：对动态创建的元素进行操作

~~~html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="./jquery.min.js"></script>
    <title>Document</title>
  </head>
  <body>
    <ol>
      <li>x</li>
      <li>y</li>
      <li>z</li>
    </ol>
    <script>
      var li = $("<li></li>");
      $("ol").append(li);
      $("ol").on("click", "li", function () {
        alert("li");
      });
    </script>
  </body>
</html>

~~~





# 动画效果

jQuery提供了三组基本动画，这些动画都是标准的、有规律的效果，jQuery还提供了自定义动画的功能。



## 1. 基本动画

- 显示(show)与隐藏(hide)与切换(toggle)是一组动画：
- 滑入(slideUp)与滑出(slideDown)与切换(slideToggle)，效果与卷帘门类似
- 淡入(fadeIn)与淡出(fadeOut)与切换(fadeToggle)



```javascript
$obj.show([speed], [callback]);
// speed(可选)：动画的执行时间
	 // 1.如果不传，就没有动画效果。如果是slide和fade系列，会默认为normal
	 // 2.毫秒值(比如1000),动画在1000毫秒执行完成(推荐)
     // 3.固定速度字符串，slow(200)、normal(400)、fast(600)，如果传其他字符串，则默认为normal。
// callback(可选):执行完动画后执行的回调函数

slideDown()/slideUp()/slideToggle();同理
fadeIn()/fadeOut();fadeToggle();同理

$('img').show(2000);
```



fadeTo 淡入淡出到指定透明度

```javascript
$obj.fadeTo(speed, opacity, callback)
$('img').fadeTo(1000, 0.5);
```



## 2. 自定义动画

animate: 自定义动画

```javascript
$(selector).animate({params},[speed],[easing],[callback]);
// {params}：要执行动画的CSS属性，带数字（必选）
// speed：执行动画时长（可选）
// easing:执行效果，默认为swing（缓动）  可以是linear（匀速）
// callback：动画执行完后立即执行的回调函数（可选）
```



## 3. 动画队列与停止动画

在同一个元素上执行多个动画，那么对于这个动画来说，后面的动画会被放到动画队列中，等前面的动画执行完成了才会执行（联想：火车进站）。

```javascript
// stop方法：停止动画效果
stop(clearQueue, jumpToEnd);
// 第一个参数：是否清除队列
// 第二个参数：是否跳转到最终效果
```



延迟动画：delay方法

```
$obj.delay(2000).show(200); //延迟后续的动画
```



## 案例：基本动画展示

**show(), hide(), toggle() 演示**

~~~html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <style>
      div {
        width: 150px;
        height: 300px;
        background-color: pink;
      }
    </style>
    <script src="jquery.min.js"></script>
  </head>

  <body>
    <button>显示</button>
    <button>隐藏</button>
    <button>切换</button>
    <div></div>
    <script>
      $(function () {
        $("button")
          .eq(0)
          .click(function () {
            $("div").show(1000, function () {});
          });
        $("button")
          .eq(1)
          .click(function () {
            $("div").hide(1000, function () {});
          });
        $("button")
          .eq(2)
          .click(function () {
            $("div").toggle(1000);
          });
        // 一般情况下，我们都不加参数直接显示隐藏就可以了
      });
    </script>
  </body>
</html>

~~~



滑动效果

~~~html
<script>
    $(function() {
        // 鼠标经过
        // $(".nav>li").mouseover(function() {
        //     // $(this) jQuery 当前元素  this不要加引号
        //     // show() 显示元素  hide() 隐藏元素
        //     $(this).children("ul").slideDown(200);
        // });
        // // 鼠标离开
        // $(".nav>li").mouseout(function() {
        //     $(this).children("ul").slideUp(200);
        // });
        // 1. 事件切换 hover 就是鼠标经过和离开的复合写法
        // $(".nav>li").hover(function() {
        //     $(this).children("ul").slideDown(200);
        // }, function() {
        //     $(this).children("ul").slideUp(200);
        // });
        // 2. 事件切换 hover  如果只写一个函数，那么鼠标经过和鼠标离开都会触发这个函数
        $(".nav>li").hover(function() {
            // stop 方法必须写到动画的前面
            $(this).children("ul").stop().slideToggle();
        });
    })
</script>
~~~

> 动画或者效果一旦触发就会执行，如果多次触发，就造成多个动画或者效果排队执行，使用 stop() 方法用于停止动画或效果，必须将 stop() 方法写到动画或效果的前边（相当于停止结束上一次动画）



淡入淡出效果

~~~html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <style>
      div {
        width: 150px;
        height: 300px;
        background-color: pink;
        display: none;
      }
    </style>
    <script src="jquery.min.js"></script>
  </head>

  <body>
    <button>淡入效果</button>
    <button>淡出效果</button>
    <button>淡入淡出切换</button>
    <button>修改透明度</button>
    <div></div>
    <script>
      $(function () {
        $("button")
          .eq(0)
          .click(function () {
            // 淡入 fadeIn()
            $("div").fadeIn(1000);
          });
        $("button")
          .eq(1)
          .click(function () {
            // 淡出 fadeOut()
            $("div").fadeOut(1000);
          });
        $("button")
          .eq(2)
          .click(function () {
            // 淡入淡出切换 fadeToggle()
            $("div").fadeToggle(1000);
          });
        $("button")
          .eq(3)
          .click(function () {
            //  修改透明度 fadeTo() 这个速度和透明度要必须写
            $("div").fadeTo(1000, 0.5);
          });
      });
    </script>
  </body>
</html>

~~~



## 案例：王者荣耀手风琴案例

~~~html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>手风琴案例</title>

    <style type="text/css">
      * {
        margin: 0;
        padding: 0;
      }

      img {
        display: block;
      }

      ul {
        list-style: none;
      }

      .king {
        width: 852px;
        margin: 100px auto;
        background: url(images/bg.png) no-repeat;
        overflow: hidden;
        padding: 10px;
      }

      .king ul {
        overflow: hidden;
      }

      .king li {
        position: relative;
        float: left;
        width: 69px;
        height: 69px;
        margin-right: 10px;
      }

      .king li.current {
        width: 224px;
      }

      .king li.current .big {
        display: block;
      }

      .king li.current .small {
        display: none;
      }

      .big {
        width: 224px;
        display: none;
      }

      .small {
        position: absolute;
        top: 0;
        left: 0;
        width: 69px;
        height: 69px;
        border-radius: 5px;
      }
    </style>
  </head>

  <body>
    <script src="js/jquery.min.js"></script>
    <script type="text/javascript">
      $(function () {
        // 鼠标经过某个小li 有两步操作：
        $(".king li").mouseenter(function () {
          // 1.当前小li 宽度变为 224px， 同时里面的小图片淡出，大图片淡入
          $(this)
            .stop()
            .animate({
              width: 224,
            })
            .find(".small")
            .stop()
            .fadeOut()
            .siblings(".big")
            .stop()
            .fadeIn();
          // 2.其余兄弟小li宽度变为69px， 小图片淡入， 大图片淡出
          $(this)
            .siblings("li")
            .stop()
            .animate({
              width: 69,
            })
            .find(".small")
            .stop()
            .fadeIn()
            .siblings(".big")
            .stop()
            .fadeOut();
        });
      });
    </script>
    <div class="king">
      <ul>
        <li class="current">
          <a href="#">
            <img src="images/m1.jpg" alt="" class="small" />
            <img src="images/m.png" alt="" class="big" />
          </a>
        </li>
        <li>
          <a href="#">
            <img src="images/l1.jpg" alt="" class="small" />
            <img src="images/l.png" alt="" class="big" />
          </a>
        </li>
        <li>
          <a href="#">
            <img src="images/c1.jpg" alt="" class="small" />
            <img src="images/c.png" alt="" class="big" />
          </a>
        </li>
        <li>
          <a href="#">
            <img src="images/w1.jpg" alt="" class="small" />
            <img src="images/w.png" alt="" class="big" />
          </a>
        </li>
        <li>
          <a href="#">
            <img src="images/z1.jpg" alt="" class="small" />
            <img src="images/z.png" alt="" class="big" />
          </a>
        </li>
        <li>
          <a href="#">
            <img src="images/h1.jpg" alt="" class="small" />
            <img src="images/h.png" alt="" class="big" />
          </a>
        </li>
        <li>
          <a href="#">
            <img src="images/t1.jpg" alt="" class="small" />
            <img src="images/t.png" alt="" class="big" />
          </a>
        </li>
      </ul>
    </div>
  </body>
</html>

~~~





# 节点操作

## 1. 创建节点 

创建节点很简单，直接使用 `$(html字符串)` 就是一个新的节点，如：

```javascript
var span = $('<span>这是一个span元素</span>');
```



## 2. 添加节点

```javascript
append(节点)  	// 添加在内部元素之后
prepend(节点) 	// 添加在内部元素之前
before(节点)	 	// 添加在兄弟元素之前
after(节点)		// 添加在兄弟元素之后
```

> 推荐记前面的一列方法 append  prepend  before  after



~~~html
<ul></ul>
<script>
    var li = $("<li>这是一个li</li>");
    $("ul").append(li);
</script>
~~~



## 3. 清空节点与删除节点

empty：清空指定节点的所有元素，自身保留(清理门户)

```javascript
$('div').empty(); // 清空div的所有内容（推荐使用，会清除子元素上绑定的事件）
$('div').html('');// 使用html方法来清空元素，不推荐使用，绑定的事件不会被清除。
```



remove：相比于empty，自身也删除（自杀）

```javascript
$('div').remove();
```



## 4. 克隆节点

作用：复制匹配的元素

```javascript
// 复制$(selector)所匹配到的元素（深度复制）
// cloneNode(true)  //原生js cloneNode 不传参数 克隆标签本身，传参数true 克隆标签本身以及内容
// 返回值为复制的新元素，和原来的元素没有任何关系了。即修改新元素，不会影响到原来的元素。
$(selector).clone();//克隆元素本身及后代
$(selector).clone(true);//克隆元素本身及后代以及绑定的事件
```



# jQuery 其他方法



## 1. 数组和对象操作

确定第一个参数在数组中首次出现的位置，从0开始计数(如果没有找到则返回 -1

~~~js
$.inArray(value, array, [fromIndex])  
~~~

- value:用于在数组中查找是否存在
- array:待处理数组。
- fromIndex:用来搜索数组队列，默认值为0。



例：

```
$.inArray(1,[1,2,3,1]);
$.inArray(1,[1,2,3,1],2);
```



把jQuery集合中所有DOM元素恢复成一个数组

~~~js
$(‘选择器’).toArray();
~~~



例：

```
$('div').toArray();
```



合并数组

~~~js
$.merge(first, second);
~~~



例：

```
$.merge([1,2,3], [4,3,2]);
```



 解析json字符串为对象，等价于 JSON.parse(str);

~~~js
$.parseJSON(str);
~~~



例：

```
$.parseJSON('{"name":"zhangfei","age":30}');
```



## 2. 字符串操作

$.trim(str) 去除字符串两边的空格， 等价于  str.trim()  

```
$.trim('  123   ');
```



## 3. 类型操作

```
$.type(obj)  判断数据类型  typeof
$.isArray(obj) 判断是否数组 obj instanceof Array
$.isFunction(obj) 判断是否函数 obj instanceof Function
$.isEmptyObject(obj) 判断是否空对象（没有成员）
$.isPlainObject(obj) 判断是否纯对象（字面量语法{}或实例化new Object() 定义的对象） 纯对象：不包括 实例化的数组对象等
$.isNumeric(obj) 判断是否数字（数字型或字符串型数字）
```



## 4. 数据缓存操作

数据缓存存放在内存中，无法在 DOM 中查看，如：

~~~js
// 设置数据缓存
$('span').data("uname", "Andy")

// 显示缓存数据
console.log($("span").data("uname"))
~~~



## 5. 拷贝对象

~~~js
$.extend([deep], target, obj1, [obj2, obj3,...])
~~~

- deep: 默认为浅拷贝，true 为深拷贝（拷贝复杂数据）
- target 要拷贝的对象
- obj1 待拷贝的第一个对象



- 浅拷贝把原来对象中的复杂数据类型地址拷贝给目标对象，修改内容会让2个元素同时发生变化
- 深拷贝则完全克隆，所有数据都在不同的内存空间



~~~
$.extend(true, targetObj, obj);
~~~



# jQuery 多库共存

有些 js 库会占用 $ 符号，除了可以使用 jQuery 替换 $ 外，还可以自定义符号，如：

~~~
var anything = $.noConfilct();
var xx = jQuery.noConfilct();
~~~



# jQuery 插件

1. jQuery 插件库：https://www.jq22.com/

2. jQuery 之家：http://www.htmleaf.com/



## 1.  jQuery插件开发语法

给 jQuery 增加方法的两种方式

```javascript
$.method = fn		静态方法
$.fn.method = fn	实例方法
$.fn.extend({})  批量扩展实例方法  参数是一个对象
```



例：增加一个静态方法，实现两个数的和

~~~js
(function ($) {
  $.add = function (a, b) {
    return a + b;
  }
})(jQuery)

$.add(5, 6);
~~~



## 2. 常用插件

- 弹出层插件 layer

  - [layer插件](https://github.com/sentsin/layer)
- 放大镜插件

  - [jQuery.zoom](http://www.jacklmoore.com/zoom/)
- 轮播图插件
  - [http://sorgalla.com/jcarousel/](http://sorgalla.com/jcarousel/)
  - [https://github.com/OwlCarousel2/OwlCarousel2](https://github.com/OwlCarousel2/OwlCarousel2)
- 图片懒加载插件

  - [jQuery.lazyload](https://github.com/tuupola/jquery_lazyload)
- jQueryUI

- 常用的2-3个功能演示

- [图片放大](https://github.com/fat/zoom.js)

- [github上搜索](http://www.github.com)

