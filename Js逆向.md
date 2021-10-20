# 验证码

云打码：http://www.yundama.com

检验验证



# 有道翻译求 sign 值

## 1. Post 请求体

通过 Chrome F12 开发者工具，进行抓包

![image-20210924155140211](images/js_reverse/image-20210924155140211.png)



经过两次 Post 数据，发现大部分值是固定的，只有 i, salt, sign, lts 是有变化的，如图：

![image-20210924154714234](images/js_reverse/image-20210924154714234.png)



## 2. 定位 sign 值在 js 中的位置

点击 Search，搜索关键字 sign

![image-20210924155257706](images/js_reverse/image-20210924155257706.png)

一般出现的代码都是经过压缩后的代码，点击花括号，可以进行代码格式化

![image-20210924155406808](images/js_reverse/image-20210924155406808.png)

通过 CTRL + F 调出查找窗口，然后定位到 sign 值定义的位置

![image-20210924155748898](images/js_reverse/image-20210924155748898.png)





## 3. 分析算法

在这里可以看到 post 请求体里边的几个异常参数，都在这里进行定义了

~~~js
var r = function(e) {
    var t = n.md5(navigator.appVersion)
    , r = "" + (new Date).getTime()
    , i = r + parseInt(10 * Math.random(), 10);
    return {
        ts: r,
        bv: t,
        salt: i,
        sign: n.md5("fanyideskweb" + e + i + "Y2FYu%TNSbMCxc3t2u^XT")
    }
};
~~~

> 返回值是一个对象



### 3.1 lts

这几个参数都是这个函数的返回值，只有 lts 没有，我们再继续搜一下 lts，发现 lts 其实就是 ts，如：

~~~json
i: n,
from: C,
to: S,
smartresult: "dict",
client: E,
salt: r.salt,
sign: r.sign,
lts: r.ts,						// lts 其实就是 r.ts
bv: r.bv,
doctype: "json",
version: "2.1",
keyfrom: "fanyi.web",
action: e || "FY_BY_DEFAULT"
~~~

> 这个其实就是最终 POST 请求体的格式，可以看到 lts 就是 r 构造函数的 ts 属性值



ts 的属性值在这个返回对象中，是 r 的值

~~~js
ts: r
~~~



其实从名字上就可以看出来，ts 一般可以看做是 timestamp 的缩写，所以应该是时间戳，并且算法中也确认了这点，r 的值就是时间戳

~~~js
r = "" + (new Date).getTime()
~~~

> 空字符串 + 数据（隐式转换为字符串类型）



所以 ts 就可以用 python 中代码获取时间戳

~~~python
import time
lts = time.time()
print(lts)
~~~



获取的结果与 POST 请求体对比

~~~
1632485372.7698803		# python 时间戳
1632484936349			# post 时间戳
~~~



相差 3 位，再处理一下，直接乘 1000 然后转换为整型

~~~python
lts = str(round(time.time() * 1000))
print(lts)
~~~

> 注意 data 里边的数据都是字符串数据，所以需要做转换



### 3.2 salt

然后再来看 salt，在返回对象中，salt 这边的值就是 i 的值

~~~json
salt:i
~~~



我们再来看 i 的值

~~~js
i = r + parseInt(10 * Math.random(), 10);
~~~



- r 时间戳
- 10* Math.random()  获取 0~9 的随机数
- parseInt(x,10) 表示以10进制进行转换



所以 i 的值应该就是

~~~
时间戳 + 0~9 的随机数
~~~



逻辑出来了，那么我们 python 的代码也就出来了

~~~python
import random
salt = lts + str(random.randint(0,9))
~~~

> 这里不是计算，而是字符串拼接



### 3.3 sign

最后看一下 sign 值，是一个 md5 加密

~~~
sign: n.md5("fanyideskweb" + e + i + "Y2FYu%TNSbMCxc3t2u^XT")
~~~



其中还有几个参数我们不清楚，如 n、e、i，



我们在函数结束处下一个断点，然后再次发送请求

![image-20210924203133861](images/js_reverse/image-20210924203133861.png)



- e 就是我们的查询数据
- i 是 salt



