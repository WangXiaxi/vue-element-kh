<template>
  <div>
    <!--<el-dropdown trigger="click" v-if="userType == 1">-->
      <!--<div class="msg">-->
        <!--<el-badge is-dot class="el-dropdown-link">-->
          <!--<i class="el-icon-bell bell el-icon&#45;&#45;right"></i>-->
        <!--</el-badge>-->
      <!--</div>-->
      <!--<el-dropdown-menu slot="dropdown">-->
        <!--<el-dropdown-item class="clearfix">-->
          <!--评论-->
          <!--<el-badge class="mark" :value="12"/>-->
        <!--</el-dropdown-item>-->
        <!--<el-dropdown-item class="clearfix">-->
          <!--回复-->
          <!--<el-badge class="mark" :value="3"/>-->
        <!--</el-dropdown-item>-->
      <!--</el-dropdown-menu>-->
    <!--</el-dropdown>-->
    <el-dropdown class="fr" trigger="click">
      <div class="el-dropdown-link avatar">
        <!-- <img v-if="userInfo.IconUrl" :src="url+ userInfo.IconUrl">
        <img v-else src="../../../assets/images/avatar.png"> -->
        <img v-if="this.avatar" :src="url+ this.avatar" :onerror="errorImg">
        <img v-else src="../../../assets/images/avatar.png">
      </div>
      <el-dropdown-menu slot="dropdown" class="dropdown">
        <el-dropdown-item class="clearfix user-name orange-text">
          {{userInfo.MerchantName}}
        </el-dropdown-item>
        <el-dropdown-item class="clearfix" v-if="userType == 1 && checkStatue == 2">
          <router-link to="/sourceList" tag="p">我的货源列表</router-link>
        </el-dropdown-item>
        <el-dropdown-item class="clearfix" v-if="userType == 1 && checkStatue == 2">
          <router-link to="/product" tag="p">产品库</router-link>
        </el-dropdown-item>
        <el-dropdown-item class="clearfix" v-if="checkStatue == 2">
          <router-link to="/finaindex" tag="p">账户余额￥（{{userInfo.Balance?userInfo.Balance:0}}）</router-link>
        </el-dropdown-item>
        <el-dropdown-item class="clearfix">
          <p @click="exit">退出登陆</p>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 蒙层 1.0.62 物流公司并且用户审核通过 start -->
    <special-line-m-c v-if="checkStatue == 2 && userType == 2"></special-line-m-c>
    <!-- 蒙层 1.0.62 end -->
  </div>
</template>


<script>
import { getUserInfo } from "api/getData";
import { imgUrl } from "api/env";
import cookie from "cookiejs";
import { removeStore } from "config/myUtils";
import { mapGetters, mapMutations } from 'vuex';
import specialLineMC from "components/mongolianLayer/specialLineMC";
import { dropOut } from "config/dropOut";


export default {
  data() {
    return {
      errorImg: 'this.src="' + require('../../../assets/images/errorimg.png') + '"',
      userType: this.$cookie.get("MemberCrowd"),
      checkStatue: this.$cookie.get("MerchantStatus"),
      userInfo: {
        Balance: "",
        MerchantName: "",
        IconUrl: ""
      },
      url: imgUrl
    };
  },
  computed: {
    ...mapGetters([
      'avatar'
    ])
  },
  methods: {
    //退出
    exit() { // 登录页有清空数据操作
      dropOut(); // 清除各种数据
      this.$router.push("/");
    },
    ...mapMutations({
      SET_avatar: 'SET_avatar',
      SET_userInfo: 'SET_userInfo'
    })
  },
  created() {
    if (this.$cookie.get("MemberID")) {
      getUserInfo({ MemberID: this.$cookie.get("MemberID") })
        .then(res => {
          if (res.data.ResultCode === "000000" && res.data.ResultValue) {
            this.userInfo = res.data.ResultValue;
            this.SET_avatar(res.data.ResultValue.IconUrl);
            this.SET_userInfo(res.data.ResultValue);
            let host = window.location.href.indexOf("sdhwlw.com") > -1 ? 'sdhwlw.com' : window.location.hostname;
            cookie("MemberCrowd", String(res.data.ResultValue.Crowd), {
              expires: 30,
              path: "/",
              domain: host
            });
            cookie("MemberMerchantID", String(res.data.ResultValue.MerchantID), {
                expires: 30,
                path: "/",
                domain: host
              }
            );
            cookie("MemberID", String(res.data.ResultValue.MemberID), {
              expires: 30,
              path: "/",
              domain: host
            });
            cookie("Mobile", String(res.data.ResultValue.Mobile), {
              expires: 30,
              path: "/",
              domain: host
            });
            cookie("MemberDutiesID", String(res.data.ResultValue.Duties), {
                expires: 30,
                path: "/",
                domain: host
              }
            );
            cookie("MerchantStatus", String(res.data.ResultValue.AuditValue), {
                expires: 30,
                path: "/",
                domain: host
              }
            );
          }
        })
        .catch(err => {
          console.log(err);
        });
      if (this.$router.currentRoute.name == "settled" || this.$router.currentRoute.name == "addCar") {
        this.MemberID = this.$cookie.get("MemberID");
      } else if(this.$cookie.get("MerchantStatus") != 2){
        this.$router.push("/settled");
      }
    } else {
      this.$message.info({ message: "你尚未登录，请登录！" });
      this.$router.push("/");
    }
  },
  components: {
    specialLineMC
  }
};
</script>

<style lang="stylus" scoped>
.bell
  font-size: 25px
  cursor: pointer
.userName
  max-width: 600px
.msg
  float: left
  margin: 27px 30px 0 0
  line-height: normal
  cursor: pointer
.avatar
  float: right
  height: 48px
  line-height: 48px
  margin-top: 14px
  border-radius: 50%
  cursor: pointer
  overflow: hidden
  img
    width: 48px
    height: 48px
    display: block
.dropdown
  width: 220px
.user-name
  border-bottom: 1px solid $borderColor
</style>
