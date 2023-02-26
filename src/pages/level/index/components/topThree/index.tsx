import React from 'react';
import PropTypes from 'prop-types';

import {
  UserItem,
} from '../../../components';

import styles from './index.scss';

const RANK_ICON = require('./images/rankIcon.png');

const TopThree: React.FC<any> = (props: any) => {
  const { list = [] } = props;

  return (
    <div className={styles.topLayout}>
      <img src={RANK_ICON} alt="" className={styles.rankIcon} />
      {
        list.map((item, index) => (
          <div className={`${styles.user} ${styles[`user-${index + 1}`]}`} key={index.toString()}>
            <UserItem data={item} />
          </div>
        ))
      }
    </div>
  );
};

TopThree.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({
    userName: PropTypes.string,
    image: PropTypes.string,
    levelCount: PropTypes.number,
  })).isRequired,
};

export default TopThree;