现在就差 n.md5 不知道是什么了，通过 md5 我们知道这应该是一个加密方法，n.md5 就是从一个实例中调用这个 md5 方法，函数的最开始，就已经定义了 n 的值，如：

~~~js
var n = e("./jquery-1.7");
~~~

> 所以说这个 md5 方法是从 jquery 中调用的



所以说不管从哪里调用，最后需要使用到 md5 加密，最后 python 加密一下

~~~python
import hashlib
# 构造需要加密的字符串
sign_string = "fanyideskweb" + i + salt + "Y2FYu%TNSbMCxc3t2u^XT"
# 创建实例
hl = hashlib.md5()
# 进行 MD5 加密
hl.update(sign_string.encode(encoding='utf-8'))
# 打印字符串
print(hl.hexdigest())
sign = hl.hexdigest()
~~~



## 4. 完整代码

最后注意 header，里边需要 Cookie, Host, Orign, Referer, User-Agent 几个参数，否则会报错，至于 Cookie 可以使用 Session 自动获取，这里就不演示了。

~~~python
import requests
import json
import time
import random
import hashlib


url = "https://fanyi.youdao.com/translate_o?smartresult=dict&smartresult=rule"

headers = {
"Cookie": 'OUTFOX_SEARCH_USER_ID_NCOO=1820968217.8093007; OUTFOX_SEARCH_USER_ID="1403965739@10.108.160.18"; JSESSIONID=aaap4Ip0WbCi3diiZRxWx; ___rl__test__cookies=1632484936346',
"Host": "fanyi.youdao.com",
"Origin": "https://fanyi.youdao.com",
"Referer": "https://fanyi.youdao.com/",
"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36",
}

# 查询字段
i = "cat"

# lts 时间戳
lts = str(round(time.time() * 1000))

# salt 值
salt = lts + str(random.randint(0,9))

# Sign 值
sign_string = "fanyideskweb" + i + salt + "Y2FYu%TNSbMCxc3t2u^XT"
hl = hashlib.md5()
hl.update(sign_string.encode())
sign = hl.hexdigest()

data = {
    "i": i,
    "from": "AUTO",
    "to": "AUTO",
    "smartresult": "dict",
    "client": "fanyideskweb",
    "salt": salt,
    "sign": sign,
    "lts": lts,
    "bv": "5f70acd84d315e3a3e7e05f2a4744dfa",
    "doctype": "json",
    "version": "2.1",
    "keyfrom": "fanyi.web",
    "action": "FY_BY_REALTlME",
}


res = requests.post(url, data=data, headers=headers)
data = res.json()
print(data)
print(data['translateResult'][0][0]['tgt'])
~~~





# 百度翻译求 sign 值

## 1. 分析 Post 请求体

同样发送请求，对比请求体

![image-20210925133025885](images/js_reverse/image-20210925133025885.png)



发现有几项值是动态的

- query 发送的参数
- transtype 发送请求方式
- sign 动态签名
- token 这个是固定的，不过最好也求一下



## 2. 定位 js 位置

同样进入代码搜索，找到最终与我们 post 请求体对应的代码区域

~~~js
y = {
    from: d.fromLang,
    to: d.toLang,
    query: e,
    transtype: r,
    simple_means_flag: 3,
    sign: L(e),
    token: window.common.token,
    domain: R.getCurDomain()
}
~~~

> 可以知道 sign 值是通过 L(e) 得出来的，而 token 是 window.common.token 拿到的



sign 值这边下个断点，可以知道 L(e) 中的参数 e 就是我们的查询参数

![image-20210925134456954](images/js_reverse/image-20210925134456954.png)



鼠标移动到 L 身上，可以查询到 L 函数的定义位置，点击跳转到该位置

![image-20210925134628424](images/js_reverse/image-20210925134628424.png)



拿到这么一大段代码，将函数定义代码保存到 Python 脚本文件同级目录，如：baidu.js

