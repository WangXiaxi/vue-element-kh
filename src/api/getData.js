// 接口管理
import http from 'api/fetch'


//****** 图片上传 ****** //
export const PicUpload = (params) => http.file(params);

//获取短信验证码
export const getCode = (params) => http.post('/Common/CommonSmsVerifyCodeSend', params);

//发送修改支付密码短信
export const sendPayCode = (params) => http.post('/Members/SendSmsPay', params);

//获取重货阈值
export const GetHeavyCargoStandard = (params) => http.post('/Order/GetHeavyCargoStandard', params);

// 获取IP
// export const getIP = () => http.get('http://freegeoip.net/json/');

//***** 登录 / 入驻 *****//

//登录
export const login = (params) => http.post('/Common/CommonMemberLogin', params);
// export const login = (params) => http.post('/Common/MemberLogin', params);

//注册
export const register = (params) => http.post('/Common/CommonMemberRegister', params);

//快捷登陆
export const fastLogin = (params) => http.post('/Common/CommonMemberQuick', params);

//忘记密码
export const forgetPwd = (params) => http.post('/Common/CommonMemberForget', params);

//货主入驻提交
export const enter = (params) => http.post('/Common/CompanyRegisterForWeb', params);

//物流公司入驻公司信息提交
export const logisticsEnterOne = (params) => http.post('/Common/CompanyRegisterForWeb', params);

//物流公司入驻信息编辑提交
export const editlogistics = (params) => http.post('/Common/CompanyRegisterForWeb', params);

//物流公司入驻车辆信息提交
export const logisticsEnterTwo = (params) => http.post('/Common/CompanyRegisterForWeb', params);

// 物流公司提交入驻
export const logisticsEnter = (params) => http.post('/Common/CompanyRegisterForWeb', params);

// 物流公司提交入驻
export const LogisticsAgain = (params) => http.post('/Common/CompanyRegisterForWeb', params);

//物流公司车辆信息获取
export const getCarInfo = (params) => http.post('/Merchants/GetAuthCarInfo', params);

//物流公司入驻车辆信息编辑提交
export const editCarInfo = (params) => http.post('/Common/CompanyRegisterForWeb', params);

//获取货主入驻信息
export const getSelltedInfo = (params) => http.post('/Merchants/GetAuthInfo', params);

//货主入驻信息编辑提交
export const editSelltedInfo = (params) => http.post('/Common/CompanyRegisterForWeb', params);

//获取车型列表
export const getCarModelList = () => http.get('/Dropdown/DropdownTrucModel');

//获取车长列表
export const getCarLongList = () => http.get('/Dropdown/DropdownTrucLong');


//***** 产品 *****//

//获取产品系列列表
export const getCatenaList = (params) => http.post('/Dropdown/DropdownCatena', params);

//产品分页
export const getAllList = (params) => http.post('/Product/ProductGetPage', params);

//产品系列模糊查询列表
export const getSortList = (params) => http.post('/Dropdown/CatenaGetLike', params);

//产品名称模糊查询列表
export const getProNameList = (params) => http.post('/Dropdown/ProductNameList', params);

//产品型号模糊查询列表
export const getTypeList = (params) => http.post('/Dropdown/ModelGetList', params);

//产品新增
export const addProduct = (params) => http.post('/Product/ProductNew', params);

//产品编辑
export const editProduct = (params) => http.post('/Product/ProductUpdate', params);

//获取一条产品
export const getProduct = (params) => http.post('/Product/ProductGet', params);

//删除一条产品
export const deleteProduct = (params) => http.post('/Product/ProductDelete', params);


//产品属性树型
export const GetPropertyTree = (params) => http.post('/Product/GetPropertyTree', params);

//产品属性更新接口
export const PropertyUpdate = (params) => http.post('/Product/PropertyUpdate', params);

//产品属性删除
export const PropertyDelete = (params) => http.post('/Product/PropertyDelete', params);

//产品获取全部
export const ProductGetAll = (params) => http.post('/Product/ProductGetAll', params);


//****** 货源 ******//

