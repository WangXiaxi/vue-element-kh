/**
 * 配置开发环境和线上环境之间的切换
 *
 * baseUrl: 请求地址
 * imgUrl: 图片路径地址
 * imgPostUrl： 图片上传接口地址
 * payUrl: 支付请求地址
 * url：本地请求地址
 *
 */

let baseUrl = '';
let imgUrl = '';
let imgPostUrl = '';
let payUrl = '';
let webUrl = '';
let url = 'dev'; //本地地址

if (process.env.NODE_ENV == 'development') { //本地
    baseUrl = 'http://' + url + 'webapi.sdhwlw.com';
    imgUrl = 'http://' + url + 'updapi.sdhwlw.com/';
    imgPostUrl = 'http://' + url + 'updapi.sdhwlw.com/Picture/UploadSingle';
    payUrl = 'http://' + url + 'appapi.sdhwlw.com';
    webUrl = 'http://' + url + 'web.sdhwlw.com';
} else if (process.env.NODE_ENV == 'production') { //线上

    if (window.location.href.indexOf("tstmem.sdhwlw.com") > -1) {
        baseUrl = 'http://tstwebapi.sdhwlw.com';
        imgUrl = 'http://tstupdapi.sdhwlw.com/';
        imgPostUrl = 'http://tstupdapi.sdhwlw.com/Picture/UploadSingle';
        payUrl = 'http://tstappapi.sdhwlw.com';
        webUrl = 'http://tstweb.sdhwlw.com';
    } else if (window.location.href.indexOf("devmem.sdhwlw.com") > -1) {
        baseUrl = 'http://devwebapi.sdhwlw.com';
        imgUrl = 'http://devupdapi.sdhwlw.com/';
        imgPostUrl = 'http://devupdapi.sdhwlw.com/Picture/UploadSingle';
        payUrl = 'http://devappapi.sdhwlw.com';
        webUrl = 'http://devweb.sdhwlw.com';
    } else {
        baseUrl = 'http://webapi.sdhwlw.com';
        imgUrl = 'http://updapi.sdhwlw.com/';
        imgPostUrl = 'http://updapi.sdhwlw.com/Picture/UploadSingle';
        payUrl = 'http://appapi.sdhwlw.com';
        webUrl = 'http://www.sdhwlw.com';
    }
}

export {
    baseUrl,
    imgUrl,
    imgPostUrl,
    payUrl,
    webUrl
}
