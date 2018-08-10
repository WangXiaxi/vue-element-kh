<template>
  <div class="add">
    <head-top>
      <span class="title" slot="index">{{userType == 1?'货主':'物流公司'}}-工作台</span>
      <div class="header-center" slot="menu">
        <head-menu-router activeLink="index"></head-menu-router>
      </div>
      <drop-down slot="info"></drop-down>
    </head-top>
    <div class="content clear">
      <div class="content-left">
        <left-menu-router-home activeLink="add"></left-menu-router-home>
      </div>
      <div class="content-right">
        <div class="product fr" v-loading="loading">
          <p class="title-box"><span class="title-name">发布货源</span></p>
          <div class="container clear">
            <div class="fill">
              <el-form label-width="130px" label-position="left" :model="sourceData" :rules="sourceDataRules"
                       ref="sourceData">
                <el-form-item label="货物信息">
                  <div class="goodsInfo">
                    <div>
                      <ul>
                        <li>
                          <p class="header">货物名称</p>
                          <p>
                            <el-form-item prop="CargoName">
                              <el-input
                                class="mini"
                                placeholder="请输入2-12字"
                                v-model="sourceData.CargoName"
                              ></el-input>
                            </el-form-item>
                          </p>
                        </li>
                        <li>
                          <p  class="header">货物体积/m³</p>
                          <p>
                             <el-form-item prop="Volume">
                               <el-input
                              class="mini"
                              v-model="sourceData.Volume"
                              placeholder="请输入货物体积"
                            ></el-input>
                             </el-form-item>
                          </p>
                        </li>
                        <li>
                          <p  class="header">货物重量/吨</p>
                          <p>
                            <el-form-item prop="Weight">
                              <el-input
                              class="mini"
                              v-model="sourceData.Weight"
                              placeholder="请输入货物重量"
                            ></el-input>
                            </el-form-item>
                          </p>
                        </li>
                        <li>
                          <p class="header">货物类型
                            <el-tooltip :content="`少于1立方米/${bulkyCargo}公斤是泡货，多于1立方米/${bulkyCargo}公斤是重货。如有疑问请联系客服：0571-57137790`" placement="top"
                            v-if="sourceData.Classify == 'e55286f25d74412cbb3923e7818b8eaa'"
                            effect="light">
                            <i class="el-icon-question blue-txt"></i>
                          </el-tooltip></p>
                          <p>
                            <el-form-item prop="Classify">
                              <el-select placeholder="请选择货物类型" v-model="sourceData.Classify">
                              <el-option
                                v-for="(item,index) in productList"
                                :key="item.index"
                                :label="item.DictName"
                                :value="item.DictID"
                              >
                              </el-option>
                            </el-select>
                            </el-form-item>
                          </p>
                          <span class="proType">{{changeBubble}}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </el-form-item>

                <div class="item-box">
                  <el-form-item label="出发地" prop="fromID">
                    <el-cascader
                      placeholder="请选择出发地"
                      class="address"
                      :show-all-levels="true"
                      :options="address"
                      v-model="sourceData.fromID"
                      @change="handChange"
                    ></el-cascader>
                  </el-form-item>
                  <el-form-item prop="FromAddress">
                    <el-input
                      class="adress-details"
                      v-model="sourceData.FromAddress"
                      @blur="getArea(sourceData.fromID,sourceData.FromAddress,1)"
                      placeholder="请填写具体街道门牌号 大厦 房间号码"
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
                  <el-form-item label="目的地" prop="toID">
                    <el-cascader
                      class="address"
                      placeholder="请选择目的地"
                      :show-all-levels="true"
                      v-model="sourceData.toID"
                      :options="address"
                      @change="handChange1"
                      change-on-select
                    ></el-cascader>
                  </el-form-item>
                  <el-form-item prop="ToAddress" ref="ToAddress">
                    <el-input
                      class="adress-details"
                      v-model="sourceData.ToAddress"
                      @blur="getArea(sourceData.toID,sourceData.ToAddress,0)"
                      placeholder="请填写具体街道门牌号 大厦 房间号码"
                    >
                    <template slot="suffix">
                      <el-tooltip class="item cuspoint" effect="dark" content="点击地图选址" placement="top">
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
                  <el-form-item label="车长/车型" prop="LengthCopy">
                    <el-autocomplete
                      class="normal"
                      v-model="sourceData.LengthCopy"
                      :fetch-suggestions='getLongList'
                      placeholder="车长"
                    ></el-autocomplete>
                  </el-form-item>
                  <el-form-item prop="ModelID">
                    <el-select placeholder="车型" v-model="sourceData.ModelID">
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

                <!-- <el-form-item label="提货方式" prop="DeliveryMode">
                  <el-radio v-model="sourceData.DeliveryMode" label="0">不限</el-radio>
                  <el-radio v-model="sourceData.DeliveryMode" label="1">送货上门</el-radio>
                  <el-radio v-model="sourceData.DeliveryMode" label="2">上门提货</el-radio>
                  <span class="gray-txt">（建议-出发地填写到详细地址）</span>
                </el-form-item> -->

                <el-form-item label="接单模式" prop="Parttern">
                  <el-radio v-model="sourceData.Parttern" label="1">抢单</el-radio>
                  <el-radio v-model="sourceData.Parttern" label="2">最低价</el-radio>
                </el-form-item>
                <el-form-item label="运费金额（元）" prop="Freight" v-if="sourceData.Parttern == 1 ">
                  <div class="normal">
                    <el-input placeholder="运费价格" v-model="sourceData.Freight"></el-input>
                  </div>
                </el-form-item>
                <el-form-item label="备注" prop="Remark">
                  <el-input v-model="sourceData.Remark" type="textarea" placeholder="备注信息例如，三不超 ，马上装货，需要雨布"></el-input>
                </el-form-item>
                <el-form-item class="mt-60" v-if="!getUserRole(userCharacter,'财务') && this.$cookie.get('MemberMerchantID')">
                  <el-button type="primary" class="add-now" @click="addSource('sourceData')"
                             round>立即发布
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
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
    <!-- 引入重复发布弹窗 -->
    <hint-dialog :dialogObject="hintDialogObject" @sureDialog="publishActSure()"></hint-dialog>
    <!-- 结束 -->
  </div>
