import React, { useState } from 'react';
import classNames from 'classnames';
import { connect } from 'dva';
import actions from 'actions';
import { usePage, useUpdate } from 'hooks';
import { IBrowser, IClient } from '@/models/types';

// import { Link } from 'umi';
// import { formatMessage } from 'umi-plugin-locale';

// 全局组件
import {
  Popup,
  WxJump,
} from 'components';

import styles from './index.scss';
import { namespace } from './model';

const Layout = {
  LinearLayout: 'LinearLayout',
  GridLayout: 'GridLayout',
};

const mapStateToProps = (res) => ({
  browser: res.browser as IBrowser,
  client: res.client as IClient,
  state: res[namespace],
});

const mapDispatchToProps = (dispatch) => ({
  showShareMenu: (sharePicUrl) => dispatch(actions.popup.showShareMenu(sharePicUrl)),
  // hideShareMenu: () => dispatch(actions.popup.hideShareMenu()),
  onLoad: () => dispatch(actions.onLoad({ namespace })),
  onPullDownRefresh: () => dispatch(actions.onPullDownRefresh({ namespace })),
  onReachBottom: () => dispatch(actions.onReachBottom({ namespace })),
  updateCurrenttype: (payload) => dispatch({ type: `${namespace}/updateCurrenttype`, payload }),
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace })),
});

type IProp = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

let currentIndex = 0;

