import React, { FC, useState } from 'react';
import {
  Button, Flex, Modal, Icon,
} from 'antd-mobile';
import { connect } from 'dva';
import actions from 'actions';
import { usePage } from 'hooks';

import { IBrowser } from '@/models/types';
import styles from './index.scss';

const mapStateToProps = (state: any) => ({
  exchange: state.exchange,
  browser: state.browser as IBrowser,
});

const mapDispatchToProps = (dispatch: any) => ({
  updateCode: (val: string) => {
    dispatch({
      type: 'exchange/updateCode',
      payload: {
        exchangeCode: val,
      },
    });
  },
  closeSuccess: () => {
    dispatch({ type: 'exchange/closeSuccess' });
  },
  exchangeVirtualProductByCode: () => {
    dispatch({ type: 'exchange/exchangeVirtualProductByCode' });
  },
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace: 'exchange' })),
});

const Page: FC = (props: any) => {
  const {
    exchange: { exchangeCode = '', successVisible, product = {} }, updateCode, closeSuccess, exchangeVirtualProductByCode, browser, onShareAppMessage,
  } = props;

  usePage({ onShareAppMessage });
  const tipsImg = require('../images/tips.png');

  function codeChange(e) {
    e.persist();
    console.log(e.target.value);
    updateCode(e.target.value);
  }

  const [visible, setVisible] = useState(false);

  return (
    <Flex direction="column" justify="start" align="center" className={styles.exchangePage}>
      <Flex justify="center" className={styles.tips}>
        <span>在下方输入兑换码/提取码</span>
        <img
          className={styles.tipsImg}
          src={tipsImg}
          alt=""
          onClick={() => { setVisible(true); }}
        />
      </Flex>
      <input value={exchangeCode} onChange={(val) => { codeChange(val); }} placeholder="输入兑换码/提取码" type="text" className={styles.inputCon} />
      <Button className={styles.exchangeBtn} disabled={exchangeCode.length <= 0} type="primary" onClick={() => { exchangeVirtualProductByCode(); }}>兑换/提取</Button>
      {/* <p className={styles.record}>兑换/提取记录</p> */}
      <Modal
        visible={successVisible}
        animationType="fade"
        transparent
        onClose={() => { closeSuccess(); }}
      >
        <div className={styles.successLayout}>
          <p className={`${styles.successTitle} flexLayout center`}>
            <Icon type="check-circle" color="#409EFF" size="xs" style={{ marginRight: '8px' }} />
            兑换成功
          </p>
          <div className={`${styles.successInner} flexLayout`}>
            <img src={product.image} alt="" className={styles.successImg} />
            <div className={styles.successInnerData}>
              <p className="textOverflow">{product.title}</p>
              <p className={styles.successPrice}>
                ¥
                {product.price}
              </p>
            </div>
          </div>
          <div className={styles.successBtn}>{product.productText}</div>
        </div>
      </Modal>
      <Modal
        popup
        visible={visible}
        className={browser.isMobileBrowser ? '' : 'popupConModel'}
        animationType="slide-up"
        onClose={() => { setVisible(false); }}
      >
        <div className={styles.popupCon}>
          <div className={styles.title}>兑换码/提取码说明</div>
          <Flex align="start" className={styles.content}>
            <div className={styles.idot} />
            <Flex.Item className={styles.text}>兑换码/提取码是您兑换商品内容的唯一凭证，请妥善保管；</Flex.Item>
          </Flex>
          <Flex align="start" className={styles.content}>
            <div className={styles.idot} />
            <Flex.Item className={styles.text}>如使用有效兑换码/提取码无法兑换/提取相应内容，请联系客服人员处理；</Flex.Item>
          </Flex>
          <Flex align="start" className={styles.content}>
            <div className={styles.idot} />
            <Flex.Item className={styles.text}>已使用或已过期的兑换码/提取码均会失效，无法再次使用；</Flex.Item>
          </Flex>
          <Flex align="start" className={styles.content}>
            <div className={styles.idot} />
            <Flex.Item className={styles.text}>如何获得兑换码/提取码请联系客服。</Flex.Item>
          </Flex>
        </div>
      </Modal>
    </Flex>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
