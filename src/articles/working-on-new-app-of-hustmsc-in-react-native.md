---
title: 开始用React Native写俱乐部的手机APP啦
date: 2016-11-01 12:10:30
author: Morris Liu

---

# 开始用React Native写俱乐部的手机APP啦

## 前情提要

俱乐部终于又开始重新运作了呢，然后我就来负责管理一下全新的俱乐部 APP 的开发啦。

<!-- more -->

### 功能需求（持续更新）

- 登录功能，使用姓名／学号／邮箱／手机／whatever 登录
- 用户信息，显示用户状态、获得的荣誉、任务／工作进度等
- 问答功能
- 俱乐部内部通讯录功能（通讯录存在服务器上，APP 端显示）
- 待办事项（用于记录管理俱乐部相关的工作的进度）
- 发布公告（管理员）
- 向全体成员推送公告，并自动加入到待办事项中
- 待办事项临近截止日期时，提醒相对应的负责人准备提交工作结果
- 浏览俱乐部动态（包括微软学生俱乐部官方推送的消息）
- （待定）加入招新（入部申请）功能，非俱乐部成员使用此 APP 可以浏览俱乐部动态，但无法使用其他功能，可以在用户登录界面加入申请入部，当申请通过之后，则自动登录。

### 选择框架

这两天一直在调研，思来想去还是觉得 [React Native](http://reactnative.cn/) 比较靠谱，一个是因为团队里基本都是新人，搞 native app 开发的话工作量还是有点大的，用 JS 系的东西来入手相比较来说还是比较容易一些。再一个就是 React 的社区挺不错的，相比较于阿里的 [Weex](http://alibaba.github.io/weex/) 来说，插件很丰富，库也很丰富，而且很多坑都被前人踩过了，或多或少都有些解决方案，目前看到比较坑的就是那个长 [ListView](https://github.com/facebook/react-native/issues/499) 的问题，不过感觉也没啥，毕竟我们的 APP 里应该不会涉及到超长的 list 的吧，嗯。。即使有的话分页就好了。

然后阿里那个 Weex 咧，虽然和 [Vue.js](http://vuejs.org/) 挺接近的，而且尤大貌似加入了 Weex 团队？不过毕竟刚刚开源，而且看知乎上挺多人说坑有点多，主要是应对手淘的应用场景来搞的，普适性不强？嗯。。我也没亲自试试不过时间紧迫，所以就选择了 React Native 这套框架来构建我们的 APP 啦！

## 准备工作

先放上 [Getting Started](http://reactnative.cn/docs/0.36/getting-started.htm) 

首先装最新版的 [Node.js](http://nodejs.org/) 环境（以前就装过了）。然后看了下我的 JDK 版本好低，就去官网下了个新版本的，再装上 Android Studio 之后，按照 Guide 把 Android Studio 都配置好了。接下来安装 Android SDK 的时候一定要按照教程把所有要求勾选上的都勾上！

### 遇到的一些问题

1. 找不到 SDK

``` bash
A problem occurred evaluating project ':app'.
> SDK location not found. Define location with sdk.dir in the local.properties file or with an ANDROID_HOME environment variable.
```

解决方法：添加 SDK 路径到环境变量，然后重启 shell 或者执行 `source ~/.zshrc` 

2. 找不到设备

```bash
Execution failed for task ':app:installDebug'.
> com.android.builder.testing.api.DeviceException: No connected devices!
```

解决方法：打开一个虚拟机或者连上手机

3. 获取设备列表超时

```bash
Execution failed for task ':app:installDebug'.
> com.android.builder.testing.api.DeviceException: Timeout getting device list.
```

解决方法：在虚拟机中打开 WiFi 连接

### 成功运行 Demo

经过上述折腾，应该就可以成功运行 Demo 了，可以在这基础上写自己的应用啦

### 稍稍配置了一下开发环境

编辑器我用的 [VS Code](http://code.visualstudio.com/) ，装一个 `vsmobile.vscode-react-native` 就可以愉快的写了

然后还要搞个安卓模拟器，虽然也可以用手机，但是必须要连线，所以还是模拟器比较方便。然后模拟器我用的 Genymotion 个人版，还不错。只不过需要配置一下，把 SDK 改成你 Android Studio 安装的 SDK 的地址，不要用他自带的那个，然后虚拟机里面连上那个 WiFi ，这样基本就没啥问题了

## 开始编写

### 简单的几个 Demo

为了以后代码的模块化，我还是先从官方 Demo 的基础上进行了一些修改，主要就是写了几个自定义的模块，然后从主模块 `index.android.js` 里面调用一下

以下是我自己写的 `Picture` 模块，简单的封装了一下自带的 `Image` 模块

```javascript
import React, { Component } from 'react';
import {
    StyleSheet,
    Image
} from 'react-native';

export default class Picture extends Component {
    render() {
        return (
            <Image source={this.props.src} style={styles.images} />
        );
    }
}

const styles = StyleSheet.create({
    images: {
        width: 193,
        height: 110,
    },
});
```

然后从 `index.android.js` 里面引用要这样写

``` javascript
import Picture from './custom_modules/Picture'
```

嗯，这个自定义的模块是放在 `./custom_modules` 这个文件夹里的

嗯，这篇就这样结束啦。

To Be Continued...
