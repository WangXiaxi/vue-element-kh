/**
 * 退出方法 清除各种cookie等存储
 */

import VueCookie from 'vue-cookie';
import { removeStore } from "config/myUtils";
import store from '../store';

export const dropOut = () => {
  let host = window.location.href.indexOf("sdhwlw.com") > -1 ? 'sdhwlw.com' : window.location.hostname;
  VueCookie.delete("Mobile",{domain: host});
  VueCookie.delete("MemberDutiesID", {domain: host});
  VueCookie.delete("MerchantStatus", {domain: host});
  VueCookie.delete("IconUrl", {domain: host});
  VueCookie.delete("MemberID", {domain: host});
  VueCookie.delete("MemberCrowd", {domain: host});
  VueCookie.delete('MemberMerchantID', {domain: host});
  VueCookie.delete('Token');
  removeStore('payList'); // 移除本地缓存
  store.dispatch('dropOut'); // 清除部分信息退出
}
