<template>
  <div>
    <head-top>
      <span class="title" slot="index">{{userType == 1?'货主':'物流公司'}}-工作台</span>
      <div class="header-center" slot="menu" v-if="userType == 1">
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
          <router-link to="/sourceList" tag="li">货源列表</router-link>
          <router-link to="/product" tag="li" class="active">产品库</router-link>
        </ul>
      </div>
      <div class="product">
        <p class="title-box"><span class="title-name">产品库</span></p>
        <div class="container clear">

          <!--产品库 start-->
          <div class="container-list">

            <!--列表内容 start-->
            <div class="list-content">

              <!--左侧树形筛选 start-->
              <div class="list-left">
                <div class="left-name">产品分类</div>
                <div class="tree-list">
                  <el-tree
                  :data="data5"
                  show-checkbox
                  node-key="id"
                  ref="data5"
                  :default-expand-all="true"
                  :indent="8"
                  @check="filter"
                  @check-change="checkchange"
                  :expand-on-click-node="false">
                  <span class="custom-tree-node" slot-scope="{ node, data }" style="width:100%">
                    <el-tooltip class="item" effect="dark" :content="node.label" placement="right">
                      <span class="tree-name">{{ node.label }}</span>
                    </el-tooltip>
                    <span class="ml-10 fr treeicon" style="padding-right: 10px">
                      <el-tooltip class="item" effect="dark" content="编辑" placement="top-start" v-if="!getUserRole(userCharacter,'财务')">
                        <i class="el-icon-edit left-icon" @click="() => append(data)"></i>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" content="删除" placement="top-start" v-if="!getUserRole(userCharacter,'财务')">
                        <i class="el-icon-delete left-icon" @click="() => remove(node, data)"></i>
                      </el-tooltip>
                    </span>
                    </span>
                  </el-tree>
                </div>
              </div>
              <!--左侧树形筛选 end-->

              <!--右侧列表 start-->
              <div class="list-right">
                <template>
                  <el-table
                    :data="ProList"
                    style="width: 100%"
                    size="small"
                    max-height="571">
                    <el-table-column
                      label="系列/名称/型号"
                      width="200">
                      <template slot-scope="scope">
                        <p class="product-name" :title="scope.row.ProductName">{{ scope.row.ProductName }}</p>
                        <p class="size12 gray-txt"><span class="model-name" :title="scope.row.CatenaName">{{ scope.row.CatenaName }}</span><span class="fl">—</span><span class="model-name" :title="scope.row.ModelName">{{scope.row.ModelName}}</span></p>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="长宽高(cm)"
                      width="120">
                      <template slot-scope="scope">
                        <p>{{ scope.row.Length }}*{{ scope.row.Width }}*{{ scope.row.Height }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="Weight"
                      label="重量(kg)"
                      width="90">
                    </el-table-column>
                    <el-table-column
                      prop="Money"
                      label="货值(元)"
                      width="100">
                    </el-table-column>
                    <el-table-column
                      prop="ClassifyName"
                      label="货物类型"
                      width="100">
                    </el-table-column>
                    <el-table-column
                      fixed="right"
                      label="操作"
                      width="90">
                      <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" @click.native.prevent="editPro(scope.row)" v-if="!getUserRole(userCharacter,'财务')"
                                    content="编辑" placement="top-start">
                          <i class="el-icon-edit-outline"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top-start" v-if="!getUserRole(userCharacter,'财务')"
                                    @click.native.prevent="deletePro(scope.row.ModelID,scope.$index,ProList)">
                          <i class="el-icon-delete"></i>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
                <p class="bottom">
                  <el-button v-if="!getUserRole(userCharacter,'财务')" type="text" @click="addDialogfcu"><i class="el-icon-plus"></i>添加新产品</el-button>
                </p>
              </div>
              <!--右侧列表 end-->
            </div>
            <!--列表内容 end-->
          </div>
          <!--产品库 end-->
        </div>
      </div>
    </div>
    <foot></foot>
    <!--新增弹出层 start-->
    <el-dialog :title="dialogtitle" :visible.sync="addDialog" :close-on-click-modal="false" status-icon
               :close-on-press-escape="false" @open="open" @close="close" width="900px">
      <div class="tip-box">
        <el-form label-width="150px" label-position="left" :model="addData" :rules="addDataRules" ref="addData"
                 @validate='validate'>
          <el-form-item label="产品系列" prop="CatenaName">
              <el-autocomplete
                class="large-width"
                v-model.trim="addData.CatenaName"
                placeholder="请输入产品系列名称"
                :fetch-suggestions="getSortData"
                @select="SortSelect"
                clearable>
                <template slot-scope="{ item }">
                  <div class="name">{{ item.CatenaName}}</div>
                </template>
              </el-autocomplete>
          </el-form-item>
          <el-form-item label="产品名称" prop="Name">
             <el-form-item prop="Name">
                <el-autocomplete
                class="large-width"
                  v-model.trim="addData.Name"
                  placeholder="请输入产品名称"
                  :fetch-suggestions="getProNameData"
                  @select="NameSelect"
                  clearable
                ></el-autocomplete>
              </el-form-item>
          </el-form-item>
          <el-form-item label="产品型号" prop="ModelName">
            <el-autocomplete
            class="large-width"
                  v-model.trim="addData.ModelName"
                  placeholder="请输入产品型号"
                  :fetch-suggestions="getTypeData"
                  clearable
                ></el-autocomplete>
          </el-form-item>
          <el-form-item label="包装长宽高">
            <div class="normal-width fl mr-10">
              <el-form-item prop="Length">
                <el-input auto-complete="off" placeholder="长" v-model.trim="addData.Length">
                  <template slot="append">cm</template>
                </el-input>
              </el-form-item>
            </div>
            <div class="normal-width fl mr-10">
              <el-form-item prop="Width">
                <el-input auto-complete="off" placeholder="宽" v-model.trim="addData.Width">
                  <template slot="append">cm</template>
                </el-input>
              </el-form-item>
            </div>
            <div class="normal-width fl">
              <el-form-item prop="Height">
                <el-input auto-complete="off" placeholder="高" v-model.trim="addData.Height">
                  <template slot="append">cm</template>
                </el-input>
              </el-form-item>
            </div>
            <p class="tip-msg" v-if="isShowTip">*产品发货时的外包装长宽高</p>
          </el-form-item>
          <el-form-item label="产品重量" prop="Weight">
            <div class="normal-width">
              <el-input auto-complete="off" placeholder="产品重量" v-model.trim="addData.Weight">
                <template slot="append">kg</template>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item label="产品货值" prop="Money">
            <div class="normal-width fl mr-10">
              <el-input auto-complete="off" class="normal-width" placeholder="产品货值" v-model.trim="addData.Money">
                <template slot="append">元</template>
              </el-input>
            </div>
            <div class="normal-width fl mr-10">
              <span class="red-text">单件货物价格</span>
            </div>
          </el-form-item>
          <el-form-item label="货物类型" prop="ClassifyID">
            <div class="normal-width fl">
              <el-select v-model="addData.ClassifyID" placeholder="请选择" @change="handleSelect" :disabled="!isAllowChange">
                <el-option
                  v-for="item in protypelist"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="Bubbletext" v-if='choosetype.id==addData.ClassifyID'>
              <span>{{changeBubble}}</span>
              <el-tooltip :content="`少于1立方米/${bulkyCargo}公斤是泡货，多于1立方米/${bulkyCargo}公斤是重货。如有疑问请联系客服：0571-57137790`" placement="right"
                          effect="light">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <input type="hidden" v-model="addData.ProductID">
          <el-button type="primary" class="save" :disabled="hasCommit" round @click="productAddSubmit('addData')">保存
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!--新增弹出层 end-->
    <el-dialog title="编辑产品分类" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="reviseform" ref="reviseform">
        <el-form-item label="产品分类" label-width="100px" prop="Name" :rules="[
                        { required: true, message: '产品分类为空', trigger: 'blur' },
                        {validator: this.checkLeng, trigger: 'change'}
                      ]">
          <el-input v-model="reviseform.Name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="PropertyUpdate('reviseform')">通 过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="es6">
