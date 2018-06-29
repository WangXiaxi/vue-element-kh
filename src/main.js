// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import VueCookie from 'vue-cookie'
import 'element-ui/lib/theme-chalk/index.css'

/* eslint-disable no-new */
Vue.use(ElementUI);
Vue.use(VueCookie);

// 路由拦截器,控制tabBar的显示隐藏
router.beforeEach((to, from, next) => {
  if (to.meta.loginVericat) {
    if(!VueCookie.get('AgentID')) {
      next({path: '/'})
    } else {
      next()
    }
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
