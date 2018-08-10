<template>
  <div class="">
    <!--<dl class="withdraw-check">-->
      <!--<dt>财务类型：</dt>-->
      <!--<dd class="active">全部</dd>-->
      <!--<dd>充值</dd>-->
      <!--<dd>提现</dd>-->
      <!--<dd>个体司机支付</dd>-->
      <!--<dd>物流支付</dd>-->
      <!--<dd>退款</dd>-->
      <!--<dd>罚款</dd>-->
    <!--</dl>-->
    <!--<dl class="withdraw-check">-->
    <!--<dt>状态：</dt>-->
    <!--<dd class="active">全部</dd>-->
    <!--<dd>进行中</dd>-->
    <!--<dd>成功</dd>-->
    <!--<dd>失败</dd>-->
    <!--<dd>退款</dd>-->
    <!--</dl>-->
    <div class="mt-6">
      <span class="withdraw-span">发生时间</span>
      <el-date-picker
        v-model="choosetime"
        type="daterange"
        :unlink-panels="false"
        @change="changetime"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button type="primary" plain @click="searchlist">搜索</el-button>
      <!--<el-button type="primary" plain class="fr">导出记录</el-button>-->
    </div>
    <div>
      <el-table
        :data="tableFrozen"
        style="width: 100%">
        <el-table-column label="变动说明" width="350">
          <template slot-scope="props">
            <div>{{props.row.Explain}}{{props.row.Money}}元</div>
          </template>
        </el-table-column>
        <el-table-column
          label="发生时间" width="330">
          <template slot-scope="props">
            <!--<div>{{props.row.Type | typeinfo(props.row.Type)}}</div>-->
            <div class="gray-txt">{{props.row.Happen}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="变动金额(元)">
          <template slot-scope="props">
            <div class="orange-text" v-if="Number(props.row.Money)<0">{{props.row.Money}}</div>
            <div class="orange-text" v-if="Number(props.row.Money)>0 && (props.row.Type == '001' || (userType == 2 && props.row.Type == '003') || props.row.Type == '100')"> +{{props.row.Money}}</div>
            <div class="orange-text" v-if="Number(props.row.Money)>0 && (props.row.Type == '002' || (userType == 1 && props.row.Type == '003') || props.row.Type == '004')"> -{{props.row.Money}}</div>
            <div class="orange-text" v-if="Number(props.row.Money)>0 && (props.row.Type == '1' || props.row.Type == '2')">{{props.row.Money > 0 ? `+${props.row.Money}` : `-${props.row.Money}`}}</div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页 start -->
            <div class="text-center mt-60">
              <el-pagination
                background
                @current-change="handleCurrentChange"
                :page-size="withdrawForm.PageSize"
                :current-page.sync="withdrawForm.PageIndex"
                layout="total, prev, pager, next"
                :total="withdrawForm.TotalRecords">
              </el-pagination>
            </div>
            <!--分页 end -->
    </div>
  </div>
</template>

<script>
import { baseUrl } from "@/api/env";
import { BalanceChanges } from "@/api/getData";
export default {
  data() {
    return {
      hadbank: false,
      banktype: "person",
      bankname: "",
      userType: this.$cookie.get("MemberCrowd"),
      withdrawForm: {
        MerchantID: this.$cookie.get("MemberMerchantID"),
        MemberID: this.$cookie.get("MemberID"),
        FromDate: "1970-01-01",
        ToDate: "",
        Type: "999",
        PageIndex: 1,
        PageSize: 10,
        TotalRecords: 0
      },
      choosetime: "",
      tableFrozen: []
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
    } else {
      this.withdrawForm.ToDate = this.gettimes();
      this.BalanceChanges();
    }
  },
  methods: {
    //分页
    handleCurrentChange(val) {
      this.withdrawForm.PageIndex = val;
      this.BalanceChanges();
    },
    // 获取一页
    async BalanceChanges() {
      if (this.$cookie.get("MemberMerchantID")) {
        const Updates = await BalanceChanges(this.withdrawForm);
        if (Updates.data.ResultCode == "000000") {
          this.tableFrozen = Updates.data.ResultValue;
          this.withdrawForm.TotalRecords = Number(Updates.data.TotalRecords);
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
    },
    searchlist() {
      this.handleCurrentChange(1);
    },
    changetime() {
      console.log(this.choosetime);
      if (this.choosetime) {
        this.withdrawForm.FromDate = this.gettimes(this.choosetime[0]);
        this.withdrawForm.ToDate = this.gettimes(this.choosetime[1]);
      } else {
        this.withdrawForm.FromDate = "1970-01-01";
        this.withdrawForm.ToDate = this.gettimes();
      }
      console.log(this.withdrawForm.FromDate, this.withdrawForm.ToDate);
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
  filters: {
    typeinfo(data) {
      if (data == 1) {
        return "充值";
      } else if (data == -1) {
        return "提现";
      } else {
        return "交易支付";
      }
      // doSomething
    }
  },
  watch: {
    $route(newVal, oldVal) {
      if (newVal.name == "balancelist") {
        this.BalanceChanges();
      }
    }
  }
};
</script>

<style  lang="stylus" scoped>
@import '../../../assets/styles/variable.styl'
.orange-text 
  color: $orange
.green-text 
  color: $green
.withdraw-span 
  padding: 0 10px
.withdraw-check 
  height: 30px
  line-height: 30px
  padding: 6px 0
  dt 
    padding-left: 10px
    float: left
    width: 70px
  dd 
    float: left
    padding: 0 20px
    cursor: pointer
  dd.active 
    color: $blue
</style>
