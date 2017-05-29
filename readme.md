之前曾经看过一份完善过一份截图插件的代码，整个逻辑感觉有点复杂。该份代码的特点是：变量太多(而且是别人定义的变量)，组织的逻辑理解起来有点困难。

最近，有想到了这份东西，所以便萌生了自己尝试这独立实现的念头，也借此回顾下，简单动画，拖拽，缩放功能的实现，以及位置关系的一些原生js的一些知识点。

开始写前，先进行下知识点的回顾吧。

位置关系

|方法 | 描述
|-|-
|Element.clientTop  |返回element上边框的宽度值
|Element.clientLeft |返回element左边框的宽度值
|Element.offsetParent |返回element第一设置了position（且value!=static）的父元素，如果一直找不到，最后会返回root element，在标准模式下为html在怪异模式下为body
|Element.offsetTop  |返回element上边框到element.offsetParent上边框的距离
|Element.offsetLeft |返回element左边框到element.offsetParent左边框的距离
|Element.offsetWidth  |返回element的宽度,include :content,padding,border
|Element.offsetHeight |返回element的高度,include :content,padding,border
|event.clientX  |返回鼠标的事件发生是鼠标所在的X轴位置
|event.clientY  |返回鼠标的事件发生是鼠标所在的Y轴位置

//滚轮事件
```
addEvent(ele,'mousewheel',function (event){
  event = getEvent(event);
  if (event.wheelDelta>0) {
  //向上滚动
  //滚动一周为120
  }
  if (event.wheelDelta<0) {
  //向下滚动
  }
});

//firefox
addEvent(ele,'DOMMouseScroll',function (event){
  if (event.detail>0) {
  //向下滚动
  //滚动一周为3
  }
  if(event.detail<0){
  //向上滚动
  }
})
````

关于鼠标事件的全局捕获
```
 // 对鼠标事件进行捕获
  if (this.setCapture) {
    this.setCapture();
  } else if(window.captureEvents){
    window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
  }
    // 释放捕获事件
    if (this.releaseCapture) {
      this.releaseCapture()
    }   else if(window.releaseEvents){
      // 但不知为何在chrome下Event.MOUSEUP= undefined,故不起作用
      window.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);
    }
//采用的解决方案
  if (this.setCapture) {
    this.setCapture();
  }
  if(!this.setCapture){
    addEvent(document,"mouseup",mouseup);
  }else{
    // 为了能够捕获在contentLeft外发生的mouseup事件，直接给document添加mouseup
    addEvent(contentLeft,"mouseup",mouseup);
  }
    // 释放捕获事件
    if (this.releaseCapture) {
      this.releaseCapture()
      removeEvent(contentLeft,"mouseup",mouseup);
    }else{
      removeEvent(document,'mouseup',mouseup);
    }
```
最后是设计图

可能字丑了点（尴尬）

![screenshoot.jpg](http://upload-images.jianshu.io/upload_images/5834936-2d9a1c1e7adb0a4f.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

完成后

![image.png](http://upload-images.jianshu.io/upload_images/5834936-22ffad0bc64a6430.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)