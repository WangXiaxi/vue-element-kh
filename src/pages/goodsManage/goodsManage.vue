<template>
  <div class="good-manage">
    <head-top>
      <span class="title" slot="index">物流公司-工作台</span>
      <div class="header-center" slot="menu">
        <head-menu-router activeLink="index"></head-menu-router>
      </div>
      <drop-down slot="info"></drop-down>
    </head-top>
    <div class="content clear">
      <div class="content-left">
        <left-menu-router-home activeLink="goodsManage"></left-menu-router-home>
      </div>
      <div class="content-right" v-loading="loading">
        <div class="main">
          <p class="title-box"><span class="title-name">首页 < 货物统计</span></p>
          <div class="container clear">
            <div class="mt-6 ml-20">
              <el-form :inline="true" size="small" class="search-form">

                <el-form-item label="运单状态：" class="yd">
                  <span class="mr-40" :class="{orange: searchForm.OrderStatus === orderStatus.ORDER_LOADING}" @click="changeOrderSratus(orderStatus.ORDER_LOADING)">待发货</span>
                  <span class="mr-40" :class="{orange: searchForm.OrderStatus === orderStatus.ORDER_SHIPPED}" @click="changeOrderSratus(orderStatus.ORDER_SHIPPED)">运输中</span>
                  <span class="mr-40" :class="{orange: searchForm.OrderStatus === orderStatus.ORDER_ARRIVED}" @click="changeOrderSratus(orderStatus.ORDER_ARRIVED)">已到达</span>
                  <span class="mr-40" :class="{orange: searchForm.OrderStatus === orderStatus.ORDER_EVALUATION}" @click="changeOrderSratus(orderStatus.ORDER_EVALUATION)">已评价</span>
                </el-form-item>

                <el-form-item label="货运目的地">
                  <el-cascader
                    size="small"
                    class="address"
                    :options="address"
                    @change="handleAddressChange"
                    v-model="ToAddressArr"
                    change-on-select
                    :clearable="true"
                  ></el-cascader>
                </el-form-item>

                <el-form-item label="创建时间">
                  <el-date-picker
                    v-model="choosetime"
                    @change="changetime"
                    format="yyyy-MM-dd"
                    :unlink-panels="false"
                    type="daterange"
                    range-separator="至"
                    size="small"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="货物类型">
                  <el-select v-model="searchForm.Classify" placeholder="货物类型">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="(item, index) in productList" :label="item.DictName" :value="item.DictID" :key="index"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="车长">
                  <el-autocomplete
                    class="normal"
                    v-model="LongCopy"
                    :fetch-suggestions='getLongList'
                    placeholder="车长">
                  </el-autocomplete>
                </el-form-item>

                <el-form-item label="车型">
                  <el-select v-model="searchForm.Model" placeholder="车型">
                    <el-option v-for="(item, index) in ModelList" :label="item.DictName" :value="item.DictID" :key="index"></el-option>
                  </el-select>
                </el-form-item>



                <el-form-item style="margin-right:0; float: right">
                  <el-button type="primary" @click="handleCurrentChange(1)">搜索</el-button>
                </el-form-item>

              </el-form>

            </div>
            <div class="list-box">
              <el-table
                size="small"
                :data="tableData"
                @select="handleSelectionChange"
                ref="table"
                class="el-table-b-1px">
                <el-table-column
                  type="selection"
                  :selectable="selectable"
                  width="30">
                </el-table-column>
                <el-table-column
                  label="货源详情"
                  width="100">
                  <template slot-scope="props"><router-link :to="`/waybillDetail/${props.row.OrderformID}`">{{props.row.OrderCode}}</router-link>
                  </template>
                </el-table-column>
                <el-table-column
                  label="货运目的地"
                  width="94"
                  prop="OrderToCityName">
                </el-table-column>
                <el-table-column
                  label="体积(m³)"
                  width="75"
                  prop="OrderVolume">
                </el-table-column>
                <el-table-column
                  label="重量(吨)"
                  width="75"
                  prop="OrderWeight">
                </el-table-column>
                <el-table-column
                  label="货物类型"
                  width="85"
                  prop="OrderClassifyName">
                </el-table-column>
                <el-table-column
                  label="车长(m)"
                  width="70"
                  prop="OrderLong">
                </el-table-column>
                <el-table-column
                  label="车型"
                  width="54"
                  prop="OrderModelName">
                </el-table-column>
                <el-table-column
                  label="运单状态"
                  width="76"
                  prop="OrderStatusName">
                </el-table-column>

                <el-table-column
                  label="结算方式"
                  width="94"
                  prop="OrderSettlementName">
                </el-table-column>

                <el-table-column
                  label="创建时间"
                  width="155"
                  prop="OrderCreate">
                </el-table-column>
              </el-table>
              <!--分页 start -->
              <div class="text-center mt-10" v-if="searchForm.TotalRecords > 0">
                <el-pagination
                  background
                  @current-change="handleCurrentChange"
                  :page-size="searchForm.PageSize"
                  :current-page.sync="searchForm.PageIndex"
                  layout="total, prev, pager, next"
                  :total="searchForm.TotalRecords">
                </el-pagination>
              </div>
              <!--分页 end -->
            </div>
            <!-- 已选货物 -->
            <div class="selected-order">
              <div class="tit">
                已选货物
              </div>
              <div class="selected-box fr">
                <ul>
                  <li v-for="(item, index) in chooseData"><el-checkbox v-model="item.checked" @change="handleCheckedChange(item)">货源编号 {{item.OrderCode}}</el-checkbox></li>
                </ul>
              </div>
            </div>
            <!-- 发布底部 -->
            <div class="bottom-box">
              <div class="info-box">
                <span class="check-span">
                  <el-checkbox v-model="checkedAll" @change="handleCheckedAllChange">全选</el-checkbox>
                </span>
                <span>已选择{{nextData.Num}}单，总体积/总重量：<span class="orange">{{nextData.Volume}}m³/{{nextData.Weight}}吨</span></span>
              </div>
              <div @click="goNext(1, chooseData.length)" class="next-btn" :class="{grey : !chooseData.length}">
                下一步，立即发车
              </div>
              <div @click="goNext(2, chooseData.length)" class="next-btn-zd" :class="{grey : !chooseData.length}">
                转单-发布货源
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <foot></foot>
  </div>
