import React, { FC } from 'react';
import classNames from 'classnames';
import { TState } from '@/models/types';
import { connect } from 'dva';
import styles from './index.scss';

interface IProps {
  correctNum: any,
  toCorrect: any,
  cancleSelectArray: any,
  score: any,
}
const mapStateToProps = (state: TState) => ({
  browser: state.browser,

});
const Index: FC<IProps> = (props: any): any => {
  const {
    correctNum, toCorrect, cancleSelectArray, browser, score,
  }: any = props;

  return (
    <div className={classNames(styles.bottomWrapper, {
      [styles.pc]: !browser.isMobileBrowser,
    })}
    >
      <div className={styles.lfText}>
        <i className="iconfont icontishi" style={{ color: '#10AEFF' }} />
        已选择
        {correctNum.length}
        项
      </div>
      <div className={styles.midText} onClick={() => cancleSelectArray()}>取消选择</div>
      <div className={styles.allCorrection} onClick={(e) => toCorrect(correctNum, score, 'checkAll')}>批量批改</div>
    </div>
  );
};
export default connect(mapStateToProps)(Index);
