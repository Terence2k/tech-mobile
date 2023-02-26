import React, { FC, useEffect } from 'react';
import { Button } from 'antd-mobile';
import { connect } from 'dva';
import actions from 'actions';
import { usePage } from 'hooks';

// 导入公用组件
import {
  FormInput,
} from 'components';

import styles from './index.scss';

const mapStateToProps = (state: any) => ({
  user: state.user,
  userName: state.mineInfoEdit.userName,
});

const mapDispatchToProps = (dispatch: any) => ({
  updateName: (userName: string) => {
    console.log('update', userName);
    dispatch({
      type: 'mineInfoEdit/updateUserName',
      payload: {
        userName,
      },
    });
  },
  save: () => {
    dispatch({ type: 'mineInfoEdit/updateMinaUserInfo' });
  },
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace: 'mineInfoEdit' })),
});

const Page: FC = (props: any) => {
  const {
    user: { nickname }, userName = '', updateName, save, onShareAppMessage,
  } = props;
  useEffect(() => {
    updateName(nickname || '');
  }, [nickname, updateName]);

  usePage({ onShareAppMessage });

  return (
    <div className={styles.mineInfoEdit}>
      <FormInput
        value={userName}
        maxLength={15}
        onValChange={(val: string) => updateName(val)}
      />
      <Button
        style={{ marginTop: '72px' }}
        disabled={userName.length <= 0}
        type="primary"
        onClick={() => save()}
      >
        保存
      </Button>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