</template>


<script>
  import headTop from 'components/header/head';
  import dropDown from 'components/header/children/dropdown';
  import foot from 'components/footer/foot';
  import headMenuRouter from 'components/headMenuRouter/headMenuRouter'; // 头部
  import leftMenuRouterHome from 'components/leftMenuRouter/leftMenuRouterHome'; // 左侧
  import { getTimes } from 'config/getTimes';
  import { getUserRole } from 'config/myUtils';
  import m_login from '@/mixins/m_login';
  import address from 'config/address';
  import { CarLongList } from 'config/publicParam'; // 提取了下CarLongList
  import { orderStatus } from 'config/statusManager'; // 状态枚举

  import {
    getProTypeList, // 货物类型
    getCarModelList, // 获取车型
    GetOrderformListForCompany, // 查询获取一页
  } from "api/getData";

  // 定义不可选状态集合
  const NoChooseStatus = [orderStatus.ORDER_ARRIVED, orderStatus.ORDER_EVALUATION, orderStatus.ORDER_SHIPPED];

  // 定义 常量 特殊的产品类型
  const ClassifySpec = {
    coldLogistics: {id: '2239b1840bd540498abad53a235e8341', name: '冷链运输'},
    hazaChemicals: {id: '293022d917b644cb983f8858cf1f077f', name: '危化品'}
  }

  export default {
    mixins: [m_login],
    data() {
      return {
        orderStatus,
        loading: false,
        address: address.area,
        LongCopy: '', // 定义表单字段拷贝
        choosetime: [], // 时间
        ToAddressArr: [], // 地址
        productList: [], // 货物类型
        CarLongList: CarLongList, // 车长
        ModelList: [], // 车型
        checkedAll: false, // 全选按钮
        searchForm: {
          ToProvinceID: '',
          ToCityID: '',
          ToCountyID: '',
          OrderStatus: orderStatus.ORDER_LOADING,
          Long: '',
          Model: '',
          Classify: '',
          CreateStart: '1970-01-01',
          CreateEnd: getTimes(new Date(), 'yyyy-MM-dd'),
          PageIndex: 1,
          PageSize: 10,
          TotalRecords: 0
        },
        tableData: [],
        chooseData: [],
        nextData: {
          Num: 0, // 总数量
          Volume: '0.00', // 总体积
          Weight: '0.00', // 总重量
          formID: '' // id集合
        } // 最终要传递的数据
      }
    },
    methods: {
      changeOrderSratus (val) { // 改变状态触发查询
        this.searchForm.OrderStatus = val;
        this.handleCurrentChange(1);
      },
      selectable (row, index) {
        if (NoChooseStatus.indexOf(row.OrderStatus) > -1) {
          return false;
        }
        return true;
      },
      goNext (type, isGo) {
        if (!isGo) return;
        let _ = this;
        switch (type) {
          case 1:
          _.$router.push({name: 'goodsDelivery', params: _.nextData}); // 用params 传参 防止url长度太长
          break;
          case 2:
          _.$router.push({name: 'slipPublish', params: _.nextData}); // 用params 传参 防止url长度太长
          break;
        }
      },
      handleCheckedAllChange (val) {
        let _ = this;
        if (val) {
          // 全选首先判断是否是待发货 如果有全部选项 这里需要轮询
          if (NoChooseStatus.indexOf(_.searchForm.OrderStatus) > -1) {
            _.checkedAll = !val;
            this.$message.info('当前目录中无可选订单！');
            return;
          } // 非待发货状态直接结束

          if (_.judIsOrderClassify(_.tableData)) { // 判断是否选择到付等
            _.checkedAll = !val;
            return;
          }

          if (_.judIsOrderSettlement(_.tableData)) { // 判断是否选择到付等
            _.checkedAll = !val;
            return;
          }

          if (_.judCheckedIsAddress(_.tableData)) { // 判断是否有目的地不同的
            _.checkedAll = !val;
            return;
          }
          _.tableData.forEach((c, i) => { // 判断是否全选
            let isExist = false, // 是否已经在添加名单里
                isCanChoose = true; // 是否可选
            _.chooseData.forEach((d, j) => {
              if (c.OrderformID === d.OrderformID) {
                isExist = true;
              }
            })
            if (NoChooseStatus.indexOf(c.OrderStatus) > -1) {
              isCanChoose = false;
            }
            if (!isExist && isCanChoose) {
              _.$refs.table.toggleRowSelection(c, true);
              let cur = Object.assign({ checked: true }, c); // 复制对象给已选择
              _.chooseData.push(cur);
            }
          })
        } else {
          _.tableData.forEach((c, i) => { // 判断是否全选
            _.chooseData.forEach((d, j) => {
              if (c.OrderformID === d.OrderformID) {
                _.$refs.table.toggleRowSelection(c, false);
                _.chooseData.splice(j, 1); // 删除操作
              }
            })
          })
        }
      },
      handleCheckedChange (item) { // 已选货物删除
        let _ = this;
        _.chooseData.forEach((c, i) => {
          if (c.OrderformID === item.OrderformID) {
            _.chooseData.splice(i, 1); // 删除操作
          }
        })
        _.tableData.forEach((c, i) => { // 如果当前table有这条则改变
          if (c.OrderformID === item.OrderformID) {
            _.$refs.table.toggleRowSelection(c, false);
            _.checkedAll = false; // 有则取消全选
          }
        })
      },
      // 分页
      handleCurrentChange (val) {
        this.searchForm.PageIndex = val;
        this.searchData();
      },
      changetime (val) { // 时间联动
        let _ = this.searchForm;
        if (val) {
          _.CreateStart = getTimes(val[0], 'yyyy-MM-dd');
          _.CreateEnd = getTimes(val[1], 'yyyy-MM-dd');
        } else {
          _.CreateStart = '1970-01-01';
          _.CreateEnd = getTimes(new Date(), 'yyyy-MM-dd');
        }
      },
      handleAddressChange (val) {
        let _ = this.searchForm;
        _.ToProvinceID = val[0] ? val[0] : '';
        _.ToCityID = val[1] ? val[1] : '';
        _.ToCountyID = val[2] ? val[2] : '';
      },
      handleSelectionChange (e, row) {
        let _ = this,
            isExist = false, // 判断当前是否已经选择 有则删除 无则添加
            isChoose = false; // 判断是选中还是取消
        e.forEach((c, i) => {
          if (c.OrderformID === row.OrderformID) {
            isChoose = true;
          }
        })
        _.chooseData.forEach((c, i) => {
          if (c.OrderformID === row.OrderformID) {
            if (!isChoose) {
              _.chooseData.splice(i, 1); // 删除操作
              _.checkedAll = false; // 删除操作直接取消全选
            }
            isExist = true;
          }
        })
        if (!isExist && isChoose) { // 不存在则添加
          if (_.judIsOrderClassify(row)) { // 判断是否有目的地不同的
            _.$refs.table.toggleRowSelection(row, false);
            return;
          }

          if (_.judIsOrderSettlement(row)) { // 判断是否选择到付等
            _.$refs.table.toggleRowSelection(row, false);
            return;
          }

          if (_.judCheckedIsAddress(row)) { // 判断是否有目的地不同的
            _.$refs.table.toggleRowSelection(row, false);
            return;
          }
          let cur = Object.assign({ checked: true }, row); // 复制对象给已选择
          _.chooseData.push(cur);
          _.judCheckedAll(); // 轮询判断是否全选
        }
      },
      judCheckedIsAddress (data) { // 判断是否目的地相同
        // 先查需要添加里 都相同在查 已选
        if (Array.isArray(data)) {
          let res = this.judIsRepeat(data);
          if (res) this.$message.info('您当前选择的目的地与已选货物中目的地不同');
          return res;
        }
        if (this.chooseData.length === 0) return false; // 不是数组情况下，如果已选择中没有则不重复
        if (data.OrderToCity === this.chooseData[0].OrderToCity) return false; // 已选货物中不可能出现不同，只需对比第一个即可
        this.$message.info('您当前选择的目的地与已选货物中目的地不同');
        return true;
      },
      judIsRepeat (cur) { // 争对当前类型数组 判断是否有不相同
        let data = cur.concat(this.chooseData);
        for (let i = 0; i < data.length - 1; i++ ) {
          if (data[i].OrderToCity !== data[i + 1].OrderToCity) return true;
        }
        return false;
      },
      judIsOrderSettlement (cur) { // 到付不能与其他一起选择
        let _ = this,
            data,
            num = 0;
        if (Array.isArray(cur)) {
          data = cur.concat(_.chooseData);
        } else {
          let arr = [];
          arr.push(cur);
          data = arr.concat(_.chooseData);
        }
        for (let i = 0; i < data.length; i++ ) {
          if ( Number(data[i].OrderSettlement) === 2) {
            num ++;
          }
        }
        if (num !== 0 && num !== data.length) { // 有到付并且还有其他则不让选择
          this.$message.info('收货方到付订单不能与其他订单一起选择');
          return true;
        }
        return false;
      },
      judIsOrderClassify (cur) { // 冷链 威化不能与其他一起
        let _ = this,
            data,
            numw = 0,
            numl = 0;
        if (Array.isArray(cur)) {
          data = cur.concat(_.chooseData);
        } else {
          let arr = [];
          arr.push(cur);
          data = arr.concat(_.chooseData);
        }

        for (let i = 0; i < data.length; i++ ) {
          if (data[i].OrderClassify.indexOf(ClassifySpec.coldLogistics.id) > -1) { // 冷链数量
            numl ++;
          }
          if (data[i].OrderClassify.indexOf(ClassifySpec.hazaChemicals.id) > -1) { // 危化品
            numw ++;
          }
        }
        if ((numw > 0 && numw !== data.length) || (numw > 0 && numw !== data.length)) {
          _.$message.info('危化品与冷链运输不能与其他物品一起选择');
          return true;
        }
        return false;

      },
      judCheckedAll () { // 判断是否全选
        let _ = this,
            isCheckedNum = 0, // 本页有多少是选中
            isCanChoose = 0; // 有多少状态是计算到可选中 除掉已评价 已到达
        _.checkedAll = false;
        _.tableData.forEach((d, j) => {
          if (NoChooseStatus.indexOf(d.OrderStatus) === -1) isCanChoose ++; // 计算需要被计算到全选中的数量
          _.chooseData.forEach((c, i) => { // 判断是否全选
            if (c.OrderformID === d.OrderformID) {
              _.$refs.table.toggleRowSelection(d, true);
              isCheckedNum ++;
            }
          })
        })
        if (isCheckedNum === isCanChoose && isCheckedNum !== 0) { // 全等则说明当前页全选
          _.checkedAll = true;
        }
      },
      getCarModelList () { // 获取车型列表
        return new Promise((resolve, reject) => {  // 用promise实现下同步
          getCarModelList().then(res => {
            if (res.data.ResultCode === '000000') {
              res.data.ResultValue.push({ DictID: '', DictName: '不限'});
              this.ModelList = res.data.ResultValue;
            }
            resolve(res);
          }).catch(() => {
            resolve('error');
          })
        })
      },
      getProTypeList () {
        return new Promise((resolve, reject) => { // 获取货物类型 用promise实现下同步
          getProTypeList().then(res => {
            if (res.data.ResultCode === '000000') {
              this.productList = res.data.ResultValue;
            }
            resolve(res);
          }).catch(() => {
            resolve('error');
          })
        })
      },
      getLongList (queryString, callback) { // 获取车长
        callback(this.CarLongList);
      },
      async searchData () { // 搜索操作
        let _ = this;
        _.searchForm.Long = _.LongCopy !== '不限' ? _.LongCopy : '99'; // 重置下值
        _.loading = true;
        const { data: { ResultCode, ResultValue, ResultMessage, TotalRecords }} = await GetOrderformListForCompany(_.searchForm);
        _.loading = false;
        if (ResultCode === '000000') {
          _.tableData = ResultValue;
          _.searchForm.TotalRecords = TotalRecords;
          // 轮寻数据获取完成后联动table选中框
          setTimeout(() => {
            _.judCheckedAll();
          }, 20)

        }
      }
    },
    computed: {
    },
    created() {
      let isLogin = this.checkLoginStatus();
      if(!isLogin) return;
      let _ = this;
      let identityPass = this.checkLoginIdentity(2, '/add', () => {
        _.searchData(); // 查询数据
        _.getCarModelList(); // 获取车型
        _.getProTypeList(); // 获取货物类型
      });
    },
    watch: {
      chooseData (n) {
        let _ = this,
            Volume = 0,
            Weight = 0,
            formID = '';
        n.forEach((c, i) => {
          Volume = Volume + Number(c.OrderVolume.replace('m³', '')); // 总体积
          Weight = Weight + Number(c.OrderWeight.replace('吨', '')); // 总重量
          formID = formID + ',' + c.OrderformID; // id串串
        });
        _.nextData.Weight = Weight.toFixed(2);
        _.nextData.Volume = Volume.toFixed(2);
        _.nextData.Num = n.length;
        _.nextData.formID = formID.substr(1);
      }
    },
    components: {
      headTop,
      dropDown,
      foot,
      headMenuRouter,
      leftMenuRouterHome, // 左侧导航
    }
  };
