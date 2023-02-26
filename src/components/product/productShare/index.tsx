import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Toast } from 'antd-mobile';
import classNames from 'classnames';
import ClipboardJS from 'clipboard';

import { Popup } from 'components';
import styles from './index.scss';

const mapStateToProps = (state: any) => ({
  browser: state.browser,
});

const Menus: React.FC = (props: any) => {
  const {
    onClose, onClick, menus,
  } = props;

  React.useEffect(() => {
    const clipboard = new ClipboardJS('#clipboard-url');
    clipboard.on('success', (e) => {
      // console.info('Action:', e.action);
      // console.info('Text:', e.text);
      // console.info('Trigger:', e.trigger);

      e.clearSelection();

      onClose();

      Toast.info('复制成功', 3);
    });

    // clipboard.on('error', (e) => {
    //   console.error('Action:', e.action);
    //   console.error('Trigger:', e.trigger);
    // });

    return () => {
      clipboard.destroy();
    };
  }, [ClipboardJS]);

  const itemProps = (item) => {
    let value = {};

    if (item.type === 'link') {
      value = {
        id: 'clipboard-url',
        'data-clipboard-text': window.location.href,
      };
    }

    return value;
  };

  return (
    <div className={styles.layout}>
      {
        [...menus].map((item, index) => (
          <div
            key={index.toString()}
            className={classNames(styles.layout__item)}
            onClick={() => onClick(item)}
            {...itemProps(item)}
          >
            <div className={classNames(styles.icon, styles[item.type])} />
            <div>{item.label}</div>
          </div>
        ))
      }
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
  onClose: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  menus: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired).isRequired,
};

export default withRouter(connect(mapStateToProps)(Index));
