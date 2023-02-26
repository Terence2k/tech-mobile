/**
 * 创建订单
 * @param orderInfo 订单对象
 * mcuId = '', total = 0, userTicketId = '', mobileNumber, remark = '',
 * joinFunc = null, extraParams = {}
 */
const createOrder = ({
  orderInfo: {
    mcuId = '', total = 0, userTicketId = '', mobileNumber, remark = '',
    joinFunc = null, extraParams = {},
  },
}) => ({
  type: 'order/createOrder',
  payload: {
    mcuId, total, userTicketId, mobileNumber, remark, joinFunc, extraParams,
  },
});

/**
 * 支付
 * @param cid
 * @param userId
 * @param orderId
 */
const wxPay = (cid: string, userId: string, orderId: string) => ({ type: 'order/wxPay', payload: { cid, userId, orderId } });

export default {
  createOrder,
  wxPay,
};