~~~js
function e(r) {
    var o = r.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g);
    if (null === o) {
        var t = r.length;
        t > 30 && (r = "" + r.substr(0, 10) + r.substr(Math.floor(t / 2) - 5, 10) + r.substr(-10, 10))
    } else {
        for (var e = r.split(/[\uD800-\uDBFF][\uDC00-\uDFFF]/), C = 0, h = e.length, f = []; h > C; C++)
            "" !== e[C] && f.push.apply(f, a(e[C].split(""))),
                C !== h - 1 && f.push(o[C]);
        var g = f.length;
        g > 30 && (r = f.slice(0, 10).join("") + f.slice(Math.floor(g / 2) - 5, Math.floor(g / 2) + 5).join("") + f.slice(-10).join(""))
    }
    var u = void 0
    , l = "" + String.fromCharCode(103) + String.fromCharCode(116) + String.fromCharCode(107);
    u = null !== i ? i : (i = window[l] || "") || "";
    for (var d = u.split("."), m = Number(d[0]) || 0, s = Number(d[1]) || 0, S = [], c = 0, v = 0; v < r.length; v++) {
        var A = r.charCodeAt(v);
        128 > A ? S[c++] = A : (2048 > A ? S[c++] = A >> 6 | 192 : (55296 === (64512 & A) && v + 1 < r.length && 56320 === (64512 & r.charCodeAt(v + 1)) ? (A = 65536 + ((1023 & A) << 10) + (1023 & r.charCodeAt(++v)),
            S[c++] = A >> 18 | 240,
            S[c++] = A >> 12 & 63 | 128) : S[c++] = A >> 12 | 224,
                                                                    S[c++] = A >> 6 & 63 | 128),
                                S[c++] = 63 & A | 128)
    }
    for (var p = m, F = "" + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(97) + ("" + String.fromCharCode(94) + String.fromCharCode(43) + String.fromCharCode(54)), D = "" + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(51) + ("" + String.fromCharCode(94) + String.fromCharCode(43) + String.fromCharCode(98)) + ("" + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(102)), b = 0; b < S.length; b++)
        p += S[b],
            p = n(p, F);
    return p = n(p, D),
        p ^= s,
        0 > p && (p = (2147483647 & p) + 2147483648),
        p %= 1e6,
        p.toString() + "." + (p ^ m)
}
~~~



## 3. 使用 PyExecJs 拿到 sign 值

PyExecJs 可以使 Python 运行 js 代码，这类工具有很多，比如：

- js2py
- jsv8



![image-20210925135049673](images/js_reverse/image-20210925135049673.png)



使用 Execjs 运行 JS 代码

~~~python
import execjs

# 打开baidu.js文件
with open('baidu.js','r') as f:
    js = f.read()

#创建js对象
js_obj = execjs.compile(js)

# eval() 函数用来执行一个字符串表达式，并返回表达式的值。执行baidu.js中的e（r）函数
sign = js_obj.eval("e('dog')")
print(sign)
~~~



发现该代码报错，报错信息如下：

~~~python
Traceback (most recent call last):
  File "C:/Users/Forece/Documents/PycharmProjects/my_own/js_reverse/baidu_translate.py", line 12, in <module>
    sign = js_obj.eval("e('dog')")
  File "C:\Users\Forece\Documents\PycharmProjects\my_own\venv\lib\site-packages\execjs\_abstract_runtime_context.py", line 27, in eval
    return self._eval(source)
  File "C:\Users\Forece\Documents\PycharmProjects\my_own\venv\lib\site-packages\execjs\_external_runtime.py", line 78, in _eval
    return self.exec_(code)
  File "C:\Users\Forece\Documents\PycharmProjects\my_own\venv\lib\site-packages\execjs\_abstract_runtime_context.py", line 18, in exec_
    return self._exec_(source)
  File "C:\Users\Forece\Documents\PycharmProjects\my_own\venv\lib\site-packages\execjs\_external_runtime.py", line 88, in _exec_
    return self._extract_result(output)
  File "C:\Users\Forece\Documents\PycharmProjects\my_own\venv\lib\site-packages\execjs\_external_runtime.py", line 167, in _extract_result
    raise ProgramError(value)
execjs._exceptions.ProgramError: ReferenceError: i is not defined

Process finished with exit code 1
~~~

> 最终原因发现是 i 没有被定义



回到控制台，查看 i 参数

![image-20210925135633238](images/js_reverse/image-20210925135633238.png)



先不用管 u，只用看 i 这个三元表达式就可以了

~~~js
null !== i ? i : (i = window[l] || "")
~~~