//货物类型下拉框列表
export const getProTypeList = () => http.get('/Dropdown/DropdownClassify');

//获取入驻的公司地址
export const getEnterAddress = (params) => http.post('/Merchants/GetDefaultAddress', params);

//货源新增
export const addSource = (params) => http.post('/Order/PublishOrder', params);

// 获取货源列表
export const getSourceList = (params) => http.post('/Order/OrderGetPage', params);

//货主发布
export const sourceCommit = (params) => http.post('/Order/ReleaseOrder', params);

//物流公司发布
export const sourceAdd = (params) => http.post('/Order/ReleaseOrderform', params);

//物流公司获取发布信息
export const getSourceData = (params) => http.post('/Order/CompanyGetMySelfOrdform', params);

//获取资质信息
export const getCompanyInfo = (params) => http.post('/Merchants/GetCredentials', params);

//选他承运
export const chooseCompany = (params) => http.post('/Order/ChooseCarriage', params);

//最低价模式下取消承运
export const CancelCarrier = (params) => http.post('/Order/CancelCarrier', params);

//未抢单下撤销货源
export const cancelSource = (params) => http.post('/Order/Abrogate1', params);

//待确认状态下撤销货源
export const deleteOrder = (params) => http.post('/Order/Abrogate12', params);

//待发货状态下撤销货源
export const cancelOrder = (params) => http.post('/Order/Abrogate13', params);

//待发货状态下取消订单货主撤回取消
export const backOrder = (params) => http.post('/Order/WithdrawAbrogate', params);

// 待发货状态下个体司机申请取消订单货主同意取消订单
export const agreeCancel = (params) => http.post('/Order/AgreedCancel1', params);

// 待发货状态下个体司机申请取消订单货主拒绝取消订单
export const disAgreeCancel = (params) => http.post('/Order/AgreedCancel12', params);

//获取货源基本信息
export const getSourceInfo = (params) => http.post('/Order/GetOrderInfo', params);

//编辑重发获取货源信息
export const getSourceInfo2 = (params) => http.post('/Order/GetOrderInfo2', params);

//获取货源产品信息
export const getProductInfo = (params) => http.post('/Order/GetOrderProduct', params);

//货源更新
export const sourceUpdata = (params) => http.post('/Order/UpdateOrder', params);

//获取车辆位置信息
export const getCarAddress = (params) => http.post('/Truck/TruckGetLocationByOrderCode', params);

//获取报价信息 快照
export const SnapshotGetPage = (params) => http.post('/Order/SnapshotGetPage', params);

//判断货源是否在规定时间内重复发布
export const JudgeOrderRepeat = (params) => http.post('/Order/JudgeOrderRepeat', params);

//判断货源是否在规定时间内重复发布
export const JudgeOrderRepeatForFactory = (params) => http.post('/Order/JudgeOrderRepeatForFactory', params);

//评价
export const rate1 = (params) => http.post('/Order/Evaluate1', params);
export const rate2 = (params) => http.post('/Order/Evaluate2', params);
export const rate4 = (params) => http.post('/Order/Evaluate4', params);


//***** 账户信息 *****//


//修改登录密码
export const changeLoginPwd = (params) => http.post('/Members/ModifyPassword', params);

//修改支付密码
export const changePayPwd = (params) => http.post('/Members/SetPayPWD', params);

//头像上传
export const updataAvatar = (params) => http.post('/Members/UpdateIcon', params);

//获取用户信息
export const getUserInfo = (params) => http.post('/Members/MemberGet', params);

//获取黑名单列表
export const getBlackList = (params) => http.post('/BlackList/ComGetBlackList', params);

//添加黑名单前检索接口
export const getSearchBlackList = (params) => http.post('/BlackList/ComGetMerchantList', params);

//添加黑名单操作
export const addBlackList = (params) => http.post('/BlackList/ComAddBlackList', params);

//移除黑名单操作
export const deleteBlackList = (params) => http.post('/BlackList/ComDeleteBlackList', params);

//*****财务管理*****//

