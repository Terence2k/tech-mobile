import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'umi';
import { connect } from 'dva';

import { Popup, VideojsPlayer } from 'components';
import styles from './index.scss';

const mapStateToProps = (state: any) => ({
  browser: state.browser,
  popup: state.popup,
});

const Menus: React.FC = (props: any) => {
  const {
    onClose, popup,
  } = props;

  return (
    <div className={styles.layout}>
      <div className={styles.videoWrapper}>

        <VideojsPlayer
          url={popup.previewView.url}

        />
      </div>
      <div className={styles.closeArea} onClick={onClose}>
        <div className={styles.iBox}>
          <i
            className="iconfont iconyichu"
            style={{ color: '#fff', fontSize: '30px' }}
          />
        </div>
      </div>
    </div>
  );
};

const Index: React.FC = (props: any) => {
  const {
    browser, visible, onClose,
  } = props;

  return (
    <Popup type="bottom" isActive={visible} onSetActive={onClose} size={{ width: browser.isMobileBrowser ? '100%' : '375px', height: 'auto' }} content={<Menus {...props} />} />
  );
};

Index.defaultProps = {
  onClick: () => { },
};

Index.propTypes = {
  visible: PropTypes.bool.isRequired,
  // onClose: PropTypes.func.isRequired,
  onClick: PropTypes.func,
};

export default withRouter(connect(mapStateToProps)(Index));
