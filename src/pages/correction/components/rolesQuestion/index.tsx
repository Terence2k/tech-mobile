import React, { FC } from 'react';
import { AudioPlayerStyle2, PictureItem, VideoItems } from 'components';
import styles from './index.scss';

interface IProps {
  questionInfo: any
}
const state: any = {
  url: '',
};
state.url = 'https://qcdn.beautifulreading.com/upload_files/2020/12/28/fbcbe8a5410da3cef1863627252b410c.jpg';
const Index: FC<IProps> = (props: any): any => {
  const { questionInfo } = props;
  const [showQuestions, setShowQuestions] = React.useState(false);

  return (
    <div className={styles.testWrappers}>
      <div className={styles.questionList}>

        <div className={styles.questionItem}>
          {
            questionInfo && questionInfo.content && questionInfo.content.length < 50
            && questionInfo.file_list.length === 0
            && (
              <div className={styles.questionContent}>
                <div className={styles.txt}>
                  {questionInfo && questionInfo.index}
                  .
                  {questionInfo && questionInfo.content}
                </div>
              </div>
            )
          }
          {
            !showQuestions && questionInfo.file_list.length !== 0 && (
              <div className={styles.questionContent}>
                <div className={styles.txt}>
                  {questionInfo && questionInfo.index}
                  .
                  {questionInfo && questionInfo.content}
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
          {

            showQuestions && questionInfo.file_list.length !== 0 && (
              <div className={styles.hideContent}>
                <div className={styles.txtShow}>
                  {questionInfo && questionInfo.index}
                  .
                  {questionInfo && questionInfo.content}
                </div>
                {
                 questionInfo && questionInfo.file_list
                  && questionInfo.file_list.map((item) => (
                    <div className={styles.mp3} key={`${item.type + item.url}`}>
                      {
                        item.type === 'audio' && (
                          <AudioPlayerStyle2
                            // eslint-disable-next-line react/jsx-boolean-value
                            trans={true}
                            url={item.url}
                            durationText={item.duration + 1}
                          />
                        )
                      }

                    </div>
                  ))
                }
                {
                  questionInfo && questionInfo.file_list
                  && questionInfo.file_list.length > 0
                  && (
                    <div className={styles.wallPic}>
                      {
                        questionInfo.file_list.map((item) => (
                          item.type !== 'audio' && item.url && (
                            <div className={styles.wallPic_wrapper} key={item.url}>
                              {
                                item.type === 'image'
                                && (
                                  <div className={styles.wallPic_item} key={`${item.url + item.type}`}>
                                    <PictureItem url={item.url} key={item.url} />
                                  </div>
                                )
                              }
                              {
                                item.type === 'video'
                                && (
                                  <div className={styles.wallPic_item} key={item.url}>
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

      </div>
    </div>

  );
};
export default Index;
