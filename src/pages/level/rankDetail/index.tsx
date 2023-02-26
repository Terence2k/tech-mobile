import React, { useRef } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import actions from 'actions';
import { usePage, useSize } from 'hooks';
import { IBrowser, IClient } from '@/models/types';

import { ThemeSelect } from './components';
import { RankItem } from '../components';
//
import styles from './index.scss';
import { namespace } from './model';

const mapStateToProps = (res) => ({
  browser: res.browser as IBrowser,
  client: res.client as IClient,
  state: res[namespace],
});

const mapDispatchToProps = (dispatch: any) => ({
  jumpToPage: (path: string, params: object = {}) => {
    dispatch(actions.jumpToPage(path, params));
  },
  showShareMenu: (sharePicUrl) => dispatch(actions.popup.showShareMenu(sharePicUrl)),
  onLoad: () => dispatch(actions.onLoad({ namespace })),
  onReachBottom: () => dispatch(actions.onReachBottom({ namespace })),
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace })),
  // 切换考级主题
  subjectChange: (subject) => {
    dispatch({ type: `${namespace}/subjectChange`, payload: { subject } });
  },
  getExamRankingResult: () => {
    dispatch({ type: `${namespace}/getExamRankingResult` });
  },
});

type IProp = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Page: React.FunctionComponent<any> = (props: any) => {
  const {
    // models
    browser, state,
    // action methods
    onLoad,
    onReachBottom,
    onShareAppMessage,
    subjectChange,
    getExamRankingResult,
  }: IProp = props;

  const themeRef = useRef<HTMLDivElement>(null);
  const themeSize = useSize(themeRef);
  const isMounted = useRef<boolean>(false);
  usePage({ onLoad, onReachBottom, onShareAppMessage });

  React.useEffect(() => {
    if (state.subjectList && state.subject && !isMounted.current) {
      isMounted.current = true;
    } else if (isMounted.current) {
      getExamRankingResult();
    }
  }, [getExamRankingResult, state.subjectList, state.subject]);

  return (
    <div className={styles.layout}>
      <div
        ref={themeRef}
        className={classNames(styles.layout__theme, {
          [styles.pc]: !browser.isMobileBrowser,
        })}
      >
        <ThemeSelect
          browser
          list={state.subjectList}
          value={state.subject}
          onChange={(subject) => subjectChange(subject)}
        />
      </div>
      <div className={styles.layout__myrank} style={{ marginTop: `${themeSize.height}px` }}>
        {
          state.myRank && (
            <RankItem isMine="y" mode={2} data={state.myRank} />
          )
        }
      </div>
      {
        state.userList && state.userList.map(
          (item, index) => <RankItem key={index.toString()} mode={2} data={item} />,
        )
      }
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
