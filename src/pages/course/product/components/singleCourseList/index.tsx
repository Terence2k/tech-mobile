import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// import { Toast } from 'antd-mobile';

import {
  WxJump,
} from 'components';

import styles from './index.scss';

const canNotEnterExam = (time1, time2) => {
  if (time1 && time2) {
    // const current = getDate().getTime();
    const current = Date.now();
    return current < time1 || current > time2;
  }
  return false;
};
const getTime = (time) => {
  if (time) {
    // const date = getDate(time);
    const date = new Date(time);
    let m = date.getMonth() + 1;
    let d = date.getDate();

    // @ts-ignore
    if (m < 10) m = `0${m}`;
    // @ts-ignore
    if (d < 10) d = `0${d}`;
    return `${m}-${d}`;
  }

  return '';
};

const courseType = {
  video: '视频',
  audio: '音频',
  text: '图文',
  filelist: '资料',
  exampaper: '考试',
  diploma: '证书',
};

const Index: React.FC = (props: any) => {
  const [show, setShow] = React.useState(false);
  const {
    type,
    joinFlag,
    list = [],
    courseId,
  } = props;

  const linkLayout = (item) => {
    if (item.type !== 'diploma') {
      let text = '';
      if (item.memberDoneFlag === 'wait') {
        text = '去';
      } else if (item.memberDoneFlag === 'done') {
        text = '已完成';
      } else {
        text = '继续';
      }
      return (
        <div>
          {text}
          {item.type === 'exampaper' ? '考试' : '学习'}
        </div>
      );
    }
    if (item.diplomaUserId) {
      return <div>查看证书</div>;
    }

    return <i className="iconfont icongengduo" style={{ fontSize: '14px', color: '#ffffff' }} />;
  };

  const layout = (item) => {
    if (joinFlag === 'y' && type === 'breakthrough' && item.viewFlag === 'n' && item.type !== 'diploma') {
      return <div className={classNames(styles.courseCell_btn, styles.disabled)}>完成上一关后开启</div>;
    }
    if (joinFlag === 'y' && item.type === 'exampaper' && canNotEnterExam(item.exampaperList[0].beginTime, item.exampaperList[0].endTime)) {
      return <div className={classNames(styles.courseCell_btn, styles.disabled)}>未到考试时间</div>;
    }
    if (joinFlag === 'y' && item.type === 'diploma' && !item.diplomaUserId) {
      return <i className="iconfont icongengduo" style={{ fontSize: '14px', color: '#F6A248' }} />;
    }
    if (joinFlag === 'y') {
      return (
        <div className={classNames(styles.courseCell_btn, {
          [styles.courseCell_btn_done]: item.memberDoneFlag === 'done',
        })}
        >
          {linkLayout(item)}
        </div>
      );
    }

    if (item.trialFlag === 'y') {
      return (
        <div className={styles.courseCell_btn}>
          {item.type === 'audio' ? '试听' : '试看'}
          <i className="iconfont icongengduo" style={{ fontSize: '14px', color: '#ffffff' }} />
        </div>
      );
    }

    return <div className={classNames(styles.courseCell_btn, styles.disabled)}>购买后开启</div>;
  };

  const cardLayout = (item, index) => (
    <div
      key={index.toString()}
      className={classNames(styles.courseCell, {
        [styles.unjoin]: (type === 'breakthrough' && item.viewFlag === 'n' && item.type !== 'diploma') || (joinFlag === 'n' && item.trialFlag === 'n') || (item.type === 'exampaper' && canNotEnterExam(item.exampaperList[0].beginTime, item.exampaperList[0].endTime)),
        [styles.diploma]: item.type === 'diploma',
      })}
    >
      {item.type !== 'diploma' && item.type !== 'exampaper' && (<div className={styles.courseCell_index}>{item.singlecourseSection}</div>)}
      <div className={styles.courseCell_title}>{item.title}</div>
      <div className={styles.courseCell_bottom}>
        <div className={styles.flex}>
          <div className={classNames(styles.courseCell_tag, {
            [styles.done]: item.doneType === 'y',
          })}
          >
            {courseType[item.type]}
            {
              joinFlag === 'y' && (item.type === 'audio' || item.type === 'video') && (
                <div className={styles.duration}>{item.duration || '00:00'}</div>
              )
            }
          </div>
          {
            item.type === 'exampaper' && item.exampaperList && item.exampaperList.length && (
              <>
                {
                  item.memberDoneFlag === 'done' && (
                    <div className={styles.score}>
                      考试成绩 |
                      {' '}
                      <div className={styles.score_inner}>
                        {item.exampaperList[0].score}
                      </div>
                    </div>
                  )
                }
                {
                  item.exampaperList[0].beginTime && item.exampaperList[0].endTime && (
                    <div className={styles.score}>
                      考试时间：
                      {getTime(item.exampaperList[0].beginTime)}
                      ～
                      { getTime(item.exampaperList[0].endTime)}
                    </div>
                  )
                }
              </>
            )
          }
          {
            !(item.type === 'exampaper' && item.exampaperList && item.exampaperList.length) && item.memberDoneFlag !== 'wait' && (item.type !== 'diploma') && (
              <div className={styles.score}>
                学习时长：
                { item.studyDuration}
              </div>
            )
          }
        </div>
        {layout(item)}
      </div>
    </div>
  );

  const cardLayoutWithJump = (item, index) => {
    if (joinFlag === 'n' && item.trialFlag === 'n') {
      return cardLayout(item, index);
    }

    if (item.type === 'exampaper' && canNotEnterExam(item.exampaperList[0].beginTime, item.exampaperList[0].endTime)) {
      return cardLayout(item, index);
    }

    if (type === 'breakthrough' && item.viewFlag === 'n') {
      return cardLayout(item, index);
    }

    if (item.type === 'exampaper') {
      if (item.exampaperList[0].status === 'done') {
        return (
          <WxJump
            key={`WxJump${index.toString()}`}
            type="exam_done"
            objectIds={{
              paper_id: item.exampaperList[0].paperId,
              course_id: courseId,
              singlecourse_id: item.singlecourseId,
              detail_id: item.exampaperList[0].topDetailId,
              left_repeat_count: item.exampaperList[0].repeatCount,
            }}
          >
            {cardLayout(item, index)}
          </WxJump>
        );
      }
      return (
        <WxJump
          key={`WxJump${index.toString()}`}
          type="exam_wait"
          objectIds={{
            paper_id: item.exampaperList[0].paperId,
            course_id: courseId,
            singlecourse_id: item.singlecourseId,
            left_repeat_count: item.exampaperList[0].repeatCount,
          }}
        >
          {cardLayout(item, index)}
        </WxJump>
      );
    }

    if (item.type === 'diploma') {
      if (item.member_done_flag === 'wait') {
        return (
          <WxJump
            key={`WxJump${index.toString()}`}
            type="wait_cert_detail"
            objectIds={{
              diploma_id: item.diplomaId,
              object_id: courseId,
              object_type: 200,
            }}
          >
            {cardLayout(item, index)}
          </WxJump>
        );
      }
      return (
        <WxJump
          key={`WxJump${index.toString()}`}
          type="certificate_detail"
          objectIds={{
            id: item.diplomaUserId,
          }}
        >
          {cardLayout(item, index)}
        </WxJump>
      );
    }

    return (
      <WxJump
        key={`WxJump${index.toString()}`}
        type="singlecourse_detail"
        objectIds={{ course_id: courseId, singlecourse_id: item.singlecourseId }}
      >
        {cardLayout(item, index)}
      </WxJump>
    );
  };

  const total = [...list].length;
  const maxNum = 5;
  let rows: any = [];
  if (total) {
    if (show) {
      rows = [...list];
    } else {
      rows = [...list].slice(0, maxNum);
    }
  }

  return (
    <>
      {
        [...rows].map((item, index) => (
          cardLayoutWithJump(item, index)
        ))
      }
      {
        total > maxNum && (
          <>
            {
              show && (
                <div
                  className={classNames(styles.flex, styles.showBtn)}
                  onClick={() => setShow(!show)}
                >
                  收起全部课程
                  <i
                    className={classNames({
                      iconfont: true,
                      iconshouqi: true,
                      [styles.showBtn_icon]: true,
                    })}
                    style={{ fontSize: '14px' }}
                  />
                </div>
              )
            }
            {
              !show && (
                <div
                  className={classNames(styles.flex, styles.showBtn)}
                  onClick={() => setShow(!show)}
                >
                  {`查看全部${total}节课程`}
                  <i
                    className={classNames({
                      iconfont: true,
                      iconzhankai: true,
                      [styles.showBtn_icon]: true,
                    })}
                    style={{ fontSize: '14px' }}
                  />
                </div>
              )
            }
          </>
        )
      }
    </>
  );
};