> 如果 i 为空，那么 i = window[l]，其中 l 的值在上一行可以知道是 gtk



最后将 i 值赋值给了 u，最后结论：

~~~
u = i = window["gtk"]
~~~



那么我们搜一下 gtk，发现 window 下边的属性 l 被定义在了 index 源码上

![image-20210925140950831](images/js_reverse/image-20210925140950831.png)



源码上已经给出了 i 值

~~~
window.gtk = '320305.131321201'
~~~



我们在 js 文件中把 u 值给写死

~~~js
// 将原先 u 值定义的地方注释掉
//    var u = void 0
//    , l = "" + String.fromCharCode(103) + String.fromCharCode(116) + String.fromCharCode(107);
//    u = null !== i ? i : (i = window[l] || "") || "";
var u = '320305.131321201';
~~~



发现还是有报错信息，这次是 n 的问题

~~~
execjs._exceptions.ProgramError: ReferenceError: n is not defined
~~~



原来在代码下边还有个 n 函数，回到 调试页面，发现该函数上边还有两个函数，

![image-20210925142215576](images/js_reverse/image-20210925142215576.png)



我们直接把这两个函数也拖进来，最终 js 代码如下

~~~js
function a(r) {
    if (Array.isArray(r)) {
        for (var o = 0, t = Array(r.length); o < r.length; o++)
            t[o] = r[o];
        return t
    }
    return Array.from(r)
}

function n(r, o) {
    for (var t = 0; t < o.length - 2; t += 3) {
        var a = o.charAt(t + 2);
        a = a >= "a" ? a.charCodeAt(0) - 87 : Number(a),
            a = "+" === o.charAt(t + 1) ? r >>> a : r << a,
            r = "+" === o.charAt(t) ? r + a & 4294967295 : r ^ a
    }
    return r
}

function e(r) {
    var o = r.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g);
    if (null === o) {
        var t = r.length;
        t > 30 && (r = "" + r.substr(0, 10) + r.substr(Math.floor(t / 2) - 5, 10) + r.substr(-10, 10))
    } else {
        for (var e = r.split(/[\uD800-\uDBFF][\uDC00-\uDFFF]/), C = 0, h = e.length, f = []; h > C; C++)
            "" !== e[C] && f.push.apply(f, a(e[C].split(""))),
                C !== h - 1 && f.push(o[C]);
        var g = f.length;
        g > 30 && (r = f.slice(0, 10).join("") + f.slice(Math.floor(g / 2) - 5, Math.floor(g / 2) + 5).join("") + f.slice(-10).join(""))
    }
//    var u = void 0
//    , l = "" + String.fromCharCode(103) + String.fromCharCode(116) + String.fromCharCode(107);
//    u = null !== i ? i : (i = window[l] || "") || "";
var u = '320305.131321201';
    for (var d = u.split("."), m = Number(d[0]) || 0, s = Number(d[1]) || 0, S = [], c = 0, v = 0; v < r.length; v++) {
        var A = r.charCodeAt(v);
        128 > A ? S[c++] = A : (2048 > A ? S[c++] = A >> 6 | 192 : (55296 === (64512 & A) && v + 1 < r.length && 56320 === (64512 & r.charCodeAt(v + 1)) ? (A = 65536 + ((1023 & A) << 10) + (1023 & r.charCodeAt(++v)),
            S[c++] = A >> 18 | 240,
            S[c++] = A >> 12 & 63 | 128) : S[c++] = A >> 12 | 224,
                                                                    S[c++] = A >> 6 & 63 | 128),
                                S[c++] = 63 & A | 128)
    }
    for (var p = m, F = "" + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(97) + ("" + String.fromCharCode(94) + String.fromCharCode(43) + String.fromCharCode(54)), D = "" + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(51) + ("" + String.fromCharCode(94) + String.fromCharCode(43) + String.fromCharCode(98)) + ("" + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(102)), b = 0; b < S.length; b++)
        p += S[b],
            p = n(p, F);
    return p = n(p, D),
        p ^= s,
        0 > p && (p = (2147483647 & p) + 2147483648),
        p %= 1e6,
        p.toString() + "." + (p ^ m)
}
~~~



最后再次运行代码，得到 sign 值

~~~
871501.634748
~~~





## 4. token

