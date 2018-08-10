<template>
  <div class="special-line">
    <head-top class="header">
      <span class="title" slot="index">{{userType == 1?'货主':'物流公司'}}-工作台</span>
      <div class="header-center" slot="menu">
        <head-menu-router activeLink="index"></head-menu-router>
      </div>
      <drop-down slot="info"></drop-down>
    </head-top>
    <div class="content clear">
      <div class="content-left">
        <left-menu-router-home activeLink="black"></left-menu-router-home>
      </div>
      <div class="content-right" v-loading="loading">
        <div class="main">
          <p class="title-box"><span class="title-name">物流专线</span></p>
          <div class="container">
            <el-form :inline="true" size="small" class="search-form">
              <el-form-item prop="CollectVolume" label="免费上门提货">
                <el-input placeholder="体积" v-model="CollectVolume" size="small">
                  <template slot="append">m³以上</template>
                </el-input>
              </el-form-item>

              <el-form-item prop="CollectWeight">
                <el-input placeholder="重量" v-model="CollectWeight" size="small">
                  <template slot="append">吨/以上</template>
                </el-input>
              </el-form-item>

              <el-form-item>
                <el-button class="btn-blue" plain @click="setCollect" v-if="getUserRole(userCharacter,'管理')">保存</el-button>
              </el-form-item>
              
              <el-form-item class="fr" style="margin-right: 0">
                <el-button type="primary" @click="addLine" v-if="getUserRole(userCharacter,'管理')">添加专线</el-button>
              </el-form-item>

            </el-form>

            <el-form :inline="true" size="small" class="search-form">

              <el-form-item label="专线目的地">
                <el-cascader
                  class="address"
                  :options="address"
                  v-model="searchToAddress"
                  placeholder="请选择目的地查询"
                  clearable
                  change-on-select
                ></el-cascader>
              </el-form-item>

              <el-form-item>
                <el-button class="btn-blue" plain @click="handleCurrentChange(1)">搜索</el-button>
              </el-form-item>
            </el-form>
            <el-table
              center
              size="small"
              :data="tableData"
              class="el-table-b-1px"
              empty-text="暂无专线，请添加专线"
              ref="specialLineTable">
              <el-table-column
                label="出发地 - 目的地"
                width="214">
                <template slot-scope="props">
                  {{props.row.FromProvince + ' ' + props.row.FromCity + ' ' + props.row.FromCounty + ' -- ' + props.row.ToProvince + ' ' + props.row.ToCity + ' ' + props.row.ToCounty}}
                </template>
              </el-table-column>
              <el-table-column
                label="报价方式"
                width="85">
                <template slot-scope="props">
                  <p class="s-t">泡货/m³</p>
                  <p class="s-t">重货/吨</p>
                </template>
              </el-table-column>
              <el-table-column
                label="最低价/元"
                width="85">
                <template slot-scope="props">
                  <p class="s-t">{{props.row.RoutLightFloorPrice}}</p>
                  <p class="s-t">{{props.row.RoutHeavyFloorPrice}}</p>
                </template>
              </el-table-column>
              <el-table-column
                label="最高价/元"
                prop="MercName"
                width="85">
                <template slot-scope="props">
                  <p class="s-t">{{props.row.RoutLightCeilingPrice}}</p>
                  <p class="s-t">{{props.row.RoutHeavyCeilingPrice}}</p>
                </template>
              </el-table-column>
              <el-table-column
                label="优惠百分比"
                prop="MercName"
                width="90">
                <template slot-scope="props">
                  <p class="s-t" style="color: red">{{Number(props.row.RoutLightDecline)}}%</p>
                  <p class="s-t" style="color: red">{{Number(props.row.RoutHeavyDecline)}}%</p>
                </template>
              </el-table-column>
              <el-table-column
                label="货源总数"
                prop="TotalCount"
                width="100">
              </el-table-column>

              <el-table-column
                label="状态"
                width="100">
                <template slot-scope="props">
                  <span v-if="props.row.StatusValue == 2" style="color: #67C23A">{{props.row.StatusName}}</span>
                  <span v-else style="color: red">{{props.row.StatusName}}</span>
                </template>
              </el-table-column>

              <el-table-column
                label="操作"
                prop="MercName">
                <template slot-scope="props">
                  <span class="blue" v-if="props.row.StatusValue != 1 && getUserRole(userCharacter,'管理')" @click="editLine(props.row)">编辑</span>
                  <span class="blue" v-if="props.row.StatusValue != 1 && getUserRole(userCharacter,'管理')" @click="dele(props.row)">删除</span>
                  <span v-if="props.row.StatusValue == 1 || !getUserRole(userCharacter,'管理')">-</span>
                </template>
              </el-table-column>
            </el-table>
            <!--分页 start -->
            <div class="text-center mt-60">
              <el-pagination
                background
                @current-change="handleCurrentChange"
                :page-size="listSrarch.PageSize"
                :current-page.sync="listSrarch.PageIndex"
                layout="total, prev, pager, next"
                :total="listSrarch.TotalRecords">
              </el-pagination>
            </div>
            <!--分页 end -->
          </div>
        </div>
      </div>
    </div>
    <foot class="footer"></foot>
    <special-line-dialog v-if="specialLineDialog.ifVisible" :dialog="specialLineDialog" :formData="formData" @callback="specialLineDialogCallback"></special-line-dialog>
  </div>
