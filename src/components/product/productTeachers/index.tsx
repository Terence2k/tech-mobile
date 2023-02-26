import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const Index: React.FC = (props: any) => {
  const { list } = props;
  return (
    <>
      {
        // 主讲
        [...list].filter((item) => item.mainTeacher === 'y').map((item, index) => (
          <div className={styles.mainTeacherLayout} key={index.toString()}>
            <div className={styles.mainTeacherLayout__hd}>
              <div className={styles.icon}>
                <img className={styles.headimgurl} src={item.headimgurl} alt="" />
                <div className={styles.tag} />
              </div>
            </div>
            <div className={styles.mainTeacherLayout__bd}>
              <div className={styles.top}>
                <div className={styles.nickname}>{item.nickname}</div>
                <div className={styles.tag}>主讲</div>
              </div>
              <div className={styles.bottom}>{item.intro}</div>
            </div>
          </div>
        ))
      }
      {
        !![...list].length && (
          <div className={styles.teacherLayout}>
            {
              // 教师列表
              [...list].filter((item) => !item.mainTeacher || item.mainTeacher === 'n').map((item, index) => (
                <div className={styles.layout} key={index.toString()} style={{ marginLeft: index === 0 ? '0' : '15px' }}>
                  <img className={styles.headimgurl} src={item.headimgurl} alt="" />
                  <div className={styles.nickname}>{item.nickname}</div>
                </div>
              ))
            }
          </div>
        )
      }
    </>
  );
};

Index.defaultProps = {
  list: [],
};

Index.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({
    headimgurl: PropTypes.string,
    nickname: PropTypes.string,
    mainTeacher: PropTypes.oneOf(['y', 'n']),
    intro: PropTypes.string,
  })),
};

export default Index;
