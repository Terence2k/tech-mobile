import modelExtend from 'dva-model-extend';
import moment from 'moment';
import { model } from 'utils/model';
import actions from 'actions';
import api from 'api';
// import { Toast } from 'antd-mobile';

export const namespace = 'liveList';

const {
  getAllLivecourseList,
} = api;

const IS_DEBUG = false;
const testState = {
  // 列表
  list: [{
    image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/16/f4ccab2dd210e5d36b10db3cd5d08a41.jpeg',
    price: 0,
    originalPrice: 0,
    showStat: ['已学习：100', '已报名：1000'],
    liveStatus: '未开始',
    liveStatusStyles: {
      color: '#FFF',
      background: '#FFA940',
    },
    title: '字段检查字段检查字段检查字段检查字段检查字段检查字段检查字段检查字段检查字段检查',
    timeText: '2021-01-01 15:30',
    courseId: 'c9456fc1f595a5505e54160b7a5ec42d',
  }, {
    image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/16/f4ccab2dd210e5d36b10db3cd5d08a41.jpeg',
    price: 66.00,
    originalPrice: 90.00,
    liveStatus: '未开始',
    liveStatusStyles: {
      color: '#FFF',
      background: '#FFA940',
    },
    title: '字段检查',
    timeText: '2021-01-01 15:30',
    courseId: 'c9456fc1f595a5505e54160b7a5ec42d',
  }, {
    image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/16/f4ccab2dd210e5d36b10db3cd5d08a41.jpeg',
    price: 0,
    originalPrice: 0,
    liveStatus: '已结束',
    liveStatusStyles: {
      color: '#FFF',
      background: '#BFBFBF',
    },
    title: '字段检查',
    timeText: '2021-01-01 15:30',
    courseId: 'c9456fc1f595a5505e54160b7a5ec42d',
  }],
  count: 0,
};

export default modelExtend(model, {
  namespace,

  state: IS_DEBUG ? testState : { isLoading: true },

  reducers: {},

  effects: {
    /**
     * 75.1 获取直播课列表 getLivecourseList
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=2022
     */
    * getAllLivecourseList({ payload = { skip: 0, limit: 10 } }, { select, call, put }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const { head: { code, msg }, data } = yield call(getAllLivecourseList, {
        skip: payload.skip,
        limit: payload.limit,
      });

      if (code === 200) {
        const result = { ...data };
        const { rows = [], count = 0 } = result;

        const state = yield select((res) => res[namespace]);

        let list = state.list || [];
        list = payload.skip === 0 ? [] : list;
        list = list.concat(rows.map((item) => {
          const i: any = {};
          i.image = item.image;
          i.price = item.price;
          i.originalPrice = item.original_price;
          i.showStat = item.show_stat;
          i.liveStatusStyles = item.live_status_styles;
          i.title = item.title;
          i.timeText = moment(item.start_time).format('YYYY-MM-DD HH:mm');
          i.courseId = item.course_id;
          i.livecourseId = item.livecourse_id;

          return i;
        }));

        yield put(actions.updateState({
          isLoading: false,
          list,
          count,
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
        'getAllLivecourseList',
      ];
      yield put(actions.showLoading('加载中...'));
      yield all(types.map((type) => put.resolve({ type })));
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
        list = [],
        count = 0,
      } = yield select((state) => state[namespace]);

      if (isLoading || list.length >= count) return;

      yield put(actions.showLoading('加载中...'));
      yield put.resolve({ type: 'getAllLivecourseList', payload: { skip: list.length, limit: 10 } });
      yield put(actions.hideLoading());
    },
  },
});