Index.defaultProps = {
};

Index.propTypes = {
  // 课程类型 multiple系列课程；breakthrough闯关课程
  type: PropTypes.oneOf(['multiple', 'breakthrough']).isRequired,
  // 已参加标记。y已参加，n未参加。
  joinFlag: PropTypes.oneOf(['y', 'n']).isRequired,
  // 课程ID
  courseId: PropTypes.string.isRequired,

  // 课程列表。type=12时需要
  list: PropTypes.arrayOf(PropTypes.shape({
    // 课程封面图片。最多6张图片。
    coverUrl: PropTypes.string,
    // 课程内容id
    singlecourseId: PropTypes.string.isRequired,
    // 标题
    title: PropTypes.string.isRequired,
    // 试读。y可试读,n不可试读
    trialFlag: PropTypes.oneOf(['y', 'n']).isRequired,
    // 是否已过关。y已过关，n未过关
    doneFlag: PropTypes.oneOf(['y', 'n']).isRequired,
    // 是否已完成。done已完成，wait未学习，studying学习中
    memberDoneFlag: PropTypes.oneOf(['done', 'wait', 'studying']).isRequired,
    // 是否能看。y能看，n不能看
    viewFlag: PropTypes.oneOf(['y', 'n']).isRequired,
    // 显示当前是第几关/节（不计算考试、证书）。内容示例“第3关”、“第2节”
    singlecourseSection: PropTypes.string,
    // 视频、音频时长。如果有多个视频、音频，则返回总时长。格式【HH:mm:ss】
    duration: PropTypes.string,
    // 课程内容类型。video视频 audio音频 text图文 filelist课件 exampaper考试 diploma证书
    type: PropTypes.oneOf(['video', 'audio', 'text', 'filelist', 'exampaper', 'diploma']).isRequired,
    // 完成标准
    // view浏览即完成 duration学习时长 submitExampaper提交考试
    // reachExampaper考试达到分数 practice学员提交作业 score老师点评后 click点击（查看/复制资料)
    doneType: PropTypes.oneOf(['view', 'duration', 'submitExampaper', 'reachExampaper', 'practice', 'score', 'click']),
    // done已完成，wait未学习，studying学习中
    studyStatus: PropTypes.oneOf(['done', 'wait', 'studying']).isRequired,
    // 证书用户id
    diplomaUserId: PropTypes.string,
    // 证书预览图
    previewUrl: PropTypes.string,
    // 考试列表 type=exampaper考试时需要
    exampaperList: PropTypes.arrayOf(PropTypes.shape({
      // 考试id
      paperId: PropTypes.string.isRequired,
      // 考试时长。单位：秒。0为不限时
      duration: PropTypes.number.isRequired,
      // 题目总数
      questionCount: PropTypes.number.isRequired,
      // 已交卷人数
      handinCount: PropTypes.number.isRequired,
      // 重复考试次数
      repeatCount: PropTypes.number.isRequired,
      // 剩余可考试次数
      leftRepeatCount: PropTypes.number.isRequired,
      // 开始考试日期时间戳 为空则无限制
      beginTime: PropTypes.number.isRequired,
      // 结束考试日期时间戳 为空则无限制
      endTime: PropTypes.number.isRequired,
      // 我的成绩
      score: PropTypes.number.isRequired,
    })),
  }).isRequired).isRequired,
};

export default Index;
