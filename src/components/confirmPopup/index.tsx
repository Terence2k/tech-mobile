import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import { Popup } from 'components';
import styles from './index.scss';
import { WxJump } from '..';

const mapStateToProps = (state: any) => ({
  browser: state.browser,
});

const Content: React.FC = (props: any) => {
  const { data = {}, operations = [], onOpeClick } = props;

  const button = (item, index) => {
    if (item.jumpInfo) {
      return (
        <div
          className={styles.confirmOpeItem}
          key={index.toString()}
          style={item.style}
          onClick={() => onOpeClick({ ...item })}
        >
          <WxJump
            {...item.jumpInfo}
          >
            {item.text}
          </WxJump>
        </div>
      );
    }

    return (
      <div
        className={styles.confirmOpeItem}
        key={index.toString()}
        style={item.style}
        onClick={() => onOpeClick({ ...item })}
      >
        {item.text}
      </div>
    );
  };

  return (
    <div className={styles.confirmLayout}>
      <div className={styles.confirmBody}>
        {
          data.title
          && <p className={styles.confirmTitle}>{data.title}</p>
        }
        {
          data.content
          && (
          <div
            className={styles.confirmContent}
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
          )
        }
      </div>
      <div className={`${styles.confirmOpe} flexLayout`}>
        {
          operations.map((item, index) => (
            button(item, index)
          ))
        }
      </div>
    </div>
  );
};

const ConfirmPopup: React.FC = (props: any) => {
  const {
    browser, visible, onClose,
  } = props;

  return (
    <Popup type="center" isActive={visible} onSetActive={onClose} size={{ width: browser.isMobileBrowser ? '100%' : '375px', height: 'auto' }} content={<Content {...props} />} />
  );
};

ConfirmPopup.defaultProps = {
  onOpeClick: () => {},
  operations: [],
  data: {},
};

ConfirmPopup.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.objectOf(PropTypes.string),
  operations: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    style: PropTypes.objectOf(PropTypes.string),
    payload: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    jumpInfo: PropTypes.shape({
      type: PropTypes.string.isRequired,
      objectIds: PropTypes.shape({}).isRequired,
    }),
  }).isRequired),
  onOpeClick: PropTypes.func,
};

export default connect(mapStateToProps)(ConfirmPopup);
