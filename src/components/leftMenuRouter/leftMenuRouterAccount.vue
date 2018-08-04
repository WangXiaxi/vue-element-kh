<!--
  **账户信息左侧栏目公共组件
-->

<template>
  <ul>
    <router-link to="/account" tag="li" :class="{active : activeLink === 'account'}">账户安全</router-link>
    <router-link to="/subAccount" tag="li" v-if="getUserRole(userCharacter,'管理')" :class="{active : activeLink === 'subAccount'}">会员用户管理</router-link>
    <router-link :to="userType == 1 ? '/blacklistFactory' : '/blacklistLogistics'" tag="li" :class="{active : activeLink === 'black'}">黑名单管理</router-link>
    <router-link to="/settled2" tag="li" :class="{active : activeLink === 'settle'}">入驻信息</router-link>
  </ul>
</template>

<script>
  import { getUserRole } from 'config/myUtils';
  export default {
    props:['activeLink'],
    data () {
      return {
        userCharacter: this.$cookie.get("MemberDutiesID"),
        userType: this.$cookie.get('MemberCrowd')
      }
    },
    created () {
    },
    methods: {
      getUserRole: getUserRole
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../assets/styles/variable.styl'
  .content-left
    float: left
    width: 200px
    >ul
      position: absolute
      height: 100%
      width: 200px
      background: #ffffff
      >li
        height: 30px
        line-height: 30px
        padding-left: 40px
        margin: 10px 0
        border-left: 3px solid transparent
        &:hover
           border-left-color: $blue
           color: $blue
           cursor: pointer
      >li.router-link-active, li.active
        border-left-color: $blue
        color: $blue
</style>
