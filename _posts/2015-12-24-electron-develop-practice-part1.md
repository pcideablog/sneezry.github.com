---
title: Electron开发实践I
tags: 'Electron, NodeJS, JavaScript, Angular'
categories: Programming
---
# Electron是什么

[Electron](http://electron.atom.io/)是一款利用Web技术开发跨平台桌面应用的框架，它的前身是Atom Shell。从它前身的名字可以看出，Electron的诞生，离不开[GitHub](https://github.com/)开源编辑器[Atom](https://atom.io/)的发布。

Electron和[NW.js](http://nwjs.io/)（前身是Node-Webkit）有很多相似的地方，两者都是利用NodeJS和Webkit渲染器解释JavaScript和渲染HTML，使Web技术应用于桌面应用，但两者又[有所不同](http://electron.atom.io/docs/v0.36.0/development/atom-shell-vs-node-webkit/)。Electron的工作方式更接近于Node.js运行环境（“Electron works more like the Node.js runtime”），而NW.js更像是将一系列网页打包起来运行在本地的网站。

# 有哪些应用是用Electron开发的

在Electron官方页面上罗列了数十款利用Electron开发的应用，其中比较知名的应用有[Atom](https://atom.io/)、[Slack](https://slack.com/)、[VSCode](https://code.visualstudio.com/)和[WordPress.com](https://desktop.wordpress.com/)等。

# 开始部署Electron开发环境

## 安装Node.js

Electron开发环境依赖于Node.js，所以需要先安装Node.js。[这里](https://docs.npmjs.com/getting-started/installing-node)有一篇指导文章可以帮助你在不同平台下安装Node.js已经npm包管理器。

Node.js安装完毕之后运行

    node -v
     
来查看安装是否成功，如果安装成功，你会看到node的版本号。网络上很多教程的截图中会显示版本号是0开头的，而你所安装的node很可能是4开头的，不必担心，由于历史问题，node从0这个大版本直接飞跃到了4这个大版本，你看到这个诡异的版本号并不是你做错了什么。

![node-v](https://dn-sneezry.qbox.me/JekyllWriter/node-v.png)如果你的网络环境比较复杂，无法正常使用npm包管理器（大陆的网络环境通常都比较复杂），可以使用淘宝提供的[npm镜像](http://npm.taobao.org/)，之后将所有`npm`指令都替换为`cnpm`指令即可。

## 安装Electron

运行

    npm install electron-prebuilt -g
     
如果提示权限错误，非Windows用户请运行

    sudo npm install electron-prebuilt -g
    
Windows用户可以通过管理员权限打开cmd后重新运行上述命令。其中`-g`代表全局安装，这也是可能导致权限问题的原因。

安装完毕后运行

    electron -v
    
检查是否安装成功。

![electron-v](https://dn-sneezry.qbox.me/JekyllWriter/electron-v.png)

# 运行Electron Quick Start

Electron官方给出了一个简单的示例程序，可以通过其发布在GitHub上的[Repo](https://github.com/atom/electron-quick-start)获取，对于没有安装Git的用户，可以直接点击Download ZIP获取文件，解压缩后，在终端中（Windows的命令行）进入到文件目录，然后运行

    electron .
    
如果一切顺利，就可以看到应用窗口了（注意上面的命令后有一个“.”）。

![electron-quick-start](https://dn-sneezry.qbox.me/JekyllWriter/electron-quick-start.png)