import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'umi';
import { connect } from 'dva';

import { Popup } from 'components';
import QRCode from 'qrcode.react';

import styles from './qrcode.scss';

const mapStateToProps = (state: any) => ({
  browser: state.browser,
});

const Card: React.FC = (props: any) => {
  const {
    onClose, qrCodeLink, tip,
  } = props;

  return (
    <div className={styles.layout}>
      <div className={styles.layout__close} onClick={() => onClose()}>
        <i className="iconfont iconxingzhuangjiehe1" style={{ fontSize: '20px', color: '#ffffff' }} />
      </div>
      <div className={styles.layout__image}>
        <QRCode
          value={qrCodeLink}
          size={300}
          fgColor="#000000"
        />

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
  onClick: () => { },
  tip: '',
};

Index.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  qrCodeLink: PropTypes.string.isRequired,
  tip: PropTypes.string,
};

export default withRouter(connect(mapStateToProps)(Index));
