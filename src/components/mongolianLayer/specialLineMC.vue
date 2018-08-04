<template>
  <div class="special-line-mc">
    <transition name="fade">
      <!-- 蒙层 1.0.62 start -->
      <div class="line-mc" v-if="show">
        <div class="line-mc-box">
          <img src="../../assets/images/special-line/sl-1.png" class="sl-1">
          <img src="../../assets/images/special-line/sl-2.png" class="sl-2">
          <img src="../../assets/images/special-line/sl-3.png" class="sl-3">
          <img src="../../assets/images/special-line/sl-4.png" class="sl-4">
          <p class="text">新的版本更新添加了物流专线，物流老板们也可以在web端，更改添加专线了～！</p>
          <div class="btn-box">
            <el-button class="btn" type="primary" @click="close">我知道了</el-button>
          </div>
        </div>
      </div>
      <!-- 蒙层 1.0.62 end -->
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import m_login from '@/mixins/m_login'
  import { mapGetters, mapMutations } from 'vuex'
  import { getUserInfo, AddGuidRecord, GuideGetPage } from "api/getData"

  const MCID = '0ceda93c71afcf2da98c5929045da0f2' // 当前蒙层id

  export default {
    mixins: [m_login],
    created () {
      if ( this.userType == 2) { // 防止重复请求接口
        if (this.$route.name !== 'specialLine') {
          if (this.guideMC.length === 0) {
            this.GuideGetPage()
          } else if (this.guideMC !== '1') {
            this.$router.push('/specialLine')
          }
        } else {
          if (this.guideMC.length === 0) {
            this.GuideGetPage()
          } else if (this.guideMC !== '1') {
            let ifShow = JSON.stringify(this.guideMC).indexOf(MCID) > -1 // 是否需要显示
            if (ifShow) {
              setTimeout(() => {
                this.show = true
              }, 300)
            }
          }
        }
      }
    },
    computed: {
      ...mapGetters([
        'guideMC'
      ])
    },
    methods: {
      async GuideGetPage () { // 获取是否显示引导
        const res = await GuideGetPage({SourceType: 2})
        if (res.data.ResultCode === '000000') {
          if (res.data.ResultValue.length === 0) {
            this.SET_guideMC('1')
          } else {
            this.SET_guideMC(res.data.ResultValue)
          }
        }
      },
      async close () {
        // 写回调通知方法
        const res = await AddGuidRecord({GuidID: MCID}) // 回调记录一下
        let cur = []
        this.guideMC.forEach((c, i) => {
          if (c.GuidID !== MCID) {
            cur.push(JSON.parse(JSON.stringify(c)))
          }
        })
        if (cur.length === 0) { // 如果操作执行删除当前蒙层后为空数组，则改变状态值为1 防止重复请求接口
          cur = '1'
        }
        this.SET_guideMC(cur)
        this.show = false

      },
      ...mapMutations({
        SET_guideMC: 'SET_guideMC'
      })
    },
    components: {

    },
    data () {
      return {
        show: false
      }
    },
    watch: {
      guideMC (n) {
        if (this.userType == 2 && n !== '1') {
          let ifCur = this.$route.name === 'specialLine' // 是否当前页
          let ifShow = JSON.stringify(n).indexOf(MCID) > -1 // 是否需要显示
          if (ifShow) {
            if (ifCur) {
              setTimeout(() => {
                this.show = true
              }, 300)
            } else {
              this.$router.push('/specialLine')
            }
          }
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .fade-enter-active, .fade-leave-active
    transition: opacity .6s
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    opacity: 0
  .special-line-mc
    .line-mc
      position: absolute
      height: 100%
      width: 100%
      min-width: 1200px
      top: 0
      left: 0
      bottom: 0
      right: 0
      z-index: 1000000
      background: rgba(0, 0, 0, 0.5)
      overflow: hidden
      .line-mc-box
        position: relative
        width: 1200px
        margin: 0 auto
        height: 100%
        .sl-1
          position: absolute
          top: 232px
          left: 474px
        .sl-2
          position: absolute
          top: 90px
          left: 250px
        .sl-3
          position: absolute
          top: 163px
          left: 1023px
        .sl-4
          position: absolute
          top: 105px
          left: -10px
        .text
          position: absolute
          width: 100%
          text-align: center
          color: #fff
          font-size: 16px
          top: 495px
        .btn-box
          position: absolute
          top: 570px
          text-align: center
          width: 100%
        .el-button--primary
          width: 200px
          background: #027CFF
          border-color: #027CFF
          &:hover
            color: #fff
            background-color: #409EFF
            border-color: #409EFF
</style>
