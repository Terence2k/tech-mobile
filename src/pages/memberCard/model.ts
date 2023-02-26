import modelExtend from 'dva-model-extend';
import { model } from 'utils/model';
import api from 'api';
import actions from 'actions';
// import testState from './testState';

const {
  getMemberCardList,
  myMemberCardList,
} = api;

export default modelExtend(model, {
  namespace: 'memberCardIndex',

  state: {
    // 顶部tab
    tabs: [
      { title: '热销会员卡' },
      { title: '我的会员卡' },
    ],
    page: 0,

    hasPage: 0,
    hasCount: 0,
    // 已拥有会员卡
    hasList: [],

    allPage: 0,
    allCount: 0,
    // 所有会员卡
    memberCardList: [],

    list: [
      { label: '使用中', id: 'valid' },
      { label: '已过期', id: 'expire' },
      { label: '已失效', id: 'invalid' },
    ],
    status: 'valid',
  },

  reducers: {},

  effects: {
    * getMemberCardList(_, { select, put, call }) {
      yield put(actions.showLoading());
      const { allPage, memberCardList = [] } = yield select((s) => s.memberCardIndex);
      const { head: { code, msg }, data } = yield call(getMemberCardList, {
        skip: allPage * 10,
        limit: 10,
      });

      if (code === 200) {
        const list = memberCardList.concat(data.rows.map((i) => ({
          title: i.title,
          desc: i.rights_list,
          background: i.image,
          memberCardId: i.membercard_id,
          price: i.price,
          originalPrice: i.original_price || 0,
          period: i.valid_days >= 99999 ? '永久有效' : i.valid_days,
          color: i.font_color,
        })));

        yield put(actions.updateState({
          allPage: allPage + 1,
          allCount: data.count || 0,
          memberCardList: list,
        }));
      } else {
        yield put(actions.toastFail(msg));
        yield put(actions.jumpToExceptionPage({ message: encodeURIComponent(msg) }));
      }

      yield put(actions.hideLoading());
    },

    * myMemberCardList(_, { select, put, call }) {
      yield put(actions.showLoading());
      const { hasPage, hasList = [], status } = yield select((s) => s.memberCardIndex);

      const { head: { code, msg }, data } = yield call(myMemberCardList, {
        skip: hasPage * 10,
        limit: 10,
        status,
      });

      if (code === 200) {
        const list = hasList.concat(data.rows.map((i) => ({
          title: i.title,
          enabled: i.enabled,
          expireFlag: i.expire_flag,
          expiredTime: i.valid_days >= 99999 ? 0 : i.expire_time,
          background: i.image,
          memberCardId: i.membercard_id,
          subtitle: i.subtitle,
          color: i.font_color,
          userName: i.user.nickname,
          userImage: i.user.headimgurl,
        })));

        yield put(actions.updateState({
          hasPage: hasPage + 1,
          hasCount: data.count || 0,
          hasList: list,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
      yield put(actions.hideLoading());
    },

    * onTabChange({ payload: { page } }, { select, put }) {
      yield put(actions.updateState({
        page,
      }));
      const { hasList = [], memberCardList = [] } = yield select((s) => s.memberCardIndex);
      if (page === 0 && (!memberCardList || !memberCardList.length)) {
        yield put({ type: 'getMemberCardList' });
      } else if (page === 1 && (!hasList || !hasList.length)) {
        yield put({ type: 'myMemberCardList' });
      }
    },

    * onLoad(_, { select, put }) {
      const { page = 0 } = yield select((s) => s.memberCardIndex);
      yield put(actions.updateState({
        allPage: 0,
        memberCardList: [],
        hasPage: 0,
        hasList: [],
      }));
      if (page === 0) {
        yield put({ type: 'getMemberCardList' });
      } else {
        yield put({ type: 'myMemberCardList' });
      }
    },

    * onReachBottom(_, { select, put }) {
      const {
        page = 0,
        hasCount = 0,
        allCount = 0,
        hasPage = 0,
        allPage = 0,
        listLoading = false,
      } = yield select((s) => s.memberCardIndex);
      if (listLoading) return;
      yield put(actions.updateState({
        listLoading: true,
      }));
      if (page === 0 && (10 * allPage < allCount)) {
        yield put({ type: 'getMemberCardList' });
      } else if (page === 1 && (10 * hasPage < hasCount)) {
        yield put({ type: 'myMemberCardList' });
      }
      yield put(actions.updateState({
        listLoading: false,
      }));
    },

    * onStatusChange({ payload: { status } }, { select, put }) {
      const currentStatus = yield select((s) => s.memberCardIndex.status);

      if (status !== currentStatus) {
        yield put(actions.updateState({
          status,
          hasPage: 0,
          hasCount: 0,
          hasList: [],
        }));
        yield put({ type: 'myMemberCardList' });
      }
    },
  },
});
