<template>
  <div class="update-container">
    <img :src="img" alt="">
  </div>
</template>
<script>
import m_login from '@/mixins/m_login'
export default {
  mixins: [m_login],
  data(){
     return {
         img: require('../../assets/images/su_word.png') //server_update@1x.png 无文字版
     }
  },
  methods: {
    checkServer(){
        let _ = this;
        setTimeout(function(){
            _.checkServer();
        },3000)
    }
  },
  mounted(){
      this.checkServer();
  },
  components:{},

}
</script>
<style scoped>
  .update-container {
    background: #F7FBFB;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }
  .update-container img {
    display: block;
    margin: 0 auto;
    width: 1120px;
    height: 530px;
    position: relative;
    top: 50%;
    left: 50%;
    margin-left: -560px;
    margin-top: -265px;;
  }
</style>
