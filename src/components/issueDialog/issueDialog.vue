<!--
  * 发布成功后，弹出的dialog
  * param
    diaInfo: 传入一些必要 显示 参数
    ifShow: 外部传入的是否显示弹窗

    closeDialog: 返回close 事件
    goDetails： 点击查看货源相详情操作 后返回 操作
-->

<template>
  <div class="issue-dialog">
    <el-dialog
      :visible.sync="ifShowx"
      width="400px"
      @close="closeDialog"
      center>
      <p class="con">
        <i class="el-icon-circle-check"></i>
      </p>
      <p class="con">
        <span class="su">恭喜您，货源发布成功！</span>
      </p>
      <p class="con">
        <span class="mess" :class="{red: issueDialogInfo.ResultPiPei==1}">{{issueDialogInfo.ResultMessage}}</span>
      </p>
      <span slot="footer" class="dialog-footer">
        <div class="spec-btn-box">
          <div class="spec-btn continue" @click="closeDialog">
            继续发布
            <i class="line"></i>
          </div>
          <div class="spec-btn checkInfo" @click="goDetails">
            查看货源详情
          </div>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      issueDialogInfo: {
        type: Object,
        default: {
          ResultPiPei: 0,
          ResultMessage: ''
        }
      },
      ifShowIssueDialog: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        ifShowx : this.ifShowIssueDialog
      }
    },
    created () {
    },
    methods: {
      closeDialog () { // 继续发布 同取消 一样
        this.$emit("closeDialog")
      },
      goDetails () { // 去货源详情操作
        this.$emit("goDetails")
      }
    },
    watch: {
      ifShowIssueDialog (n) {
        this.ifShowx = n
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .issue-dialog
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
  .issue-dialog
    .el-dialog__footer
      padding: 0
    .el-dialog__body
      height: 164px
</style>