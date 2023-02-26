import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const SHARE = require('./images/shareIcon.png');

const Header: React.FC<any> = (props: any) => {
  const {
    userData, levelData, subjectList, onShare,
  } = props;
  return (
    <div className={styles.header}>
      <div className="flexLayout center spaceBetween" style={{ marginBottom: '16px' }}>
        <div className={styles.headerTag}>我的学习成就</div>
        <div className={`${styles.headerShare} flexLayout center`} onClick={() => onShare()}>
          <img src={SHARE} alt="" className={styles.headerShareIcon} />
          分享
        </div>
      </div>
      <div className="flexLayout start spaceBetween">
        <div className="flexLayout center column" style={{ margin: '0 24px 0 10px' }}>
          <img src={userData.image} alt="" className={styles.userIcon} />
          <p className={styles.userName}>{userData.userName}</p>
          <p className={styles.userCount}>
            {userData.levelCount || 0}
            个等级认证
          </p>
        </div>
        <div className={styles.level}>
          <div className="flexLayout center spaceBetween">
            <div className={`${styles.levelData} flexLayout center column`}>
              <p className={styles.levelDataLabel}>学习课程</p>
              <p className={styles.levelDataValue}>
                <span className={styles.levelDataValueInner}>{levelData.studyCount}</span>
                /节
              </p>
            </div>
            <div className={`${styles.levelData} flexLayout center column`}>
              <p className={styles.levelDataLabel}>完成作业</p>
              <p className={styles.levelDataValue}>
                <span className={styles.levelDataValueInner}>{levelData.finishCount}</span>
                /份
              </p>
            </div>
            <div className={`${styles.levelData} flexLayout center column`}>
              <p className={styles.levelDataLabel}>作业平均分</p>
              <p className={styles.levelDataValue}>
                <span className={styles.levelDataValueInner}>{levelData.avgGrade}</span>
                /分
              </p>
            </div>
          </div>
          <div className={`${styles.levelIcon} flexLayout center`}>
            {
              levelData.iconList && levelData.iconList.slice(0, 2).map((item, index) => (
                <div className="flexLayout center column" style={{ width: '100px', overflow: 'hidden' }} key={index.toString()}>
                  <img src={item.icon} alt="" className={styles.levelIconInner} />
                  <p className={`${styles.levelIconText} textOverflow`}>{item.title}</p>
                </div>
              ))
            }
            {
              (!levelData.iconList || levelData.iconList.length <= 0)
              && subjectList && subjectList.slice(0, 2).map((item, index) => (
                <div className="flexLayout center column" style={{ width: '100px', overflow: 'hidden' }} key={index.toString()}>
                  <img src={item.image} alt="" className={styles.levelIconInner} />
                  <p className={`${styles.levelIconText} textOverflow`}>{item.title}</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

Header.defaultProps = {
  subjectList: [],
  onShare: () => { },
};

Header.propTypes = {
  userData: PropTypes.shape({
    image: PropTypes.string,
    userName: PropTypes.string,
    levelCount: PropTypes.number,
  }).isRequired,
  levelData: PropTypes.shape({
    iconList: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      icon: PropTypes.string,
    })),
    studyCount: PropTypes.number,
    finishCount: PropTypes.number,
    avgGrade: PropTypes.number,
  }).isRequired,
  subjectList: PropTypes.arrayOf(PropTypes.shape({
    image: PropTypes.string,
    title: PropTypes.string,
  })),
  onShare: PropTypes.func,
};

export default Header;
