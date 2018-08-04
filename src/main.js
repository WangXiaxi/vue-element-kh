// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import VueCookie from 'vue-cookie'
import 'element-ui/lib/theme-chalk/index.css'
import 'babel-polyfill'
/* eslint-disable no-new */
Vue.use(ElementUI);
Vue.use(VueCookie);

router.beforeResolve((to, from, next) => {
    window.document.title = to.meta.title;
    // console.log(store.state)
    // console.log(VueCookie)
    // let MemberID = VueCookie.get("MemberID");
    // let MemberMerchantID = VueCookie.get("MemberMerchantID");
    next()
});
// router.beforeEach((to, from, next) => {
//     let userType = VueCookie.get("MemberCrowd");
//     let status = VueCookie.get("MerchantStatus");
//     if (to.name == "login" || to.name == "register" || to.name == "forget" || to.name == "fastLogin") {
//         next();
//     } else {
//         if (status != 2) {
//             console.log("333")
//             console.log(to.name)
//             if (to.name == "settled") {
//                 next();
//             }
//         } else {
//             if (userType == 1) {
//                 console.log("111")
//                 next()
//             } else if (userType == 2) {
//                 console.log("22")
//                 next()
//             }
//         }
//     }
// })
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
});