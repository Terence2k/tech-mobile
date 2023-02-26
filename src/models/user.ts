import modelExtend from 'dva-model-extend';
import Cookies from 'js-cookie';
import { model } from 'utils/model';
import config from 'utils/config';
import actions from 'actions';
import api from 'api';
import md5 from 'md5';

import { IUser } from './types';

const {
  getUserInfo,
  wxH5Login,
  getPublicUserInfo,
  addUserBrowse,
} = api;
export default modelExtend(model, {
  namespace: 'user',
  state: {
    // 微信OAuth的token
    otoken: null,

    // 手机号登录的token
    mtoken: null,

    // 是否完成了登录
    isLogin: false,

    // 用户ID
    userId: null,

    // 用户浏览器session
    brSession: '',

    // 用户手机号
    mobileNumber: '',

    // 昵称
    nickname: '',

    // 头像
    headImgUrl: '',

    // 是否为老师
    isTeacher: false,
  } as IUser,

  reducers: {},

  effects: {
    /**
     * 更新otoken，并写入cookie
     */
    * updateOtoken({ payload: { otoken } }, { call, put }) {
      if (!otoken) {
        yield call(Cookies.remove, `${config.storageNamespace}otoken`);
      } else {
        yield call(Cookies.set, `${config.storageNamespace}otoken`, otoken);
      }

      yield put.resolve(actions.updateState({ otoken }));
    },

    /**
     * 更新mtoken，并写入cookie; token更新后，调用getUserInfo
     */
    * updateMtoken({ payload: { mtoken } }, { call, put }) {
      if (!mtoken) {
        yield call(Cookies.remove, `${config.storageNamespace}mtoken`);
      } else {
        yield call(Cookies.set, `${config.storageNamespace}mtoken`, mtoken);
      }

      yield put.resolve(actions.updateState({ mtoken }));

      // mtoken更新后，用户信息需要重新获取一次
      if (mtoken) {
        yield put({ type: 'getUserInfo' });
      }
    },

    /**
     * 更新是否登录的状态
     */
    * updateLoginState({ payload: { isLogin } }, { call, put }) {
      yield call(Cookies.set, `${config.storageNamespace}loginState`, `${isLogin ? 'y' : 'n'}`);
      yield put.resolve(actions.updateState({ isLogin }));
    },

    /**
     * 更新brSession
     */
    * updateBrSession({ payload: { brSession } }, { call, put }) {
      yield call(Cookies.set, `${config.storageNamespace}brSession`, brSession);
      yield put.resolve(actions.updateState({ brSession }));
    },

    /**
     * 用户信息初始化入口
     */
    * init({ payload: { isCidChanged } }, { select, call, put }) {
      // 加载cookie数据到state
      let mtoken = yield call(Cookies.get, `${config.storageNamespace}mtoken`);
      let otoken = yield call(Cookies.get, `${config.storageNamespace}otoken`);
      const isLogin = (yield call(Cookies.get, `${config.storageNamespace}loginState`)) === 'y';
      let brSession = yield call(Cookies.get, `${config.storageNamespace}brSession`);

      const isWeixinBrowser = yield select((state) => state.browser.isWeixinBrowser);
      const { cid } = yield select((state) => state.client);

      console.log('INIT - user model 1 - init - mtoken exist:', !!mtoken, 'otoken exist:', !!otoken, 'isLogin', isLogin);

      if (!brSession) {
        brSession = md5(Math.floor(Math.random() * Date.now()));
        yield put.resolve({ type: 'updateBrSession', payload: { brSession } });
      } else {
        yield put.resolve(actions.updateState({ brSession }));
      }

      if (isCidChanged) {
        // 换店铺了
        otoken = null;
        mtoken = null;
        yield put.resolve({ type: 'updateOtoken', payload: { otoken } });
        yield put.resolve({ type: 'updateMtoken', payload: { mtoken } });
        yield put.resolve({ type: 'updateLoginState', payload: { isLogin } });

        console.log('INIT - user model 1.1 - init - isCidChanged');
      } else {
        // 写入state
        yield put.resolve(actions.updateState({ mtoken, otoken, isLogin }));
      }

      console.log('INIT - user model 2 - init');
      if (isWeixinBrowser) {
        // 微信浏览器
        console.log('INIT - user model 2.1 - init - isWeixinBrowser');
        const locationQuery = yield select((state) => state.browser.locationQuery);
        if (locationQuery.token) {
          // 参数带token
          yield put.resolve({ type: 'updateMtoken', payload: { mtoken: locationQuery.token } });
          yield put.resolve({ type: 'loginSucc' });
        } else if (locationQuery.code) {
          // 参数有code，走公众号登录
          console.log('INIT - user model 2.1.1 - init - locationQuery.code');

          const { head: { code, msg }, data } = yield call(wxH5Login, {
            code: locationQuery.code,
            client_id: cid,
          });

          if (code === 200) {
            console.log('INIT - user model 2.1.1.1 - init - updateOtoken and getPublicUserInfo');

            yield put.resolve({ type: 'updateOtoken', payload: { otoken: data.token } });
            yield put({ type: 'getPublicUserInfo' });
          } else {
            yield put(actions.toastFail(msg));
          }
        } else if (!isLogin) {
          yield put.resolve({ type: 'loginPending' });
          //   // 跳转拿code
          //   console.log('INIT - user model 2.1.2 - init - no code/otoken, jump wx to authorize');
          //   weixin.authorize(redirectStrToCurrentPage, authorized, appId);
        } else {
          // 已登录
          console.log('INIT - user model 2.1.3 - init - otoken ready, getPublicUserInfo');
          yield put({ type: 'getPublicUserInfo' });
        }
      } else if (!mtoken) {
        yield put.resolve({ type: 'loginPending' });
        //   // 非微信浏览器，且没有mtoken，跳转登录页面
        //   console.log('INIT - user model 2.2 - init - no mtoken, jump to login');
        //   if (path !== '/login') {
        //     yield put(actions.jumpToPage('/login', { redirect: redirectStrToCurrentPage }));
        //   }
      } else if (mtoken) {
        // 非微信浏览器，有mtoken，获取userInfo
        console.log('INIT - user model 2.3 - init - mtoken ready, loginSucc');

        yield put.resolve({ type: 'loginSucc' });
      }
    },

    /**
     * 获取用户信息
     */
    * getUserInfo(action, { select, put, call }) {
      const cid = yield select((state) => state.client.cid);
      const { head: { code, msg }, data: userInfo } = yield call(getUserInfo, { client_id: cid });

      if (code === 200) {
        yield put(actions.updateState({
          userId: userInfo.user_id,
          mobileNumber: userInfo.mobile_number,
          nickname: userInfo.nickname,
          headImgUrl: userInfo.headimgurl,
          isTeacher: !!userInfo.rank_ids.find((id) => id === 100),
        }));

        // yield put(actions.updateState({
        //   namespace: 'weixin',
        //   payload: {
        //     jumpId: userInfo.h5JumpId,
        //   },
        // }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    /**
     * 获取公众号用户的信息
     */
    * getPublicUserInfo(action, { select, put, call }) {
      const { head: { code, msg }, data } = yield call(getPublicUserInfo);

      if (code === 200) {
        console.log('INIT - user model 3 - getPublicUserInfo - updateOtoken');
        yield put.resolve({ type: 'updateOtoken', payload: { otoken: data.access_token } });
        if (!data.login_mobile_number) {
          // 未登录，延迟登录
          console.log('INIT - user model 3.1 - getPublicUserInfo - not login');
          yield put.resolve({ type: 'loginPending' });
          // const {
          //   locationPath: path,
          //   redirectStrToCurrentPage,
          // } = yield select((state) => state.browser);

          // if (path !== '/login') {
          //   console.log('INIT - user model 3.1.1 - getPublicUserInfo - jump to /login');
          //   yield put(actions.jumpToPage('/login', { redirect: redirectStrToCurrentPage }));
          // }
        } else {
          console.log('INIT - user model 3.2 - getPublicUserInfo - already login, loginSucc');
          yield put.resolve({ type: 'loginSucc' });
          const query = yield select((state) => state.browser.locationQuery);
          if (!query.wxshare) {
            // 过滤微信分享进来
            yield put.resolve(actions.browser.jumpToRedirectPage());
          }
        }
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    /**
     * 登录成功
     */
    * loginSucc(action, { call, put, select }) {
      yield put.resolve({ type: 'updateLoginState', payload: { isLogin: true } });
      yield put.resolve(actions.weixin.initJsSdk());
      yield put.resolve({ type: 'getUserInfo' });
      yield put(actions.client.getMiniTarbar());
      yield put(actions.client.getMiniConfig());
      yield put(actions.client.getMiniResourceList());
      yield put(actions.client.getClientInfoM());
      yield put(actions.client.getShareInfo());
      // 添加记录
      const url2 = window.location.pathname;
      const url3 = window.location.search;
      const userId = yield select((s) => s.user.userId);
      const res = yield call(addUserBrowse, ({
        user_id: userId,
        page: url2 + url3,
      }));
      console.log('url********', url2 + url3, res);
    },

    /**
     * 暂不登录
     */
    * loginPending(action, { call, put }) {
      // yield put.resolve({ type: 'getUserInfo' });
      yield put.resolve(actions.weixin.initJsSdk());
      yield put(actions.client.getMiniTarbar());
      yield put(actions.client.getMiniConfig());
      yield put(actions.client.getMiniResourceList());
      yield put(actions.client.getClientInfoM());
      yield put(actions.client.getShareInfo());
    },
  },

  subscriptions: {},
});
