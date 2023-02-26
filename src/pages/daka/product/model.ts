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

export const namespace = 'daka';

const {
  getDakaDetail,
  joinDaka,
} = api;

// const isDevelopment = process.env.NODE_ENV === 'development';

const statusConvert = (status) => {
  let text = '';
  if (status === 'wait') {
    text = 'wait';
  } else if (status === 'valid') {
    text = 'doing';
  } else if (status === 'expired') {
    text = 'done';
  }
  return text;
};
const statusformat = (status) => {
  let text = '';
  if (status === 'wait') {
    text = '未开始';
  } else if (status === 'valid') {
    text = '进行中';
  } else if (status === 'expired') {
    text = '已结束';
  }
  return text;
};

const statusStyle = (status) => {
  let backgroundColor: string = '';
  if (status === 'wait') {
    backgroundColor = 'rgb(132, 157, 191)';
  } else if (status === 'valid') {
    backgroundColor = 'rgb(65, 93, 150)';
  } else if (status === 'expired') {
    backgroundColor = 'rgb(204, 204, 204)';
  }
  return backgroundColor;
};

/**
 * 底部按钮数据的计算函数
 * @param detail 打卡详情
 * @param redirect 当前页面的可重定向路径，方便购买过程传递
 */
function getMenuByProductDetail(detail, redirect, isTeacher) {
  const {
    my_membercard_list: myMemberCardList = [],
    join_flag: joinFlag,
    price,
  } = detail;

  // 免费加入
  const freeJoin = (mcuId = '') => ({
    type: `${namespace}/freeJoin`,
    payload: {
      mcuId,
    },
  });

  // 0 已经拥有
  if (joinFlag === 'y') {
    return [];
  }

  // 1 未拥有 - 可免费获取 / 或作为老师免费获取
  // 1.1 本身免费
  if (price === 0 || isTeacher) {
    return [{
      type: 'default', label: isTeacher ? '参加打卡' : '免费获取', mode: 'blue', handler: freeJoin(),
    }];
  }

  // 1.2 拥有会员卡所以免费
  const myFreeCard = myMemberCardList.find((card) => card.expire_time > Date.now() && card.free_flag === 'y');
  if (myFreeCard) {
    return [{
      type: 'membercard', label: '会员免费参加', mode: 'black', handler: freeJoin(myFreeCard.mcu_id),
    }];
  }

  // 通用的付费处理
  return productFunc.getDefaultMenusByProductDetail(detail, redirect);
}

const IS_DEBUG = false;
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
  productTitle: '打卡主题标题',

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
    list: ['参数人数 {join_count}', '打卡次数 {total_count}'],
  },

  // components/tag（通用）
  tag: {
    status: 'doing', // ['wait', 'doing', 'done']
    text: '进行中',
  },

  // components/productDaterangeFormat（通用）
  productDaterangeFormat: {
    startTime: 1608541935906,
    endTime: 1608628335906,
    // 可选
    // startFormat: 'YYYY-MM-DD',
    // endFormat: 'YYYY-MM-DD',
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
      label: '参加打卡',
    }],
  },

  // components/productMediaList 图文区块（通用）
  productMediaList: {
    name: '打卡简介',
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
  dataDetail: {},
};

