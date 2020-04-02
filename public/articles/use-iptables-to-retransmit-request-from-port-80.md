---
title: 使用端口转发解决Node.js监听80端口权限问题
date: 2016-09-06 12:10:30
author: Morris Liu

---

由于 Linux 权限问题，非 root 权限无法监听 < 1024 的端口，所以 Node.js 服务器需要端口转发，才可以收到来自 80 端口的请求

``` bash
$ sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000
$ sudo iptables-save
```

<!-- more -->
