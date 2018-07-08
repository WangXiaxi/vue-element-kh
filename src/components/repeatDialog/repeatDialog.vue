<!--
  * 发布重复时，弹出的dialog
  * param
    ifShow: 外部传入的是否显示弹窗

    closeDialog: 返回close 事件
    goPublish: 操作
-->

<template>
  <div class="repeat-dialog">
    <el-dialog
      :visible.sync="ifShowx"
      width="400px"
      @close="closeDialog"
      center>
      <p class="con">
        <i class="el-icon-warning"></i>
      </p>
      <p class="con">
        <span class="su">同样信息货源，您今天已发布一单！</span>
      </p>
      <p class="con">
        <span class="mess red">是否再次发布货源？</span>
      </p>
      <span slot="footer" class="dialog-footer">
        <div class="spec-btn-box">
          <div class="spec-btn continue" @click="closeDialog">
            取消发布
            <i class="line"></i>
          </div>
          <div class="spec-btn checkInfo" @click="goPublish">
            继续发布
          </div>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script type="es6">
  export default {
    props: {
      ifShowRepeatDialog: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        ifShowx : this.ifShowRepeatDialog
      }
    },
    created () {
      console.log(this.ifShowRepeatDialog)
    },
    methods: {
      closeDialog () { // 继续发布 同取消 一样
        this.ifShowx = false
        setTimeout(() => {
          this.$emit("closeDialog")
        }, 500)
      },
      goPublish () { // 去货源详情操作
        this.ifShowx = false
        setTimeout(() => {
          this.$emit("goPublish")
        }, 500)
        
      }
    },
    watch: {
      ifShowRepeatDialog (n) {
        this.ifShowx = n
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .repeat-dialog
    .spec-btn-box
      height: 50px
      border-top: 1px solid #f0f0f0
      .spec-btn
        width: 50%
        float: left
        text-align: center
        line-height: 50px
        position: relative
        cursor: pointer
        .line
          position: absolute
          right: 0
          height: 50px
          border-right: 1px solid #f0f0f0
        &.checkInfo
          color: #027CFF
    .el-dialog__body
      .con
        text-align: center
        margin: 0 auto 16px
        width: 238px
        i
          color: #49e390
          font-size: 55px
        .su
          font-size: 16px
          line-height: 22px
        .mess
          font-size: 14px
          line-height: 22px
          color: #999
          &.red
            color: #F12C20
</style>
<style lang="stylus">
  .repeat-dialog
    .el-dialog__footer
      padding: 0
    .el-dialog__body
      height: 164px
</style>