<!-- 有罪 还是cv了代码 -->
<template>
  <div>
    <head-top>
      <span class="title" slot="index">{{userType == 1?'货主':'物流公司'}}-工作台</span>
      <div class="header-center" slot="menu" v-if="userType == 1">
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
          <p class="title-box"><span class="title-name"><router-link :to="{path: '/sourceList'}">货源列表</router-link> <i
            class="el-icon-arrow-right"></i>货源详情页</span></p>
          <div class="container">
            <!--进度条 start -->
            <div class="step">
              <el-steps :active="stepType" align-center>
                <el-step title="已发布" description=""></el-step>
                <el-step title="待确认" description=""></el-step>
                <el-step title="待发货" description=""></el-step>
                <el-step title="运输中" description=""></el-step>
                <el-step title="已完成" description=""></el-step>
              </el-steps>
            </div>
            <!--进度条 end -->
            <!--中间 start-->
            <div class="center">
              <!--左侧-->
              <div class="center-left">
                <p class="title">货源编号：{{baseInfo.OrderCode}}</p>
                <ul>
                  <li class="size16 bold">{{baseInfo.FromCity}}<img src="../../assets/images/gofrom.png" alt="">{{baseInfo.ToCity}}
                  </li>
                  <li><span class="item-name">车长车型：</span>{{baseInfo.Long != 99?baseInfo.Long + 'm':'不限'}}/{{baseInfo.Model?baseInfo.Model:'不限'}}
                  </li>
                  <!--<li><span class="item-name">货物名称：</span>{{baseInfo.CargoName}}</li>-->
                  <li><span class="item-name">货物类型：</span>{{baseInfo.Classify}}</li>
                  <li><span class="item-name">体积重量：</span><span class="orange-text">{{baseInfo.Volume}}m³/{{baseInfo.Weight}}吨</span>
                  </li>
                  <li>
                    <span class="item-name">运<span style="display: inline-block;width:30px;"></span>费：</span><span class="orange-text">￥{{baseInfo.Freight}}</span>
                  </li>
                  <li><span class="item-name">装货时间：</span><span class="orange-text">{{baseInfo.LoadTime}}</span></li>
                  <li><span class="item-name">接单模式：</span><span>{{pattern[baseInfo.Parttern]}}</span></li>
                  <!-- 物流公司有结算方式 1 物流公司 2回头车-->
                  <li>
                    <span class="item-name fl">结算方式：</span>
                    <div>{{baseInfo.SettlementName}}</div>
                  </li>
                  <!--  settlement 1月结；2到付; -->
                  <li>
                    <span class="item-name fl" style="width:88px;" v-if="baseInfo.Receiver || baseInfo.ReceivePhone">收货方信息：</span>
                    <div class="remark" style="width:165px;" >{{baseInfo.Receiver}}  {{baseInfo.ReceivePhone}}</div>
                  </li>
                  <!-- 物流公司有结算方式 end -->

                  <li>
                    <span class="item-name fl">备注：</span>
                    <div class="remark" :title="baseInfo.Remark">{{baseInfo.Remark}}</div>
                  </li>
                </ul>
              </div>
              <!--右侧-->
              <div class="center-right">
                <div class="notify" v-if="baseInfo.OrderIsTransfer && baseInfo.OrderStatus >= orderStatus.ORDER_LOADING"><img class="warming" :src="warmingImg" alt="" width="25" height="25">运单已转单，请去转单货源处查看详情。</div>
                <div class="notify" v-if="!baseInfo.OrderIsTransfer"><img class="warming" :src="warmingImg" alt="" width="25" height="25">操作运单，请前往速达汇app端。</div>
                <div class="top">
                  <!--<p class="time-info">货源信息还有<span class="orange-text">{{}}天12小时</span>到装货时间，即将过期！</p>-->
                  <p class="size16">
                    货源状态：<span class="orange-text">{{baseInfo.OrderStatusName}}</span>
                  </p>
                  <p v-if="baseInfo.OrderStatus < 0" class="reason">{{baseInfo.CanceReason}}</p>

                </div>

                <div class="bottom" v-if="baseInfo.OrderStatus >= orderStatus.ORDER_CONFIRMED">
                  <p class="user-info">
                    <span>{{baseInfo.Parttern == 1 ? '抢单司机' : '承运司机'}}：</span>
                    <img :onerror="errorImg" :src="imgUrl + sendUser.MembIcon" width="30" height="30" alt="加载失败" >
                    <span>{{sendUser.Name}}</span>
                    <span class="checked">已认证</span>
                    <span class="bao">保</span>
                  </p>
                  <div class="list">
                    <ul>
                      <li v-if="[orderStatus.ORDER_RELEASED,orderStatus.ORDER_PUBLISHED,orderStatus.ORDER_PENDING].indexOf(baseInfo.OrderStatus) < 0"><span
                        class="gray-txt">{{baseInfo.Parttern == 1?'抢单时间':'承运时间'}}：</span>{{baseInfo.GrabTime}}
                      </li>
                      <li><span class="gray-txt">联系电话：</span>{{sendUser.Phone}}</li>
                      <li v-if="baseInfo.Parttern == 2 && baseInfo.OrderStatus != orderStatus.ORDER_RELEASED && baseInfo.OrderStatus != orderStatus.ORDER_PUBLISHED ">
                        <span class="gray-txt">运费：</span><span class="orange-text">￥{{baseInfo.Freight}}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <!--中间 end-->

            <!--底部信息产品 start-->
            <div class="mt-10">
              <el-tabs type="border-card">

                <el-tab-pane label="物流信息">
                  <div class="tabItem">
                    <p class="mb-20" v-if="baseInfo.OrderStatus >= this.orderStatus.ORDER_SHIPPED && baseInfo.LogisticsInfo">
                      <span class="mr-10" v-if="baseInfo.LogisticsInfo.UnloadRemark!='' && baseInfo.LogisticsInfo.UnloadPhotos!=''">卸货凭证： {{baseInfo.LogisticsInfo.UnloadRemark}}</span>
                      <span class="mr-10" v-if="baseInfo.LogisticsInfo.UnloadPhotos!=''">
                        <img v-for="item in baseInfo.LogisticsInfo.UnloadPhotos.split(',')" class="image cuspoint"
                             title="点击查看大图"
                             @click="shouBigPic(item)"
                             :onerror="errorImg"
                             :src="imgUrl + item" width="30" height="30">
                      </span>
                    </p>
                    <p class="mb-20" v-if="baseInfo.OrderStatus >= this.orderStatus.ORDER_SHIPPED && baseInfo.LogisticsInfo">
                      <span class="mr-10">
                        承运车辆： 车牌号码{{baseInfo.LogisticsInfo.Code}}
                      </span>
                      <span class="mr-10 cuspoint">
                        <img v-if="baseInfo.LogisticsInfo.DrivePicture" class="image"
                             :src="imgUrl + baseInfo.LogisticsInfo.DrivePicture" alt="加载失败" title="点击查看大图" width="30"
                             @click="shouBigPic(baseInfo.LogisticsInfo.DrivePicture)"
                             :onerror="errorImg"
                             height="30">
                      </span>
                      <span class="mr-10 cuspoint">
                        <img v-if="baseInfo.LogisticsInfo.RunPicture" class="image"
                             :src="imgUrl + baseInfo.LogisticsInfo.RunPicture" alt="加载失败" title="点击查看大图" width="30"
                             @click="shouBigPic(baseInfo.LogisticsInfo.RunPicture)"
                             :onerror="errorImg"
                             height="30">
                      </span>
                    </p>
                    <div v-if="baseInfo.OrderStatus >= orderStatus.ORDER_SHIPPED">
                      <div class="map-content" v-show="carPosition">
                        <div id="mymap" class="mymap"></div>
                      </div>
                      <div class="map-list" v-show="carPosition">
                        <p class="title">物流信息</p>
                        <el-steps align-center direction="vertical" space="20%" :active="1">
                          <el-step title="当前位置"
                                   :description="carPosition"></el-step>
                        </el-steps>
                      </div>
                    </div>
                    <div v-if="!carPosition" class="text-center">
                      <p><img src="../../assets/images/null.png" alt=""></p>
                      <p class="gray-txt">暂无物流信息</p>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="速达汇货运协议">
                  <div>
                    <p class="mb-10">最低价模式</p>
                    <div class="clear">
                      <span class="fl">【A-司机为个体司机】</span>
                      <div class="fl mb-20" style="width: 80%">
                        1.货主发布货源 > 2.货主选择app自动匹配司机的报价 > 3.被选中的司机确认承运 > 4.货主支付运费生成支付秘钥> 5.司
                           机运货，卸货后询问货主秘钥，收款 > 6.货主评价司机
                       </div>
                    </div>
                    <div class="clear">
                      <span class="fl">【B-司机为物流公司】</span>
                      <div class="fl" style="width: 80%">
                        1.货主发布货源 > 2.货主选择app自动匹配司机的报价 > 3.被选中的司机确认承运 > 4.司机运货卸货 > 5.货主评价司机
                       </div>
                    </div>
                    <p class="clear mt-40 mb-10">抢单模式</p>
                    <div>
                      <span class="fl">【A-司机为个体司机】</span>
                      <div class="fl mb-20" style="width: 80%">
                        1.货主发布货源 > 2.司机抢单 > 3.货主选择司机承运 > 4.货主支付运费生成支付秘钥 > 5.司机运货，卸货后询问货主秘钥，
                           收款 > 6.货主评价司机
                       </div>
                    </div>
                    <div class="clear mt-20">
                      <span class="fl">【B-司机为物流公司】</span>
                      <div class="fl" style="width: 80%">
                        1.货主发布货源 > 2.司机抢单 > 3.货主选择司机承运  > 4.司机运货卸货 > 5.货主评价司机
                       </div>
                    </div>
                    <p class="clear mt-20">特别说明: 本交易以《<a href="http://app.sdhwlw.com/Agreement/transport.html" target="_black">货物运输协议</a>》合约为准执行</p>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
            <!--底部信息产品 end-->
          </div>
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
  import AMap from 'AMap'
  import {imgUrl, imgPostUrl} from "api/env"
  import {
    GetOrderInfoForCompany,
    deleteOrder,
    getCarAddress,
    SnapshotGetPage // 获取快照一页
  } from 'api/getData'
  import { getUserRole } from 'config/myUtils'
  import {orderStatus, pattern} from 'config/statusManager'
  import leftMenuRouterHome from 'components/leftMenuRouter/leftMenuRouterHome' // 左侧
  import headMenuRouter from 'components/headMenuRouter/headMenuRouter' // 头部
  import m_login from '@/mixins/m_login'
  export default {
    mixins: [m_login],
    data() {
      return {
        errorImg: 'this.src="' + require('../../assets/images/errorimg.png') + '"',
        warmingImg: require('../../assets/images/warming@2x.png'),
        upLoadImgList: [], // 评价图片上传列表
        dialogImageUrl: '', // 评价图片上传当前点击路径
        dialogVisible: false, // 评价图片放大dialog
        userCharacter: this.$cookie.get("MemberDutiesID"),
        OrderID: '',
        orderStatus,
        pattern,
        AMap,//高德地图对象
        imgPostUrl,//图片请求地址
        imgUrl,//图片显示地址
        picIndex: 0,//默认显示的图片
        isShowCarList: true,//最低价模式是否显示司机列表
        isSetMap: false,//是否显示地图
        bigPic: '',//查看大图图片
        isShowBigPic: false,//是否显示大图
        carPosition: '',
        loading: false,
        userType: this.$cookie.get("MemberCrowd"),
        companyInfo: {},//资质信息
        PicList: [],//资质图片
        productInfo: [],//产品信息
        baseInfo: {},//货源基本信息
        sendUser: {},
        quotation: [], // 报价信息 快照 小星
        quotationRequest: { // 报价信息 查询条件 小星
          MemberID: this.$cookie.get('MemberID'),
          OrderID: '',
          PageIndex: 1,
          PageSize: 20,
          TotalRecords: 0
        }
      };
    },
    methods: {
      getUserRole: getUserRole,
      // 关闭重置图片显示index
      close(){
        this.picIndex = 0;
      },
      //初始化地图
      initMap() {
        let map = new AMap.Map("mymap", {
          resizeEnable: true,
          zoom: 15
        });
        getCarAddress({OrderCode: this.baseInfo.OrderCode}).then(res => {
          if (res.data.ResultCode == "000000") {
            let marker = new AMap.Marker({
              position: [res.data.ResultValue.lat, res.data.ResultValue.lon],
              draggable: false,
              raiseOnDrag: false,
              zIndex: 101,
              doubleClickZoom: false,
              keyboardEnable: false
            });
            marker.setMap(map);
            this.carPosition = res.data.ResultValue.province + res.data.ResultValue.city + res.data.ResultValue.country
          }
        });
      },
      //查看大图
      shouBigPic(img) {
        this.isShowBigPic = true;
        this.bigPic = img;
      },
      // 获取货源基本信息
      async getSource() {
        GetOrderInfoForCompany({OrderID: this.$route.params.id, MemberID: this.$cookie.get('MemberID')}).then(res => {
          if (res.data && res.data.ResultCode == '000000' && res.data.ResultValue) {
            this.baseInfo = res.data.ResultValue;
            if (res.data.ResultValue.Status >= this.orderStatus.ORDER_SHIPPED) {
              this.isSetMap = true;
            }
            this.OrderID = res.data.ResultValue.OrderID;
            this.sendUser = res.data.ResultValue.Merchant;
            this.loading = false;
          }
        }).catch(err => {
          this.$router.push('/add');
        })
      },
      //待确认状态取消订单
      async deleteOrder(OrderID, OrderCode) {
        this.$prompt('请输入取消原因', '取消订单', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: regs.Required,
          inputPlaceholder: '请输入取消原因',
          inputType: 'textarea',
          inputErrorMessage: '请输入取消原因'
        }).then(({value}) => {
          deleteOrder({
            'Reason': value,
            'OrderID': OrderID,
            'OrderCode': OrderCode,
            'MemberID': this.$cookie.get('MemberID')
          }).then(res => {
            if (res.data.ResultCode === '000000') {
              this.$message.success({message: res.data.ResultMessage});
              this.getSource();
            }
          })
        })
      },
    },
    computed: {
      //设置进度条的状态
      stepType() {
        let status = this.baseInfo.OrderStatus;
        if (status == orderStatus.ORDER_PUBLISHED ) { //已发布
          return 1;
        } else if (status == orderStatus.ORDER_CONFIRMED) { //待确认
          return 2;
        }else if (status == orderStatus.ORDER_LOADING || status == orderStatus.ORDER_SHIPPED) { //待发货
          return 3;
        } else if (status == orderStatus.ORDER_SHIPPED) { //运输中
          return 4;
        } else if (status >= orderStatus.ORDER_ARRIVED){ //已完成
          return 5
        } else {
          return 0;
        }
      },
      // 设置默认显示图片的index
      pictureIndex(){
        return this.picIndex
      }
    },
    watch: {
      isSetMap(newVal,oldVal){
        if(newVal){
          setTimeout(() => {
            this.initMap();
          }, 20)
        }
      }
    },
    created() {
      this.loading = true;
      let isLogin = this.checkLoginStatus();
      if(!isLogin) return;
      let _ = this;
      let identityPass = this.checkLoginIdentity(2, '/add', function(){
        _.getSource();
      });
    },
    mounted() {
      let that = this;
      if(that.baseInfo.OrderID){
        this.initMap();
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

<style lang="stylus" scoped>
  @import "../../assets/styles/variable.styl"
  .content
    position: relative
    width: 1200px
    margin: 10px auto 40px

  .content-left
    float: left
    width: 200px
    background: #ffffff
    > ul
      position: absolute
      width: 200px
      height: 100%
      background-color: #fff
      > li
        height: 30px
        line-height: 30px
        padding-left: 40px
        margin: 10px 0
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

  .step
    width: 100%
    margin: 10px 0 20px

  .center
    overflow: hidden
    border: 1px solid $borderColor
    .center-left
      float: left
      width: 300px
      border-right: 1px solid $borderColor
      .title
        height: 40px
        line-height: 40px
        padding-left: 20px
        background-color: $theadbg
        border-bottom: 1px solid $borderColor
      ul
        padding: 20px 20px
        li
          margin-bottom: 20px
          overflow: hidden
          // text-overflow: ellipsis
          // white-space: nowrap
          &:last-child
            margin-bottom: 0
            clear: both
            overflow: hidden
      .item-name
        display: inline-block
        width: 80px
        color: $gray
        text-align: justify;
        text-justify: distribute-all-lines
        text-align-last: justify
      .remark
        float: left
        width: 180px

    .center-right
      float: left
      width: 606px
      position:relative
      .warming
        display: inline-block;
        margin: 6px 20px 8px
      .notify
        background: #FFFEF6
        border: 1px solid #FFC1AB
        font-size: 14px
        color: #E40000
        position:absolute
        width: 606px
        left: -1px
        top: 0

      .bottom
        border-top: 1px dashed $borderColor
      .top
        position: relative
        padding: 60px 60px 20px
      .reason
        margin-left: 80px
        margin-top: 6px
        color: $gray
        font-size: 14px
      .key
        display: inline-block
        height: 26px
        line-height: 26px
        background: #FFFFFF
        color: #027CFF
        border: 1px solid #8BCAF9
        border-radius: 4px
        .left
          float: left
          width: 70px
          font-size: 12px
          text-align: center
          background: #D8F2FE
        .right
          padding: 0 10px
      .time-info
        position: absolute
        top: 0
        left: 0
        width: 95.99%
        padding-left: 4%
        height: 40px
        line-height: 40px
        border: 1px solid $orange
        background-color: #FFFEF6
      .normal
        width: 90px
      .info-list
        margin-top: 20px
      .bottom
        padding: 20px 60px 40px
        .user-info
          height: 30px
          line-height: 30px
          img
            vertical-align: middle
        .checked
          display: inline-block
          width: 48px
          height: 18px
          line-height: 18px
          margin-left: 10px
          font-size: 12px
          text-align: center
          border: 1px solid $blue
          border-radius: 2px
          color: $blue
        .bao
          display: inline-block
          width: 18px
          height: 18px
          line-height: 18px
          margin-left: 10px
          font-size: 12px
          text-align: center
          border: 1px solid $orange
          border-radius: 2px
          color: $orange
        .list
          margin: 20px 70px 0
          li
            height: 20px
            line-height: 20px
            margin: 10px 0
  .mtb20
    margin: 20px 0;
  .el-tab-pane .car-list
    border-left: none;
    border-right: none;
    margin: 0 -15px;

  .car-list
    border: 1px solid $borderColor
    .list-menu
      border-bottom: 1px solid $borderColor
      background-color: $theadbg
      ul
        overflow: hidden
        li
          height: 38px
          line-height: 38px
          float: left
        .first
          width: 270px
          padding-left: 50px
        .width100
          width: 110px
        .width140
          width: 140px
    .list-content
      ul
        li
          padding: 20px 0
          border-top: 1px dashed $borderColor
          overflow: hidden
          &:first-child
            border: none
          .left
            float: left
            width: 300px
            padding-left: 20px
            .car-name
              cursor: pointer
              margin: 0 4px 0 10px
              &:hover
                color: $blue
            .pass
              padding: 2px 4px
              font-size: 12px
              border: 1px solid $blue
              color: $blue
              border-radius: 2px
            .bao
              display: inline-block
              width: 20px
              height: 20px
              line-height: 20px
              text-align: center
              font-size: 12px
              border: 1px solid $orange
              color: $orange
              border-radius: 2px
          .center
            float: left
            border: none
            overflow: hidden
            .item-content
              float left
              width: 110px
            .center-item
              float left
              width: 140px
          .right
            float: left
            color: $blue
            cursor: pointer


  .footer-btn
    text-align: center
    margin-top: 20px

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

  .map-content
    float: left
    width: 60%
    padding-bottom: 20px
    .mymap
      width: 500px
      height: 500px

  .img-box
    width: 500px
    height: 500px
    margin: 0 auto

  .map-list
    float: left
    width: 40%
    height: 500px
    .title
      height: 40px
      line-height: 40px
      margin-bottom: 20px
      text-align: center
      background-color: $theadbg
      border: 1px solid $borderColor

  .container
    padding: 30px 40px
  .product-name
    width: 200px
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap

  .model-name
    float: left
    max-width: 98px
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap

  .tabItem
    min-height: 310px
  .carImg
    width: 800px
    height: 600px

</style>
