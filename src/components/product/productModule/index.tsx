import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './index.scss';

const Index: React.FC = (props: any) => {
  const {
    style = {}, divider, title, children,
  } = props;
  return (
    <div className={styles.layout}>
      <div className={styles.barLayout}>
        <div className={classNames(styles.barLayout__bd, {
          [styles.divider]: divider,
        })}
        >
          {title}
        </div>
      </div>
      <div className={styles.contentLayout} style={style}>{children}</div>
    </div>
  );
};

Index.defaultProps = {
  style: {},
  divider: false,
};

Index.propTypes = {
  // 内容样式
  style: PropTypes.objectOf(PropTypes.string),
  // 分隔线
  divider: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

export default Index;
