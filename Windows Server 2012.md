# 一、安装 VMWARE

MBR 分区

- 最大2T
- 最大分区数 4个
- BIOS 引导模式



GPT 分区

- 大于2T
- 128个分区
- UEIF 引导模式



VMware 网络连接方式

桥接

- 虚拟机IP地址与主机在同一个网段，有IP数量限制

- 主机与虚拟机通信正常。

![preview](images/winserver/v2-0e29e8f13495c269f3fdc723aa2255c2_r.jpg)



NAT方式

NAT：利用VMnet8，进行网络连接，虚拟机可以本机通信，无法真实网段中其他计算机通信，但是可以访问互联网。

![preview](images/winserver/v2-871f30dcb6c7880405c0d8ff3d90f06d_r.jpg)



主机方式

Host-Only：利用VMnet1网卡，进行网络连接，只能和本机通信，不能访问互联网（除非让主机共享网卡）

![preview](images/winserver/v2-e24b895b787c96e64d4aa6dce8baa961_r.jpg)



安装 Windows Server 2012 时，选择带 GUI 的模式，否则将没有图形界面。



Diskpart 删除系统保留分区

```
diskpart
select disk
clean
create partition primary size=30000
create partition extended
```



# 二、配置 Windows Server 2012

1. 将常用工具固定在 Metro 页面
2. 虚拟内存（正常内存的1.5-2倍，最大值与最小值相等，防止产生碎片）
3. 配置防火墙(PING)
   - 文件和打印机共享
   - 出站规则和入站规则 ICMPv4
4. 更改管理员密码方法（计算机管理、net user）



# 三、安装 Hyper-V 服务器

管理 - 添加角色与功能 - 基于角色或基于功能 - 选择服务器 - Hyper-V 



Hyper-V 管理器

- 新建虚拟机
  - 第一代（WIN7及以前版本Windows）
  - 第二代（WIN8 或 WIN2012 以后操作系统）



Hyper-V 虚拟硬盘

- 固定（指定大小）
- 动态扩展（根据大小自动调整文件大小）
- 差异（需要选定父硬盘，差异硬盘只存储不同内容）



导入虚拟机

- 就地注册
- 还原虚拟机
- 复制虚拟机



# 四、Active Directory 域服务环境

## 1. 安装域

```
# 检查主机名称（以后尽量避免更改）
hostname

# 检查IP（需要一个固定IP）
ipconfig

# 防止内部域与互联网域冲突（将本地网卡DNS服务器更改为 127.0.0.1
```



添加角色功能 - AD 域服务 + DNS 服务



将此服务器提升为域控制器

- 添加新林
- 输入根域名(long.com)
- 输入还原模式密码



## 2. 安装辅助域控

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
long.com
exit

# 检查是否可以ping通
ping long.com
```



添加角色功能 - AD 和 DNS

将此服务器提升为域控制器

- 将域控制器添加到现有域（选择域）
- 输入域用户名和密码(long\administrator)
- 输入还原模式密码



## 3. 创建子域

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

提升为域控

- 将新域添加到现有林
-  选择父域
- 新域名
- 输入还原模式密码



## 4. 创建独立域

```
# 检查主机名称（以后尽量避免更改）
hostname

# 检查IP（需要一个固定IP）
ipconfig

