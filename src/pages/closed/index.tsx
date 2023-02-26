import React from 'react';
import { connect } from 'dva';
import { TState } from '@/models/types';
import styles from './index.scss';

const mapStateToProps = (res: TState) => ({
  client: res.client,
});

type IProp = ReturnType<typeof mapStateToProps>;

const Page: React.FunctionComponent<any> = (props: any) => {
  const {
    // models
    client,
  }: IProp = props;

  const iconLayout = () => {
    if (client.clientInfoM && client.clientInfoM.closed) {
      return (<div className={styles.layout__message}>店铺已打烊</div>);
    }
    if (client.clientInfoM && client.clientInfoM.is_expire) {
      return (<div className={styles.layout__message}>店铺已到期</div>);
    }
    return <></>;
  };

  return (
    <div className={styles.layout}>
      <div className={styles.layout__icon} />
      {iconLayout()}
    </div>
  );
};

export default connect(mapStateToProps)(Page);
