import React, { FC } from 'react';

import styles from './index.scss';

interface IProps {
  questionInfo: any
  currentRolesIndex: number
  changeRoleQuestionIndex: any
}
const state: any = {
  url: '',
};
state.url = 'https://qcdn.beautifulreading.com/upload_files/2020/12/28/fbcbe8a5410da3cef1863627252b410c.jpg';
const Index: FC<IProps> = (props: any): any => {
  const { questionInfo, currentRolesIndex, changeRoleQuestionIndex } = props;

  return (
    <div className={styles.testWrappers}>
      <div className={styles.questionList}>
        {questionInfo.index !== currentRolesIndex && (
          <div className={`${styles.questionItem} ${styles.hideBorder}`}>
            <div className={styles.questionHeader}>
              <div className={styles.questionTitle}>
                <span className={styles.lf} />
                <div className={styles.txt}>
                  {questionInfo && questionInfo.title}
                </div>
                <span className={styles.questionNum}>
                  (
                  {questionInfo.wait_score_count}
                  )
                </span>
              </div>
              <div
                className={styles.showQuestion}
                onClick={() => {
                  changeRoleQuestionIndex(questionInfo.index);
                }}
              >
                展开
                <i className="iconfont iconshouqi" />
              </div>
            </div>

          </div>
        )}

        {
          questionInfo.index === currentRolesIndex && (
            <div className={styles.questionItem}>
              <div className={styles.questionHeader}>
                <div className={styles.questionTitle}>
                  <span className={styles.lf} />
                  <div className={styles.txt}>
                    {questionInfo && questionInfo.title}
                  </div>
                  <span className={styles.questionNum}>
                    (
                    {questionInfo.wait_score_count}
                    )
                  </span>
                </div>
                <div
                  className={styles.showQuestion}
                  onClick={() => { changeRoleQuestionIndex(questionInfo.index); }}
                >
                  收起
                  <i className="iconfont iconzhankai" />
                </div>
              </div>
            </div>
          )
        }

      </div>
    </div>

  );
};
export default Index;
