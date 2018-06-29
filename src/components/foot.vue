<template>
  <div class="footer-container">
    <div class="footer">
      <ul class="list">
        <li class="clear">
          <ul class="list-item">
            <li><a href="../" target="_blank">首页</a></li>
            <li><a href="../view/business.html">业务介绍</a></li>
            <li><a href="../view/join.html">合作加盟</a></li>
            <li><a href="../view/information.html">新闻资讯</a></li>
            <!-- <li>用户协议</li> -->
            <li><a href="../xieyi/wlyhxy.html#/hzrm">物流公司入门</a></li>
            <li><a href="../xieyi/wlyhxy.html#/wlgsrm">货主入门</a></li>
            <li><a href="../xieyi/wlyhxy.html#/yhxy">用户协议</a></li>
            <li><a href="../xieyi/wlyhxy.html#/request">用户问答</a></li>
            <li>
              <p>全国服务热线： 0571-57137790</p>
              <p style="margin-top: 5px;">全国招商热线： 0571-57177171</p>
            </li>
          </ul>
        </li>
        <li class="last-a">
          @2017-2018 速达汇 版权所有. All Rights Reserved. 浙ICP备18017445号-1
          <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010902001961">&nbsp;&nbsp;<img :src="imglink[0].src"/>&nbsp;&nbsp;浙公网安备 33010902001961号</a>&nbsp;&nbsp;浙ICP备18017445号-1
        </li>
      </ul>
    </div>
  </div>
</template>


<script type="es6">
  export default {
    data () {
      return {
        imglink: [
          {src: require('../assets/beian.png')}
        ]
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .footer-container
    font-family: 'Microsoft YaHei'
    width: 100%
    background: #454545
    padding: 30px 0
    font-size: 12px
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
          font-family: 'Microsoft YaHei'
          &:last-child
            float: right
          a
            color: #ffffff
            font-family: 'Microsoft YaHei'
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
            top: -140px
            left: -8px
            z-index: 100
            display: none
            padding: 9px
            background-color: #fff
            .app-pic
              vertical-align: top
              width: 100px
              height: 100px
            .arrow
              position: absolute
              bottom: -32px
              left: 40px
              display: inline-block
              width: 0
              height: 0
              border: 16px solid transparent
              border-top-color: #fff
      .last-a a
        color: #ffffff
        &:hover
          color: #027CFF
</style>
