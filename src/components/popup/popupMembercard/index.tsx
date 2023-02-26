import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

import { Popup } from 'components';
import styles from './index.scss';

const mapStateToProps = (state: any) => ({
  browser: state.browser,
});

const Content: React.FC = (props: any) => {
  const {
    style, list, path, onClick, onNext,
  } = props;

  return (
    <div className={styles.layout} style={style}>
      <div className={styles.title}>
        <div>恭喜完成转发任务</div>
        <div>获得以下奖励</div>
      </div>
      <div className={styles.membercardLayout}>
        {
          [...list].map((item, index) => (
            <div className={styles.membercardLayout__item} key={index.toString()}>
              <div className={styles.membercardLayout__item_bd}>
                <div className={styles.topLayout}>
                  <div className={styles.topLayout__hd}>
                    <i className="iconfont iconVIP" style={{ color: '#FF8800' }} />
                  </div>
                  <div className={styles.topLayout__bd}>{item.title}</div>
                </div>
                <div className={styles.bottomLayout}>{moment(item.expireTime).format('YYYY.MM.DD')}</div>
              </div>
              <div className={styles.membercardLayout__item_hd} />
              <div className={classNames(styles.circle, styles.top)} />
              <div className={styles.circle} />
            </div>
          ))
        }
      </div>
      {
        path && (
          <div className={styles.buttonLayout} onClick={() => onClick()}>去看看</div>
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
    title: PropTypes.string,
    expireTime: PropTypes.number,
  })),
  path: PropTypes.string,
  // 进入详情
  onClick: PropTypes.func,
  // 检查是否有下一条，否则关闭弹窗
  onNext: PropTypes.func,
};

export default connect(mapStateToProps)(Index);
