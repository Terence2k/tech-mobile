import React from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd-mobile';
import actions from 'actions';
import { IBrowser } from '@/models/types';
import { usePage } from 'hooks';
import getImageHeight from '@/common/getImageHeight';

// 全局组件
import {
  CardTpl1,
  CardTpl2,
  CardTpl3,
} from 'components';

import styles from './index.scss';
import { namespace, tabValues } from './model';

const mapStateToProps = (res: any) => ({
  browser: res.browser as IBrowser,
  state: res.myCourse,
});

const mapDispatchToProps = (dispatch: any) => ({
  jumpToPage: (path: string, params: object = {}) => {
    dispatch(actions.jumpToPage(path, params));
  },
  updateState: (payload: { [key: string]: any }) => {
    dispatch({ type: 'myCourse/updateTab', payload });
  },
  onLoad: () => dispatch(actions.onLoad({ namespace })),
  onReachBottom: () => dispatch(actions.onReachBottom({ namespace })),
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace })),
});

const tpl2Height = getImageHeight(2, 166 / 343);
const tpl3Height = getImageHeight(3, 166 / 343);

type IProp = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Page: React.FunctionComponent<any> = (props: any) => {
  const {
    // models
    browser, state,
    // action methods
    jumpToPage,
    updateState,
    onLoad,
    onReachBottom,
    onShareAppMessage,
  }: IProp = props;

  usePage({ onReachBottom, onShareAppMessage });

  const {
    currentTab, tabs, planList, courseList, liveList, fileList,
  } = state;

  React.useEffect(() => {
    onLoad();
  }, [onLoad]);

  return (
    <div className={styles.layout}>
      <div
        className={styles.fixedTab}
        style={!browser.isMobileBrowser ? {
          width: '375px',
          left: 'calc(50% - 187.5px)',
        } : {}}
      >
        <Tabs
          tabs={tabs}
          page={currentTab}
          initialPage={currentTab}
          onChange={({ key }) => {
            updateState({ currentTab: key });
          }}
        />
      </div>
      <div style={{ padding: '55px 15px 15px', backgroundColor: '#FFF' }}>
        {
          currentTab === tabValues.course && (
            <div>
              {
                planList && planList.map((item, index) => (
                  <div key={index.toString()} style={{ marginBottom: '10px' }}>
                    <CardTpl3
                      mode={7}
                      data={item}
                      onClick={() => jumpToPage('/teachingPlan', { plan_id: item.planId })}
                      imageHeight={tpl3Height}
                    />
                  </div>
                ))
              }
              <div className={styles.flexCourse}>
                {
                  courseList && courseList.map((item, index) => (
                    <div
                      key={index.toString()}
                      className={styles.flexCourseItem}
                      onClick={() => {
                        jumpToPage('/course/product', { course_id: item.courseId });
                      }}
                    >
                      <CardTpl2
                        key={index.toString()}
                        mode={1}
                        data={item}
                        imageHeight={tpl2Height}
                      />
                    </div>
                  ))
                }
              </div>
            </div>
          )
        }
        {
          currentTab === tabValues.live && (
            <div className={styles.flexCourse}>
              {
                liveList && liveList.map((item, index) => (
                  <div
                    key={index.toString()}
                    className={styles.flexCourseItem}
                    onClick={() => {
                      jumpToPage('/course/live', { livecourse_id: item.livecourseId });
                    }}
                  >
                    <CardTpl2
                      key={index.toString()}
                      mode={6}
                      showTime
                      data={item}
                      imageHeight={tpl2Height}
                    />
                  </div>
                ))
              }
            </div>
          )
        }
        {
          currentTab === tabValues.file && fileList && fileList.map((item, index) => (
            <div
              key={index.toString()}
              style={{ marginBottom: '10px' }}
              onClick={() => jumpToPage('/file/fileDetail', { opern_id: item.opernId })}
            >
              <CardTpl1
                mode={2}
                data={item}
                showPrice={false}
              />
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
