<template>
  <div class="dialog-act">
    <!-- 编辑操作 -->
    <el-dialog title="添加业务员信息" :visible.sync="dialogEdit" class="dn-spec-dialog" width="500px" center @close="closeDialog">
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px">
        <el-form-item label="业务员名称" prop="SaleName">
          <el-input v-model="editForm.SaleName"></el-input>
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
  import regExp from '@/js/regExp'
  import { SalesmanAddEdit } from '@/api/getData'

  export default {
    props: {
      isShow: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        dialogEdit: true,
        ifSuccess: false, // 返回操作是否成功 判断要不要刷新
        editForm: {
          AgentID: this.$cookie.get('AgentID'),
          SaleName: '',
          SaleMobile: '',
          Type: 1
        },
        rules: {
          SaleMobile: [
            { required: true, message: '手机号码不能为空', trigger: 'blur' },
            { pattern: regExp.Phone, message: "请输入正确格式手机号", trigger: "blur" }
          ],
          SaleName: [
            { required: true, message: '请输入业务员姓名', trigger: 'blur' }
          ]
        },
      }
    },
    components: {
    },
    computed: {
    },
    mounted () {
    },
    methods: {
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
              this.ifSuccess = true
            }
          }
        })
      },
      closeDialog () {
        setTimeout(() => {
          this.$emit('closeDialogAdd', this.ifSuccess)
        }, 300)
      }
    } 
  }
</script>

<style lang="stylus" scoped>

</style>
