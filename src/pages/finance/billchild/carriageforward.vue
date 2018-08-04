<template>
  <div class="carriage-forward">
    <div class="mt-6">
      <span class="mr-10">发生时间</span>
      <el-date-picker
        v-model="choosetime"
        type="daterange"
        @change="changetime"
        :unlink-panels="false"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-select v-model="withdrawForm.PaymentID" placeholder="请选择物流公司名称" class="ml-10 mr-10">
        <el-option
          v-for="(item,index) in menuOptions"
          :key="item.index"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" plain @click="handleCurrentChange(1)">搜索</el-button>
    </div>
    <div>
      <el-table
        :data="tableFrozen"
        style="width: 100%">
        <el-table-column label="交易说明 | 发生时间" width="230">
          <template slot-scope="scope">
            <div>货源编号：
              <router-link :to="'/sourceDetails/'+scope.row.OrdeID"><em class="blue-txt">{{scope.row.OrdeCode}}</em></router-link>
            </div>
             <div class="gray-txt">{{scope.row.OrdeArrived}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="OrdeCarrier"
          label="交易对象" width="180">
        </el-table-column>
        <el-table-column
          label="交易金额(元)"
          width="180"
          prop="OrdeFreight">
        </el-table-column>
        <el-table-column
          label="收款方信息"
          >
          <template slot-scope="scope">
             <div class="gray-txt">{{scope.row.OrdeReceiver.length > 14 ? scope.row.OrdeReceiver.slice(0, 14) + '...' : scope.row.OrdeReceiver }}&nbsp;{{scope.row.OrdeReceivePhone}}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
</template>

<script>
import { baseUrl } from "@/api/env";
import { GetSettlementTypePage, PaidForList } from "@/api/getData";
export default {
  data() {
    return {
      count: "",
      withdrawForm: {
        MerchantID: this.$cookie.get("MemberMerchantID"),
        MemberID: this.$cookie.get("MemberID"),
        PaymentID: '',
        FromDate: "1970-01-01",
        ToDate: "",
        PageIndex: 1,
        PageSize: 10,
        TotalRecords: 0
      },
      choosetime: "",
      tableFrozen: [],
      menuOptions: []
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
        this.withdrawForm.ToDate = this.gettimes();
        this.GetSettlementTypePage();
        this.PaidForList();
      }
    } else {
      this.$message.info({ message: "你尚未登录，请登录！" });
      this.$router.push("/");
    }
  },
  methods: {
    //分页
    handleCurrentChange(val) {
      this.withdrawForm.PageIndex = val;
      this.GetSettlementTypePage();
    },
    
     //付款对象列表
    async PaidForList() {
      let datlist = { MerchantID: this.withdrawForm.MerchantID, Type: 3 };
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
        console.log("ok");
        this.$message({
          type: "error",
          message: res.data.ResultMessage
        });
      }
    },

    async GetSettlementTypePage() {
      const Updates = await GetSettlementTypePage(this.withdrawForm);
      if (Updates.data.ResultCode == "000000") {
        this.count = Updates.data.TotalRecords
        this.tableFrozen = Updates.data.ResultValue;
        this.withdrawForm.TotalRecords = Updates.data.TotalRecords;
      } else {
        this.$message({
          type: "error",
          message: Updates.data.ResultMessage
        });
        return false;
      }
    },
    searchlist() {
      this.BalanceChanges();
    },
    changetime() {
      if (this.choosetime) {
        this.withdrawForm.FromDate = this.gettimes(this.choosetime[0]);
        this.withdrawForm.ToDate = this.gettimes(this.choosetime[1]);
      } else {
        this.withdrawForm.FromDate = "1970-01-01";
        this.withdrawForm.ToDate = this.gettimes();
      }
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
  watch: {
    $route(newVal, oldVal) {
      if (newVal.name == "carriageforward") {
        this.handleCurrentChange(1);
      }
    }
  }
};
</script>
<style scoped>
</style>
