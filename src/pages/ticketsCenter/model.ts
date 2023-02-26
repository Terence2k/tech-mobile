import modelExtend from 'dva-model-extend';
import { model } from 'utils/model';
import actions from 'actions';
import api from 'api';
import { convertUserTicketObj } from '@/models/ticket';

const {
  getTicketListByClient,
} = api;

export default modelExtend(model, {
  namespace: 'ticketsCenter',

  state: {
    // 优惠券
    ticketList: [],
  },

  reducers: {},

  effects: {
    * getMyTicketList(_, { select, put, call }) {
      const clientId = yield select((s) => s.client.cid);
      const userId = yield select((s) => s.user.userId);

      const { head: { code, msg }, data } = yield call(getTicketListByClient, {
        client_id: clientId,
        user_id: userId,
        type: 0,
      });

      if (code === 200) {
        yield put(actions.updateState({
          ticketList: data ? data.map((t) => convertUserTicketObj(t)) : [],
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },
  },
});
