<template>
  <div class="goods-delivery">
    <head-top>
      <span class="title" slot="index">物流公司-工作台</span>
      <div class="header-center" slot="menu">
        <head-menu-router activeLink="index"></head-menu-router>
      </div>
      <drop-down slot="info"></drop-down>
    </head-top>
    <div class="content clear">
      <div class="content-left">
        <left-menu-router-home activeLink="goodsManage"></left-menu-router-home>
      </div>
      <div class="content-right" v-loading="loading">
        <div class="title-box"><span class="title-name">货物统计 < 发货</span></div>
        <div class="container clear">
          <div class="info-box">
            <div class="info-title">发货信息</div>
            <div class="info-con" v-if="Number(getInfoObj.OrderCount)">
              <p class="roads"><span>{{getInfoObj.OrderFromAddress}}</span><span><img src="../../assets/images/gofrom.png" alt=""></span><span>{{getInfoObj.OrderToAddress}}</span></p>
              <p class="info"><span class="gray">发货详情：</span><span>共计{{getInfoObj.OrderCount}}单，{{getInfoObj.OrderClassifyName.join('、')}}共计{{getInfoObj.OrderProductCount}}件，运费共计{{getInfoObj.OrderFreight}}元；</span></p>
              <p class="info"><span class="gray">体积重量：</span><span>共计<span class="orange">{{getInfoObj.OrderVolume}}m³/{{getInfoObj.OrderWeight}}吨</span></span></p>
            </div>
          </div>

          <ul class="car-list mt-20">
            <li v-for="(item, index) in carList" :class="{active: chooseCar === item.TrucID}" :key="index">
              <el-radio v-model="chooseCar" :label="item.TrucID">
                <span>
                  <img src="item.TrucPicture" :onerror="errorImg" class="show-img">
                  <el-button plain size="mini" round class="show-btn" @click="chooseCar=item.TrucID">{{item.TrucCode}}</el-button>
                  <span class="show-text">{{item.Long}} / {{item.ModelName}} / {{item.Load}}吨</span>
                </span>
              </el-radio>
            </li>
          </ul>

          <div class="btn-box">
            <el-button type="primary" round width="200px" @click="submitForm">确认车辆，立即发货</el-button>
          </div>
        </div>
      </div>
    </div>
    <foot></foot>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head';
  import dropDown from 'components/header/children/dropdown';
  import foot from 'components/footer/foot';
  import leftMenuRouterHome from 'components/leftMenuRouter/leftMenuRouterHome'; // 左侧
  import headMenuRouter from 'components/headMenuRouter/headMenuRouter'; // 头部
  import m_login from '@/mixins/m_login';

  import {
    getEnterAddress, // 获取默认地址
    TruckGetPage, // 获取车辆接口
    GetOrderDetailsInfo, // 获取信息接口
    BatchDeliverForCompany // 货物统计发货接口（物流公司）
  } from 'api/getData';

  export default {
    mixins: [m_login],
    data () {
      return {
        errorImg: 'this.src="' + require('../../assets/images/errorimg.png') + '"',
        loading: true,
        carListSearch: {
          Type: 2,
          PageIndex: 1,
          PageSize: 1000,
          TotalRecords: 0
        },
        getInfoObj: {}, // 获取发货信息容器
        carList: [],
        chooseCar: '' // 当前选中车辆
      }
    },
    created () {
      let _ = this;
      if (!_.$route.params.formID) { // 没有订单ID跳回
        _.$router.back(-1);
        return;
      }
      let isLogin = _.checkLoginStatus();
      if(!isLogin) return;
      let identityPass = _.checkLoginIdentity(2, '/add');
      if (!identityPass) return;
      _.loading = true;
      let promise1 = _.TruckGetPage();
      let promise2 = _.GetOrderDetailsInfo();
      Promise.all([promise1, promise2]).then(() => { // 加载完毕关闭loading
        _.loading = false;
      })
    },
    computed: {

    },
    methods: {
      async submitForm () { // 确认发货
        let _ = this;
        if (!_.chooseCar) {
          _.$message.error("请选择车辆！");
          return;
        }
        let params = {MerchantID: this.MemberMerchantID, OrderID: _.$route.params.formID, TrucID: _.chooseCar};
        _.loading = true;
        const { data: { ResultCode, ResultMessage }} = await BatchDeliverForCompany(params);
        _.loading = false;
        if (ResultCode === '000000') {
          _.$message.success(ResultMessage);
          _.$router.push('/waybill');
        }
      },
      TruckGetPage () {
        let _ = this,
            params = Object.assign({}, _.carListSearch);
        return new Promise((resolve, reject) => {
          TruckGetPage(params).then((res) => {
            const { data: { ResultCode, ResultValue, ResultMessage, TotalRecords }} = res;
            if (ResultCode === '000000') {
              this.carList = ResultValue;
              resolve(res);
            } else {
              reject(res); // 报错停止
            }
          }).catch(() => {
            reject(r); // 报错停止
          })
        })
      },
      GetOrderDetailsInfo () {
        let _ = this,
            params = {OrderID: _.$route.params.formID};
        return new Promise((resolve, reject) => {
          GetOrderDetailsInfo(params).then((res) => {
            const { data: { ResultCode, ResultValue, ResultMessage, TotalRecords }} = res;
            if (ResultCode === '000000') {
              this.getInfoObj = ResultValue;
              resolve(res);
            } else {
              reject(res); // 报错停止
            }
          }).catch((r) => {
            reject(r); // 报错停止
          })
        })
      }
    },
    components: {
      headTop,
      dropDown,
      foot,
      leftMenuRouterHome, // 左侧导航
      headMenuRouter // 左侧
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../assets/styles/template.styl'
.goods-delivery
  .container
    .info-box
      border: 1px solid $borderColor
      min-height: 150px
      .info-title
        font-size: 14px
        height: 40px
        line-height: 40px
        border-bottom: 1px solid $borderColor
        background: $theadbg
        padding-left: 18px
      .info-con
        padding: 18px
        .roads
          font-size: 16px
          line-height: 2
        .info
          line-height: 1.6
          margin-top: 10px
          .gray
            color: $gray
          .orange
            color: $orange
    .car-list
      li
        height: 90px 
        border: 1px solid #fff
        font-size: 0
        padding-left: 20px
        position: relative
        margin-top: -1px
        z-index: 0
        &:before
          content: ' '
          height: 1px
          position: absolute
          top: -1px
          left: 0
          width: 100%
          background-image: linear-gradient(to right, #ccc 0%, #ccc 50%, transparent 50%)
          background-size: 15px 1px
          background-position: bottom
          background-repeat: repeat-x
        &:last-child:after
          content: ' '
          height: 1px
          position: absolute
          bottom: -1px
          left: 0
          width: 100%
          background-image: linear-gradient(to right, #ccc 0%, #ccc 50%, transparent 50%)
          background-size: 15px 1px
          background-position: bottom
          background-repeat: repeat-x
        &.active
          border-color: $blue
          background-image: none
          z-index: 1
          &:before
            content: none
          &:after
            content: none
        .el-radio
          width: 100%
          height: 90px
          line-height: 90px
        .show-btn
          background: #fff !important
          border-color: #409EFF !important
          color: #409EFF !important
          margin-right: 10px
        .show-img
          width: 50px
          height: 50px
          margin: 0 10px 0 10px
        .show-text
          color: #333
    .btn-box
      margin-top: 100px
      text-align: center
</style>
