<template>
  <div class="bankcard-dialog-container">
    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" width="500px" @close='closeDialog'>
      <el-form :model="bankInfo" ref="bankInfo" label-position="left">
        <el-form-item label="开 户 名" label-width="100px" prop="Name" :rules="[
                          { required: true, message: '开户名不能为空',trigger: 'blur'}
                        ]">
          <el-input v-model="bankInfo.Name" auto-complete="off" placeholder="银行账号保持一致的开户名"></el-input>
        </el-form-item>
        <el-form-item label="银行名称" label-width="100px" prop="Bank" :rules="[
                          { required: true, message: '银行名称不能为空',trigger: 'blur'}
                        ]">
          <el-input v-model="bankInfo.Bank" auto-complete="off" placeholder="请输入银行名称"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号" label-width="100px" prop="Code" :rules="[
                          { required: true, message: '银行卡号不能为空',trigger: 'blur'},
                          { pattern: regs.Bankcard, message: '银行卡号应为数字且长度在15位-19位之间'},
                        ]">
          <el-input v-model="bankInfo.Code" auto-complete="off" placeholder="请输入银行卡号"></el-input>
        </el-form-item>
        <el-form-item label="开户支行" label-width="100px" prop="Specific" :rules="[
                          { required: true, message: '开户支行不能为空',trigger: 'blur'}
                        ]">
          <el-input v-model="bankInfo.Specific" auto-complete="off" placeholder="请输入开户支行"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitConfirm('bankInfo')" round class="bankcard-save">{{dialog.buttonText}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import regs from "@/config/regExp";
  import { addBankcard, updateBankcard} from '@/api/getData'
  export default {
    props:['dialog','bankInfo'],
    data(){
      return {regs}
    },
    methods:{
      submitConfirm: function(formName){
        this.$refs[formName].validate(async valid => {
          if (!valid) return;
          let _ = this,
              result = {};
          //dialog类型有添加跟删除  根据type值判断
          this.bankInfo.MemberID = this.$cookie.get("MemberID");
          if (_.dialog.type === 'add') {
            result = await addBankcard(this.bankInfo);
          } else if(_.dialog.type === 'edit'){
            result = await updateBankcard(this.bankInfo);
          }
          if (result.data.ResultCode !== '000000') {
            this.$message({
              type: 'error',
              message: result.data.ResultMessage
            });
          } else {
            this.$emit('callback', true);
            this.dialog.visible = false;
            this.$message({
              type: 'success',
              message: result.data.ResultMessage
            });
          }
        })
      },
      //窗口关闭回调
      closeDialog(){
        this.$emit('callback', false);
        this.$refs['bankInfo'].resetFields();
      }
    }
  }
</script>

<style lang="stylus">
  .bankcard-dialog-container .el-dialog__body
    padding: 30px 50px
  .bankcard-dialog-container .bankcard-add
    width: 280px
    height: 198px
    line-height: 200px
    text-align: center
    float: left
    border:1px dashed #C3DBDC
    background: #F2F5FA
    font-size: 16px
    color: #027CFF
    margin: 0 10px 20px
    border-radius: 4px
    cursor: pointer
  .bankcard-dialog-container .dialog-footer
    margin-left: 120px
    text-align: left
  .bankcard-dialog-container .bankcard-save
    width: 200px
    height: 40px
    background: #027CFF
</style>
