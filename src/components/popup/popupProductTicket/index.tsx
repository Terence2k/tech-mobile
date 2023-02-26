import React from 'react';
import PropTypes from 'prop-types';
// import { withRouter } from 'umi';
import { connect } from 'dva';
import { Tabs } from 'antd-mobile';
// import classNames from 'classnames';
// import ClipboardJS from 'clipboard';

import { Ticket, Popup } from 'components';
import actions from 'actions';

import styles from './index.scss';

const mapStateToProps = (state: any) => ({
  browser: state.browser,
});

const mapDispatchToProps = (dispatch: any) => ({
  receiveTicket: (ticketId, onSuccHandler) => {
    dispatch(actions.ticket.receiveTicket(ticketId, onSuccHandler));
  },
});

const Content: React.FC = (props: any) => {
  const {
    receivedTicketList, ticketList, receiveTicket,
  } = props;

  const tabs = [
    { title: '可领取优惠券', sub: '1' },
    { title: '已领取优惠券', sub: '2' },
  ];

  return (
    <Tabs
      tabBarActiveTextColor="#1f1f21"
      tabBarUnderlineStyle={{ borderColor: '#1f1f21' }}
      tabs={tabs}
      initialPage={0}
      renderTab={(tab) => <span>{tab.title}</span>}
    >
      <div className={styles.layout}>
        {
          [...ticketList].map((item, index) => (
            <Ticket
              key={index.toString()}
              {...item}
              used={item.isReceived}
              hasToggle
              isAction={!item.used}
              getButtonText="立即领取"
              onClickButton={() => {
                receiveTicket(item.ticketId, actions.ticket.showProductTicketList());
              }}
            />
          ))
        }
        {
          [...ticketList].length <= 0 && (
            <div className={styles.empty}>
              <div className={styles.icon} />
              <div className={styles.label}>暂时没有可领取的优惠券～</div>
            </div>
          )
        }
      </div>
      <div className={styles.layout}>
        {
          [...receivedTicketList].map((item, index) => (
            <Ticket
              key={index.toString()}
              {...item}
            />
          ))
        }
        {
          [...receivedTicketList].length <= 0 && (
            <div className={styles.empty}>
              <div className={styles.icon} />
              <div className={styles.label}>很遗憾，你暂无已领取的优惠券。可以去领券中心领取更多优惠券哦～</div>
            </div>
          )
        }
      </div>
    </Tabs>
  );
};

const Index: React.FC = (props: any) => {
  const {
    browser, visible, onClose,
  } = props;

  return (
    <Popup type="bottom" isActive={visible} onSetActive={onClose} size={{ width: browser.isMobileBrowser ? '100%' : '375px', height: 'auto' }} content={<Content {...props} />} />
  );
};

Index.defaultProps = {
  receivedTicketList: [],
  ticketList: [],
};

Index.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  receivedTicketList: PropTypes.arrayOf(PropTypes.object),
  ticketList: PropTypes.arrayOf(PropTypes.object),
  // list: PropTypes.arrayOf(PropTypes.shape({

  // })),
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
