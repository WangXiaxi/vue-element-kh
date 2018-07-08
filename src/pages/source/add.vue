<template>
  <div>
    <head-top>
      <span class="title" slot="index">{{userType == 1?'货主':'物流公司'}}-工作台</span>
      <div class="header-center" slot="menu">
        <ul>
          <router-link tag="li" to="/source" class="active" v-if="userType == 1">首页</router-link>
          <router-link tag="li" to="/add" class="active" v-else>首页</router-link>
          <router-link tag="li" to="/finaindex">财务管理</router-link>
          <router-link tag="li" to="/account">账户信息</router-link>
        </ul>
      </div>
      <drop-down slot="info"></drop-down>
    </head-top>
    <div class="content clear">
      <div class="content-left">
        <ul>
          <router-link class="active" tag="li" to="/add" v-if="userType == 2">发布货源</router-link>
          <router-link class="active" tag="li" to="/source" v-else>发布货源</router-link>
          <router-link to="/sourceList" tag="li" v-if="userType == 1">货源列表</router-link>
          <router-link to="/orderList" tag="li" v-if="userType == 2">货源列表</router-link>
        </ul>
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
                <el-form-item label="车长/车型" prop="Length">
                  <div class="fl mr-10">
                    <el-form-item prop="Long">
                      <el-autocomplete
                        class="normal"
                        v-model="sourceData.Length"
                        :fetch-suggestions='getLongList'
                        placeholder="车长"
                      ></el-autocomplete>
                    </el-form-item>
                  </div>
                  <div class="fl">
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
                </el-form-item>
                <!-- <el-form-item label="提货方式" prop="DeliveryMode">
                  <el-radio v-model="sourceData.DeliveryMode" label="0">不限</el-radio>
                  <el-radio v-model="sourceData.DeliveryMode" label="1">送货上门</el-radio>
                  <el-radio v-model="sourceData.DeliveryMode" label="2">上门提货</el-radio>
                  <span class="gray-txt">（建议-出发地填写到详细地址）</span>
                </el-form-item> -->
                <el-form-item label="出发地" class="clear" prop="fromID">
                  <div class="fl">
                    <el-cascader
                      placeholder="请选择出发地"
                      class="address"
                      :show-all-levels="true"
                      :options="address"
                      v-model="sourceData.fromID"

                      @change="handChange"
                    ></el-cascader>
                  </div>
                  <div class="address">
                    <el-form-item prop="FromAddress">
                      <el-input
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
                </el-form-item>
                <el-form-item label="目的地" prop="toID">
                  <div class="fl">
                    <el-cascader
                      class="address"
                      placeholder="请选择目的地"
                      :show-all-levels="true"
                      v-model="sourceData.toID"
                      :options="address"
                      @change="handChange1"
                      change-on-select
                    ></el-cascader>
                  </div>
                  <div class="address">
                    <el-form-item prop="ToAddress">
                      <el-input
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
                </el-form-item>
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
                  <el-button type="primary" class="add-now" :disabled="hasCommit" @click="addSource('sourceData')"
                             round>立即发布
                  </el-button>
                  <!-- <el-button plain round class="add-now" :disabled="hasCommit" @click="addSource('sourceData','2')">
                    保存货源，稍后发布
                  </el-button> -->
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="选择发货地址" :visible.sync="IsShowMap" :close-on-click-modal="false" width="1000px"
               :close-on-press-escape="false">
      <div class="tip-box">
        <vue-map v-if="IsShowMap" :inputName="index" :location="mapData.address" :lng-lat="mapData.lnglat" @setFilter="locationFilter"></vue-map>
      </div>
    </el-dialog>
    <foot></foot>
    <!-- 小星引入未审核弹窗与发布成功后弹窗 -->
    <issue-dialog
      v-if="ifShowIssueDialog"
      :ifShowIssueDialog="ifShowIssueDialog"
      @closeDialog="closeIssueDialog"
      :issueDialogInfo="issueDialogInfo"
      @goDetails="goDetails"
    ></issue-dialog>

    <login-dialog v-if="ifShowLoginDialog"
      :ifShowLoginDialog="ifShowLoginDialog"
      @closeDialog="ifShowLoginDialog=false"
      :merchantStatus="merchantStatus">
    </login-dialog>
    <!-- 结束 -->
    <!-- 引入重复发布弹窗 -->
    <repeat-dialog v-if="ifShowRepeatDialog"
      :ifShowRepeatDialog="ifShowRepeatDialog"
      @goPublish="publishAct()"
      @closeDialog="closeRepeatDialog()">
    </repeat-dialog>
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
  import issueDialog from 'components/issueDialog/issueDialog';
  import loginDialog from 'components/loginDialog/loginDialog';
  import repeatDialog from 'components/repeatDialog/repeatDialog';
  /** 结束 **/
  import { mapGetters, mapMutations } from 'vuex';

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
        merchantStatus: this.$cookie.get("MerchantStatus"), // 新参数 用户审核状态
        ifShowIssueDialog: false, // 是否显示未审核弹窗
        ifShowLoginDialog: false, // 是否显示发布成功后弹窗
        ifShowRepeatDialog: false, // 重复发货提醒
        issueDialogInfo: { // 发布成功弹窗数据
          ResultMessage: '',
          ResultOrderID: '',
          ResultPiPei: ''
        },
        loading: false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < new Date().setDate(new Date().getDate() - 1);
          }
        },// 限制时间输入
        userCharacter: this.$cookie.get("MemberDutiesID"),
        userType: this.$cookie.get("MemberCrowd"),
        hasCommit: false,//是否已经提交
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
          Length: '不限',
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
          toID: []
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
            { pattern: regs.NF2, message: "请输入数字，最多两位小数", trigger: "blur" }
          ]
        }
      }
    },
    methods: {
      getUserRole: getUserRole,
      closeRepeatDialog () { // 弹框取消操作
        this.ifShowRepeatDialog = false;
      },
      async publishAct () { // 发布操作
        this.ifShowRepeatDialog = false;
        if (this.hasCommit) {
          return;
        }
        this.hasCommit = true;
        this.loading = true;
        let res = await sourceAdd(this.sourceData);
        this.hasCommit = false;
        this.loading = false;
        if(this.sourceData.Length == '不限'){
          this.sourceData.Length = '99';
        }
        if (res.data.ResultCode === '000000') {
          // 成功发布操作
          this.issueDialogInfo.ResultMessage = res.data.ResultMessage
          this.issueDialogInfo.ResultOrderID = res.data.ResultOrderID
          this.issueDialogInfo.ResultPiPei = res.data.ResultPiPei
          this.ifShowIssueDialog = true
          if(this.sourceData.Length == "99"){
            this.sourceData.Length = "不限";
          }
          this.$refs.sourceData.resetFields();
        } else {
          if(this.sourceData.Length == "99"){
            this.sourceData.Length = "不限";
          }
        }
      },
      closeIssueDialog () {
        if(this.sourceData.Long == '99'){
          this.sourceData.Long = "不限";
        }
        this.ifShowIssueDialog = false;
        this.$router.push('/add')
      },
      goDetails () { // 查看货源详情
        this.$router.push(`/orderDetails/${this.issueDialogInfo.ResultOrderID}`);
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
        // 提前验证是否审核过
        if (this.merchantStatus == 0 || this.merchantStatus == 1 || this.merchantStatus == -1 ) {
          this.ifShowLoginDialog = true
          return
        }
        // 结束
        this.$refs[sourceData].validate(async (valid) => {
          if (valid) {
            this.hasCommit = true;
            this.loading = true;
            this.sourceData.MerchantID = this.$cookie.get("MemberMerchantID");
            this.sourceData.MemberID = this.$cookie.get("MemberID");
            if(this.sourceData.Length == "不限"){
              this.sourceData.Length = "99";
            }
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
            let resCheck = await JudgeOrderRepeat(Object.assign({Owner: 2}, this.sourceData));
            this.hasCommit = false;
            this.loading = false;
            if (this.sourceData.Length == 99) {
              this.sourceData.Length = '不限';
            }
            if (resCheck.data.ResultCode === '000000' && resCheck.data.ResultValue) {
              this.ifShowRepeatDialog = true;
            } else if (resCheck.data.ResultCode === '000000') {
              this.publishAct(); // 执行发布操作
            }
          }
        });
      },
      // 获取订单数据
      async getSource(id){
        getSourceData({MemberID: this.$cookie.get('MemberID'),OrderID: id}).then(res=>{
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
            if(Data.Long == 99){
              this.sourceData.Length = "不限";
            } else {
              this.sourceData.Length = Data.Long;
            }
            this.sourceData.fromID = [Number(Data.FromProvince),Number(Data.FromCity),Number(Data.FromCounty)];
            this.sourceData.toID = [Number(Data.ToProvince),Number(Data.ToCity),Number(Data.ToCounty)];
            this.sourceData.Parttern = String(Data.Parttern);
            // this.sourceData.DeliveryMode = String(Data.DeliveryMode);
            this.loading = false;
          }
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
      if (this.$cookie.get("MemberID")) {
        if(this.$cookie.get("MemberMerchantID")){
          if (this.userType == 2) {
            this.loading = true;
          //获取车型列表
            getCarModelList().then(res => {
              if (res.data.ResultCode === '000000' && res.data.ResultValue) {
                res.data.ResultValue.push({DictID: '', DictName: '不限'});
                this.ModelList = res.data.ResultValue;
              }
            })
            // 获取货物类型
            getProTypeList().then(res=>{
              if (res.data.ResultCode === '000000' && res.data.ResultValue) {
                this.productList = res.data.ResultValue;
              }
            })
            //获取入驻的公司地址
            if (!this.$route.params.id) {
              getEnterAddress({ MemberID: this.$cookie.get("MemberID") }).then(
                res => {
                  if (res.data.ResultCode === "000000" && res.data.ResultValue) {
                    let arr = res.data.ResultValue.FromCityID.split(",");
                    for (let i in arr) {
                      this.sourceData.fromID.push(Number(arr[i]));
                    }
                    this.sourceData.FromAddress = res.data.ResultValue.FromAddress;
                    this.mapData.address = res.data.ResultValue.FromAddress;
                    this.getArea(this.sourceData.fromID, this.sourceData.FromAddress, 1);
                  }
                  this.loading = false;
                }
              ).catch(err=>{
                this.loading = false;
              });
            }
            if(this.$route.params.id){
              this.getSource(this.$route.params.id);
            }
          } else {
            this.$message.info({message: '身份类型错误！'});
            this.$router.push('/source');
          }
        } else {
          this.$confirm("是否去入驻?", "你尚未入驻！", {
          confirmButtonText: "去入驻",
          cancelButtonText: "取消",
          type: "warning"
          }).then(() => {
            this.$router.push("/settled");
          });
        }
      } else {
        this.$message.info({message: '你尚未登录，请登录！'});
        this.$router.push('/');
      }
      // 判断阈值是否存在
      if (this.bulkyCargo < 0) {
        this.GetHeavyCargoStandard()
      }
    },
    mounted () {
      if (this.merchantStatus == 0 || this.merchantStatus == 1 || this.merchantStatus == -1) {
        let param = 'ifShowIssueDialogNum' + this.$cookie.get("MemberID");
        let ifshowdNum = sessionStorage.getItem(param)
        if (!ifshowdNum) {
          sessionStorage.setItem(param, '0')
        }
        if (ifshowdNum == 0 || !ifshowdNum) {
          sessionStorage.setItem(param, '1')
          this.ifShowLoginDialog = true
        }
      }
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
      issueDialog, // 注册组件
      loginDialog,
      repeatDialog
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
    background-color: #fff
    .product
      background: #FFFFFF;
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
      float: left
      width: 300px
      margin-right: 10px
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
            // border-bottom: 1px solid $borderColor
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
