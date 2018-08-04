<template>
  <div class="settled-container">
    <head-top>
      <span class="title" slot="settled">物流公司入驻</span>
      <!-- <div class="header-center" slot="menu" v-if="userType == 2">
        <ul>
          <router-link tag="li" to="/finaindex" class="active">返回首页</router-link>
        </ul>
      </div> -->
      <drop-down slot="info"></drop-down>
    </head-top>
    <div class="settled">
      <p class="title"><span class="name">入驻信息</span> <i
        class="red-text ml-20">信息仅限审核使用</i></p>
      <div class="step-content">
        <el-steps :space="500" :active="checkedStatus ==2?2:1" finish-status="success" align-center>
          <el-step title="公司信息"></el-step>
          <el-step title="车辆信息"></el-step>
        </el-steps>
      </div>
      <div class="content">
        <el-form label-position="left" :model="carData" :rules="CarrRules" ref="carData" label-width="150px"
                 status-icon @validate="validate">
          <el-form-item label="行驶证照" prop="RunPicture">
            <el-upload
              class="avatar-uploader"
              ref="upload"
              :action="url"
              :before-upload="RunPicUpload"
              :auto-upload="true"
              :disabled="(checkedStatus !== -1 && checkedStatus !== 0)"
              list-type="picture-card"
              :multiple="false">
              <img v-if="RunPic" :src="RunPic" alt="" class="avatar">
              <i v-else class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="驾驶证照" prop="DrivePicture">
            <el-upload
              class="avatar-uploader"
              ref="upload"
              :action="url"
              :before-upload="DriverPicUpload"
              :auto-upload="true"
              list-type="picture-card"
              :disabled="(checkedStatus !== -1 && checkedStatus !== 0)"
              :multiple="false">
              <img v-if="DriverPic" :src="DriverPic" alt="" class="avatar">
              <i v-else class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="车牌号码" prop="TruckCode">
            <el-input class="normal"
                      placeholder="请输入车牌号码"
                      v-model.trim="carData.TruckCode"
                      :disabled="(checkedStatus !== -1 && checkedStatus !== 0)"
                      clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="车头照" prop="TruckPicture">
            <el-upload
              class="avatar-uploader"
              ref="upload"
              :action="url"
              :before-upload="HeaderPicUpload"
              :auto-upload="true"
              list-type="picture-card"
              :disabled="(checkedStatus !== -1 && checkedStatus !== 0)"
              :multiple="false">
              <img v-if="HeaderPic" :src="HeaderPic" alt="" class="avatar">
              <i v-else class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="车辆承运险照" prop="Insurance">
            <el-upload
              class="avatar-uploader"
              ref="upload"
              :action="url"
              :before-upload="InsurancePicUpload"
              :auto-upload="true"
              list-type="picture-card"
              :disabled="(checkedStatus !== -1 && checkedStatus !== 0)"
              :multiple="false">
              <img v-if="InsurancePic" :src="InsurancePic" alt="" class="avatar">
              <i v-else class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="保险到期日期" prop="Expire">
            <el-date-picker
              type="date"
              clearable
              :editable="false"
              value-format="yyyy-MM-dd"
              v-model="carData.Expire"
              :disabled="(checkedStatus !== -1 && checkedStatus !== 0)"
              :picker-options="pickerOptions"
              placeholder="保险到期日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="车长（米）/车型" prop="TruckLong">
            <div class="fl">
              <el-form-item prop="TruckLong">
                <el-autocomplete
                  class="inline-input"
                  v-model="carData.TruckLong"
                  :fetch-suggestions='getLongList'
                  placeholder="车长"
                  :disabled="(checkedStatus !== -1 && checkedStatus !== 0)"
                ></el-autocomplete>
              </el-form-item>
            </div>
            <div class="fl">
              <el-form-item prop="TruckModel">
                <el-select v-model="carData.TruckModel" placeholder="请选择车型"
                           :disabled="(checkedStatus !== -1 && checkedStatus !== 0)" class="ml-10">
                  <el-option
                    v-for="item in ModelList"
                    :key="item.value"
                    :label="item.DictName"
                    :value="item.DictID"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item label="载重（吨）" prop="TruckLoad">
            <el-input class="small"
                      :editable="false"
                      placeholder="车辆载重"
                      v-model.trim="carData.TruckLoad"
                      clearable
                      :disabled="(checkedStatus !== -1 && checkedStatus !== 0)"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <div>
              <el-checkbox v-model="checked" :disabled="(checkedStatus !== -1 && checkedStatus !== 0)"></el-checkbox>
              <span class="size12 ml-10 gray-txt">已阅读并同意</span>
              <a href="http://app.sdhwlw.com/Agreement/service.html" class="size12 blue-txt">《速达汇用户入驻协议》</a>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button class="btn" size="medium" :disabled="canSubmit || (checkedStatus !== -1 && checkedStatus !== 0)"
                       type="primary" round
                       plain @click="Submit('carData')">
              保存并提交审核
            </el-button>
            <router-link to="/settled" class="ml-20">上一步</router-link>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <foot></foot>
  </div>
