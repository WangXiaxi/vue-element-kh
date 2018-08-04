import Vue from 'vue'
import Router from 'vue-router'
const login = r => require.ensure([], () => r(require('../pages/login/login')), 'login') //登录
const register = r => require.ensure([], () => r(require('../pages/register/register')), 'register') //注册
const forget = r => require.ensure([], () => r(require('../pages/forget/forget')), 'forget') //忘记密码
const fastLogin = r => require.ensure([], () => r(require('../pages/fastLogin/fastLogin')), 'fastLogin') //快捷登录
const settled = r => require.ensure([], () => r(require('../pages/settled/settled')), 'settled') //入驻
const settled2 = r => require.ensure([], () => r(require('../pages/settled/settled2')), 'settled2') //入驻信息
const addCar = r => require.ensure([], () => r(require('../pages/settled/addCar')), 'addCar') //添加车辆
const addCar2 = r => require.ensure([], () => r(require('../pages/settled/addCar2')), 'addCar2') //车辆信息
const finaindex = r => require.ensure([], () => r(require('../pages/finance/finaindex')), 'finaindex') //账户余额
const recharge = r => require.ensure([], () => r(require('../pages/finance/finachild/recharge')), 'recharge') //充值
const rechargelist = r => require.ensure([], () => r(require('../pages/finance/finachild/rechargelist')), 'rechargelist') //充值记录
const withdraw = r => require.ensure([], () => r(require('../pages/finance/finachild/withdraw')), 'withdraw') //提现
const withdrawlist = r => require.ensure([], () => r(require('../pages/finance/finachild/withdrawlist')), 'withdrawlist') //体现记录
const balancelist = r => require.ensure([], () => r(require('../pages/finance/finachild/balancelist')), 'balancelist') //余额变动记录
const checklist = r => require.ensure([], () => r(require('../pages/finance/finachild/checklist')), 'checklist') //交易账单
const tradeList = r => require.ensure([], () => r(require('../pages/finance/tradeList')), 'tradeList') //交易账单
const frozenlist = r => require.ensure([], () => r(require('../pages/finance/finachild/frozenlist')), 'frozenlist') //
const finelist = r => require.ensure([], () => r(require('../pages/finance/finachild/finelist')), 'finelist') //罚款记录
const bill = r => require.ensure([], () => r(require('../pages/finance/bill')), 'bill') //物流运费账单
const paying = r => require.ensure([], () => r(require('../pages/finance/billchild/paying')), 'paying') //付款
const paylist = r => require.ensure([], () => r(require('../pages/finance/billchild/paylist')), 'paylist') //付款记录
const obligation = r => require.ensure([], () => r(require('../pages/finance/billchild/obligation')), 'obligation') //待付款记录
const payment = r => require.ensure([], () => r(require('../pages/finance/payment')), 'payment') //支付
const product = r => require.ensure([], () => r(require('../pages/product/product')), 'product') //产品库
const source = r => require.ensure([], () => r(require('../pages/source/source')), 'source') //发布货源（工厂）
const add = r => require.ensure([], () => r(require('../pages/source/add')), 'add') //发布货源（物流公司）
const sourceList = r => require.ensure([], () => r(require('../pages/sourceList/sourceList')), 'sourceList') //货源列表（工厂）
const orderList = r => require.ensure([], () => r(require('../pages/sourceList/orderList')), 'orderList') //货源列表（物流公司）
const sourceDetails = r => require.ensure([], () => r(require('../pages/sourceDetails/sourceDetails')), 'sourceDetails') //订单详情页（工厂）
const orderDetails = r => require.ensure([], () => r(require('../pages/sourceDetails/orderDetails')), 'orderDetails') //订单详情页（物流公司）
const sourceEdit = r => require.ensure([], () => r(require('../pages/sourceEdit/sourceEdit')), 'sourceEdit') //货源编辑
const subAccount = r => require.ensure([], () => r(require('../pages/subAccount/subAccount')), 'subAccount') // 会员用户管理
const account = r => require.ensure([], () => r(require('../pages/account/account')), 'account') //账户信息

