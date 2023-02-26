import { CSSProperties } from 'react';
import modelExtend from 'dva-model-extend';
import { model } from 'utils/model';
import actions from 'actions';
import api from 'api';
// import { Toast } from 'antd-mobile';

export const namespace = 'dakaList';

const {
  getTodayDaka,
  getDakaList,
} = api;

const IS_DEBUG = false;
const testState = {
  // 列表
  list: [],
  count: 0,
};

export default modelExtend(model, {
  namespace,

  state: IS_DEBUG ? testState : { isLoading: true },

  reducers: {},

  effects: {
    /**
     * 72.1 获取今日打卡列表 getTodayDaka
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=1946
     */
    * getTodayDakaResult(_, { call, put }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const { head: { code, msg }, data } = yield call(getTodayDaka, {});

      if (code === 200) {
        const result = { ...data };
        const rows = result.rows || [];
        const todayCount = result.count || 0;

        const todaylist = rows.map((item) => {
          const i: any = { ...item };
          i.subjectId = item.subject_id;
          i.joinCount = item.join_count;
          i.todayDakaFlag = item.today_daka_flag;
          i.memberList = item.member_list ? item.member_list : [];
          i.jumpInfo = {
            type: 'daka_detail',
            objectIds: {
              subject_id: item.subject_id,
            },
          };
          return i;
        });

        yield put(actions.updateState({
          isLoading: false,
          todaylist,
          todayCount,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    /**
     * 72.3 获取全部打卡列表 getDakaList
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=1948
     */
    * getDakaListResult({ payload = { skip: 0, limit: 10 } }, { select, call, put }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const { head: { code, msg }, data } = yield call(getDakaList, {
        skip: payload.skip,
        limit: payload.limit,
      });

      if (code === 200) {
        const result = { ...data };
        const rows = result.rows || [];
        const dakaCount = result.count || 0;

        const stage = yield select((res) => res[namespace]);

        const statusformat = (status) => {
          let text = '';
          if (status === 'wait') {
            text = '未开始';
          } else if (status === 'valid') {
            text = '进行中';
          } else if (status === 'expired') {
            text = '已结束';
          }
          return text;
        };

        const statusStyle = (status) => {
          const style: CSSProperties = {};
          if (status === 'wait') {
            style.backgroundColor = 'rgb(132, 157, 191)';
          } else if (status === 'valid') {
            style.backgroundColor = 'rgb(65, 93, 150)';
          } else if (status === 'expired') {
            style.backgroundColor = 'rgb(204, 204, 204)';
          }
          return style;
        };

        let dakalist = stage.dakalist || [];
        dakalist = payload.skip === 0 ? [] : dakalist;
        dakalist = dakalist.concat(rows.map((item) => {
          const i: any = {};
          i.joinCount = item.join_count;
          i.totalCount = item.total_count;
          i.subjectId = item.subject_id;
          i.title = item.title;
          i.image = item.image;
          i.startTime = item.start_time;
          i.endTime = item.end_time;
          i.status = item.status;
          i.tags = [statusformat(item.status)];
          i.tagStyle = statusStyle(item.status);
          i.showStat = [`参加人数 ${item.join_count || 0}`, `打卡次数 ${item.total_count || 0}`];
          if (item.join_flag === 'y') {
            i.jumpInfo = {
              type: 'daka_detail',
              objectIds: {
                subject_id: item.subject_id,
              },
            };
          } else {
            i.jumpInfo = {
              webUrl: `/daka/product?subject_id=${item.subject_id}`,
            };
          }
          return i;
        }));

        yield put(actions.updateState({
          isLoading: false,
          dakalist,
          dakaCount,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    /**
     * 页面加载
     */
    * onLoad(_, { all, put, select }) {
      if (IS_DEBUG) {
        return;
      }

      const isJustPopState = yield select((s) => s.browser.isJustPopState);
      const isLoading = yield select((s) => s[namespace].isLoading);
      if (isJustPopState && !isLoading) {
        return;
      }

      const types = [
        'getIconNavigationDetailResult',
        'getTodayDakaResult',
        'getDakaListResult',
      ];
      yield put(actions.showLoading('加载中...'));
      yield all(types.map((type) => put({ type })));
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
        dakalist = [],
        dakaCount = 0,
      } = yield select((state) => state[namespace]);

      if (isLoading || dakalist.length >= dakaCount) return;

      yield put(actions.showLoading('加载中...'));
      yield put({ type: 'getDakaListResult', payload: { skip: dakalist.length, limit: 10 } });
      yield put(actions.hideLoading());
    },
  },
});
