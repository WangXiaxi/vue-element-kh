<template>
  <div class="business-statistics">
    <div class="agentcontent">
      <div>
        <el-table
          :data="tableFrozen"
          style="width: 100%" empty-text="代理商暂无业务员!">
          <el-table-column
            label="业务员名称"
            width="272px"
            prop="SaleName">
          </el-table-column>
          <el-table-column
            label="手机号"
            prop="SaleMobile">
          </el-table-column>
          <el-table-column
            label="邀请码"
            width=""
            prop="SaleCode">
          </el-table-column>
          <el-table-column
            label="邀请人数"
            width=""
            prop="InviteNumber">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <span class="custom-btn" @click="handleEdit(scope.$index, scope.row)">修改</span>
              <span class="custom-btn" @click="handleDele(scope.$index, scope.row)">删除</span>
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

    <!-- 编辑操作 -->
    <el-dialog title="修改业务员信息" :visible.sync="dialogEdit" class="dn-spec-dialog" width="500px" center>
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px">
        <el-form-item label="业务员名称" prop="SaleName">
          <el-input v-model="editForm.SaleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="SaleMobile">
          <el-input v-model="editForm.SaleMobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" round @click="handleEditAct">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 编辑操作结束 -->
  </div>
</template>
<script type="text/ecmascript-6">
import { SalesmanGetPage, SalesmanAddEdit, DeleteSalesman } from '@/api/getData'
import { mapGetters } from 'vuex'
import regExp from '@/js/regExp'

export default {
  data() {
    return {
      dialogEdit: false,
      menberinfo: this.$cookie.get('AgentName'),
      ProvinceName: this.$cookie.get('ProvinceName'),
      tableFrozen: [],
      count: 0,
      recharge: {
        AgentID: this.$cookie.get('AgentID'),
        PageIndex: 1,
        PageSize: 20,
        TotalRecords: 0
      },
      rules: {
        SaleMobile: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { pattern: regExp.Phone, message: "请输入正确格式手机号", trigger: "blur" }
        ],
      },
      editForm: {
        AgentID: this.$cookie.get('AgentID'),
        SaleID: '',
        SaleName: '',
        SaleMobile: '',
        Type: 2
      }
    }
  },
  methods: {
    //列表
    async SalesmanGetPage () {
      const GetPage = await SalesmanGetPage(this.recharge);
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
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.recharge.PageIndex = val
      this.SalesmanGetPage()
    },
    handleEdit (index, val) { // 编辑动作
      this.editForm.SaleID = val.SaleID
      this.editForm.SaleName = val.SaleName
      this.editForm.SaleMobile = val.SaleMobile
      this.dialogEdit = true
    },
    handleEditAct () {
      this.$refs['editForm'].validate(async valid => {
        if (valid) {
          const resData = await SalesmanAddEdit(this.editForm)
          console.log(resData)
          if (resData.data.ResultCode === '000000') {
            this.$message({
              type: 'success',
              message: resData.data.ResultMessage
            })
            this.dialogEdit = false
            this.handleCurrentChange(1)
          }
        }
      })
    },
    handleDele (index, val) { // 删除动作
      this.$confirm('确定要删除当前业务员吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const resData = await DeleteSalesman({ 'AgentID': this.$cookie.get('AgentID'), SaleID: val.SaleID })
        if (resData.data.ResultCode === '000000') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.handleCurrentChange(1)
        }
      }).catch(() => {
        
      })
    }
  },
  created () {
    this.SalesmanGetPage()
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
  .custom-btn
    color: #027CFF
    margin-right: 10px
    cursor: pointer
</style>