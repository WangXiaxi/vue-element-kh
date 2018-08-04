<!--
  **头部栏目公共组件
-->
<template>
  <ul>
    <router-link tag="li" :to="m.href" v-for="m in menu" :class="m.active === activeLink ? 'active' : ''" :key="m.href">{{m.name}}</router-link>
  </ul>
</template>

<script>
  export default {
      props:['activeLink'],
      data(){
          return {
              menu:[
                {
                  href: this.$cookie.get('MemberCrowd') == 1 ? '/source' : '/add',
                  name: '首页',
                  active: 'index'
                },
                {
                  href: '/finaindex',
                  name: '财务管理',
                  active: 'finaindex'
                },
                {
                  href: '/account',
                  name: '账户信息',
                  active: 'account'
                },
              ]
          }
      }
  }
</script>

<style lang="stylus" scoped>
  @import '../../assets/styles/variable.styl';
  .header-center
    float: left
    margin-left: 20px
    ul
      overflow: hidden
      li
        height: 67px
        line-height: 67px
        float: left
        width: 150px
        font-size: 18px
        text-align: center
        border-bottom: 3px solid transparent
        cursor: pointer
        &:hover
          border-bottom-color: $blue
          color: $blue
      .active
        border-bottom-color: $blue
        color: $blue
</style>
