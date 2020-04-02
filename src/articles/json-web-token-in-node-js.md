---
title: JSON Web Token in Node.js
date: 2016-08-02 12:10:30
author: Morris Liu

---

# JSON Web Token in Node.js

这段时间一直在弄 [Node.js](https://nodejs.org/en/) 的身份验证之类的，不知道为啥 session 的总是不成功诶，每次连接的 session 都不一样，然后 [Passport](http://passportjs.org/) 之类的也没怎么看，不过据说是很好用的，以后有空再看看。然后的然后因为老板说以后可能会出 Native 的 App 之类的，所以最终就选择了 [JWT](https://jwt.io/) 来做身份验证啦～

<!-- more -->

话说 [JWT](https://jwt.io/) 的库真是各种平台都有哇，而且都还蛮好用的，比如 [Node.js](https://nodejs.org/) 的 `jsonwebtoken` 就挺好的，名字就是这么直白😂

## 安装

``` bash
$ npm install jsonwebtoken
```

嗯。。一步就完了唉以后都不想说 node 包的安装了反正都是 `npm install` 之类的一句话顶多就是不确定名字的时候再加个查找。。

## JWT 的解析和验证

首先是写我们 token 的解析啦，嗯，就像下面这样

``` javascript
var express = require('express');
var jwt = require('jsonwebtoken');

exports.Parser = function (req, res, next) {
    // check header or url parameters or post parameters for token 
	//看这个我们就知道原来是可以有三种方法从前端提交 token 的哇，不过我用的时候只用了最后一个，也就是 post 请求的 parameters
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // 解析 token
    if (token) {
        // 用你自己的加密密钥来验证 token ，顺便还检查了 expires 嗯也就是 token 的有效期
        jwt.verify(token, '这里写你加密自己 token 的密钥', function (err, decoded) {
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token.'});
            } else {
                // 验证下来没错的话，就把我们解析的结果放到 req 里面这样的话别的代码就可以用啦。嗯，还有就是 decoded 这个变量是 jwt.verify 的回调函数的第二个参数，也就是解析完成的 token
                req.decoded = decoded;
                next();
            }
        });
        console.log("Token OK");
    } else {
        // if there is no token
        // return an error
        console.log("No token");
        // 这里我就是去渲染登录页面了
        res.render('login');
    }
}
```

注释比较清楚感觉，然后就不多解释了，有问题就在下面评论区问咯～

## 对路由进行身份限制

一般来讲的话，除了一些资源啊还有登录界面啊或者纯展示类的界面的话，我们都要限制访问的，这时候一般通过路由来限制

``` javascript
var express = require("express");
// 这个 token 就是刚刚写的那一段代码啦，我写的时候导出成了模块
var token = require('../util/shared/token');
var router = express.Router();

var xxxAPI = require("./xxx-api");

router.use("/", xxxAPI);
router.use(token.Parser); // 👈这句代码之后的都是要验证身份的！
router.use("/api/", xxxAPI);

module.exports = router;
```

这样写的话，比如我 `xxxAPI` 里面有一个

``` javascript
router.get('/', function (req, res) {
  	render('login');
});

router.post('/dashboard', function (req, res) {
  	res.json({
      	success: true,
      	xxx: xxx
  	});
});
```

然后访问 `http://xxx/` 的时候，就可以直接加载出登录界面啦。

并且在前端用 POST 请求 `/api/dashboard` 的时候，就会先验证用户是否已经登陆然后再响应一些有用的信息。

##  生成 token 然后给前端

``` javascript
jwt.sign("你要放到 token 里面的东西，一般就是 id 哇之类的", 'xingyunzh-secret', {expiresIn: expiresTime});
```

这个函数的返回值就是我们的 token 了

``` javascript
var token = jwt.sign(...);
```

然后就可以把这个 token 返回到前端了，一般我比较习惯用 `res.json()` 这个，因为可以返回一个 JSON 对象嘛，然后比较方便，内容也能写的比较丰富，比如

``` javascript
res.json({
	success: true,
  	token: token
});
```

这样就成功发给前端啦

## AJAX 发送携带 token 的请求

前端收到后台发过来的 token 之后，我们就要把它存起来，然后以后每次需要验证身份的时候就可以直接拿来加到请求里发出去啦

``` javascript
// 这里假设后台响应的结果就是 data
localStorage.setItem('token', data.body.token);
```

然后这样就存在浏览器的本地存储区里面了，我们再发请求的时候，可以这样写

``` javascript
$.ajax({
    url: '/api/dashboard',
    method: 'POST',
    headers: {'x-access-token': localStorage.getItem('token')}
}).done(function (data) {
    if (data.success) {
		// 验证成功的代码放在这里
    } else {
        // 验证失败的代码放在这里
    }
});
```

然后就大功告成了👌
