import React from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import { IBrowser } from '@/models/types';
import actions from 'actions';
import { usePage } from 'hooks';

import {
  Banner,
  ProductTitle,
  ProductDesc,
  ProductModule,
  ProductMediaList,
  ProductSubmitBar,
  ProductFavorites,
  CardTpl1,
} from 'components';

import { MediaBlock } from './components';

import styles from './index.scss';

const mapStateToProps = (state: any) => ({
  browser: state.browser as IBrowser,
  fileSetDetail: state.fileSetDetail,
});

const mapDispatchToProps = (dispatch: any) => ({
  getOpernsetDetail: () => {
    dispatch({ type: 'fileSetDetail/getOpernsetDetail' });
  },
  collect: () => {
    dispatch({ type: 'fileSetDetail/collect' });
  },
  share: () => {
    dispatch({ type: 'fileSetDetail/share' });
  },
  jumpToPage: (path: string, params: object = {}) => {
    dispatch(actions.jumpToPage(path, params));
  },
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace: 'fileSetDetail' })),
});

type IProp = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Page: React.FC<any> = (props: any) => {
  const {
    fileSetDetail,
    browser,
    getOpernsetDetail,
    collect,
    share,
    jumpToPage,
    onShareAppMessage,
  }: IProp = props;

  const {
    fileList, nodeList, adList, mediaList, articleList, courseList,
  } = fileSetDetail;

  React.useEffect(() => {
    getOpernsetDetail();
  }, [getOpernsetDetail]);

  usePage({ onShareAppMessage });

  return (
    <div className="pageLayout">
      <div className="pageLayout__scrollLayout">
        <Banner data={fileSetDetail.coverList} />
        <div className={styles.infoLayout}>
          <ProductTitle title={fileSetDetail.title} />
          <ProductDesc {...fileSetDetail.desc} />
        </div>
        {
          fileList && (
            <ProductModule title={fileList.title}>
              {
                fileList.list && fileList.list.map((item) => (
                  <CardTpl1
                    key={item.opernId}
                    mode={2}
                    showTime={false}
                    data={item}
                    onClick={() => {
                      jumpToPage('/file/fileDetail', { opern_id: item.opernId });
                    }}
                  />
                ))
              }
            </ProductModule>
          )
        }
        {
          nodeList && (
            <ProductModule title={nodeList.title}>
              <div style={{ padding: '10px' }}>
                <ProductMediaList {...nodeList.nodeList[0]} />
              </div>
            </ProductModule>
          )
        }
        {
          adList && (
            <Banner
              data={adList}
              onClick={(i) => {
                jumpToPage(i.jumpUrl);
              }}
            />
          )
        }
        {
          mediaList && (
            <ProductModule title={mediaList.title}>
              <div style={{ padding: '10px' }}>
                <MediaBlock mediaList={mediaList.list} />
              </div>
            </ProductModule>
          )
        }
        {
          courseList && (
            <ProductModule title={courseList.title}>
              <div style={{ padding: '10px' }}>
                {
                  courseList.list.map((item, index) => (
                    <div
                      key={index.toString()}
                      style={{ marginBottom: '15px' }}
                      onClick={() => {
                        jumpToPage('/course/product', { course_id: item.courseId });
                      }}
                    >
                      <CardTpl1
                        mode={1}
                        data={item}
                        showPrice={false}
                      />
                    </div>
                  ))
                }
              </div>
            </ProductModule>
          )
        }
        {
          articleList && (
            <ProductModule title={articleList.title}>
              <div>
                {
                  articleList.list.map((item, index) => (
                    <div
                      key={index.toString()}
                      onClick={() => {
                        if (item.articleUrl) {
                          window.open(item.articleUrl);
                        } else {
                          jumpToPage('/article/detail', { articleId: item.articleId });
                        }
                      }}
                    >
                      <CardTpl1
                        mode={3}
                        data={item}
                        showPrice={false}
                      />
                    </div>
                  ))
                }
              </div>
            </ProductModule>
          )
        }
      </div>
      <div className={classNames('pageLayout__bottomLayout', {
        pc: !browser.isMobileBrowser,
      })}
      >
        <ProductSubmitBar
          {...fileSetDetail.submitBar}
          onShareClick={() => {
            share();
          }}
        />
      </div>
      <ProductFavorites
        {...fileSetDetail.favorites}
        onClick={() => collect()}
      />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
