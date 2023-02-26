import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'umi';
import { connect } from 'dva';
import classNames from 'classnames';
import { TState } from '@/models/types';

import styles from './index.scss';

const mapStateToProps = (state: TState) => ({
  browser: state.browser,
});

const Index: React.FC = (props: any) => {
  const { browser, favoriteFlag = 'n', onClick } = props;
  const iconClass = classNames(styles.icon, {
    [styles.favorites]: favoriteFlag === 'y',
  });

  return (
    <div
      className={classNames(styles.layout, {
        [styles.pc]: !browser.isMobileBrowser,
      })}
      onClick={() => {
        onClick();
      }}
    >
      <div className={styles.panelLayout}>
        <div className={iconClass} />
      </div>
    </div>
  );
};

Index.defaultProps = {
  favoriteFlag: 'n',
  onClick: () => { },
};

Index.propTypes = {
  favoriteFlag: PropTypes.oneOf(['y', 'n']),
  onClick: PropTypes.func,
};

export default withRouter(connect(mapStateToProps)(Index));