//获取账户余额概览
export const AccountSummary = (params) => http.post('/Finance/AccountSummary', params);

//Web微信充值
export const MemberGet = (params) => http.pay('/Members/MemberGet', params);

//提现列表
export const GetWithdrawPage = (params) => http.post('/Finance/WithdrawGetPage', params);

//提现申请
export const WithdrawApply = (params) => http.post('/Finance/WithdrawApply', params);

//提现详情
export const WithdrawGet = (params) => http.post('/Finance/WithdrawGet', params);

//取消提现
export const WithdrawCancel = (params) => http.post('/Finance/WithdrawCancel', params);

//支付宝发起充值
export const RechargeRequest = (params) => http.post('/AliPay/RechargeRequest', params);

//Web微信充值
export const WebWxPayRecharge = (params) => http.post('/Wechatpay/WebWxPayRecharge', params);

//Web微信充值
export const WxPayRechargeSync = (params) => http.pay('/Wechatpay/WxPayRechargeSync', params);

//充值列表
export const RechargeGetPage = (params) => http.post('/Finance/RechargeGetPage', params);

//获取个体司机运费支付页信息
export const GetPayInfo = (params) => http.post('/Order/GetPayInfo', params);

//支付个体司机运费（余额支付）
export const DeadheadPayRequest = (params) => http.post('/Finance/BalancePayment', params);

//支付个体司机运费（支付宝支付）
export const AliPayRequest = (params) => http.post('/AliPay/DeadheadPayRequest', params);

//余额变动记录获取一页
export const BalanceChanges = (params) => http.post('/Finance/BalanceChanges', params);

//罚款记录获取一页
export const PenaltyRecord = (params) => http.post('/Finance/PenaltyRecord', params);

//5-19

//付款对象列表（工厂像物流公司月结付款时）
export const PaidForList = (params) => http.post('/Dropdown/PaidForList', params);

// 获取物流运费月结的起始时间
export const GetCreateStart = (params) => http.post('/Finance/GetCreateStart', params);

//获取工厂对物流公司月结时的应付金额
export const AmountDue = (params) => http.post('/Finance/AmountDue', params);

//月结立即还款（生成付款单）
export const MonthlyPayment = (params) => http.post('/Finance/MonthlyPayment', params);

//付款记录
export const LogisticsFreightBill = (params) => http.post('/Finance/LogisticsFreightBill', params);

//获取物流运费账单支付页信息
export const GetMonthlyPayInfo = (params) => http.post('/Finance/GetMonthlyPayInfo', params);

//到付订单列表接口 1.0.6
export const GetSettlementTypePage = (params) => http.post('/Order/GetSettlementTypePage', params);

//物流公司运费月结（余额支付）
export const MonthlyPayRequest = (params) => http.post('/BalancePay/MonthlyPaymentRequest', params);

//物流公司运费月结（支付宝支付）
export const Monthlyalipay = (params) => http.post('/AliPay/MonthlyPayRequest', params);

//物流公司获取自己的交易账单
export const GetBillsList = (params) => http.post('/Finance/WebGetBillsList', params);

//Web个体司机微信支付
export const WebWxPayPayment = (params) => http.post('Wechatpay/WebWxPayPayment', params);

//获取物流总运费接口
export const FreightSum = (params) => http.post('/Finance/LogisticsFreightSum', params);

//Web个体司机微信支付确认
export const WxPayPaymentSync = (params) => http.pay('/Wechatpay/WxPayPaymentSync', params);

//Web月结微信支付确认
export const WxPayMonthSync = (params) => http.pay('/Wechatpay/WxPayPaymentMonthSync', params);

//Web月结微信支付
export const WebWxPayMonthPayment = (params) => http.post('/Wechatpay/WebWxPayMonthPayment', params);

// 获取未查看的会员引导页
export const CpcnRecharge = (params) => http.post('/Trade/CpcnRecharge', params);

// ****** 子账号管理  ****** //

// 获取子账号列表内容
export const getSubAccountList = (params) => http.post('/Members/SubAccountList', params);

