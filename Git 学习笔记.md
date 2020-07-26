# Github 同步

先把 Github 同步写一下，因为用的比较多，后边再写 Git 原理



## 1. 同步远程到本地

### 1.1 本地空仓库连接远程

此方法一般适用于本地文件为空，需要将远程项目下载到本地，进行本地操作。



1. 右键 Git Bash，然后创建一个文件夹

2. 设置用户名和密码

   ```
   git config --global user.name "用户名"
   git config --global user.email "用户邮箱"
   ```

3. 克隆远程仓库到本地

    ```
    git clone gitlink
    ```



### 1.2 本地仓库连接 Github

一般适用于项目在本机创建，初始化 Github 项目时的操作。即项目文件在本地已经创建完毕，Github 为空仓库的时候，需要将项目推送到 Github 进行远程仓库初始化。



1. 初始化本地仓库

   ```
   git init
   ```

2. 设置用户名和密码

   ```
   git config --global user.name "用户名"
   git config --global user.email "用户邮箱"
   ```

3. 连接 Github

   ```
   git remote add origin githublink
   ```

4. 查看是否连接

   ```
   git remote -v
   ```

   > 如果显示两条你的 Github 链接即为连接正常





## 2. 同步本地到远程

1. 将文件拷贝到Git目录

2. 添加文件到暂存区

   ```
   git add *
   ```

   ```
   git add .
   ```

   

3. 提交文件到本地仓库

   ```
   git commit -m "更新摘要"
   ```

4. 提交到远程仓库

   ```
   git push origin master
   ```







