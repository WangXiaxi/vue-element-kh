/**
 * Created by ydiego on 19/7/2018.
 */

export default{
  data() {
    return {
      userType: this.$cookie.get('MemberCrowd'),
      userCharacter: this.$cookie.get('MemberDutiesID'),
      MemberID: this.$cookie.get('MemberID'),
      MemberMerchantID: this.$cookie.get('MemberMerchantID'),
    }
  },
  methods: {
    /**
     * Function 身份类型校验
     * @params
     * userType{Number} 身份类型
     * path{String} 身份类型校验错误后的跳转路径
     * cb{Function}  回调函数
     * @return boolean 因为route.push之后  后面的代码也会执行 通过返回值判断下
     * */
    checkLoginIdentity(userType, path, cb) {
      let route = path || '/';
      if (parseInt(this.userType) !== userType) { // 判断身份类型
        this.$message({
          type: 'error',
          message: '身份类型错误！'
        });
        this.$router.push(route);
        return false;
      }
      typeof cb === 'function' && cb();
      return true;
    },
    /**
     * Function 是否登录判断
     * @return boolean
     * */
    checkLoginStatus(){
      if (!this.$cookie.get("MemberID")) {
        this.$message.info({ message: "你尚未登录，请登录！" });
        this.$router.push("/");
        return false;
      }
      return true;
    }
  }

};
