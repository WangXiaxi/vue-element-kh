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


