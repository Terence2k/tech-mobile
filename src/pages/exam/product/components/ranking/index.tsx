import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './index.scss';

const Index: React.FC = (props: any) => {
  const {
    style, status, myRank, list,
  } = props;

  return (
    <div className={styles.layout} style={style}>
      {
        !!Object.keys(myRank).length && (
          <div className={styles.cell} style={{ backgroundColor: '#77beff' }}>
            <div className={styles.cell__hd}>
              {
                (!status || status !== 'done') && (
                  <div className={classNames(styles.idx)}>
                    <div>无</div>
                  </div>
                )
              }
              {
                (status && status === 'done') && (
                  <div className={classNames(styles.idx, styles.idx_my)}>
                    <div>{myRank.index_i}</div>
                  </div>
                )
              }
            </div>
            <div className={styles.cell__bd}>
              <div className={classNames(styles.icon, styles.my)}>
                <img src={myRank.headimgurl} alt="" />
              </div>
              <div className={styles.infoLayout}>
                <div className={styles.nickname} style={{ color: 'white' }}>{myRank.nickname}</div>
                <div className={styles.duration} style={{ color: 'white' }}>
                  考试用时：
                  {myRank.topDuration}
                  分钟
                </div>
              </div>
            </div>
            <div className={classNames(styles.cell__ft, styles.my)}>{myRank.topScore}</div>
          </div>
        )
      }
      {
        [...list].map((item, index) => (
          <div className={styles.cell} key={index.toString()}>
            <div className={styles.cell__hd}>
              <div className={classNames(styles.idx, styles[`idx_${index + 1}`])}>
                <div>{index > 2 && index}</div>
              </div>
            </div>
            <div className={styles.cell__bd}>
              <div className={styles.icon}>
                <img src={item.headimgurl} alt="" />
              </div>
              <div className={styles.infoLayout}>
                <div className={styles.nickname}>{item.nickname}</div>
                <div className={styles.duration}>
                  考试用时：
                  {item.topDuration}
                  分钟
                </div>
              </div>
            </div>
            <div className={styles.cell__ft}>{item.topScore}</div>
          </div>
        ))
      }
    </div>
  );
};

Index.defaultProps = {
  style: {},
  status: '',
  myRank: {},
  list: [],
};

Index.propTypes = {
  style: PropTypes.objectOf(PropTypes.string),
  status: PropTypes.string,
  myRank: PropTypes.objectOf(PropTypes.string),
  list: PropTypes.arrayOf(PropTypes.shape({
    index_i: PropTypes.string,
    headimgurl: PropTypes.string,
    nickname: PropTypes.string,
    topDuration: PropTypes.string,
    topScore: PropTypes.string,
  })),
};

export default Index;
