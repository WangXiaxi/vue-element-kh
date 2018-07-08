<template>
  <ul>
    <router-link tag="li" to="/rechargelist" :class="activeLink === 'balance' ? 'active' : ''">账户余额</router-link>
    <router-link tag="li" to="/paylist" v-if="userType == 1" :class="activeLink === 'pay' ? 'active' : ''">物流运费账单</router-link>
    <router-link tag="li" to="/tradeList" v-if="userType == 2" :class="activeLink === 'pay' ? 'active' : ''">交易账单</router-link>
    <router-link tag="li" to="/bankcard" :class="activeLink === 'bankcard' ? 'active' : ''">银行卡管理</router-link>
  </ul>
</template>

<script>
  export default {
    props:['userType','activeLink'],
  }
</script>

<style lang="stylus"  scoped>
  @import '../../assets/styles/variable.styl';
  .content-left {
    float: left;
    width: 200px;

    > ul {
        position: absolute;
        height: 100%;
        width: 200px;
        background: #ffffff;

      > li {
          height: 30px;
          line-height: 30px;
          padding-left: 40px;
          margin: 10px 0;
          border-left: 3px solid transparent;

      &:hover {
         border-left-color: $blue;
         color: $blue;
         cursor: pointer;
       }
      }

      > li.router-link-active,li.active {
        border-left-color: $blue;
        color: $blue;
      }
    }
  }
</style>
