<template>
  <div class="business-statistics">
    <div class="agentcontent">
      <div class="mt-6">
        <div>
          <span class="withdraw-span">发生时间</span>
          <el-date-picker
            v-model="choosetime"
            type="daterange"
            @change="changetime"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <!--<el-button type="primary" plain class="personbtn" style="margin-left: 14px">七天内</el-button>-->
          <el-button type="primary" style="margin-left:10px;" @click="handleCurrentChange(1)">搜索</el-button>
        </div>
      </div>
      <div v-loading="loading">
        <el-table
          :data="tableFrozen"
          style="width: 100%" empty-text="代理区暂无业绩统计信息!">
          <el-table-column
            label="发生日期"
            prop="ArrivedDate">
          </el-table-column>
          <el-table-column
            label="运单数"
            prop="OrderCount">
          </el-table-column>
          <el-table-column
            label="运费金额(元)"
            width="180"
            prop="FreightTotal">
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
import { AgentOrderGetPage } from '@/api/getData'
import { getTimes } from '@/js/times'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      loading: true,
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
        TotalRecords: 0
      }
    }
  },
  methods: {
    //列表
    async AgentOrderGetPage () {
      this.loading = true
      const GetPage = await AgentOrderGetPage(this.recharge)
      this.loading = false
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
      this.AgentOrderGetPage()
    },
  },
  created () {
    this.recharge.FromDate = getTimes(this.choosetime[0])
    this.recharge.ToDate= getTimes(this.choosetime[1])
    this.AgentOrderGetPage()
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