export default modelExtend(model, {
  namespace,

  state: IS_DEBUG ? testState : { isLoading: true },

  reducers: {

  },

  effects: {
    /**
     * 不需要购买, 直接获取
     */
    * freeJoin({ payload: { mcuId } }, { call, select, put }) {
      const { subject_id: subjectId = '' } = yield select((state) => state.browser.locationQuery);
      const terminalType = yield select((state) => state.browser.terminalType);
      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);
      const mobileNumber = yield select((state) => state.user.mobileNumber);

      const { head: { code, msg }, data } = yield call(joinDaka, {
        subject_id: subjectId,
        client_id: cid,
        mobile_number: mobileNumber,
        user_id: userId,
        type: mcuId ? 'membercard' : 'free',
        mcu_id: mcuId,
        // terminal_type: terminalType,
      });

      if (code === 200 || code === 453 || code === 503) {
        if (data.status && data.status !== 4) {
          // 需要支付，下单方式变更，刷新页面
          yield put({ type: 'popup/toastFail', payload: { msg: '获取方式已变更，请重试' } });
          yield put({ type: 'onLoad' });
        } else {
          // 加入成功, 跳到打卡列表
          yield put(actions.toastSucc('获取成功'));
          yield put(actions.browser.jumpToPage('/daka/list'));
        }
      } else {
        yield put({ type: 'popup/toastFail', payload: { msg } });
      }
    },

    /**
     * 72.4 获取打卡主题详情 getDakaDetail
     * @see https://showdoc.beautifulreading.com/web/#/7?page_id=1949
     */
    * getDakaDetailResult(_, { select, call, put }) {
      yield put.resolve(actions.updateState({ isLoading: true }));

      const { subject_id: subjectId = '' } = yield select((state) => state.browser.locationQuery);
      const isTeacher = yield select((state) => state.user.isTeacher);

      const { head: { code, msg }, data } = yield call(getDakaDetail, {
        subject_id: subjectId,
      });

      if (code === 200) {
        const result = { ...data };
        const { join_flag: joinFlag = 'n', subject = {} } = result;

        // banner
        const banner = subject.image ? [{ type: 'image', url: subject.image }] : null;

        // title
        const productTitle = subject.title || '';

        // price
        const productPrice = {
          price: subject.price,
          originalPrice: subject.original_price,
          free: subject.price && subject.price <= 0,
        };

        // stat
        const countStat = {
          list: [`参加人数 ${subject.join_count || 0}`, `打卡次数 ${subject.total_count || 0}`],
        };

        // tag
        const tag = {
          status: statusConvert(subject.status),
          text: statusformat(subject.status),
          backgroundColor: statusStyle(subject.status),
        };

        // date range
        const productDaterangeFormat = {
          startTime: subject.start_time,
          endTime: subject.end_time,
          // 可选
          startFormat: 'YYYY.MM.DD',
          endFormat: 'YYYY.MM.DD',
        };

        // 页面优惠券信息
        const productTicketList = joinFlag === 'n' ? {
          name: '',
          list: data.ticketList.map((ticket) => ({
            ticketId: ticket.ticket_id,
            name: ticket.name,
            useLimit: ticket.use_limit,
            type: ticket.type,
            discount: ticket.discount,
          })),
        } : null;

        // memo
        const productMediaList = {
          name: '打卡简介',
          list: [{
            node: subject.memo ? subject.memo.node.map(nodeParser) : [],
          }],
        };

        // components/productSubmitBar（通用）
        // 注意：mode字段确定menu的主题样式；label为当前menu文案；可添加其它字段供点击回调使用（比如使用会员卡的标识type: 'membercard'）。
        const productSubmitBar = joinFlag === 'n' ? {
          // 是否禁用状态
          disabled: subject.status === 'expired',
          // disabled为true时需要
          disabledText: '活动已结束',
          // 分享
          share: {
            // 入口文案
            label: '分享',
          },
          // 提交订单栏
          menus: getMenuByProductDetail({ ...subject, product_id: data.product.product_id }, '/daka/list', isTeacher),
        } : null;

        yield put(actions.updateState({
          isLoading: false,
          productId: data.product.product_id,
          banner,
          productTitle,
          productPrice,
          countStat,
          tag,
          productDaterangeFormat,
          productTicketList,
          productMediaList,
          productSubmitBar,
          sharePicUrl: subject.share_image || '',
          dakaDetail: data,
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

      const types = [
        'getDakaDetailResult',
      ];
      yield put(actions.showLoading('加载中...'));
      yield all(types.map((type) => put({ type })));
      yield put(actions.hideLoading());
    },

    /**
     * 用户点击右上角转发
     */
    * onShareAppMessage(_, { select }) {
      const dakaDetail = yield select((state) => state[namespace].dakaDetail);
      const { title = '', image = '' } = dakaDetail ? dakaDetail.subject : {};

      const options: IShare = {
        title,
        link: window.location.href,
        imgUrl: image,
      };

      return options;
    },
  },
} as Model);
