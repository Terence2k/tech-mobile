import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';
// import { IProps } from './types';

const Index: React.FC = (props: any) => {
  const {
    style,
    price,
    originalPrice,
    free,
  } = props;
  return (
    <>
      {/*  */}
      <div className={styles.priceLayout} style={style}>
        {
          price > 0 && (
            <div className={styles.price}>
              <div className={styles.tag}>￥</div>
              <div className={styles.value}>{price}</div>
            </div>
          )
        }
        {
          price > 0 && originalPrice > 0 && (
            <div className={styles.originalPrice}>
              <div>￥</div>
              <div>{originalPrice}</div>
            </div>
          )
        }
        {(price <= 0 || free) && (<div className={styles.free}>免费</div>)}
      </div>
    </>
  );
};

Index.defaultProps = {
  style: {},
  price: 0.00,
  originalPrice: 0.00,
  free: false,
};

Index.propTypes = {
  style: PropTypes.objectOf(PropTypes.string),
  // 价格
  price: PropTypes.number,
  // 划线格
  originalPrice: PropTypes.number,
  // 免费
  free: PropTypes.bool,
};

export default Index;
