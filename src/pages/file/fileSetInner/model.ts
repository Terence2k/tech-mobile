import modelExtend from 'dva-model-extend';
import { model } from 'utils/model';
import api from 'api';
import actions from 'actions';
// import testState from './testState';

const {
  getOpernsetList,
} = api;

export default modelExtend(model, {
  namespace: 'fileSetInnerData',

  state: {
    list: [],
  },

  reducers: {

  },

  effects: {
    * getOpernsetList(_, { select, put, call }) {
      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);
      const { head: { code, msg }, data } = yield call(getOpernsetList, {
        client_id: cid,
        user_id: userId,
        skip: 0,
        limit: 10,
      });

      if (code === 200) {
        const list = data.rows.map((i) => ({
          title: i.title,
          image: i.cover_url ? i.cover_url[0] : '',
          showStat: [`浏览数: ${i.view_count}`],
          opernsetId: i.opernset_id,
        }));
        yield put(actions.updateState({
          list,
          isLoading: false,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },
  },
});
