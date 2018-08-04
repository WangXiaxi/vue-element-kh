<!--
  **首页左侧栏目公共组件
-->

<template>
  <ul>
    <router-link tag="li" v-if="userType == 2" to="/add" :class="{active: activeLink === 'add'}">发布货源</router-link>
    <router-link tag="li" v-if="userType == 1" to="/source" :class="{active: activeLink === 'source'}">发布货源</router-link>

    <router-link tag="li" v-if="userType == 2" to="/orderList" :class="{active: activeLink === 'orderList'}">货源列表</router-link>
    <router-link tag="li" v-if="userType == 1" to="/sourceList" :class="{active: activeLink === 'sourceList'}">货源列表</router-link>

    <router-link tag="li" v-if="userType == 1" to="/product" :class="{active: activeLink === 'product'}">产品库</router-link>
    <router-link tag="li" v-if="userType == 2" to="/goodsManage" :class="{active: activeLink === 'goodsManage'}">货物统计</router-link>
    <router-link tag="li" v-if="userType == 2" to="/waybill" :class="{active: activeLink === 'waybill'}">运单</router-link>
    <router-link tag="li" v-if="userType == 2" to="/specialLine" :class="{active: activeLink === 'specialLine'}">物流专线</router-link>
  </ul>
</template>

<script>
  export default {
    props:['activeLink'],
    data () {
      return {
        userType: this.$cookie.get('MemberCrowd')
      }
    },
    created () {
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
