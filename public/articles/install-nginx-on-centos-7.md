---
title: 在CentOS 7上安装nginx
date: 2016-07-16 12:10:30
author: Morris Liu

---

首先要建立 `yum` 仓库的文件

``` bash
$ sudo vi /etc/yum.repos.d/nginx.repo
```

在打开的 `vi` 编辑器中输入以下内容

``` bash
[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/centos/$releasever/$basearch/
gpgcheck=0
enabled=1
```

保存更改，执行 `yum update` 更新源，再使用 `yum` 进行安装

``` bash
$ sudo yum install -y nginx
```

nginx 安装完毕

<!-- more -->