// 验证手机号是否已被注册
export const hasExist = (params) => http.post('/Members/MobileVerify', params);

// 修改管理员基本信息
export const editAdminInfo = (params) => http.post('/Members/SubAccountUpdate', params);

// 编辑/添加员工信息
export const addUser = (params) => http.post('/Members/SubAccountEdit', params);

// 启用/作废员工账号
export const changeUserStatus = (params) => http.post('/Members/EnaDisaSubAccount', params);

//添加银行卡
export const addBankcard = (params) => http.post('/Finance/CartAdd', params);

//获取银行卡一页
export const getBankcardList = (params) => http.post('/Finance/CardGetPage', params);

//删除银行卡
export const deleteBankcard = (params) => http.post('/Finance/CardDelete', params);

//编辑银行卡
export const updateBankcard = (params) => http.post('/Finance/CardUpdate', params);

// ****** 物流专线  ****** //

// 专线获取一页接口
export const DedicatedLineGetPage = (params) => http.post('/Route/DedicatedLineGetPage', params);

// 专线删除接口
export const DedicatedLineDelete = (params) => http.post('/Common/DedicatedLineDelete', params);

// 专线更新
export const DedicatedLineUpdate = (params) => http.post('/Common/DedicatedLineUpdate', params);

// 专线添加
export const DedicatedLineNew = (params) => http.post('/Common/DedicatedLineNew', params);

// 判断物流公司可否添加路线
export const CanCompanyAddRoute = (params) => http.post('/Common/CanCompanyAddRoute', params);

// 获取上门提货信息(物流公司)
export const GetCollectInfo = (params) => http.post('/Common/GetCollectInfo', params);

// 修改上门提货信息(物流公司)
export const CollectSet = (params) => http.post('/Common/CollectSet', params);

// 新增记录页记录接口
export const AddGuidRecord = (params) => http.post('/Common/AddGuidRecord', params);

// 获取未查看的会员引导页
export const GuideGetPage = (params) => http.post('/Common/GuideGetPage', params);

//获取订单详细信息
export const GetOrderProductList = (params) => http.post('/Order/GetOrderProductList', params);

//编辑货源界面修改订单信息
export const UpdateOrderProductList = (params) => http.post('/Order/UpdateOrderProductList', params);

//订单标签打印记录获取一页
export const GetQrCodeRecordList = (params) => http.post('/QRCode/GetQrCodeRecordList', params);

// 获取订单二维码列表
export const GetQRCodeList = (params) => http.post('/QRCode/GetQRCodeList', params);

// 通知后台已经打印
export const QrCodePrint = (params) => http.post('/QRCode/QrCodePrint', params);

//获取运单列表一页
export const GetOrderformPageForCompany = (params) => http.post('/Order/GetOrderformPageForCompany', params);

//运单详情
export const GetOrderInfoForCompany = (params) => http.post('/Order/GetOrderInfoForCompany', params);

//货物统计列表获取一页（物流公司）
export const GetOrderformListForCompany = (params) => http.post('/Order/GetOrderformListForCompany', params);

//货源重发接口
export const SendAgain = (params) => http.post('/Common/SendAgain', params);

//物流公司车辆获取一页（公用方法）
export const TruckGetPage = (params) => http.post('/Common/TruckGetPage', params);

//货物统计发货信息获取一条，详情（物流公司）
export const GetOrderDetailsInfo = (params) => http.post('/Order/GetOrderDetailsInfo', params);

//货物统计发货信息获取一条，详情（物流公司）
export const BatchDeliverForCompany = (params) => http.post('/Order/BatchDeliverForCompany', params);

//货物统计转单页面订单详情接口（物流公司）
export const TransferOrderDetails = (params) => http.post('/Order/TransferOrderDetails', params);

//货物统计页面发布转运订单（物流公司）
export const ReleaseTransferOrder = (params) => http.post('/Order/ReleaseTransferOrder', params);

//选择承运人
export const GetOrderQuoteList = (params) => http.post('/Order/GetOrderQuoteList', params);
