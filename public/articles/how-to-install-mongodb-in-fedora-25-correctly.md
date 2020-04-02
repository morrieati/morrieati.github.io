---
title: 在Fedora 25上安装MongoDB
date: 2016-12-21 00:14:27
author: Morris Liu

---

今天为了装个 MongoDB 可真是废了老大劲儿了！主要是！官网那个给 RHEL 安装的教程在我 Fedora 25 上根本没有任何卵用！！！什么鬼的官方文档哇！

然后咧，包管理里面也有个，然后咧，并不能用！

真是令人头大

幸亏最后找到一个大神在 Fedora 24 上安装的教程，最终还是装好了。
<!-- more -->

# 添加 mongodb 的源

``` shell
$ sudo nano /etc/yum.repos.d/mongodb.repo
```

然后在 mongodb.repo 里面，写上下面这些东西

``` plaintext
[mongodb]
name=MongoDB Repository
baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64/
gpgcheck=0
enabled=1
```

如果你是 32 位系统的话，把 x86_64 换成 i686 就好了！

# 安装 mongodb-org

``` shell
$ sudo dnf install mongodb-org
```

然后这个是完全安装，把一些工具啥的也都装上了，如果不想全要的话可以按照官网上的说明自己酌情选择安装哪几个包

# 启动 mongodb

如果你想开机自动就启动，把它当服务的话，那就开 service

``` shell
$ sudo systemctl enable mongod
```

如果你不想一直开着，而是随开随用，用完就关掉的话，可以下面二选一

``` shell
$ sudo mongod
// 或
$ sudo service mongod start
```

以上两种结束 mongod 的方法分别是 `Ctrl+C` 和 `sudo service mongod stop` 

没了