const blacklistFactory = r => require.ensure([], () => r(require('../pages/blacklist/blacklistFactory')), 'blacklistFactory') //黑名单工厂企业
const blacklistLogistics = r => require.ensure([], () => r(require('../pages/blacklist/blacklistLogistics')), 'blacklistLogistics') //黑名单物流公司
const blacklistFactoryAdd = r => require.ensure([], () => r(require('../pages/blacklist/blacklistFactoryAdd')), 'blacklistFactoryAdd') //黑名单工厂企业 添加页面
const blacklistLogisticsAdd = r => require.ensure([], () => r(require('../pages/blacklist/blacklistLogisticsAdd')), 'blacklistLogisticsAdd') //黑名单物流公司 添加页面

// 小星 优化财务新增 现在在前面加个new 后续替换的时候去掉
const newpayment = r => require.ensure([], () => r(require('../pages/finance/finance/payment')), 'payment')  //支付 新
const newrecharge = r => require.ensure([], () => r(require('../pages/finance/finance/recharge')), 'recharge') //充值 新
const newwithdraw = r => require.ensure([], () => r(require('../pages/finance/finance/withdraw')), 'withdraw') // 提现 新

//银行卡管理
const bankcard = r => require.ensure([], () => r(require('../pages/finance/bankcard/bankCard.vue')), 'bankcard')
const bankcardlist = r => require.ensure([], () => r(require('../pages/finance/bankcard/bankCardList.vue')), 'bankcardlist')

//物流运费账单->收货方到付
const carriageforward = r => require.ensure([], () => r(require('../pages/finance/billchild/carriageforward')), 'carriageforward') //付款记录

//运单
const waybill = r => require.ensure([], () => r(require('../pages/waybill/waybill.vue')), 'waybill') //运单
const waybillDetail = r => require.ensure([], () => r(require('../pages/waybill/waybillDetail.vue')), 'waybillDetail') //运单详情

//货物统计
const goodsManage = r => require.ensure([], () => r(require('../pages/goodsManage/goodsManage')), 'goodsManage') // 货物统计列表
const goodsDelivery = r => require.ensure([], () => r(require('../pages/goodsManage/goodsDelivery')), 'goodsDelivery') // 货物统计发货
const slipPublish = r => require.ensure([], () => r(require('../pages/goodsManage/slipPublish')), 'slipPublish') // 货物统计转单发布

//物流专线
const specialLine = r => require.ensure([], () => r(require('../pages/specialLine/specialLine')), 'specialLine') // 物流专线页面

const printer = r => require.ensure([], () => r(require('../pages/printer/printer')), 'printer') // 标签打印

const carrier = r => require.ensure([], () => r(require('../pages/carrier/carrier')), 'carrier') // 选择承运人

const publishTipsPage = r => require.ensure([], () => r(require('../pages/tipsPage/publishTipsPage')), 'publishTipsPage') // 发布成功后提示页

const slipPublishTipsPage = r => require.ensure([], () => r(require('../pages/tipsPage/slipPublishTipsPage')), 'slipPublishTipsPage') // 转单发布成功后提示页


const updating = r => require.ensure([], () => r(require('../pages/update/update')), 'update') // 服务器升级页面

Vue.use(Router)

