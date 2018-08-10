<template>
  <div class="update-container">
    <img :src="img" alt="">
  </div>
</template>
<script>
import m_login from '@/mixins/m_login'
import { HeartBeat } from 'api/getData'
export default {
  mixins: [m_login],
  data(){
    return {
      img: require('../../assets/images/su_word.png'), //server_update@1x.png 无文字版
      timeid: ''
    }
  },
  methods: {
    async checkServer(){
        let _ = this;
        const { data: { ResultCode, ResultValue} } = await HeartBeat({});
        if(ResultValue){
            _.$router.replace('/');
            return;
        }
        _.timeid = setTimeout(function(){
          _.checkServer();
        }, 30000)
    }
  },
  mounted(){
      this.checkServer();
  },
  components:{},
  beforeDestroy () { // 二次防护 上一步加return应该不会再进入这里了
    if (this.timeid) {
      clearTimeout(this.timeid);
    }
  }
}
</script>
<style lang="stylus" scoped>
  .update-container
    background: #F7FBFB
    position: absolute
    left: 0
    top: 0
    right: 0
    bottom: 0
  .update-container img
    display: block
    margin: 0 auto
    width: 1120px
    height: 530px
    position: relative
    top: 50%
    left: 50%
    margin-left: -560px
    margin-top: -265px
</style>
