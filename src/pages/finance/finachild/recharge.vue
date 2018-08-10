<template>
<div>
  <el-form :model="Recharge" ref="Recharge" label-width="110px" class="form food_form">
    <el-form-item label="充值金额" prop="money" style="position: static;"
                  :rules="[
                        { required: true, message: '充值金额不能为空'},
                        { pattern: regs.NF2, message: '充值金额必须为数字并且最多保留2位小数'}
                      ]">
      <el-input v-model="Recharge.money" class="halfinput">
      </el-input>
    </el-form-item>
    <el-form-item label="充值方式">
      <el-radio class="radio" v-model="Recharge.foodSpecs" label="alipay"><em class="finaicon"></em>支付宝</el-radio>
      <el-radio class="radio" v-model="Recharge.foodSpecs" label="wechat"><em class="finaicon"></em>微信支付</el-radio>
      <el-radio class="radio" v-model="Recharge.foodSpecs" label="zhongjin"><em class="finaicon"></em>中金</el-radio>
      <!--<el-radio class="radio" v-model="Recharge.foodSpecs" label="bank"><em class="finaicon"></em>网银支付</el-radio>-->
    </el-form-item>
    <el-form-item label="网银类型" v-if="Recharge.foodSpecs == 'bank'">
      <el-radio class="radio" v-model="banktype" label="person">个人</el-radio>
      <el-radio class="radio" v-model="banktype" label="company">企业</el-radio>
    </el-form-item>
    <el-form-item label="选择银行" v-if="Recharge.foodSpecs == 'bank'">
      <el-radio class="radio" v-model="bankname" label="person"><em class="finaicon"></em>中国银行</el-radio>
      <el-radio class="radio" v-model="bankname" label="company"><em class="finaicon"></em>中国农业银行</el-radio>
    </el-form-item>
    <el-form-item>
      <el-button v-if="userCharacter != '0922c79be52f49948b9c1985c487c8af'" type="primary" @click="RechargeRequest('Recharge')" round>确认充值</el-button>
    </el-form-item>
  </el-form>

  <el-dialog title="编辑银行卡" :visible.sync="dialogVisible" width="40%">
    <el-form :model="changebank"  label-width="90px">
      <el-form-item label="开 户 名" prop="name">
        仅限公司账号已认证的公司名称
      </el-form-item>
      <el-form-item label="银行名称">
        <el-select v-model="selectbank" :placeholder="selectbank.label" @change="handleSelect">
          <el-option
            v-for="item in selectbank"
            :key="item.value"
            :label="item.label"
            :value="item.index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="银行账户" prop="name">
        <el-input v-model="changebank.bankcard" ></el-input>
      </el-form-item>
      <el-form-item label="开户支行" prop="name">
        <el-input v-model="changebank.bankplace" ></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button type="primary" class="centetbtn" round>确 定</el-button>
    </div>
  </el-dialog>
  <div class="qrcodebox" v-show="wechartpicVisible">
    <strong>微信支付<em @click="timeoutClose">×</em></strong>
    <div class="wechartpicbox">
      <div id='code'></div>
      <canvas id="canvas" width="200"></canvas>
    </div>
  </div>
  <!-- 中金必须要表单提交 start -->
  <div class="zhongjin-box" v-show="false">
    <form name="zhongjinForm" id="zhongjinForm" method="post">
      <input type="text" id="message" name="message">
      <input type="text" id="signature" name="signature">
    </form>
  </div>
  <!-- 中金必须要表单提交 end -->
</div>
</template>

<script>
import regs from "@/config/regExp";
import { baseUrl } from "@/api/env";
import {
  RechargeRequest,
  WebWxPayRecharge,
  WxPayRechargeSync,
  CpcnRecharge
} from "@/api/getData";
import QRCode from "qrcode";
import Vue from "vue";
import axios from 'axios';

