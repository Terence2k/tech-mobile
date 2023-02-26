import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd-mobile';
import moment from 'moment';

import { WxJump } from '@/components';
import styles from './index.scss';

const red = require('../images/red.png');
const green = require('../images/green.png');
const gray = require('../images/gray.png');
const lock = require('../images/lockIcon.png');
const triangle = require('../images/triangle.png');

function getLockIcon(themeColor: string = '', lockStatus: string = 'y') {
  if (lockStatus === 'n') return lock;
  if (themeColor === '52C41A') return green;
  if (themeColor === '546E7A') return gray;
  return red;
}

function getType(type: string) {
  if (type === 'set' || type === 'exercise') return '作业';
  if (type === 'paper') return '考试';
  if (type === 'reservation') return '预约';
  return '';
}

function getStatus(status: string, studyStatus: string = '', type: string = '') {
  const text = type === 'reservation' && !studyStatus ? '预约' : '完成';
  const outputStatus = status || studyStatus;
  if (outputStatus === 'doing') return '进行中';
  if (outputStatus === 'wait') return `未${text}`;
  if (outputStatus === 'done') return `已${text}`;
  return '';
}

const InnerItem: React.FC = (data: any) => {
  const {
    type = '', joinFlag, hideBorder, contentType,
  } = data;
  return (
    <div
      className={styles.subItemBody}
      style={
      contentType === 'prepare' ? { borderTop: '1px solid #F2F2F2' } : { borderBottom: '1px solid #F2F2F2' }
    }
    >
      <p className={styles.subItemTitle}>
        <span className="flexLayout flexStart">
          {
            type
            && (
            <span className={styles.subItemType}>
              <img src={triangle} alt="" className={styles.subItemTag} />
              { getType(type) }
              <span style={{ margin: '0 2px' }}>|</span>
            </span>
            )
          }
          { !type && (
            <span className={styles.subItemTitleInner}>
              {data.title}
            </span>
          ) }
          { type === 'set' && data.exampaper_set_title }
          { type === 'paper' && data.paper_title }
          { type === 'reservation' && data.title }
          { type === 'exercise' && data.exercise_title }
        </span>
        {
          data.exampaper_score
          && (
          <span className={styles.subItemScore}>
            {data.exampaper_score}
            分
          </span>
          )
        }
        {
          type === 'reservation' && joinFlag === 'y'
          && (
          <span className={styles.subItemResBtn}>
            <span style={{ zoom: '0.83' }}>查看预约</span>
          </span>
          )
        }
      </p>
      {
        joinFlag === 'y' && (
        <div className="flexLayout center spaceBetween" style={{ marginBottom: '12px' }}>
          <span className="flexLayout">
            <span className={`${styles.subItemOpeTag} ${styles[`subItemOpeTag-${data.status || data.study_status}`]}`}>
              <span style={{ zoom: '0.83' }}>{getStatus(data.status, data.study_status, type)}</span>
            </span>
            {
              type === 'reservation' && data.start_time && data.end_time && (
              <span style={{ fontSize: '12px', marginLeft: '4px' }}>
                预约时间：
                {moment(data.start_time).format('YYYY-MM-DD')}
                ~
                {moment(data.end_time).format('YYYY-MM-DD')}
              </span>
              )
            }
          </span>
          <Icon type="right" size="xxs" color="#87888A" />
        </div>
        )
      }
      {
        !hideBorder && <div className={styles.subItemBorder} />
      }
    </div>
  );
};

