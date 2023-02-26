import React from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd-mobile';
import { IBrowser } from '@/models/types';
import { usePage } from 'hooks';
import actions from 'actions';

import { MemberCardItem, TypeSelect } from './components';

import styles from './index.scss';

const mapStateToProps = (state: any) => ({
  browser: state.browser as IBrowser,
  memberCardIndex: state.memberCardIndex,
});

const mapDispatchToProps = (dispatch: any) => ({
  // tab切换
  onTabChange: (page) => {
    dispatch({ type: 'memberCardIndex/onTabChange', payload: { page } });
  },
  onLoad: () => {
    dispatch({ type: 'memberCardIndex/onLoad' });
  },
  onReachBottom: () => {
    dispatch({ type: 'memberCardIndex/onReachBottom' });
  },
  onStatusChange: (status) => {
    dispatch({ type: 'memberCardIndex/onStatusChange', payload: { status } });
  },
  jumpToPage: (path: string, params: object = {}) => {
    dispatch(actions.jumpToPage(path, params));
  },
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace: 'memberCardIndex' })),
});

type IProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

const Page: React.FC<any> = (props: any) => {
  const {
    browser, memberCardIndex, onTabChange, onLoad, onReachBottom, onShareAppMessage,
    onStatusChange, jumpToPage,
  }: IProps = props;

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

  const list = memberCardIndex.page === 0
    ? memberCardIndex.memberCardList : memberCardIndex.hasList;
  return (
    <div ref={scrollRef} className="pageLayout">
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
              tabs={memberCardIndex.tabs}
              page={memberCardIndex.page}
              onChange={(tab, index) => { onTabChange(index); }}
            />
          </div>
          <div style={{ padding: '15px' }}>
            {
              memberCardIndex.page === 1
              && (
                <TypeSelect
                  list={memberCardIndex.list}
                  active={memberCardIndex.status}
                  onChange={(status) => onStatusChange(status)}
                />
              )
            }
            {
              (!list || !list.length) && <p style={{ textAlign: 'center', lineHeight: '100px' }}>暂无数据</p>
            }
            {
              list.map((item, index) => (
                <MemberCardItem
                  key={index.toString()}
                  mode={memberCardIndex.page === 0 ? 1 : 2}
                  data={item}
                  isMobile={browser.isMobileBrowser}
                  userData={memberCardIndex.userData}
                  onClick={() => {
                    jumpToPage('/memberCard/detail', { membercard_id: item.memberCardId });
                  }}
                />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
