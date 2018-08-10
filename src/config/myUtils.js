/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
};

/**
 * 获取localStorage
 */
export const getStore = (name) => {
  if (!name) return;
  return window.localStorage.getItem(name);
};

/**
 * 删除localStorage
 */
export const removeStore = (name) => {
  if (!name) return;
  window.localStorage.removeItem(name);
};

/**
 *  角色是否是某个职务
 **/
export const getUserRole = (id, role) => {
  let roleList = {
    '管理': ['3f9f15167e094137a8f967094bb2713e'],
    '财务': ['e5e0a063973649adb37283b9ce485cb1'],
    '发货': ['0922c79be52f49948b9c1985c487c8af']
  };
  //or use es6 includes
  //return roleList[role].includes(id)
  return roleList[role].indexOf(id) >= 0;
};
/**
 * Function waterMark 水印
 * @param name canvas id
 * @param src canvas img url
 * @param text waterMark text
 * @param width canvas width
 * @param height canvas width
 * @param x watermark x
 * @param y watermark y
 * */
export const waterMark = function(name, src, text, width, height, x, y) {
  if(!src) {
    console.warn('image src needed');
    return;
  }
  let innerText = text || '速达汇物流';

  var canvas = document.getElementById(name);

  if (!canvas) return;

  var ctx = canvas.getContext("2d");

  var img = new Image() ;


  img.onload = function() {

    ctx.drawImage(img, 0, 0, width, height);

    ctx.font = "14px 微软雅黑";

    ctx.fillStyle = "rgba(252,255,255,0.8)";

    ctx.fillText(innerText, x, y); //选择位置
  };

  img.src = src;

};
//
// //设置cookie
// export const setCookie = (name, value, days) => {
//   if (!days || days == 0) {
//     var exp = new Date();
//     exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
//     document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";domain=sdhwlw.com; path=/";
//   }
//   else {
//     document.cookie = name + "=" + escape(value) + ";domain=sdhwlw.com; path=/";
//   }
// };
//
// //获取cookie
// export const getCookie = (name) => {
//   let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
//   if (arr = document.cookie.match(reg))
//     return unescape(arr[2]);
//   else
//     return null;
// };
//
// //删除cookie
// export const removeCookie = (name) => {
//   let exp = new Date();
//   exp.setTime(exp.getTime() - 1);
//   let cval = getCookie(name);
//   if (cval != null)
//     document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + "; path=/";
//   document.domain;
// };


