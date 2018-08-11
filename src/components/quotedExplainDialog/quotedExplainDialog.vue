<!--
  * 运费报价计算说明，弹出的dialog
  * param
    closeDialog: 返回close 事件
-->

<template>
  <div class="quoted-explain-dialog">
    <el-dialog
      :visible.sync="dialog.visible"
      width="800px"
      title="运费报价计算说明"
      center>
      <ul class="list">
        <li>货物重货按每吨计算，泡货按m³计算，重泡货计算方案为{{bulkyCargo}}kg/m³以上为重货；</li>
        <li>货物优惠百分比物流设置为”N”,基数为1吨/1m³，每增加1吨/1m³优惠递增；</li>
        <li>运费单价=最高报价*【1-（吨/m³-1）*N%】；</li>
        <li>运费总价=单价*吨/m³总数；</li>
        <li>运费单价=>重/泡货的最低价；</li>
        <li>
          <p>举例，优惠1%，最低价80元，最高价100元；</p>
          <p>吨数为1时，运费=100*1=100；</p>
          <p>吨数为2时，运费=100*【1-（2-1）*1%】*2=99*2=198；</p>
          <p>吨数为3时，运费=100*【1-（3-1）*1%】*3=98*3=296；</p>
          <p>以此类推，计算重泡货价格；</p>
          <img src="../../assets/images/bj-js.png" class="img">
        </li>
      </ul>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { GetHeavyCargoStandard } from "api/getData"

  export default {
    props:['dialog'],

    created () {
      // 判断阈值是否存在
      if (this.bulkyCargo < 0) {
        this.GetHeavyCargoStandard()
      }
    },
    methods: {
      closeDialog () { // 继续发布 同取消 一样
        this.dialog.visible = false
      },
      async GetHeavyCargoStandard () {
        const resData = await GetHeavyCargoStandard()
        if (resData.data.ResultCode === '000000') {
          this.SET_bulkyCargo(resData.data.ResultValue)
        }
      },
      ...mapMutations({
        SET_bulkyCargo: 'SET_bulkyCargo'
      })
    },
    computed: {
      ...mapGetters([
        'bulkyCargo'
      ])
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../assets/styles/variable.styl"
  .quoted-explain-dialog
    .list
      color: #333
      padding-bottom: 40px
      li
        line-height: 20px
        margin-top: 20px
        padding-left: 35px
        position: relative
        &:before
          position: absolute
          left: 0
          top: 7px
          margin-left: 10px
          content: " "
          display: block
          width: 6px
          height: 6px
          border-radius: 50%
          background: $orange
        p
          margin-top: 10px
      .img
        width: 363px
        margin-top: 10px
</style>
<style lang="stylus">
  .quoted-explain-dialog
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