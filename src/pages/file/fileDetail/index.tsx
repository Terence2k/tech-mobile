import React from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import { IBrowser } from '@/models/types';
import actions from 'actions';
import { usePage } from 'hooks';
import { IShare } from '@/utils/model';

import {
  Header4FileLevel,
  ProductModule,
  ProductMediaList,
  ProductSubmitBar,
  ProductTicketList,
  FileList,
} from 'components';

const mapStateToProps = (state: any) => ({
  browser: state.browser,
  fileDetail: state.fileDetail,
});

const mapDispatchToProps = (dispatch: any) => ({
  getOpernDetail: () => {
    dispatch({ type: 'fileDetail/getOpernDetail' });
  },
  share: () => {
    dispatch({ type: 'fileDetail/share' });
  },
  // 更新收藏值
  onCollectClick: () => {
    dispatch({ type: 'fileDetail/onCollectClick' });
  },
  // 点击发帖子
  onEditClick: () => {
    dispatch({ type: 'fileDetail/onEditClick' });
  },
  // 底部栏点击事件
  clickHandler: (handler: any) => {
    dispatch(handler);
  },
  showProductTicketPopup: (productId: string) => {
    dispatch(actions.ticket.showProductTicketList(productId));
  },
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace: 'fileDetail' })),
});

const Page: React.FC<any> = (
  {
    fileDetail,
    browser,
    onCollectClick,
    onEditClick,
    getOpernDetail,
    share,
    clickHandler,
    showProductTicketPopup,
    onShareAppMessage,
  }: {
    fileDetail: any,
    browser: IBrowser,
    onCollectClick: () => {},
    onEditClick: () => {},
    getOpernDetail: () => {},
    share: () => {},
    clickHandler: (e) => {},
    showProductTicketPopup: (e) => {},
    onShareAppMessage: () => Promise<IShare>,
  },
) => {
  const {
    headerData = {}, trialContent, fileList, audioList,
  } = fileDetail;

  React.useEffect(() => {
    getOpernDetail();
  }, [getOpernDetail]);

  usePage({ onShareAppMessage });

  return (
    <div className="pageLayout">
      <div className="pageLayout__scrollLayout">
        <div style={{ background: '#FFF' }}>
          <Header4FileLevel {...headerData} />
          {
            fileDetail.joinFlag === 'n' && fileDetail.productTicketList.list && fileDetail.productTicketList.list.length > 0
            && (
              <ProductTicketList style={{ marginLeft: '15px', marginTop: '8px', borderBottom: 'none' }} {...fileDetail.productTicketList} onClick={() => { showProductTicketPopup(fileDetail.productId); }} />
            )
          }
        </div>
        {
          trialContent && trialContent.title && (
            <ProductModule title={trialContent.title} style={{ marginTop: '0px' }}>
              <div style={{
                padding: '10px', backgroundColor: '#FFF', backgroundImage: fileDetail.showWaterMask === 'y' ? `url(${fileDetail.waterMask})` : '', backgroundRepeat: 'repeat',
              }}
              >
                <ProductMediaList {...trialContent.nodeList[0]} />
              </div>
            </ProductModule>
          )
        }
        {
          fileDetail.joinFlag === 'y'
          && (
            <div>
              <ProductModule title={fileList.title}>
                {
                  fileList.list && fileList.list.length > 0
                  && (
                    <FileList
                      fileList={fileList.list}
                      onDownloadClick={(item) => { window.open(item.url); }}
                    />
                  )
                }
                {
                  fileList.nodeList && fileList.nodeList[0]
                  && (
                    <div style={{
                      padding: '10px', backgroundColor: '#FFF', backgroundImage: fileDetail.showWaterMask === 'y' ? `url(${fileDetail.waterMask})` : '', backgroundRepeat: 'repeat',
                    }}
                    >
                      <ProductMediaList {...fileList.nodeList[0]} />
                    </div>
                  )
                }
              </ProductModule>
              {
                audioList && audioList.length > 0
                && (
                  <ProductModule title="伴奏下载">
                    <FileList
                      fileList={audioList}
                      onDownloadClick={(item) => { window.open(item.url); }}
                    />
                  </ProductModule>
                )
              }
            </div>
          )
        }
      </div>
      <div className={classNames('pageLayout__bottomLayout', {
        pc: !browser.isMobileBrowser,
      })}
      >
        <ProductSubmitBar
          {...fileDetail.submitBar}
          onShareClick={() => share()}
          onCollectClick={() => onCollectClick()}
          onEditClick={() => onEditClick()}
          onMenuClick={(res) => {
            if (res.handler) clickHandler(res.handler);
          }}
        />
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
