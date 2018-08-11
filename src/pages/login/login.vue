<template>
  <div class="login-container">
    <head-top class="header">
      <span class="title" slot="login">登录注册</span>
    </head-top>
    <div class="login-content">
      <!--左侧-->
      <div class="login-left">
        <!--登录 start-->
        <div class="item">
          <h1>货主登录 <span class="type">工厂企业/物流公司</span></h1>
          <div class="login-box">
            <el-form :model="loginData" ref="loginData" :rules="loginRules" status-icon>
              <el-form-item label="" prop="LoginCode">
                <el-input
                  v-model.trim="loginData.LoginCode"
                  placeholder="请输入手机号"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="" prop="LoginPWD">
                <el-input
                  type="password"
                  v-model.trim="loginData.LoginPWD"
                  placeholder="输入密码"
                  clearable
                  @keyup.enter.native="loginSubmit('loginData')"
                ></el-input>
              </el-form-item>
            </el-form>
            <p class="mr-4">
              <router-link class="size12 blue-txt" to="/fastLogin">快捷登录</router-link>
              <router-link class="go-login" to="/forget">忘记密码</router-link>
            </p>
            <p class="btn-box">
              <el-button type="primary" :disabled="!canSubmit" @click="loginSubmit('loginData')" round>登录</el-button>
            </p>
            <p class="mt-10">
              <router-link class="size12 blue-txt" to="/register">没有账号去注册</router-link>
            </p>
          </div>
        </div>
        <!--登录 end-->
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
import { removeStore } from "config/myUtils";
import { login } from "api/getData";
import { webUrl } from "api/env";
import auto_login from "@/mixins/auto_login";

export default {
  mixins: [auto_login],
  data() {
    return {
      webUrl,
      canSubmit: true,
      loginData: {
        //登录数据
        LoginCode: "",
        LoginPassword: "",
        LoginPWD: "",
        IP: "192.168.1.1"
      },
      loginRules: {
        //Form验证规则
        LoginCode: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: regs.Phone,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        LoginPWD: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  created () {
    this.automaticLogon(); // 存在用户，则不让进入外页
  },
  methods: {
    //登录
    async loginSubmit(loginData) {
      let that = this;
      this.$refs[loginData].validate(async valid => {
        if (valid) {
          this.canSubmit = false;
          this.loginData.LoginPassword = md5(this.loginData.LoginPWD);
          let req = {
            intSource: '2',
            Mobile: this.loginData.LoginCode,
            LoginPassword: this.loginData.LoginPassword,
            IP: "192.168.1.1"
          };
          let resData = await login(req);
          this.canSubmit = true;
          let res = resData.data.ResultValue;
          if (resData.data.ResultCode === "000000") {
            // 这个地方 要配合 官网 所以domain 必须要放开 设置 domain: "sdhwlw.com"
            let host = window.location.href.indexOf("sdhwlw.com") > -1 ? 'sdhwlw.com' : window.location.hostname;
            cookie('Token', String(res.MembToken), {
              expires: 30
            });
            cookie("MemberCrowd", String(res.MemberCrowd), {
              expires: 30,
              path: "/",
              domain: host
            });
            cookie("MemberMerchantID", String(res.MemberMerchantID), {
              expires: 30,
              path: "/",
              domain: host
            });
            cookie("MemberID", String(res.MemberID), {
              expires: 30,
              path: "/",
              domain: host
            });
            cookie("Mobile", String(that.loginData.LoginCode), {
              expires: 30,
              path: "/",
              domain: host
            });
            cookie("MemberDutiesID", String(res.MemberDutiesID), {
              expires: 30,
              path: "/",
              domain: host
            });
            cookie("MerchantStatus", String(res.MerchantStatus), {
              expires: 30,
              path: "/",
              domain: host
            });
            if (this.$route.query.toURl == "sdhwlw") {
              window.location.href = webUrl;
            } else {
              if(res.MerchantStatus == 2){
                if (res.MemberCrowd == 1) {
                  this.$router.push("/source");
                } else {
                  this.$router.push("/add");
                }
              } else {
                this.$router.push("/settled");
              }
            }
          }
        } else {
          return false;
        }
      });
    }
  },
  components: {
    headTop,
    foot
  }
};
</script>

<style lang="stylus" scoped>
@import '../../assets/styles/variable.styl'

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
