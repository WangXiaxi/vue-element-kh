<!--
  * 发布重复时，弹出的dialog
  * param
    dialogObject: 数据集合
    closeDialog: 返回close 事件
    sureDialog: 操作
-->

<template>
  <div class="hint-dialog">
    <el-dialog
      :visible.sync="dialogObject.visible"
      width="400px"
      @close="closeDialog"
      center>
      <p class="con">
        <i :class="`el-icon-${dialogObject.i}`" :style="{color: dialogObject.iColor}"></i>
      </p>
      <p class="con">
        <span class="su">{{dialogObject.tip}}</span> <!--同样信息货源，您今天已发布一单！-->
      </p>
      <p class="con">
        <span class="mess" :style="{color: dialogObject.color}">{{dialogObject.des}}</span>
      </p>
      <span slot="footer" class="dialog-footer">
        <div class="spec-btn-box">
          <div class="spec-btn continue" @click="closeDialog">
            {{dialogObject.btnL}}
            <i class="line"></i>
          </div>
          <div class="spec-btn checkInfo" @click="sureDialog">
            {{dialogObject.btnR}}
          </div>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      dialogObject: {
        type: Object,
        default: {
          visible: false, // 是否显示
          btnL: '取消', // 取消按钮名称
          btnR: '确定', // 确定按钮名称
          tip: '提示', // 提示
          des: '描述', // 描述
          color: '#999', // 描述字颜色
          i: 'warning', // 图标
          iColor: '#fecb12' // 图标颜色
        }
      }
    },
    created () {
    },
    methods: {
      closeDialog () { // 继续发布 同取消 一样
        this.reset();
        this.$emit('closeDialog');
      },
      sureDialog () { // 去货源详情操作
        this.reset();
        this.$emit('sureDialog');
      },
      reset () {
        this.dialogObject = Object.assign(this.dialogObject, {
          visible: false, // 是否显示
        })
      }
    },
    watch: {

    }
  }
</script>

<style lang="stylus" scoped>
  .hint-dialog
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
  .hint-dialog
    .el-dialog__footer
      padding: 0
    .el-dialog__body
      height: 164px
</style>