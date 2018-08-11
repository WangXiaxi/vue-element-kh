<template>
  <div class="login-container">
    <head-top class="header">
      <span class="title" slot="login">登录注册</span>
    </head-top>
    <div class="login-content">
      <!--左侧-->
      <div class="login-left">

        <!--忘记密码 start-->
        <div class="item">
          <h1>忘记密码<span class="type">工厂企业/物流公司</span></h1>
          <div class="login-box">
            <el-form :model="forgetPwdData" ref="forgetPwdData" :rules="forgetPwdRules" status-icon>
              <el-form-item label="" prop="Mobile">
                <el-input
                  v-model.trim="forgetPwdData.Mobile"
                  placeholder="请输入手机号"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="" prop="SmsCode">
                 <span class="code-input">
                  <el-input
                    v-model.trim="forgetPwdData.SmsCode"
                    placeholder="请输入验证码"
                    clearable>
                </el-input>
                </span>
                <span class="code-btn">
                  <el-button v-if="!sendStatus" :type="!rightPhoneNumber?'info':'primary'" :disabled="!rightPhoneNumber"
                             @click="sendCode">发送验证码</el-button>
                  <el-button v-else type="info" disabled>{{endTime}}s后重发</el-button>
                </span>
              </el-form-item>
              <el-form-item label="" prop="PWD">
                <el-input
                  v-model.trim="forgetPwdData.PWD"
                  type="password"
                  placeholder="输入新密码"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="" prop="NewPWDCon">
                <el-input
                  type="password"
                  v-model="forgetPwdData.NewPWDCon"
                  placeholder="确认密码"
                  clearable
                  @keyup.enter.native="forgetPwdSubmit('forgetPwdData')"
                ></el-input>
              </el-form-item>
            </el-form>
            <p class="mr-4">
              <router-link class="size12 blue-txt" to="/fastLogin">快捷登录</router-link>
              <router-link class="go-login" to="/register">没有账号去注册</router-link>
            </p>
            <p class="btn-box">
              <el-button type="primary" round :disabled="!canSubmit" @click="forgetPwdSubmit('forgetPwdData')">登录
              </el-button>
            </p>
          </div>
        </div>
        <!--忘记密码 end-->
      </div>

      <!--右侧-->
      <div class="login-right">
        <img src="../../assets/images/app-bg.png" alt="" width="400px" height="600px">
      </div>
    </div>
    <foot class="footer"></foot>
  </div>
</template>


<script>
import headTop from "components/header/head";
import foot from "components/footer/foot";
import regs from "config/regExp";
import md5 from "js-md5";
import cookie from "cookiejs";
import { forgetPwd, getCode } from "../../api/getData";
import auto_login from "@/mixins/auto_login";

