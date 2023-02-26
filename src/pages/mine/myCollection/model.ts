/* eslint-disable no-nested-ternary */
import modelExtend from 'dva-model-extend';
import { model } from 'utils/model';
import api from 'api';
import actions from 'actions';
import moment from 'moment';
import testState from './testState';

const {
  getMyFavoriteCourse,
  getMyFavoriteOpern,
  getMyFavoriteOpernset,
} = api;

export default modelExtend(model, {
  namespace: 'myCollection',

  state: testState,

  reducers: {},

  effects: {
    * getMyFavoriteCourse(_, { select, call, put }) {
      const clientId = yield select((s) => s.client.cid);
      const userId = yield select((s) => s.user.userId);

      const { head: { code, msg }, data } = yield call(getMyFavoriteCourse, {
        user_id: userId,
        client_id: clientId,
      });

      if (code === 200) {
        const courseList = data.rows ? data.rows.map((i) => ({
          image: i.image ? i.image : (i.cover_url ? i.cover_url[0] : ''),
          price: i.price || 0,
          originalPrice: i.original_price || 0,
          showStat: [`已学习：${i.join_count}`],
          title: i.title,
          itemId: i.course_id || i.livecourse_id,
          liveStatus: i.live_status === 'wait' ? '未开始' : (i.live_status === 'doing' ? '直播中' : '已结束'),
          timeText: moment(i.start_time).format('YYYY-MM-DD HH:mm'),
          liveStatusStyles: i.live_status === 'wait' ? {
            color: '#FFF',
            background: '#FFA940',
          } : (i.live_status === 'doing' ? {
            color: '#FFF',
            background: '#409EFF',
          } : {
            color: '#FFF',
            background: '#BFBFBF',
          }),
          type: i.livecourse_id ? 'live' : 'course',
        })) : [];
        yield put(actions.updateState({
          courseList,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    * getMyFavoriteOpernset(_, { select, call, put }) {
      const clientId = yield select((s) => s.client.cid);
      const userId = yield select((s) => s.user.userId);

      const { head: { code, msg }, data } = yield call(getMyFavoriteOpernset, {
        user_id: userId,
        client_id: clientId,
      });

      if (code === 200) {
        const fileSetList = data.rows ? data.rows.map((i) => ({
          image: i.opernset.cover_url ? i.opernset.cover_url[0] : '',
          showStat: [`浏览数：${i.opernset.view_count}`],
          title: i.opernset.title,
          opernsetId: i.opernset.opernset_id,
        })) : [];
        yield put(actions.updateState({
          fileSetList,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    * getMyFavoriteOpern(_, { select, call, put }) {
      const clientId = yield select((s) => s.client.cid);
      const userId = yield select((s) => s.user.userId);

      const { head: { code, msg }, data } = yield call(getMyFavoriteOpern, {
        user_id: userId,
        client_id: clientId,
      });

      if (code === 200) {
        const fileList = data.rows ? data.rows.map((i) => ({
          image: i.opern.cover_url ? i.opern.cover_url[0] : '',
          price: i.opern.price || 0,
          originalPrice: i.opern.original_price || 0,
          showStat: [`浏览数：${i.opern.view_count}`],
          title: i.opern.title,
          opernId: i.opern.opern_id,
        })) : [];
        yield put(actions.updateState({
          fileList,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    * getList(_, { select, put }) {
      const currentTab = yield select((s) => s.myCollection.currentTab) || 0;
      if (currentTab === 0) {
        yield put({ type: 'getMyFavoriteCourse' });
      } else if (currentTab === 1) {
        yield put({ type: 'getMyFavoriteOpernset' });
      } else {
        yield put({ type: 'getMyFavoriteOpern' });
      }
    },

    * onTabChange({ payload: { currentTab } }, { put }) {
      yield put(actions.updateState({
        currentTab,
      }));

      yield put({ type: 'getList' });
    },
  },
});
