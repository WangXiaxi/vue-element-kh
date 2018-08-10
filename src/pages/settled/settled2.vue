<template>
  <div class="settled-container">
    <head-top>
      <span class="title" slot="settled">{{userType === '1'?'货主':'物流公司'}}-工作台</span>
      <div class="header-center" slot="menu">
        <head-menu-router activeLink="account"></head-menu-router>
      </div>
      <drop-down slot="info"></drop-down>
    </head-top>
    <div class="settled">
      <div class="content-left">
        <left-menu-router-account activeLink="settle"></left-menu-router-account>
      </div>
      <div class="settled-right">
        <p class="title"><span class="name">入驻信息</span> <i
        class="red-text ml-20">信息仅限审核使用</i></p>
        <div class="tip" v-if="checkedStatus">
          <p class="msg">
            <!-- <i :class="checkedClass" class="tip-icon"></i> -->
            <img v-if="checkedStatus === 1" src="../../assets/images/watting.png" alt="" class="mr-20">
            <img v-else-if="checkedStatus === 2" src="../../assets/images/success.png" alt="" class="mr-20">
            <img v-else-if="checkedStatus === -1" src="../../assets/images/error.png" alt="" class="mr-20">
            <span v-if="checkedStatus === 1" class="info">申请已提交，等待平台处理，2个工作日内给予回复；如有疑问，请致电<i class="blue-txt">0571-57137790</i>。</span>
            <span v-else-if="checkedStatus === 2" class="info">您提交的审核信息已通过审核！</span>
            <span v-else-if="checkedStatus === -1" class="info">您提交的信息审核失败！ <span
              class="red-text">{{Reason}}</span></span>
          </p>
        </div>
        <div class="step-content" v-if="userType === '2'">
          <el-steps :space="500" :active="checkedStatus ==2?2:0" finish-status="success" align-center>
            <el-step title="公司信息"></el-step>
            <el-step title="车辆信息"></el-step>
          </el-steps>
        </div>
        <div class="content">
          <el-form label-position="left" :model="enterData" :rules="enterRules" ref="enterData" label-width="150px"
                  status-icon @validate="validate">
            <el-form-item label="公司名称" prop="Name">
              <el-input class="large"
                        placeholder="请输入公司名称"
                        v-model.trim="enterData.Name"
                        clearable
                        :disabled="(checkedStatus !== -1 && checkedStatus !== 0)"
              ></el-input>
            </el-form-item>
            <el-form-item label="营业执照" prop="LicensePicture">
              <el-upload
                class="avatar-uploader"
                ref="upload"
                :action="url"
                :before-upload="LicenseBeforeUpload"
                :auto-upload="true"
                list-type="picture-card"
                :disabled="(checkedStatus !== -1 && checkedStatus !== 0)"
                :multiple="false">
                <img v-if="picUrl" :src="picUrl" class="avatar">
                <i v-else class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="信用代码/注册号" prop="LicenseCode">
              <el-input class="large"
                        placeholder=" 请输入信用代码 / 工商注册号"
                        v-model.trim="enterData.LicenseCode"
                        :disabled="(checkedStatus !== -1 && checkedStatus !== 0)"
                        clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="公司地址" prop="Address">
              <el-cascader
                class="normal"
                :show-all-levels="true"
                :options="address"
                :disabled="checkedStatus !== -1 && checkedStatus !== 0"
                v-model="selectedCategory"
                @change="handleChange"
              ></el-cascader>
              <el-input class="normal"
                        v-model="enterData.Address"
                        :disabled="checkedStatus !== -1 && checkedStatus !== 0"
                        placeholder="填写具体街道门牌号 大厦 房间号码"
              ></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="Director">
              <el-input class="normal"
                        placeholder="企业发货物流联系人"
                        :disabled="checkedStatus !== -1 && checkedStatus !== 0"
                        v-model.trim="enterData.Director"
                        clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="Phone">
              <el-input class="normal"
                        :disabled="(checkedStatus !== -1 && checkedStatus !== 0)"
                        placeholder="请填写联系电话"
                        v-model.trim="enterData.Phone"
                        clearable
              ></el-input>
            </el-form-item>
            <el-form-item>
              <div v-if="userType == 1">
                <el-checkbox v-model="checked" :disabled="(checkedStatus !== -1 && checkedStatus !== 0)"></el-checkbox>
                <span class="size12 ml-10 gray-txt">已阅读并同意</span>
                <a href="http://app.sdhwlw.com/Agreement/service.html" class="size12 blue-txt" target="_blank">《速达汇用户入驻协议》</a>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button
                class="btn"
                size="medium"
                :disabled="canSubmit"
                type="primary"
                round
                v-if="userType == 2 ||
                (userType == 1 && getUserRole(userCharacter,'管理')) ||
                !this.$cookie.get('MemberMerchantID')"
                        plain @click="enterSubmit('enterData')">
                {{userType === '1'? '保存并提交审核':'下一步'}}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <foot></foot>
  </div>