从刚才的 window.l 我们可以看出，一般 window 属性都会被定义在 index 页面，我们搜索一下 post 请求体发送的 token 值，果然在 index 页面中发现了 token 值。



![image-20210925142857887](images/js_reverse/image-20210925142857887.png)

Python 这边使用正则就可以提取了

~~~python
# 获取 token
r = requests.get(token_url, headers=headers)
token = re.findall(r"token: '(.*?)'",r.text)[0]
~~~



## 5. js 传参

因为 js 和 python 都是我们自己本地编写的，所以如果要进行传参，我们自己给 baidu.js 里边的函数添加一个形参就可以了，然后把形参赋值给 u 即可。如：

~~~js
function e(r,gtk) {
    // 代码段
    var u = gtk
    // 代码段
    }
~~~



python 这边传参

~~~python
sign = js_obj.eval("e('{}','{}')".format(query,window_gtk))
~~~



## 6. 完整代码

~~~python
import requests
import re
import execjs

post_url = 'https://fanyi.baidu.com/v2transapi'
token_url = 'https://fanyi.baidu.com'
headers = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
    'accept-language': 'zh-CN,zh;q=0.9',
    'cache-control': 'no-cache',
    'cookie': '填写自己的 Cookie',
    'pragma': 'no-cache',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
}

query = "cat"

# 获取 token
r = requests.get(token_url, headers=headers)
token = re.findall(r"token: '(.*?)'",r.text)[0]
window_gtk = re.findall(r"window.*?gtk = '(.*?)';</script>",r.text)[0]

# js 解析 sign 值
with open('baidu.js','r') as f:
    js = f.read()
js_obj = execjs.compile(js)
sign = js_obj.eval("e('{}','{}')".format(query,window_gtk))

data = {
    "from": "en",
    "to": "zh",
    "query": query,
    "transtype": "translang",
    "simple_means_flag": "3",
    "sign": sign,
    "token": token,
    "domain": "common",
}

r = requests.post(post_url,data=data,headers=headers)
result = r.json()
print(result)
print(result['trans_result']['data'][0]['dst'])
~~~



baidu.js

~~~js
function a(r) {
    if (Array.isArray(r)) {
        for (var o = 0, t = Array(r.length); o < r.length; o++)
            t[o] = r[o];
        return t
    }
    return Array.from(r)
}

function n(r, o) {
    for (var t = 0; t < o.length - 2; t += 3) {
        var a = o.charAt(t + 2);
        a = a >= "a" ? a.charCodeAt(0) - 87 : Number(a),
            a = "+" === o.charAt(t + 1) ? r >>> a : r << a,
            r = "+" === o.charAt(t) ? r + a & 4294967295 : r ^ a
    }
    return r
}

function e(r,gtk) {
    var o = r.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g);
    if (null === o) {
        var t = r.length;
        t > 30 && (r = "" + r.substr(0, 10) + r.substr(Math.floor(t / 2) - 5, 10) + r.substr(-10, 10))
    } else {
        for (var e = r.split(/[\uD800-\uDBFF][\uDC00-\uDFFF]/), C = 0, h = e.length, f = []; h > C; C++)
            "" !== e[C] && f.push.apply(f, a(e[C].split(""))),
                C !== h - 1 && f.push(o[C]);
        var g = f.length;
        g > 30 && (r = f.slice(0, 10).join("") + f.slice(Math.floor(g / 2) - 5, Math.floor(g / 2) + 5).join("") + f.slice(-10).join(""))
    }
    //    var u = void 0
    //    , l = "" + String.fromCharCode(103) + String.fromCharCode(116) + String.fromCharCode(107);
    //    u = null !== i ? i : (i = window[l] || "") || "";
    var u = gtk
    for (var d = u.split("."), m = Number(d[0]) || 0, s = Number(d[1]) || 0, S = [], c = 0, v = 0; v < r.length; v++) {
        var A = r.charCodeAt(v);
        128 > A ? S[c++] = A : (2048 > A ? S[c++] = A >> 6 | 192 : (55296 === (64512 & A) && v + 1 < r.length && 56320 === (64512 & r.charCodeAt(v + 1)) ? (A = 65536 + ((1023 & A) << 10) + (1023 & r.charCodeAt(++v)),
            S[c++] = A >> 18 | 240,
            S[c++] = A >> 12 & 63 | 128) : S[c++] = A >> 12 | 224,
                                                                    S[c++] = A >> 6 & 63 | 128),
                                S[c++] = 63 & A | 128)
    }
    for (var p = m, F = "" + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(97) + ("" + String.fromCharCode(94) + String.fromCharCode(43) + String.fromCharCode(54)), D = "" + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(51) + ("" + String.fromCharCode(94) + String.fromCharCode(43) + String.fromCharCode(98)) + ("" + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(102)), b = 0; b < S.length; b++)
        p += S[b],
            p = n(p, F);
    return p = n(p, D),
        p ^= s,
        0 > p && (p = (2147483647 & p) + 2147483648),
        p %= 1e6,
        p.toString() + "." + (p ^ m)
}
~~~





