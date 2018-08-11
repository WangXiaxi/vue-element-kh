<!--
  * 添加编辑专线，弹出的dialog
  * param
    closeDialog: 返回close 事件
-->

<template>
  <div class="special-line-dialog">
    <el-dialog
      :visible.sync="dialog.visible"
      width="980px"
      :title="dialog.title"
      @close="closeDialog"
      center>
      <el-form ref="formData" :model="formData" label-width="160px" label-position="left"  :rules="Rules">
        <el-form-item label="出发地">
          <el-cascader class="small-item"
            :options="addressSpec"
            placeholder="请选择发货地"
            v-model="formData.fromAddress"
            size="small">
          </el-cascader>
        </el-form-item>
        <el-form-item label="目的地" prop="toAddress">
          <el-cascader class="small-item"
            :options="addressSpecTo"
            placeholder="请选择发货地"
            v-model="formData.toAddress"
            size="small"
            clearable
            @change="handChange"
            change-on-select>
          </el-cascader>
        </el-form-item>

        <div class="item-box">
          <el-form-item label="车长/车型" prop="LongS">
            <el-autocomplete
              class="normal"
              size="small"
              v-model="formData.LongS"
              :fetch-suggestions='getLongList'
              placeholder="车长">
            </el-autocomplete>
          </el-form-item>

          <el-form-item>
            <el-select placeholder="车型" v-model="formData.ModelS" size="small">
              <el-option
                v-for="(item,index) in ModelList"
                :key="item.index"
                :label="item.DictName"
                :value="item.DictID">
              </el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="item-box">
          <el-form-item label="泡货报价" prop="LightFloorPrice">
            <el-input placeholder="请输入泡货最低价" v-model="formData.LightFloorPrice" size="small">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>

          <el-form-item prop="LightCeilingPrice">
            <el-input placeholder="请输入泡货最高价" v-model="formData.LightCeilingPrice" size="small">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>

          <el-form-item prop="LightDecline">
            <el-input placeholder="请输入泡货降价百分比" v-model="formData.LightDecline" size="small">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <span class="bubble-text" @click="showQuotedExplain">
              <i class="el-icon-warning"></i>
            </span>
          </el-form-item>
        </div>

        <div class="item-box">
          <el-form-item label="重货报价" prop="HeavyFloorPrice">
            <el-input placeholder="请输入重货最低价" v-model="formData.HeavyFloorPrice" size="small">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>

          <el-form-item prop="HeavyCeilingPrice">
            <el-input placeholder="请输入重货最高价" v-model="formData.HeavyCeilingPrice" size="small">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>

          <el-form-item prop="HeavyDecline">
            <el-input placeholder="请输入重货降价百分比" v-model="formData.HeavyDecline" size="small">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <span class="bubble-text" @click="showQuotedExplain">
              <i class="el-icon-warning"></i>
            </span>
          </el-form-item>
        </div>

        <el-form-item class="mt-20">
          <el-button class="btn" type="primary" round @click="onSubmit">保存</el-button>
          <!--<el-button class="btn" round v-if="dialog.type === 'edit'" @click="dele">删除</el-button>-->
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 运费价格解说弹框 start -->
    <quoted-explain-dialog :dialog="quotedExplainDialog"></quoted-explain-dialog>
    <!-- 运费价格解说弹框 end -->
  </div>
</template>

