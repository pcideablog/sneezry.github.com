---
title: Electron开发实践II
layout: post
tags: 'Electron, NodeJS, JavaScript, Angular'
categories: Programming
---
在[上一篇博客](https://sneezry.com/2015/12/24/electron-develop-practice-part1/)中，我向大家介绍了Electron以及Electron开发环境的部署，在这篇博客中，我将向大家介绍简单Electron应用的开发过程。

# Electron程序的入口

程序入口往往是初学者在学习前的第一个疑问：这个程序是怎么跑起来的？由于Electron是Node的runtime，所以它的入口是在`package.json`中的`main`进行定义的。接触过Node的读者对此会非常熟悉，对于接触过Chrome程序开发的读者可以把`package.json`简单理解成`manifest.json`。无论是`package.json`还是`manifest.json`，它们都是一个程序信息的描述文件，里面声明了程序的名称、简介、版本等信息。

比如下面是一个简单的例子：

    {
        "name": "My Electron App",
        "version": "1.0.0",
        "main": "app.js"
    }

上例中定义了程序的名称为“My Electron App”，版本为“1.0.0”，入口脚本是“app.js”，这样当用户运行这个程序时，`app.js`就会被执行。

# 一个简单的Electron应用

接下来编写一个非常简单的程序，在`package.json`同目录下新建一个`app.js`文件，并写入以下内容：

    var fs = require('fs');

    fs.writeFileSync('message.txt',
        'This is my first Electron app!',
        'utf8');

对于没有接触过Node的读者可能对上面代码中出现的`require`感到陌生，这里的`require`和C语言的`include`或Java中的`import`类似，通过`require`，`app.js`将`fs`模块引入进来，并在后面调用了它的`writeFileSync`方法。

`fs`模块是Node中提供操作文件功能的模块，`writeFileSync`是`fs`模块提供同步写入文件的方法，上面的代码就是在当前目录下，将“This is my first Electron app!”以`utf-8`编码方式写入`message.txt`文件中。运行结果如下：

![my_first_electron_app](https://dn-sneezry.qbox.me/JekyllWriter/my_first_electron_app.png)

怎么样，是不是非常简单！

# 我们需要一个界面

如果仅仅创建一个在后台默默运行的应用，那么Electron的一半特性就被忽略了。既然Electron是一个桌面应用开发框架，那么就一定离不开界面。

Electron内置了WebKit渲染器，所以可以直接使用HTML编写程序的界面。在上一篇博客中提到的例子是包含了一个界面，这个界面也是由`app.js`创建的。

对上例的`app.js`进行修改：

    var app = require('app'),
        BrowserWindow = require('browser-window');

    app.on('ready', function() {
        mainWindow = new BrowserWindow({
            width: 400,
            height: 300
        });

        mainWindow.loadURL('file://' + __dirname + '/app.html');

        mainWindow.on('closed', function() {
            mainWindow = null;
        });
    });

新代码中引入了`app`和`browser-window`两个模块，这两个模块都是Electron提供的。`app.on`方法在整个程序生命周期中进行事件监听，`ready`事件在程序初始化完成之后触发。在上面的代码中，程序准备就绪之后，创建了一个`BrowserWindow`实例`mainWindow`，这个实例就是打开的窗口。在创建`BrowserWindow`实例时定义了窗口的尺寸，随后定义了窗口中需要加载的HTML文件位置。`__dirname`是Node中的一个常量，指向当前运行脚本所在的目录，所以`app.html`和`app.js`处于同一目录下。最后实例`mainWindow`通过监听`closed`事件进行自我销毁，即关闭窗口。

创建`app.html`写入以下内容：

    <!doctype html>
    <html>
    <head>
    <title>My First Electron App</title>
    <style type="text/css">
    body {
        margin: 0;
    }

    textarea {
        width: 100%;
        border: none;
        background: #eee;
        margin: 10px 0;
        padding: 0;
        outline: none;
    }
    </style>
    </head>
    <body>
    <textarea rows="10"></textarea>
    <button>Write</button>
    </body>
    </html>

这是一个非常简单的HTML文件，只包含一个文本框和一个按钮，`style`标签中是对页面上元素样式的简单描述。运行结果如下：

![my_first_electron_app_interface](https://dn-sneezry.qbox.me/JekyllWriter/my_first_electron_app_interface.png)

还是挺丑的对吧，毕竟只是个Demo嘛。

# 界面和逻辑的联系

上面的程序仅仅提供了一个无用的界面，无论怎么点击都不会有任何交互，所以需要把界面和程序功能联系在一起。

创建`main.js`并在`app.js`中通过`script`标签引入，将以下代码写入`main.js`：

    var fs = require('fs'),
        textarea = document.getElementsByTagName('textarea')[0],
        button = document.getElementsByTagName('button')[0];

    function writeFile() {
        var text = textarea.value;

        fs.writeFileSync('message.txt',
            text, 'utf8');
    }

    button.onclick = writeFile;

需要注意的一点是，在`app.html`中，`main.js`要在页面的最后引用，否则`main.js`中的`textarea`和`button`无法正确获取的元素。

是不是很神奇，居然可以在网页中调用Node模块！这就是Electron的魅力所在。最后的运行结果如下：

![my_first_electron_app_writefile](https://dn-sneezry.qbox.me/JekyllWriter/my_first_electron_app_writefile.png)