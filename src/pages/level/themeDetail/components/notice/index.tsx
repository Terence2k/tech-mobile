import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
// import { Toast } from 'antd-mobile';
// import classNames from 'classnames';

import { Popup } from 'components';
import styles from './index.scss';

const mapStateToProps = (state: any) => ({
  browser: state.browser,
});

const Content: React.FC = () => (
  <div className={styles.layout}>
    <div className={styles.noticePopup}>
      <div className={styles.title}>考级须知</div>
      <div className={styles.item}>未参加过考级的学员请从最低等级逐级往上考</div>
      <div className={styles.item}>已通过考级的学员请购买下一等级参加考核</div>
      <div className={styles.item}>未通过考级的学员请重新购买当前等级再接再厉</div>
      <div className={styles.item}>注意：所有学员都可逐级往上考，不支持跨级往上考核</div>
    </div>
  </div>
);

const Index: React.FC = (props: any) => {
  const {
    browser, visible, onClose,
  } = props;

  return (
    <Popup type="bottom" isActive={visible} onSetActive={onClose} size={{ width: browser.isMobileBrowser ? '100%' : '375px', height: 'auto' }} content={<Content {...props} />} />
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
};

export default connect(mapStateToProps)(Index);
