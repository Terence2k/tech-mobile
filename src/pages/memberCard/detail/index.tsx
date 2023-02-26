import React from 'react';
import { connect } from 'dva';
import api from 'api';
import { Icon } from 'antd-mobile';
import { IBrowser } from '@/models/types';
import actions from 'actions';
import { usePage } from 'hooks';

import { MemberCardItem } from '../components';
import { InnerModule, CourseBlock } from './components';

import styles from './index.scss';

const {
  getMembercardCourseList,
  getMembercardLivecourseList,
  getMembercardDakaSubjectList,
} = api;

const mapStateToProps = (state: any) => ({
  browser: state.browser as IBrowser,
  memberCardDetail: state.memberCardDetail,
});

const mapDispatchToProps = (dispatch: any) => ({
  // 查看更多
  moreClick: (popupTitle, type, func, productType = 'course') => {
    let jumpPath = '/course/product';
    let jumpField: any = (id: string) => ({ course_id: id });
    if (productType === 'live') {
      jumpPath = '/course/live';
      jumpField = (id: string) => ({ livecourse_id: id });
    } else if (productType === 'daka') {
      jumpPath = '/daka/product';
      jumpField = (id: string) => ({ subject_id: id });
    }
    dispatch({
      type: 'memberCardDetail/moreClick',
      payload: {
        popupTitle, type, func, jumpPath, jumpField,
      },
    });
  },
  onLoad: () => {
    dispatch({ type: 'memberCardDetail/onLoad' });
  },
  closePopup: () => {
    dispatch({ type: 'memberCardDetail/closePopup' });
  },
  onReachBottom: () => {
    dispatch({ type: 'memberCardDetail/onReachBottom' });
  },
  join: () => {
    dispatch({ type: 'memberCardDetail/joinMembercard' });
  },
  jumpToPage: (path: string, params: object = {}) => {
    dispatch(actions.jumpToPage(path, params));
  },
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace: 'memberCardDetail' })),
});

type IProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

