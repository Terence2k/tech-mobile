import React from 'react';
import { connect } from 'dva';

import { Ticket } from 'components';
import actions from 'actions';
import { usePage } from 'hooks';

const mapStateToProps = (state: any) => ({
  ticketsCenter: state.ticketsCenter,
});

const mapDispatchToProps = (dispatch: any) => ({
  getMyTicketList: () => {
    dispatch({ type: 'ticketsCenter/getMyTicketList' });
  },
  receiveTicket: (ticketId, onSuccHandler) => {
    dispatch(actions.ticket.receiveTicket(ticketId, onSuccHandler));
  },
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace: 'ticketsCenter' })),
});

type IProp = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const Page: React.FC = (props: any) => {
  const {
    ticketsCenter, getMyTicketList, receiveTicket, onShareAppMessage,
  }: IProp = props;
  const {
    ticketList,
  } = ticketsCenter;

  React.useEffect(() => {
    getMyTicketList();
  }, [getMyTicketList]);

  usePage({ onShareAppMessage });

  return (
    <div style={{ padding: '15px' }}>
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
              receiveTicket(item.ticketId, getMyTicketList());
            }}
          />
        ))
      }
      {
        (!ticketList || ticketList.length === 0)
        && (
          <div style={{
            lineHeight: '120px',
            fontSize: '16px',
            textAlign: 'center',
            height: 'calc(100vh - 110px)',
          }}
          >
            暂无优惠券
          </div>
        )
      }
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
