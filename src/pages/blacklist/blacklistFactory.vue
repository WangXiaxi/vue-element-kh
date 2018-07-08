<template>
  <div class="blacklist-factory">
    <head-top class="header">
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
          <router-link to="/subAccount" tag="li" v-if="getUserRole(userCharacter,'管理')">会员用户管理</router-link>
          <router-link :to="userType == 1 ? '/blacklistFactory' : '/blacklistLogistics'" tag="li" class="active">黑名单管理</router-link>
          <router-link to="/settled2" tag="li">入驻信息</router-link>
        </ul>
      </div>
      <div class="content-right" v-loading="loading">
        <div class="main fr">
          <p class="title-box"><span class="title-name">黑名单管理</span></p>
          <div class="container">
            <div class="top-sort">
              <ul>
                <li>司机身份：</li>
                <li :class="[(searchList.Crowd == '') ? 'active' : '']" @click="searchList.Crowd = ''">全选</li>
                <li :class="[(searchList.Crowd == 2) ? 'active' : '']" @click="searchList.Crowd = 2">物流公司</li>
                <li :class="[(searchList.Crowd == 3) ? 'active' : '']" @click="searchList.Crowd = 3">个体司机</li>
              </ul>
            </div>
            <div class="top-sort">
              <ul>
                <li class="input-label">司机名称：</li>
                <li class="input-width-300"><el-input size="mini" placeholder="请输入物流公司，个体司机司机名称，支持模糊查询" v-model="searchList.Name"></el-input></li>
              </ul>
            </div>
            <div class="top-sort">
              <ul>
                <li class="input-label">目的地：</li>
                <li class="input-width-300">
                  <el-cascader
                    class="input-width-300"
                    size="mini"
                    change-on-select
                    :options="areaOptions"
                    @change="handleSelectionChange"
                    v-model="selecteAreadOptions">
                  </el-cascader>
                </li>
                <li><el-button type="primary" size="mini" @click="handleCurrentChange(1)">查询</el-button></li>
                <li class="ml-1"><el-button size="mini" plain @click="resetSeach">重置</el-button></li>
              </ul>
            </div>
            <div class="top-sort">
              <ul>
                <li class="input-label">
                   <el-checkbox v-model="ifCheckAll" @change="handleCheckAllChange" :indeterminate="isIndeterminate">全选</el-checkbox>
                </li>
                <li><el-button class="input-width-120" size="mini" plain @click="sureDeleBlack">删除</el-button></li>
                <router-link to="/blacklistFactoryAdd" class="ml-1"><el-button class="input-width-120" type="primary" size="mini">添加</el-button></router-link>
              </ul>
            </div>
            <el-table
              center
              size="small"
              :data="tableData"
              class="el-table-b-1px"
              empty-text="暂无黑名单"
              @selection-change="handleTableDataChange"
              ref="multipleTable"
            >
              <el-table-column
                type="selection"
                width="56px">
              </el-table-column>
              <el-table-column
                label="司机名称"
                prop="MercName"
                width="284">
              </el-table-column>
              <el-table-column
                label="用户身份"
                prop="Crowd"
                width="284">
              </el-table-column>
              <el-table-column
                label="拉黑时间"
                prop="BlackModify"
                width="284">
              </el-table-column>
            </el-table>
            <!--分页 start -->
            <div class="text-center mt-20">
              <el-pagination
                background
                @current-change="handleCurrentChange"
                :page-size="searchList.PageSize"
                :current-page.sync="searchList.PageIndex"
                layout="total, prev, pager, next"
                :total="searchList.TotalRecords">
              </el-pagination>
            </div>
            <!--分页 end -->
          </div>
        </div>
      </div>
    </div>
    <foot class="footer"></foot>
  </div>
</template>


