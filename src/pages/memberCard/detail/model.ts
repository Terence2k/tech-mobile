import modelExtend from 'dva-model-extend';
import { model, Model, IShare } from '@/utils/model';
import api from 'api';
import actions from '@/actions';
import testState from './testState';

const {
  getMembercardDetail,
  joinMembercard,
  getMembercardCourseList,
  getMembercardLivecourseList,
  getMembercardDakaSubjectList,
} = api;

export default modelExtend(model, {
  namespace: 'memberCardDetail',

  state: testState,

  reducers: {},

  effects: {
    * getMembercardDetail(_, { select, put, call }) {
      const memberCardId = yield select((s) => s.browser.locationQuery.membercard_id);

      const { head: { code, msg }, data } = yield call(getMembercardDetail, {
        membercard_id: memberCardId,
      });
      if (code === 200) {
        yield put(actions.updateState({
          expireFlag: data.expire_flag || '',
          price: data.price || 0,
          desc: data.desc,
          cardDetail: {
            userName: data.user.nickname,
            userImage: data.user.headimgurl,
            subtitle: data.subtitle,
            desc: data.membercard_rights_list,
            title: data.title,
            background: data.image,
            price: data.price || 0,
            originalPrice: data.original_price || 0,
            period: data.valid_days >= 99999 ? '永久' : data.valid_days,
            color: data.font_color,
          },
          isMemberDesc: data.membercard_rights_list,
          notMemberDesc: data.no_rights_list,
          productId: data.product_id,
          memberCardDetail: data,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    * getFreeCourse(_, { select, put, call }) {
      const memberCardId = yield select((s) => s.browser.locationQuery.membercard_id);

      const { head: { code, msg }, data } = yield call(getMembercardCourseList, {
        membercard_id: memberCardId,
        type: 'free',
        skip: 0,
        limit: 4,
      });

      if (code === 200) {
        yield put(actions.updateState({
          freeCourseList: data.rows
            ? data.rows.map((i) => ({
              image: i.cover_url ? i.cover_url[0] : '',
              title: i.title,
              itemId: i.course_id,
            })) : [],
          freeCourseCount: data.count || 0,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    * getDiscountCourse(_, { select, put, call }) {
      const memberCardId = yield select((s) => s.browser.locationQuery.membercard_id);

      const { head: { code, msg }, data } = yield call(getMembercardCourseList, {
        membercard_id: memberCardId,
        type: 'discount',
        skip: 0,
        limit: 4,
      });

      if (code === 200) {
        yield put(actions.updateState({
          discountCourseList: data.rows
            ? data.rows.map((i) => ({
              image: i.cover_url ? i.cover_url[0] : '',
              title: i.title,
              price: i.price || 0,
              memberCardPrice: i.membercard_price || 0,
              itemId: i.course_id,
            })) : [],
          discountCourseCount: data.count || 0,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    * getFreeLiveCourse(_, { select, put, call }) {
      const memberCardId = yield select((s) => s.browser.locationQuery.membercard_id);

      const { head: { code, msg }, data } = yield call(getMembercardLivecourseList, {
        membercard_id: memberCardId,
        type: 'free',
        skip: 0,
        limit: 4,
      });

      if (code === 200) {
        yield put(actions.updateState({
          freeLiveCourseList: data.rows
            ? data.rows.map((i) => ({
              image: i.image,
              title: i.title,
              itemId: i.livecourse_id,
            })) : [],
          freeLiveCourseCount: data.count || 0,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    * getDiscountLiveCourse(_, { select, put, call }) {
      const memberCardId = yield select((s) => s.browser.locationQuery.membercard_id);

      const { head: { code, msg }, data } = yield call(getMembercardLivecourseList, {
        membercard_id: memberCardId,
        type: 'discount',
        skip: 0,
        limit: 4,
      });

      if (code === 200) {
        yield put(actions.updateState({
          discountLiveCourseList: data.rows
            ? data.rows.map((i) => ({
              image: i.image,
              title: i.title,
              price: i.price || 0,
              memberCardPrice: i.membercard_price || 0,
              itemId: i.livecourse_id,
            })) : [],
          discountLiveCourseCount: data.count || 0,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    * getFreeDakaCourse(_, { select, put, call }) {
      const memberCardId = yield select((s) => s.browser.locationQuery.membercard_id);

      const { head: { code, msg }, data } = yield call(getMembercardDakaSubjectList, {
        membercard_id: memberCardId,
        type: 'free',
        skip: 0,
        limit: 4,
      });

      if (code === 200) {
        yield put(actions.updateState({
          freeDakaList: data.rows
            ? data.rows.map((i) => ({
              image: i.image,
              title: i.title,
              itemId: i.subject_id,
            })) : [],
          freeDakaCount: data.count || 0,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    * getDiscountDakaCourse(_, { select, put, call }) {
      const memberCardId = yield select((s) => s.browser.locationQuery.membercard_id);

      const { head: { code, msg }, data } = yield call(getMembercardDakaSubjectList, {
        membercard_id: memberCardId,
        type: 'discount',
        skip: 0,
        limit: 4,
      });

      if (code === 200) {
        yield put(actions.updateState({
          discountDakaList: data.rows
            ? data.rows.map((i) => ({
              image: i.image,
              title: i.title,
              price: i.price || 0,
              memberCardPrice: i.membercard_price || 0,
              itemId: i.subject_id,
            })) : [],
          discountDakaCount: data.count || 0,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    * onLoad(_, { put }) {
      yield put(actions.showLoading());

      yield [
        'getMembercardDetail',
        'getFreeCourse',
        'getDiscountCourse',
        'getFreeLiveCourse',
        'getDiscountLiveCourse',
        'getFreeDakaCourse',
        'getDiscountDakaCourse',
      ].map((type) => put({ type }));

      yield put(actions.hideLoading());
    },

    * loadList(_, { put, select, call }) {
      yield put(actions.showLoading());
      const {
        popupPage, popupList = [], currentFunc, currentType,
      } = yield select((s) => s.memberCardDetail);
      const memberCardId = yield select((s) => s.browser.locationQuery.membercard_id);

      const { head: { code, msg }, data } = yield call(currentFunc, {
        membercard_id: memberCardId,
        type: currentType,
        skip: popupPage * 10,
        limit: 10,
      });
      if (code === 200) {
        const list = data.rows
          ? data.rows.map((i) => ({
            image: i.image || (i.cover_url ? i.cover_url[0] : ''),
            title: i.title,
            price: i.price || 0,
            memberCardPrice: i.membercard_price || 0,
            itemId: i.course_id || i.livecourse_id || i.subject_id,
          })) : [];

        yield put(actions.updateState({
          popupPage: popupPage + 1,
          popupCount: data.count || 0,
          popupList: popupList.concat(list),
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
      yield put(actions.hideLoading());
    },

    * moreClick({
      payload: {
        popupTitle, type, func, jumpPath, jumpField,
      },
    }, { put }) {
      yield put(actions.updateState({
        popupCount: 0,
        popupList: [],
        popupPage: 0,
        currentFunc: func,
        currentType: type,
        jumpPath,
        jumpField,
      }));
      yield put({ type: 'loadList' });

      yield put(actions.updateState({
        popupTitle,
        showPopup: true,
      }));
    },

    * closePopup(_, { put }) {
      yield put(actions.updateState({
        showPopup: false,
      }));
    },

    * onReachBottom(_, { select, put }) {
      const {
        popupLoading = false,
        popupPage = 0,
        popupCount = 0,
      } = yield select((s) => s.memberCardDetail);
      if (popupLoading) return;

      if (popupPage * 10 < popupCount) {
        yield put(actions.updateState({
          popupLoading: true,
        }));

        yield put({ type: 'loadList' });

        yield put(actions.updateState({
          popupLoading: false,
        }));
      }
    },

    * joinMembercard(_, { select, put, call }) {
      const memberCardId = yield select((s) => s.browser.locationQuery.membercard_id);
      const mobileNumber = yield select((s) => s.user.mobile_number);
      const { price = 0, productId = '' } = yield select((s) => s.memberCardDetail);
      const redirect = yield select((s) => s.browser.redirectStrToCurrentPage);

      if (!price) {
        const { head: { code, msg }, data } = yield call(joinMembercard, {
          membercard_id: memberCardId,
          mobile_number: mobileNumber,
        });

        if (code === 200) {
          if (data.status !== 4) {
            // 需要支付，下单方式变更，刷新页面
            yield put(actions.toastFail('获取方式已变更，请重试'));
          } else {
            // 加入成功, 刷新页面
            yield put(actions.toastSucc('开通成功！'));
          }
          yield put({ type: 'onLoad' });
        } else {
          yield put(actions.toastFail(msg));
        }
      } else {
        // 付费购买
        yield put(actions.jumpToPage('/orderPreview', {
          product_list: JSON.stringify([{
            productId,
            productDetailId: '',
            num: 1,
          }]),
          redirect,
        }));
      }
    },

    /**
     * 用户点击右上角转发
     */
    * onShareAppMessage(_, { select }) {
      const memberCardDetail = yield select((state) => state.memberCardDetail.memberCardDetail);
      const { title = '', desc = '', image = '' } = memberCardDetail || {};

      const options: IShare = {
        title,
        desc,
        link: window.location.href,
        imgUrl: image,
      };

      return options;
    },
  },
} as Model);
