<template>
  <div>
    <head-top>
      <span class="title" slot="index">{{userType == 1?'货主':'物流公司'}}-工作台</span>
      <div class="header-center" slot="menu">
        <head-menu-router activeLink="index"></head-menu-router>
      </div>
      <drop-down slot="info"></drop-down>
    </head-top>

    <div class="content clear" v-loading="loading">
      <div class="content-left">
        <left-menu-router-home :activeLink="userType == 1 ? 'source' : 'add'"></left-menu-router-home>
      </div>
      <div class="content-right">
        <div class="title-box"><span class="title-name">发布货源 > 选择承运人</span></div>
        <div class="container clear">
          <!--司机列表 物流公司 start-->
          <div class="car-list mtb20" :class="{wlgs:baseInfo[0].OrderWay == 1}" v-if="baseInfo.length > 0 && baseInfo[0].OrderWay === 1">
            <div class="list-menu">
              <ul>
                <li class="wlgs-1">司机信息</li>
                <li class="wlgs-2">泡货（元/m³）</li>
                <li class="wlgs-3">优惠</li>
                <li class="wlgs-4">重货（元/吨）</li>
                <li class="wlgs-5">优惠</li>
                <li class="wlgs-6">免费上门提货</li>
                <li class="wlgs-7">运费报价（元）<span class="bubble-text" @click="showQuotedExplain"><i class="el-icon-warning"></i></span></li>
                <li class="wlgs-8">操作</li>
              </ul>
            </div>
            <div class="list-content">
              <ul v-if="baseInfo.length>0">
                <li v-for="(item,index) in baseInfo" :key="index">
                  <div class="wlgs-1">
                    <span class="number">{{index+1}}</span>
                    <span class="car-name" @click="showInfo(item.Merchant)">{{item.Name.length < 10 ? item.Name :item.Name.substr(0,10) + '...' }}</span>
                    <span class="pass">已认证</span>
                    <span class="bao">保</span>
                  </div>
                  <span class="wlgs-2">{{item.LightPrice}}</span>
                  <span class="wlgs-3">{{item.RoutLightDecline}}%</span>
                  <span class="wlgs-4">{{item.HeavyPrice}}</span>
                  <span class="wlgs-5">{{item.RoutHeavyDecline}}%</span>
                  <span class="wlgs-6">{{item.MercCollect?item.MercCollect.CollectVolume:0}}m³/{{item.MercCollect?item.MercCollect.CollectWeight:0}}吨以上</span>
                  <span class="wlgs-7 orange-text">{{item.Freight}}</span>
                  <span class="wlgs-8">
                      <span v-if="!getUserRole(userCharacter,'财务')"
                            @click="choose(item.Merchant,item.Freight,item.RouteID,item.IsOrdeCarrier)">
                        {{item.IsOrdeCarrier ? '已选他承运' : '选他承运'}}</span>
                    </span>
                </li>
              </ul>
              <div v-else class="text-center mb-20">
                <p><img src="../../assets/images/null.png" alt="加载失败"></p>
                <p class="gray-txt">暂无匹配数据</p>
              </div>
            </div>
          </div>
          <!--司机列表 物流公司 end-->
          <!--司机列表 个体司机 start-->
          <div class="car-list" v-else="baseInfo.length > 0 && baseInfo[0].OrderWay !== 1">
            <div class="list-menu">
              <ul>
                <li class="first">司机信息</li>
                <li class="center">报价信息</li>
                <li class="last">操作</li>
              </ul>
            </div>
            <div class="list-content">
              <ul v-if="baseInfo.length>0">
                <li v-for="(item,index) in baseInfo" :key="index">
                  <div class="left">
                    <span class="number">{{index+1}}</span>
                    <span class="car-name" @click="showInfo(item.Merchant)">{{item.Name}}</span>
                    <span class="pass">已认证</span>
                    <span class="bao">保</span>
                  </div>
                  <div class="center">
                    <span class="center-item">泡货:<i class="orange-text">{{item.LightPrice}}元/m³</i></span>
                    <span class="center-item">重货:<i class="orange-text">{{item.HeavyPrice}}元/吨</i></span>
                    <span>运费报价：<i class="orange-text">¥{{item.Freight}} </i></span>
                  </div>
                  <div class="right">
                    <p v-if="!getUserRole(userCharacter,'财务')"
                       @click="choose(item.Merchant,item.Freight,item.RouteID, item.IsOrdeCarrier)">
                      {{item.IsOrdeCarrier ? '已选他承运' : '选他承运'}}</p>
                  </div>
                </li>
              </ul>
              <div v-else class="text-center mb-20 mt-60">
                <p><img src="../../assets/images/null.png" alt="加载失败"></p>
                <p class="gray-txt mt-20">暂无匹配数据</p>
              </div>
            </div>
          </div>
          <!--司机列表 个体司机 end-->
          <!--分页 start -->
          <div class="text-center mt-60">
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
          <!-- 运费价格解说弹框 start -->
          <quoted-explain-dialog :dialog="quotedExplainDialog"></quoted-explain-dialog>
          <!-- 运费价格解说弹框 end -->
        </div>
      </div>
    </div>

    <foot></foot>
    <el-dialog
      title="查看资质"
      :visible.sync="isShowInfo"
      width="1030px">
      <div class="info-content">
        <ul>
          <li>
            <div class="left-title">公司信息</div>
            <div>
              <span class="mr-20">{{companyInfo.MerchantName}}</span>
              <span>{{companyInfo.Address}}</span>
            </div>
          </li>
          <li v-if="companyInfo.CrowdType != 3">
            <div class="left-title">信用代码/注册号</div>
            <div>
              <span class="mr-10">{{companyInfo.LicenseCode}}</span>
              <!--<el-button type="primary" plain round size="mini">复制</el-button>-->
              <span class="gray-txt fr">前往国家企业信用信息公示系统“ <a href="http://www.gsxt.gov.cn" target="_blank">http://www.gsxt.gov.cn</a> ”查证公司信息</span>
            </div>
          </li>
          <li>
            <div class="left-title">联系方式</div>
            <div>
              <span>{{companyInfo.MerchantPhone}}</span>
            </div>
          </li>
          <li>
            <div class="left-title">车牌号码</div>
            <div>
              <span>{{companyInfo.TruckCode}}</span>
            </div>
          </li>
          <li>
            <div class="left-title">证件照片</div>
            <div class="pic-content">
              <ul>
                <li @click="setPicIndex(0)">
                  <p><img :src="imgUrl + companyInfo.Insurance" :onerror="errorImg" width="150" height="110"></p>
                  <p>车辆承运险</p>
                </li>
                <li @click="setPicIndex(1)" v-if="companyInfo.CrowdType == 2">
                  <p><img :src="imgUrl + companyInfo.LicensePicture" :onerror="errorImg" width="150" height="110"></p>
                  <p>营业执照</p>
                </li>
                <!-- <li @click="setPicIndex(2)">
                  <p><img :src="imgUrl + companyInfo.DrivePicture" width="150" height="110"></p>
                  <p>驾驶证照</p>
                </li> -->
                <li @click="setPicIndex(2)">
                  <p><img :src="imgUrl + companyInfo.RunPicture" :onerror="errorImg" width="150" height="110"></p>
                  <p>行驶证照</p>
                </li>
                <li @click="setPicIndex(3)">
                  <p><img :src="imgUrl + companyInfo.TruckPicture" :onerror="errorImg" width="150" height="110"></p>
                  <p>车头照</p>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>

      <el-dialog
        title="证件照片"
        :visible.sync="isShowPic"
        width="50%"
        v-if="PicList.length > 0"
        @close="close"
        append-to-body>
        <template>
          <p class="text-center red-text size20 bold">{{PicList[picIndex].title}}</p>
          <p class="text-center"><img :src="imgUrl + PicList[picIndex].value" :onerror="errorImg" alt="加载失败" width="100%"></p>
        </template>
      </el-dialog>

    </el-dialog>


  </div>
