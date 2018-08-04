<template>
  <div>
    <head-top class="header">
      <span class="title" slot="index">{{userType == 1?'货主':'物流公司'}}-工作台</span>
      <div class="header-center" slot="menu">
        <head-menu-router activeLink="account"></head-menu-router>
      </div>
      <drop-down slot="info"></drop-down>
    </head-top>
    <div class="content clear">
      <div class="content-left">
        <left-menu-router-account activeLink="account"></left-menu-router-account>
      </div>
      <div class="content-right">
        <div class="main fr">
          <p class="title-box"><span class="title-name">账户安全</span></p>
          <div class="container">
            <div class="user">
              <span>登录账号：</span>{{mobile}}
              <div class="invite-wrapper">
                <div class="invite ">邀请码</div>
                <div class="invite inviteid">{{userInfo.InviteCode}}</div>
              </div>
            </div>
            <div class="change-content">
              <ul>
                <li>
                  <div class="left">
                    <img src="../../assets/images/pwd.png" alt="">
                  </div>
                  <div class="center">
                    <p class="mb-10">登录密码</p>
                    <p class="gray-txt size12">用户登录速达汇平台需要输入密码，可以修改编辑</p>
                  </div>
                  <div class="right">
                    <el-button class="changeBtn" type="primary" plain size="small" @click="isShowLog = true">修改
                    </el-button>
                  </div>
                </li>
                <li>
                  <div class="left">
                    <img src="../../assets/images/pwd.png" alt="">
                  </div>
                  <div class="center">
                    <p class="mb-10">支付密码</p>
                    <p class="gray-txt size12">用户在交易支付,提现等敏感操作时需要输入支付密码</p>
                  </div>
                  <div class="right">
                    <el-button class="changeBtn" type="primary" plain size="small" v-if="getUserRole(userCharacter,'管理')" @click="isShowPay = true">修改
                    </el-button>
                  </div>
                </li>
                <li>
                  <div class="left">
                    <!-- <img :src="avatar" v-if="avatar" class="avatar">
                    <img src="../../assets/images/avatar.png" alt="" v-else class="avatar"> -->
                    <img :src="imgUrl + this.avatar" v-if="this.avatar" class="avatar">
                    <img src="../../assets/images/avatar.png" alt="" v-else class="avatar">
                  </div>
                  <div class="center">
                    <p class="mb-10">修改头像</p>
                    <p class="gray-txt size12">用户头像，用于司机查看发货人信息展示，建议上传账户联系人正面照片以示正式</p>
                  </div>
                  <div class="right">
                    <el-upload
                      ref="upload"
                      :action="imgPostUrl"
                      :before-upload="BeforeUpload"
                      :auto-upload="true"
                      :multiple="false">
                      <el-button class="changeBtn" type="primary" plain size="small">上传
                      </el-button>
                    </el-upload>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <!--修改登录密码弹出层 start-->
          <el-dialog title="修改登陆密码" :visible.sync="isShowLog" width="500px"
                     :before-close="LogClose" :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="dialog">
              <el-form label-position="left" label-width="100px" status-icon
                       :model="changeLogData" :rules="changeLogRules" ref="changeLogData">
                <el-form-item label="旧密码" prop="OldPwd">
                  <el-input placeholder="请输入旧密码" type="password" v-model="changeLogData.OldPwd"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="NewPwd">
                  <el-input placeholder="请输入新密码" type="password" v-model="changeLogData.NewPwd"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="NewPwdCon">
                  <el-input placeholder="请确认新密码" type="password" v-model="changeLogData.NewPwdCon"></el-input>
                </el-form-item>
                <el-form-item class="mt-60">
                  <el-button round type="primary"
                             @click="Logsubmit('changeLogData')"
                             :disabled="hasCommit"
                             class="addBtn">确认修改
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-dialog>
          <!--修改登录密码弹出层 end-->
          <!-- 修改支付密码弹出层 start -->
          <el-dialog title="修改支付密码" :visible.sync="isShowPay" width="560px"
                     :before-close="PayClose" :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="dialog">
              <el-form label-position="left" ref="changePayData" :model="changePayData" :rules="changePayRules"
                       label-width="120px" status-icon>
                <el-form-item label="手机号码">
                  {{mobile}}
                </el-form-item>
                <el-form-item label="验证码" prop="Code">
                  <div class="code">
                    <el-input placeholder="请输入验证码" v-model="changePayData.Code"></el-input>
                  </div>
                  <el-button v-if="!sendStatus" type="primary"
                             @click="sendCode">发送验证码
                  </el-button>
                  <el-button v-else type="info" disabled>{{endTime}}s后重发</el-button>
                </el-form-item>
                <el-form-item label="确认密码" prop="PWD">
                  <el-input placeholder="请输入新密码" type="password" v-model="changePayData.PWD"></el-input>
                </el-form-item>
                <el-form-item label="再次确认密码" prop="PwdCon">
                  <el-input placeholder="请确认新密码" type="password" v-model="changePayData.PwdCon"></el-input>
                </el-form-item>
                <el-form-item class="mt-60">
                  <el-button round type="primary" class="addBtn" @click="Paysubmit('changePayData')">确认修改</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-dialog>
          <!-- 修改支付密码弹出层 end -->
        </div>
      </div>
    </div>
    <foot class="footer"></foot>
  </div>
