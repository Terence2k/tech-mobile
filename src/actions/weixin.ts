/**
 * 带跳转的组件，初始化时需要调用此方法，获取跳转信息
 * @param type 跳转类型
 * @param objectIds 跳转类型背后的ID字典
 */
const pullJumpRecord = (type: string, objectIds: string) => ({ type: 'weixin/pullJumpRecord', payload: { type, objectIds } });

/**
 * 跳转控件点击时，触发的跳转（针对非微信浏览器）
 */
const jump = (type: string, objectIds: string) => ({ type: 'weixin/jump', payload: { type, objectIds } });

/**
 * 初始化微信的JS SDK
 */
const initJsSdk = () => ({ type: 'weixin/initJsSdk' });

export default {
  pullJumpRecord,
  jump,
  initJsSdk,
};
