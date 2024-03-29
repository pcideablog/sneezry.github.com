---
title: 位置飘摇不定的inline-block
tags:
  - ''
layout: post
---
在页面排版中，我们经常需要将一些块元素塞进一行里，但是块元素默认都是自己独占一行的，要让它们委屈共用一行需要做些额外的工作。总的来说，有两种方法可以实现这一目的：一个是为块元素添加`float`浮动属性，另一个是将块元素`display`显示属性改完`inline-block`。那么两个方法如何选择呢？我们来看一下W3C对`float`属性的解释：

> If you look in a typical magazine you’ll see images illustrating the articles, with the text flowing around them. The float property in CSS was created to allow this style of layout on web pages. Floating an image—or any other element for that matter—pushes it to one side and lets the text flow on the other side. Clearing a floated element means pushing it down, if necessary, to prevent it from appearing next to the float.

看到没有，W3C给出了一个典型的`float`应用场景：文字环绕图片混排。也就是说`float`的出现是为了解决图文混排的问题，所以并不是为了解决我们前面提到的将块级元素塞进一行的问题。也许您看到这里急了：能解决问题的方法就是好方法，那么教条干嘛？好，您说的对，能解决问题的方法就是好方法，但先等等，`float`用着真这么爽吗？请接着往下看，W3C的文档中还提到了一个clearing的问题，这是什么鬼？简单地讲，就是当使用图文混排时，默认情况下文字会一直环绕浮动元素排列，直到绕完为止，才会从页面左端继续排列。为了更生动地说明这一问题，我做了两个例子供大家查看。首先是没有clearing的情况：

