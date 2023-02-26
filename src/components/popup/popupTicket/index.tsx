import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Popup } from 'components';
import styles from './index.scss';

const mapStateToProps = (state: any) => ({
  browser: state.browser,
});

const Content: React.FC = (props: any) => {
  const {
    style, list, path, onClick, onNext, titleText1, titleText2, buttonText,
  } = props;

  return (
    <div className={styles.layout} style={style}>
      <div className={styles.title}>
        <div>{titleText1}</div>
        <div>{titleText2}</div>
      </div>
      <div className={styles.ticketLayout}>
        {
          [...list].map((item, index) => (
            <div className={styles.ticketLayout__item} key={index.toString()}>
              <div className={styles.ticketLayout__item_bd}>
                <div className={styles.topLayout}>
                  <div className={styles.topLayout__hd}>
                    <i className="iconfont iconcoupon" style={{ color: '#FF4E4E' }} />
                  </div>
                  <div className={styles.topLayout__bd}>{item.name}</div>
                  {
                    item.desc && item.desc.useLimit && (
                      <div className={styles.topLayout__ft}>{item.desc.useLimit}</div>
                    )
                  }
                </div>
                {
                  item.desc && (
                    <div className={styles.bottomLayout}>{item.desc.discount}</div>
                  )
                }
              </div>
              <div className={styles.ticketLayout__item_hd} />
              <div className={classNames(styles.circle, styles.top)} />
              <div className={styles.circle} />
            </div>
          ))
        }
      </div>
      {
        path && (
          <div className={styles.buttonLayout} onClick={() => onClick()}>{buttonText}</div>
        )
      }
      <div className={styles.buttonCloseLayout} onClick={() => onNext()}>
        <i className="iconfont iconxingzhuangjiehe1" style={{ fontSize: '12px', color: '#999999' }} />
      </div>
    </div>
  );
};

const Index: React.FC = (props: any) => {
  const {
    browser, visible, onClose,
  } = props;
  return (
    <Popup type="center" isActive={visible} onSetActive={onClose} size={{ width: browser.isMobileBrowser ? '100%' : '375px', height: 'auto' }} content={<Content {...props} />} />
  );
};

Index.defaultProps = {
  style: {},
  list: [],
  path: '',
  onClick: () => { },
  onNext: () => { },
};

Index.propTypes = {
  style: PropTypes.objectOf(PropTypes.string),
  list: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    desc: PropTypes.objectOf(PropTypes.string),
  })),
  path: PropTypes.string,
  titleText1: PropTypes.string.isRequired,
  titleText2: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  // 进入详情
  onClick: PropTypes.func,
  // 检查是否有下一条，否则关闭弹窗
  onNext: PropTypes.func,
};

export default connect(mapStateToProps)(Index);
