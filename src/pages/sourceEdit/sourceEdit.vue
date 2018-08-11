<template>
  <div>
    <head-top>
      <span class="title" slot="index">{{userType == 1?'货主':'物流公司'}}-工作台</span>
      <div class="header-center" slot="menu">
        <ul>
          <router-link tag="li" to="/source" class="active">首页</router-link>
          <router-link tag="li" to="/finaindex">财务管理</router-link>
          <router-link tag="li" to="/account">账户信息</router-link>
        </ul>
      </div>
      <drop-down slot="info"></drop-down>
    </head-top>
    <div class="content clear">
      <div class="content-left">
        <ul>
          <router-link tag="li" to="/source">发布货源</router-link>
          <router-link class="active" to="/sourceList" tag="li">货源列表</router-link>
          <router-link to="/product" tag="li">产品库</router-link>
        </ul>
      </div>
      <div class="content-right" v-loading="loading">
        <div class="product fr">
          <p class="title-box"><span class="title-name">修改货源</span></p>
          <div class="container clear">
            <!--产品库 start-->
            <div>
              <!--列表内容 start-->
              <div class="list-content">
                <!--右侧列表 start-->
                <div class="list-right">
                  <template class="size14">
                    <el-table
                      header-row-class-name="table-bg"
                      :data="ProList"
                      style="width: 100%"
                      size="small"
                      max-height="571">
                      <template slot="empty">
                        <p>没有数据</p>
                      </template>
                      <el-table-column
                        label="系列/名称/型号"
                        width="230">
                        <template slot-scope="scope">
                          <p class="product-name" :title="scope.row.CommCatena">{{ scope.row.CommCatena }}</p>
                          <p class="size12 gray-txt">
                            <span class="text-ellipsis" :title="scope.row.CommName">{{ scope.row.CommName }}</span><span class="text-ellipsis" :title="scope.row.ModelName">—{{scope.row.ModelName}}</span>
                          </p>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="货源类型"
                        prop="CommCargoName"
                        width="130">
                      </el-table-column>
                      <el-table-column
                        prop="CommVolume"
                        label="体积(m³)"
                        width="160">
                        <template slot-scope="scope">
                          <p class="size14">
                            {{scope.row.CommVolume}}m³
                          </p>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="CommWeight"
                        label="重量(吨)"
                        width="160">
                        <template slot-scope="scope">
                          <p class="size14">{{scope.row.CommWeight}}吨</p>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="CommMoney"
                        label="货值（元）"
                        width="110">
                      </el-table-column>
                      <el-table-column
                        label="数量"
                        width="120">
                        <template slot-scope="scope">
                          <el-popover
                            placement="bottom-end"
                            title="数量(可手动输入)"
                            width="300"
                            trigger="click"
                            v-model="showPopover[scope.$index]"
                          >
                            <num-assemly :dataCur="scope" @getNum="getNum"></num-assemly>

                            <el-input size="mini" v-model="scope.row.CommAmount"  slot="reference"
                                      @blur="checkNumber(scope.row.CommAmount,scope.$index,ProList)"></el-input>
                          </el-popover>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </div>
                <!--右侧列表 end-->
              </div>
              <!--列表内容 end-->
            </div>
            <!--产品库 end-->
            <!--信息概览 start-->
            <div class="source-info clear">
              <span class="left-title">产品信息</span>
              <ul>
                <li>
                  <p class="head-title">产品种类</p>
                  <p class="blue-txt">{{order.ProductTypeCount}}</p>
                </li>
                <li>
                  <p class="head-title">产品件数</p>
                  <p class="blue-txt">{{AllNumber}}</p>
                </li>
                <li class="large">
                  <p class="head-title">总货值/元</p>
                  <p class="blue-txt">{{AllPrice}}</p>
                </li>
                <li class="normal">
                  <p class="head-title">泡货体积/m³</p>
                  <p class="blue-txt">{{bubblesVolume}}</p>
                </li>
                <li class="normal">
                  <p class="head-title">重货重量/吨</p>
                  <p class="blue-txt">{{ProductWeight}}</p>
                </li>
                <li class="large">
                  <p class="head-title large">总体积/m³</p>
                  <p class="blue-txt">{{AllVolume}}</p>
                </li>
                <li class="large">
                  <p class="head-title large">总重量/吨</p>
                  <p class="blue-txt">{{AllWeight}}</p>
                </li>
              </ul>
            </div>
            <!--信息概览 end-->
            <!-- 金额 S -->
            <div class="source-freight-fee">
              <label for="fee">运费金额(元)</label>
              <input type="text" id="fee" placeholder="运费价格由修改前价位推出" v-model="sourceData.Freight" disabled />
              <div class="freight-fee_help">?</div>
              <div class="popover">
                <div>抢单模式，运费价格=修改前运费推算出的单价*修改后体积重量；</div>
                <div>最低价模式，运费价格=选中的司机轻重货报价推算的单价*修改后体积重量；</div>
                <div class="popover-arrow"></div>
              </div>
            </div>
            <!-- 金额 E -->
            <!-- 打印标签 S -->
            <div class="print-tag">
              <el-checkbox v-model="print">确认打印标签</el-checkbox>
            </div>
            <!-- 打印标签 E -->
            <!-- SAVE S -->
            <div class="source-save">
              <a @click="updateSource()" class="source-save-btn">保存修改</a>
            </div>
            <!-- SAVE E -->
          </div>
        </div>
      </div>
    </div>
    <foot></foot>
    <!-- 结束 -->
  </div>
