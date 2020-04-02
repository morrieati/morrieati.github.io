---
title: 新版微助教Hack指南😂
date: 2016-12-15 20:31:13
author: Morris Liu

---

# 新版微助教Hack指南😂

昨天弄的微助教自动签到竟然是老版本的！😱

组原老师的微助教竟然是新版本的！😱

幸亏我机智地及时用手机微信签了到👏

然后稍微改了一下代码适配了新版微助教～

<!-- more -->

看下代码

``` javascript
#!/usr/bin/env node
var request = require('request').defaults({ jar: true });

function checkin() {
	request.post({
		url: 'https://www.teachermate.com.cn/wechat-api/v1/class-attendance/student-sign-in',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_4 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12H143 MicroMessenger/6.2.3 NetType/WIFI Language/zh_CN',
			'Cookie': 'wx_csrf_cookie='
		},
		form: {
			'openid': 'oXygDt6XNpPI3MvVinBt7rRlrdTs',
			'course_id': '3850', // Zuyuan
			'lon': '0',
			'lat': '0',
			'wx_csrf_name': ''
		}
	},
		(error, response, body) => {
			if (!error && response.statusCode == 200) {
				console.log(body + " and you got " + JSON.parse(body).data.sign_rank + " place");
				return;
			} else {
				console.log(body);
				checkin();
			}
		}
	);
}

checkin();

```

记得把 openid 改成你自己的就好了
