/**
 * 配置开发环境和线上环境之间的切换
 *
 * baseUrl: 请求地址
 * imgUrl: 图片路径地址
 * imgPostUrl： 图片上传接口地址
 *
 */

let baseUrl = '';
let imgUrl = '';
let imgPostUrl = '';

if (process.env.NODE_ENV == 'development') {//本地
  baseUrl = 'http://devwebapi.sdhwlw.com';
  imgUrl = 'http://devupdapi.sdhwlw.com/';
  imgPostUrl = 'http://devupdapi.sdhwlw.com/Picture/UploadSingle';
} else if (process.env.NODE_ENV == 'production') {//线上
  baseUrl = 'http://webapi.sdhwlw.com';
  imgUrl = 'http://updapi.sdhwlw.com/';
  imgPostUrl = 'http://updapi.sdhwlw.com/Picture/UploadSingle';
  if (window.location.host.indexOf('tstweb.sdhwlw.com') > -1) {
  	baseUrl = 'http://tstwebapi.sdhwlw.com';
  	imgUrl = 'http://tstupdapi.sdhwlw.com/';
  	imgPostUrl = 'http://tstupdapi.sdhwlw.com/Picture/UploadSingle';
  } else if (window.location.host.indexOf('devweb.sdhwlw.com') > -1) {
    baseUrl = 'http://devwebapi.sdhwlw.com';
  	imgUrl = 'http://devupdapi.sdhwlw.com/';
  	imgPostUrl = 'http://devupdapi.sdhwlw.com/Picture/UploadSingle';
  }
}
export {
  baseUrl,
  imgUrl,
  imgPostUrl
}
