// put the commonly used events in the toll library

let addEvent = (function (){
  if (window.addEventListener) {
    return  function(ele,type,fn){
      ele.addEventListener(type,fn,false);
    };
  }else if(window.attachEvent){
    return  function (ele,type,fn){
      ele.attachEvent('on'+type,fn);
    };
  }else{
    return function (ele,type,fn){
      ele['on'+type] = fn;
    };
  }
})()

let removeEvent = (function (){
  if (window.removeEventListener) {
    return function (ele,type,fn){
      ele.removeEventListener(type,fn);
    };
  }else if(window.detachEvent){
    return  function (ele,type,fn){
      ele.detachEvent('on'+type,fn);
    }
  }else{
    return function (ele,type,fn){
      ele['on'+type] = null;
    }
  };
})()

let stopPropagation = function (event){
   event = event || window.event;
  if(event.stopPropagation){
    event.stopPropagation();
  }else{
    event.cancelBubble = true;
  }
} 

let stopDefault = function (event){
   event = event || window.event;
  if (event.preventDefault) {
    event.preventDefault();
  }else{
    event.returnValue = false;
  }
}
let getEvent = function (event){
  return event || event.srcElement;
}

