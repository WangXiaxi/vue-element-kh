<template>
  <div class="source">
    <head-top>
      <span class="title" slot="index">{{userType == 1?'货主':'物流公司'}}-工作台</span>
      <div class="header-center" slot="menu">
        <head-menu-router activeLink="index"></head-menu-router>
      </div>
      <drop-down slot="info"></drop-down>
    </head-top>
    <div class="content clear">
      <div class="content-left">
        <left-menu-router-home activeLink="source"></left-menu-router-home>
      </div>
      <div class="content-right" v-loading="loading">
        <div class="product fr">
          <p class="title-box"><span class="title-name">发布货源</span></p>
          <div class="container clear">
            <!--产品库 start-->
            <div>
              <!--列表内容 start-->
              <div class="list-content">
                <!--左侧树形筛选 start-->
                <div class="list-left">
                  <div class="left-name">产品分类</div>
                  <div class="tree-list">
                    <el-tree
                    :data="data5"
                    show-checkbox
                    node-key="id"
                    ref="data5"
                    :indent="8"
                    @check="filter"
                  >
                  <span class="custom-tree-node" slot-scope="{ node, data }" style="width:100%">
                    <el-tooltip class="item" effect="dark" :content="node.label" placement="right">
                      <span class="tree-name">{{ node.label }}</span>
                    </el-tooltip>
                  </span>
                  </el-tree>
                  </div>
                </div>
                <!--左侧树形筛选 end-->

                <!--右侧列表 start-->
                <div class="list-right">
                  <template class="size14">
                    <el-table
                      class="source-table"
                      header-row-class-name="table-bg"
                      :data="ProList"
                      style="width: 100%"
                      size="small">
                      <template slot="empty">
                        <p>没有数据</p>
                      </template>
                      <el-table-column
                        label="系列/名称/型号"
                        width="200">
                        <template slot-scope="scope">
                          <p class="product-name" :title="scope.row.ProductName">{{ scope.row.ProductName }}</p>
                          <p class="size12 gray-txt">
                            <span class="text-ellipsis" :title="scope.row.CatenaName">{{ scope.row.CatenaName }}</span><span class="text-ellipsis" :title="scope.row.ModelName">—{{scope.row.ModelName}}</span>
                          </p>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="货源类型"
                        prop="ClassifyName"
                        width="100">
                      </el-table-column>
                      <el-table-column
                        prop="Weight"
                        label="体积(m³)/重量(吨)"
                        width="140">
                        <template slot-scope="scope">
                          <p class="size14">
                            {{(scope.row.Length * scope.row.Width *
                            scope.row.Height)/1000000}}m³/{{scope.row.Weight/1000}}吨
                          </p>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="Money"
                        label="货值（元）"
                        width="100">
                      </el-table-column>
                      <el-table-column
                        label="数量"
                        width="100">
                        <template slot-scope="scope">
                          <el-popover
                            placement="bottom-end"
                            title="数量(可手动输入)"
                            width="300"
                            trigger="click"
                            v-model="showPopover[scope.$index]">
                            <num-assemly :dataCur="scope" @getNum="getNum"></num-assemly>
                            <el-input size="mini" v-model="scope.row.Amount"  slot="reference"
                              @blur="checkNumber(scope.row.Amount,scope.$index,ProList)"></el-input>
                          </el-popover>
                          <!-- 小星 -->
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="操作"
                        width="60">
                        <template slot-scope="scope">
                          <el-tooltip class="item" style="padding-top:5px;" effect="dark" content="移除" placement="top-start">
                            <i class="el-icon-error size20" @click="remove(scope.row.ModelID,scope.$index,ProList)"></i>
                          </el-tooltip>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </div>
                <!--右侧列表 end-->
              </div>
              <!--列表内容 end-->
            </div>
            <!--产品库 end-->
            <!--信息概览 start-->
            <div class="source-info clear">
              <span class="left-title">产品信息</span>
              <ul>
                <li>
                  <p class="head-title">产品种类</p>
                  <p class="blue-txt">{{AllCount}}</p>
                </li>
                <li>
                  <p class="head-title">产品件数</p>
                  <p class="blue-txt">{{AllNumber}}</p>
                </li>
                <li class="large">
                  <p class="head-title">总货值/元</p>
                  <p class="blue-txt">{{AllPrice}}</p>
                </li>
                <li class="normal">
                  <p class="head-title">泡货体积/m³</p>
                  <p class="blue-txt">{{bubblesVolume}}</p>
                </li>
                <li class="normal">
                  <p class="head-title">重货重量/吨</p>
                  <p class="blue-txt">{{ProductWeight}}</p>
                </li>
                <li class="large">
                  <p class="head-title large">总体积/m³</p>
                  <p class="blue-txt">
                    <!-- 总体积不让修改 -->
                    <!-- <el-input class="input" v-model="AllVolume" size="mini"></el-input> -->
                    {{AllVolume}}
                  </p>
                </li>
                <li class="large">
                  <p class="head-title large">总重量/吨</p>
                  <p class="blue-txt">
                    <!-- 总重量不让修改 -->
                    <!-- <el-input class="input" v-model="AllWeight" size="mini"></el-input> -->
                    {{AllWeight}}
                  </p>
                </li>
              </ul>
            </div>
            <!--信息概览 end-->
            <div class="fill">
              <el-form label-width="130px" label-position="left" :model="sourceData" :rules="sourceDataRules"
                       ref="sourceData">
                <!-- <el-form-item label="提货方式" prop="DeliveryMode">
                  <el-radio v-model="sourceData.DeliveryMode" label="0">不限</el-radio>
                  <el-radio v-model="sourceData.DeliveryMode" label="1">送货上门</el-radio>
                  <el-radio v-model="sourceData.DeliveryMode" label="2">上门提货</el-radio>
                  <span class="gray-txt">（建议-出发地填写到详细地址）</span>
                </el-form-item> -->
                <div class="item-box">

                  <el-form-item label="发货地" prop="fromadd">
                    <el-cascader
                      class="address"
                      :show-all-levels="true"
                      :options="address"
                      v-model="sourceData.fromadd"
                      @change="handChange"
                    ></el-cascader>
                  </el-form-item>

                  <el-form-item prop="MercAddress">
                    <el-input
                      class="adress-details"
                      v-model="sourceData.MercAddress"
                      @blur="getArea(sourceData.fromadd,sourceData.MercAddress,1)"
                      placeholder="填选择具体街道门牌号 大厦 房间号码"
                    >
                    <template slot="suffix">
                      <el-tooltip class="item cuspoint" effect="dark" content="点击地图选址" placement="top">
                        <span class="mapIcon" @click="setValue('1')">
                          <i class="el-icon-location-outline"></i>
                        </span>
                      </el-tooltip>
                    </template>
                    </el-input>
                  </el-form-item>

                </div>
                <div class="item-box">
                  <el-form-item label="收货地" prop="toadd">
                    <el-cascader
                      class="address"
                      :show-all-levels="true"
                      v-model="sourceData.toadd"
                      :options="address"
                      @change="handChange1"
                      change-on-select
                    ></el-cascader>
                  </el-form-item>
                  <el-form-item prop="ToAddress" ref="ToAddress">
                    <el-input
                      class="adress-details"
                      v-model="sourceData.ToAddress"
                      @blur="getArea(sourceData.toadd,sourceData.ToAddress,0)"
                      placeholder="填写具体街道门牌号 大厦 房间号码"
                    >
                    <template slot="suffix">
                      <el-tooltip class="item cuspoint" effect="dark" content="点击地图选址" placement="top" >
                        <span class="mapIcon" @click="setValue('2')">
                          <i class="el-icon-location-outline"></i>
                        </span>
                      </el-tooltip>
                    </template>
                    </el-input>
                  </el-form-item>
                </div>

                <!-- 收货人信息 start -->
                <div class="item-box">
                  <el-form-item label="收货人信息" prop="Receiver" ref="Receiver">
                    <div class="normal">
                      <el-input v-model="sourceData.Receiver"
                        placeholder="请输入收货人名称"
                      ></el-input>
                    </div>
                  </el-form-item>

                  <el-form-item prop="ReceivePhone" ref="ReceivePhone">
                    <div class="normal">
                      <el-input v-model="sourceData.ReceivePhone"
                        placeholder="请输入收货人联系电话"
                      ></el-input>
                    </div>
                  </el-form-item>
                </div>
                <!-- 收货人信息 end -->

                <el-form-item label="装货时间" prop="LoadTime">
                  <el-col>
                    <el-date-picker
                      type="datetime"
                      :editable="false"
                      format="yyyy-MM-dd HH:mm"
                      value-format="yyyy-MM-dd HH:mm"
                      v-model="sourceData.LoadTime"
                      :picker-options="pickerOptions"
                      placeholder="选择日期时间">
                    </el-date-picker>
                  </el-col>
                </el-form-item>

                <div class="item-box">
                  <el-form-item label="车长/车型" prop="LongCopy">
                    <el-autocomplete
                      class="normal"
                      v-model="sourceData.LongCopy"
                      :fetch-suggestions='getLongList'
                      placeholder="车长"
                    ></el-autocomplete>
                  </el-form-item>
                  <el-form-item prop="Model">
                    <el-select placeholder="车型" v-model="sourceData.Model">
                      <el-option
                        v-for="(item,index) in ModelList"
                        :key="item.index"
                        :label="item.DictName"
                        :value="item.DictID"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <el-form-item label="货物类型" prop="CargoName">
                  <div class="normal">
                    <el-input  v-model="sourceData.CargoName" disabled></el-input>
                  </div>
                </el-form-item>
                <el-form-item label="运输类型" prop="Way">
                  <el-radio v-model="sourceData.Way" label="1">物流公司</el-radio>
                  <el-radio v-model="sourceData.Way" label="2">个体司机</el-radio>
                </el-form-item>

                <el-form-item label="接单模式" prop="Parttern">
                  <el-radio v-model="sourceData.Parttern" label="1">抢单</el-radio>
                  <el-radio v-model="sourceData.Parttern" label="2">最低价</el-radio>
                </el-form-item>

                <!-- 添加结算方式 -->
                <el-form-item label="结算方式" prop="Settlement" v-if="sourceData.Way == 1 && (sourceData.Parttern == 1 || sourceData.Parttern == 2)">
                  <el-radio v-if="sourceData.Parttern == 2" v-model="sourceData.Settlement" label="1">货主月结</el-radio>
                  <el-radio v-if="sourceData.Parttern == 1" v-model="sourceData.Settlement" label="0">货主现结</el-radio>
                  <el-radio v-model="sourceData.Settlement" label="2">收货方到付</el-radio>
                  <span class="gray-txt">（收货地详细地址，收货人信息必填，司机报价送货费）</span>
                </el-form-item>
                <!-- 添加结算方式 -->

                <el-form-item label="运费金额（元）" prop="Freight" v-if="sourceData.Parttern == 1 ">
                  <div class="normal">
                    <el-input placeholder="运费价格" v-model="sourceData.Freight"></el-input>
                  </div>
                </el-form-item>
                <el-form-item label="备注" prop="Remark">
                  <el-input v-model="sourceData.Remark" type="textarea" placeholder="备注信息例如，三不超 ，马上装货，需要雨布"></el-input>
                </el-form-item>
                <el-form-item class="mt-60" v-if="!getUserRole(userCharacter,'财务')">
                  <el-button type="primary" class="add-now" :disabled="hasCommit" @click="addSource('sourceData','1')"
                             round>立即发布
                  </el-button>
                  <el-button plain round class="add-now" :disabled="hasCommit" @click="addSource('sourceData','2')">
                    保存货源，稍后发布
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <foot></foot>
    <el-dialog title="选择地址" :visible.sync="IsShowMap" :close-on-click-modal="false" width="1000px"
               :close-on-press-escape="false">
      <div class="tip-box">
        <vue-map v-if="IsShowMap" :inputName="index" :location="mapData.address" :lng-lat="mapData.lnglat" @setFilter="locationFilter"></vue-map>
      </div>
    </el-dialog>
    <!-- 引入重复发布弹窗 -->
    <hint-dialog :dialogObject="hintDialogObject" @sureDialog="publishActSure()"></hint-dialog>
    <!-- 结束 -->
  </div>
