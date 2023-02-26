import React from 'react';
import { connect } from 'dva';
import { usePage } from 'hooks';
import actions from 'actions';

import { CardTpl1 } from 'components';

const mapStateToProps = (state: any) => ({
  fileInnerData: state.fileInnerData,
});

const mapDispatchToProps = (dispatch: any) => ({
  onLoad: () => {
    dispatch({ type: 'fileInnerData/onLoad' });
  },
  onReachBottom: () => {
    dispatch({ type: 'fileInnerData/onReachBottom' });
  },
  jumpToPage: (path: string, params: object = {}) => {
    dispatch(actions.jumpToPage(path, params));
  },
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace: 'fileInnerData' })),
});

type IProp = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Page: React.FC<any> = (props: any) => {
  const {
    fileInnerData,
    onLoad,
    onReachBottom,
    onShareAppMessage,
    jumpToPage,
  }: IProp = props;

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

  return (
    <div ref={scrollRef} className="pageLayout">
      <div className="pageLayout__scrollLayout">
        <div style={{ padding: '0 10px', backgroundColor: '#FFF' }}>
          {
            fileInnerData.list.map((item, index) => (
              <div
                style={{ marginBottom: '10px' }}
                key={index.toString()}
                onClick={() => {
                  jumpToPage('/file/fileDetail', { opern_id: item.opernId });
                }}
              >
                <CardTpl1
                  mode={2}
                  data={item}
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
