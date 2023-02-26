import modelExtend from 'dva-model-extend';
import { model } from 'utils/model';
import api from 'api';
import actions from 'actions';

import {
  ITicket, ITicketItem, IUserTicketItem, IProductInfo,
} from './types';

const {
  getTicketInfoByProId,
  getAvailableTicketList,
  receiveTicket,
} = api;

const testState = {
// 商品相关的优惠券列表
  productTicketInfo: {
    popupVisible: false,
    productId: '',
    // 可领取
    ticketList: [{
      ticketId: '7a3e6da5fac2bee5b4a4a94072ff2b31',
      clientId: 'e0e67b6404d3d9f86e6452dc6360926e',
      name: '普通优惠券',
      scopeType: 0,
      useLimit: 0,
      type: 0,
      discount: 1,
      totalNum: 999,
      receiveNum: 6,
      receiveDateBegin: '2020-12-17T16:00:00.000Z',
      receiveDateEnd: '2021-01-31T15:59:59.000Z',
      expireType: 2,
      limitDay: 5,
      receiveLimit: 10,
      receiveWay: 0,
      receiveRule: 'normal',
      status: 1,
      deleteStatus: 0,
      createTime: '2020-12-18T03:36:45.619Z',
      updateTime: '2020-12-30T06:51:34.833Z',
      desc: {
        useLimit: '无门槛',
        discount: '￥1',
        scopeType: '全场通用',
        instruction: '适用范围：全场通用，无门槛，不可抵扣运费，仅原价购买可用',
        time: '有效期：自领取日起5天内有效',
      },
      isReceived: false,
      isToLimit: false,
    }, {
      ticketId: 'c050b35b8119771dca21a6df722f0789',
      clientId: 'e0e67b6404d3d9f86e6452dc6360926e',
      name: '再来2',
      scopeType: 0,
      useLimit: 1,
      useLimit_price: 0.01,
      type: 1,
      discount: 5,
      totalNum: 12222,
      receiveNum: 2,
      receiveDateBegin: '2020-12-24T16:00:00.000Z',
      receiveDateEnd: '2021-01-31T15:59:59.000Z',
      expireType: 2,
      limitDay: 11,
      receiveLimit: 1,
      receiveway: 0,
      receiveRule: 'normal',
      status: 1,
      deleteStatus: 0,
      createTime: '2020-12-25T06:45:58.625Z',
      updateTime: '2020-12-30T06:51:54.423Z',
      desc: {
        useLimit: '满0.01元可用',
        discount: '5折',
        scopeType: '全场通用',
        instruction: '适用范围：全场通用，满0.01元可用，不可抵扣运费，仅原价购买可用',
        time: '有效期：自领取日起11天内有效',
      },
      isReceived: false,
      isToLimit: false,
    }, {
      ticketId: '6a75a29d2986aa003e317749b22d2770',
      clientId: 'e0e67b6404d3d9f86e6452dc6360926e',
      name: '【dev】-优惠券',
      scopeType: 1,
      useLimit: 0,
      type: 1,
      discount: 2,
      totalNum: 6,
      receiveNum: 1,
      receiveDateBegin: '2021-01-03T16:00:00.000Z',
      receiveDateEnd: '2021-01-09T15:59:59.000Z',
      expireType: 2,
      limitDay: 30,
      receiveLimit: 1,
      receiveWay: 0,
      receiverule: 'normal',
      status: 1,
      deleteStatus: 0,
      createTime: '2021-01-04T04:24:05.231Z',
      updateTime: '2021-01-04T06:08:17.111Z',
      desc: {
        useLimit: '无门槛',
        discount: '2折',
        scopeType: '仅限部分指定商品',
        instruction: '适用范围：仅限部分指定商品，无门槛，不可抵扣运费，仅原价购买可用',
        time: '有效期：自领取日起30天内有效',
      },
      isToLimit: true,
      isReceived: true,
    }],
    // 已领取
    receivedTicketList: [{
      ticketId: '6a75a29d2986aa003e317749b22d2770',
      clientId: 'e0e67b6404d3d9f86e6452dc6360926e',
      userId: '4a5ffa337cfe5136e543f7f94b2e18d2',
      userTicketId: '31ce029bb10c3b69069c51b8c6f1bcaa',
      name: '【dev】-优惠券',
      scopeType: 1,
      useLimit: 0,
      type: 1,
      discount: 2,
      totalNum: 6,
      receiveNum: 1,
      receiveDateBegin: '2021-01-03T16:00:00.000Z',
      receiveDateEnd: '2021-01-09T15:59:59.000Z',
      expireType: 2,
      limitDay: 30,
      receiveLimit: 1,
      receiveWay: 0,
      receiveRule: 'normal',
      status: 1,
      deleteStatus: 0,
      createTime: '2021-01-04T04:24:05.231Z',
      updateTime: '2021-01-04T06:08:17.111Z',
      desc: {
        useLimit: '无门槛',
        discount: '2折',
        scopeType: '仅限部分指定商品',
        instruction: '适用范围：仅限部分指定商品，无门槛，不可抵扣运费，仅原价购买可用',
        time: '有效期：自领取日起30天内有效',
      },
      isToLimit: true,
      isReceived: true,
    }],
  },

  // 选择优惠券（已经领取的）
  availableTicketInfo: {
    popupVisible: false,
    // 当前选择
    value: '2ce2f60069013b106a717b1800034ca6',
    // 列表
    list: [{
      clientId: 'e0e67b6404d3d9f86e6452dc6360926e',
      ticketId: '2ce2f60069013b106a717b1800034ca6',
      userId: '4a5ffa337cfe5136e543f7f94b2e18d2',
      userTicketId: '31ce029bb10c3b69069c51b8c6f1bcaa',
      status: 1,
      receiveType: 'user',
      receiveTime: '2021-01-04T06:22:50.681Z',
      useBeginTime: '2021-01-04T06:22:50.681Z',
      useEndTime: '2021-02-03T06:22:50.681Z',
      name: '【dev】-实体优惠券',
      scopeType: 1,
      productList: [
        'c3500f6d0f1f61f6ca15db97057e60b6',
        '7a7134ef179ef66f7496ad45ae4c3d77',
      ],
      useLimit: 1,
      useLimitPrice: 0,
      type: 1,
      discount: 7,
      totalNum: 6,
      receiveNum: 1,
      receiveDateBegin: '2021-01-03T16:00:00.000Z',
      receiveDateEnd: '2021-01-09T15:59:59.000Z',
      expireType: 2,
      limitDay: 30,
      receiveLimit: 1,
      receiveWay: 0,
      receiveRule: 'normal',
      deleteStatus: 0,
      createTime: '2021-01-04T06:17:33.983Z',
      updateTime: '2021-01-04T06:22:50.683Z',
      desc: {
        useLimit: '满0元可用',
        discount: '7折',
        scopeType: '仅限部分指定商品',
        instruction: '适用范围：仅限部分指定商品，满0元可用，不可抵扣运费，仅原价购买可用',
        time: '有效期：2021.01.04-2021.02.03',
      },
      isToLimit: true,
      isReceived: true,
    }],
  },
};

