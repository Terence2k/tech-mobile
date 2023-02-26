import modelExtend from 'dva-model-extend';
import { model } from 'utils/model';
import actions from 'actions';
import api from 'api';
import { delay } from 'utils/utils';

const {
  pay,
} = api;

/**
 * 微信内H5支付
 */
function onBridgeReady(params, cb, fail) {
  // eslint-disable-next-line no-undef
  WeixinJSBridge.invoke(
    'getBrandWCPayRequest',
    {
      ...params,
      timeStamp: String(params.timeStamp),
    },
    (res) => {
      // 支付成功
      if (res.err_msg === 'get_brand_wcpay_request:ok') {
        if (typeof cb === 'function') {
          cb(params);
        }
      } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
        fail({ errMsg: '取消支付' });
      } else {
        fail({ errMsg: '支付失败，请重新支付' });
      }
    },
  );
}

/**
 * 微信内H5支付
 */
function mwebWxPay(this: any, params) {
  return new Promise((resolve, reject) => {
    if (typeof WeixinJSBridge === 'undefined') {
      const cb = onBridgeReady.bind(this, params, resolve, reject);
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', cb, false);
      } else {
        (document as any).attachEvent('WeixinJSBridgeReady', cb);
        (document as any).attachEvent('onWeixinJSBridgeReady', cb);
      }
    } else {
      onBridgeReady(params, resolve, reject);
    }
  });
}

export default modelExtend(model, {
  namespace: 'order',

  state: {},

  reducers: {},

  effects: {
    * createOrder({
      payload: {
        mobileNumber, mcuId, total, userTicketId, remark, joinFunc, extraParams,
      },
    }, { call, select, put }) {
      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);
      const terminalType = yield select((state) => state.browser.terminalType);
      let type = 'pay';
      if (mcuId && total === 0) {
        type = 'membercard';
      }

      const { head: { code, msg }, data } = yield call(joinFunc, {
        client_id: cid,
        mobile_number: mobileNumber,
        user_id: userId,
        type,
        mcu_id: mcuId,
        user_ticket_id: userTicketId,
        // terminal_type: terminalType,
        remark,
        ...extraParams,
      });

      if (code === 200) {
        if (data.status !== 0) {
          yield put(actions.toastFail(`支付类型问题：${data.status}`));
          return;
        }

        // 发起支付
        console.log('before pay', data);
        yield put({ type: 'wxPay', payload: { cid, userId, orderId: data.order_id } });
      } else if (code === 461) {
        yield put(actions.toastFail(msg));
        yield call(delay, 1000);
        yield put(actions.jumpToPage('/mine/order'));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    /**
      * 支付
      */
    * wxPay({ payload: { cid, userId, orderId } }, { call, select, put }) {
      const terminalType = yield select((state) => state.browser.terminalType);

      const { head: { code, msg }, data } = yield call(pay, {
        client_id: cid,
        user_id: userId,
        order_id: orderId,
        // terminal_type: terminalType,
      });

      if (code === 200) {
        if (terminalType === 'wxweb') {
          // 调起支付接口wx
          const ret = yield call(mwebWxPay, data);
          console.log('WXPAY result:', ret);
          yield put(actions.browser.jumpToRedirectPage());
        } else if (terminalType === 'mweb') {
          // 拉起微信APP
          window.location.href = `${data.mweb_url}&redirect_url=${encodeURIComponent(window.location.href)}&is_back=1`;
        } else {
          // 显示支付二维码
          yield put(actions.popup.showQrCode(data.code_url, '完成扫码支付', actions.browser.jumpToRedirectPage()));
        }
      } else {
        yield put(actions.toastFail(msg));
      }
    },
  },
});