</template>

<script type="es6">
  import headTop from 'components/header/head'
  import dropDown from 'components/header/children/dropdown'
  import foot from "components/footer/foot"
  import { getUserRole } from 'config/myUtils'
  import address from 'config/address'
  import headMenuRouter from 'components/headMenuRouter/headMenuRouter' // 头部
  import leftMenuRouterHome from 'components/leftMenuRouter/leftMenuRouterHome' // 左侧
  import specialLineDialog from 'components/specialLineDialog/specialLineDialog' // 头部
  import { DedicatedLineGetPage, getEnterAddress, DedicatedLineDelete, GetCollectInfo, CollectSet } from 'api/getData'
  import regs from '@/config/regExp'
  import m_login from '@/mixins/m_login'

  export default {
    mixins: [m_login],
    data () {
      return {
        regs,
        loading: false,
        address: address.area,
        fromAddress: [],
        toAddress: [],
        searchToAddress: [], // 查询省市区
        CollectWeight: '', // 上门提货需满足的重量(单位：吨)
        CollectVolume: '', // 上门提货需满足的体积(单位：立方米)
        specialLineDialog: {
          visible: false,
          type: 'add',
          title: '',
          ifVisible: false // 判断弹框 是否存在
        },
        listSrarch: {
          MerchantID: this.$cookie.get('MemberMerchantID'),
          FromProvince: '',
          FromCity: '',
          FromCounty: '',
          ToProvince: '',
          ToCity: '',
          ToCounty: '',
          PageIndex: 1,
          PageSize: 10,
          TotalRecords: 0
        },
        tableData: [],
        formData: {
          fromAddress: [],
          toAddress: [],
          MerchantID: this.$cookie.get('MemberMerchantID'),
          RouteID: '', // 路线ID
          FromProvince: '',
          FromCity: '',
          FromCounty: '',
          ToProvince: '',
          ToCity: '',
          ToCounty: '',
          LongS: '',
          ModelS: '',
          HeavyPrice: '',
          LightPrice: '',
          HeavyFloorPrice: '',
          HeavyCeilingPrice: '',
          HeavyDecline: '',
          LightFloorPrice: '',
          LightCeilingPrice: '',
          LightDecline: '',
          intSourceType: '1'
        }
      }
    },
    components: {
      headTop,
      dropDown,
      foot,
      headMenuRouter,
      leftMenuRouterHome,
      specialLineDialog
    },
    created () {
      let isLogin = this.checkLoginStatus();
      if(!isLogin) return;
      let identityPass = this.checkLoginIdentity(2); // mixin判断是否有权限访问 2,物流公司 1,工厂
      if(!identityPass) return;
      this.getCurAddress() // 获取默认用户地址
      this.GetCollectInfo() // 获取上门提货
      this.getPage()
    },
    methods: {
      getUserRole: getUserRole,
      async setCollect () {
        if (!regs.NF2.test(this.CollectWeight)) {
          this.$message({
            type: 'error',
            message: '重量必须为数字类型，至多两位小数'
          })
          return
        }
        if (!regs.NF2.test(this.CollectVolume)) {
          this.$message({
            type: 'error',
            message: '体积必须为数字类型，至多两位小数'
          })
          return
        }
        this.$confirm('确定修改免费上门提货设置吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          this.loading = true
          const res = await CollectSet({ CollectWeight: this.CollectWeight, CollectVolume : this.CollectVolume })
          this.loading = false
          if (res.data.ResultCode === '000000') {
            this.GetCollectInfo()
            this.$message({
              type: 'success',
              message: res.data.ResultMessage
            })
          }
        }).catch(() => {
        })

      },
      async GetCollectInfo () {
        const res = await GetCollectInfo()
        if (res.data.ResultCode === '000000') {
          let _ = res.data.ResultValue
          this.CollectWeight = _.CollectWeight
          this.CollectVolume = _.CollectVolume
        }
      },
      async getCurAddress () { // 获取默认用户地址
        const res = await getEnterAddress()
        if (res.data.ResultCode === '000000' && res.data.ResultValue) {
          this.fromAddress = res.data.ResultValue.FromCityID.split(',')
          this.fromAddress.forEach((cur, index) => {
            this.fromAddress[index] = Number(cur)
          })
          if (this.formData.fromAddress.length === 0) {
            this.formData.fromAddress = this.fromAddress
          }
        }
      },
      async getPage () { // 获取一页
        let req = Object.assign(this.listSrarch, {
          ToProvince: this.searchToAddress[0],
          ToCity: this.searchToAddress[1],
          ToCounty: this.searchToAddress[2]
        })
        this.loading = true
        const resData = await DedicatedLineGetPage(req)
        this.loading = false
        if (resData.data.ResultCode === '000000') {
          this.tableData = resData.data.ResultValue
          this.listSrarch.TotalRecords = resData.data.TotalRecords
        }
      },
      //分页
      handleCurrentChange (val) {
        this.listSrarch.PageIndex = val
        this.getPage()
      },
      editLine (row) { // 编辑专线
        this.formData = Object.assign(this.formData,  {
          fromAddress: [Number(row.FromProvinceID), Number(row.FromCityID), Number(row.FromCountyID)],
          toAddress: [Number(row.ToProvinceID), Number(row.ToCityID), Number(row.ToCountyID)],
          RouteID: row.RouteID,
          FromProvince: row.FromProvinceID,
          FromCity: row.FromCityID,
          FromCounty: row.FromCountyID,
          ToProvince: row.ToProvinceID,
          ToCity: row.ToCityID,
          ToCounty: row.ToCountyID,
          LongS: row.LongS,
          HeavyPrice: row.HeavyPrice,
          LightPrice: row.LightPrice,
          ModelS: row.ModelIDs,
          HeavyFloorPrice: row.RoutHeavyFloorPrice,
          HeavyCeilingPrice: row.RoutHeavyCeilingPrice,
          HeavyDecline: Number(row.RoutHeavyDecline),
          LightFloorPrice: row.RoutLightFloorPrice,
          LightCeilingPrice: row.RoutLightCeilingPrice,
          LightDecline: Number(row.RoutLightDecline),
          DedicatedLineID: row.RouteID
        })
        this.specialLineDialog.title = '编辑专线'
        this.specialLineDialog.type = 'edit'
        this.specialLineDialog.ifVisible = true
        setTimeout(() => {
          this.specialLineDialog.visible = true
        }, 20)
      },
      addLine () { // 添加专线
        this.formData = Object.assign(this.formData, {
          fromAddress: this.fromAddress,
          toAddress: [],
          FromProvince: '',
          FromCity: '',
          FromCounty: '',
          ToProvince: '',
          ToCity: '',
          ToCounty: '',
          LongS: '',
          ModelS: '',
          HeavyPrice: '',
          LightPrice: '',
          HeavyFloorPrice: '',
          HeavyCeilingPrice: '',
          HeavyDecline: '',
          LightFloorPrice: '',
          LightCeilingPrice: '',
          LightDecline: '',
          intSourceType: '1'
        })
        delete this.formData.RouteID
        this.specialLineDialog.title = '添加专线'
        this.specialLineDialog.type = 'add'
        this.specialLineDialog.ifVisible = true
        setTimeout(() => {
          this.specialLineDialog.visible = true
        }, 20)
      },
      dele (data) {
        this.$confirm('确定删除该专线？<p style="color:#999;">删除后，您无法查看该专线的货源！</p>', '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await DedicatedLineDelete({routeID: data.RouteID})
          if (res.data.ResultCode === '000000') { // 删除成功
            this.$message({
              type: 'success',
              message: res.data.ResultMessage
            })
            this.handleCurrentChange(1)
          }
        }).catch(() => {
        })
      },
      specialLineDialogCallback (status) {
        if (status) this.handleCurrentChange(1)
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../../assets/styles/template.styl'
  @import '../../assets/styles/variable.styl'
  .special-line
    .el-input
      width: 200px
    .el-table-b-1px
      border: 1px solid #e0e0e0
      border-bottom: none
    .btn-blue
      background: #fff
      border-color: #409EFF
      color: #409EFF
    .blue
      color: $blue
      cursor: pointer
      padding-right: 10px
</style>
<style lang="stylus">
  .special-line
    .el-table__empty-block
      height: 180px
      .el-table__empty-text
        width: 200px
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
