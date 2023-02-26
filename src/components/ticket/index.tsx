import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './index.scss';

const Index: React.FC = (props: any) => {
  const [toggle, settoggle] = React.useState(false);
  const {
    style, size, select, receiveWay, used, disabled, notUsedDisabled, isAction, desc, type,
    discount, name, descStyles, hasToggle, getButtonText, onClick, onClickButton,
  } = props;

  const toggleSelf = () => {
    if (!hasToggle) return;
    settoggle(!toggle);
  };

  return (
    <div
      className={classNames(styles['coupon__list-item'], styles[`coupon__list-item--${size}`], {
        [styles['custom-class']]: true,
        [styles['is-toggle']]: toggle,
        [styles['is-select']]: select,
        [styles['is-vip']]: receiveWay === 2,
        [styles['is-used']]: used,
        [styles['is-disabled']]: disabled,
        [styles['coupon__list-item--notused']]: notUsedDisabled,
      })}
      style={style}
      onClick={() => onClick({ ...props })}
    >
      <div className={classNames(styles['coupon__list-container'], {
        [styles['is-received']]: isAction,
      })}
      >
        <div className={styles['coupon__list-item__hd']}>
          <div className={styles['desc-container']}>
            <div>
              {
                type === 1 && (
                  <>
                    <span className={styles.strong}>{discount}</span>
                    <span>折</span>
                  </>
                )
              }
              {
                type !== 1 && (
                  <>
                    <span>￥</span>
                    <span className={styles.strong}>{discount}</span>
                  </>
                )
              }
            </div>
            <div className={styles.tip}>{desc.useLimit}</div>
          </div>
        </div>
        <div className={styles['coupon__list-item__bd']}>
          <div className={styles['coupon__list-rule']}>{name}</div>
          <div className={styles['coupon__list-desc']} style={descStyles}>{desc.scope_type}</div>
          <div
            className={styles['coupon__list-date']}
            onClick={(event) => {
              event.stopPropagation();
              toggleSelf();
            }}
          >
            {desc.time}
            {hasToggle && <span className={styles.arrow} />}
          </div>
        </div>
        {isAction && (
          <div className={styles['coupon__list-item__ft']}>
            <div onClick={onClickButton}>
              {getButtonText}
            </div>
          </div>
        )}
      </div>
      <div className={styles['coupon__list-footer']}>{desc.instruction}</div>
    </div>
  );
};

Index.defaultProps = {
  style: {},
  size: 'big',
  select: false,
  receiveWay: -1,
  used: false,
  disabled: false,
  notUsedDisabled: false,
  isAction: false,
  desc: null,
  type: 0,
  discount: 0,
  descStyles: {},
  hasToggle: false,
  getButtonText: '立即兑换',
  onClick: () => { },
  onClickButton: () => { },
};

// 直接从小程序翻译过来
Index.propTypes = {
  style: PropTypes.objectOf(PropTypes.string),
  size: PropTypes.string,
  select: PropTypes.bool,
  receiveWay: PropTypes.number,
  used: PropTypes.bool,
  disabled: PropTypes.bool,
  notUsedDisabled: PropTypes.bool,
  isAction: PropTypes.bool,
  desc: PropTypes.objectOf(PropTypes.string),
  type: PropTypes.number,
  discount: PropTypes.number,
  descStyles: PropTypes.objectOf(PropTypes.string),
  hasToggle: PropTypes.bool,
  getButtonText: PropTypes.string,
  onClick: PropTypes.func,
  onClickButton: PropTypes.func,
};

export default Index;