# 防止内部域与互联网域冲突（将本地网卡DNS服务器更改为 127.0.0.1
```



添加角色功能 - AD 域服务 + DNS 服务



将此服务器提升为域控制器

- 添加新林
- 输入根域名(smile.com)
- 输入还原模式密码



## 5. 创建OU（组织单位）

管理工具 - AD - long.com - 新建组织单位 - 创建OU名称

AD - long.com - 新建用户 - 用户登录名 - 密码



更改域的组策略（密码复杂性）

管理工具 - 组策略管理

- 组策略对象 - 默认域策略 - 编辑
- 计算机配置 - 策略 - Windows 设置 - 安全设置 - 账户策略



```
# 强制更新
gpupdate /force
```



## 6. OU委派控制

AD 管理工具 - OU - 委派控制 - 添加用户或组



## 7. 备份

添加角色和功能 - Windows Server Backup

管理工具 - Windows Server Backup

- 一次性备份（备份大，完整备份）
- 只备份系统状态（备份小）



## 8. 创建双向信任

对两个独立域进行双向信任



允许 smile.com DNS 做区域传送

- DNS 管理器
- 正向查找区域 - smile.com
- 区域传送（允许区域传送）



在 long.com 创建辅助区域

- DNS 管理器
- 正向查找区域 - long.com
- 新建区域 - 辅助区域
- smile.com
- 主服务器地址



将 smile.com 服务器网卡的 DNS 设置为 long.com 服务器 IP



AD 域和信任关系

- long.com - 属性 - 信任
- smile.com 
- 林信任
- 双向
- 信任密码
- 确认传出信任
- 确认传入信任



在 smile.com 主机上也作出双向信任



## 9. FFMO

当服务器挂了的时候，需要到辅助主机上更改设置



AD 用户和计算机 - long.com - 操作主机

- RID
- PDC
- 基础结构



AD 信任关系 - long.com - 操作主机

- 更改域控制器

- 更改域名操作主机





MMC 添加 AD 架构

 在 MMC 中注册 AD 架构，然后添加 AD 架构

```
regsvr32 schmmgmt.dll
```

 

AD架构

- 更改域控
- 更改操作主机



## 10. 添加GC

AD 站点和服务 - Servers - NTDS 属性 - 全局编录









6. AD 域控第二台DNS设置指向第一台域控，那么如果挂了DNS，需要修改第二台域控的DNS吗？



# 五、管理用户账户和组账户

## 1. 创建本地用户

管理工具 - 计算机管理 - 本地用户和组 - 用户 - 右键新用户

隶属于 - 添加组（如 Administrators）

拨入（如果VPN用户，需要允许拨入）



命令行模式

```
# 创建用户
net user 用户名 密码 /add
net user 用户名 * /add

# 激活用户
net user 用户名 /active:yes
net user 用户名 /ative:no

# 删除用户
net user username /delete
```



## 2. 添加组

管理工具 - 计算机管理 - 本地用户和组 - 组 - 添加组

添加成员



命令行模式

```
# 创建组
net user localgroup 组名 /add

# 删除组
net user localgroup 组名 /delete

# 添加组成员
net user localgroup 组名 用户名 /add	
```





## 3. 添加域用户

管理工具 - AD 用户和计算机 -  User - 新建用户

配置文件路径 - 分配共享路径



```
net user username password /add /domain
```



## 4. 添加域组

管理工具 - AD 用户和计算机 -  User - 新建组

- 安全组（可以设置权限）
- 通讯组（没有权限）

> 组是可以嵌套，继承权限的



```
net group groupname /add /domain
net group groupname username /add /domain
```

> 不能指定OU



```
创建ou
dsadd ou ou=ouname,dc=domain,dc=com -desc "Sales"

# 创建ou用户
dsadd user cn=user3,ou=ou1,dc=long,dc=com -pwd * -upn user3

# 创建ou组
dsadd group cn=group3,ou=ou1,dc=long,dc=com

# 添加组成员
dsmod group cn=group3,ou=ou1,dc=long,dc=com -addmbr cn=user3,ou=ou1,dc=long,dc=com

# 修改密码
dcmod user cn=user3,ou=ou1,dc=long,dc=com -pwd 

# 禁用用户
dcmod user cn=user3,ou=ou1,dc=long,dc=com -disabled yes

# 删除用户
dsrm cn=user3,ou=ou1,dc=long,dc=com

# 删除组
dsrm cn=group3,ou=ou1,dc=long,dc=com

