<template>
  <div class="slip-publish">
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
        <div class="title-box"><span class="title-name">货物统计 < 转单-发布货源</span></div>
        <div class="container clear">
          <!-- 产品信息 -->
          <div class="info-box">
            <div class="info-title">发货信息</div>
            <div class="info-con" v-if="Number(getInfoObj.OrderCount)">
              <p class="roads"><span>{{getInfoObj.OrderFromAddress}}</span><span><img src="../../assets/images/gofrom.png" alt=""></span><span>{{getInfoObj.OrderToAddress}}</span></p>
              <p class="info"><span class="gray">发货详情：</span><span>共计{{getInfoObj.OrderCount}}单，{{getInfoObj.OrderClassifyName.join('、')}}共计{{getInfoObj.OrderProductCount}}件，运费共计{{getInfoObj.OrderFreight}}元；</span></p>
              <p class="info"><span class="gray">体积重量：</span><span>共计<span class="orange">{{getInfoObj.OrderVolume}}m³/{{getInfoObj.OrderWeight}}吨</span></span></p>
            </div>
          </div>
          <!-- order 列表 -->
          <ul class="order-list">
            <li class="order-item" v-for="(item, index) in orderList" :key="index">
              <div class="info-title">
                <div class="fl order-code">分单{{index + 1}}</div>
                <div class="fl order-num">货源编号：<span class="blue">{{item.OrderCode}}</span></div>
              </div>
              <div class="info-con">
                <div class="con-item">
                  <span class="lab">货物类型：</span><span class="val">{{item.OrderClassifyName}}</span>
                </div>
                <div class="con-item">
                  <span class="lab">车长车型：</span><span class="val">{{item.OrderLong}}/{{item.OrderModelName}}</span>
                </div>
                <div class="con-item">
                  <span class="lab">体积重量：</span><span class="val orange">{{item.OrderVolume}}m³/{{item.OrderWeight}}吨</span>
                </div>
                <div class="con-item mt-20">
                  <span class="lab">结算方式：</span><span class="val">{{item.OrderSettlementName}}</span>
                </div>
                <div class="con-item mt-20">
                  <span class="lab">运&nbsp;&nbsp;费：</span><span class="val orange">¥{{item.OrderFreight}}</span>
                </div>
                <div class="con-item mt-20 w-100" v-if="item.OrderReceiver || item.OrderReceiverPhone && item.OrderToAddress">
                  <span class="lab">收货人名称：</span><span class="val"><span class="mr-20">{{item.OrderReceiver}}</span><span class="mr-20">{{item.OrderReceiverPhone}}</span><span class="mr-20">{{item.OrderToAddress}}</span></span>
                </div>
              </div>
            </li>
          </ul>
          <!-- 表单 -->
          <div class="form-box">
            <el-form ref="publishForm" :model="publishForm" label-position="left" label-width="110px" :rules="publishRules">
              <div class="item-box">
                <el-form-item label="出发地" prop="fromAdd">
                  <el-cascader
                    class="address"
                    :show-all-levels="true"
                    :options="address"
                    v-model="publishForm.fromAdd"
                    @change="handChange"
                  ></el-cascader>
                </el-form-item>

                <el-form-item prop="FromAddress">
                  <el-input
                    class="adress-details"
                    v-model="publishForm.FromAddress"
                    @blur="getArea(publishForm.fromAdd, publishForm.FromAddress, 1)"
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
              <el-form-item label="装货时间" prop="LoadTime">
                <el-date-picker
                  type="datetime"
                  :editable="false"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm"
                  v-model="publishForm.LoadTime"
                  :picker-options="pickerOptions"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
              <div class="item-box">
                <el-form-item label="车长/车型" prop="LengthCopy">
                  <el-autocomplete
                    class="normal"
                    v-model="publishForm.LengthCopy"
                    :fetch-suggestions='getLongList'
                    placeholder="车长"
                  ></el-autocomplete>
                </el-form-item>
                <el-form-item prop="Model">
                  <el-select placeholder="车型" v-model="publishForm.ModelID">
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