# F12 被禁用

https://www.aqistudy.cn/



# JS 混淆、逆向

https://www.bilibili.com/video/BV1tE411F7do?p=19

利用 execjs 执行网页上的 js

```
# 利用当前页面JS文件，对需要POST的DATA进行加密
import execjs
import requests

node = execjs.get()

# 定义参数
method = 'GETCITYWEATHER'
city = '北京'
type = 'HOUR'
start_time = ''
end_time = ''

# Compile javascript
# 加密解密 function 所在的 js
file = 'jsCode.js'
ctx = node.compile(open(file, encoding='utf-8').read())

# 拿到最终混淆加密过的data
js = 'getPostParamcode("{0}","{1}","{2}", "{3}", "{4}")'.format(method, city, type, start_time, end_time)
params = ctx.eval(js)

# 发起post请求
url = 'https://www.aqistudy.cn/apinew/aqistudyapi.php'
response_text = requests.post(url, data={'d':params}).text

# 这里获取的是混淆后的响应体结果
print(response_text)

# 解密
js = 'decodeData("{0}")'.format(response_text)
decrypted_data = ctx.eval(js)
print(decrypted_data)
```

> getPostParamcode 和 decodeData 都是通过分析页面中 js 文件拿到的 function



PS： 可以使用 Chrome 或 Firefox 的 Event listener 获取元素绑定 JS，然后依次分析。



# 字体混淆



# 抽奖小程序逆向

## 1. 抓包

## 2. Post 请求体

- Authorization
- timestamp
- sign



## 3. 解密

## 4. 解包

## 5. 分析 sign 值



