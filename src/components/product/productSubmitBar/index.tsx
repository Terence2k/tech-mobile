import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { WxJump } from '@/components';

import styles from './index.scss';

const Index: React.FC = (props: any) => {
  const {
    disabled,
    disabledText,
    share,
    menus = [],
    onShareClick,
    onMenuClick,
    collect,
    onCollectClick,
    edit,
    onEditClick,
    children,
  } = props;
  const handleClick = () => { };

  return (
    <div className={classNames(styles.layout, {
      [styles.disabled]: disabled,
    })}
    >
      {disabled && (
        <div>{disabledText}</div>
      )}
      {
        !disabled && collect && collect.show && (
          <div className={styles.layout__menus}>
            <div
              className={styles.collect}
              onClick={() => onCollectClick()}
            >
              <div className={`${styles.icon} ${collect.value === 'y' ? styles.collected : ''}`} />
              <div className={styles.label}>{collect.label}</div>
            </div>
          </div>
        )
      }
      {
        !disabled && !!share && (
          <div className={styles.layout__menus}>
            <div
              className={styles.share}
              onClick={() => onShareClick()}
              onKeyDown={() => handleClick()}
            >
              <div className={styles.icon} />
              <div className={styles.label}>{share.label}</div>
            </div>
          </div>
        )
      }
      {
        !disabled && edit && edit.show && (
          <div className={styles.layout__menus}>
            <div
              className={styles.edit}
              onClick={() => onEditClick()}
            >
              <div className={styles.icon} />
              {/* <div className={styles.label}>{edit.label}</div> */}
              <div className={styles.label}>
                {
                  edit.jumpInfo && (
                    <WxJump
                      {...edit.jumpInfo}
                    >
                      {edit.label}
                    </WxJump>
                  )
                }
                {
                  !edit.jumpInfo && (<>{edit.label}</>)
                }
              </div>
            </div>
          </div>
        )
      }
      {
        !disabled && !![...menus].length && (
          <div className={styles.layout__submit}>
            <div className={styles.submit}>
              {
                [...menus].map((item, index) => {
                  if (item.jumpInfo) {
                    return (
                      <div
                        className={styles[item.mode]}
                        key={index.toString()}
                        style={{ background: item.mode === 'custom' && item.background ? item.background : '' }}
                      >
                        <WxJump
                          {...item.jumpInfo}
                        >
                          {item.label}
                        </WxJump>
                      </div>
                    );
                  }

                  return (
                    <div
                      className={styles[item.mode]}
                      onClick={() => onMenuClick({ ...item })}
                      onKeyDown={() => handleClick()}
                      key={index.toString()}
                      style={{ background: item.mode === 'custom' && item.background ? item.background : '' }}
                    >
                      {item.label}
                    </div>
                  );
                })
              }
            </div>
          </div>
        )
      }
      {children}
    </div>
  );
};

Index.defaultProps = {
  disabled: false,
  disabledText: '',
  share: null,
  menus: [],
  collect: {
    show: false,
  },
  edit: {
    show: false,
  },
  onShareClick: () => { },
  onMenuClick: () => { },
  onCollectClick: () => { },
};

Index.propTypes = {
  disabled: PropTypes.bool,
  disabledText: PropTypes.string,
  share: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }),
  collect: PropTypes.shape({
    show: PropTypes.bool,
    label: PropTypes.string,
    status: PropTypes.oneOf(['y', 'n']),
  }),
  edit: PropTypes.shape({
    show: PropTypes.bool,
    label: PropTypes.string,
  }),
  menus: PropTypes.arrayOf(PropTypes.shape({
    // 主题
    mode: PropTypes.oneOf(['black', 'blue', 'custom']).isRequired,
    background: PropTypes.string,
    // 标识
    type: PropTypes.string,
    // 文案
    label: PropTypes.string.isRequired,
    // 跳转信息
    jumpInfo: PropTypes.shape({
      type: PropTypes.string.isRequired,
      objectIds: PropTypes.shape({}).isRequired,
    }),
  })),
  onShareClick: PropTypes.func,
  onMenuClick: PropTypes.func,
  onCollectClick: PropTypes.func,
};

export default Index;
