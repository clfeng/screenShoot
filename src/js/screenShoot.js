let topImg = document.getElementById('top_img');
let bottomImg = document.getElementById('bottom_img');
let contentLeft = document.getElementById('content_left');
let imgWrap = document.getElementById('imgWrap');
let rightImg = document.getElementById('rightImg');
let saveImg = document.getElementById('saveImg');
let clipDiv = document.getElementById('clipDiv');
let saveBtn = document.getElementById('saveBtn');

const _CLIP_WIDTH = 200;
const _CLIP_HEIGHT = 200;

// 获取旧图片的宽高，以及宽高比例
let oldImgW = topImg.offsetWidth;
let oldImgH = topImg.offsetHeight;
let imgScale = oldImgW/oldImgH;

// 获取容器元素的宽高以及宽高比例
let conLeftW = contentLeft.offsetWidth;
let conLeftH = contentLeft.offsetHeight;
let contScale = conLeftW/conLeftH;
let TClear,LClear;
let scallFlag = contScale > imgScale;

// 通过容器与图片的宽高比，对图片进行放大缩小
if (scallFlag) {
  setHeight(conLeftH);
}else{
  setWidth(conLeftW);
}

center();
clip();

// 给图片添加拖拽事件
addEvent(contentLeft,"mousedown",mouseDown);
function mouseDown(event){
  // 解决的是当图片还没回到截图框内是，又再次方式拖拽事件
  // debugger;
  clearInterval(TClear);
  clearInterval(LClear);
  event = getEvent(event);
  stopDefault(event);
  let mouseL = event.clientX;
  let mouseT = event.clientY;
  let distX = mouseL - topImg.offsetLeft;
  let distY = mouseT - topImg.offsetTop;
  // 对鼠标事件进行捕获
  if (this.setCapture) {
    this.setCapture();
  }
/*  
  else if(window.captureEvents){
    window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
  }*/

  addEvent(contentLeft,"mousemove",mouseMove);
  function mouseMove(event){
    event = getEvent(event);
    stopDefault(event);
    let clear= setInterval(function(){
      clearInterval(clear);
      topImg.style.top = bottomImg.style.top = (event.clientY - distY)+"px";
      topImg.style.left = bottomImg.style.left = (event.clientX - distX)+"px";
      clip()
    },16.7)
  }


  if(!this.setCapture){
    addEvent(document,"mouseup",mouseup);
  }else{
    // 为了能够捕获在contentLeft外发生的mouseup事件，直接给document添加mouseup
    addEvent(contentLeft,"mouseup",mouseup);
  }
  function mouseup(event){
    event = getEvent(event);
    stopDefault(event);

    let directionX = (event.clientX - mouseL)>0? true:false;
    let directionY = (event.clientY -mouseT)>0? true:false;

    // Y轴方向
    if (directionY && topImg.offsetTop>clipDiv.offsetTop-100) {
      changePlaceT(topImg.offsetTop,clipDiv.offsetTop-100,'top');
    }else if(!directionY && topImg.offsetTop+topImg.offsetHeight < clipDiv.offsetTop-100+clipDiv.offsetHeight){
      changePlaceT(topImg.offsetTop,clipDiv.offsetTop-100+clipDiv.offsetHeight-topImg.offsetHeight,'top');
    }
    // X轴方向
    if (directionX && topImg.offsetLeft >clipDiv.offsetLeft-100) {
      changePlaceL(topImg.offsetLeft,clipDiv.offsetLeft-100,'left');
    }else if(!directionX && topImg.offsetLeft+topImg.offsetWidth < clipDiv.offsetLeft-100+clipDiv.offsetWidth ){
      changePlaceL(topImg.offsetLeft,clipDiv.offsetLeft-100+clipDiv.offsetWidth-topImg.offsetWidth,'left');
    }
    // 移除mousemove和mouseup事件
    removeEvent(contentLeft,"mousemove",mouseMove); 
    // removeEvent(contentLeft,"mouseup",mouseup);
    // debugger;
    // 释放捕获事件
    if (this.releaseCapture) {
      this.releaseCapture()
      removeEvent(contentLeft,"mouseup",mouseup);
    }else{
      removeEvent(document,'mouseup',mouseup);
    }
 /*   
    else if(window.releaseEvents){
      // 由于在chrome下Event.MOUSEUP= undefined,故不起作用
      window.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);
    }*/
  }
}