</template>

<script type="es6">
import headTop from "components/header/head";
import dropDown from "components/header/children/dropdown";
import numAssemly from "components/num-assemly/num-assemly";
import foot from "components/footer/foot";
import vueMap from 'components/AMap/AMap';
import address from "config/address";
import AMap from "AMap";
import regs from "config/regExp";
import { getTimes } from 'config/getTimes';

 /** 小星引入未审核弹窗与发布成功后弹窗 **/
import { CarLongList } from "config/publicParam"; // 提取了下CarLongList
import hintDialog from 'components/hintDialog/hintDialog';
 /** 结束 **/
import leftMenuRouterHome from 'components/leftMenuRouter/leftMenuRouterHome'; // 左侧
import headMenuRouter from 'components/headMenuRouter/headMenuRouter'; // 头部
import { mapGetters, mapMutations } from 'vuex';

import {
  getSourceInfo2,
  getProductInfo,
  getCarModelList,
  addSource,
  GetPropertyTree,
  sourceUpdata,
  ProductGetAll,
  getEnterAddress,
  GetHeavyCargoStandard,
  JudgeOrderRepeatForFactory // 判断重复发货
} from "api/getData";

import { getUserRole } from 'config/myUtils';

const ClassifySpec = { // 定义 常量 特殊的产品类型
  coldLogistics: {id: '2239b1840bd540498abad53a235e8341', name: '冷链运输'},
  hazaChemicals: {id: '293022d917b644cb983f8858cf1f077f', name: '危化品'}
}

