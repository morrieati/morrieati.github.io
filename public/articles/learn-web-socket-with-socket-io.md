---
title: Node.js WebSocket学习：基于Socket.io
date: 2016-08-09 12:10:30
author: Morris Liu

---

# WebSocket

简单来说，WebSocket 是从 HTML5 开始确定下来的支持浏览器到服务器长连接到一种技术。以前人们想做这种需要长连接到应用，比如基于 Web 页面的聊天啊之类，的时候，一般会用轮询技术或者 Flash。

今天早上我考虑这个问题的时候，也是想出来用轮询的方法解决咯。但是用屁股想也知道，这样对资源的消耗太大了，比如有时候服务器上的内容并没有更新，但是浏览器还是会隔一段时间去请求一次，这就会产生很多没有意义的请求，但是服务器还要去响应它。。。所以总而言之是很浪费资源啦。

不过后来，有人和我说，啊，HTML5 出来之后大家一般是用 WebSocket 来解决这个问题的。然后我才知道原来是自己孤陋寡闻了😄。那下面我们就开始看看 WebSocket 这个协议到底是个什么东西！

<!-- more -->

## WebSocket请求

首先，我们先看下它的 request 是什么样子的好了，下面这段据说是从 Wikipeida 上找的

``` bash
// Wikipedia
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
Origin: http://example.com
```

其实这段 request 和 HTTP 的还是蛮像的，格式都一样，就是多了几个参数。

``` bash
Upgrade: websocket
Connection: Upgrade
```

上面这两个参数就是告诉服务器我发起的是 WebSocket 请求啦，要求那边用 WebSocket 相关的服务来响应。

然后下面的三个参数里面，`Protocol` 那个是可选的，告诉服务器那边我的浏览器支持什么样的协议，让它用可以用的来处理。`Key` 这个参数是个 base64 编码的串，用来要求服务端返回对应的应答的，后面说响应的时候会说到。`Version` 这个参数就是有些历史遗留问题了，以前协议还没定下来的时候，大家都用自己的，各种版本很乱，后来协议定下来了，然后就要求统一用 13 这个版本了，也就是说，现在的 WebSocket 请求的这个参数一般来说必须是 13

``` bash
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
```

## WebSocket响应

接收到浏览器的请求之后，服务器就会返回一个响应，就是下面类似的这种东西

``` bash
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: HSmrc9sMlYUkAGmm50PpG2HaGWk=
Sec-WebSocket-Protocol: chat
```

这里就是已经成功切换协议啦。

`Upgrade` 和 `Connection` 和上面一样，用来确定我们用的协议是 WebSocket 而不是别的。后面那个 `Accept` 参数就是我们上面说过的 `Key` 对应的一个值，反正就是把 `Key` 经过各种运算的出来的，然后返回给浏览器那边，告诉他服务器这边确实接受了请求。要是没有这个参数的话，浏览器那边就会说 “Error during WebSocket handshake” ，然后就关闭连接了。

完成了上面的请求和响应之后，握手过程也就成功啦，WebSocket 连接就算成功建立起来了。下面就开始 Socket.io 啦。

# Socket.io

Socket.io 把 WebSocket 这套协议很好的封装起来，所以我们就不用自己去一步一步实现这么一个协议啦，果然开源社区就是厉害😄。

说到 Web 长链接的应用，最典型的就是聊天应用啦。所以我们今天这个例子就是一个聊天应用。

## 搭建基本框架

我们的聊天应用是基于 Node.js 的，然后为了比较方便些，就直接用 `express-generator` 把主框架搭起来啦

``` bash
$ express chatApp
$ cd chatApp
$ npm install
$ npm start
```

嗯。。一个简单的 Node.js 应用就这么搭好了。现在访问 http://localhost:3000 应该就有反应啦。

然后我们再把今天主要用到的 `socket.io` 这个中间件装好

``` bash
$ npm install socket.io --save
```

主要的框架就是这么多，下面我们来弄界面了。

## 聊天窗口界面

聊天窗口界面我就直接拿 Socket.io 官网的 Demo 啦😄，自己写好麻烦，要写漂亮些还要用 Bootstrap ，基于一切从简的原则所以就直接拿了官网 Demo。

