<template>
  <div>
    <head-top class="header">
      <span class="title" slot="index">{{userType == 1?'货主':'物流公司'}}-工作台</span>
      <div class="header-center" slot="menu" v-if="userType == 1">
        <headMenuRouter :userType="userType" activeLink="finaindex"></headMenuRouter>
      </div>
      <drop-down slot="info"></drop-down>
    </head-top>
    <div class="content clear">
      <div class="content-left">
        <leftMenuRouter :userType="userType" activeLink="pay"></leftMenuRouter>
      </div>
      <div class="content-right">
        <div class="title-box"><span class="title-name">支付运费</span></div>
        <div class="container clear">
          <div class="yugoldbox">
            <div class="payment-title">付款信息</div>
            <div class="payment-info">
              <dl class="fl clear" v-show="paytype==2">
                <dt>{{tableFrozen.PayeeName}}</dt>
                <dd class="clear mt-10">
                  <span class="gray-txt fl">付款详情：</span>
                  <p class="fl">支付“{{tableFrozen.CreateEnd}} — {{tableFrozen.CreateStart}}”已完成的货源运单，共计{{tableFrozen.OrdeCount?tableFrozen.OrdeCount:1}}单，应付{{tableFrozen.Should}}元，实付{{tableFrozen.Actual}}元；</p>
                </dd>
                <dd class="clear mt-10">
                  <span class="gray-txt fl">付款备注：</span>
                  <p class="fl">{{tableFrozen.Reason}}</p>
                </dd>
              </dl>
              <!--下面的是个体司机的支付页面-->
              <dl class="fl payment-dlhalf" v-show="paytype==1">
                <dt>{{tableFrozen.FromAddress}}<img src="../../assets/images/gofrom.png" height="20" width="20"/>{{tableFrozen.ToAddress}}</dt>
                <dd>
                  <span class="gray-txt fl">货源编号：</span>
                  <p class="fl">{{tableFrozen.Code}}</p>
                </dd>
                <dd>
                  <span class="gray-txt fl">货物信息：</span>
                  <p class="fl">{{tableFrozen.CargoName}}&nbsp;&nbsp;&nbsp;{{tableFrozen.Volume}}m³&nbsp;/&nbsp;{{tableFrozen.Weight}}&nbsp;吨  {{tableFrozen.ClassifyName}}</p>
                </dd>
                <dd>
                  <span class="gray-txt fl">装货时间：</span>
                  <p class="fl">{{tableFrozen.LoadTime}}</p>
                </dd>
                <dd>
                  <span class="gray-txt fl">抢单货运：</span>
                  <p class="fl">{{tableFrozen.CarrierMerchant}}</p>
                </dd>
              </dl>
              <div class="orange-text fr">
                ￥{{tableFrozen.Actual}}
              </div>
            </div>
          </div>
          <div class="payway">
            <ul>
              <li>
                <el-radio class="radio" v-model="bankname" label="person"><em class="payicon payicon1"></em>账号余额（{{Usable}}）元
                    <span class="pos-right" v-show="bankname=='person'">支付<em class="orange-text">{{tableFrozen.Actual}}</em>元</span>
                </el-radio>
              </li>
              <li>
                <el-radio class="radio" v-model="bankname" label="alipay"><em class="payicon payicon2"></em>支付宝
                  <span class="pos-right" v-show="bankname=='alipay'">支付<em class="orange-text">{{tableFrozen.Actual}}</em>元</span>
                </el-radio>
              </li>
              <li>
                <el-radio class="radio" v-model="bankname" label="wechat"><em class="payicon payicon3"></em>微信支付
                  <span class="pos-right" v-show="bankname=='wechat'">支付<em class="orange-text">{{tableFrozen.Actual}}</em>元</span>
                </el-radio>
              </li>
            </ul>
          </div>
          <div class="payformbox">
            <strong  v-show="bankname=='person'">支付密码</strong>
            <div class="payform"  v-show="bankname=='person'">
              <el-input type="password" v-model="password" placeholder="请输入支付密码"></el-input>
              <router-link class="blue-txt" to="/account">忘记支付密码?</router-link>
            </div>
            <el-button type="primary" round @click="paybtn">立即支付</el-button>
          </div>
        </div>
      </div>
      <!--<el-dialog title="编辑银行卡" :visible.sync="dialogVisible" width="40%">-->
        <!--<el-form :model="changebank"  label-width="90px">-->
          <!--<el-form-item label="开 户 名" prop="name">-->
            <!--仅限公司账号已认证的公司名称-->
          <!--</el-form-item>-->
          <!--<el-form-item label="银行名称">-->
            <!--<el-select v-model="selectbank" :placeholder="selectbank.label">-->
              <!--<el-option-->
                <!--v-for="item in selectbank"-->
                <!--:key="item.value"-->
                <!--:label="item.label"-->
                <!--:value="item.index">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="银行账户" prop="name">-->
            <!--<el-input v-model="changebank.bankcard" ></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="开户支行" prop="name">-->
            <!--<el-input v-model="changebank.bankplace" ></el-input>-->
          <!--</el-form-item>-->
        <!--</el-form>-->
        <!--<div class="dialog-footer">-->
          <!--<el-button type="primary" class="centetbtn" round>确 定</el-button>-->
        <!--</div>-->
      <!--</el-dialog>-->
    </div>
    <div class="qrcodebox" v-show="wechartpicVisible">
      <strong>微信支付<em @click="timeoutClose">×</em></strong>
      <div class="wechartpicbox">
        <div id='code'></div>
        <canvas id="canvas" width="200"></canvas>
      </div>
  </div>
    <foot></foot>
  </div>
