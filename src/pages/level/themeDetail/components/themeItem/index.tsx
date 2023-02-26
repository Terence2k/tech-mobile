import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd-mobile';
import { WxJump } from 'components';

import styles from './index.scss';

const PASS_ICON = require('./images/passIcon.png');
const LOCK_ICON = require('./images/lockIcon.png');

const ThemeItem: React.FC<any> = (props: any) => {
  const { data, onClick } = props;

  const layout = () => (
    <div className={styles.levelItem} onClick={() => onClick({ ...data })}>
      <div className={styles.levelIcon}>
        <img src={data.levelIcon} alt="" />
      </div>
      <div className={styles.levelContent}>
        <div className={styles.levelTitle}>{data.title}</div>
        <div className="flexLayout center">
          {
            data.isPass === 'y'
            && <img src={PASS_ICON} className={styles.passIcon} alt="" />
          }
          {
            data.isOpen === 'n'
            && (
            <div className="flexLayout center">
              <img src={LOCK_ICON} className={styles.lockIcon} alt="" />
              <span className={styles.lockText}>未开启</span>
            </div>
            )
          }
          {
            (data.isOpen === 'y' && data.isBuy === 'n')
            && (
            <div className={styles.cardPrice}>
              {
                data.originalPrice > 0 && <span className={styles.cardOriginalPrice}>{`¥${data.originalPrice}`}</span>
              }
              <span className={styles.cardPriceValue}>
                { data.price > 0 && <span className={styles.cardPriceUnit}>¥</span> }
                <span>{data.price ? `${data.price}` : '免费'}</span>
              </span>
            </div>
            )
          }
          {
            (data.isPass !== 'y' && data.isBuy === 'y' && data.isOpen === 'y')
            && <div className={styles.levelBtn}>去考级</div>
          }
          <Icon type="right" size="xxs" style={{ marginRight: '4px' }} />
        </div>
      </div>
    </div>
  );
  return (
    <WxJump
      {...data.jumpInfo}
    >
      {layout()}
    </WxJump>
  );
};

ThemeItem.defaultProps = {
  data: {
    levelIcon: '',
    title: '',
    isOpen: 'n',
    isBuy: 'n',
    isPass: 'n',
    price: 0,
    originalPrice: 0,
  },
  onClick: () => {},
};

ThemeItem.propTypes = {
  data: PropTypes.shape({
    levelIcon: PropTypes.string,
    title: PropTypes.string,
    isOpen: PropTypes.oneOf(['y', 'n']),
    isBuy: PropTypes.oneOf(['y', 'n']),
    isPass: PropTypes.oneOf(['y', 'n']),
    price: PropTypes.number,
    originalPrice: PropTypes.number,
    jumpInfo: PropTypes.shape({
      webUrl: PropTypes.string,
      type: PropTypes.string,
      objectIds: PropTypes.shape({}),
    }),
  }),
  onClick: PropTypes.func,
};

export default ThemeItem;
