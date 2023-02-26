import React from 'react';
import { withRouter, Redirect } from 'umi';
import { Location, LocationState, History } from 'History';
import { connect } from 'dva';
import classNames from 'classnames';
import actions from 'actions';
import { useScroll, useDebounceFn } from 'hooks';
import { TState } from '@/models/types';

import {
  ShareMenu,
  ShareCard,
  ShareQrCode,
  PopupImage,
  PopupTicket,
  PopupMembercard,
  PopupProductTicket,
  PreviewPicture,
  PreviewVideo,
} from 'components';

import styles from './index.scss';

const mapStateToProps = (state: TState) => ({
  browser: state.browser,
  client: state.client,
  popup: state.popup,
  ticket: state.ticket,
  userId: state.user.userId as string,
});

const mapDispatchToProps = (dispatch) => ({
  jumpToPage: (path: string, params: object = {}) => dispatch(actions.jumpToPage(path, params)),

  hideShareMenu: () => dispatch(actions.popup.hideShareMenu()),

  showCard: (picUrl: string, tip: string) => dispatch(actions.popup.showCard(picUrl, tip)),
  hideCard: () => dispatch(actions.popup.hideCard()),

  hideQrCode: () => dispatch(actions.popup.hideQrCode()),

  showImage: (picUrl: string) => dispatch(actions.popup.showImage(picUrl)),
  hideImage: () => dispatch(actions.popup.hideImage()),

  showTicket: (ticketListInfo: object) => dispatch(actions.popup.showTicket(ticketListInfo)),
  hideTicket: () => dispatch(actions.popup.hideTicket()),

  showMemberCard: (ticketListInfo: object) => dispatch(actions.popup.showTicket(ticketListInfo)),
  hideMemberCard: () => dispatch(actions.popup.hideMemberCard()),

  hideTicketList: () => dispatch(actions.ticket.hideTicketList()),

  hidePreviewPicture: () => dispatch(actions.popup.hidePreviewPicture()),
  hidePreviewVideo: () => dispatch(actions.popup.hidePreviewVideo()),
});

type IProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & {
  children: any,
  location: Location<LocationState>,
  history: History,
};

