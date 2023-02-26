import modelExtend from 'dva-model-extend';
import { model } from 'utils/model';
import api from 'api';
import actions from 'actions';
import { convertUserTicketObj } from '@/models/ticket';

const {
  getMyTicketList,
} = api;

export default modelExtend(model, {
  namespace: 'myTickets',

  state: {
    // tab相关
    tabs: [
      { title: '可用', key: '1' },
      { title: '不可用', key: '2' },
    ],
    currentTab: '1',
    // 优惠券
    ticketList: [],
  },

  reducers: {},

  effects: {
    * getMyTicketList(_, { select, put, call }) {
      const clientId = yield select((s) => s.client.cid);
      const userId = yield select((s) => s.user.userId);
      const type = yield select((s) => s.myTickets.currentTab);

      const { head: { code, msg }, data } = yield call(getMyTicketList, {
        client_id: clientId,
        user_id: userId,
        type,
      });

      if (code === 200) {
        yield put(actions.updateState({
          ticketList: data ? data.map((t) => convertUserTicketObj(t)) : [],
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    * onTabChange({ payload: { currentTab } }, { put }) {
      yield put(actions.updateState({
        currentTab,
        ticketList: [],
      }));
      yield put({ type: 'getMyTicketList' });
    },
  },
});
