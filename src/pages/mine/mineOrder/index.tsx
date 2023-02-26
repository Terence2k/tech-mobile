import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import actions from 'actions';
import { usePage } from 'hooks';

// 导入公用组件
import {
  OrderPanel,
  ProductTabs,
} from 'components';

import { namespace } from './model';

const mapStateToProps = (state: any) => ({
  state: state[namespace],
});

const mapDispatchToProps = (dispatch: any) => ({
  jumpToPage: (path: string, params: object = {}) => {
    dispatch(actions.jumpToPage(path, params));
  },
  updateState: (payload) => dispatch(actions.updateState(payload)),
  onLoad: () => dispatch(actions.onLoad({ namespace })),
  onReachBottom: () => dispatch(actions.onReachBottom({ namespace })),
  pay: (orderId) => dispatch({ type: `${namespace}/pay`, payload: { orderId } }),
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace })),
});

type IProp = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Page: React.FunctionComponent<any> = (props: any) => {
  const {
    // models
    state,
    // action methods
    jumpToPage,
    updateState,
    onLoad,
    onReachBottom,
    onShareAppMessage,
    pay,
  }: IProp = props;

  usePage({ onReachBottom, onShareAppMessage });

  useEffect(() => {
    onLoad();
  }, [onLoad, state.status]);

  const [tabActive, setTabActive] = useState(0);

  const tabArr = [{
    title: '全部',
    type: -1,
  }, {
    title: '待付款',
    type: 0,
  }, {
    title: '待发货',
    type: 1,
  }, {
    title: '已发货',
    type: 2,
  }, {
    title: '已完成',
    type: 4,
  }];

  return (
    <div style={{ paddingBottom: '100px' }}>
      <ProductTabs
        tabArr={tabArr}
        activeTab={tabActive}
        onTabChange={(i) => {
          setTabActive(i);
          updateState({
            namespace,
            payload: { status: tabArr[i].type, orderList: [], noMore: false },
          });
        }}
      />
      {
        state.orderList && state.orderList.map((item, index) => (
          <div
            key={index.toString()}
            style={{ marginTop: '10px' }}
            onClick={() => {
              if (item.status === 0) {
                // 去支付
                pay(item.orderId);
                return;
              }
              jumpToPage('/mine/orderDetail', { orderId: item.orderId });
            }}
          >
            <OrderPanel orderItem={item} />
          </div>
        ))
      }
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
