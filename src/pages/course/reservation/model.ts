import modelExtend from 'dva-model-extend';
import { model, Model, IShare } from '@/utils/model';
import api from 'api';
import actions from 'actions';
import testState from './testState';

const {
  getReservationDetail,
  getTeacherList,
} = api;

export default modelExtend(model, {
  namespace: 'reservationDetail',

  state: testState,

  reducers: {},

  effects: {
    * getReservationDetail(_, { select, put, call }) {
      const reservationId = yield select((s) => s.browser.locationQuery.reservation_id);

      const { head: { code, msg }, data } = yield call(getReservationDetail, {
        reservation_id: reservationId,
      });

      if (code === 200) {
        const coverList = data.cover_list
          ? data.cover_list.map((i) => ({
            type: i.type,
            url: i.url,
          })) : [];

        yield put(actions.updateState({
          coverList,
          title: data.title,
          subjects: data.subjects || [],
          startTime: data.start_time || '',
          endTime: data.end_time || '',
          desc: data.desc || '暂无简介',
          reservationId,
          reservationDetail: data,
        }));
      } else {
        yield put(actions.toastFail(msg));
        yield put(actions.jumpToExceptionPage({ message: encodeURIComponent(msg) }));
      }
    },

    * getTeacherList(_, { select, put, call }) {
      const reservationId = yield select((s) => s.browser.locationQuery.reservation_id);

      const { head: { code, msg }, data } = yield call(getTeacherList, {
        reservation_id: reservationId,
      });

      if (code === 200) {
        const teacherList = data
          ? data.map((i) => ({
            reservationTeacherId: i.reservation_teacher_id,
            subjects: i.subjects ? i.subjects.slice(0, 2) : [],
            nickname: i.teacher.nickname,
            headimgurl: i.teacher.headimgurl,
          })) : [];

        yield put(actions.updateState({
          teacherList,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    * onLoad(_, { put }) {
      yield put(actions.showLoading());

      yield [
        'getReservationDetail',
        'getTeacherList',
      ].map((type) => put({ type }));

      yield put(actions.hideLoading());
    },

    /**
     * 用户点击右上角转发
     */
    * onShareAppMessage(_, { select }) {
      const reservationDetail = yield select((state) => state.reservationDetail.reservationDetail);
      const { title = '', desc = '', cover_list: coverList } = reservationDetail || {};
      let imgUrl = coverList ? coverList.filter((item) => item.type === 'image').map((item) => item.url) : '';
      imgUrl = imgUrl.length > 0 ? imgUrl[0] : '';

      const options: IShare = {
        title,
        desc,
        link: window.location.href,
        imgUrl,
      };

      return options;
    },
  },
} as Model);
