<template>
  <div>
    <head-top>
      <span class="title" slot="index">{{userType == 1?'货主':'物流公司'}}-工作台</span>
      <div class="header-center" slot="menu" v-if="userType == 1">
        <ul>
          <router-link tag="li" to="/source" class="active">首页</router-link>
          <router-link tag="li" to="/finaindex">财务管理</router-link>
          <router-link tag="li" to="/account">账户信息</router-link>
        </ul>
      </div>
      <drop-down slot="info"></drop-down>
    </head-top>
    <div class="content clear" v-loading="loading">
      <div class="content-left">
        <ul>
          <router-link tag="li" to="/source">发布货源</router-link>
          <router-link to="/sourceList" tag="li" class="active">货源列表</router-link>
          <router-link to="/product" tag="li">产品库</router-link>
        </ul>
      </div>
      <div class="content-right">
        <div class="main fr">
          <p class="title-box"><span class="title-name"><router-link :to="{path: '/sourceList'}">货源列表</router-link> <i
            class="el-icon-arrow-right"></i>货源详情页</span></p>
          <div class="container">
            <!--进度条 start -->
            <div class="step">
              <el-steps :active="stepType" align-center v-if="!(baseInfo.Status == -3 || baseInfo.Status == -4 || baseInfo.Status == -2)">
                <el-step title="已发布" description=""></el-step>
                <el-step title="待确认" description=""></el-step>
                <el-step title="已发货" description=""></el-step>
                <el-step title="运输中" description=""></el-step>
                <el-step title="已完成" description=""></el-step>
              </el-steps>
            </div>
            <!--进度条 end -->
            <!--进度条 start -->
            <div class="step">
              <el-steps :active="baseInfo.Status==-3?1:2" v-if="baseInfo.Status == -3 || baseInfo.Status == -4 || baseInfo.Status == -2"
                        align-center>
                <el-step title="取消申请中" description=""></el-step>
                <el-step title="处理结果" description=""></el-step>
              </el-steps>
            </div>
            <!--进度条 end -->
            <!--中间 start-->
            <div class="center">
              <!--左侧-->
              <div class="center-left">
                <p class="title">货源编号：{{baseInfo.Code}}</p>
                <ul>
                  <li class="size16 bold">{{baseInfo.FromCity}}<img src="../../assets/images/gofrom.png" alt="">{{baseInfo.ToCity}}
                  </li>
                  <!-- <li><span class="item-name">货物名称：</span>{{baseInfo.CargoName}}</li> -->
                  <li><span class="item-name">货物类型：</span>{{baseInfo.Classify}}</li>
                  <li><span class="item-name">车长车型：</span>{{baseInfo.Long != 99?baseInfo.Long:'不限'}}<span
                    v-if="baseInfo.Long!=99">m</span>/{{baseInfo.Model?baseInfo.Model:'不限'}}
                  </li>
                  <li><span class="item-name">运输类型：</span>{{ baseInfo.Way==1?'物流公司':'个体司机'}}</li>
                  <li><span class="item-name">体积重量：</span><span class="orange-text">{{baseInfo.Volume}}m³/{{baseInfo.Weight}}吨</span>
                  </li>
                  <li v-if="baseInfo.Parttern == 1 || (baseInfo.Parttern == 2 && baseInfo.Status != 1 && baseInfo.Status != 2 )">
                    <span class="item-name">运费：</span><span class="orange-text">￥{{baseInfo.Freight}}</span>
                  </li>
                  <li><span class="item-name">装货时间：</span><span class="orange-text">{{baseInfo.LoadTime}}</span></li>
                  <li><span class="item-name">接单模式：</span><span>{{baseInfo.Parttern==1?'抢单':'最低价'}}</span></li>
                  <!-- <li v-if="baseInfo.DeliveryMode"><span class="item-name">提货方式：</span><span>{{baseInfo.DeliveryMode==0?'不限':(item.DeliveryMode == 1?'送货上门':'上门提货')}}</span></li> -->
                  <!-- <li v-if="baseInfo.DeliveryMode == '2'">
                    <span class="item-name">提货地点：</span>
                    <p class="remark" :title="baseInfo.Remark">{{baseInfo.ToCity + baseInfo.FromCity +baseInfo.FromAddress}}</p>
                  </li> -->
                  <!-- 物流公司有结算方式 -->
                  <li v-if="baseInfo.Way == 1">
                    <span class="item-name fl">结算方式：</span>
                    <div :title="baseInfo.OrderSettlementName">{{baseInfo.OrdeSettlementName}}</div>
                  </li>

                  <li v-if="baseInfo.Way == 1 && baseInfo.OrdeSettlement == 2">
                    <span class="item-name fl" style="width:88px;">收获方名称：</span>
                    <div class="remark" style="width:165px;" :title="baseInfo.OrderSettlementName">{{baseInfo.OrdeReceiver}}</div>
                  </li>

                  <li v-if="baseInfo.Way == 1 && baseInfo.OrdeSettlement == 2">
                    <span class="item-name" style="width:88px;">收货方电话：</span><span :title="baseInfo.OrderSettlementName">{{baseInfo.OrdeReceivePhone}}</span>
                  </li>
                  <!-- 物流公司有结算方式 end -->

                  <li>
                    <span class="item-name fl">备注：</span>
                    <div class="remark" :title="baseInfo.Remark">{{baseInfo.Remark}}</div>
                    <!-- {{baseInfo.Remark}} -->
                  </li>
                </ul>
              </div>
              <!--右侧-->
              <div class="center-right">
                <div class="top">
                  <!--<p class="time-info">货源信息还有<span class="orange-text">{{}}天12小时</span>到装货时间，即将过期！</p>-->
                  <p class="size16">
                    货源状态：<span class="orange-text">{{baseInfo.StatusName}}</span>
                  </p>
                  <p v-if="baseInfo.Status < 0" class="reason">{{baseInfo.Reason}}</p>
                  <div class="mt-40">
                    <el-button v-if="baseInfo.Status == 1 && !getUserRole(userCharacter,'财务')" type="primary" height="30px" class="normal mr-10" size="mini"
                               @click="sourceCommit(baseInfo.OrdeID)">立即发布
                    </el-button>
                    <router-link :to="{path: '/source/'+ baseInfo.OrdeID}" class="mr-10">
                      <el-button v-if="baseInfo.Status == 1 && !getUserRole(userCharacter,'财务')" type="primary" height="30px"
                                 class="normal" plain size="mini">编辑
                      </el-button>
                    </router-link>
                    <el-button v-if="baseInfo.Status == 2 && !getUserRole(userCharacter,'财务')" size="mini" class="normal mr-10"
                               @click="canSource(baseInfo.OrdeID,baseInfo.Code)">撤销货源
                    </el-button>
                    <router-link :to="{name: 'source',params:{id: baseInfo.OrdeID,type: 1}}" class="mr-10">
                      <el-button v-if="(baseInfo.Status == -1 || baseInfo.status == 6 || baseInfo.status == -2) && !getUserRole(userCharacter,'财务')" size="mini" class="normal">重发
                      </el-button>
                    </router-link>
                    <router-link :to="{path: '/payment',query:{orderid: baseInfo.OrdeID}}" class="mr-10">
                      <el-button v-if="baseInfo.Status == 4 && baseInfo.PayResult != 1 && baseInfo.Grab.CrowdType == 3 && !getUserRole(userCharacter,'财务')"
                                 size="mini" class="normal">支付运费
                      </el-button>
                    </router-link>
                    <el-button v-if="baseInfo.Status == 3 && !getUserRole(userCharacter,'财务')" size="mini" class="normal mr-10"
                               @click="canSource(baseInfo.OrdeID,baseInfo.Code)">撤销货源
                    </el-button>
                    <el-button v-if="baseInfo.Status == 4 && !getUserRole(userCharacter,'财务')" size="mini" class="normal mr-10"
                               @click="cancelOrder(baseInfo.OrdeID,baseInfo.Code)">取消运单
                    </el-button>
                    <el-button v-if="baseInfo.Status == -3 && baseInfo.Nullifier == 1 && !getUserRole(userCharacter,'财务')" size="mini" class="normal mr-10"
                               @click="backOrder(baseInfo.OrdeID,baseInfo.Code)">撤回申请
                    </el-button>
                    <el-button v-if="baseInfo.Status == -3 && baseInfo.Nullifier == 2 && !getUserRole(userCharacter,'财务')" size="mini" class="normal mr-10"
                               @click="agreeCancelOrder(baseInfo.OrdeID,baseInfo.Code,baseInfo.Grab.MerchantID)">同意申请
                    </el-button>
                    <el-button v-if="baseInfo.Status == -3 && baseInfo.Nullifier == 2 && !getUserRole(userCharacter,'财务')" size="mini" class="normal mr-10"
                               @click="disAgreeCan(baseInfo.OrdeID,baseInfo.Code,baseInfo.Grab.MerchantID)">拒绝申请
                    </el-button>
                    <el-button v-if="baseInfo.Status == 6 && baseInfo.Evaluated == 0 && !getUserRole(userCharacter,'财务')" size="mini" class="normal mr-10"
                               @click="OrderRate(baseInfo.OrdeID,baseInfo.Grab.CrowdType,baseInfo.Grab.Name)">评价
                    </el-button>
                    <el-button v-if="baseInfo.Status == -4" size="mini" class="normal" @click="serviceTip">联系客服
                    </el-button>
                    <span class="key"
                          v-if="(baseInfo.Status == 4 || baseInfo.Status == 5 || baseInfo.Status == 6 ) && baseInfo.PayResult == 1 &&  baseInfo.Grab.CrowdType == 3">
                      <i class="left">支付秘钥</i>
                      <i class="right">{{baseInfo.SecretKey}}</i>
                    </span>
                  </div>
                  <p
                    v-if="(baseInfo.Status == 4 || baseInfo.Status == 5 || baseInfo.Status == 6 ) && baseInfo.PayResult == 1 && baseInfo.CrowdType == 3"
                    class="size12 gray-txt mt-20">秘钥支付：货主支付运费生成秘钥 <i class="el-icon-arrow-right"></i>货主确认卸货告知司机秘钥<i
                    class="el-icon-arrow-right"></i>司机输入秘钥收款</p>
                  <div class="info-list">
                    <p class="gray-txt size12 mb-4" v-if="baseInfo.Nullifier == 2 && baseInfo.Status == -3">
                      司机发起取消申请，货主和司机沟通达成一致后，货主同意取消，运单关闭。 </p>
                    <p class="gray-txt size12" v-if="baseInfo.Nullifier == 2 && baseInfo.Status == -3">
                      货主选择拒绝取消，运单转为拒绝取消，记司机违约一次，罚款200元。 </p>
                    <p class="gray-txt size12 mb-4" v-if="baseInfo.Nullifier == 1 && baseInfo.Status == -3">
                      货主发起取消申请，货主和司机沟通达成一致后，司机同意取消，运单关闭。</p>
                    <p class="gray-txt size12" v-if="baseInfo.Nullifier == 1 && baseInfo.Status == -3">
                      司机选择拒绝取消，运单转为拒绝取消，记货主违约一次，罚款200元。</p>
                  </div>
                </div>

                <div class="bottom" v-if="baseInfo.Grab && baseInfo.Status != 1 && baseInfo.Status != 2 && baseInfo.Status != -1">
                  <p class="user-info">
                    <span v-if="baseInfo.Parttern == 1">抢单司机：</span>
                    <span v-else>承运司机：</span>
                    <img :onerror="errorImg" :src="imgUrl + baseInfo.Grab.Logo" width="30" height="30" alt="加载失败" v-if="baseInfo.Grab.Logo">
                    <span>{{baseInfo.Grab.Name}}</span>
                    <span class="checked" v-if="baseInfo.Grab.Status == 2">已认证</span>
                    <span class="bao">保</span>
                  </p>
                  <div class="list">
                    <ul>
                      <li v-if="(baseInfo.Status != 1 && baseInfo.Status != 2 && baseInfo.Status != 3)"><span
                        class="gray-txt">{{baseInfo.Parttern == 1?'抢单时间':'承运时间'}}：</span>{{baseInfo.GrabTime}}
                      </li>
                      <li><span class="gray-txt">联系电话：</span>{{baseInfo.Grab.Phone}}</li>
                      <li v-if="baseInfo.Parttern == 2 && baseInfo.Status != 1 && baseInfo.Status != 2 ">
                        <span class="gray-txt">运费：</span><span class="orange-text">￥{{baseInfo.Freight}}</span>
                      </li>
                      <li v-if="baseInfo.Grab.MercCollect && baseInfo.Grab.CrowdType == 2">
                        <span class="gray-txt">免费上门提货：</span>{{baseInfo.Grab.MercCollect.CollectVolume}}m³以上，{{baseInfo.Grab.MercCollect.CollectWeight}}吨以上
                      </li>
                    </ul>
                    <p class="mt-20">
                      <el-button v-if="baseInfo.Status == 3 && baseInfo.Parttern == 1 && !getUserRole(userCharacter,'财务')" type="primary" size="mini"
                                 @click="checked(baseInfo.OrdeID,baseInfo.Code,baseInfo.Grab.MerchantID)">选他承运
                      </el-button>
                      <el-button v-if="baseInfo.Status == 3 && baseInfo.Parttern == 2 && !getUserRole(userCharacter,'财务')" type="primary" size="mini"
                                 @click="CancelCarrier(baseInfo.OrdeID)">取消承运
                      </el-button>
                      <!--<p v-if="item.Status == 3 && item.Parttern == 2" class="mt-6"><span class="blue-txt cuspoint"-->
                      <!--@click="CancelCarrier(item.OrdeID,index)">取消承运</span>-->
                      <!--</p>-->
                      <el-button type="primary" plain size="mini" @click="showInfo(baseInfo.Grab.MerchantID)">查看资质
                      </el-button>
                    </p>
                  </div>
                </div>
                <div v-else class="text-center">
                  <p><img src="../../assets/images/null.png" alt=""></p>
                  <p class="gray-txt">暂无承运人信息</p>
                </div>
              </div>
            </div>
            <!--中间 end-->
            <!--司机列表 start-->
            <div class="car-list mtb20" v-if="isShowCarList && baseInfo.Status == 2 && baseInfo.Parttern == 2">
              <div class="list-menu">
                <ul>
                  <li class="first">司机信息</li>
                  <li class="width100">泡货（元/m³）</li>
                  <li class="width100">重货（元/吨）</li>
                  <li class="width140">免费上门提货</li>
                  <li class="width140">运费报价（元）</li>
                  <li class="last">操作</li>
                </ul>
              </div>
              <div class="list-content">
                <ul v-if="baseInfo.Grab.MatchingMerchant.length>0">
                  <li v-for="(item,index) in baseInfo.Grab.MatchingMerchant" :key="index">
                    <div class="left">
                      <span class="number">{{index+1}}</span>
                      <span class="car-name" @click="showInfo(item.MerchantID)">{{item.Name}}</span>
                      <span class="pass">已认证</span>
                      <span class="bao">保</span>
                    </div>
                    <div class="center">
                      <span class="item-content">{{item.LightPrice}}</span>
                      <span class="item-content">{{item.HeavyPrice}}</span>
                      <span class="center-item" v-if="baseInfo.Way==1">{{item.MercCollect?item.MercCollect.CollectVolume:0}}m³/{{item.MercCollect?item.MercCollect.CollectWeight:0}}吨以上</span>
                      <span class="center-item" v-else>—</span>
                      <span class="center-item orange-text">{{item.Freight}}</span>
                    </div>
                    <div class="right">
                      <p v-if="!getUserRole(userCharacter,'财务')"
                        @click="checked(baseInfo.OrdeID,baseInfo.Code,item.MerchantID,item.Freight,item.RouteID)">
                        选他承运</p>
                    </div>
                  </li>
                </ul>
                <div v-else class="text-center mb-20">
                  <p><img src="../../assets/images/null.png" alt="加载失败"></p>
                  <p class="gray-txt">暂无匹配数据</p>
                </div>
              </div>
            </div>
            <!--司机列表 end-->

            <!--底部信息产品 start-->
            <div class="mt-10">
              <el-tabs type="border-card">
                <el-tab-pane label="产品信息">
                  <div>
                    <p class="mt-10">发货人： <span class="mr-20">{{sendUser.Name}}</span> <span class="mr-20">{{sendUser.Phone}}</span>
                      {{baseInfo.FromCity}}{{baseInfo.FromAddress}}</p>
                    <p class="mt-20" v-if="baseInfo.Way == 1 && baseInfo.OrdeSettlement == 2">收货人： <span class="mr-20">{{baseInfo.OrdeReceiver}}</span><span class="mr-20">{{baseInfo.OrdeReceivePhone}}</span>{{baseInfo.ToCity}}{{baseInfo.ToAddress}}</p>
                    <p class="mt-20" v-else>收货地： {{baseInfo.ToCity}}{{baseInfo.ToAddress}}</p>
                    <div>
                      <el-table
                        class="mt-20"
                        :data="baseInfo.Product"
                        :span-method="objectSpanMethod"
                        border>
                        <el-table-column
                          label="名称/系列/型号"
                          width="230">
                          <template slot-scope="scope">
                            <p class="product-name" :title="scope.row.ProductName">{{ scope.row.ProductName }}</p>
                            <p class="gray-txt size12"><span class="model-name" :title="scope.row.CatenaName">{{ scope.row.CatenaName }}</span><span class="fl">—</span><span class="model-name" :title="scope.row.ModelName">{{ scope.row.ModelName }}</span></p>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="ClassifyName"
                          label="货源类型">
                        </el-table-column>
                        <el-table-column
                          label="体积(m³)/重量(吨)">
                          <template slot-scope="scope">
                            <p>{{(Number(scope.row.Length*scope.row.Width*scope.row.Height)/1000000).toFixed(2)}}/{{Number(scope.row.Weight).toFixed(2)}}</p>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="Money"
                          label="货值(元)">
                        </el-table-column>
                        <el-table-column
                          prop="Amount"
                          label="数量">
                        </el-table-column>
                        <el-table-column
                          label="状态">
                          <template slot-scope="scope">
                            <span class="orange-text">{{baseInfo.StatusName}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          width="160"
                          label="产品信息">
                          <template slot-scope="scope">
                            <div>
                              <p>产品：<span class="blue-txt">{{baseInfo.ProductInfo.Species}}</span> 种</p>
                              <p>数量：<span class="blue-txt">{{baseInfo.ProductInfo.Number}}</span> 件</p>
                              <p>总体积：<span class="blue-txt">{{baseInfo.Volume}}</span> m³</p>
                              <p>总重量：<span class="blue-txt">{{baseInfo.Weight}}</span> 吨</p>
                              <p>泡货体积：<span class="blue-txt">{{baseInfo.ProductInfo.Light}}</span> m³</p>
                              <p>重货重量：<span class="blue-txt">{{baseInfo.ProductInfo.Heavy}}</span> 吨</p>
                              <p>货值：<span class="blue-txt">{{baseInfo.Money}}</span>元</p>
                              <!-- 运费为0隐藏 小星 -->
                              <p v-if="Number(baseInfo.Freight) !== 0">运费：<span class="blue-txt">{{baseInfo.Freight}}</span>元</p>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="物流信息">
                  <div class="tabItem">
                    <p class="mb-20" v-if="baseInfo.Status >= 5 && baseInfo.LogisticsInfo">
                      <span class="mr-10" v-if="baseInfo.LogisticsInfo.UnloadRemark!='' && baseInfo.LogisticsInfo.UnloadPhotos!=''">卸货凭证： {{baseInfo.LogisticsInfo.UnloadRemark}}</span>
                      <span class="mr-10" v-if="baseInfo.LogisticsInfo.UnloadPhotos!=''">
                        <img v-for="item in baseInfo.LogisticsInfo.UnloadPhotos.split(',')" class="image cuspoint"
                             title="点击查看大图"
                             @click="shouBigPic(item)"
                             :onerror="errorImg"
                             :src="imgUrl + item" width="30" height="30">
                      </span>
                    </p>
                    <p class="mb-20" v-if="baseInfo.Status >= 5 && baseInfo.LogisticsInfo">
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
                    <div v-if="baseInfo.Status >= 5">
                      <div class="map-content" v-if="carPosition">
                        <div id="mymap" class="mymap"></div>
                      </div>
                      <div class="map-list" v-if="carPosition">
                        <p class="title">物流信息</p>
                        <el-steps align-center direction="vertical" space="20%" :active="1">
                          <el-step title="当前位置"
                                   :description="carPosition"></el-step>
                        </el-steps>
                      </div>
                    </div>
                    <div v-else class="text-center">
                      <p><img src="../../assets/images/null.png" alt=""></p>
                      <p class="gray-txt">暂无物流信息</p>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane v-if="baseInfo.Parttern == 2 && baseInfo.Status != 1 && baseInfo.Status != 2 " :label="baseInfo.Parttern == 2?'报价信息':''">
                  <div class="car-list tabItem" style="margin-left:-16px;margin-right:-16px;border-bottom:0;">
                    <div class="list-menu">
                      <ul>
                        <li style="width: 25%; padding-left: 5%;">司机信息</li>
                        <li style="width: 15%">泡货（元/m³）</li>
                        <li style="width: 15%">重货（元/吨）</li>
                        <li style="width: 15%">免费上门提货</li>
                        <li style="width: 15%">运费报价（元）</li>
                        <li style="width: 10%">状态</li>
                      </ul>
                    </div>
                    <div class="list-content" v-loading="quotationLoading">
                      <ul v-if="quotation.length>0">
                        <li v-for="(item, index) in quotation" :key="index">
                          <div class="left"  style="width: 28.2%; padding-left: 1.8%;">
                            <span class="number">{{index+1}}</span>
                            <span class="car-name" @click="showInfo(item.MerchantID)">{{item.MerchantName ? item.MerchantName : item.MembName}}</span>
                            <span class="pass">已认证</span>
                            <span class="bao" v-if="item.IsExpire">保</span>
                          </div>
                          <div class="fl" style="width:15%; line-height:22px; height:22px;">
                            <span class="item-content">{{item.BubblePrice}}</span>
                          </div>
                          <div class="fl" style="width:15%; line-height:22px; height:22px;">
                            <span class="item-content">{{item.HeavyPrice}}</span>
                          </div>
                          <div class="fl" style="width:15%; line-height:22px; height:22px;">
                            <span class="item-content">{{item.CollectVolume}}m³/{{item.CollectWeight}}吨以上</span>
                          </div>
                          <div class="fl" style="width:15%; line-height:22px; height:22px;">
                            <span class="item-content">{{item.Freight}}</span>
                          </div>
                          <div class="fl">
                            <p class="blue-txt" v-if="item.IsChecked">已选他承运</p>
                          </div>
                        </li>
                      </ul>
                      <div v-else class="text-center mb-20 mt-60">
                        <p><img src="../../assets/images/null.png" alt="加载失败"></p>
                        <p class="gray-txt mt-20">暂无匹配数据</p>
                      </div>
                      <div class="text-center mt-20" v-if="quotation.length>0"> <!-- 分页 -->
                        <el-pagination
                          background
                          @current-change="handleQuotationPageChange"
                          :page-size="quotationRequest.PageSize"
                          :current-page.sync="quotationRequest.PageIndex"
                          layout="total, prev, pager, next"
                          :total="quotationRequest.TotalRecords">
                        </el-pagination>
                      </div>
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
            <div class="pic-content" @click="isShowPic = true">
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
        @close="close"
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
              <p class="text-center"><img :onerror="errorImg" :src="imgUrl + Pic.value" alt="加载失败" width="800px" height="600px"></p>
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
      width="500px">
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

    <!--查看图片大图 start-->
    <el-dialog
      :visible.sync="isShowBigPic"
      width="1000px"
      height="800px"
    >
      <div class="text-center">
        <img :src="imgUrl + bigPic" :onerror="errorImg" width="800px" height="600px" class="carImg">
      </div>
    </el-dialog>
    <!--查看图片大图 end-->
    <!-- 图片放大弹框 start -->
    <el-dialog :visible.sync="dialogVisible" width="600px">
      <img width="100%" :src="dialogImageUrl" :onerror="errorImg" alt="">
    </el-dialog>
    <!-- 图片放大弹框 end -->
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
    PicUpload, // 图片接口
    getSourceInfo,
    getCompanyInfo,
    chooseCompany,
    cancelSource,
    sourceCommit,
    deleteOrder,
    cancelOrder,
    backOrder,
    agreeCancel,
    disAgreeCancel,
    getCarAddress,
    CancelCarrier,
    rate1,
    rate2,
    rate4,
    SnapshotGetPage // 获取快照一页
  } from 'api/getData'
  import { getUserRole } from 'config/myUtils';
  export default {
    data() {
      return {
        errorImg: 'this.src="' + require('../../assets/images/errorimg.png') + '"',
        upLoadImgList: [], // 评价图片上传列表
        dialogImageUrl: '', // 评价图片上传当前点击路径
        dialogVisible: false, // 评价图片放大dialog
        userCharacter: this.$cookie.get("MemberDutiesID"),
        OrdeID: '',
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
        isShowRate: false,//是否显示评价弹出层
        isShowInfo: false,//是否显示查看资质
        isShowPic: false,//是否显示证件照片
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
        },
        quotationLoading: false // 底部表格加载中 loading 小星
      };
    },
    methods: {
      getUserRole: getUserRole,
       // 翻页
      handleQuotationPageChange () {
        this.quotationRequest.PageIndex = val;
        this.getQuotation();
      },
      // 根据条件请求 获取报价信息 快照 小星
      async getQuotation (base) {
        if (base.Parttern === 2 && base.Status >= 3) {
          // 赋值 尽量 不跟老代码扯一起
          this.quotationLoading = true;
          this.quotationRequest.OrderID = this.OrdeID;
          const resData = await SnapshotGetPage(this.quotationRequest);
          this.quotationLoading = false;
          if (resData.data.ResultCode === "000000") {
            this.quotation = resData.data.ResultValue;
            this.quotationRequest.TotalRecords = resData.data.TotalRecords;
          }
        }
      },
      // 关闭重置图片显示index
      close(){
        this.picIndex = 0;
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

      //初始化地图
      initMap() {
        let map = new AMap.Map("mymap", {
          resizeEnable: true,
          zoom: 15
        });
        getCarAddress({OrderCode: this.baseInfo.OrdeID}).then(res => {
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
        getSourceInfo({OrdeID: this.$route.params.id, MemberID: this.$cookie.get('MemberID')}).then(res => {
          if (res.data && res.data.ResultCode == '000000' && res.data.ResultValue) {
            this.baseInfo = res.data.ResultValue;
            if (res.data.ResultValue.Status >= 5) {
              this.isSetMap = true;
            }
            this.OrdeID = res.data.ResultValue.OrdeID;
            this.sendUser = res.data.ResultValue.Merchant;
            this.getQuotation(this.baseInfo); // 做判断是否请求快照信息 小星
            this.loading = false;
          }
        }).catch(err => {
          this.$router.push('/sourceList');
        })
      },
      // 设置table最后的合并
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 6 || columnIndex === 5) {
          if (rowIndex % this.baseInfo.Product.length === 0) {
            return {
              rowspan: this.baseInfo.Product.length,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },
      //获取资质信息
      async showInfo(MerchantID) {
        this.isShowInfo = true;
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
      async checked(orderID, code, MerchantID, Freight,RouteID) {
        if(RouteID){
          RouteID = RouteID;
        }else{
          RouteID = "";
        }
        let that = this;
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
            "Freight": Freight,
            "RouteID": RouteID
          }).then(res => {
            if (res.data.ResultCode === '000000') {
              if (res.data.ResultValue) {
                const h = this.$createElement;
                this.$confirm('', '您选择的司机报价和实际报价不符！', {
                  confirmButtonText: '确定',
                  message: h('div', {style: 'text-align: center'}, [
                    h('p', {style: 'color: #F55B23'}, '当前运费价格已发生变更！'),
                    h('p', {style: 'color: #F55B23'}, '当前报价：¥' + Freight + '，实际报价：¥' + res.data.ResultValue + ''),
                    h('p', {style: 'color: #F55B23;'}, '请刷新页面获取最新的运费报价！'),
                  ]),
                }).then(() => {
                  this.getSource();
                }).catch(() => {
                  this.getSource();
                })
              } else {
                this.isShowCarList = false;
                this.$message.success({message: res.data.ResultMessage});
                this.getSource();
                // if(that.baseInfo.Parttern == 2){
                //   this.baseInfo.Status = 3;
                //   this.baseInfo.StatusName = '货源已选择承运方，等待对方确认订单；';
                // } else {
                //   this.baseInfo.Status = 4;
                //   this.baseInfo.StatusName = '货源已选择承运公司，等待货主支付运费到平台；';
                // }
              }
            }
          });
        })
      },
      //最低价模式下取消承运
      async CancelCarrier(orderID) {
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
              this.getSource();
              this.isShowCarList = true;
              // this.listData[index].Status = 2;
              // this.listData[index].StatusName = '已发布';
            }
          });
        })
      },
      //撤销货源
      async canSource(orderID, code) {
        this.$prompt('请输入撤销原因', '撤销货源', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: regs.Required,
          inputType: 'textarea',
          inputPlaceholder: '请输入取消原因',
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
              // this.baseInfo.Status = -1;
              // this.baseInfo.StatusName = '货源已关闭！';
              this.getSource();
            }
          })
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
              // this.baseInfo.Status = -1;
              // this.baseInfo.StatusName = '货源已关闭';
              // this.baseInfo.Reason = value;
              this.getSource();
            }
          })
        })
      },
      //待发货状态下取消订单
      async cancelOrder(OrderID, OrderCode) {
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
              // this.baseInfo.Status = -3;
              // this.baseInfo.StatusName = '取消中，货主申请取消订单，待司机处理；';
              // this.baseInfo.Reason = value;
              // this.baseInfo.Nullifier = 1;
              this.getSource();
            }
          })
        })
      },
      //待发货状态下取消订单货主撤回取消
      async backOrder(OrderID, OrderCode) {
        const h = this.$createElement;
        this.$alert('您将撤销此次取消订单申请', '撤销取消', {
          message: h('div', [
            h('p', {style: 'text-align: center'}, '您将撤销此次取消订单申请'),
            h('p', {style: 'text-align: center'}, '有任何疑问，请联系客服0571-57137790'),
          ]),
        }).then(() => {
          backOrder({
            'OrderID': OrderID,
            'OrderCode': OrderCode,
            'MemberID': this.$cookie.get('MemberID')
          }).then(res => {
            if (res.data.ResultCode === '000000') {
              this.$message.success({message: res.data.ResultMessage});
              // this.baseInfo.Status = 4;
              // this.baseInfo.StatusName = '货源已选择承运公司，等待货主支付运费到平台；';
              this.getSource();
            }
          })
        })
      },
      //待发货状态下个体司机申请取消订单货主同意取消
      async agreeCancelOrder(OrderID, OrderCode, MerchantID) {
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
              // this.baseInfo.Status = -2;
              // this.baseInfo.StatusName = '货源已关闭，司机取消订单；'
              this.getSource();
            }
          })
        })
      },
      //待发货状态下个体司机申请取消订单货主拒绝取消订单
      async disAgreeCan(OrderID, OrderCode, MerchantID) {
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
              // this.baseInfo.Status = -4;
              // this.baseInfo.StatusName = '拒绝取消，司机申请取消订单，货主已拒绝申请；';
              this.getSource();
            }
          })
        })
      },
      //评价
      OrderRate(orderID, type, name) {
        this.rateReset(); // 重置rate
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
      async rateCommit() {
        if (!this.rate.Info) {
          this.$message.info({message: '请输入评价内容！'});
        } else {
          this.rate.Picture = this.imgArrToString(this.upLoadImgList);
          if (this.rate.Black) {
            this.rate.Black = 1;
          } else {
            this.rate.Black = 0;
          }
          if (this.rate.Type == 1) {
            rate1(this.rate).then(res => {
              if (res.data.ResultCode === '000000') {
                this.$message.success({message: res.data.ResultMessage});
                // this.baseInfo.Status = 7;
                // this.baseInfo.StatusName = '已评价';
                this.isShowRate = false;
                this.getSource();
              }
            })
          } else if (this.rate.Type == 2) {
            rate2(this.rate).then(res => {
              if (res.data.ResultCode === '000000') {
                // this.$message.success({message: res.data.ResultMessage});
                // this.baseInfo.Status = 7;
                // this.baseInfo.StatusName = '已评价';
                this.isShowRate = false;
                this.getSource();
              }
            })
          } else if (this.rate.Type == 4) {
            rate4(this.rate).then(res => {
              if (res.data.ResultCode === '000000') {
                this.$message.success({message: res.data.ResultMessage});
                // this.baseInfo.Status = 7;
                // this.baseInfo.StatusName = '已评价';
                this.isShowRate = false;
                this.getSource();
              }
            })
          }
        }
      },
      //发布
      async sourceCommit(orderID) {
        this.$confirm('确认要发布吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sourceCommit({'OrdeID': orderID, "MemberID": this.$cookie.get('MemberID')})
            .then(res => {
              if (res.data.ResultCode === '000000') {
                this.$message.success({message: res.data.ResultMessage});
                // this.baseInfo.Status = 2;
                this.getSource();
              }
            });
        })
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
    computed: {
      //设置进度条的状态
      stepType() {
        if (this.baseInfo.Status == 1 || this.baseInfo.Status == -1 || this.baseInfo.Status == -4 || this.baseInfo.Status == -2) {
        } else if (this.baseInfo.Status == 2) {
          return 1;
        } else if (this.baseInfo.Status == 3) {
          return 2;
        } else if (this.baseInfo.Status == 4) {
          return 2;
        } else if (this.baseInfo.Status == 5) {
          return 4;
        } else if (this.baseInfo.Status == 7 || this.baseInfo.Status == 6) {
          return 5;
        } else {
          return 0;
        }
      },
      // 设置默认显示图片的index
      pictureIndex(){
        return this.picIndex
      }
    },
    // watch: {
    //   isSetMap(newVal,oldVal){
    //     if(newVal){
    //       this.initMap();
    //     }
    //   }
    // },
    created() {
      this.loading = true;
      if (this.$cookie.get("MemberID")) {
        if (this.$cookie.get("MemberCrowd") == 1) {
          this.getSource();
        } else {
          this.$router.push('/orderDetails/'+ this.$route.params.id);
        }

      } else {
        this.$message.info({message: '你尚未登录，请登录！'});
        this.$router.push('/');
      }
    },
    mounted() {
      let that = this;
      if(that.baseInfo.OrdeID){
        this.initMap();
      }
    },
    components: {
      headTop,
      dropDown,
      foot
    }
  }
</script>

<style lang="stylus">
  .rated-upload .el-upload-list__item, .rated-upload .el-upload.el-upload--picture-card
    width: 102px !important
    height: 102px !important
  .rated-upload .el-upload--picture-card
    line-height: 104px !important
</style>

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
        text-justify: distribute-all-lines;
        text-align-last: justify;
      .remark
        float: left
        width: 180px

    .center-right
      float: left
      width: 606px
      .top
        position: relative
        padding: 60px 60px 20px
        border-bottom: 1px dashed $borderColor
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
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

  .model-name
    float: left
    max-width: 98px;
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap

  .tabItem
    min-height: 310px
  .carImg
    width: 800px
    height: 600px

</style>