const Menus: React.FunctionComponent<any> = (props: any) => {
  const update = useUpdate();
  const {
    onClose, onConfirm, state,
  } = props;

  return (
    <div>
      <div className={styles.catalogLayout}>
        <div
          className={styles.catalogLayout__hd}
          onClick={() => onClose()}
        />
        <div className={styles.catalogLayout__bd}>
          <div className={styles.title}>类型</div>
          <div className={styles.tagLayout}>
            {
              state.objectTypes && state.objectTypes.map((item, index) => (
                <div
                  key={index.toString()}
                  className={classNames(styles.tagCell, {
                    [styles.selected]: index === currentIndex,
                  })}
                  onClick={() => {
                    currentIndex = index;
                    update();
                  }}
                >
                  {item.label}
                </div>
              ))
            }
          </div>
          <div className={styles.menus}>
            <div onClick={() => { currentIndex = 0; }}>重置</div>
            <div
              className={styles.confirm}
              onClick={() => {
                onClose();
                onConfirm({ ...state.objectTypes[currentIndex] });
              }}
            >
              确定
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Page: React.FunctionComponent<any> = (props: any) => {
  const {
    // models
    browser, client, state,
    // action methods
    updateCurrenttype,
    onLoad,
    // onPullDownRefresh,
    onReachBottom,
    onShareAppMessage,
  }: IProp = props;

  usePage({ onLoad, onReachBottom, onShareAppMessage });
  const [currentLayout, setCurrentLayout] = useState(Layout.GridLayout);
  const [visible, setVisible] = useState(false);

  const isPc = !browser.isMobileBrowser;
  // console.log('isPc', isPc);

  const handleUpdateLayout = () => {
    const layout = currentLayout === Layout.LinearLayout ? Layout.GridLayout : Layout.LinearLayout;
    setCurrentLayout(layout);
  };

  const handleUpdataObject = () => {
    setVisible(!visible);
  };

  const objectTypeChinese = {
    200: '录播课',
    312: '直播',
    314: '综合课',
    321: '预约',
    311: '打卡',
    204: '资料',
    216: '实体商品',
    208: '考级',
    300: '文章',
    315: '考试',
    335: '活动报名',
  };

  React.useEffect(() => {
    if (state.IconNavigationDetail) {
      document.title = state.IconNavigationDetail.title || '聚合';
    }
  }, [state.IconNavigationDetail]);

  const topbarLayoutItem = (item, index) => (
    <div
      key={index.toString()}
      className={styles.catalogCell}
    >
      <div className={styles.catalogCell__hd}>
        <img className={styles.icon} src={item.detailInfo.image} alt="" />
      </div>
      <div className={styles.catalogCell__bd}>
        <div className="flexLayout column">
          <div className={styles.title}>{item.detailInfo.title || ''}</div>
          {
            item.objectType === 315 && (
              <div className={classNames(styles.examLayout, 'flexLayout')}>
                {
                  item.detailInfo.duration && (
                    <div>
                      考试时长：
                      {item.detailInfo.duration / 60}
                      分钟
                    </div>
                  )
                }
                {
                  !item.detailInfo.duration && (
                    <div>考试时长：不限时</div>
                  )
                }
                <div style={{ marginLeft: '4px' }}>
                  题目数：
                  {item.detailInfo.questionCount}
                </div>
              </div>
            )
          }
          {
            item.detailInfo.subContent && (
              <div className="flexLayout center">
                {
                  (item.objectType === 312 || item.objectType === 311) && (
                    <div className={styles.iconTime} />
                  )
                }
                <div className={styles.subTitle}>{item.detailInfo.subContent}</div>
              </div>
            )
          }
          {
            item.detailInfo.endTime && (
              <div className="flexLayout center" style={{ marginTop: '4px' }}>
                <div className={styles.iconTime} />
                <div className={styles.subTitle}>
                  截止时间：
                  {item.detailInfo.endTime}
                </div>
              </div>
            )
          }
        </div>
        <div className="flexLayout center spaceBetween">
          {
            item.objectType && (
              <div className={styles.tag}>{objectTypeChinese[item.objectType]}</div>
            )
          }
          {
            item.detailInfo.price > 0 && (
              <div className="base-price-layout" style={{ marginTop: 0 }}>
                {
                  client.miniResourceList.includes('1313') && item.detailInfo.originalPrice && (
                    <div className="base-price-layout__price base-price-layout__original">
                      <div className="unit">￥</div>
                      <div>{item.detailInfo.originalPrice}</div>
                    </div>
                  )
                }
                <div className="base-price-layout__price">
                  <div className="unit">￥</div>
                  <div>{item.detailInfo.price}</div>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );

  const gridLayoutItem = (item, index) => (
    <div
      key={index.toString()}
      className={classNames(styles.catalogGrid__item, {
        [styles.pc]: isPc,
      })}
    >
      <img
        className={classNames(styles.icon, {
          [styles.pc]: isPc,
        })}
        src={item.detailInfo.image}
        alt=""
      />
      <div className={styles.title}>{item.detailInfo.title || ''}</div>
      {
        item.objectType === 315 && (
          <div className="examLayout flexLayout column" style={{ alignItems: 'flex-start' }}>
            {
              item.detailInfo.duration && (
                <div>
                  考试时长：
                  {item.detailInfo.duration / 60}
                  分钟
                </div>
              )
            }
            {
              !item.detailInfo.duration && (
                <div>考试时长：不限时</div>
              )
            }
            <div>
              题目数：
              {item.detailInfo.questionCount}
            </div>
          </div>
        )
      }
      {
        item.detailInfo.subContent && (
          <div className="flexLayout center" style={{ margin: '4px auto 0' }}>
            {
              (item.objectType === 312 || item.objectType === 311) && (
                <div className={styles.iconTIme} />
              )
            }
            <div className={styles.subTitle}>{item.detailInfo.subContent}</div>
          </div>
        )
      }
      {
        item.detailInfo.endTime && (
          <div className="flexLayout center" style={{ margin: '4px auto 0' }}>
            <div className={styles.iconTIme} />
            <div className={styles.subTitle}>
              截止时间：
              {item.detailInfo.endTime}
            </div>
          </div>
        )
      }
      <div className="flexLayout center spaceBetween" style={{ margin: '8px auto 0' }}>
        {
          item.objectType && (
            <div className={styles.tag}>{objectTypeChinese[item.objectType]}</div>
          )
        }
      </div>
      {
        item.detailInfo.price > 0 && (
          <div className="base-price-layout" style={{ marginTop: 0 }}>
            <div className="base-price-layout__price">
              <div className="unit" style={{ fontSize: '10px' }}>￥</div>
              <div style={{ fontSize: '16px' }}>{item.detailInfo.price}</div>
            </div>
            {
              client.miniResourceList.includes('1313') && item.detailInfo.originalPrice && (
                <div className="base-price-layout__price base-price-layout__original">
                  <div className="unit">￥</div>
                  <div>{item.detailInfo.originalPrice}</div>
                </div>
              )
            }
          </div>
        )
      }
    </div>
  );

  const topbarLayoutItemWrapper = (item, index) => (
    <WxJump
      {...item.detailInfo.jumpInfo}
    >
      { topbarLayoutItem(item, index)}
    </WxJump>
  );

  const gridLayoutItemWrapper = (item, index) => (
    <WxJump
      {...item.detailInfo.jumpInfo}
    >
      {gridLayoutItem(item, index)}
    </WxJump>
  );

  return (
    <>
      <div className={styles.layout}>
        <div className={styles.topbarLayout}>
          <div
            className={classNames(styles.icon, styles.iconStyle, styles.iconStyle_grid)}
            onClick={() => handleUpdateLayout()}
          />
          <div
            className={classNames(styles.icon, styles.iconObject)}
            onClick={() => handleUpdataObject()}
          />
        </div>
        {
          currentLayout === Layout.LinearLayout
          && state.catalogList
          && state.catalogList.map((item, index) => topbarLayoutItemWrapper(item, index))
        }
        {
          currentLayout === Layout.GridLayout && (
            <div className={styles.catalogGrid}>
              {
                state.catalogList
                && state.catalogList.map((item, index) => gridLayoutItemWrapper(item, index))
              }
            </div>
          )
        }
      </div>
      <Popup
        type="right"
        isActive={visible}
        onSetActive={() => setVisible(false)}
        size={{ width: browser.isMobileBrowser ? '100%' : '375px', height: 'auto' }}
        content={(
          <Menus
            onConfirm={(res) => updateCurrenttype({ currentType: { ...res } })}
            onClose={() => setVisible(false)}
            {...props}
          />
        )}
      />
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
