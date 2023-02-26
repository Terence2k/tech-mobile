import React, { FC } from 'react';
import { AudioPlayerStyle2, PictureItem, VideoItems } from 'components';
import styles from './index.scss';

interface IProps {
  questionInfo: any
  currentQuestionsIndex: number
  changeQuestionsIndex: any
}
const state: any = {
  url: '',
};
state.url = 'https://qcdn.beautifulreading.com/upload_files/2020/12/28/fbcbe8a5410da3cef1863627252b410c.jpg';
const Index: FC<IProps> = (props: any): any => {
  const { questionInfo, currentQuestionsIndex, changeQuestionsIndex } = props;
  const [showQuestions, setShowQuestions] = React.useState(false);

  return (
    <div className={styles.testWrappers}>
      <div className={styles.questionList}>
        {questionInfo.index !== currentQuestionsIndex && (
          <div className={`${styles.questionItem} ${styles.hideBorder}`}>
            <div className={styles.questionHeader}>
              <div className={styles.questionTitle}>
                <span className={styles.lf} />
                <div className={styles.txt}>
                  {questionInfo && questionInfo.exampaper && questionInfo.exampaper.title}
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
                  changeQuestionsIndex(questionInfo.index,
                    questionInfo.exampaper.paper_id,
                    questionInfo.question.question_id,
                    questionInfo.question.score);
                }}
              >
                展开
                <i className="iconfont iconshouqi" />
              </div>
            </div>
            <div className={styles.questionContent}>
              <div className={styles.txt}>
                {questionInfo && questionInfo.question && questionInfo.question.content}
              </div>
              <div className={styles.showQuestionDetail} />
            </div>
          </div>
        )}

        {
          questionInfo.index === currentQuestionsIndex && (
            <div className={styles.questionItem}>
              <div className={styles.questionHeader}>
                <div className={styles.questionTitle}>
                  <span className={styles.lf} />
                  <div className={styles.txt}>
                    {questionInfo && questionInfo.exampaper.title}
                  </div>
                  <span className={styles.questionNum}>
                    (
                    {questionInfo.wait_score_count}
                    )
                  </span>
                </div>
                <div
                  className={styles.showQuestion}
                  onClick={() => { changeQuestionsIndex(questionInfo.index); }}
                >
                  收起
                  <i className="iconfont iconzhankai" />
                </div>
              </div>
              {
                 questionInfo
                && questionInfo.question
                && questionInfo.question.content
                && questionInfo.question.content.length < 50
                && questionInfo.question.file_list && questionInfo.question.file_list.length === 0
                && (
                  <div className={styles.questionContent}>
                    <div className={styles.txt}>
                      {questionInfo.question.content}
                    </div>
                  </div>
                )
              }
              {
               !showQuestions && questionInfo
                && questionInfo.question
                && questionInfo.question.content
                && questionInfo.question.content.length > 50
                && questionInfo.question.file_list && questionInfo.question.file_list.length === 0
                && (
                  <div className={styles.questionContentOut}>
                    <div className={styles.txt}>
                      {questionInfo.question.content}
                    </div>
                    <div
                      className={styles.showQuestionDetailin}
                      onClick={() => { setShowQuestions(true); }}
                    >
                      显示全部
                      <i className="iconfont iconicon-arrow-simple-small-down" style={{ fontSize: '12px' }} />
                    </div>

                  </div>
                )
              }
              {
                showQuestions
                && questionInfo
                && questionInfo.question
                && questionInfo.question.content
                && questionInfo.question.content.length > 50
                && questionInfo.question.file_list && questionInfo.question.file_list.length === 0
                && (
                  <div className={styles.hideContent}>
                    <div className={styles.txtShow}>
                      {questionInfo.question.content}
                    </div>
                    <div
                      className={styles.hideQuestionDetail}
                      onClick={() => { setShowQuestions(false); }}
                    >

                      收起
                      <i className="iconfont iconzhankai" />
                    </div>

                  </div>
                )
              }

              {/* 没问题展示 */}
              {
                !showQuestions
                && questionInfo.question.file_list.length !== 0
                && (
                  <div className={styles.questionContent}>
                    <div className={styles.txt}>
                      {questionInfo && questionInfo.question && questionInfo.question.content}
                    </div>
                    <div
                      className={styles.showQuestionDetail}
                      onClick={() => { setShowQuestions(true); }}
                    >
                      显示全部
                      <i className="iconfont iconicon-arrow-simple-small-down" style={{ fontSize: '12px' }} />
                    </div>
                  </div>
                )
              }
              {/* 有问题展示 */}
              {
                showQuestions
                && questionInfo.question.file_list.length !== 0
                && (
                  <div className={styles.hideContent}>
                    <div className={styles.txtShow}>
                      {questionInfo && questionInfo.question && questionInfo.question.content}
                    </div>

                    {
                      questionInfo.question.file_list
                      && questionInfo.question.file_list.length > 0
                      && (
                        <div className={styles.mp3}>
                          {
                            questionInfo.question.file_list
                            && questionInfo.question.file_list.map((item) => (
                              item.type === 'audio' && (
                                <AudioPlayerStyle2
                                  url={item.url}
                                  durationText={item.duration + 1}
                                  trans
                                  key={item.url}
                                />
                              )
                            ))
                          }

                        </div>
                      )
                    }
                    {
                      questionInfo
                      && questionInfo.question.file_list
                      && questionInfo.question.file_list.length > 0
                      && (
                        <div className={styles.wallPic}>
                          {
                            questionInfo.question.file_list
                            && questionInfo.question.file_list.map((item) => (
                              item.type !== 'audio' && item.url && (
                                <div className={styles.wallPic_wrapper} key={item.url}>
                                  {
                                    item.type === 'image'
                                    && (
                                      <div className={styles.wallPic_item}>
                                        <PictureItem url={item.url} key={item.url} />
                                      </div>
                                    )
                                  }
                                  {
                                    item.type === 'video'
                                    && (
                                      <div className={styles.wallPic_item}>
                                        <VideoItems url={item.url} key={item.url} />
                                      </div>
                                    )
                                  }
                                </div>
                              )
                            ))
                          }
                        </div>
                      )
                    }
                    <div
                      className={styles.hideQuestionDetail}
                      onClick={() => { setShowQuestions(false); }}
                    >

                      收起
                      <i className="iconfont iconzhankai" />
                    </div>
                  </div>
                )
              }

            </div>
          )
        }

      </div>
    </div>

  );
};
export default Index;
