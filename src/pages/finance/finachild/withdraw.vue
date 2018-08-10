<template>
<div>
  <el-form :model="withdrawForm" ref="withdrawForm" label-width="110px" class="form food_form">
    <el-form-item label="可提现金额">{{childMsg.canmoney}} 元</el-form-item>
    <el-form-item class="withdraw-spec-error" label="提现金额" prop="Money" :rules="[
                        { required: true, message: '提现金额不能为空'},
                        { pattern: regs.NF2, message: '提现金额必须为大于0的数字并且最多保留2位小数'},
                        { pattern: regs.Number2, message: '提现金额必须为大于0的数字并且最多保留2位小数'}
                      ]">
      <div>
        <el-input v-model="withdrawForm.Money" class="halfinput"></el-input>
        <a href="javascript:;" class="ml-20" @click="withdrawAll()">全部提现</a>
        <!--<input type="text"  v-model="withdrawForm.money" class="el-input__inner halfinput">-->
        <!-- <span class="withdraw-text gray-txt">
                        <em class="blue-txt">建议提现{{childMsg.canmoney}}元</em>
                        保留500元，下次可以立即发货
                      </span> -->
      </div>
       <span>金额大写：{{Uppercase()}}</span>
      <!--<span>金额大写：{{Uppercase}}</span>-->
    </el-form-item>
    <el-form-item label="提 现 到">
      <el-select v-model="selectbank" placeholder="请选择" style="width:300px;" @change="bankChange">
        <el-option label="请选择" value=""></el-option>
        <el-option
          v-for="item in bankList"
          :key="item.CardID"
          :label="item.Bank + ' (' +item.Code.substr(-4) +') ' + item.Name"
          :value="item.CardID">
        </el-option>
        <el-option label="添加银行卡" value="add" class="addBank" v-if="!getUserRole(userCharacter,'发货')"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="支付密码" prop="password">
      <el-input v-model="password" type="password" class="halfinput"></el-input>
      <router-link to="/account" class="ml-20" v-if="getUserRole(userCharacter,'管理')">忘记支付密码</router-link>
    </el-form-item>
    <el-form-item>
      <el-button v-if="!getUserRole(userCharacter,'发货')" type="primary" @click="WithdrawApply('withdrawForm')" round>确认提现</el-button>
    </el-form-item>
  </el-form>
  <bankCardDialog :dialog="dialog" :bankInfo="bankInfo" v-on:callback="callback"></bankCardDialog>
</div>
</template>

