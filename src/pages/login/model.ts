import modelExtend from 'dva-model-extend';
import { model } from 'utils/model';
import { delay } from 'utils/utils';
import actions from 'actions';
import weixin from 'common/weixin';

import api from 'api';

const {
  sendValidateCode,
  h5MobileUserLogin,
  oauthMobileUserLogin,
} = api;

export const namespace = 'login';
export default modelExtend(model, {
  namespace,

  state: {
    // 输入框里面的手机号
    mobileNumber: '',

    // 再次发送短信需要等待的时间
    remainSec: 0,

    // 验证码
    validateCode: '',
  },

  reducers: {
  },

  effects: {
    /**
     * 发送验证码
     */
    * sendValidateCode(action, { call, select, put }) {
      let remainSec = yield select((state) => state[namespace].remainSec);
      if (remainSec > 0) {
        // 倒计时中，不允许发送
        return;
      }

      // 检查手机号合法性
      let mobileNumber = yield select((state) => state[namespace].mobileNumber);
      mobileNumber = mobileNumber.split(' ').join('');
      if (mobileNumber.length !== 11) {
        yield put(actions.toastFail('请输入正确的手机号'));
        return;
      }

      yield put(actions.showLoading('发送中'));
      const cid = yield select((state) => state.client.cid);
      const isWeixinBrowser = yield select((state) => state.browser.isWeixinBrowser);
      const { head: { code, msg } } = yield call(sendValidateCode, {
        login_account: mobileNumber.replace(/\s+/g, ''),
        sence: isWeixinBrowser ? 'oauthMobileUserLogin' : 'h5Login',
        action_type: 'normal',
        client_id: cid,
      });

      if (code === 200) {
        yield put(actions.toastSucc('已发送'));
        // 倒计时
        remainSec = 60;
        while (remainSec >= 0) {
          yield put(actions.updateState({ remainSec }));
          yield call(delay, 1000);
          remainSec -= 1;
        }
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    /**
     * 登录
     */
    * login(action, { call, select, put }) {
      // 检查手机号合法性
      let mobileNumber = yield select((state) => state[namespace].mobileNumber);
      mobileNumber = mobileNumber.split(' ').join('');
      if (mobileNumber.length !== 11) {
        yield put(actions.toastFail('请输入正确的手机号'));
        return;
      }

      // 检查验证码是否有填写
      const validateCode = yield select((state) => state[namespace].validateCode);
      if (!validateCode) {
        yield put(actions.toastFail('请输入正确的验证码'));
        return;
      }

      // 微信内、外的登录
      yield put(actions.showLoading('登录中'));
      const cid = yield select((state) => state.client.cid);
      const isWeixinBrowser = yield select((state) => state.browser.isWeixinBrowser);
      const userLoginFunc = isWeixinBrowser ? oauthMobileUserLogin : h5MobileUserLogin;
      const { head: { code, msg }, data } = yield call(userLoginFunc,
        {
          client_id: cid,
          login_account: mobileNumber.replace(/\s+/g, ''),
          validate_code: validateCode.replace(/\s+/g, ''),
          sence: isWeixinBrowser ? 'oauthMobileUserLogin' : 'h5Login',
        });

      if (code === 200) {
        console.log('LOGIN - login model 1 - login - succ');

        yield put(actions.hideLoading());

        // 登录成功，更新token
        if (isWeixinBrowser) {
          yield put.resolve(actions.user.updateOtoken(data.access_token));
        } else {
          yield put.resolve(actions.user.updateMtoken(data.access_token));
        }
        yield put.resolve(actions.user.loginSucc());

        // 跳转源路径(redirect)
        console.log('LOGIN - login model 2 - login - jumpToRedirectPage');
        yield put(actions.browser.jumpToRedirectPage());
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    /**
     * 初始化检查
     */
    * check(action, { call, select, put }) {
      yield put(actions.updateState({
        mobileNumber: '',
        validateCode: '',
      }));

      // 登录分流不同页面
      const {
        isWeixinBrowser,
        locationQuery,
      } = yield select((state) => state.browser);

      const { authorized, appId } = yield select((state) => state.client);
      const { otoken } = yield select((state) => state.user);

      if (isWeixinBrowser && !locationQuery.code && !otoken && appId) {
        console.log('INIT - login model check - jump wx to authorize');
        weixin.authorize(locationQuery.redirect, authorized, appId);
      }
    },
  },
});
