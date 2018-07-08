<template>
  <div>
    <div class="mt-6">
      <!--<div class="fl rerecord">-->
        <!--充值总计:-->
        <!--<em class="orange-text">6000.00</em>元，-->
        <!--<em class="orange-text">10</em>次，-->
      <!--</div>-->
      <div>
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
      </div>
    </div>
    <div>
      <el-table
        :data="tableFrozen"
        style="width: 100%" empty-text="暂无充值记录">
        <el-table-column
          label="充值账户"
          prop="PayMethod">
        </el-table-column>
        <el-table-column
          label="发生时间"
          prop="CreateTime">
        </el-table-column>
        <el-table-column
          label="充值金额(元)"
          width="180">
          <template slot-scope="scope">
            <div slot="reference" style="color:#26CB7C;font-size:14px;">
              +{{ scope.row.Money }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页 start -->
            <div class="text-center mt-60">
              <el-pagination
                background
                @current-change="handleCurrentChange"
                :page-size="recharge.PageSize"
                :current-page.sync="recharge.PageIndex"
                layout="total, prev, pager, next"
                :total="recharge.TotalRecords">
              </el-pagination>
            </div>
            <!--分页 end -->
    </div>
  </div>
</template>

<script>
import { baseUrl } from "@/api/env";
import { RechargeGetPage } from "@/api/getData";
export default {
  data() {
    return {
      menberinfo: "",
      MemberID: this.$cookie.get("MemberID"),
      tableFrozen: [],
      choosetime: "",
      recharge: {
        MerchantID: this.$cookie.get("MemberMerchantID"),
        FromDate: "1970-01-01",
        ToDate: "",
        PageIndex: 1,
        PageSize: 10,
        TotalRecords: 0
      }
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
      this.recharge.ToDate = this.gettimes();
      this.RechargeGetPage();
    }
  },
  methods: {
    //分页
    handleCurrentChange(val) {
      this.recharge.PageIndex = val;
      this.RechargeGetPage();
    },
    //获取一页
    async RechargeGetPage() {
      if (this.$cookie.get("MemberMerchantID")) {
        const GetPage = await RechargeGetPage(this.recharge);
        if (GetPage.data.ResultCode == "000000") {
          this.tableFrozen = GetPage.data.ResultValue;
          this.recharge.TotalRecords = Number(GetPage.data.TotalRecords);
        } else {
          this.$message({
            type: "error",
            message: GetPage.data.ResultMessage
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
        this.recharge.FromDate = this.gettimes(this.choosetime[0]);
        this.recharge.ToDate = this.gettimes(this.choosetime[1]);
      } else {
        this.recharge.FromDate = "1970-01-01";
        this.recharge.ToDate = this.gettimes();
      }
      console.log(this.recharge.FromDate, this.recharge.ToDate);
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
      if (newVal.name == "rechargelist") {
        this.RechargeGetPage();
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
