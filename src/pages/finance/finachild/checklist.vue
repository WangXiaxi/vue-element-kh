<template>
  <div class="">
    <!-- <dl class="withdraw-check">
      <dt>财务类型：</dt>
      <dd class="active">全部</dd>
      <dd>支出</dd>
      <dd>收入</dd>
      <dd>退款</dd>
    </dl>
    <dl class="withdraw-check">
      <dt>状态：</dt>
      <dd class="active">全部</dd>
      <dd>待付款</dd>
      <dd>已收款</dd>
      <dd>支付成功</dd>
    </dl> -->
    <div class="mt-6">
      <span class="withdraw-span">发生时间</span>
      <el-date-picker
        v-model="choosetime"
        @change="changetime"
        :unlink-panels="false"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-select v-model="withdrawForm.PaymentID" placeholder="请选择交易对象名称" class="ml-10 mr-10">
        <el-option
           v-for="(item,index) in menuOptions"
           :key="item.index"
           :label="item.label"
           :value="item.value"               
         >
        </el-option>
      </el-select>
      <el-button type="primary" plain @click="handleCurrentChange(1)">搜索</el-button>
      <!-- <el-button type="primary" plain class="fr">导出记录</el-button> -->
    </div>
    <div>
      <el-table
        :data="tableFrozen"
        style="width: 100%">
        <el-table-column label="账单详情  | 发生时间" width="350">
          <template slot-scope="props">
            <dl>
              <dt v-if="props.row.CreateStartEnd">{{props.row.CreateStartEnd.CreateStart}} — {{props.row.CreateStartEnd.CreateEnd}}</dt>
              <dd v-for="(item,index) in props.row.OrderFormList" :key="index" v-if="index < props.row.count">
                <span>货源编号：</span><span>{{item.OrdeCode}}</span>
              </dd>
              <dd>
                <p v-if="props.row.OrderFormList.length > minCount" @click="showMore(props.$index)" class="cuspoint blue-txt">
                  {{props.row.isClose?"查看更多":"点击收起"}}
                  <i :class="props.row.isClose?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
                </p>
              </dd>
              <!-- <dd v-else><span>货源编号：</span><router-link :to="{path: '/sourceDetails/'+OrderFormList.OrdeID}" class="blue-txt">OrderFormList.OrdeCode</router-link></dd> -->
              <dt class="gray-txt">{{props.row.Happen}}</dt>
            </dl>
          </template>
        </el-table-column>
        <el-table-column
          label="财务类型 | 支付方式 | 交易对象" width="230">
          <template slot-scope="props">
            <div>
              <div v-if="props.row.ChangeForm==1">{{dealType(props.row.Type)}} | 余额</div>
              <div v-else-if="props.row.ChangeForm==2"> {{dealType(props.row.Type)}} | 支付宝</div>
              <div v-else-if="props.row.ChangeForm==3"> {{dealType(props.row.Type)}} | 微信</div>
              <div v-else-if="props.row.ChangeForm==4"> {{dealType(props.row.Type)}} | 中金</div>
              <div class="gray-txt">{{props.row.Trading}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="账单金额(元)"
          prop="Should">
        </el-table-column>
        <el-table-column
          label="实际金额(元)"
          prop="Actual">
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="props">
            <div class="orange-text" v-if="props.row.Status == -1">未付款</div>
            <div v-if="props.row.Status == 1">已付款</div>
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
import { GetBillsList , PaidForList } from "@/api/getData";
export default {
  data() {
    return {
      count: "",
      minCount: '3',
      withdrawForm: {
        MerchantID: this.$cookie.get("MemberMerchantID"),
        MemberID: this.$cookie.get("MemberID"),
        PaymentID: '',
        FromDate: "1970-01-01",
        ToDate: "",
        Type: 999,
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
      this.GetBillsList();
      this.PaidForList();
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
      this.GetBillsList();
    },
     //付款对象列表
    async PaidForList() {
      let datlist = { MerchantID: this.withdrawForm.MerchantID, Type: 2 ,FromDate: this.withdrawForm.FromDate,ToDate: this.withdrawForm.ToDate};
      const res = await PaidForList(datlist);
      if (res.data.ResultCode == "000000") {
        this.menuOptions = [];
        res.data.ResultValue.forEach(item => {
          const tableData = {};
          tableData.label = item.Merchant.MerchantName;
          tableData.value = item.Merchant.MerchantID;
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
    async GetBillsList() {
      if (this.$cookie.get("MemberMerchantID")) {
        const Updates = await GetBillsList(this.withdrawForm);
        if (Updates.data.ResultCode == "000000") {
          this.count = Number(Updates.data.TotalRecords);
          this.withdrawForm.TotalRecords = Number(Updates.data.TotalRecords);
          this.tableFrozen = Updates.data.ResultValue;
          this.tableFrozen.forEach((item,index)=>{
            this.$set(item,'count',this.minCount);
            this.$set(item,'isClose',true);
          })
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
    },
    dealType(type) {
      if (type == 1) {
        return "商家充值";
      } else if (type == 2) {
        return "商家支付";
      } else if (type == 3) {
        return "订单收入";
      } else if (type == 4) {
        return "订单退款";
      } else if (type == 5) {
        return "缴纳保证金";
      } else if (type == 6) {
        return "保证金退款";
      } else if (type == 7) {
        return "冻结款";
      } else if (type == 8) {
        return "冻结款退还";
      } else if (type == -1) {
        return "商家提现";
      }
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
  }
};
</script>

<style  lang="stylus" scoped>
.withdraw-check {
  height: 30px;
  line-height: 30px;
  padding: 6px 0;

  dt {
    float: left;
    width: 70px;
  }

  dd {
    float: left;
    padding: 0 20px;
    cursor: pointer;
  }

  dd.active {
    color: $blue;
  }
}
</style>
