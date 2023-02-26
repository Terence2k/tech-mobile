import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const Index: React.FC = (props: any) => {
  const {
    style, title, allFlag, children, onClick,
  } = props;

  return (
    <div className={styles.layout} style={style}>
      <div className={styles.bar}>
        <div className={styles.bar__bd}>{title}</div>
        {allFlag === 'y' && <div className={styles.bar__hd} onClick={() => onClick()}>全部</div>}
        {allFlag === 'y' && (<div className={styles.bar__ft} />)}
      </div>
      {children}
    </div>
  );
};

Index.defaultProps = {
  style: {},
  title: '标题',
  allFlag: 'n',
  onClick: () => { },
};

Index.propTypes = {
  style: PropTypes.objectOf(PropTypes.string),
  title: PropTypes.string,
  allFlag: PropTypes.oneOf(['y', 'n']),
  onClick: PropTypes.func,
};

export default Index;
