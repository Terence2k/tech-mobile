import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const VIEW_ICON = require('../images/viewIcon.png');
const CLOCK_ICON = require('../images/clockIcon.png');

const CardTpl1: React.FC = (props: any) => {
  const {
    mode, data = {}, titleLine, imageWidth, imageHeight, showPrice, showOriginalPrice, showTime,
    statType, onClick,
  } = props;
  const { showStat = [], reservationSubjects = [], reservationTeachers = [] } = data;

  return (
    <div className={`${styles.cardLayout} ${styles[`cardLayout-${mode}`]}`} onClick={() => { onClick(); }}>
      <img src={data.image} className={styles.cardCover} style={{ width: `${imageWidth}px`, height: `${imageHeight}px` }} alt="" />
      <div className={styles.cardBody}>
        <p className={`${styles.cardTitle} ${styles[`ell-${titleLine}`]}`}>{data.title}</p>
        {
          showTime
            && (
            <p className={`${styles.cardPeriod} flexLayout center`}>
              {
                mode === 5 && <img src={CLOCK_ICON} className={styles.cardIcon} alt="" />
              }
              {data.timeText}
            </p>
            )
        }
        {
          mode === 4
          && (
          <div className="flexLayout center">
            {
              reservationSubjects.slice(0, 2).map((item, index) => (
                <span className={`${styles.cardTag} flexLayout center`} key={index.toString()}>{item}</span>
              ))
            }
          </div>
          )
        }
        <div className={styles.cardBottom}>
          {
            mode !== 4 && mode !== 5 && statType === 'stat' && [...showStat].length > 0 && (
              <div className={styles.cardStat}>
                {
                  (mode === 2 || mode === 3) && <img src={VIEW_ICON} className={styles.cardIcon} alt="" />
                }
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
            mode === 5 && (
            <span className={styles.cardTypeIcon}>
              {data.objectType}
            </span>
            )
          }
          {
            mode !== 4 && showPrice && (
            <div className={styles.cardPrice}>
              {
                showOriginalPrice && data.originalPrice > 0 && <span className={styles.cardOriginalPrice}>{`??${data.originalPrice}`}</span>
              }
              <span className={styles.cardPriceValue}>
                { data.price > 0 && <span className={styles.cardPriceUnit}>??</span> }
                <span>{data.price ? `${data.price}` : '??????'}</span>
              </span>
            </div>
            )
          }
          {
            mode === 4 && (
            <div className="flexLayout center">
              {
                reservationTeachers.slice(0, 6).map((item, index) => (
                  <div className={styles.cardTeacher} key={index.toString()} style={{ transform: `translate(${index * -7}px, 0px)` }}>
                    <img src={item.image} className={styles.cardTeacherIcon} alt="" />
                  </div>
                ))
              }
              {
                reservationTeachers.length > 6 && <span className={styles.cardTeacherEll}>??????</span>
              }
            </div>
            )
          }
          {
            mode === 4 && (
              <div className={styles.cardBtn}>??????</div>
            )
          }
        </div>
      </div>
    </div>
  );
};

CardTpl1.defaultProps = {
  mode: 1,
  titleLine: 2,
  imageWidth: 130,
  imageHeight: 72,
  showPrice: true,
  showOriginalPrice: true,
  showTime: false,
  statType: 'stat',
  onClick: () => {},
};

CardTpl1.propTypes = {
  /**
   * 1. ????????????
   * 2. ??????
   * 3. ??????
   * 4. ??????
   * 5. ?????????
   */
  mode: PropTypes.number,
  // ????????????????????????????????????
  titleLine: PropTypes.number,
  // ?????????????????????
  imageWidth: PropTypes.number,
  // ?????????????????????
  imageHeight: PropTypes.number,
  // ???????????????????????????
  showPrice: PropTypes.bool,
  // ??????????????????????????????????????????????????????
  showOriginalPrice: PropTypes.bool,
  // ?????????????????????????????????,
  showTime: PropTypes.bool,
  // mode1????????????????????????desc/stat???
  statType: PropTypes.oneOf(['desc', 'stat']),
  // ?????????????????????
  data: PropTypes.shape({
    // ???????????????
    title: PropTypes.string,
    // ???????????????
    image: PropTypes.string,
    // ???????????????
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    // ??????????????????
    originalPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    // mode1,2,3????????????????????????
    showStat: PropTypes.arrayOf(PropTypes.string),

    // mode4???5????????????????????????/?????????
    timeText: PropTypes.string,
    // mode4???????????????
    reservationSubjects: PropTypes.arrayOf(PropTypes.string),
    // mode4???????????????
    reservationTeachers: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      image: PropTypes.string,
    })),

    // mode5??????????????????????????????????????????????????????
    objectType: PropTypes.string,
  }).isRequired,

  onClick: PropTypes.func,
};

export default CardTpl1;
