<template>
    <div>
      <el-form :model="Recharge" ref="Recharge" label-width="110px" class="form food_form">
        <el-form-item label="物流公司">
          <el-select v-model="Recharge.Payee"  @change="getStartTime">
            <el-option
              v-for="(item,index) in menuOptions"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="el-form-item" label="运费发生日期">
          <!-- <el-date-picker
            :disabled="!Recharge.Payee"
            v-model="choosetime"
            type="daterange"
            @change="changetime"
            :unlink-panels="false"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker> -->
          <el-date-picker
            v-model="Recharge.CreateStart"
            type="date"
            :disabled="true"
            placeholder="开始日期">
          </el-date-picker>
          <span><img src="../../../assets/images/gofrom.png" alt=""></span>
          <el-date-picker
            v-model="Recharge.CreateEnd"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            @change="getMoney"
            :disabled="!Recharge.Payee"
            placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="应付金额" prop="name">
          <div class="mini">
            <el-input v-model="Recharge.Should" class="halfinput" :disabled="true"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="实付金额" prop="Actual" :rules="[
                        { required: true, message: '充值金额不能为空'},
                        { pattern: regs.NF2, message: '充值金额必须为数字并且最多保留2位小数'}
                      ]">
          <div class="mini">
            <el-input v-model="Recharge.Actual"  class="halfinput" placeholder="默认为与应还金额保持一致"></el-input>
          </div>
        </el-form-item>
        <el-form-item v-if="isShowReason" label="原因" prop="Reason"  :rules="[
                        { required: true, message: '备注原因不能为空', trigger: 'blur' },
                      ]">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="备注信息例如，今还xxx公司七月份运费800元"
            v-model="Recharge.Reason">
          </el-input>
          <!--<el-checkbox class="radio" v-model="checktn" label="alipay">确认支付所选时段内全部已完成订单</el-checkbox>-->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-if="userCharacter != '0922c79be52f49948b9c1985c487c8af'"  @click="MonthlyPayment('Recharge')" round>确认还款</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
import regs from "@/config/regExp";
import { baseUrl } from "@/api/env";
import { PaidForList, AmountDue, MonthlyPayment, GetCreateStart } from "@/api/getData";
import { setStore, getStore, removeStore } from "config/myUtils";
import QRCode from "qrcode";
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return new Date().setDate(new Date().getDate()-1) < time.getTime();
        }
      },// 限制时间输入
      userCharacter: this.$cookie.get("MemberDutiesID"),
      regs,
      time: undefined,
      baseUrl,
      codes: "",
      Recharge: {
        MemberID: this.$cookie.get("MemberID"),
        Payer: this.$cookie.get("MemberMerchantID"),
        Payee: "",
        CreateStart: "",
        CreateEnd: "",
        Should: "",
        Actual: "",
        Reason: "",
        OrdeCount: '',
      },
      choosetime: "",
      menuOptions: [],
      checktn: false,

      banktype: "person",
      bankname: "",
      MerchantID: this.$cookie.get("MemberMerchantID"),
      RechID: undefined,
      dialogVisible: false,
      selectIndex: [],
      selectbank: [],
      tableFrozen: [],
      changebank: {}
    };
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
        this.PaidForList();
      }
    } else {
      this.$message.info({ message: "你尚未登录，请登录！" });
      this.$router.push("/");
    }
  },
  methods: {
    //付款对象列表
    async PaidForList() {
      let datlist = { MerchantID: this.MerchantID, Type: 0 };
      const res = await PaidForList(datlist);
      if (res.data.ResultCode == "000000") {
        this.menuOptions = [];
        res.data.ResultValue.forEach(item => {
          const tableData = {};
          tableData.label = item.MerchantName;
          tableData.value = item.MerchantID;
          this.menuOptions.push(tableData);
        });
      } else {
        this.$message({
          type: "error",
          message: res.data.ResultMessage
        });
      }
    },
    //付款对象列表
    async AmountDue() {
      let datlist = {
        Payer: this.MerchantID,
        Payee: this.Recharge.Payee,
        CreateStart: this.Recharge.CreateStart,
        CreateEnd: this.Recharge.CreateEnd
      };
      const res = await AmountDue(datlist);
      if (res.data.ResultCode == "000000") {
        this.$message({
          type: "success",
          message: res.data.ResultMessage
        });
        if(res.data.ResultValue != null){
          this.Recharge.Should = res.data.ResultValue.OrdeFreight;
          this.Recharge.Actual = res.data.ResultValue.OrdeFreight;
          this.Recharge.OrdeCount = res.data.ResultValue.OrdeCount;
        } else {
          this.Recharge.Should = '';
          this.Recharge.Actual = '';
          this.Recharge.OrdeCount = '';
        }
        
      } else {
        this.$message({
          type: "error",
          message: res.data.ResultMessage
        });
      }
    },
    // 获取开始时间
    getStartTime(){
      this.Recharge.CreateEnd = ''; // 小星 选择公司清空 触发查询动作
      GetCreateStart({MemberID: this.Recharge.MemberID, MerchantID: this.Recharge.Payee})
      .then(res=>{
        if(res.data.ResultCode == "000000"){
          this.Recharge.CreateStart = res.data.ResultValue
        }
      })
      .catch(err=>{
        console.log(err)
      })
    },
    //
    getMoney(){
      let start = new Date(this.Recharge.CreateStart.replace(/\-/g, "\/"));  
      let end = new Date(this.Recharge.CreateEnd.replace(/\-/g, "\/"));
      if(end > start){
        this.AmountDue()
      } else {
        this.$message.info({message: '结束日期不能小于开始日期！'})
        this.Recharge.Should = '';
        this.Recharge.Actual = '';
      }
    },
    //确认月账单
    MonthlyPayment(Recharge) {
      this.$refs[Recharge].validate(async valid => {
        if (valid) {
          if(this.Recharge.Actual > 0 && this.Recharge.Should > 0 && this.Recharge.CreateStart){
            setStore("payList", JSON.stringify(this.Recharge));
            this.$router.push("/payment");
          } else {
            this.$message.info({message: '请确认付款账单信息正确！'});
          }
          // 接口弃用 
          // const res = await MonthlyPayment(this.Recharge);
          // if (res.data.ResultCode == "000000") {
          //   this.$message({
          //     type: "success",
          //     message: res.data.ResultMessage
          //   });
          //   this.$router.push({
          //     path: "/payment",
          //     query: { payid: res.data.ResultValue }
          //   });
          // } else {
          //   this.$message({
          //     type: "error",
          //     message: res.data.ResultMessage
          //   });
          // }
        }
      });
    },

    changetime() {
      if (this.choosetime) {
        this.Recharge.CreateStart = this.gettimes(this.choosetime[0]);
        this.Recharge.CreateEnd = this.gettimes(this.choosetime[1]);
      } else {
        this.Recharge.CreateStart = "1970-01-01";
        this.Recharge.CreateEnd = this.gettimes();
      }
      this.AmountDue();
    },
    gettimes(times) {
      let date;
      if (times) {
        date = new Date(times);
      } else {
        date = new Date();
      }
      let seperator1 = "-";
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    }
  },
  computed: {
    // 是否显示原因
    isShowReason(){
      if(this.Recharge.Should != this.Recharge.Actual){
        return true
      } else {
        return false
      }
    }
  }
};
</script>

<style scoped>
.mini{
  width: 300px;
  float: left;
}
</style>
