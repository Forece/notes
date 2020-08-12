# 1. subprocess

subprocess 模块可以完成一些 os.system 处理不了的任务，比如说 os.system 就无法处理屏幕上返回的一些数据。



使用方法：

```
from subprocess import PIPE, Popen

# 返回的是 Popen 实例对象
proc = Popen(
	# 执行的命令
    'fsutil volume diskfree c:',
    
    # 指定输入、输出、错误管道
    stdin  = None,
    stdout = PIPE,
    stderr = PIPE,
    
    # 打开 Shell 模式
    shell=True)

# communicate 方法返回 输出到 标准输出 和 标准错误 的字节串内容
# 标准输出设备和 标准错误设备 当前都是本终端设备
outinfo, errinfo = proc.communicate()

# 注意返回的内容是bytes 不是 str ，我的是中文windows，所以用gbk解码
outinfo = outinfo.decode('gbk')
errinfo = errinfo.decode('gbk')
print (outinfo)
print ('-------------')
print (errinfo)

outputList = outinfo.splitlines()

# 剩余量
free  = int(outputList[0].split(':')[1].strip())

# 总空间
total = int(outputList[1].split(':')[1].strip())

if (free/total < 0.1):
    print('!! 剩余空间告急！！')
else:
    print('剩余空间足够')
```



有的时候，启动外部程序后，我们的Python程序本身并不需要等待外部程序结束。

比如，我们启动 wget下载命令， 下载1个文件。让它下载就可以了， 然后我们的程序还要继续去做其他的任务。这时候， 我们就不能用os.system， 因为它会等待 外部程序结束。我们可以用subprocess里面的Popen。

```
from subprocess import Popen
proc = Popen(
        args='wget http://xxxxserver/xxxx.zip',
        shell=True
    )

print ('让它下载，我们接下来做其他事情。。。。')
```



# 2. time, datetime, calendar

Python中，对日期和时间的操作，主要使用这3个内置模块： datetime 、 time 和 calendar



## 2.1 time

开发程序时，经常需要获取两个代码位置在执行时的时间差，比如，我们想知道某个函数执行大概耗费了多少时间，就可以使用time.time()来做。



**获取当前时间戳**

```
import time
cur_time = time.time()
print(cur_time)

# 输出结果
1595045105.916531
```

> time.time() 会返回 从 1970年1月1日0点到当前时间的经过的秒数 ，可以简称为秒数时间。.



**获取指定时间戳**

```
import time
time_stamp = int(time.mktime(time.strptime('2020-07-18 14:06:59', '%Y-%m-%d %H:%M:%S')))
print(time_stamp)
```



**将时间戳转化为日期格式字符串**

```
import time

time_stamp = time.time()
time_local = time.localtime(time_stamp)

# 转换成新的时间格式(2016-05-05 20:28:54)
dt = time.strftime("%Y-%m-%d %H:%M:%S", time_local)

# 输出结果
2020-07-18 00:12:26
```

> 这里使用的时当前时间戳，也可以使用转化过的指定时间戳



**time.sleep()**

最常用的可能时 time.sleep() 方法，可以让程序暂停指定秒

```
time.sleep(5)
```





## 2.1 datetime

**获取当前日期**

要得到当前时间对应的字符串，可以使用datetime

```
from datetime import datetime
print(str(datetime.now()))

# 输出结果
2020-07-18 00:07:04.767845
```



**改变日期输出格式**

```
from datetime import datetime
print(datetime.now().strftime('%Y-%m-%d ** %H:%M:%S'))
```



**获取对应年、月、日、分、时、秒**

```
from datetime import datetime
time = datetime.now()
tar_time = datetime(2018, 6, 30, 23, 3, 54, 238947)

# 年-月-日
print(tar_time.date())

# 年
print(datetime.now().year)

# 月
print(datetime.now().month)

# 日
print(datetime.now().day)

# 时
print(datetime.now().hour)

# 分
print(datetime.now().minute)

# 秒
print(datetime.now().second)

# 毫秒
print(datetime.now().microsecond)

# 获取星期几用 weekday方法
# 0 代表星期一，1 代表星期二 依次类推
print(datetime.now().weekday())
```

> 可以直接将 datetime.now() 换为 tar_time 保存的时间戳



从某个时间点往前或者后推一段时间

