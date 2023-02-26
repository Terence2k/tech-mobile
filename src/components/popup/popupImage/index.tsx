import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'umi';
import { connect } from 'dva';
// import { Toast } from 'antd-mobile';
// import classNames from 'classnames';

import { Popup } from 'components';
import styles from './index.scss';

const mapStateToProps = (state: any) => ({
  browser: state.browser,
});

const Card: React.FC = (props: any) => {
  const {
    onClose, picUrl, tip,
  } = props;

  return (
    <div className={styles.layout}>
      <div className={styles.layout__close} onClick={() => onClose()}>
        <i className="iconfont iconxingzhuangjiehe1" style={{ fontSize: '20px', color: '#ffffff' }} />
      </div>
      <div className={styles.layout__image}>
        <img src={picUrl} alt="" />
      </div>
      <div className={styles.layout__tip}>{tip}</div>
    </div>
  );
};

const Index: React.FC = (props: any) => {
  const {
    browser, visible, onClose,
  } = props;

  return (
    <Popup type="center" isActive={visible} onSetActive={onClose} size={{ width: browser.isMobileBrowser ? '100%' : '375px', height: 'auto' }} content={<Card {...props} />} />
  );
};

Index.defaultProps = {
  visible: false,
  onClose: () => { },
  onClick: () => { },
};

Index.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onClick: PropTypes.func,
  picUrl: PropTypes.string.isRequired,
};

export default withRouter(connect(mapStateToProps)(Index));
