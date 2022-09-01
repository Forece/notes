# 安装 VMWARE

## 1. 创建虚拟机

- 在主界面或菜单栏中选择创建新的虚拟机

![image-20210728132811825](images/winserver/image-20210728132811825.png)



- 选择自定义（高级）

![image-20210728133718200](images/winserver/image-20210728133718200.png)



- 选择稍后安装操作系统

![image-20210728133809326](images/winserver/image-20210728133809326.png)



- 选择要安装的操作系统

![image-20210728134207124](images/winserver/image-20210728134207124.png)



- 虚拟机名称设置

![image-20210728134245646](images/winserver/image-20210728134245646.png)



- 引导方式

![image-20210728134312332](images/winserver/image-20210728134312332.png)



MBR 分区，（Master Boot Record）

- 最大2T
- 最大分区数 4个
- BIOS 引导模式



GPT 分区（Guid Partition Table）

- 大于2T
- 128个分区
- UEIF 引导模式



- CPU 分配

![image-20210728134343779](images/winserver/image-20210728134343779.png)



- 内存分配

虚拟机内存分配，不能超过真实电脑的一半

![image-20210728134535366](images/winserver/image-20210728134535366.png)



## 2. VMware 网络连接方式

![image-20210728134559469](images/winserver/image-20210728134559469.png)



### 2.1 桥接

- 虚拟机IP地址与主机在同一个网段，有IP数量限制

- 主机与虚拟机通信正常。

![preview](images/winserver/v2-0e29e8f13495c269f3fdc723aa2255c2_r.jpg)



### 2.2 NAT方式

NAT：利用VMnet8，进行网络连接，虚拟机可以本机通信，无法真实网段中其他计算机通信，但是可以访问互联网。

![preview](images/winserver/v2-871f30dcb6c7880405c0d8ff3d90f06d_r.jpg)



### 2.3 主机方式

Host-Only：利用VMnet1网卡，进行网络连接，只能和本机通信，不能访问互联网（除非让主机共享网卡）

![preview](images/winserver/v2-e24b895b787c96e64d4aa6dce8baa961_r.jpg)



## 3. 其他配置

![image-20210728135059462](images/winserver/image-20210728135059462.png)



![image-20210728135110901](images/winserver/image-20210728135110901.png)



- 使用磁盘

![image-20210728135131404](images/winserver/image-20210728135131404.png)



- 为磁盘分配空间

![image-20210728135307982](images/winserver/image-20210728135307982.png)



动态存储（除非立即分配所有磁盘空间）



- 为文件命名

![image-20210728135333127](images/winserver/image-20210728135333127.png)



- 浏览配置

![image-20210728135629749](images/winserver/image-20210728135629749.png)



- 移除不需要的硬件
  - 软驱
  - 打印机



![image-20210728135720494](images/winserver/image-20210728135720494.png)



- 点击完成创建虚拟机

![image-20210728135842237](images/winserver/image-20210728135842237.png)



- 软件界面出现虚拟机名称

![image-20210728135958580](images/winserver/image-20210728135958580.png)



## 4. 虚拟机文件

| 文件                     | 说明           |
| ------------------------ | -------------- |
| Windows Server 2012.vmdk | 虚拟机文件     |
| Windows Server 2012.vmx  | 虚拟机配置文件 |

> 操作系统、系统文件内容都存储在 vmdk 虚拟机文件，虚拟机配置文件可以作为导入文件将虚拟机文件导入到 Vmware 软件中



## 5. 安装系统

- 将系统镜像加载到虚拟光驱设备中

![image-20210728140920769](images/winserver/image-20210728140920769.png)



- 选择开启进入虚拟机

![image-20210728141037031](images/winserver/image-20210728141037031.png)



- 如果有需要进入到 BIOS 时，可以在菜单栏 - 虚拟机 - 电源 - 打开电源时进入虚拟机固件

![image-20210728141136327](images/winserver/image-20210728141136327.png)



- 进入到安装界面

![image-20210728141357576](images/winserver/image-20210728141357576.png)



- Windows Server 2012 序列号

~~~
48HP8-DN98B-MYWDG-T2DCC-8W83P
~~~



- 安装 Windows Server 2012 时，选择带 GUI 的模式，否则将没有图形界面。

![image-20210728141635726](images/winserver/image-20210728141635726.png)



- 选择全新安装

![image-20210728142042961](images/winserver/image-20210728142042961.png)



- 配置分区

![image-20210728142152064](images/winserver/image-20210728142152064.png)



系统或自动保留一个分区，作为存放系统引导文件的地方，如果不想保留，需要自己分配分区：



SHIFT+F10 打开 CMD，使用 Diskpart 删除系统保留分区

```
diskpart
select disk
clean
create partition primary size=30000
create partition extended
```

> 一般不需要删除，不利于对系统的维护



- 安装完成，创建管理员密码
  - 密码需求：大小写+特殊字符

![image-20210728143016945](images/winserver/image-20210728143016945.png)



- 登录需要使用快捷键 Ctrl+Alt+Delete， 在 VMware 中使用替换的快捷键 Ctrl+Alt+Insert

![image-20210728143237857](images/winserver/image-20210728143237857.png)



- 安装完成

![image-20210728143359878](images/winserver/image-20210728143359878.png)





### 5.1 使用 PE 安装系统

- 使用 DiskGenius 进行分区（系统保留区，主分区、扩展分区）

