<template>
  <div class="">
    <div class="mt-6">
      <span class="mr-10">发生时间</span>
      <el-date-picker
        v-model="choosetime"
        type="daterange"
        range-separator="至"
        :unlink-panels="false"
        @change="changetime"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-select v-model="withdrawForm.PaymentID" placeholder="请选择物流公司名称" class="ml-10 mr-10">
        <el-option
           v-for="(item,index) in menuOptions"
           :key="item.index"
           :label="item.label"
           :value="item.value"               
         >
        </el-option>
      </el-select>
      <el-button type="primary" plain @click="handleCurrentChange(1)">搜索</el-button>
    </div>
    <div>
      <el-table
        :data="tableFrozen"
        style="width: 100%">
        <el-table-column label="付款详情" width="350">
          <template slot-scope="props">
            <div class="gray-txt">{{props.row.CreateStart}} -- {{props.row.CreateEnd}}</div>
            <div v-for="(item,index) in props.row.OrderFormList" :key="index" v-if="index < props.row.count">
              <p>货源编号：
                <router-link :to="'/sourceDetails/'+item.OrdeID">
                  <em class="blue-txt">{{item.OrdeCode}}</em>
                </router-link>
              </p>
            </div>
            <p v-if="props.row.OrderFormList.length > minCount" @click="showMore(props.$index)" class="cuspoint blue-txt">
              {{props.row.isClose?"查看更多":"点击收起"}}
              <i :class="props.row.isClose?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="付款方式 | 付款对象 | 付款时间" width="230">
          <template slot-scope="props">
            <div>{{props.row.Method | typeinfo()}} | {{props.row.Payee }}</div>
            <div class="gray-txt">{{props.row.Execute}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="应付金额(元)"
          prop="Should">
        </el-table-column>
        <el-table-column
          label="支付金额(元)"
          prop="Actual">
        </el-table-column>
        <el-table-column
          label="备注"
          prop="Reason">
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
import { LogisticsFreightBill, PaidForList } from "@/api/getData";
export default {
  data() {
    return {
      count: "",
      minCount: '3',
      withdrawForm: {
        MerchantID: this.$cookie.get("MemberMerchantID"),
        MemberID: this.$cookie.get("MemberID"),
        PaymentID: "",
        FromDate: "1970-01-01",
        ToDate: "",
        Type: "1",
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
        this.FreightBill();
        this.PaidForList();
      }
    } else {
      this.$message.info({ message: "你尚未登录，请登录！" });
      this.$router.push("/");
    }
  },
  methods: {
    // 超出显示查看更多
    showMore(index){
      if(this.tableFrozen[index].count > this.minCount){
        this.tableFrozen[index].count = this.minCount;
      } else {
        this.tableFrozen[index].count = this.tableFrozen[index].OrderFormList.length;
      }
      this.tableFrozen[index].isClose = !this.tableFrozen[index].isClose;
    },
    //分页
    handleCurrentChange(val) {
      this.withdrawForm.PageIndex = val;
      this.FreightBill();
    },
    //付款对象列表
    async PaidForList() {
      let datlist = { MerchantID: this.withdrawForm.MerchantID, Type: 1 };
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
    //列表
    async FreightBill() {
      if (this.$cookie.get("MemberMerchantID")) {
        const Updates = await LogisticsFreightBill(this.withdrawForm);
        if (Updates.data.ResultCode == "000000") {
          this.count = Updates.data.ResultValue.Arrearage.length;
          this.tableFrozen = Updates.data.ResultValue.Arrearage;
          this.tableFrozen.forEach((item,index)=>{
            this.$set(item,'count',this.minCount);
            this.$set(item,'isClose',true);
          })
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
  filters: {
    typeinfo(data) {
      if (data == "01") {
        return "中金";
      } else if (data == 10) {
        return "支付宝";
      } else if (data == 20) {
        return "微信";
      } else {
        return "余额";
      }
      // doSomething
    }
  },
  watch: {
    $route(newVal, oldVal) {
      if (newVal.name == "paylist") {
        this.FreightBill();
      }
    }
  }
};
</script>

<style scoped>
</style>
