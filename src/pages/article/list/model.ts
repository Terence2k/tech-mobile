import modelExtend from 'dva-model-extend';
import { model } from 'utils/model';
import api from 'api';
import actions from 'actions';
// import testState from './testState';

export const namespace = 'articleList';

const {
  getBanner,
  getArticleList,
} = api;

export default modelExtend(model, {
  namespace,

  state: {
    coverList: [],
    list: [],
  },

  effects: {
    * getBanner(_, { select, put, call }) {
      const userId = yield select((s) => s.user.userId);
      const clientId = yield select((s) => s.client.cid);

      const { head: { code, msg }, data } = yield call(getBanner, {
        user_id: userId,
        client_id: clientId,
        type: 'article',
      });

      if (code === 200) {
        const coverList = data.rows.map((i) => ({
          type: 'image',
          url: i.cover,
        }));

        yield put(actions.updateState({
          coverList,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    * getArticleList({ payload = { skip: 0, limit: 10 } }, { select, put, call }) {
      const clientId = yield select((s) => s.client.cid);
      const articleList = yield select((s) => s.articleList.list);

      const { head: { code, msg }, data } = yield call(getArticleList, {
        client_id: clientId,
        skip: payload.skip,
        limit: payload.limit,
      });

      if (code === 200) {
        const list = data.map((i) => ({
          title: i.title,
          image: i.cover_url,
          type: i.type,
          showStat: [`阅读数${i.browseNum}`],
          articleUrl: i.article_url,
          articleId: i.article_id,
        }));

        yield put(actions.updateState({
          list: [...articleList, ...list],
          noMore: list.length < payload.limit,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    * onLoad(_, { all, put }) {
      // yield put(actions.hideLoading());

      // yield [
      //   'getBanner',
      //   'getArticleList',
      // ].map((type) => put({ type }));
      // yield put(actions.hideLoading());

      const types = [
        'getBanner',
        'getArticleList',
      ];
      yield put(actions.showLoading());
      yield all(types.map((type) => put.resolve({ type })));
      yield put(actions.hideLoading());
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    * onReachBottom(_, { select, put }) {
      const {
        isLoading,
        list = [],
        noMore = false,
      } = yield select((state) => state[namespace]);

      if (isLoading || noMore) return;

      yield put(actions.showLoading());
      yield put.resolve({ type: 'getArticleList', payload: { skip: list.length, limit: 10 } });
      yield put(actions.hideLoading());
    },
  },
});
