import modelExtend from 'dva-model-extend';
import { model } from 'utils/model';
import actions from 'actions';
import api from 'api';

// import testState from './testState';

const {
  getOpernList,
  getOpernSubjectList,
  getOpernsetList,
} = api;

export default modelExtend(model, {
  namespace: 'fileData',

  state: {
    newFiles: {},
    subjectList: [],
    fileSetList: [],
  },

  reducers: {},

  effects: {
    * getOpernList(_, { select, put, call }) {
      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);
      const { head: { code, msg }, data } = yield call(getOpernList, {
        client_id: cid,
        user_id: userId,
        type: 'new',
        skip: 0,
        limit: 6,
      });

      if (code === 200) {
        const newFiles = {
          title: '最新资料',
          allFlag: 'n',
          list: data.rows.map((i) => ({
            title: i.title,
            image: i.cover_url ? i.cover_url[0] : '',
            showStat: [`浏览数: ${i.view_count}`],
            price: i.price || 0,
            originalPrice: i.original_price || 0,
            opernId: i.opern_id,
          })),
        };
        yield put(actions.updateState({
          newFiles,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    * getOpernSubjectList(_, { select, put, call }) {
      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);
      const { head: { code, msg }, data } = yield call(getOpernSubjectList, {
        client_id: cid,
        user_id: userId,
      });

      if (code === 200) {
        const subjectList = data.map((subject) => ({
          title: subject.title,
          allFlag: 'y',
          opernSubjectId: subject.opern_subject_id,
          list: subject.opernList.map((i) => ({
            title: i.title,
            image: i.cover_url ? i.cover_url[0] : '',
            showStat: [`浏览数: ${i.view_count}`],
            price: i.price || 0,
            originalPrice: i.original_price || 0,
            opernId: i.opern_id,
          })),
        }));
        yield put(actions.updateState({
          subjectList,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

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
        const fileSetList = data.rows.map((i) => ({
          title: i.title,
          image: i.cover_url ? i.cover_url[0] : '',
          showStat: [`浏览数: ${i.view_count}`],
          opernsetId: i.opernset_id,
        }));
        yield put(actions.updateState({
          fileSetList,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    * onLoad(_, { put }) {
      yield [
        'getOpernList',
        'getOpernSubjectList',
        'getOpernsetList',
      ].map((type) => put({ type }));
      yield put(actions.hideLoading());
    },
  },
});
