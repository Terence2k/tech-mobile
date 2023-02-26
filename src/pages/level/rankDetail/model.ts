import modelExtend from 'dva-model-extend';
import actions from 'actions';
import api from 'api';
import { model } from 'utils/model';

export const namespace = 'rankDetail';

const {
  getExamSubjectList,
  getExamRanking,
} = api;

const IS_DEBUG = false;
const testState = {
  // 考级主题列表
  subjectList: [
    {
      title: '发觉可是对方垃圾速度快放假啊了发觉可是对方垃圾速度快放假啊了发觉可是对方垃圾速度快放假啊了发觉可是对方垃圾速度快放假啊了',
      id: '1',
    },
    {
      title: '发觉可是对方垃圾速度快放假啊了',
      id: '2',
    },
    {
      title: '发觉可是对方垃圾速度快放假啊了',
      id: '3',
    },
  ],
  // 当前考级主题
  subject: '',
  // 用户排行
  userList: [
    {
      userName: '用户一号',
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
      levelCount: 10,
      rank: 1,
      levelIcon: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
    },
    {
      userName: '用户号用户号用户号',
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
      levelCount: 0,
      rank: 2,
    },
    {
      userName: '用户号',
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
      levelCount: 2,
      rank: 3,
      levelIcon: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
    },
    {
      userName: '用户号',
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
      levelCount: 2,
      rank: 4,
      levelIcon: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
    },
    {
      userName: '用户号',
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
      levelCount: 2,
      rank: 5,
      levelIcon: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
    },
    {
      userName: '用户号',
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
      levelCount: 2,
      rank: 6,
      levelIcon: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
    },
    {
      userName: '用户号',
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
      levelCount: 2,
      rank: 7,
      levelIcon: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
    },
    {
      userName: '用户号',
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
      levelCount: 2,
      rank: 8,
      levelIcon: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
    },
    {
      userName: '用户号',
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
      levelCount: 2,
      rank: 9,
      levelIcon: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
    },
    {
      userName: '用户号',
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
      levelCount: 2,
      rank: 10,
      levelIcon: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
    },
    {
      userName: '用户号',
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
      levelCount: 2,
      rank: 11,
      levelIcon: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
    },
    {
      userName: '用户号',
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
      levelCount: 2,
      rank: 12,
      levelIcon: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
    },
  ],
  // 用户个人排行
  myRank: {
    userName: '用户一号',
    image: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
    levelCount: 10,
    rank: 18,
    isFinished: 'n',
  },
};

export default modelExtend(model, {
  namespace,

  state: IS_DEBUG ? testState : { isLoading: true },

  reducers: {
    subjectChange(state, { payload: { subject } }) {
      return {
        ...state,
        subject,
      };
    },
  },

  effects: {

    /**
     * 70.1 获取考级主题列表 getSubjectList
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=1924
     */
    * getSubjectListResult(_, { select, call, put }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);

      const { head: { code, msg }, data } = yield call(getExamSubjectList, {
        client_id: cid,
        user_id: userId,
      });

      if (code === 200) {
        const result = { ...data };

        const subjectCount = result.count || 0;
        const subjectList = result.rows ? result.rows.map((item, index) => {
          const i: any = {};
          i.id = String(index);
          i.subjectId = item.subject_id;
          i.clientId = item.client_id;
          i.title = item.title;
          i.image = item.image;
          i.type = item.type;
          i.memo = item.memo;
          i.status = item.status;
          i.joinCount = item.join_count;
          i.passCount = item.pass_count;
          i.levelCount = item.level_count;
          i.createTime = item.createTime;
          i.createDate = item.createDate;
          i.deleteStatus = item.delete_status;

          return i;
        }) : [];

        yield put(actions.updateState({
          isLoading: false, subjectList, subjectCount,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    /**
     * 70.19 获取考级排行榜 getExamRanking
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=1942
     */
    * getExamRankingResult({ payload = { skip: 0, limit: 10 } }, {
      select, call, all, put,
    }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const state = yield select((res) => res[namespace]);

      if (!state.subjectList || state.subjectList.length <= 0) {
        return;
      }

      let item;
      const index = state.subjectList.findIndex((res) => res.id === state.subject);
      if (index === -1) {
        const [i] = state.subjectList;
        item = i;
      } else {
        item = state.subjectList[index];
      }

      const { head: { code, msg }, data } = yield call(getExamRanking, {
        subject_id: item.subjectId,
        skip: payload.skip,
        limit: payload.limit,
      });

      if (code === 200) {
        const result = { ...data };
        const { rows = [], count: userCount = 0 } = result;

        const myRank = result.my_ranking ? {
          userName: result.my_ranking.user.nickname,
          image: result.my_ranking.user.headimgurl,
          levelCount: result.my_ranking.level_count,
          rank: result.my_ranking.ranking,
          isFinished: result.my_ranking.ranking ? 'y' : 'n',
        } : null;

        let userList = state.userList || [];
        userList = payload.skip === 0 ? [] : userList;
        userList = userList.concat(rows.map((n, userindex) => {
          const i: any = {};
          i.userName = n.user.nickname;
          i.image = n.user.headimgurl;
          i.levelCount = n.level_count;
          i.rank = String(userindex + 1);
          i.levelIcon = n.icon_image;

          return i;
        }));

        yield put(actions.updateState({
          isLoading: false,
          subject: item.id,
          myRank,
          userList,
          userCount,
        }));
      } else {
        yield put(actions.toastFail(msg));
        yield put(actions.jumpToExceptionPage({ message: encodeURIComponent(msg) }));
      }
    },

    /**
     * 页面加载
     */
    * onLoad(_, { all, put }) {
      if (IS_DEBUG) {
        return;
      }

      yield put(actions.showLoading('加载中...'));
      yield put.resolve({ type: 'getSubjectListResult' });
      yield put.resolve({ type: 'getExamRankingResult' });
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
        userList = [],
        userCount = 0,
      } = yield select((state) => state[namespace]);

      if (isLoading || userList.length >= userCount) return;

      yield put(actions.showLoading('加载中...'));
      yield put.resolve({ type: 'getExamRankingResult', payload: { skip: userList.length, limit: 10 } });
      yield put(actions.hideLoading());
    },
  },
});
