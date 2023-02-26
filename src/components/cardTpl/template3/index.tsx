import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'components';

import styles from './index.scss';

const VIEW_ICON = require('../images/viewIcon.png');

const CardTpl3: React.FC = (props: any) => {
  const {
    mode, data = {}, titleLine, imageMaxWidth, imageHeight, showPrice, showOriginalPrice,
    showStudyCount, statType, onClick,
  } = props;
  const { showStat = [], planTeachers = [], featureList = [] } = data;

  return (
    <div className={`${styles.cardLayout} ${styles[`cardLayout-${mode}`]}`} onClick={() => { onClick(); }}>
      <img src={data.image} className={styles.cardCover} style={{ maxWidth: `${imageMaxWidth}px`, height: `${imageHeight}px` }} alt="" />
      <div className={styles.cardBody}>
        <p className={`${styles.cardTitle} ${styles[`ell-${titleLine}`]}`}>{data.title}</p>
        {
          mode === 7
          && (
          <div className="flexLayout center wrap" style={{ marginBottom: '12px' }}>
            {
              featureList.map((item, index) => (
                <span className={`${styles.cardTag} flexLayout center`} key={index.toString()}>{item}</span>
              ))
            }
          </div>
          )
        }
        {
          mode === 7
          && (
          <div className="flexLayout spaceBetween" style={{ marginBottom: '8px' }}>
            <span className={styles.timePeriod}>
              {
                data.timePeriod && (
                <span>
                  {data.timePeriod}
                  {' '}
                  |
                  {' '}
                </span>
                )
              }
              <span>
                共
                {data.itemCount || 0}
                节课
              </span>
            </span>
            {
              showStudyCount && (
              <span className={styles.timePeriod}>
                {data.studyCount || 0}
                人在学习
              </span>
              )
            }
          </div>
          )
        }
        {
          // 10：打卡
          mode === 10 && (
            <div className="flexLayout center">
              {
                data.tags && data.tags.map((tag, tagIndex) => (
                  <Tag key={tagIndex.toString()} style={data.tagStyle || {}}>{tag}</Tag>
                ))
              }
              <div className={styles.cardStat} style={{ marginLeft: '7px' }}>
                {
                  showStat && showStat.map((item, index) => (
                    <span key={index.toString()}>
                      {
                        index !== 0 && <span> / </span>
                      }
                      {item}
                    </span>
                  ))
                }
              </div>
            </div>
          )
        }
        {
          mode === 1 && statType === 'desc' && (
            <div className={`${styles.cardStat} textOverflow`} style={{ width: '100%' }}>{data.desc}</div>
          )
        }
        <div className={styles.cardBottom}>
          {
            mode === 1 && (
              <div className={styles.cardStat}>
                {
                  statType === 'stat' && showStat.map((item, index) => (
                    <span key={index.toString()}>
                      {
                        index !== 0 && <span> / </span>
                      }
                      {item}
                    </span>
                  ))
                }
              </div>
            )
          }
          {
            mode === 3 && [...showStat].length > 0 && (
              <div className={styles.cardStat}>
                <img src={VIEW_ICON} className={styles.cardIcon} alt="" />
                {
                  showStat.map((item, index) => (
                    <span key={index.toString()}>
                      {
                        index !== 0 && <span> / </span>
                      }
                      {item}
                    </span>
                  ))
                }
              </div>
            )
          }
          {
            mode === 7 && (
            <div className="flexLayout center">
              {
                planTeachers.map((item, index) => (
                  <div className={styles.cardTeacher} key={index.toString()}>
                    <img src={item.image} className={styles.cardTeacherIcon} alt="" />
                  </div>
                ))
              }
            </div>
            )
          }
          {
            showPrice && (
            <div className={styles.cardPrice}>
              {
                showOriginalPrice && data.originalPrice > 0 && <span className={styles.cardOriginalPrice}>{`¥${data.originalPrice}`}</span>
              }
              <span className={styles.cardPriceValue}>
                { data.price > 0 && <span className={styles.cardPriceUnit}>¥</span> }
                <span>{data.price ? `${data.price}` : '免费'}</span>
              </span>
            </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

CardTpl3.defaultProps = {
  mode: 1,
  titleLine: 2,
  imageMaxWidth: '',
  imageHeight: 166,
  showPrice: true,
  showOriginalPrice: true,
  showStudyCount: true,
  statType: 'stat',
  onClick: () => {},
};

CardTpl3.propTypes = {
  /**
   * 1. 录播课程
   * 3. 文章
   * 7. 超级大纲
   * 10.打卡
   */
  mode: PropTypes.number,
  // 通用：标题最多显示多少行
  titleLine: PropTypes.number,
  // 通用：封面最大宽度，宽度默认为100%
  imageMaxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  // 通用：封面高度
  imageHeight: PropTypes.number,
  // 通用：是否显示价格
  showPrice: PropTypes.bool,
  // 通用：是否显示划线价（无划线价权限）
  showOriginalPrice: PropTypes.bool,
  // mode1：课程展示数据（desc/stat）
  statType: PropTypes.oneOf(['desc', 'stat']),
  // mode7：是否展示教学大纲学习数据
  showStudyCount: PropTypes.bool,
  // 通用：卡片数据
  data: PropTypes.shape({
    // 通用：标题
    title: PropTypes.string,
    // 通用：封面
    image: PropTypes.string,
    // 通用：价格
    price: PropTypes.number,
    // 通用：划线价
    originalPrice: PropTypes.number,
    // 通用
    tags: PropTypes.arrayOf(PropTypes.string),
    // 通用：tag
    tagStyle: PropTypes.objectOf(PropTypes.string),

    // mode1、3：设置的展示数据
    showStat: PropTypes.arrayOf(PropTypes.string),

    // mode7：超级大纲的特色列表
    featureList: PropTypes.arrayOf(PropTypes.string),
    // mode7：超级大纲的授课时间
    timePeriod: PropTypes.string,
    // mode7：超级大纲的学习人数
    studyCount: PropTypes.number,
    // mode7：超级大纲的课程数量
    itemCount: PropTypes.number,
    // mode7：超级大纲的教师列表
    planTeachers: PropTypes.arrayOf(PropTypes.shape({
      image: PropTypes.string,
    })),
  }).isRequired,

  onClick: PropTypes.func,
};

export default CardTpl3;