// 放大缩小功能
// IE,chrome
addEvent(contentLeft,'mousewheel',function (event){
  event = getEvent(event);
  // debugger;
  if (event.wheelDelta>0) {
    // 向上滚动，放大图片
    stopDefault(event);
    scalBig();
  }else if(event.wheelDelta<0){
    // 向上滚动,缩小图片
    stopDefault(event);
    scalSmall();
  }
});


// firefox
addEvent(contentLeft,'DOMMouseScroll',function (event){
  event = getEvent(event);
  if (event.detail>0) {
    stopDefault(event);
    scalSmall();
  }else if(event.deail<0){
    // 向下滚动
    stopDefault(event);
    scalBig();
  }
});


// 点击save按钮保存图片，把图片展示出来，并且生生base64
addEvent(saveBtn,"click",function (){
  let rightImgStyle = window.getComputedStyle(rightImg,null),img,children;
  children = imgWrap.children;
  if (children.length>1) {
    imgWrap.removeChild(children[children.length-1]);
  }
  img = new Image();
  img.src = rightImg.src;
  img.onload = function (){
    img.style.height = rightImgStyle['height'];
    img.style.clip = rightImgStyle['clip'];
    img.style.marginTop = rightImgStyle['margin-top'];
    img.style.marginLeft = rightImgStyle['margin-left'];
    rightImg.style.display = 'none';
    imgWrap.appendChild(img);
    saveCanvas();
  }

  function saveCanvas(){
   let imgCanvas = document.createElement('canvas');
   let ctx = imgCanvas.getContext('2d');
   imgCanvas.width = clipDiv.offsetWidth;
   imgCanvas.height = clipDiv.offsetHeight;
    // 获取要绘制的在canvas上的源图片的起始位置和宽度
    let rightImgStyle = window.getComputedStyle(rightImg,null);
    let sx = (-parseInt(rightImgStyle['margin-left']))/topImg.offsetWidth*oldImgW;
    let sy = (-parseInt(rightImgStyle['margin-top']))/topImg.offsetHeight*oldImgH;
    let sWidth = _CLIP_WIDTH/topImg.offsetWidth*oldImgW;
    let sHeight = _CILP_HEIGHT/topImg.offsetHeight*oldImgH;
    ctx.drawImage(topImg,parseInt(sx),parseInt(sy),parseInt(sWidth),parseInt(sHeight),0,0,_CLIP_WIDTH,_CLIP_HEIGHT);
    let imgBase64 =imgCanvas.toDataURL('image/png');
    // console.log(imgBase64);
  }
});





