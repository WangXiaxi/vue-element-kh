<template>
  <div>
    <div class="mt-6">
      <!--<div class="fl rerecord">-->
        <!--提现总计:-->
        <!--<em class="orange-text">6000.00</em>元，-->
        <!--<em class="orange-text">10</em>次，-->
      <!--</div>-->
      <div>
        <span class="withdraw-span">发生时间</span>
        <el-date-picker
          v-model="choosetime"
          type="daterange"
          @change="changetime"
          :unlink-panels="false"
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
          label="提现账户"
          prop="BankName">
        </el-table-column>
        <el-table-column
          label="发生时间"
          prop="CreateTime">
        </el-table-column>
        <el-table-column
          label="提现金额(元)"
          prop="Money">
        </el-table-column>
        <el-table-column
          label="提现状态"
        >
          <template slot-scope="scope">
            <div class="statuscontent">
              <div><em class="payicon" :class="'recordicon'+scope.row.StatusValue"></em>{{scope.row.StatusName}}</div>
              <div class="specails" v-if="scope.row.StatusValue==-2"><span>{{scope.row.FailReason}}</span>
                <a :href="imgUrl + scope.row.VoucherPicutre" target="_blank" v-if="scope.row.VoucherPicutre"><img src="@/assets/images/icon-pic.png" alt=""></a>
              </div>
            </div>
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
import { baseUrl, imgUrl } from "@/api/env";
import { GetWithdrawPage, WithdrawGet, WithdrawCancel } from "@/api/getData";
export default {
  data() {
    return {
      imgUrl,
      hadbank: false,
      banktype: "person",
      bankname: "",
      withdrawForm: {
        MerchantID: this.$cookie.get("MemberMerchantID"),
        FromDate: "1970-01-01",
        ToDate: "",
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
      this.WithdrawGet();
    }
  },
  methods: {
    //分页
    handleCurrentChange(val) {
      this.withdrawForm.PageIndex = val;
      this.WithdrawGet();
    },
    // 获取一页
    async WithdrawGet() {
      if (this.$cookie.get("MemberMerchantID")) {
        const Updates = await GetWithdrawPage(this.withdrawForm);
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
  watch: {
    $route(newVal, oldVal) {
      if (newVal.name == "withdrawlist") {
        this.WithdrawGet();
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.withdraw-span {
  padding: 0 10px;
}

.statuscontent {
  padding: 2px 0;

  div {
    line-height: 30px;
  }

  .specails {
    padding: 4px 0;
    line-height: 22px;

    img {
      padding-top: 3px;
      vertical-align: top;
    }
  }
}

.recordicon1 {
  width: 20px;
  height: 20px;
  background-position: 0 -30px;
}

.recordicon2 {
  width: 20px;
  height: 20px;
  background-position: -30px -30px;
}

.recordicon-2 {
  width: 20px;
  height: 20px;
  background-position: -60px -30px;
}
</style>
