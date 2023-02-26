import modelExtend from 'dva-model-extend';
import moment from 'moment';
import actions from 'actions';
import api from 'api';
import { model } from 'utils/model';

export const namespace = 'myCourse';
export const tabValues = {
  course: 'course',
  live: 'live',
  file: 'file',
};

const {
  getMyTeachingPlanList,
  getMyCourseList,
  getMyLiveCourseList,
  getMyOpernList,
} = api;

const IS_DEBUG = false;

// tab相关
const tabsOptions = {
  tabs: [
    { title: '课程', key: 'course' },
    { title: '直播', key: 'live' },
    { title: '资料', key: 'file' },
  ],
  currentTab: 'course',
};

const testState = {
  // tab相关
  ...tabsOptions,
  // 方案列表
  planList: [{
    objectType: 314,
    objectId: '4dd7dd110183e03aed1397ebfc879333',
    teachingPlan: {
      featureList: [],
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/16/f4ccab2dd210e5d36b10db3cd5d08a41.jpeg',
      price: 88,
      originalPrice: 99,
      studyCount: 1,
      planId: '4dd7dd110183e03aed1397ebfc879333',
      title: '证书测试',
      timePeriod: '2021-01-05',
      planTeachers: [
        {
          userId: '97e6d905bd51f37e7c780234092b7d2b---',
          nickname: '小鱼儿',
          image: 'https://qcdn.beautifulreading.com/301a322381cc1b4a4530ca3c04cad3c4',
        },
      ],
    },
  }, {
    objectType: 314,
    objectId: '4dd7dd110183e03aed1397ebfc879333',
    teachingPlan: {
      featureList: [],
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/16/f4ccab2dd210e5d36b10db3cd5d08a41.jpeg',
      price: 0,
      originalPrice: 0,
      studyCount: 1,
      itemCount: 1,
      planId: '4dd7dd110183e03aed1397ebfc879333',
      title: '证书测试',
      timePeriod: '2021-01-05',
      planTeachers: [
        {
          image: 'https://qcdn.beautifulreading.com/301a322381cc1b4a4530ca3c04cad3c4',
        },
      ],
    },
  }],
  // 课程列表
  courseList: [{
    image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/16/f4ccab2dd210e5d36b10db3cd5d08a41.jpeg',
    price: 99.00,
    originalPrice: 100.00,
    showStat: ['已学习：100', '已报名：1000'],
    title: '字段检查字段检查字段检查字段检查字段检查字段检查字段检查字段检查字段检查字段检查',
    desc: '字段检查字段检查字段检查字段检查字段检查字段检查字段检查字段检查字段检查字段检查',
    courseId: 'c9456fc1f595a5505e54160b7a5ec42d',
  }, {
    image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/16/f4ccab2dd210e5d36b10db3cd5d08a41.jpeg',
    price: 99.00,
    originalPrice: 100.00,
    showStat: ['已学习：100', '已报名：1000'],
    title: '字段检查字段检查字段检查字段检查字段检查字段检查字段检查字段检查字段检查字段检查',
    desc: '',
    courseId: 'c9456fc1f595a5505e54160b7a5ec42d',
  }],
  // 直播列表
  liveList: [{
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
  // 资料列表
  fileList: [
    {
      title: '资料资料资料资料',
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/16/f4ccab2dd210e5d36b10db3cd5d08a41.jpeg',
      showStat: ['浏览数: 100'],
      price: 0,
      originalPrice: 100,
    },
    {
      title: '资料资料资料资料',
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/16/f4ccab2dd210e5d36b10db3cd5d08a41.jpeg',
      showStat: ['浏览数: 100'],
      price: 0,
      originalPrice: 100,
    },
    {
      title: '资料资料资料资料',
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/16/f4ccab2dd210e5d36b10db3cd5d08a41.jpeg',
      showStat: ['浏览数: 100'],
      price: 0,
      originalPrice: 100,
    },
  ],
};

export default modelExtend(model, {
  namespace,

  state: IS_DEBUG ? testState : { isLoading: true, ...tabsOptions },

  reducers: {
    onTabChange(state, { payload: { currentTab } }) {
      return {
        ...state,
        currentTab,
      };
    },
  },

  effects: {
    /**
     * 605.m4 我的方案列表 getMyTeachingPlanList
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=2417
     */
    * getMyTeachingPlanListResult({ payload = { skip: 0, limit: 10 } }, { select, call, put }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const { head: { code, msg }, data } = yield call(getMyTeachingPlanList, {
        skip: payload.skip,
        limit: payload.limit,
      });
      if (code === 200) {
        const result = { ...data };
        const { rows = [], count: planCount } = result;

        const state = yield select((res) => res[namespace]);
        let planList = state.planList || [];
        planList = payload.skip === 0 ? [] : planList;
        planList = planList.concat(rows.map((item) => {
          const i: any = {};
          i.featureList = item.feature_list || [];
          i.image = item.cover_list.length > 0 ? item.cover_list[0].url : '';
          i.price = item.price;
          i.originalPrice = item.original_price;
          i.studyCount = item.study_count;
          i.planId = item.plan_id;
          i.title = item.title;
          i.timePeriod = item.time_period;
          i.planTeachers = item.teacher_list.map((teacher) => {
            const t: any = {};
            t.userId = teacher.user_id;
            t.nickname = teacher.nickname;
            t.image = teacher.headimgurl;
            return t;
          });

          return i;
        }));

        yield put(actions.updateState({ isLoading: false, planList, planCount }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },
    /**
     * 63.3.1 获取我的课程列表+ getMyCourseList
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=1801
     */
    * getMyCourseListResult({ payload = { skip: 0, limit: 10 } }, { select, call, put }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);
      const type = 'my';

      const { head: { code, msg }, data } = yield call(getMyCourseList, {
        client_id: cid,
        user_id: userId,
        type,
        skip: payload.skip,
        limit: payload.limit,
      });
      if (code === 200) {
        const result = { ...data };
        const { rows = [], count: courseCount } = result;

        const state = yield select((res) => res[namespace]);
        let courseList = state.courseList || [];
        courseList = payload.skip === 0 ? [] : courseList;
        courseList = courseList.concat(rows.map((item) => {
          const i: any = {};
          i.image = item.cover_url ? item.cover_url[0] : '';
          i.price = item.price;
          i.originalPrice = item.original_price;
          i.showStat = item.show_stat;
          i.title = item.title;
          i.desc = item.desc;
          i.courseId = item.course_id;

          return i;
        }));

        yield put(actions.updateState({ isLoading: false, courseList, courseCount }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },
    /**
     * 75.6 获取我的直播列表 getMyLiveCourseList
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=2027
     */
    * getMyLiveCourseListResult({ payload = { skip: 0, limit: 10 } }, { select, call, put }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const { head: { code, msg }, data } = yield call(getMyLiveCourseList, {
        skip: payload.skip,
        limit: payload.limit,
      });
      if (code === 200) {
        const result = { ...data };
        const { rows = [], count: liveCount } = result;

        const state = yield select((res) => res[namespace]);
        let liveList = state.liveList || [];
        liveList = payload.skip === 0 ? [] : liveList;
        liveList = liveList.concat(rows.map((item) => {
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

        yield put(actions.updateState({ isLoading: false, liveList, liveCount }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },
    /**
     * 68.11 我的已购买曲谱列表 getMyOpernList
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=1902
     */
    * getMyOpernListResult({ payload = { skip: 0, limit: 10 } }, { select, call, put }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);
      const { head: { code, msg }, data } = yield call(getMyOpernList, {
        client_id: cid,
        user_id: userId,
        skip: payload.skip,
        limit: payload.limit,
      });
      if (code === 200) {
        const result = { ...data };
        const { rows = [], count: fileCount } = result;

        const state = yield select((res) => res[namespace]);
        let fileList = state.fileList || [];
        fileList = payload.skip === 0 ? [] : fileList;
        fileList = fileList.concat(rows.map((item) => {
          const i: any = {};

          if (item.opern) {
            const {
              opern_id: opernId, title, cover_url: coverUrl, view_count: viewCount,
            } = item.opern;
            const [url] = coverUrl || [];

            i.opernId = opernId || '';
            i.title = title || '';
            i.image = url || '';
            i.showStat = [`浏览数：${viewCount}`];
            i.price = item.price;
            i.originalPrice = item.original_price;
          }

          return i;
        }));

        yield put(actions.updateState({ isLoading: false, fileList, fileCount }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    /**
     * 页面加载
     */
    * onLoad(_, { select, all, put }) {
      if (IS_DEBUG) {
        return;
      }

      const defaultTab = yield select((s) => s.browser.locationQuery.currentTab) || '';
      if (defaultTab) {
        yield put(actions.updateState({
          currentTab: defaultTab,
        }));
      }

      yield put(actions.updateState({
        planList: [],
        planCount: 0,
        courseList: [],
        courseCount: 0,
        liveList: [],
        liveCount: 0,
        fileList: [],
        fileCount: 0,
      }));

      yield put(actions.showLoading('加载中...'));

      const { currentTab = 'course' } = yield select((res) => res[namespace]);
      if (currentTab === tabValues.course) {
        yield put.resolve({ type: 'getMyTeachingPlanListResult' });

        const { planList, planCount } = yield select((res) => res[namespace]);
        if (planList.length >= planCount) {
          yield put.resolve({ type: 'getMyCourseListResult' });
        }
      } else if (currentTab === tabValues.live) {
        yield put.resolve({ type: 'getMyLiveCourseListResult' });
      } else if (currentTab === tabValues.file) {
        yield put.resolve({ type: 'getMyOpernListResult' });
      }

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
        currentTab = tabValues.course,
        //
        planList = [],
        planCount = 0,
        //
        courseList = [],
        courseCount = 0,
        //
        liveList = [],
        liveCount = 0,
        //
        fileList = [],
        fileCount = 0,
      } = yield select((state) => state[namespace]);

      if (isLoading || (planList.length >= planCount && courseList.length >= courseCount)) return;

      yield put(actions.showLoading('加载中...'));

      if (currentTab === tabValues.course) {
        if (planList.length < planCount) {
          yield put.resolve({ type: 'getMyTeachingPlanListResult', payload: { skip: planList.length, limit: 10 } });
          const {
            planCount: planCount_, planList: planList_,
          } = yield select((state) => state[namespace]);
          if (planList_.length >= planCount_) {
            yield put.resolve({ type: 'getMyCourseListResult', payload: { skip: courseList.length, limit: 10 } });
          }
        } else if (courseList.length < courseCount) {
          yield put.resolve({ type: 'getMyCourseListResult', payload: { skip: courseList.length, limit: 10 } });
        }
      } else if (currentTab === tabValues.live) {
        if (liveList.length < liveCount) {
          yield put.resolve({ type: 'getMyLiveCourseListResult', payload: { skip: liveList.length, limit: 10 } });
        }
      } else if (currentTab === tabValues.file) {
        if (fileList.length < fileCount) {
          yield put.resolve({ type: 'getMyOpernListResult', payload: { skip: fileList.length, limit: 10 } });
        }
      }

      yield put(actions.hideLoading());
    },

    * updateTab({ payload: { currentTab } }, { select, put }) {
      yield put(actions.updateState({
        currentTab,
      }));
      const {
        planList = [],
        liveList = [],
        fileList = [],
      } = yield select((state) => state[namespace]);

      if (currentTab === 'course' && !planList.length) {
        yield put.resolve({ type: 'getMyTeachingPlanListResult' });
        const {
          planCount = 0,
        } = yield select((state) => state[namespace]);
        if (planList.length >= planCount) {
          yield put.resolve({ type: 'getMyCourseListResult' });
        }
      } else if (currentTab === 'live' && !liveList.length) {
        yield put.resolve({ type: 'getMyLiveCourseListResult' });
      } else if (currentTab === 'file' && !fileList.length) {
        yield put.resolve({ type: 'getMyOpernListResult' });
      }
    },
  },

  subscriptions: {
    // 监控路由变化，记录下来给其他模块使用
    setup({ dispatch, history }) {
      const { location: { query: { currentTab = tabValues.course } } } = history;
      dispatch(actions.updateState({ currentTab: String(currentTab) }));
    },
  },
});