``` html
<!doctype html>
<html>
  <head>
    <title>Socket.IO chat</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font: 13px Helvetica, Arial; }
      form { background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; }
      form input { border: 0; padding: 10px; width: 90%; margin-right: .5%; }
      form button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
      #messages { list-style-type: none; margin: 0; padding: 0; }
      #messages li { padding: 5px 10px; }
      #messages li:nth-child(odd) { background: #eee; }
    </style>
  </head>
  <body>
    <ul id="messages"></ul>
    <form action="">
      <input id="m" autocomplete="off" /><button>Send</button>
    </form>
  </body>
</html>
```

然后我们给表单加上 `submit` 事件

```javascript
$('form').submit(function(){
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  return false;
});
```

再给聊天界面加上接受来自服务器消息的功能

``` javascript
socket.on('chat message', function(msg){
  $('#messages').append($('<li>').text(msg));
});
```

最后给聊天界面加上 Socket.io 的支持

``` javascript
var socket = io();
```

最后整合起来看上去就是这样的

``` html
<!doctype html>
<html>
  <head>
    <title>Socket.IO chat</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font: 13px Helvetica, Arial; }
      form { background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; }
      form input { border: 0; padding: 10px; width: 90%; margin-right: .5%; }
      form button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
      #messages { list-style-type: none; margin: 0; padding: 0; }
      #messages li { padding: 5px 10px; }
      #messages li:nth-child(odd) { background: #eee; }
    </style>
  </head>
  <body>
    <ul id="messages"></ul>
    <form action="">
      <input id="m" autocomplete="off" /><button>Send</button>
    </form>
    
    <script src="/socket.io/socket.io.js"></script>
    <script src="http://code.jquery.com/jquery-1.11.1.js"></script>
    <script>
      var socket = io();
      $('form').submit(function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
      });
      socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
      });
    </script>
  </body>
</html>
```

这里面有关 socket.io 的部分就是第 27 行还有 31 行啦

``` javascript
socket.emit('chat message', $('#m').val());
socket.on('chat message', function(msg){ ... });
```

27 行表示的是把聊天输入框中的值以 “chat message” 这个我们自己命名的事件发送出去，这个 "chat message" 并没有什么特殊的地方，只是用来和服务器端的 socket.io 处理匹配一下的。

31 行表示的是如果从服务器接收到 “chat message” 这个事件的消息，就显示在页面上。

这样，我们的聊天界面就可以把聊天内容发送到服务器，并且从服务器接收消息啦！

## 服务器端 Socket.io

事实上，Socket.io 是分为一个服务器上处理 WebSocket 请求的一个 Server 和一个在浏览器的 `socket.io-client` ，这个 Client 刚过我们已经用过了，也就是 `socket.emit()` 那个函数。现在我们来看服务器端的 `socket.io` 。

### 添加 Socket.io 中间件

首先的首先，在写服务器端的其他功能之前，我们要把 Socket.io 的中间件加到我们的应用里面，要不然我们写了这么多函数都没法用啊

```javascript
var io = require('socket.io')(http);
```

### 用户连接

然后，当用户以 WebSocket 协议连接到服务器上的时候，我们应该有个提醒说，啊，有个用户登录了！嗯。。然后具体一点就是这样写

``` javascript
io.on('connection', function(socket){
  console.log('a user connected');
});
```

这一句就是监听 connection 事件，当有用户连接时就 log 下来。

然后咧，当用户下线时，我们也想知道他下线了，所以这时候我们就把刚刚的函数扩展一下

``` javascript
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
  console.log('user disconnected');
  });
});
```

### 发送聊天消息

最后，聊天应用最重要的事情就是把大家发的消息都显示在聊天窗口上，所以，我们下面要写服务器把消息发送到浏览器的功能。所以，经过扩展后我们的函数看起来就是这个样子了

``` javascript
io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
  socket.on('chat message', function (msg) {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});
```

第 6~9 行就是我们处理聊天消息的函数。第 7 行是把消息 log 到终端上，第 8 行是把消息发送到浏览器上。

嗯。。看起来差不多就是下面这样

``` javascript
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
	console.log('a user connected');
	socket.on('disconnect', function () {
		console.log('user disconnected');
	});
	socket.on('chat message', function (msg) {
		console.log('message: ' + msg);
		io.emit('chat message', msg);
	})
});

http.listen(3000, function(){
  console.log('listening on PORT');
});
```

不过这是简化版啦，`express-generator` 自动生成的很多代码我都没写。

这样，我们的聊天应用基本就完成啦，Demo 的话可以点右边三条横线去找我的 GitHub 上面下载。

就这样啦白白。
