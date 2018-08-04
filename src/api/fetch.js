import { Message } from 'element-ui'
import { baseUrl, imgPostUrl, payUrl } from 'api/env'
import axios from 'axios'
import qs from 'qs'
import router from '../router'
import VueCookie from 'vue-cookie'
import { Version } from '../config/publicParam'
import { dropOut } from "config/dropOut"; // 清空操作

let cancel, promiseArr = {};
const CancelToken = axios.CancelToken;


// //请求拦截器
// axios.interceptors.request.use(config => {
//     //发起请求时，取消掉当前正在进行的相同请求
//     if (promiseArr[config.url]) {
//         promiseArr[config.url]('操作取消');
//         promiseArr[config.url] = cancel
//     } else {
//         promiseArr[config.url] = cancel
//     }
//     return config
// }, error => {
//     return Promise.reject(error)
// });


//响应拦截器即异常处理
axios.interceptors.response.use(response => {
    return response
}, err => {
    err.message = "连接超时，请刷新页面重试";
    let date = new Date();
    let hours = date.getHours();
    if( hours >= 20 && hours <= 6 ){
      //跳转到服务器升级页面
      router.replace({
        path: '/update'
      });
      return;
    }

    Message.error(err.message);
    return Promise.resolve(
      err.response ||
      {
        data:{
          ResultCode: 999999,
          ResultMessage:'连接超时，请刷新页面重试',
          ResultValue:{}
          }
        }
      )
});

//设置axios全局配置
axios.defaults.baseURL = baseUrl;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.timeout = 10000;


export default {
    //file上传
    file(param) {
        return new Promise((resolve, reject) => {
            let formData = new FormData();
            formData.append('file', param);
            formData.append('Token', VueCookie.get('Token'));
            formData.append('MemberID', VueCookie.get('MemberID'));
            formData.append('Version', Version);
            axios({
                method: 'post',
                url: imgPostUrl,
                data: formData
                    // cancelToken: new CancelToken(c => {
                    //     cancel = c
                    // })
            }).then(res => {
                if (res.status == 200 && (res.data.ResultCode === '000012' || res.data.ResultCode === '000011')) {
                    Message.error({ message: res.data.ResultMessage });
                    dropOut(); // 清除各种数据
                    router.replace({ // 登录页面有清空cookie 操作
                        path: '/'
                    })
                    return;
                }
                if (res.status == '200' && res.data.ResultCode != '000000') {
                    Message.error({ message: res.data.ResultMessage });
                }
                resolve(res);
            })
        })
    },
    //get请求
    get(url, param) {
        return new Promise((resolve, reject) => {
            if (!param) {
                param = {};
            }
            param.Token = VueCookie.get('Token');
            param.MemberID = VueCookie.get('MemberID');
            param.Version = Version;

            axios({
                method: 'get',
                 params: param,
                url
                // cancelToken: new CancelToken(c => {
                //     cancel = c;
                // })
            }).then(res => {
                if (res.status == 200 && (res.data.ResultCode === '000012' || res.data.ResultCode === '000011')) {
                    Message.error({ message: res.data.ResultMessage });
                    dropOut(); // 清除各种数据
                    router.replace({ // 登录页面有清空cookie 操作
                        path: '/'
                    })
                    return;
                }
                if (res.status == 200 && res.data.ResultCode && res.data.ResultCode != '000000') {
                    Message.error({ message: res.data.ResultMessage });
                }
                resolve(res);
            }).catch(function (error) {
                console.warn(error);
            });
        })
    },
    //post请求
    post(url, param) {

        return new Promise((resolve, reject) => {
            if (!param) {
                param = {};
            }
            param.Token = VueCookie.get('Token');
            param.MemberID = VueCookie.get('MemberID');
            param.Version = Version;
            axios({
                method: 'post',
                url,
                data: qs.stringify(param)
                    // cancelToken: new CancelToken(c => {
                    //     cancel = c;
                    // })
            }).then(res => {
                if (!res) {
                    resolve('http-error');
                    return;
                }
                if (res.status == 200 && (res.data.ResultCode === '000012' || res.data.ResultCode === '000011')) {
                    Message.error({ message: res.data.ResultMessage });
                    dropOut(); // 清除各种数据
                    router.replace({ // 登录页面有清空cookie 操作
                        path: '/'
                    })
                    return;
                }
                if (res.status == 200 && res.data.ResultCode != '000000') {
                    Message.error({ message: res.data.ResultMessage });
                }
                resolve(res);
            })
        })
    },
    pay(url, param) {
        return new Promise((resolve, reject) => {
            if (!param) {
                param = {};
            }
            param.Token = VueCookie.get('Token');
            param.MemberID = VueCookie.get('MemberID');
            param.Version = Version;
            axios({
                method: 'post',
                url,
                baseURL: payUrl,
                data: qs.stringify(param)
                    // cancelToken: new CancelToken(c => {
                    //     cancel = c
                    // })
            }).then(res => {
                if (res.status == 200 && (res.data.ResultCode === '000012' || res.data.ResultCode === '000011')) {
                    Message.error({ message: res.data.ResultMessage });
                    router.replace({ // 登录页面有清空cookie 操作
                        path: '/'
                    })
                    return;
                }
                if (res.status == 200 && res.data.ResultCode != '000000') {
                    // Message({
                    //   type: 'error',
                    //   message: res.data.ResultMessage
                    // })
                }
                resolve(res)
            })
        })
    }
}
