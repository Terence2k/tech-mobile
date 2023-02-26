import modelExtend from 'dva-model-extend';
import { model } from 'utils/model';
import api from 'api';
import actions from 'actions';
// import testState from './testState';

const {
  getOpernList,
} = api;

export default modelExtend(model, {
  namespace: 'fileInnerData',

  state: {
    count: 0,
    current: 0,
    list: [],
    isLoading: false,
  },

  reducers: {},

  effects: {
    * getOpernList(_, { select, put, call }) {
      yield put(actions.updateState({
        isLoading: true,
      }));

      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);
      const current = yield select((state) => state.fileInnerData.current);
      const list = yield select((state) => state.fileInnerData.list);
      const opernSubjectId = yield select((state) => state.browser.locationQuery.opernSubjectId);
      const { head: { code, msg }, data } = yield call(getOpernList, {
        client_id: cid,
        user_id: userId,
        type: 'opern_subject',
        opern_subject_id: opernSubjectId,
        skip: current * 10,
        limit: 10,
      });

      if (code === 200) {
        const appendList = data.rows.map((i) => ({
          title: i.title,
          image: i.cover_url ? i.cover_url[0] : '',
          showStat: [`浏览数: ${i.view_count}`],
          price: i.price || 0,
          originalPrice: i.original_price || 0,
          opernId: i.opern_id,
        }));
        yield put(actions.updateState({
          list: list.concat(appendList),
          isLoading: false,
          count: data.count,
          current: current + 1,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    * onLoad(_, { put }) {
      yield put(actions.updateState({
        count: 0,
        current: 0,
        list: [],
        isLoading: false,
      }));
      yield put({ type: 'getOpernList' });
    },

    * onReachBottom(_, { select, put }) {
      const { current, count, isLoading } = yield select((state) => state.fileInnerData);
      if (current * 10 < count && !isLoading) {
        yield put({ type: 'getOpernList' });
      }
    },
  },
});