const SubItem: React.FC<any> = (props: any) => {
  const { themeColor, data, joinFlag } = props;

  const taskLayout = (item, index) => {
    let jumpInfo = {};
    if (item.type === 'paper') {
      // 考试
      if (item.status === 'wait') {
        jumpInfo = {
          type: 'exam_wait',
          objectIds: {
            paper_id: item.paper_id,
            course_id: item.course_id,
            singlecourse_id: item.singlecourse_id,
          },
        };
      } else {
        jumpInfo = {
          type: 'exam_done',
          objectIds: {
            paper_id: item.paper_id,
            course_id: item.course_id,
            singlecourse_id: item.singlecourse_id,
          },
        };
      }
    } else if (item.type === 'exercise') {
      // 主观题
      jumpInfo = {
        type: 'exercise_detail',
        objectIds: {
          exercise_id: item.exercise_id,
          course_id: item.course_id,
          singlecourse_id: item.singlecourse_id,
          from: 'plan',
        },
      };
    } else if (item.type === 'set') {
      // 客观题
      if (item.status === 'wait') {
        jumpInfo = {
          type: 'exam_doing',
          objectIds: {
            paper_id: item.exampaper_set_id,
            course_id: item.course_id,
            singlecourse_id: item.singlecourse_id,
            detail_id: item.last_detail_id,
            from: 'plan',
            type: 'set',
          },
        };
      } else {
        jumpInfo = {
          type: 'exam_done',
          objectIds: {
            paper_id: item.exampaper_set_id,
            course_id: item.course_id,
            singlecourse_id: item.singlecourse_id,
            detail_id: item.last_detail_id,
            from: 'plan',
            type: 'set',
          },
        };
      }
    } else if (item.type === 'reservation') {
      jumpInfo = {
        webUrl: `/course/reservation?reservation_id=${item.reservation_id}&plan_id=${data.plan_id}`,
      };
    }

    return (
      <WxJump
        {...jumpInfo}
        key={index.toString()}
      >
        <InnerItem
          {...{
            ...item,
            joinFlag,
            hideBorder: index === data.task_list.length - 1,
            contentType: data.content_type,
          }}
        />
      </WxJump>
    );
  };

  const kernalLayout = () => {
    let jumpInfo = {};
    if (data.content_type === 'kernal') {
      if (data.object_type === 200) {
        // 课程
        jumpInfo = {
          webUrl: `/course/product?course_id=${data.object_id}&plan_id=${data.plan_id}`,
        };
      } else if (data.object_type === 312) {
        // 直播
        jumpInfo = {
          webUrl: `/course/live?livecourse_id=${data.object_id}&plan_id=${data.plan_id}`,
        };
      } else if (data.object_type === 321) {
        // 预约
        jumpInfo = {
          webUrl: `/course/reservation?reservation_id=${data.object_id}&plan_id=${data.plan_id}`,
        };
      }
    } else {
      jumpInfo = {
        type: 'plan_answer_detail',
        objectIds: {
          plan_id: data.plan_id,
          content_id: data.content_id,
        },
      };
    }

    return (
      <WxJump
        {...jumpInfo}
      >
        <InnerItem
          {...{
            ...data,
            joinFlag,
            hideBorder: !data.task_list || !data.task_list.length,
            contentType: data.content_type,
          }}
        />
      </WxJump>
    );
  };

  return (
    <div className={styles.subItem}>
      <div className={styles.subItemStatus}>
        <img src={getLockIcon(themeColor, data.lock_status)} alt="" className={styles.subItemStatusIcon} />
        {
          data.content_type === 'prepare' && (
            <div
              className={styles.subItemStatusLine}
              style={{ backgroundColor: data.lock_status === 'n' ? '#E8E8E8' : themeColor }}
            />
          )
        }
      </div>
      <div className={styles.subItemContent}>
        <div className={styles.subItemContentTag}>
          <div>课 </div>
          <div>{ data.content_type === 'prepare' ? '前' : '后' }</div>
        </div>
        <div className={styles.subItemContentInner}>
          {
            data.title && kernalLayout()
          }
          {
            data.task_list && data.task_list.map(taskLayout)
          }
        </div>
      </div>
    </div>
  );
};

SubItem.defaultProps = {
  themeColor: '#FF4D4F',
  joinFlag: 'n',
};

SubItem.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  themeColor: PropTypes.string,
  joinFlag: PropTypes.string,
};

export default SubItem;
