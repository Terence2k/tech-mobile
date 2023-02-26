import modelExtend from 'dva-model-extend';
import actions from 'actions';
import api from 'api';
import { model } from 'utils/model';

export const namespace = 'levelIndex';

const {
  getMyCourseInfo,
  getExamSubjectList,
  getExamRanking,
} = api;

const IS_DEBUG = false;
const testState = {
  // 用户信息
  userData: {
    image: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
    userName: '派大星',
    levelCount: 10,
  },
  // 用户等级数据
  levelData: {
    iconList: [
      {
        title: '奖章1奖章1奖章1奖章1奖章1奖章1奖章1奖章1奖章1奖章1',
        icon: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
      },
    ],
    studyCount: 10,
    finishCount: 10,
    avgGrade: 95.5,
  },
  // 考级主题列表
  levelList: [
    {
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/16/f4ccab2dd210e5d36b10db3cd5d08a41.jpeg',
      title: '测试测试',
    },
    {
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/16/f4ccab2dd210e5d36b10db3cd5d08a41.jpeg',
      title: '测试测试',
    },
    {
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/16/f4ccab2dd210e5d36b10db3cd5d08a41.jpeg',
      title: '测试测试',
    },
    {
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/16/f4ccab2dd210e5d36b10db3cd5d08a41.jpeg',
      title: '测试测试',
    },
    {
      image: 'https://qcdn.beautifulreading.com/upload_files/2020/12/16/f4ccab2dd210e5d36b10db3cd5d08a41.jpeg',
      title: '测试测试',
    },
  ],
  // 排行榜tab
  rankTabs: [
    {
      title: '发觉可是对方垃圾速度快放假啊了',
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
  currentTab: '0',
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
      levelIcon: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
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
  },
};

export default modelExtend(model, {
  namespace,

  state: IS_DEBUG ? testState : { isLoading: true },

  reducers: {
    onTabClick(state, { payload: { currentTab } }) {
      return {
        ...state,
        currentTab,
      };
    },
  },
  effects: {
    /**
     * 63.39 获取我的学习信息+ getMyCourseInfo
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=1841
     */
    * getMyCourseInfoResult(_, { select, call, put }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);

      const { head: { code, msg }, data } = yield call(getMyCourseInfo, {
        client_id: cid,
        target_user_id: userId,
      });

      if (code === 200) {
        const result = { ...data };

        // 用户信息
        const userData = {
          image: result.headimgurl || '',
          userName: result.nickname || '',
          levelCount: result.pass_level_count_len || 0,
        };

        // 用户等级数据
        const levelData = {
          iconList: result.examlevelOwns ? result.examlevelOwns.map((item) => {
            const v: any = {};
            v.title = item.subject_title;
            v.icon = item.level_info.icon_image;

            return v;
          }) : [],
          studyCount: result.join_course_count || 0,
          finishCount: result.post_count || 0,
          avgGrade: result.score_appraise || 0,
        };

        yield put(actions.updateState({ isLoading: false, userData, levelData }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    /**
     * 70.1 获取考级主题列表 getSubjectList
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=1924
     */
    * getSubjectListResult(_, { select, call, put }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);
      const state = yield select((res) => res[namespace]);

      const { head: { code, msg }, data } = yield call(getExamSubjectList, {
        client_id: cid,
        user_id: userId,
      });

      if (code === 200) {
        const result = { ...data };

        const subjectCount = result.count || 0;
        const subjectList = result.rows ? result.rows.map((item) => {
          const i: any = {};
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

        const rankTabs = subjectList.slice(0, 3).map(
          (item, index) => ({ ...item, id: String(index) }),
        );
        const currentTab = state.currentTab || '0';

        yield put(actions.updateState({
          isLoading: false, subjectList, subjectCount, rankTabs, currentTab,
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

      const tab = state.subjectList[Number(state.currentTab)];

      const { head: { code, msg }, data } = yield call(getExamRanking, {
        subject_id: tab.subjectId,
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
        } : null;

        let userList = state.userList || [];
        userList = payload.skip === 0 ? [] : userList;
        userList = userList.concat(rows.map((item) => {
          const i: any = {};
          const { user } = item;
          if (user) {
            i.userName = user.nickname;
            i.image = user.headimgurl;
          }
          i.levelCount = item.level_count;
          i.rank = item.ranking;
          i.levelIcon = item.icon_image;

          return i;
        }));

        yield put(actions.updateState({
          isLoading: false,
          myRank,
          userList,
          userCount,
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    /**
     * 页面加载
     */
    * onLoad(_, { all, put }) {
      if (IS_DEBUG) {
        return;
      }

      const types = [
        'getMyCourseInfoResult',
        'getSubjectListResult',
      ];
      yield put(actions.showLoading('加载中...'));
      yield all(types.map((type) => put.resolve({ type })));
      yield put.resolve({ type: 'getExamRankingResult' });
      yield put(actions.hideLoading());
    },
  },
});
