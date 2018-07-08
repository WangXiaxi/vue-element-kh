<template>
  <div>
    <head-top>
      <span class="title" slot="index">{{userType == 1?'货主':'物流公司'}}-工作台</span>
      <div class="header-center" slot="menu">
        <ul>
          <router-link tag="li" to="/source" v-if="userType == 1">首页</router-link>
          <router-link tag="li" to="/add" v-else>首页</router-link>
          <router-link tag="li" to="/finaindex">财务管理</router-link>
          <router-link tag="li" to="/account" class="active">账户信息</router-link>
        </ul>
      </div>
      <drop-down slot="info"></drop-down>
    </head-top>
    <div class="content clear">
      <div class="content-left">
        <ul>
          <router-link to="/account" tag="li">账户安全</router-link>
          <router-link to="/subAccount" tag="li" class="active" v-if="getUserRole(userCharacter,'管理')">会员用户管理</router-link>
          <router-link :to="userType == 1 ? '/blacklistFactory' : '/blacklistLogistics'" tag="li">黑名单管理</router-link>
          <router-link to="/settled2" tag="li">入驻信息</router-link>
        </ul>
      </div>
      <div class="content-right" v-loading="loading">
        <div class="main fr">
          <p class="title-box"><span class="title-name">会员用户管理</span></p>
          <!--列表内容 start-->
          <div class="container clear">
            <el-table
              stripe
              center
              size="small"
              :data="userList"
            >
              <el-table-column
                label="账户信息"
                width="300">
                <template slot-scope="scope">
                  <p>{{scope.row.Mobile}}</p>
                  <p>{{scope.row.Name}}</p>
                </template>
              </el-table-column>
              <el-table-column
                label="角色 | 创建时间"
                width="240">
                <template slot-scope="scope">
                  <p>{{scope.row.Duties.Name}}</p>
                  <p>{{scope.row.Create}}</p>
                </template>
              </el-table-column>
              <el-table-column
                width="150"
                label="状态">
                <template slot-scope="scope">
                  <p class="orange-text" v-if="scope.row.Status==0">未审核</p>
                  <p class="orange-text" v-if="scope.row.Status==2">使用中</p>
                  <p class="orange-text" v-if="scope.row.Status==-1">审核未通过</p>
                  <p class="orange-text" v-if="scope.row.Status==-2">已禁用</p>
                </template>
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <p class="blue-txt cuspoint" v-if="getUserRole(scope.row.Duties.DutiID,'管理') && scope.row.Status == 2" @click="changeInfo(scope.row,0)">修改基本信息</p>
                  <p class="blue-txt cuspoint" v-if="!getUserRole(scope.row.Duties.DutiID,'管理')" @click="changeInfo(scope.row,2)">编辑基本信息</p>
                  <p class="blue-txt cuspoint" v-if="!getUserRole(scope.row.Duties.DutiID,'管理') && scope.row.Status == 2" @click="disabledUser(scope.row.MembID,2)">作废账号</p>
                  <p class="blue-txt cuspoint" v-if="!getUserRole(scope.row.Duties.DutiID,'管理') && scope.row.Status == -2" @click="disabledUser(scope.row.MembID,1)">启用账号</p>
                </template>
              </el-table-column>
            </el-table>
            <p class="add-content"><span class="cuspoint" @click="changeInfo(1,1)">+添加新员工</span></p>
            <!--列表内容 end-->
            <!--分页 start -->

            <!--添加弹出层 start-->
            <el-dialog :title="title" :visible.sync="isShowAdd" width="600px" :close-on-click-modal="false" :close-on-press-escape="false" status-icon>
              <div class="dialog">
                <el-form label-position="left" label-width="100px" :model="editInfo" :rules="editInfoRules" ref="editInfo">
                  <el-form-item label="员工姓名" prop="StaffName">
                    <el-input placeholder="请输入员工名称" v-model="editInfo.StaffName"></el-input>
                  </el-form-item>
                  <el-form-item label="手机号码" prop="Mobile">
                    <el-input placeholder="请输入员工手机号码" v-model="editInfo.Mobile"></el-input>
                  </el-form-item>
                  <el-form-item label="短信验证码" prop="SmsCode" v-if="this.editInfo.Type ==1 && isShowCode">
                    <div class="code">
                      <el-input placeholder="输入短信验证码" v-model="editInfo.SmsCode"></el-input>
                    </div>
                     <el-button v-if="!sendStatus" :type="!rightPhoneNumber?'info':'primary'" :disabled="!rightPhoneNumber"
                             @click="sendCode">发送验证码</el-button>
                    <el-button v-else type="info" disabled>{{endTime}}s后重发</el-button>
                  </el-form-item>
                  <el-form-item label="登录密码" prop="LoginPwd1" v-if="this.editInfo.Type ==1">
                    <el-input placeholder="请设置员工登录密码" type="password" v-model="editInfo.LoginPwd1"></el-input>
                  </el-form-item>
                  <el-form-item label="确认密码" prop="LoginPwd2" v-if="this.editInfo.Type ==1">
                    <el-input placeholder="请确认员工登录密码" type="password" v-model="editInfo.LoginPwd2"></el-input>
                  </el-form-item>
                  <el-form-item label="员工角色" prop="Role">
                    <el-radio v-model="editInfo.Role" label="e5e0a063973649adb37283b9ce485cb1">财务(充值提现)</el-radio>
                    <el-radio v-model="editInfo.Role" label="0922c79be52f49948b9c1985c487c8af">发货员(抢单发货)</el-radio>
                  </el-form-item>
                  <el-form-item class="mt-60">
                    <el-button round type="primary" class="addBtn" @click="saveInfo('editInfo')" :disabled='hasCommit'>确认提交</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-dialog>
            <!--添加弹出层 end-->

            <!--修改管理员弹出层 start-->
            <el-dialog title="修改基本信息" :visible.sync="isShowEdit" :close-on-click-modal="false" :close-on-press-escape="false" status-icon  width="500px">
              <div class="dialog">
                <el-form label-position="left" label-width="100px" :model="editInfo"  ref="editInfo" :rules="editInfoRules" >
                  <el-form-item label="员工姓名" prop='StaffName'>
                    <el-input placeholder="请输入员工名称" v-model="editInfo.StaffName"></el-input>
                  </el-form-item>
                  <el-form-item label="手机号码" prop='Mobile'>
                    <el-input placeholder="请输入手机号码" v-model="editInfo.Mobile">
                    </el-input>
                  </el-form-item>
                  <el-form-item label="员工角色">{{editInfo.boss}}</el-form-item>
                  <el-form-item class="mt-60">
                    <el-button round type="primary" class="addBtn" :disabled='hasCommit' @click="saveAdmin('editInfo')">立即保存</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-dialog>
            <!--修改管理员弹出层 end-->
          </div>
          <div class="text-center mt-60">
              <el-pagination
                background
                @current-change="handleCurrentChange"
                :page-size="req.PageSize"
                :current-page.sync="req.PageIndex"
                layout="total, prev, pager, next"
                :total="req.TotalRecords">
              </el-pagination>
          </div>
            <!--分页 end -->
        </div>
      </div>
    </div>
    <foot></foot>
  </div>
