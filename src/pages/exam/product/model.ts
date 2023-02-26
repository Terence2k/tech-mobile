import modelExtend from 'dva-model-extend';
import { model, Model, IShare } from '@/utils/model';
import api from 'api';
import actions from 'actions';
import productFunc from 'common/product';
import { nodeParser } from '@/components/product/productMediaList';
// import { history, router } from 'umi';
// import { parse, stringify } from 'qs';
// import Cookies from 'js-cookie';
// import config from 'utils/config';

// const { pathToRegexp } = require('path-to-regexp');
export const namespace = 'exam';

const {
  getExampaperDetail,
  getExampaperUserList,
  joinExampaper,
} = api;
/**
 * 底部按钮数据的计算函数
 * @param detail 考试详情
 * @param redirect 当前页面的可重定向路径，方便购买过程传递
 */
function getMenuByProductDetail(detail, redirect) {
  const {
    join_flag: joinFlag,
    price,
    last_detail_status: lastDetailStatus,
    top_detail_id: topDetailId,
    paper_id: paperId,
  } = detail;

  // 免费加入
  const freeJoin = (mcuId = '') => ({
    type: `${namespace}/freeJoin`,
    payload: {
      path: '/memberCardDetail',
      mcuId,
    },
  });

  // 0 已经拥有
  if (joinFlag === 'y') {
    if (lastDetailStatus === 'done') {
      return [{
        type: 'default',
        label: '查看考试',
        mode: 'blue',
        handler: null,
        jumpInfo: {
          type: 'exam_done',
          objectIds: {
            paper_id: paperId,
            detail_id: topDetailId,
          },
        },
      }];
    }

    return [{
      type: 'default',
      label: '参加考试',
      mode: 'blue',
      handler: null,
      jumpInfo: {
        type: 'exam_wait',
        objectIds: {
          paper_id: paperId,
        },
      },
    }];
  }

  // 1 未拥有 - 可免费获取
  // 1.1 本身免费
  if (price === 0) {
    return [{
      type: 'default', label: '免费获取', mode: 'blue', handler: freeJoin(),
    }];
  }

  // 通用的付费处理
  return productFunc.getDefaultMenusByProductDetail(detail, redirect);
}

// const isDevelopment = process.env.NODE_ENV === 'development';

const IS_DEBUG = false;

// components/productTab tab（通用）
const productTab = {
  active: 'ranking',
  tabs: [{
    value: 'memo',
    label: '考试详情',
  }, {
    value: 'ranking',
    label: '前十排行榜',
  }],
};

