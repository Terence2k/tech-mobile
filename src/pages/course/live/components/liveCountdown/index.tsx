import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const formatTime = (mss: number = 0) => {
  const days = Math.floor((mss / (1000 * 60 * 60 * 24)));
  const hours = Math.floor(((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const minutes = Math.floor(((mss % (1000 * 60 * 60)) / (1000 * 60)));

  if (!days && !hours && !minutes) {
    return '小于1分钟';
  }
  // const seconds = (mss % (1000 * 60)) / 1000;
  return `${days}天 ${hours}小时 ${minutes}分钟`;
};

const LiveCountDown: React.FC<any> = (props: any) => {
  const { time } = props;

  return (
    <div className={styles.countdownLayout}>
      距离直播开始时间：
      <span className={styles.countdownLayoutValue}>{formatTime(time)}</span>
    </div>
  );
};

LiveCountDown.defaultProps = {
  time: 0,
};

LiveCountDown.propTypes = {
  time: PropTypes.number,
};

export default LiveCountDown;
