import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { v4 } from 'uuid';
import { Toast } from 'antd-mobile';
// import classNames from 'classnames';

import { Popup } from 'components';
import styles from './card.scss';

const mapStateToProps = (state: any) => ({
  browser: state.browser,
});

const Card: React.FC = (props: any) => {
  const {
    onClose, webShareImage, tip,
  } = props;

  // const [eleid] = React.useState<string>(Date.now().toString());

  // React.useEffect(() => {
  //   const myCanvas = document.getElementById(eleid) as HTMLCanvasElement;
  //   const ctx = myCanvas.getContext('2d');
  //   const img = new Image();
  //   img.onload = () => {
  //     if (ctx) {
  //       ctx.canvas.width = img.width;
  //       ctx.canvas.height = img.height;
  //       ctx.drawImage(img, 0, 0, img.width, img.height);
  //     }
  //   };
  //   img.src = webShareImage;
  // }, [eleid, webShareImage]);

  const [elementId] = React.useState(v4());
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    Toast.loading('加载中...', 0);
    const img = document.getElementById(elementId) as HTMLImageElement;

    if (img) {
      img.onload = () => {
        Toast.hide();
        setShow(true);
      };
      img.onerror = () => {
        Toast.hide();
        onClose();
      };
      img.src = webShareImage;
    }
  }, [elementId, onClose, webShareImage]);

  return (
    <div className={styles.layout} style={{ visibility: show ? 'visible' : 'hidden' }}>
      <div className={styles.layout__close} onClick={() => onClose()}>
        <i className="iconfont iconxingzhuangjiehe1" style={{ fontSize: '20px', color: '#ffffff' }} />
      </div>
      <div className={styles.layout__image}>
        {/* <canvas id={eleid} /> */}
        <img
          id={elementId}
          // src={webShareImage}
          alt=""
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
  tip: '长按图片保存至相册',
};

Index.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  webShareImage: PropTypes.string.isRequired,
  tip: PropTypes.string,
};

export default withRouter(connect(mapStateToProps)(Index));
