<template>
  <div class="header-container">
    <div class="head">
      <div class="head-left">
        <span class="fl">
          <a :href="webUrl" target="_blank"><img src="../../assets/images/logo.png" alt="速达汇" width="50"
                                                               height="50" title="速达汇"></a>
        </span>
        <span class="size20 ml-10">速达汇</span>
        <slot name="login"></slot>
        <slot name="settled"></slot>
        <slot name="index"></slot>
      </div>
      <slot name="menu"></slot>
      <div class="head-right">
        <slot name="to_login"></slot>
        <slot name="edit"></slot>
        <slot name="info"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  import { webUrl } from "api/env"

  export default {
    data () {
      return {
        webUrl
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../assets/styles/variable.styl"
  .header-container
    width: 100%
    height: 70px
    line-height: 70px
    background-color: #fff
    // box-shadow: 0 4px 10px 10px #f6f6f6
    .head
      height: 70px
      line-height: 70px
      width: 1200px
      margin: 0 auto

  .head-left
    float: left
    img
      width: 50px
      height: 50px
      vertical-align: middle
    .title
      display: inline-block
      height: 40px
      line-height: 40px
      padding-left: 20px
      margin-left: 20px
      font-size: 20px
      border-left: 1px solid $borderColor

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

  .head-right
    float: right
    height: 70px
    line-height: 70px
    overflow: hidden
    .to-login
      display: inline-block
      height: 40px
      line-height: 40px
      padding: 0 16px
      font-size: 16px
      color: $blue
      border: 1px solid $blue
      border-radius: 4px
      cursor: pointer
</style>
