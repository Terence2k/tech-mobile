import React from 'react';
import { connect } from 'dva';
import { SearchBar } from 'antd-mobile';
import { usePage } from 'hooks';
import { IBrowser, IClient } from '@/models/types';
import actions from 'actions';
import getImageHeight from '@/common/getImageHeight';

// import classNames from 'classnames';
// import layoutsContext from 'layouts/context';
// import actions, { share } from 'utils/actions/index';
// import { Link } from 'umi';
// import { formatMessage } from 'umi-plugin-locale';
// import PropTypes from 'prop-types';
// import router from 'umi/router';

// 全局组件
import {
  WxJump,
  Banner,
  Panel,
  CardTpl1,
  CardTpl2,
  CardTpl3,
} from 'components';
//
import {
  MemberCard,
  IconNavigationList,
} from './components';
//
import styles from './index.scss';
import { namespace } from './model';

const mapStateToProps = (res) => ({
  browser: res.browser as IBrowser,
  client: res.client as IClient,
  state: res.index,
});

const tpl2Height = getImageHeight(2, 83 / 150);
const tpl3Height = getImageHeight(3, 500 / 900);

const mapDispatchToProps = (dispatch) => ({
  jumpToPage: (path: string, params: object = {}) => {
    dispatch(actions.jumpToPage(path, params));
  },
  // hideShareMenu: () => dispatch(actions.popup.hideShareMenu()),
  onLoad: () => dispatch(actions.onLoad({ namespace })),
  onReachBottom: () => dispatch(actions.onReachBottom({ namespace })),
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace })),
});

