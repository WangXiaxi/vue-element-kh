<template>
  <div>
    <head-top class="header">
      <span class="title" slot="index">{{userType == 1?'货主':'物流公司'}}-工作台</span>
      <div class="header-center" slot="menu">
        <head-menu-router activeLink="finaindex"></head-menu-router>
      </div>
      <drop-down slot="info"></drop-down>
    </head-top>
    <div class="content clear">
      <div class="content-left">
        <left-menu-router-fina activeLink="balance"></left-menu-router-fina>
      </div>
      <div class="content-right">
        <div class="title-box"><span class="title-name">账户余额 < 充值</span></div>
        <div class="container clear">
          <div>
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
    <foot></foot>
  </div>
</template>


<script>
  import headTop from "components/header/head";
  import dropDown from "components/header/children/dropdown";
  import foot from "components/footer/foot";
  import headMenuRouter from 'components/headMenuRouter/headMenuRouter'; // 头部
  import leftMenuRouterFina from 'components/leftMenuRouter/leftMenuRouterFina'; // 左侧
  export default {
    data() {
      return {
        userType: this.$cookie.get("MemberCrowd"),
        headTop,
        foot,
        dropDown,
        MerchantID: this.$cookie.get("MemberMerchantID"),
        MemberID: this.$cookie.get("MemberID")
      };
    },
    computed: {
    },
    created() {
      if (this.$cookie.get("MemberID")) {
        // 条件
      } else {
        this.$message.info({ message: "你尚未登录，请登录！" });
        this.$router.push("/");
      }
    },
    methods: {
    },
    components: {
      headTop,
      foot,
      dropDown,
      headMenuRouter,
      leftMenuRouterFina
    }
  };
</script>

<style lang="stylus" scoped>
@import '../../../assets/styles/template.styl';
</style>