<script>
  import address from 'config/address'
  import { CarLongList } from "config/publicParam" // 提取了下CarLongList
  import { getCarModelList, DedicatedLineDelete, DedicatedLineUpdate, DedicatedLineNew, CanCompanyAddRoute } from "api/getData"
  import quotedExplainDialog from 'components/quotedExplainDialog/quotedExplainDialog' // 运费价格解说
  import regs from "@/config/regExp"

  const validZero = {
    validator: (rule, value, callback) => {
      if (Number(value) <= 0) {
        callback('请输入大于0的数字')
      } else {
        callback();
      }
    },
    trigger: "blur"
  }

  export default {
    props:['dialog', 'formData'],
    data () {
      return {
        regs,
        has: false,
        quotedExplainDialog: { visible: false },
        address: address.area,
        addressSpec: [],
        addressSpecTo: [], // 目的地区添加全部
        ModelList: [],
        Rules: {
          toAddress: [
            { required: true, message: "请选择收货地址", trigger: "blur" },
            {
              validator: (rule, value, callback) => {
                let _ = this.formData.fromAddress
                if (_[0] == value[0] && _[1] == value[1] && _[2] == value[2]) {
                  callback(new Error("目的地省市区不能完全相同"))
                }
                if(value.length < 2){
                  callback(new Error("目的地请选择到省市"))
                } else {
                  callback()
                }
              },
              trigger: "change"
            }
          ],
          LongS: [
            {
              validator: (rule, value, callback) => {
                if (value >= 1 && value <= 35) {
                  callback()
                } else if (value == "不限") {
                  callback()
                } else {
                  callback(new Error("车长最大为35米！"))
                }
              },
              trigger: "change"
            }
          ],
          LightFloorPrice: [
            { required: true, message: "请输入泡货最低价", trigger: "blur" },
            { pattern: regs.NF2, message: "请输入最多两位小数的数字", trigger: "blur" },
            validZero
          ],
          LightCeilingPrice: [
            { required: true, message: "请输入泡货最高价", trigger: "blur" },
            { pattern: regs.NF2, message: "请输入最多两位小数的数字", trigger: "blur" },
            validZero
          ],
          LightDecline: [
            { required: true, message: "请输入泡货降价百分比", trigger: "blur" },
            { pattern: regs.NF2, message: "请输入最多两位小数的数字", trigger: "blur" },
            validZero
          ],
          HeavyFloorPrice: [
            { required: true, message: "请输入重货最低价", trigger: "blur" },
            { pattern: regs.NF2, message: "请输入最多两位小数的数字", trigger: "blur" },
            validZero
          ],
          HeavyCeilingPrice: [
            { required: true, message: "请输入重货最高价", trigger: "blur" },
            { pattern: regs.NF2, message: "请输入最多两位小数的数字", trigger: "blur" },
            validZero
          ],
          HeavyDecline: [
            { required: true, message: "请输入重货降价百分比", trigger: "blur" },
            { pattern: regs.NF2, message: "请输入最多两位小数的数字", trigger: "blur" },
            validZero
          ]
        }
      }
    },
    created () {
      this.addressHandle();
      this.addressSpecToAct(); // 操作下数据

      //获取车型列表
      getCarModelList().then(res => {
        if (res.data.ResultCode === '000000' && res.data.ResultValue) {
          res.data.ResultValue.push({DictID: '', DictName: '不限'})
          this.ModelList = res.data.ResultValue
        }
      })
    },
    methods: {

	  addressHandle () { // 处理下不让选省市
        let fa = this.formData.fromAddress,
            arr = [];
        address.area.forEach((c, i) => {
          if (fa[0] === c.value) {
            arr.push(Object.assign({}, c));
            c.children.forEach((d, j) => {
              if (d.value === fa[1]) {
                arr[0].children = [];
                arr[0].children.push(Object.assign({}, d));
              }
            })
          }
        });
        this.addressSpec = arr;
      },

      handChange (val) { // 如果存在空删除 为了显示统一
        if (!val[2]) {
          val.splice(2, 1)
        }
      },
      addressSpecToAct () {
        let addressCopy = JSON.parse(JSON.stringify(this.address)); // 复制一个
        console.log(addressCopy)
        addressCopy.forEach((c) => {
          if (c.children) {
            c.children.forEach((d) => {
              if (d.children) {
                d.children.splice(0, 0, {
                  value: '',
                  label: '全部'
                })
              }
            })
          }
        })
        this.addressSpecTo = addressCopy;
      },
      onSubmit () {
        if (Number(this.formData.LightCeilingPrice) <= Number(this.formData.LightFloorPrice)) {
          this.$message({
            type: 'error',
            message: '泡货最低价不能高于最高价'
          });
          return
        }
        if (Number(this.formData.HeavyCeilingPrice) <= Number(this.formData.HeavyFloorPrice)) {
          this.$message({
            type: 'error',
            message: '重货最低价不能高于最高价'
          });
          return
        }
        this.$refs['formData'].validate(async valid => {
          if (!valid) return
          if (this.dialog.type === 'edit') {
            this.sureSubmit()
            return
          }
          const res = await CanCompanyAddRoute()
          let title = '',
              des = '',
              btnName = ''
          if (res.data.ResultCode === '000000') {
            let _ = res.data.ResultValue
            title = _.Title
            des = _.Message
            let callback = {}
            if ([1, 8, 10, 11].indexOf(Number(_.Type)) > -1) { // 状态 为这些是可以添加
              btnName = '确认添加'
              callback = this.sureSubmit
            } else if ([6, 7, 9].indexOf(Number(_.Type)) > -1) { // 状态 为这些就去支付
              btnName = '去支付'
              callback = () => {
                this.$router.push('/recharge')
              }
            }
            this.$confirm(title + '<p style="color:#999;">' + des + '</p>', '提示', {
              dangerouslyUseHTMLString: true,
              confirmButtonText: btnName,
              showCancelButton: false,
              type: 'warning'
            }).then(async () => {
              callback()
            }).catch(() => {
            })
          }
        })
      },
      async sureSubmit () {
        let res = {}
        this.formData.FromProvince = this.formData.fromAddress[0]
        this.formData.FromCity = this.formData.fromAddress[1]
        this.formData.FromCounty = this.formData.fromAddress[2]
        this.formData.ToProvince = this.formData.toAddress[0]
        this.formData.ToCity = this.formData.toAddress[1]
        this.formData.ToCounty = this.formData.toAddress[2]
        let reqParams = {}
        reqParams = Object.assign({}, this.formData, {
          LongS: this.formData.LongS == '不限' ? '99' : this.formData.LongS,
          HeavyDecline: Number(this.formData.HeavyDecline),
          LightDecline: Number(this.formData.LightDecline)
        })
        switch (this.dialog.type) {
          case 'add':
          res = await DedicatedLineNew(reqParams)
          break
          case 'edit':
          res = await DedicatedLineUpdate(reqParams)
          break
        }
        if (res.data.ResultCode === '000000') {
          this.$message({
            type: 'success',
            message: res.data.ResultMessage
          });
          this.closeDialog()
          this.$emit('callback', true)
        }
      },
      dele () {
        this.$confirm('确定删除该专线？<p style="color:#999;">删除后，您无法查看该专线的货源！</p>', '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await DedicatedLineDelete({routeID: this.formData.RouteID})
          if (res.data.ResultCode === '000000') { // 删除成功
            this.$message({
              type: 'success',
              message: res.data.ResultMessage
            })
            this.closeDialog()
            this.$emit('callback', true) // 回调 第一个参数判断是否刷新
          }
        }).catch(() => {
        })
      },
      closeDialog () { // 继续发布 同取消 一样
        this.dialog.visible = false
        setTimeout(() => {
          this.dialog.ifVisible = false
        }, 500)
      },
      //获取车长列表
      getLongList(queryString, callback) {
        callback(CarLongList)
      },
      showQuotedExplain () { // 显示报价解说弹框
        this.quotedExplainDialog.visible = true
      }
    },
    computed: {
    },
    components: {
      quotedExplainDialog
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../assets/styles/variable.styl"
  .special-line-dialog
    .btn
      width: 200px
    .item-box
      .el-form-item
        display: inline-block
        &:not(&:first-child)
          .el-form-item__content
            margin-left: 10px !important
    .bubble-text
      color: $blue
      cursor: pointer
</style>
<style lang="stylus">
  .special-line-dialog
    .el-dialog__body
      padding: 50px 50px 50px
      text-align: left
    .el-dialog__header
      height: 30px
      line-height: 30px
      font-size: 14px
      padding: 10px 0 10px 0
      border-bottom: 1px solid #f0f0f0
      .el-dialog__title
        display: block
        height: 30px
        line-height: 30px
        font-size: 14px
        text-align: left
        border-left: 2px solid #027CFF
        padding-left: 10px
      .el-dialog__headerbtn
        top: 17px
    .item-box
      .el-form-item
        &:not(:first-child)
          .el-form-item__content
            margin-left: 10px !important
    .el-form-item
      .el-input
        width: 200px
</style>
