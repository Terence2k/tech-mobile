import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const Index: React.FC = (props: any) => {
  const { message } = props;

  return (
    <div className={styles.layout}>
      <div className={styles.layout__icon} />
      <div className={styles.layout__message}>{message || '暂未找到内容'}</div>
    </div>
  );
};

Index.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Index;
