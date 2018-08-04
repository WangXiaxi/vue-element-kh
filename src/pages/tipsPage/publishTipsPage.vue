<!--
  新页面，提示页，发货提示页
-->
<template>
  <div class="tips-page">
    <head-top>
      <span class="title" slot="index">{{userType == 1?'货主':'物流公司'}}-工作台</span>
      <div class="header-center" slot="menu">
        <head-menu-router activeLink="index"></head-menu-router>
      </div>
      <drop-down slot="info"></drop-down>
    </head-top>
    <div class="content clear">
      <div class="content-left">
        <left-menu-router-home :activeLink="userType == 1 ? 'source' : 'add'"></left-menu-router-home>
      </div>
      <div class="content-right">
        <div class="main">
          <p class="title-box"><span class="title-name">发布货源</span></p>
          <div class="container">

            <div class="con-info">
              <div class="info-img">
                <img src="../../assets/images/success-big.png" v-if="getParams.i === 'success'">
              </div>
              <div class="info-tip">
                {{getParams.tip}}
              </div>
              <div class="info-des" :style="{color: getParams.color}">
                {{getParams.des}}
              </div>
              <a href="http://app.sdhwlw.com/Agreement/service.html" target="_blank" class="info-xieyi">
                《速达汇用户协议》提醒您：请勿要求司机代收货款！
              </a>
              <div class="btn-list">
                <el-button class="go-on" @click="goUrl({path: '/' + (userType == 1 ? 'source' : 'add')})" plain>继续发布</el-button>
                <el-button type="primary" class="add-now" @click="goUrl({path: '/' + (userType == 1 ? 'sourceDetails' : 'orderDetails') + '/' + getParams.orderID})">查看货源详情</el-button>
                <el-button class="printer" v-if="userType == 1" @click="goUrl({path: '/printer/'+ getParams.orderID})">打印标签</el-button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <foot class="footer"></foot>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head'
  import dropDown from 'components/header/children/dropdown'
  import foot from "components/footer/foot"
  import headMenuRouter from 'components/headMenuRouter/headMenuRouter' // 头部
  import leftMenuRouterHome from 'components/leftMenuRouter/leftMenuRouterHome' // 左侧
  import m_login from '@/mixins/m_login'

  export default {
    mixins: [m_login],
    data () {
      return {
        /*
          * getParams 参数根据传递过来不同信息显示不同内容
          * @params
            i: 图标
            tip: 提示
            des: 描述
            color: 描述颜色
        */
        getParams: {
          i: '',
          tip: '',
          des: '',
          color: '',
          orderID: ''
        },
      }
    },    
    created () {
      // 公用 页面 不需要 验证 身份类型
      let isLogin = this.checkLoginStatus();
      if(!isLogin) return;
      this.getParams = this.$route.query;
    },
    computed: {

    },
    methods: {
      goUrl (val) {
        this.$router.push(val);
      }
    },
    components: {
      headTop,
      dropDown,
      foot,
      headMenuRouter,
      leftMenuRouterHome
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../assets/styles/template.styl'
  @import '../../assets/styles/variable.styl'
  .tips-page
    .con-info
      margin: 60px auto 0
      text-align: center
      .info-img
        img
          width: 100px
          height: 100px
      .info-tip
        font-size: 16px
        margin-top: 30px
      .info-des
        font-size: 16px
        line-height: 1.42
        width: 300px
        margin: 14px auto 0
      .info-xieyi
        display: block
        font-size: 14px
        margin-top: 14px
      .btn-list
        margin-top: 50px
        .el-button
          padding: 11px 20px
          width: 150px
          font-size: 16px
          &+.el-button
            margin-left: 20px
        .go-on.el-button.is-plain
          background: #fff
          border-color: #409EFF
          color: #409EFF
        .printer.el-button
          color: #409eff
          border-color: #c6e2ff
          background-color: #ecf5ff
</style>
