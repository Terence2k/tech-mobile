import React from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import { Tabs } from 'antd-mobile';
import actions from 'actions';
import { usePage } from 'hooks';
import { IBrowser, IClient, IUser } from '@/models/types';

import {
  Banner,
  ProductTitle,
  ProductSubmitBar,
  ProductMediaList,
} from 'components';

import { ThemeItem, Notice } from './components';
import { RankItem } from '../components';

import styles from './index.scss';
import { namespace } from './model';

const INFO_ICON = require('./images/infoIcon.png');

// const isDevelopment = process.env.NODE_ENV === 'development';
const saas = GLOBAL_CONFIG.API_URL;
const getExamSubjectShareImg = `${saas}/m/exam/getExamSubjectShareImg`;

const mapStateToProps = (res) => ({
  browser: res.browser as IBrowser,
  client: res.client as IClient,
  user: res.user as IUser,
  state: res[namespace],
});

const mapDispatchToProps = (dispatch: any) => ({
  showShareMenu: (sharePicUrl) => dispatch(actions.popup.showShareMenu(sharePicUrl)),
  // hideShareMenu: () => dispatch(actions.popup.hideShareMenu()),
  onLoad: () => dispatch(actions.onLoad({ namespace })),
  onPullDownRefresh: () => dispatch(actions.onPullDownRefresh({ namespace })),
  onReachBottom: () => dispatch(actions.onReachBottom({ namespace })),
  // tab切换
  onTabChange: (page) => {
    dispatch({ type: `${namespace}/onTabChange`, payload: { page } });
  },
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace })),
});

type IProp = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Page: React.FunctionComponent<any> = (props: any) => {
  const {
    // models
    browser, client, user, state,
    // action methods
    showShareMenu,
    onLoad,
    onReachBottom,
    onShareAppMessage,
    onTabChange,
  }: IProp = props;

  const [scrollRef] = usePage({ onLoad, onReachBottom, onShareAppMessage });
  const [visible, setVisible] = React.useState<boolean>(false);

  const shareUrl = (() => {
    // eslint-disable-next-line camelcase
    const { subject_id: subjectId = '' } = browser.locationQuery;
    const { cid } = client;
    const { userId } = user;

    const time = new Date();
    const timestamp = Date.parse(time.toString());
    // vendor.log('timestamp', timestamp);

    return `${getExamSubjectShareImg}?client_id=${cid}&user_id=${userId}&subject_id=${subjectId}&t=${timestamp}`;
  })();

  return (
    <>
      <div ref={scrollRef} className="pageLayout">
        <div className="pageLayout__scrollLayout">
          <Banner data={state.coverList || []} />
          <div style={{ padding: '15px 10px', backgroundColor: '#FFF' }}>
            <ProductTitle title={state.title || ''} />
          </div>
          <div style={{
            backgroundColor: '#FFF',
            margin: '14px 0 10px',
            padding: '0 0 15px 10px',
            boxShadow: '0px 1px 0px 0px #E4E7ED',
          }}
          >
            <div className={`${styles.moduleHeader} flexLayout spaceBetween center`}>
              <span className={styles.moduleHeaderTitle}>考核说明</span>
              <span className="flexLayout center" onClick={() => setVisible(true)}>
                <img src={INFO_ICON} alt="" className={styles.infoIcon} />
                考级须知
              </span>
            </div>
            {
              state.mediaList && state.mediaList.node.length && (
                <div style={{ padding: '15px 10px 0 0' }}>
                  <ProductMediaList {...state.mediaList} />
                </div>
              )
            }
          </div>
          <Tabs
            tabs={state.tabs}
            page={state.page}
            onChange={(tab, index) => { onTabChange(index); }}
          >
            {
              state.page === 0 && (
                <div>
                  {
                    state.levelList && state.levelList.map((item, index) => (
                      <ThemeItem key={index.toString()} data={item} />
                    ))
                  }
                </div>
              )
            }
            {
              state.page === 1 && (
                <div>
                  {
                    state.myRank && <RankItem isMine="y" mode={2} data={state.myRank} />
                  }
                  {
                    state.userList && state.userList.map(
                      (item, index) => <RankItem key={index.toString()} mode={2} data={item} />,
                    )
                  }
                </div>
              )
            }
          </Tabs>
        </div>
        <div className={classNames('pageLayout__bottomLayout', {
          pc: !browser.isMobileBrowser,
        })}
        >
          <ProductSubmitBar
            onShareClick={() => showShareMenu(shareUrl)}
            {...state.submitBar}
          />
        </div>
      </div>
      {
        visible && (
          // @ts-ignore
          <Notice visible onClose={() => setVisible(false)} />
        )
      }
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
