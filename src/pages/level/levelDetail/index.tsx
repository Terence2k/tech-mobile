import React from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import actions from 'actions';
import { usePage } from 'hooks';
import { IBrowser, IClient } from '@/models/types';

import {
  Header4FileLevel,
  ProductModule,
  ProductMediaList,
  ProductSubmitBar,
} from 'components';

// import styles from './index.scss';
import { namespace } from './model';

const mapStateToProps = (res) => ({
  browser: res.browser as IBrowser,
  client: res.client as IClient,
  state: res[namespace],
});

// const mapDispatchToProps = (dispatch) => bindActionCreators({ ...actions }, dispatch);
const mapDispatchToProps = (dispatch) => ({
  jumpToPage: (path: string, params: object = {}) => {
    dispatch(actions.jumpToPage(path, params));
  },
  showShareMenu: (sharePicUrl) => dispatch(actions.popup.showShareMenu(sharePicUrl)),
  showQrCode: (link: string, tip?: string, onHideHandler?: object) => dispatch(
    actions.popup.showQrCode(link, tip, onHideHandler),
  ),
  // hideShareMenu: () => dispatch(actions.popup.hideShareMenu()),
  onLoad: () => dispatch(actions.onLoad({ namespace })),
  onPullDownRefresh: () => dispatch(actions.onPullDownRefresh({ namespace })),
  onReachBottom: () => dispatch(actions.onReachBottom({ namespace })),
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace })),
  clickHandler: (handler) => {
    dispatch(handler);
  },
});

type IProp = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Page: React.FunctionComponent<any> = (props: any) => {
  const {
    // models
    browser, state,
    // action methods
    // showShareMenu,
    // jumpToPage,
    showQrCode,
    onLoad,
    // onPullDownRefresh,
    onReachBottom,
    onShareAppMessage,
    clickHandler,
  }: IProp = props;
  const [scrollRef] = usePage({ onLoad, onReachBottom, onShareAppMessage });

  const { headerData } = state;

  return (
    <div ref={scrollRef} className="pageLayout">
      <div className="pageLayout__scrollLayout">
        <Header4FileLevel {...headerData} />
        {
          state.preMemo && (
            <ProductModule title={state.preMemo.title}>
              <div style={{ padding: '10px', backgroundColor: '#FFF' }}>
                <ProductMediaList {...state.preMemo.mediaList[0]} />
              </div>
            </ProductModule>
          )
        }
        {
          state.memo && (
            <ProductModule title={state.memo.title}>
              <div style={{ padding: '10px', backgroundColor: '#FFF' }}>
                <ProductMediaList {...state.memo.mediaList[0]} />
              </div>
            </ProductModule>
          )
        }
        {/* <div className={styles.homeworkBtn}>查看学员考级</div> */}
      </div>
      <div className={classNames('pageLayout__bottomLayout', {
        pc: !browser.isMobileBrowser,
      })}
      >
        <ProductSubmitBar
          {...state.submitBar}
          onShareClick={() => showQrCode(window.location.href)}
          onMenuClick={(res: any) => clickHandler(res.handler)}
        />
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
