import React, { FC, useEffect } from 'react';
import { connect } from 'dva';
import { InputItem } from 'antd-mobile';
import actions from 'actions';
import { usePage } from 'hooks';
import { TState } from '@/models/types';
import styles from './index.scss';
import { namespace } from './model';

const mapStateToProps = (state: TState) => ({
  name: state.client.name,
  logo: state.client.logo,
  appId: state.client.appId,
  mobileNumber: state[namespace].mobileNumber,
  validateCode: state[namespace].validateCode,
  remainSec: state[namespace].remainSec,
});

const mapDispatchToProps = (dispatch: any) => ({
  updateMobileNumber: (mobileNumber) => {
    // .split(' ').join('')
    // TODO：去掉空格会造成删除号码时光标错位
    dispatch(actions.updateState({ namespace, payload: { mobileNumber } }));
  },

  updateValidateCode: (validateCode) => {
    dispatch(actions.updateState({
      namespace,
      payload: {
        validateCode: validateCode.slice(0, 4),
      },
    }));
  },

  sendValidateCode: () => {
    dispatch({ type: `${namespace}/sendValidateCode` });
  },

  login: () => {
    dispatch({ type: `${namespace}/login` });
  },

  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace })),

  check: () => {
    dispatch({ type: `${namespace}/check` });
  },
});

/**
 * 登录
 * @see https://gitlab.beautifulreading.com/To_B/h5-techfull/wikis/%E7%99%BB%E5%BD%95%E6%B5%81%E7%A8%8B
 */
const Page: FC = (props: any) => {
  const {
    name,
    logo,
    appId,
    mobileNumber,
    validateCode,
    remainSec,
    onShareAppMessage,
    check,
  } = props;

  useEffect(() => {
    check();
  }, [check, appId]);

  usePage({ onShareAppMessage });

  return (
    <div className={styles.loginLayout}>
      <>
        {
          logo && (
          <div className={styles.logo}>
            <img src={logo || ''} alt="" />
          </div>
          )
        }
        {
          name && (
          <div className={styles.name}>{name || ''}</div>
          )
        }
      </>
      <div className={styles.inputLayout} style={{ marginTop: '65px' }}>
        <InputItem
          className="am-list-item-transparent"
          value={mobileNumber}
          type="phone"
          placeholder="请输入手机号"
          onChange={(res) => props.updateMobileNumber(res)}
        />
      </div>
      <div className={styles.inputLayout}>
        <InputItem
          className="am-list-item-transparent"
          value={validateCode}
          type="number"
          placeholder="请输入验证码"
          onChange={(res) => props.updateValidateCode(res)}
        />
        <div
          className={styles.validate_code_get}
          style={{ color: remainSec > 0 ? '#CCCCCC' : '#409EFF' }}
          onClick={() => props.sendValidateCode()}
        >
          {remainSec > 0 ? `${remainSec}秒后重新获取` : '获取验证码'}
        </div>
      </div>

      <div
        className={styles.loginButton}
        onClick={() => props.login()}
      >
        确定
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
