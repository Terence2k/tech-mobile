import React from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import { InputItem } from 'antd-mobile';
import actions from 'actions';
import { usePage } from 'hooks';
import { IBrowser, ITicket } from '@/models/types';
// import { Link } from 'umi';
// import { formatMessage } from 'umi-plugin-locale';

// 全局组件
import {
  ProductSubmitBar,
  PopupAvailableTicket,
} from 'components';
// //
// import {
//   MemberCard,
//   IconNavigationList,
// } from './components';
// //
import styles from './index.scss';

const mapStateToProps = (state: any) => ({
  browser: state.browser as IBrowser,
  ticket: state.ticket as ITicket,
  orderPreview: state.orderPreview,
});

const mapDispatchToProps = (dispatch: any) => ({
  getPreviewData: () => {
    dispatch({ type: 'orderPreview/getPreviewData' });
  },
  updateRemark: (remark) => {
    dispatch({ type: 'orderPreview/updateRemark', payload: { remark } });
  },
  pay: () => {
    dispatch({ type: 'orderPreview/pay' });
  },
  loadAvailableTicketList: (productInfos, showPopup, userTicketId) => {
    dispatch(actions.ticket.loadAvailableTicketList(productInfos, showPopup, userTicketId));
  },
  hideTicketList: () => dispatch(actions.ticket.hideTicketList()),
  selectUserTicket: (userTicketId) => dispatch({ type: 'orderPreview/selectUserTicket', payload: { userTicketId } }),
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace: 'orderPreview' })),
});

type IProp = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Page: React.FC = (props: any) => {
  const inputRef = React.useRef(null) || { current: {} };
  const {
    browser,
    ticket,
    orderPreview,
    getPreviewData,
    updateRemark,
    loadAvailableTicketList,
    hideTicketList,
    selectUserTicket,
    pay,
    onShareAppMessage,
  }: IProp = props;

  React.useEffect(() => {
    getPreviewData();
  }, [getPreviewData]);

  usePage({ onShareAppMessage });

  if (orderPreview.isLoading) {
    return (<div />);
  }

  return (
    <div className={classNames('pageLayout', styles.layout)}>
      <div className="pageLayout__scrollLayout">
        <div className={styles.mobileLayout}>
          {orderPreview.mobileNumber}
        </div>
        <div className={styles.infoLyout}>
          {
            [...orderPreview.products].map((item, index) => (
              <div className={styles.product} key={index.toString()}>
                <div className={styles.product__hd}>
                  <img className={styles.icon} src={item.icon} alt="" />
                </div>
                <div className={styles.product__bd}>
                  <div className={styles.title}>{item.title}</div>
                  {/* <div className={styles.desc}>{item.desc}</div> */}
                  <div className={styles.num}>
                    ￥
                    {item.price}
                    {' '}
                    x
                    {item.count}
                  </div>
                </div>
              </div>
            ))
          }
          {
            // 没有选定会员卡, 显示优惠券的选择
            !orderPreview.mcuId && (
              <div
                className={styles.ticket}
                onClick={() => {
                  loadAvailableTicketList(
                    JSON.parse(decodeURIComponent(browser.locationQuery.product_list)),
                    true,
                    orderPreview.userTicketId,
                  );
                }}
              >
                <div>优惠券</div>
                <div className={styles.ticket__right}>
                  <div className={styles.ticket__right__text}>
                    {orderPreview.ticketText}
                  </div>
                  <div className={styles.jiantou} />
                </div>
              </div>
            )
          }
          {
            // 会员卡
            orderPreview.mcuId && (
              <div
                className={styles.membercard}
              >
                <div>会员卡</div>
                <div className={styles.membercard__right}>
                  <div className={styles.membercard__right__text}>
                    {orderPreview.mcuText}
                  </div>
                </div>
              </div>
            )
          }
          <div className={styles.cells}>
            <div className={styles.cell}>
              <div>商品总价</div>
              <div>
                {orderPreview.money ? `￥${orderPreview.money}` : 0}
              </div>
            </div>
            <div className={styles.cell}>
              <div>运费</div>
              <div>
                {orderPreview.fee ? `￥${orderPreview.fee}` : 0}
              </div>
            </div>
            <div className={styles.cell}>
              <div>优惠</div>
              <div>
                {orderPreview.discount ? `￥${orderPreview.discount}` : 0}
              </div>
            </div>
            <div className={styles.cell}>
              <div style={{ fontSize: '16px', fontWeight: 400, color: '#1F1F21' }}>应付款（含运费）</div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#D02224' }}>
                ￥
                {orderPreview.total}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.remarkLayout}>
          <InputItem
            className="text-align-right"
            value={orderPreview.remark}
            placeholder="点击填写备注(选填)"
            onChange={(res) => updateRemark(res)}
            ref={inputRef}
          >
            <div
              className={styles.title}
              // @ts-ignore
              onClick={() => inputRef.current.focus()}
            >
              备注
            </div>
          </InputItem>
        </div>
      </div>
      <div className={classNames('pageLayout__bottomLayout', {
        pc: !browser.isMobileBrowser,
      })}
      >
        <ProductSubmitBar>
          <div
            className={styles.submitBarLayout}
            onClick={() => {
              pay();
            }}
          >
            去支付
          </div>
        </ProductSubmitBar>
      </div>
      <PopupAvailableTicket
        visible={ticket.availableTicketInfo.popupVisible}
        value={orderPreview.userTicketId}
        list={ticket.availableTicketInfo.list}
        onSelect={(res) => {
          selectUserTicket(res.userTicketId);
        }}
        onClose={() => hideTicketList()}
      />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