const Page: React.FC = (props: any) => {
  const {
    memberCardDetail, browser, moreClick, onLoad, onShareAppMessage,
    closePopup, onReachBottom, join, jumpToPage,
  }: IProps = props;
  const {
    freeCourseList = [], discountCourseList = [], freeLiveCourseList = [],
    discountLiveCourseList = [], freeDakaList = [], discountDakaList = [],
  } = memberCardDetail;

  usePage({ onLoad, onShareAppMessage });

  return (
    <div className={styles.detailLayout}>
      <div style={{ marginBottom: '50px' }}>
        <MemberCardItem
          mode={memberCardDetail.expireFlag === 'n' ? 3 : 1}
          data={memberCardDetail.cardDetail}
          isMobile={browser.isMobileBrowser}
        />
      </div>
      <InnerModule title="会员权益">
        <div className="flexLayout stretch spaceBetween" style={{ position: 'relative' }}>
          <div className={styles.vsIcon}>vs</div>
          <div className={styles.qualityItem}>
            <p className={`${styles.qualityTitle} textOverflow`}>会员</p>
            {
              memberCardDetail.isMemberDesc.length > 0
              && memberCardDetail.isMemberDesc.map((item, index) => (
                <p className={`${styles.qualityDesc} textOverflow`} key={index.toString()}>{item}</p>
              ))
            }
            {
              memberCardDetail.isMemberDesc.length === 0
              && <p className={`${styles.qualityDesc} textOverflow`}>无</p>
            }
          </div>
          <div className={`${styles.qualityItem} ${styles.notQualityItem}`}>
            <p className={`${styles.qualityTitle} textOverflow`}>非会员</p>
            {
              memberCardDetail.notMemberDesc.length > 0
              && memberCardDetail.notMemberDesc.map((item, index) => (
                <p className={`${styles.qualityDesc} textOverflow`} key={index.toString()}>{item}</p>
              ))
            }
            {
              memberCardDetail.notMemberDesc.length === 0
              && <p className={`${styles.qualityDesc} textOverflow`}>无</p>
            }
          </div>
        </div>
      </InnerModule>
      {
        (freeCourseList.length > 0
          || freeLiveCourseList.length > 0 || freeDakaList.length > 0) && (
          <InnerModule title="会员免费看">
            {
              freeCourseList.length > 0 && (
                <div className="flexLayout center column">
                  <CourseBlock
                    list={freeCourseList}
                    title="免费课程"
                    type="free"
                    onItemClick={(i) => {
                      jumpToPage('/course/product', { course_id: i.itemId });
                    }}
                  />
                  {
                    memberCardDetail.freeCourseCount > 4
                    && (
                      <div
                        className={styles.moreBtn}
                        onClick={() => {
                          moreClick('免费课程', 'free', getMembercardCourseList);
                        }}
                      >
                        查看更多
                      </div>
                    )
                  }
                </div>
              )
            }
            {
              freeLiveCourseList.length > 0 && (
                <div className="flexLayout center column">
                  <CourseBlock
                    list={freeLiveCourseList}
                    title="免费直播"
                    type="free"
                    onItemClick={(i) => {
                      jumpToPage('/course/live', { livecourse_id: i.itemId });
                    }}
                  />
                  {
                    memberCardDetail.freeLiveCourseCount > 4
                    && (
                      <div
                        className={styles.moreBtn}
                        onClick={() => {
                          moreClick('免费直播', 'free', getMembercardLivecourseList, 'live');
                        }}
                      >
                        查看更多
                      </div>
                    )
                  }
                </div>
              )
            }
            {
              freeDakaList.length > 0 && (
                <div className="flexLayout center column">
                  <CourseBlock
                    list={freeDakaList}
                    title="免费打卡"
                    type="free"
                    onItemClick={(i) => {
                      jumpToPage('/daka/product', { subject_id: i.itemId });
                    }}
                  />
                  {
                    memberCardDetail.freeDakaCount > 4
                    && (
                      <div
                        className={styles.moreBtn}
                        onClick={() => {
                          moreClick('免费打卡', 'free', getMembercardDakaSubjectList, 'daka');
                        }}
                      >
                        查看更多
                      </div>
                    )
                  }
                </div>
              )
            }
          </InnerModule>
        )
      }
      {
        (discountCourseList.length > 0
          || discountLiveCourseList.length > 0 || discountDakaList.length > 0) && (
          <InnerModule title="会员享折扣">
            {
              discountCourseList.length > 0 && (
                <div className="flexLayout center column">
                  <CourseBlock
                    list={discountCourseList}
                    title="折扣课程"
                    type="discount"
                    onItemClick={(i) => {
                      jumpToPage('/course/product', { course_id: i.itemId });
                    }}
                  />
                  {
                    memberCardDetail.discountCourseCount > 4
                    && (
                      <div
                        className={styles.moreBtn}
                        onClick={() => {
                          moreClick('折扣课程', 'discount', getMembercardCourseList);
                        }}
                      >
                        查看更多
                      </div>
                    )
                  }
                </div>
              )
            }
            {
              discountLiveCourseList.length > 0 && (
                <div className="flexLayout center column">
                  <CourseBlock
                    list={discountLiveCourseList}
                    title="折扣直播"
                    type="discount"
                    onItemClick={(i) => {
                      jumpToPage('/course/live', { livecourse_id: i.itemId });
                    }}
                  />
                  {
                    memberCardDetail.discountLiveCourseCount > 4
                    && (
                      <div
                        className={styles.moreBtn}
                        onClick={() => {
                          moreClick('折扣直播', 'discount', getMembercardLivecourseList, 'live');
                        }}
                      >
                        查看更多
                      </div>
                    )
                  }
                </div>
              )
            }
            {
              discountDakaList.length > 0 && (
                <div className="flexLayout center column">
                  <CourseBlock
                    list={discountDakaList}
                    title="折扣打卡"
                    type="discount"
                    onItemClick={(i) => {
                      jumpToPage('/daka/product', { subject_id: i.itemId });
                    }}
                  />
                  {
                    memberCardDetail.discountDakaCount > 4
                    && (
                      <div
                        className={styles.moreBtn}
                        onClick={() => {
                          moreClick('折扣打卡', 'discount', getMembercardDakaSubjectList, 'daka');
                        }}
                      >
                        查看更多
                      </div>
                    )
                  }
                </div>
              )
            }
          </InnerModule>
        )
      }
      <InnerModule title="权益说明">
        <span
          style={{
            color: '#FFF',
            fontSize: '16px',
            lineHeight: '24px',
          }}
        >
          {memberCardDetail.desc}
        </span>
      </InnerModule>
      {
        memberCardDetail.expireFlag !== 'n'
        && (
          <div
            className={styles.fixedBottom}
            style={!browser.isMobileBrowser ? {
              width: '375px',
              left: 'calc(50% - 187.5px)',
            } : {}}
          >
            <div className={styles.fixedBottomBtn} onClick={() => join()}>
              {memberCardDetail.expireFlag === 'y' ? '再次开通会员卡' : '开通会员卡'}
            </div>
          </div>
        )
      }
      {
        memberCardDetail.showPopup
        && (
          <div className={styles.popup}>
            <div style={{
              width: browser.isMobileBrowser ? '70%' : '300px',
              minWidth: '300px',
              margin: '15% auto',
              position: 'relative',
            }}
            >
              <Icon
                type="cross"
                color="#FFF"
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '14px',
                }}
                onClick={() => { closePopup(); }}
              />
              <InnerModule
                title={memberCardDetail.popupTitle}
                height={400}
                onReachBottom={() => {
                  onReachBottom();
                }}
              >
                <CourseBlock
                  list={memberCardDetail.popupList}
                  title={memberCardDetail.popupTitle}
                  type={memberCardDetail.currentType}
                  onItemClick={(i) => {
                    jumpToPage(memberCardDetail.jumpPath, memberCardDetail.jumpField(i.itemId));
                  }}
                />
              </InnerModule>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(Page);
