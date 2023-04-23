# zhcg_web

首次install后需要在node_modules/lib-flexible/flexible.js  文件里的
refreshRem方法 换成下面代码

function refreshRem(){
  var width = docEl.getBoundingClientRect().width;
  if (width / dpr < 540) {
    width = 540 * dpr;
  }else if(width / dpr > 1980){
    width = 1980 * dpr
  }
  var rem = width / 10;
  docEl.style.fontSize = rem + 'px';
  flexible.rem = win.rem = rem;
}