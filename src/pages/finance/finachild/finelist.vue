<template>
  <div class="">
    <div class="mt-6">
      <span class="withdraw-span">发生时间</span>
      <el-date-picker
        v-model="choosetime"
        type="daterange"
        value-format="yyyy-MM-dd"
        @change="changetime"
        :unlink-panels="false"
        :editable='false'
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button type="primary" plain @click="handleCurrentChange(1)">搜索</el-button>
    </div>
    <div>
      <el-table
        :data="tableFrozen"
        style="width: 100%" empty-text="暂无冻结款记录" :cell-class-name="tableRowClassName">
        <el-table-column
          label="交易说明" width="430">
          <template slot-scope="props">
            <div>货源编号：
              <router-link :to="'/sourceDetails/'+props.row.OrderID">{{props.row.OrderCode}}</router-link>
            </div>
            <div class="gray-txt">{{props.row.FinesFor}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="发生时间"
          prop="Time">
        </el-table-column>
        <el-table-column
          label="罚款金额(元)">
          <template slot-scope="props">
            <div class="orange-text">-{{props.row.Withhold}}</div>
          </template>
        </el-table-column>
        <!--<el-table-column-->
          <!--label="罚款状态">-->
          <!--<template slot-scope="props">-->
            <!--<div class="orange-text">- {{props.row.Withhold}}</div>-->
          <!--</template>-->
        <!--</el-table-column>-->
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
import { PenaltyRecord } from "@/api/getData";
export default {
  data() {
    return {
      hadbank: false,
      banktype: "person",
      bankname: "",
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
      timeRange: [],
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
      this.GetBillsList();
    }
  },
  methods: {
    //分页
    handleCurrentChange(val) {
      this.withdrawForm.PageIndex = val;
      this.GetBillsList();
    },
    //列表
    async GetBillsList() {
      if (this.$cookie.get("MemberMerchantID")) {
        const Updates = await PenaltyRecord(this.withdrawForm);
        if (Updates.data.ResultCode == "000000") {
          this.tableFrozen = Updates.data.ResultValue;
          this.withdrawForm.TotalRecords = Updates.data.TotalRecords;
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
    changetime() {
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
    },
    //特殊列表样式修饰
    tableRowClassName({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 3) {
        return "orange-text";
      } else if (columnIndex === 2) {
        return "green-text";
      }
      return "";
    }
  },
  watch: {
    $route(newVal, oldVal) {
      if (newVal.name == "finelist") {
        this.GetBillsList();
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.withdraw-span {
  padding: 0 10px;
}
</style>
