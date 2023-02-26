import React, { FC } from 'react';
import { Flex } from 'antd-mobile';

import styles from './index.scss';

interface IProps {
  coverUrl: string[],
  productName: string,
  price: number,
  num: number,
  subTitle: string
}

const Index: FC<IProps> = (props: IProps) => {
  const {
    coverUrl, productName, price, num, subTitle = '',
  } = props;
  return (
    <Flex className={styles.productCon}>
      {coverUrl && <img src={coverUrl[0]} className={styles.productImg} alt="" />}
      <Flex.Item>
        <Flex className={styles.productInfo} direction="column" justify="between" align="start">
          <p style={{ color: 'rgba(0,0,0,.65' }}>{productName}</p>
          {subTitle && <p style={{ color: 'rgba(0,0,0,.65' }}>{subTitle}</p>}
          <p style={{ color: '#1F1F21' }}>
            ¥
            {price}
            {' '}
            <span style={{ color: 'rgba(0,0,0,.45' }}>
              X
              {num}
            </span>
          </p>
        </Flex>
      </Flex.Item>
    </Flex>
  );
};

export default Index;