</template>


<script type="es6">
import headTop from "components/header/head";
import foot from "components/footer/foot";
import dropDown from "components/header/children/dropdown";
import regs from "config/regExp";
import cookie from "cookiejs";
import { carManage } from "config/publicParam";
import { setStore, getStore, removeStore } from "config/myUtils";
import {
  logisticsEnter,
  LogisticsAgain,
  PicUpload,
  getCarInfo,
  editCarInfo,
  getCarModelList,
  getCarLongList
} from "api/getData";
import { imgPostUrl, imgUrl } from "api/env";
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
       // 限制时间输入
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < (new Date().setDate(new Date().getDate()-1));
          }
        },
      userType: this.$cookie.get("MemberCrowd"),
      MemberID: this.$cookie.get("MemberID"),
      CarLongList: carManage,
      ModelList: [], //车型数据
      restaurants: [], //列表数据
      timeout: null, //定时器
      isFirst: true, //是否是第一次提交
      RunPic: "", //行驶证照片
      checkedStatus: 0,
      DriverPic: "", //驾驶证照片
      HeaderPic: "", //车头照片
      InsurancePic: "", //承运险照片
      url: imgPostUrl, //图片上传地址
      checked: true, //协议
      hasCommit: false, //是否已提交
      carData: {
        //车辆数据
        MemberID: "",
        Merchant: "",
        RunPicture: "",
        DrivePicture: "",
        TruckCode: "",
        TruckPicture: "",
        Insurance: "",
        Expire: "",
        TruckLong: "",
        TruckModel: "",
        TruckLoad: ""
      },
      CarrRules: {
        //Form验证规则
        RunPicture: [
          { required: true, message: "请上传行驶证照片", trigger: "blur" }
        ],
        DrivePicture: [
          { required: true, message: "请上传驾驶证照片", trigger: "blur" }
        ],
        Insurance: [
          { required: true, message: "请上传车辆承运险照片", trigger: "blur" }
        ],
        TruckPicture: [
          { required: true, message: "请上传车头照片", trigger: "blur" }
        ],
        TruckCode: [{ required: true, message: "请输入车牌号码", trigger: "blur" }],
        Expire: [
          { required: true, message: "请选择保险到期日期", trigger: "blur" }
        ],
        TruckLong: [
          { required: true, message: "请输入或者选择车长", trigger: "blur" },
          {
            pattern: regs.CarLong,
            message: "请输入正确的车长",
            trigger: "change"
          }
        ],
        TruckModel: [{ required: true, message: "请选择车型", trigger: "blur" }],
        TruckLoad: [{ required: true, message: "请输入车辆载重", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 本地保存填写数据
    validate(prop) {
      if (this.$cookie.get("MerchantStatus") != 0) {
        return;
      } else {
        this.SET_settledCardData(JSON.stringify(this.carData));
      }
    },
    //行驶证上传
    RunPicUpload(file) {
      PicUpload(file)
        .then(res => {
          if (res.data.ResultCode === "000000" && res.data.ResultValue) {
            this.RunPic = imgUrl + res.data.ResultValue;
            this.carData.RunPicture = res.data.ResultValue;
            this.SET_settledCardData(JSON.stringify(this.carData));
          }
        })
        .catch(err => {
          console.log(err);
        });
      return false;
    },
    //驾驶证上传
    DriverPicUpload(file) {
      PicUpload(file)
        .then(res => {
          if (res.data.ResultCode === "000000" && res.data.ResultValue) {
            this.DriverPic = imgUrl + res.data.ResultValue;
            this.carData.DrivePicture = res.data.ResultValue;
            this.SET_settledCardData(JSON.stringify(this.carData));
          }
        })
        .catch(err => {
          console.log(err);
        });
      return false;
    },
    //车头照上传
    HeaderPicUpload(file) {
      PicUpload(file)
        .then(res => {
          if (res.data.ResultCode === "000000" && res.data.ResultValue) {
            this.HeaderPic = imgUrl + res.data.ResultValue;
            this.carData.TruckPicture = res.data.ResultValue;
            this.SET_settledCardData(JSON.stringify(this.carData));
          }
        })
        .catch(err => {
          console.log(err);
        });
      return false;
    },
    //车辆承运险照上传
    InsurancePicUpload(file) {
      PicUpload(file)
        .then(res => {
          if (res.data.ResultCode === "000000" && res.data.ResultValue) {
            this.InsurancePic = imgUrl + res.data.ResultValue;
            this.carData.Insurance = res.data.ResultValue;
            this.SET_settledCardData(JSON.stringify(this.carData));
          }
        })
        .catch(err => {
          console.log(err);
        });
      return false;
    },
    //获取车长列表
    getLongList(queryString, callback) {
      callback(this.CarLongList);
    },
    //车辆提交
    async Submit(carData) {
      this.$refs[carData].validate(async valid => {
        if (valid) {
          this.hasCommit = true;
          this.checkedStatus = 1;
          this.carData.MemberID = this.MemberID;
          this.carData.Merchant = this.$cookie.get("MemberMerchantID");
          let resData;
          if (this.isFirst) {
            let enterModel = JSON.parse(this.settledEnterData);
            for(let item in enterModel){
              this.carData[item] = enterModel[item];
            }
            resData = await logisticsEnter(this.carData);
          } else {
            let enterModel = JSON.parse(this.settledEnterData);
            for(let item in enterModel){
              this.carData[item] = enterModel[item];
            }
            resData = await LogisticsAgain(this.carData);
          }
          if (resData.data.ResultCode === "000000") {
            this.$message.success({ message: resData.data.ResultMessage });
            this.checkedStatus = 1;
            this.SET_settledCardData('');
            cookie("MemberMerchantID", resData.data.ResultValue, {
              expires: 30,
              path: "/",
              domain: "sdhwlw.com"
            });
            this.$router.push("/settled");
          } else {
            this.hasCommit = false;
            this.checkedStatus = 0;
          }
        } else {
          return false;
        }
        this.hasCommit = false;
      });
    },
    ...mapMutations({
      SET_settledCardData: 'SET_settledCardData',
      SET_settledEnterData: 'SET_settledEnterData'
    })
  },
  computed: {
    canSubmit() {
      if (this.checked && !this.hasCommit) {
        return false;
      } else {
        return true;
      }
    },
    ...mapGetters([
      'settledEnterData',
      'settledCardData'
    ])
  },
  created() {
    if (this.settledEnterData.indexOf(this.MemberID)  === -1) { // 判断是否时同一用户不是的话清空
      this.SET_settledCardData('');
      this.SET_settledEnterData('');
    }
    if (this.MemberID) {
      this.carData.MemberID = this.MemberID;
      if (this.$cookie.get("MerchantStatus") != 0) {
          if(this.$cookie.get("MerchantStatus") == 2){
            this.$router.push("/settled2");
          } else {
            if (this.$cookie.get("MemberCrowd") != 2) {
              this.$message.error({ message: "身份类型错误！" });
              this.$router.push("/settled");
            } else if (this.$cookie.get("MemberCrowd") == 2) {
              //获取车辆信息
              getCarInfo({ MemberID: this.$cookie.get("MemberID") })
                .then(res => {
                  if (res.data.ResultCode === "000000" && res.data.ResultValue) {
                    let Data = res.data.ResultValue;
                    this.isFirst = false;
                    this.checked = true;
                    this.checkedStatus = Data.TrucStatus;
                    if(Data.TrucRunPicture){
                      this.RunPic = imgUrl + Data.TrucRunPicture;
                      this.carData.RunPicture = Data.TrucRunPicture;
                    }
                    if(Data.TrucDrivePicture){
                      this.DriverPic = imgUrl + Data.TrucDrivePicture;
                      this.carData.DrivePicture = Data.TrucDrivePicture;
                    }
                    if(Data.TrucPicture){
                      this.HeaderPic = imgUrl + Data.TrucPicture;
                      this.carData.TruckPicture = Data.TrucPicture;
                    }
                    if(Data.TrucInsurance){
                      this.InsurancePic = imgUrl + Data.TrucInsurance;
                      this.carData.Insurance = Data.TrucInsurance;
                    }
                    this.carData.Merchant = Data.TrucMerchant;
                    this.carData.TruckCode = Data.TrucCode;
                    this.carData.Expire = Data.TrucExpire;
                    this.carData.TruckLong = String(Data.TrucLong);
                    this.carData.TruckModel = Data.TrucModel;
                    this.carData.TruckLoad = Data.TrucLoad;
                    if( Data.TrucStatus == 2){
                      this.$router.push("/settled2");
                    }
                  }
                })
                .catch(err => {
                  console.log(err);
                });
              }
        }
      } else {
        if (this.settledEnterData) {
          if (this.settledCardData) {
            let carModel = JSON.parse(this.settledCardData);
            this.carData = carModel;
            if(carModel.RunPicture){
              this.RunPic = imgUrl + carModel.RunPicture;
            }
            if(carModel.DrivePicture){
              this.DriverPic = imgUrl + carModel.DrivePicture;
            }
            if(carModel.TruckPicture){
              this.HeaderPic = imgUrl + carModel.TruckPicture;
            }
            if(carModel.Insurance){
              this.InsurancePic = imgUrl + carModel.Insurance;
            }
          }
        } else {
          this.$router.push("/settled");
        }
      }
    } else {
      this.$message.info({ message: "你尚未登录，请登录！" });
      this.$router.push("/");
    }
    //获取车型列表
    getCarModelList()
      .then(res => {
        if (res.data.ResultCode === "000000" && res.data.ResultValue) {
          this.ModelList = res.data.ResultValue;
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  mounted() {
    //设置按钮禁用状态
    if (this.checkedStatus === -1 || this.checkedStatus === 0) {
      this.hasCommit = false;
    } else {
      this.hasCommit = true;
    }
  },
  components: {
    headTop,
    foot,
    dropDown
  }
};
</script>

<style lang="stylus" scoped>
@import '../../assets/styles/variable.styl';

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.el-upload--picture-card {
  width: 0;
  height: 0;
}

.avatar {
  width: 146px;
  height: 146px;
  display: block;
}

.blue-btn-p {
  display: inline-block;
  height: 38px;
  line-height: 38px;
  padding: 0 15px;
  border: 1px solid $blue;
  border-radius: 4px;
  text-align: center;

  &:hover {
    background-color: $blue;
    color: #ffffff;
  }
}

.tip {
  width: 1200px;
  height: 80px;
  line-height: 80px;
  margin: 0 auto;
  background: #FEF2F0;
  border: 1px solid #FFBEA6;
  border-radius: 1px;

  .msg {
    padding-left: 150px;
    position: relative;
  }

  .tip-icon {
    position: absolute;
    left: 80px;
    top: 12px;
    font-size: 50px;
    margin-bottom: -50px;
  }

  .on {
    color: $gray;
  }

  .pass {
    color: $green;
  }

  .failed {
    color: $red;
  }

  .info {
    color: #666;
    font-size: 16px;
  }
}

.settled {
  width: 1200px;
  margin: 10px auto 40px;
  background-color: #fff;

  .step-content {
    width: 1000px;
    margin: 50px auto 20px;
  }

  .title {
    width: 100%;
    height: 49px;
    line-height: 49px;
    border-bottom: 1px solid $borderColor;

    .name {
      display: inline-block;
      height: 30px;
      line-height: 30px;
      padding-left: 26px;
      border-left: 4px solid $blue;
    }
  }

  .content {
    margin: 0 80px;
    padding: 50px 0;

    .normal {
      width: 300px;
    }

    .small {
      width: 200px;
    }

    .large {
      width: 500px;
    }

    .msg {
      text-align: center;
      font-size: 14px;
      color: $blue;
    }

    .btn {
      width: 200px;
      height: 40px;
      margin-top: 40px;
    }
  }
}
</style>
