import React, { FC } from 'react';
import {
  AudioPlayerStyle2, PictureItem, VideoItems,
} from 'components';
import styles from './index.scss';

interface IProps {
  studentsInfo: any
  toCorrect: any
}

const state: any = {
  url: '',
};
state.url = 'https://qcdn.beautifulreading.com/upload_files/2020/12/28/fbcbe8a5410da3cef1863627252b410c.jpg';
const Index: FC<IProps> = (props: any): any => {
  const { studentsInfo, toCorrect } = props;
  return (
    <div className={styles.studentsCard}>
      <div className={styles.card}>

        <div className={styles.answer}>
          <div className={styles.paper}>

            {
             studentsInfo
             && studentsInfo.subjective
             && studentsInfo.subjective.answer_file_list
              && studentsInfo.subjective.answer === 0
              && (
                <div className={styles.noAnswer}>该学员没有答案</div>
              )
            }

            {
             studentsInfo
             && studentsInfo.subjective
              && studentsInfo.subjective.answer === undefined
              && (
                <div className={styles.noAnswer}>该学员没有答案</div>
              )
            }
            {
              studentsInfo
              && studentsInfo.subjective
              && studentsInfo.subjective.answer_file_list
              && studentsInfo.subjective.answer.map((item) => (
                <div className={styles.textContent} key={`${item.type} ${item.html}`}>
                  <span dangerouslySetInnerHTML={{ __html: item.replace(/(\r\n|\n|\r)/gm, '<br />') }} />
                </div>
              ))
            }
            {
              studentsInfo
              && studentsInfo.subjective
              && studentsInfo.subjective.answer_file_list
              && studentsInfo.subjective.answer_file_list.length === 0
              && studentsInfo.subjective.answer.map((item) => (
                item === '' && <div className={styles.noAnswer}>该学生没有答案</div>
              ))
            }
          </div>

          {
          studentsInfo && studentsInfo.subjective
          && studentsInfo.answer_file_list && studentsInfo.answer_file_list.map((item, index) => (
            <div key={`${item.type + index}`}>
              {item.type === 'audio' ? (
                <div>
                  <AudioPlayerStyle2
                    key={item.src}
                    url={item.src}
                    durationText={item.duration}
                    trans={false}
                  />
                </div>
              ) : ''}
            </div>
          ))
          }
          {
            studentsInfo
           && studentsInfo.subjective
           && studentsInfo.subjective.answer_file_list
            && studentsInfo.subjective.answer_file_list.length > 0
            && (
              <div className={styles.mp3}>
                {
                  studentsInfo.subjective.answer_file_list.map((item) => (
                    (item.duration && item.type === 'audio') ? (<AudioPlayerStyle2 key={item.url} url={item.url} durationText={item.duration} />) : ''
                  ))
                }

              </div>
            )
          }
          {
           studentsInfo && studentsInfo.subjective.answer_file_list
            && studentsInfo.subjective.answer_file_list.length > 0
            && (
              <div className={styles.wallPic}>
                {
                  studentsInfo.subjective.answer_file_list.map((item) => (
                    item.type !== 'audio' && (
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
        </div>
      </div>

      <div className={styles.correction} onClick={() => toCorrect([studentsInfo], 1)}>
        <i className="iconfont iconpigai" />
        批改
      </div>
      <div className={styles.underlint} />
    </div>
  );
};
export default Index;