</template>


<script>
  import headTop from "components/header/head";
  import dropDown from "components/header/children/dropdown";
  import numAssemly from "components/num-assemly/num-assemly";
  import foot from "components/footer/foot";
  import regs from "config/regExp";
  import { getTimes } from 'config/getTimes'

  /** 小星引入未审核弹窗与发布成功后弹窗 **/
  import { CarLongList } from "config/publicParam"; // 提取了下CarLongList
  /** 结束 **/

  import { mapGetters, mapMutations } from 'vuex';
  import m_login from '@/mixins/m_login'
  import {
    GetHeavyCargoStandard,
    GetOrderProductList,
    UpdateOrderProductList
  } from "api/getData";

  import { getUserRole } from 'config/myUtils';

  export default {
    mixins: [m_login],
    data() {
      return {
        merchantStatus: this.$cookie.get("MerchantStatus"), // 新参数 用户审核状态
        loading: false,
        index: '1',//确定点击的输入框
        userCharacter: this.$cookie.get("MemberDutiesID"),
        showPopover: [],// 是否显示数量选择框
        // 限制时间输入
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < new Date().setDate(new Date().getDate() - 1);
          }
        },
        caterIDbox: {
          MerchantID: this.$cookie.get("MemberMerchantID"),
          MemberID: this.$cookie.get("MemberID"),
          ModelIDs: ""
        },
        hasCommit: false, //是否已经提交
        ModelList: [], //车型数据
        CarLongList: CarLongList, //车长数据
        ProModelID: "", //普货ID
        NormalProList: [], //普货列表
        ProList: [],
        order: {},
        sourceData: {
          //货源数据
          Product : [],
          ProductCount: 0,
          LightCargo: "",
          HeavyCargo: "",
          MemberID: this.$cookie.get("MemberID"),
          MerchantID: this.$cookie.get("MemberMerchantID"),
          OrderID: this.$route.params.id,
          Volume: "",
          Weight: "",
          Freight: 0,
        },
        print: true,
      };
    },
    methods: {
      getUserRole: getUserRole,
      //获取货源数据
      async getSource() {
          let param = {
            MerchantID: this.$cookie.get("MemberMerchantID"),
            MemberID: this.$cookie.get("MemberID"),
            OrderID: this.$route.params.id
          };
          const { data: { ResultCode, ResultValue, ResultMessage}} = await GetOrderProductList(param);
          if(ResultCode === '000000'){
              let data = ResultValue[0];
              this.order = data;
              this.ProList = data.commodityList;
              this.loading = false;
          } else {
              this.$message({
                type: 'error',
                message: ResultMessage
              })
          }
      },
      async updateSource() {
          let arr = [];
          let param = this.sourceData;
          this.ProList.forEach(function(l){
              let o = {};
              o.CommID = l.CommID;
              o.Amount = l.CommAmount;
              arr.push(o);
          });
          param.Product = JSON.stringify(arr);
        console.log(param);
        const result = await UpdateOrderProductList(param);
        console.log(result);
      },
      // 获取 数量
      getNum (num, scope) { // 小星添加
        this.checkNumber(scope.row.CommAmount, scope.$index, this.ProList);
        scope.row.CommAmount = Number(num); // 赋值
        this.showPopover[scope.$index] = false;
        this.$set(this.ProList, scope.$index, this.ProList[scope.$index]); // 刷新
      },
      //验证输入数量
      checkNumber(Number, index, data) {
        if (!regs.Number1.test(Number)) {
          data[index].CommAmount = 1;
          this.$message.error({ message: "请输入正确的数量！" });
        }
      },
      async GetHeavyCargoStandard () {
        const { data : { ResultCode, ResultValue}} = await GetHeavyCargoStandard();
        if (ResultCode === '000000') {
          this.SET_bulkyCargo(ResultValue)
        }
      },
      ...mapMutations({
        SET_bulkyCargo: 'SET_bulkyCargo'
      })
    },
    created() {
      let isLogin = this.checkLoginStatus();
      if(!isLogin) return;
      let _ = this;
      let identityPass = this.checkLoginIdentity(1, '/add', function(){
        _.loading = true;
        if (_.$route.params.id) {
          _.getSource();
        }
      });
      if( !identityPass) return;
      // 判断阈值是否存在
      if (this.bulkyCargo < 0) {
        this.GetHeavyCargoStandard()
      }
    },
    mounted () {
      if (this.merchantStatus == 0 || this.merchantStatus == 1 || this.merchantStatus == -1) {
        let param = 'ifShowIssueDialogNum' + this.$cookie.get("MemberID");
        let ifshowdNum = sessionStorage.getItem(param)
        if (!ifshowdNum) {
          sessionStorage.setItem(param, '0')
        }
        if (ifshowdNum == 0 || !ifshowdNum) {
          sessionStorage.setItem(param, '1')
          this.ifShowLoginDialog = true
        }
      }
    },
    computed: {
      //总货值
      AllPrice() {
        let price = 0;
        this.ProList.forEach(function(item){
          price += item.CommAmount * item.CommMoney;
        });
         return price ?  price.toFixed(2) : 0;
//        this.sourceData.Freight = price;
      },
      //总数量
      AllNumber() {
        let count = 0;
        this.ProList.forEach(function(item){
            count += parseInt(item.CommAmount ? item.CommAmount : 0);
        });
        count = count ? count : 0;
        this.sourceData.ProductCount = count;
        return count;
      },
      //总体积
      AllVolume: {
        get() {
          let volume = 0;
          this.ProList.forEach(function(item) {
            volume += item.CommVolume * item.CommAmount
          })
          this.sourceData.Volume = volume.toFixed(2);
          return volume.toFixed(2);
        },
        set(val) {
          this.sourceData.Volume = val;
        }
      },
      //总重量
      AllWeight: {
        get(){
          let weight = 0;
          this.ProList.forEach(function(item) {
            weight += item.CommWeight * item.CommAmount
          })
          this.sourceData.Weight = weight.toFixed(2);
          return weight.toFixed(2);
        },
        set(val){
          this.sourceData.Weight = val;
        }
      },
      //泡货体积
      bubblesVolume() {
        let productVolume = 0;
        let _ = this;
        this.ProList.forEach(function(item) {
          let density = item.CommWeight * 1000 / item.CommVolume;
          if (density < _.bulkyCargo) {
            productVolume += item.CommVolume * item.CommAmount;
          }
        });
        this.sourceData.LightCargo = productVolume.toFixed(2);
        return productVolume.toFixed(2);
      },
      //重货重量
      ProductWeight() {
        let WeightProduct = 0;
        let _ = this;
        this.ProList.forEach(function(item) {
          let density = item.CommWeight * 1000 / item.CommVolume;
          if (density >= _.bulkyCargo) {
            WeightProduct += item.CommWeight * item.CommAmount;
          }
        });
        this.sourceData.HeavyCargo = WeightProduct.toFixed(2);
        return WeightProduct.toFixed(2);
      },
      ...mapGetters([
        'bulkyCargo'
      ])
    },
    components: {
      headTop,
      dropDown,
      foot,
      numAssemly,
    }
  };