```
thatDay = "2018-6-24"
from datetime import datetime,timedelta
theDay = datetime.strptime(thatDay, "%Y-%m-%d").date()

# 后推120天 就是 + timedelta(days=120)
target = theDay + timedelta(days=120)

print(target)
print(target.weekday())

# 前推120天 就是 - timedelta(days=120)
target = theDay - timedelta(days=120)

print(target)
print(target.weekday())
```



## 2.3 calendar

获取某个月总共有多少天

```
from calendar import monthrange
# monthrange返回的是元组
# 第一个元素是指定月第一天是星期几
# 第二个元素是指定月有多少天
mr = monthrange(2011, 2)

# 得到2011年2月有多少天
print(mr[1])
```



# 3. retrying

顾名思义，让程序不断尝试执行，超出限制则会报错。

```
from retrying import retry

@retry(stop_max_attempt_number=3)
def fun1():
    print("this is fun1")
    raise ValueError("this is a test error")
```

程序会执行3次，只要有一次没有报错就会通过



# 4. pyinstaller

pyinstaller 目的是将 py 文件打包成为可以执行的 exe 文件，让最终用户不用安装 python 环境也可以运行我们的代码。



比如：创建一个简单 python 程序，程序文件名为 demo.py

```
print("Welcome to my Demo")
```



用 pyinstall 将 demo.py 转换为 exe 文件

在cmd窗口， cd进入到该代码文件所在的目录下面，执行如下的命令

```
pyinstaller demo.py --workpath d:\pybuild  --distpath d:\pybuild\dist
```

>参数 `--workpath` 指定了制作过程中临时文件的存放目录
>
>参数 `--distpath` 指定了最终的可执行文件目录所在的父目录



上面的命令执行结束后，我们进入到 目录 `d:\pybuild\dist\` 中，就会发现有一个目录叫demo，该目录中包含了如下文件



![image-20200718150918535](images/modules/image-20200718150918535.png)



**图形界面程序打包**

有时候，我们开发的是一个图形界面的程序，使用类似上面的命令运行的时候，也会有一个console窗口，我们在 执行打包命令的时候，可以加上参数 --noconsole 就可以去掉该窗口。

```
pyinstaller guitool.py --noconsole --workpath d:\pybuild  --distpath d:\pybuild\dist
```



**应用程序图标**

可以在PyInstaller创建可执行程序时，通过参数 --icon="logo.ico" 指定应用图标

```
pyinstaller httpclient.py --noconsole --hidden-import PySide2.QtXml --icon="logo.ico"
```



有的时候，我们运行打包好的程序，会出现导入库错误的提示，比如下面

```py
ImportError: could not import module 'PySide2.QtXml'
```

这意思是PyInstaller打包的时候，没有把 PySide2.QtXml库打包。

因为PyInstaller是通过分析我们的代码里面的 `import` 语句，推断我们的程序需要哪些库的。

但是有些代码，导入库的时候，是 `动态导入` 。

所谓动态导入就是，写代码的时候并不确定要导入什么库，而是在运行的时候才知道。

这种情况，不是用 import语句，而是用 `__import__` 或者 `exec` 、 `eval` 这样的方式，来导入库。

PyInstaller对此有说明，[参考这里](https://pythonhosted.org/PyInstaller/when-things-go-wrong.html#listing-hidden-imports)



PyInstaller 没法分析出动态导入的库有哪些，我们可以通过命令行参数 `--hidden-import` 告诉它。

比如，如果我们运行出现 `could not import module 'PySide2.QtXml'` 的错误 ， 就可以这样

```
pyinstaller httpclient.py  --hidden-import PySide2.QtXml
```



pyinstaller 常见错误：https://zhuanlan.zhihu.com/p/35338321



# 5.captcha

**1. 安装 Captcha 模块**

```
pip install captcha
```



**2. 生成图片验证码**

```
from captcha.image import ImageCaptcha

image = ImageCaptcha()
image.write('Forece', 'captcha.png')
```

ImageCaptcha 类的初始化方法有 width、height、fonts 和 font_sizes 四个可选参数，分别指定验证码的宽度、高度、字体和字体尺寸的信息。

其中，fonts 参数允许你使用多个字体文件，可以以参数形式填写路径

```
image = ImageCaptcha(fonts=['data/STSONG.TTF', 'data/SIMYOU.TTF'])
```



write 方法有 chars、output 和 format 三个参数，其中：

- chars 参数 -> 指定要生成的文本
- output 参数 -> 指定输出的位置
- format 参数 -> 指定生成的图片格式



**3. 生成音频验证码**

```
from captcha.audio import AudioCaptcha

