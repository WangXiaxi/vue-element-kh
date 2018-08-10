<template>
  <div>
    <head-top>
      <span class="title" slot="index">{{usersType == 1?'货主':'物流公司'}}-工作台</span>
      <div class="header-center" slot="menu">
        <head-menu-router activeLink="index"></head-menu-router>
      </div>
      <drop-down slot="info"></drop-down>
    </head-top>
    <div class="content clear" v-loading="loading">
      <div class="content-left">
        <left-menu-router-home activeLink="waybill"></left-menu-router-home>
      </div>
      <div class="content-right">
        <div class="main fr">
          <p class="title-box"><span class="title-name">运单列表</span></p>
          <!--货源列表 start-->
          <div class="container clear">
            <!--头部条件 start-->
            <div class="top-sort">
              <ul>
                <li>货源列表：</li>
                <li :class="[item.value == currentOrderStatus ? 'active' : '']" v-for="(item,index) in orderStatusItems" @click="currentOrderStatus = item.value">{{item.name}}</li>
              </ul>
            </div>
            <div class="top-sort">
              <ul>
                <li>接单模式：</li>
                <li :class="[(getOrderType === 0) ? 'active' : '']" @click="getOrderType = 0">全部</li>
                <li :class="[(getOrderType === 2) ? 'active' : '']" @click="getOrderType = 2">最低价</li>
                <li :class="[(getOrderType === 1) ? 'active' : '']" @click="getOrderType = 1">抢单</li>
              </ul>
            </div>
            <div>
              <el-cascader class="small-item"
                           :options="address"
                           placeholder="发货地-选择省市区"
                           v-model="fromAddress"
                           size="small"
                           @change="fromAddressChange"
                           clearable
              ></el-cascader>
              <span><img src="../../assets/images/gofrom.png" alt=""></span>
              <el-cascader class="small-item"
                           :options="address"
                           v-model="toAddress"
                           placeholder="收货地-选择省市区"
                           clearable
                           @change="toAddressChange"
                           size="small"
              ></el-cascader>
              <span class="ml-20">发布时间:</span>
              <el-date-picker
                v-model="time"
                type="daterange"
                size="small"
                @change="changeDate"
                :unlink-panels="false"
                :editable='false'
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
              <el-button @click="search"
                         class="fr"
                         size="small"
                         type="primary"
              >搜索
              </el-button>
            </div>
            <!--头部条件 end-->
            <!-- 列表内容 start -->
            <div class="content-list">
              <ul>
                <li v-for="(item,index) in listData" :key="index">
                  <!--头标题 start-->
                  <div class="list-header">
                    <!--<el-checkbox class="fl mr-20"></el-checkbox>-->
                    <ul class="fl">
                      <li>货源单号：{{item.OrderCode}}</li>
                      <li>发布时间：{{item.OrderPublish}}</li>
                      <li>装货时间：{{item.OrderLoadTime}}</li>
                    </ul>
                    <span class="fr" :style="{ color: showOrderStatusColor(item.OrderStatus) }">{{item.OrderStatusName}}</span>
                  </div>
                  <!--头标题 end-->
                  <div class="main-list">
                    <!--物流信息 start-->
                    <div class="main-top">
                      <div class="top-left">
                        <p class="origin"><span>{{item.OrderFromCity}}
                          <img src="../../assets/images/gofrom.png" alt="">
                          {{item.OrderToCity}}</span>
                          <span class="order-type">{{pattern[item.OrderParttern]}}</span>
                          <router-link :to="{path: '/orderDetails/'+item.OrderformID}" class="item-transfer" v-if="item.OrderIsTransfer">已转单，货源编号{{item.OrderTransferID}}</router-link>
                        </p>
                        <div class="info">
                          <ul>
                            <li><span class="name">货物类型：</span>{{item.OrderClassifyName}}</li>
                            <li><span class="name">体积重量：</span><span class="orange-text">{{item.OrderVolume}}/{{item.OrderWeight}}</span>
                            </li>
                            <li><span class="name">车长车型：</span>{{item.OrderLong }}/{{item.OrderModelName}}</li>
                            <li><span class="name" >结算方式：</span>{{item.OrderSettlementName}}</li>
                            <li v-if="item.OrderParttern == 1"><span class="name">运费：</span><span class="orange-text">￥{{item.OrderFreight}}</span></li>
                          </ul>
                        </div>
                      </div>
                      <div class="btn-box">
                        <p class="mt-6">
                          <router-link :to="{path: '/waybillDetail/'+item.OrderformID}">查看详情</router-link>
                        </p>
                      </div>
                    </div>
                    <!--物流信息 end-->

                    <!--承运人信息 start-->
                    <div class="main-footer" v-if="item.OrderStatus >= orderStatus.ORDER_CONFIRMED">
                      <div class="footer-left">
                        <div class="use-box">
                          <div class="box-left">
                            <div class="">
                              <div class="fl">
                                <span>工厂货主：</span>
                              </div>
                              <div class="info">
                                <img :src="imgUrl + item.OrderMerchant.MembIcon" :onerror="errorImg" alt="加载失败" width="30" height="30" class="fl">
                                <p class="user-name">{{item.OrderMerchant.Name}}</p>
                                <span class="checked">已认证</span>
                                <span class="bao">保</span>
                              </div>
                            </div>
                          </div>
                          <div class="box-right">
                            <p class="mb-10"><span class="gray-txt">联系电话：</span>{{item.OrderMerchant.Phone}}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--承运人信息 end-->

                    <!-- 状态图标 -->
                    <span class="status-icon" v-if="item.OrderStatus == orderStatus.ORDER_CLOSED"><img src="../../assets/images/close.png"></span>
                    <span class="status-icon" v-if="item.OrderStatus == orderStatus.ORDER_ARRIVED"><img
                      src="../../assets/images/finished.png"></span>
                  </div>
                </li>
              </ul>
              <div v-if="listData.length === 0" class="text-center mt-40">
                <p><img src="../../assets/images/null.png"></p>
                <p>暂无数据</p>
              </div>
            </div>
            <!-- 列表内容 end -->
            <!--分页 start -->
            <div class="text-center mt-60" v-if="listData.length !== 0">
              <el-pagination
                background
                @current-change="handleCurrentChange"
                :page-size="params.PageSize"
                :current-page.sync="params.PageIndex"
                layout="total, prev, pager, next"
                :total="TotalRecords">
              </el-pagination>
            </div>
            <!--分页 end -->
          </div>
          <!--货源列表 end-->
        </div>
      </div>
    </div>
    <foot></foot>
  </div>
