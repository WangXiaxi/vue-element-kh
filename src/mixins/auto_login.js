/**
 * 自动登录mixins
 */
import { dropOut } from "config/dropOut";

export default {
  data() { // 
    return {
      userType: this.$cookie.get('MemberCrowd'),
      MemberID: this.$cookie.get('MemberID'),
      Token: this.$cookie.get('Token')
    }
  },
  methods: {
    automaticLogon () { // 自动登录
      let _ = this;
      console.log(_.userType)
      if (_.MemberID && _.Token) {
        switch (Number(_.userType)) {
          case 1:
          _.$router.push('/source');
          return true;
          break;
          case 2:
          _.$router.push('/add');
          return true;
          break;
          default:
          dropOut(); // 清除各种数据 正常不会进入
        }
        return false;
      }
    }
  }
}