</script>

<style lang="stylus" scoped>
@import '../../assets/styles/template.styl'
  .el-table-b-1px
    border: 1px solid #e0e0e0
    border-bottom: none
    min-height: 350px
  .good-manage
    .content-right
      min-height: 600px
      .container
        padding-top: 20px
      .search-form
        .el-form-item.el-form-item--small
          margin-bottom: 18px
        .yd
          display: block
          span
            cursor: pointer
          .orange
            color: $orange
      .selected-order
        min-height: 80px
        border: 1px solid #B0BAD8
        position: relative
        overflow: hidden
        margin-top: 12px
        .tit
          font-size: 16px
          font-weight: 700
          width: 151px
          color: #027CFF
          display: block
          height: 40px
          line-height: 40px
          text-align: center
          position: absolute
          top: 50%
          left: 0
          margin-top: -20px
          &:before
            content: ' '
            height: 500px
            width: 1px
            position: absolute
            right: 0
            background: #B0BAD8
            top: -230px
        .selected-box
          width: 688px
          padding: 14px 20px
          ul
            li
              float: left
              margin: 8px 54px 2px 0
              &:nth-of-type(1), &:nth-of-type(2), &:nth-of-type(3)
                margin-top: 2px
      .list-box
        .grey
          color: $gray
      .bottom-box
        margin-top: 12px
        position: relative
        overflow: hidden
        .info-box
          float: left
          background: #FFFAF6
          width: 540px
          border: 1px solid #FFB398
          border-right-color: transparent
          height: 50px
          line-height: 50px
          position: relative
          .check-span
            padding: 0 40px
          .orange
            color: $orange
        .next-btn
          float: left
          font-size: 16px
          width: 202px
          height: 52px
          line-height: 52px
          text-align: center
          background: $blue
          color: #fff
          cursor: pointer
          border-radius: 0 4px 4px 0
          &.grey
            color: $gray
            background: $borderColor
            cursor: not-allowed
        .next-btn-zd
          float: right
          height: 50px
          line-height: 50px
          text-align: center
          width: 148px
          border: 1px solid $blue
          border-radius: 4px
          color: $blue
          background: #ecf8ff
          cursor: pointer
          &.grey
            color: $gray
            background: $borderColor
            border-color: $borderColor
            cursor: not-allowed
</style>

<style lang="stylus">
  .good-manage
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