const testState = {
  // components/banner（通用）
  // 注意：当前视频暂不支持
  banner: [
    {
      type: 'image',
      url: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
    },
    {
      type: 'image',
      url: 'https://qcdn.beautifulreading.com/upload_files/2020/04/15/c785810835e1e816a4b5ed50acad3406.jpeg',
    },
    {
      type: 'video',
      url: 'https://qcdn.beautifulreading.com/upload_files/2020/09/29/5a4c0f086e7c719763d9188a855d2167.mp4',
      duration: 15,
    },
  ],

  // components/productTitle（通用）
  productTitle: '免费考试',

  // components/productPrice（通用）
  // 注意：
  // 1、如果是免费，不要设置价格相关字段；
  // 2、如果不显示价格，不需要设置任何字段。
  productPrice: {
    // 价格
    // price: 999.00,
    // 划线格
    // originalPrice: 1000.00,
    // 免费
    free: true,
  },

  // components/countStat 统计数据（通用）
  // 注意：需要使用字段showStatFlag来驱动是否显示该组件
  countStat: {
    list: ['共{question_count}道题', '考试时长 {不限时}', '总分{score}分'],
  },

  // components/productMembers 用户（通用）
  productMembers: {
    list: [
      {
        headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
        nickname: 'daf',
      }, {
        headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
        nickname: 'dfad',
      }, {
        headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
        nickname: 'ghsdfg',
      }, {
        headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
        nickname: 'asdfa',
      }, {
        headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
        nickname: 'chenmy',
      }],
    count: 999,
  },

  // components/productTab tab（通用）
  productTab,
  // productTab: {
  //   active: 'ranking',
  //   tabs: [{
  //     value: 'memo',
  //     label: '考试详情',
  //   }, {
  //     value: 'ranking',
  //     label: '前十排行榜',
  //   }],
  // },

  // ranking 排行榜
  ranking: {
    name: '',
    myRank: {
      index_i: '10',
      headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
      nickname: 'Laura Anderson',
      topDuration: '40',
      topScore: '88',
    },
    list: [{
      index_i: '0',
      headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
      nickname: 'Laura Anderson',
      topDuration: '40',
      topScore: '88',
    }, {
      index_i: '1',
      headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
      nickname: 'Laura Anderson',
      topDuration: '40',
      topScore: '88',
    }, {
      index_i: '2',
      headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
      nickname: 'Laura Anderson',
      topDuration: '40',
      topScore: '88',
    }, {
      index_i: '3',
      headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
      nickname: 'Laura Anderson',
      topDuration: '40',
      topScore: '88',
    }, {
      index_i: '4',
      headimgurl: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
      nickname: 'Laura Anderson',
      topDuration: '40',
      topScore: '88',
    }],
  },

  // components/productShare 分享（通用）
  // productShare: {
  //   name: '分享',
  //   menus: [{
  //     label: '生成卡片',
  //     type: 'card',
  //   }, {
  //     label: '复制链接',
  //     type: 'link',
  //   }],
  // },

  // components/productShareCard 分享卡片（通用）
  // productShareCard: {
  //   webShareImage: 'https://qcdn.beautifulreading.com/upload_files/2020/12/21/02144ebf69a3e4069c56ad82711e42e2.png',
  // },

  // components/productSubmitBar（通用）
  // 注意：mode字段确定menu的主题样式；label为当前menu文案；可添加其它字段供点击回调使用（比如使用会员卡的标识type: 'membercard'）。
  productSubmitBar: {
    // 是否禁用状态
    disabled: false,
    // disabled为true时需要
    disabledText: '活动已结束',
    // 分享
    share: {
      // 入口文案
      label: '分享',
    },
    // 提交订单栏
    menus: [{
      // 正价
      mode: 'blue',
      type: 'join',
      label: '获取考试',
    }],
  },

  // components/productMediaList 图文区块（通用）
  productMediaList: {
    name: '',
    list: [
      {
        // html: '<p><strong><span style="color: #548DD4;">左对齐</span></strong></p><p style="text-align: center;">居中对齐</p><div class="Image-captionContainer"><img src="https://qcdn.beautifulreading.com/upload_files/2019/12/18/28a7bb22de769fb6bb3935287b2eb2b4.png?imageView2/2/w/750/h/0/q/75/format/png" data-props="{&quot;type&quot;:&quot;image_ad&quot;,&quot;sub_entry&quot;:[{&quot;image_url&quot;:&quot;https://qcdn.beautifulreading.com/upload_files/2019/12/18/28a7bb22de769fb6bb3935287b2eb2b4.png&quot;,&quot;width&quot;:1200,&quot;height&quot;:773}]}" width="1210" height="779.4416666666666" class="FocusPlugin--focused"/></div>',
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
  },

  // favorites 收藏按钮
  productFavorites: {
    favoriteFlag: 'y',
  },

  // 详情
  examDetail: {},
};

export default modelExtend(model, {
  namespace,

  state: IS_DEBUG ? testState : { isLoading: true, productTab },

  reducers: {

  },
  effects: {
    /**
     * 不需要购买, 直接获取
     */
    * freeJoin({ payload: { mcuId } }, { call, select, put }) {
      const { paper_id: paperId = '' } = yield select((state) => state.browser.locationQuery);
      const courseId = yield select((state) => state.browser.locationQuery.course_id);
      const singlecourseId = yield select((state) => state.browser.locationQuery.singlecourse_id);
      const terminalType = yield select((state) => state.browser.terminalType);
      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);
      const mobileNumber = yield select((state) => state.user.mobileNumber);

      const { head: { code, msg }, data } = yield call(joinExampaper, {
        client_id: cid,
        paper_id: paperId,
        course_id: courseId,
        singlecourse_id: singlecourseId,
        mobile_number: mobileNumber,
        user_id: userId,
        type: mcuId ? 'membercard' : 'free',
        mcu_id: mcuId,
        // terminal_type: terminalType,
      });

      if (code === 200) {
        if (data.status !== 4) {
          // 需要支付，下单方式变更，刷新页面
          yield put({ type: 'popup/toastFail', payload: { msg: '获取方式已变更，请重试' } });
          yield put({ type: 'onLoad' });
        } else {
          // 加入成功, 刷新页面
          yield put(actions.toastSucc('获取成功'));
          yield put({ type: 'onLoad' });
        }
      } else {
        yield put({ type: 'popup/toastFail', payload: { msg } });
      }
    },

    /**
     * 77.1 获取考试详情 getExampaperDetail
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=2164
     */
    * getExampaperDetailResult(_, { select, call, put }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const { paper_id: paperId = '' } = yield select((state) => state.browser.locationQuery);

      const { head: { code, msg }, data } = yield call(getExampaperDetail, {
        paper_id: paperId,
      });

      if (code === 200) {
        const result = { ...data };

        // banner
        const banner = result.image ? [{ type: 'image', url: result.image }] : null;

        // title
        const productTitle = result.title || '';

        // price
        const productPrice = {
          price: result.price,
          originalPrice: result.original_price,
          free: result.price !== undefined ? result.price <= 0 : false,
        };

        // stat
        const countStat = {
          list: [
            `共 ${result.question_count || 0} 道题`,
            `考试时长 ${result.duration ? `${result.duration / 60}分钟` : '不限时'}`,
            `总分 ${result.score || 0} 分`,
          ],
        };

        // memo
        const productMediaList = {
          name: '',
          list: [{
            node: result.memo ? result.memo.node.map(nodeParser) : [],
          }],
        };

        // 当前页面链接，生成的重定向信息
        const redirectStrToCurrentPage = yield select(
          (state) => state.browser.redirectStrToCurrentPage,
        );

        // components/productSubmitBar（通用）
        // 注意：mode字段确定menu的主题样式；label为当前menu文案；可添加其它字段供点击回调使用（比如使用会员卡的标识type: 'membercard'）。
        const productSubmitBar = {
          // // 是否禁用状态
          // disabled: subject.status === 'expired',
          // // disabled为true时需要
          // disabledText: '活动已结束',
          // 分享
          share: {
            // 入口文案
            label: '分享',
          },
          // 提交订单栏
          menus: getMenuByProductDetail(result, redirectStrToCurrentPage),
        };

        yield put(actions.updateState({
          isLoading: false,
          banner,
          productTitle,
          productPrice,
          countStat,
          // productMembers,
          // tag,
          // productDaterangeFormat,
          productMediaList,
          // productFavorites,
          productSubmitBar,
          // sharePicUrl: subject.share_image || '',
          status: result.status || '',
          examDetail: data,
        }));
      } else {
        yield put(actions.toastFail(msg));
        yield put(actions.jumpToExceptionPage({ message: encodeURIComponent(msg) }));
      }
    },

    /**
     * 77.10 获取考试成员列表 getExampaperUserList
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=2177
     */
    * getExampaperUserListResult({
      payload = {
        skip: 0, limit: 8,
      },
    }, { select, call, put }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const cid = yield select((state) => state.client.cid);
      const { paper_id: paperId = '' } = yield select((state) => state.browser.locationQuery);

      const { head: { code, msg }, data } = yield call(getExampaperUserList, {
        client_id: cid,
        paper_id: paperId,
        stat_type: 'all',
        skip: payload.skip,
        limit: payload.limit,
        orderby: 'top_create_time',
        desc: 'y',
      });

      if (code === 200) {
        const result = { ...data };
        const { rows = [], count = 0 } = result;

        // members
        const productMembers = {
          list: rows.map((item) => {
            const i: any = {};
            const { user } = item;

            if (user) {
              i.headimgurl = user.headimgurl || '';
              i.nickname = user.nickname || '';
            }
            return i;
          }),
          count,
        };

        yield put(actions.updateState({ isLoading: false, productMembers }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    /**
     * 77.10 获取考试成员列表 getExampaperUserList
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=2177
     */
    * getRankingResult({
      payload = {
        skip: 0, limit: 10,
      },
    }, { select, call, put }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const cid = yield select((state) => state.client.cid);
      const { paper_id: paperId = '' } = yield select((state) => state.browser.locationQuery);
      const { status = '' } = yield select((state) => state[namespace]);

      const { head: { code, msg }, data } = yield call(getExampaperUserList, {
        client_id: cid,
        paper_id: paperId,
        stat_type: 'all',
        skip: payload.skip,
        limit: payload.limit,
        orderby: 'ranking',
        desc: 'y',
      });

      if (code === 200) {
        const result = { ...data };
        const { my_rank: myRank = {}, rows = [], count = 0 } = result;

        // ranking 排行榜
        const ranking = {
          name: '',
          status,
          myRank: {
            index_i: myRank.index_i,
            headimgurl: myRank.user.headimgurl,
            nickname: myRank.user.nickname,
            topDuration: myRank.top_duration,
            topScore: myRank.top_score,
          },
          list: rows.map((item) => {
            const i: any = {};
            i.index_i = item.index_i;
            i.headimgurl = item.user.headimgurl;
            i.nickname = item.user.nickname;
            i.topDuration = item.top_duration;
            i.topScore = item.top_score;

            return i;
          }),
          count,
        };

        yield put(actions.updateState({ isLoading: false, ranking }));
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
        'getExampaperDetailResult',
        'getExampaperUserListResult',
        'getRankingResult',
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
        ranking = { list: [], count: 0 },
      } = yield select((state) => state[namespace]);

      if (isLoading || ranking.list.length >= ranking.count) return;

      yield put(actions.showLoading('加载中...'));
      yield put.resolve({ type: 'getRankingResult', payload: { skip: ranking.list.length, limit: 10 } });
      yield put(actions.hideLoading());
    },

    /**
     * 用户点击右上角转发
     */
    * onShareAppMessage(_, { select }) {
      const examDetail = yield select((state) => state[namespace].examDetail);
      const { title = '', image = '' } = examDetail || {};

      const options: IShare = {
        title,
        link: window.location.href,
        imgUrl: image,
      };

      return options;
    },
  },
} as Model);
