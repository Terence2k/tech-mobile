import modelExtend from 'dva-model-extend';
import moment from 'moment';
import { model } from 'utils/model';
import api from 'api';
import actions from 'actions';
// import { Toast } from 'antd-mobile';
// const { getLivecourseDetail } = api;

const {
  getTeachingPlanList,
  getReservationList,
  getExampaperList,
  getApplyFormList,
  getSubjectDetail,
} = api;

export const namespace = 'courseList';

const IS_DEBUG = false;
const testState = {
  // 教育方案
  contentRows: [{
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
  // 预约
  reservationList: [{
    reservationSubjects: ['都是付费', '都是免费', 'text'],
    reservationId: '54a1a8ccb75e1e76d7edc825e1fe2eda',
    title: '新预约，我不是老师2',
    image: 'https://qcdn.beautifulreading.com/upload_files/2020/04/09/95383022dce6df61e906b713565d777b.jpeg',
    timeText: '2020-01-01',
    reservationTeachers: [
      {
        image: 'https://qcdn.beautifulreading.com/bac406c625f3644985b2cc0ff069c4b1',
      },
      {
        image: 'https://qcdn.beautifulreading.com/9af45ef7f9fefd785b5f4aea9aa4d3cd',
      },
    ],
  }],
  // 录播课
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
};

export default modelExtend(model, {
  namespace,

  state: IS_DEBUG ? testState : { isLoading: true },

  reducers: {
    onTabChange(state, { payload: { activeTab } }) {
      return {
        ...state,
        activeTab,
      };
    },
  },

  effects: {
    /**
     * 605.m4 我的方案列表 getMyTeachingPlanList
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=2417
     */
    * getTeachingPlanListResult({ payload = { skip: 0, limit: 10 } }, { select, call, put }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const query = yield select((state) => state.browser.locationQuery);

      const { head: { code, msg }, data } = yield call(getTeachingPlanList, {
        subject_id: query.subject_id,
        skip: payload.skip,
        limit: payload.limit,
      });
      if (code === 200) {
        const result = { ...data };
        const { rows = [], count: contentCount } = result;

        const state = yield select((res) => res[namespace]);
        let contentRows = state.contentRows || [];
        contentRows = payload.skip === 0 ? [] : contentRows;
        contentRows = contentRows.concat(rows ? rows.map((item) => {
          const i: any = {};
          i.featureList = item.feature_list || [];
          i.image = item.cover_list.length > 0 ? item.cover_list[0].url : '';
          i.price = item.price;
          i.originalPrice = item.original_price;
          i.studyCount = item.join_count || 0;
          i.itemCount = item.item_count || 0;
          i.planId = item.plan_id;
          i.title = item.title;
          i.timePeriod = item.start_time && item.end_time ? `${moment(item.start_time).format('YYYY.MM.DD')} - ${moment(item.end_time).format('YYYY.MM.DD')}` : '';
          i.planTeachers = item.teacher_list.map((teacher) => {
            const t: any = {};
            t.userId = teacher.user_id;
            t.nickname = teacher.nickname;
            t.image = teacher.headimgurl;
            return t;
          });

          return i;
        }) : []);

        yield put(actions.updateState({
          isLoading: false,
          contentRows,
          contentCount,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },
    /**
     * 606.m9 获取预约列表 getReservationList
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=2490
     */
    * getReservationListResult({ payload = { skip: 0, limit: 10 } }, { select, call, put }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const query = yield select((state) => state.browser.locationQuery);

      const { head: { code, msg }, data } = yield call(getReservationList, {
        subject_id: query.subject_id,
        skip: payload.skip,
        limit: payload.limit,
      });
      if (code === 200) {
        const result = { ...data };
        const { rows = [], count: reservationCount } = result;

        const state = yield select((res) => res[namespace]);
        let reservationList = state.reservationList || [];
        reservationList = payload.skip === 0 ? [] : reservationList;
        reservationList = reservationList.concat(rows.map((item) => {
          const i: any = {};
          i.reservationSubjects = item.subjects || [];
          i.reservationId = item.reservation_id || '';
          i.title = item.title || '';
          i.image = item.cover_list && item.cover_list.length > 0 ? item.cover_list[0].image : '';
          i.timeText = item.start_time && item.end_time ? `${moment(item.start_time).format('YYYY.MM.DD')} - ${moment(item.end_time).format('YYYY.MM.DD')}` : '';
          i.reservationTeachers = item.teacher_list ? item.teacher_list.map((teacher) => {
            const t: any = {};
            t.image = teacher.headimgurl;
            return t;
          }) : [];

          return i;
        }));

        yield put(actions.updateState({
          isLoading: false,
          reservationList,
          reservationCount,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },
    /**
     * 77.14 获取考试列表 getExampaperList
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=2651
     */
    * getExampaperListResult({ payload = { skip: 0, limit: 10 } }, { select, call, put }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const query = yield select((state) => state.browser.locationQuery);

      const { head: { code, msg }, data } = yield call(getExampaperList, {
        subject_id: query.subject_id,
        skip: payload.skip,
        limit: payload.limit,
      });
      if (code === 200) {
        const result = { ...data };
        const { rows = [], count: exampaperCount } = result;

        const state = yield select((res) => res[namespace]);
        let exampaperList = state.exampaperList || [];
        exampaperList = payload.skip === 0 ? [] : exampaperList;
        exampaperList = exampaperList.concat(rows.map((c) => {
          const n: any = {};
          n.paperId = c.paper_id;
          n.title = c.title;
          n.image = c.image ? c.image : '';
          n.price = c.price;
          n.originalPrice = c.original_price;

          return n;
        }));

        yield put(actions.updateState({
          isLoading: false,
          exampaperList,
          exampaperCount,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },
    /**
     * 609.m7 获取报名表列表 getApplyFormList
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=2652
     */
    * getApplyFormListResult({ payload = { skip: 0, limit: 10 } }, { select, call, put }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const query = yield select((state) => state.browser.locationQuery);

      const { head: { code, msg }, data } = yield call(getApplyFormList, {
        subject_id: query.subject_id,
        skip: payload.skip,
        limit: payload.limit,
      });
      if (code === 200) {
        const result = { ...data };
        const { rows = [], count: applyFormCount } = result;

        const state = yield select((res) => res[namespace]);
        let applyFormList = state.applyFormList || [];
        applyFormList = payload.skip === 0 ? [] : applyFormList;
        applyFormList = applyFormList.concat(rows.map((c) => {
          const images = c.cover_list ? c.cover_list.filter((cover) => cover.type === 'image').map((cover) => cover.url) : [];
          const n: any = {};
          n.applyFormId = c.apply_form_id;
          n.title = c.title;
          n.image = images.length > 0 ? images[0] : '';
          n.price = c.price;
          n.originalPrice = c.original_price;

          return n;
        }));

        yield put(actions.updateState({
          isLoading: false,
          applyFormList,
          applyFormCount,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },
    /**
     * 63.2.1 获取分类详情+ getSubjectDetail
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=1798
     */
    * getSubjectDetailResult(_, { select, call, put }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);
      const query = yield select((state) => state.browser.locationQuery);

      const { head: { code, msg }, data } = yield call(getSubjectDetail, {
        client_id: cid,
        user_id: userId,
        subject_id: query.subject_id,
      });
      if (code === 200) {
        const result = { ...data };
        // eslint-disable-next-line camelcase
        const { course_rows = [], course_count: courseCount, show_data: showData } = result;

        const courseList = course_rows.map((item) => {
          const n: any = {};
          n.image = item.cover_url ? item.cover_url[0] : '';
          n.price = item.price;
          n.originalPrice = item.original_price;
          n.showStat = showData === 1 ? [`已报名${item.join_count || 0}`, `已学习${item.study_count || 0}`, `作业数${item.post_count || 0}`] : [`浏览量${item.view_count || 0}`];
          n.title = item.title;
          n.desc = item.desc;
          n.courseId = item.course_id;

          return n;
        });

        yield put(actions.updateState({
          isLoading: false,
          courseList,
          courseCount,
          showData,
        }));
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

      const isJustPopState = yield select((s) => s.browser.isJustPopState);
      const isLoading = yield select((s) => s[namespace].isLoading);
      if (isJustPopState && !isLoading) {
        return;
      }

      yield put(actions.showLoading('加载中...'));
      yield put.resolve({ type: 'getTeachingPlanListResult' });

      const { contentRows, contentCount } = yield select((res) => res[namespace]);

      if (contentRows.length >= contentCount) {
        yield put.resolve({ type: 'getReservationListResult' });

        const { reservationList, reservationCount } = yield select((res) => res[namespace]);
        if (reservationList.length >= reservationCount) {
          yield put.resolve({ type: 'getExampaperListResult' });

          const { exampaperList, exampaperCount } = yield select((res) => res[namespace]);
          if (exampaperList.length >= exampaperCount) {
            yield put.resolve({ type: 'getApplyFormListResult' });

            const { applyFormList, applyFormCount } = yield select((res) => res[namespace]);
            if (applyFormList.length >= applyFormCount) {
              yield put.resolve({ type: 'getSubjectDetailResult' });
            }
          }
        }
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
        //
        contentRows = [],
        contentCount = 0,
        //
        reservationList = [],
        reservationCount = 0,
        //
        exampaperList = [],
        exampaperCount = 0,
        //
        applyFormList = [],
        applyFormCount = 0,
        //
        courseList = [],
      } = yield select((state) => state[namespace]);

      if (isLoading
        || (
          contentRows.length >= contentCount
          && reservationList.length >= reservationCount
          && exampaperList.length >= exampaperCount
          && applyFormList.length >= applyFormCount
          && courseList.length > 0
        )
      ) return;

      yield put(actions.showLoading('加载中...'));

      if (contentRows.length < contentCount) {
        yield put({ type: 'getTeachingPlanListResult', payload: { skip: contentRows.length, limit: 10 } });
      } else if (reservationList.length < reservationCount) {
        yield put({ type: 'getReservationListResult', payload: { skip: reservationList.length, limit: 10 } });
      } else if (exampaperList.length < exampaperCount) {
        yield put({ type: 'getExampaperListResult', payload: { skip: exampaperList.length, limit: 10 } });
      } else if (applyFormList.length < applyFormCount) {
        yield put({ type: 'getApplyFormListResult', payload: { skip: applyFormList.length, limit: 10 } });
      } else {
        yield put({ type: 'getSubjectDetailResult' });
      }

      yield put(actions.hideLoading());
    },
  },
});
