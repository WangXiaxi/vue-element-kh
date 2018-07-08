export const getTimes = (times, fmt) => {
  let o = {
    "M+": times.getMonth() + 1, //月份 
    "d+": times.getDate(), //日 
    "h+": times.getHours(), //小时 
    "m+": times.getMinutes(), //分 
    "s+": times.getSeconds(), //秒 
    "q+": Math.floor((times.getMonth() + 3) / 3), //季度 
    "S": times.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (times.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}