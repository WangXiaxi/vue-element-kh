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
        <leftMenuRouter :userType="userType" activeLink="pay"></leftMenuRouter>
      </div>
      <div class="content-right">
        <div class="title-box"><span class="title-name">物流运费账单</span></div>
        <div class="container clear">
          <div id="goldbox">
              <dl>
                <dt><span>物流总运费</span></dt>
                <dt><span>待付款</span><router-link v-bind:to="'wlpayment'" class="fr gray-txt cuspoint"><el-button class="reset-btn-small" size="mini" plain>去付款</el-button></router-link></dt>
                <dt><span>实付款</span><router-link v-bind:to="'paylist'" class="fr gray-txt cuspoint"><el-button class="reset-btn-small" size="mini" plain>查看</el-button></router-link></dt>
                <dd>
                  <strong>{{merchartinfo.GrossFreight}}</strong>
                  <p>共计(元)</p>
                </dd>
                <dd>
                  <strong>{{merchartinfo.Obligation}}</strong>
                  <p>共计(元)</p>
                </dd>
                <dd>
                  <strong>{{merchartinfo.ActualPayment}}</strong>
                  <p>共计(元)</p>
                </dd>
              </dl>
          </div>
          <div>

            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" router>
              <!-- <el-menu-item index="bill" class="is-active">付款</el-menu-item> -->
              <el-menu-item index="paylist">付款记录</el-menu-item>
              <el-menu-item index="obligation">待付款记录</el-menu-item>
              <el-menu-item index="carriageforward">收货方到付</el-menu-item>
            </el-menu>
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
import { FreightSum } from "@/api/getData";
import headMenuRouter from './headmenurouter.vue';
import leftMenuRouter from './leftmenurouter.vue';
export default {
  data() {
    return {
      userType: this.$cookie.get("MemberCrowd"),
      headTop,
      foot,
      dropDown,
      foodForm: {
        money: ""
      },
      foodSpecs: "alipay",
      banktype: "person",
      bankname: "",
      dialogVisible: false,
      selectIndex: [],
      selectbank: [],
      withdrawForm: {
        money: "",
        bankname: "",
        bankcard: "",
        bankplace: ""
      },
      choosetime: "",
      tableData5: [],
      tableFrozen: [],
      changebank: {},
      merchartinfo: {},
      MerchantID: this.$cookie.get("MemberMerchantID"),
      MemberID: this.$cookie.get("MemberID")
    };
  },
  computed: {
    activeIndex: function() {
      return this.$route.path.replace("/", "");
    }
  },
  created() {
    if (this.$cookie.get("MemberID")) {
      if (this.userType == 1) {
        this.FreightSum();
      } else if (this.userType == 2) {
        this.$message.info({ message: "身份类型错误！" });
        this.$router.push("/finaindex");
      }
    } else {
      this.$message.info({ message: "你尚未登录，请登录！" });
      this.$router.push("/");
    }
  },
  methods: {
    async FreightSum() {
      if(this.$cookie.get("MemberMerchantID")){
        let datlist = { MemberID: this.MemberID, MerchantID: this.MerchantID };
        const Updates = await FreightSum(datlist);
        if (Updates.data.ResultCode == "000000") {
          let jsons = Updates.data.ResultValue;
          this.merchartinfo = jsons;
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
        })
          .then(() => {
            this.$router.push("/settled");
          })
      }
    }
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
@import '../../assets/styles/template.styl';

#goldbox {
  margin-bottom: 20px;
  .el-button.reset-btn-small { // 重置下按钮
    background: #fff;
    border-color: #409EFF;
    color: #409EFF;
    &:hover {
      color: #409eff;
      background: #ecf5ff;
      border-color: #b3d8ff;
    }
  }
  dl {
    border-top: 1px solid #E0E0E0;
    border-left: 1px solid #E0E0E0;
    overflow: hidden;

    dt {
      float: left;
      border-bottom: 1px solid #E0E0E0;
      border-right: 1px solid #E0E0E0;
      line-height: 40px;
      padding: 0 10px;
      width: 282px;
    }

    dd {
      float: left;
      border-bottom: 1px solid #E0E0E0;
      border-right: 1px solid #E0E0E0;
      line-height: 40px;
      padding: 43px 10px 43px 10px;
      width: 282px;
      text-align: center;

      strong {
        font-size: 24px;
        line-height: 34px;
        height: 34px;
        margin-bottom: 10px;
      }

      p {
        font-size: 14px;
        line-height: 20px;
        height: 20px;
        color: $gray;
      }
    }
  }
}

.halfinput {
  width: 300px;
}

.withdraw-text {
  padding: 0 16px;

  em.blue-txt {
    padding-right: 16px;
  }
}

.withdraw-span {
  float: left;
  width: 98px;
  text-align: right;
  padding-right: 12px;
  line-height: 40px;
}

.centetbtn {
  width: 40%;
  display: block;
  margin: 10px auto;
}
</style>
