import React, { FC } from 'react';
import { Flex } from 'antd-mobile';
import { connect } from 'dva';
import classNames from 'classnames';
import actions from 'actions';
import { TState } from '@/models/types';
import { usePage } from 'hooks';

import moment from 'moment';

import {
  OrderProduct,
} from 'components';
import styles from './index.scss';

const mapStateToProps = (state: TState) => ({
  browser: state.browser,
  order: state.mineOrderDetail.order,
});

const mapDispatchToProps = (dispatch: any) => ({
  getOrder: () => {
    dispatch({ type: 'mineOrderDetail/getOrder' });
  },
  jumpToPage: (path: string, params: object = {}) => {
    dispatch(actions.jumpToPage(path, params));
  },
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace: 'mineOrderDetail' })),
});

/**
 * 头部组件：购买成功
 * @param props
 */
const SuccessHeader: FC = (props: any) => {
  const { browser, onShareAppMessage } = props;

  usePage({ onShareAppMessage });

  return (
    <Flex className={classNames(styles.successHeader, {
      [styles.pc]: !browser.isMobileBrowser,
    })}
    >
      <Flex.Item>
        <p className={styles.successTitle}>购买成功了！</p>
        <p className={styles.successTips}>前往「我的课程」开始学习吧</p>
      </Flex.Item>
      <Flex justify="center" className={styles.successBtn}>
        查看课程
      </Flex>
    </Flex>
  );
};

type IProp = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const Page: FC = (props: any) => {
  const {
    order: {
      products = [], money, discount, total, order_id: orderId, payText, createtime, telNumber,
    },
    getOrder,
    jumpToPage,
  }: IProp = props;
  React.useEffect(() => {
    getOrder();
  }, [getOrder]);
  return (
    <div>
      {
        products[0].productType === 4
        && (
          <div onClick={() => {
            jumpToPage('/course/product', { course_id: products[0].productId });
          }}
          >
            <SuccessHeader {...props} />
          </div>
        )
      }
      {
        products[0].productType !== 4
        && (
          <div className={styles.telBlock}>
            联系方式：
            {telNumber}
          </div>
        )
      }
      <div className={styles.productInfo}>
        <OrderProduct {...products[0]} />
        <div className={styles.line} />
        <Flex justify="between" className={styles.productInfoItem}>
          <p>商品总价</p>
          <p>
            ¥
            {money}
          </p>
        </Flex>
        <Flex justify="between" className={styles.productInfoItem}>
          <p>优惠</p>
          <p>
            ¥
            {discount}
          </p>
        </Flex>
        <Flex justify="between" className={styles.productPay}>
          <p style={{ fontSize: '16px', color: '#1F1F21' }}>应付款（含运费）</p>
          <p style={{ fontSize: '18px', color: '#D02224' }}>
            ¥
            {total}
          </p>
        </Flex>
      </div>
      <div className={styles.orderInfo}>
        <div className={styles.orderInfoItem}>
          订单号:
          {' '}
          {orderId}
        </div>
        <div className={styles.orderInfoItem}>
          交易时间:
          {' '}
          {moment(createtime).format('YYYY-MM-DD HH:mm:SS')}
        </div>
        <div className={styles.orderInfoItem}>
          支付方式: 微信支付
        </div>
        <div className={styles.orderInfoItem}>
          支付状态:
          {' '}
          {payText}
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