</template>


<script>
import headTop from "../../components/header/head";
import foot from "../../components/footer/foot";
import dropDown from "components/header/children/dropdown";
import md5 from "js-md5";
import { setStore, getStore, removeStore } from "config/myUtils";
import headMenuRouter from './headmenurouter.vue';
import leftMenuRouter from './leftmenurouter.vue';
import QRCode from "qrcode";
// var QRCode = require('qrcode')
import {
  GetPayInfo,
  DeadheadPayRequest,
  AliPayRequest,
  GetMonthlyPayInfo,
  Monthlyalipay,
  MonthlyPayRequest,
  WebWxPayPayment,
  WxPayPaymentSync,
  WxPayMonthSync,
  WebWxPayMonthPayment,
  AccountSummary
} from "@/api/getData";
// Vue.use(QRCode)
export default {
  data() {
    return {
      userType: this.$cookie.get("MemberCrowd"),
      headTop,
      foot,
      paytype: 1,
      password: "",
      Passmds: "",
      tableFrozen: {},
      foodSpecs: "alipay",
      bankname: "person",
      Usable: 0,
      OrderID: this.$route.query.orderid,
      payinfo: {
        MemberID: this.$cookie.get("MemberID"),
        OrderID: this.$route.query.orderid
      },
      monthpay: {
        MemberID: this.$cookie.get("MemberID"),
        PaymID: this.$route.query.payid
      },
      paylistinfo: {},
      MerchantID: this.$cookie.get("MemberMerchantID"),
      wechartpicVisible: false
    };
  },
  components: {
    headTop,
    foot,
    dropDown,
    headMenuRouter,
    leftMenuRouter
  },
  created() {
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
      this.AccountSummary();
      this.GetPayInfo();
    }
  },
  methods: {
    // 获取账户余额
    async AccountSummary() {
      AccountSummary({
        MemberID: this.payinfo.MemberID,
        MerchantID: this.MerchantID
      }).then(res => {
        if (res.data.ResultCode == "000000") {
          this.Usable = res.data.ResultValue.Usable;
        }
      });
    },
    //获取运单信息
    async GetPayInfo() {
      let PayInfo;
      if (this.payinfo.OrderID) {
        PayInfo = await GetPayInfo(this.payinfo);
        if (PayInfo && PayInfo.data.ResultCode == "000000") {
          this.$message({
            type: "success",
            message: PayInfo.data.ResultMessage
          });
          if (
            (PayInfo && PayInfo.data.ResultValue == "") ||
            !PayInfo.data.ResultValue
          ) {
            this.$message({
              type: "error",
              message: "抱歉，您的页面信息有误"
            });
          }
          this.tableFrozen = PayInfo.data.ResultValue;
          this.tableFrozen.Actual = PayInfo.data.ResultValue.Freight;
        }
      } else {
        this.paytype = 2;
        this.tableFrozen = JSON.parse(getStore("payList"));
      }
      // } else if (this.monthpay.PaymID) {
      //   this.paytype = 2;
      //   console.log(this.paytype);
      //   PayInfo = await GetMonthlyPayInfo(this.monthpay);
      // }
      // if (PayInfo && PayInfo.data.ResultCode == "000000") {
      //   this.$message({
      //     type: "success",
      //     message: PayInfo.data.ResultMessage
      //   });
      //   if (PayInfo && PayInfo.data.ResultValue == "" || !PayInfo.data.ResultValue) {
      //     this.$message({
      //       type: "error",
      //       message: "抱歉，您的页面信息有误"
      //     });
      //   }
      //   this.tableFrozen = PayInfo.data.ResultValue;
      //   if (this.paytype == 2) {
      //     this.tableFrozen.Freight = this.tableFrozen.Actual;
      //   }
      //   console.log(this.tableFrozen);
      // } else {
      //   this.$message({
      //     type: "error",
      //     message: PayInfo.data.ResultMessage
      //   });
      //   return false;
      // }
    },
    //设置支付方式
    paybtn() {
      if (this.bankname == "person") {
        this.DeadheadPayRequest();
      } else if (this.bankname == "alipay") {
        this.alipay();
      } else {
        this.WebWxPayPayment();
      }
    },
    //支付宝支付
    async alipay() {
      let datlist;
      let res;
      if (this.paytype == 1) {
        datlist = {
          MerchantID: this.MerchantID,
          MemberID: this.payinfo.MemberID,
          totalAmout: this.tableFrozen.Actual,
          tradeno: this.payinfo.OrderID
        };
        res = await AliPayRequest(datlist);
      } else if (this.paytype == 2) {
         datlist = {
          MemberID: this.payinfo.MemberID,
          TotalAmout: this.tableFrozen.Actual,
          PayPWD: this.Passmds,
          Payer: this.tableFrozen.Payer,
          CreateStart: this.tableFrozen.CreateStart,
          Payee: this.tableFrozen.Payee,
          CreateEnd: this.tableFrozen.CreateEnd,
          Should: this.tableFrozen.Should,
          Actual: this.tableFrozen.Actual,
          Reason: this.tableFrozen.Reason
        };
        res = await Monthlyalipay(datlist);
      }
      if (res.data.ResultCode == "000000") {
        if(this.bankname != 'alipay'){
          removeStore("payList");
        }
        this.$message({
          type: "success",
          message: res.data.ResultMessage
        });
        window.location.href = res.data.ResultValue;
      } else {
        this.$message({
          type: "error",
          message: res.data.ResultMessage
        });
      }
    },
    //余额支付
    async DeadheadPayRequest() {
      if (!this.password) {
        this.$message({
          type: "error",
          message: "请先输入密码"
        });
        return;
      }
      let datlist;
      let res;
      this.Passmds = md5(this.password);
      if (this.paytype == 1) {
        datlist = {
          MemberID: this.payinfo.MemberID,
          Money: this.tableFrozen.Actual,
          OrderID: this.payinfo.OrderID,
          PayPWD: this.Passmds
        };
        res = await DeadheadPayRequest(datlist);
      } else if (this.paytype == 2) {
        datlist = {
          MemberID: this.payinfo.MemberID,
          TotalAmout: this.tableFrozen.Actual,
          PayPWD: this.Passmds,
          Payer: this.tableFrozen.Payer,
          CreateStart: this.tableFrozen.CreateStart,
          Payee: this.tableFrozen.Payee,
          CreateEnd: this.tableFrozen.CreateEnd,
          Should: this.tableFrozen.Should,
          Actual: this.tableFrozen.Actual,
          Reason: this.tableFrozen.Reason
        };
        res = await MonthlyPayRequest(datlist);
      }
      if (res.data.ResultCode == "000000") {
        removeStore("payList");
        let msg = "";
        if (this.paytype == 1) {
          msg = "支付成功！密钥为" + res.data.ResultValue;
        } else {
          msg = res.data.ResultMessage;
        }
        this.$message({
          type: "success",
          message: msg
        });
        if(this.paytype == 1){
          if(this.userType == 1){
            this.$router.push("/sourceDetails/" + this.payinfo.OrderID );
          } else {
            this.$router.push("/orderDetails/" + this.payinfo.OrderID );
          }
        } else {
          this.$router.go(-1);
        }
        // window.history.go(-1);
      } else {
        this.$message({
          type: "error",
          message: res.data.ResultMessage
        });
      }
    },
    timeoutClose() {
      clearTimeout(this.time);
      this.wechartpicVisible = false;
    },
    //微信支付
    async WebWxPayPayment() {
      let datlist;
      let res;
      if (this.paytype == 1) {
        datlist = {
          MerchantID: this.MerchantID,
          MemberID: this.payinfo.MemberID,
          Amount: this.tableFrozen.Actual,
          OrderID: this.payinfo.OrderID
        };
        res = await WebWxPayPayment(datlist);
      } else if (this.paytype == 2) {
        datlist = {
          MemberID: this.payinfo.MemberID,
          Payer: this.tableFrozen.Payer,
          Payee: this.tableFrozen.Payee,
          CreateStart: this.tableFrozen.CreateStart,
          CreateEnd: this.tableFrozen.CreateEnd,
          Should: this.tableFrozen.Should,
          Actual: this.tableFrozen.Actual,
          Reason: this.tableFrozen.Reason
        };
        res = await WebWxPayMonthPayment(datlist);
      }
      if (res.data.ResultCode == "000000") {
        this.wechartpicVisible = true;
        this.wechartpic = decodeURIComponent(res.data.ResultValue.CodeUrl);
        this.useqrcode(this.wechartpic);
        this.monthpay.PaymID = res.data.ResultValue.PaymID;
        this.WxPayPaymentSync();
      } else {
        this.$message({
          type: "error",
          message: res.data.ResultMessage
        });
      }
    },
    useqrcode(data) {
      let canvas = document.getElementById("canvas");
      QRCode.toCanvas(canvas, data, function(error) {
        if (error) console.error(error);
      });
    },
    qrcode() {
      let qrcode = new QRCode("qrcode", {
        width: 100,
        height: 100, // 高度
        text: "54456" // 二维码内容
        // render: 'canvas', // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
        // background: '#f0f',
        // foreground: '#ff0',
      });
    },

    //核对微信支付
    async WxPayPaymentSync() {
      let datlist;
      let res;
      if (this.paytype == 1) {
        datlist = {
          MerchantID: this.MerchantID,
          MemberID: this.payinfo.MemberID,
          OrderID: this.payinfo.OrderID
        };
        res = await WxPayPaymentSync(datlist);
      } else if (this.paytype == 2) {
        datlist = {
          MerchantID: this.MerchantID,
          MemberID: this.payinfo.MemberID,
          PaymID: this.monthpay.PaymID
        };
        res = await WxPayMonthSync(datlist);
      }
      if (res.data.ResultCode == "000000") {
        if (res.data.ResultValue) {
          removeStore("payList");
          this.wechartpicVisible = false;
          let msg = "";
          if (this.paytype == 1) {
            msg = "支付成功！密钥为" + res.data.ResultValue;
          } else {
            msg = res.data.ResultMessage;
          }
          this.$message({
            type: "success",
            message: msg
          });
          // window.history.go(-1);
          if(this.paytype == 1){
            this.$router.push("/sourceDetails/" + this.payinfo.OrderID );
          } else {
            this.$router.go(-1);
          }
        } else {
          this.time = setTimeout(this.WxPayPaymentSync, 5000);
        }
      } else {
        this.$message({
          type: "error",
          message: res.data.ResultMessage
        });
      }
    }
    // searchlist(){
    //   console.log(this.choosetime)
    //   //this.choosetime[0].getFullYear();
    //   console.log(this.choosetime[0].getFullYear())
    // },
    // gettimes(data){
    //   let date = new Date();
    //   let seperator1 = "-";
    //   let year = date.getFullYear();
    //   let month = date.getMonth() + 1;
    //   let strDate = date.getDate();
    //   if (month >= 1 && month <= 9) {
    //     month = "0" + month;
    //   }
    //   if (strDate >= 0 && strDate <= 9) {
    //     strDate = "0" + strDate;
    //   }
    //   let currentdate = year + seperator1 + month + seperator1 + strDate;
    //   return currentdate;
    // }
  },
  computed: {
    changeBubble() {}
  }
};
</script>

