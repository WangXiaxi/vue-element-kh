<template>
  <div class="business-statistics">
    <div class="agentcontent">
      <div class="mt-6">
        <div>
          <span class="withdraw-span">注册日期</span>
          <el-date-picker
            v-model="choosetime"
            type="daterange"
            @change="changetime"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <el-input style="width:300px;margin-left:10px;" placeholder="请输入商户名称" v-model="recharge.MerchantName"></el-input>
          <el-select style="margin-left:10px;" v-model="recharge.Crowd" placeholder="请选择">
            <el-option label="全部" :value="999"></el-option>
            <el-option label="工厂企业" :value="1"></el-option>
            <el-option label="物流公司" :value="2"></el-option>
            <el-option label="个体司机" :value="3"></el-option>
          </el-select>
          
          <el-button type="primary" style="margin-left:10px;" @click="handleCurrentChange(1)">搜索</el-button>
        </div>
      </div>
      <div>
        <el-table
          :data="tableFrozen"
          style="width: 100%" empty-text="代理区暂无会员入驻信息!">
          <el-table-column
            label="会员名称"
            prop="MerchantName">
            <template slot-scope="scope">
              {{scope.row.MerchantName ? scope.row.MerchantName : '-'}}
            </template>
          </el-table-column>
          <el-table-column
            label="身份"
            prop="Crowd">
          </el-table-column>
          <el-table-column
            label="注册时间"
            width="180"
            prop="Create">
          </el-table-column>
          <el-table-column
            label="邀请人"
            width="180"
            prop="SaleName">
            <template slot-scope="scope">
              {{scope.row.SaleName ? scope.row.SaleName : '-'}}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="Pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="recharge.PageIndex"
        :page-size="recharge.PageSize"
        layout="total, prev, pager, next"
        :total="count">
      </el-pagination>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import { ThoseBusinesses } from '@/api/getData'
import { getTimes } from '@/js/times'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      menberinfo: this.$cookie.get('AgentName'),
      ProvinceName: this.$cookie.get('ProvinceName'),
      tableFrozen: [],
      count: 0,
      choosetime: [new Date().setDate(new Date().getDate() - 7), new Date()],
      recharge: {
        AgentID: this.$cookie.get('AgentID'),
        FromDate: '',
        ToDate: '',
        PageIndex: 1,
        PageSize: 20,
        TotalRecords: 0,
        MerchantName: '',
        Crowd: 999
      }
    }
  },
  methods: {
    //列表
    async ThoseBusinesses () {
      const GetPage = await ThoseBusinesses(this.recharge)
      console.log(GetPage)
      if (GetPage.data.ResultCode == "000000") {
        this.tableFrozen = GetPage.data.ResultValue
        this.count = GetPage.data.TotalRecords
      } else {
        this.$message({
          type: 'error',
          message: GetPage.data.ResultMessage
        });
        return false
      }
    },
    changetime () {
      if (this.choosetime) {
        this.recharge.FromDate = getTimes(this.choosetime[0])
        this.recharge.ToDate = getTimes(this.choosetime[1])
      } else {
        this.recharge.FromDate = '1970-01-01'
        this.recharge.ToDate = getTimes()
      }
      
    },
    
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.recharge.PageIndex = val
      this.ThoseBusinesses()
    },
  },
  created () {
    this.recharge.FromDate = getTimes(this.choosetime[0])
    this.recharge.ToDate= getTimes(this.choosetime[1])
    this.ThoseBusinesses()
  },
  computed: {
    ...mapGetters([
      'ifAddYWY'
    ])
  },
  watch: {
    ifAddYWY (n) {
      if (n) {
        this.handleCurrentChange(1)
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.agentcontent
    padding:30px
  .Pagination
    padding-bottom:20px
    text-align :center
  .withdraw-span
    padding: 0 20px 0 10px
</style>