~~~js
define("utils/sign.js",
       function (require, module, exports, window, document, frames, self, location, navigator, localStorage, history, Caches, screen, alert, confirm, prompt, XMLHttpRequest, WebSocket, Reporter, webkit, WeixinJSCore) {
    !
        function () {
        "use strict";
        function e(e) {
            return e && e.__esModule ? e : {
                default:
                e
            }
        }
        function t(e) {
            return u.
            default.isEmpty(e) ? "" : u.
            default.sortBy(u.
                           default.toPairs(e), [function (e) {
                return e[0]
            }]).map((function (e) {
                var t = y,
                    r = e[1];
                return t + "=" + (r = u.
                                  default.isBoolean(r) || u.
                                  default.isString(r) || u.
                                  default.isNumber(r) ? "" + r : Array.isArray(r) ? "array" : u.
                                  default.isObject(r) ? "object" : "")
            })).join("&")
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }),
            exports.
        default = function () {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            try {
                var r = e.method,
                    i = void 0 === r ? "get" : r,
                    d = e.url,
                    l = void 0 === d ? "/" : d,
                    f = e.query,
                    c = void 0 === f ? {} : f,
                    m = e.token,
                    p = void 0 === m ? s : m,
                    v = e.body,
                    g = void 0 === v ? {} : v;
                i = i.toLowerCase();
                var y = (0, n.
                         default)("path", l).replace(/^\/v\d+\//, "/"),
                    j = t(u.
                          default.assign({},
                                         (0, n.
                                          default)("?", l) || {},
                                         c)),
                    h = t(g),
                    w = h ? (0, o.
                             default)(h).toString() :
                "",
                    b = (new Date).getTime();
                return {
                    sign: (0, a.
                           default)(i + ":" + y + ":" + j + ":" + w + ":" + b + ":" + p + ":1").toString().toLowerCase(),
                    timestamp: b
                }
            } catch (e) {
                return console.error(e),
                    {
                    sign: e.message,
                    timestamp: (new Date).getTime()
                }
            }
        };
        var r, a = e(require("./../npm/crypto-js/sha1.js")),
            o = e(require("./../npm/crypto-js/md5.js")),
            u = e(require("./../npm/lodash/lodash.js")),
            n = e(require("./../npm/wurl/wurl.js")),
            i = ["s", "a", "i", "Q", "2", "o", "X", "N", "K", "t", "~", "G", "d", "*", "C", "3", "%", "c", "x", "u", "4", "P", "A", "F", "h", "l", "5", "E", "O", "7", "J", "Z", "w", "}", "p", "R", "b", "+", "!", ",", "@", "D", "H", ".", "&", "B", "M", "9", "/", "r", "j", "L", "{", "n", "W", "q", "U", "(", "1", "T", "S", "g", "f", "#", "m", ")", "k", "8", "y", "V", "6", "z", "e", "Y", "0", "I", "v", "?", "", "length"],
            s = (r = [i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7], i[8], i[9], i[10], i[11], i[12], i[13], i[14], i[15], i[16], i[17], i[18], i[19], i[20], i[21], i[22], i[23], i[24], i[25], i[26], i[27], i[28], i[29], i[30], i[31], i[32], i[33], i[34], i[35], i[36], i[37], i[38], i[39], i[40], i[41], i[42], i[43], i[44], i[45], i[46], i[47], i[48], i[49], i[50], i[51], i[52], i[53], i[54], i[55], i[56], i[57], i[58], i[59], i[60], i[61], i[62], i[63], i[64], i[65], i[66], i[67], i[68], i[69], i[70], i[71], i[72], i[73], i[74], i[75], i[76], i[77]],
                 function () {
                for (var e = arguments,
                     t = i[78], a = 0, o = e[i[79]]; o > a; a++) t += r[e[a]];
                return t
            })(53, 19, 59, 54, 29, 71, 37, 17, 57, 42, 77, 46, 41, 37, 66, 36, 54, 35, 70, 6, 11, 53, 36, 70, 45, 72, 4, 76, 67, 9, 9, 56)
        }();
});
~~~





~~~js
return {
    sign: (0, a.default)(i + ":" + y + ":" + j + ":" + w + ":" + b + ":" + p + ":1").toString().toLowerCase(),
    timestamp: b
}
~~~



b 值为 timestamp

~~~
b = (new Date).getTime();
~~~



i 值为 "get"

~~~
i = void 0 === r ? "get" : r,
~~~



~~~json
{
    data:{
        code: "the code is a mock one"
        platform: "wechat"
    },
    url: "https://lucky.nocode.com/v2external/user/login", 
    header:{
        Client-Version:"8.0.5",
        X-Request-ID:"",
        platform:"wechat"
        version:"1.3.215
    },
    method: "POST"
}



~~~



sign 值方法

~~~js
var w = (0,
         i.default)({
    method: t.method,
    url: t.url,
    query: t.data
~~~



i.default 是 sign.js

~~~
function({
methods:"POST",
url:"https://lucky.nocode.com/v2external/user/login",
query:{
        code: "the code is a mock one"
        platform: "wechat"
    },
})
~~~







# 附录：

## 1. 乱码

~~~js
// Ascii 格式
\u732b
\\u732b

// UTF8 格式
&#x732B;

// Uniocode 格式
&#29483;

// URL 转码
C%E8%AF%AD%E8%A8%80

//十六进制的ASCII码
sign\xe9\x94\x99\xe8\xaf\xaf
~~~



Python 转换方法

~~~python
# 对于 ASCII 直接输出即可
s = '\u732b'
print(s)

# 双斜线 ASCII 编码
s = '\\u732b'
print(s.encode('utf-8').decode('unicode_escape'))

# 十六进制 ASCII 编码
s= "sign\xe9\x94\x99\xe8\xaf\xaf"
print(s.encode('raw_unicode_escape').decode())

~~~







## 2. 加密解密在线工具

https://tool.oschina.net/encrypt