</template>


<script type="es6">
  import headTop from 'components/header/head'
  import dropDown from 'components/header/children/dropdown'
  import foot from 'components/footer/foot'
  import vueMap from 'components/AMap/AMap'
  import address from 'config/address'
  import regs from 'config/regExp'
  import { getTimes } from 'config/getTimes'

  /** 小星引入未审核弹窗与发布成功后弹窗 **/
  import { CarLongList } from "config/publicParam"; // 提取了下CarLongList
  import hintDialog from 'components/hintDialog/hintDialog';
  /** 结束 **/
  import { mapGetters, mapMutations } from 'vuex';
  import leftMenuRouterHome from 'components/leftMenuRouter/leftMenuRouterHome'; // 左侧
  import headMenuRouter from 'components/headMenuRouter/headMenuRouter'; // 头部

  import {
    getCarModelList,
    addSource,
    getProTypeList,
    sourceAdd,
    getSourceData,
    getEnterAddress,
    GetHeavyCargoStandard, // 重货阈值获取
    JudgeOrderRepeat
  } from "api/getData"
  import { getUserRole } from 'config/myUtils';
  export default {
    data() {
      return {
        isSurepublish: {}, // 记录检查接口返回显示弹窗，结合
        hintDialogObject: {}, // 重复发货提醒
        merchantStatus: this.$cookie.get("MerchantStatus"), // 新参数 用户审核状态
        loading: false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < new Date().setDate(new Date().getDate() - 1);
          }
        },// 限制时间输入
        userCharacter: this.$cookie.get("MemberDutiesID"),
        userType: this.$cookie.get("MemberCrowd"),
        ModelList: [],//车型数据
        CarLongList: CarLongList,//车长数据
        IsShowMap: false, //是否显示地图
        mapData: {
        //地图数据
          address: "",
          lnglat: [116.397428, 39.90923]
        },
        index: '1',//确定点击的输入框
        toAddress: [],//收货地地址
        productList: [],//货物类型
        address: address.area,
        sourceData: {//货源数据
          MerchantID: "",
          MemberID: "",
          FromProvinceID: '',
          FromCountyID: '',
          ToProvinceID: '',
          ToCityID: '',
          ToCountyID: '',
          CargoName: '',
          Classify: '',
          Length: '99',
          LengthCopy: '不限', // 添加lengthCopy 减少重复代码
          ModelID: '',
          Weight: '',
          Volume: '',
          Freight: '',
          LoadTime: getTimes(new Date(new Date().getTime() + 3600000),  "yyyy-MM-dd hh:mm"),
          Remark: '',
          Parttern: '',
          // DeliveryMode: '0',
          FromAddress: "",
          ToAddress: "",
          FromLongitude: '',
          FromLatitude: '',
          ToLongitude: '',
          ToLatitude: '',
          fromID: [],
          toID: [],
          Receiver: '', // 收货人信息
          ReceivePhone: '' // 收货人手机号
        },
        sourceDataRules: {//验证规则
          CargoName: [
            { required: true, message: "请输入货物名称", trigger: "blur" },
            {
              validator: (rule, value, callback) => {
                if (value === "") {
                  callback(new Error("请输入货物名称"));
                } else if (value.length >= 2 && value.length <= 12) {
                  callback();
                } else {
                  callback(new Error("名称长度为2-12个字符"));
                }
              },
              trigger: "blur"
            }
          ],
          Volume: [
            { required: true, message: "请输入货物体积", trigger: "blur" },
            { pattern: regs.NF2, message: "请输入数字，最多两位小数", trigger: "blur" }
          ],
          Weight: [
            { required: true, message: "请输入货物重量", trigger: "blur" },
            { pattern: regs.NF2, message: "请输入数字，最多两位小数", trigger: "blur" }
          ],
          Classify: [
            { required: true, message: "请选择货物类型", trigger: "change" }
          ],
          LoadTime: [
            { required: true, message: "请选择装货时间", trigger: "blur" }
          ],
          LengthCopy: [
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
          fromID: [
            { required: true, message: "请选择出发地", trigger: "change" },
            {
              validator: (rule, value, callback) => {
                if(value.length == 2 && (value[1] == '620200' || value[1] == '460400' || value[1] == '442000' || value[1] == '441900')){
                  callback()
                } else if(value.length == 3){
                  callback();
                } else {
                  callback(new Error("出发地址请选择到区县"));
                }
              },
              trigger: "blur"
            }
          ],
          toID: [
            { required: true, message: "请选择目的地", trigger: "blur" },
            {
              validator: (rule, value, callback) => {
                let _ = this.sourceData.fromID;
                if (_[0] == value[0] && _[1] == value[1] && _[2] == value[2]) {
                  callback(new Error("发货地目的地省市区不能完全相同"));
                }
                if(value.length < 2){
                  callback(new Error("目的地请选择到省市"));
                } else {
                  callback();
                }
              },
              trigger: "change"
            }
          ],
          Parttern: [
            { required: true, message: "请选择接单模式", trigger: "blur" }
          ],
          Freight: [
            { required: true, message: "请输入运费金额", trigger: "blur" },
            { pattern: regs.NF2, message: "请输入数字，最多两位小数", trigger: "blur" },
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
          ReceivePhone: [
            {
              validator: (rule, value, callback) => { // 当选中送货上门货主到付 必须填收货人等
                if (value && !regs.Phone.test(value)) {
                  callback('您输入的手机号码格式不正确')
                } else {
                  callback()
                }
              },
              trigger: "blur"
            }
          ]
        }
      }
    },
    methods: {
      getUserRole: getUserRole,
      resetPathFields () { // 重置部分表单验证 收货人信息是否必填等
        this.$refs['sourceData'].validateField('Receiver')
        this.$refs['sourceData'].validateField('ToAddress')
        this.$refs['sourceData'].validateField('ReceivePhone')
      },
      delePathFields () { // 重置部分表单验证 收货人信息是否必填等
        this.$refs['Receiver'].clearValidate()
        this.$refs['ToAddress'].clearValidate()
        this.$refs['ReceivePhone'].clearValidate()
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
        this.loading = true;
        let res = await sourceAdd(this.sourceData);
        this.loading = false;
        if (res.data.ResultCode === '000000') {
          // 成功发布操作
         if(this.sourceData.Parttern == 2 && !res.data.ResultValue.PiPei){ // PiPei = 1 则无车辆 直接跳转至成功页 = 0 说明有车辆需要选择承运
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
        }
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
      //发货地地址改变清空后边地址
      handChange(val) {
        this.getArea(this.sourceData.fromID, this.sourceData.FromAddress, 1);
        this.sourceData.FromAddress = '';
        this.mapData.address = "";
      },
      handChange1() {
        this.getArea(this.sourceData.toID, this.sourceData.ToAddress, 0);
        this.sourceData.ToAddress = '';
        this.mapData.address = "";
      },
      //获取经纬度
      getLogLat(type) {
        let that = this;
        let geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: "all"
        });
        geocoder.getLocation(this.mapData.address, function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            if (type == 1) {
              that.sourceData.FromLongitude = result.geocodes[0].location.lng;
              that.sourceData.FromLatitude = result.geocodes[0].location.lat;
            } else if (type == 0) {
              that.sourceData.ToLongitude = result.geocodes[0].location.lng;
              that.sourceData.ToLatitude = result.geocodes[0].location.lat;
            }
            that.mapData.lnglat = [result.geocodes[0].location.lng, result.geocodes[0].location.lat];
          }
        });
      },
      // 设置地图传回的参数到输入框
      setValue(index){
        this.IsShowMap = true;
        this.index = index;
        if(index == "1"){
          this.mapData.address = this.sourceData.FromAddress;
          if(this.sourceData.FromLongitude){
            this.mapData.lnglat =  [this.sourceData.FromLongitude,this.sourceData.FromLatitude];
          }
        } else if(index == "2"){
          this.mapData.address = this.sourceData.ToAddress;
          if(this.sourceData.ToLongitude){
            this.mapData.lnglat =  [this.sourceData.ToLongitude,this.sourceData.ToLatitude];
          }
        }
      },
      // 设置地图传回的参数到输入框
      locationFilter (address, ID, lnglat, index) {
        this.IsShowMap = false;
        if(index == "1"){
          this.sourceData.fromID = ID;
          this.sourceData.FromAddress = address;
          this.sourceData.FromLongitude = lnglat[0];
          this.sourceData.FromLatitude = lnglat[1];
        } else if(index == "2"){
          this.sourceData.toID = ID;
          this.sourceData.ToAddress = address;
          this.sourceData.ToLongitude = lnglat[0];
          this.sourceData.ToLatitude = lnglat[1];
        }
      },
      //获取车长列表
      getLongList(queryString, callback) {
        callback(this.CarLongList);
      },
      //发布提交
      async addSource(sourceData) {
        // 结束
        this.$refs[sourceData].validate(async (valid) => {
          if (valid) {
            this.loading = true;
            this.sourceData.MerchantID = this.$cookie.get("MemberMerchantID");
            this.sourceData.MemberID = this.$cookie.get("MemberID");

            this.sourceData.Length = this.sourceData.LengthCopy === '不限' ? '99' : this.sourceData.LengthCopy; // 赋值length

            if(this.sourceData.fromID[0]){
              this.sourceData.FromProvinceID = this.sourceData.fromID[0];
            }
            if(this.sourceData.fromID[1]){
              this.sourceData.FromCityID = this.sourceData.fromID[1];
            }
            if(this.sourceData.fromID[2]){
              this.sourceData.FromCountyID = this.sourceData.fromID[2];
            }
            if(this.sourceData.toID[0]){
              this.sourceData.ToProvinceID = this.sourceData.toID[0];
            }
            if(this.sourceData.toID[1]){
              this.sourceData.ToCityID = this.sourceData.toID[1];
            }
            if(this.sourceData.toID[2]){
              this.sourceData.ToCountyID = this.sourceData.toID[2];
            }
            //在发布前检测 检测是否已经发布
            const {data: {ResultCode, ResultMessage, ResultValue}} = await JudgeOrderRepeat(Object.assign({Owner: 2}, this.sourceData));
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
          }
        });
      },
      // 获取订单数据
      async getSource (id) {
        return new Promise((resolve, reject) => {
          getSourceData({MemberID: this.$cookie.get('MemberID'),OrderID: id}).then(res => {
            if (res.data.ResultCode === '000000' && res.data.ResultValue) {
              let Data = res.data.ResultValue;
              this.sourceData.LoadTime = Data.LoadDate;
              this.sourceData.CargoName = Data.CargoName;
              this.sourceData.Volume = Data.Volume;
              this.sourceData.Weight = Data.Weight;
              this.sourceData.ModelID  = Data.ModelID;
              this.sourceData.ToAddress = Data.ToAddress;
              this.sourceData.FromProvinceID = Data.FromProvinceID;
              this.sourceData.FromCountyID = Data.FromCountyID;
              this.sourceData.ToProvinceID = Data.ToProvinceID;
              this.sourceData.ToCityID = Data.ToCityID;
              this.sourceData.ToCountyID = Data.ToCountyID;
              this.sourceData.Remark = Data.Remark;
              this.sourceData.Parttern = Data.Parttern;
              this.sourceData.FromAddress = Data.FromAddress;
              this.sourceData.ToAddress = Data.ToAddress;
              this.sourceData.FromLongitude = Data.FromLongitude;
              this.sourceData.FromLatitude = Data.FromLatitude;
              this.sourceData.ToLongitude = Data.ToLongitude;
              this.sourceData.ToLatitude = Data.ToLatitude;
              this.sourceData.Freight = Data.Freight;
              this.sourceData.Classify = Data.ClassifyID;
              this.sourceData.Receiver = Data.Receiver; // 收货人信息 1.0.7
              this.sourceData.ReceivePhone = Data.ReceivePhone;
              if (Data.Long == 99) {
                this.sourceData.LengthCopy = "不限";
              } else {
                this.sourceData.LengthCopy = Data.Long;
              }
              this.sourceData.fromID = [Number(Data.FromProvince),Number(Data.FromCity),Number(Data.FromCounty)];
              this.sourceData.toID = [Number(Data.ToProvince),Number(Data.ToCity),Number(Data.ToCounty)];
              this.sourceData.Parttern = String(Data.Parttern);
              // this.sourceData.DeliveryMode = String(Data.DeliveryMode);
            }
            resolve('success'); // 定义个promise
          }).catch(() => {
            resolve('error');
          })
        })
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
                  if (arr[2] && this.address[item].children[index].children[i].value == arr[2]) {
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
      if (this.userType != 2) {
        this.$router.push("/source");
        return;
      }

      this.loading = true; // 加载 开启loading

      let promise1 = new Promise((resolve, reject) => {  //获取车型列表 用promise实现下同步
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

      let promise2 = new Promise((resolve, reject) => { // 获取货物类型 用promise实现下同步
        getProTypeList().then(res => {
          if (res.data.ResultCode === '000000' && res.data.ResultValue) {
            this.productList = res.data.ResultValue;
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
                this.sourceData.fromID.push(Number(arr[i]));
              }
              this.sourceData.FromAddress = res.data.ResultValue.FromAddress;
              this.mapData.address = res.data.ResultValue.FromAddress;
              this.getArea(this.sourceData.fromID, this.sourceData.FromAddress, 1);
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
          this.getSource(this.$route.params.id).then((res) => {
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

      // 判断阈值是否存在 异步
      if (this.bulkyCargo < 0) {
        this.GetHeavyCargoStandard();
      }
    },
    mounted () {
    },
    computed: {
      changeBubble() {
        if (this.sourceData.Classify == 'e55286f25d74412cbb3923e7818b8eaa') {
          let weights = this.sourceData.Weight/this.sourceData.Volume;
          if (weights >= this.bulkyCargo / 1000) {
            return "重货";
          } else {
            return "泡货";
          }
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
      vueMap,
      hintDialog,
      leftMenuRouterHome, // 左侧导航
      headMenuRouter // 左侧
    },
    watch: {
      'sourceData.Parttern' (n) { // 接单模式修改清除不掉提示问题 优化
        if (n) {
          this.$refs['sourceData'].validateField('Parttern')
        }
      },
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../assets/styles/variable.styl"

  .content
    position: relative
    width: 1200px
    margin: 10px auto 60px

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
      width: 910px
      padding: 40px
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
  .goodsInfo
      ul
        li
          float: left
          width: 150px
          text-align: center
          p
            height: 40px
            line-height: 40px
          .header
            position: relative
            border: 1px solid $borderColor
            border-bottom: 0
          .proType
            position: absolute
            top: 40px
            right: 100px
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
</style>
<style lang="stylus">
.add // 添加外层样式防止 样式外泄
  .item-box // 重置一行多个el-input
    margin-bottom: 22px
    font-size: 0
    .el-form-item
      margin-bottom: 0
      display: inline-block
      &:not(:first-child)
        .el-form-item__content
          margin-left: 10px !important
  .goodsInfo
    p
      .el-form-item
        input
          border-radius: 0
</style>
