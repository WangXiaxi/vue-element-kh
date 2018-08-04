# sdh

> sdh

## Build Setup

``` bash
#版本号
1.0.6

#更新内容
1、工厂企业发货，运输类型为物流公司时，运费支付可设置工厂月结收货方支付，工厂企业和物流公司交易账单处需区分是工厂月结还是收货方支付。平台佣金照样收取，佣金的收取形式-物流公司余额扣款，可为负。最多负N元.[到付-收货方支付]
2、同一企业或物流公司，N时内，相同产品/重量/出发地/目的地重复发布货源时（装货时间），提醒用户，避免货源重发，提醒规则待制定【N=当天】
3、邀请码，初级功能，注册时可填写邀请码，注册成功生成邀请码，邀请码展示。【后续功能待定，邀请码管理，邀请多少人，分享时带邀请码】
4、工厂企业添加产品库页面优化。
5、提现时，持卡人名称取消限制，可填写其他持卡人
6、银行卡管理【web-app】
7、普货重泡货标准：500改为250kg/立方米
8、每个接口+令牌【安全】


# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

