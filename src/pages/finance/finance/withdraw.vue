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
        <div class="title-box"><span class="title-name">账户余额 < 提现</span></div>
        <div class="container clear">
          <div>
            <router-view :child-msg="merchartinfo"></router-view>
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
  import { AccountSummary } from "@/api/getData";
  import headMenuRouter from 'components/headMenuRouter/headMenuRouter'; // 头部
  import leftMenuRouterFina from 'components/leftMenuRouter/leftMenuRouterFina'; // 左侧
  export default {
    data() {
      return {
        userType: this.$cookie.get("MemberCrowd"),
        headTop,
        foot,
        dropDown,
        merchartinfo: {
          menbername: "",
          canmoney: ""
        },
        MerchantID: this.$cookie.get("MemberMerchantID"),
        MemberID: this.$cookie.get("MemberID")
      };
    },
    computed: {
    },
    created() {
      if (this.$cookie.get("MemberID")) {
        this.MemberGet();
      } else {
        this.$message.info({ message: "你尚未登录，请登录！" });
        this.$router.push("/");
      }
    },
    methods: {
      async MemberGet() {
        if (this.$cookie.get("MemberMerchantID")) {
          let datlist = { MemberID: this.MemberID, MerchantID: this.MerchantID };
          const Updates = await AccountSummary(datlist);
          if (Updates.data.ResultCode == "000000") {
            let jsons = Updates.data.ResultValue;
            this.merchartinfo.menbername = jsons.MerchantName;
            if (jsons.Crowd == 1) {
              this.merchartinfo.canmoney = jsons.Balance;
            } else if (jsons.Crowd == 2) {
              this.merchartinfo.canmoney = jsons.Usable;
            }
          } else {
            this.$message({
              type: "error",
              message: Updates.data.ResultMessage
            });
            return false;
          }
        } else {
          this.$message.info("你尚未入驻！");
          this.$confirm("是否去入驻?", "你尚未入驻！", {
            confirmButtonText: "去入驻",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.$router.push("/settled");
          });
        }
      }
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
