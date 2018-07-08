<template>
  <div>
    <head-top class="header">
      <span class="title" slot="index">{{userType == 1?'货主':'物流公司'}}-工作台</span>
      <div class="header-center" slot="menu">
        <headMenuRouter :userType="userType" activeLink="finaindex"></headMenuRouter>
      </div>
      <drop-down slot="info"></drop-down>
    </head-top>
    <div class="content clear">
      <div class="content-left">
        <leftMenuRouter :userType="userType" activeLink="balance"></leftMenuRouter>
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
import headMenuRouter from '../headmenurouter.vue';
import leftMenuRouter from '../leftmenurouter.vue';
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
    leftMenuRouter
  }
};
</script>

<style lang="stylus" scoped>
@import '../../../assets/styles/template.styl';
</style>
