import React from 'react';
import { connect } from 'dva';
import actions from 'actions';
import { usePage } from 'hooks';
import {
  Panel,
  CardTpl2,
} from 'components';
import { IBrowser, IClient, IUser } from '@/models/types';
import getImageHeight from '@/common/getImageHeight';

import {
  Header,
  RankTab,
  TopThree,
} from './components';

import {
  RankItem,
} from '../components';

import styles from './index.scss';
import { namespace } from './model';

const tpl2Height = getImageHeight(2, 166 / 343);

// const isDevelopment = process.env.NODE_ENV === 'development';
const saas = GLOBAL_CONFIG.API_URL;
const getShareImage = `${saas}/m/course/getShareImage`;

const mapStateToProps = (res) => ({
  browser: res.browser as IBrowser,
  client: res.client as IClient,
  user: res.user as IUser,
  state: res[namespace],
});

const mapDispatchToProps = (dispatch: any) => ({
  jumpToPage: (path: string, params: object = {}) => {
    dispatch(actions.jumpToPage(path, params));
  },
  showShareMenu: (sharePicUrl) => dispatch(actions.popup.showShareMenu(sharePicUrl)),
  // hideShareMenu: () => dispatch(actions.popup.hideShareMenu()),
  onLoad: () => dispatch(actions.onLoad({ namespace })),
  onPullDownRefresh: () => dispatch(actions.onPullDownRefresh({ namespace })),
  onReachBottom: () => dispatch(actions.onReachBottom({ namespace })),
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace })),
  // tab切换
  onTabClick: (currentTab) => {
    dispatch({ type: `${namespace}/onTabClick`, payload: { currentTab } });
  },
  getExamRankingResult: () => dispatch({ type: `${namespace}/getExamRankingResult` }),
});

type IProp = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Page: React.FunctionComponent<any> = (props: any) => {
  const {
    // models
    client, user, state,
    // action methods
    jumpToPage,
    showShareMenu,
    onLoad,
    onReachBottom,
    onShareAppMessage,
    onTabClick,
    getExamRankingResult,
  }: IProp = props;
  usePage({ onLoad, onReachBottom, onShareAppMessage });

  const shareUrl = (() => {
    /* eslint-disable camelcase */
    const { cid } = client;
    const { userId } = user;

    const time = new Date();
    const timestamp = Date.parse(time.toString());
    // vendor.log('timestamp', timestamp);

    return `${getShareImage}?client_id=${cid}&user_id=${userId}&t=${timestamp}`;
  })();

  React.useEffect(() => {
    getExamRankingResult();
  }, [getExamRankingResult, state.currentTab]);

  const { userList = [] } = state;

  return (
    <div className={styles.basicLayout}>
      {
        state.userData && (
          <Header
            userData={state.userData}
            levelData={state.levelData}
            subjectList={state.subjectList}
            onShare={() => showShareMenu(shareUrl)}
          />
        )
      }
      <Panel title="等级考核" allFlag="n" showAll="n" style={{ marginTop: '24px' }}>
        <div className={styles.cardLayout}>
          {
            state.subjectList && state.subjectList.map((item, index) => (
              <div
                key={index.toString()}
                className={styles.cardItem}
                onClick={() => jumpToPage('/themeDetail', { subject_id: item.subjectId })}
              >
                <CardTpl2 mode={8} data={item} showPrice={false} imageHeight={tpl2Height} />
              </div>
            ))
          }
        </div>
      </Panel>
      {
        client.miniResourceList.includes('160201') && (
          <Panel title="排行榜" allFlag="n" showAll="n" style={{ marginTop: '12px' }}>
            <div style={{ padding: '16px 0' }}>
              <div style={{ textAlign: 'center' }}>
                {
                  state.rankTabs && (
                    <RankTab
                      tabs={state.rankTabs}
                      active={state.currentTab}
                      onTabClick={(res) => onTabClick(res)}
                    />
                  )
                }
              </div>
              {
                userList && userList.length > 0 && (
                  <>
                    {
                      state.myRank && (
                        <div style={{ marginTop: '16px' }}>
                          <RankItem isMine="y" data={state.myRank} />
                        </div>
                      )
                    }
                    <TopThree list={userList.slice(0, 3)} />
                    <div style={{ padding: '0 16px' }}>
                      {
                        userList.slice(3, 10).map(
                          (item, index) => <RankItem key={index.toString()} data={item} />,
                        )
                      }
                    </div>
                  </>
                )
              }
              {
                userList && userList.length <= 0 && (
                  <div className={styles.emptyLayout}>
                    <div className={styles.icon} />
                    <div className={styles.tip}>暂无排行情况</div>
                  </div>

                )
              }
              {
                userList.length > 10
                && (
                  <div
                    style={{
                      color: 'rgba(0, 0, 0, 0.65)',
                      fontSize: '12px',
                      textAlign: 'center',
                      marginTop: '8px',
                      cursor: 'pointer',
                    }}
                    onClick={() => jumpToPage('/rankDetail')}
                  >
                    查看更多
                  </div>
                )
              }
              {/* <div className={styles.homeworkBtn}>学员精选作业</div> */}
            </div>
          </Panel>
        )
      }
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
