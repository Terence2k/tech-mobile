import React from 'react';
import { Flex } from 'antd-mobile';
import { connect } from 'dva';
import actions from 'actions';
import { usePage } from 'hooks';
import { IUser } from '@/models/types';

// 导入公共组件
import { Panel } from 'components';

// 导入私有组件
import MineHeader from './components/mineHeader';
import MineMemberCard from './components/mineMemberCard';
import MinePanelItem from './components/minePanelItem';

import styles from './index.scss';
import { namespace } from './model';

const mapStateToProps = (state: any) => ({
  user: state.user as IUser,
  state: state[namespace],
});

const mapDispatchToProps = (dispatch: any) => ({
  jumpToPage: (path: string, params: object = {}) => {
    dispatch(actions.jumpToPage(path, params));
  },
  onLoad: () => dispatch(actions.onLoad({ namespace })),
  onReachBottom: () => dispatch(actions.onReachBottom({ namespace })),
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace })),
});
type IProp = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Page: React.FunctionComponent<any> = (props: any) => {
  const {
    user,
    state,
    // action methods
    jumpToPage,
    onLoad,
    onReachBottom,
    onShareAppMessage,
  }: IProp = props;
  usePage({ onLoad, onReachBottom, onShareAppMessage });

  const { nickname, headImgUrl } = user;
  const { myMembercardInfo = {}, panels = [] } = state;

  const panelStyle = {
    backgroundColor: '#fff',
    padding: '12px 24px 16px 24px',
    marginTop: '10px',
  };
  // console.log('oanels', panels);

  return (
    <div className={styles.minePage}>
      <div className={styles.minePageHeader}>
        <MineHeader nickname={nickname} headImgUrl={headImgUrl} onClick={() => jumpToPage('/mine/info')} />
        <MineMemberCard memberCardInfo={myMembercardInfo} onClick={() => jumpToPage('/memberCard')} />
      </div>
      {
        panels && panels.map((panel, index) => (
          <Panel key={String(index)} title={panel.title} showAll="n" style={panelStyle}>
            <Flex wrap="wrap" style={{ width: '100%' }}>

              {
                panel.list && panel.list.length > 0 && panel.list.map((item, idx) => (
                  <MinePanelItem
                    key={idx.toString()}
                    name={item.name}
                    icon={item.icon}
                    jumpInfo={item.jumpInfo}
                    count={item.count}
                  />
                ))
              }
            </Flex>
          </Panel>
        ))
      }
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