<script type="es6">
import headTop from "components/header/head"
import dropDown from "components/header/children/dropdown"
import foot from "components/footer/foot"
import md5 from "js-md5"
import regs from "config/regExp"
import cookie from "cookiejs"
import { getBlackList, deleteBlackList } from "api/getData"
import { imgPostUrl, imgUrl } from "api/env"
import address from "config/address"
import qs from "qs"
import { getUserRole } from 'config/myUtils';
export default {
  data() {
    return {
      loading: false,
      userType: this.$cookie.get("MemberCrowd"),
      userCharacter: this.$cookie.get("MemberDutiesID"),
      MemberID: this.$cookie.get("MemberID"),
      MemberMerchantID: this.$cookie.get("MemberMerchantID"),
      searchList: { // 搜索条件
        Crowd: '',
        Name: '',
        Province: '',
        City: '',
        County: '',
        MerchantID: this.$cookie.get("MemberMerchantID"),
        MemberID: this.$cookie.get("MemberID"),
        PageIndex: 1,
        PageSize: 20,
        TotalRecords: 0
      },
      tableData: [],
      selecteAreadOptions:  [],
      areaOptions: address.area,
      ifCheckAll: false, // 自定义全选按钮
      isIndeterminate: false,
      tableCheckData: [] // table当前选中
    };
  },
  methods: {
    getUserRole: getUserRole,
    sureDeleBlack () { // 删除黑名单操作
      if (this.tableCheckData.length <= 0) {
        this.$message.info({ message: "请勾选至少一位用户！" })
        return
      }
      this.$confirm('确定将选中用户移除黑名单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let blackTo = ''
        this.tableCheckData.forEach((cur, index) => {
          if (index === this.tableCheckData.length - 1 ) {
             blackTo = blackTo + cur.MercID
          } else {
             blackTo = blackTo + cur.MercID + ','
          }
        })
        let form = {BlackFrom: this.MemberMerchantID, MemberID: this.MemberID, BlackTo: blackTo}
        const resData = await deleteBlackList(form)
        if (resData.data.ResultCode == '000000') {
          this.$message.success({message: resData.data.ResultMessage})
          this.getDataPage()
        }
      }).catch(() => {

      })
    },
    handleCurrentChange (val) { // 选择那一页面
      this.searchList.PageIndex = val
      this.getDataPage()
    },
    handleCheckAllChange (val) { // 点击全部执行联动操作
      if (val) {
        this.tableData.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, true)
        });
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleTableDataChange (e) { // table选中执行操作
      this.tableCheckData = e // 赋值当前选中
      let len = e.length
      this.ifCheckAll = len === this.tableData.length
      this.isIndeterminate = len > 0 && len < this.tableData.length // 联动全部按钮
    },
    handleSelectionChange (e) { // 查询选中操作
      this.searchList.Province = e[0] ? e[0] : ''
      this.searchList.City = e[1] ? e[1] : ''
      this.searchList.County = e[2] ? e[2] : ''
    },
    resetSeach () { // 重置搜索
      this.searchList.Crowd = ''
      this.searchList.Name = ''
      this.searchList.Province = ''
      this.searchList.City = ''
      this.searchList.County = ''
      this.selecteAreadOptions = []
      this.PageIndex = 1
      this.getDataPage()
    },
    async getDataPage () { // 获取数据内容操作
      this.loading = true
      const resData = await getBlackList(this.searchList)
      if (resData.data.ResultCode == "000000") {
        this.tableData = resData.data.ResultValue
        this.searchList.TotalRecords = resData.data.TotalRecords
      }
      this.loading = false
    }
  },
  created () {
    if (this.$cookie.get("MemberID")) {
      this.mobile = this.$cookie.get("Mobile")
    } else {
      this.$message.info({ message: "你尚未登录，请登录！" })
      this.$router.push("/")
    }
    if (this.userType != 1) {
      this.$message.info({ message: "非法请求！" })
      this.$router.push("/")
    }
    this.getDataPage()
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
.el-table-b-1px
  border: 1px solid #e0e0e0
  border-bottom: none
.content
  height: 100%
  width: 1200px
  margin: 10px auto 40px

.content-left
  float: left
  width: 200px
  min-height: $minHeight
  background: #ffffff
  > ul
    > li
      height: 30px
      line-height: 30px
      padding-left: 40px
      margin: 10px 0
      border-left: 3px solid transparent
      &:hover
        border-left-color: $blue
        color: $blue
        cursor: pointer

    .active
      border-left-color: $blue
      color: $blue
.content-right
  float: right
  width: 990px
  background-color: #fff
  .main
    background: #FFFFFF
    width: 100%
    min-height: $minHeight
    .title-box
      box-shadow: 0 1px 0 0 #E0E0E0

    .title-name
      display: inline-block
      padding-left: 20px
      height: 30px
      line-height: 30px
      margin: 10px 0
      border-left: 3px solid $blue
    .container
      margin: 30px 40px
    .top-sort
      margin-bottom: 20px
      ul
        overflow: hidden
        li
          float: left
          margin: 0 15px
          cursor: pointer
          &.ml-1
            margin-left: 5px
          &:first-child
            margin: 0
            cursor: default
        .active
          color: $blue
        .input-label
          line-height: 28px
          width: 70px
        .input-width-300
          width: 300px
        .input-width-120
          width: 120px
.change-content
  margin: 30px 0 0 0
  padding: 0 20px
  ul
    li
      padding: 15px 0
      margin-top: 10px
      overflow: hidden
  .left
    float: left
    width: 50px
    height: 50px
    line-height: 50px
    margin-right: 40px
    text-align: center
    font-size: 26px
    color: #ffffff
    border-radius: 50%
    overflow: hidden
  .green-bg
    background-color: #92F1A2
  .orange-bg
    background-color: #FBB372
  .center
    float: left
  .right
    float: right
    height: 50px
    line-height: 50px
  .avatar
    width: 50px
    height: 50px
    vertical-align: top
.user
  height: 90px
  line-height: 90px
  padding-left: 20px
  border: 1px solid $borderColor
.code
  float: left
  width: 60%
  margin-right: 10px
.code-btn
  float: right
  width: 100px
.dialog
  padding: 0 30px
.changeBtn
  width: 120px

.addBtn
  width: 200px
</style>
<style lang="stylus">
  .blacklist-factory
    .el-table__empty-block
      height: 180px
      .el-table__empty-text
        width: 120px
        height: 20px
        padding-top: 120px
        background: url('../../assets/images/null.png') 50% top no-repeat
    .el-table .el-table__header-wrapper .el-table__header .has-gutter .el-checkbox .el-checkbox__input
      opacity: 0
      display: none
    .el-table
      .el-table__header-wrapper
        .has-gutter
          tr, th
            background-color: #FAFAFA
</style>
