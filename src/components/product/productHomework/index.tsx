import React from 'react';
import PropTypes from 'prop-types';
import { Toast } from 'antd-mobile';
import { WxJump } from '@/components';

import styles from './index.scss';

const ProductHomework: React.FC = (props: any) => {
  const {
    homeworkList, homeworkTag, showStatFlag, extraJumpObjectIds, joinFlag,
  } = props;

  return (
    homeworkList.map((item, index) => (
      <div className={styles.homeworkItem} key={index.toString()}>
        <div className={styles.topLayout}>
          <i className={`iconfont iconiconPraticeDisable ${styles.topLayoutIcon}`} />
          <span className={`${styles.topLayoutTitle} textOverflow2`}>{item.title}</span>
        </div>
        <div className={`flexLayout center ${styles.bottomLayout}`}>
          <div className="flexLayout center">
            <span className={styles.bottomLayoutTag}>{homeworkTag}</span>
            {showStatFlag === 'y'
              && (
                <span className={styles.bottomLayoutStat}>
                  {
                    homeworkTag === '主观题'
                    && (
                      <span>
                        作业数 ·
                        {item.postCount}
                        {' '}
                        ｜ 浏览数 ·
                        {item.viewCount}
                      </span>
                    )
                  }
                  {
                    homeworkTag === '客观题'
                    && (
                      <span>
                        题目数 ·
                        {item.questionCount}
                        {' '}
                        ｜ 提交数 ·
                        {item.handinCount}
                      </span>
                    )
                  }
                </span>
              )}
          </div>
          {
            joinFlag === 'y' && (
              <WxJump
                type={item.status === 'done' ? 'exam_done' : 'exam_doing'}
                objectIds={{
                  paper_id: item.paperId,
                  detail_id: item.lastDetailId,
                  type: 'set',
                  ...extraJumpObjectIds,
                }}
              >
                <div className={styles.bottomLayoutBtn}>{item.status === 'done' ? '查看作业' : '写作业'}</div>
              </WxJump>
            )
          }
          {
            joinFlag === 'n' && (
              <div
                className={styles.bottomLayoutBtn}
                onClick={() => {
                  Toast.info('请获取直播后再进行作业练习', 3);
                }}
              >
                {item.status === 'done' ? '查看作业' : '写作业'}
              </div>
            )
          }
        </div>
      </div>
    ))
  );
};

ProductHomework.defaultProps = {
  homeworkList: [],
  showStatFlag: 'y',
  joinFlag: 'n',
};

ProductHomework.propTypes = {
  // 作业题列表
  homeworkList: PropTypes.arrayOf(PropTypes.object),
  // 作业题类型标签（主观题/客观题）
  homeworkTag: PropTypes.string.isRequired,
  // 是否显示作业数据
  showStatFlag: PropTypes.oneOf(['y', 'n']),
  // extraJumpObjectIds
  extraJumpObjectIds: PropTypes.shape({}).isRequired,
  // 是否已经获取
  joinFlag: PropTypes.oneOf(['y', 'n']),
};

export default ProductHomework;