</template>


<script type="es6">
import headTop from "components/header/head";
import dropDown from "components/header/children/dropdown";
import foot from "components/footer/foot";
import md5 from "js-md5";
import regs from "config/regExp";
import cookie from "cookiejs";
import {
  changeLoginPwd,
  changePayPwd,
  sendPayCode,
  PicUpload,
  updataAvatar,
  getUserInfo
} from "api/getData";
import { imgPostUrl, imgUrl } from "api/env";
import { mapGetters, mapMutations } from 'vuex';
import { getUserRole } from 'config/myUtils';
import headMenuRouter from 'components/headMenuRouter/headMenuRouter'; // 头部
import leftMenuRouterAccount from 'components/leftMenuRouter/leftMenuRouterAccount'; // 左侧

export default {
  data() {
    return {
      userType: this.$cookie.get("MemberCrowd"),
      userCharacter: this.$cookie.get("MemberDutiesID"),
      imgUrl,
      imgPostUrl,
      IconUrl: "",
      mobile: "",
      MemberID: this.$cookie.get("MemberID"),
      isShowLog: false, //是否登录密码显示
      isShowPay: false, //是否登录密码显示
      sendStatus: false, //验证码是否发送
      endTime: 0, //倒计时时间
      timer: null, //定时器
      hasCommit: false, //是否已提交
      changeLogData: {
        //修改支付密码数据
        OldPwd: "",
        NewPwd: "",
        NewPwdCon: ""
      },
      changePayData: {
        //修改支付密码数据
        Code: "",
        PWD: "",
        PwdCon: ""
      },
      changeLogRules: {
        //验证规则
        OldPwd: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
        NewPwd: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请再次输入密码"));
              } else if (value === this.changeLogData.OldPwd) {
                callback(new Error("新旧密码不能一样！"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        NewPwdCon: [
          { required: true, message: "请确认密码", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请再次输入密码"));
              } else if (value !== this.changeLogData.NewPwd) {
                callback(new Error("两次输入密码不一致!"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      },
      changePayRules: {
        //验证规则
        Code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { pattern: regs.Code, message: "请输入正确的验证码", trigger: "blur" }
        ],
        PWD: [{ required: true, message: "请输入新密码", trigger: "blur" }],
        PwdCon: [
          { required: true, message: "请确认密码", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请再次输入密码"));
              } else if (value !== this.changePayData.PWD) {
                callback(new Error("两次输入密码不一致!"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'avatar'
    ])
  },
  methods: {
    getUserRole: getUserRole,
    PayClose(done) {
      this.$refs.changePayData.resetFields();
      done();
    },
    LogClose(done) {
      this.$refs.changeLogData.resetFields();
      done();
    },
    //发送验证码
    sendCode() {
      let that = this;
      sendPayCode({ Mobile: this.mobile }).then(res => {
        that.sendStatus = true;
        if (res.data.ResultCode === "000000") {
          this.$message.success({ message: res.data.ResultMessage });
          that.sendStatus = true;
          that.endTime = 60;
          that.timer = setInterval(() => {
            that.endTime--;
            if (that.endTime === 0) {
              that.sendStatus = false;
              clearInterval(that.timer);
            }
          }, 1000);
        } else {
          that.sendStatus = false;
        }
      });
    },
    //头像上传
    BeforeUpload(file) {
      PicUpload(file)
        .then(res => {
          if (res.data.ResultCode === "000000" && res.data.ResultValue) {
            this.IconUrl = res.data.ResultValue;
            let req = {
              MemberID: this.MemberID,
              IconUrl: this.IconUrl
            };
            updataAvatar(req).then(res => {
              if (res.data.ResultCode === "000000") {
                this.$message.success({ message: res.data.ResultMessage });
                this.SET_avatar(this.IconUrl);
              }
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
      return false;
    },
    //登录密码修改提交
    async Logsubmit(changeLogData) {
      this.$refs[changeLogData].validate(async valid => {
        if (valid) {
          this.hasCommit = true;
          let req = {
            MemberID: this.MemberID,
            OldPWD: md5(this.changeLogData.OldPwd),
            NewPWD: md5(this.changeLogData.NewPwd)
          };
          let res = await changeLoginPwd(req);
          if (res.data.ResultCode === "000000") {
            this.$message.success({ message: res.data.ResultMessage });
            this.$refs[changeLogData].resetFields();
            this.isShowLog = false;
            this.$router.push("/");
            this.$cookie.delete("MemberMerchantID");
            this.$cookie.delete("MemberID");
            this.$cookie.delete("MemberCrowd");
          }
          this.hasCommit = false;
        }
      });
    },
    //支付密码修改提交
    async Paysubmit(changePayData) {
      this.$refs[changePayData].validate(async valid => {
        if (valid) {
          this.hasCommit = true;
          let req = {
            MemberID: this.MemberID,
            SmsCode: this.changePayData.Code,
            PayPWD: md5(this.changePayData.PWD)
          };
          let res = await changePayPwd(req);
          if (res.data.ResultCode === "000000") {
            this.$message.success({ message: res.data.ResultMessage });
            this.$refs[changePayData].resetFields();
            this.isShowPay = false;
          }
          this.hasCommit = false;
        }
      });
    },
    ...mapMutations({
      SET_avatar: 'SET_avatar'
    })
  },
  created() {
    if (this.$cookie.get("MemberID")) {
      this.mobile = this.$cookie.get("Mobile");
    } else {
      this.$message.info({ message: "你尚未登录，请登录！" });
      this.$router.push("/");
    }
  },
  components: {
    headTop,
    dropDown,
    foot,
    headMenuRouter,
    leftMenuRouterAccount
  }
};
</script>

<style lang="stylus" scoped>
@import '../../assets/styles/variable.styl';

.content {
  height: 100%;
  width: 1200px;
  margin: 10px auto 40px;
  position: relative;
}

.content-left {
  float: left;
  width: 200px;
  min-height: $minHeight;
  background: #ffffff;

  > ul {
    > li {
      height: 30px;
      line-height: 30px;
      padding-left: 40px;
      margin: 10px 0;
      border-left: 3px solid transparent;

      &:hover {
        border-left-color: $blue;
        color: $blue;
        cursor: pointer;
      }
    }

    .active {
      border-left-color: $blue;
      color: $blue;
    }
  }
}

.content-right {
  float: right;
  width: 990px;
  background-color: #fff;

  .main {
    background: #FFFFFF;
    width: 100%;
    min-height: $minHeight

    .title-box {
      box-shadow: 0 1px 0 0 #E0E0E0;
    }

    .title-name {
      display: inline-block;
      padding-left: 20px;
      height: 30px;
      line-height: 30px;
      margin: 10px 0;
      border-left: 3px solid $blue;
    }

    .container {
      margin: 30px 40px;
    }
  }
}

.change-content {
  margin: 30px 0 0 0;
  padding: 0 20px;

  ul {
    li {
      padding: 15px 0;
      margin-top: 10px;
      overflow: hidden;
    }
  }

  .left {
    float: left;
    width: 50px;
    height: 50px;
    line-height: 50px;
    margin-right: 40px;
    text-align: center;
    font-size: 26px;
    color: #ffffff;
    border-radius: 50%;
    overflow: hidden;
  }

  .green-bg {
    background-color: #92F1A2;
  }

  .orange-bg {
    background-color: #FBB372;
  }

  .center {
    float: left;
  }

  .right {
    float: right;
    height: 50px;
    line-height: 50px;
  }

  .avatar {
    width: 50px;
    height: 50px;
    vertical-align: top;
  }
}

.user {
  height: 90px;
  line-height: 90px;
  padding-left: 20px;
  border: 1px solid $borderColor;
  position: relative
}

.code {
  float: left;
  width: 50%;
  margin-right: 10px;
}

.code-btn {
  float: right;
  width: 100px;
}

.dialog {
  padding: 0 30px;
}

.changeBtn {
  width: 120px;
}

.addBtn {
  width: 200px;
}
.invite-wrapper {
  position: absolute;
  top: 25px;
  right: 20px;
}
.invite {
  background: #D8F2FE;
  border: 1px solid #9FD9F3;
  border-radius: 4px;
  font-size: 12px;
  color: #027CFF;
  text-align: center;
  width: 68px;
  height: 28px;
  line-height: 28px;
  float: left;
}
.inviteid {
  background: #fff;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  margin-left: -2px;
}
</style>
