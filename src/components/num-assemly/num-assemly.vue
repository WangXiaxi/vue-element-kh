<template>
  <div class="num-assemly el-picker-panel">
    <div class="el-time-panel__content has-seconds">
      <div class="el-time-spinner has-seconds">
      <div class="el-time-spinner__wrapper el-scrollbar">
        <div class="el-scrollbar__wrap" @scroll="goscroll" ref="scrollEl" style="max-height: inherit;">
          <el-carousel trigger="click" :autoplay="false">
            <el-carousel-item>
              <ul class="el-scrollbar__view el-time-spinner__list" ref="scrollbar">
                <li class="el-time-spinner__item" @click="changeNum(item)" :class="{cur: num === Number(item)}" v-for="item in data1">{{item}}</li>
              </ul>
            </el-carousel-item>
            <el-carousel-item>
              <ul class="el-scrollbar__view el-time-spinner__list" ref="scrollbar">
                <li class="el-time-spinner__item" @click="changeNum(item)" :class="{cur: num === Number(item)}" v-for="item in data2">{{item}}</li>
              </ul>
            </el-carousel-item>
            <el-carousel-item>
              <ul class="el-scrollbar__view el-time-spinner__list" ref="scrollbar">
                <li class="el-time-spinner__item" @click="changeNum(item)" :class="{cur: num === Number(item)}" v-for="item in data3">{{item}}</li>
              </ul>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <!---->
      </div>
    </div>
  </div>
</template>

<script type="es6">
  export default {
    props: {
      dataCur: {
        type: Object,
        default: {}
      }
    },
    data () {
      return {
        data1: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35'],
        data2: [ '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70'],
        data3: [ '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100'],
        num: 0
      }
    },
    created () {
      this.num = 0
    },
    methods: {
      changeNum (num) {
        this.num = Number(num)
        this.$emit("getNum", this.num, this.dataCur)
      },
      goscroll (e) { // 投机解决滚动到最底部导致 还会触发浏览器默认事件
        let scrollbarHeight = this.$refs.scrollbar.offsetHeight
        if (this.$refs.scrollEl.scrollTop > 460) {
          this.$refs.scrollEl.scrollTop = 459
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../assets/styles/variable.styl"
  .num-assemly.el-picker-panel
    box-shadow: none
    border: none
    padding-bottom: 10px
    .el-time-panel__content
      width: 100%
    .el-time-spinner.has-seconds .el-time-spinner__wrapper
      width: 100%
    .el-time-spinner__list::after, .el-time-spinner__list::before
      height: 0
    .el-scrollbar__view.el-time-spinner__list
      overflow: hidden
    .el-time-spinner__item
      width: 20%
      float: left
    .el-time-spinner__item.cur
      color: #fff
      background-color: #409eff
    .el-scrollbar__wrap
      overflow: hidden
    .el-time-spinner__wrapper
      max-height: 220px
    .el-carousel
      padding-left: 10px
      padding-right: 10px
</style>

<style lang="stylus">
.num-assemly.el-picker-panel
  user-select: none
  .el-carousel__container
    height: 220px
  .el-carousel__arrow--left
    left: -10px
  .el-carousel__arrow--right
    right: -10px
  .el-carousel__item.is-animating
    transition: transform .4s ease-in-out, opacity .4s ease-in-out
    opacity: 0
    &.is-active
      opacity: 1
  .el-carousel__indicators
    display: none
</style>