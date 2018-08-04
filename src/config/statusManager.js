/**
 * Created by ydiego on 11/7/2018.
 */
//          1（1），5（2），10（3），15（4），20原来的状态没有，25（5），30（6），35（7），-5原来的状态没有，-10（-1），-15（-3），-20（-4），-25（-2）新老对应
// 订单状态：1待发布；5已发布；10待确认；{15已确认；20已装货；} =》待发货  25已发货；30已到达；35已评价；-5已删除；-10已关闭；-15申请取消；-20取消被拒；-25已取消；
export const orderStatus = {
  'ORDER_RELEASED':        1,   //待发布
  'ORDER_PUBLISHED':       5,   //已发布
  'ORDER_PENDING':         10,  //待确认
  'ORDER_CONFIRMED':       15,  //已确认
  'ORDER_LOADING':         20,  //已装货
  'ORDER_SHIPPED':         25,  //已发货
  'ORDER_ARRIVED':         30,  //已到达
  'ORDER_EVALUATION':      35,  //已评价
  'ORDER_DELETED':         -5,  //已删除
  'ORDER_CLOSED':          -10, //已关闭
  'ORDER_APPLY_CANCEL':    -15, //申请取消
  'ORDER_REJECT_CANCEL':   -20, //取消被拒
  'ORDER_CANCELED':        -25, //已取消
};

// Parttern（pattern?）  1 抢单模式  2 最低价模式  之后可能还有其他模式 如果添加，请吧之前所有Parttern相关判断再看一遍！
export  const pattern = {
  '1' : "抢单",
  '2' : "最低价"
};

//结算方式 settlement 1月结；2到付;

//货运类型 way 1 物流公司 2回头车

//货主类型 CrowdType 1：工厂；2：物流公司；3：个体司机
