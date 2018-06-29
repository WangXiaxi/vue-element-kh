<template>
  <div class="login-container">
    <headr-top class="headTop"></headr-top>
    <div class="list-content" ref="listContent" :style="setStyleHeight">
      <div class="person-info">
          <!-- <div class="avatorpic"><img src="../assets/avator.jpg" alt=""></div> -->
          <div class="person-name">
            <strong>{{menberinfo}}</strong>
            <el-button type="primary" plain size="mini" class="personbtn">{{ProvinceName}}</el-button>
          </div>
          <el-button type="primary" size="small" class="right-btn" @click="handleAdd">添加业务员</el-button>
      </div>
      <div class="agentlistbox">
        <div class="title-box">
          <router-link to="/list" class="title-name">业务统计</router-link>
          <router-link to="/commerce-statistics" class="title-name">商户统计</router-link>
          <router-link to="/salesman" class="title-name">业务员管理</router-link>
        </div>
        <router-view></router-view>
      </div>
    </div>
    <foot-er v-bind:class="{ footer: islonger }"></foot-er>
    <dialog-add v-if="dialogAddShow" :isShow="dialogAddShow" @closeDialogAdd="closeDialogAdd"></dialog-add>
  </div>
</template>

<script type="text/ecmascript-6">
  import headrTop from '@/components/headtop'
  import footEr from '@/components/foot'
  import dialogAdd from '@/components/dialog-add'
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    data() {
      return {
        menberinfo: this.$cookie.get('AgentName'),
        ProvinceName: this.$cookie.get('ProvinceName'),
        islonger: false, // footer是否固定底部
        minHeight: 500,
        dialogAddShow: false
      }
    },
    components: {
      headrTop,
      footEr,
      dialogAdd
    },
    computed: {
      setStyleHeight () {
        return {minHeight: `${this.minHeight}px`}
      },
      ...mapGetters([
        'ifAddYWY'
      ])
    },
    mounted () {
      const that = this
      that.getHeight()
      window.onresize = () => {
        that.getHeight()
      }
    },
    methods: {
      getHeight () {
        let height = document.body.clientHeight
        this.minHeight = height - 220
      },
      handleAdd () { // 添加操作
        this.dialogAddShow = true
      },
      closeDialogAdd (ifSuccess) {
        if (ifSuccess) {
          this.setIfAddYWY(ifSuccess)
        }
        this.dialogAddShow = false
      },
      ...mapMutations({
        setIfAddYWY: 'SET_ifAddYWY'
      })
    },
    created () {
    }
  }
</script>

<style lang="stylus" scoped>
  .list-content
    width: 1200px
    margin: 10px auto 30px auto
  .person-info
    padding:30px
    margin-bottom :10px
    background:#fff
    height:70px
    position: relative
    .right-btn
      position: absolute
      right: 30px
      top: 48px
  .avatorpic
    width:70px
    height:70px
    overflow:hidden
    float:left
    img
      width: 100%
      height:100%
  .person-name
    margin-left:20px
    width:600px
    float:left
    strong
      display block
      font-size: 16px
      color: #666666
      line-height: 40px
  .agentlistbox
    background: #fff
    min-height: 500px
  .title-box
    box-shadow: 0 1px 0 0 #E0E0E0
    .title-name
      display: inline-block
      height: 40px
      line-height: 40px
      margin: 0 20px
      
      color: #333
      &.router-link-active
        color: #027cff
        border-bottom: 2px solid #027cff 
  .footer
    position: absolute
    bottom: 0
    z-index: 1000
</style>
