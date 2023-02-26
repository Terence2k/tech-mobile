import modelExtend from 'dva-model-extend';
import actions from 'actions';
import api from 'api';
import { model, Model, IShare } from '@/utils/model';
import { nodeParser } from '@/components/product/productMediaList';

export const namespace = 'themeDetail';

const {
  getExamSubjectDetail,
  getExamRanking,
} = api;

const IS_DEBUG = false;

const tabsOptions = {
  tabs: [
    { title: '考级等级' },
    { title: '排行榜' },
  ],
  page: 0,
};

const testState = {
  // 封面
  coverList: [
    {
      type: 'image',
      url: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
    },
  ],
  // 标题
  title: '教学方案教学方案教学方案教学方案教学方案,',
  // 图文详情
  mediaList: [
    {
      node: [
        {
          type: 'text',
          attrs: {},
          html: '<strong><span style="color: #548DD4;">左对齐</span></strong>',
          text: '左对齐',
        },
        {
          type: 'text',
          attrs: {
            style: 'text-align: center;',
          },
          html: '居中对齐',
          text: '居中对齐',
        },
        {
          type: 'image_ad',
          subEntry: [
            {
              imageUrl: 'https://qcdn.beautifulreading.com/upload_files/2019/12/18/28a7bb22de769fb6bb3935287b2eb2b4.png',
              width: 1200,
              height: 773,
            },
          ],
        },
      ],
    },
  ],

  ...tabsOptions,

  // 底部栏
  submitBar: {
    // 分享
    share: {
      // 入口文案
      label: '分享',
    },
    menus: [],
  },

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

  // 考级列表
  levelList: [
    {
      levelIcon: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
      title: 'LV.MLGBZ',
      isPass: 'y',
      isOpen: 'y',
    },
    {
      levelIcon: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
      title: 'LV.MLGBZ',
      isOpen: 'y',
      isBuy: 'y',
    },
    {
      levelIcon: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
      title: 'LV.MLGBZ',
      isOpen: 'y',
      isBuy: 'n',
      price: 100,
      originalPrice: 1000,
    },
    {
      levelIcon: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
      title: 'LV.MLGBZ',
      isOpen: 'n',
      isBuy: 'n',
      price: 0,
    },
    {
      levelIcon: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
      title: 'LV.MLGBZ',
      isOpen: 'y',
      isBuy: 'y',
    },
  ],
};

export default modelExtend(model, {
  namespace,

  state: IS_DEBUG ? testState : { isLoading: true, ...tabsOptions },

  reducers: {
    onTabChange(state, { payload: { page } }) {
      return {
        ...state,
        page,
      };
    },
  },
  effects: {
    /**
     * 70.2 获取考级主题详情 getSubjectDetail
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=1925
     */
    * getSubjectDetailResult(_, { select, call, put }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);
      const { subject_id: subjectId = '' } = yield select((state) => state.browser.locationQuery);

      const { head: { code, msg }, data } = yield call(getExamSubjectDetail, {
        client_id: cid,
        user_id: userId,
        subject_id: subjectId,
      });
      if (code === 200) {
        const result = { ...data };

        // 封面
        const coverList = [{ type: 'image', url: result.image || '' }];

        // 标题
        const title = result.title || '';

        // 图文详情
        const media = result.memo ? result.memo.node : [];
        const mediaList = {
          node: media.map(nodeParser),
        };

        // 考级列表
        const levelList = result.level_rows ? result.level_rows.map((item) => {
          const i: any = {};
          i.levelIcon = item.icon_image;
          i.title = item.title;
          i.isPass = item.status && item.status === 'pass' ? 'y' : 'n';
          i.isOpen = item.is_next_level !== 'y' && (!item.status || item.status === 'wait') ? 'n' : 'y';
          i.isBuy = item.buy_flag === 'y' ? 'y' : 'n';
          i.price = item.price;
          i.originalPrice = item.original_price;
          i.levelId = item.level_id;
          i.jumpInfo = {
            webUrl: i.isBuy === 'n' ? `/levelDetail?level_id=${item.level_id}` : '',
            type: 'exam_detail',
            objectIds: {
              level_id: item.level_id,
            },
          };

          return i;
        }) : [];

        // 底部栏
        const submitBar = {
          // 分享
          share: {
            // 入口文案
            label: '分享',
          },
          menus: [],
        };

        yield put(actions.updateState({
          isLoading: false, coverList, title, mediaList, levelList, submitBar, themeDetail: data,
        }));
      } else {
        yield put(actions.toastFail(msg));
        yield put(actions.jumpToExceptionPage({ message: encodeURIComponent(msg) }));
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

      const cid = yield select((state) => state.client.cid);
      const { subject_id: subjectId = '' } = yield select((state) => state.browser.locationQuery);
      const state = yield select((res) => res[namespace]);

      const { head: { code, msg }, data } = yield call(getExamRanking, {
        client_id: cid,
        subject_id: subjectId,
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
        userList = userList.concat(rows.map((item) => {
          const i: any = {};
          i.userName = item.user.nickname;
          i.image = item.user.headimgurl;
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
        'getSubjectDetailResult',
        'getExamRankingResult',
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
        userList = [],
        userCount = 0,
      } = yield select((state) => state.themeDetail);

      if (isLoading || userList.length >= userCount) return;

      yield put(actions.showLoading('加载中...'));
      yield put.resolve({ type: 'getExamRankingResult', payload: { skip: userList.length, limit: 10 } });
      yield put(actions.hideLoading());
    },

    /**
     * 用户点击右上角转发
     */
    * onShareAppMessage(_, { select }) {
      const themeDetail = yield select((state) => state[namespace].themeDetail);
      const { title = '', cover_list: coverList } = themeDetail || {};
      let imgUrl = coverList ? coverList.filter((item) => item.type === 'image').map((item) => item.url) : '';
      imgUrl = imgUrl.length > 0 ? imgUrl[0] : '';

      const options: IShare = {
        title,
        link: window.location.href,
        imgUrl,
      };

      return options;
    },
  },
} as Model);
