import React from 'react';
import PropTypes from 'prop-types';
import { WxJump } from '@/components';

import styles from './index.scss';

const Index: React.FC = (props: any) => {
  const { list } = props;

  return (
    <div className={styles.layout}>
      {
        [...list].map((item, index) => (
          <WxJump
            {...item.jumpInfo}
            key={index.toString()}
          >
            <div>
              <img className={styles.icon} src={item.coverUrl[0]} alt="" />
              <div className={styles.name}>{item.productName}</div>
              <div className={styles.priceLayout}>
                <div className={styles.price}>
                  <div className={styles.tag}>￥</div>
                  <div className={styles.price}>{item.price}</div>
                </div>
                {
                    item.originalPrice > 0 && (
                      <div className={styles.originalPrice}>
                        <div>￥</div>
                        <div>{item.originalPrice}</div>
                      </div>
                    )
                  }
              </div>
            </div>
          </WxJump>
        ))
      }
    </div>
  );
};

Index.defaultProps = {
};

Index.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({
    // 封面
    coverUrl: PropTypes.arrayOf(PropTypes.string),
    // 划线价
    originalPrice: PropTypes.number,
    // 正价
    price: PropTypes.number,
    // 商品id
    productId: PropTypes.string,
    // 商品名称
    productName: PropTypes.string,
    // 小程序路径
    url: PropTypes.string,
    // 跳转信息
    jumpInfo: PropTypes.shape({
      type: PropTypes.string,
      objectIds: PropTypes.shape({}),
      webUrl: PropTypes.string,
    }).isRequired,
  })).isRequired,
};

export default Index;
