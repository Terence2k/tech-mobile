import modelExtend from 'dva-model-extend';
import api from 'api';
import actions from 'actions';
import { model, Model } from '@/utils/model';
import { IBrowser, IClient } from '@/models/types';

export const namespace = 'mineInfo';

const {
  wxMobileLogout,
  oauthMobileUserLogout,
} = api;

export default modelExtend(model, {
  namespace,

  state: {

  },

  effects: {
    /**
     * T06.m2 微信端手机号登录的登出 wxMobileLogout
     * @see https://showdoc.beautifulreading.com/web/#/1?page_id=2382
     */
    * wxMobileLogoutResult(_, { select, call, put }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const { cid }: IClient = yield select((state) => state.client);

      const { head: { code, msg } } = yield call(wxMobileLogout, {
        client_id: cid,
      });

      if (code === 200) {
        yield put.resolve(actions.user.updateOtoken(''));
        yield put.resolve(actions.user.updateMtoken(''));
        yield put.resolve(actions.user.updateLoginState(false));
        yield put(actions.updateState({ isLoading: false }));
        yield put(actions.jumpToLogin());
      } else {
        yield put(actions.updateState({ isLoading: false }));
        yield put(actions.toastFail(msg));
      }
    },

    /**
     * T06.5 [对外]旧版h5登出 oauthMobileUserLogout
     * @see https://showdoc.beautifulreading.com/web/#/1?page_id=2502
     */
    * oauthMobileUserLogoutResult(_, { call, put }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const { head: { code, msg }, data } = yield call(oauthMobileUserLogout);

      if (code === 200) {
        const { access_token: token } = data;

        yield put.resolve(actions.user.updateOtoken(token));
        yield put.resolve(actions.user.updateMtoken(''));
        yield put.resolve(actions.user.updateLoginState(false));
        yield put(actions.updateState({ isLoading: false }));
        yield put(actions.jumpToLogin());
      } else {
        yield put(actions.updateState({ isLoading: false }));
        yield put(actions.toastFail(msg));
      }
    },

    // 退出登录
    * logoutResult(_, { select, put }) {
      const { isWeixinBrowser }: IBrowser = yield select((state) => state.browser);

      if (isWeixinBrowser) {
        // 微信内退出
        yield put.resolve({ type: 'oauthMobileUserLogoutResult' });
      } else {
        // 微信外退出
        yield put.resolve({ type: 'wxMobileLogoutResult' });
      }
    },
  },
} as Model);
