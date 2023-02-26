import modelExtend from 'dva-model-extend';
import { model, Model, IShare } from '@/utils/model';
import api from 'api';
import actions from 'actions';
import { getFileExtension } from 'utils/utils';
import productFunc from 'common/product';
import { nodeParser } from '@/components/product/productMediaList';
// import testState from './testState';

const {
  getOpernDetail,
  favoriteOpern,
  getOpernShareImg,
  joinOpern,
} = api;

const freeJoin = () => ({
  type: 'fileDetail/freeJoin',
});

function getSubmitMenu(detail, redirect) {
  const {
    join_flag: joinFlag,
    price,
  } = detail;

  if (joinFlag === 'y') {
    return [];
  }

  if (price === 0) {
    return [
      {
        mode: 'blue',
        label: '免费获取',
        handler: freeJoin(),
      },
    ];
  }

  return productFunc.getDefaultMenusByProductDetail(detail, redirect);
}

export default modelExtend(model, {
  namespace: 'fileDetail',

  state: {
    joinFlag: 'n',
    headerData: {},
    trialContent: {},
    submitBar: {
      menus: [],
    },
    productTicketList: {
      list: [],
    },
    fileList: {
      list: [],
    },
    audioList: {
      list: [],
    },
  },

  reducers: {},

  effects: {
    * getOpernDetail(_, { select, put, call }) {
      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);
      const opernId = yield select((state) => state.browser.locationQuery.opern_id);
      const { head: { code, msg }, data } = yield call(getOpernDetail, {
        opern_id: opernId,
        user_id: userId,
        client_id: cid,
      });
      if (code === 200) {
        const headerData = {
          cover: data.cover_url ? data.cover_url[0] : '',
          title: data.title,
          author: data.author,
          desc: data.desc,
          price: data.price || 0,
          originalPrice: data.original_price || 0,
          viewCount: data.view_count || 0,
          showViewCount: true,
        };
        const trialContent = {
          title: data.pre_memo_title || '',
          nodeList: [
            {
              node: data.pre_memo.node && data.pre_memo.node.map(nodeParser),
            },
          ],
        };
        const fileList: any = {
          title: data.memo_title,
          nodeList: data.memo && data.memo.node && data.memo.node.length > 0
            ? [
              {
                node: data.memo.node && data.memo.node.map(nodeParser),
              },
            ] : [],
          list: data.upload_content ? [
            {
              title: data.upload_content.title,
              url: data.upload_content.url,
              downloadFlag: data.download_flag,
              extension: getFileExtension(data.upload_content.url),
            },
          ] : [],
        };
        const audioList = data.audio_download === 'y' && data.audio
          ? [{
            title: data.audio.title,
            extension: 'audio',
            url: data.audio.url,
            downloadFlag: 'y',
          }] : [];

        // 优惠券
        const productTicketList = {
          name: '',
          list: data.ticketList ? data.ticketList.map((ticket) => ({
            ticketId: ticket.ticket_id,
            name: ticket.name,
            useLimit: ticket.use_limit,
            type: ticket.ticket_type,
            discount: ticket.discount,
          })) : [],
        };

        // 当前页面链接，生成的重定向信息
        const redirectStrToCurrentPage = yield select(
          (state) => state.browser.redirectStrToCurrentPage,
        );
        const submitBar = {
          // 分享
          share: {
            // 入口文案
            label: '分享',
          },
          // 收藏
          edit: {
            // 入口文案
            label: '发帖子',
            show: data.join_flag === 'y',
            jumpInfo: {
              type: 'opern_detail',
              objectIds: {
                opern_id: opernId,
              },
            },
          },
          // 编辑
          collect: {
            // 入口文案
            label: '收藏',
            show: true,
            value: data.favorite_flag,
          },
          // 提交订单栏
          menus: getSubmitMenu(data, redirectStrToCurrentPage),
        };

        yield put(actions.updateState({
          joinFlag: data.join_flag,
          showWaterMask: data.show_watermark,
          waterMask: data.content_watermark,
          headerData,
          trialContent,
          fileList,
          audioList,
          submitBar,
          productTicketList,
          productId: data.opern_id,
          fileDetail: data,
        }));
      } else {
        yield put(actions.toastFail(msg));
        yield put(actions.jumpToExceptionPage({ message: encodeURIComponent(msg) }));
      }
    },

    * onCollectClick(_, { select, call, put }) {
      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);
      const opernId = yield select((state) => state.browser.locationQuery.opern_id);
      const { submitBar } = yield select((state) => state.fileDetail);
      const flag = submitBar.collect.value === 'y' ? 'n' : 'y';

      const { head: { code, msg } } = yield call(favoriteOpern, {
        client_id: cid,
        user_id: userId,
        opern_id: opernId,
        flag,
      });

      if (code === 200) {
        yield put(actions.updateState({
          submitBar: {
            ...submitBar,
            collect: {
              ...submitBar.collect,
              value: flag,
            },
          },
        }));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    // 分享按钮点击
    * share(_, { select, put, call }) {
      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);
      const opernId = yield select((state) => state.browser.locationQuery.opern_id);
      const { head: { code, msg }, data } = yield call(getOpernShareImg, {
        opern_id: opernId,
        client_id: cid,
        user_id: userId,
        t: Date.now(),
        hcode: 100,
      });

      if (code === 200) {
        yield put(actions.popup.showShareMenu(data.shareImg));
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    // 不需要购买, 直接获取
    * freeJoin(_, { call, select, put }) {
      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);
      const opernId = yield select((state) => state.browser.locationQuery.opern_id);
      const terminalType = yield select((state) => state.browser.terminalType);
      const mobileNumber = yield select((state) => state.user.mobileNumber);

      const { head: { code, msg }, data } = yield call(joinOpern, {
        client_id: cid,
        user_id: userId,
        opern_id: opernId,
        mobile_number: mobileNumber,
        // terminal_type: terminalType,
      });

      if (code === 200) {
        if (data.status !== 4) {
          // 需要支付，下单方式变更，刷新页面
          yield put(actions.toastFail('获取方式已变更，请重试'));
          yield put({ type: 'getOpernDetail' });
        } else {
          // 加入成功, 刷新页面
          yield put(actions.toastSucc('获取成功'));
          yield put({ type: 'getOpernDetail' });
        }
      } else {
        yield put(actions.toastFail(msg));
      }
    },

    /**
     * 用户点击右上角转发
     */
    * onShareAppMessage(_, { select }) {
      const fileDetail = yield select((state) => state.fileDetail.fileDetail);
      const { title = '', desc = '', cover_list: coverList } = fileDetail || {};
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
