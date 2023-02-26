import React from 'react';
import PropTypes from 'prop-types';
import { Modal, InputItem } from 'antd-mobile';

import styles from './index.scss';

const PasswordPopup: React.FC<any> = (props: any) => {
  const {
    visible, password, submit, valueChange, close, isMobile,
  } = props;
  return (
    <Modal
      popup
      visible={visible}
      transparent
      animationType="slide-up"
      className={isMobile ? '' : 'passwordModel'}
      onClose={() => { close(); }}
    >
      <div className={styles.popupLayout}>
        <p className={styles.popupTitle}>输入密码</p>
        <InputItem
          value={password}
          type="number"
          maxLength={6}
          placeholder="请输入6位密码"
          onChange={(val) => { valueChange(val); }}
        />
        <div
          className={`${styles.submitBtn} ${!password ? styles.disabled : ''}`}
          onClick={() => { if (password) submit(); }}
        >
          获取直播
        </div>
      </div>
    </Modal>
  );
};

PasswordPopup.defaultProps = {
  password: '',
  valueChange: () => {},
  submit: () => {},
  close: () => {},
  isMobile: true,
};

PasswordPopup.propTypes = {
  visible: PropTypes.bool.isRequired,
  password: PropTypes.string,
  valueChange: PropTypes.func,
  submit: PropTypes.func,
  close: PropTypes.func,
  isMobile: PropTypes.bool,
};

export default PasswordPopup;
