import popup from './popup';
import browser from './browser';
import order from './order';
import user from './user';
import weixin from './weixin';
import ticket from './ticket';
import client from './client';
import upload from './upload';
import media from './media';

// base model
const updateState = (res:
  { [key: string]: any } | { namespace?: string, payload: { [key: string]: any } }) => {
  if (!res.namespace) {
    return { type: 'updateState', payload: res };
  }

  return { type: `${res.namespace}/updateState`, payload: { ...res.payload } };
};

// page
const onLoad = (res) => ({ type: `${res.namespace}/onLoad`, payload: { ...res.payload } });
const onPullDownRefresh = (res) => ({ type: `${res.namespace}/onPullDownRefresh`, payload: { ...res.payload } });
const onReachBottom = (res) => ({ type: `${res.namespace}/onReachBottom`, payload: { ...res.payload } });
const onShareAppMessage = (res) => ({ type: `${res.namespace}/onShareAppMessage`, payload: { ...res.payload } });

export default {
  // 通用的状态更新
  updateState,

  // page通用行为
  onLoad,
  onPullDownRefresh,
  onReachBottom,
  onShareAppMessage,

  // 快捷方式
  showLoading: popup.showLoading,
  hideLoading: popup.hideLoading,
  toastSucc: popup.toastSucc,
  toastFail: popup.toastFail,
  jumpToPage: browser.jumpToPage,
  jumpToLogin: browser.jumpToLogin,
  jumpToExceptionPage: browser.jumpToExceptionPage,

  // 全局model对应的actions
  popup,
  browser,
  order,
  user,
  weixin,
  ticket,
  client,
  upload,
  media,
};