const convertTicketObj = (t) => ({
  ticketId: t.ticket_id,
  clientId: t.client_id,
  name: t.name,
  scopeType: t.scopt_type,
  useLimit: t.use_limit,
  type: t.type,
  discount: t.discount,
  totalNum: t.totalNum,
  receiveNum: t.receiveNum,
  receiveDateBegin: t.receiveDate_begin,
  receiveDateEnd: t.receiveDate_end,
  expireType: t.expireType,
  limitDay: t.limitData,
  receiveLimit: t.receive_limit,
  receiveWay: t.receive_way,
  receiveRule: t.receive_rule,
  status: t.status,
  deleteStatus: t.delete_status,
  createTime: t.create_time,
  updateTime: t.update_time,
  productList: t.product_list,
  desc: {
    useLimit: t.desc.use_limit,
    discount: t.desc.discount,
    scopeType: t.desc.scope_type,
    instruction: t.desc.instruction,
    time: t.desc.time,
  },
  isToLimit: t.isToLimit,
  isReceived: t.isReceived,
}) as ITicketItem;

export const convertUserTicketObj = (t) => ({
  ...convertTicketObj(t),
  userId: t.user_id,
  userTicketId: t.user_ticket_id,
}) as IUserTicketItem;

export default modelExtend(model, {
  namespace: 'ticket',
  state: testState as ITicket,

  reducers: {
    /**
     * 隐藏优惠券列表
     */
    hideTicketList(state) {
      return {
        ...state,
        productTicketInfo: {
          ...state.productTicketInfo,
          popupVisible: false,
        },
        availableTicketInfo: {
          ...state.availableTicketInfo,
          popupVisible: false,
        },
      };
    },
  },

  effects: {
    /**
     * 加载可用优惠券弹框
     */
    * loadAvailableTicketList({ payload: { productInfos, showPopup, userTicketId } },
      { call, select, put }) {
      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);
      const { data: { ticketList: availableTicketInfo } } = yield call(getAvailableTicketList, {
        user_id: userId,
        client_id: cid,
        product_infos: productInfos.map((info: IProductInfo) => ({
          product_id: info.productId,
          buy_num: info.num,
          param_detail_id: info.paramDetailId,
        })),
      });

      yield put(actions.updateState({
        availableTicketInfo: {
          popupVisible: showPopup,
          // 当前选择
          value: userTicketId,
          // 列表
          list: availableTicketInfo.map((t) => convertUserTicketObj(t)),
        },
      }));
    },

    /**
     * 显示商品相关优惠券弹框
     */
    * showProductTicketList({ payload: { productId: pid } }, { call, select, put }) {
      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);

      let productId = pid;
      if (!pid) {
        productId = yield select((state) => state.ticket.productTicketInfo.productId);
      }

      const { data: ticketInfo } = yield call(getTicketInfoByProId, {
        client_id: cid,
        user_id: userId,
        product_id: productId,
      });

      yield put(actions.updateState({
        productTicketInfo: {
          popupVisible: true,
          productId,
          // 可领取
          ticketList: ticketInfo.ticketList.map((t) => convertTicketObj(t)),
          // 已领取
          receivedTicketList: ticketInfo.receivedTicketList.map((t) => convertUserTicketObj(t)),
        },
      }));
    },

    * receiveTicket({ payload: { ticketId, onSuccHandler } }, { call, select, put }) {
      const cid = yield select((state) => state.client.cid);
      const userId = yield select((state) => state.user.userId);

      const { head: { code, msg } } = yield call(receiveTicket, {
        user_id: userId,
        client_id: cid,
        ticket_id: ticketId,
      });

      if (code === 200) {
        yield put(actions.toastSucc(msg));
        if (onSuccHandler) {
          yield put(onSuccHandler);
        }
      } else {
        yield put(actions.toastFail(msg));
      }
    },
  },

  subscriptions: {
  },
});
