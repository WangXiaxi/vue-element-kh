<template>
  <div>
    <head-top>
      <span class="title" slot="index">{{userType == 1?'货主':'物流公司'}}-工作台</span>
      <div class="header-center" slot="menu">
        <head-menu-router activeLink="index"></head-menu-router>
      </div>
      <drop-down slot="info"></drop-down>
    </head-top>
    <div class="content clear">
      <div class="content-left">
        <left-menu-router-home activeLink="orderList"></left-menu-router-home>
      </div>
      <div class="content-right">
        <div class="main fr">
          <p class="title-box"><span class="title-name">货源列表</span></p>
          <!--货源列表 start-->
          <div class="container clear" v-loading="loading">
            <!--头部条件 start-->
            <div class="top-sort">
              <ul>
                <li>货源列表：</li>
                <li :class="[status == currentOrderStatus ? 'active' : '']" v-for="(status,name) in orderListStatus" @click="currentOrderStatus = status">{{name}}</li>
              </ul>
            </div>
            <!-- 物流公司货源列表只有个体司机能接默认 cartype = 2 -->
          <!--   <div class="top-sort">
              <ul>
                <li>货运类型：</li>
                <li :class="[(CarType == 999) ? 'active' : '']" @click="CarType = 999">全部</li>
                <li :class="[(CarType == 1) ? 'active' : '']" @click="CarType = 1">物流公司</li>
                <li :class="[(CarType == 2) ? 'active' : '']" @click="CarType = 2">个体司机</li>
              </ul>
            </div> -->
            <div class="top-sort">
              <ul>
                <li>接单模式：</li>
                <li :class="[(getOrderType == ' ') ? 'active' : '']" @click="getOrderType = ' '">全部</li>
                <li :class="[(getOrderType == 2) ? 'active' : '']" @click="getOrderType = 2">最低价</li>
                <li :class="[(getOrderType == 1) ? 'active' : '']" @click="getOrderType = 1">抢单</li>
              </ul>
            </div>
            <div>
              <el-cascader class="small-item"
                           :options="address"
                           placeholder="请选择发货地"
                           v-model="fromAddress"
                           size="small"
                           clearable
                           change-on-select
              ></el-cascader>
              <span><img src="../../assets/images/gofrom.png" alt=""></span>
              <el-cascader class="small-item"
                           :options="address"
                           v-model="toAddress"
                           placeholder="请选择收货地"
                           change-on-select
                           clearable
                           size="small"
              ></el-cascader>
              <span class="ml-20">发布时间:</span>
              <el-date-picker
                v-model="timeRange"
                type="daterange"
                size="small"
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
                      <li>货源单号：{{item.Code}}</li>
                      <li>发布时间：{{item.Create.slice(0,19)}}</li>
                      <li>装货时间：{{item.LoadTime.slice(0,16)}}</li>
                    </ul>
                    <span class="fr" :style="{color : showOrderStatusColor(item.Status)}">{{item.StatusName}}</span>
                  </div>
                  <!--头标题 end-->
                  <div class="main-list">
                    <!--物流信息 start-->
                    <div class="main-top">
                      <div class="top-left">
                        <p class="origin"><span>{{item.FromCity}}
                          <img src="../../assets/images/gofrom.png" alt="">
                          {{item.ToCity}}</span>
                          <span class="order-type">{{item.Parttern==1?'抢单模式':'最低价模式'}}</span>
                          <span class="item-transfer"  v-if="item.OrderIsTransfer">转单货源</span>
                        </p>
                        <div class="info">
                          <ul>
                            <li><span class="name">货物类型：</span>{{item.Classify}}</li>
                            <li><span class="name">运输类型：</span>{{item.Way == 1?'物流公司':'个体司机'}}</li>
                            <li><span class="name">体积重量：</span><span class="orange-text">{{item.Volume}}m³/{{item.Weight}}吨</span>
                            </li>
                            <li><span class="name">货物名称：</span><span class="orange">{{item.CargoName}}</span></li>
                            <li><span class="name">车长车型：</span>{{item.Long == 99?'不限':item.Long}} <span v-if="item.Long != 99">m</span> /{{item.Model?item.Model:'不限'}}</li>
                            <!-- <li><span class="name">提货方式：</span>{{deliveryTypeText(item.DeliveryMode)}}</li> -->
                            <li v-if="item.Parttern == 1"><span class="name">运费：</span><span class="orange-text">￥{{item.Freight}}</span></li>
                          </ul>
                        </div>
                      </div>
                      <div class="btn-box">
                        <!-- Parttern 1 抢单 2 最低价 -->
                        <!--         1 待发布 2 已发布 3 待确认 4 待发货 5 运输中 6 已到达 7 已评价 -1 已关闭 -2 已取消 -3 取消中 -4 拒绝取消        老状态-->
                        <!--订单状态：1待发布；5已发布；10待确认；15已确认；20已装货；25已发货；30已到达；35已评价；-5已删除；-10已关闭；-15申请取消；-20取消被拒；-25已取消；       新状态-->
                        <!-- <p class="mt-6" v-if="item.Status == orderStatus.ORDER_RELEASED && !getUserRole(userCharacter,'财务')"><span class="blue-txt cuspoint"
                                                                      @click="sourceCommit(item.OrdeID,index)">立即发布</span>
                        </p> -->
                        <!-- <p class="mt-6" v-if="item.Status == orderStatus.ORDER_RELEASED && !getUserRole(userCharacter,'财务')">
                          <router-link :to="{path: '/add/'+ item.OrdeID}">编辑</router-link>
                        </p> -->

                        <!-- 小星 重发 -->
                        <p class="mt-6" v-if="item.Status == orderStatus.ORDER_PUBLISHED && !getUserRole(userCharacter,'财务')"><span class="blue-txt cuspoint" @click="SendAgain(item.OrdeID, item.Code, index)">重发</span></p>

                        <p class="mt-6" v-if="item.Status == orderStatus.ORDER_PUBLISHED && !getUserRole(userCharacter,'财务')"><span class="blue-txt cuspoint"
                                                                      @click="canSource(item.OrdeID,item.Code,index)">撤销货源</span>
                        </p>
                        <p class="mt-6" v-if="item.Status == orderStatus.ORDER_PENDING && !getUserRole(userCharacter,'财务')"><span class="blue-txt cuspoint"
                                                                      @click="canSource(item.OrdeID,item.Code,index)">撤销货源</span>
                        </p>
                        <p class="mt-6" v-if="item.Status == orderStatus.ORDER_CONFIRMED && !getUserRole(userCharacter,'财务')"><span class="blue-txt cuspoint"
                                                                      @click="cancelOrder(item.OrdeID,item.Code,index)">取消运单</span>
                        </p>
                        <p class="mt-6"
                           v-if="item.Status == orderStatus.ORDER_CONFIRMED && item.Grab.CrowdType == 3 && item.PayResult != 1 && !getUserRole(userCharacter,'财务')">
                          <router-link :to="{path: '/payment',query:{orderid: item.OrdeID}}">支付运费</router-link>
                        </p>
                        <p class="mt-6" v-if="item.Status == orderStatus.ORDER_SHIPPED">
                          <router-link :to="{path: '/orderDetails/'+item.OrdeID}">查看物流</router-link>
                        </p>
                        <p class="mt-6" v-if="item.Status == orderStatus.ORDER_ARRIVED && (item.Evaluated == 0) && !getUserRole(userCharacter,'财务')"><span class="blue-txt cuspoint"
                                                                                               @click="OrderRate(item.OrdeID,item.Grab.CrowdType,item.Grab.Name,index)">评价</span>
                        </p>
                        <p class="mt-6" v-if="item.Status == orderStatus.ORDER_APPLY_CANCEL && item.Nullifier == 1 && !getUserRole(userCharacter,'财务')"><span class="blue-txt cuspoint"
                                                                                              @click="backOrder(item.OrdeID,item.Code,index)">撤回申请</span>
                        </p>
                        <p class="mt-6" v-if="item.Status == orderStatus.ORDER_APPLY_CANCEL && item.Nullifier == 2 && !getUserRole(userCharacter,'财务')"><span class="blue-txt cuspoint"
                                                                                              @click="agreeCancelOrder(item.OrdeID,item.Code,item.Grab.MerchantID,index)">同意申请</span>
                        </p>
                        <p class="mt-6" v-if="item.Status == orderStatus.ORDER_APPLY_CANCEL && item.Nullifier == 2 && !getUserRole(userCharacter,'财务')"><span class="blue-txt cuspoint"
                                                                                              @click="disAgreeCan(item.OrdeID,item.Code,item.Grab.MerchantID,index)">拒绝申请</span>
                        </p>
                        <p class="mt-6" v-if="(item.Status == orderStatus.ORDER_CLOSED
                        || item.Status == orderStatus.ORDER_EVALUATION
                        || item.Status == orderStatus.ORDER_CANCELED) && !getUserRole(userCharacter,'财务')">
                          <router-link :to="{name: 'add',params:{id: item.OrdeID,type: 1}}">再发一单</router-link>
                        </p>
                        <p class="mt-6" v-if="item.Status == orderStatus.ORDER_REJECT_CANCEL"><span class="blue-txt cuspoint" @click="serviceTip">联系客服</span>
                        </p>
                        <p class="mt-6">
                          <router-link :to="{path: '/orderDetails/'+item.OrdeID}">查看详情</router-link>
                        </p>
                      </div>
                    </div>
                    <!--物流信息 end-->
                    <!--最低价信息 start-->
                    <div class="main-top main-top1" v-if="item.Parttern == 2 && item.Status == orderStatus.ORDER_PUBLISHED">
                      <div class="top-left">
                        <div class="info">
                          <ul>
                            <li><span class="name">接单模式：</span><span
                              class="orange">{{item.Parttern==1?'抢单':'最低价'}}</span></li>
                            <li><span class="name">货运公司：</span>{{item.Grab.MatchingCount?item.Grab.MatchingCount:'0'}}家
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div class="btn-box">
                        <router-link :to="{path: '/carrier/'+item.OrdeID}">查看报价</router-link>
                      </div>
                    </div>
                    <!--最低价信息 end-->

                    <!--承运人信息 start-->
                    <div class="main-footer"
                         v-if="!(item.Status == undefined
                         || item.Status == ''
                         || item.Status == orderStatus.ORDER_RELEASED
                         || item.Status == orderStatus.ORDER_PUBLISHED
                         || item.Status == orderStatus.ORDER_CLOSED)">
                      <div class="footer-left" v-if="(item.Status!=orderStatus.ORDER_RELEASED || item.Status!=orderStatus.ORDER_PUBLISHED) && item.Grab">
                         <div class="use-box">
                          <div class="box-left">
                            <div class="">
                              <div class="fl">
                                <span v-if="item.Parttern ==1">抢单司机：</span>
                                <span v-else>承运司机：</span>
                              </div>
                              <div class="info">
                                <img class="fl" :src="imgUrl + item.Grab.Logo" :onerror="errorImg" alt="加载失败" width="30" height="30">
                                <p class="user-name">{{item.Grab.Name}}</p>
                                <span class="checked" v-if="item.Status">已认证</span>
                                <span class="bao">保</span>
                                <p v-if="item.Grab.MercCollect && item.Way == 2" class="mt-10"><span class="gray-txt">免费上门提货：</span> {{item.Grab.MercCollect.CollectVolume}}m³以上，{{item.Grab.MercCollect.CollectWeight}}吨以上  </p>
                              </div>
                            </div>
                          </div>
                          <div class="box-right">
                            <p class="mb-10"><span class="gray-txt">联系电话：</span>{{item.Grab.Phone}}</p>
                            <p v-if="item.Parttern == 1"><span class="gray-txt">抢单时间：</span>{{item.GrabTime.slice(0,19)}}</p>
                            <p v-if="item.Parttern == 2 && item.Status != orderStatus.ORDER_RELEASED && item.Status != orderStatus.ORDER_PUBLISHED"><span class="gray-txt name">运费：</span> <span class="orange-text">￥{{item.Freight}} </span></p>
                          </div>
                        </div>
                        <!-- <div class="user mt4">
                          <span v-if="item.Parttern ==1">抢单司机：</span>
                          <span v-else>承运司机：</span>
                          <img :src="imgUrl + item.Grab.Logo" alt="加载失败" width="30" height="30">
                          <p class="user-name">{{item.Grab.Name}}</p>
                          <span class="checked" v-if="item.Status">已认证</span>
                          <span class="bao">保</span>
                        </div> -->
                        <!-- <div class="user">
                          <p class="mt-14 ml-70" v-if="item.Parttern == 1"><span class="gray-txt">抢单时间：</span>{{item.GrabTime.slice(0,19)}}</p>
                          <p v-else><span class="gray-txt" >运      费：</span> ￥{{item.Freight}} </p>0571-57137790
                        </div>
                        <div>
                          <p v-if="item.Grab.MercCollect"><span class="gray-txt">免费上门提货：</span> {{item.Grab.MercCollect.CollectVolume}}m³以上，{{item.Grab.MercCollect.CollectWeight}}吨以上 </p>
                          <p :class="item.Grab.MercCollect?'mt-20':''"><span class="gray-txt">联系电话：</span>{{item.Grab.Phone}}</p>
                        </div> -->
                      </div>
                      <div>
                        <p class="cuspoint"><span class="blue-txt" @click="showInfo(item.Grab.MerchantID)">查看资质</span>
                        </p>
                        <p v-if="item.Status == orderStatus.ORDER_PENDING && item.Parttern == 1 && !getUserRole(userCharacter,'财务')" class="mt-6"><span class="blue-txt cuspoint"
                                                                                            @click="checked(item.OrdeID,item.Code,item.Grab.MerchantID,item.Way,index)">选他承运</span>
                        </p>
                        <router-link tag="p" :to="{path: '/carrier/'+item.OrdeID}" v-if="item.Status == orderStatus.ORDER_PENDING && item.Parttern == 2 && !getUserRole(userCharacter,'财务')" class="mt-6"><span class="blue-txt cuspoint">更换司机</span>
                        </router-link>
                      </div>
                    </div>
                    <!--承运人信息 end-->

                    <!-- 状态图标 -->
                    <span class="status-icon" v-if="item.Status == orderStatus.ORDER_CLOSED"><img src="../../assets/images/close.png"></span>
                    <span class="status-icon" v-if="item.Status == orderStatus.ORDER_ARRIVED"><img
                      src="../../assets/images/finished.png"></span>
                  </div>
                </li>
              </ul>
              <div v-if="req.TotalRecords == 0" class="text-center mt-40">
                <p><img src="../../assets/images/null.png"></p>
                <p>暂无数据</p>
              </div>
            </div>
            <!-- 列表内容 end -->
            <!--分页 start -->
            <div class="text-center mt-60" v-if="req.TotalRecords != 0">
              <el-pagination
                background
                @current-change="handleCurrentChange"
                :page-size="req.PageSize"
                :current-page.sync="req.PageIndex"
                layout="total, prev, pager, next"
                :total="req.TotalRecords">
              </el-pagination>
            </div>
            <!--分页 end -->
          </div>
          <!--货源列表 end-->
        </div>
      </div>
    </div>
    <foot></foot>
    <!--查看资质弹出层 start -->
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
                  <p><img :onerror="errorImg" :src="imgUrl + companyInfo.Insurance" width="150" height="110"></p>
                  <p>车辆承运险</p>
                </li>
                <li @click="setPicIndex(1)" v-if="companyInfo.CrowdType == 2">
                  <p><img :onerror="errorImg" :src="imgUrl + companyInfo.LicensePicture" width="150" height="110"></p>
                  <p>营业执照</p>
                </li>
                <!-- <li @click="setPicIndex(2)">
                  <p><img :src="imgUrl + companyInfo.DrivePicture" width="150" height="110"></p>
                  <p>驾驶证照</p>
                </li> -->
                <li @click="setPicIndex(2)">
                  <p><img :onerror="errorImg" :src="imgUrl + companyInfo.RunPicture" width="150" height="110"></p>
                  <p>行驶证照</p>
                </li>
                <li @click="setPicIndex(3)">
                  <p><img :onerror="errorImg" :src="imgUrl + companyInfo.TruckPicture" width="150" height="110"></p>
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
        width="1000px"
        append-to-body>
        <template>
          <el-carousel
            :interval="4000"
            height="600px"
            v-if="isShowPic"
            :initial-index="pictureIndex"
          >
            <el-carousel-item v-for="(Pic,index) in PicList" :key="index">
              <p class="text-center red-text size20 bold">{{Pic.title}}</p>
              <p class="text-center"><img  :onerror="errorImg" :src="imgUrl + Pic.value" alt="加载失败" width="800px" height="600px"></p>
            </el-carousel-item>
          </el-carousel>
        </template>
      </el-dialog>

    </el-dialog>
    <!--查看资质弹出层 end -->

    <!--评价弹出层 start -->
    <el-dialog
      title="评价"
      :visible.sync="isShowRate"
      width="700px">
      <div>
        <div>
          <span class="rate-title">司机态度</span>
          <div class="clear">
            <el-rate
              v-model="rate.Attitude"
              :allow-half="true"
              show-text>
            </el-rate>
          </div>
        </div>
        <div class="mt-20">
          <span class="rate-title">司机服务</span>
          <div class="clear">
            <el-rate
              v-model="rate.Service"
              :allow-half="true"
              show-text>
            </el-rate>
          </div>
        </div>
        <p class="mt-20">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入评价内容"
            v-model="rate.Info">
          </el-input>
        </p>
        <!-- 评价截图 -->
        <div class="mt-20">
          <el-upload
            class="rated-upload"
            action=""
            list-type="picture-card"
            :file-list="upLoadImgList"
            :http-request="httpPicUpload"
            :on-preview="handlePictureCardPreview"
            :before-upload="beforeUpload"
            :limit="5"
            :on-change="UpImageChange"
            :before-remove="beforeRemoveImg"
            :on-exceed="onExceedImg"
            >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>

        <p class="text-center mt-20">
          <el-checkbox v-model="rate.Black">将<span class="orange-text">{{rate.Name}}</span>拉入黑名单</el-checkbox>
        </p>
        <div>
          <div slot="footer" class="dialog-footer footer-btn">
            <el-button @click="isShowRate = false">取消</el-button>
            <el-button type="primary" @click="rateCommit">确 定</el-button>
          </div>
        </div>
      </div>
      <div>
      </div>
    </el-dialog>
    <!--评价弹出层 end -->

    <!-- 取消订单弹出层 start -->
    <el-dialog
      title="取消货源"
      :visible.sync="isShowCancel1"
      width="500px"
    >
      <div>
        <el-input
          type="textarea"
          :rows="4"
          v-model="cancelReason"
          :autosize="{ minRows: 3, maxRows: 5}"
          placeholder="请输入取消原因"
        >
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
    <div class="text-center">
      <el-button
        type="primary"
        class="cancel-btn"
        @click="isShowCancel = false"
        round
        width="200px"
        height="40px"
      >确 定</el-button>
      <p class="text-center red-text mt-10">*申请免费取消，若对方拒绝，则自动扣除200元的罚款给司机</p>
    </div>
  </span>
    </el-dialog>
    <el-dialog
      title="取消货源"
      :visible.sync="isShowCancel2"
      width="600px"
    >
      <div>
        <p class="mb-20 text-center"><i class="el-icon-info warning"></i></p>
        <p class="size16 text-center mb-10">您的货源已支付，司机正在来的路上</p>
        <div class="tip-list">
          <p class="size14 gray-txt"><i class="circle"></i>和司机沟通达成一致后，选择申请免费取消。</p>
          <p class="size14 gray-txt"><i class="circle"></i>选择接受罚款取消，直接取消订单赔偿司机油费。</p>
          <p class="size14 gray-txt"><i class="circle"></i>因司机缘故取消，请联系客服投诉：<i class="blue-txt">0571-57137790</i>。</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
    <div class="text-center">
      <el-button
        type="primary"
        class="cancel-btn"
        @click="isShowCancel = false"
        round
        width="200px"
        height="40px"
      >申请免费取消</el-button>
      <el-button
        type="primary"
        plain
        class="cancel-btn"
        @click="isShowCancel = false"
        round
        width="200px"
        height="40px"
      >接受罚款(￥200.00)取消</el-button>
    </div>
  </span>
    </el-dialog>
    <!-- 取消订单弹出层 end -->
    <!-- 图片放大弹框 start -->
    <el-dialog :visible.sync="dialogVisible" width="600px">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <!-- 图片放大弹框 end -->
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
    PicUpload,
    getSourceList,
    getCompanyInfo,
    chooseCompany,
    cancelSource,
    sourceCommit,
    deleteOrder,
    cancelOrder,
    backOrder,
    agreeCancel,
    disAgreeCancel,
    CancelCarrier,
    rate1,
    rate2,
    rate4,
    SendAgain // 重发接口
  } from 'api/getData'
  import { getUserRole } from 'config/myUtils';
  import { orderStatus, showOrderStatusColor } from 'config/statusManager'
  import leftMenuRouterHome from 'components/leftMenuRouter/leftMenuRouterHome'; // 左侧
  import headMenuRouter from 'components/headMenuRouter/headMenuRouter'; // 头部
  import m_login from '@/mixins/m_login';

  export default {
    mixins: [m_login],
    data() {
      return {
        errorImg: 'this.src="' + require('../../assets/images/errorimg.png') + '"',
        upLoadImgList: [], // 评价图片上传列表
        dialogImageUrl: '', // 评价图片上传当前点击路径
        dialogVisible: false, // 评价图片放大dialog
        orderStatus,
        imgUrl,
        imgPostUrl,
        picIndex: 0,//默认显示的图片
        loading: false,
        rate: {//评价参数
          Name: '',
          Attitude: 5,
          Service: 5,
          Validity: '',
          Info: '',
          OrderID: '',
          MemberID: '',
          Picture: '',
          Type: '',
          Black: false
        },
        getOrderType: ' ',//接单模式
        ratePic: [],//评价图片
        fromAddress: [],//收货地
        toAddress: [],//发货地
        timeRange: [],//发布时间
        cancelReason: '',//取消原因
        cancelCompany: false,//是否拉入黑名单
        isShowInfo: false,//是否显示查看资质
        isShowPic: false,//是否显示证件照片
        isShowRate: false,//是否显示评价弹出层
        isShowCancel1: false,//是否显示取消弹出层
        isShowCancel2: false,//是否显示取消弹出层
        address: address.area,//城市数据
        currentOrderStatus: 999,//订单状态
        CarType: 2,//货运类型
        listData: [],//订单列表
        companyInfo: {//资质信息
        },
        PicList: [],// 资质图片
        req: {//获取列表请求参数
          MemberID: '',
          Status: 999,
          Way: 999,
          FromCity: '',
          ToCity: '',
          CreateStart: '',
          CreateEnd: '',
          Parttern: ' ',
          PageIndex: 1,
          PageSize: 10,
          TotalRecords: 0,
          index: ''
        },
        orderListStatus: {
          '全部' :    999,
          '待确认' :  orderStatus.ORDER_PENDING,
          '已发布' :  orderStatus.ORDER_PUBLISHED,
          '待发货' :  orderStatus.ORDER_CONFIRMED,
          '运输中' :  orderStatus.ORDER_SHIPPED,
          '已到达' :  orderStatus.ORDER_ARRIVED,
          '已评价' :  orderStatus.ORDER_EVALUATION,
          '取消中' :  orderStatus.ORDER_APPLY_CANCEL,
          '拒绝取消' : orderStatus.ORDER_REJECT_CANCEL,
          '已关闭' :  orderStatus.ORDER_CLOSED,
          // '待发布' :  orderStatus.ORDER_RELEASED // 工厂发货才有
        }
      }
    },
    methods: {
      showOrderStatusColor: showOrderStatusColor,
      getUserRole: getUserRole,
      async SendAgain (orderID, code, index) { // 重发操作
        let params = {OrderID: orderID}
        this.loading = true;
        const { data: { ResultCode, ResultValue, ResultMessage, TotalRecords }} = await SendAgain(params);
        this.loading = false;
        if (ResultCode === '000000') {
          this.$message.success({message: ResultMessage});
          this.handleCurrentChange(1); // 重发后刷新列表
        }
      },
      rateReset (data) { // 重置评价表单
        this.rate.Name = '';
        this.rate.Attitude = 5;
        this.rate.Service = 5;
        this.rate.Validity = '';
        this.rate.Info = '';
        this.rate.OrderID = '';
        this.rate.MemberID = '';
        this.rate.Picture = '';
        this.rate.Type = '';
        this.rate.Black = false;
        this.upLoadImgList = [];
      },
      imgArrToString (data) { // 数组提取url 转成字符串
        let arr = []
        data.forEach((cur) => {
          arr.push(cur.needUrl)
        })
        return arr.join(",")
      },
      onExceedImg () { // 图片上传限制最大后操作
        this.$message.info({message: '已超出最大上传数量！'});
      },
      beforeRemoveImg (data) { // 评论删除图片执行方法
        this.upLoadImgList.forEach((cur, index) => {
          if (cur.uid === data.uid) {
            this.upLoadImgList.splice(index, 1)
          }
        })
      },
      UpImageChange () { // 图片改变时操作
        // console.log(1)
      },
      handlePictureCardPreview (file) { // 点击放大图片
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      beforeUpload (file) { // 上传前验证图片方法
        console.log(file)
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
        if (!isJPG) {
          this.$message.error('请选择正确的图片格式!');
          return false;
        }
      },
      httpPicUpload (data) { // 上传评论截图
        let file = data.file
        PicUpload(file)
          .then(res => {
            if (res.data.ResultCode === "000000" && res.data.ResultValue) {
              this.upLoadImgList.push({url: imgUrl + res.data.ResultValue, needUrl: res.data.ResultValue})
            } else {
              this.$set(this.upLoadImgList, 0, this.upLoadImgList[0])
            }
          })
          .catch(err => {
            console.log(err);
          });
        return false;
      },
      // 提货方式：0 不限；1送货上门；2上门提货
      deliveryTypeText (type) {
        let text = '不限';
        switch (Number(type)) {
          case 0:
          text = '不限';
          break;
          case 1:
          text = '送货上门';
          break;
          case 2:
          text = '上门提货';
          break;
        }
        return text;
      },

      //设置图片显示
      setPicIndex(index) {
        if(this.companyInfo.CrowdType == 3 && index > 1){
          this.picIndex = index-1;
        } else {
          this.picIndex = index;
        }
        this.isShowPic = true;
      },
      //获取列表数据
      async getDataList() {
        this.loading = true;
        if (this.fromAddress[this.fromAddress.length - 1]) {
          this.req.FromCity = this.fromAddress[this.fromAddress.length - 1];
        } else {
          this.req.FromCity = ' ';
        }
        if (this.toAddress[this.toAddress.length - 1]) {
          this.req.ToCity = this.toAddress[this.toAddress.length - 1];
        } else {
          this.req.ToCity = ' ';
        }
        if (this.timeRange !== null && this.timeRange.length > 0) {
          this.req.CreateStart = this.timeRange[0];
          this.req.CreateEnd = this.timeRange[1];
        } else {
          this.req.CreateStart = '1970-01-01';
          this.req.CreateEnd = this.getTodayDate();
        }
        this.req.MemberID = this.$cookie.get('MemberID');
        let res = await getSourceList(this.req);
        if (res.data.ResultCode === '000000' && res.data.ResultValue && res.data.ResultValue != null && res.data.ResultValue != []) {
          this.listData = res.data.ResultValue;
          this.req.TotalRecords = res.data.TotalRecords;
          this.loading = false;
        } else {
          this.loading = false;
          this.$message.info({message: '暂无数据！'});
          this.listData = [];
          this.TotalRecords = 0;
        }
      },
      //搜索
      search() {
        this.handleCurrentChange(1);
      },
      //分页
      handleCurrentChange(val) {
        this.req.PageIndex = val;
        this.getDataList();
      },
      getTodayDate(){
        let date = new Date();
        return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
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
      //选他承运
      async checked(orderID, code, MerchantID, Way, index) {
        this.$confirm('确认要选他承运吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          chooseCompany({
            "OrderID": orderID,
            "OrderCode": code,
            'MerchantID': MerchantID,
            'MemberID': this.$cookie.get('MemberID'),
            "Freight": '',
            "RouteID": ""
          }).then(res => {
            if (res.data.ResultCode === '000000') {
              this.$message.success({message: res.data.ResultMessage});
              this.handleCurrentChange(1);
              if (Way == 2) {
                this.$confirm('是否立即支付运费?', '选他承运成功！', {
                  confirmButtonText: '去支付',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.$router.push({name: 'payment', query: {orderid: orderID}});
                })
              }
            }
          });
        })
      },

      //最低价模式下取消承运
      async CancelCarrier(orderID,index) {
        this.$confirm('确认要取消承运吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          CancelCarrier({
            "OrderID": orderID,
            'MemberID': this.$cookie.get('MemberID'),
          }).then(res => {
            if (res.data.ResultCode === '000000') {
              this.$message.success({message: res.data.ResultMessage});
              this.handleCurrentChange(1);
            }
          });
        })
      },

      //撤销货源
      async canSource(orderID, code, index) {
        this.$prompt('请输入撤销原因', '撤销货源', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: regs.Required,
          inputType: 'textarea',
          inputPlaceholder: '请输入撤销原因',
          inputErrorMessage: '请输入撤销原因'
        }).then(({value}) => {
          cancelSource({
            'Reason': value,
            'OrderID': orderID,
            'OrderCode': code,
            'MemberID': this.$cookie.get('MemberID')
          }).then(res => {
            if (res.data.ResultCode === '000000') {
              this.$message.success({message: res.data.ResultMessage});
              this.handleCurrentChange(1);
            }
          })
        })
      },
      //待确认状态取消订单
      async deleteOrder(OrderID, OrderCode, index) {
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
              this.handleCurrentChange(1);
            }
          })
        })
      },
      //待发货状态下取消订单
      cancelOrder(OrderID, OrderCode, index) {
        const h = this.$createElement;
        this.$prompt('请输入取消原因', '取消订单', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: regs.Required,
          inputPlaceholder: '请输入取消原因',
          inputType: 'textarea',
          inputErrorMessage: '请输入取消原因',
          message: h('div', {style: 'width: 800px'}, [
            h('p', {style: 'color: #F55B23'}, '1. 货主和司机沟通达成一致后，取消货源，运单关闭。'),
            h('p', {style: 'color: #F55B23'}, '2. 司机选择拒绝取消货源，运单转为拒绝取消，'),
            h('p', {style: 'color: #F55B23;padding-left: 14px;'}, '货主记违约一次，罚款200元。'),
            h('p', {style: 'color: #F55B23'}, '3. 因司机缘故取消，请联系客服投诉：0571-57137790。')
          ]),
        }).then(({value}) => {
          cancelOrder({
            'Reason': value,
            'OrderID': OrderID,
            'OrderCode': OrderCode,
            'MemberID': this.$cookie.get('MemberID')
          }).then(res => {
            if (res.data.ResultCode === '000000') {
              this.$message.success({message: res.data.ResultMessage});
              this.handleCurrentChange(1);
            }
          })
        })
      },
      //待发货状态下取消订单货主撤回取消
      backOrder(OrderID, OrderCode, index) {
        this.$prompt('请输入取消原因', '取消订单', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          backOrder({
            'OrderID': OrderID,
            'OrderCode': OrderCode,
            'MemberID': this.$cookie.get('MemberID')
          }).then(res => {
            if (res.data.ResultCode === '000000') {
              this.$message.success({message: res.data.ResultMessage});
              this.handleCurrentChange(1);
            }
          })
        })
      },
      //待发货状态下个体司机申请取消订单货主同意取消
      agreeCancelOrder(OrderID, OrderCode, MerchantID, index) {
        this.$prompt('确认要同意取消订单吗', '同意取消订单', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          agreeCancel({
            'OrderID': OrderID,
            'OrderCode': OrderCode,
            'MerchantID': MerchantID,
            'MemberID': this.$cookie.get('MemberID')
          }).then(res => {
            if (res.data.ResultCode === '000000') {
              this.$message.success({message: res.data.ResultMessage});
              this.handleCurrentChange(1);
            }
          })
        })
      },
      //待发货状态下个体司机申请取消订单货主拒绝取消订单
      disAgreeCan(OrderID, OrderCode, MerchantID, index) {
        this.$prompt('请输入拒绝取消原因', '拒绝取消订单', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          disAgreeCancel({
            'OrderID': OrderID,
            'OrderCode': OrderCode,
            'MerchantID': MerchantID,
            'MemberID': this.$cookie.get('MemberID')
          }).then(res => {
            if (res.data.ResultCode === '000000') {
              this.$message.success({message: res.data.ResultMessage});
              this.handleCurrentChange(1);
            }
          })
        })
      },
      //发布
      async sourceCommit(orderID, index) {
        this.$confirm('确认要发布吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sourceCommit({'OrdeID': orderID, "MemberID": this.$cookie.get('MemberID')})
            .then(res => {
              if (res.data.ResultCode === '000000') {
                this.$message.success({message: res.data.ResultMessage});
                this.handleCurrentChange(1);
              }
            });
        })
      },
      //评价
      OrderRate(orderID, type, name, index) {
        this.rateReset(); // 重置rate
        this.rate.index = index;
        this.isShowRate = true;
        this.rate.Name = name;
        this.rate.OrderID = orderID;
        this.rate.MemberID = this.$cookie.get("MemberID");
        let userType = this.$cookie.get("MemberCrowd");
        if (userType == 1) {
          if (type == 2) {
            this.rate.Type = 1;
          } else if (type = 3) {
            this.rate.Type = 2;
          }
        } else if (userType == 2) {
          if (type == 3) {
            this.rate.Type = 4;
          }
        }
      },
      //评价提交
      rateCommit() {
        if (!this.rate.Info) {
          this.$message.info({message: '请输入评价内容！'});
        } else {
          if (this.rate.Black) {
            this.rate.Picture = this.imgArrToString(this.upLoadImgList);
            this.rate.Black = 1;
          } else {
            this.rate.Black = 0;
          }
          if (this.rate.Type == 1) {
            rate1(this.rate).then(res => {
              if (res.data.ResultCode === '000000') {
                this.$message.success({message: res.data.ResultMessage});
                this.handleCurrentChange(1); // 重新拉取数据采用获取第一页，避免翻页bug
                this.isShowRate = false;
              }
            })
          } else if (this.rate.Type == 2) {
            rate2(this.rate).then(res => {
              if (res.data.ResultCode === '000000') {
                this.$message.success({message: res.data.ResultMessage});
                this.handleCurrentChange(1);
                this.isShowRate = false;
              }
            })
          } else if (this.rate.Type == 4) {
            rate4(this.rate).then(res => {
              if (res.data.ResultCode === '000000') {
                this.$message.success({message: res.data.ResultMessage});
                this.handleCurrentChange(1);
                this.isShowRate = false;
              }
            })
          }
        }
      },
       //联系客服
      serviceTip() {
        const h = this.$createElement;
        this.$alert('联系客服', '联系客服', {
          message: h('div', [
            h('p', {style: 'padding-left: 20px'}, '如您有任何疑问或问题，请联系速达汇客服；'),
            h('p', {style: 'padding-left: 20px;margin-top: 10px;'}, '工作时间：周一至周五 9:00-18:00'),
            h('p', {style: 'padding-left: 20px;margin-top: 10px;'}, '联系电话：0571-57137790'),
          ]),
        }).then(() => {
        })
      },
    },
    created() {
      let isLogin = this.checkLoginStatus();
      if(!isLogin) return;
      let _ = this;
      let identityPass = this.checkLoginIdentity(2, '/add', function(){
        _.getDataList();
      });
    },
    computed: {
       // 设置默认显示图片的index
      pictureIndex(){
        return this.picIndex
      }
    },
    watch: {
      //监听筛选条件
      getOrderType(newVal) {
        this.req.Parttern = newVal;
        this.handleCurrentChange(1);
      },
      currentOrderStatus(newVal) {
        this.req.Status = newVal;
        this.handleCurrentChange(1);
      },
      CarType(newVal) {
        this.req.Way = newVal;
        this.handleCurrentChange(1);
      },
    },
    components: {
      headTop,
      dropDown,
      foot,
      leftMenuRouterHome, // 左侧导航
      headMenuRouter // 左侧
      // AMap
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
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

  .avatar-uploader .el-upload:hover
    border-color: #409EFF;

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
        .order-type
          vertical-align: middle
          display: inline-block
          height: 20px
          line-height: 20px
          font-size: 12px
          padding: 0 10px
          margin-left: 20px
          border-radius: 4px
          color: $blue
          border: 1px solid $blue
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
      .mt4
        margin-top: -4px
      .user
        float: left
        width: 400px
        height: 30px
        .ml-70
          margin-left: 72px
        .mt-14
          margin-top: 12px
        img
          vertical-align: middle
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
    margin-left: 138px
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
      .fl
        span
          display: block
          padding-top: 1px
    .box-right
      float: left
      .mb-10:first-child
        padding-top: 1px
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
  .item-transfer
    vertical-align: middle
    background: #ECF5FE
    border: 1px solid #A4D0FF
    border-radius: 2px
    display: inline-block
    font-size: 12px
    color: #027CFF
    padding: 2px 7px
</style>
