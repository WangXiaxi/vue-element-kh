import Vue from 'vue'
import Router from 'vue-router'


const login = r => require.ensure([], () => r(require('../page/login')), 'login')
const list = r => require.ensure([], () => r(require('../page/list/list')), 'list')
const businessStatistics = r => require.ensure([], () => r(require('../page/list/list-child/business-statistics')), 'business-statistics')
const commerceStatistics = r => require.ensure([], () => r(require('../page/list/list-child/commerce-statistics')), 'commerce-statistics')
const salesman = r => require.ensure([], () => r(require('../page/list/list-child/salesman')), 'salesman')
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: login,
      meta: {
        title: '登录'
      }
    },
    {
      path: '/list',
      component: list,
      meta: {
        title: '代理商',
        loginVericat: true
      },
      children: [
        {
          path: '/',
          component: businessStatistics,
          name: 'businessStatistics',
          meta: {
            title: '业务统计',
            loginVericat: true
          }
        },
        {
          path: '/commerce-statistics',
          component: commerceStatistics,
          name: 'commerceStatistics',
          meta: {
            title: '商务统计',
            loginVericat: true
          }
        },
        {
          path: '/salesman',
          component: salesman,
          name: 'salesman',
          meta: {
            title: '业务员管理',
            loginVericat: true
          }
        }
      ]
    },
  ]
})
