import modelExtend from 'dva-model-extend';
import { model } from 'utils/model';
import actions from 'actions';
import testState from './testState';

export default modelExtend(model, {
  namespace: 'searchData',

  state: testState,
  reducers: {
    // 文字输入
    textChange(state, { payload: { title } }) {
      return {
        ...state,
        title,
      };
    },
  },
  effects: {
    * typeChange({ payload: { key, api, getJumpQuery } }, { put, select }) {
      yield put(actions.updateState({
        currentType: key,
        currentFunc: api,
        getJumpQuery,
        list: [],
        page: 0,
        count: 0,
      }));

      const title = yield select((s) => s.searchData.title) || '';
      if (title) {
        yield put({ type: 'getSearchList' });
      }
    },

    * getSearchList(_, { put, select, call }) {
      const {
        title, currentFunc, currentType, page, list = [],
      } = yield select((s) => s.searchData);
      const userId = yield select((s) => s.user.userId);
      const clientId = yield select((s) => s.client.cid);
      yield put(actions.updateState({
        isLoading: true,
        isSearching: true,
      }));

      const { head: { code, msg }, data } = yield call(currentFunc, {
        title,
        skip: 20 * page,
        limit: 20,
        user_id: userId,
        cid: clientId,
      });

      let field = '';
      switch (currentType) {
        case '1':
          field = 'course_id';
          break;
        case '2':
          field = 'livecourse_id';
          break;
        case '6':
          field = 'opern_id';
          break;
        default: break;
      }

      if (code === 200) {
        const appendList = data.rows.map((i) => ({
          title: i.title,
          id: i[field],
        }));

        yield put(actions.updateState({
          page: page + 1,
          count: data.count || 0,
          list: list.concat(appendList),
          isLoading: false,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    * submit({ payload: { insertTitle = '' } }, { put, select }) {
      if (insertTitle) {
        yield put(actions.updateState({
          title: insertTitle,
        }));
      }
      yield put(actions.updateState({
        list: [],
        page: 0,
        count: 0,
      }));

      const title = yield select((s) => s.searchData.title) || '';
      if (title) {
        yield put({ type: 'getSearchList' });
        yield put({ type: 'historyOpe', payload: { type: 'update' } });
      }
    },

    * getHistory(_, { put }) {
      const listJson = localStorage.getItem('SEARCH_HISTORY');
      yield put(actions.updateState({
        historyItems: listJson ? JSON.parse(listJson) : [],
      }));
    },

    * historyOpe({ payload: { type, title = '' } }, { put, select }) {
      const listJson = localStorage.getItem('SEARCH_HISTORY');
      const list = listJson ? JSON.parse(listJson) : [];
      const searchTitle = yield select((s) => s.searchData.title);

      if (type === 'delete') {
        const index = list.findIndex((i) => i === title);
        if (index > -1) {
          list.splice(index, 1);
          localStorage.setItem('SEARCH_HISTORY', JSON.stringify(list));
        }
      }
      if (type === 'update') {
        const index = list.findIndex((i) => i === searchTitle);
        if (index > -1) {
          list.splice(index, 1);
        }
        list.unshift(searchTitle);
        localStorage.setItem('SEARCH_HISTORY', JSON.stringify(list));
      }

      yield put({ type: 'getHistory' });
    },

    * resetList(_, { put }) {
      yield put(actions.updateState({
        isSearching: false,
        title: '',
      }));
    },

    * onReachBottom(_, { put, select }) {
      const { page, count, isLoading } = yield select((state) => state.searchData);
      if (page * 20 < count && !isLoading) {
        yield put({ type: 'getSearchList' });
      }
    },
  },
});
