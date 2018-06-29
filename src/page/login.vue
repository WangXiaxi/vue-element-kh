<template>
  <div class="login-container">
    <headr-top class="headTop"></headr-top>
      <div class="login-content">
        <div class="login-box animated fadeIndown" v-loading="isReadOnly">
            <h2>代理商登录</h2>
          <el-form :model="loginForm" :rules="rules" ref="loginForm">
            <el-form-item prop="Mobile" class="login-list">
              <el-input
                v-model.trim="loginForm.Mobile"
                placeholder="请输入手机号"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="Password" class="login-list">
              <el-input
                type="password"
                v-model.trim="loginForm.Password"
                placeholder="输入密码"
                @keyup.enter.native="keyupEnter"
              ></el-input>

            </el-form-item>
            <el-form-item class="login-list">
              <el-button type="primary" :disable="isReadOnly" round @click="loginSubmit('loginForm')" class="submit_btn">登录</el-button>
            </el-form-item>

          </el-form>
        </div>
      </div>
    <foot-er class="footer"></foot-er>
  </div>
</template>

<script>
  import headrTop from '@/components/headtop'
  import footEr from '@/components/foot'
  import {AgentLogin} from '@/api/getData'
  export default {
    data() {
      return {
        isReadOnly: false,
        loginForm: {
          Mobile: '',
          Password: '',
        },
        rules: {
          Mobile: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          Password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
        },
        showLogin: false,
      }
    },
    components: {
      headrTop,
      footEr,
    },
    methods: {
      //登录
      async loginSubmit(loginData) {
        this.$refs[loginData].validate(async (valid) => {
          if (valid) {
            this.isReadOnly = true;
            let resData = await AgentLogin(this.loginForm);
            setTimeout(() => {
              this.isReadOnly = false;
            }, 500)
            let res = resData.data.ResultValue;
            if (resData.data.ResultCode === '000000') {
              this.$message.success({message: resData.data.ResultMessage});
              this.$cookie.set('AgentID', res.AgentID, 30);
              this.$cookie.set('AgentName', res.AgentName, 30);
              this.$cookie.set('ProvinceName', res.ProvincevName+ ' ' + res.CityName+' '+ res.CountyName, 30);
              this.$router.push('/list');
            }
          } else {
            return false;
          }
        });
      },
      keyupEnter (ev) {
        if (ev.keyCode === 13) {
          if (!this.isReadOnly) {
            this.loginSubmit('loginForm')
          }
        }
      }
    },
    created () {
      this.$cookie.delete('AgentID');
      this.$cookie.delete('AgentName');
      this.$cookie.delete('ProvinceName');
    },
  }
</script>
<style lang="stylus">
  body{
    min-width: 1200px;
    position: relative;
  }
</style>
<style lang="stylus" scoped>
.login-container
  .login-content
    position: absolute
    top: 50%
    left: 50%
    z-index: 10
    width: 900px
    height: 600px
    margin: -325px 0 0 -450px
  .login-box
    position: absolute
    overflow: hidden
    top: 50%
    left: 50%
    width:300px
    height:300px
    transform:translate(0,0)
    margin:-190px auto auto -190px
    padding:40px
    background: rgb(255,255,255)
    border-radius: 10px
    box-shadow:0 0 30px 4px rgba(255,255,255,.2), 0 0 50px 1px rgba(0,0,0,.2);
    h2
      font-size:40px
      line-height:200%
      padding-bottom:20px
  .footer
    position: absolute
    bottom: 0
    z-index: 1000
  .headTop
    position: absolute
    top: 0
    z-index: 1000
  .submit_btn
    padding:10px 50px
</style>
