<template>
  <div class="bankcard-list-item">
    <div class="bankcard-list-item_header">
        {{info.Bank}}
    </div>
    <div class="bankcard-list-item_body">
        {{'**** **** **** ' + info.Code.substr(-4)}}
    </div>
    <div class="bankcard-list-item_footer">
        {{info.Name}}
    </div>
    <div class="bankcard-hover" v-if="!getUserRole(userCharacter,'发货')">
      <div class="bankcard-hover-operate">
        <a href="javascript:;" class="bankcard-edit" @click="edit(info.CardID)">编辑</a>
        <a href="javascript:;" class="bankcard-del" @click="del(info.CardID)">删除</a>
      </div>
    </div>
  </div>

</template>

<script>
  import { getUserRole } from 'config/myUtils'
  export default {
    props: ['info','index'],
    data () {
      return {
        userCharacter: this.$cookie.get("MemberDutiesID")
      }
    },
    methods:{
      getUserRole: getUserRole,
      edit: function(CardID){
        this.$emit('editListener', {CardID: CardID, index: this.index});
      },
      del: function(CardID){
        this.$emit('delListener', {CardID: CardID, index: this.index});
      }
    }
  }
</script>

<style scoped>

  .bankcard-list-item {
    float: left;
    width: 280px;
    margin: 0 10px 20px;
    border: 1px solid #C3DBDC;
    font-size: 14px;
    border-radius: 4px;
    position:relative;
  }
  .bankcard-list-item_header,.bankcard-list-item_footer{
    background: #F2F5FA;
    padding: 0 10px;
    height: 50px;
    line-height: 50px;
  }
  .bankcard-list-item_body{
    height: 100px;
    line-height: 100px;
    text-align: center;
    font-size: 20px;
  }
  .bankcard-hover{
    position: absolute;
    top:0;
    left:0;
    bottom:0;
    right:0;
    background: rgba(51,51,51,0.55);
    border-radius: 4px;
    display: none;
  }
  .bankcard-hover-operate {
    position: absolute;
    bottom: 5px;
    width: 280px;
  }
  .bankcard-hover-operate a {
    display: inline-block;
    font-size: 14px;
    color: #FFFFFF;
    padding: 10px;
    float: right;
  }
  .bankcard-list-item:hover .bankcard-hover{
    display: block;
  }
</style>
