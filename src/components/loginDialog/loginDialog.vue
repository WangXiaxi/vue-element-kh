<!--
  * 发布认证弹窗，弹出的dialog
  * param
    ifShow: 外部传入的是否显示弹窗

    closeDialog: 返回close 事件
-->

<template>
  <div class="login-dialog">
    <el-dialog
      :visible.sync="ifShowx"
      width="400px"
      @close="closeDialog"
      title="发布货源提示"
      center>

      <p class="con">
        <i class="icon-iden"></i>
      </p>
      <div v-if="merchantStatus==0">
        <p class="con">
          <span class="big">您的账户没有认证入驻！</span>
        </p>
        <p class="con">
          <span class="small">无法发布货源，去认证吧～！</span>
        </p>
      </div>
      <div v-if="merchantStatus==1">
        <p class="con">
          <span class="big">您的账户入驻审核中！</span>
        </p>
        <p class="con">
          <span class="small">无法发布货源，请等待！</span>
        </p>
      </div>
      <div v-if="merchantStatus==-1">
        <p class="con">
          <span class="big red">您的账户入驻审核未通过！</span>
        </p>
        <p class="con">
          <span class="small">无法发布货源，请重新修改入驻！</span>
        </p>
      </div>

      <span slot="footer" class="dialog-footer">
        <div class="spec-btn-box">
          <el-button type="primary" v-if="merchantStatus==0" @click="gourl('/settled')" round>
            去认证入驻
          </el-button>
          <el-button type="primary" v-if="merchantStatus==1" @click="closeDialog" round>
            我知道了
          </el-button>
          <el-button type="primary" v-if="merchantStatus==-1" @click="gourl('/settled')" round>
            重新入驻
          </el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script type="es6">
  export default {
    props: {
      ifShowLoginDialog: {
        type: Boolean,
        default: false
      },
      merchantStatus: {
        type: String,
        default: '0'
      }
    },
    data () {
      return {
        ifShowx: this.ifShowLoginDialog
      }
    },
    created () {
    },
    methods: {
      gourl (url) {
        this.$router.push(url)
      },
      closeDialog () { // 继续发布 同取消 一样
        this.$emit("closeDialog")
      }
    },
    watch: {
      ifShowLoginDialog (n) {
        this.ifShowx = n
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .login-dialog
    .spec-btn-box
      height: 50px
    .icon-iden
      display: block
      width: 100px
      height: 100px
      margin: 0 auto
      background: url(../../assets/images/iden.png) 50% 50%/100% no-repeat
    .con
      text-align: center
      padding: 10px 0
      .big
        font-size: 16px
        line-height: 22px
      .small
        font-size: 14px
        line-height: 22px
        color: #999
      span.red
        color: red
    .el-button
      width: 200px
</style>
<style lang="stylus">
  .login-dialog
    .el-dialog__body
      padding: 15px 25px 20px
    .el-dialog__header
      height: 30px
      line-height: 30px
      font-size: 14px
      padding: 10px 0 10px 0
      border-bottom: 1px solid #f0f0f0
      .el-dialog__title
        display: block
        height: 30px
        line-height: 30px
        font-size: 14px
        text-align: left
        border-left: 2px solid #027CFF
        padding-left: 10px
      .el-dialog__headerbtn
        top: 17px
</style>