export default {
  data() {
    const data = [];
    return {
      isSurepublish: {}, // 记录检查接口返回显示弹窗，结合
      hintDialogObject: {}, // 重复发货提醒
      merchantStatus: this.$cookie.get("MerchantStatus"), // 新参数 用户审核状态
      index: '1',//确定点击的输入框
      userCharacter: this.$cookie.get("MemberDutiesID"),
      volumeCopy: '',//总体积副本
      weightCopy: '',//总重量副本
      showPopover: [],// 是否显示数量选择框
      // 限制时间输入
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().setDate(new Date().getDate() - 1);
        }
      },
      AMap,
      loading: false,
      userType: this.$cookie.get("MemberCrowd"),
      mapData: {
        //地图数据
        address: "",
        lnglat: [116.397428, 39.90923]
      },
      data5: data,
      caterIDbox: {
        MerchantID: this.$cookie.get("MemberMerchantID"),
        MemberID: this.$cookie.get("MemberID"),
        ModelIDs: ""
      },
      hasCommit: false, //是否已经提交
      treeData: [], //树形数据
      ModelList: [], //车型数据
      CarLongList: CarLongList, //车长数据
      ProModelID: "", //普货ID
      NormalProList: [], //普货列表
      CarModelList: [], //车型数据
      toAddress: [], //收货地地址
      IsShowMap: false, //是否显示地图
      address: address.area,
      ProList: [], //产品列表
      sourceData: {
        //货源数据
        Settlement: "1", // 结算方式
        ProductCategory: "",
        ProductCount: "",
        LightCargo: "",
        HeavyCargo: "",
        Parttern: "",
        MemberID: this.$cookie.get("MemberID"),
        Volume: "",
        Weight: "",
        Money: "",
        ToCity: "",
        toadd: [],
        ToAddress: "",
        toAddress: [],
        ToLongitude: "",
        ToLatitude: "",
        FromCity: "",
        fromadd: [],
        MercAddress: "",
        FromAddress: "",
        FromLongitude: "",
        FromLatitude: "",
        LoadTime: getTimes(new Date(new Date().getTime() + 3600000), "yyyy-MM-dd hh:mm"),
        Model: "",
        CargoName: "",
        Freight: "",
        Long: "99",
        LongCopy: '不限', // 添加lengthCopy 减少重复代码
        Product: "",
        Way: "",
        Classify: "",
        Remark: "",
        Type: "",
        // DeliveryMode: "0"
      },
      sourceDataRules: {
        //验证规则
        fromadd: [
          { required: true, message: "请选择发货地址", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if(value.length == 2 && (value[1] == '620200' || value[1] == '460400' || value[1] == '442000' || value[1] == '441900')){
                callback()
              } else if(value.length == 3){
                callback();
              } else {
                callback(new Error("发货地址请选择到区县"));
              }
            },
            trigger: "blur"
          },
        ],
        toadd: [
          { required: true, message: "请选择收货地址", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              let _ = this.sourceData.fromadd;
              if (_[0] == value[0] && _[1] == value[1] && _[2] == value[2]) {
                callback(new Error("发货地收货地省市区不能完全相同"));
              }
              if(value.length < 2){
                callback(new Error("收货地请选择到省市"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ],
        Settlement: [{required: true, message: '请选择结算方式', trigger: 'blur'}],
        LoadTime: [
          { required: true, message: "请选择装货时间", trigger: "blur" }
        ],
        LongCopy: [
          {
            validator: (rule, value, callback) => {
              if (value >= 1 && value <= 35) {
                callback();
              } else if (value == "不限") {
                callback();
              } else {
                callback(new Error("车长最大为35米！"));
              }
            },
            trigger: "change"
          }
        ],
        Parttern: [
          { required: true, message: "请选择接单模式", trigger: "change" }
        ],
        Freight: [
          { required: true, message: "请输入运费金额", trigger: "blur" },
          { pattern: regs.NF2, message: "请输入正确的金额", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (Number(value) <= 0) {
                callback('金额必须大于0');
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        Way: [{ required: true, message: "请选择货运类型", trigger: "change, blur" }],
        Receiver: [
          {
            validator: (rule, value, callback) => { // 当选中送货上门货主到付 必须填收货人等
              if ((this.sourceData.Way == '1' && this.sourceData.Settlement == '2')) {
                if (!value) {
                  callback('请输入收货人名称')
                } else {
                  callback()
                }
              } else {
                callback()
              }
            },
            trigger: "blur"
          }
        ],
        ReceivePhone: [
          {
            validator: (rule, value, callback) => { // 当选中送货上门货主到付 必须填收货人等
              if ((this.sourceData.Way == '1' && this.sourceData.Settlement == '2')) {
                if (!regs.Phone.test(value)) {
                  callback('请输入正确格式手机号')
                } else {
                  callback()
                }
              } else if (value && !regs.Phone.test(value)) {
                callback('您输入的手机号码格式不正确')
              } else {
                callback()
              }
            },
            trigger: "blur"
          }
        ],
        ToAddress: [
          {
            validator: (rule, value, callback) => { // 当选中送货上门货主到付 必须填收货人等
              if ((this.sourceData.Way == '1' && this.sourceData.Settlement == '2')) {
                if (!value) {
                  callback('请输入具体收货地地址')
                } else {
                  callback()
                }
              } else {
                callback()
              }
            }
          }
        ]
      }
    };
  },
  methods: {
    getUserRole: getUserRole,
    delePathFields () { // 清除下部分表单验证 收货人信息是否必填等
      this.$refs['Receiver'].clearValidate()
      this.$refs['ToAddress'].clearValidate()
      this.$refs['ReceivePhone'].clearValidate()
    },
    resetPathFields () { // 重置部分表单验证 收货人信息是否必填等
      this.$refs['sourceData'].validateField('Receiver')
      this.$refs['sourceData'].validateField('ToAddress')
      this.$refs['sourceData'].validateField('ReceivePhone')
    },
    publishActSure () { // 由于可能同事显示两种弹窗 得发布前确认
      let _ = this;
      if (_.isSurepublish.IsNoCarrier) {
        _.isSurepublish.IsNoCarrier = false;
        if (_.isSurepublish.IsRepeat) {
          _.loading = true;
          setTimeout(() => {
            _.loading = false;
            this.hintDialogObject = {
              visible: true, // 是否显示
              btnL: '取消发布', // 取消按钮名称
              btnR: '确定发布', // 确定按钮名称
              tip: '同样信息货源，您今天已发布一单！', // 提示
              des: '是否再次发布货源？', // 描述
              color: 'red', // 描述字颜色
              i: 'warning', // 图标
              iColor: '#fecb12' // 图标颜色
            }
          }, 600);
        } else {
          _.publishAct();
        }
      } else { // 说明是第二个弹窗
        _.publishAct();
      }
    },
    async publishAct () { // 发布操作
      if (this.hasCommit) {
        return;
      }
      this.hasCommit = true;
      this.loading = true;
      let res;
      if (this.$route.params.id) {
        if (this.$route.params.type) {
          res = await addSource(this.sourceData);
        } else {
          res = await sourceUpdata(this.sourceData);
        }
      } else {
        res = await addSource(this.sourceData);
      }
      this.hasCommit = false;
      this.loading = false;
      if (res.data.ResultCode == "000000") {
        if (this.curClickType == '1') {
          // 发布成功后跳转
          if(this.sourceData.Parttern == 2 && !res.data.ResultValue.PiPei) { // PiPei = 1 则无车辆 直接跳转至成功页 = 0 说明有车辆需要选择承运
            this.$router.push('/carrier/'+ res.data.ResultValue.OrderId);
            return;
          }
          // 否则跳至成功页
          this.$router.push({
            path: '/publishTipsPage',
            query: {
              i: 'success',
              tip: encodeURIComponent('恭喜您，货源发布成功！'),
              des: encodeURIComponent(res.data.ResultMessage),
              color: !res.data.ResultValue.PiPei ? '#999' : 'red',
              orderID: res.data.ResultValue.OrderId
            }
          });
        } else {
          this.$message.success({message: '保存货源成功！'});
          this.$router.push("/sourceList");
        }
      }
    },
    // 获取 数量
    getNum (num, scope) { // 小星添加
      this.volumeCopy = "";
      this.weightCopy = "";
      this.checkNumber(scope.row.Amount, scope.$index, this.ProList);
      scope.row.Amount = Number(num); // 赋值
      this.showPopover[scope.$index] = false;
      this.$set(this.ProList, scope.$index, this.ProList[scope.$index]); // 刷新
    },
    //数组去重
    arrQc(arr) {
      for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i] == arr[j]) {
            arr.splice(j, 1);
            j--;
          }
        }
      }
      return arr;
    },
    // 设置地图传回的参数到输入框
    setValue (index) {
      this.IsShowMap = true;
      this.index = index;
      if(index == "1"){
        this.mapData.address = this.sourceData.MercAddress;
        if(this.sourceData.FromLongitude){
          this.mapData.lnglat =  [this.sourceData.FromLongitude,this.sourceData.FromLatitude];
        }
      } else if(index == "2"){
        this.mapData.address = this.sourceData.ToAddress;
        if(this.sourceData.ToLongitude){
          this.mapData.lnglat =  [this.sourceData.ToLongitude,this.sourceData.ToLatitude];
        }
      }
      // mapData: {
      //   //地图数据
      //   address: "",
      //   lnglat: [116.397428, 39.90923]
      // },
    },
    // 设置地图传回的参数到输入框
    locationFilter (address, ID, lnglat, index) {
      this.IsShowMap = false;
      if(index == "1"){
        this.sourceData.fromadd = ID;
        this.sourceData.MercAddress = address;
        this.sourceData.FromLongitude = lnglat[0];
        this.sourceData.FromLatitude = lnglat[1];
      } else if(index == "2"){
        this.sourceData.toadd = ID;
        this.sourceData.ToAddress = address;
        this.sourceData.ToLongitude = lnglat[0];
        this.sourceData.ToLatitude = lnglat[1];
      }
    },
    //发货地地址改变清空后边地址
    handChange() {
      this.getArea(this.sourceData.fromadd, this.sourceData.MercAddress, 1);
      this.sourceData.MercAddress = "";
      this.mapData.address = "";
    },
    handChange1() {
      this.getArea(this.sourceData.toadd, this.sourceData.ToAddress, 0);
      this.sourceData.ToAddress = "";
      this.mapData.address = "";
    },
    //获取经纬度
    getLogLat(type) {
      let that = this;
      let geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: "all"
      });
      geocoder.getLocation(this.mapData.address, function(status, result) {
        if (status === "complete" && result.info === "OK") {
          if (type == 1) {
            that.sourceData.FromLongitude = result.geocodes[0].location.lng;
            that.sourceData.FromLatitude = result.geocodes[0].location.lat;
          } else if (type == 0) {
            that.sourceData.ToLongitude = result.geocodes[0].location.lng;
            that.sourceData.ToLatitude = result.geocodes[0].location.lat;
            // console.log(that.sourceData.ToLongitude,that.sourceData.ToLatitude);
          }
          that.mapData.lnglat = [result.geocodes[0].location.lng, result.geocodes[0].location.lat];
        }
      });
    },
    //验证输入数量
    checkNumber(Number, index, data) {
      if (!regs.Number1.test(Number)) {
        data[index].Amount = 1;
        this.$message.error({ message: "请输入正确的数量！" });
      } else {
        this.volumeCopy = "";
        this.weightCopy = "";
      }
    },
    //长度验证
    checkLeng(rule, value, callback) {
      if (value.length > 50) {
        callback(new Error("最多输入50个字符！"));
      } else {
        callback();
      }
    },
    //获取车长列表
    getLongList(queryString, callback) {
      callback(this.CarLongList);
    },
    //获取产品分类
    async GetPropertyTree() {
      let form = { MerchantID: this.$cookie.get("MemberMerchantID") };
      return new Promise((resolve, reject) => {
        GetPropertyTree(form).then((res) => {
          if (res.data.ResultCode == "000000") {
            let josnlist = res.data.ResultValue;
            this.treeData = [];
            josnlist.forEach(item => {
              let tableData = {};
              tableData.id = item.FirstID;
              tableData.label = item.FirstName;
              tableData.index = 1;
              tableData.children = [];
              item.SecondList.forEach(items => {
                const tableDatas = {};
                tableDatas.id = items.SecondID;
                tableDatas.label = items.SecondName;
                tableDatas.index = 2;
                tableDatas.children = [];
                tableData.children.push(tableDatas);
                items.ThirdList.forEach(list => {
                  const tablelist = {};
                  tablelist.id = list.ThirdID;
                  tablelist.label = list.ThirdName;
                  tableDatas.children.push(tablelist);
                });
              });
              this.treeData.push(tableData);
              this.data5 = JSON.parse(JSON.stringify(this.treeData));
            });
          }
          resolve('success')
        }).catch(() => {
          resolve('error')
        })
      })
    },
    //左侧筛选获取列表数据
    filter() {
      let list = this.$refs.data5.getCheckedNodes();
      this.caterIDbox.ModelIDs = "";
      for (let i = 0; i < list.length; i++) {
        if (list[i].index) {
        } else {
          this.caterIDbox.ModelIDs += list[i].id + ",";
        }
      }
      let s = this.caterIDbox.ModelIDs;
      this.caterIDbox.ModelIDs = s.slice(0, s.length - 1);
      this.ProductGetAll();
    },
    //获取产品列表
    async ProductGetAll() {
      if (this.caterIDbox.ModelIDs == "") {
        this.ProList = [];
        return false;
      }
      const res = await ProductGetAll(this.caterIDbox);
      if (res.data.ResultCode == "000000") {
        this.volumeCopy = "";
        this.weightCopy = "";
        let List = [];
        for (let i in res.data.ResultValue) { // 每次选择都请求了productGetAll 需要重置数量 采取轮询
          let Amount = '1',
              cur = res.data.ResultValue[i];
          this.ProList.forEach((c, j) => {
            if (c.ModelID === cur.ModelID) {
              Amount = c.Amount;
            }
          });
          cur.Amount = Amount;
        }
        if ( res.data.ResultValue[0].ClassifyID == ClassifySpec.coldLogistics.id || res.data.ResultValue[0].ClassifyID == ClassifySpec.hazaChemicals.id ) {
          let FirstID = res.data.ResultValue[0].ClassifyID;
          if (FirstID == ClassifySpec.coldLogistics.id) {
            this.sourceData.Classify = ClassifySpec.coldLogistics.id;
            this.sourceData.CargoName = ClassifySpec.coldLogistics.name;
          } else {
            this.sourceData.Classify = ClassifySpec.hazaChemicals.id;
            this.sourceData.CargoName = ClassifySpec.hazaChemicals.name;
          }
          if (res.data.ResultValue.length > 1) {
            for(let item in res.data.ResultValue){
              if( res.data.ResultValue[item].ClassifyID !=  FirstID ){
                this.$message.info({
                message: "冷链运输和危化品不能和其他货物一起运输！"
              });
              }
            }
          }
          for (let index = 0; index < res.data.ResultValue.length; index++) {
            if (res.data.ResultValue[index].ClassifyID == FirstID) {
              List.push(res.data.ResultValue[index]);
            }
          }
        } else {
          let Classify = [];
          let ClassifyName = [];
          for (let index = 0; index < res.data.ResultValue.length; index++) {
            if ( res.data.ResultValue[index].ClassifyID != ClassifySpec.coldLogistics.id && res.data.ResultValue[index].ClassifyID != ClassifySpec.hazaChemicals.id) {
              List.push(res.data.ResultValue[index]);
              for (let i = 0; i < List.length; i++) {
                Classify.push(List[i].ClassifyID);
                ClassifyName.push(List[i].ClassifyName);
              }
            } else {
              if (res.data.ResultValue.length > 1) {
                for(let item in res.data.ResultValue){
                  if( res.data.ResultValue[item].ClassifyID ==  ClassifySpec.coldLogistics.id ||  res.data.ResultValue[item].ClassifyID == ClassifySpec.hazaChemicals.id){
                    this.$message.info({
                    message: "冷链运输和危化品不能和其他货物一起运输！"
                  });
                }
                }
              }
            }
          }
          let arr = this.arrQc(Classify);
          let arr1 = this.arrQc(ClassifyName);
          this.sourceData.Classify = arr.join(",");
          this.sourceData.CargoName = arr1.join(",");
        }
        this.ProList = List;
        let key = [];
        for (let index in List) {
          key.push(List[index].ModelID);
        }
        this.$refs.data5.setCheckedKeys(key);
      } else {
        this.$message({
          type: "error",
          message: res.data.ResultMessage
        });
      }
    },
    //发布提交
    async addSource(sourceData, type) {
      this.curClickType = type; // 判断当前 时发布货源还是保存货源
      // 结束
      this.$refs[sourceData].validate(async valid => {
        if (this.ProList.length <= 0) {
          this.$message.error({ message: "请选择发货的产品！产品可在产品库添加" });
          return;
        }
        if(!regs.NF2.test(this.sourceData.Volume)){
          this.$message.error({message: '总体积格式填写有误！，请填写数字，最多保留两位小数！'})
          return;
        }
        if (!regs.NF2.test(this.sourceData.Weight)){
          this.$message.error({message: '总重量格式填写有误！，请填写数字，最多保留两位小数！'})
          return;
        }
        if (!valid) {
          return;
        }
        this.hasCommit = true;
        this.loading = true;
        let json = [];
        let productType = "";
        for (let index in this.ProList) {
          json.push({
            ProductID: this.ProList[index].ProductID,
            Amount: this.ProList[index].Amount
          });
          productType += this.ProList[index].ClassifyID + ",";
        }
        this.sourceData.Type = type;
        this.sourceData.Product = JSON.stringify(json);
        this.sourceData.ProductCategory = this.AllCount;
        this.sourceData.ProductCount = this.AllNumber;
        this.sourceData.Money = this.AllPrice;
        this.sourceData.Long = this.sourceData.LongCopy === '不限' ? '99' : this.sourceData.LongCopy; // 赋值length
        if (!this.sourceData.Model) {
          this.sourceData.Model = "";
        }
        this.sourceData.LightCargo = this.bubblesVolume;
        this.sourceData.HeavyCargo = this.ProductWeight;
        if (this.sourceData.MercAddress) {
          this.sourceData.FromAddress = this.sourceData.MercAddress;
        } else {
          this.sourceData.FromAddress = "";
        }
        this.sourceData.ToCity = this.sourceData.toadd[
          this.sourceData.toadd.length - 1
        ];
        this.sourceData.FromCity = this.sourceData.fromadd[
          this.sourceData.fromadd.length - 1
        ];
        //在发布前检测 检测是否已经发布
        const {data: {ResultCode, ResultMessage, ResultValue}} = await JudgeOrderRepeatForFactory(Object.assign({Owner: 1}, this.sourceData));
        this.hasCommit = false;
        this.loading = false;
        if (ResultCode !== '000000') return; // 请求失败直接结束
        this.isSurepublish = ResultValue; // 记录弹窗，集合
        if (ResultValue && ResultValue.IsNoCarrier) {
          this.hintDialogObject = {
            visible: true, // 是否显示
            btnL: '取消发布', // 取消按钮名称
            btnR: '确定发布', // 确定按钮名称
            tip: '十分抱歉 T_T～！', // 提示
            des: '尊敬的用户，该路线暂无物流公司开通，可能长时间无承运人抢单！', // 描述
            color: 'red', // 描述字颜色
            i: 'warning', // 图标
            iColor: '#fecb12' // 图标颜色
          }
          return;
        }
        if (ResultValue && ResultValue.IsRepeat) {
          this.hintDialogObject = {
            visible: true, // 是否显示
            btnL: '取消发布', // 取消按钮名称
            btnR: '确定发布', // 确定按钮名称
            tip: '同样信息货源，您今天已发布一单！', // 提示
            des: '是否再次发布货源？', // 描述
            color: 'red', // 描述字颜色
            i: 'warning', // 图标
            iColor: '#fecb12' // 图标颜色
          }
          return;
        }
        this.publishAct(); // 执行发布操作
      });
    },
    //移除产品选中
    remove(id, index, list) {
      list.splice(index, 1);
      let checkedIDs = [],
          cargoNameArr = []; // 为了筛除货物类型
      list.forEach(function(l, i) {
        checkedIDs.push(l.ModelID);
        cargoNameArr.push(l.ClassifyName);
      });
      this.$refs.data5.setCheckedKeys(checkedIDs);
      this.sourceData.CargoName = this.arrQc(cargoNameArr).join(',');
    },
    //获取城市联动的label
    getArea(cityID, address, type) {
      let arr = cityID;
      let province, city, area;
      for (let item in this.address) {
        if (arr[0] && this.address[item].value == arr[0]) {
          province = this.address[item].label;
          for (let index in this.address[item].children) {
            if (arr[1] && this.address[item].children[index].value == arr[1]) {
              city = this.address[item].children[index].label;
              for (let i in this.address[item].children[index].children) {
                if (
                  arr[2] &&
                  this.address[item].children[index].children[i].value == arr[2]
                ) {
                  area = this.address[item].children[index].children[i].label;
                }
              }
            }
          }
        }
      }
      if (address) {
        this.mapData.address = province + city + area + address;
      } else {
        this.mapData.address = province + city + area;
      }
      this.getLogLat(type);
    },
    // 获取货源基本信息
    async getSource() {
      return new Promise((resolve, reject) => {
        getSourceInfo2({
          OrdeID: this.$route.params.id,
          MemberID: this.$cookie.get("MemberID")
        }).then(res => {
          if (
            res.data &&
            res.data.ResultCode == "000000" &&
            res.data.ResultValue
          ) {
            let Data = res.data.ResultValue;
            let toIDArray = [];
            let fromIDArray = [];
            let FromLongLat = [];
            let toLongLat = [];
            toIDArray = Data.ToCityID.split(",");
            fromIDArray = Data.FromCityID.split(",");
            FromLongLat = Data.FromLongAndLat.split(",");
            toLongLat = Data.ToLongAndLat.split(",");
            for (let index in toIDArray) {
              if (toIDArray[index] != "") {
                this.sourceData.toadd.push(Number(toIDArray[index]));
              }
            }
            for (let index in fromIDArray) {
              if (fromIDArray[index] != "") {
                this.sourceData.fromadd.push(Number(fromIDArray[index]));
              }
            }
            this.sourceData.FromLongitude = FromLongLat[0];
            this.sourceData.FromLatitude = FromLongLat[1];
            this.sourceData.ToLongitude = toLongLat[0];
            this.sourceData.ToLatitude = toLongLat[1];
            this.sourceData.MercAddress = Data.FromAddress;
            this.sourceData.ToAddress = Data.ToAddress;
            this.sourceData.LoadTime = Data.LoadTime;
            if (Data.Long == "99") {
              this.sourceData.LongCopy = "不限";
            } else {
              this.sourceData.LongCopy = String(Data.Long);
            }
            this.sourceData.Model = String(Data.Model);
            this.sourceData.Code = Data.Code;
            this.sourceData.Classify = Data.ClassifyID;
            this.sourceData.CargoName = Data.CargoName;
            this.volumeCopy = Data.Volume;
            this.weightCopy = Data.Weight;
            this.sourceData.Weight = String(Data.Weight);
            this.sourceData.Way = String(Data.Way);
            this.sourceData.Volume = String(Data.Volume);
            this.sourceData.Weight = Data.Weight;
            this.sourceData.Parttern = String(Data.Parttern);
            this.sourceData.Remark = Data.Remark;
            this.sourceData.Freight = Data.Freight;
            this.sourceData.LoadTime = Data.LoadTime;
            this.ProList = Data.Product;
            this.ProList.forEach((c) => { // 字段ID 不同统一下
              c.ModelID = c.ProdModel;
            })
            this.sourceData.DeliveryMode = Data.DeliveryMode;
            this.sourceData.Receiver = Data.OrdeReceiver;
            this.sourceData.ReceivePhone = Data.OrdeReceivePhone;
            if (Data.Way == 1) { // 运输类型 为1 物流公司得判断下结算方式 和 是否到付
              this.sourceData.Settlement = String(Data.OrdeSettlement);
            }
            let key = [];
            for (let item in this.ProList) {
              key.push(this.ProList[item].ModelID);
            }
            this.$refs.data5.setCheckedKeys(key);
          }
          resolve('success'); // 定义个promise
        }).catch(() => {
          resolve('error');
        })
      })
    },
    async GetHeavyCargoStandard () {
      const resData = await GetHeavyCargoStandard()
      if (resData.data.ResultCode === '000000') {
        this.SET_bulkyCargo(resData.data.ResultValue)
      }
    },
    ...mapMutations({
      SET_bulkyCargo: 'SET_bulkyCargo'
    })
  },
  created() {
    if (this.userType != 1) {
      this.$router.push("/add");
      return;
    }

    this.loading = true; // 加载 开启loading

    let promise1 = new Promise((resolve, reject) => {  //获取树形数据 用promise实现下同步
      this.GetPropertyTree().then((res) => {
        resolve(res);
      })
    })

    let promise2 = new Promise((resolve, reject) => {  //获取车型列表 用promise实现下同步
      getCarModelList().then(res => {
        if (res.data.ResultCode === "000000" && res.data.ResultValue) {
          res.data.ResultValue.push({ DictID: "", DictName: "不限" });
          this.ModelList = res.data.ResultValue;
        }
        resolve(res);
      }).catch(() => {
        resolve('error');
      })
    })

    let promise3 = new Promise((resolve, reject) => { // 获取入驻的公司地址 用promise实现下同步
      if (!this.$route.params.id) {
        getEnterAddress({ MemberID: this.$cookie.get("MemberID") }).then(res => {
          if (res.data.ResultCode === "000000" && res.data.ResultValue) {
            let arr = res.data.ResultValue.FromCityID.split(",");
            for (let i in arr) {
              this.sourceData.fromadd.push(Number(arr[i]));
            }
            this.sourceData.MercAddress = res.data.ResultValue.FromAddress;
            this.mapData.address = res.data.ResultValue.FromAddress;
            this.getArea(this.sourceData.fromadd, this.sourceData.MercAddress, 1);
          }
          resolve(res);
        }).catch(() => {
          resolve('error');
        })
      } else {
        resolve('end');
      }
    })

    let promise4 = new Promise((resolve, reject) => { // 获取相对应数据 有ID情况
      if (this.$route.params.id) {
        this.sourceData.OrderID = this.$route.params.id;
        this.getSource().then((res) => {
          resolve(res);
        }).catch(() => {
          resolve('error');
        })
      } else {
        resolve('end');
      }
    })

    Promise.all([promise1, promise2, promise3, promise4]).then(() => { // 加载完毕关闭loading
      this.loading = false;
    })

    // 判断阈值是否存在
    if (this.bulkyCargo < 0) {
      this.GetHeavyCargoStandard()
    }
  },
  mounted () {
  },
  computed: {
    //总货值
    AllPrice() {
      let volume = 0;
      for (let item in this.ProList) {
        volume +=
          Number(this.ProList[item].Money) * Number(this.ProList[item].Amount);
      }
      return volume.toFixed(2);
    },
    //总种类
    AllCount() {
      return this.ProList.length;
    },
    //总数量
    AllNumber() {
      let count = 0;
      for (let item in this.ProList) {
        count += Number(this.ProList[item].Amount);
      }
      return count;
    },
    //总体积
    AllVolume: {
      get() {
        if(this.volumeCopy){
          return this.volumeCopy;
        } else {
          let volume = 0;
          for (let item in this.ProList) {
            volume +=
              Number(this.ProList[item].Length) *
              Number(this.ProList[item].Width) *
              Number(this.ProList[item].Height) *
              Number(this.ProList[item].Amount) /
              1000000;
          }
          this.sourceData.Volume = volume.toFixed(2);
          return volume.toFixed(2);
        }
      },
      set(val) {
        this.sourceData.Volume = val;
      }
    },
    //总重量
    AllWeight: {
      get() {
        if(this.weightCopy) {
          return this.weightCopy;
        } else {
          let weight = 0;
          for (let item in this.ProList) {
            weight +=
              Number(this.ProList[item].Weight) /
              1000 *
              Number(this.ProList[item].Amount);
          }
          this.sourceData.Weight = weight.toFixed(2);
          return weight.toFixed(2);
        }
      },
      set(val) {
        this.sourceData.Weight = val;
      }
    },
    //泡货体积
    bubblesVolume() {
      let productVolume = 0;
      for (let item in this.ProList) {
        if (
          this.ProList[item].ClassifyID == "e55286f25d74412cbb3923e7818b8eaa"
        ) {
          let weights =
            this.ProList[item].Weight *
            1000000 /
            (this.ProList[item].Length *
              this.ProList[item].Width *
              this.ProList[item].Height);
          if (weights < this.bulkyCargo) {
            let volume =
              this.ProList[item].Length *
              this.ProList[item].Width *
              this.ProList[item].Height *
              this.ProList[item].Amount /
              1000000;
            productVolume += volume;
          }
        }
      }
      return productVolume.toFixed(2);
    },
    //重货重量
    ProductWeight() {
      let WeightProduct = 0;
      let Heavy = 0;
      for (let item in this.ProList) {
        if (
          this.ProList[item].ClassifyID == "e55286f25d74412cbb3923e7818b8eaa"
        ) {
          let weights =
            this.ProList[item].Weight *
            1000000 /
            (this.ProList[item].Length *
              this.ProList[item].Width *
              this.ProList[item].Height);
          if (weights < this.bulkyCargo) {
            WeightProduct +=
              this.ProList[item].Weight * this.ProList[item].Amount / 1000;
          }
        }
      }
      if (Number(this.AllWeight) - WeightProduct < 0) {
        return 0.0;
      } else {
        return (Number(this.AllWeight) - WeightProduct).toFixed(2);
      }
    },
    ...mapGetters([
      'bulkyCargo'
    ])
  },
  components: {
    headTop,
    dropDown,
    foot,
    numAssemly,
    vueMap,
    hintDialog,
    leftMenuRouterHome, // 左侧导航
    headMenuRouter // 左侧
  },
  watch: {
    'sourceData.Way' (n) { // 监听运输类型 对部分表单验证
      if (this.sourceData.Settlement == '2' && n == '1') {
        this.resetPathFields()
      } else {
        this.delePathFields()
      }
      if (n) {
        this.$refs['sourceData'].validateField('Way')
      }
    },
    'sourceData.Settlement' (n) { // 监听是否到付 对部分表单验证
      if (n == '2') {
        this.resetPathFields()
      } else {
        this.delePathFields()
      }
    },
    'sourceData.Parttern' (n) { // 接单模式修改清除不掉提示问题 优化
      switch (n) {

        case '2':
        this.sourceData.Settlement = '1';
        break;
        case '1':
        this.sourceData.Settlement = '0';
        break;
      }
      if (n) {
        this.$refs['sourceData'].validateField('Parttern')
      }
    },
  }
};
</script>

