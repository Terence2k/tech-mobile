import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const UserItem: React.FC<any> = (props: any) => {
  const { data, level } = props;

  return (
    <div className="flexLayout center" style={{ overflow: 'hidden' }}>
      <img src={data.image} alt="" className={styles.userIcon} />
      <div style={{ flex: '1', overflow: 'hidden' }}>
        <p className={`${styles.userName} ${level ? styles.levelItem : ''} textOverflow`}>
          {data.userName}
          {
            level && (
            <span>
              （第
              {level}
              名）
            </span>
            )
          }
        </p>
        <p className={`${styles.userCount} textOverflow`}>
          {data.levelCount > 0 ? `获得${data.levelCount}个等级` : '暂未获得等级'}
        </p>
      </div>
    </div>
  );
};

UserItem.defaultProps = {
  level: '',
};

UserItem.propTypes = {
  data: PropTypes.shape({
    userName: PropTypes.string,
    image: PropTypes.string,
    levelCount: PropTypes.number,
  }).isRequired,
  level: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default UserItem;
