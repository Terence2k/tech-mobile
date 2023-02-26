import React from 'react';
import { connect } from 'dva';
import actions from 'actions';
import { usePage } from 'hooks';

import { CardTpl2 } from 'components';
import getImageHeight from '@/common/getImageHeight';

const mapStateToProps = (state: any) => ({
  fileSetInnerData: state.fileSetInnerData,
});

const mapDispatchToProps = (dispatch: any) => ({
  getOpernsetList: () => {
    dispatch({ type: 'fileSetInnerData/getOpernsetList' });
  },
  jumpToPage: (path: string, params: object = {}) => {
    dispatch(actions.jumpToPage(path, params));
  },
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace: 'fileSetInnerData' })),
});

const tpl2Height = getImageHeight(2, 166 / 343);

type IProp = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Page: React.FC<any> = (props: any) => {
  const {
    fileSetInnerData,
    getOpernsetList,
    jumpToPage,
    onShareAppMessage,
  }: IProp = props;
  React.useEffect(() => {
    getOpernsetList();
  }, [getOpernsetList]);

  usePage({ onShareAppMessage });

  return (
    <div className="pageLayout">
      <div className="pageLayout__scrollLayout">
        <div className="flexLayout spaceBetween" style={{ padding: '10px', backgroundColor: '#FFF', flexWrap: 'wrap' }}>
          {
            fileSetInnerData.list.map((item, index) => (
              <div
                style={{ marginBottom: '10px', width: '48%' }}
                key={index.toString()}
                onClick={() => {
                  jumpToPage('/file/fileSetDetail', { opernsetId: item.opernsetId });
                }}
              >
                <CardTpl2
                  mode={2}
                  data={item}
                  showPrice={false}
                  imageHeight={tpl2Height}
                />
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