</template>

<script type="es6">
  import headTop from 'components/header/head'
  import dropDown from 'components/header/children/dropdown'
  import foot from 'components/footer/foot'
  import regs from 'config/regExp'
  import address from 'config/address'
  import {imgUrl, imgPostUrl} from "api/env"
  import {
    GetOrderformPageForCompany,
  } from 'api/getData'
  import { getUserRole } from 'config/myUtils';
  import {orderStatus, pattern, showOrderStatusColor} from 'config/statusManager'
  import leftMenuRouterHome from 'components/leftMenuRouter/leftMenuRouterHome' // 左侧
  import headMenuRouter from 'components/headMenuRouter/headMenuRouter' // 头部
  import m_login from '@/mixins/m_login'
  export default {
    mixins: [m_login],
    data() {
      return {
        orderStatusItems:[
          {name: '全部', value: 999},
          {name: '待确认', value: orderStatus.ORDER_PENDING},
          {name: '待发货', value: orderStatus.ORDER_CONFIRMED},
          {name: '运输中', value: orderStatus.ORDER_SHIPPED},
          {name: '已到达', value: orderStatus.ORDER_ARRIVED},
          {name: '取消中', value: orderStatus.ORDER_APPLY_CANCEL},
          {name: '拒绝取消', value: orderStatus.ORDER_REJECT_CANCEL},
          {name: '已关闭', value: orderStatus.ORDER_CLOSED}
        ],
        errorImg: 'this.src="' + require('../../assets/images/errorimg.png') + '"',
        upLoadImgList: [], // 评价图片上传列表
        orderStatus,
        pattern,
        imgUrl,
        imgPostUrl,
        userCharacter: this.$cookie.get("MemberDutiesID"),
        usersType: this.$cookie.get("MemberCrowd"),
        loading: false,
        getOrderType: 0,//接单模式
        fromAddress: [],//收货地
        toAddress: [],//发货地
        address: address.area,//城市数据
        currentOrderStatus: 999,//订单状态
        listData: [],//订单列表
        TotalRecords: 0,
        time: '',
        params: {
          MemberID: this.$cookie.get('MemberID'),
          OrderStatus: 0, //0全部；10待确认；15已确认；20已装货；25已发货；30已到达；35已评价;-15申请取消；-20取消被拒；-25已取消；
          OrderParttern: 0, //0全部；1抢单；2最低价；
          FromProvinceID: '',//出发地省编码
          FromCityID	: '',	//出发地市编码
          FromCountyID	: '',	//出发地区县编码
          ToProvinceID	: '',	//目的地省编码
          ToCityID	: '',	//目的地市编码
          ToCountyID	: '',	//目的地区县编码
          CreateStart	: this.getDefaultStartDate(),	//开始发布时间
          CreateEnd	: this.getTomorrowDate(),	//结束发布时间
          PageIndex: 1, //	第几页
          PageSize: 10, //	每页记录数
        }
      }
    },
    methods: {
      showOrderStatusColor: showOrderStatusColor,
      getUserRole: getUserRole,
      //获取列表数据
      async getWaybillList(){
          this.loading = true;
          const { data: { ResultCode, ResultValue, ResultMessage, TotalRecords }} = await GetOrderformPageForCompany(this.params);

          if(ResultCode === '000000'){
              this.listData = ResultValue;
              this.TotalRecords = TotalRecords;
          } else {
              this.$message({
                type: 'error',
                message: ResultMessage
              })
          }
          this.loading = false;
      },
      //搜索
      search() {
        this.getWaybillList();
      },
      fromAddressChange(e) {
        this.params.FromProvinceID = e[0];
        this.params.FromCityID = e[1];
        this.params.FromCountryID = e[2];
      },
      toAddressChange(e) {
        this.params.ToProvinceID = e[0];
        this.params.ToCityID = e[1];
        this.params.ToCountryID = e[2];
      },
      //分页
      handleCurrentChange(val) {
        this.params.PageIndex = val;
        this.getWaybillList();
      },
      getDefaultStartDate() {
          return '1970-01-01';
      },
      getTomorrowDate(){
        let date = new Date();
        return [date.getFullYear(), date.getMonth() + 1, date.getDate() +1].join('-');
      },
      //修改时间回调
      changeDate(e){
        if(e) {
          this.params.CreateStart = e[0];
          this.params.CreateEnd = e[1];
        } else {
          this.params.CreateStart = this.getDefaultStartDate();
          this.params.CreateEnd = this.getTomorrowDate();
        }
      }
    },
    created() {
      let isLogin = this.checkLoginStatus();
      if(!isLogin) return;
      let _ = this;
      let identityPass = this.checkLoginIdentity(2, '/finaindex', function(){
        _.getWaybillList();
      });
    },
    watch: {
      //监听筛选条件
      getOrderType(newVal) {
        this.params.OrderParttern = newVal;
        this.handleCurrentChange(1);
      },
      currentOrderStatus(newVal) {
        this.params.OrderStatus = newVal;
        this.handleCurrentChange(1);
      },
      CreateStart(n){
        console.log(n);
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

<style lang="stylus">
  .rated-upload .el-upload-list__item, .rated-upload .el-upload.el-upload--picture-card
    width: 102px
    height: 102px
  .rated-upload .el-upload--picture-card
    line-height: 104px
</style>

<style lang="stylus" scoped>
  @import "../../assets/styles/variable.styl"
  .avatar-uploader .el-upload
    border: 1px dashed #d9d9d9
    border-radius: 6px
    cursor: pointer
    position: relative
    overflow: hidden

  .avatar-uploader .el-upload:hover
    border-color: #409EFF

  .el-upload--picture-card
    width: 0
    height: 0

  .avatar
    width: 146px;
    height: 146px;
    display: block;

  .el-carousel__item h3
    color: #475669
    font-size: 14px
    opacity: 0.75
    line-height: 500px
    margin: 0

  .el-carousel__item:nth-child(2n)
    background-color: #99a9bf

  .el-carousel__item:nth-child(2n+1)
    background-color: #d3dce6

  .content
    position: relative
    width: 1200px
    margin: 10px auto 40px

  .content-left
    min-height: $minHeight
    height: 100%
    float: left
    width: 200px
    background: #ffffff
    > ul
      width: 200px
      position: absolute
      height: 100%
      background-color: #fff
      > li
        height: 30px;
        line-height: 30px;
        padding-left: 40px;
        margin: 10px 0;
        border-left: 3px solid transparent
        &:hover
          border-left-color: $blue
          color: $blue
          cursor: pointer
      .active
        border-left-color: $blue
        color: $blue

  .content-right
    float: right
    width: 990px
    background-color: #fff
    .main
      background: #FFFFFF;
      width: 100%
      .title-box
        box-shadow: 0 1px 0 0 #E0E0E0
      .title-name
        display: inline-block
        padding-left: 20px
        height: 30px
        line-height: 30px
        margin: 10px 0
        border-left: 3px solid $blue
      .container
        padding: 30px 40px
      .top-sort
        margin-bottom: 20px
        ul
          overflow: hidden
          li
            float: left
            margin: 0 15px
            cursor: pointer
            &:first-child
              margin: 0
              cursor: default
          .active
            color: $orange
      .small-item
        width: 180px
      .content-list
        min-height: 500px
        > ul
          > li
            margin-top: 10px
            border: 1px solid $borderColor

  .list-header
    clear: both
    overflow: hidden
    padding: 10px 20px
    border-bottom: 1px solid $borderColor
    background-color: $theadbg
    ul
      overflow: hidden
      li
        float: left
        margin-right: 30px

  .main-list
    padding: 0 20px
    position: relative
    .main-top
      overflow: hidden
      .top-left
        float: left
        width: 754px
        padding: 20px 0
        .origin
          margin-bottom: 10px
          font-size: 16px
          font-weight: bold
          >span
            vertical-align: middle
          >a
            vertical-align: middle 
        .info
          ul
            overflow: hidden
            li
              float: left
              width: 200px
              margin-top: 10px
              overflow: hidden
              text-overflow: ellipsis
              white-space: nowrap
          .name
            text-align: justify
            text-justify: distribute-all-lines
            text-align-last: justify
            /*text-indent:10px*/
            display: inline-block
            width: 70px
            color: $gray
      .btn-box
        float: left
        margin-top: 20px
        text-align: center

    .main-top1
      border-top: 1px dashed $borderColor
      ul
        li
          margin-top: 0 !important

  .main-footer
    overflow: hidden
    padding: 20px 0
    border-top: 1px dashed $borderColor
    .footer-left
      float: left
      width: 754px

  .status-icon
    position: absolute
    right: 200px
    top: 25px

  .info-content
    padding: 0 20px
    overflow: hidden
    > ul
      > li
        margin-bottom: 20px
        clear: both
        overflow: hidden
      .left-title
        float: left
        width: 140px
        text-align: left
      .car-type
        display: inline-block
        padding: 0 5px
        height: 18px
        line-height: 18px
        margin-left: 10px
        text-align: center
        border: 1px solid $blue
        color: $blue
        border-radius: 4px
      .pic-content
        ul
          overflow: hidden
          li
            float: left
            margin-right: 10px
            text-align: center

  .cancel-btn
    width: 200px

  .tip-list
    margin-left: 138px;
    .circle
      display: inline-block
      height: 6px
      line-height: 6px
      width: 6px
      margin: 0 10px 2px 0
      border-radius: 50%
      background-color: $orange

  .rate-title
    float: left
    height: 20px
    line-height: 20px
    margin-right: 20px

  .el-dialog__body
    padding: 30px 40px

  .footer-btn
    text-align: center
    margin-top: 20px

  .warning
    font-size: 50px
    color: #FECC15
  .use-box
    clear: both
    .name
      display inline-block
      width: 70px
      text-align:justify
      text-justify:distribute-all-lines
      text-align-last:justify
    .box-left
      float: left
      width: 400px
    .box-right
      float: left
    img
      vertical-align: middle
      margin: -4px 5px 0 0
    .user-name
      display: inline-block
      overflow: hidden
      max-width: 180px
      margin-bottom: -5px
      text-overflow: ellipsis
      white-space: nowrap
    .checked
      display: inline-block
      width: 48px
      height: 18px
      line-height: 18px
      margin-left: 10px
      text-align: center
      border: 1px solid $blue
      color: $blue
      border-radius: 2px
    .bao
      display: inline-block
      width: 18px
      height: 18px
      line-height: 18px
      margin-left: 4px
      text-align: center
      border: 1px solid $orange
      color: $orange
      border-radius: 2px
    .info
      padding-left: 70px
  .inline {
    display: inline-block
  }
  .order-type
    display: inline-block
    height: 20px
    line-height: 20px
    font-size: 12px
    padding: 0 10px
    margin-left: 20px
    border-radius: 4px
    color: $blue
    border: 1px solid $blue
  .item-transfer
    background: #ECF5FE
    border: 1px solid #A4D0FF
    border-radius: 2px
    display: inline-block
    font-size: 12px
    color: #027CFF
    padding: 2px 7px
</style>