</template>


<script type="es6">
import headTop from "components/header/head";
import foot from "components/footer/foot";
import dropDown from "components/header/children/dropdown";
import address from "config/address";
import regs from "config/regExp";
import cookie from "cookiejs";
import { setStore, getStore, removeStore } from "config/myUtils";
import {
  enter,
  PicUpload,
  getSelltedInfo,
  logisticsEnterOne,
  editSelltedInfo,
  editlogistics
} from "api/getData";
import { imgPostUrl, imgUrl } from "api/env";
import { getUserRole } from 'config/myUtils';
import headMenuRouter from 'components/headMenuRouter/headMenuRouter'; // 头部
import leftMenuRouterAccount from 'components/leftMenuRouter/leftMenuRouterAccount'; // 左侧
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      userCharacter: this.$cookie.get("MemberDutiesID"),
      picUrl: "", //显示图片
      userType: this.$cookie.get("MemberCrowd"), //身份类型 1.货主 2.物流公司
      MemberID: this.$cookie.get("MemberID"),
      checkedStatus: 0, //入驻状态
      address: address.area, //省市区数据
      url: imgPostUrl, //图片上传地址
      checked: true, //是否同意协议
      hasCommit: false, //是否已提交
      Reason: "审核失败", //失败原因
      selectedCategory: [], //省市区选中数据
      enterData: {
        //入驻数据
        Crowd: this.$cookie.get("MemberCrowd"),
        MerchantID: this.$cookie.get("MemberMerchantID"),
        MemberID: this.$cookie.get("MemberID"),
        Name: "",
        Director: "",
        Phone: "",
        ProvinceID: "",
        CityID: "",
        CountyID: "",
        Address: "",
        LicenseCode: "",
        LicensePicture: ""
      },
      enterRules: {
        //Form验证规则
        LicensePicture: [
          { required: true, message: "请上传营业执照照片", trigger: "blur" }
        ],
        Director: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" }
        ],
        Phone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          {
            pattern: regs.Phone,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        Name: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
        LicenseCode: [
          {
            required: true,
            message: "请输入企业信用代码 / 工商注册号",
            trigger: "blur"
          }
        ],
        Address: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    getUserRole: getUserRole,
    // 城市选择更改保存本地省市区id
    handleChange(value) {
      [
        this.enterData.ProvinceID,
        this.enterData.CityID,
        this.enterData.CountyID
      ] = value;
      this.SET_settledEnterData(JSON.stringify(this.enterData));
    },
    // 本地保存填写数据
    validate(prop) {
      if (this.$cookie.get("MemberMerchantID")) {
        return;
      } else {
        this.SET_settledEnterData(JSON.stringify(this.enterData));
      }
    },
    //营业执照上传
    LicenseBeforeUpload(file) {
      PicUpload(file)
        .then(res => {
          if (res.data.ResultCode === "000000" && res.data.ResultValue) {
            this.picUrl = imgUrl + res.data.ResultValue;
            this.enterData.LicensePicture = res.data.ResultValue;
            this.SET_settledEnterData(JSON.stringify(this.enterData));
          }
        })
        .catch(err => {
          console.log(err);
        });
      return false;
    },
    //入驻提交
    async enterSubmit(enterData) {
      if (this.checkedStatus === -1 || this.checkedStatus === 0) {
        this.$refs[enterData].validate(async valid => {
          if (valid) {
            this.hasCommit = true;
            this.enterData.ProvinceID = this.selectedCategory[0];
            this.enterData.CityID = this.selectedCategory[1];
            this.enterData.CountyID = this.selectedCategory[2];
            let resData;
            if (this.userType === "2") {
              //物流公司提交
              this.SET_settledEnterData(JSON.stringify(this.enterData));
              this.$router.push("/addCar2");
            } else if (this.userType === "1") {
              //货主提交
              if (this.enterData.MerchantID) {
                resData = await editSelltedInfo(this.enterData); //编辑提交
              } else {
                resData = await enter(this.enterData); //入驻提交
              }
            } else {
              this.$message.error({ message: "身份类型错误！" });
            }
            this.checkedStatus = 1;
            if (
              resData &&
              resData.data.ResultCode === "000000" &&
              this.userType == 1
            ) {
              this.$message.success({ message: resData.data.ResultMessage });
              this.SET_settledEnterData('');
              cookie("MemberMerchantID", resData.data.ResultValue, {
                expires: 30,
                path: "/",
                domain: "sdhwlw.com"
              });
              this.checkedStatus = 1;
            } else {
              this.hasCommit = false;
              this.checkedStatus = 0;
            }
          } else {
            this.hasCommit = false;
            return false;
          }
        });
      } else {
        if (this.userType === "2") {
          this.$router.push("/addCar2");
        }
      }
    },
    ...mapMutations({
      SET_settledEnterData: 'SET_settledEnterData',
      SET_settledCardData: 'SET_settledCardData'
    })
  },
  components: {
    headTop,
    foot,
    dropDown,
    headMenuRouter,
    leftMenuRouterAccount
  },
  created() {
    if (this.settledEnterData.indexOf(this.MemberID)  === -1) { // 判断是否时同一用户不是的话清空
      this.SET_settledCardData('');
      this.SET_settledEnterData('');
    }
    if (this.$cookie.get("MemberID")) {
      this.userType = this.$cookie.get("MemberCrowd");
      //获取入驻信息
      if (this.$cookie.get("MemberMerchantID")) {
        this.enterData.MemberID = this.$cookie.get("MemberID");
        getSelltedInfo({ MemberID: this.enterData.MemberID })
          .then(res => {
            if (res.data.ResultCode == "000000" && res.data.ResultValue) {
              let Data = res.data.ResultValue;
              this.checked = true;
              if (Data.MercCompany) {
                this.userType = "2";
              } else if (Data.MercFactory) {
                this.userType = "1";
              }
              this.enterData.MerchantID = Data.MercID;
              this.checkedStatus = Data.MercStatus;
              if(Data.MercLicensePicture){
                this.picUrl = imgUrl + Data.MercLicensePicture;
                this.enterData.LicensePicture = Data.MercLicensePicture;
              }
              this.enterData.LicenseCode = Data.MercLicenseCode;
              this.enterData.Address = Data.MercAddress;
              this.enterData.Name = Data.MercName;
              this.enterData.Director = Data.MercLinkman;
              this.enterData.Phone = Data.MercPhone;
              if (Data.MercRemark) {
                this.Reason = Data.MercRemark;
              }
              this.selectedCategory = [
                Number(Data.MercProvince),
                Number(Data.MercCity),
                Number(Data.MercCounty)
              ];
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        if (this.settledEnterData) {
          this.enterData = JSON.parse(this.settledEnterData);
          if (this.enterData.LicensePicture) {
            this.picUrl = imgUrl + this.enterData.LicensePicture;
          }
          this.selectedCategory = [
            this.enterData.ProvinceID,
            this.enterData.CityID,
            this.enterData.CountyID
          ];
        }
      }
    } else {
      this.$message.info({ message: "你尚未登录，请登录！" });
      this.$router.push("/");
    }
  },
  computed: {
    //审核图标
    checkedClass() {
      if (this.checkedStatus === 1) {
        return ["el-icon-warning", "on"];
      } else if (this.checkedStatus === 2) {
        return ["pass", "el-icon-success"];
      } else if (this.checkedStatus === -1) {
        return ["failed", "el-icon-error"];
      }
    },
    //阻止重复提交
    canSubmit() {
      if (this.checkedStatus === -1 || this.checkedStatus === 0) {
        this.hasCommit = false;
      } else {
        if(this.userType == 1){
          this.hasCommit = true;
        } else {
          this.hasCommit = false;
        }
      }
      if (this.checked && !this.hasCommit) {
        return false;
      } else {
        return true;
      }
    },
    ...mapGetters([
      'settledEnterData'
    ])
  }
};
</script>

<style lang="stylus" scoped>
@import '../../assets/styles/variable.styl'

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
  width: 146px
  height: 146px
  display: block
.blue-btn-p 
  display: inline-block
  height: 38px
  line-height: 38px
  padding: 0 15px
  border: 1px solid $blue
  border-radius: 4px
  text-align: center
  &:hover 
    background-color: $blue
    color: #ffffff
.tip 
  width: 988px
  height: 80px
  line-height: 80px
  background: #FEF2F0
  border: 1px solid #FFBEA6
  border-radius: 1px
  .msg 
    padding-left: 150px
    position: relative
  .tip-icon 
    position: absolute
    left: 80px
    top: 18px
    font-size: 50px
    margin-bottom: -50px
  .on 
    color: $gray
  .pass 
    color: $green
  .failed 
    color: $red
  .info 
    color: #666
    font-size: 16px
.settled 
  position: relative
  width: 1200px
  margin: 10px auto 40px
  overflow: hidden
  clear: both
  .content-left 
    float: left
  .settled-left 
    min-height: $minHeight
    height: 100%
    float: left
    width: 200px
    background: #ffffff
    >ul 
      width: 200px
      position: absolute
      height: 100%
      background-color: #fff
      >li 
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
  .settled-right 
    float: right
    width: 990px
    background-color: #fff
  .step-content 
    width: 1000px
    margin: 50px auto 20px
  .title 
    width: 100%
    height: 49px
    line-height: 49px
    border-bottom: 1px solid $borderColor
    .name 
      display: inline-block
      height: 30px
      line-height: 30px
      padding-left: 26px
      border-left: 3px solid $blue
  .content 
    margin: 0 80px
    padding: 50px 0
    .normal 
      width: 300px
    .small 
      width: 200px
    .large 
      width: 500px
    .msg 
      text-align: center
      font-size: 14px
      color: $blue
    .btn 
      width: 200px
      height: 40px
      margin-top: 40px
</style>