</script>

<style lang="stylus" scoped>
  @import '../../assets/styles/variable.styl'

  .content 
    position: relative
    width: 1200px
    margin: 10px auto 40px
  .content-left 
    float: left
    width: 200px
    background: #ffffff
    > ul 
      width: 200px
      position: absolute
      height: 100%
      background-color: #fff
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
    background-color: #fff
    .product 
      background: #FFFFFF
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
      padding: 40px
      .list-content 
        position: relative
        overflow: hidden
      .list-right 
        height: 399px
        overflow-y: auto
        overflow-x: hidden
        border: 1px solid $borderColor
        .add 
          color: $blue
          text-align: center
          cursor: pointer
        .text-ellipsis 
          display: inline-block
          max-width: 70px
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
  .source-info 
    height: 90px
    line-height: 90px
    margin: 20px 0
    border: 1px solid $borderColor
    >ul
      float: left
      line-height: normal
      overflow: hidden
      li
        float: left
        width: 100px
        .head-title
          height: 40px
          line-height: 40px
          text-align: center
          background-color: #F7FBFB
        .blue-txt
          height: 50px
          line-height: 50px
          text-align: center
        .input
          width: 100px
      .large
        width: 120px
      .normal
        width: 114px
    .left-title 
      float: left
      width: 120px
      text-align: center
      color: #ffff
      background: #409eff
      font-size: 16px
    .info 
      margin-top: 12px
      line-height: normal
      .info-item 
        margin-right: 20px
  .fill 
    padding: 0 20px
    .address 
      float: left
      width: 300px
      margin-right: 10px
    .detailes
      float: left
      width: 400px
      margin-right: 10px
      .mapIcon
        display: inline-block
        width: 30px
        height: 30px
        line-height: 30px
    .large
      width: 444px
  .tip-box 
    padding: 0 40px 50px
  .tip-icon 
    margin-left: 10px
    color: $blue
    font-size: 24px
    cursor: pointer
  .normal 
    width: 217px
  .add-now 
    width: 200px
    font-size: 16px
  .product-name 
    width: 180px
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
  .source-freight-fee 
    margin-top: 40px
    position: relative
  .source-freight-fee label 
    text-align: right
    font-size: 14px
    color: #333
    line-height: 30px
    margin-right: 20px
    -webkit-box-sizing: border-box
    box-sizing: border-box
  .source-freight-fee input 
    -webkit-appearance: none
    background-color: #fff
    background-image: none
    border-radius: 2px
    border: 1px solid #e0e0e0
    box-sizing: border-box
    color: #606266
    display: inline-block
    font-size: inherit
    height: 30px
    line-height: 30px
    outline: none
    padding: 0 15px
    transition: border-color .2s cubic-bezier(.645,.045,.355,1)
    width: 210px
  .source-freight-fee .freight-fee_help 
    width: 20px
    height: 20px
    line-height: 20px
    font-size: 14px
    border-radius : 50%
    border: 1px solid #027cff
    color: #027CFF
    text-align: center
    display inline-block
    margin: 0 10px
  .popover 
    background: #fff
    width: 480px
    border: 1px solid #ebeef5
    padding: 12px
    z-index: 2000
    color: #606266
    line-height: 1.4
    text-align: justify
    font-size: 14px
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1)
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1)
    display inline-block
    position: absolute
    top: -20px
  .popover-arrow 
    position: absolute
    display: block
    width: 0
    height: 0
    border-color: transparent
    border-style: solid
    border-width: 6px
    -webkit-filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03))
    filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03))
    top: 26px
    left: -6px
    margin-bottom: 3px
    border-right-color: #ebeef5
    border-left-width: 0
  .popover-arrow:after 
    position: absolute
    display: block
    width: 0
    height: 0
    border-color: transparent
    border-style: solid
    content: " "
    border-width: 6px
    bottom: -6px
    left: 1px
    border-right-color: #fff
    border-left-width: 0
  .source-save 
    text-align center
    margin-top: 20px
  .source-save-btn 
    display: inline-block
    background: #027CFF
    border-radius: 100px
    color: #fff
    font-size: 16px
    width: 200px
    height: 40px
    line-height: 40px
    cursor pointer
  .print-tag 
    margin: 20px 0 0 100px
</style>
