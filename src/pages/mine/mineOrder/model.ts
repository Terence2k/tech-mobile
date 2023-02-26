import modelExtend from 'dva-model-extend';
import actions from 'actions';
import api from 'api';
import { model } from 'utils/model';

export const namespace = 'mineOrder';

const {
  selforderlist,
} = api;

const IS_DEBUG = false;
const testState = {
  orderList: [
    {
      orderId: 'sn201230xer7xrdwc6ake6xy',
      fee: 0,
      statusText: '交易成功',
      products: [
        {
          cover_url: ['https://qcdn.beautifulreading.com/upload_files/2020/03/20/0f8959afc0bead5e840d6a54b47b0862.png'],
          num: 1,
          price: 0,
          product_name: '指定永久',
        },
      ],
    },
    {
      orderId: 'sn201230xer7xrdwc6ake611',
      fee: 0.01,
      statusText: '交易成功',
      products: [
        {
          cover_url: ['https://qcdn.beautifulreading.com/upload_files/2020/03/20/0f8959afc0bead5e840d6a54b47b0862.png'],
          num: 1,
          price: 0.01,
          product_name: '指定永久123',
        },
      ],
    },
    {
      orderId: 'sn201230xer7xrdwc6ake622',
      fee: 10,
      statusText: '交易成功',
      products: [
        {
          cover_url: ['https://qcdn.beautifulreading.com/upload_files/2020/03/20/0f8959afc0bead5e840d6a54b47b0862.png'],
          num: 1,
          price: 10,
          product_name: '123指定永久',
        },
      ],
    },
  ],
};

export default modelExtend(model, {
  namespace,

  state: IS_DEBUG ? testState : { isLoading: true },

  effects: {
    /**
     * 51.12 小程序订单列表 selforderlist
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=1640
     */
    * getSubjectListResult({ payload = { skip: 0, limit: 10 } }, {
      select, call, all, put,
    }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const cid = yield select((res) => res.client.cid);
      const userId = yield select((res) => res.user.userId);
      const state = yield select((res) => res[namespace]);

      const { head: { code, msg }, data } = yield call(selforderlist, {
        client_id: cid,
        user_id: userId,
        status: state.status,
        skip: payload.skip,
        limit: payload.limit,
      });

      if (code === 200) {
        const result = [...data];
        let orderList = state.orderList || [];
        orderList = payload.skip === 0 ? [] : orderList;
        orderList = orderList.concat(result.map((item) => {
          const i: any = {};
          i.orderId = item.order_id;
          i.productName = item.product_name;
          i.type = item.type;
          i.paramDetail = item.param_detail || [];
          i.money = item.money;
          i.refundId = item.refund_id;
          i.refundStatus = item.refundStatus;
          i.statusText = item.statusText;
          i.status = item.status;
          i.statusText = item.statusText;
          i.newOrder = item.newOrder;
          i.url = item.url;
          i.productType = item.productType;
          i.showSellGroup = item.showSellGroup;
          i.productNum = item.productNum;
          i.total = item.total;

          const { products = [] } = item;
          i.products = products.map((product) => {
            const p: any = {};
            p.coverUrl = product.cover_url || [];
            p.productName = product.product_name || '';
            p.paramDetailValue = product.param_detail_value || [];
            p.price = product.price;
            p.num = product.num;
            p.refundId = product.refund_id;
            p.refundStatus = product.refundStatus;
            p.statusText = product.statusText;
            p.refundStatusText = product.refundStatusText;

            return p;
          });

          const { product, newOrder } = item;
          if (newOrder) {
            i.product = product;
          } else {
            i.product = {
              thumb: product.thumb || '',
              productName: product.product_name || '',
            };
          }

          return i;
        }));

        yield put(actions.updateState({
          isLoading: false,
          orderList,
          noMore: result.length < payload.limit,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    /**
     * 页面加载
     */
    * onLoad(_, { all, put }) {
      if (IS_DEBUG) {
        return;
      }

      const types = [
        'getSubjectListResult',
      ];
      yield put(actions.showLoading('加载中...'));
      yield all(types.map((type) => put.resolve({ type })));
      yield put(actions.hideLoading());
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    * onReachBottom(_, { select, put }) {
      if (IS_DEBUG) {
        return;
      }

      const {
        isLoading,
        orderList = [],
        noMore = false,
      } = yield select((state) => state[namespace]);

      if (isLoading || noMore) return;

      yield put(actions.showLoading('加载中...'));
      yield put.resolve({ type: 'getSubjectListResult', payload: { skip: orderList.length, limit: 10 } });
      yield put(actions.hideLoading());
    },

    * pay({ payload: { orderId } }, { select, put }) {
      const cid = yield select((res) => res.client.cid);
      const userId = yield select((res) => res.user.userId);
      yield put(actions.order.wxPay(cid, userId, orderId));
    },
  },

});
