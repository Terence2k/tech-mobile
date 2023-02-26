import React from 'react';
import { connect } from 'dva';
import actions from 'actions';
import { usePage } from 'hooks';
import { Tabs } from 'antd-mobile';

import { CardTpl1, CardTpl2 } from 'components';
import { IBrowser } from '@/models/types';
import getImageHeight from '@/common/getImageHeight';

import styles from './index.scss';

const mapStateToProps = (state: any) => ({
  myCollection: state.myCollection,
  browser: state.browser as IBrowser,
});

const mapDispatchToProps = (dispatch: any) => ({
  onTabChange: (currentTab) => {
    dispatch({ type: 'myCollection/onTabChange', payload: { currentTab } });
  },
  getList: () => {
    dispatch({ type: 'myCollection/getList' });
  },
  jumpToPage: (path: string, params: object = {}) => {
    dispatch(actions.jumpToPage(path, params));
  },
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace: 'myCollection' })),
});

const tpl2Height = getImageHeight(2, 166 / 343);

type IProp = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const Page: React.FC = (props: any) => {
  const {
    myCollection, onTabChange, getList, jumpToPage, browser, onShareAppMessage,
  }: IProp = props;
  const {
    currentTab, tabs, courseList, fileSetList, fileList,
  } = myCollection;

  React.useEffect(() => {
    getList();
  }, [getList]);

  usePage({ onShareAppMessage });

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
          page={myCollection.currentTab}
          onChange={(tab, index) => { onTabChange(index); }}
        />
      </div>
      <div style={{ padding: '55px 15px 15px', backgroundColor: '#FFF' }}>
        {
          currentTab === 0
          && (
            <div className={styles.flexCourse}>
              {
                courseList && courseList.map((item, index) => (
                  <div
                    className={styles.flexCourseItem}
                    onClick={() => {
                      jumpToPage(item.type === 'live' ? '/course/live' : '/course/product', item.type === 'live' ? { livecourse_id: item.itemId } : { course_id: item.itemId });
                    }}
                  >
                    <CardTpl2
                      key={index.toString()}
                      mode={item.type === 'live' ? 6 : 1}
                      showTime={item.type === 'live'}
                      showPrice={item.type !== 'live'}
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
          currentTab === 1
          && (
            <div className={styles.flexCourse}>
              {
                fileSetList && fileSetList.map((item, index) => (
                  <div
                    className={styles.flexCourseItem}
                    onClick={() => {
                      jumpToPage('/file/fileSetDetail', { opernsetId: item.opernsetId });
                    }}
                  >
                    <CardTpl2
                      key={index.toString()}
                      mode={2}
                      data={item}
                      showPrice={false}
                      imageHeight={tpl2Height}
                    />
                  </div>
                ))
              }
            </div>
          )
        }
        {
          currentTab === 2
          && fileList && fileList.map((item, index) => (
            <div
              style={{ marginBottom: '10px' }}
              key={index.toString()}
              onClick={() => {
                jumpToPage('/file/fileDetail', { opern_id: item.opernId });
              }}
            >
              <CardTpl1
                mode={2}
                data={item}
              />
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