<style lang="stylus" scoped>
@import '../../assets/styles/variable.styl';

.payicon {
  background: url('../../assets/images/payicon.png') no-repeat;
  display: inline-block;
  width: 30px;
  height: 30px;
  vertical-align: middle;
  margin-right: 10px;
}

.payicon1 {
  background-position: 0 0px;
}

.payicon2 {
  background-position: -30px 0;
}

.payicon3 {
  background-position: -60px 0;
}

.payicon4 {
  background-position: -90px 0;
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
      height: 24px;
      line-height: 24px;
      padding-left: 40px;
      margin: 8px 0;
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
  padding: 40px;
}

.yugoldbox {
  margin-bottom: 20px;
  border: 1px solid #E0E0E0;
}

.payment-title {
  background: #FAFAFA;
  border-bottom: 1px solid #E0E0E0;
  line-height: 40px;
  height: 40px;
  padding-left: 20px;
}

.payment-info {
  padding: 10px 20px;
  overflow: hidden;

  dl {
    width: 700px;

    dt {
      display: block;
      font-size: 16px;
      color: #333333;
      line-height: 34px;
      margin-bottom: 6px;
    }

    dd {
      display: block;
      line-height: 30px;
    }
  }

  dl.payment-dlhalf {
    width: 600px;
    height: 100px;

    dt {
      display: block;
      font-size: 16px;
      color: #333333;
      line-height: 34px;
      margin-bottom: 6px;

      img {
        vertical-align: middle;
        margin: 0 5px;
      }
    }

    dd {
      width: 300px;
      float: left;

      p {
        width: 230px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .orange-text {
    line-height: 100px;
    font-size: 24px;
  }
}

.payway {
  li {
    width: 100%;

    .el-radio {
      width: 888px;
      padding: 0 10px;
      border: 1px solid transparent;
      border-bottom: 1px dashed #E0E0E0;
      height: 60px;
      display: block;
      line-height: 60px;

      span {
        font-size: 18px;
      }
    }

    label.is-checked {
      border: 1px solid #027CFF;

      .el-radio__label .fr {
        color: #333;
      }
    }

    .orange-text {
      font-size: 20px;
    }
  }
}

.payformbox {
  padding-bottom: 60px;
  padding-top: 20px;

  strong {
    line-height: 40px;
    height: 40px;
  }

  .payform {
    width: 100%;
    margin-bottom: 50px;

    .el-input {
      width: 300px;
      display: inline-block;
      margin-right: 6px;
    }
  }

  .el-button {
    width: 200px;
  }
}

.qrcodebox {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 300px;
  margin: -150px auto auto -150px;
  background: #ffffff;
  box-shadow: 0 0 6px 0 #999;

  strong {
    line-height: 40px;
    height: 40px;
    display: block;
    border-left: 3px solid #20a0ff;
    font-size: 16px;
    padding-left: 10px;
    color: #6c6c6c;

    em {
      float: right;
      width: 40px;
      height: 40px;
      line-height: 37px;
      text-align: center;
      cursor: pointer;
      font-size: 28px;
      transition: all 0.4s;
    }

    em:hover {
      color: #20a0ff;
      transform: rotate(180deg);
    }
  }
}

.pos-right {
  position: absolute;
  right: 10px;
  top: 0;
}

.wechartpicbox {
  width: 250px;
  height: 250px;
  margin: 0 auto;

  #canvas {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
