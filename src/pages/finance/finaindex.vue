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
        <div class="title-box"><span class="title-name">账户余额</span></div>
        <div class="container clear">
          <div id="goldbox">
            <dl v-if="userType==1">
              <dt><span>账户余额</span>
                <router-link v-bind:to="'balancelist'" class="fr gray-txt cuspoint"><el-button class="reset-btn-small" size="mini" plain>查看</el-button></router-link>
              </dt>
              <dt><span>已充值</span>
                <router-link v-bind:to="'recharge'" class="fr gray-txt cuspoint"><el-button class="reset-btn-small" size="mini" plain>充值</el-button></router-link>
              </dt>
              <dt><span>已提现</span>
                <router-link v-bind:to="'withdraw'" class="fr gray-txt cuspoint"><el-button class="reset-btn-small" size="mini" plain>提现</el-button></router-link>
              </dt>
              <dd>
                <strong>{{menberinfo.Balance?menberinfo.Balance:0}}</strong>
                <p>共计(元)</p>
              </dd>
              <dd>
                <strong>{{menberinfo.Recharge?menberinfo.Recharge:0}}</strong>
                <p>共计(元)</p>
              </dd>
              <dd>
                <strong>{{menberinfo.Cash?menberinfo.Cash:0}}</strong>
                <p>共计(元)</p>
              </dd>
            </dl>
            <dl v-if="userType==2">
              <dt><span>账户余额</span>
                <router-link v-bind:to="'recharge'" class="fr gray-txt cuspoint"><el-button class="reset-btn-small" size="mini" plain>充值</el-button></router-link>
              </dt>
              <dt><span>保证金</span>
                <!-- <router-link v-bind:to="'finaindex'" class="fr gray-txt cuspoint">退还保证金</router-link> -->
              </dt>
              <dt><span>可用金额</span>
                <router-link v-bind:to="'withdraw'" class="fr gray-txt cuspoint"><el-button size="mini" class="reset-btn-small" plain>提现</el-button></router-link>
              </dt>
              <dd>
                <strong>{{menberinfo.Balance?menberinfo.Balance:0}}</strong>
                <p>共计(元)</p>
              </dd>
              <dd>
                <strong>{{menberinfo.Bail?menberinfo.Bail:0}}</strong>
                <p>共计(元)</p>
              </dd>
              <dd>
                <strong>{{menberinfo.Usable?menberinfo.Usable:0}}</strong>
                <p>共计(元)</p>
              </dd>
            </dl>
          </div>
          <div class="fina-tipbox">
            <div class="fl picbox"><img src="../../assets/images/finaceicon.png" height="60" width="150"/></div>
            <div class="fl">
              共违约:
              <em class="blue-txt">{{menberinfo.ViolateTreaty?menberinfo.ViolateTreaty:0}}</em>次；罚款:
              <em class="blue-txt">{{menberinfo.PenalSum?menberinfo.PenalSum:0}}</em>元；
            </div>
            <el-popover
             class="fr"
              placement="top-start"
              title="联系客服"
              width="200"
              trigger="hover"
              content="如您有任何疑问或问题，请联系速达汇客服； 工作时间：周一至周五 9:00-18:00 联系电话：0571-57137790">
              <el-button slot="reference">联系客服</el-button>
            </el-popover>
          </div>
          <div>
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" router>
              <!-- <el-menu-item index="finaindex">充值</el-menu-item> -->
              <el-menu-item index="rechargelist">充值记录</el-menu-item>
              <!-- <el-menu-item index="withdraw">提现</el-menu-item> -->
              <el-menu-item index="withdrawlist">提现记录</el-menu-item>
              <el-menu-item index="balancelist">余额变动记录</el-menu-item>
              <el-menu-item index="finelist">罚款记录</el-menu-item>
              <!-- <el-menu-item index="checklist" v-if="userType==2">交易账单</el-menu-item> -->
            </el-menu>
            <router-view :child-msg="merchartinfo"></router-view>
          </div>
        </div>
      </div>
    </div>
    <foot></foot>
  </div>
</template>


<script>
  import headTop from "../../components/header/head";
  import foot from "../../components/footer/foot";
  import regs from "../../config/regExp";
  import dropDown from "components/header/children/dropdown";
  import { AccountSummary } from "@/api/getData";
  import headMenuRouter from 'components/headMenuRouter/headMenuRouter'; // 头部
  import leftMenuRouterFina from 'components/leftMenuRouter/leftMenuRouterFina'; // 左侧

  export default {
    data() {
      return {
        userCharacter: this.$cookie.get("MemberDutiesID"),
        userType: this.$cookie.get("MemberCrowd"),
        headTop,
        foot,
        regs,
        menberinfo: {},
        merchartinfo: {
          menbername: "",
          canmoney: ""
        },
        MerchantID: this.$cookie.get("MemberMerchantID"),
        MemberID: this.$cookie.get("MemberID")
      };
    },
    components: {
      headTop,
      foot,
      dropDown,
      headMenuRouter,
      leftMenuRouterFina
    },
    computed: {
      activeIndex: function() {
        return this.$route.path.replace("/", "");
      }
    },
    created() {
      if (this.$cookie.get("MemberID")) {
        if (!this.$cookie.get("MemberMerchantID")) {
          this.$message.info("你尚未入驻！");
          this.$confirm("是否去入驻?", "你尚未入驻！", {
            confirmButtonText: "去入驻",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.$router.push("/settled");
          });
        } else {
          this.MemberGet();
        }
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
            this.menberinfo = jsons;
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
    watch: {
      $route(newVal, oldVal) {
        this.MemberGet();
      }
    }
  };
</script>

<style lang="stylus" scoped>
@import '../../assets/styles/template.styl';

.fina-tipbox {
  border: solid 1px #E0E0E0;
  height: 58px;
  margin-left: 4px;
  margin-bottom: 2px;

  .picbox {
    margin: -1px 20px 0 -4px;
    height: 60px;
  }

  .fl {
    line-height: 58px;

    .blue-txt {
      font-size: 16px;
      padding: 0 2px;
    }
  }

  .el-button {
    margin: 11px 10px auto auto;
    padding: 10px 30px;
  }
}

.payicon {
  background: url('../../assets/images/payicon.png') no-repeat;
  display: inline-block;
  width: 30px;
  height: 30px;
  vertical-align: middle;
  margin-right: 10px;
}

.green-text {
  color: #26CB7C;
}

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

.withdraw-check {
  height: 30px;
  line-height: 30px;
  padding: 6px 0;

  dt {
    float: left;
    width: 70px;
  }

  dd {
    float: left;
    padding: 0 20px;
    cursor: pointer;
  }

  dd.active {
    color: $blue;
  }
}

.centetbtn {
  width: 40%;
  display: block;
  margin: 10px auto;
}

.rerecord {
  line-height: 40px;
  font-size: 16px;
  color: #333333;
}
</style>
