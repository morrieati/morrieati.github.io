---
title: 俱乐部APP启动页面
date: 2016-11-02 12:10:30
author: Morris Liu

---

今天先把俱乐部 APP 的启动页面写了，写的过程中还是踩了几个坑

<!-- more -->

# 开始写

首先，我们要先搞一个模块出来

``` javascript
import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    View,
} from 'react-native';

import Dimensions from 'Dimensions';

export default class LaunchScreen extends Component {
    render() {
        return (
            <View></View>
        );
    }
}

const styles = StyleSheet.create({
    
});
```

模块的框架写好啦，然后我们要搞布局

布局的话，肯定要先写个 `<View></View>` 出来吧，然后启动界面也就是几张图片了，主要就是加载图片的问题

# Flexbox 布局

Flexbox 布局真的好强大哇，而且在 React Native 中支持的很好，所以我就用了。。

写两个 `<View></View>` 分别用来放 Logo 和 Footer

``` javascript
<View style={styles.flexContainer}>
	<View style={styles.logoArea}>
    <Image style={styles.logo}
           source={require('../../resource/Logo.png')}/>
    </View>
    <View style={styles.footerArea}>
    	<Image style={styles.footer}
        	   resizeMode='contain'
        	   source={require('../../resource/LaunchFooter.png')}/>
    </View>
</View>
```

这里其实是有个坑的，唉唉，我本来以为它自带的这个 `require('url')` 加载图片的方法很强大呢。。后来发现长和宽还是自己指定比较好，后来想了想可能加载图片的时候也许改一下图片的 PixelRatio 就可以了？我没试，等以后试了再写上。

布局的话，我就写了几个样式

``` javascript
    flexContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    logoArea: {
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    footerArea: {
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'flex-start'
    }
```

通过设置 `logoArea` 和 `footerArea` 的 `flex` 属性分别为 0.5，让这两部分平分主 `View` ，也就是 `flexContainer` 。因为设置了 `flexDirection` 属性为 `'column'` 所以这两块区域是纵向排列的。

# Background Image

嗯，这个界面其实还是有个背景图的，所以我在我们的 Container 外面加了个 Image，整个页面布局看起来就是下面这样的👇

``` javascript
<View>
    <Image
        style={styles.backgroundImage}
        source={require('../../resource/LaunchBackground.png')}>
        <View style={styles.flexContainer}>
            <View style={styles.logoArea}>
                <Image style={styles.logo}
                       source={require('../../resource/Logo.png')}/>
            </View>
            <View style={styles.footerArea}>
                <Image style={styles.footer}
                       resizeMode='contain'
                       source={require('../../resource/LaunchFooter.png')}/>
            </View>
        </View>
    </Image>
</View>
```

也许你已经看到了 `styles.backgroundImage` 这个样式了。。嗯，就是下面这样的

``` javascript
backgroundImage: {
	width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
},
```

也就是让我的背景图充满整个屏幕

# Logo 和 Footer

也是用 `<Image />` 来加载，上面已经写过怎么加载了，这儿只贴一下样式

``` javascript
logo: {
  	width: 128,
    height: 128,
},
footer: {
    width: Dimensions.get('window').width,
}
```

设置了 logo 的长和宽，然后 footer 的宽度和屏幕宽度相等，配合上 `resizeMode='contain'` 让高度自适应，而且在前面的 `footerArea` 里面，我们写过了 `justifyContent: 'flex-start'` ，这可以让我们的 footer 保持在页面底部

前面还有 `logoArea` 里面设置的 `alignItems: 'center', justifyContent: 'center'` 这一对儿属性，让我们的 logo 保持在 logoArea 的中心位置
