<template>
  <div class="footer-container">
    <div class="footer">
      <ul class="list">
        <li class="clear">
          <ul class="list-item">
            <li><a :href="webUrl" target="_blank">速达汇官网</a></li>
            <li><a :href="`${webUrl}/view/aboutus.html`" target="_blank">关于速达汇</a></li>
            <li><a :href="`${webUrl}/xieyi/wlyhxy.html#/yhxy`" target="_blank">用户协议</a></li>
            <li><a :href="`${webUrl}/xieyi/wlyhxy.html#/hzrm`" target="_blank">货主入门</a></li>
            <li><a :href="`${webUrl}/xieyi/wlyhxy.html#/wlgsrm`" target="_blank">物流公司入门</a></li>
            <li class="target">
              移动版-司机专用
              <div class="app">
                <img src="../../assets/images/app.png" alt="" width="150" height="150">
                <span class="arrow"></span>
              </div>
            </li>
            <li>
              全国服务热线：0571-57137790
            </li>
          </ul>
        </li>
        <li> 
          @2017-2018 速达汇 版权所有. All Rights Reserved.     
          <a class="police" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010902001961" target="_blank">
          <img src="../../assets/images/beian.png" alt="">
            浙公网安备 33010902001961号 
          </a>
           浙ICP备18017445号-1
        </li>
      </ul>
    </div>
  </div>
</template>


<script type="es6">
  import { webUrl } from "api/env";
  export default {
    data() {
      return {
        webUrl
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../assets/styles/variable.styl"
  .footer-container
    width: 100%
    background: #454545
    padding: 30px 0
    .footer
      width: 1200px
      margin: 0 auto
      .list
        > li
          margin-bottom: 10px
          height: 20px
          line-height: 20px
          color: #ffffff
          &:last-child
            margin-bottom: 0
      .list-item
        clear: both
        li
          cursor: pointer
          float: left
          margin-right: 60px
          color: #ffffff
          &:last-child
            float: right
          a
            color: #ffffff
            &:hover
              color: #027CFF

        .target
          position: relative
          margin: 0
          cursor: pointer
          &:hover .app
            display: block
          .app
            position: absolute
            top: -190px
            left: -33px
            z-index: 100
            display: none
            padding: 9px
            background-color: #fff
            border: 1px solid $borderColor
            .app-pic
              vertical-align: top
              width: 100px
              height: 100px
            .arrow
              position: absolute
              bottom: -32px
              left: 65px
              display: inline-block
              width: 0
              height: 0
              border: 16px solid transparent
              border-top-color: #fff
  .police
    color: #ffffff
    margin: 0 10px 0 30px
    &:hover
      color: $blue              
</style>