![](https://dn-sneezry.qbox.me/float1.png)

从上面的例子可以看出，雷军老师的照片明显是为了搭配第一段对其生平介绍的文字，但是，紧随其后的《锤子手机——天生傲娇的工匠精神》这个标题很调皮地也来凑热闹了！这样还怎么玩，您倒是下去啊，这图不是给您准备的啊！可是浏览器也犯难了，臣妾做不到啊，说好的绕着排，这不还有位置吗……明白了吧，clearing就是为了解决这事的，在给后面那个`h1`标题标签添加了`clear: left`后，它就知趣地自己下去了：

![](https://dn-sneezry.qbox.me/float2.png)

不过这和我们前面提的问题有神马关系呢？有！有很大关系！您如果用`float`来实现块元素排在一行，默认情况后面的元素也会不明真相地跟着跑上来，就和前例中的`h1`标签一样。这也是很多同学不知道理由，但都明白要在浮动元素后面添加一个空的`clear: both`元素的原因。很多同学抱怨浏览器太傻，搞得浮动元素后必须加个`clear: both`才能正常工作，浏览器表示被冤枉大发了，您用错了方法知道伐！请求此刻浏览器的心理阴影面积。

说了这么多，博主就是在“处心积虑”地劝说正在看博客的您一定要用`inline-block`啊~您看人家名字都起得这么明显了，人家就是在告诉您，`inline-block`才是根正苗红的正确方法啊！

好了，前面讲清了`inline-block`的“正室”身份，下面就该开始批判他的坑了。

考虑如下的代码：

    <div style="display: inline-block; background: #ff7234; color: white;">北京</div>
    <div style="display: inline-block; background: #48bcff; color: white;">广州</div>

我们心中想象的样子是这样的：

![](https://dn-sneezry.qbox.me/float3.png)

可是！可是！可是实际的情况是这样的：

![](https://dn-sneezry.qbox.me/float4.png)

这特喵的中间那个缝是几个意思啊！嗯，您仔细看看上面的代码，北京和广州两个元素之间是不是有个换行符……对，没错，中间那个缝就是那个傲娇的换行符，人家也要求有身份地位的，作为一个换行符也是有尊严的！我相信此刻您的内心是崩溃的，这尼玛还怎么玩，难道要把所有元素都写在一行？！不用，为了避免给您本就几近崩溃的内心再来一次打击，我先给您吃个定心丸。于是您满眼期待地望着我：怎么搞？

其实您可以这么搞：

    <div style="display: inline-block; background: #ff7234; color: white;">北京</div><
    div style="display: inline-block; background: #48bcff; color: white;">广州</div>

啥？把下个元素标签的左括号丢到上一行去？嗯，没错，浏览器他会自己处理好的（浏览器：你大爷）。您可能又不高兴了：玩呢！爷是处女座的！噢噢，这种写法好像确实会给处女座同学造成更大的伤害……或者要不您这么改？

    <div style="display: inline-block; background: #ff7234; color: white;">北京</div><!--
    --><div style="display: inline-block; background: #48bcff; color: white;">广州</div>

您看，是不是好点，咱机智地把换行符注释掉了！（处女座：这特喵的也没好哪里去吧！）

好吧，既然您是一个傲娇，啊不，是严谨的处女座，还有一个终极大招供您使用：将父系元素字号改成0：

    <div style="font-size: 0">
      <div style="display: inline-block; background: #ff7234; color: white;">北京</div>
      <div style="display: inline-block; background: #48bcff; color: white;">广州</div>
    </div>

等等！客官莫急！这样测试就是啥都没了！为啥？因为您把父系元素字号改成0了，子元素默认继承啊，您得再重新挨个指定子元素的字号。嫌麻烦？不，您是处女座的，为了洁癖这样的付出是值得的！

    <div style="font-size: 0">
      <div style="font-size: 16px; display: inline-block; background: #ff7234; color: white;">北京</div>
      <div style="font-size: 16px; display: inline-block; background: #48bcff; color: white;">广州</div>
    </div>

您看，是不是这样就好了？或许您在我沉浸在完美解决问题的自我陶醉中突然醒悟：你特喵的逗我，webkit内核的浏览器限制最小字号是12px，哪来的0啊！您别着急质疑，试试就知道了 ;-)

至此，第一个坑解决完毕（啥？还有别的坑？对！）。

接下来就是诡异的垂直位置问题，话不多说，请看例子：


    北京：<div style="display: inline-block; background: #ff7234; width: 200px; height: 20px;"></div>

显示的结果如下：

![](https://dn-sneezry.qbox.me/float5.png)

这里在“北京”的右侧放了一个橙色的统计条，这个统计条也许代表北京一年当中雾霾的天数，也许代表北京需要加班的程序员所占的比例等等，具体代表什么我们不关心，我们关心的是，默认情况下这个统计条在垂直方向是怎么对齐的？最起码现在看上去和“北京”二字的位置很不协调。

其实`inline-block`元素在垂直位置上是与父系元素的基线（baseline）对齐的。啥？基线是啥？怎么程序员们起名字都这么基情？别……别误会，这里的基线和基情没有半毛钱关系。基线指的是文字的基线，想必大家小时候学英文的时候都用过英文的4线本，然后我们工工整整地将字母按照要求写进那四条线相应的位置上，不严谨地说，4线本中，第3条线就是基线——除了y、g等不老实的字母，大部分字母都在这条线的上面。

那么在HTML中，这个基线由什么决定呢？线高（`line-height`）。咦？这个属性我们不经常手动指定啊，所以没指定的时候怎么办呢？线高如果不指定，会使用默认值，这个默认值是`1em`，即一个字的高度，而字的高度和`font-size`有关，如果`font-size`也没指定，就会使用浏览器的默认值，通常这个默认值是`16px`。好了，现在我们明白了，`inline-block`元素在垂直方向上会把自己的基线与父系元素的基线对齐。

但是在上面的例子中我们并不关心基线啊，我们想把右侧的统计条居中，居中，只想居中！好吧，看来我们不得不研究下一个新的东西了：`vertical-align`。您眼中闪烁着希望的泪光：这个看起来好熟悉啊，我用过`text-align`，相当好用啊！您……您别高兴得这么早，来看看伟大的`vertical-align`都支持哪些值：

> Values:  baseline | sub | super | top | text-top | middle | bottom | text-bottom | &lt;percentage&gt; | &lt;length&gt; | inherit

我此刻仿佛听到了您心中千万匹草泥马奔驰而过的声音。是，太多了，所以我体贴地为您做了下面这幅图：

![](https://dn-sneezry.qbox.me/baseline.png)

好像还是有些乱，不过已经好多了，对吧。您似乎看到了一个叫`middle`的值就不想再听我磨叽了，您能改改这个心急的毛病吗，坑多着呢，您不要图样图森破啊，`middle`不是那么随便用的，您老老实实往下看。

`middle`这个值很复杂，不是我危言耸听，复杂到下面我们先不讨论它，而是放在最后说。那么除了`middle`外，基本分为三个类型的定位：基线对齐型、顶部对齐型和底部对齐型。其中基线对齐型的属性值有`baseline`、`sub`和`super`，`baseline`是默认值，我们在前面已经讨论过了，`sub`是将元素的基线与父系元素的角标基线位置对齐，`super`是将元素的基线与父系元素的上标基线位置对齐。顶部对齐型的属性值有`top`和`text-top`，分别是将元素的顶部与父系元素的顶部对齐，将元素的顶部与父系元素的内容区域顶部对齐。底部对齐型的属性值有`bottom`和`text-bottom`，分别是将元素的底部与父系元素的底部对齐，将元素的底部与父系元素的内容区域底部对齐。

需要注意的有两点，一个是不同类型的值，在对齐时使用的元素参照位置也不同（分别用元素的基线、顶部和底部做对齐参照），第二个是默认情况下，一般`top`与`text-top`、`bottom`与`text-bottom`位置是一样的，但如果元素的内边距（`padding`）不为0，它们就不一样了。

好了，下面我们来静下心来说说`middle`这个值。看看w3school上面的解释：把此元素放置在父元素的中部。呵呵，您真是毁人不倦啊。不信？来来，看看[这个例子](http://jsfiddle.net/mLSG2/) ，您看那个斜体的“Italic”，它就有`middle`这个属性值，您看它是在中部吗？

既然不是简简单单地放在中部，那么到底是怎么放的呢？W3C才永远是权威的，所以毫不犹豫地翻W3C文档，W3C是这么解释`middle`的定位方式的：

> Align the vertical midpoint of the box with the baseline of the parent box plus half the x-height of the parent.

将元素的垂直中点，与父系元素的基线加上x-height的一半对齐。这个x-height是神马？我相信您到现在不止崩溃一次了，x-height简单地说就是当前样式下小写字母x的粗略高度。注意！注意！这个值已经明确到某个字母的粗略高度了，所以它不仅仅和字号相关了，还和字体相关！所以说，`middle`的定位，在不同的字体下都是不同的！您还想用吗？

问题说明白了，但是前面抛出来的问题不解释一下就是耍流氓对不。所以[前面的例子](http://jsfiddle.net/mLSG2/)到底是咋回事啊？您看，那个“Bold”有一个很大的字号，`5em`，但是它这么大的字号和它的父系`div`标签有关系吗？没有！半毛钱关系都没有！而它的父系元素没有指定字号，所以通常来说是`16px`，基线的位置也是以`16px`来定的。那么父系的x-height怎么算呢？实话说，没法算，不同系统默认字体不同，好吧，我们就认为小写的x高度差不多是一半字高吧，就是`8px`，然后根据定义，可怜的“Italic”的中线应该与父系元素基线加上x-height的一半对齐，就是`8px`的一半，`4px`。所以，“Italic”的中线就应该在父系元素基线上面4像素的位置上。嗯，结果与我们的分析完美匹配。

那么分析也分析了，打击也打击过了，问题总得解决啊，那个讨厌的统计条到底怎么放到中间啊？首先我们可以肯定地把默认值`baseline`换掉，因为我们并不关心统计条和基线的关系，那么和基线相关的属性值有`baseline`、`sub`、`super`，以及很遗憾根据上面分析确定的`middle`，这些都不能用。其实还有我们没有提到的`<length>`和`<percentage>`也是根据基线调整偏移的，所以也不能用。

我们关心的是统计条与文字边缘的位置关系，所以根据您的喜好可以选择`text-top`或者`text-bottom`，比如我选择了`text-top`，那么根据上面的代码，可以知道字高默认`16px`，统计条高`20px`，统计条比文字高了4像素，应该再上移2像素做到中心对齐，此时我们可以配合`position: relative`对定位进行调整，所以最后的代码为：

    北京：<div style="display: inline-block; background: #ff7234; width: 200px; height: 20px; vertical-align: text-top; position: relative; top: -2px"></div>

最后的显示结果为：

![](https://dn-sneezry.qbox.me/float6.png)

这个调皮的`inline-block`终于呆在了它应该呆的位置上，真是傲娇啊……咦？前面的图里好像不小心把天生骄傲的锤子说成了天生傲娇……是不小心的啦~