---
title: 理解mouseover和mouseout“不稳定”的原因
tags:
  - ''
layout: post
---
事情的起因是博主负责的项目需要一个精美的滑块供用户调整图片大小，当然HTML5有现成的`range`控件博主是清楚的，但如果前端攻城狮如果做起来都那么惬意怎么会成为濒危物种呢？没错，兼容性，我们要兼容性，作为一个有情怀公司的员工，我们不会像某付宝那样放弃1%的用户！不会！

那么多了不说，直接上博主第一版的代码（仅做实例使用，与博主所负责项目的真实代码与外观不同）：

<p data-height="192" data-theme-id="0" data-slug-hash="aOrOjZ" data-default-tab="result" data-user="Sneezry" class='codepen'>See the Pen <a href='http://codepen.io/Sneezry/pen/aOrOjZ/'>aOrOjZ</a> by Li Zhe (<a href='http://codepen.io/Sneezry'>@Sneezry</a>) on <a href='http://codepen.io'>CodePen</a>.</p>

是不是很难用！那个滑块根本不跟着鼠标走啊，十分地卡顿！这不是一个有情怀的公司应该做出来的东西！为了避免有些初入前端的同学看不太懂上面的代码，我来简单带着大家分析一下。HTML和CSS就不说了，我们直接来看看JS的逻辑。

首先滑块控制把手`scrollHandle`监听了`mousedown`事件，这样当用户鼠标在滑块上按下后就看着监视鼠标的活动情况。`mouseup`和`mouseout`事件都绑定在了更大的`scroll`元素是为了避免用户鼠标移动速度过快移出`scrollHandle`元素导致事件捕捉失败。

博主在写完代码之后感觉逻辑完美得无懈可击，甚至专门设计了一个区域更大的`scroll`元素来提高事件捕捉的可靠性，可是事实呢！事实让博主甚是崩溃啊！怎么回事！

为了确定问题所在，博主将监听事件的结果输出到控制台，结果发现，当用户鼠标移出`scrollHanlde`时，`scroll`的`mouseout`事件被触发了，但随后立刻又触发了`scroll`的`mouseover`事件！这让博主一度认为是浏览器的Bug——没事你在那`mouseout`、`mouseover`的干啥！但最后证明其实是博主术业不精，对此博主深表愧疚，所以博主事后将W3C上Level 3 DOM Events从头到尾看了一遍。

我相信，对DOM Events了解不够深入的同学遇到这个问题第一感觉一定也认为是浏览器出了问题，因为`mouseout`和`mouseover`同时被触发是不合逻辑的。那么博主来和大家一同分析一下这件“诡异”事件是如何发生的。

DOM Events中有个属性叫bubbles，翻译过来叫冒泡。这个属性名看起来很有趣，感觉也有些抽象，但实际上它恰恰生动形象地表达了这个属性的意思。冒泡属性来说明这个事件是否会向下传递，这个性质我相信在很多事件中同学们都或多或少知道，但可能单独提出来同学们对不上号。比如`click`事件，当点击一个元素时，此元素的父系元素也会接收到点击事件，这就是因为子元素的`click`事件为冒泡事件，会传递给其父系元素。而bubbles这个词形象地描述出这个过程好比水中的气泡从水底慢慢上浮，只是DOM Events方向相反，传递是从顶向下的，直到传递到`body`、`html`、`window`（这三者是传递链中的最后三个，不是并列关系）。

那么上例的`scroll`元素被浏览器折腾得反复收到`mouseout`和`mouseout`事件就不奇怪了，首先鼠标移出了`scrollHandle`，`scrollHandle`接收到了`mouseout`事件，由于这个事件是冒泡的，随后便传给了`scroll`，于是`scroll`接收到了`mouseout`事件；之后鼠标移到了灰色或者蓝色进度条上，或者直接移动到了`scroll`上，无论三者中的哪一个，`scroll`都会因为冒泡接收到`mouseover`事件。这就是看起来在上例中`mouseover`和`mouseout`“不稳定”的原因。

那么冒泡事件还有哪些呢？通过 [W3C文档](http://www.w3.org/TR/DOM-Level-3-Events/#event-types-list) 可以知道，冒泡事件还有`beforeinput`、`click`、`compositionstart`、`compositionupdate`、`compositionend`、`dbclick`、`focusin`、`focusout`、`input`、`keydown`、`keyup`、`mousedown`、`mousemove`、`mouseup`、`select`和`wheel`。

问题的原理搞懂了，那么应该如何解决呢？首先所有冒泡事件在传递的过程中，`target`都是不变的，所以可以直接在`scroll`的`mouseout`事件中判断`e.target === this`来过滤其子元素传递过来`mouseout`事件。等等，这不是正规的解决方法！W3C显然考虑到了博主在开始说明的使用背景，所以有专门的事件来处理这个问题——`mouseenter`和`mouseleave`，这两个事件不冒泡，是我们真正需要用到的方法。或许诸位同学又有疑问了，“你前面不是说有情怀的公司不放弃1%的用户，要做到兼容性吗，这个新标准兼容性可以接受吗，IE全家你问过了吗”，您还别说，这两个事件正是IE发明的，IE全家都支持，甚至包括IE6！所以嘛，不用总吐槽人家小软就会添乱，人家真的给W3C提交了很多有价值的建议标准呢！

下面是改后的Demo，用起来是不是舒爽多了！

<p data-height="192" data-theme-id="0" data-slug-hash="Pqvqvy" data-default-tab="result" data-user="Sneezry" class='codepen'>See the Pen <a href='http://codepen.io/Sneezry/pen/Pqvqvy/'>Pqvqvy</a> by Li Zhe (<a href='http://codepen.io/Sneezry'>@Sneezry</a>) on <a href='http://codepen.io'>CodePen</a>.</p>