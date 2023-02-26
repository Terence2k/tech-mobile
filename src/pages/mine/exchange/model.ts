import modelExtend from 'dva-model-extend';
import { model } from 'utils/model';
import api from 'api';
import actions from '@/actions';

const {
  exchangeVirtualProductByCode,
} = api;

export default modelExtend(model, {
  namespace: 'exchange',
  state: {
    exchangeCode: '',
    successVisible: false,
    product: {},
  },
  reducers: {
    updateCode(state, { payload }) {
      return {
        ...state,
        exchangeCode: payload.exchangeCode,
      };
    },
  },
  effects: {
    * exchangeVirtualProductByCode(_, { select, call, put }) {
      const clientId = yield select((s) => s.client.cid);
      const userId = yield select((s) => s.user.userId);
      const exchangeCode = yield select((s) => s.exchange.exchangeCode);

      const { head: { code, msg }, data } = yield call(exchangeVirtualProductByCode, {
        client_id: clientId,
        user_id: userId,
        code: exchangeCode,
      });

      if (code === 200) {
        const product = {
          title: data.product_name,
          productText: data.tip_title,
          image: data.product_cover_url,
          price: data.price || 0,
        };
        yield put(actions.updateState({
          successVisible: true,
          product,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    * closeSuccess(_, { put }) {
      yield put(actions.updateState({
        successVisible: false,
      }));
    },
  },
});
