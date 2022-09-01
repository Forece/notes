# POCO 

https://poco-chinese.readthedocs.io/zh_CN/latest/source/README.html#working-with-poco-objects



https://blog.51cto.com/u_13661275/3223607

https://developer.aliyun.com/article/919001



## 1. 选择对象

~~~python
# 根据节点名称选取UI
poco('bg_mission')

# 根据节点名称和其他属性选取UI
poco('bg_mission', type='Button')

# 根据属性选取对象
poco(desc='返回')

# 通过正则和其他属性选取对象
poco(textMatches='^据点.*$', type='Button', enable=True)

# 通过层级关系选取对象
poco('main_node').child('list_item').offspring('item')
poco('选中').parent()
poco('文字').sibling()
~~~



常用模糊搜索

~~~
poco(textMatches=".*15.*").click()
~~~

> 需要匹配全部文字





## 2. 常用 API

### 2.1 判断元素是否存在

~~~python
poco('bg_mission').exists()
~~~



### 2.2 获取元素属性

~~~python
poco('bg_mission').attr('type')  
poco('bg_mission').get_text()  
poco('bg_mission').attr('text')
~~~



### 2.3 点击(click)

~~~python
# UI 点击
poco('bg_mission').click()
poco('bg_mission').click('center')
poco('bg_mission').click([0.5, 0.5])    # equivalent to center, 传入坐标（锚点）
poco('bg_mission').focus([0.5, 0.5]).click()  # equivalent to above expression

# 全局点击
poco.click([0.5, 0.5])  # click the center of screen
poco.long_click([0.5, 0.5], duration=3)
~~~



### 2.4 滑动(swipe)

~~~python
joystick = poco('movetouch_panel').child('point_img')
joystick.swipe('up')
joystick.swipe([0.2, -0.2])  # swipe sqrt(0.08) unit distance at 45 degree angle up-and-right
joystick.swipe([0.2, -0.2], duration=0.5)

# 全局滑动
# swipe from A to B
point_a = [0.1, 0.1]
center = [0.5, 0.5]
poco.swipe(point_a, center)

# swipe from A by given direction
direction = [0.1, 0]
poco.swipe(point_a, direction=direction)
~~~



### 2.5 拖拽(drag)

~~~python
poco(text='突破芯片').drag_to(poco(text='岩石司康饼'))
~~~



### 2.6 等待出现(wait)

~~~python
poco('bg_mission').wait(5).click()  # wait 5 seconds at most，click once the object appears
poco('bg_mission').wait(5).exists()  # wait 5 seconds at most，return Exists or Not Exists
~~~



### 2.7 截图

~~~python
from base64 import b64decode

b64img, fmt = poco.snapshot(width=720)
open('screen.{}'.format(fmt), 'wb').write(b64decode(b64img))
~~~



### 输入字符

~~~
pocoObj.setattr("text",name)
pocoObj.set_text("string")
~~~



https://www.cnblogs.com/wutaotaosin/articles/11396827.html

https://blog.csdn.net/weixin_42550871/article/details/110150740



多设备连接：https://www.cnblogs.com/ShineLeem/p/11326180.html
