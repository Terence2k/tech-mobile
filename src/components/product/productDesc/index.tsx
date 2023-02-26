import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const Index: React.FC = (props: any) => {
  const { style, desc } = props;
  return (
    <div className={styles.layout} style={style}>
      <div className={styles.descLayout}>{desc}</div>
    </div>
  );
};

Index.defaultProps = {
  style: {},
  // 简介
  desc: '',
};

Index.propTypes = {
  style: PropTypes.objectOf(PropTypes.string),
  // 简介
  desc: PropTypes.string,
};

export default Index;