<!--               <el-form-item label="接单模式" prop="Parttern">
                <el-radio v-model="publishForm.Parttern" label="1">抢单</el-radio>
                <el-radio v-model="publishForm.Parttern" label="2">最低价</el-radio>
              </el-form-item> -->
              <el-form-item label="运费金额（元）" prop="Freight" v-if="publishForm.Parttern == 1 ">
                <div class="normal">
                  <el-input placeholder="运费价格" v-model="publishForm.Freight" disabled></el-input>
                </div>
              </el-form-item>
              <el-form-item label="备注" prop="Remark">
                <el-input v-model="publishForm.Remark" type="textarea" placeholder="备注信息例如，三不超 ，马上装货，需要雨布"></el-input>
              </el-form-item>
              <el-form-item class="mt-60" v-if="!getUserRole(userCharacter,'财务')">
                  <el-button type="primary" class="add-now" @click="publishAct"
                             round>转单-发布货源
                  </el-button>
                </el-form-item>
              </el-form>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="选择地址" :visible.sync="IsShowMap" :close-on-click-modal="false" width="1000px"
               :close-on-press-escape="false">
      <div class="tip-box">
        <vue-map v-if="IsShowMap" :inputName="index" :location="mapData.address" :lng-lat="mapData.lnglat" @setFilter="locationFilter"></vue-map>
      </div>
    </el-dialog>
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
  import address from 'config/address';
  import { CarLongList } from "config/publicParam"; // 提取了下CarLongList
  import AMap from 'AMap';
  import vueMap from 'components/AMap/AMap'; // 地图选点
  import regs from 'config/regExp';
  import { getTimes } from 'config/getTimes';
  import { getUserRole } from 'config/myUtils';

  import {
    getEnterAddress, // 获取地区
    getCarModelList, // 获取车型
    ReleaseTransferOrder, // 发布
    TransferOrderDetails, // 获取所有订单列表
    GetOrderDetailsInfo // 获取总计
  } from "api/getData";

  export default {
    mixins: [m_login],
    data () {
      return {
        loading: true,
        IsShowMap: false, //是否显示地图
        address: address.area,
        CarLongList: CarLongList, // 车长
        ModelList: [], // 车型列表
        getInfoObj: {}, // 获取发货信息容器
        orderList: [], // 订单列表
        publishForm: {
          fromAdd: [], // 方便本地选取，后端不接收
          LengthCopy: '不限', // 方便本地选取，后端不接收
          MerchantID: this.$cookie.get('MemberMerchantID'),  // 商家ID
          OrderID: this.$route.params.formID, // 赋值ID
          FromProvinceID: '',
          FromCityID: '',
          FromCountyID: '',
          FromAddress: '',
          FromLongitude: '',
          FromLatitude: '',
          ToProvinceID: '',
          ToCityID: '',
          ToCountyID: '',
          Classify: '',
          Length: '99',
          ModelID: '',
          Weight: '',
          Volume: '',
          Freight: '',
          LoadTime: getTimes(new Date(new Date().getTime() + 3600000), "yyyy-MM-dd hh:mm"),
          Remark: '',
          Parttern: '1'
        },
        pickerOptions: { // 限制时间输入
          disabledDate (time) {
            return time.getTime() < new Date().setDate(new Date().getDate() - 1);
          }
        },
        mapData: {
          //地图数据
          address: "",
          lnglat: [116.397428, 39.90923]
        },
        publishRules: {
          fromAdd: [
            { required: true, message: "请选择出发地地址", trigger: "change" }
          ],
          LoadTime: [
            { required: true, message: "请选择装货时间", trigger: "blur" }
          ],
          LengthCopy: [
            { required: true, message: "请选择车长/车型", trigger: "blur" },
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
            { required: true, message: "请选择抢单模式", trigger: "blur" },
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
        }
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
      let promise1 = _.getCarModelList();
      let promise2 = _.GetOrderDetailsInfo();
      let promise3 = _.TransferOrderDetails();
      let promise4 = _.getEnterAddress();
      Promise.all([promise1, promise2, promise3, promise4]).then(() => { // 加载完毕关闭loading
        _.loading = false;
      })
    },
    computed: {

    },
    methods: {
      getUserRole: getUserRole,
      publishAct () { // 发布操作
        let _ = this;
        _.publishForm.FromCityID = _.publishForm.fromAdd[1];
        _.publishForm.FromCountyID = _.publishForm.fromAdd[2];
        _.publishForm.FromProvinceID = _.publishForm.fromAdd[0];
        _.$refs['publishForm'].validate(async valid => {
          if (!valid) return;
          _.loading = true;
          const {data : { ResultCode, ResultValue, ResultMessage, TotalRecords }} = await ReleaseTransferOrder(_.publishForm);
          _.loading = false;
          if (ResultCode === '000000') {
            // 否则跳至成功页
            this.$router.push({
              path: '/slipPublishTipsPage',
              query: {
                i: 'success',
                tip: encodeURIComponent('恭喜您，货源发布成功！'),
                des: encodeURIComponent(ResultMessage),
                color: !ResultValue.PiPei ? '#999' : 'red',
                orderID: ResultValue.OrderID
              }
            });
          }
        });
      },

      getEnterAddress () {
        let _ = this;
        return new Promise((resolve, reject) => { // 获取入驻的公司地址 用promise实现下同步
          getEnterAddress().then(res => {
            const {data : { ResultCode, ResultValue, ResultMessage, TotalRecords }} = res;
            if (ResultCode === '000000') {
              let arr = ResultValue.FromCityID.split(",");
              for (let i in arr) {
                _.publishForm.fromAdd.push(Number(arr[i]));
              }
              _.publishForm.FromAddress = ResultValue.FromAddress;
              _.mapData.address = ResultValue.FromAddress;
              this.getArea(_.publishForm.fromAdd, _.publishForm.FromAddress, 1);
            }
            resolve(res);
          }).catch(() => {
            resolve('error');
          })
        })
      },

      getCarModelList () {
        let _ = this;
        return new Promise((resolve, reject) => {  //获取车型列表 用promise实现下同步
          getCarModelList().then(res => {
            const {data : { ResultCode, ResultValue, ResultMessage, TotalRecords }} = res;
            if (ResultCode === '000000') {
              res.data.ResultValue.push({ DictID: '', DictName: '不限' });
              _.ModelList = ResultValue;
            }
            resolve(res);
          }).catch(() => {
            resolve('error'); // 报错继续
          })
        })
      },

      TransferOrderDetails () { // 获取所有订单列表
        let _ = this,
            params = {OrderID: _.$route.params.formID, MerchantID: _.MemberMerchantID};
        return new Promise((resolve, reject) => {
          TransferOrderDetails(params).then((res) => {
            const {data : { ResultCode, ResultValue, ResultMessage, TotalRecords }} = res;
            if (ResultCode === '000000') {
              _.orderList = ResultValue;
              resolve(res);
            } else {
              reject(res); // 报错停止
            }
          }).catch((r) => {
            reject(r); // 报错停止
          })
        })
      },

      GetOrderDetailsInfo () { // 获取 总信息
        let _ = this,
            params = {OrderID: _.$route.params.formID};
        return new Promise((resolve, reject) => {
          GetOrderDetailsInfo(params).then((res) => {
            const { data: { ResultCode, ResultValue, ResultMessage, TotalRecords }} = res;
            if (ResultCode === '000000') {
              _.getInfoObj = ResultValue;
              _.publishForm.Freight = ResultValue.OrderFreight;
              resolve(res);
            } else {
              reject(res); // 报错停止
            }
          }).catch((r) => {
            reject(r); // 报错停止
          })
        })
      },
      // 获取城市联动的label
      getArea (cityID, address, type) {
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
      // 获取经纬度
      getLogLat (type) {
        let _ = this;
        let geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: "all"
        });
        geocoder.getLocation(_.mapData.address, function(status, result) {
          if (status === "complete" && result.info === "OK") {
            _.publishForm.FromLongitude = result.geocodes[0].location.lng;
            _.publishForm.FromLatitude = result.geocodes[0].location.lat;
            _.mapData.lnglat = [result.geocodes[0].location.lng, result.geocodes[0].location.lat];
          }
        });
      },
      // 设置地图传回的参数到输入框
      setValue (index) {
        this.IsShowMap = true;
        this.index = index;
        this.mapData.address = this.publishForm.FromAddress;
        if(this.publishForm.FromLongitude){
          this.mapData.lnglat =  [this.publishForm.FromLongitude,this.publishForm.FromLatitude];
        }
      },
      // 发货地地址改变清空后边地址
      handChange () {
        let _ = this;
        _.getArea(_.publishForm.fromAdd, _.publishForm.FromAddress, 1);
        _.publishForm.FromAddress = "";
        _.mapData.address = "";
      },
      // 设置地图传回的参数到输入框
      locationFilter (address, ID, lnglat, index) {
        this.IsShowMap = false;
        this.publishForm.fromadd = ID;
        this.publishForm.FromAddress = address;
        this.publishForm.FromLongitude = lnglat[0];
        this.publishForm.FromLatitude = lnglat[1];
      },
      // 获取车长列表
      getLongList (queryString, callback) {
        callback(this.CarLongList);
      },
    },
    components: {
      headTop,
      dropDown,
      foot,
      AMap,
      vueMap,
      leftMenuRouterHome, // 左侧导航
      headMenuRouter // 左侧
    },
    watch: {
      'publishForm.LengthCopy' (n) { // 联动 length
        if (n === '不限') {
          this.publishForm.Length = '99';
        } else {
          this.publishForm.Length = n;
        }
      },
      'publishForm.Parttern' (n) { // 接单模式修改清除不掉提示问题 优化
        if (n) {
          this.$refs['publishForm'].validateField('Parttern');
        }
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../assets/styles/template.styl'
.slip-publish
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
  .order-list
    .order-item
      position: relative
      border: 1px solid $borderColor
      margin-top: 10px
      overflow: hidden
      .info-title
        line-height: 40px
        overflow: hidden
        border-bottom: 1px solid $borderColor
        .order-num
          height: 40px
          width: 740px
          padding-left: 10px
        .order-code
          text-align: center
          height: 40px
          width: 150px
          background: $theadbg
          border-right: 1px solid $borderColor
        .blue
          color: $blue
      .info-con
        padding: 18px
        position: relative
        overflow: hidden
        .con-item
          float: left
          width: 30%
          &.w-100
            width: 100%
          .lab
            color: #999
          .orange
            color: $orange
  .form-box
    margin-top: 20px
    padding-left: 10px
    .item-box
      .address
        width: 300px
      .adress-details
        width: 400px
      .mapIcon
        display: inline-block
        width: 30px
        height: 30px
        line-height: 30px
    .normal
      width: 217px
    .add-now
      width: 200px
</style>
<style lang="stylus">
.slip-publish // 添加外层样式防止 样式外泄
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
