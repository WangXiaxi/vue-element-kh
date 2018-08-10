<template>
  <div class="printer">
    <head-top>
      <span class="title" slot="index">打印标签</span>
      <drop-down slot="info"></drop-down>
    </head-top>
    <div class="waybill-wrapper"  v-loading="loading">
      <hr class="top-border">
      <div class="waybill-info">
        <div class="waybill-info-title fl">运单信息</div>
        <div class="waybill-info-body fl">
          <div class="waybill-info-address">
            <div class="waybill-info-from inline">{{printDatas.OrdeFrom}}</div>
            <img class="inline" src="../../assets/images/gofrom.png" alt="">
            <div class="waybill-info-to inline">{{printDatas.OrderTo}}</div>
          </div>
          <div class="waybill-info-detail"><span class="inline t">货物信息：</span><span class="inline b">货源编号{{printDatas.OrdeCode}}  共{{printDatas.CommodityNumber || '0'}}件  {{ printDatas.CommodityType }}</span></div>
          <div class="waybill-info-detail"><span class="inline t">收货人信息：</span><span class="inline b">{{printDatas.OrdeReceiver || '--'}}  {{printDatas.OrdeReceivePhone || '--'}}</span></div>
        </div>
        <div class="waybill-info-operate fr">
            <el-button size="small" type="primary" @click="print()" :disabled="checkedItemLength === 0" v-if="!printDatas.CodeIsPrint">打印{{checkedItemLength}}张标签</el-button>
            <el-button size="small" type="primary" @click="supplement()" :disabled="checkedItemLength === 0" v-else>补打{{checkedItemLength}}张标签</el-button>
            <el-button size="small" type="primary" plain @click="cancel()">取消打印</el-button>
        </div>
      </div>
      <div class="page-print-background">
        <div class="page-print-container">
          <div class="print-item"  v-for="(item,index) in printDatas.QRCodeList" :key="item.codeID" @mouseover="printItemHover(index)" @mouseout="printItemLeave(index)">
            <input type="checkbox" :id="item.codeID" :ref="'check-'+index" :checked="item.checked"/>
            <label :for="item.codeID" class="check_label" :class="{'none': !item.show}" @click="printItemCheck(index, $event)"></label>
            <div class='print-item-body PageNext'>
              <div class="print-item-header">
                <img src='http://devweb.sdhwlw.com/image/logo-mem.png' width='30' height='30'/>
                <p class="inline">发货不累，就选速达汇!</p>
              </div>
              <img :src="createQR(item.codeID)" alt="" height="200">
              <div class="print-item-content">
                <div class="print-info">收货人: {{printDatas.OrdeReceiver || '--'}}</div>
                <div class="print-info">电<em></em>话: {{printDatas.OrdeReceivePhone || '--'}}</div>
                <div class="print-info">货件数: {{printDatas.QRCodeList.length}}-{{index + 1}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <foot></foot>

    <!-- 重打原因 -->
    <el-dialog title="补打标签原因" :visible.sync="dialogFormVisible" width="500px">
      <el-form>
        <el-input
          ref="reprint-textarea"
          type="textarea"
          :rows="6"
          placeholder="请输入补打原因"
          maxlength="50"
          v-model="reason">
        </el-input>
        <div class="reason-length">{{reason.length}} / 50</div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!--<el-button @click="dialogFormVisible = false">取 消</el-button>-->
        <el-button type="primary" class="reprint-btn" @click="reprint()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import headTop from 'components/header/head'
  import dropDown from 'components/header/children/dropdown'
  import foot from 'components/footer/foot'
  import QRious from 'qrious'
  import m_login from '@/mixins/m_login'
  import {
    GetQRCodeList,
    QrCodePrint,
  } from "api/getData";
  export default {
      mixins: [m_login],
      data(){
          return {
              printDatas: {},
              dialogFormVisible: false,
              reason: '',
              loading: true,
              order_id: this.$route.params.id,
              printResult: '',
              MemberID: this.$cookie.get("MemberID"),
              CodeIsPrint: false
          }
      },
      watch:{
          //限制重打原因的字数 这里没有区分中英文长度
          reason: function(n, o){
              if(n.length>50){
                  this.reason = this.reason.substr(0,50);
              }
          },
          printResult: function(n, o){
            // 打印预览回调  0 关闭  1打印
            if(n > 0){
                this.printNotify();
            }
          }
      },
      methods:{
        // 通知后台已打印  初次打印不需要传reason字段
        async printNotify(){
            let param = {
              OrderId: this.order_id,
              MemberID: this.MemberID,
              CodeIDs: this.checkedList.join(',')
            };

            if(this.printDatas.CodeIsPrint)
                param.reason = this.reason;

            const result = await QrCodePrint(param);
            this.getPrintData();
        },
        //重打  需要传递重打的集合
        reprint() {
            if(this.reason.length === 0) {
                this.$message({
                    type: 'error',
                    message: '补打原因不能为空'
                });
              this.$refs['reprint-textarea'].$el.querySelector('textarea').focus();
              return;
            }
            this.print();
            this.dialogFormVisible = false
        },
        supplement(){
            if(!window.getLodop()) return;
          this.dialogFormVisible = true
        },
        //打印
        print() {
          let _ = this,
              items = _.printDatas.QRCodeList,
              OrdeReceiver = _.printDatas.OrdeReceiver,
              OrdeReceivePhone = _.printDatas.OrdeReceivePhone;
          LODOP = window.getLodop();
          LODOP.PRINT_INITA("0mm","0mm","80mm","60mm","标签打印");
          LODOP.SET_PRINT_PAGESIZE(2,800,600,"标签打印");//1纵向  2横向
          LODOP.SET_PRINT_MODE("POS_BASEON_PAPER",true);//统一打印机物理边距

          //下面这段打印设计的时候可以直接展示效果
          //  LODOP.ADD_PRINT_IMAGE(15,36,30,30,"<img border='0' src='http://devweb.sdhwlw.com/image/logo-mem.png' width='30' height='30'/>");
          //   LODOP.SET_PRINT_STYLEA(0,"Stretch",1);
          // LODOP.ADD_PRINT_TEXT(25,82,147,25,"发货不累，就选速达汇");
          // LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
          // LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
          // LODOP.SET_PRINT_STYLEA(0,"Bold",1);
          // LODOP.ADD_PRINT_TEXT(263,50,200,27,"收货人：杨**");
          // LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
          // LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
          // LODOP.SET_PRINT_STYLEA(0,"Bold",1);
          // LODOP.ADD_PRINT_TEXT(320,50,200,26,"货件数 : 1-1");
          // LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
          // LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
          // LODOP.SET_PRINT_STYLEA(0,"Bold",1);
          // LODOP.ADD_PRINT_IMAGE(55,51,200,200,"(图像5的超文本路径)");
          // LODOP.SET_PRINT_STYLEA(0,"Stretch",1);
          // LODOP.ADD_PRINT_TEXT(293,50,200,26,"电   话：135*****123");
          // LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
          // LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
          // LODOP.SET_PRINT_STYLEA(0,"Bold",1);
          // LODOP.PRINT_DESIGN();
          // return;


          items.forEach(function(item, index){
            if(item.show) {
              LODOP.NewPage();
              // 80mm*60mm
              LODOP.ADD_PRINT_IMAGE(20,24,30,30,"<img border='0' src='http://devweb.sdhwlw.com/image/logo-mem.png' width='30' height='30'/>");
              LODOP.SET_PRINT_STYLEA(0,"Stretch",1);
              LODOP.ADD_PRINT_TEXT(31,61,160,25,"发货不累，就选速达汇");
              LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
              LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
              LODOP.SET_PRINT_STYLEA(0,"Bold",1);
              LODOP.ADD_PRINT_TEXT(215,34,180,25,"收货人 : " + (OrdeReceiver || '--') );
              LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
              LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
              LODOP.SET_PRINT_STYLEA(0,"Bold",1);
              LODOP.ADD_PRINT_TEXT(264,34,180,25,"货件数 : " + items.length + '-' + (index + 1));
              LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
              LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
              LODOP.SET_PRINT_STYLEA(0,"Bold",1);
              LODOP.ADD_PRINT_IMAGE(61,44,140,140,_.createQR(item.codeID));
              LODOP.SET_PRINT_STYLEA(0,"Stretch",1);
              LODOP.ADD_PRINT_TEXT(239,34,180,25,"电    话:" + (OrdeReceivePhone || '--'));
              LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
              LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
              LODOP.SET_PRINT_STYLEA(0,"Bold",1);
              //100mm*80mm
//              LODOP.ADD_PRINT_IMAGE(15,36,30,30,"<img border='0' src='http://devweb.sdhwlw.com/image/logo-mem.png' width='30' height='30'/>");
//              LODOP.SET_PRINT_STYLEA(0,"Stretch",1);
//              LODOP.ADD_PRINT_TEXT(25,82,180,25,"发货不累，就选速达汇!");
//              LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
//              LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
//              LODOP.SET_PRINT_STYLEA(0,"Bold",1);
//              LODOP.ADD_PRINT_TEXT(273,50,200,27,"收货人：杨**");
//              LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
//              LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
//              LODOP.SET_PRINT_STYLEA(0,"Bold",1);
//              LODOP.ADD_PRINT_TEXT(335,50,200,26,"货件数 : " + items.length + '-' + (index + 1));
//              LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
//              LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
//              LODOP.SET_PRINT_STYLEA(0,"Bold",1);
//              LODOP.ADD_PRINT_IMAGE(55,51,200,200, _.createQR(item.img));
//              LODOP.SET_PRINT_STYLEA(0,"Stretch",1);
//              LODOP.ADD_PRINT_TEXT(303,50,200,26,"电   话：135*****123");
//              LODOP.SET_PRINT_STYLEA(0,"FontName","微软雅黑");
//              LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
//              LODOP.SET_PRINT_STYLEA(0,"Bold",1);
            }
          });
          LODOP.SET_SHOW_MODE("LANDSCAPE_DEFROTATED",1);//横向打印预览正常展示
          LODOP.SET_PRINT_MODE("AUTO_CLOSE_PREWINDOW",1);//打印后自动关闭预览窗口
          LODOP.PREVIEW();
          if (LODOP.CVERSION) CLODOP.On_Return = function(TaskID, Value){
              _.printResult = Value;
          };
        },
        //选中打印部分
        printItemCheck(index, event) {
          if(!this.CodeIsPrint) {
              event.preventDefault();//防止label for的事件  也可以修改for的值  :for="CodeIsPrint ? item.codeID : ''"
              return;
          }
          let item = this.printDatas.QRCodeList[index];
          item.checked = !this.$refs['check-' + index][0].checked; // 拿到的checked值为点击时的  所以要取反
        },
        //鼠标经过时如果没选中要显示遮罩
        printItemHover(index) {
          let item = this.printDatas.QRCodeList[index];
          if(item.show && item.checked) return;
          item.show = !item.show;
        },
        //鼠标离开时如果没选中要隐藏遮罩
        printItemLeave(index) {
          let item = this.printDatas.QRCodeList[index];
          if(item.show && item.checked) return;
          item.show = !item.show;
        },
        //取消打印 =》后退
        cancel() {
            window.history.go(-1);
        },
        //生成二维码base64
        createQR(str) {
          str = this.utf16to8(str);
          const qr = new QRious({
            value: str,
            size: 500,
            level: 'H'
          });
          //默认png格式
//          return qr.toDataURL();
//=> "data:image/png;base64,iVBOR...kVrMFhcAW04AAAAASUVORK5CYII="
          return qr.toDataURL('image/jpeg');
        },
        //用于解决二维码中文乱码
        utf16to8(str) {
          var out, i, len, c;
          out = "";
          str = str || '';
          len = str.length;
          for(i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
              out += str.charAt(i);
            } else if (c > 0x07FF) {
              out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
              out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
              out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
            } else {
              out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
              out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
            }
          }
          return out;
        },
        //获取打印数据
        async getPrintData(){
          let _ = this;
          _.loading = true;
          let result = await GetQRCodeList({OrderID:this.order_id,MemberID: this.$cookie.get("MemberID")});
          if(result.data.ResultCode === '000000') {
            let data = result.data.ResultValue[0];
            _.CodeIsPrint = data.CodeIsPrint;
            data.QRCodeList.forEach(function (item) {
              item.checked = !data.CodeIsPrint;
              item.show = !data.CodeIsPrint;
            });
            _.printDatas = data;
          } else {
              this.$message({
                type: 'error',
                message: result.data.ResultMessage
              })
          }
          _.loading = false;
        }
      },
      computed:{
          //选中的需要打印的数量
          checkedItemLength() {
              let count = 0;
              this.printDatas.QRCodeList && this.printDatas.QRCodeList.forEach(function(v){
                  if(v.checked) count ++;
              });
              return count;
          },
          //选中的集合 重打是时候有用到
          checkedList() {
              let arr = [];
              this.printDatas.QRCodeList && this.printDatas.QRCodeList.forEach(function(v){
                if(v.checked) arr.push(v.codeID);
              });
              return arr;
          }
      },
      mounted(){
          this.getPrintData();
      },
      components: {
        headTop,
        dropDown,
        foot
      }
  }
