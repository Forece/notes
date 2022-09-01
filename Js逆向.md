# JS 逆向

随着爬虫的大批量使用，给网站造成大批量访问，为了保护自己的数据，各种防爬虫方法也接踵而出，最常见的就是在表单中加入 sign 签名，时间戳。如果没有在表单中提交正确的验证字段，则返回不了数据。



# 加密方式

一般这些签名都是通过 js 进行加密的，那么我们来了解一下都有哪些加密方式

- MD5 加密
- AES/DES 对称加密
- RSA 非对称加密
- Base64 伪加密



## 1. MD5 加密

MD5是一种被广泛使用的线性散列算法，可以产生出一个128位(16字节)的散列值（hash value)，用于确保信息传输完整的一致性。且MD5加密之后产生的是一个固定长度（32位或16位）的数据。

- 解密：

常规讲MD5是不存在解密的。但是理论上MD5是可以进行反向暴力破解的。暴力破解的大致原理就是用很多不同的数据进行加密后跟已有的加密数据进行对比，由此来寻找规律。理论上只要数据量足够庞大MD5是可以被破解的。但是要注意，破解MD5是需要考虑破解的成本（时间和机器性能）。假设破解当前的MD5密码需要目前计算能力最优秀的计算机工作100年才能破解完成。那么当前的MD5密码就是安全的。

- 增加破解成本的方法（加盐 + 多次加密 ）
  - 使用一段无意义且随机的私匙（盐）进行MD5加密会生成一个加密串，我们暂且称之为串1
  - 将要加密的的数据跟串1拼接，再进行一次MD5，这时会生成串2。
  - 将串2再次进行MD5加密，这时生成的串3就是我们加密后的数据



MD5 加密示例：

~~~html
  <script src="https://cdn.bootcdn.net/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js"></script>
  <script>
      var hashCode = md5('signature')
      alert(hashCode);
  </script>
~~~



## 2. AES/DES 对称加密

DES全称为 Data Encryption Standard，即数据加密标准，是一种使用密钥加密的算法。该加密算法是一种对称加密方式，其加密运算、解密运算需要使用的是同样的密钥（一组字符串）即可。



现在用AES这个标准来替代原先的DES

- AES和DES的区别：
  - 加密后密文长度的不同
    - DES加密后密文长度是8的整数倍
    - AES加密后密文长度是16的整数倍
  - 应用场景的不同：
    - 企业级开发使用 DES 足够安全
    - 如果要求高使用 AES
  - DES和AES切换只需要修改 CryptoJS.AES<=>CryptoJS.DES
- 使用 DES/AES 进行数据交互时要求双方都拥有相同的私匙



破解方法：

- 暴力破解
- DES 如果使用 56 位的秘钥，则可能的秘钥数量是 2 的 56 次方，只要计算足够强大是可以破解的



DES算法的入口参数有三个：

- Key, Data, Mode, Padding
  - Key 为 7 个字节共 56位，是DES算法的工作密钥
  - Data为 8 个字节 64 位，是要被加密或被解密的数据
  - Mode为 DES 的工作方式
  - Padding为填充模式，如果加密后密文长度如果达不到指定整数倍（8个字节、16个字节），填充对应字符
    - Padding 的赋值一般用 CryptoJS.pad.Pkcs7 即可



JS 加密 DES/AES 示例