</template>
<script>
import m_login from '@/mixins/m_login'
import headTop from 'components/header/head'
import dropDown from 'components/header/children/dropdown'
import foot from 'components/footer/foot'
import leftMenuRouterHome from 'components/leftMenuRouter/leftMenuRouterHome' // 左侧
import headMenuRouter from 'components/headMenuRouter/headMenuRouter' // 头部
import {orderStatus} from 'config/statusManager'
import quotedExplainDialog from 'components/quotedExplainDialog/quotedExplainDialog' // 运费价格解说
import { getUserRole } from 'config/myUtils';
import {GetOrderQuoteList, chooseCompany, getCompanyInfo} from 'api/getData'
import {imgUrl, imgPostUrl} from "api/env"
export default {
  mixins: [m_login],
  data(){
     return {
       orderStatus,
       imgPostUrl,//图片请求地址
       imgUrl,//图片显示地址
       userType: this.$cookie.get("MemberCrowd"),
       loading: true,
       quotedExplainDialog: { visible: false }, // 判断解说弹框是否显示
       params: {
         PageIndex: 1, //	第几页
         PageSize: 10, //	每页记录数
       },
       TotalRecords: 0,
       baseInfo: [],
       companyInfo: {},
       isShowRate: false,//是否显示评价弹出层
       isShowInfo: false,//是否显示查看资质
       isShowPic: false,//是否显示证件照片
       errorImg: 'this.src="' + require('../../assets/images/errorimg.png') + '"',
       PicList: [],//资质图片
       picIndex: 0,//默认显示的图片
     }
  },
  computed:{
    isCarrier:function(){
      let flag = false;
       this.baseInfo.forEach(function(item){
           if(item.IsOrdeCarrier) flag = true;
       });
       return flag;
    }
  },
  methods: {
    getUserRole: getUserRole,
    async getCarrierList(){
      this.loading = true;

      let param = this.params;
      param.OrderID = this.$route.params.id;

      let { data: { ResultCode, ResultMessage, ResultValue, TotalRecords}} = await GetOrderQuoteList(param);

      if(ResultCode === '000000') {
          this.baseInfo = ResultValue;
          this.TotalRecords = TotalRecords;
      }

      this.loading = false;
    },
    showQuotedExplain () { // 显示报价解说弹框
      this.quotedExplainDialog.visible = true
    },
    async choose(MerchantID, Freight, RouteID, IsOrdeCarrier){
      if(IsOrdeCarrier) return;
      let _ = this;
      let orderID = _.$route.params.id;
      _.$confirm(_.isCarrier ? '您已选择承运司机，确定取消上个司机重新选择吗' : '确认要选他承运吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _.loading = true;
        chooseCompany({
          "OrderID": orderID,
          'MerchantID': MerchantID,
          'MemberID': _.$cookie.get('MemberID'),
          "Freight": Freight,
          "RouteID": RouteID || ''
        }).then(res => {
          console.log(res);
          _.loading = false;
          if (res.data.ResultCode === '000000') {
            if (res.data.ResultValue) {
              const h = _.$createElement;
              _.$confirm('', '您选择的司机报价和实际报价不符！', {
                confirmButtonText: '确定',
                message: h('div', {style: 'text-align: center'}, [
                  h('p', {style: 'color: #F55B23'}, '当前运费价格已发生变更！'),
                  h('p', {style: 'color: #F55B23'}, '当前报价：¥' + Freight + '，实际报价：¥' + res.data.ResultValue + ''),
                  h('p', {style: 'color: #F55B23'}, '请刷新页面获取最新的运费报价！'),
                ]),
              }).then(() => {
                _.getCarrierList();
              }).catch(() => {
                _.getCarrierList();
              })
            } else {
              _.isShowCarList = false;
              // 选择司机成功
              this.$router.replace({
                path: '/publishTipsPage',
                query: {
                  i: 'success',
                  tip: encodeURIComponent('恭喜您，选择承运人成功！'),
                  orderID: orderID
                }
              });

            }
          }
        });
      }).catch(e => {
        console.log(e);
      })
    },
    handleCurrentChange(val) {
      this.params.PageIndex = val;
      this.getCarrierList();
    },
    //设置图片显示
    setPicIndex(index) {
      console.log(this.companyInfo.CrowdType,index)
      if(this.companyInfo.CrowdType == 3 && index > 1){
        this.picIndex = index-1;
      } else {
        this.picIndex = index;
      }
      this.isShowPic = true;
    },
    // 关闭重置图片显示index
    close(){
      this.picIndex = 0;
    },
    //获取资质信息
    async showInfo(MerchantID) {
      this.isShowInfo = true;
      if(Object.keys(this.companyInfo).length > 0 ) return; //获取资质信息之后就可以不再调用了
      let res = await getCompanyInfo({MerchantID: MerchantID});
      if (res.data.ResultCode === '000000' && res.data.ResultValue) {
        let Data = res.data.ResultValue;
        this.companyInfo = Data;
        this.PicList = [];
        this.PicList.push({
          title: '车辆承运险照',
          value: Data.Insurance
        });
        if(Data.CrowdType == 2){
          this.PicList.push({
            title: '营业执照',
            value: Data.LicensePicture
          });
        }
        // this.PicList.push({
        //   title: '驾驶证照',
        //   value: Data.DrivePicture
        // });
        this.PicList.push({
          title: '行驶证照',
          value: Data.RunPicture
        });
        this.PicList.push({
          title: '车头照',
          value: Data.TruckPicture
        });
      }
    },
  },
  mounted(){},
  created(){
    let isLogin = this.checkLoginStatus();
    if(!isLogin) return;
    this.getCarrierList();
  },
  components: {
    headTop,
    dropDown,
    foot,
    leftMenuRouterHome, // 左侧导航
    headMenuRouter, // 左侧
    quotedExplainDialog
  }

}
</script>
<style lang="stylus" scoped>
  @import '../../assets/styles/template.styl';
  .el-tab-pane .car-list
    border-left: none
    border-right: none
    margin: 0 -16px
    border-bottom: 0
  .car-list
    border: 1px solid $borderColor
    .bubble-text
      color: $blue
      cursor: pointer
    .list-menu
      border-bottom: 1px solid $borderColor
      background-color: $theadbg
      ul
        overflow: hidden
        li
          height: 38px
          line-height: 38px
          float: left
        .wlgs-1
          width: 270px
          padding-left: 50px
        .wlgs-2, .wlgs-4
          width: 110px
        .wlgs-6, .wlgs-7
          width: 140px
        .bqdy-1
          width: 250px
          padding-left: 50px
        .bqdy-2
          width: 250px
        .bqdy-3
          width: 200px
    .list-content
      ul
        li
          padding: 20px 0
          border-top: 1px dashed $borderColor
          overflow: hidden
          line-height: 20px
          display: table
          width: 100%
          &:first-child
            border: none
          .wlgs-1, .wlgs-2, .wlgs-3, .wlgs-4, .wlgs-5, .wlgs-6, .wlgs-7, .wlgs-8, .bqdy-1, .bqdy-2, .bqdy-3, .bqdy-4
            display: table-cell
            vertical-align: middle
          .wlgs-1
            width: 300px
            padding-left: 20px
            .number
              display: inline-block
              width: 16px
              text-align: center
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
          .wlgs-2, .wlgs-4
            width: 110px
          .wlgs-6, .wlgs-7
            width: 140px
          .wlgs-8
            color: $blue
            cursor: pointer
          .bqdy-1
            width: 280px
            padding-left: 20px
            .name
              margin: 0 4px 0 10px
            .number
              display: inline-block
              width: 16px
              text-align: center
          .bqdy-2
            width: 250px
            .top
              font-size: 0
              .num
                display: inline-block
                vertical-align: middle
                width: 16px
                font-size: 14px
              i
                font-size: 12px
                margin-left: 7px
                cursor: pointer
                vertical-align: middle
                transition: all 0.3s
                &:hover
                  color: $blue
                &.tran
                  transform: rotate(180deg)
            .bot
              overflow: hidden
              margin-top: 5px
              display: none
              .code-des
                font-size: 12px
                color: #999
                width: 60px
                float: left
                overflow: hidden
              .code-list
                width: 190px
                overflow: hidden
                float: left
                font-size: 0
                > span
                  float: left
                  font-size: 12px
                  display: inline-block
                  width: 57px
              &.show
                display: block
          .bqdy-3
            width: 200px
    &.wlgs
      .list-menu
        ul
          .wlgs-1
            width: 230px
          .wlgs-2
            width: 102px
          .wlgs-3
            width: 50px
          .wlgs-4
            width: 102px
          .wlgs-5
            width: 50px
          .wlgs-6
            width: 110px
          .wlgs-7
            width: 130px
          .wlgs-8
            width: auto
      .list-content
        ul
          li
            .wlgs-1
              width: 260px
            .wlgs-2
              width: 102px
            .wlgs-3
              width: 50px
            .wlgs-4
              width: 102px
            .wlgs-5
              width: 50px
            .wlgs-6
              width: 110px
            .wlgs-7
              width: 110px
              padding-left: 20px
            .wlgs-8
              width: auto
  .rate-title
    float: left
    height: 20px
    line-height: 20px
    margin-right: 20px

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
  .car-list
    margin: 20px 0
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
          width: 250px
          padding-left: 50px
        .center
          width: 520px
          border: none
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
            width: 280px
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
            width: 520px
            overflow: hidden
            .center-item
              display: inline-block
              width: 170px
          .right
            float: left
            color: $blue
            cursor: pointer
</style>
