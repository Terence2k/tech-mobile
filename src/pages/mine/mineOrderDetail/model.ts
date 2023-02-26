import modelExtend from 'dva-model-extend';
import api from 'api';
import { model } from 'utils/model';
import actions from '@/actions';

const {
  getOrder,
} = api;

export default modelExtend(model, {
  namespace: 'mineOrderDetail',

  state: {
    order: {
      order_id: '',
      fee: 0,
      status: '4', // 支付状态  4=成功
      telNumber: '',
      discount: 0, // 优惠
      money: 0,
      createtime: 0,
      paytime: 0,
      products: [{}],
    },
  },

  effects: {
    * getOrder(_, { select, call, put }) {
      const orderId = yield select((s) => s.browser.locationQuery.orderId);

      const { head: { code, msg }, data } = yield call(getOrder, {
        order_id: orderId,
      });

      if (code === 200) {
        let payText = '';

        if (data.paytime) {
          payText = '支付成功';
        } else if (data.status === 0) {
          payText = '未支付';
        } else if (data.status === 1) {
          payText = '未发货';
        } else if (data.status === 2) {
          payText = '已发货';
        } else if (data.status === 3) {
          payText = '已关闭';
        }

        const order = {
          order_id: data.order_id,
          total: data.total,
          fee: data.fee,
          status: data.status,
          telNumber: data.telNumber,
          discount: data.discount,
          money: data.money,
          createtime: data.createtime,
          paytime: data.paytime,
          payText,
          products: data.products ? data.products.map((i) => ({
            coverUrl: i.cover_url,
            productName: i.product_name,
            price: i.price,
            num: i.num,
            subTitle: i.subtitle,
            productType: i.productType,
            productId: i.product_id,
          })) : [],
        };
        yield put(actions.updateState({
          order,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },
  },
});
