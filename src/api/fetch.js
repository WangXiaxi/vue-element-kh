import { Message } from 'element-ui'
import { baseUrl, imgPostUrl, payUrl } from 'api/env'
import axios from 'axios'
import qs from 'qs'
import router from '../router'
import VueCookie from 'vue-cookie'
import { Version } from '../config/publicParam'

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
    if (err && err.response) {
        switch (err.response.status) {
            case 400:
                err.message = '错误请求';
                break;
            case 401:
                err.message = '未授权，请重新登录';
                break;
            case 403:
                err.message = '拒绝访问';
                break;
            case 404:
                err.message = '请求错误,未找到该资源';
                break;
            case 405:
                err.message = '请求方法未允许';
                break;
            case 408:
                err.message = '请求超时';
                break;
            case 500:
                err.message = '服务器端出错';
                break;
            case 501:
                err.message = '网络未实现';
                break;
            case 502:
                err.message = '网络错误';
                break;
            case 503:
                err.message = '服务不可用';
                break;
            case 504:
                err.message = '网络超时';
                break;
            case 505:
                err.message = 'http版本不支持该请求';
                break;
            default:
                err.message = `连接错误${err.response.status}`
        }
    } else {
        err.message = "连接到服务器失败"
    }
    Message.error({ message: err.message });
    return Promise.resolve(err.response)
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
