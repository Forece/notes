# VMARE 安装 Linux

1. 创建空白硬盘

![img](images/linux/clipboard.png)



2. 选择需要安装 Linux 系统或者内核

![img](images/linux/clipboard-1595698606722.png)



3. VMware文件会跟随系统文件大小自动调整，最大20GB，

![img](images/linux/clipboard-1595698634621.png)

4. 虚拟机内存分配，不能超过真实电脑的一半，最低628MB

![img](images/linux/clipboard-1595698691999.png)



5. 网络连接

![img](images/linux/clipboard-1595698712376.png)



>桥接：利用本地网卡进行连接，占用同网络的IP地址，可以和同网段其他计算机连接，缺点是限制数量
>
>NAT：利用VMnet8，进行网络连接，只能和本机通信，无法真实网段中其他计算机通信，但是可以访问互联网。
>
>Host-Only：利用VMnet1网卡，进行网络连接，只能和本机通信，不能访问互联网



6. 快照是当前虚拟机状态，克隆是克隆出另外一台虚拟机，可以克隆当前状态或者快照状态

![img](images/linux/clipboard-1595698747254.png)



> 链接克隆是只共享文件，新的克隆机依附于原始虚拟机，如果原始虚拟机崩溃了，新的克隆机也无法使用，完整克隆则是整个克隆



![img](images/linux/clipboard-1595698761669.png)





# 分区

主分区：最多有4个

扩展分区：最多只能1个

主分区+扩展分区最多4个

不能写入数据，只能包含逻辑分区

逻辑分区



**格式化EXT4**

相当于4K为一个单位



**inode 节点：**

每个文件的索引







# 常用命令

配置用户权限

~~~shell
chown -R nginx:nginx wwwroot
~~~



查看剩余内存

~~~shell
free -m
~~~



查看硬盘占用

