<template>
  <div class="trade-list">
    <head-top>
      <span class="title" slot="index">物流公司-工作台</span>
      <div class="header-center" slot="menu">
        <headMenuRouter :userType="userType" activeLink="finaindex"></headMenuRouter>
      </div>
      <drop-down slot="info"></drop-down>
    </head-top>
    <div class="content clear">
      <div class="content-left">
        <leftMenuRouter :userType="userType" activeLink="tradeList"></leftMenuRouter>
      </div>
      <div class="content-right">
        <div class="main fr">
           <p class="title-box"><span class="title-name">交易账单</span></p>
           <div class="container">
             <div class="top-sort">
              <ul>
                <li class="top-title">财务类型：</li>
                <li :class="[(financeType == 1) ? 'active' : '']" @click="financeType = 1">收入</li>
                <li :class="[(financeType == 2) ? 'active' : '']" @click="financeType = 2">支出</li>
              </ul>
           </div>
           <div class="top-sort">
              <ul>
                <li class="top-title">状态：</li>
                <li :class="[(orderStatus == 0) ? 'active' : '']" @click="orderStatus = 0">全部</li>
                <li :class="[(orderStatus == 1) ? 'active' : '']" @click="orderStatus = 1">{{titleOne}}</li>
                <li :class="[(orderStatus == 2) ? 'active' : '']" @click="orderStatus = 2">{{titleTwo}}</li>
              </ul>
           </div>
          <div class="mt-6 mb-20 ml-20">
            <span class="withdraw-span mr-10">发生时间</span>
            <el-date-picker
              v-model="choosetime"
              @change="changetime"
              :unlink-panels="false"
              type="daterange"
              range-separator="至"
              size="small"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-select v-model="withdrawForm.PaymentID" placeholder="请选择交易对象名称" clearable class="ml-10 mr-10" size="small">
              <el-option
                v-for="(item,index) in menuOptions"
                :key="index"
                :label="item.label"
                :value="item.value"               
              >
              </el-option>
            </el-select>
            <el-button type="primary" plain @click="handleCurrentChange(1)" size="small">搜索</el-button>
          </div>
          <div class="list-box">
            <div v-show="financeType == 1">
              <el-table
                size="small"
                class="el-table-b-1px"
                :data="tableFrozen"
                style="width: 100%;">
                <el-table-column width="10">
                </el-table-column>
                <el-table-column label="账单详情 | 发生时间" width="220">
                  <template slot-scope="props">
                    <dl>
                      <dt v-if="props.row.TradBegin">{{props.row.TradBegin.slice(0,10)}} — {{props.row.TradEnd.slice(0,10)}}</dt>
                      <dd v-for="(item,index) in props.row.OrderCode" :key="index" v-if="index < props.row.count">
                        <span>货源编号：</span><span>{{item}}</span>
                      </dd>
                      <dd>
                        <p v-if="props.row.OrderCode.length > minCount" @click="showMore(props.$index)" class="cuspoint blue-txt">
                          {{props.row.isClose?"查看更多":"点击收起"}}
                          <i :class="props.row.isClose?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
                        </p>
                      </dd>
                      <dd class="clear" v-if="props.row.TradReason">
                        <span class="gray-txt fl">原因：</span>
                        <span class="reason">{{props.row.TradReason}}</span>
                      </dd>
                      <dt class="gray-txt clear">{{props.row.TradCreate}}</dt>
                    </dl>
                  </template>
                </el-table-column>
                <el-table-column
                  label="财务类型 | 支付方式 | 交易对象" width="230">
                  <template slot-scope="props">
                    <div>
                      <div>收入 | {{props.row.PayName}}</div>
                      <div class="gray-txt">{{props.row.MerchantName}}</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="账单金额(元)"
                  width="100"
                  prop="TradAmount">
                  <template slot-scope="props">
                    {{props.row.TradAmount.toFixed(2)}}
                  </template>
                </el-table-column>
                <el-table-column
                  width="160"
                  label="实付金额 | 服务费(元)"
                  >
                  <template slot-scope="props">
                    <p>{{props.row.TradPayment.toFixed(2)}}</p>
                    <p>-{{props.row.TradBrokerage.toFixed(2)}}</p>
                  </template>
                </el-table-column>
                <el-table-column
                  label="实到金额(元)"
                  width="100">
                  <template slot-scope="props">
                    <p>+{{props.row.TradIncome.toFixed(2)}}</p>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="StatusName"
                  label="状态">
                  <!-- <template slot-scope="props">
                    <div class="orange-text" v-if="props.row.Status == -1">未付款</div>
                    <div v-if="props.row.Status == 1">已付款</div>
                  </template> -->
                </el-table-column>
              </el-table>
            </div>
            <div v-show="financeType == 2">
              <el-table
              size="small"
              class="el-table-b-1px"
              :data="tableFrozen"
              style="width: 100%">
              <el-table-column label="账单详情  | 发生时间" width="350">
                <template slot-scope="props">
                  <dl>
                    <dt v-if="props.row.TradBegin">{{props.row.TradBegin.slice(0,10)}} — {{props.row.TradEnd.slice(0,10)}}</dt>
                    <dd v-for="(item,index) in props.row.OrderCode" :key="index" v-if="index < props.row.count">
                      <span>货源编号：</span><span>{{item}}</span>
                    </dd>
                    <dd>
                      <p v-if="props.row.OrderCode.length > minCount" @click="showMore(props.$index)" class="cuspoint blue-txt">
                        {{props.row.isClose?"查看更多":"点击收起"}}
                        <i :class="props.row.isClose?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
                      </p>
                    </dd>
                    <dd class="clear" v-if="props.row.TradReason">
                      <span class="gray-txt fl">原因：</span>
                      <span class="reason">{{props.row.TradReason}}</span>
                    </dd>
                    <dd class="gray-txt clear">{{props.row.TradCreate}}</dd>
                  </dl>
                </template>
              </el-table-column>
              <el-table-column
                label="财务类型 | 支付方式 | 交易对象" width="230">
                <template slot-scope="props">
                  <div>
                    <div>支出 | {{props.row.PayName}}</div>
                    <div class="gray-txt">{{props.row.MerchantName}}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="账单金额(元)"
                prop="TradAmount">
              </el-table-column>
              <el-table-column
                label="收支金额(元)">
                <template slot-scope="props">
                  <p>{{Number(props.row.TradPayment) > 0 ? `-${props.row.TradPayment}` : props.row.TradPayment}}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="StatusName"
                label="状态">
              </el-table-column>
            </el-table>
            </div>
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
        </div>
      </div>
    </div>
    <foot></foot>
  </div>