let scalClear;
function scalSmall(){
  clearInterval(scalClear);
  // scallFlag = true,按照高度来缩放
  if(scallFlag){
    let oldH = topImg.offsetHeight,targetH = oldH * 0.95;
    scalClear = setInterval(function(){
      if (oldH < targetH) {
        clearInterval(scalClear);
        setHeight(targetH);
        clip();
      }else{
        let speed = Math.floor((targetH-oldH)/10);
        oldH +=speed;
        setHeight(oldH);
        clip();
      }
    },20);
  }else{
   let oldW = topImg.offsetWidth,targetW = oldW * 0.95;
   scalClear = setInterval(function (){
     if (oldW<targetW) {
      clearInterval(scalClear);
      setWidth(targetW);
      clip();
    }else{
      clearInterval(scalClear);
      let speed = Math.floor((targetW-oldW)/10);
      oldW += speed;
      setWidth(oldW);
      clip();
    }
  },20);
 }
}
function scalBig(){
  clearInterval(scalClear);
  // scallFlag= true,按照高度来缩放
  if(scallFlag){
    let oldH = topImg.offsetHeight,targetH = oldH * 1.05;
    scalClear = setInterval(function (){
      if (oldH>targetH) {
        clearInterval(scalClear);
        setHeight(targetH);
        clip();
      }else{
        let speed = Math.ceil((targetH-oldH)/10);
        oldH += speed;
        setHeight(oldH);
        clip();
      }
    },20);
  }else{
    let oldW = topImg.offsetWidth,targetW =oldW * 1.05;
    scalClear = setInterval(function (){
      if (oldW>targetW) {
        clearInterva(scalClear);
        setWidth(oldW);
        clip();
      }else{
        let speed = Math.ceil((targetW - oldW)/10);
        oldW += speed;
        setWidth(oldW);
        clip();
      }
    },20);
  }
}


function changePlaceT(old,target,type){
  clearInterval(TClear);
  // 判断是正向运动还是反向运动
  let speed,flag = target-old>0? true:false;
  if (flag) {
    //正向运动
    TClear=setInterval(function (){
      if (target>old) {
        speed = Math.ceil((target-old)/10);
        old +=speed;
        topImg.style[type] = bottomImg.style[type] = old+'px';
      }else{
        clearInterval(TClear);
        topImg.style[type] = bottomImg.style[type] = target+'px';
      }
      clip();
    },30);
  }else{
    // 反向运动
    TClear=setInterval(function (){
     if (target<old) {
      speed = Math.ceil((target-old)/10);
      old +=speed;
      topImg.style[type] = bottomImg.style[type] = old+'px';
    }else{
      clearInterval(TClear);
      topImg.style[type] = bottomImg.style[type] = target+'px';
    }
    clip();   
  },30);
  }
}
function changePlaceL(old,target,type){
  clearInterval(LClear);
  // 判断是正向运动还是反向运动
  let speed,flag = target-old>0? true:false;
  if (flag) {
    //正向运动
    LClear=setInterval(function (){
      if (target>old) {
        speed = Math.ceil((target-old)/10);
        old +=speed;
        topImg.style[type] = bottomImg.style[type] = old+'px';
      }else{
        clearInterval(LClear);
        topImg.style[type] = bottomImg.style[type] = target+'px';
      }
      clip();
    },30);
  }else{
    // 反向运动
    LClear=setInterval(function (){
     if (target<old) {
      speed = Math.ceil((target-old)/10);
      old +=speed;
      topImg.style[type] = bottomImg.style[type] = old+'px';
    }else{
      clearInterval(LClear);
      topImg.style[type] = bottomImg.style[type] = target+'px';
    }
    clip();   
  },30);
  }
}
function clip(){
  let clipTop = clipDiv.offsetTop-100 -topImg.offsetTop;
  let clipLeft = clipDiv.offsetLeft-100-topImg.offsetLeft;
  rightImg.style.clip = topImg.style.clip = 'rect('+clipTop +'px,'+(clipLeft+_CLIP_WIDTH)+'px,'+(clipTop+_CLIP_HEIGHT)+'px,'+clipLeft+'px)';
  rightImg.style.marginTop = -clipTop+'px';
  rightImg.style.marginLeft = -clipLeft +'px';
}



function center(){
  let marginT = conLeftH - topImg.offsetHeght;
  let marginL = conLeftW - topImg.offsetWidth;
  topImg.style.top = bottomImg.style.top = parseInt(marginT/2)+"px";
  topImg.style.left = bottomImg.style.left = parseInt(marginL/2)+"px";

}

function setHeight(h){
 rightImg.style.height = topImg.style.height = bottomImg.style.height = h+"px";
}
function setWidth(w){
 rightImg.style.width = topImg.style.width = bottomImg.style.width = w+"px";
}

