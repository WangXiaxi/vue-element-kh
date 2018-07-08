<template>
  <div class="login-container">
    <head-top class="header">
      <span class="title" slot="login">登录注册</span>
      <router-link to="/" slot="to_login" class="blue-btn-p">已有账号直接登录</router-link>
    </head-top>
    <div class="login-content">
      <!--左侧-->
      <div class="login-left">
        <!--注册 start-->
        <div class="item">
          <h1>货主注册 <span class="type">工厂企业/物流公司</span></h1>
          <div class="login-box">
            
            <el-form ref="registerOneData" :model="registerData" :rules="registerOneRules" status-icon v-show="switchPage">
              <el-form-item prop="Mobile">
                <el-input
                  v-model.trim="registerData.Mobile"
                  placeholder="请输入手机号"
                  clearable
                ></el-input>
              </el-form-item>

              <el-form-item prop="SmsCode">
                <span class="code-input">
                  <el-input
                    v-model.trim="registerData.SmsCode"
                    placeholder="请输入验证码"
                    clearable
                  ></el-input>
                </span>
                <span class="code-btn">
                  <el-button v-if="!sendStatus" :type="!rightPhoneNumber?'info':'primary'" :disabled="!rightPhoneNumber"
                             @click="sendCode">发送验证码</el-button>
                  <el-button v-else type="info" disabled>{{endTime}}s后重发</el-button>
                </span>
              </el-form-item>

              <el-form-item prop="InviteCode">
                <el-input
                  v-model.trim="registerData.InviteCode"
                  placeholder="邀请码-非必填"
                  clearable
                ></el-input>
              </el-form-item>
            </el-form>
            <!-- 分割 -->


            <el-form :model="registerData" ref="registerData" :rules="registerRules" status-icon v-show="!switchPage">
              <el-form-item prop="Pwd">
                <el-input
                  v-model.trim="registerData.Pwd"
                  type="password"
                  placeholder="输入密码"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item prop="PwdCon">
                <el-input
                  v-model.trim="registerData.PwdCon"
                  type="password"
                  placeholder="确认密码"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item prop="Crowd" class="crowd">
                <span class="mr-20">选择身份</span>
                <el-radio v-model="registerData.Crowd" label="1">工厂企业</el-radio>
                <el-radio v-model="registerData.Crowd" label="2">物流公司</el-radio>
              </el-form-item>
            </el-form>
            <p class="agree" v-show="!switchPage">
              <el-checkbox :checked="checked" v-model="checked"></el-checkbox>
              <label class="gray-txt size12">阅读并同意</label>
              <a href="http://app.sdhwlw.com/Agreement/service.html" target="_blank" class="size12 blue-txt">&lt;&lt;速达汇用户协议&gt;&gt;</a>
            </p>

            <p class="btn-box" v-show="switchPage" style="margin-top: 74px;">
              <el-button type="primary" :disabled="canSubmit" round
                         @click="registerOneForm()">
                下一步
              </el-button>
            </p>
            <p class="btn-box" v-show="!switchPage">
              <el-button type="primary" :disabled="canSubmit" round
                         @click="registerSubmit('registerData')">
                注册
              </el-button>
              <span class="up-l" @click="switchPage=true">上一步</span>
            </p>
            <p class="mt-10">
              <router-link to="/" target="_self" class="size12 blue-txt">已有账号去登录</router-link>
            </p>
          </div>
        </div>
        <!--注册 end-->
      </div>
      <!--右侧-->
      <div class="login-right">
        <img src="../../assets/images/app-bg.png" alt="" width="400px" height="600px">
      </div>
    </div>
    <foot class="footer"></foot>
  </div>
</template>


