/**
 * 加载tab bar配置
 */
const getMiniTarbar = () => ({ type: 'client/getMiniTarbar' });

/**
 * 加载全局配置
 */
const getMiniConfig = () => ({ type: 'client/getMiniConfig' });

/**
 * 获取小程序权限列表
 */
const getMiniResourceList = () => ({ type: 'client/getMiniResourceList' });

/**
 * 获取小程序信息
 */
const getClientInfoM = () => ({ type: 'client/getClientInfoM' });

/**
 * 获取分享对话框信息
 */
const getShareInfo = () => ({ type: 'client/getShareInfo' });

export default {
  getMiniTarbar,
  getMiniConfig,
  getMiniResourceList,
  getClientInfoM,
  getShareInfo,
};
