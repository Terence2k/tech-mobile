import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import styles from './index.scss';

const Index: React.FC = (props: any) => {
  const {
    style, startTime, endTime, startFormat, endFormat,
  } = props;

  return (
    <div className={styles.layout} style={style}>
      {moment(startTime).format(startFormat)}
      {' ~ '}
      {moment(endTime).format(endFormat)}
    </div>
  );
};

Index.defaultProps = {
  style: {},
  startFormat: 'YYYY-MM-DD',
  endFormat: 'YYYY-MM-DD',
};

Index.propTypes = {
  style: PropTypes.objectOf(PropTypes.string),
  startTime: PropTypes.number.isRequired,
  startFormat: PropTypes.string,
  endTime: PropTypes.number.isRequired,
  endFormat: PropTypes.string,
};

export default Index;