type IProp = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Page: React.FunctionComponent<any> = (props: any) => {
  const {
    // models
    client, state,
    // action methods
    jumpToPage,
    onLoad,
    onReachBottom,
    onShareAppMessage,
  }: IProp = props;

  usePage({ onLoad, onReachBottom, onShareAppMessage });

  const { subject = [], liveCourseList } = state;

  const isEmpty = (res) => !res || res.length === 0;

  return (
    <div className={styles.layout}>
      <div style={{ backgroundColor: '#ffffff' }}>
        <div onClick={() => jumpToPage('/search')}>
          <SearchBar className="search-bar-layout" disabled placeholder="搜索" maxLength={8} />
        </div>

        {/* 会员卡 */}
        <MemberCard
          style={{ marginTop: '16px' }}
          onClick={() => jumpToPage('/memberCard')}
          {...state.memberCard}
        />

        {/* banner */}
        <Banner
          scale={360 / 900}
          style={{ marginTop: '16px' }}
          data={state.banner || []}
          onClick={(res) => {
            if (res.webUrl) {
              jumpToPage(res.webUrl);
            }
          }}
        />

        {/* 金刚区 */}
        <IconNavigationList
          style={{ marginTop: '24px' }}
          lineCount={client.miniConfig.navigationLineCount}
          {...state.iconNavigationList}
        />

        {/* 我的课程 */}
        {
          state.myCourseList && (
            <Panel
              {...state.myCourseList}
              style={{ marginTop: '24px' }}
              onClick={() => jumpToPage('/mine/myCourse')}
            />
          )
        }

        {/* 直播课 */}
        {
          state.liveCourseList && state.liveCourseList.list.length > 0 && (
            <Panel
              style={{ marginTop: '16px' }}
              {...state.liveCourseList}
              onClick={() => jumpToPage('/course/live/list')}
            >
              <div className={styles.flexCourse}>
                {
                  liveCourseList && liveCourseList.list.map((item, index) => (
                    <div
                      key={index.toString()}
                      className={styles.flexCourseItem}
                      style={{ display: 'flex', flexDirection: 'column' }}
                      onClick={() => {
                        jumpToPage('/course/live', { livecourse_id: item.livecourseId });
                      }}
                    >
                      <CardTpl2
                        mode={6}
                        showTime
                        data={item}
                        imageHeight={tpl2Height}
                      />
                    </div>
                  ))
                }
              </div>
            </Panel>
          )
        }

        {
          // 课程分组列表
          [...subject].filter(
            (item) => !isEmpty(item.contentRows)
              || !isEmpty(item.reservationList)
              || !isEmpty(item.courseList)
              || !isEmpty(item.exampaperList)
              || !isEmpty(item.applyFormList),
          ).map((item, index) => (
            <Panel
              key={index.toString()}
              style={{ marginTop: '33px' }}
              title={item.title}
              allFlag={item.allFlag}
              onClick={() => jumpToPage('/course/list', { subject_id: item.subjectId, title: item.title })}
            >
              <div style={{ marginTop: '15px' }} />

              {/* 教学方案 */}
              {
                item.contentRows.map((row, planIndex) => (
                  <div
                    key={planIndex.toString()}
                    className={styles.blockCourseItem}
                  >
                    <CardTpl3
                      mode={7}
                      data={row.teachingPlan}
                      imageHeight={tpl3Height}
                      onClick={() => jumpToPage('/teachingPlan', { plan_id: row.teachingPlan.planId })}
                    />
                  </div>
                ))
              }

              {/* 预约 */}
              {
                item.reservationList.map((res, resIndex) => (
                  <div
                    key={resIndex.toString()}
                    className={styles.blockCourseItem}
                    onClick={() => jumpToPage('/course/reservation', { reservation_id: res.reservationId })}
                  >
                    <CardTpl1
                      mode={4}
                      data={res}
                      imageWidth={90}
                      imageHeight={90}
                      showTime={!!res.timeText}
                    />
                  </div>
                ))
              }

              {/* 考试 */}
              <div className={styles.flexCourse}>
                {
                  item.exampaperList && item.exampaperList.map((exampaper, exampaperIndex) => (
                    <div
                      key={exampaperIndex.toString()}
                      className={styles.flexCourseItem}
                      style={{ display: 'flex', flexDirection: 'column' }}
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
                  item.applyFormList && item.applyFormList.map((applyForm, applyFormLIndex) => (
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
                          mode={12}
                          data={applyForm}
                          imageHeight={tpl2Height}
                        />
                      </WxJump>
                    </div>
                  ))
                }
              </div>

              {/* 录播 样式一 */}
              {item.showTpl === 1
                && (
                  <div className={styles.flexCourse}>
                    {
                      item.courseList && item.courseList.map((course, courseIndex) => (
                        <div
                          key={courseIndex.toString()}
                          className={styles.flexCourseItem}
                          style={{ display: 'flex', flexDirection: 'column' }}
                          onClick={() => {
                            jumpToPage('/course/product', { course_id: course.courseId });
                          }}
                        >
                          <CardTpl2
                            mode={1}
                            data={course}
                            imageHeight={tpl2Height}
                            statType={item.showData === 2 ? 'desc' : 'stat'}
                          />
                        </div>
                      ))
                    }
                  </div>
                )}

              {/* 录播 样式二 */}
              {item.showTpl === 3 && (
                <div>
                  {
                    item.courseList && item.courseList.map((course, courseIndex) => (
                      <div
                        key={courseIndex.toString()}
                        className={styles.blockCourseItem}
                        onClick={() => {
                          jumpToPage('/course/product', { course_id: course.courseId });
                        }}
                      >
                        <CardTpl1
                          mode={1}
                          data={course}
                          statType={item.showData === 2 ? 'desc' : 'stat'}
                        />
                      </div>
                    ))
                  }
                </div>
              )}

              {/* 录播 样式三 */}
              {item.showTpl === 2 && (
                <div style={{ paddingTop: '15px' }}>
                  {
                    item.courseList && item.courseList.map((course, courseIndex) => (
                      <div
                        key={courseIndex.toString()}
                        className={styles.blockCourseItem}
                        onClick={() => {
                          jumpToPage('/course/product', { course_id: course.courseId });
                        }}
                      >
                        <CardTpl3
                          mode={1}
                          data={course}
                          imageHeight={tpl3Height}
                          statType={item.showData === 2 ? 'desc' : 'stat'}
                        />
                      </div>
                    ))
                  }
                </div>
              )}
            </Panel>
          ))
        }
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
