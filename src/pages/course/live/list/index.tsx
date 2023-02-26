import React from 'react';
import { connect } from 'dva';
import actions from 'actions';
import { usePage } from 'hooks';
// import { Toast } from 'antd-mobile';
// import classNames from 'classnames';
import getImageHeight from '@/common/getImageHeight';

import {
  CardTpl2,
} from 'components';

import styles from './index.scss';
import { namespace } from './model';

const tpl2Height = getImageHeight(2, 166 / 343);

const mapStateToProps = (res: any) => ({
  state: res[namespace],
});

const mapDispatchToProps = (dispatch: any) => ({
  jumpToPage: (path: string, params: object) => dispatch(actions.jumpToPage(path, params)),
  onLoad: () => dispatch(actions.onLoad({ namespace })),
  onReachBottom: () => dispatch(actions.onReachBottom({ namespace })),
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace })),
});

type IProp = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const Page: React.FunctionComponent<any> = (props: any) => {
  const {
    // models
    state,
    // action methods
    jumpToPage,
    onLoad,
    onReachBottom,
    onShareAppMessage,
  }: IProp = props;

  usePage({ onLoad, onReachBottom, onShareAppMessage });

  return (
    <div className={styles.layout}>
      {
        state.list && state.list.map((item, index) => (
          <div
            className={styles.item}
            key={index.toString()}
            onClick={() => {
              jumpToPage('/course/live', { livecourse_id: item.livecourseId });
            }}
          >
            <CardTpl2
              mode={6}
              showTime
              data={item}
              imageHeight={tpl2Height}
            />
          </div>
        ))
      }
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