</script>

<style lang="stylus" scoped>
  .none 
    display: none
  .top-border
    display: block
    border-width: 0
    border-top: 2px solid #999
    box-shadow: 0 2px 4px 0 #999999
    margin-bottom: 0
    width: 100%
    z-index: 2
    position: relative
  .inline 
    display: inline-block
  .waybill-info, .page-print-container 
    width: 1200px
    margin: 0 auto
    overflow: hidden
  .waybill-info-title 
    background: #ECF5FE
    border: 1px solid #A4D0FF
    font-size: 16px
    color: #027CFF
    display: inline-block
    height: 90px
    width: 20px
    padding: 20px 34px
    text-align: center
  .waybill-info-body 
    padding: 20px 20px 0
  .waybill-info-address 
    font-size: 18px
    color: #333
    margin-bottom: 20px
  .waybill-info-detail 
    margin-bottom: 10px
  .waybill-info-detail .t 
    color: #999
    width: 100px
  .waybill-info-operate 
    margin-top: 50px
  .page-print-background 
    width: 100%
    background: #515257
  .page-print-container 
    padding-top: 30px
    padding-bottom: 100px
    clear: both
    overflow: hidden
    color: #000
  .PageNext 
    page-break-after: always
  .print-item 
    position: relative
    width: 230px
    height: 300px
    margin-right: 10px
    margin-bottom: 10px
    float: left
    border: 1px solid #999
    background: #fff
  .print-item:nth-child(5n) 
    margin-right: 0
  .print-item-body 
    width: 100%
  .print-item-body > img 
    width: 65.71428571428571%
    height: 60%
    margin: 0 auto
    display: block
  .print-item-header 
    padding: 10px 0 10px 20px
  .print-item-content 
    margin-top: 10px
    padding-left: 45px
    text-align: initial
    font-size: 18px
  .print-info em 
    display: inline-block
    width: 18px
  .print-item .check_label 
    /* display: none */
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: rgba(51,51,51, .35)
  input[type=checkbox]+label:after 
    content: ' '
    width: 30px
    height: 30px
    border-radius: 5px
    position: absolute
    top: 50%
    background: url(../../assets/images/print_hover@2x.png) center no-repeat
    background:image-set(url(../../assets/images/print_hover@3x.png) 3x) center no-repeat
    background-size: 100%
    text-shadow: 0
    left: 50%
    transform: translate(-50%,-50%)
  input[type=checkbox]:checked+label:after 
    content: ' '
    width: 30px
    height: 30px
    border-radius: 5px
    position: absolute
    top: 50%
    background: url(../../assets/images/print_checked@2x.png) center no-repeat
    background:image-set(url(../../assets/images/print_checked@3x.png) 3x) center no-repeat
    background-size: 100%
    text-shadow: 0
    left: 50%
    transform: translate(-50%,-50%)
  .print-item input[type=checkbox] 
    /* display: none */
    width: 0
    height: 0
    opacity: 0
    position: absolute
    z-index: -1
  .el-form 
    position: relative
  .reason-length 
    position: absolute
    bottom: 10px
    right: 10px
    color: #999
    font-size: 12px
  /* 打印css */
  @media print 
    .print-item 
      width: 945px
      height: 1180px
      float: none
      border:none
    .print-item-body-footer 
      height: auto
      line-height: inherit
    .print-item-body-title, .print-item-body-footer 
      font-size: 60px
      padding: 10px 0
  .footer-container 
    position: absolute
    bottom: 0
</style>
<style lang="stylus">
  .printer .el-dialog__header 
    padding: 10px 0
    border-bottom: 1px solid #e0e0e0
  .printer .el-dialog__title 
    line-height: 24px
    font-size: 18px
    color: #303133
    display: block
    border-left: 3px solid #027CFF
    padding: 10px
  .printer .el-textarea__inner
    background: #F7FBFB
    border: none
    resize: none
  .printer .el-dialog__footer .reprint-btn 
    display: block
    margin: 0 auto
    width: 200px
    background: #027CFF
    border-radius: 100px
</style>
