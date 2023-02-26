import React from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import { Toast } from 'antd-mobile';
import { IBrowser } from '@/models/types';
import actions from 'actions';
import { usePage } from 'hooks';

import {
  Banner,
  ProductTitle,
  ProductPrice,
  CountStat,
  ProductDesc,
  ProductTeachers,
  ProductModule,
  FileList,
  ProductTabs,
  ProductMediaList,
  ProductHomework,
  ProductSubmitBar,
  ProductFavorites,
  Tag,
  ConfirmPopup,
  ProductTicketList,
} from 'components';
import styles from './index.scss';

import {
  LiveCountDown,
  PasswordPopup,
} from './components';

// 常量，固定直播标签
const liveTag = {
  text: '直播课程',
  effect: 'custom',
  style: {
    background: '#F3F9FF',
    color: '#54ADFF',
    border: '1px solid #A4CCF1',
    borderRadius: '2px',
    padding: '0 5px',
    marginRight: '10px',
  },
};

const mapStateToProps = (state: any) => ({
  browser: state.browser as IBrowser,
  liveDetail: state.liveDetail,
});

const mapDispatchToProps = (dispatch: any) => ({
  getLivecourseDetail: (payload: object) => {
    dispatch({ type: 'liveDetail/getLivecourseDetail', payload });
  },
  // 更新tab值
  onTabChange: (index: number) => {
    dispatch({ type: 'liveDetail/onTabChange', payload: { activeTab: index } });
  },
  // 显示弹窗
  setPopupVisible: (popupVisible: boolean) => {
    dispatch({ type: 'liveDetail/setPopupVisible', payload: { popupVisible } });
  },
  // 分享
  share: () => {
    dispatch({ type: 'liveDetail/share' });
  },
  // 收藏
  collectLive: () => {
    dispatch({ type: 'liveDetail/collectLive' });
  },
  // 底部栏点击事件
  clickHandler: (handler: any) => {
    dispatch(handler);
  },
  // 操作密码弹窗
  setPasswordShow: (passwordShow: boolean) => {
    dispatch({ type: 'liveDetail/setPasswordShow', payload: { passwordShow } });
  },
  // 密码值输入
  setPassword: (password: string) => {
    dispatch({ type: 'liveDetail/setPassword', payload: { password } });
  },
  // 提交密码事件
  submitPassword: () => {
    dispatch({ type: 'liveDetail/submitPassword' });
  },
  // 弹出优惠券选择框
  showProductTicketPopup: (productId: string) => {
    dispatch(actions.ticket.showProductTicketList(productId));
  },
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace: 'liveDetail' })),
});

const Page: React.FC<any> = (
  state: any,
) => {
  const {
    liveDetail, getLivecourseDetail, onTabChange, share, collectLive, clickHandler,
    setPopupVisible, setPasswordShow, setPassword, submitPassword, showProductTicketPopup, browser,
    onShareAppMessage,
  } = state;
  const { liveMediaList = [], liveStatus = {} } = liveDetail;

  React.useEffect(() => {
    getLivecourseDetail();
  }, [getLivecourseDetail]);

  usePage({ onShareAppMessage });

  return (
    <div className="pageLayout">
      <div className="pageLayout__scrollLayout">
        <Banner data={liveDetail.coverList} />
        <div className={styles.infoLayout}>
          <div className="flexLayout center">
            <ProductTitle title={liveDetail.title} />
            <Tag {...liveStatus}>{liveStatus.text}</Tag>
          </div>
          <div style={{ margin: '12px 0 8px' }}>
            <ProductPrice {...liveDetail.livePrice} />
          </div>
          <div className="flexLayout center" style={{ padding: '0 0 8px' }}>
            <Tag {...liveTag}>{liveTag.text}</Tag>
            <CountStat {...liveDetail.countStat} />
          </div>
          <div style={{ padding: '0 0 8px' }}>
            <ProductDesc {...liveDetail.liveDesc} />
          </div>
          {
            liveDetail.joinFlag === 'n' && liveDetail.productTicketListData && !!liveDetail.productTicketListData.list.length && (
              <ProductTicketList
                style={{ borderBottom: 'none' }}
                {...liveDetail.productTicketListData}
                onClick={() => showProductTicketPopup(liveDetail.productId)}
              />
            )
          }
        </div>
        <ProductModule title="授课教师">
          <ProductTeachers {...liveDetail.teachers} />
        </ProductModule>
        {
          liveDetail.fileList && liveDetail.fileList.length > 0 && (
          <ProductModule title="课件资料">
            <FileList
              fileList={liveDetail.fileList}
              onDownloadClick={(item) => {
                if (liveDetail.joinFlag === 'y') {
                  window.open(item.url);
                } else {
                  Toast.info('获取课程后才能下载资料', 3);
                }
              }}
              jumpInfo={{ type: 'live_detail', objectIds: { livecourse_id: liveDetail.liveCourseId } }}
            />
          </ProductModule>
          )
        }
        <div className={styles.tabsLayout}>
          <ProductTabs
            tabArr={liveDetail.tabArr}
            activeTab={liveDetail.activeTab}
            onTabChange={onTabChange}
          />
          <div className={styles.tabsLayoutContent}>
            {
              liveDetail.activeTab === 0 && liveMediaList.length > 0
              && <ProductMediaList {...liveMediaList[0]} />
            }
            {
              liveDetail.activeTab === 0
              && (liveMediaList.length === 0 || liveMediaList[0].node.length === 0)
              && <p style={{ color: '#999', textAlign: 'center', lineHeight: '50px' }}>暂无内容</p>
            }
            {
              liveDetail.activeTab === 1
              && (
                <ProductHomework
                  joinFlag={liveDetail.joinFlag}
                  homeworkList={liveDetail.homeworkList}
                  homeworkTag="客观题"
                  extraJumpObjectIds={{
                    livecourse_id: liveDetail.liveCourseId,
                  }}
                />
              )
            }
            {
              liveDetail.activeTab === 1
              && (!liveDetail.homeworkList || liveDetail.homeworkList.length === 0)
              && <p style={{ color: '#999', textAlign: 'center', lineHeight: '50px' }}>暂无任务</p>
            }
          </div>
        </div>
        {
          liveDetail.liveRestTime > 0 && (
          <div className={styles.fixedTime}>
            <LiveCountDown time={liveDetail.liveRestTime} />
          </div>
          )
        }
        <div className={classNames('pageLayout__bottomLayout', {
          pc: !browser.isMobileBrowser,
        })}
        >
          <ProductSubmitBar
            {...liveDetail.liveSubmitBar}
            onShareClick={() => {
              share();
            }}
            onMenuClick={(res) => {
              if (res.handler === 'showPassword') {
                setPasswordShow(true);
              } else if (res.handler) clickHandler(res.handler);
            }}
          />
        </div>
        <ProductFavorites
          {...liveDetail.liveFavorites}
          onClick={() => {
            collectLive();
          }}
        />
      </div>
      {/* 弹窗 */}
      <ConfirmPopup
        visible={liveDetail.popupVisible}
        onOpeClick={(item) => {
          if (item.func) clickHandler(item.func);
        }}
        onClose={() => setPopupVisible(false)}
        {...liveDetail.popupData}
      />
      {/* 密码 */}
      <PasswordPopup
        visible={liveDetail.passwordShow}
        password={liveDetail.password}
        isMobile={browser.isMobileBrowser}
        valueChange={(val) => { setPassword(val); }}
        submit={() => { submitPassword(); }}
        close={() => { setPasswordShow(false); }}
      />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