const BasicLayout: React.FC = (props: any) => {
  const {
    browser,
    client,
    popup,
    ticket,
    userId,
    children, location,
    jumpToPage,
    hideShareMenu,
    showCard,
    hideCard,
    hideQrCode,
    hideImage,
    hideTicket,
    hideMemberCard,
    hideTicketList,
    hidePreviewPicture,
    hidePreviewVideo,
  }: IProps = props;

  const rootElement = document.getElementById('root');
  const scroll = useScroll(rootElement);
  const scrollRefs = React.useRef<{ [key: string]: number }>({});
  const popupRefs = React.useRef<{ [key: string]: Function }>({});
  // 统一去掉当前路由最后的'/'
  let currentRoutePath;
  if (location.pathname === '/') {
    currentRoutePath = '/index';
  } else {
    currentRoutePath = location.pathname.endsWith('/') ? location.pathname.slice(0, location.pathname.length - 1) : location.pathname;
  }
  const [recordRoutePath, setRecordRoutePath] = React.useState<string>(currentRoutePath);
  const [isScrolling, setIsScrolling] = React.useState<boolean>(false);

  const { run, cancel } = useDebounceFn(
    (top) => {
      if (rootElement) {
        rootElement.scrollTo({
          left: 0,
          top,
          behavior: 'auto',
        });
        // console.log(location.pathname, 'scrollTo', top);
      }
    },
    {
      wait: 300,
    },
  );

  React.useEffect(() => {
    if (!currentRoutePath) return () => { };

    const key = currentRoutePath.replace(/\//g, '_');
    if (recordRoutePath !== currentRoutePath) {
      const pathnames = Object.keys(scrollRefs.current);
      if (pathnames.includes(key)) {
        if (browser.isJustPopState) {
          const top = scrollRefs.current[key];
          delete scrollRefs.current[key];
          delete scrollRefs.current[recordRoutePath.replace(/\//g, '_')];
          setIsScrolling(true);
          setTimeout(() => {
            setIsScrolling(false);
          }, 600);
          run(top);
        }
      } else {
        setRecordRoutePath(currentRoutePath);
      }
    } else {
      scrollRefs.current[key] = scroll.top || 0;
      // console.log(location.pathname, 'top', scroll.top);
    }
    return () => {
      cancel();
    };
  }, [recordRoutePath, scroll.top, run, cancel, currentRoutePath, browser.isJustPopState]);

  React.useEffect(() => {
    if (!currentRoutePath) return () => { };

    const key = currentRoutePath.replace(/\//g, '_');
    const pathnames = Object.keys(popupRefs.current);
    if (pathnames.length <= 0 || pathnames.includes(key)) {
      if (popup.previewPicture.visiable) {
        popupRefs.current[key] = hidePreviewPicture;
      }
      if (popup.previewPicture.visiable) {
        popupRefs.current[key] = hidePreviewVideo;
      }
      if (popup.shareMenu.visible) {
        popupRefs.current[key] = hideShareMenu;
      }
      if (popup.card.visible) {
        popupRefs.current[key] = hideCard;
      }
      if (popup.qrCode.visible) {
        popupRefs.current[key] = hideQrCode;
      }
      if (popup.image.visible) {
        popupRefs.current[key] = hideImage;
      }
      if (popup.ticket.visible) {
        popupRefs.current[key] = hideTicket;
      }
      if (popup.memberCard.visible) {
        popupRefs.current[key] = hideMemberCard;
      }
      if (ticket.productTicketInfo.popupVisible) {
        popupRefs.current[key] = hideTicketList;
      }
    } else if (pathnames.length > 0) {
      // console.log('路由切换了', key);
      Object.values(popupRefs.current).forEach((item) => {
        console.log('call', item.name);
        if (typeof item === 'function') {
          item();
        }
      });
      popupRefs.current = {};
    }
    return () => { };
  }, [
    popup.shareMenu.visible,
    popup.card.visible,
    popup.qrCode.visible,
    popup.image.visible,
    popup.ticket.visible,
    popup.memberCard.visible,
    ticket.productTicketInfo.popupVisible,
    hideShareMenu, hideCard, hideQrCode, hideImage, hideTicket, hideMemberCard, hideTicketList,
    hidePreviewPicture,
    hidePreviewVideo,
    currentRoutePath,
    popup.previewPicture.visiable,
    popup.previewView.visiable,
  ]);

  React.useEffect(() => {
    if (client.tabPaths.includes(currentRoutePath)) {
      const tab = [...client.tabbar].filter(
        (item) => item.webUrl && item.webUrl.length >= 2,
      ).find((item) => {
        const webUrl = item.webUrl.endsWith('/') ? item.webUrl.slice(0, item.webUrl.length - 1) : item.webUrl;
        const tabPaths = client.tabPaths.filter((i) => i.match(webUrl)?.join(''));

        return tabPaths.includes(currentRoutePath);
      });

      if (tab) {
        document.title = tab.text;
      }
    }
  }, [client.tabPaths, client.tabbar, currentRoutePath]);

  if (
    !(/(\/closed|\/closed\/)/).test(currentRoutePath)
    && client.clientInfoM
    && (client.clientInfoM.closed || client.clientInfoM.is_expire)
  ) {
    return <Redirect to={`/closed${location.search}`} />;
  }

  // index被隐藏，去第一个tab
  if (client.tabPaths.length > 0 && currentRoutePath === '/index' && !client.tabPaths.includes(currentRoutePath)) {
    console.log(client.tabPaths, currentRoutePath);
    let webUrl = client.tabPaths[0];
    webUrl = webUrl.endsWith('/') ? webUrl.slice(0, webUrl.length - 1) : webUrl;
    return <Redirect to={`${webUrl}${location.search}`} />;
  }

  return (
    <>
      <div className={styles.layout} style={{ opacity: isScrolling ? 0 : 1 }}>
        <div className={classNames(styles.layout__content, {
          [styles.pc]: !browser.isMobileBrowser,
        })}
        >
          {
            children
          }
        </div>
      </div>

      {
        client.tabPaths.includes(currentRoutePath) && (
          <div className={classNames(styles.tabbarLayout, {
            [styles.pc]: !browser.isMobileBrowser,
          })}
          >
            {
              [...client.tabbar].filter(
                (item) => item.webUrl && item.webUrl.length >= 2,
              ).map((item, index) => {
                const webUrl = item.webUrl.endsWith('/') ? item.webUrl.slice(0, item.webUrl.length - 1) : item.webUrl;

                const tabPaths = client.tabPaths.filter((i) => i.match(webUrl)?.join(''));
                const isSelected = tabPaths.includes(currentRoutePath);
                return (
                  <div
                    key={index.toString()}
                    className={styles.tab}
                    onClick={() => {
                      if (currentRoutePath !== item.webUrl) {
                        jumpToPage(item.webUrl);
                      }
                    }}
                  >
                    <img className={styles.icon} src={isSelected ? item.selectedIconPath : item.iconPath} alt="" />
                    <div className={classNames(styles.label, {
                      [styles.selected]: isSelected,
                    })}
                    >
                      {item.text}
                    </div>
                  </div>
                );
              })
            }
          </div>
        )
      }
      {
        ![...client.tabPaths].includes(currentRoutePath) && !browser.isMiniProgramBrowser && (
          <div
            className={classNames(styles.shortcutsLayout, {
              [styles.pc]: !browser.isMobileBrowser,
              [styles.login]: currentRoutePath === '/login',
            })}
            onClick={() => jumpToPage('/index')}
          >
            <div>首页</div>
          </div>
        )
      }

      {/* 分享入口 */}
      <ShareMenu
        visible={popup.shareMenu.visible}
        menus={popup.shareMenu.menus}
        onClose={() => hideShareMenu()}
        onClick={({ type }) => {
          if (type === 'card') {
            hideShareMenu();
            showCard(popup.shareMenu.sharePicUrl, browser.isMobileBrowser ? '长按保存海报' : '右键保存海报');
          }
        }}
      />

      {/* 分享卡片（海报） */}
      <ShareCard
        visible={popup.card.visible}
        webShareImage={popup.card.picUrl}
        tip={popup.card.tip}
        onClose={() => hideCard()}
      />

      {/* 分享二维码 */}
      <ShareQrCode
        visible={popup.qrCode.visible}
        qrCodeLink={popup.qrCode.link}
        tip={popup.qrCode.tip}
        onClose={() => hideQrCode()}
      />

      {/* 图片弹窗（目前证书在使用） */}
      <PopupImage
        onClose={() => { hideImage(); }}
        {...popup.image}
      />

      {/* 优惠券 */}
      <PopupTicket
        {...popup.ticket}
        onClick={() => {
          hideTicket();
          jumpToPage(popup.ticket.path);
        }}
        onNext={() => hideTicket()}
      />

      {/* 会员卡 */}
      <PopupMembercard
        {...popup.memberCard}
        onClick={() => {
          hideMemberCard();
          jumpToPage(popup.memberCard.path, popup.memberCard.params);
        }}
        onNext={() => hideMemberCard()}
      />

      {/* 指定商品优惠券弹框 */}
      <PopupProductTicket
        visible={ticket.productTicketInfo.popupVisible}
        receivedTicketList={ticket.productTicketInfo.receivedTicketList}
        ticketList={ticket.productTicketInfo.ticketList}
        onClose={() => {
          hideTicketList();
        }}
      />
      <PreviewPicture
        visible={popup.previewPicture.visiable}
        onClose={hidePreviewPicture}
      />
      <PreviewVideo
        visible={popup.previewView.visiable}
        onClose={hidePreviewVideo}
      />
    </>
  );
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BasicLayout));