# 删除ou
dsrm ou=ou1,dc=long,dc=com
```



删除被保护的ou

查看 - 高级功能 - ou - 对象 - 防止对象被意外删除



# 六、共享资源设置

- 右键 - 属性 - 共享 - 高级共享
- 查看共享（计算机管理 - 共享文件夹）

- 防火墙设置（允许程序或功能通过防火墙 - File and Printer Share）
- 权限（共享权限与安全权限交集部分）
  - 替换权限（安全 - 高级）
    - 子目录单独权限
    - 继承父权限

1. 卷影副本（相当于快照）
2. 压缩和加密（文件夹属性 - 高级 - 压缩和加密）



# 七、 磁盘管理

## 1. MBR 分区

- MBR 分区最多分四个主分区

如果已经有三个主分区，在做第四个主分区的时候会自动将第四个主分区分配为逻辑分区，在逻辑分区中在做分区。

- 系统分区需要设置为活动分区

- MBR 分区最多支持2TB



## 2. GPT 分区

- GPT 可以支持分配超过4个主分区
- GPT 分区可以支持超过 2TB 硬盘
- MBR 转换 GPT 需要无分配状态（或用第三方工具无损转换）



## 3. 挂载磁盘

将磁盘链接到文件夹中，直接点击文件夹即可进入该磁盘，一般用于快捷进入，或者磁盘盘符超过24个的时候。

- 在某分区创建一个文件夹
- 在磁盘管理工具 - 分配盘符（需要挂载的分区） -  装入文件夹



## 4. 动态磁盘

做 RAID 需要将硬盘转换为动态磁盘



**创建方法：**

磁盘管理 - 新建RAID卷 - 添加磁盘 - 设置磁盘空间



**RAID 0 - Stripped Volume （带区卷）**

将所有磁盘链接起来，拼成一块动态磁盘。也可以在 Windows 中从多块硬盘中划出一块分区来做 RAID 0，磁盘容量为所有磁盘容量的总和。

> 当 RAID 阵列 磁盘任意一块硬盘损坏时，整个阵列无法使用。



RAID 0 是效率最高的磁盘阵列。如果不在意数据，只追求效率，可以使用 RAID 0 组磁盘阵列。





**RAID 1 - Mirror Volume（镜像卷）**

只能用**两块**相同 Size 的硬盘来做镜像。磁盘容量为一块硬盘大小。（损失一半空间）

> 当 RAID 阵列 磁盘任意一块硬盘损坏时，整个阵列还可以继续使用，数据不会丢失



修复磁盘：

插入一块新的硬盘，进入磁盘管理工具

- 右键单击剩余的镜像卷 - 删除镜像
- 右键 - 添加镜像 - 选择新硬盘



**RAID 5** 

采用三块以上的同 Size 硬盘，其中两块是实际容量，另外一块是用来做备份的。三块硬盘中允许坏一块硬盘，支持在线更换，而数据不丢失。（损失 n-1 块硬盘空间）

> 当 RAID 阵列 磁盘任意一块硬盘损坏时，整个阵列还可以继续使用，数据不会丢失



修复磁盘：

插入一块新硬盘， 进入磁盘管理工具

- 右键单击剩余的 RAID 5 卷 - 修复卷 - 选择新硬盘



# 八、配置网络打印机

## 1. 服务器安装打印机

安装服务：服务器管理器 - 管理 - 添加角色功能 - 打印和文件服务 - Internet 打印 + LPD 服务

安装打印机：管理工具 - 打印管理 - 打印机服务器 - 打印机 - 右键添加打印机 - 共享打印机



## 2. 客户端连接打印机

- 控制面板 - 硬件和声音 - 设备和打印机 - 添加网络打印机

- 网络 - 服务器 - 打印机 - 连接



## 3. 配置打印机

**设置优先级：**

添加另外一台相同打印机（两个逻辑打印机，一台物理打印设备 ），右键 - 高级 - 优先级



在安全权限中可以给不同的人设置不同的权限。可以给某些用户高的优先级，它的打印权限可以插队。



**打印池：**

添加另外一台物理打印机，当有打印任务时，会自动选择没有任务的打印机来进行打印。



- 添加打印机
- 新打印机属性 - 端口 - 启用打印机池 - 勾选两个端口（本身端口和另一台打印机端口）



# 九、DNS 服务器

管理 - 添加角色功能 - 基于角色或基于功能安装 - 选择当前服务器 - DNS服务 - 安装



## 1. 配置转发器

让服务器不仅解析局域网域名，还可以解析广域网域名

管理工具 - DNS - 右键点击服务器 - 属性 - 转发器 - 添加IP地址



检查 DNS 转发是否配置成功

```
nslookup
> google.com
> 163.com
```



## 2. 正向、反向查询区域

正向查询区域，相当于创建一个域名。



### 添加区域

管理工具 - DNS - 正向查找区域 - 新建区域 - 主区域



### 添加A记录

右键单击创建的域名 - 新建主机（A记录）- 子域名（www） - 创建相关的指针记录(PTR)



### 添加反向查询区域

管理工具 - DNS - 反向查找区域 - 新建区域 - IPv4 - IP段



### 检查是否生效

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

用另外一个域名指向同一个主机

正向查找区域 - 域名 - 右键新建别名 - 子域名 - 浏览指向主机

```
nslookup
原始域名
别名域名
```



## 4. 创建邮件主机

新建主机(A) - mail.domain.com - PTR

新建邮件交换器 - 浏览 - 找到 mail 主机



测试

```
set type=mx
mail.domain.com
```



## 5. 辅助区域

允许其他服务器读取主服务器的 DNS 解析服务

到主服务器上打开 - DNS 管理工具 - 主域名属性 - 区域传送 - 允许区域传送 - 添加辅助服务器IP



辅助服务器 - DNS - 正向查找区域 - 新建区域 - 辅助区域 - 主服务器domian - 主服务器IP



# 十、配置与管理 DHCP

## 1. 配置 DHCP

管理 - 添加角色与功能 - DHCP 服务器 - 安装

services.msc 重启 DHCP Server



管理工具 - DHCP - 新建作用域 - subnet_192.168.2.0 - 输入IP范围 - 排除地址 - 网关（192.168.2.254）- DNS 地址



## 2. 地址保留

让某个计算机设置固定IP

新建保留 - 保留名称 - 保留IP地址 - MAC 地址



## 3. 筛选器

允许

> 当开启允许服务时，只有允许记录的计算机可以自动获得IP



拒绝

> 当开启拒绝服务时，只有有拒绝记录的计算机无法自动获取IP





# 十一、配置Web服务器和FTP服务器

管理 - 添加角色与功能 - Web 服务器安装（勾选所有安全性） + FTP 服务（不需要FTP扩展）



## 1. 配置 IIS

管理工具 - IIS 管理 - 网站 - 右键添加网站

- 网站名称
- 物理路径



设置默认文档支持类型

设置默认打开网站文件名称和类型，如：index.html



IP地址和域限制

可以将指定IP地址加入黑名单，让属于IP的计算机无法访问Web服务



身份验证

- 匿名身份验证：对公共开放
- Windows 身份验证：对内部开放（需要禁用匿名验证）



虚拟目录

虚拟目录相当于子网站，但是网站以子目录形式依附于主网站。如主网站域名为 main.com ，路径为 wwwroot/main ，虚拟目录为 wwwroot/xuni 。创建完毕后则可以直接用 main.com/xuni 来访问该子站。



部署多个网站

- 更改端口号
- 绑定不同地址
  - 将本机 IP 增加一个IP（网络适配器属性 - TCP/IP 协议 - 高级 - 添加 IP
  - 将多个网站用不同IP进行IP绑定
- 通过不同主机名
  - DNS 服务器上创建两台主机（不同域名）指向同一IP
  - 将多个网站用主机名进行绑定



配置 FTP

IIS 管理工具 - 网站 - 添加 FTP 站点



访问 FTP 方式

CMD - ftp ip

浏览器访问 ftp://

FTP客户端



FTP 用户隔离

- 不隔离用户，让不同用户访问不同的 FTP 文件夹（文件夹名称为ftp user名称），需要更改文件夹权限（只允许指定 FTP 进行访问控制）

  > 这种方法不适用于根目录。用户依然可以对根目录文件进行修改

- 隔离用户，需要创建 localuser 目录，然后在里边创建 ftp user 的子目录



十二、配置 VPN 与 NAT 服务器

## 1. 配置VPN

VPN服务器上边需要有两块网卡，一块连接 WAN ，一块连接 LAN。



管理 -  - 添加角色和功能 - 远程访问

路由和远程访问 - 配置并启用 - VPN - 选择网络接口

管理工具 - 本地用户和组 - 创建VPN用户（拨入权限）



## 2. 配置 NAT

 首先需要禁用路由和远程访问，然后再进行配置 NAT。



右键配置 NAT - 网络地址转换NAT - 选择网络接口



外网访问内网web资源

 NAT - WAN - 输入内部 IP 地址（外部访问需要访问外部网卡的IP）



# 十二、安全管理

## 1. 本地安全策略

- 账户策略
  - 密码策略（设置安全密码策略）
  - 账户锁定策略（防止暴力破解）



- 用户权限分配
  - 关闭系统（设置允许关闭系统的用户）



- 审核策略
  - 审核账户登录事件（记录登录失败报告）



MMC 添加

- 安全模板（配置安全模板，用于批量配置）
- 安全配置分析（用于比较模板与当前配置）



## 2. 组策略管理

管理工具 - 组策略管理

组策略对象 - 新建组策略

编辑组策略

- 计算机配置（默认生效）
- 用户配置

> 计算机策略需要重启生效，用户注销重新登录就可以生效



实现组策略

链接现有 GPO （用户组），如：Sales



刷新组策略

```
gpupdate / force
```



备份组策略

右键点击组策略 - 备份



还原组策略

右键点击组策略对象 - 管理备份