import headTop from "components/header/head";
import dropDown from "components/header/children/dropdown";
import foot from "components/footer/foot";
import regs from "config/regExp";
import { setStore, getStore, removeStore } from "config/myUtils";
import { bulkyCargo } from "config/publicParam"; // 提取了下bulkyCargo 泡货界限
import {
  getSortList,
  getProNameList,
  getTypeList,
  addProduct,
  editProduct,
  getProduct,
  deleteProduct,
  getAllList,
  getCatenaList,
  GetPropertyTree,
  PropertyUpdate,
  PropertyDelete,
  getProTypeList,
  ProductGetAll,
  GetHeavyCargoStandard // 获取重货阈值接口
} from "api/getData";

import { mapGetters, mapMutations } from 'vuex';
import { getUserRole } from 'config/myUtils';
export default {
  data() {
    const data = [];
    return {
      userCharacter: this.$cookie.get("MemberDutiesID"),
      userType: this.$cookie.get("MemberCrowd"),
      data5: data,
      dialogFormVisible: false,
      reviseform: {
        //修改的系列名称列表
        PropertyID: "",
        Name: "",
        MemberID: this.$cookie.get("MemberID")
      },
      Bubbletype: false,
      prolistbox: [], //货物类型下拉列表
      protypelist: [], //货物类型下拉列表
      deltype: {
        //删除产品分类数据
        PropertyID: "",
        MemberID: this.$cookie.get("MemberID")
      },
      delpro: {
        //删除产品分类数据
        ProductID: "",
        MemberID: this.$cookie.get("MemberID")
      },
      choosetype: {
        //选中的货物类型下拉列表
        id: "",
        name: ""
      },
      addData: {
        //添加产品数据
        MerchantID: this.$cookie.get("MemberMerchantID"),
        CatenaName: "",
        Name: "",
        ModelName: "",
        Length: "",
        Width: "",
        Height: "",
        MemberID: this.$cookie.get("MemberID"),
        Weight: "",
        Money: "",
        ClassifyID: ""
      },
      dialogtitle: "",
      ProductID: "",
      addDialog: false, //是否显示弹出层
      caterIDbox: {
        MerchantID: this.$cookie.get("MemberMerchantID"),
        MemberID: this.$cookie.get("MemberID"),
        ModelIDs: ""
      },
      ProList: [],
      isAllowChange: true,
      hasCommit: false, //钥匙
      treeData: [], //树形结构数据
      CatenaID: "", //系列ID
      CatenaName: "", //系列名字
      ProNameID: "", //产品ID
      ProName: "", //产品名称
      orderType: 0, //订单类型
      isShowTip: true,//是否显示长宽高的提示信息
      addDataRules: {
        //Form规则
        CatenaName: [
          { required: true, message: "请输入产品系列", trigger: "blur" },
          { validator: this.checkLeng, trigger: "change" }
        ],
        Name: [
          { required: true, message: "请输入产品名称", trigger: "blur" },
          { validator: this.checkLeng, trigger: "change" }
        ],
        ModelName: [
          { required: true, message: "请输入产品型号", trigger: "blur" },
          { validator: this.checkLeng, trigger: "change" }
        ],
        Length: [
          { required: true, message: "请输入产品长度" },
          { pattern: regs.Number1, message: "请输入数字！" },
        ],
        Width: [
          { required: true, message: "请输入产品宽度", trigger: "blur" },
          { pattern: regs.Number1, message: "请输入数字！" }
        ],
        Height: [
          { required: true, message: "请输入产品高度", trigger: "blur" },
          { pattern: regs.Number1, message: "请输入数字！" }
        ],
        Weight: [
          { required: true, message: "请输入产品重量", trigger: "blur" },
          {
            pattern: regs.NF2,
            message: "请输入数字！最多保留两位小数",
            trigger: "blur"
          }
        ],
        Money: [
          { required: true, message: "请输入产品价格", trigger: "blur" },
          {
            pattern: regs.NF2,
            message: "请输入数字！最多保留两位小数",
            trigger: "blur"
          }
        ],
        ClassifyID: [
          { required: true, message: "请输入货物类型", trigger: "blur" }
        ]
      },
      props: {
        isLeaf: "leaf"
      }
    };
  },
  methods: {
    getUserRole: getUserRole,
    //获取产品分类
    async GetPropertyTree() {
      let form = { MerchantID: this.$cookie.get("MemberMerchantID") };
      const MerchantGetApplys = await GetPropertyTree(form);
      if (MerchantGetApplys.data.ResultCode == "000000") {
        let josnlist = MerchantGetApplys.data.ResultValue;
        this.treeData = [];
        josnlist.forEach(item => {
          let tableData = {};
          tableData.id = item.FirstID;
          tableData.label = item.FirstName;
          tableData.index = 1;
          tableData.children = [];
          item.SecondList.forEach(items => {
            const tableDatas = {};
            tableDatas.id = items.SecondID;
            tableDatas.label = items.SecondName;
            tableDatas.index = 2;
            tableDatas.children = [];
            tableData.children.push(tableDatas);
            items.ThirdList.forEach(list => {
              const tablelist = {};
              tablelist.id = list.ThirdID;
              tablelist.label = list.ThirdName;
              tableDatas.children.push(tablelist);
            });
          });
          this.treeData.push(tableData);
          this.data5 = JSON.parse(JSON.stringify(this.treeData));
        });
      } else {
        this.$message({
          type: "error",
          message: MerchantGetApplys.data.ResultMessage
        });
      }
    },
    //修改产品分类
    append(data) {
      this.reviseform.PropertyID = data.id;
      this.reviseform.Name = data.label;
      this.dialogFormVisible = true;
      this.ProductGetAll();
    },
    //删除产品分类
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      this.deltype.PropertyID = data.id;
      this.PropertyDelete(children, index);
      this.ProductGetAll();
    },
    //左侧筛选获取列表数据
    filter() {
      let list = this.$refs.data5.getCheckedNodes();
      this.caterIDbox.ModelIDs = "";
      for (let i = 0; i < list.length; i++) {
        if (list[i].index) {
        } else {
          this.caterIDbox.ModelIDs += list[i].id + ",";
        }
      }
      let s = this.caterIDbox.ModelIDs;
      this.caterIDbox.ModelIDs = s.slice(0, s.length - 1);
      this.ProductGetAll();
    },
    checkchange(data, checked, indeterminate){
      if(checked && data.children && data.children.length === 0) {
          this.$message({
            type: 'error',
            message: '该分类下无可选类型，请添加后选择'
          })
      }
    },
    //删除产品
    deletePro(ModelID, index, rows) {
      this.deltype.PropertyID = ModelID;
      this.$confirm("该操作将彻底删除此条产品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const PropertyDeletes = await PropertyDelete(this.deltype);
        if (PropertyDeletes.data.ResultCode == "000000") {
          this.$message({
            type: "success",
            message: PropertyDeletes.data.ResultMessage
          });
          rows.splice(index, 1);
          let checkedIDs = [];
          rows.forEach(function(l, i){
            checkedIDs.push(l.ModelID);
          });
          this.$refs.data5.setCheckedKeys(checkedIDs);
          this.GetPropertyTree();
        } else {
          this.$message({
            type: "error",
            message: PropertyDeletes.data.ResultMessage
          });
          return false;
        }
      });
    },
    //删除产品分类
    async PropertyDelete(children, index) {
      this.$confirm("该操作将彻底删除此条产品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const PropertyDeletes = await PropertyDelete(this.deltype);
        if (PropertyDeletes.data.ResultCode == "000000") {
          this.$message({
            type: "success",
            message: PropertyDeletes.data.ResultMessage
          });
          //this.dialogFormVisible = false;
          children.splice(index, 1);
          this.ProductGetAll();
        } else {
          this.$message({
            type: "error",
            message: PropertyDeletes.data.ResultMessage
          });
          return false;
        }
      });
    },
    //产品分类修改提交
    PropertyUpdate(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const PropertyUpdates = await PropertyUpdate(this.reviseform);
          let treecheck = this.$refs.data5.getCheckedKeys();
          if (PropertyUpdates.data.ResultCode == "000000") {
            this.$message({
              type: "success",
              message: PropertyUpdates.data.ResultMessage
            });
            this.dialogFormVisible = false;
            this.GetPropertyTree();
            this.ProductGetAll();
            this.$refs.data5.setCheckedKeys(treecheck);
          } else {
            this.$message({
              type: "error",
              message: PropertyUpdates.data.ResultMessage
            });
            return false;
          }
        } else {
        }
      });
    },
    //获取货物类型下拉列表
    async getProTypeList(queryString, callback) {
      let res = await getProTypeList();
      if (res.data.ResultCode === "000000") {
        res.data.ResultValue.forEach(item => {
          let tableData = {};
          tableData.value = item.DictID;
          tableData.label = item.DictName;
          this.protypelist.push(tableData);
          if (item.DictName == "普货") {
            this.choosetype.id = item.DictID;
            this.choosetype.name = item.DictName;
          }
        });
      } else {
        callback([]);
      }
    },
    handleSelect(index) {
      this.addData.ClassifyID = index;
    },
    //产品新增
    productAddSubmit(addData) {
      this.$refs[addData].validate(async valid => {
        if (valid) {
          if (this.$cookie.get("MemberMerchantID")) {
            let treecheck = this.$refs.data5.getCheckedKeys();
            this.hasCommit = true;
            let resData;
            if (this.ProductID) {
              this.addData.ProductID = this.ProductID;
              resData = await editProduct(this.addData);
            } else {
              resData = await addProduct(this.addData);
            }
            if (resData.data.ResultCode === "000000") {
              this.$message.success({ message: resData.data.ResultMessage });
              this.addDialog = false;
              this.hasCommit = false;
              this.$refs[addData].resetFields();
              this.dialogFormVisible = false;
              delete this.addData.ProductID;
              this.$refs.data5.setCheckedKeys(treecheck);
              this.GetPropertyTree();
              this.ProductGetAll();
            } else {
              this.hasCommit = false;
            }
          } else {
            this.$confirm("是否去入驻?", "需入驻才能发布产品！", {
              confirmButtonText: "去入驻",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              this.$router.push("/settled");
            });
          }
        } else {
          this.hasCommit = false;
          return false;
        }
      });
    },
    //获取产品列表
    async ProductGetAll() {
      if (this.caterIDbox.ModelIDs == "") {
        this.ProList = [];
        return false;
      }
      const res = await ProductGetAll(this.caterIDbox);
      if (res.data.ResultCode == "000000") {
        this.ProList = res.data.ResultValue;
      } else {
        this.$message({
          type: "error",
          message: res.data.ResultMessage
        });
      }
    },
    //模糊搜索获取系列名称数据
    async getSortData(queryString, callback) {
      if (this.$cookie.get("MemberMerchantID")) {
        let form = { MerchantID: this.$cookie.get("MemberMerchantID") };
        let res = await getCatenaList(form);
        if (res.data.ResultCode === "000000" && res.data.ResultValue) {
          let Data = res.data.ResultValue;
          for (let i = 0; i < Data.length; i++) {
            Data[i].value = Data[i].CatenaName;
          }
          callback(Data);
        } else {
          callback([]);
        }
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
    //模糊搜索获取产品名称数据
    async getProNameData(queryString, callback) {
      if (this.CatenaID && this.CatenaName === this.addData.CatenaName) {
        let res = await getProNameList({
          CatenaID: this.CatenaID,
          Name: this.CatenaName
        });
        if (res.data.ResultCode === "000000" && res.data.ResultValue) {
          let Data = res.data.ResultValue;
          for (let i = 0; i < Data.length; i++) {
            Data[i].value = Data[i].Name;
          }
          Data.value = Data.Name;
          callback(Data);
        }
      } else {
        callback([]);
      }
    },
    //模糊搜索获取产品类型数据
    async getTypeData(queryString, callback) {
      if (this.ProNameID && this.ProName === this.addData.Name) {
        let res = await getTypeList({
          NameID: this.ProNameID,
          Name: this.ProName
        });
        if (res.data.ResultCode === "000000" && res.data.ResultValue) {
          let Data = res.data.ResultValue;
          for (let i = 0; i < Data.length; i++) {
            Data[i].value = Data[i].ModelName;
          }
          Data.value = Data.ModelName;
          callback(Data);
        }
      } else {
        callback([]);
      }
    },
    //分类下拉选中处理
    SortSelect(item) {
      this.CatenaID = item.CatenaID;
      this.CatenaName = item.CatenaName;
    },
    //产品名称下拉选中处理
    NameSelect(item) {
      this.ProNameID = item.ID;
      this.ProName = item.Name;
    },
    //清空添加数据
    close() {
      this.$refs.addData.resetFields();
    },
    //打开获取localStorage的数据
    open() {
      // if (!this.ProductID) {
      //   for (let item in this.addData) {
      //     if (getStore(item) !== null) {
      //       this.addData[item] = getStore(item);
      //     }
      //   }
      // }
    },
    //长度验证
    checkLeng(rule, value, callback) {
      if (value.length > 12) {
        callback(new Error("最多输入十二个字符！"));
      } else {
        callback();
      }
    },
    //是否显示提示文字
    validate(prop) {
      if (prop === 'Length') {
        if(!regs.NF2.test(this.addData[prop])){
          this.isShowTip = false;
        } else {
          this.isShowTip = true;
        }
      }
      // setStore(prop, this.addData[prop]);
    },
    addDialogfcu() {
      if (this.$cookie.get("MemberMerchantID")) {
        this.isAllowChange = true;
        this.addDialog = true;
        this.dialogtitle = "添加新产品";
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
    //产品编辑
    async editPro(row) {
      this.isAllowChange = false;
      this.ProductID = row.ProductID;
      this.addData.CatenaName = row.CatenaName;
      this.addData.Name = row.ProductName;
      this.addData.ModelName = row.ModelName;
      this.addData.Length = row.Length;
      this.addData.Width = row.Width;
      this.addData.Height = row.Height;
      this.addData.Weight = row.Weight;
      this.addData.Money = row.Money;
      this.addData.ClassifyID = row.ClassifyID;
      this.dialogtitle = "修改产品库";
      this.addDialog = true;
    },
    async GetHeavyCargoStandard () {
      const resData = await GetHeavyCargoStandard()
      if (resData.data.ResultCode === '000000') {
        this.SET_bulkyCargo(resData.data.ResultValue)
      }
    },
    ...mapMutations({
      SET_bulkyCargo: 'SET_bulkyCargo'
    })
  },
  computed: {
    changeBubble() {
      if (this.addData.ClassifyID == this.choosetype.id) {
        let weights =
          this.addData.Weight *
          1000000 /
          (this.addData.Length * this.addData.Width * this.addData.Height);
        if (weights > this.bulkyCargo) {
          return "重货";
        } else {
          return "泡货";
        }
      }
    },
    ...mapGetters([
      'bulkyCargo'
    ])
  },
  created() {
    if (!this.$cookie.get("MemberID")) {
      this.$message.info({ message: "你尚未登录，请登录！" });
      this.$router.push("/");
      return;
    }
    if (this.$cookie.get("MemberCrowd") == 1) {
      this.GetPropertyTree();
      this.getProTypeList();
    } else {
      this.$message.info({ message: "身份类型错误！" });
      this.$router.push("/finaindex");
    }
    // 判断阈值是否存在
    if (this.bulkyCargo < 0) {
      this.GetHeavyCargoStandard()
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

.Bubbletext {
  span {
    padding: 0 10px 0 12px;
    line-height: 18px;
    display: inline-block;
    color: #6c6c6c;
  }

  .el-icon-question {
    vertical-align: middle;
    font-size: 18px;
    color: #027CFF;
  }
}

.content {
  position: relative;
  width: 1200px;
  margin: 10px auto 40px;
}
.content-left {
  float: left;
  width: 200px;
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
.product {
  float: right;
  background: #FFFFFF;

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
    padding: 40px 40px;
  }
}

.container-list {
  .list-content {
    position: relative;
    overflow: hidden;
  }

  .list-left {
    float: left;
    width: 207px;
    height: 660px;
    border-left: 1px solid $borderColor;
    border-bottom: 1px solid $borderColor;

    .left-name {
      height: 38px;
      line-height: 38px;
      text-align: center;
      color: #909399;
      background-color: #FAFAFA;
      border: 1px solid $borderColor;
      border-left: 0;
    }

    .tree-list {
      height: 620px;
      border-right: 1px solid $borderColor;
      overflow: auto;
      overflow-y: auto;
      overflow-x: hidden;
      .tree-name{
        float: left;
        width: 80px
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
      }
    }

    .left-icon {
      font-size: 16px;

      &:hover {
        color: $orange;
      }
    }
  }

  .list-right {
    float: left;
    width: 701px;
    height: 620px;
    border-top: 1px solid $borderColor;
    border-right: 1px solid $borderColor;

    .item {
      font-size: 20px;
      margin-right: 10px;
      cursor: pointer;
    }

    .bottom {
      position: absolute;
      bottom: 0;
      z-index: 100;
      width: 700px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: $blue;
      background-color: #fff;
      border: 1px solid $blue;

      .add {
        cursor: pointer;
      }
    }
  }
}

.treeicon {
  display: none;
  padding-right: 10px;
}

.el-tree-node__content:hover .treeicon {
  display: block;
}

.pagination-box {
  text-align: center;
  margin: 20px auto 10px;
}

.tip-box {
  padding: 0 40px 50px;

  .normal-width {
    width: 202px;
  }

  .dialog-footer {
    margin: 80px 0 0 150px;
  }

  .save {
    width: 200px;
    height: 40px;
    text-align: center;
  }
}

.large-width {
  width: 402px;
}
.product-name{
  width: 200px;
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
}
.model-name{
  float: left
  max-width: 80px;
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
}
.tip-msg{
  height: 20px
  line-height: 20px
  font-size: 12px
  color: $red
}
.footer {
  position: absolute;
  bottom: 0;
  z-index: 1000;
}
</style>