export default new Router({
    // mode: 'history',
    routes: [
        { // 物流去付款
            path: '/wlpayment',
            component: newpayment,
            // name: 'newpayment',
            children: [{
                path: '/',
                component: paying,
                name: 'paying',
                meta: {
                    title: '付款'
                }
            }],
            meta: {
                title: '支付新'
            }
        },
        {
            path: '/recharge',
            component: newrecharge,
            // name: 'newrecharge',
            children: [{
                path: '/',
                component: recharge,
                name: 'recharge',
                meta: {
                    title: '充值'
                }
            }],
            meta: {
                title: '充值新'
            }
        },
        {
            path: '/bankcard',
            component: bankcard,
            // name: 'bankcard',
            children: [
                {
                    path: '/',
                    component: bankcardlist,
                    name: 'bankcardlist',
                    meta: {
                        title: '银行卡管理'
                    }
                }
            ],
            meta: {
                title: '银行卡管理'
            }
        },
        {
            path: '/waybill',
            component: waybill,
            name: 'waybill',
            meta: {
                title: '运单管理'
            }
        },
        {
            path: '/waybillDetail/:id',
            component: waybillDetail,
            name: 'waybillDetails',
            meta: {
              title: '运单详情'
            }
        },
        {
            path: '/withdraw',
            component: newwithdraw,
            // name: 'newwithdraw',
            children: [
                {
                    path: '/',
                    component: withdraw,
                    name: 'withdraw',
                    meta: {
                        title: '提现'
                    }
                }
            ],
            meta: {
                title: '提现新'
            }
        },
        {
            path: '/finaindex',
            component: finaindex,
            children: [
                // {
                //     path: '/',
                //     component: recharge,
                //     name: 'recharge',
                //     meta: {
                //         title: '充值'
                //     }
                // },
                {
                    path: '/',
                    redirect: '/rechargelist'
                },
                {
                    path: '/rechargelist',
                    component: rechargelist,
                    name: 'rechargelist',
                    meta: {
                        title: '充值记录'
                    }
                },
                // {
                //     path: '/withdraw',
                //     component: withdraw,
                //     name: 'withdraw',
                //     meta: {
                //         title: '提现'
                //     }
                // },
                {
                    path: '/withdrawlist',
                    component: withdrawlist,
                    name: 'withdrawlist',
                    meta: {
                        title: '提现记录'
                    }
                },
                {
                    path: '/balancelist',
                    component: balancelist,
                    name: 'balancelist',
                    meta: {
                        title: '余额变动记录'
                    }
                },
                {
                    path: '/checklist',
                    component: checklist,
                    name: 'checklist',
                    meta: {
                        title: '交易账单'
                    }
                },
                {
                    path: '/frozenlist',
                    component: frozenlist,
                    name: 'frozenlist',
                    meta: {
                        title: '账户'
                    }
                },
                {
                    path: '/finelist',
                    component: finelist,
                    name: 'finelist',
                    meta: {
                        title: '罚款记录'
                    }
                }
            ],
            meta: {
                title: '账户'
            }
        },
        {
            path: '/bill',
            component: bill,
            children: [
                {
                    path: '/',
                    redirect: '/paylist'
                },
                {
                    path: '/paylist',
                    component: paylist,
                    name: 'paylist',
                    meta: {
                        title: '付款记录'
                    }
                },
                {
                    path: '/obligation',
                    component: obligation,
                    name: 'obligation',
                    meta: {
                        title: '待付款记录'
                    }
                },
                {
                    path: '/carriageforward',
                    component: carriageforward,
                    name: 'carriageforward',
                    meta: {
                        title: '收货方到付'
                    }
                }
            ],
        },
        {
            path: '/tradeList',
            component: tradeList,
            name: 'tradeList',
            meta: {
                title: '交易账单'
            }
        },
        {
            path: '/payment',
            component: payment,
            name: 'payment',
            meta: {
                title: '支付'
            }
        },
        //ws
        {
            path: '/',
            component: login,
            name: 'login',
            meta: {
                title: '登录'
            }
        },
        {
            path: '/register',
            component: register,
            name: 'register',
            meta: {
                title: '注册'
            }
        },
        {
            path: '/forget',
            component: forget,
            name: 'forget',
            meta: {
                title: '忘记密码'
            }
        },
        {
            path: '/fastLogin',
            component: fastLogin,
            name: 'fastLogin',
            meta: {
                title: '快捷登录'
            }
        },
        {
            path: '/settled',
            component: settled,
            name: 'settled',
            meta: {
                title: '入驻'
            }
        },
        {
            path: '/settled2',
            component: settled2,
            meta: {
                title: '入驻信息'
            }
        },
        {
            path: '/addCar',
            component: addCar,
            name: 'addCar',
            meta: {
                title: '车辆添加'
            }
        },
        {
            path: '/addCar2',
            component: addCar2,
            name: 'addCar2',
            meta: {
                title: '车辆添加'
            }
        },
        {
            path: '/product',
            component: product,
            name: 'product',
            meta: {
                title: '产品库'
            }
        },
        {
            path: '/source/:id?/:type?',
            component: source,
            name: 'source',
            meta: {
                title: '发布货源'
            }
        },
        {
            path: '/add',
            component: add,
            name: 'add',
            meta: {
                title: '发布货源'
            }
        },
        {
            path: '/sourceList',
            component: sourceList,
            name: 'sourceList',
            meta: {
                title: '货源列表'
            }
        },
        {
          path: '/sourceEdit/:id',
          component: sourceEdit,
          name: 'sourceEdit',
          meta: {
            title: '货源列表编辑'
          }
        },
        {
            path: '/orderList',
            component: orderList,
            name: 'orderList',
            meta: {
                title: '货源列表'
            }
        },
        {
            path: '/sourceDetails/:id',
            component: sourceDetails,
            name: 'sourceDetails',
            meta: {
                title: '货源详情'
            }
        },
        {
            path: '/orderDetails/:id',
            component: orderDetails,
            name: 'orderDetails',
            meta: {
                title: '货源详情'
            }
        },
        {
            path: '/finaindex',
            component: finaindex,
            name: 'finaindex',
            meta: {
                title: '账户余额'
            }
        },
        {
            path: '/bill',
            component: bill,
            name: 'bill',
            meta: {
                title: '物流运费账单'
            }
        },
        {
            path: '/subAccount',
            component: subAccount,
            name: 'subAccount',
            meta: {
                title: '子账户管理'
            }
        },
        {
            path: '/account',
            component: account,
            name: 'account',
            meta: {
                title: '账户安全'
            }
        },
        {
            path: '/blacklistFactory',
            component: blacklistFactory,
            name: 'blacklistFactory',
            meta: {
                title: '黑名单'
            }
        },
        {
            path: '/blacklistLogistics',
            component: blacklistLogistics,
            name: 'blacklistLogistics',
            meta: {
                title: '黑名单'
            }
        },
        {
            path: '/blacklistFactoryAdd',
            component: blacklistFactoryAdd,
            name: 'blacklistFactoryAdd',
            meta: {
                title: '添加黑名单'
            }
        },
        {
            path: '/blacklistLogisticsAdd',
            component: blacklistLogisticsAdd,
            name: 'blacklistLogisticsAdd',
            meta: {
                title: '添加黑名单'
            }
        },
        {
            path: '/goodsManage',
            component: goodsManage,
            name: 'goodsManage',
            meta: {
                title: '货物统计'
            }
        },
        {
            path: '/goodsDelivery',
            component: goodsDelivery,
            name: 'goodsDelivery',
            meta: {
                title: '货物统计发货'
            }
        },
        {
            path: '/slipPublish',
            component: slipPublish,
            name: 'slipPublish',
            meta: {
                title: '货物统计转单发布'
            }
        },
        {
          path: '/specialLine',
          component: specialLine,
          name: 'specialLine',
          meta: {
            title: '物流专线'
          }
        },
        {
          path: '/printer/:id',
          component: printer,
          name: 'printer',
          meta: {
            title: '打印标签'
          }
        },
        {
          path: '/carrier/:id',
          component: carrier,
          name: 'carrier',
          meta: {
            title: '选择承运人'
          }
        },
        {
            path: '/publishTipsPage',
            component: publishTipsPage,
            name: 'publishTipsPage',
            meta: {
                title: '发布货源提示'
            }
        },
        {
            path: '/slipPublishTipsPage',
            component: slipPublishTipsPage,
            name: 'slipPublishTipsPage',
            meta: {
                title: '转单发布货源提示'
            }
        },
        {
            path: '/update',
            component: updating,
            name: 'update',
            meta: {
                title: '服务器升级中'
            }
        }
    ]
})
