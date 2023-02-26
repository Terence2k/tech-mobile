import React from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import { Tabs } from 'antd-mobile';
import actions from 'actions';
import { usePage, useDebounceFn } from 'hooks';

import {
  Banner,
  ProductTitle,
  ProductPrice,
  ProductTeachers,
  ProductModule,
  ProductTicketList,
  ProductSubmitBar,
  ProductMediaList,
} from 'components';
import {
  PlanFeatures,
  PlanSellPoints,
  PlanItems,
} from './components';

import styles from './index.scss';

const mapStateToProps = (state: any) => ({
  browser: state.browser,
  teachingPlan: state.teachingPlan,
});

const mapDispatchToProps = (dispatch: any) => ({
  // 展开节点的变化
  onOpenChange: (activeKey) => {
    dispatch({ type: 'teachingPlan/onOpenChange', payload: { activeKey } });
  },
  // 菜单变化
  onTabChange: (page) => {
    dispatch({ type: 'teachingPlan/onTabChange', payload: { page } });
  },
  onLoad: () => {
    dispatch({ type: 'teachingPlan/onLoad' });
  },
  // 底部栏点击事件
  clickHandler: (handler: any) => {
    dispatch(handler);
  },
  share: () => {
    dispatch(actions.popup.showShareMenu('', [{
      label: '复制链接',
      type: 'link',
    }]));
  },
  showProductTicketPopup: (productId: string) => {
    dispatch(actions.ticket.showProductTicketList(productId));
  },
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace: 'teachingPlan' })),
});

type IProp = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Page: React.FC<any> = (props: any) => {
  const {
    browser, teachingPlan, onOpenChange, onTabChange, onLoad, onShareAppMessage, clickHandler,
    share, showProductTicketPopup,
  }: IProp = props;
  const { productTicketList, mediaList } = teachingPlan;

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const itemsRef = React.useRef<HTMLDivElement>(null);
  const detailRef = React.useRef<HTMLDivElement>(null);
  const [isUserClick, setIsUserClick] = React.useState<boolean>(false);

  usePage({ onLoad, onShareAppMessage });

  const { run } = useDebounceFn(
    () => {
      const { scrollTop = 0 } = scrollRef.current || {};
      const { offsetTop: itemsTop = 0 } = itemsRef.current || {};
      const { offsetTop: detailTop = 0 } = detailRef.current || {};
      if (teachingPlan.page !== 0 && scrollTop < (itemsTop - 44)) {
        onTabChange(0);
      } else if (teachingPlan.page !== 1
        && (scrollTop > (itemsTop - 44)) && (scrollTop < (detailTop - 44))) {
        onTabChange(1);
      } else if (teachingPlan.page !== 2 && (scrollTop > (detailTop - 44))) {
        onTabChange(2);
      }
    },
    {
      wait: 300,
    },
  );

  return (
    <div
      className="pageLayout"
      style={{ maxHeight: '100vh' }}
      ref={scrollRef}
      onScroll={() => {
        if (isUserClick) {
          setIsUserClick(false);
        } else {
          run();
        }
      }}
    >
      <div className="pageLayout__scrollLayout">
        <div style={{ paddingTop: '43.5px' }}>
          <div
            className={styles.fixedTab}
            style={!browser.isMobileBrowser ? {
              width: '375px',
              left: 'calc(50% - 187.5px)',
            } : {}}
          >
            <Tabs
              tabs={teachingPlan.tabs}
              page={teachingPlan.page}
              tabBarUnderlineStyle={{
                borderColor: '#FF4D4F',
              }}
              tabBarActiveTextColor="#FF4D4F"
              onChange={(tab, index) => {
                if (scrollRef && scrollRef.current) {
                  const { offsetTop: itemsTop = 0 } = itemsRef.current || {};
                  const { offsetTop: detailTop = 0 } = detailRef.current || {};
                  if (index === 0) {
                    scrollRef.current.scrollTo(0, 0);
                  } else if (index === 1) {
                    scrollRef.current.scrollTo(0, itemsTop - 44);
                  } else if (index === 2) {
                    scrollRef.current.scrollTo(0, detailTop - 44);
                  }
                }
                setIsUserClick(true);
                onTabChange(index);
              }}
            />
          </div>
          <div>
            <Banner data={teachingPlan.coverList} />
            <div className={styles.infoLayout} style={{ paddingBottom: productTicketList.list && productTicketList.list.length > 0 ? 0 : '12px' }}>
              <ProductTitle title={teachingPlan.title} />
              <div className={`${styles.time} flexLayout center spaceBetween`}>
                <span>
                  {
                    teachingPlan.timeText && (
                      <span>
                        {teachingPlan.timeText}
                        {' '}
                        |
                        {' '}
                      </span>
                    )
                  }
                  <span>
                    共
                    {teachingPlan.itemCount}
                    讲
                  </span>
                </span>
                {
                  teachingPlan.showStudyCount && teachingPlan.studyCount > 0 && (
                    <span>
                      {teachingPlan.studyCount}
                      人在学习
                    </span>
                  )
                }
              </div>
              {
                teachingPlan.joinFlag === 'n' && (
                  <ProductPrice {...teachingPlan.price} />
                )
              }
              {
                teachingPlan.joinFlag === 'n' && (
                  <div>
                    {
                      teachingPlan.featuresList && teachingPlan.featuresList.length > 0 && (
                        <PlanFeatures list={teachingPlan.featuresList} />
                      )
                    }
                    {
                      teachingPlan.sellPoints && teachingPlan.sellPoints.length > 0 && (
                        <PlanSellPoints list={teachingPlan.sellPoints} />
                      )
                    }
                  </div>
                )
              }
              {
                teachingPlan.joinFlag === 'n' && productTicketList.list && productTicketList.list.length > 0
                && (
                  <ProductTicketList style={{ marginLeft: '15px', marginTop: '8px', borderBottom: 'none' }} {...productTicketList} onClick={() => showProductTicketPopup(teachingPlan.productId)} />
                )
              }
            </div>
          </div>
          <ProductModule title="授课教师">
            <ProductTeachers {...teachingPlan.teachers} />
          </ProductModule>
          <div id="ITEMS" ref={itemsRef} style={{ margin: '10px 0' }}>
            <PlanItems
              itemList={teachingPlan.itemList}
              activeKey={teachingPlan.activeKey}
              onOpenChange={onOpenChange}
              joinFlag={teachingPlan.joinFlag}
            />
          </div>
          <div id="DETAIL" ref={detailRef}>
            <ProductModule title="方案详情">
              <div style={{ minHeight: '250px', backgroundColor: '#FFF', padding: '0 10px' }}>
                <ProductMediaList {...mediaList[0]} />
              </div>
            </ProductModule>
          </div>
        </div>
      </div>
      <div className={classNames('pageLayout__bottomLayout', {
        pc: !browser.isMobileBrowser,
      })}
      >
        <ProductSubmitBar
          {...teachingPlan.submitBar}
          onShareClick={() => {
            share();
          }}
          onMenuClick={(res) => {
            if (res.handler) clickHandler(res.handler);
          }}
        />
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