~~~html
<!DOCTYPE html>
<script src="https://cdn.bootcdn.net/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
  <script>
    var aesKey = '12345678'  // 定制秘钥，长度必须为：8/16/32位
    var message = "signature"  // 需要加密字段
    
    // AES加密
    var encrypt = CryptoJS.AES.encrypt(message, CryptoJS.enc.Utf8.parse(aesKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString();

    // 显示加密后数据
    alert(encrypt)

    // AES解密
    var decrypt = CryptoJS.AES.decrypt(encrypt, CryptoJS.enc.Utf8.parse(aesKey),{
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
    
    // 显示解密后数据
    alert(decrypt);
  </script>
</html>
~~~



## 3. RSA 非对称加密

RSA 加密算法是一种非对称加密算法。在公开密钥加密和电子商业中RSA被广泛使用。

非对称加密算法：

- 非对称加密算法需要两个密钥：
  - 公开密钥（publickey：简称公钥）
  - 私有密钥（privatekey：简称私钥）
  - 公钥与私钥是一对，如果用公钥对数据进行加密，只有用对应的私钥才能解密。因为加密和解密使用的是两个不同的密钥，所以这种算法叫作非对称加密算法。
- 注意：
  - 使用时都是使用公匙加密使用私匙解密。公匙可以公开，私匙自己保留。
  - 算法强度复杂、安全性依赖于算法与密钥但是由于其算法复杂，而使得加密解密速度没有对称加密解密的速度快。
- 使用流程和场景介绍
  - 通过公匙加密，使用私匙解密。私匙是通过公匙计算生成的。假设ABC三方之间相互要进行加密通信。大家相互之间使用公匙进行信息加密，信息读取时使用各自对应的私匙进行信息解密
  - 用户输入的支付密码会通过RSA加密



在线生成 RSA 公钥私钥

- http://web.chacuo.net/netrsakeypair



公钥

~~~
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC6qBWnlDXEt6ROsDkrC38Dp8/M
JDIIPv5nuodROiUD3fpzHXvjOHhGPwCddpIvWNAuSZeYNt1CJPEk5EZ2QKisYMxG
qDqNkJ0lssZE7Qqzk1DCRKJfcxLmWkgST2v2NguGjyZPuYsD2boQ+tvs7M7zYwAQ
yTCM8Sae07h/SdyIowIDAQAB
-----END PUBLIC KEY-----

~~~



私钥

~~~
-----BEGIN PRIVATE KEY-----
MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBALqoFaeUNcS3pE6w
OSsLfwOnz8wkMgg+/me6h1E6JQPd+nMde+M4eEY/AJ12ki9Y0C5Jl5g23UIk8STk
RnZAqKxgzEaoOo2QnSWyxkTtCrOTUMJEol9zEuZaSBJPa/Y2C4aPJk+5iwPZuhD6
2+zszvNjABDJMIzxJp7TuH9J3IijAgMBAAECgYAYNvIIOWv4RzKjmqzv7p/do4mL
nC55b2KlpkcjvH1M0SFKicqmoY7I3ieARf+U8NqhBp8J+iQeDpjSBmM1uBGpglgb
ZCfNKQiMw/YkKxL6Pt7mfz4klBrYHVM/dP5fQWrlMBmutjDkwAMdbnSOVlekClhq
AQvdaYwdy3a4vI+tcQJBAOkBhwkXOld1QSEwxIBABgfL5ilkj05pQbb5zlEGLxy3
J8slpZLhtVnGDtL2pN/3rEQt8gr1Afb9UgzN8ipYAE0CQQDNE5/Buq5u4b3FWMt7
7tTA5o63zA+McOiAhGF+rHhGnH8x4UPW0e100Pn6jKwcUYPiSO0ERhFZJOxvlH0/
D6SvAkEA5U0ihdi9CnqS2MX0az4WcS/A1rVmrkS5bgdSebw7OugoGix3UCAdZzaZ
OhWN1fcYKZSJoSzSfS14xK8cBX3K9QJAD2BzUCFhRusiQZPg3hAQX85p0Ro56Dvn
EwvaC5d/BTxixSiw34CqH2Iz/DdkCFOMYgE51GI0lsyP9eXaZkoT/QJAZTpklVvd
LBy6/lHvsuM9v2+J4H+gdmv6ZeXkZZktlvfg9vGdtpB6nF+TuqvNbzvOHlcYaklg
XIpiQvjT00XtLA==
-----END PRIVATE KEY-----

~~~



JS RSA 加密示例

~~~html
<!DOCTYPE html>
<script src="https://cdn.bootcdn.net/ajax/libs/jsencrypt/3.2.1/jsencrypt.min.js"></script>
  <script>
    var PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC6qBWnlDXEt6ROsDkrC38Dp8/M
JDIIPv5nuodROiUD3fpzHXvjOHhGPwCddpIvWNAuSZeYNt1CJPEk5EZ2QKisYMxG
qDqNkJ0lssZE7Qqzk1DCRKJfcxLmWkgST2v2NguGjyZPuYsD2boQ+tvs7M7zYwAQ
yTCM8Sae07h/SdyIowIDAQAB
-----END PUBLIC KEY-----`
    var PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBALqoFaeUNcS3pE6w
OSsLfwOnz8wkMgg+/me6h1E6JQPd+nMde+M4eEY/AJ12ki9Y0C5Jl5g23UIk8STk
RnZAqKxgzEaoOo2QnSWyxkTtCrOTUMJEol9zEuZaSBJPa/Y2C4aPJk+5iwPZuhD6
2+zszvNjABDJMIzxJp7TuH9J3IijAgMBAAECgYAYNvIIOWv4RzKjmqzv7p/do4mL
nC55b2KlpkcjvH1M0SFKicqmoY7I3ieARf+U8NqhBp8J+iQeDpjSBmM1uBGpglgb
ZCfNKQiMw/YkKxL6Pt7mfz4klBrYHVM/dP5fQWrlMBmutjDkwAMdbnSOVlekClhq
AQvdaYwdy3a4vI+tcQJBAOkBhwkXOld1QSEwxIBABgfL5ilkj05pQbb5zlEGLxy3
J8slpZLhtVnGDtL2pN/3rEQt8gr1Afb9UgzN8ipYAE0CQQDNE5/Buq5u4b3FWMt7
7tTA5o63zA+McOiAhGF+rHhGnH8x4UPW0e100Pn6jKwcUYPiSO0ERhFZJOxvlH0/
D6SvAkEA5U0ihdi9CnqS2MX0az4WcS/A1rVmrkS5bgdSebw7OugoGix3UCAdZzaZ
OhWN1fcYKZSJoSzSfS14xK8cBX3K9QJAD2BzUCFhRusiQZPg3hAQX85p0Ro56Dvn
EwvaC5d/BTxixSiw34CqH2Iz/DdkCFOMYgE51GI0lsyP9eXaZkoT/QJAZTpklVvd
LBy6/lHvsuM9v2+J4H+gdmv6ZeXkZZktlvfg9vGdtpB6nF+TuqvNbzvOHlcYaklg
XIpiQvjT00XtLA==
-----END PRIVATE KEY-----`
    
    // 使用公钥加密
    var encrypt = new JSEncrypt()  // 实例化加密对象
    encrypt.setPublicKey(PUBLIC_KEY)  // 设置公钥
    var encrypted = encrypt.encrypt('signature')  // 对指定数据进行加密

    // 显示加密后数据
    alert(encrypted)

    // 使用私钥解密
    var decrypt = new JSEncrypt()
    decrypt.setPrivateKey(PRIVATE_KEY)  // 设置私钥
    decrypted = decrypt.decrypt(encrypted)  // 解密
    
    // 显示解密后数据
    alert(decrypted);
  </script>
</html>
~~~



## 4.  Base64 伪加密

- Base64 是一种用64个字符来表示任意二进制数据的方法。base64是一种编码方式而不是加密算法。只是看上去像是加密而已。

- Base64使用A-Z,a-z,0-9,+,/这64个字符实现对数据进行加密。



~~~html
<!DOCTYPE html>
<script src="https://cdn.bootcdn.net/ajax/libs/jsencrypt/3.2.1/jsencrypt.min.js"></script>
  <script>
　　var Base64 = {
        _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encode : function(e) {
            var t = "";
            var n, r, i, s, o, u, a;
            var f = 0;
            e = Base64._utf8_encode(e);
            while (f < e.length) {
                n = e.charCodeAt(f++);
                r = e.charCodeAt(f++);
                i = e.charCodeAt(f++);
                s = n >> 2;
                o = (n & 3) << 4 | r >> 4;
                u = (r & 15) << 2 | i >> 6;
                a = i & 63;
                if (isNaN(r)) {
                    u = a = 64
                } else if (isNaN(i)) {
                    a = 64
                }
                t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o)
                        + this._keyStr.charAt(u) + this._keyStr.charAt(a)
            }
            return t
        },
        decode : function(e) {
            var t = "";
            var n, r, i;
            var s, o, u, a;
            var f = 0;
            e = e.replace(/[^A-Za-z0-9+/=]/g, "");
            while (f < e.length) {
                s = this._keyStr.indexOf(e.charAt(f++));
                o = this._keyStr.indexOf(e.charAt(f++));
                u = this._keyStr.indexOf(e.charAt(f++));
                a = this._keyStr.indexOf(e.charAt(f++));
                n = s << 2 | o >> 4;
                r = (o & 15) << 4 | u >> 2;
                i = (u & 3) << 6 | a;
                t = t + String.fromCharCode(n);
                if (u != 64) {
                    t = t + String.fromCharCode(r)
                }
                if (a != 64) {
                    t = t + String.fromCharCode(i)
                }
            }
            t = Base64._utf8_decode(t);
            return t
        },
        _utf8_encode : function(e) {
            e = e.replace(/rn/g, "n");
            var t = "";
            for (var n = 0; n < e.length; n++) {
                var r = e.charCodeAt(n);
                if (r < 128) {
                    t += String.fromCharCode(r)
                } else if (r > 127 && r < 2048) {
                    t += String.fromCharCode(r >> 6 | 192);
                    t += String.fromCharCode(r & 63 | 128)
                } else {
                    t += String.fromCharCode(r >> 12 | 224);
                    t += String.fromCharCode(r >> 6 & 63 | 128);
                    t += String.fromCharCode(r & 63 | 128)
                }
            }
            return t
        },
        _utf8_decode : function(e) {
            var t = "";
            var n = 0;
            var r = c1 = c2 = 0;
            while (n < e.length) {
                r = e.charCodeAt(n);
                if (r < 128) {
                    t += String.fromCharCode(r);
                    n++
                } else if (r > 191 && r < 224) {
                    c2 = e.charCodeAt(n + 1);
                    t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                    n += 2
                } else {
                    c2 = e.charCodeAt(n + 1);
                    c3 = e.charCodeAt(n + 2);
                    t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3
                            & 63);
                    n += 3
                }
            }
            return t
        }
    }  

    var encrypt = "signature"  // 加密数据
    var encrypted = Base64.encode(encrypt)  // Base64 加密
    alert(encrypted)
    var decrypted = Base64.decode(encrypted)  // Base64 解密
    alert(decrypted)
  </script>
</html>
~~~



# 关于 HTTPS 的衍变

## 1. 明文传输

http 协议是不安全的，在 https 诞生之前，所有网站都是使用 http 协议，而 http 协议在数据传输过程中都是明文，当浏览器发送数据给服务器时，如果中途被恶意拦截（嗅探），会造成数据泄露和篡改



## 2. 对称秘钥加密传输

使用对称秘钥对数据加密

- 为了防止数据泄露，我们可以对数据进行加密，使用一个秘钥分别交给浏览器和服务器，他们之间传送的数据都使用这个秘钥进行加密和解密
- 请求和响应流程如下：
  - 客户端使用对称秘钥对请求进行加密，发送给服务器
  - 服务端接受加密后的请求，使用秘钥进行解密，处理请求，然后使用秘钥对响应进行加密，返回给客户端
  - 客户端收到加密后的响应，使用秘钥解密，获得响应内容



对称秘钥加密缺陷：

- 当浏览器加密请求时，我们如何让浏览器使用的秘钥与指定服务器的秘钥一致？
- 每个用户客户端的秘钥都和服务端秘钥相同，那么浏览器能拿到秘钥，黑客也可以拿到，所以数据加密也没有了意义



## 3. 动态对称秘钥

先解决第一个问题，就是如何让浏览器使用的秘钥与指定服务器的秘钥一致，解决方法也很简单，就是让浏览器多请求一次。

请求和响应流程如下：

- 服务器先创建生成秘钥
- 客户端向服务端发送请求，获取秘钥

> 然后双方就都有了相同的秘钥，也就可以进行数据加密的传输了。



## 4. 非对称秘钥的引入

![image-20220320204509976](images/js_reverse/image-20220320204509976.png)



> *4. 客户端获取公钥
>
> *7. 使用私钥解密
>
> *10. 使用对称秘钥解密



如此一来，解决了动态对称秘钥和数据加密的问题，因为每个用户的对称秘钥都是随机生成且传输的过程中都使用公钥加密（公钥加密的数据只有私钥能解密），所有黑客无法截获对称秘钥。而数据传输是通过对称秘钥加密过的，所以黑客即使能获取数据也无法去解密看到真实的内容。看似无懈可击，但是，这么干还是又bug.

如果黑客在上图[步骤2]劫持，黑客把自己的公钥返回给客客户端，那么客户端会使用黑客的公钥来加密对称秘钥，黑客在[步骤6]截获请求，使用自己的私钥获取对称秘钥，后面过程全都会完蛋。…



## 5. 证书引入

网站开发完毕后，先去证书机构申请证书

- 机构会给申请者私钥、证书（包含公钥和企业信息）



![image-20220320205615988](images/js_reverse/image-20220320205615988.png)





# 有道翻译 Sign 值 - Python 重写 js 加密

有道翻译求 sign 值，里边的加密方法比较简单，我们可以用 python 重写加密过程。



有道翻译 URL：https://fanyi.youdao.com/



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





# Js2py 执行 JS

## 1. 执行简单 js 代码

~~~python
import js2py

# 执行简单 JS 代码
js2py.eval_js("""
console.log('hello world')
""")
~~~



## 2. 执行本地 js 文件

~~~python
# 获得本地 js 文件
with open("mpWeixin.js",'r',encoding='utf8') as f:
    js = f.read()

# 执行 js 文件
js2py.eval_js(js)
~~~



## 3. 给 js 中的函数传参

直接运行传参，适合单函数

~~~python
import js2py

js = """
function sample(x)
{
    console.log(x)
}
"""

print(js2py.eval_js(js)("Hi"))

~~~



多函数传参

~~~python
import js2py


js = """
function func1(n){
    console.log(n + ' func1')
}

function func2(m){
    console.log(m + ' func2')
}
"""

# 创建 js 环境对象
context = js2py.EvalJs()

# 加载 js 代码
context.execute(js)

# 传参
m = 10
context.m = m
print(context.func1(m))
~~~



# PyExecJs 执行 JS

~~~python
import execjs

# 读取 js 文件
with open('./steam.js','r',encoding='utf-8') as f:
    js = f.read()
    
# 创建 node 对象
node = execjs.get()

# 编译 js
ctx = node.compile(js)

# 设置参数
mod = "xxx"
exp = "xxx"
funcName = 'getPwd("{0}","{1}","{2}")'.format('123456',mod,exp)

# 执行 JS
password = ctx.eval(funcName)
print(password)

~~~



# 单函数加密：百度翻译

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



# 参数分析：微信公众平台

https://mp.weixin.qq.com/



## 1. 分析 Post 请求体

通过 F12 分析，发现密码传输不是明文，而是加密后的数据

![image-20220320212023419](images/js_reverse/image-20220320212023419.png)



## 2. 定位 pwd 在 js 中的位置

发现 pwd 的值是经过 f 函数生成的

![image-20220320212714800](images/js_reverse/image-20220320212714800.png)



- n 在提示中显示是一个对象
  - n.pwd 就是密码
  - f 函数的参数就是截取密码的前16位



使用 F11 或光标移动到 f 函数上可以进入到 f 函数内部，发现 f 函数的返回值

~~~js
n.exports = function(e, t, n) {
    return t ? n ? i(t, e) : o(i(t, e)) : n ? r(e) : o(r(e))
}
~~~



## 3. 提取加密 js

找到整函数体，将里边定义的函数都拿出来

~~~js
function p(e, t) {
    var n = (65535 & e) + (65535 & t);
    return (e >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n
}
function a(e, t, n, o, r, i) {
    return p((t = p(p(t, e), p(o, i))) << r | t >>> 32 - r, n)
}
function l(e, t, n, o, r, i, s) {
    return a(t & n | ~t & o, e, t, r, i, s)
}
function m(e, t, n, o, r, i, s) {
    return a(t & o | n & ~o, e, t, r, i, s)
}
function f(e, t, n, o, r, i, s) {
    return a(t ^ n ^ o, e, t, r, i, s)
}
function g(e, t, n, o, r, i, s) {
    return a(n ^ (t | ~o), e, t, r, i, s)
}
function s(e, t) {
    e[t >> 5] |= 128 << t % 32,
        e[14 + (t + 64 >>> 9 << 4)] = t;
    for (var n, o, r, d, i = 1732584193, s = -271733879, a = -1732584194, c = 271733878, u = 0; u < e.length; u += 16)
        i = l(n = i, o = s, r = a, d = c, e[u], 7, -680876936),
            c = l(c, i, s, a, e[u + 1], 12, -389564586),
            a = l(a, c, i, s, e[u + 2], 17, 606105819),
            s = l(s, a, c, i, e[u + 3], 22, -1044525330),
            i = l(i, s, a, c, e[u + 4], 7, -176418897),
            c = l(c, i, s, a, e[u + 5], 12, 1200080426),
            a = l(a, c, i, s, e[u + 6], 17, -1473231341),
            s = l(s, a, c, i, e[u + 7], 22, -45705983),
            i = l(i, s, a, c, e[u + 8], 7, 1770035416),
            c = l(c, i, s, a, e[u + 9], 12, -1958414417),
            a = l(a, c, i, s, e[u + 10], 17, -42063),
            s = l(s, a, c, i, e[u + 11], 22, -1990404162),
            i = l(i, s, a, c, e[u + 12], 7, 1804603682),
            c = l(c, i, s, a, e[u + 13], 12, -40341101),
            a = l(a, c, i, s, e[u + 14], 17, -1502002290),
            i = m(i, s = l(s, a, c, i, e[u + 15], 22, 1236535329), a, c, e[u + 1], 5, -165796510),
            c = m(c, i, s, a, e[u + 6], 9, -1069501632),
            a = m(a, c, i, s, e[u + 11], 14, 643717713),
            s = m(s, a, c, i, e[u], 20, -373897302),
            i = m(i, s, a, c, e[u + 5], 5, -701558691),
            c = m(c, i, s, a, e[u + 10], 9, 38016083),
            a = m(a, c, i, s, e[u + 15], 14, -660478335),
            s = m(s, a, c, i, e[u + 4], 20, -405537848),
            i = m(i, s, a, c, e[u + 9], 5, 568446438),
            c = m(c, i, s, a, e[u + 14], 9, -1019803690),
            a = m(a, c, i, s, e[u + 3], 14, -187363961),
            s = m(s, a, c, i, e[u + 8], 20, 1163531501),
            i = m(i, s, a, c, e[u + 13], 5, -1444681467),
            c = m(c, i, s, a, e[u + 2], 9, -51403784),
            a = m(a, c, i, s, e[u + 7], 14, 1735328473),
            i = f(i, s = m(s, a, c, i, e[u + 12], 20, -1926607734), a, c, e[u + 5], 4, -378558),
            c = f(c, i, s, a, e[u + 8], 11, -2022574463),
            a = f(a, c, i, s, e[u + 11], 16, 1839030562),
            s = f(s, a, c, i, e[u + 14], 23, -35309556),
            i = f(i, s, a, c, e[u + 1], 4, -1530992060),
            c = f(c, i, s, a, e[u + 4], 11, 1272893353),
            a = f(a, c, i, s, e[u + 7], 16, -155497632),
            s = f(s, a, c, i, e[u + 10], 23, -1094730640),
            i = f(i, s, a, c, e[u + 13], 4, 681279174),
            c = f(c, i, s, a, e[u], 11, -358537222),
            a = f(a, c, i, s, e[u + 3], 16, -722521979),
            s = f(s, a, c, i, e[u + 6], 23, 76029189),
            i = f(i, s, a, c, e[u + 9], 4, -640364487),
            c = f(c, i, s, a, e[u + 12], 11, -421815835),
            a = f(a, c, i, s, e[u + 15], 16, 530742520),
            i = g(i, s = f(s, a, c, i, e[u + 2], 23, -995338651), a, c, e[u], 6, -198630844),
            c = g(c, i, s, a, e[u + 7], 10, 1126891415),
            a = g(a, c, i, s, e[u + 14], 15, -1416354905),
            s = g(s, a, c, i, e[u + 5], 21, -57434055),
            i = g(i, s, a, c, e[u + 12], 6, 1700485571),
            c = g(c, i, s, a, e[u + 3], 10, -1894986606),
            a = g(a, c, i, s, e[u + 10], 15, -1051523),
            s = g(s, a, c, i, e[u + 1], 21, -2054922799),
            i = g(i, s, a, c, e[u + 8], 6, 1873313359),
            c = g(c, i, s, a, e[u + 15], 10, -30611744),
            a = g(a, c, i, s, e[u + 6], 15, -1560198380),
            s = g(s, a, c, i, e[u + 13], 21, 1309151649),
            i = g(i, s, a, c, e[u + 4], 6, -145523070),
            c = g(c, i, s, a, e[u + 11], 10, -1120210379),
            a = g(a, c, i, s, e[u + 2], 15, 718787259),
            s = g(s, a, c, i, e[u + 9], 21, -343485551),
            i = p(i, n),
            s = p(s, o),
            a = p(a, r),
            c = p(c, d);
    return [i, s, a, c]
}
function c(e) {
    for (var t = "", n = 0; n < 32 * e.length; n += 8)
        t += String.fromCharCode(e[n >> 5] >>> n % 32 & 255);
    return t
}
function u(e) {
    var t, n = [];
    for (n[(e.length >> 2) - 1] = void 0,
         t = 0; t < n.length; t += 1)
        n[t] = 0;
    for (t = 0; t < 8 * e.length; t += 8)
        n[t >> 5] |= (255 & e.charCodeAt(t / 8)) << t % 32;
    return n
}
function o(e) {
    for (var t, n = "0123456789abcdef", o = "", r = 0; r < e.length; r += 1)
        t = e.charCodeAt(r),
            o += n.charAt(t >>> 4 & 15) + n.charAt(15 & t);
    return o
}
function d(e) {
    return unescape(encodeURIComponent(e))
}
function r(e) {
    return c(s(u(e = d(e)), 8 * e.length))
}
function i(e, t) {
    var n, e = d(e), t = d(t), o = u(e), r = [], i = [];
    for (r[15] = i[15] = void 0,
        16 < o.length && (o = s(o, 8 * e.length)),
        n = 0; n < 16; n += 1)
        r[n] = 909522486 ^ o[n],
            i[n] = 1549556828 ^ o[n];
    return e = s(r.concat(u(t)), 512 + 8 * t.length),
        c(s(i.concat(e), 640))
}
n.exports = function(e, t, n) {
    return t ? n ? i(t, e) : o(i(t, e)) : n ? r(e) : o(r(e))
}

~~~



然后使用 发条JS调试工具，调用该 function

- 在 Chrome 中可以看到参数值

![image-20220320215311703](images/js_reverse/image-20220320215311703.png)



所以只需要传入 e 即密码明文就可以了，将函数起个名字我们进行计算表达式即可

![image-20220320215208878](images/js_reverse/image-20220320215208878.png)



## 4. 使用 Python

~~~python
import execjs

# 实例化一个 node 对象
node = execjs.get()

# js 源文件编译
ctx = node.compile(open('./mpWeixin.js', encoding='utf-8').read())

# 执行 js 函数
password = "123456"
pwd = ctx.eval(f"getPwd('{password}')")
print(pwd)
~~~



# 闭包 JS 加密：凡科网

同样是 post 提交数据被加密

~~~
pwd: e10adc3949ba59abbe56e057f20f883e
~~~



## 1. 分析加密算法

在 js 中搜索 `pwd=`，找到关键字段，可以看到 pwd 被 md5 函数加密

~~~
params.push( '&pwd=' + $.md5( pwd ) );
~~~



无法跟进 md5 函数，发现是通过 $.md5 这个 jQuery 调用的 md5 函数，那么可以直接搜索 md5 关键字，在 fai.min.js 中找到 md5 函数

~~~js
g.md5 = function(v, w, u) {
    if (!w) {
        if (!u) {
            return l(v)
        } else {
            return q(v)
        }
    }
    if (!u) {
        return r(w, v)
    } else {
        return h(w, v)
    }
}
~~~



不过可以看到 !w, !u 这些都是在该函数外部定义的，所以将该函数的外部一层所有代码复制下来

~~~js
(function(g) {
    ...
    ...
    } (typeof jQuery === "function" ? jQuery: this));
~~~



闭包函数直接调用函数即可，其实就是简单的 md5 加密，如：

![image-20220321220158510](images/js_reverse/image-20220321220158510.png)



# RSA 加密：Steam

## 1. 分析 Post 请求体

提交登录时，有两个 ajax 请求

~~~
https://store.steampowered.com/login/getrsakey/
https://store.steampowered.com/login/dologin/
~~~



getrsakey 中通过提交登录名，可以获得 rsakey

~~~
publickey_exp: "010001"
publickey_mod: "b36e8a4c73b04dce21324fdeb4b82e02ffb087c53fa0ac533497d13aa959acacf5cc89d1e8c7514677e1e0aca2eea23593dd201c51dcb95f1c454bc1ce07304288cc057be7c2bea4beda6fce59dfccd5f6a7f8850338b5cec37ead09cdc52cdded1b9da148e259d924a8859dac63e48482c0e3701ed5ee8bb6604223183d22301becef4b08df2ba3ed921e3e808b3b28b793f7ec669af6cc3422ead732f041b023c27a9e8c086fb139166da8e64bc267ba04710d648b5df46c1cba9cfadbd9f3562217872139f293e6b267ca6c517bf90be064b7e9f5a0214efd4cd586cd3dc32522d4b54b0e6c40fe6f8f4376356df11ba1d5525a7cd3e49acf724b36a972f7"
success: true
timestamp: "475429100000"
token_gid: "afe6371e4030b2b27"
~~~



在 dologin 这个请求中

-  password 被加密
- donotcache 不知道干什么用的



![image-20220320231442582](images/js_reverse/image-20220320231442582.png)



## 2. 搜索加密位置

关键词可以设置为

~~~
password
password:
password=
~~~



发现 password 附近有 RSA 以及  encrypt 字样，可以判断这里是加密方法

~~~js
var form = this.m_$LogonForm[0];
var pubKey = RSA.getPublicKey(results.publickey_mod, results.publickey_exp);
var username = this.m_strUsernameCanonical;
var password = form.elements['password'].value;
password = password.replace(/[^\x00-\x7F]/g, ''); // remove non-standard-ASCII characters
var encryptedPassword = RSA.encrypt(password, pubKey);
~~~



分析

~~~js
var form = this.m_$LogonForm[0];  // 获取表单
var pubKey = RSA.getPublicKey(results.publickey_mod, results.publickey_exp);  // 获取 publickey
var username = this.m_strUsernameCanonical;  // 获取用户名
var password = form.elements['password'].value;  // 获取表单密码字段
password = password.replace(/[^\x00-\x7F]/g, ''); // 去除非标准 ASCII 字符
var encryptedPassword = RSA.encrypt(password, pubKey);  // RSA 加密
~~~



调试步入 encrypt 方法，将 rsa.js 复制下来

~~~js
var RSAPublicKey = function($modulus_hex, $encryptionExponent_hex) {
    this.modulus = new BigInteger($modulus_hex, 16);
    this.encryptionExponent = new BigInteger($encryptionExponent_hex, 16);
};

var Base64 = {
    base64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function($input) {
        if (!$input) {
            return false;
        }
        var $output = "";
        var $chr1, $chr2, $chr3;
        var $enc1, $enc2, $enc3, $enc4;
        var $i = 0;
        do {
            $chr1 = $input.charCodeAt($i++);
            $chr2 = $input.charCodeAt($i++);
            $chr3 = $input.charCodeAt($i++);
            $enc1 = $chr1 >> 2;
            $enc2 = (($chr1 & 3) << 4) | ($chr2 >> 4);
            $enc3 = (($chr2 & 15) << 2) | ($chr3 >> 6);
            $enc4 = $chr3 & 63;
            if (isNaN($chr2)) $enc3 = $enc4 = 64;
            else if (isNaN($chr3)) $enc4 = 64;
            $output += this.base64.charAt($enc1) + this.base64.charAt($enc2) + this.base64.charAt($enc3) + this.base64.charAt($enc4);
        } while ( $i < $input . length );
        return $output;
    },
    decode: function($input) {
        if (!$input) return false;
        $input = $input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        var $output = "";
        var $enc1, $enc2, $enc3, $enc4;
        var $i = 0;
        do {
            $enc1 = this.base64.indexOf($input.charAt($i++));
            $enc2 = this.base64.indexOf($input.charAt($i++));
            $enc3 = this.base64.indexOf($input.charAt($i++));
            $enc4 = this.base64.indexOf($input.charAt($i++));
            $output += String.fromCharCode(($enc1 << 2) | ($enc2 >> 4));
            if ($enc3 != 64) $output += String.fromCharCode((($enc2 & 15) << 4) | ($enc3 >> 2));
            if ($enc4 != 64) $output += String.fromCharCode((($enc3 & 3) << 6) | $enc4);
        } while ( $i < $input . length );
        return $output;
    }
};

var Hex = {
    hex: "0123456789abcdef",
    encode: function($input) {
        if (!$input) return false;
        var $output = "";
        var $k;
        var $i = 0;
        do {
            $k = $input.charCodeAt($i++);
            $output += this.hex.charAt(($k >> 4) & 0xf) + this.hex.charAt($k & 0xf);
        } while ( $i < $input . length );
        return $output;
    },
    decode: function($input) {
        if (!$input) return false;
        $input = $input.replace(/[^0-9abcdef]/g, "");
        var $output = "";
        var $i = 0;
        do {
            $output += String.fromCharCode(((this.hex.indexOf($input.charAt($i++)) << 4) & 0xf0) | (this.hex.indexOf($input.charAt($i++)) & 0xf));
        } while ( $i < $input . length );
        return $output;
    }
};

var RSA = {

    getPublicKey: function($modulus_hex, $exponent_hex) {
        return new RSAPublicKey($modulus_hex, $exponent_hex);
    },

    encrypt: function($data, $pubkey) {
        if (!$pubkey) return false;
        $data = this.pkcs1pad2($data, ($pubkey.modulus.bitLength() + 7) >> 3);
        if (!$data) return false;
        $data = $data.modPowInt($pubkey.encryptionExponent, $pubkey.modulus);
        if (!$data) return false;
        $data = $data.toString(16);
        if (($data.length & 1) == 1) $data = "0" + $data;
        return Base64.encode(Hex.decode($data));
    },

    pkcs1pad2: function($data, $keysize) {
        if ($keysize < $data.length + 11) return null;
        var $buffer = [];
        var $i = $data.length - 1;
        while ($i >= 0 && $keysize > 0) $buffer[--$keysize] = $data.charCodeAt($i--);
        $buffer[--$keysize] = 0;
        while ($keysize > 2) $buffer[--$keysize] = Math.floor(Math.random() * 254) + 1;
        $buffer[--$keysize] = 2;
        $buffer[--$keysize] = 0;
        return new BigInteger($buffer);
    }
};
~~~



encrypt 需要两个参数：

- password
- pubkey



password 就是原文密码，而 pubkey 可以通过 RSA.getPublicKey 这个方法获取，而这里传入的参数是一个 result

~~~
var pubKey = RSA.getPublicKey(results.publickey_mod, results.publickey_exp);
~~~

> 这个 results 就是之前对 getrsakey 这个地址发送请求的响应结果



## 3. 创建解密 JS

至此，所有的函数及参数都拿到了，我们可以编写解密 JS 代码了

~~~js
function getPwd() {
    var publickey_mod = "b36e8a4c73b04dce21324fdeb4b82e02ffb087c53fa0ac533497d13aa959acacf5cc89d1e8c7514677e1e0aca2eea23593dd201c51dcb95f1c454bc1ce07304288cc057be7c2bea4beda6fce59dfccd5f6a7f8850338b5cec37ead09cdc52cdded1b9da148e259d924a8859dac63e48482c0e3701ed5ee8bb6604223183d22301becef4b08df2ba3ed921e3e808b3b28b793f7ec669af6cc3422ead732f041b023c27a9e8c086fb139166da8e64bc267ba04710d648b5df46c1cba9cfadbd9f3562217872139f293e6b267ca6c517bf90be064b7e9f5a0214efd4cd586cd3dc32522d4b54b0e6c40fe6f8f4376356df11ba1d5525a7cd3e49acf724b36a972f7"
    var publickey_exp = "010001"
    var pubKey = RSA.getPublicKey(publickey_mod, publickey_exp);
    var encryptedPassword = RSA.encrypt("123456", pubKey);
    return encryptedPassword
}
~~~



提示报错

![image-20220321205033052](images/js_reverse/image-20220321205033052.png)



将 BigInteger 方法加入到 JS 代码中

~~~js
function BigInteger(a, b, c) {
    if (a != null) if ("number" == typeof a) this.fromNumber(a, b, c);
        else if (b == null && "string" != typeof a) this.fromString(a, 256);
        else this.fromString(a, b);
}
~~~



发现还是报错

![image-20220321205306634](images/js_reverse/image-20220321205306634.png)



原因是 this 返回的是 BigInteger 的实例对象中的 fromString 方法，但这个方法没有被我们引入进来，所以代码不完整

解决办法：

- 将 fromString 这个方法引入
- 或者是将 BigInteger 里边的 js 代码全部载入我们解密 js



全部引入后接着报错

![image-20220321205711194](images/js_reverse/image-20220321205711194.png)

> navigator 是浏览器内置对象，直接赋值 this 即可，如
>
> ~~~
> var navigator = this
> ~~~



然后运行函数，即可得到加密后的密码

![image-20220321205904506](images/js_reverse/image-20220321205904506.png)



## 4. PyExecJs

~~~python
import execjs

node = execjs.get()

with open('./steam.js','r',encoding='utf-8') as f:
    js = f.read()
    
ctx = node.compile(js)
mod = "xxx"
exp = "xxx"
funcName = 'getPwd("{0}","{1}","{2}")'.format('123456',mod,exp)
password = ctx.eval(funcName)
print(password)


~~~



# RSA 加密：完美世界 

## 1. 代码分析

发送登录请求

~~~
https://passport.wanmei.com/sso/login
~~~



password 被加密

~~~
password: EgA5YBJZsxe4j21RJl8hftNHtWLDJwdQEIYGOieYyHcEFyus4TW5nKCnoU4uAdu9TroSPb/g5YmEslUfc6rxuUTwrfXuxOxzcfebeDvmfllvNJODFd0tvxQyZJrs4fFhsEgSy8hmCyib83EVn4N4LBJcB8YfbMQa0qY4D9cHM2U=
~~~



在 ssologinAI.js 中找到加密函数段

~~~js
var e = new JSEncrypt();
e.setPublicKey($('#e').val());
if (!isUsbkey) {
    $("#logintype").val("normal");
    var p = e.encrypt(passwd);
~~~

> 可以看到有 setPublicKey 设置公钥函数，还有 encrypt 加密函数



跟进发现是一个 JSEncrypt.js 文件，放入编译器中一直报错，可能是因为使用 min.js 压缩版本的缘故，我们可以去 BootCDN 下载一个原版 JSEncrypt.js

~~~
https://cdn.bootcdn.net/ajax/libs/jsencrypt/2.3.1/jsencrypt.js
~~~



加载后发现 navigator 和 window 报错，可以直接定义为 this，注意分号

![image-20220321223724972](images/js_reverse/image-20220321223724972.png)



## 2. 自定义解密函数

根据之前抓包的逻辑，编译解密函数

~~~js
function getPwd(pwd){
  var e = new JSEncrypt();
  e.setPublicKey($('#e').val());
  var p = e.encrypt(passwd);
  return p
}
~~~



还差一个 PublicKey，需要找到 id 为 e 的表单字段，并获取其 value 值，通过搜索 `id="e"` 关键字，发现是在这个 iframe 中的一个表单字段

~~~
https://passport.wanmei.com/sso/login?service=passport&isiframe=1&location=2f736166652f
~~~



~~~
<input id="e" type="hidden" value="MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCjfeE0MIYsZes/HwV06/kvRw34Hmhn9WPt0feLPp1PVqdqZz1/xFvPPEAJ/lAvfqt5kyn+A06bvYXIhizTjlOzPgLE4897ihuSYXgfwcUshPZvydRLbftU6Exj5SLbv5tw4GInbgQv7RWLWOKyQA81q6lWae2Kcgd1XpDRsQNXVwIDAQAB" />

~~~



把这个值拿过来，函数也就完成了

![image-20220321224557582](images/js_reverse/image-20220321224557582.png)



# RSA 加密：试客联盟

http://login.shikee.com/



password 加密

~~~
password: 5787e6d0807f6ae002b7d2703f49f94c84bc76fb146c0970e6964821276790cf4ead90e64085d195b9fe10980898b7b02c82e5b14f260937118f8857348623476be1ea239546f3cb67629f43d98267133349d2058de625116b856efef004456600513c664fa08eb056a4fc5f1286f5c5ee7e0e2fdf64f4a644b158f10bfac23c
~~~



## 1. 分析 JS 算法

搜索 password，找到加密位置

~~~js
setMaxDigits(131);  // 不知道干什么的
var formData = $("#loginForm").serializeArray();  // 将表单数据序列化为数组
var key = new RSAKeyPair("10001",'',rsa_n);  // 获取公钥
// 循环表单数据
for (var i = 0; i < formData.length; i++) {  
    // 如果表单字段是 password
    if (formData[i].name === 'password') {
        // 那么使用 encryptedString 加密
        formData[i].value = encryptedString(key, formData[i].value);
        break;
    }
}
~~~



## 2. 获取参数

密码是由 encryptedString() 这个函数拿到的，主要有两个参数，一个是公钥，另外一个则是我们表单密码明文。



公钥 key 是由 

~~~js
var key = new RSAKeyPair("10001",'',rsa_n);
~~~



rsa_n 是通过这个 URL 拿到

~~~
http://login.shikee.com/getkey?v=62d1181fa9706a4d5dccd03e77c217b6
~~~



~~~
DC1683EEAA2B709F97743773E18F53E3C9A15D12465CE82227A6E447E6EC590D0B569876BB631B0AB4D67881E7EC874066D6E022E2978B4C6EAA8903EC1774AAE040A3BEAF9C2B48730ADD46BEF5F0C8109DB6FCEFED0F4A84CCD7AFFDB4FB4214DA0D0FF1A8E2831E81FA4D7C2F4346184EEC87CE42230FC320B2B4E392ECDF
~~~





## 3. 自定义解密函数

跟进 encryptedString() 这个函数，以及 RSAKeyPair() 这个函数，复制下来，发现来自同一个 JS 文件。



然后编写自定义解密函数，传入所有需要参数即可

~~~js
function getPwd(p){
    setMaxDigits(131);
    rsa_n = "DC1683EEAA2B709F97743773E18F53E3C9A15D12465CE82227A6E447E6EC590D0B569876BB631B0AB4D67881E7EC874066D6E022E2978B4C6EAA8903EC1774AAE040A3BEAF9C2B48730ADD46BEF5F0C8109DB6FCEFED0F4A84CCD7AFFDB4FB4214DA0D0FF1A8E2831E81FA4D7C2F4346184EEC87CE42230FC320B2B4E392ECDF"
    var key = new RSAKeyPair("10001",'',rsa_n);
    password = encryptedString(key, p);
    return password;
}
~~~



获得加密数据

![image-20220322201743864](images/js_reverse/image-20220322201743864.png)



# JS 混淆：空中网

https://passport.kongzhong.com/login?backurl=%2Fv%2Fusersafe%2Fsafeindex&validated=true#xgmmlink



密码字段被加密

~~~
j: j
(empty)
type: 1
service: https://passport.kongzhong.com/
username: yunshen
password: 312e77e6bb7605b948cf
vcode: pexe
toSave: 0
_: 1647951752377
~~~



## 1. JS 反混淆

搜索 password 无法定位到 js 加密算法，但是找到一个奇怪的 js



login-handler-kz-ums-3.0-min.js?version=2021040601

~~~js
eval(function(p, a, c, k, e, d) {
    e = function(c) {
        return (c < a ? "" : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
    }
    ;
    if (!''.replace(/^/, String)) {
        while (c--)
            d[e(c)] = k[c] || e(c);
        k = [function(e) {
            return d[e]
        }
        ];
        e = function() {
            return '\\w+'
        }
        ;
        c = 1;
    }
    ;while (c--)
        if (k[c])
            p = p.replace(new RegExp('\\b' + e(c) + '\\b','g'), k[c]);
    return p;
}('d 1x={\'1y\':\'1f-1c-1w\',\'1d\':\'1u://1v.1f.1z\',\'c\':\'\',\'k\':\'\',\'h\':e,\'p\':e,\'K\':0,\'Z\':z,\'l\':z,\'1e\':n(){6.h=e;6.p=e;6.K=0;6.Z=M;},\'W\':n(s){6.1e();6.p=s;d 7="1a=j";9(6.c!=e&&C.E(6.c)!=""){7+="&c="+x(6.c)};9(6.k!=e&&C.E(6.k)!=""){7+="&k="+x(6.k)};9(6.l){7+="&l=1"};6.A(7)},\'A\':n(7){9(6.Z==z){N z};9(6.h!=e&&6.h["1b"]=="1"){d g={};g["o"]=6.h["o"];g["c"]=6.h["c"];g["17"]=M;g["F"]=6.h["F"];6.p(g);N z};d 12=6.1d+"/1D";C.1E({1C:z,12:12,D:\'1A\',1B:\'1a\',1a:\'j\',g:7,1o:"j",1n:1m,1r:n(1q){},1p:n(1s){}})},\'1F\':n(u){6.h=u;6.K=y.X(Y y());9(6.p!=e){d g={};9(u["1b"]=="0"){g["c"]=u["c"];g["17"]=z;g["1O"]=u["1N"];9(u["T"]!=e&&u["T"]=="1"){g["T"]=M}m{g["T"]=z}}m 9(u["1b"]=="1"){g["o"]=u["o"];g["c"]=u["c"];g["17"]=M};g["F"]=6.h["F"];6.p(g)};6.Z=M},\'1c\':n(o,r,w,t,s){d I=y.X(Y y())-6.K;9((I/14)>=13){6.h=e};9(6.h==e||6.h==""){6.W(n(g){6.p=s;d 7="";7+="&D=1";9(6.c!=e&&C.E(6.c)!=""){7+="&c="+x(6.c)};7+="&H="+o;7+="&V="+6.18(r,g["F"]);7+="&t="+t;9(w){7+="&q=1"}m{7+="&q=0"};9(6.k!=e&&C.E(6.k)!=""){7+="&k="+x(6.k)};9(6.l){7+="&l=1"};6.A(7)})}m{6.p=s;d 7="";7+="&D=1";9(6.c!=e&&C.E(6.c)!=""){7+="&c="+x(6.c)};7+="&H="+o;7+="&V="+6.18(r,6.h["F"]);7+="&t="+t;9(w){7+="&q=1"}m{7+="&q=0"};9(6.k!=e&&C.E(6.k)!=""){7+="&k="+x(6.k)};9(6.l){7+="&l=1"};6.A(7)}},\'1L\':n(o,Q,w,t,s){d I=y.X(Y y())-6.K;9((I/14)>=13){6.h=e};9(6.h==e||6.h==""){6.W(n(){6.p=s;d 7="";7+="&D=2";7+="&c="+6.c;7+="&H="+o;7+="&t="+t;7+="&Q="+Q;9(w){7+="&q=1"}m{7+="&q=0"};9(6.k!=e){7+="&k="+x(6.k)};9(6.l){7+="&l=1"};6.A(7)})}m{6.p=s;d 7="";7+="&D=2";7+="&c="+6.c;7+="&H="+o;7+="&t="+t;7+="&Q="+Q;9(w){7+="&q=1"}m{7+="&q=0"};9(6.k!=e){7+="&k="+x(6.k)};9(6.l){7+="&l=1"};6.A(7)}},\'1P\':n(o,r,w,s){d I=y.X(Y y())-6.K;9((I/14)>=13){6.h=e};9(6.h==e||6.h==""){6.W(n(){6.p=s;d 7="";7+="&D=1l";7+="&c="+6.c;7+="&H="+o;7+="&V="+r;9(w){7+="&q=1"}m{7+="&q=0"};9(6.l){7+="&l=1"};6.A(7)})}m{6.p=s;d 7="";7+="&D=1l";7+="&c="+6.c;7+="&H="+o;7+="&V="+r;9(w){7+="&q=1"}m{7+="&q=0"};9(6.l){7+="&l=1"};6.A(7)}},\'18\':n(15,r){9(r==e||r.v<=0){N e};d f="";1g(d i=0;i<r.v;i++){f+=r.1h(i).O()};d J=G.1k(f.v/5);d S=11(f.L(J)+f.L(J*2)+f.L(J*3)+f.L(J*4)+f.L(J*5));d 19=G.1Q(r.v/2);d U=G.1M(2,1I)-1;9(S<2){N e};d B=G.1K(G.1J()*1G)%1H;f+=B;1j(f.v>10){d a=f.1i(0,1);d b=f.1i(10,f.v);9(b.v>10){f=b}m{f=(11(a)+11(b)).O()}};f=(S*f+19)%U;d P="";d R="";1g(d i=0;i<15.v;i++){P=11(15.1h(i)^G.1k((f/U)*1t));9(P<16){R+="0"+P.O(16)}m R+=P.O(16);f=(S*f+19)%U};B=B.O(16);1j(B.v<8)B="0"+B;R+=B;N R}};', 62, 115, '||||||this|param||if|||service|var|null|prand|data|j_data|||targetService|renew|else|function|user|f_call_back|toSave|pwd|call_back|vcode|vData|length|to_save|decodeURIComponent|Date|false|exec_login|salt|jQuery|type|trim|dc|Math|username|tempTime|sPos|timestamp|charAt|true|return|toString|enc_chr|smscode|enc_str|mult|requirevcode|modu|password|check|parse|new|completed||parseInt|url|180|1000|str||logged|encrypt|incr|jsonp|state|login|loginServer|init|kongzhong|for|charCodeAt|substring|while|floor|101|5000|timeout|jsonpCallback|error|json|success|xhr|255|http|sso|agent|KZLoginHandler|id|com|post|dataType|async|ajaxLogin|ajax|jsonpCallbackKongZ|1000000000|100000000|31|random|round|login_sms|pow|kzmsg|errors|login_reg|ceil'.split('|'), 0, {}))

~~~

> 其中包含 password 关键字



这是为了干扰逆向，通过 js 语法进行的加密，解决办法：

- JS 反混淆在线工具
- Chrome 自带反混淆



更改 Sources -> Setting -> Search in anonymous and content scripts 即可

![image-20220322202902552](images/js_reverse/image-20220322202902552.png)



格式化之后，可以看到源码

~~~js
var param = "";
param += "&type=1";
if (this.service != null && jQuery.trim(this.service) != "") {
    param += "&service=" + decodeURIComponent(this.service)
}
;param += "&username=" + user;
param += "&password=" + this.encrypt(pwd, data["dc"]);
param += "&vcode=" + vcode;
~~~



## 2. 分析加密算法

下断点，然后重新提交数据，然后跟进函数 encrypt()，将整个函数复制



## 3. 获取参数

- pwd 即密码源文
- data["dc"]  则是访问 ajaxLogin 的返回值其中的字段



~~~json
KZLoginHandler.jsonpCallbackKongZ({
    "dc": "D833CB15D4914E8AF960811E4E278CF5",
    "kzmsg": "",
    "service": "https://passport.kongzhong.com/",
    "state": "0",
    "requirevcode": "1"
})

~~~



## 4. 自定义解密函数

通过源码可以看到 encrypt 是某个类中的一个方法，通过源码可以看出这个类就是 KZLoginHandler，直接调用类中的方法即可

~~~js
function getPwd(p){
    var dc = "D833CB15D4914E8AF960811E4E278CF5";
    var password = KZLoginHandler.encrypt(p, dc);
    return password;
}
~~~



# 长房网：des 加密

同样是密码字段被加密

~~~
j_username: yun@qq.com
j_password: 䐵匠䴵BmoFy1wmH+J/IAGCNF3SfA==
j_redirectto: https://eip.chanfine.com/index.jsp
~~~



## 1. 分析加密算法

通过搜索 j_password 关键字，找到关键代码段

~~~js
function encryptPassword(){ 
	document.forms[0].j_password.value = desEncrypt(document.forms[0].j_password.value);
}
~~~



跟进 encryptPassword() 函数，最后 return 的值就是 keyObj.security +value

~~~js
function desEncrypt(value, xForm, type) {
    if (_0(xForm)) {
        return value
    } else {
        var keyObj = {};
        if (type == null || "aes" == type.toLowerCase()) {
            keyObj = SECURITYKEY.get();
            value = CryptoJS.AES.encrypt(value, CryptoJS.enc.Utf8.parse(keyObj.key), {
                iv: CryptoJS.enc.Utf8.parse(keyObj.iv)
            }).toString()
        } else {
            keyObj = SECURITYKEY.get('des');
            value = CryptoJS.DES.encrypt(value, CryptoJS.enc.Hex.parse(keyObj.key), {
                iv: CryptoJS.enc.Hex.parse(keyObj.iv)
            })
        }
        return keyObj.security + value
    }
}
~~~



desEncrypt() 函数需要传参，而之前调用只传了一个密码，所以 xForm 和 type 都是空值，所以真正的算法应该是这段

~~~js
keyObj = SECURITYKEY.get();
value = CryptoJS.AES.encrypt(value, CryptoJS.enc.Utf8.parse(keyObj.key), {
    iv: CryptoJS.enc.Utf8.parse(keyObj.iv)
}).toString()
return keyObj.security + value
~~~



## 2. 获取参数

所以最后我们需要过得 keyObj.key,keyObj.iv, keyObj.security, 就可以通过上边的代码拿到加密后的字段，而 keyObj 是由 SECURITYKEY.get(); 生成，跟进

~~~js
get: function(encodeType) {
    var str = SECURITYKEY._2();
    if (encodeType == null || encodeType == 'aes') {
        if (str.length < 32) {
            str += "abcdefghijklmnopqrstuvwxyz1234567890"
        }
        str = str.toUpperCase();
        var key = {};
        key.key = str.substring(0, 16);
        key.iv = str.substring(16, 32);
        key.security = "\u4435\u5320\u4d35"
    } else {
        if (str.length < 16) {
            str += "abcdefghijklmnopqrstuvwxyz"
        }
        str = str.toUpperCase();
        var key = {};
        key.key = SECURITYKEY.toHexString(str.substring(0, 8));
        key.iv = SECURITYKEY.toHexString(str.substring(8, 16));
        key.security = "\u4445\u5320\u4d45"
    }
    return key
},
~~~



通过刚才的分析，我们确定是 aes 加密，所以 get 方法中我们只看 else 前边的部分即可

- key 是截取 str 的前16位
- iv 是截取 str 后16位
- secuity 是固定的 `\u4435\u5320\u4d35`



而 str 是由 SECURITYKEY._2() 生成的，我们在附近寻找 _2() 方法，可以看到 str 其实就是我们的 SessionID

~~~js
_2: function() {
    $.ajax({
        async: false,
        dataType: "script",
        url: Com_Parameter.ResPath + "js/session.jsp?_=" + new Date().getTime()
    });
    var str = "";
    if (window.getSessionId) {
        str = getSessionId()
    }
    return str
},
~~~



## 2. 自定义解密函数

将 CryptoJS 函数加载进来，然后执行自定义函数即可

~~~js
function getPwd(p){
    var str = "324C90E42F2179D774ADB2AD18DED3AF";
    var key = str.substring(0, 16);
    var iv = str.substring(16, 32);
    var security = "`\u4435\u5320\u4d35";
    var value = CryptoJS.AES.encrypt(p, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv)
}).toString();
    return security + value;
}
~~~



![image-20220322212330585](images/js_reverse/image-20220322212330585.png)





# RSA 加密：G妹游戏（Webpack）

密码加密

~~~
password: XMEwlogJHJ%2FdIN%2FoI%2BTlbaLPmCKKpLhHrJLMq6wDhTmt9hCWc24BFTFLnlbt6cklJyQaUTgc9WJY%2B2XFKvxwLjUW7Vp39wT%2FNcUWCR82xtBo6G0Gm92gSFWzbyLbjCL2JJKx1EjJCJv8I66%2F96chs1dzUZUGouUxy6djY8VvoxQ%3D
~~~



## 1. 分析加密函数位置

搜索 password，找到几处类似加密的代码，下断点不起作用

~~~
var password = rsa.encode(params['password'],timestamp);
~~~



那么就需要使用另一种方式来找到加密入口函数

在 Network 中，找到 Initiator，可以看到函数栈数据

![image-20220323140732185](images/js_reverse/image-20220323140732185.png)



可以看到最后发送数据的函数 是 send，进入到该函数下断点

- 重新发送登录请求，发现可以中断调试，但是没有我们想要的数据，继续从 Call Stack 中往上找调用的方法

![image-20220323141455696](images/js_reverse/image-20220323141455696.png)





在刚才的请求当中，我们看到 send 函数调用了两次

![image-20220323142427630](images/js_reverse/image-20220323142427630.png)



所以我们让代码过一下

![image-20220323142837612](images/js_reverse/image-20220323142837612.png)



最后在 n.login 这边发现了加密的 password

- password 的值是 o

![image-20220323194537753](images/js_reverse/image-20220323194537753.png)



- o 是调用了 a 对象中的 encode 方法，传入两个参数

- t.password 密码原文
- s 是时间戳

~~~js
o = a.encode(t.password, s)
~~~



跟进 encode 方法

~~~js
3: function(t, e, i) {
        var s;
        s = function(t, e, s) {
            function n() {
                "undefined" != typeof r && (this.jsencrypt = new r.JSEncrypt,
                this.jsencrypt.setPublicKey("-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDq04c6My441Gj0UFKgrqUhAUg+kQZeUeWSPlAU9fr4HBPDldAeqzx1UR92KJHuQh/zs1HOamE2dgX9z/2oXcJaqoRIA/FXysx+z2YlJkSk8XQLcQ8EBOkp//MZrixam7lCYpNOjadQBb2Ot0U/Ky+jF2p+Ie8gSZ7/u+Wnr5grywIDAQAB-----END PUBLIC KEY-----"))
            }
            var r = i(4);
            n.prototype.encode = function(t, e) {
                var i = e ? e + "|" + t : t;
                return encodeURIComponent(this.jsencrypt.encrypt(i))
            }
            ,
            s.exports = n
        }
        .call(e, i, e, t),
        !(void 0 !== s && (t.exports = s))
    },
~~~



其中下边这段就是加密方法

~~~js
return encodeURIComponent(this.jsencrypt.encrypt(i))
~~~



而这个函数是一个明显的 Webpack 调用方法



## 2. Webpack 调用方法

可以看到该函数是一个 Webpack 类型的调用

~~~js
function(x){
    // 模块加载器
    function xx(yy){
        x[yy].call(xxx,xxx,xxx);
    }
    xx(1); // 调用参数中第一个函数
    ([
        function(a,b,c){},
        function(a,b,c){}
    ])};
~~~



除了数组参数也可以是对象参数，如：

~~~js
function(x){
    // 模块加载器
    function xx(yy){
        x[yy].call(xxx,xxx,xxx);
    }
    xx(1); // 调用参数中第一个函数
    ({
        0:function(a,b,c){},
        1:function(a,b,c){}
    }
    )};
~~~



home.min.js 中的模块加载器，使用了自启动函数将参数传入

~~~js
!function(t) {
    function e(s) {
        if (i[s])
            return i[s].exports;
        var n = i[s] = {
            exports: {},
            id: s,
            loaded: !1
        };
        return t[s].call(n.exports, n, n.exports, e),
        n.loaded = !0,
        n.exports
    }
    var i = {};
    return e.m = t,
    e.c = i,
    e.p = "",
    e(0)
}({
    0:function(){},
    1:function(){},
});
~~~



## 3. 自定义 Webpack 加载器

- 找到加载器
- 找到调用代码
- 构造一个自执行方法



自执行方法：

~~~js
// 方法1：
fn = function(){
    console.log('1');
}

// 运行 fn()
// 等价于
function(){
    console.log('1')
}()

// 再包一个括号，于是变成了
(function(){
    console.log('1');
}());
~~~



~~~js
// 方法2：相当于把函数作为一个整体，然后调用
(function(){
    console.log('2');
})();
~~~



~~~js
// 方法3：使用!来判断函数返回值，其实就是 ! + 表达式 的方法运行函数
!function(){
    console.log('3');
}();

// 方法4：同上
+function(){
    console.log('4')
}();
~~~



我们只需要加载器函数，删除其他无关代码，最后形成

~~~js
!function(t) {
    function e(s) {
        if (i[s])
            return i[s].exports;
        var n = i[s] = {
            exports: {},
            id: s,
            loaded: !1
        };
        return t[s].call(n.exports, n, n.exports, e),
        n.loaded = !0,
        n.exports
    }
    var i = {};  // 上边用到 i[s] 做判断，需要保留
    // return e.m = t, 
    // e.c = i,
    // e.p = "",
    // e(0)
}({
    0:function(){},
    1:function(){},
});
~~~



## 4. 填入函数参数

将之前的 encode 方法放入 webpack 调用参数，如：

~~~js
!function(t) {
    function e(s) {
        var i = {};
        if (i[s])
            return i[s].exports;
        var n = i[s] = {
            exports: {},
            id: s,
            loaded: !1
        };
        return t[s].call(n.exports, n, n.exports, e),
            n.loaded = !0,
            n.exports		
    }
}({
    3: function(t, e, i) {
        var s;
        s = function(t, e, s) {
            function n() {
                "undefined" != typeof r && (this.jsencrypt = new r.JSEncrypt,
                                            this.jsencrypt.setPublicKey("-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDq04c6My441Gj0UFKgrqUhAUg+kQZeUeWSPlAU9fr4HBPDldAeqzx1UR92KJHuQh/zs1HOamE2dgX9z/2oXcJaqoRIA/FXysx+z2YlJkSk8XQLcQ8EBOkp//MZrixam7lCYpNOjadQBb2Ot0U/Ky+jF2p+Ie8gSZ7/u+Wnr5grywIDAQAB-----END PUBLIC KEY-----"))
            }
            var r = i(4);
            n.prototype.encode = function(t, e) {
                var i = e ? e + "|" + t : t;
                return encodeURIComponent(this.jsencrypt.encrypt(i))
            }
                ,
                s.exports = n
        }
            .call(e, i, e, t),
            !(void 0 !== s && (t.exports = s))
    },
});
~~~



再跟进 `return encodeURIComponent(this.jsencrypt.encrypt(i))` 里的方法，发现也是个 webpack 调用

可以明显看到这是一个类中的方法，需要用到整个库

~~~js
qe.prototype.encrypt = function(t) {
    try {
        return be(this.getKey().encrypt(t))
    } catch (t) {
        return !1
    }
}
~~~



复制库中所有代码进 Notepad++ ，选择语言，Alt+0 折叠所有层次

![image-20220323163453619](images/js_reverse/image-20220323163453619.png)



搜索 `qe.prototype.encrypt`，找到调用方法编号 4

![image-20220323163608920](images/js_reverse/image-20220323163608920.png)



将两个函数放入到 webpack 调用参数中，改名

![image-20220323192919940](images/js_reverse/image-20220323192919940.png)



## 5. 外部调用

如果需要执行 webpack 中的函数，需要加载器函数，那么就需要导出函数

- 外部定义全局变量
- 内部将函数赋值给全局变量

![image-20220323192103729](images/js_reverse/image-20220323192103729.png)



然后外部使用 _e 调用函数即可，如：

~~~js
_e('jiami');
~~~



原理：

~~~js
var b_;
function f1(){
    var b = function(){
      console.log(2);
    }
    b_ = b;  
}
~~~

> 必须先要执行 f1() 函数，才可以运行 b_()





## 6. 解密函数

通过加密函数，拿到加密流程

~~~js
	jiami: function(t, e, i) {
        var s;
        s = function(t, e, s) {
            function n() {
                "undefined" != typeof r && (this.jsencrypt = new r.JSEncrypt,
                this.jsencrypt.setPublicKey("-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDq04c6My441Gj0UFKgrqUhAUg+kQZeUeWSPlAU9fr4HBPDldAeqzx1UR92KJHuQh/zs1HOamE2dgX9z/2oXcJaqoRIA/FXysx+z2YlJkSk8XQLcQ8EBOkp//MZrixam7lCYpNOjadQBb2Ot0U/Ky+jF2p+Ie8gSZ7/u+Wnr5grywIDAQAB-----END PUBLIC KEY-----"))
            }
			var r = i(4);
            n.prototype.encode = function(t, e) {
                var i = e ? e + "|" + t : t;
                return encodeURIComponent(this.jsencrypt.encrypt(i))
            }
            ,
            s.exports = n
        }
        .call(e, i, e, t),
        !(void 0 !== s && (t.exports = s))
    },
~~~



只需要执行

~~~
encodeURIComponent(this.jsencrypt.encrypt(i))
~~~



通过中断，可以知道 i 的值是时间戳和密码原文拼凑而成

![image-20220323195835731](images/js_reverse/image-20220323195835731.png)



而 this.jsencrypt 则是 new r.JSEncrypt 的实例，那么 r 又是什么？在代码中可以看到

~~~
var r = i(4);
~~~



i 是 加载器传递过来的实参，回过头看加载器的形参

~~~js
return t[s].call(n.exports, n, n.exports, e),
~~~

> 传递了4个参数



那么我们分析一下

~~~js
!function(t) {
    function e(s) {
        if (i[s])
            return i[s].exports;
        var n = i[s] = {  // 定义n
            exports: {},  // 定义 n.exports
            id: s,
            loaded: !1
        };        
        return t[s].call(n.exports, n, n.exports, e),
        n.loaded = !0,
        n.exports
    }
    var i = {};
    return e.m = t,
    e.c = i,
    e.p = "",
    e(0)
}
~~~



- n.exports 是对象
- n 也是一个对象
- e 则是这个函数本身



所以 i 则是 e 函数，也就是模块加载器本身

~~~
var r = i(4);
~~~

> 则代表加载器运行编号为4的函数，编号为4的函数则是我们的 JSEncrypt 库



因为我们改了编号名，所以这里也需要重新改名

~~~js
var r = i("jsencrypt")
~~~



那么解密函数就出来了

~~~js
function getPwd(pass,time){
    // 首先加载 webpack 中的 jiami 函数
	var jiami__ = _e("jiami");
    // 需要构造创建构造函数
	var __jiami = (new jiami__);
    // 通过构造函数中的方法 encode 拿到加密密码
	return __jiami.encode(pass,time);
}

~~~



通过 `var jiami__ = _e("jiami");` 我们拿到 jiami 函数，我们需要调用 n.prototype.encode 方法，而 jiami__ 没有 encode 方法，通过创建实例，我们可以拿到 JSEncrypt 的实例

~~~js
var __jiami = (new jiami__);
~~~





JS debug 工具一直报错

- 发条 JS 调试工具
- WT-JS 调试工具



最后使用 Fiddler 中的编程猫插件完美执行

![image-20220323201042256](images/js_reverse/image-20220323201042256.png)



## 7. 直接方法

通过加密方法

~~~js
3: function(t, e, i) {
    var s;
    s = function(t, e, s) {
        function n() {
            "undefined" != typeof r && (this.jsencrypt = new r.JSEncrypt,
                                        this.jsencrypt.setPublicKey("-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDq04c6My441Gj0UFKgrqUhAUg+kQZeUeWSPlAU9fr4HBPDldAeqzx1UR92KJHuQh/zs1HOamE2dgX9z/2oXcJaqoRIA/FXysx+z2YlJkSk8XQLcQ8EBOkp//MZrixam7lCYpNOjadQBb2Ot0U/Ky+jF2p+Ie8gSZ7/u+Wnr5grywIDAQAB-----END PUBLIC KEY-----"))
        }
        var r = i(4);
        n.prototype.encode = function(t, e) {
            var i = e ? e + "|" + t : t;
            return encodeURIComponent(this.jsencrypt.encrypt(i))
        }
            ,
            s.exports = n
    }
        .call(e, i, e, t),
        !(void 0 !== s && (t.exports = s))
},
~~~



我们可以看到直接调用 `this.jsencrypt.encrypt` 即可

- i 参数可以通过下断点分析拿到其实就是 `timestamp|password`
- this.jsencrypt 则是 JSEncrypt 的实例



继而可以做出解密函数

~~~js
function getPwd(){
    e = new JSEncrypt()
    e.setPublicKey("-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDq04c6My441Gj0UFKgrqUhAUg+kQZeUeWSPlAU9fr4HBPDldAeqzx1UR92KJHuQh/zs1HOamE2dgX9z/2oXcJaqoRIA/FXysx+z2YlJkSk8XQLcQ8EBOkp//MZrixam7lCYpNOjadQBb2Ot0U/Ky+jF2p+Ie8gSZ7/u+Wnr5grywIDAQAB-----END PUBLIC KEY-----");
    var i = "1648032239605|123456";
    return e.encrypt(i);
}
~~~



# 推推99：暴力破

https://shenzhen.tuitui99.com/denglu.html



密码被加密

~~~
password: nl61oGqM4vSxC+tm9/ganihCUJjjLwf9ynIMyolMfvBrVtjpYsDutrjOseV1J12Y+j5vbI5hV1e5olHms36DLFWcbUG/ioMeqyDplYHWf3aavvctCklrwxc21z2+ErdUJU0CpMWapxtr6VaZ6ze+WNx0R0hpyVAHjiSi4Jj+gXg=
~~~



搜索 password 关键词，找到加密位置

~~~js
l_submit:function(){
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(login.pubkey);
    var userName = inpval('username');
    var password = inpval('password');
    var mark=false;

    if (login.loginFlag) {
        return false;
    }

    login.loginFlag = $.ajax({url:'/passport/passwordLow.html',
                              data:{'username':userName,'password':password},
                              type:'post',
                              async:false,
                              success:function(data){
                                  if(data=='error'){
                                      mark=true;
                                  }
                              },
                              complete:function(){
                                  login.loginFlag = false;
                              }
                             });
    if(mark){
        send_code();
        return false;
    }else
    {
        var encrypted = encrypt.encrypt(password);
        inpval('password',encrypted);
        return true;
    }
},
~~~



下断点，直接拿到 pubkey，然后使用 JSEncrypt 库加密完事

![image-20220324135419050](images/js_reverse/image-20220324135419050.png)



加密库直接用 BootCDN 的云 js 即可

https://cdn.bootcdn.net/ajax/libs/jsencrypt/2.3.1/jsencrypt.js

https://cdn.bootcdn.net/ajax/libs/blueimp-md5/2.19.0/js/md5.js



~~~js
function getPwd(p){
var p = md5(p);
var encrypt = new JSEncrypt();
var pubkey = "-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDAbfx4VggVVpcfCjzQ+nEiJ2DLnRg3e2QdDf/m/qMvtqXi4xhwvbpHfaX46CzQznU8l9NJtF28pTSZSKnE/791MJfVnucVcJcxRAEcpPprb8X3hfdxKEEYjOPAuVseewmO5cM+x7zi9FWbZ89uOp5sxjMnlVjDaIczKTRx+7vn2wIDAQAB-----END PUBLIC KEY-----"
encrypt.setPublicKey(pubkey);
var encrypted = encrypt.encrypt(p);
return encrypted
}
~~~



# 拍拍贷：



用户名密码分别被加密，应该也是 RSA 类型加密

~~~
password: "sS+2vLPfNgdpXh9H3z3iDqBXd1OvZWRNBLeXxHUS2LCI+950x8lwyFmKGTFq2aYYFxy9bzNfrNy7R21oV4iKExtBhUOCxscoP1wexMAa6V+5DQZ+CkMTCKef8Zm9VNZYvxrVBbM3isQKsOQiu70wvzeoAnBYY2U61AW4I+34k/s="
sourceId: null
userName: "I6P6aQFyW5iFD3T/cUabybatHeUH31j25id3uBf1YPKPHUjelMIPPKjqzvD/bJmd0vALgeKHMQkIEk729NZlJRrGr9C5+H/ulbRUbiLm+fKyXKnv6YcnkElO5PUpNZVtp+ERLXwAoGgwnjM2bo+Ng56REf7JzSDs4ocLyZpP4mg="
~~~







# 超级混淆：极电竞

https://www.365rich.com/index?gameType=1



# 空气质量分析平台

https://www.aqistudy.cn/

```python
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





# 反调试

## 1. F12 被禁用

简单代码实现 Debuger

~~~js
(function (a) {
    return (function (a) {
        return (Function('Function(arguments[0]+"' + a + '")()'))
    })(a)
})('bugger')('de', 0, 0, (0, 0));
~~~



## 2. Debugger 断点

使用 sojson 生成一段加密 js，作为示例：

https://www.sojson.com/jsobfuscator.html



![image-20220324153325070](images/js_reverse/image-20220324153325070.png)



在 Chrome 空页面中使用 Sources -> Snippets 中加入代码片段

![image-20220324214539691](images/js_reverse/image-20220324214539691.png)



运行依然报错，我们直接在 Console 中运行

![image-20220324214635714](images/js_reverse/image-20220324214635714.png)



可以看到页面被中断了

![image-20220324214654242](images/js_reverse/image-20220324214654242.png)



### 解决方法1：禁用断点（不推荐）

中断后，可以对 Debugger 处禁用中断



![image-20220324154856716](images/js_reverse/image-20220324154856716.png)



不推荐的原因，因为计时器一直在循环执行，所以造成 CPU 资源被占用



### 解决方法2：Hook Function

将调用的方法给置空，查看函数栈中是谁导致一直进入 debugger



断点所在在函数

~~~js
function _0x2f6b4a(_0x4ebcfb) {
    if (_0x4fc4d4[_0x241b('0x72', 'BxSg')](typeof _0x4ebcfb, _0x4fc4d4[_0x241b('0x73', '&LXm')])) {
        var _0x5e2487 = function() {
            while (!![]) {}
        };
        return _0x4fc4d4[_0x241b('0x74', ')x8K')](_0x5e2487);
    } else {
        if (_0x4fc4d4[_0x241b('0x75', '&%h]')](_0x4fc4d4[_0x241b('0x76', 'JLsF')]('', _0x4fc4d4[_0x241b('0x77', 'SGzf')](_0x4ebcfb, _0x4ebcfb))[_0x4fc4d4[_0x241b('0x78', 'V72y')]], 0x1) || _0x4fc4d4[_0x241b('0x79', '@#)#')](_0x4fc4d4[_0x241b('0x7a', 't3l0')](_0x4ebcfb, 0x14), 0x0)) {
            debugger ;
        } else {
            debugger ;
        }
    }
    _0x4fc4d4[_0x241b('0x7b', 'gp49')](_0x2f6b4a, ++_0x4ebcfb);
}
~~~



通过调试，我们可以发现，Debugger 一直在

_0x2f6b4a 和 _0x4bda4a 这两个栈函数中来回执行，那么我们找到上一层，看看谁在调用



那么我们可以把 _0x2f6b4a 方法置空

~~~js
_0x2f6b4a = function(){};
~~~



置空后发现过了几秒又被冻结，一般这种原因是因为定时器的原因，我们再次查看栈，可以看到有个定时器的栈

![image-20220324221818872](images/js_reverse/image-20220324221818872.png)



跟进

~~~js
setInterval(function() {
    var _0x1d0195 = {
        'HHPef': function _0x3cfb10(_0x20fcb7) {
            return _0x20fcb7();
        }
    };
    _0x1d0195[_0x241b('0x6f', 'k7(*')](_0x400b66);  //调用函数
}, 0xfa0); // 时间
~~~



Console.Log 运行

~~~js
_0x241b('0x6f', 'k7(*')
~~~

> 结果：HHPef



所以这个函数其实应该是

~~~js
_0x1d0195['HHPef'](_0x400b66);
~~~



这个方法就是定时器中定义的对象中的方法

~~~js
function _0x3cfb10(_0x20fcb7) {
    return _0x20fcb7();
}
~~~

> 传入的参数即返回的函数，也就是调用参数自己



那么这句话的意思其实就是调用

~~~js
_0x400b66()
~~~



我们把这个函数也置空即可，不管定时器怎么变化，该函数为空，也就不会重新进入 Debugger 了

~~~js
_0x400b66 = function(){};
~~~



重新载入函数（因为4秒后会重置之前置空的函数），然后执行

~~~js
_0x2f6b4a = function(){};
ƒ (){}
_0x400b66 = function(){};
ƒ (){}
~~~

> 发现 Debugger 消失了





### 解决方法2：删除代码

手动拷贝页面代码，然后删除 JS 代码







## 禁止复制、粘贴、右键

- Remove web limits





## JS 混淆、逆向

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



# 小程序逆向

因为小程序无法在 Chrome 或抓包工具中分析 JS，所以我们需要借助小程序开发者工具来进行 JS 的加密算法分析。步骤如下：

- 通过微信桌面版拿到 wxapp 包
- 利用 wxappUnpacker 解包
- 使用微信小程序开发工具加载
- 分析 JS 加密算法



## 获取 wxapkg 小程序包文件

**手机端获取小程序包文件**

~~~
/data/data/com.tencent.mm/MicroMsg/wx01bb1ef166cd3f4e/appbrand/pkg/
~~~



**电脑端获取小程序包文件**

~~~
C:\Users\Forece\Documents\WeChat Files\Applet\wx01bb1ef166cd3f4e
~~~



## wxappUnpacker 解包 



### 1. 安装 Node

wxappUnpacker 需要 Node 环境，需要先安装 Node

下载地址：https://nodejs.org/en/



### 2. 下载 wxappUnpacker

作者 Github：https://github.com/qwerty472123/wxappUnpacker

分流下载：

- https://72k.us/file/2825762-435029304

- https://github.com/wanliofficial/wxappUnpacker



### 3. 安装依赖：

需要下载 cssbeautify，csstree，esprima，js-beautify，UglifyJS2，vm2这个6个依赖的安装压缩包合集

~~~
npm install esprima -g
npm install css-tree -g
npm install cssbeautify -g
npm install vm2 -g
npm install uglify-es -g
npm install js-beautify -g
npm install escodegen -g
~~~

> 下载地址：https://72k.us/file/2825762-435372675



除了手动下载，也可以自动下载，因为有 package.json ，已经包括了各个依赖包，只是没有下载而已，进入解压路径，运行

~~~shell
npm install
~~~



### 4. 解包

~~~
node wuWxapkg.js <wx_mini_progranm_file_path>
~~~



例：

~~~
node wuWxapkg.js wx01bb1ef166cd3f4e.wxapkg
~~~



### 5. 微信开发者工具





# 抽奖助手小程序分析

## 1. 抓包分析

主要是 Header 中的几个数据

- sign 签名
- timestamp 时间戳
- Token

~~~
sign: 640fd92aadaad6ed9c0173abc2de160ef7f33d55
timestamp: 1647862168069
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMzMzOTkxNjMsImlhdCI6MTY0Nzg2MTg2OSwiZXhwIjoxNjQ4NDY2NjY5fQ.Dvls1FpMSJzRhBTJ8WPAQqce1tD7B0ryZEqGgaGivB0
~~~



通过小程序抓包，拿到 sign 值代码

~~~js
exports.default = function() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    try {
        var r = e.method, i = void 0 === r ? "get" : r, d = e.url, l = void 0 === d ? "/" : d, f = e.query, c = void 0 === f ? {} : f, m = e.token, p = void 0 === m ? s : m, v = e.body, g = void 0 === v ? {} : v;
        i = i.toLowerCase();
        var y = (0, n.default)("path", l).replace(/^\/v\d+\//, "/"), j = t(u.default.assign({}, (0, 
                                                                                                 n.default)("?", l) || {}, c)), h = t(g), w = h ? (0, o.default)(h).toString() : "", b = new Date().getTime();
        return {
            // sign 值和 timestamp 代码
            sign: (0, a.default)(i + ":" + y + ":" + j + ":" + w + ":" + b + ":" + p + ":1").toString().toLowerCase(),
            timestamp: b
        };
    } catch (e) {
        return console.error(e), {
            sign: e.message,
            timestamp: new Date().getTime()
        };
    }
};
~~~



## 2. timestamp

通过代码可以看到 timestamp 就是普通的时间戳，没有做任何修改

~~~js
b = new Date().getTime();
~~~



## 3. 分析 sign 值

~~~js
(0, a.default)(i + ":" + y + ":" + j + ":" + w + ":" + b + ":" + p + ":1").toString().toLowerCase()
~~~



通过断点调试，可以拿到一些值：

~~~js

~~~





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

https://tool.lu/



## 3. Webpack 加载器模板

~~~js
  ;(function (e) {
    function c(t) {
      var n = {
        i: t,
        l: !1,
        exports: {}
      }
      return e[t].call(n.exports, n, n.exports, c), (n.l = !0), n.exports
    }
    _c = c
  })({
    func1: function (t, e, n) {},
    func2: function (t, e, n) {}
  })

  _c("func1")
~~~



# 代码调试工具

## 1. 代码调试器

- JS-WT
- 发条 JS Debug
- Fiddler 编程猫



## 2. Python 运行

- PyExecJS
- JS2PY



## 3. Node 运行 js 代码

创建 decode_js.js 代码如：

~~~js
var p = 10;
console.log(p);
~~~



cmd 环境执行

~~~shell
node decode_js.js
~~~



## 4. Chrome

在 Console 中直接运行，或加载使用 source 加载 js 片段

![image-20220324145934383](images/js_reverse/image-20220324145934383.png)



# JS 混淆工具

如果要做代码压缩，建议使用Uglifyjs，如果是为了安全性，做js代码混淆，建议使用jshaman。

- jascriptobfascator
- jshsman
- jsfuck
- Uglifyjs



