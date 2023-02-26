import React, { FC } from 'react';

import {
  AudioPlayerStyle2, PictureItem, VideoItems,
} from 'components';

import styles from './index.scss';

interface IProps {
  studentsInfo: any
  childrenCheck: any
  toCorrect: any
  hadSelectList: any
  submitInfo: any,
}

const state: any = {
  url: '',
};
state.url = 'https://qcdn.beautifulreading.com/upload_files/2020/12/28/fbcbe8a5410da3cef1863627252b410c.jpg';
const Index: FC<IProps> = (props: any): any => {
  const
    {
      studentsInfo,
      childrenCheck,
      toCorrect,
      hadSelectList,
      submitInfo,
    } = props;
  return (
    <div className={styles.studentsCard}>
      <div className={styles.card}>
        <div className={styles.studentInfo}>
          <div className={styles.student}>
            <img
              className={styles.studentPic}
              src={studentsInfo.user.headimgurl}
              alt=""
            />
            <div className={styles.name}>
              {studentsInfo.user.nickname}
            </div>
          </div>
          <div className={styles.handupTime}>
            提交时间：
            {studentsInfo.subjective.submit_time}
            {/* {studentsInfo.user.headimgurl} */}
          </div>

          <i
            className="iconfont iconhuabanbeifen60"
            style={studentsInfo.selectOption ? { color: '#0F8FFF' } : {}}
            onClick={() => { childrenCheck(studentsInfo.index); }}
          />
        </div>
        <div className={styles.answer}>
          <div className={styles.paper}>

            {studentsInfo
              && studentsInfo.subjective
              && studentsInfo.subjective.answer
              && studentsInfo.subjective.answer.map((item) => (
                <div className={styles.textContent} key={`${`${item}one`}`}>
                  <span dangerouslySetInnerHTML={{ __html: item.replace(/(\r\n|\n|\r)/gm, '<br />') }} />
                </div>
                // <pre><div dangerouslySetInnerHTML={{ item }} /></pre>
              ))}
            {studentsInfo
              && studentsInfo.subjective
              && studentsInfo.subjective.answer
              && studentsInfo.subjective.answer_file_list
               && studentsInfo.subjective.answer_file_list.length === 0
              && studentsInfo.subjective.answer.map((item, index) => (
                item === '' && <div key={`${`${item}noAnswer`}`} className={styles.noAnswer}>该学生没有答案</div>
              ))}
            {/* {
              studentsInfo
              && studentsInfo.subjective
              && studentsInfo.subjective.answer
              && studentsInfo.subjective.answer_file_list
              && studentsInfo.subjective.answer_file_list.length === 0
              // && studentsInfo.subjective.answer[0]
              && (
                <div className={styles.noAnswer}>该学生没有答案2</div>
              )
            } */}
            {
             studentsInfo
             && studentsInfo.subjective
             && studentsInfo.subjective.answer_file_list
             && studentsInfo.subjective.answer_file_list.length === 0
              && studentsInfo.subjective.answer.length === 0
              && (
                <div className={styles.noAnswer}>该学员没有答案</div>
              )
            }
          </div>

          {
             studentsInfo.subjective
           && studentsInfo.subjective.answer_file_list
            && studentsInfo.subjective.answer_file_list.length > 0
            && (
              <div className={styles.mp3}>
                {
                  studentsInfo.subjective
                  && studentsInfo.subjective.answer_file_list.map((item) => (
                    (item.duration && item.type === 'audio') ? (<AudioPlayerStyle2 key={item.url} url={item.url} durationText={item.duration} />) : ''
                  ))
                }

              </div>
            )
          }
          {
          studentsInfo.subjective
           && studentsInfo.subjective.answer_file_list
            && studentsInfo.subjective.answer_file_list.length > 0
            && (
              <div className={styles.wallPic}>
                {
                  studentsInfo.subjective.answer_file_list.map((item, idx) => (
                    item.type !== 'audio' && (
                      <div className={styles.wallPic_wrapper} key={`${`${item.url}box`}`}>
                        {
                          item.type === 'image'
                          && (
                            <div className={styles.wallPic_item}>
                              <PictureItem url={item.url} key={`${item.url + idx}`} />
                            </div>
                          )
                        }
                        {
                          item.type === 'video'
                          && (
                            <div className={styles.wallPic_item}>
                              <VideoItems url={item.url} key={`${`${item.url}index`}`} />
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

        </div>
      </div>
      {
        hadSelectList && hadSelectList.length === 0 && (
          <div
            className={styles.correction}
            onClick={() => toCorrect([studentsInfo.subjective.subjective_detail_id],
              submitInfo.question.score)}
          >

            <i className="iconfont iconpigai" />
            批改
          </div>
        )
      }

      {
        hadSelectList.length !== 0 && (
          <div className={styles.corrections}>
            <i className="iconfont iconpigai" />
            批改
          </div>
        )
      }

    </div>
  );
};
export default Index;
