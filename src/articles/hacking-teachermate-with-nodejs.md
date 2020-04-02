---
title: 用Node.js实现微助教自动签到
date: 2016-12-14 19:03:55
author: Morris Liu

---

# 用Node.js实现微助教自动签到

这学期组原课用微助教这个东西签到诶，然后昨天看到耶鲁大神 hack 了自动签到 [链接在这里](https://tao-h.github.io/2016/12/13/teacher-mater/) 然后我就想着也弄个每次签到就可以抢第一啦☝️😄

然后看了下他写的基本就是从 Chrome 开发者工具里把 cURL 脚本复制下来然后从 python 里面循环了，既然我用 node 写肯定不会这样啦，直接用 node 的 request 就好了（虽然直接复制过来挺方便的，不过在 request 里面写看的比较清楚）

<!-- more -->

## 那我们先看一下最终结果是什么样子！



<img src="https://raw.githubusercontent.com/realMorrisLiu/realMorrisLiu.github.io/images/demo.png" alt="demo" style="zoom: 25%;" />



## 准备工作

手机一部，电脑一台（一定要装了 Chrome 哟）

### 获取签到网页的 URL

众所周知。微信公众号里点开的链接都是网页啦，只不过微信浏览器把地址栏隐藏掉了而已，然后我们试着把这个链接搞出来。

嗯。。为什么要把这个链接搞出来呢？因为我们要在电脑上的 Chrome 里模拟签到。为什么要在电脑上呢？因为 Chrome 可以看我们签到过程中发送的各种 request 和收到的各种 response 啊，这样我们就知道发什么样的请求可以假装自己是在手机上签到啦！

<img src="https://raw.githubusercontent.com/realMorrisLiu/realMorrisLiu.github.io/images/share_link.png" alt="share_link" style="zoom:25%;" />

点签到之后在页面加载完成之前点一下右上角的三个点，再点一下那个 Copy URL 把这个页面的 URL 复制下来备用。

### 配置 Chrome 开发者模式模拟微信登陆

刚刚拿到的链接在 Chrome 中打开会发现这个页面只能用微信内置的浏览器访问

![access_deny](https://raw.githubusercontent.com/realMorrisLiu/realMorrisLiu.github.io/images/access_deny.png)

这时候，强大的 Chrome 就要出场了👏

打开 Chrome 的开发者工具

![developer_tool](https://raw.githubusercontent.com/realMorrisLiu/realMorrisLiu.github.io/images/developer_tool.png)

点一下 Settings，在 Devices 里面点 Add custom device

![emulate_wechat](https://raw.githubusercontent.com/realMorrisLiu/realMorrisLiu.github.io/images/emulate_wechat.png)

按照上图配置好之后保存就好了。

这个地方最重要的是 User-Agent ，网页就是通过这个来判断我们当前的访问是不是来自微信内置的浏览器。假装来自微信很简单，就是在 UA 里面加一个 `MicroMessenger` 字段，整段 UA 如下所示

`Mozilla/5.0 (iPhone; CPU iPhone OS 8_4 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12H143 MicroMessenger/6.2.3 NetType/WIFI Language/zh_CN`

## 在 Chrome 中模拟微信签到

经过刚才的准备工作，我们已经可以在 Chrome 中访问签到的页面了✌️

还是在刚才的开发者工具中，点一下开发者工具左上角的 Toggle Device Toolbar ，选择页面上方出现的工具栏中刚刚配置好的 MicroMessenger 这个 Device，如下图所示

![sign_in_page](https://raw.githubusercontent.com/realMorrisLiu/realMorrisLiu.github.io/images/sign_in_page.png)

## 分析页面请求

事实上，如果老师开了签到之后，我们打开这个页面就可以签上到了。经过分析发现，这个页面签到是通过一个 POST 请求完成的

![post_request](https://raw.githubusercontent.com/realMorrisLiu/realMorrisLiu.github.io/images/post_request.png)

经过我的几次尝试，发现请求中只有下面这几项是必须的

``` json
url: 'https://www.teachermate.com.cn/wechat/wechat/legacy/student/sign_in',
headers: {
  'Content-Type': 'application/x-www-form-urlencoded',
  'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_4 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12H143 MicroMessenger/6.2.3 NetType/WIFI Language/zh_CN',
  'Cookie': 'wx_csrf_cookie='
},
form: {
  'openid': 'oXYgDt6XNpaP3MvVinBt7rRlrdTs', // 用来标识用户身份
  'course_id': '7046', // 测试用课堂的 course_id
  'lon': '0', // 经度
  'lat': '0', // 纬度
  'wx_csrf_name': ''
}
```

其中 User-Agent 刚刚已经说过了，openid 是微信用户的标识符，course_id 是课堂的标识符，比如为了测试我开了一个课堂，course_id 就是 7046 。需要注意的是，这个 course_id 并不是加入课堂时填写的那个课堂的编号，要从我们之前获取的 URL 中提取。lon 和 lat 是用来确定用户地理位置的，当课堂签到没有开启地理位置检测的时候，这两个参数为 0 

## 使用 Node.js 实现签到

我们使用 Node.js 中的 request 模块来实现上述 POST 请求，首先使用 `npm install request --save` 安装此模块。

然后编写脚本的主要代码

``` javascript
var request = require('request').defaults({ jar: true });

function checkin() {
	request.post({
		url: 'https://www.teachermate.com.cn/wechat/wechat/legacy/student/sign_in',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_4 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12H143 MicroMessenger/6.2.3 NetType/WIFI Language/zh_CN',
			'Cookie': 'wx_csrf_cookie='
		},
		form: {
			'openid': 'oXYgDt6XNpaP3MvVinBt7rRlrdTs',
			'course_id': '7046', // Test
			'lon': '0',
			'lat': '0',
			'wx_csrf_name': ''
		}
	},
		(error, response, body) => {
			if (!error && response.statusCode == 200) {
				var msg = JSON.parse(body).msg;
				if (msg == "sign in success") {
					console.log(msg + " and you got " + JSON.parse(body).data.sign_rank + " place");
					return;
				} else {
					console.log(msg);
					checkin();
				}
			} else {
				console.log(response);
			}
		}
	);
}

checkin();

```

输入 `node teachermate.js` 测试，已经可以成功自动签到了

## 将 teachermate.js 作为终端程序使用

在代码的开头增加一行

``` bash
#!/usr/bin/env node
```

并且在 package.json 文件中添加 `bin` 指令，最终的 package.json 文件如下所示

``` json
{
  "name": "teachermate",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "start": "node teachermate.js"
  },
  "bin": {
    "checkin": "teachermate.js"
  },
  "dependencies": {
    "request": "^2.79.0"
  }
}
```

接下来，执行

``` shell
$ npm link 
```

如果你的 package.json 中，`bin` 指令和我一样为 `checkin` 的话（当然随便是什么都可以啦，只要不和系统已经有的命令冲突就可以），就可以直接在终端中执行

``` shell
$ checkin
```

这样，我们的脚本就会自动去检查课堂有没有开启签到，当检查到签到开启的时候，就自动签到成功了
