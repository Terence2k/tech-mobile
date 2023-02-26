/**
 * 更新otoken，并写入cookie
 * @param otoken
 */
const updateOtoken = (otoken: string) => ({ type: 'user/updateOtoken', payload: { otoken } });

/**
 * 更新mtoken，并写入cookie
 * @param mtoken
 */
const updateMtoken = (mtoken: string) => ({ type: 'user/updateMtoken', payload: { mtoken } });

/**
 * 更新登录状态
 * @param isLogin 是否已登录
 * @returns
 */
const updateLoginState = (isLogin: boolean) => ({ type: 'user/updateLoginState', payload: { isLogin } });

/**
 * 用户信息初始化入口
 * @param isCidChanged, 初始化前需要知道是否店铺更换了
 */
const init = (isCidChanged: boolean) => ({ type: 'user/init', payload: { isCidChanged } });

/**
 * 获取当前用户信息
 */
const getUserInfo = () => ({ type: 'user/getUserInfo' });

/**
 * 获取公众号用户的信息
 */
const getPublicUserInfo = () => ({ type: 'user/init' });

/**
 * 登录成功
 */
const loginSucc = () => ({ type: 'user/loginSucc' });

export default {
  updateOtoken,
  updateMtoken,
  updateLoginState,
  init,
  getUserInfo,
  getPublicUserInfo,
  loginSucc,
};
