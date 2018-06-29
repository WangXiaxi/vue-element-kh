// 接口管理
import http from '../api/fetch'

//登录
export const AgentLogin = (params) => http.post('/Members/AgentLogin', params);

//代理业绩获取一页
export const AgentOrderGetPage = (params) => http.post('/Members/AgentOrderGetPage', params);

//获取一条业务员信息
export const SalesmanGet = (params) => http.post('/Members/SalesmanGet', params);

//业务员列表获取一页接口
export const SalesmanGetPage = (params) => http.post('/Members/SalesmanGetPage', params);

//编辑/添加业务员信息接口
export const SalesmanAddEdit = (params) => http.post('/Members/SalesmanAddEdit', params);

//删除业务员接口
export const DeleteSalesman = (params) => http.post('/Members/DeleteSalesman', params);

//ThoseBusinesses
export const ThoseBusinesses = (params) => http.post('/Members/ThoseBusinesses', params);