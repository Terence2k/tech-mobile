/**
 * 路由动作
 */
type RouterActions = 'push' | 'replace';

/**
 * 跳转指定路径，使用params的query参数, 并确保补充上cid
 * @param path 路径
 * @param params url?后参数
 * @param routerAction 路由动作 默认为push
 */
const jumpToPage = (
  path: string,
  params: { [key: string]: any } = {},
  routerAction: RouterActions = 'push',
) => ({
  type: 'browser/jumpToPage',
  payload: { path, params, routerAction },
});

/**
 * 跳转已encode的redirect, 并确保补充上cid
 */
const jumpToRedirectPage = () => ({ type: 'browser/jumpToRedirectPage' });

// 跳转到登录页面
const jumpToLogin = () => jumpToPage('/login');

// 跳转到异常页面
const jumpToExceptionPage = (
  params: { [key: string]: any } = {},
  routerAction: RouterActions = 'replace',
) => jumpToPage('/exception', params, routerAction);

export default {
  jumpToPage,
  jumpToRedirectPage,
  jumpToLogin,
  jumpToExceptionPage,
};