</template>


<script type="es6">
import headTop from "components/header/head";
import dropDown from "components/header/children/dropdown";
import foot from "components/footer/foot";
import regs from "config/regExp";
import md5 from "js-md5";
import {
  getSubAccountList,
  editAdminInfo,
  addUser,
  changeUserStatus,
  getCode,
  hasExist
} from "api/getData";
import { getUserRole } from 'config/myUtils';
export default {
  data() {
    return {
      loading: false,
      userCharacter: this.$cookie.get('MemberDutiesID'),
      userList: [],
      title: "添加新员工",
      hasCommit: false, //是否已提交
      userType: this.$cookie.get("MemberCrowd"),
      type: "1", //员工角色
      isShowCode: true,//是否显示发送验证码
      isShowAdd: false, //是否显示添加弹出层
      isShowEdit: false, //是否显示编辑弹出层
      sendStatus: false, //验证码是否发送
      endTime: 0, //倒计时时间
      timer: null, //定时器
      editInfo: {
        //编辑提交信息
        MemberID: this.$cookie.get("MemberID"),
        MerchantsID: this.$cookie.get("MemberMerchantID"),
        IP: "192.168.1.1",
        boss: '',
        StaffID: "",
        StaffName: "",
        SmsCode: '',
        Role: "",
        Mobile: "",
        Type: "",
        LoginPwd: "",
        LoginPwd1: ""
      },
      req: {
        //获取账号列表请求数据
        MemberID: this.$cookie.get("MemberID"),
        MerchantsID: this.$cookie.get("MemberMerchantID"),
        PageIndex: 1,
        PageSize: 10,
        TotalRecords: 0
      },
      editInfoRules: {
        //新增/编辑 from验证规则
        StaffName: [
          { required: true, message: "请输入员工名称", trigger: "blur" }
        ],
        Mobile: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          { pattern: regs.Phone, message: "请输入正确的电话号码！", trigger: "blur" }
        ],
        SmsCode: [
          { required: true, message: "请输入短信验证码", trigger: "blur" },
          { pattern: regs.Code, message: "请输入正确的验证码！", trigger: "blur" }
        ],
        Role: [{ required: true, message: "请选择员工身份", trigger: "blur" }],
        LoginPwd1: [
          { required: true, message: "请输入员工登录密码", trigger: "blur" }
        ],
        LoginPwd2: [
          { required: true, message: "请输入员工登录密码", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请再次输入密码"));
              } else if (value !== this.editInfo.LoginPwd1) {
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
  methods: {
    getUserRole: getUserRole,
    // 发送验证码
    sendCode() {
        let that = this;
        if (this.editInfo.Mobile) {
          if (this.rightPhoneNumber) {
            getCode({'Mobile': this.editInfo.Mobile,Use: '102'}).then(res => {
              if (res.data.ResultCode === '000000') {
                this.$message.success({message: res.data.ResultMessage});
                that.sendStatus = true;
                that.endTime = 60;
                that.timer = setInterval(() => {
                  that.endTime--;
                  if (that.endTime === 0) {
                    that.sendStatus = false;
                    clearInterval(that.timer)
                  }
                }, 1000)
              }
            }).catch(err => {
              console.log(err);
            })
          } else {
            that.$message.error({message: '请输入正确的手机号码！'})
          }
        } else {
          that.$message.error({message: '请输入手机号码！'})
        }
    },
    //管理员修改基本信息
    changeInfo(row, type) {
      if (type == 1) {
        this.isShowAdd = true;
        this.editInfo.Type = 1;
        this.editInfo.StaffName = "";
        this.editInfo.Mobile = "";
        this.editInfo.StaffID = "";
        this.editInfo.Role = "";
        this.editInfo.LoginPwd1 = "";
        this.editInfo.LoginPwd2 = "";
      } else {
        this.editInfo.StaffName = row.Name;
        this.editInfo.Mobile = row.Mobile;
        this.editInfo.StaffID = row.MembID;
        this.editInfo.Role = row.Duties.DutiID;
        this.editInfo.Type = type;
        this.editInfo.boss = row.Duties.Name;
        if (type == 2) {
          this.isShowAdd = true;
          this.title = "修改员工信息";
        } else if (type == 0) {
          this.isShowEdit = true;
        }
      }
    },
    //添加/编辑提交
    async saveInfo(editInfo) {
      if (this.$cookie.get("MemberMerchantID")) {
        this.$refs[editInfo].validate(valid => {
          if (valid) {
            this.hasCommit = true;
            this.editInfo.LoginPwd = md5(this.editInfo.LoginPwd1);
            addUser(this.editInfo).then(res => {
              if (res.data.ResultCode == "000000") {
                this.$message.success({
                  message: res.data.ResultMessage
                });
                this.isShowAdd = false;
                this.isShowCode = true;
                this.$refs[editInfo].resetFields();
                this.getDataList();
              }
              this.hasCommit = false;
            });
          }
        });
      } else {
        this.$confirm("是否去入驻?", "你尚未入驻！", {
          confirmButtonText: "去入驻",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$router.push("/settled");
        });
      }
    },
    // 修改管理员信息
    async saveAdmin(editInfo) {
      this.$refs[editInfo].validate(valid => {
        if (valid) {
          this.hasCommit = true;
          editAdminInfo(this.editInfo).then(res => {
          if (res.data.ResultCode == "000000") {
            this.$message.success({ message: res.data.ResultMessage });
            this.isShowEdit = false;
            this.$refs[editInfo].resetFields();
            this.getDataList();
          }
            this.hasCommit = false;
          });
        }
      });
    },
    // 作废账号
    async disabledUser(id, type) {
      let msg = "";
      if (type == 1) {
        msg = "确认要启用此账号吗?";
      } else if (type == 2) {
        msg = "确认要作废此账号吗?";
      } else {
        msg = "确认要执行此操作吗？";
      }
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        changeUserStatus({
          MemberID: this.$cookie.get("MemberID"),
          MerchantsID: this.$cookie.get("MemberMerchantID"),
          StaffID: id,
          Type: type
        }).then(res => {
          if (res.data.ResultCode === "000000") {
            this.$message.success({ message: res.data.ResultMessage });
            this.getDataList();
          }
        });
      });
    },
    // 获取列表内容
    async getDataList() {
      this.loading = true;
      getSubAccountList(this.req).then(res => {
        if (res.data.ResultCode == "000000" && res.data.ResultValue) {
          this.userList = res.data.ResultValue;
          this.req.TotalRecords = res.data.TotalRecords;
          this.loading = false;
        }
      });
    },
    //分页
    handleCurrentChange(val) {
      this.req.PageIndex = val;
      this.getDataList();
    }
  },
  computed: {
    rightPhoneNumber() {
      return regs.Phone.test(this.editInfo.Mobile);
    },
  },
  watch: {
    rightPhoneNumber(newVal){
      if(newVal){
        if(this.editInfo.Type == 1){
          hasExist({Mobile: this.editInfo.Mobile}).then(res=>{
          if (res.data.ResultCode == "000000") {
            if(res.data.ResultValue == '0'){
              const h = this.$createElement;
              this.$confirm('', '提示', {
                  message: h('div', {style: 'text-align: center'}, [
                    h('p', {style: 'color: #F55B23'}, '此账号已注册！请确认手机号无误'),
                    h('p', {style: 'color: #F55B23;'}, '继续添加账号密码将以最新设置为准！'),
                  ]),
                  confirmButtonText: '继续添加',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.isShowCode = true;
                }).catch(()=>{
                  this.isShowAdd = false;
                })
            } else {
              this.isShowCode = false;
            }
          }
        })
        }
      }
    }
  },
  created() {
    if (this.$cookie.get("MemberID")) {
      if (this.$cookie.get("MemberMerchantID")) {
        if (this.userType == 2 || this.userType == 1) {
          this.getDataList();
        } else {
          this.$message.info({ message: "身份类型错误！" });
          this.$router.push("/");
        }
      } else {
        this.$message.info("你尚未入驻！");
        this.$confirm("是否去入驻?", "你尚未入驻！", {
          confirmButtonText: "去入驻",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$router.push("/settled");
        });
      }
    } else {
      this.$message.info({ message: "你尚未登录，请登录！" });
      this.$router.push("/");
    }
  },
  components: {
    headTop,
    dropDown,
    foot
  }
};
</script>

<style lang="stylus" scoped>
@import '../../assets/styles/variable.styl';

.content {
  position: relative;
  width: 1200px;
  margin: 10px auto 40px;
}

.content-left {
  float: left;
  width: 200px;
  min-height: $minHeight;
  background: #ffffff;

  > ul {
    width: 200px;
    position: absolute;
    height: 100%;
    background-color: #fff;

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

.add-content {
  width: 100%;
  height: 90px;
  line-height: 90px;
  text-align: center;
  color: $blue;
}

.content-right {
  float: right;
  width: 990px;
  background-color: #fff;

  .main {
    background: #FFFFFF;
    padding: 0 0 40px 0;
    width: 100%;
    min-height: 760px

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
      border: 1px solid $borderColor;
      padding: 0;
    }
  }
}
.code {
  float: left;
  width: 69%;
  margin-right: 10px;
}
.dialog {
  padding: 0 30px;
}

.addBtn {
  width: 200px;
}
</style>