<script>
import regs from "@/config/regExp";
import {
  GetWithdrawPage,
  WithdrawApply,
  WithdrawGet,
  WithdrawCancel,
  getBankcardList,
} from "@/api/getData";
import md5 from "js-md5";
import bankCardDialog from '../bankcard/bankCardDialog.vue'
import { getUserRole } from 'config/myUtils';
export default {
  data() {
    return {
      userCharacter: this.$cookie.get("MemberDutiesID"),
      regs,
      bankList: [],
      selectbank: '',
      password: "",
      withdrawForm: {
        Money: "0",
        MerchantID: this.$cookie.get("MemberMerchantID"),
        MemberID: this.$cookie.get("MemberID"),
        PayPWD: "",
        CardID: '',
      },
      changebank: {},
      dialog:{
        title: '添加银行卡',
        visible: false,
        buttonText: '立即添加',
        type: 'add'
      },
      bankInfo: {
        CardID: '',
        Bank: '',//银行名称
        Specific: '',//开户行(支行)名称
        Name: '', //开户名
        Code: '', //银行账号
      }
    };
  },
  props: {
    childMsg: {
      required: true
    }
  },
  created() {
    this.withdrawForm.Name = this.childMsg.menbername; // 进入赋值开户名
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
  watch: {
    childMsg: {//深度监听，可监听到对象、数组的变化 监听获取到自带开户名
      handler() {
        this.withdrawForm.Name = this.childMsg.menbername;
      },
      deep: true
    }
  },
  methods: {
    getUserRole: getUserRole,
    // 提现
    WithdrawApply(formName) {
      if (!this.$cookie.get("MemberMerchantID")) {
        this.$message.info("你尚未入驻！");
        this.$confirm("是否去入驻?", "你尚未入驻！", {
          confirmButtonText: "去入驻",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$router.push("/settled");
        });
        return;
      }
      if(this.withdrawForm.Money > this.childMsg.canmoney){
        this.$message({
          type: "error",
          message: "提现金额不能大于余额"
        });
        return;
      }


      this.$refs[formName].validate(async valid => {
        if (!valid) return;
        if( this.withdrawForm.CardID === '' || this.withdrawForm.CardID === 'add'){
          this.$message({
            type: "error",
            message: "请选择银行卡或添加银行卡"
          });
            return;
        }
        if (!this.password) {
          this.$message({
            type: "error",
            message: "请输入支付密码"
          });
          return;
        }
        this.withdrawForm.PayPWD = md5(this.password);
        const Updates = await WithdrawApply(this.withdrawForm);
        if (Updates.data.ResultCode == "000000") {
          if (Updates.data.ResultValue) {
            this.$message({
              type: "success",
              message: Updates.data.ResultMessage
            });
            this.$router.push("/withdrawlist");
          } else {
            this.$message({
              type: "error",
              message: "您还没有设置支付密码，请先设置支付密码"
            });
            this.$router.push("/account");
          }
        } else {
          this.$message({
            type: "error",
            message: Updates.data.ResultMessage
          });
          return false;
        }

      });
    },
    withdrawAll(){
      this.withdrawForm.Money = this.childMsg.canmoney;
    },
    bankChange(val){
      if(val === '') return;
      if(val === 'add'){
          this.dialog.visible = true;
      }
      this.withdrawForm.CardID = val;
    },
    //添加银行回调
    //param  boolean
    callback(status){
      if(status) this.getBankList();
      else this.selectbank = '';//添加银行卡窗口关闭后传回一个false
    },
    Uppercase() {
      let n = this.withdrawForm.Money;
      if (n == 0 || n === '' || !n || n < 0) {
        return "零元整";
      } else if (n > 100000000000) {
        this.$message.info({message: "最多提现壹千亿元整"});
        this.withdrawForm.Money = 1;
        return "壹元整";
      } else {
        if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return "";
        var unit = "千百拾亿千百拾万千百拾元角分",
          str = "";
        n += "00";
        var p = n.indexOf(".");
        if (p >= 0) n = n.substring(0, p) + n.substr(p + 1, 2);
        unit = unit.substr(unit.length - n.length);
        for (var i = 0; i < n.length; i++)
          str += "零壹贰叁肆伍陆柒捌玖".charAt(n.charAt(i)) + unit.charAt(i);
        return str
          .replace(/零(千|百|拾|角)/g, "零")
          .replace(/(零)+/g, "零")
          .replace(/零(万|亿|元)/g, "$1")
          .replace(/(亿)万|壹(拾)/g, "$1$2")
          .replace(/^元零?|零分/g, "")
          .replace(/元$/g, "元整");
      }
    },
    async getBankList(){
      let params = {MemberID: this.$cookie.get("MemberID"), PageIndex: 1, PageSize: 10, TotalRecords: 0};
      const list = await getBankcardList(params);
      if(list.data.ResultCode !== '000000'){
        this.$message({
          type: 'error',
          message: list.data.ResultMessage
        });
        return;
      }
      this.bankList = list.data.ResultValue;
    }
  },
  mounted(){
    this.getBankList();
  },
  components:{bankCardDialog},
};
</script>

<style  lang="stylus" scoped>
.halfinput
  width: 300px
.addBank
  background: #F7FBFB
.withdraw-text 
  padding: 0 16px
  em.blue-txt
    padding-right: 16px
</style>
