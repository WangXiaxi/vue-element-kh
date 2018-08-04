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
        <left-menu-router-fina activeLink="pay"></left-menu-router-fina>
      </div>
      <div class="content-right">
        <div class="title-box"><span class="title-name">物流运费账单 < 付款</span></div>
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
        if (this.userType == 2) {
          this.$message.info({ message: "身份类型错误！" });
          this.$router.push("/finaindex");
        }
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
@import '../../../assets/styles/variable.styl';

.el-menu-demo {
  margin-bottom: 20px !important;
}

.el-tabs--border-card {
  box-shadow: none;
}

.content {
  width: 1200px;
  margin: 10px auto 40px;
  position: relative;
}

.content-left {
  float: left;
  width: 200px;

  > ul {
    position: absolute;
    height: 100%;
    width: 200px;
    background: #ffffff;

    > li {
      height: 30px;
      line-height: 30px;
      padding-left: 40px;
      margin: 10px 0;
      border-left: 3px solid transparent;

      &:hover {
        border-left-color: $blue;
        color: $blue;
        cursor: pointer;
      }
    }

    .active {
      border-left-color: $blue;
      color: $blue;
    }
  }
}

.content-right {
  float: right;
  background-color: #fff;
  width: 990px;

  .title-box {
    box-shadow: 0 1px 0 0 #E0E0E0;

    .title-name {
      display: inline-block;
      padding-left: 20px;
      height: 30px;
      line-height: 30px;
      margin: 10px 0;
      border-left: 3px solid $blue;
    }
  }
}

.container {
  min-height: 700px
  padding: 40px;
}
.withdraw-span {
  float: left;
  width: 98px;
  text-align: right;
  padding-right: 12px;
  line-height: 40px;
}
</style>