![image-20210728155711274](file://D:\Notes\images\winserver\image-20210728155711274.png?lastModify=1627459056)



- 使用 WinNTSetup 安装 wim 镜像文件

![image-20210728155634071](file://D:\Notes\images\winserver\image-20210728155634071.png?lastModify=1627459056)



## 6. 安装虚拟机 VMware Tools

- 实现文件与物理机的互通
- 更好的硬件识别（驱动）
  - 视频 SVGA
  - 音频
  - 硬盘



![image-20210728143744775](images/winserver/image-20210728143744775.png)



之后 VMware Tools 工具会自动载入光驱，然后运行安装即可

![image-20210728143859754](images/winserver/image-20210728143859754.png)



安装完毕后，需要重启电脑，之后光驱就没用了，可以将 ISO 或设备移除



# 配置 Windows Server 2012

## 1. 更改计算机名称

让计算机在网络中有独立可识别的名字

![image-20210728150314046](images/winserver/image-20210728150314046.png)



![image-20210728150452430](images/winserver/image-20210728150452430.png)



电脑名称更改后，需要重启电脑



## 2. 增加桌面图标功能

- 在服务器管理界面，添加角色功能

![image-20210728150811890](images/winserver/image-20210728150811890.png)



- 进入向导模式

![image-20210728150844342](images/winserver/image-20210728150844342.png)



- 添加本地服务器应用

![image-20210728150939718](images/winserver/image-20210728150939718.png)



- 选择服务器

![image-20210728151000999](images/winserver/image-20210728151000999.png)



- 跳过角色

![image-20210728151039943](images/winserver/image-20210728151039943.png)



- 在功能中选择 User Interfaces and Infrastructure - Desktop Experience

![image-20210728151130113](images/winserver/image-20210728151130113.png)



之后就可以在 WIN2012 服务器中右键选择个性化，进行添加计算机、回收站等桌面图标，以及设置壁纸等个性化配置



## 3. 激活系统

Windows Loader



## 4. 其他配置

### 4.1 Metro 固定常用工具

- 点击鼠标右键，弹出所有 App

![image-20210728215804686](images/winserver/image-20210728215804686.png)



- 选择所需要的 App，如防火墙设置，选择固定在开始菜单

![image-20210728220014945](images/winserver/image-20210728220014945.png)



### 4.2 虚拟内存

正常内存的1.5-2倍，最大值与最小值相等，防止产生碎片

![image-20210728220119385](images/winserver/image-20210728220119385.png)



### 4.3 显示隐藏文件

![image-20210728220349217](images/winserver/image-20210728220349217.png)



### 4.3 配置防火墙(禁用PING)

普通防火墙设置

![image-20210728220944995](images/winserver/image-20210728220944995.png)



关闭文件与打印机共享后，会禁止PING通该服务器

![image-20210728221021772](images/winserver/image-20210728221021772.png)



高级防火墙设置：

![image-20210728220641802](images/winserver/image-20210728220641802.png)



通过设置规则，可以针对程序、端口来设置规则，这里选择自定义来阻止PING

![image-20210728221145012](images/winserver/image-20210728221145012.png)



针对所有程序

![image-20210728221327518](images/winserver/image-20210728221327518.png)



选择 ICMPv4, PING 协议

![image-20210728221358239](images/winserver/image-20210728221358239.png)



设置规则作用于本地及远程 IP 的范围（所有）

![image-20210728221435717](images/winserver/image-20210728221435717.png)



满足条件时的动作

![image-20210728221828726](images/winserver/image-20210728221828726.png)



作用于哪种环境

![image-20210728221704029](images/winserver/image-20210728221704029.png)



设置规则名称

![image-20210728221849174](images/winserver/image-20210728221849174.png)



### 4.4 配置 mmc

命令行模式进入 mmc

~~~
mmc
~~~



通过 mmc 创建自己的控制面板

![image-20210728222245597](images/winserver/image-20210728222245597.png)



可以自定义自己所需要的的常用工具

![image-20210728222345841](images/winserver/image-20210728222345841.png)



使用完需要保存配置，否则下次打开 mmc 还是空的！



# 系统快照和克隆

## 1. 快照 

初始化完成，建议在 VMware 做一个 Snapshot，保存虚拟机的初始状态，可以从失误操作还原系统状态

![image-20210728152254383](images/winserver/image-20210728152254383.png)



## 2. 克隆

在关机状态下，可以做一个系统克隆，可以方便快捷的创建其他虚拟机

![image-20210728152340233](images/winserver/image-20210728152340233.png)



- 克隆需要创建模板快照

![image-20210728152844499](images/winserver/image-20210728152844499.png)



或者从快照中直接创建克隆虚拟机

![image-20210728153304367](images/winserver/image-20210728153304367.png)



- 通过快照链接来创建新的克隆机
  - 链接克隆以快照为副本，不占用空间
  - 完整克隆为整体克隆，复制所有文件，可独立使用。

![image-20210728152924517](images/winserver/image-20210728152924517.png)



- 创建名称

![image-20210728154041019](images/winserver/image-20210728154041019.png)



克隆后的主机基于模板的存在，模板主机一旦出现故障，那么克隆机也无法继续使用，所以一般建议主系统克隆完就不要再做修改，操作直接在克隆虚拟机上运行。



# 封装系统

基于这样的系统克隆，会出现一个问题，也就是系统完全一致，包括计算机名、系统ID号等等，没有办法真实模拟一台实际的计算机，我们需要对 Windows 操作系统进行封装。



用虚拟机快照或克隆的系统，对于系统、用户id号是同名的

~~~shell
#whoami /user
desktop-lsn0sge\forece S-1-5-21-1860588448-4003755667-1478459589-1001
~~~

- desktop-lsn0sge: 计算机名
- \forece：用户
- S-1-5-21-1860588448-4003755667-1478459589-1001：SID
  - S-1-5-21： Windows ID 号
  - 1860588448-4003755667-1478459589： 系统 ID
  - 1001 - 用户 ID 号
    - 500 为管理员账号



需要将它们设置为不同的电脑标识。使用 sysprep 封装工具，**选择通用代表着，重新分配新的 ID 号**

~~~
C:\windows\system\Sysprep\sysprep.exe
~~~



![image-20210721215057639](images/winserver/image-20210721215057639.png)

> 关机选项可以设置为关机



关机之后，使用快照或者克隆就是可以重新进行初始化的系统









# 安装 Hyper-V 服务器

管理 - 添加角色与功能 - 基于角色或基于功能 - 选择服务器 - Hyper-V 



虚拟机配置文件需要添加

~~~
hypervisor.cpuid.v0 = "FALSE"
mce.enable = "TRUE"
vhv.enable = "TRUE"
~~~



![image-20210728224514540](images/winserver/image-20210728224514540.png)



选择一块网卡作为虚拟交换网卡

![image-20210728230025238](images/winserver/image-20210728230025238.png)



多台 HyperVision 需要迁移时，需要勾选

![image-20210728230045857](images/winserver/image-20210728230045857.png)



虚拟硬盘存储位置![image-20210728230102798](images/winserver/image-20210728230102798.png)



进行安装

![image-20210728230153466](images/winserver/image-20210728230153466.png)



安装完需要重启服务器

![image-20210728230314756](images/winserver/image-20210728230314756.png)



命令行重启

~~~
shutdown -r -t 0
~~~



进入Hyper-V 管理器

![image-20210728230504424](images/winserver/image-20210728230504424.png)



- 新建虚拟机

![image-20210728230545320](images/winserver/image-20210728230545320.png)



虚拟机名称和路径

![image-20210728230644479](images/winserver/image-20210728230644479.png)



选择系统迭代

- 第一代（WIN7及以前版本Windows）
- 第二代（WIN8 或 WIN2012 以后操作系统）

![image-20210728230844884](images/winserver/image-20210728230844884.png)



虚拟机分配内存

![image-20210728230717590](images/winserver/image-20210728230717590.png)



虚拟机网卡选择

![image-20210728230738751](images/winserver/image-20210728230738751.png)



分配硬盘

![image-20210728231006047](images/winserver/image-20210728231006047.png)



选择安装方式

![image-20210728231039595](images/winserver/image-20210728231039595.png)



结束配置向导

![image-20210728231109024](images/winserver/image-20210728231109024.png)



配置完成

![image-20210728231143454](images/winserver/image-20210728231143454.png)



打开配置，光驱挂载镜像

![image-20210728231352240](images/winserver/image-20210728231352240.png)



开启虚拟机进行系统安装

![image-20210728231417539](images/winserver/image-20210728231417539.png)



Hyper-V 设置

![image-20210728231539978](images/winserver/image-20210728231539978.png)



除了一些虚拟机的设置，还有实时迁移的设置

![image-20210728231629320](images/winserver/image-20210728231629320.png)



虚拟硬盘文件

![image-20210728231758563](images/winserver/image-20210728231758563.png)



硬盘格式可以进行选择

![image-20210728231901201](images/winserver/image-20210728231901201.png)



- VHD 支持 2040 GB
- VHDX 支持 64TB

![image-20210728231917664](images/winserver/image-20210728231917664.png)



硬盘种类

- 固定（指定大小）
- 动态扩展（根据大小自动调整文件大小）
- 差异（需要选定父硬盘，差异硬盘只存储不同内容，类似于VMware的克隆快照）

![image-20210728231958103](images/winserver/image-20210728231958103.png)



导出虚拟机

选择虚拟机，然后选择导出

![image-20210728232304059](images/winserver/image-20210728232304059.png)



选择导出路径

![image-20210728232326316](images/winserver/image-20210728232326316.png)



导入虚拟机

![image-20210728232405552](images/winserver/image-20210728232405552.png)



选择导入路径

![image-20210728232429327](images/winserver/image-20210728232429327.png)



选择虚拟机

![image-20210728232443928](images/winserver/image-20210728232443928.png)



导入模式

- 就地注册（创建新的虚拟机，使用原有ID）
- 还原虚拟机（还原当前虚拟机，使用原有ID）
- 复制虚拟机（相当于创建不同计算机ID）

![image-20210728232501183](images/winserver/image-20210728232501183.png)



更改存储路径

![image-20210728232724442](images/winserver/image-20210728232724442.png)



硬盘存放位置

![image-20210728232749601](images/winserver/image-20210728232749601.png)



# 管理本地用户账户和组

## 1. 创建本地用户

服务器管理面板 - 计算机管理

![image-20210728165300692](images/winserver/image-20210728165300692.png)



本地用户和组 - 用户 - 右键新用户

![image-20210728165356082](images/winserver/image-20210728165356082.png)



填充用户信息

- 用户下次登录必须更改密码（建议）
- 用户不可以自己更改密码
- 用户永不过期（不勾选42天）
- 用户禁用

![image-20210728165433526](images/winserver/image-20210728165433526.png)



关于密码强度与密码过期设置，可以在本地策略中修改

![image-20210728171412763](images/winserver/image-20210728171412763.png)



账户策略 - 密码策略

- 记住密码系列（不可以使用之前使用过的密码）
- 最大密码期限（账户过期时间）
- 最小密码期限（0为可立即更改密码，否则必须等待n天才可以更改密码）
- 密码长度
- 密码复杂性
- 用可还原的加密来存储密码



![image-20210728171512811](images/winserver/image-20210728171512811.png)





命令行模式

```
# 创建用户
net user 用户名 密码 /add
net user 用户名 * /add           # 出现密码输入提示，无显示

# 激活用户
net user 用户名 /active:yes
net user 用户名 /ative:no

# 删除用户
net user username /delete

# 查看指定用户信息
net user username
```



隶属于 - 添加组（如 Administrators）

![image-20210728165819810](images/winserver/image-20210728165819810.png)



拨入（如果VPN用户，需要允许拨入）

![image-20210728165833257](images/winserver/image-20210728165833257.png)



## 2. 创建组

组是一个用户账户的集合，可以利用组队用户账号进行组织，从而一次授予他们共享资源的权利和权限，不必针对每一个用户组中的用户账号进行权限分配，当你把一个用户账号加入到一个组中的时候，也就是将这个组的权限赋予该组的所有用户。



计算机系统里边已经设置了很多组

- 系统内置本地组
  - 成员有执行系统任务的权利
- 特殊组（如 CREATOR OWNER, SYSTEM）
  - 针对特殊用途自动组织用户
  - 自动成为成员，管理员不能修改



我们所创建的用户组为自定义组，可以针对组内所有用户统一设置权限，添加组的方式为：

计算机管理工具 - 添加组

![image-20210728165922506](images/winserver/image-20210728165922506.png)





给组添加成员

- 双击用户组，然后点击 Add 添加成员

![image-20210728170045564](images/winserver/image-20210728170045564.png)



命令行模式

```
# 创建组
net localgroup 组名 /add

# 删除组
net localgroup 组名 /delete

# 添加组成员
net localgroup 组名 用户名 /add	
```



## 3. 本地用户账户信息

一般存储在 Windows 系统的 SAM 文件中，该文件是本地文件

~~~
C:\Windows\System32\config\SAM
~~~



## 4. 删除账户

- 用户没有进行初始化

也就是说不存在用户创建本地用户文件夹的情况下，直接在计算机管理中删除该账户即可

![image-20210728170713766](images/winserver/image-20210728170713766.png)



- 如果用户已经进行了初始化，在 C:\Users 目录中有了自己的资料，那么需要在系统 - 高级系统设置 - 高级 - 用户档案 - 设置 - 删除用户

![image-20210728170918812](images/winserver/image-20210728170918812.png)



## 小技巧：创建影子用户

注册表复制管理员权限，用户注册信息存储在 SAM 注册表中，可以通过注册表编辑器打开（需要给予管理员权限）

![image-20210728181241691](images/winserver/image-20210728181241691.png)



其中管理员 Administrator 对应 0x1f4，十进制 500（管理员）

![image-20210728181451659](images/winserver/image-20210728181451659.png)



对应文件夹 000001F4 则为具体配置，其中 F 键为具体权限内容

![image-20210728181618808](images/winserver/image-20210728181618808.png)



此时创建新用户

~~~
net user Bob "" /add
~~~



然后将 F 键值替换为管理员权限，Bob 则变为管理员权限（与 Administrator 共享），在管理员账户创建的桌面文件，在 Bob 账户中同步显示。相当于同一个账户。



## 小技巧：隐藏账户

命令行创建隐藏账户

~~~
net user Tom$
~~~

> 在命令行中无法查看



但是可以在管理工具中可以查看到

![image-20210728182543202](images/winserver/image-20210728182543202.png)



提升账户权限为影子账户，然后将影子账户的注册表文件导出

![image-20210728182409113](images/winserver/image-20210728182409113.png)



之后使用命令将隐藏账户删除

~~~
net user Tom$ /del
~~~



此时命令行、计算机管理、注册表都清除了用户信息，然后将注册表文件导入，就形成了隐藏账户，通过远程控制 3389 可以登录管理员账户（主机需要开启允许远程登录）

![image-20210728183213944](images/winserver/image-20210728183213944.png)



远程机器使用命令开启远程桌面连接

~~~
mstsc
~~~



![image-20210728183045016](images/winserver/image-20210728183045016.png)







# Active Directory 域服务环境

Active Directory

Active Directory是指Windows 2000网络中的目录服务。它有两个作用：

- 目录服务功能

Active Directory提供了一系列集中组织 管理和访问网络资源的目录服务功能。Active Directory使网络拓扑和协议对用户变得透明，从而使网络上的用户可以访问任何资源（例如打印机），而无需知道该资源的位置以及它是如何连接到网络的。

Active Directory被划分成区域进行管理，这使其可以存储大量的对象。基于这种结构，Active Directory可以随着企业的成长而进行扩展。从仅拥有一台存储几百个对象的服务器的小型企业，扩展为拥有上千台存储数百万个对象的服务器的大型企业。

- 集中式管理

Active Directory还可以集中管理对网络资源的访问，并允许用户只登陆一次就能访问在Active Directory上的所有资源。



Active Directory
存储关于网络上对象的信息并使这些信息可以用于用户和网络管理员的目录服务。Active Directory 允许网络用户通过单个登录过程访问网络上任意位置允许访问的资源。它给网络管理员提供了直观的网络层次结构视图和对所有网络对象的单点管理。

Active Directory 用户和计算机
设计为执行日常 Active Directory 管理任务的管理工具。这些任务包括创建、删除、修改、移动和设置存储在目录中的对象的权限。这些对象包括组织单位、用户、联系人、组、计算机、打印机和共享的文件对象。

Active Directory 数据模型
从 LDAP 数据模型演化而来的模型。该目录用来保存对象，这些对象代表了由属性描述的各种端口的实体。在架构中定义了可以存储在目录中的对象和对象的类。对于对象的每个类，架构都定义了该类的实例所必须拥有的属性，并且该类可以是其的父类（该类可能有的附加属性）。



简单来说：

AD 类似一个数据库，存储公司内部网络资源的一个 Windows Server 服务，它可以集中管理所有域内的用户（创建、关闭用户，权限设置，对用户的登录验证），计算机（利用 WSUS 批量给所有计算机打补丁，组策略设置），共享资源（打印机、文件共享）。利用多台 AD 还可以构



- 工作组，每台电脑拥有自己的用户，SAM 文件（用户账户信息）存储在本地电脑上。
- 域，由域服务器控制每台电脑的账户、权限信息，便于集中管理
  - 只有域服务器才可以创建域用户
  - 当服务器安装AD服务后，无法创建本地用户与组



![image-20210728183321545](images/winserver/image-20210728183321545.png)



Active Directory 活动目录

- 将用户信息存储称为具有描述属性的对象（如用户账户、打印机），存储到数据库中。
- 集中网络资源的管理
- 所有用户一次登录访问整个活动目录
- 搭建域的时候，需要安装 AD 服务



拓扑图

![image-20210728185303937](images/winserver/image-20210728185303937.png)



~~~
父域	- ss.com
子域	- bj.ss.com
子子域	- chaoyang.bj.ss.com
~~~



域内计算机通过域名进行登录到 AD 服务器，所以需要在 AD 服务器上同时安装 DNS 服务



## 1. 安装域

- 检查主机名称（以后尽量避免更改）

~~~
C:\Users\Administrator>hostname
WIN2012S1
~~~



- 检查IP（需要一个固定IP）和DNS服务器地址（防止内部域与互联网域冲突）

![image-20210728200011712](images/winserver/image-20210728200011712.png)



添加角色功能 - AD 域服务 + DNS 服务

![image-20210728195922296](images/winserver/image-20210728195922296.png)



一路一下一步，直到安装

![image-20210728200108527](images/winserver/image-20210728200108527.png)





## 2. 提升服务器为域控制器

2003、2008 版本可以使用命令行安装域

~~~
dcpromote
~~~



安装完成后，可以看到有个黄色叹号，需要将服务器提升为域服务器

![image-20210728200430850](images/winserver/image-20210728200430850.png)



此前没有建立任何域，此时需要创建新林

![image-20210728200555145](images/winserver/image-20210728200555145.png)



设置域功能权限

- 林功能级别（用来改变兼容性和功能性），一般最高级，除非同域有其他低版本的服务器
- 域功能级别
- 恢复密码（DC出现故障时，可进入还原模式，需要使用还原密码）

![image-20210728200630830](images/winserver/image-20210728200630830.png)



DNS 委派，目前先过

![image-20210728201145769](images/winserver/image-20210728201145769.png)



NetBIOS 名字，分配域的名称

![image-20210728201242317](images/winserver/image-20210728201242317.png)



数据库、日志、SYSVOL（组策略文件）信息存放路径

![image-20210728201432127](images/winserver/image-20210728201432127.png)



检查信息

![image-20210728201554587](images/winserver/image-20210728201554587.png)



环境检查通过后选择安装

![image-20210728201638064](images/winserver/image-20210728201638064.png)



安装完毕后，需要重启电脑

![image-20210728201824791](images/winserver/image-20210728201824791.png)



重新登录，工作组管理员用户转换为域管理员

![image-20210728202158722](images/winserver/image-20210728202158722.png)



并可以在服务器管理面板中查看 AD 工具

![image-20210728202324853](images/winserver/image-20210728202324853.png)



计算机属性中，也可以看到该计算机加入到了域中

![image-20210728202700545](images/winserver/image-20210728202700545.png)





## 3. 客户端寻找 DC 过程

通过 Kerberos 找到哪台主机可以解析身份验证协议

![image-20210728203219901](images/winserver/image-20210728203219901.png)



然后找到域的主机 IP

![image-20210728203328463](images/winserver/image-20210728203328463.png)



客户端通过IP地址找到DC，将验证信息交给 DC



DNS 记录是默认存放在 AD 目录中的，所以随着新 DC 或客户端的加入，DNS 也会出现同步变化

![image-20210728203701454](images/winserver/image-20210728203701454.png)



## 4. 安装辅助域控

防止主域控宕机，可以实现域服务迁移。

```
# 检查主机名称（以后尽量避免更改）
hostname

# 检查IP（需要一个固定IP）
ipconfig

# 设置网卡 DNS 指向主域控（为了能够解析域名）
192.168.xxx.xxx

# 检查是否能解析域
nslookup
ss.com
exit

# 检查是否可以ping通
ping long.com
```



在新的DC主机中安装 AD 和 DNS 服务

![image-20210728204739672](images/winserver/image-20210728204739672.png)



将此服务器提升为域控制器

- 将域控制器添加到现有域（选择域）

![image-20210728210059118](images/winserver/image-20210728210059118.png)



- 输入域用户名和密码，输入主域控的管理员用户和密码，(SS\administrator)

![image-20210728210122037](images/winserver/image-20210728210122037.png)



选择域

![image-20210728210244396](images/winserver/image-20210728210244396.png)



- 全局编录 GC
  - 情况一：只有一个域，也就是“单域环境”，那么我建议您把所有的DC都设置成GC。因为在单域环境下“结构主机”是不发挥作用的（没有被使用），单域环境中我设定了两台GC 所以他们之间会彼此复制相互的资料
  - 情况二：有多个域，也就是“多域环境”，你的GC的角色的服务器，他绝对不能担任“结构主机”的操作主机角色。因为在多域环境下，如果你的一台域控制器即担任 “GC” 又担任 “结构主机”（Infrastructure Master）的话，会造成 “结构主机”失效。
- 只读域控制器
  - 只能读取，不可写入
- 输入还原模式密码

![image-20210728210358345](images/winserver/image-20210728210358345.png)



接下来与之前创建主域控一样

![image-20210728210447899](images/winserver/image-20210728210447899.png)



选择数据源为主DC

- 可以选择任何域控，也可以指定域控DC

![image-20210728210620709](images/winserver/image-20210728210620709.png)



数据存储位置

![image-20210728210637276](images/winserver/image-20210728210637276.png)



Review

![image-20210728210649276](images/winserver/image-20210728210649276.png)



Precheck 然后安装

![image-20210728210701756](images/winserver/image-20210728210701756.png)



之后可以看到两台域控数据已经同步更新了

![image-20210728211201648](images/winserver/image-20210728211201648.png)



在 AD 中也可以看到两台计算机

![image-20210729114233492](images/winserver/image-20210729114233492.png)



此时需要将两台 DC DNS 记录做互相指向

- 主 DNS 指向自己
- 副 DNS 指向另一台 DC

![image-20210728211321016](images/winserver/image-20210728211321016.png)



## 3. 创建子域 new.ss.com



```
# 检查主机名称（以后尽量避免更改）
hostname

# 检查IP（需要一个固定IP）
ipconfig

# 设置网卡 DNS 指向主域控或副域控（为了能够解析域名）
192.168.xxx.xxx

# 检查是否能解析域
nslookup
long.com
exit

# 检查是否可以ping通
ping long.com
```



添加角色和功能 - 添加 AD 和 DNS

- 因为是子域，所以也需要对域名解析，DNS 是必备的

![image-20210729115810724](images/winserver/image-20210729115810724.png)



提升为域控

- 将新域添加到现有林

![image-20210729120037841](images/winserver/image-20210729120037841.png)



-  选择父域，并输入父域的用户凭证

![image-20210729120212064](images/winserver/image-20210729120212064.png)



选择域

![image-20210729120249433](images/winserver/image-20210729120249433.png)



- 输入子域名（只写子域名，不需要写完整形式）

![image-20210729120347953](images/winserver/image-20210729120347953.png)



- 输入还原模式密码

![image-20210729120707497](images/winserver/image-20210729120707497.png)



DNS 委派

![image-20210729120748688](images/winserver/image-20210729120748688.png)



NetBIOS 域名

![image-20210729120817904](images/winserver/image-20210729120817904.png)



检查数据库路径

![image-20210729120844496](images/winserver/image-20210729120844496.png)



先决条件检查并安装

![image-20210729120921723](images/winserver/image-20210729120921723.png)



重启后，在主 DC 中，可以看到

- DNS 管理器 ss.com\china （子域的解析）
- AD 用户域计算机中没有显示子域计算机



在子域  DC 中，可以看到

- DNS 管理器只有 china.ss.com
- AD 域控中也只显示子域计算机
- 域和信任关系中，可以看到 ss.com 与 china.ss.com 互相信任



## 4. 创建独立域 smile.com

```
# 检查主机名称（以后尽量避免更改）
hostname

# 检查IP（需要一个固定IP）
ipconfig

# 防止内部域与互联网域冲突（将本地网卡DNS服务器更改为 127.0.0.1
```



添加角色功能 - AD 域服务 + DNS 服务

![image-20210729115810724](images/winserver/image-20210729115810724.png)



由于是独立域名，和之前做的域控制器步骤是一样的



将此服务器提升为域控制器

- 添加新林
- 输入根域名(smile.com)
- 输入还原模式密码



## 8. 创建双向信任

对两个独立域进行双向信任之前，需要确保双方都能找到对方的域



允许 smile.com DNS 做区域传送

- DNS 管理器
- 正向查找区域 - smile.com - 属性
- 区域传送（允许区域传送）



![image-20210729132236529](images/winserver/image-20210729132236529.png)



在 long.com 创建辅助区域

- DNS 管理器
- 正向查找区域 - 新建区域 

![image-20210729132436548](images/winserver/image-20210729132436548.png)



- 选择辅助区域

![image-20210729132453450](images/winserver/image-20210729132453450.png)



输入辅助区域名称 smile.com

![image-20210729132646593](images/winserver/image-20210729132646593.png)



设置独立域 smile.com 的DNS地址

![image-20210729132825816](images/winserver/image-20210729132825816.png)



smile 的正向解析已经完成

![image-20210729132921064](images/winserver/image-20210729132921064.png)



将 smile.com 服务器网卡的 DNS 设置为 ss.com 服务器 IP

![image-20210729133233174](images/winserver/image-20210729133233174.png)





此时两台服务器已经能互相解析

![image-20210729133217110](images/winserver/image-20210729133217110.png)



打开 ss.com 域控的 AD 域信任关系

![image-20210729131906289](images/winserver/image-20210729131906289.png)



右键选择属性

![image-20210729133419371](images/winserver/image-20210729133419371.png)



新建信任

![image-20210729133504509](images/winserver/image-20210729133504509.png)



输入需要创建的信任域

![image-20210729133539108](images/winserver/image-20210729133539108.png)



林信任

![image-20210729133628981](images/winserver/image-20210729133628981.png)



双向信任

![image-20210729133650613](images/winserver/image-20210729133650613.png)



确认指定域

![image-20210729133741901](images/winserver/image-20210729133741901.png)



全林性身份验证

![image-20210729133851125](images/winserver/image-20210729133851125.png)



信任密码

![image-20210729133914268](images/winserver/image-20210729133914268.png)



确认传出信任

![image-20210729133956477](images/winserver/image-20210729133956477.png)



确认传入信任

![image-20210729134043383](images/winserver/image-20210729134043383.png)



完成双向信任

![image-20210729134112709](images/winserver/image-20210729134112709.png)



![image-20210729134134172](images/winserver/image-20210729134134172.png)



在 smile.com 主机上也需要作出双向信任

![image-20210729140308480](images/winserver/image-20210729140308480.png)





# 系统修复

## 1. 系统备份

添加角色和功能 - Feature - Windows Server Backup

![image-20210729130745029](images/winserver/image-20210729130745029.png)



管理工具 - Windows Server Backup

![image-20210729130927189](images/winserver/image-20210729130927189.png)



可以设置备份计划、一次性备份，还有恢复备份

![image-20210729131042974](images/winserver/image-20210729131042974.png)



一次性备份指的是立即备份

![image-20210729131158766](images/winserver/image-20210729131158766.png)



- 完整备份（建议定期做完整备份）

![image-20210729131244269](images/winserver/image-20210729131244269.png)



自定义备份只备份系统状态可选择指定备份

![image-20210729131359396](images/winserver/image-20210729131359396.png)



备份位置可选择本地驱动器或网络位置

![image-20210729131445941](images/winserver/image-20210729131445941.png)



然后选择备份即可

![image-20210729131542215](images/winserver/image-20210729131542215.png)



## 2. 系统还原

当域控出现问题或需要还原时，重启域控，按 F8 进入还原模式，输入还原密码，通过 Windows Server Backup 还原文件即可



## 3. FFMO

当服务器挂了的时候，需要到辅助主机上更改设置



AD 用户和计算机 - ss.com - 操作主机

![image-20210729140455581](images/winserver/image-20210729140455581.png)



可以看到现在的域控主机是 WIN2012S1.ss.com ，当 S1 出现故障时，需要到 S2 辅助主机上修改这三个域控主机

- RID
- PDC
- 基础结构

![image-20210729140709871](images/winserver/image-20210729140709871.png)



AD 信任关系 - 操作主机

![image-20210729140841926](images/winserver/image-20210729140841926.png)



更改域名操作主机

![image-20210729140916040](images/winserver/image-20210729140916040.png)



目前两个域控制器都是 S1，需要更改域控制器

![image-20210729141140503](images/winserver/image-20210729141140503.png)



选择 S2

![image-20210729141152174](images/winserver/image-20210729141152174.png)



这时候就可以看到可以迁移到 S2 了

![image-20210729141229246](images/winserver/image-20210729141229246.png)



MMC 添加 AD 架构

 在 MMC 中注册 AD 架构，然后添加 AD 架构

```
regsvr32 schmmgmt.dll
```

 ![image-20210729141403740](images/winserver/image-20210729141403740.png)



进入 mmc 添加 AD架构

![image-20210729141534504](images/winserver/image-20210729141534504.png)



查看架构主机

![image-20210729141622736](images/winserver/image-20210729141622736.png)



目前架构主机还都是 S1

![image-20210729141736094](images/winserver/image-20210729141736094.png)



同样需要更改域控

![image-20210729141810184](images/winserver/image-20210729141810184.png)



更改架构主机到 S2

![image-20210729141822438](images/winserver/image-20210729141822438.png)



更改操作主机

![image-20210729141837309](images/winserver/image-20210729141837309.png)



## 4. 添加GC

当辅助主机创建时没有构建 GC 全局编录，在主域控挂掉的时候，需要将辅助域控的全局编录打开



AD 站点和服务 - Default-First-Site-Name - Servers - NTDS 设置 - 全局编录

![image-20210729142203910](images/winserver/image-20210729142203910.png)





# 管理域用户账户和组

## 1. 添加域用户

管理工具 - AD 用户和计算机 -  User - 新建用户

![image-20210728212107194](images/winserver/image-20210728212107194.png)



在指定域中的 Users 中创建新用户

![image-20210728212157735](images/winserver/image-20210728212157735.png)



填写用户信息

![image-20210728212357853](images/winserver/image-20210728212357853.png)



密码设定

![image-20210728212421933](images/winserver/image-20210728212421933.png)



在用户配置中还有一些其他配置

![image-20210728212624052](images/winserver/image-20210728212624052.png)



比如指定共享文件夹映射磁盘

- 注意共享文件夹需要是网络路径，如：\\server\share\folder

![image-20210729150029337](images/winserver/image-20210729150029337.png)



将域用户添加到域组中

![image-20210729150133709](images/winserver/image-20210729150133709.png)



VPN 拨入功能

![image-20210729150208627](images/winserver/image-20210729150208627.png)



当服务器变成了域控制器后，就无法添加本地用户了，即使使用

~~~
net user admin password /add
~~~

> 添加的也是域用户



一般使用 /domain 参数：

```
net user username password /add /domain
```



另外域中添加用户账户的命令行使用 dsadd user 命令

![image-20210721223316152](images/winserver/image-20210721223316152.png)



## 2. 添加域组

管理工具 - AD 用户和计算机 -  User - 新建组

![image-20210729150443859](images/winserver/image-20210729150443859.png)



组有两个类别：

- 安全组（可以设置权限）
- 通讯组（没有权限，只是一个列表）



组的作用域：

- 本地域（只能在本域中使用）
- 全局（可以在整个林中使用）
- 通用

![image-20210729150514659](images/winserver/image-20210729150514659.png)



在组的属性中可以添加组成员

- 组-属性- 组成员

![image-20210729150731486](images/winserver/image-20210729150731486.png)



隶属于

- 可以指定该组隶属于哪个组
- 组是可以嵌套，继承权限的

![image-20210729150846518](images/winserver/image-20210729150846518.png)



命令行工具

```
# 创建组
net group groupname /add /domain

# 添加组成员
net group groupname username /add /domain
```





net 命令虽然可以创建用户和组，但是并不能指定 OU，需要使用 dsadd 这个高级命令

```
创建ou
dsadd ou ou=ou1,dc=long,dc=com -desc "Sales"

# 创建ou用户
dsadd user cn=user3,ou=ou1,dc=long,dc=com -pwd * -upn user3

# 创建ou组
dsadd group cn=group3,ou=ou1,dc=long,dc=com

# 添加组成员
dsmod group cn=group3,ou=ou1,dc=long,dc=com -addmbr cn=user3,ou=ou1,dc=long,dc=com

# 修改密码
dcmod user cn=user3,ou=ou1,dc=long,dc=com -pwd *

# 禁用用户
dcmod user cn=user3,ou=ou1,dc=long,dc=com -disabled yes

# 激活账户
dcmod user cn=user3,ou=ou1,dc=long,dc=com -disabled no

# 删除用户
dsrm cn=user3,ou=ou1,dc=long,dc=com

# 删除组
dsrm cn=group3,ou=ou1,dc=long,dc=com

# 删除ou
dsrm ou=ou1,dc=long,dc=com
```



## 3. 更改域的组策略

之前的组策略是更改本地的，针对于域用户，需要更改域的组策略



管理工具 - 组策略管理

![image-20210729125650466](images/winserver/image-20210729125650466.png)



组策略对象 - 默认域策略 - 编辑

![image-20210729125844294](images/winserver/image-20210729125844294.png)



- 计算机配置 - 策略 - Windows 设置 - 安全设置 - 账户策略

![image-20210729125954452](images/winserver/image-20210729125954452.png)



选择密码策略

![image-20210729130044008](images/winserver/image-20210729130044008.png)



CMD 命令行更新组策略，使其生效

```
# 强制更新
gpupdate /force
```



# 创建 OU (组织单位)

目前不建议直接创建用户或组，而是将组或用户放在组织单位中，可以更有效的管理这些组或用户。



域中OU指的是组织单位(Organizational Unit)，组织单元是可以将用户、组、计算机和其它组织单位放入其中的AD容器，是可以指派组策略设置或委派管理权限的最小作用域或单元。性质是最小作用域或单元。



OU的设计方式
为了有效的组织活动目录对象，OU根据公司业务模式的不同来创建不同的OU层次结构。一下是几种常见的设计方法。

1. 基于部门的OU

为了和公司的组织结构相同，OU可以基于公司内部的各种各样的业务功能部门创建，如行政部、人事部、工程部、财务部等。

2. 基于地理位置的OU

可以为每一个地理位置创建OU，如北京、上海、广州等。

3. 基于对象类型的OU

在活动目录中可以将各种对象分类，为每一类对象建立OU，如根据用户、计算机、打印机、共享文件夹等。



## 1. 创建 OU

AD 用户和计算机 - 域 - 新建 - OU

![image-20210729124654551](images/winserver/image-20210729124654551.png)



OU 名称

![image-20210729124902311](images/winserver/image-20210729124902311.png)



## 2. 创建 OU 用户或组

可以在 OU 中创建新的用户或组

![image-20210729124946712](images/winserver/image-20210729124946712.png)



新建用户 test

![image-20210729125232063](images/winserver/image-20210729125232063.png)



设置密码

![image-20210729125305814](images/winserver/image-20210729125305814.png)





## 3. 删除被保护的 ou

创建 OU 时，有个选项是保护 OU 不被删除的

![image-20210729151732588](images/winserver/image-20210729151732588.png)



如果想删除的话，需要查看 - 高级功能

![image-20210729151849450](images/winserver/image-20210729151849450.png)



找到对应 OU，然后选择属性

![image-20210729152054754](images/winserver/image-20210729152054754.png)



找到 OU 选项卡中的对象 - 防止对象被意外删除，把勾划掉就可以删除了。

![image-20210729152121863](images/winserver/image-20210729152121863.png)



## 4. 委派控制

委派控制，可以整体修改 OU 组的权限，如给 Sales 组委派管理员权限

![image-20210729130319454](images/winserver/image-20210729130319454.png)



选择需要委派用户或组

![image-20210729130416104](images/winserver/image-20210729130416104.png)



给与权限

![image-20210729130538077](images/winserver/image-20210729130538077.png)



完成

![image-20210729130556981](images/winserver/image-20210729130556981.png)











# 客户端加入域

## 1. 客户端加入域

- 设置本机 IP（在域中被分配的网段）
- 子网掩码
- DNS 服务器地址（DC1 或 DC2 的 IP）



![image-20210721222337589](images/winserver/image-20210721222337589.png)



更改域

![image-20210721222423763](images/winserver/image-20210721222423763.png)



输入域中被分配的用户名和密码

![image-20210728212905367](images/winserver/image-20210728212905367.png)



登录方式：

- 使用 SS\Tom 方式登录（老版本）
- 使用 Tom@ss.com 方式登录







# 六、共享资源设置

## 1. 共享文件夹

创建文件夹，作为共享文件夹，右键选择文件夹，点击属性

![image-20210729153720718](images/winserver/image-20210729153720718.png)



共享 - 高级共享

![image-20210729153745377](images/winserver/image-20210729153745377.png)



共享设置

- 允许共享用户数量

![image-20210729153816449](images/winserver/image-20210729153816449.png)



权限设置

![image-20210729154104857](images/winserver/image-20210729154104857.png)



确定后，可以查看共享位置

![image-20210729153936097](images/winserver/image-20210729153936097.png)



## 2. 查看共享

- CMD 命令 `net share`

![image-20210729154228851](images/winserver/image-20210729154228851.png)



- 计算机管理 - 共享文件夹
  - 共享（查看当前系统有哪些文件夹被共享了）
  - 会话（查看有哪些用户正在使用共享）
  - 打开的文件（查看哪些文件正在被使用）

![image-20210729154302057](images/winserver/image-20210729154302057.png)



## 3. 访问共享

- 通过 IP 地址访问共享文件

![image-20210729163345323](images/winserver/image-20210729163345323.png)



打开后就能看到共享文件夹

![image-20210729163402698](images/winserver/image-20210729163402698.png)



客户端通过网上邻居 Network 查看共享文件，需要开启网络搜索服务

![image-20210729162641376](images/winserver/image-20210729162641376.png)







## 4. 权限控制

- 文件夹权限（设置本地用户权限）
- 共享权限（设置共享用户的权限）



### 4.1 文件夹权限

在主共享文件夹的机器上，点击文件夹属性

![image-20210729163807090](images/winserver/image-20210729163807090.png)



设置用户权限

![image-20210729163856337](images/winserver/image-20210729163856337.png)



比如说禁止写入

![image-20210729164137488](images/winserver/image-20210729164137488.png)



远程用户则无法写入文件，但是同样，本地用户也无法写入文件

![image-20210729164201705](images/winserver/image-20210729164201705.png)



### 4.2 共享权限

在共享文件夹的共享设置中，可以针对用户设置权限，比如对所有用户设置只读权限

![image-20210729164532444](images/winserver/image-20210729164532444.png)



### 4.3 权限继承

在文件夹中，子文件夹的权限继承父文件夹的权限，如：

~~~
Test
|---test1
|---test2
~~~

> test1, test2 文件夹权限继承 Test 文件夹权限



由于是继承自父级权限，这些子文件夹的权限无法进行单独设置

![image-20210729170150447](images/winserver/image-20210729170150447.png)



#### 4.3.1 禁止继承

如果不想让子文件夹继承权限，需要到子文件夹的属性 - 安全 - 高级

![image-20210729165839949](images/winserver/image-20210729165839949.png)



选择禁用继承

![image-20210729165905443](images/winserver/image-20210729165905443.png)



- 保留权限配置，但是不再继承
- 删除所有权限

![image-20210729170339807](images/winserver/image-20210729170339807.png)



#### 4.3.2 权限继承

如果一个文件夹里的权限结构被搞乱了，管理员想重新配置该文件夹里边的文件和子文件夹的权限，可以通过父文件夹为模板，将里边所有内容进行权限继承。



在父文件夹中选择属性 - 安全 - 高级 - 替换权限

![image-20210729170818754](images/winserver/image-20210729170818754.png)



此时，该文件夹下所有内容恢复继承



#### 4.3.3 文件操作的权限继承

两个文件夹权限不同，当从一个文件夹中复制文件到另一个文件夹时，该文件自动继承目标所在文件夹的权限，与原来的文件夹权限断开继承。

> 本质上是在该目录新建了一个文件，并填充相同内容。剪贴是同样的操作



## 5. 卷影副本

当文件被写入但是没有保存时，可以通过卷影副本来找回



打开所在盘属性

![image-20210729164854504](images/winserver/image-20210729164854504.png)



找到所在盘，并且开启卷影副本

![image-20210729164925354](images/winserver/image-20210729164925354.png)



系统会自动创建一个卷影副本

![image-20210729165039287](images/winserver/image-20210729165039287.png)



也可以使用 Create Now 功能手动创建卷影副本

![image-20210729165133512](images/winserver/image-20210729165133512.png)



当文件被误操作或覆盖了，可以使用还原副本功能还原状态



- 防火墙设置（允许程序或功能通过防火墙 - File and Printer Share）



# 压缩和加密

文件夹属性 - 高级

![image-20210729171536352](images/winserver/image-20210729171536352.png)



压缩和加密

![image-20210729171612762](images/winserver/image-20210729171612762.png)



压缩和加密都会询问是否应用到子文件夹和子文件

![image-20210729171801240](images/winserver/image-20210729171801240.png)



压缩的文件夹是蓝色、加密的文件夹是绿色

![image-20210729171826639](images/winserver/image-20210729171826639.png)



当文件被加密后，即使硬盘被别人拿到，也无法获取数据，需要使用私有秘钥来进行解密



**导出密钥**

- 插入U盘自动提示备份
- 命令行备份

~~~
cipher /x "%UserProfile%\Desktop\MyEFSCertificates"
~~~

- 进入证书备份

~~~
certmgr.msc
~~~

选择所有加密证书，并进行导出

![image-20210729174527620](images/winserver/image-20210729174527620.png)





REF:

Export：https://www.tenforums.com/tutorials/77225-backup-encrypting-file-system-certificate-key-windows-10-a.html#option2

Import：https://www.tenforums.com/tutorials/77268-import-encrypting-file-system-certificate-key-windows-10-a.html



# 七、 磁盘管理

## 1. MBR 分区

- MBR 分区最多分四个主分区

如果已经有三个主分区，在做第四个主分区的时候会自动将第四个主分区分配为逻辑分区，在逻辑分区中在做分区。

- 系统分区需要设置为活动分区

- MBR 分区最多支持单盘 2TB



## 2. GPT 分区

- GPT 可以支持分配超过4个主分区
- GPT 分区可以支持超过 2TB 硬盘
- MBR 转换 GPT 需要无分配状态（或用第三方工具无损转换）



## 3. 挂载磁盘

### 3.1 磁盘映射到文件夹

将磁盘链接到文件夹中，直接点击文件夹即可进入该磁盘，一般用于快捷进入，或者磁盘盘符超过24个的时候。

- 在某分区创建一个文件夹
- 在磁盘管理工具 - 分配盘符（需要挂载的分区） -  装入文件夹

![image-20210729180000219](images/winserver/image-20210729180000219.png)



选择添加

![image-20210729180031817](images/winserver/image-20210729180031817.png)



设置由哪个文件夹映射该磁盘

![image-20210729180121416](images/winserver/image-20210729180121416.png)



### 3.2 文件夹映射到磁盘

当然也有反向操作，让一个盘符代表一个文件夹

![image-20210729180401722](images/winserver/image-20210729180401722.png)



选择路径

![image-20210729180413437](images/winserver/image-20210729180413437.png)



## 4. 动态磁盘

做 RAID 需要将硬盘转换为动态磁盘







### 4.1 **RAID 0 - Stripped Volume （带区卷）**

将所有磁盘链接起来，拼成一块动态磁盘。也可以在 Windows 中从多块硬盘中划出一块分区来做 RAID 0，磁盘容量为所有磁盘容量的总和。

> 当 RAID 阵列 磁盘任意一块硬盘损坏时，整个阵列无法使用。



RAID 0 是效率最高的磁盘阵列。如果不在意数据，只追求效率，可以使用 RAID 0 组磁盘阵列。



选择任何一块硬盘，新建带区卷

![image-20210729180741510](images/winserver/image-20210729180741510.png)



分配大小

![image-20210729180810881](images/winserver/image-20210729180810881.png)





### 4.2 **RAID 1 - Mirror Volume（镜像卷）**

只能用**两块**相同 Size 的硬盘来做镜像。磁盘容量为一块硬盘大小。（损失一半空间）

> 当 RAID 阵列 磁盘任意一块硬盘损坏时，整个阵列还可以继续使用，数据不会丢失



新建镜像卷

![image-20210729180941464](images/winserver/image-20210729180941464.png)



只能选择两块磁盘

![image-20210729181020495](images/winserver/image-20210729181020495.png)



修复磁盘：

插入一块新的硬盘，进入磁盘管理工具

- 右键单击剩余的镜像卷 - 删除镜像 

![image-20210729182346548](images/winserver/image-20210729182346548.png)



- 删除丢失镜像

![image-20210729182444342](images/winserver/image-20210729182444342.png)



- 右键 - 添加镜像 - 选择新硬盘

![image-20210729182525252](images/winserver/image-20210729182525252.png)



- 选择空白磁盘

![image-20210729182551134](images/winserver/image-20210729182551134.png)



- 之后会自动做数据同步，修复完成（数据还在）



### 4.3 **RAID 5** 

采用三块以上的同 Size 硬盘，其中两块是实际容量，另外一块是用来做备份的。三块硬盘中允许坏一块硬盘，支持在线更换，而数据不丢失。（损失 n-1 块硬盘空间）

> 当 RAID 阵列 磁盘任意一块硬盘损坏时，整个阵列还可以继续使用，数据不会丢失



![image-20210729181707920](images/winserver/image-20210729181707920.png)



5块磁盘，每块磁盘划出 1G，可用空间 4G

![image-20210729181743659](images/winserver/image-20210729181743659.png)



修复磁盘：

插入一块新硬盘， 进入磁盘管理工具

- 右键单击剩余的 RAID 5 卷 - 修复卷 - 选择新硬盘

![image-20210729182716651](images/winserver/image-20210729182716651.png)



找到空白磁盘

![image-20210729182746545](images/winserver/image-20210729182746545.png)



- 自动做数据同步，修复完成



# 配置网络打印机

## 1. 服务器安装打印机

安装服务：服务器管理器 - 管理 - 添加角色功能 - 打印和文件服务 - Internet 打印 + LPD 服务

![image-20210729182953585](images/winserver/image-20210729182953585.png)



![image-20210729183028394](images/winserver/image-20210729183028394.png)



安装打印机：管理工具 - 打印管理

![image-20210729183645705](images/winserver/image-20210729183645705.png)



- 打印机服务器 - 打印机 - 右键添加打印机

![image-20210729183757635](images/winserver/image-20210729183757635.png)



安装打印机

![image-20210729183919054](images/winserver/image-20210729183919054.png)



共享设置

![image-20210729184034888](images/winserver/image-20210729184034888.png)



安装完成

![image-20210729184059392](images/winserver/image-20210729184059392.png)



可以在属性中，给用户配置打印权限

![image-20210729185535841](images/winserver/image-20210729185535841.png)





## 2. 客户端连接打印机

- 控制面板 - 硬件和声音 - 设备和打印机

![image-20210729184202118](images/winserver/image-20210729184202118.png)



- 添加网络打印机

![image-20210729184250287](images/winserver/image-20210729184250287.png)



- 网络 - 服务器 - 打印机 - 连接



一般会自动搜索

![image-20210729184418373](images/winserver/image-20210729184418373.png)



手动添加

![image-20210729184329549](images/winserver/image-20210729184329549.png)



或者在网络邻居中，找到打印机后选择连接

![image-20210729184510095](images/winserver/image-20210729184510095.png)



## 3. 配置打印机

### 3.1 **设置优先级**

添加另外一台相同打印机（两个逻辑打印机，一台物理打印设备 ）

![image-20210729185020803](images/winserver/image-20210729185020803.png)



右键 - 高级 - 优先级

![image-20210729185058996](images/winserver/image-20210729185058996.png)



在安全权限中可以给不同的人设置不同的权限。可以给某些用户配置高的优先级打印机，它的打印权限可以插队。

![image-20210729185113186](images/winserver/image-20210729185113186.png)



### 3.2 **打印池**

添加另外一台物理打印机，当有打印任务时，会自动选择没有任务的打印机来进行打印。

- 添加打印机
- 新打印机属性 - 端口 - 启用打印机池 - 勾选两个端口（本身端口和另一台打印机端口）

![image-20210729185322859](images/winserver/image-20210729185322859.png)



# DNS 服务器

单独配置一台 DNS 服务器

管理 - 添加角色功能 - 基于角色或基于功能安装 - 选择当前服务器 - DNS服务 - 安装

![image-20210729185830862](images/winserver/image-20210729185830862.png)



## 1. 配置转发器

让服务器不仅解析局域网域名，还可以解析广域网域名

管理工具 - DNS - 右键点击服务器 - 属性

![image-20210729190012093](images/winserver/image-20210729190012093.png)



转发器 - 添加IP地址

![image-20210729190042863](images/winserver/image-20210729190042863.png)



添加互联网 DNS 服务器

![image-20210729190123757](images/winserver/image-20210729190123757.png)



检查 DNS 转发是否配置成功

```
nslookup
> google.com
> 163.com
```



## 2. 正向、反向查询区域

正向查询区域，相当于创建一个域名。对域名解析成为 IP 地址



### 2.1 添加区域

管理工具 - DNS - 正向查找区域 - 新建区域

![image-20210729190830561](images/winserver/image-20210729190830561.png)



主区域

![image-20210729191148894](images/winserver/image-20210729191148894.png)



区域名称

![image-20210729191206513](images/winserver/image-20210729191206513.png)



区域文件

![image-20210729191229382](images/winserver/image-20210729191229382.png)



不允许动态更新（因为DNS没有和AD安装在一起）

![image-20210729191241037](images/winserver/image-20210729191241037.png)



### 2.2 添加A记录

右键单击创建的域名 - 新建主机（A记录）

![image-20210729191354723](images/winserver/image-20210729191354723.png)





子域名（www）与要绑定的 IP 地址

![image-20210729191421461](images/winserver/image-20210729191421461.png)

> 创建相关的指针记录(PTR)，需要完成反向记录查询区域才可以创建指针



### 2.3 添加反向查询区域

反向查询，相当于从 IP 解析为域名

管理工具 - DNS - 反向查找区域 - 新建区域



![image-20210729191630134](images/winserver/image-20210729191630134.png)



主区域

![image-20210729191708877](images/winserver/image-20210729191708877.png)



IPv4

![image-20210729191722446](images/winserver/image-20210729191722446.png)



IP段

![image-20210729191742105](images/winserver/image-20210729191742105.png)



DNS 文件

![image-20210729191808585](images/winserver/image-20210729191808585.png)



不允许动态更新

![image-20210729191830973](images/winserver/image-20210729191830973.png)



### 2.4 检查是否生效

客户端计算机

```  
nslookup
www.newdomain.com  // 输入创建的子域名
```



```
set type=ptr
192.168.166.51  // 输入域名绑定地址
```



```
set type=a  // 切回A记录
```



## 3. 创建别名

用另外一个域名指向同一个主机 CNAME

正向查找区域 - 域名 - 右键新建别名

![image-20210729192052967](images/winserver/image-20210729192052967.png)



填写别名

![image-20210729192232472](images/winserver/image-20210729192232472.png)



则目前 ftp.ziyou.cc 为 www.ziyou.cc 的别名



```
nslookup
原始域名
别名域名
```

![image-20210729192435028](images/winserver/image-20210729192435028.png)



## 4. 创建邮件主机

- 新建主机(A)

![image-20210729192527829](images/winserver/image-20210729192527829.png)



- mail.domain.com
- PTR 指针

![image-20210729192548448](images/winserver/image-20210729192548448.png)



- 新建邮件交换器

![image-20210729192625289](images/winserver/image-20210729192625289.png)



- 浏览 - 找到 mail 主机

![image-20210729192742570](images/winserver/image-20210729192742570.png)



测试

```
set type=mx
mail.domain.com
```



## 5. 辅助区域

通常域控机器解析域内的 DNS 记录，而另外一台 DNS 服务器用来解析互联网 DNS 记录，不方便让每台客户设置两个 DNS，推荐做法是让一台服务器可以读取另一台的 DNS 记录，进行同步。也就是说允许其他服务器读取主服务器的 DNS 解析服务



到主服务器上打开 - DNS 管理工具 - 主域名属性 - 区域传送 - 允许区域传送 - 添加辅助服务器IP

![image-20210729193216463](images/winserver/image-20210729193216463.png)



辅助服务器 - DNS - 正向查找区域 - 新建区域

![image-20210729193308665](images/winserver/image-20210729193308665.png)



辅助区域

![image-20210729193328117](images/winserver/image-20210729193328117.png)



主服务器domian

![image-20210729193355569](images/winserver/image-20210729193355569.png)



主服务器DNS IP

![image-20210729193419593](images/winserver/image-20210729193419593.png)



# 配置与管理 DHCP

## 1. 配置 DHCP

管理 - 添加角色与功能 - DHCP 服务器 - 安装

![image-20210729195717469](images/winserver/image-20210729195717469.png)



services.msc 重启 DHCP Server

![image-20210729195809131](images/winserver/image-20210729195809131.png)



管理工具 - DHCP - 新建作用域

![image-20210729195836583](images/winserver/image-20210729195836583.png)



输入 DHCP 名称 

![image-20210729195923358](images/winserver/image-20210729195923358.png)



输入IP范围

![image-20210729200004528](images/winserver/image-20210729200004528.png)



排除地址

![image-20210729200038488](images/winserver/image-20210729200038488.png)



默认期限

![image-20210729200103298](images/winserver/image-20210729200103298.png)



是否立即配置

![image-20210729200123921](images/winserver/image-20210729200123921.png)



网关

![image-20210729200156715](images/winserver/image-20210729200156715.png)



DNS 地址

![image-20210729200249748](images/winserver/image-20210729200249748.png)



WINS 服务器

![image-20210729200306028](images/winserver/image-20210729200306028.png)



是否激活

![image-20210729200321892](images/winserver/image-20210729200321892.png)



## 2. 客户计算机

自动获取 IP 地址

![image-20210729200409842](images/winserver/image-20210729200409842.png)





## 2. 地址保留

让某个计算机设置固定IP，即静态IP地址



首先需要获取保留计算机的 MAC 地址

![image-20210729200607546](images/winserver/image-20210729200607546.png)



新建保留

![image-20210729200633219](images/winserver/image-20210729200633219.png)



填写保留名称，保留IP地址，MAC 地址

![image-20210729200707938](images/winserver/image-20210729200707938.png)



## 3. 筛选器

![image-20210729200924329](images/winserver/image-20210729200924329.png)



允许和拒绝都需要指定 MAC 地址

![image-20210729201027336](images/winserver/image-20210729201027336.png)



允许

> 当开启允许服务时，只有允许记录的计算机可以自动获得IP



拒绝

> 当开启拒绝服务时，只有有拒绝记录的计算机无法自动获取IP



# 配置Web服务器和FTP服务器

## 1. 安装 IIS

管理 - 添加角色与功能 - Web 服务器安装（勾选所有安全性） + FTP 服务（不需要FTP扩展）

![image-20210729201330056](images/winserver/image-20210729201330056.png)



WEB 安全性勾选

![image-20210729201350126](images/winserver/image-20210729201350126.png)



勾选 FTP

![image-20210729201413550](images/winserver/image-20210729201413550.png)



## 2. 配置 IIS

管理工具 - IIS 管理 - 网站 - 右键添加网站

![image-20210729201459553](images/winserver/image-20210729201459553.png)



- 网站名称
- 物理路径

![image-20210729201545885](images/winserver/image-20210729201545885.png)



## 3. 设置默认文档支持类型

设置默认打开网站文件名称和类型，如：index.html

![image-20210729201704028](images/winserver/image-20210729201704028.png)

## 3. IP地址和域限制

可以将指定IP地址加入黑名单，让属于IP的计算机无法访问Web服务

![image-20210729201810007](images/winserver/image-20210729201810007.png)

![image-20210729201840523](images/winserver/image-20210729201840523.png)



## 4. 身份验证

- 匿名身份验证：对公共开放
- Windows 身份验证：对内部开放（需要禁用匿名验证）

![image-20210729201910789](images/winserver/image-20210729201910789.png)



## 5. 虚拟目录

虚拟目录相当于子网站，但是网站以子目录形式依附于主网站。如主网站域名为 main.com ，路径为 wwwroot/main ，虚拟目录为 wwwroot/xuni 。创建完毕后则可以直接用 main.com/xuni 来访问该子站。



![image-20210729202038675](images/winserver/image-20210729202038675.png)



![image-20210729202058380](images/winserver/image-20210729202058380.png)



## 6. 部署多个网站

### 6.1 更改端口号（不推荐）

在配置 Web 网站的时候指定不同的端口号



### 6.2 绑定不同地址

- 将本机 IP 增加一个IP（网络适配器属性 - TCP/IP 协议 - 高级 - 添加 IP）

![image-20210729202245747](images/winserver/image-20210729202245747.png)



![image-20210729202258944](images/winserver/image-20210729202258944.png)



- 将多个网站用不同IP进行IP绑定

![image-20210729202347954](images/winserver/image-20210729202347954.png)



WEB2 绑定 192.168.166.154

![image-20210729202400865](images/winserver/image-20210729202400865.png)



WEB1 绑定 192.168.166.54

![image-20210729202439417](images/winserver/image-20210729202439417.png)



### 6.3 通过不同主机名

- DNS 服务器上创建两台主机（不同域名）指向同一IP

![image-20210729202824271](images/winserver/image-20210729202824271.png)



- 将多个网站用主机名进行绑定

![image-20210729202907806](images/winserver/image-20210729202907806.png)



## 7. 配置 FTP

IIS 管理工具 - 网站 - 添加 FTP 站点

![image-20210729202947768](images/winserver/image-20210729202947768.png)



![image-20210729203004601](images/winserver/image-20210729203004601.png)



![image-20210729203016488](images/winserver/image-20210729203016488.png)



![image-20210729203028581](images/winserver/image-20210729203028581.png)



### 7.1 访问 FTP 方式

- CMD 方式访问 FTP

![image-20210729203107665](images/winserver/image-20210729203107665.png)



- 资源浏览器中访问 ftp://

![image-20210729203148687](images/winserver/image-20210729203148687.png)





- FTP客户端



### 7.2 FTP 身份认证

![image-20210729203303292](images/winserver/image-20210729203303292.png)



- 禁用匿名登录
- 使用 FTP 服务器存在的用户名和密码





FTP 用户隔离

- 不隔离用户，让不同用户访问不同的 FTP 文件夹（文件夹名称为ftp user名称），需要更改文件夹权限（只允许指定 FTP 用户进行访问控制）

  > 这种方法不适用于根目录。用户依然可以对根目录文件进行修改

- 隔离用户，需要创建 localuser 目录，然后在里边创建 ftp user 的子目录



![image-20210729203441657](images/winserver/image-20210729203441657.png)



# 配置 VPN 与 NAT 服务器

## 1. 配置VPN

VPN服务器上边需要有两块网卡，一块连接 WAN ，一块连接 LAN。



管理 -  - 添加角色和功能 - 远程访问

![image-20210729204050517](images/winserver/image-20210729204050517.png)



![image-20210729204113267](images/winserver/image-20210729204113267.png)



路由和远程访问

![image-20210729204151710](images/winserver/image-20210729204151710.png)





配置并启用 - VPN - 选择网络接口

![image-20210729204218064](images/winserver/image-20210729204218064.png)



![image-20210729204234937](images/winserver/image-20210729204234937.png)



![image-20210729204245289](images/winserver/image-20210729204245289.png)



选择 WAN 网口，不勾选所有数据通过 VPN 

![image-20210729204321134](images/winserver/image-20210729204321134.png)



![image-20210729204413686](images/winserver/image-20210729204413686.png)



![image-20210729204429407](images/winserver/image-20210729204429407.png)



![image-20210729204444651](images/winserver/image-20210729204444651.png)



## 2. 连接 VPN

![image-20210729204530330](images/winserver/image-20210729204530330.png)



![image-20210729204543281](images/winserver/image-20210729204543281.png)



![image-20210729204558691](images/winserver/image-20210729204558691.png)



![image-20210729204634620](images/winserver/image-20210729204634620.png)



![image-20210729204834334](images/winserver/image-20210729204834334.png)



用户名密码需要在 VPN 服务器上创建账号

管理工具 - 本地用户和组 - 创建VPN用户（拨入权限）

![image-20210729204818870](images/winserver/image-20210729204818870.png)



![image-20210729204920701](images/winserver/image-20210729204920701.png)





## (X)2. 配置 NAT

 首先需要禁用路由和远程访问，然后再进行配置 NAT。

![image-20210729205021301](images/winserver/image-20210729205021301.png)



右键配置 NAT - 网络地址转换NAT - 选择网络接口

![image-20210729205104252](images/winserver/image-20210729205104252.png)





![image-20210729205115672](images/winserver/image-20210729205115672.png)



![image-20210729205131553](images/winserver/image-20210729205131553.png)



![image-20210729205202741](images/winserver/image-20210729205202741.png)



外网访问内网web资源

 NAT - WAN - 输入内部 IP 地址（外部访问需要访问外部网卡的IP）



# 安全管理

## 1. 本地安全策略

- 账户策略
  - 密码策略（设置安全密码策略）

![image-20210729205543290](images/winserver/image-20210729205543290.png)

- 账户锁定策略（防止暴力破解）

![image-20210729205601117](images/winserver/image-20210729205601117.png)



- 用户权限分配
  - 关闭系统（设置允许关闭系统的用户）

![image-20210729205711644](images/winserver/image-20210729205711644.png)



- 审核策略
  - 审核账户登录事件（在事件管理器中记录登录失败报告）

![image-20210729205736879](images/winserver/image-20210729205736879.png)





MMC 添加

- 安全模板（配置安全模板，用于批量配置）

![image-20210729205946095](images/winserver/image-20210729205946095.png)

- 安全配置分析（用于比较模板与当前配置）

![image-20210729210034307](images/winserver/image-20210729210034307.png)





## 2. 组策略管理

管理工具 - 组策略管理

![image-20210729210212087](images/winserver/image-20210729210212087.png)



组策略对象 - 新建组策略

![image-20210729210303153](images/winserver/image-20210729210303153.png)



编辑组策略

- 计算机配置（默认生效）
- 用户配置

> 计算机策略需要重启生效，用户注销重新登录就可以生效



![image-20210729210317163](images/winserver/image-20210729210317163.png)





实现组策略

链接现有 GPO （用户组），如：Sales

![image-20210729210424270](images/winserver/image-20210729210424270.png)





刷新组策略

```
gpupdate / force
```



备份组策略

右键点击组策略 - 备份



还原组策略

右键点击组策略对象 - 管理备份



# EXCHANGE

## 1. 安装 Exchange

Powershell 检查安装环境

~~~
Install-WindowsFeature AS-HTTP-Activation, Desktop-Experience, NET-Framework-45-Features, RPC-over-HTTP-proxy, RSAT-Clustering, Web-Mgmt-Console, WAS-Process-Model, Web-Asp-Net45, Web-Basic-Auth, Web-Client-Auth, Web-Digest-Auth, Web-Dir-Browsing, Web-Dyn-Compression, Web-Http-Errors, Web-Http-Logging, Web-Http-Redirect, Web-Http-Tracing, Web-ISAPI-Ext, Web-ISAPI-Filter, Web-Lgcy-Mgmt-Console, Web-Metabase, Web-Mgmt-Console, Web-Mgmt-Service, Web-Net-Ext45, Web-Request-Monitor, Web-Server, Web-Stat-Compression, Web-Static-Content, Web-Windows-Auth, Web-WMI, Windows-Identity-Foundation -Restart
~~~



1、.NET Framework 4.5

2、Microsoft Unified Communications Managed API 4.0

~~~
http://www.microsoft.com/en-us/download/details.aspx?id=34992)
~~~



3、office 2010 filter pack 64 bit，office 2010 filter pack sp1 64bit

~~~
http://www.microsoft.com/en-us/download/details.aspx?id=17062
http://www.microsoft.com/en-us/download/details.aspx?id=26604
~~~



4、需要在域控中安装 AD DS 工具

![233144126.jpg](images/winserver/233144126.jpg)



4、运行安装程序

![image-20210729211402228](images/winserver/image-20210729211402228.png)



## 2. Exchange 管理

Exchange 2013中不会再有管理单元，全部用web来管理

~~~
https://域控IP地址/ecp  # 管理地址
https://域控IP地址/owa  # 用户单元
~~~



## 3. 证书配置

证书分为商用证书和企业自建证书（公司内部使用）



申请证书流程：

1. 由证书申请者生成一对秘钥（公钥和私钥）
   - Exhcnage 服务器发送申请
2. 申请者将公钥交给CA，私钥自己留用
3. CA 验证申请者身份
4. CA 颁发证书：证书内容以明文形式保存，并附有CA签名。



配置 CAS 服务器证书思路：

1. 部署 CA 服务器
2. Exchange 服务器生成证书请求文件（多名称证书）
3. 提交证书请求
4. 在 EAC 中完成证书请求
5. 为证书分配服务
6. 在 EAC 中导出证书，并导入其他 Exchange 服务器



### 3.1 证书服务器

配置一台独立 DC 用作证书颁发机构

- 安装 AD 服务
- 安装 AD 证书服务



![image-20210730123346602](images/winserver/image-20210730123346602.png)



![image-20210730123402762](images/winserver/image-20210730123402762.png)



### 3.2 部署配置

![image-20210730123433215](images/winserver/image-20210730123433215.png)



![image-20210730123453554](images/winserver/image-20210730123453554.png)



选择企业 CA

![image-20210730123514591](images/winserver/image-20210730123514591.png)



选择根 CA

![image-20210730123540901](images/winserver/image-20210730123540901.png)



新建私钥

![image-20210730123600677](images/winserver/image-20210730123600677.png)



默认加密参数

![image-20210730123622507](images/winserver/image-20210730123622507.png)



CA 名称

![image-20210730123652722](images/winserver/image-20210730123652722.png)



有效期，可长一些

![image-20210730123732417](images/winserver/image-20210730123732417.png)



证书位置

![image-20210730123746881](images/winserver/image-20210730123746881.png)



完成配置

![image-20210730123800907](images/winserver/image-20210730123800907.png)



进入管理控制台

![image-20210730123832632](images/winserver/image-20210730123832632.png)



可以看到别人提交的申请以及我们颁发的证书

![image-20210730123900042](images/winserver/image-20210730123900042.png)



### 3.3 Exchange 发起证书申请

进入 Exchange Web 管理中心界面

![image-20210730124041957](images/winserver/image-20210730124041957.png)



添加证书

![image-20210730124148348](images/winserver/image-20210730124148348.png)



证书名称（可自定义）

![image-20210730124215839](images/winserver/image-20210730124215839.png)



通配符证书（多域情况下使用）

![image-20210730124242099](images/winserver/image-20210730124242099.png)



选择由哪个 Exchange 服务器提交请求

![image-20210730124312322](images/winserver/image-20210730124312322.png)



分配名称

![image-20210730124336890](images/winserver/image-20210730124336890.png)



![image-20210730124408635](images/winserver/image-20210730124408635.png)



检查证书包含域

![image-20210730124502328](images/winserver/image-20210730124502328.png)



组织信息

![image-20210730124523458](images/winserver/image-20210730124523458.png)



证书存放路径

- 存放在一个共享文件夹中（Everyone 拥有读写属性）
- 证书名称如：`\\sr1\share\exchange.req`

![image-20210730124556153](images/winserver/image-20210730124556153.png)



### 3.4 处理证书请求

进入到 CA 服务器

~~~
http://dc1/certsrv
~~~



选择申请证书

![image-20210730124828569](images/winserver/image-20210730124828569.png)



选择高级证书申请

![image-20210730124901248](images/winserver/image-20210730124901248.png)



选择 BASE64 方式

![image-20210730124937752](images/winserver/image-20210730124937752.png)



使用记事本打开刚才保存的证书

![image-20210730125011299](images/winserver/image-20210730125011299.png)



粘贴到证书申请页面中，然后模板选择 Web 服务器

![image-20210730125058092](images/winserver/image-20210730125058092.png)



选择下载证书

- 保存在刚才的 share 文件夹中

![image-20210730125131723](images/winserver/image-20210730125131723.png)



### 3.5 导入证书

回到 Exchange 管理中心，可以看到刚才的证书申请处于搁置状态，点击右侧的完成

![image-20210730125322304](images/winserver/image-20210730125322304.png)



填写证书路径

![image-20210730125451588](images/winserver/image-20210730125451588.png)



导入完成后，已分配服务只有 IMAP, POP。我们还需要 STMP 等服务添加证书服务，选择编辑

![image-20210730125641395](images/winserver/image-20210730125641395.png)



将 SMTP，如果有 IIS，也将 IIS 勾选

![image-20210730125711440](images/winserver/image-20210730125711440.png)





替换证书

![image-20210730125753575](images/winserver/image-20210730125753575.png)



出现无效提示

![image-20210730125819643](images/winserver/image-20210730125819643.png)



这是因为证书还没有生效，需要重启服务器，组策略重新应用，才可以使证书生效

![image-20210730125930099](images/winserver/image-20210730125930099.png)





### 3.6 给其他 Exchange 服务器导入证书

先在已存在证书服务器导出证书

![image-20210730130139241](images/winserver/image-20210730130139241.png)



路径+密码

![image-20210730130207106](images/winserver/image-20210730130207106.png)



进入到 SRV2 Exchange 服务器，选择导入证书

![image-20210730130228809](images/winserver/image-20210730130228809.png)



选择刚才导出证书地址和密码

![image-20210730130249530](images/winserver/image-20210730130249530.png)



选择服务器

![image-20210730130302372](images/winserver/image-20210730130302372.png)



![image-20210730130315833](images/winserver/image-20210730130315833.png)



同样需要重启服务器才可以使证书生效

![image-20210730130453777](images/winserver/image-20210730130453777.png)









# 问题

如何将超过 254 台计算机加入同一个域

AD 域控第二台DNS设置指向第一台域控，那么如果挂了DNS，需要修改第二台域控的DNS吗？



# 实战

- 一台主 DC，另外一台 DC 作为备份
  - 主 DC 下有其他 Department 工作域



- 创建 VPN，实现移动办公
- 创建 Share Folder
- Enable Recycle Bin