export default {
  mixins: [auto_login],
  data() {
    return {
      canSubmit: true,
      sendStatus: false, //验证码发送状态
      endTime: 60, //倒计时时间
      timer: null, //定时器
      forgetPwdData: {
        //忘记密码数据
        Mobile: "",
        SmsCode: "",
        NewPWD: "",
        PWD: "",
        NewPWDCon: "",
        NewPWDConfirm: "",
        IP: "192.168.1.1"
      },
      forgetPwdRules: {
        //Form验证规则
        Mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: regs.Phone,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        SmsCode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { pattern: regs.Code, message: "请输入正确的验证码", trigger: "blur" }
        ],
        PWD: [{ required: true, message: "请输入新密码", trigger: "blur" }],
        NewPWDCon: [
          { required: true, message: "确认新密码", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请再次输入新密码"));
              } else if (value !== this.forgetPwdData.PWD) {
                callback(new Error("两次输入密码不一致!"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 发送验证码
    sendCode() {
      let that = this;
      if (this.forgetPwdData.Mobile) {
        if (this.rightPhoneNumber) {
          getCode({ Mobile: this.forgetPwdData.Mobile , Use: '102'}).then(res => {
            if (res.data.ResultCode === "000000") {
              this.$message.success({ message: res.data.ResultMessage });
              that.sendStatus = true;
              that.endTime = 60;
              that.timer = setInterval(() => {
                that.endTime--;
                if (that.endTime === 0) {
                  that.sendStatus = false;
                  clearInterval(that.timer);
                }
              }, 1000);
            }
          });
        } else {
          that.$message.error({ message: "请输入正确的手机号码！" });
        }
      } else {
        that.$message.error({ message: "请输入手机号码！" });
      }
    },
    //提交
    async forgetPwdSubmit(forgetPwdData) {
      let that = this;
      this.$refs[forgetPwdData].validate(async valid => {
        if (valid) {
          this.canSubmit = false;
          this.forgetPwdData.NewPWD = md5(this.forgetPwdData.PWD);
          let req = {
            intSource: '2',
            Mobile: this.forgetPwdData.Mobile,
            SmsCode: this.forgetPwdData.SmsCode,
            NewPWD: this.forgetPwdData.NewPWD,
            NewPWDConfirm: this.forgetPwdData.NewPWD,
            IP: "192.168.1.1"
          };
          let resData = await forgetPwd(req);
          if (resData.data.ResultCode === "000000") {
            this.$message.success({ message: resData.data.ResultMessage });
            // 这个地方 要配合 官网 所以domain 必须要放开 设置 domain: "sdhwlw.com"
            let host = window.location.href.indexOf("sdhwlw.com") > -1 ? 'sdhwlw.com' : window.location.hostname;
            cookie('Token', String(resData.data.ResultValue.MembToken), {
              "expires": 30
            });
            cookie("MemberCrowd", String(resData.data.ResultValue.MemberCrowd), {
              expires: 30,
              path: "/",
              domain: host
            });
            cookie(
              "MemberMerchantID",
              String(resData.data.ResultValue.MemberMerchantID),
              {
                expires: 30,
                path: "/",
                domain: host
              }
            );
            cookie("MemberID", String(resData.data.ResultValue.MemberID), {
              expires: 30,
              path: "/",
              domain: host
            });
            cookie("Mobile", String(that.forgetPwdData.Mobile), {
              expires: 30,
              path: "/",
              domain: host
            });
            cookie("MemberDutiesID", String(resData.data.ResultValue.MemberDutiesID), {
              expires: 30,
              path: "/",
              domain: host
            });
            cookie("MerchantStatus", String(resData.data.ResultValue.MerchantStatus), {
              expires: 30,
              path: "/",
              domain: host
            });
            if(resData.data.ResultValue.MerchantStatus == 2){
              if (resData.data.ResultValue.MemberCrowd == 1) {
                this.$router.push("/source");
              } else {
                this.$router.push("/add");
              }
            } else {
              this.$router.push("/settled");
            }
          } else {
            this.canSubmit = true;
          }
        } else {
          return false;
        }
      });
    }
  },
  computed: {
    //判断手机号码
    rightPhoneNumber: function() {
      return regs.Phone.test(this.forgetPwdData.Mobile);
    }
  },
  created() {
    this.automaticLogon(); // 存在用户，则不让进入外页
  },
  components: {
    headTop,
    foot
  }
};
</script>

<style lang="stylus" scoped>
@import '../../assets/styles/variable.styl';

// .header
// position: absolute
// top: 0
// z-index: 1000
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
.login-content 
  overflow: hidden
  clear: both
  // position: absolute
  // top: 50%
  // left: 50%
  // z-index: 10
  width: 900px
  height: 600px
  margin: 80px auto 120px
  // margin: -325px 0 0 -450px
  .login-left 
    position: relative
    float: left
    width: 500px
    height: 600px
    box-shadow: 0 0 15px #CFCFCF
    border-radius: 4px
    background-color: #fff
    .item 
      width: 300px
      margin: 50px auto 0
      h1 
        margin-bottom: 20px
        font-size: 48px
        font-weight: normal
      .type 
        position: absolute
        top: 66px
        right: 60px
        display: inline-block
        padding: 0 10px
        height: 22px
        line-height: 22px
        text-align: center
        font-size: 14px
        color: #027cff
        border: 1px solid #027CFF
        border-radius: 20px
    .login-box 
      margin-top: 10px
      .code-input 
        float: left
        width: 180px
      .code-btn 
        float: right
        width: 120px
        text-align: right
      .btn-box 
        margin-top: 35px
        button 
          width: 150px
          heigth: 40px
          line-height: 40px
          padding: 0
          text-align: center
      .go-login 
        float: right
        height: 26px
        line-height: 26px
        color: $blue
        font-size: 12px
  .login-right 
    float: left
    width: 400px
    height: 600px
</style>