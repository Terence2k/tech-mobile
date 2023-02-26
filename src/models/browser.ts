import modelExtend from 'dva-model-extend';
import { routerRedux } from 'dva';
import { stringify, parse } from 'qs';
import { model } from 'utils/model';
import { platform } from 'utils/utils';
import actions from 'actions';

import { IBrowser } from './types';

// 终端
export enum Terminal {
  /**
   * 微信内
   */
  Wxweb = 'wxweb',
  /**
   * 移动端
   */
  Mweb = 'mweb',
  /**
   * pc端
   */
  Pcweb = 'pcweb',
}

// 获取 终端类型
function getTerminalType(): Terminal {
  if (platform.isWeixin) {
    return Terminal.Wxweb;
  }

  if (platform.isMobile) {
    return Terminal.Mweb;
  }

  return Terminal.Pcweb;
}

// 终端类型
export const terminalType: Terminal = getTerminalType();

export default modelExtend(model, {
  namespace: 'browser',
  state: {
    // 是否微信浏览器
    isWeixinBrowser: platform.isWeixin,

    // 是否移动端浏览器
    isMobileBrowser: platform.isMobile,

    // 是否在小程序内
    isMiniProgramBrowser: platform.isMiniProgram,

    // 当前url的路径
    locationPathname: '',

    // 当前url的query值
    locationQuery: {},

    // 预先生成的指向当前页面的重定向链接，方便其他模块需要带重定向参数时使用
    redirectStrToCurrentPage: '',

    // 终端类型
    terminalType,

    // 最近是否有popState, 用于长列表界面判断是否需要重新加载列表数据，便于浏览器回退时，保持列表的scroll位置
    isJustPopState: false,
    // 浏览记录地址
    userBrowse: '',
  } as IBrowser,

  reducers: {},

  effects: {

    /**
     * 跳转指定路径，使用params的query参数, 并确保补充上cid
     */
    * jumpToPage({ payload: { path, params = {}, routerAction = 'push' } }, { select, put, call }) {
      console.log('JUMP jumpToPage', path, params);

      if (!path) {
        console.error('jumpToPage path cannot be empty.');
        return;
      }

      const query = yield select((state) => state.browser.locationQuery);
      const cid = query.cid ? query.cid : yield select((state) => state.client.cid);

      let addParams = '';
      if (params && Object.keys(params).length > 0) {
        addParams = `cid=${cid}&${stringify(params)}`;
      } else {
        addParams = `cid=${cid}`;
      }

      if (path.indexOf('?') >= 0) {
        yield put(routerRedux[routerAction](`${path}&${addParams}`));
      } else {
        yield put(routerRedux[routerAction](`${path}?${addParams}`));
      }
    },

    /**
     * 跳转已encode的redirect, 并确保补充上cid
     */
    * jumpToRedirectPage(_, { select, put }) {
      const query = yield select((state) => state.browser.locationQuery);
      let redirect = '/';
      if (query.redirect) {
        redirect = query.redirect;
      }

      console.log('JUMP jumpToRedirectPage', redirect);
      const cid = yield select((state) => state.client.cid);
      const urlArr = decodeURIComponent(redirect).split('?');
      let jumpQuery: any = { cid };
      const path = urlArr[0];

      if (path === '/login') {
        console.log('JUMP jumpToRedirectPage path===/login, redirect to /');
        // 重定向如果是login页面，去首页
        yield put.resolve(routerRedux.push('/'));
        return;
      }

      if (urlArr.length > 1) {
        jumpQuery = parse(urlArr[1]);
      }

      // 去掉一些不应该带的参数
      delete jumpQuery.code;
      delete jumpQuery.token;

      yield put.resolve(routerRedux.replace(`${path}?${stringify(jumpQuery)}`));
    },
  },

  subscriptions: {
    // 监控路由变化，记录下来给其他模块使用
    setupHistory({ dispatch, history }) {
      history.listen((location) => {
        dispatch(actions.updateState({
          locationPathname: location.pathname,
          locationQuery: location.query,
          redirectStrToCurrentPage: encodeURIComponent(location.query.redirect ? location.query.redirect : `${location.pathname}?${stringify(location.query)}`),
        }));
      });

      let popStateTimer: any = null;

      window.onpopstate = () => {
        dispatch(actions.updateState({
          isJustPopState: true,
        }));
        if (popStateTimer) {
          clearTimeout(popStateTimer);
        }
        popStateTimer = setTimeout(() => {
          popStateTimer = null;
          dispatch(actions.updateState({
            isJustPopState: false,
          }));
        }, 1000);
      };
    },
  },
});
