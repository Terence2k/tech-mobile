import React from 'react';
import { connect } from 'dva';

import { Tabs } from 'antd-mobile';

import { Ticket } from 'components';
import { IBrowser } from '@/models/types';
import actions from 'actions';
import { usePage } from 'hooks';

import styles from './index.scss';

const mapStateToProps = (state: any) => ({
  myTickets: state.myTickets,
  browser: state.browser as IBrowser,
});

const mapDispatchToProps = (dispatch: any) => ({
  onTabChange: (currentTab) => {
    dispatch({ type: 'myTickets/onTabChange', payload: { currentTab } });
  },
  jumpToPage: (path: string, params: object = {}) => {
    dispatch(actions.jumpToPage(path, params));
  },
  getMyTicketList: () => {
    dispatch({ type: 'myTickets/getMyTicketList' });
  },
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace: 'myTickets' })),
});

type IProp = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const Page: React.FC = (props: any) => {
  const {
    myTickets, onTabChange, browser, jumpToPage, getMyTicketList, onShareAppMessage,
  }: IProp = props;
  const {
    currentTab, tabs, ticketList,
  } = myTickets;

  React.useEffect(() => {
    getMyTicketList();
  }, [getMyTicketList]);

  usePage({ onShareAppMessage });

  return (
    <div className={styles.layout}>
      <div
        className={styles.fixedTab}
        style={!browser.isMobileBrowser ? {
          width: '375px',
          left: 'calc(50% - 187.5px)',
        } : {}}
      >
        <Tabs
          tabs={tabs}
          onChange={(tab) => { onTabChange(tab.key); }}
        />
      </div>
      <div style={{ padding: '55px 15px' }}>
        {
          currentTab === '1' && ticketList.map((item, index) => (
            <Ticket
              key={index.toString()}
              {...item}
              used={false}
              hasToggle
              isAction={false}
            />
          ))
        }
        {
          currentTab === '2' && ticketList.map((item, index) => (
            <Ticket
              key={index.toString()}
              {...item}
              hasToggle
              used={false}
              isAction={false}
              disabled
            />
          ))
        }
        {
          (!ticketList || ticketList.length === 0)
          && (
            <div className={styles.noData}>暂无优惠券</div>
          )
        }
      </div>
      <div className={styles.getBtn} onClick={() => { jumpToPage('/ticketsCenter'); }}>领取更多优惠券</div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
