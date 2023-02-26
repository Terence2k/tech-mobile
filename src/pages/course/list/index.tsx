import React from 'react';
import { connect } from 'dva';
import actions from 'actions';
import { usePage } from 'hooks';
import getImageHeight from '@/common/getImageHeight';

// import { Toast } from 'antd-mobile';
// import classNames from 'classnames';

import {
  WxJump,
  CardTpl1,
  CardTpl2,
  CardTpl3,
} from 'components';

import styles from './index.scss';
import { namespace } from './model';

const mapStateToProps = (res: any) => ({
  state: res.courseList,
});

const mapDispatchToProps = (dispatch: any) => ({
  onLoad: () => dispatch(actions.onLoad({ namespace })),
  onReachBottom: () => dispatch(actions.onReachBottom({ namespace })),
  jumpToPage: (path: string, params: object = {}) => {
    dispatch(actions.jumpToPage(path, params));
  },
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace })),
});

const tpl2Height = getImageHeight(2, 166 / 343);
const tpl3Height = getImageHeight(3, 166 / 343);

type IProp = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const Page: React.FunctionComponent = (props: any) => {
  const {
    state,
    onLoad,
    onReachBottom,
    onShareAppMessage,
    jumpToPage,
  }: IProp = props;

  usePage({ onLoad, onReachBottom, onShareAppMessage });

  return (
    <div className={styles.layout}>
      {/* 教学方案 */}
      {
        state.contentRows && state.contentRows.map((item, index) => (
          <div
            key={index.toString()}
            className={styles.blockCourseItem}
            style={{ marginTop: '10px' }}
            onClick={() => {
              jumpToPage('/teachingPlan', { plan_id: item.planId });
            }}
          >
            <CardTpl3 mode={7} data={item} imageHeight={tpl3Height} />
          </div>
        ))
      }
      {/* 预约 */}
      {
        state.reservationList && state.reservationList.map((item, resIndex) => (
          <div
            key={resIndex.toString()}
            className={styles.blockCourseItem}
            style={{ marginTop: '10px' }}
            onClick={() => {
              jumpToPage('/course/reservation', { reservation_id: item.reservationId });
            }}
          >
            <CardTpl1
              mode={4}
              data={item}
              imageWidth={90}
            />
          </div>
        ))
      }

      {/* 考试 */}
      <div className={styles.flexCourse}>
        {
          state.exampaperList && state.exampaperList.map((exampaper, exampaperIndex) => (
            <div
              key={exampaperIndex.toString()}
              className={styles.flexCourseItem}
              onClick={() => {
                jumpToPage('/exam/product', { paper_id: exampaper.paperId });
              }}
            >
              <CardTpl2
                mode={11}
                data={exampaper}
                imageHeight={tpl2Height}
              />
            </div>
          ))
        }
      </div>

      {/* 活动报名 */}
      <div className={styles.flexCourse}>
        {
          state.applyFormList && state.applyFormList.map((applyForm, applyFormLIndex) => (
            <div
              key={applyFormLIndex.toString()}
              className={styles.flexCourseItem}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <WxJump
                type="applyform_detail"
                objectIds={{
                  apply_form_id: applyForm.applyFormId,
                }}
              >
                <CardTpl2
                  mode={11}
                  data={applyForm}
                  imageHeight={tpl2Height}
                />
              </WxJump>
            </div>
          ))
        }
      </div>

      {/* 录播 样式一 */}
      <div className={styles.flexCourse} style={{ marginTop: '10px' }}>
        {
          state.courseList && state.courseList.map((course, courseIndex) => (
            <div
              key={courseIndex.toString()}
              className={styles.flexCourseItem}
              onClick={() => {
                jumpToPage('/course/product', { course_id: course.courseId });
              }}
            >
              <CardTpl2
                mode={1}
                data={course}
                imageHeight={tpl2Height}
                statType={state.showData === 2 ? 'desc' : 'stat'}
              />
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
