import React from 'react';
import { connect } from 'dva';
import { IBrowser, IClient } from '@/models/types';
import classNames from 'classnames';
import actions from 'actions';
import { usePage } from 'hooks';

// import { Toast } from 'antd-mobile';

// 全局组件
import {
  Banner,
  ProductTitle,
  ProductPrice,
  CountStat,
  Tag,
  ProductTicketList,
  ProductModule,
  ProductSubmitBar,
  ProductMediaList,
  // ProductFavorites,
  ProductDaterangeFormat,
} from 'components';
// 私有组件
// import {
// } from './components';
//
import styles from './index.scss';
import { namespace } from './model';

// const isDevelopment = process.env.NODE_ENV === 'development';

const mapStateToProps = (res: any) => ({
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
  showProductTicketPopup: (productId: string) => {
    dispatch(actions.ticket.showProductTicketList(productId));
  },
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
    share,
    showProductTicketPopup,
  }: IProp = props;

  usePage({ onLoad, onShareAppMessage });

  return (
    <div className="pageLayout">
      <div className="pageLayout__scrollLayout">
        <Banner data={state.banner || []} />
        <div className={styles.infoLayout}>
          <ProductTitle style={{ padding: '15px 15px 0' }} title={state.productTitle || ''} />
          <ProductPrice style={{ padding: '0 15px', marginTop: '8px' }} {...state.productPrice} />
          <CountStat style={{ padding: '0 15px' }} {...state.countStat} />
          <div className="flexLayout" style={{ padding: '10px 15px 15px' }}>
            {state.tag && (<Tag {...state.tag}>{state.tag.text}</Tag>)}
            {
              state.productDaterangeFormat && (
                <ProductDaterangeFormat
                  style={{ marginLeft: '7px' }}
                  {...state.productDaterangeFormat}
                />
              )
            }
          </div>
          {
            state.productTicketList && !!state.productTicketList.list.length && (
              <ProductTicketList
                style={{ marginLeft: '15px', marginTop: '8px', borderBottom: 'none' }}
                onClick={() => showProductTicketPopup(state.productId)}
                {...state.productTicketList}
              />
            )
          }
        </div>
        {
          // 图文区块
          !!state.productMediaList && (
            <ProductModule title={state.productMediaList.name} style={{ padding: '0 10px' }}>
              <ProductMediaList {...state.productMediaList.list[0]} />
            </ProductModule>
          )
        }
      </div>
      <div className={classNames('pageLayout__bottomLayout', {
        pc: !browser.isMobileBrowser,
      })}
      >
        <ProductSubmitBar
          onShareClick={() => share(state.sharePicUrl)}
          onMenuClick={(res: any) => clickHandler(res.handler)}
          {...state.productSubmitBar}
        />
      </div>
      {/* 收藏（暂时没有收藏） */}
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