//Vue.use(QRCode)
export default {
  data() {
    return {
      userCharacter: this.$cookie.get("MemberDutiesID"),
      regs,
      time: undefined,
      baseUrl,
      codes: "",
      Recharge: {
        money: undefined,
        foodSpecs: "alipay"
      },
      banktype: "person",
      bankname: "",
      MerchantID: this.$cookie.get("MemberMerchantID"),
      MemberID: this.$cookie.get("MemberID"),
      RechID: undefined,
      dialogVisible: false,
      wechartpic: "",
      wechartpicVisible: false,
      selectIndex: [],
      selectbank: [],
      tableFrozen: [],
      changebank: {},
      zhongjinAction: '',
      zhongjinMessage: '',
      zhongjinSignature: ''
    };
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
    }
  },
  methods: {
    handleSelect(index) {},
    RechargeRequest(enterData) {
      this.$refs[enterData].validate(async valid => {
        if (valid) {
          switch (this.Recharge.foodSpecs) {
            case 'alipay':
            this.alipay()
            break
            case 'wechat':
            this.wetchartpay()
            break
            case 'zhongjin':
            this.zhongjinPay()
            break
          }
        }
      });
    },
    async zhongjinPay () { // 中金支付
      let datlist = {
        Amount: this.Recharge.money,
        MerchantID: this.MerchantID
      }
      const res = await CpcnRecharge(datlist)
      if (res.data.ResultCode === '000000') {
        let json = res.data.ResultValue
        let zhongjinForm = document.getElementById('zhongjinForm')
        document.getElementById('message').value = json.Message
        document.getElementById('signature').value = json.Signature
        zhongjinForm.setAttribute('action', json.Action)
        zhongjinForm.submit() // 表单提交
      }
    },
    //支付宝充值（编辑操作用到）
    async alipay() {
      let datlist = {
        MerchantID: this.MerchantID,
        MemberID: this.MemberID,
        TotalAmout: this.Recharge.money
      };
      const StaffModels = await RechargeRequest(datlist);
      if (StaffModels.data.ResultCode == "000000") {
        window.location.href = StaffModels.data.ResultValue;
      }
    },
    async wetchartpay() {
      let datlist = {
        MerchantID: this.MerchantID,
        MemberID: this.MemberID,
        Amount: this.Recharge.money
      };
      const StaffModels = await WebWxPayRecharge(datlist);
      if (StaffModels.data.ResultCode == "000000") {
        this.wechartpicVisible = true;
        this.wechartpic = decodeURIComponent(
          StaffModels.data.ResultValue.CodeUrl
        );
        this.useqrcode(this.wechartpic);
        this.RechID = StaffModels.data.ResultValue.RechID;
        this.WxPaySync();
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
      console.log(qrcode);
    },
    async WxPaySync() {
      let datlist = {
        MerchantID: this.MerchantID,
        MemberID: this.MemberID,
        RechID: this.RechID
      };
      const StaffModels = await WxPayRechargeSync(datlist);
      if (StaffModels.data.ResultCode == "000000") {
        if (StaffModels.data.ResultValue) {
          this.$message({
            type: "success",
            message: "充值成功"
          });
          this.wechartpicVisible = false;
          this.$router.push("/rechargelist?payType=2");
        } else {
          this.time = setTimeout(this.WxPaySync, 5000);
        }
      }
    },
    timeoutClose() {
      clearTimeout(this.time);
      this.wechartpicVisible = false;
    }
  }
};
</script>
<style lang="stylus" scoped>
.halfinput 
  width: 300px
.qrcodebox 
  position: fixed
  left: 50%
  top: 50%
  width: 300px
  height: 300px
  margin: -150px auto auto -150px
  background: #ffffff
  box-shadow: 0 0 6px 0 #999
  strong 
    line-height: 40px
    height: 40px
    display: block
    border-left: 3px solid #20a0ff
    font-size: 16px
    padding-left: 10px
    color: #6c6c6c
    em 
      float: right
      width: 40px
      height: 40px
      line-height: 37px
      text-align: center
      cursor: pointer
      font-size: 28px
      transition: all 0.4s
    em:hover 
      color: #20a0ff
      transform: rotate(180deg)
.wechartpicbox 
  width: 250px
  height: 250px
  margin: 0 auto
  #canvas 
    width: 100% !important
    height: 100% !important
</style>
<style lang="stylus">
  .food_form .el-form-item.is-required .el-form-item__label:before
    position: inherit
    left: 0
</style>
