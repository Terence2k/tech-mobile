import React from 'react';
import { connect } from 'dva';
import actions from 'actions';
import { Banner, CardTpl1, CardTpl3 } from 'components';
import { usePage } from 'hooks';
import getImageHeight from '@/common/getImageHeight';

import styles from './index.scss';
import { namespace } from './model';

const mapStateToProps = (state: any) => ({
  client: state.client,
  articleList: state.articleList,
});

const mapDispatchToProps = (dispatch: any) => ({
  jumpToPage: (path: string, params: object = {}) => {
    dispatch(actions.jumpToPage(path, params));
  },
  onLoad: () => dispatch(actions.onLoad({ namespace })),
  onReachBottom: () => dispatch(actions.onReachBottom({ namespace })),
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace })),
});

const tpl3Height = getImageHeight(3, 166 / 343);

type IProp = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Page: React.FC<any> = (props: any) => {
  const {
    client, articleList,
    jumpToPage,
    onLoad,
    onReachBottom,
    onShareAppMessage,
  }: IProp = props;
  const { articleShowStyle } = client.miniConfig;

  usePage({ onLoad, onReachBottom, onShareAppMessage });

  return (
    <div className={styles.layout}>
      <Banner data={articleList.coverList} />
      <div style={{ padding: '10px' }}>
        {
          articleShowStyle.templateType === 'tpl_1' && articleList.list && articleList.list.map((item, index) => (
            <div
              key={index.toString()}
              style={{ marginBottom: '10px' }}
              onClick={() => {
                if (item.type === 0 && item.articleUrl) {
                  window.open(item.articleUrl);
                } else {
                  jumpToPage('/article/detail', { articleId: item.articleId });
                }
              }}
            >
              <CardTpl3
                mode={3}
                showPrice={false}
                data={{ ...item, showStat: articleShowStyle.showData === 'y' ? item.showStat : [] }}
                imageHeight={tpl3Height}
              />
            </div>
          ))
        }
        {
          articleShowStyle.templateType === 'tpl_2' && articleList.list && articleList.list.map((item, index) => (
            <div
              key={index.toString()}
              style={{ marginBottom: '10px' }}
              onClick={() => {
                if (item.type === 0 && item.articleUrl) {
                  window.open(item.articleUrl);
                } else {
                  jumpToPage('/article/detail', { articleId: item.articleId });
                }
              }}
            >
              <CardTpl1
                mode={3}
                showPrice={false}
                data={{ ...item, showStat: articleShowStyle.showData === 'y' ? item.showStat : [] }}
              />
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