<script type="es6">
  import headTop from 'components/header/head'
  import foot from 'components/footer/foot'
  import regs from 'config/regExp'
  import cookie from 'cookiejs'
  import md5 from 'js-md5';
  import {getCode, register} from 'api/getData'

  export default {
    data() {
      return {
        switchPage: true, // false上一步 true下一步显示
        sendStatus: false,//验证码是否发送
        endTime: 0,//倒计时时间
        timer: null,//定时器
        checked: true,//是否同意协议
        hasCommit: false,//是否已提交
        registerData: {//注册数据
          Mobile: '',
          SmsCode: '',
          Crowd: '',
          LoginPwd: '',
          InviteCode: '',
          Pwd: '',
          PwdCon: '',
          PwdConfirm: '',
          IP: "192.168.1.1"
        },
        registerOneRules: {//Form验证规则
          Mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {pattern: regs.Phone, message: '请输入正确的手机号码', trigger: 'blur'}
          ],
          SmsCode: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
            {pattern: regs.Code, message: '请输入正确的验证码', trigger: 'blur'}
          ],
          InviteCode: [ // 空或者数字
            {pattern: regs.Number, message: '请输入数字邀请码', trigger: 'blur'}
          ]
        },
        registerRules: {
          Pwd: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          PwdCon: [
            {required: true, message: '请确认密码', trigger: 'blur'},
            {
              validator: (rule, value, callback) => {
                if (value === '') {
                  callback(new Error('请再次输入密码'));
                } else if (value !== this.registerData.Pwd) {
                  callback(new Error('两次输入密码不一致!'));
                } else {
                  callback();
                }
              }, trigger: 'blur'
            }
          ],
          Crowd: [
            {required: true, message: '请选择身份！', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      registerOneForm () { // 验证第一步表单
        let that = this;
        this.$refs['registerOneData'].validate(async (valid) => {
          if (valid) {
            this.switchPage = false;
          }
        })
      },
      // 发送验证码
      sendCode() {
        let that = this;
        if (this.registerData.Mobile) {
          if (this.rightPhoneNumber) {
            getCode({'Mobile': this.registerData.Mobile,Use: '101'}).then(res => {
              if (res.data.ResultCode === '000000') {
                this.$message.success({message: res.data.ResultMessage});
                that.sendStatus = true;
                that.endTime = 60;
                that.timer = setInterval(() => {
                  that.endTime--;
                  if (that.endTime === 0) {
                    that.sendStatus = false;
                    clearInterval(that.timer)
                  }
                }, 1000)
              }
            }).catch(err => {
              console.log(err);
            })
          } else {
            that.$message.error({message: '请输入正确的手机号码！'})
          }
        } else {
          that.$message.error({message: '请输入手机号码！'})
        }
      },
      //注册
      async registerSubmit(registerData) {
        let that = this;
        this.$refs[registerData].validate(async (valid) => {
          if (valid) {
            this.hasCommit = true;
            this.registerData.LoginPwd = md5(this.registerData.Pwd);
            this.registerData.PwdConfirm = md5(this.registerData.PwdCon);
            let req = {
              intSource: '2',
              Mobile: this.registerData.Mobile,
              SmsCode: this.registerData.SmsCode,
              Crowd: this.registerData.Crowd,
              LoginPwd: this.registerData.LoginPwd,
              PwdConfirm: this.registerData.PwdConfirm,
              InviteCode: this.registerData.InviteCode,
              IP: "192.168.1.1"
            };
            let resData = await register(req);
            let Data = resData.data.ResultValue;
            if (resData.data.ResultCode === '000000' && Data) {
              this.$message.success({message: resData.data.ResultMessage});
              // 这个地方 要配合 官网 所以domain 必须要放开 设置 domain: "sdhwlw.com"
              let host = window.location.href.indexOf("localhost") > -1 ? 'localhost' : 'sdhwlw.com';
              cookie('Token', String(Data.MembToken),
                {
                  "expires": 30
                });
              cookie('MemberCrowd', String(Data.MemberCrowd),
                {
                  "expires": 30,
                  "path": '/',
                  "domain": host
                });
              cookie('MemberMerchantID', String(Data.MemberMerchantID),
                {
                  "expires": 30,
                  "path": '/',
                  "domain": host
                });
              cookie('MemberID', String(Data.MemberID),
                {
                  "expires": 30,
                  "path": '/',
                  "domain": host
                });
              cookie('Mobile', String(that.registerData.Mobile),
                {
                  "expires": 30,
                  "path": '/',
                  "domain": host
                });
              cookie('MemberDutiesID', String(Data.MemberDutiesID),
                {
                  "expires": 30,
                  "path": '/',
                  "domain": host
                });  
                cookie('MerchantStatus', String(Data.MerchantStatus),
                {
                  "expires": 30,
                  "path": '/',
                  "domain": host
                });
                this.$router.push('/settled');
            } else {
              this.hasCommit = false;
            }
          } else {
            return false;
          }
        });
      }
    },
    computed: {
      //判断手机号码
      rightPhoneNumber() {
        return regs.Phone.test(this.registerData.Mobile);
      },
      canSubmit() {
        if (this.checked && !this.hasCommit) {
          return false
        } else {
          return true
        }
      }
    },
    created(){
      // getIP().then(res => {
      //   if (res.status == '200' && res.data) {
      //     this.registerData.IP = res.data.ip;
      //     this.$cookie.set('IP', res.data.ip);
      //   }
      // })
    },
    components: {
      headTop,
      foot
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../assets/styles/variable.styl"
  // .header
  //   position: absolute
  //   top: 0
  //   z-index: 1000

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
    overflow hidden
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
      border-radius: 4px;
      background-color: #fff
      .up-l
        color: $blue
        margin-left: 30px
        cursor: pointer
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

  // .footer
  //   position: absolute
  //   bottom: 0
  //   z-index: 1000
</style>
