import React from 'react';
import { Modal, Button, Toast } from 'antd-mobile';
import { connect } from 'dva';
import { TState } from '@/models/types';
import actions from 'actions';
import { usePage } from 'hooks';

// 导入公用组件
import {
  InfoCell,
} from 'components';

import styles from './index.scss';
import { namespace } from './model';

const mapStateToProps = (state: TState) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch: any) => ({
  jumpToPage: (path: string, params: { [key: string]: any } = {}) => {
    dispatch(actions.jumpToPage(path, params));
  },
  logout: () => {
    Modal.alert('', '确认退出登录？', [
      { text: '取消', style: { color: '#000000' }, onPress: () => console.log('cancel') },
      { text: '确定', style: { color: '#ff6600' }, onPress: () => dispatch({ type: `${namespace}/logoutResult` }) },
    ]);
  },
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace })),
});

type IProp = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Page: React.FunctionComponent<any> = (props: any) => {
  const {
    user: {
      nickname, mobileNumber, headImgUrl,
    },
    onShareAppMessage,
  }: IProp = props;

  usePage({ onShareAppMessage });

  return (
    <div className={styles.userInfo}>
      <div className={styles.userInfoCell}>
        <InfoCell label="昵称" value={nickname} nextIcon="y" onClellClick={() => props.jumpToPage('/mine/infoEdit')} />
        <InfoCell label="手机号" value={mobileNumber} />
        <InfoCell label="头像" valType="img" value={headImgUrl} onClellClick={() => Toast.info('修改头像')} />
      </div>
      <Button className={styles.btn} onClick={() => props.logout()}>退出登录</Button>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
