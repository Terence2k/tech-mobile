import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const Index: React.FC = (props: any) => {
  const { style, title } = props;

  return (
    <div className={`${styles.title} textOverflow`} style={style}>
      {title}
    </div>
  );
};

Index.defaultProps = {
  style: {},
};

Index.propTypes = {
  style: PropTypes.objectOf(PropTypes.string),
  title: PropTypes.string.isRequired,
};

export default Index;
