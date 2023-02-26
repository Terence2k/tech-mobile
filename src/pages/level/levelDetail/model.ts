import modelExtend from 'dva-model-extend';
import productFunc from 'common/product';
import actions from 'actions';
import api from 'api';
import { nodeParser } from '@/components/product/productMediaList';
import { model } from 'utils/model';

export const namespace = 'levelDetail';

/**
 * 底部按钮数据的计算函数
 * @param detail detail
 * @param redirect 当前页面的可重定向路径，方便购买过程传递
 */
function getMenuByProductDetail(detail, redirect, joinInfo, subjectId) {
  const {
    my_membercard_list: myMemberCardList = [],
    price,
    link_id: linkId,
  } = detail;

  // 免费加入
  const freeJoin = (mcuId = '') => ({
    type: `${namespace}/freeJoin`,
    payload: {
      mcuId,
    },
  });

  // 0 已经拥有
  if (joinInfo) {
    let label = '';
    const status = joinInfo.status || '';
    if (status === 'wait') { // wait 等待提交作业。底部按钮显示“去考级”
      label = '去考级';
    } else if (status === 'submit') { // submit 已提交待审批。底部按钮显示“考级审核中”
      label = '考级审核中';
    } else if (status === 'pass') { // pass 审核通过。底部按钮显示“报考”或“参加考级”
      label = '参加考级';
    } else if (status === 'refused') { // refused 不通过。底部按钮显示“报考”或“参加考级”
      label = '参加考级';
    }

    return [{
      type: 'default',
      label,
      mode: 'blue',
      handler: null,
      jumpInfo: {
        type: 'exam_detail',
        objectIds: {
          level_id: linkId,
        },
      },
    }];
  }

  // 1 未拥有 - 可免费获取
  // 1.1 本身免费
  if (price === 0) {
    return [{
      type: 'default', label: '参加考级', mode: 'blue', handler: freeJoin(),
    }];
  }

  // 1.2 拥有会员卡所以免费
  const myFreeCard = myMemberCardList.find((card) => card.expire_time > Date.now() && card.free_flag === 'y');
  if (myFreeCard) {
    return [{
      type: 'membercard', label: '会员免费报考', mode: 'black', handler: freeJoin(myFreeCard.mcu_id),
    }];
  }

  // 通用的付费处理
  return productFunc.getDefaultMenusByProductDetail(detail, `/themeDetail?subject_id=${subjectId}`);
}

const {
  getLevelDetail,
  joinExam,
} = api;

const IS_DEBUG = false;
const testState = {
  headerData: {
    cover: 'https://qcdn.beautifulreading.com/upload_files/2020/07/14/c87f1c2bbc7cc6956656e3f695eed216.jpeg',
    title: '派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星',
    desc: '派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星派大星',
    originalPrice: 1000,
    price: 999,
  },
  // 试看
  preMemo: {
    title: '标题标题',
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
  },
  memo: {
    title: '标题标题',
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
  },

  // 底部栏
  submitBar: {
    // 分享
    share: {
      // 入口文案
      label: '分享',
    },
    // 提交订单栏
    menus: [
      {
        // 正价
        mode: 'blue',
        type: 'default',
        label: '报考',
      },
    ],
  },
};

export default modelExtend(model, {
  namespace,

  state: IS_DEBUG ? testState : { isLoading: true },

  effects: {
    /**
     * 不需要购买, 直接获取
     */
    * freeJoin({ payload: { mcuId } }, { call, select, put }) {
      const { level_id: levelId = '' } = yield select((state) => state.browser.locationQuery);
      const terminalType = yield select((state) => state.browser.terminalType);
      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);
      const mobileNumber = yield select((state) => state.user.mobileNumber);

      const { head: { code, msg }, data } = yield call(joinExam, {
        client_id: cid,
        level_id: levelId,
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
     * 70.3 获取等级详情 getLevelDetail
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=1926
     */
    * getLevelDetailResult(_, { select, call, put }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);
      const { level_id: levelId = '' } = yield select((state) => state.browser.locationQuery);

      const { head: { code, msg }, data } = yield call(getLevelDetail, {
        client_id: cid,
        user_id: userId,
        level_id: levelId,
      });
      if (code === 200) {
        const result = { ...data };

        if (result.join_info) {
          // 已获取，回退到主题列表
          yield put(actions.browser.jumpToPage('/themeDetail', { subject_id: result.level.subject_id }, 'replace'));
          return;
        }

        const headerData = {
          cover: result.level.icon_image || '',
          title: result.level.title,
          desc: result.subject.title,
          originalPrice: result.product.original_price,
          price: result.product.price,
        };

        const preMemo = result.level.pre_memo_title ? {
          title: result.level.pre_memo_title || '试看内容',
          mediaList: [{
            node: result.level.pre_memo && result.level.pre_memo.node
              ? result.level.pre_memo.node.map(nodeParser) : [],
          }],
        } : null;

        const memo = result.join_info ? {
          title: result.level.memo_title || '考级内容',
          mediaList: [{
            node: result.level.memo && result.level.memo.node
              ? result.level.memo.node.map(nodeParser) : [],
          }],
        } : null;

        // 当前页面链接，生成的重定向信息
        const redirectStrToCurrentPage = yield select(
          (state) => state.browser.redirectStrToCurrentPage,
        );

        // 底部栏数据
        const submitBar = {
          // 分享
          share: {
            // 入口文案
            label: '分享',
          },
          // 提交订单栏
          menus: getMenuByProductDetail(
            result.product, redirectStrToCurrentPage, result.join_info, result.level.subject_id,
          ),
        };

        yield put(actions.updateState({
          isLoading: false, headerData, preMemo, memo, submitBar,
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
      // if (IS_DEBUG) {
      //   return;
      // }

      const types = [
        'getLevelDetailResult',
      ];
      yield put.resolve(actions.updateState({ isLoading: true }));
      yield put(actions.showLoading('加载中...'));
      yield all(types.map((type) => put.resolve({ type })));
      yield put(actions.hideLoading());
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    * onReachBottom(_, { select, put }) {
      // if (IS_DEBUG) {
      //   return;
      // }

      const {
        isLoading,
        subject = [],
        subjectCount,
      } = yield select((state) => state.index);

      if (isLoading || subject.length >= subjectCount) return;

      yield put(actions.showLoading('加载中...'));
      yield put.resolve({ type: 'getSubjectListResult', payload: { skip: subject.length, limit: 10 } });
      yield put(actions.hideLoading());
    },
  },
});