~~~shell
df -lh
du -sh  ./*
~~~



查找大文件

~~~shell
find /home -type f -size +800M
~~~



查看 php-fpm 占用内存

~~~
ps -ylC php-fpm --sort:rss
~~~



重启命令

~~~
# 重启 Nginx
service nginx restart
# 重启 php-fpm
# 重启 mysql
~~~



~~~
$ sudo systemctl start php-fpm      # 启动php-fpm
$ sudo systemctl stop php-fpm       # 停止php-fpm
$ sudo systemctl reload php-fpm     # 重载php-fpm
$ sudo systemctl restart php-fpm    # 重启php-fpm
~~~



## tar

tar 命令用于对文件或目录创建归档（压缩）

~~~shell
tar [options] 文件名或目录名
~~~



| 选项               | 说明                                       |
| ------------------ | ------------------------------------------ |
| -c                 | 创建归档文件                               |
| -C                 | 此选项在解压缩时使用，将文件解压至指定目录 |
| -f                 | 指定归档文件                               |
| -v                 | 显示命令执行的详细过程                     |
| -t                 | 列出归档文件里的内容                       |
| -z                 | 通过 gzip 指令处理归档文件                 |
| -x                 | 从归档文件中将文件解压出来                 |
| -p                 | 保持原来文件的属性信息                     |
| --exclude=<文件名> | 将符合的文件排除                           |



实例：

打包 ./forece.net 目录

~~~shell
tar -czvf forece.tar ./forece.net
~~~



解压 forece.tar

~~~shell
tar -xzvf forece.tar
~~~



## zip / unzip

zip 压缩命令

~~~shell
zip -r forece.zip forece.net
~~~



unzip 解压命令

~~~shell
unzip forece.zip
~~~



## ls



## curl

使用 curl 命令可以下载远程服务器上的文件

~~~
curl [options] url
~~~



实例:

~~~shell
# 下载 zip 文件
curl -o forece.zip https://www.forece.net/backup.zip
~~~



## chmod

~~~shell
chmod 777 -R /var/www/
~~~

> 修改用户操作权限



## chown

~~~shell
chown -R www:www /var/www/
~~~

> 修改文件夹的所有者和组



## crontab

~~~
# Example of job definition:
# .---------------- minute (0 - 59)
# |  .------------- hour (0 - 23)
# |  |  .---------- day of month (1 - 31)
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
# |  |  |  |  |
# *  *  *  *  * user-name  command to be executed
~~~



~~~
# 每天3:00和19:00点更新证书
0 3,19 * * * certbot renew
~~~





# Iptables

~~~
iptables -I INPUT -s 192.168.10.0/24 -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -j REJECT
~~~

> 只允许指定网段的主机访问本机的22端口，拒绝来自其他所有主机的流量



~~~
service iptables save
~~~

> 保存规则。否则开关机失效。



也可以直接编辑 /etc/sysconfig/iptables



通过命令 iptables -A INPUT -p tcp -s 192.168.1.2 -j DROP
这里意思就是 -A 就是添加新的规则， 怎样的规则呢？ 由于我们访问网站使用tcp的，
我们就用 -p tcp , 如果是 udp 就写udp，这里就用tcp了， -s就是 来源的意思，
ip来源于 192.168.1.2 ，-j 怎么做 我们拒绝它 这里应该是 DROP



# 常用文件位置

/etc/php.ini

/etc/php-fpm.conf

/etc/php-fpm.d/www.conf



查找 php.ini 位置

~~~
 php --ini
~~~



# PHP 优化

Forece.net

www.conf

~~~
# Pure 配置
pm.max_children = 30
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 20
;pm.process_idle_timeout = 10s;
;pm.max_requests = 500

~~~



~~~
# 优化配置
pm.max_children = 40
pm.start_servers = 15
pm.min_spare_servers = 15
pm.max_spare_servers = 25
request_terminate_timeout = 300
~~~



An example: if our cloud server has 4 GB RAM and a MariaDB database service is running as well that consumes at least 1 GB our best aim is to get 4 - 1 - 0,5 (marge) GB = 2,5 GB RAM or 2560 Mb.

**pm.max_children** brings us to 2560 Mb / 60 Mb = **42** max_children



还有一个 emergency 选项 php-fpm.conf



/etc/nginx.conf

/etc/nginx/conf.d/www.forece.net.conf





1.**[PHP](https://towait.com/all/php/)的执行超时时间**，以[CentOS](https://towait.com/all/centos/)7为例，文件位于 `/etc/php.ini`

找到`max_execution_time`，将这个值改大一点

```
max_execution_time = 300
```



2.**[Nginx](https://towait.com/all/nginx/)的读取超时时间**，这个默认参数好像是没有的，需要我们在对应的`.conf`文件中添加：

参数内容位于`location ~ .php$ { }`区域内，或者直接找到`include fastcgi_params; `在下面加上这一行

```
fastcgi_read_timeout 300;
```

\#3.**Option**: 我修改了以上两个参数就解决了问题，但是有网友也有修改了`PHP-FPM`的`request_terminate_timeout`参数，文件位于 `/etc/php-fpm.d/www.conf`

找到`request_terminate_timeout`参数,修改为

```
request_terminate_timeout = 300
```





```
	fastcgi_connect_timeout 60;
	fastcgi_read_timeout 300;
	fastcgi_send_timeout 300;
```



fastcgi_buffers由 4 64k 改为 2 256k；

fastcgi_buffer_size 由 64k 改为 128K；

fastcgi_busy_buffers_size 由 128K 改为 256K；

fastcgi_temp_file_write_size 由 128K 改为 256K。





限制 IP 访问

~~~
		# Protected Files
		
		location ~ ^/(wp-admin|wp-login\.php) {
			allow 1.2.3.4;
			deny all;
		}
 
~~~



重定向

~~~
		location = /wp-login.php {
			redirect ^ http://mirrors.aliyun.com/centos/7.6.1810/isos/x86_64/CentOS-7-x86_64-DVD-1810.iso permanent;
		}
		
		location = /xmlrpc.php {
			redirect ^ http://mirrors.aliyun.com/centos/7.6.1810/isos/x86_64/CentOS-7-x86_64-DVD-1810.iso permanent;
		}
~~~



# Linux 安全优化

首先获取 root 权限，有些 VPS 或服务器没有开启 root 用户，如果登录的账号不是 root 用户，可以使用 `passwd root` 给 root 用户设置新密码



## 1. 添加用户

~~~shell
# 添加 user001 用户
useradd user001
# 修改 user001 密码
passwd user001
~~~



## 2. 切换用户

设置完 root 密码后，我们需要切换到 root 权限来完成一些初始化安全工作，切换到 root 用户命令：

~~~
sudo su -
~~~



root 用户切换到 user001

~~~
sudo su user001
~~~

> -f 免密码



## 3. 禁用 root

当初始化配置完成后，之后的运营一般不建议使用 root 用户，直接禁用 root 用户，并且创建对应用户，修改以下文件禁用 root 用户登录

~~~
vi /etc/ssh/sshd_config
~~~



找到如下配置信息

~~~
# Authentication: 
LoginGraceTime 120
PermitRootLogin yes 
StrictModes yes
~~~

> 将 PermitRootLogin 修改为 no



重启 sshd

~~~
systemctl restart sshd
~~~



## 4. 升级系统

获取 Linux 包列表

~~~shell
yum update
~~~



## 5. 更改 SSH 端口号

SSH 默认端口号是 22，默认端口号经常会遭到自动扫描，所以建议修改为不常用的端口号，更改文件

~~~
vi /etc/ssh/sshd_config
~~~



修改 Port 端口为自己需要的端口号

~~~
# What ports, IPs and protocols we listen for
Port 22
Port 52369
~~~

> 为了不与其他端口号冲突，建议使用 49152 到 65535 之间的端口，这里暂时保留 22，以防止修改后无法连接的情况出现



保存并退出文件，ESC + `:wq!`



默认情况下，SELinux 只允许端口 22 用于 SSH，现在需要做的是通过 SELinux 启用新创建的端口。执行以下命令：

~~~
semanage port -a -t ssh_port_t -p tcp 52369
~~~



查看是否打开 52369 SSH 端口

~~~
semanage port -l | grep ssh
~~~

> 此时会显示 55369 和 22 端口
>
> 注：不要妄图想使用semanage 工具删除22端口，删不掉的，留着吧，用防火墙禁了就好



重启 sshd 服务

~~~
systemctl restart sshd
~~~

> 如果不成功，用 `reboot` 命令重启 VPS



如有开启服务器防火墙的，即需要添加新端口到防火墙中

~~~
sudo firewall-cmd --permanent --zone=public --add-port=13140/tcp
~~~



禁用 22 端口

~~~
sudo firewall-cmd --permanent --zone=public --remove-port=22/tcp
~~~



重启防火墙

~~~
systemctl restart firewalld
~~~



查看防火墙运行状态

~~~
systemctl status firewalld
~~~



ref: https://izpan.com/article-206.html





## 6. 安装 fail2ban

ail2ban 可以监视你的系统日志，然后匹配日志的错误信息（正则式匹配）执行相应的屏蔽动作（一般情况下是调用防火墙屏蔽） 如:当有人在试探你的 HTTP、SSH、SMTP、FTP 密码，只要达到你预设的次数，fail2ban 就会调用防火墙屏蔽这个 IP，而且可以发送 e-mail 通知系统管理员，是一款很实用、很强大的软件！



## 7. 设置 swap 分区

当系统的物理内存不够用的时候，就需要将物理内存中的一部分空间释放出来，以供当前运行的程序使用。其实说白了SWAP就是LINUX下的虚拟内存分区



查看是否已经有 swap 分区

~~~
swapon -s
~~~

> 如果返回的信息概要是空的，则表示 Swap 文件不存在。



检查文件系统

~~~
df -hal
~~~

> 检查返回的信息，还剩余足够的硬盘空间即可。



增加swap交换文件，swap分区一般为内存的2倍，但最大不超过2G，超过4G内存，swap 文件 = 内存大小

~~~
dd if=/dev/zero of=/home/swap bs=1024 count=1024000
~~~

> 这样就建立一个/home/swap的分区文件，大小为1G。
>
> 这里要解释一下bs和count，bs为每个块的大小（byte），count为块数，交换文件的总大小就是bs*count



制作为swap格式文件

~~~
mkswap /home/swap
~~~



再用swapon命令把这个文件分区挂载swap分区

~~~
/sbin/swapon /home/swap
~~~



查看 swap 分区

~~~
free -m
~~~



添加挂载脚本（重新后不丢失 swap 分区），修改 /etc/fstab 文件，最后一行添加

~~~
/home/swap swap swap default 0 0
~~~



如果需要删除swap交换文件，先停止swap分区

~~~
/sbin/swapoff /home/swap
~~~



删除swap分区文件

~~~
rm -rf /home/swap
~~~



删除自动挂载配置命令

~~~
vi /etc/fstab
~~~

> 删除之前添加的 swap 挂载脚本











# LNMP 配置

## 1. Oneinstack

安装依赖

~~~
yum -y install wget screen
~~~



自动安装脚本

https://oneinstack.com/auto/



手动安装

~~~shell
# 下载安装包
wget http://mirrors.linuxeye.com/oneinstack-full.tar.gz

# 解压
tar xzf oneinstack-full.tar.gz

# 进入目录
cd oneinstack

# 如果需要修改目录(安装、数据存储、Nginx日志)，请修改options.conf文件

screen -S oneinstack
./install.sh
~~~



其他 shell

~~~shell
# 安装
./install.sh

# 卸载
.//uninstall.sh

# 安装其他组件（Python）
./addons.sh

# 优化
./optimize.sh

# 添加虚拟主机
./vhost.sh

# 删除虚拟主机
./vhost.sh --del

# 升级
./upgrade.sh

# 备份
./backup_setup.sh

# FTP 账号管理
./pureftpd_vhost.sh
~~~



目录位置：

~~~
# set the default install path, you can freely specify
nginx_install_dir=/usr/local/nginx
apache_install_dir=/usr/local/apache
mysql_install_dir=/usr/local/mysql
mongo_install_dir=/usr/local/mongodb
php_install_dir=/usr/local/php
node_install_dir=/usr/local/node

# database data storage directory, you can freely specify
mysql_data_dir=/data/mysql
mariadb_data_dir=/data/mariadb
percona_data_dir=/data/percona
pgsql_data_dir=/data/pgsql
mongo_data_dir=/data/mongodb

# conf files
/etc/my.conf

# web directory, you can customize
wwwroot_dir=/data/wwwroot

# nginx Generate a log storage directory, you can freely specify.
wwwlogs_dir=/data/wwwlogs
~~~





## 2. SSL 配置

~~~
sudo yum install epel-release
sudo yum install certbot-nginx
~~~



检查一下防火墙是否开放了 80、443 端口

If you have a **firewalld** firewall running, you can open these ports by typing:

```bash
sudo firewall-cmd --add-service=http
sudo firewall-cmd --add-service=https
sudo firewall-cmd --runtime-to-permanent
```

 

If have an **iptables** firewall running, the commands you need to run are highly dependent on your current rule set. For a basic rule set, you can add HTTP and HTTPS access by typing:

```bash
sudo iptables -I INPUT -p tcp -m tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT -p tcp -m tcp --dport 443 -j ACCEPT
```

 

配置 SSL

~~~
sudo certbot --nginx -d example.com -d www.example.com
~~~



- 生成证书；
- 部署证书到Nginx站点；
- 修改Nginx站点配置，将HTTP请求重定向为HTTPS请求；
- HTTPS相关配置；



重新加载Nginx配置：

~~~
sudo systemctl reload nginx
~~~



自动 renew

~~~
sudo crontab -e
~~~



~~~
. . .
15 3 * * * /usr/bin/certbot renew --quiet
~~~

> The `15 3 * * *` part of this line means “run the following command at 3:15 am, every day”. You may choose any time.





## 配置WAF防火墙

这里使用`Github`很火的一个基于`ngx_lua`的`WAF`防火墙脚本来防`CC`攻击和拦截`Url`关键词等。其功能如下：

- 防止`sql`注入，本地包含，部分溢出，`fuzzing`测试，`xss`，`55RF`等`web`攻击。
- 防止`svn`/备份之类文件泄漏。
- 防止`ApacheBench`之类压力测试工具的攻击。
- 屏蔽常见的扫描黑客工具，扫描器。
- 屏蔽异常的网络请求。
- 屏蔽图片附件类目录`php`执行权限。
- 防止`webshell`上传。

`Github`地址：https://github.com/loveshell/ngx_lua_waf。



# 导入数据库

进入控制台，并设置字符集

~~~
mysql -u mysql_dbuser -p --default-character-set=utf8
mysql -u mysql_dbuser -p --default-character-set=gbk
~~~



导入

~~~
# 选择数据库
use mysql_dbname;

# 查看字符集
status

# 切换字符集
charset utf8mb4

# 导入文件
source e:\bak.sql
~~~



注意 my.cnf 或 my.ini 设置

~~~
max_allowed_packet = 256M
net_buffer_length = 256K
~~~



# Discuz GBK 转 UTF8

## 1. 数据库转换

- 关闭所有插件、使用默认模板
- 导出数据库并修改 charset=gbk 为 charset=utf8
- 重新安装 UTF8 版本 discuz
- 删除数据库，导入旧数据库



## 2. 模板转换

- 将模板转换为UTF8版本



## 3. 丢失信息

- 积分设置丢失（照旧版补全）
- 个人信息丢失

修改 pre_common_setting 中 profilegroup 字段

~~~
a:5:{s:4:"base";a:4:{s:9:"available";i:1;s:12:"displayorder";i:0;s:5:"title";s:12:"基本资料";s:5:"field";a:17:{s:8:"realname";s:8:"realname";s:6:"gender";s:6:"gender";s:8:"birthday";s:8:"birthday";s:9:"birthcity";s:9:"birthcity";s:10:"residecity";s:10:"residecity";s:10:"residedist";s:10:"residedist";s:15:"affectivestatus";s:15:"affectivestatus";s:10:"lookingfor";s:10:"lookingfor";s:9:"bloodtype";s:9:"bloodtype";s:6:"field1";s:6:"field1";s:6:"field2";s:6:"field2";s:6:"field3";s:6:"field3";s:6:"field4";s:6:"field4";s:6:"field5";s:6:"field5";s:6:"field6";s:6:"field6";s:6:"field7";s:6:"field7";s:6:"field8";s:6:"field8";}}s:7:"contact";a:4:{s:5:"title";s:12:"联系方式";s:9:"available";s:1:"1";s:12:"displayorder";s:1:"1";s:5:"field";a:7:{s:9:"telephone";s:9:"telephone";s:6:"mobile";s:6:"mobile";s:3:"icq";s:3:"icq";s:2:"qq";s:2:"qq";s:5:"yahoo";s:5:"yahoo";s:3:"msn";s:3:"msn";s:6:"taobao";s:6:"taobao";}}s:3:"edu";a:4:{s:9:"available";i:1;s:12:"displayorder";i:2;s:5:"title";s:12:"教育情况";s:5:"field";a:2:{s:14:"graduateschool";s:14:"graduateschool";s:9:"education";s:9:"education";}}s:4:"work";a:4:{s:9:"available";i:1;s:12:"displayorder";i:3;s:5:"title";s:12:"工作情况";s:5:"field";a:4:{s:10:"occupation";s:10:"occupation";s:7:"company";s:7:"company";s:8:"position";s:8:"position";s:7:"revenue";s:7:"revenue";}}s:4:"info";a:4:{s:5:"title";s:12:"个人信息";s:9:"available";s:1:"1";s:12:"displayorder";s:1:"4";s:5:"field";a:10:{s:10:"idcardtype";s:10:"idcardtype";s:6:"idcard";s:6:"idcard";s:7:"address";s:7:"address";s:7:"zipcode";s:7:"zipcode";s:4:"site";s:4:"site";s:3:"bio";s:3:"bio";s:8:"interest";s:8:"interest";s:7:"sightml";s:7:"sightml";s:12:"customstatus";s:12:"customstatus";s:10:"timeoffset";s:10:"timeoffset";}}}');
~~~



## 4. 插件

- 将插件转换为UTF8版本



### 4.1 vip 插件

- /source/plugin/dsu_kkvip
- /vip.php



### 4.2 paypal 插件

- /imgs

- /img



## 5. 其他文件

