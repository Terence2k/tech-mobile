import React from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd-mobile';
import { IBrowser, IClient } from '@/models/types';
import classNames from 'classnames';
import actions from 'actions';
import { usePage } from 'hooks';

// 全局组件
import {
  Banner,
  ProductTitle,
  ProductPrice,
  CountStat,
  ProductSubmitBar,
  ProductMediaList,
  // ProductFavorites,
  ProductMembers,
} from 'components';
// 私有组件
import {
  Ranking,
} from './components';
//
import styles from './index.scss';
import { namespace } from './model';

// const isDevelopment = process.env.NODE_ENV === 'development';

const mapStateToProps = (res) => ({
  browser: res.browser as IBrowser,
  client: res.client as IClient,
  state: res[namespace],
});

const mapDispatchToProps = (dispatch: any) => ({
  jumpToPage: (path: string, params: object) => dispatch(actions.jumpToPage(path, params)),
  clickHandler: (handler) => dispatch(handler),
  onLoad: () => dispatch(actions.onLoad({ namespace })),
  onReachBottom: () => dispatch(actions.onReachBottom({ namespace })),
  share: (sharePicUrl: string) => dispatch(actions.popup.showShareMenu(sharePicUrl)),
  showQrCode: (link: string, tip?: string, onHideHandler?: object) => dispatch(
    actions.popup.showQrCode(link, tip, onHideHandler),
  ),
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace })),
});

type IProp = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Page: React.FunctionComponent<any> = (props: any) => {
  // const { shareMethods }: any = React.useContext(layoutsContext);
  const {
    // models
    browser, state,
    // action methods
    clickHandler,
    onLoad,
    onShareAppMessage,
    onReachBottom,
    showQrCode,
  }: IProp = props;

  // const scrollRef = React.useRef<HTMLDivElement>(null);
  // const [isScrollBottom] = useScrollBottom({ ref: scrollRef });

  // React.useEffect(() => {
  //   onLoad();
  // }, [onLoad]);

  // React.useEffect(() => {
  //   if (isScrollBottom) {
  //     onReachBottom();
  //   }
  // }, [isScrollBottom, onReachBottom]);

  const [scrollRef] = usePage({ onLoad, onReachBottom, onShareAppMessage });

  if (state.isLoading) {
    return (<div />);
  }

  return (
    <div ref={scrollRef} className="pageLayout">
      <div className="pageLayout__scrollLayout">
        <Banner data={state.banner || []} />
        <div className={styles.infoLayout}>
          <ProductTitle style={{ padding: '15px 15px 0' }} title={state.productTitle || ''} />
          <ProductPrice style={{ padding: '0 15px', marginTop: '8px' }} {...state.productPrice} />
          <CountStat style={{ padding: '0 15px' }} {...state.countStat} />
          <ProductMembers style={{ padding: '13px 15px 24px' }} {...state.productMembers} name="考试" />
        </div>
        <div style={{ marginTop: '10px' }}>
          <Tabs
            tabs={state.productTab.tabs}
            initialPage={0}
            renderTab={(tab) => <span>{tab.label}</span>}
          >
            <div style={{ padding: '10px', backgroundColor: '#ffffff' }}>
              {state.productMediaList && state.productMediaList.list && (
                <ProductMediaList {...state.productMediaList.list[0]} />
              )}
            </div>
            <Ranking style={{ backgroundColor: '#ffffff' }} {...state.ranking} />
          </Tabs>
        </div>
      </div>
      <div className={classNames('pageLayout__bottomLayout', {
        pc: !browser.isMobileBrowser,
      })}
      >
        <ProductSubmitBar
          onShareClick={() => showQrCode(window.location.href)}
          onMenuClick={(res: any) => clickHandler(res.handler)}
          {...state.productSubmitBar}
        />
      </div>
      {/* 收藏 */}
      {/* <ProductFavorites
        onClick={() => {
          Toast.info('点击了收藏', 3);
        }}
        {...state.productFavorites}
      /> */}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
