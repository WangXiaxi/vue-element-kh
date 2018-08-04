<template>
  <div class="bankcard-list-container">
    <bankCardItem
      v-for="(item, index) in items"
      :info="item"
      :index="index"
      :key="item.CardID"
      v-on:editListener="editBankCard"
      v-on:delListener="deleteBankCardConfirm"
    ></bankCardItem>
    <div class="bankcard-add" @click="addBankCard" v-if="!getUserRole(userCharacter,'发货')">
      +添加银行卡
    </div>
    <bankCardDialog :dialog="dialog" :bankInfo="bankInfo" v-on:callback="callback"></bankCardDialog>
  </div>
</template>

<script>
  import {getBankcardList, addBankcard, deleteBankcard, updateBankcard} from '@/api/getData'
  import bankCardItem from './bankCardListItem.vue'
  import bankCardDialog from './bankCardDialog.vue'
  import { getUserRole } from 'config/myUtils'

  export default {
    data(){
      return {
        userCharacter: this.$cookie.get("MemberDutiesID"),
        items : [],
        dialog:{
          title: '添加银行卡',
          visible: false,
          buttonText: '立即添加',
          type: 'add'
        },
        bankInfo: {
          CardID: '',
          Bank: '',//银行名称
          Specific: '',//开户行(支行)名称
          Name: '', //开户名
          Code: '', //银行账号
        }
      }
    },
    methods:{
      getUserRole: getUserRole,
      //获取账号下银行卡信息
      async getBankInfo(){
        let params = {MemberID: this.$cookie.get("MemberID"), PageIndex: 1, PageSize: 1000, TotalRecords: 0};
        const list = await getBankcardList(params);
        if(list.data.ResultCode !== '000000'){
            this.$message({
              type: 'error',
              message: list.data.ResultMessage
            });
            return;
        }
        this.items = list.data.ResultValue;
      },
      // 添加银行卡信息
      addBankCard: function(){
        this.resetBankInfo();
        this.dialog.visible = true;
        this.dialog.type = 'add';
      },
      resetBankInfo: function() {
        this.bankInfo = Object.assign(this.bankInfo,{
          CardID: '',
          Bank: '',//银行名称
          Specific: '',//开户行(支行)名称
          Name: '', //开户名
          Code: '', //银行账号
        });
        this.dialog.title = '添加银行卡';
        this.dialog.buttonText = '立即添加';
      },
      editBankCard: function(params){
        this.bankInfo = Object.assign(this.bankInfo,this.items[params.index]);
        this.dialog.title = '编辑银行卡';
        this.dialog.buttonText = '确定';
        this.dialog.visible = true;
        this.dialog.type = 'edit';
      },
      async deleteBankCard(param){
        const res = await deleteBankcard(param);
        if(res.data.ResultCode === '000000'){
          this.$message({
            type: 'success',
            message: res.data.ResultMessage
          });
          this.getBankInfo();
        } else {
          this.$message({
            type: 'error',
            message: res.data.ResultMessage
          });
        }
      },
      //删除银行卡
      deleteBankCardConfirm(params){
        this.$confirm("确定删除改银行卡?", "删除银行卡！", {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let param = {MemberID: this.$cookie.get("MemberID"), CardID: params.CardID};
          this.deleteBankCard(param);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      //单张银行卡操作弹窗的回调
      //param: status => boolean
      async callback(status){
        if(status) this.getBankInfo();
      }
    },
    mounted(){
      this.getBankInfo();
    },
    components:{bankCardItem,bankCardDialog}
  }
</script>
<style scoped>
  .bankcard-add {
    width: 280px;
    height: 198px;
    line-height: 200px;
    text-align: center;
    float: left;
    border:1px dashed #C3DBDC;
    background: #F2F5FA;
    font-size: 16px;
    color: #027CFF;
    margin: 0 10px 20px;
    border-radius: 4px;
    cursor: pointer;
  }
</style>