</template>

<script>
  import headTop from 'components/header/head';
  import dropDown from 'components/header/children/dropdown';
  import foot from 'components/footer/foot';
  import { baseUrl } from "@/api/env";
  import { GetBillsList , PaidForList } from "@/api/getData";
  import headMenuRouter from './headmenurouter.vue';
  import leftMenuRouter from './leftmenurouter.vue';

export default {
  data() {
    return {
      userType: this.$cookie.get("MemberCrowd"),
      loading: false,
      financeType: 1,//财务类型
      orderStatus: 0,//订单状态
      count: "",
      minCount: '3',
      withdrawForm: {
        MerchantID: this.$cookie.get("MemberMerchantID"),
        MemberID: this.$cookie.get("MemberID"),
        PaymentID: '',
        FromDate: "1970-01-01",
        ToDate: "",
        Type: 1,
        Status: 0,
        PageIndex: 1,
        PageSize: 10,
        TotalRecords: 0
      },
      choosetime: "",
      tableFrozen: [],
      menuOptions: [],
      titleOne: '待收款',
      titleTwo: '已收款'
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
      this.PaidForList(4);
    }
  },
  methods: {
    // 超出显示查看更多
    showMore(index){
      if(this.tableFrozen[index].count > this.minCount){
        this.tableFrozen[index].count = this.minCount;
      } else {
        this.tableFrozen[index].count = this.tableFrozen[index].OrderCode.length;
      }
      this.tableFrozen[index].isClose = !this.tableFrozen[index].isClose;
    },
    //分页
    handleCurrentChange(val) {
      this.withdrawForm.PageIndex = val;
      this.GetBillsList();
    },
     //付款对象列表
    async PaidForList(Type) {
      let datlist = { MerchantID: this.withdrawForm.MerchantID, Type: Type ,FromDate: this.withdrawForm.FromDate,ToDate: this.withdrawForm.ToDate};
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
      this.loading = true;
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
      this.loading = false;
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
  },
  watch:{
    financeType(newVal) {
      this.withdrawForm.Type = newVal;
      if (newVal == 1) {
        this.PaidForList(4); // 支出查询下拉 收入4
        this.withdrawForm.PaymentID = '';
        this.titleOne = '待收款';
        this.titleTwo = '已收款';
      } else {
        this.PaidForList(5); // 支出查询下拉 支出5
        this.withdrawForm.PaymentID = '';
        this.titleOne = '支付成功';
        this.titleTwo = '退款';
      }
      this.handleCurrentChange(1);
    },
    orderStatus(newVal) {
      this.withdrawForm.Status = newVal;
      this.handleCurrentChange(1);
    },
  },
  components: {
    headTop,
    dropDown,
    foot,
    headMenuRouter,
    leftMenuRouter
  }
};
</script>

<style  lang="stylus" scoped>
@import "../../assets/styles/variable.styl"
.el-table-b-1px
  border: 1px solid #e0e0e0
  border-bottom: none
.content
    position: relative
    width: 1200px
    margin: 10px auto 40px
  .content-left
    min-height: $minHeight
    float: left
    width: 200px
    background: #ffffff
    > ul
      width: 200px;
      position: absolute;
      height: 100%;
      background-color: #fff;
      > li
        height: 30px;
        line-height: 30px;
        padding-left: 40px;
        margin: 10px 0;
        border-left: 3px solid transparent
        &:hover
          border-left-color: $blue
          color: $blue
          cursor: pointer
      .active
        border-left-color: $blue
        color: $blue
  .content-right
    float: right
    width: 990px
    background-color: #fff
    .main
      background: #FFFFFF;
      width: 100%
      .title-box
        box-shadow: 0 1px 0 0 #E0E0E0
      .title-name
        display: inline-block
        padding-left: 20px
        height: 30px
        line-height: 30px
        margin: 10px 0
        border-left: 3px solid $blue
      .container
        padding: 40px 40px
      .top-sort
        margin: 0 0 20px 20px
        ul
          overflow: hidden
          li
            float: left
            margin: 0 15px
            cursor: pointer
            &:first-child
              margin: 0
              cursor: default
          .active
            color: $blue
          .top-title
            float: left
            width: 70px  
      .small-item
        width: 180px
      .content-list
        min-height: 500px
        > ul
          > li
            margin-top: 10px
            border: 1px solid $borderColor
.reason
  float: left
  width: 166px
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
<style lang="stylus">
  .trade-list
    .el-table__empty-block
      height: 180px
      .el-table__empty-text
        width: 120px
        height: 20px
        padding-top: 120px
        background: url('../../assets/images/null.png') 50% top no-repeat
    .el-table .el-table__header-wrapper .el-table__header .has-gutter .el-checkbox .el-checkbox__input
      opacity: 0
      display: none
    .el-table
      .el-table__header-wrapper
        .has-gutter
          tr, th
            background-color: #FAFAFA
</style>

