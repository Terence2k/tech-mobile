import { IProductInfo } from '@/models/types';

/**
 * 隐藏优惠券列表
 */
const hideTicketList = () => ({ type: 'ticket/hideTicketList' });

/**
 * 显示可用优惠券弹框
 * @params productInfos 针对一组商品的可用优惠券的商品列表
 * @params showPopup 是否弹框(需要当前界面接入PopupAvailableTicket)
 * @params userTicketId 选定的优惠券
 */
const loadAvailableTicketList = (productInfos: IProductInfo[], showPopup: boolean = false,
  userTicketId: string = '') => ({
  type: 'ticket/loadAvailableTicketList',
  payload: { productInfos, showPopup, userTicketId },
});

/**
 * 显示商品相关优惠券弹框
 * @param productId 商品id (不填，默认用上一次的ID)
 */
const showProductTicketList = (productId: string = '') => ({ type: 'ticket/showProductTicketList', payload: { productId } });

/**
 * 领取优惠券
 * @param ticketId 优惠券ID
 * @param onSuccHandler 领取成功发送的事件
 */
const receiveTicket = (ticketId: string, onSuccHandler: any) => ({ type: 'ticket/receiveTicket', payload: { ticketId, onSuccHandler } });

export default {
  loadAvailableTicketList,
  showProductTicketList,
  hideTicketList,
  receiveTicket,
};