audio = AudioCaptcha(voicedir='data/')
audio.write('2048', 'captcha.wav')
```

AudioCaptcha 类的初始化方法只有一个参数，那就是指定声音素材的路径，如果留空，只支持数字语音，并且以英文发音方式读出，素材路径可以以文件夹方式存储



如：

![img](images/modules/clipboard-1595117869871.png)



如果文件夹内有多个语音，则会随机选择一个语音文件

write 方法有 chars 和 output 两个参数，其中：

- chars 参数 -> 指定要生成的文本
- output 参数 -> 指定生成音频文件的位置



# 6. wordcloud

```
import wordcloud

file = open(r"./words.txt", encoding="utf-8")
text = file.read()
wc = wordcloud.WordCloud(font_path=r"C:\Windows\Fonts\simhei.ttf",
                         stopwords={"野生技术协会", "编程", "教育", "讲座", "编程技术宅", "教学", "电脑", "技术", "编程教育", "编程入门", "开发", "科学",
                                    "演示", "软件", "编程视频教程", "编程课程", "教学视频", "经验分享", "IT", "编程语言", "编程学习", "互联网", "考试",
                                    "考研", "科技", "语言", "技术宅", "面试", "自学", "原创", "公开课", "程序员", "学习", "课程", "教程", "计算机",
                                    "线上课堂", "视频教程"}
                         ).generate(text)
wc.to_file("py.png")
```



![img](images/modules/clipboard.png)



文档：https://fishc.com.cn/thread-140301-1-1.html



# 7. itchat



# 8. jieba



# 9. pyhook



# 10. pyechart



# 11. 加密模块 hashlib 

单项加密：只有加密过程，不能解密（MD5, SHA）

对称加密：

非对称加密：



MD5 加密

```
import hashlib

# 生成对象
x = hashlib.md5()

# 将字符串abc以md5方式加密
x.update('abc'.encode('utf-8'))

# 输出加密过后的密文
print(x.hexdigest())
```



让文件名以 md5 形式命名，防止下载重复

```
from hashlib import md5

def save_image(content):
	file_path = {0}/{1}.{2}.format(os.getcwd(), md5(content).hexdigest(), 'jpg')
    if not os.path.exists(file_path):
    	with open(file_path, 'wb') as f:
    		f.write(content)
    		f.close()
```



SHA 加密

```
import hashlib

hash1 = hashlib.sha1('123456'.encode())
hash2 = hashlib.sha224('123456'.encode())
hash3 = hashlib.sha256('123456'.encode())
hash4 = hashlib.sha384('123456'.encode())
```



# 12. uuid

uuid 模块是为了生成全局唯一id，UUID是128位的全局唯一标识符，通常由32字节的字符串表示。它可以保证时间和空间的唯一性，也称为GUID，全称为：

```objectivec
UUID —— Universally Unique IDentifier      Python 中叫 UUID
GUID —— Globally Unique IDentifier          C#  中叫 GUID
```



UUID1

由MAC地址、当前时间戳、随机数生成。可以保证全球范围内的唯一性，但MAC的使用同时带来安全性问题，局域网中可以使用IP来代替MAC。

```
import uuid

print(uuid.uuid1())

# 输出结果
2b7dda1f-d84e-11ea-ae59-1c1b0d6b347d
```



# 13. CSV

csv 文件是一个文本格式的表格文件，也就是说没有 excel 加密方式。用文本方式存储表格数据，以逗号来分隔列，回车分隔行



```
import csv

file = open('demo.csv', 'w', encoding='utf-8', newline='')
w = csv.writer(file)

# 写入单行数据
w.writerow(['name','age','score','city'])
w.writerow(['zhangsan','19','90','beijing'])

# 写入多行数据
w.writerows(
    [
        ['name','age','score','city'],
        ['zhangsan','19','90','beijing']
    ]
)

# 读取数据
r = csv.reader(file)
# 遍历csv数据
for data in r:
    print(data)

file.close()
```