<style lang="stylus" scoped>
@import '../../assets/styles/variable.styl';
.content
  position: relative
  width: 1200px
  margin: 10px auto 40px
.content-left
  float: left
  width: 200px
  background: #ffffff
  > ul
    width: 200px
    position: absolute
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
  background-color: #fff
  .product
    background: #FFFFFF
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
    padding: 40px
    .list-content
      position: relative
      overflow: hidden
    .list-left
      float: left
      width: 207px
      height: 400px
      border-left: 1px solid $borderColor
      border-bottom: 1px solid $borderColor
      .left-name
        height: 38px
        line-height: 38px
        text-align: center
        color: #909399
        background-color: #FAFAFA
        border: 1px solid $borderColor
        border-left: 0
      .tree-list
        height: 359px
        border-right: 1px solid $borderColor
        overflow: auto
        overflow-y: auto
        overflow-x: hidden
        .tree-name
          float: left
          width: 150px
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
    .list-right
      float: left
      width: 701px
      height: 399px
      overflow-y: auto
      overflow-x: hidden
      border-right: 1px solid $borderColor
      border-bottom: 1px solid $borderColor
      border-top: 1px solid $borderColor
      .add
        color: $blue
        text-align: center
        cursor: pointer
      .text-ellipsis
        display: inline-block
        max-width: 70px
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
.source-info
  height: 90px
  line-height: 90px
  margin: 20px 0
  border: 1px solid $borderColor
  >ul
    float: left
    line-height: normal
    overflow: hidden
    li
      float: left
      width: 100px
      .head-title
        height: 40px
        line-height: 40px
        text-align: center
        background-color: #F7FBFB
      .blue-txt
        height: 50px
        line-height: 50px
        text-align: center
      .input
        width: 100px
    .large
      width: 120px
    .normal
      width: 114px
  .left-title
    float: left
    width: 120px
    text-align: center
    color: #ffff
    background: #409eff
    font-size: 16px
  .info
    margin-top: 12px
    line-height: normal
    .info-item
      margin-right: 20px
.fill
  padding: 0 20px
  .address
    width: 300px
  .adress-details
    width: 400px
  .mapIcon
    display: inline-block
    width: 30px
    height: 30px
    line-height: 30px
  .large
    width: 444px
.tip-box
  padding: 0 40px 50px
.tip-icon
  margin-left: 10px
  color: $blue
  font-size: 24px
  cursor: pointer
.normal
  width: 217px
.add-now
  width: 200px
  font-size: 16px
.product-name
  width: 180px
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
</style>

<style lang="stylus">
.source // 添加外层样式防止 样式外泄
  .source-table.el-table--scrollable-x .el-table__body-wrapper
      overflow-x: hidden
  .item-box // 重置一行多个el-input
    margin-bottom: 22px
    font-size: 0
    .el-form-item
      margin-bottom: 0
      display: inline-block
      &:not(:first-child)
        .el-form-item__content
          margin-left: 10px !important
</style>
