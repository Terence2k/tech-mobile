import React from 'react';
import PropTypes from 'prop-types';
// import { withRouter } from 'umi';
import { connect } from 'dva';
// import { Toast } from 'antd-mobile';
// import classNames from 'classnames';
// import ClipboardJS from 'clipboard';

import { Ticket, Popup } from 'components';
import actions from 'actions';
import styles from './index.scss';

const mapStateToProps = (state: any) => ({
  browser: state.browser,
});

const mapDispatchToProps = (dispatch: any) => ({
  jumpToPage: (path: string) => dispatch(actions.jumpToPage(path)),
});

const Content: React.FC = (props: any) => {
  const {
    value, list, onSelect, onClose, jumpToPage,
  } = props;

  const count = [...list].length;

  return (
    <div
      className={styles.layout}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <div className={styles.layout__title}>
        可用优惠券（
        {count}
        )
      </div>
      <div className={styles.layout__content}>
        {
          [...list].map((item, index) => (
            <Ticket
              {...item}
              hasToggle
              select={value === item.ticketId}
              key={index.toString()}
              onClick={(res) => {
                onClose();
                onSelect(res);
              }}
            />
          ))
        }
        {
          count <= 0 && (
            <div className={styles.empty}>
              <div className={styles.icon} />
              <div className={styles.label}>很遗憾，你暂无可用优惠券。可以在“我的”-“积分”中兑换优惠券或者去领券中心领取更多优惠券哦～</div>
            </div>
          )
        }
      </div>
      <div
        className={styles.layout__link}
        onClick={() => {
          jumpToPage('/ticketsCenter');
        }}
      >
        领取更多优惠券
      </div>
    </div>
  );
};

const Index: React.FC = (props: any) => {
  const {
    browser, visible, onClose,
  } = props;

  return (
    <Popup type="bottom" isActive={visible} onSetActive={onClose} size={{ width: browser.isMobileBrowser ? '100%' : '375px', height: 'auto' }} content={<Content {...props} />} />
  );
};

Index.defaultProps = {
  // list: [],
  value: '',
};

Index.propTypes = {
  value: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  // list: PropTypes.arrayOf(PropTypes.shape({

  // })),
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
