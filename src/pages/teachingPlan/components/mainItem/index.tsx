import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { chineseWeek, formatDuration } from 'utils/utils';

import styles from './index.scss';

const red = require('../images/red.png');
const green = require('../images/green.png');
const gray = require('../images/gray.png');
const lock = require('../images/lockIcon.png');

function getLockIcon(themeColor: string = '', lockStatus: string = 'y') {
  if (lockStatus === 'n') return lock;
  if (themeColor === '52C41A') return green;
  if (themeColor === '546E7A') return gray;
  return red;
}

function getType(type) {
  if (type === 200) return '录播课';
  if (type === 312) return '直播课';
  if (type === 321) return '预约';
  return '';
}

function getStudyText(content: any = {}) {
  const {
    study_status = '', live_status = '', record_flag = 'n', object_type = '',
  } = content;

  let value = '去上课';

  if (!live_status || live_status === 'wait') {
    if (!study_status || study_status === 'wait') {
      value = '去上课';
    } else {
      value = '继续学习';
    }

    if (object_type == '321') {
      value = '去预约';
    }
  } else if (live_status === 'doing') {
    value = '正在直播';
  } else if (live_status === 'delay') {
    value = '拖堂中';
  } else if (live_status === 'cancel') {
    value = '已取消';
  } else if (live_status === 'expired') {
    value = '已过期';
  } else if (live_status === 'done') {
    if (record_flag === 'y') {
      value = '看回放';
    } else {
      value = '已结束';
    }
  }

  return value;
}

const MainItem: React.FC<any> = (props: any) => {
  const {
    themeColor, joinFlag, data, showLine,
  } = props;
  return (
    <div>
      {
        data.object_type !== 323 && (
          <div className={styles.mainItem}>
            <div className={styles.mainItemStatus}>
              <img src={getLockIcon(themeColor, data.lock_status)} alt="" className={styles.mainItemStatusIcon} />
              {
                showLine && (
                  <div
                    className={styles.mainItemStatusLine}
                    style={{ backgroundColor: data.lock_status === 'n' ? '#E8E8E8' : themeColor }}
                  />
                )
              }
            </div>
            <div className={styles.mainItemContent}>
              <p className={styles.mainItemTitle}>{data.title}</p>
              <div className="flexLayout center" style={{ marginBottom: '8px' }}>
                {
                  data.object_id
                  && (
                  <div
                    className={styles.mainItemType}
                    style={{ color: themeColor, borderColor: themeColor }}
                  >
                    {getType(data.object_type)}
                  </div>
                  )
                }
                {
                  data.object_type === 312 && data.live_start_time && data.live_end_time
                  && (
                    <span style={{ fontSize: '12px' }}>
                      {moment(data.live_start_time).format('MM月DD日')}
                      丨
                      {chineseWeek(data.live_start_time)}
                      {' '}
                      {moment(data.live_start_time).format('HH:mm')}
                      -
                      {moment(data.live_end_time).format('HH:mm')}
                    </span>
                  )
                }
              </div>
              {
                data.teacher
                && (
                <div className={styles.mainItemTeacher}>
                  <img src={data.teacher.headimgurl} className={styles.mainItemTeacherIcon} alt="" />
                  授课：
                  {data.teacher.nickname}
                </div>
                )
              }
              {
                joinFlag === 'y' && data.object_id
                && (
                <div className="flexLayout center spaceBetween">
                  {
                    data.study_status && data.study_status !== 'wait' && data.object_type !== 321
                  && (
                  <span className={styles.mainItemDuration} style={{ color: themeColor }}>
                    学习时长：
                    {formatDuration(data.study_duration)}
                  </span>
                  )
                  }
                  {
                    (!data.study_status || data.study_status === 'wait' || data.object_type === 321)
                    && <span />
                  }
                  <div className={styles.mainItemBtn} style={{ backgroundColor: themeColor }}>
                    {getStudyText(data)}
                  </div>
                </div>
                )
              }
            </div>
          </div>
        )
      }
      {
        data.object_type === 323 && (
          <div className={styles.diplomaItem}>
            <p className={`${styles.diplomaItemTitle} textOverflow`}>{data.title}</p>
            <div className={styles.diplomaItemTag}>证书</div>
          </div>
        )
      }
    </div>
  );
};

MainItem.defaultProps = {
  themeColor: '#FF4D4F',
  joinFlag: 'n',
};

MainItem.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  themeColor: PropTypes.string,
  joinFlag: PropTypes.string,
};

export default MainItem;
