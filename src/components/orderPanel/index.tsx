import React, { FC } from 'react';
import { Flex } from 'antd-mobile';
import styles from './index.scss';

// 导入商品组件
import OrderProduct from '../orderProduct';

// type product = {
//   coverUrl: string[],
//   productName: string,
//   price: number,
//   num: number,
// }

// type orderItem = {
//   orderId: string,
//   fee: number,
//   statusText: string,
//   products: product[],
// }

// interface IProps {
//   orderItem: orderItem,
// }

/**
 * 订单panel的头部
 * @param props
 * @param props.order_id 订单id
 * @param props.statusText 订单状态
 *
 * @returns 组件
 */
function OrderHeader(props: any) {
  const { orderId, statusText } = props;
  return (
    <Flex className={styles.header}>
      <Flex.Item className={styles.headerText}>
        订单：
        {orderId}
      </Flex.Item>
      <p>{statusText}</p>
    </Flex>
  );
}
/**
 * 订单panel的底部
 * @param props
 * @param props.fee 支付金额
 *
 * @returns 组件
 */
function OrderFooter(props: any) {
  const {
    status, type, productNum, products, total,
  } = props;
  return (
    <Flex justify="between" className={styles.footer}>
      <Flex.Item>
        {
          status === 0 && (
            <div className={styles.buttonPay}>去支付</div>
          )
        }
      </Flex.Item>
      <Flex.Item style={{ textAlign: 'right' }}>
        共
        {
          type === 3 && `${productNum}件(含邮费)`
        }
        {
          type !== 3 && products && products.length
        }
        {' 合计'}
        <span>
          ¥
          {total || '0.00'}
        </span>
      </Flex.Item>
    </Flex>
  );
}

const Index: FC<any> = (props: any) => {
  const {
    orderItem,
  } = props;
  return (
    <div className={styles.orderPanel}>
      <OrderHeader {...{ orderId: orderItem.orderId, statusText: orderItem.statusText }} />
      {
        orderItem.products && orderItem.products.map((item, index) => (
          <OrderProduct key={index.toString()} {...item} />
        ))
      }
      <OrderFooter {...orderItem} />
    </div>
  );
};

export default Index;
