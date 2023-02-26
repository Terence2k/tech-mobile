import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const CLOCK_ICON = require('../images/clockIcon.png');
const VIEW_ICON = require('../images/viewIcon.png');

const CardTpl2: React.FC = (props: any) => {
  const {
    mode, data = {}, titleLine, imageMaxWidth, imageHeight, showPrice, showOriginalPrice, showTime,
    statType, onClick,
  } = props;
  const { showStat = [] } = data;
  return (
    <div className={`${styles.cardLayout} ${styles[`cardLayout-${mode}`]}`} onClick={() => { onClick(); }}>
      <div
        className={styles.cardCover}
        style={{
          maxWidth: `${imageMaxWidth}px`,
          height: `${imageHeight}px`,
          backgroundImage: `url(${data.image})`,
        }}
      >
        {
          mode === 6
          && (
          <span className={styles.cardStatus} style={data.liveStatusStyles}>
            {data.liveStatus}
          </span>
          )
        }
      </div>
      <div className={styles.cardBody}>
        <p className={`${styles.cardTitle} ${styles[`ell-${titleLine}`]}`}>{data.title}</p>
        {
          showTime
            && (
            <p className={`${styles.cardPeriod} flexLayout center`}>
              <img src={CLOCK_ICON} className={styles.cardIcon} alt="" />
              {data.timeText}
            </p>
            )
        }
        {
          ((mode === 1 && statType === 'stat') || mode === 2) && (
            <div className={styles.cardStat}>
              {
                mode === 2 && <img src={VIEW_ICON} className={styles.cardIcon} alt="" />
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
          mode === 1 && statType === 'desc' && (
            <div className={`${styles.cardStat} textOverflow`} style={{ width: '100%' }}>{data.desc}</div>
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
          showPrice && mode !== 9 && (
            <div className={styles.cardPrice} style={{ paddingTop: '8px', marginTop: 'auto' }}>
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
        {
          mode === 9 && showPrice && (
            <div>
              <p className={styles.memberPrice}>
                会员价：¥
                {data.memberCardPrice || 0}
              </p>
              <p className={styles.originPrice}>
                原价：¥
                {data.price || 0}
              </p>
            </div>
          )
        }
      </div>
    </div>
  );
};

CardTpl2.defaultProps = {
  mode: 1,
  titleLine: 2,
  imageMaxWidth: '',
  imageHeight: 92,
  showPrice: true,
  showOriginalPrice: true,
  showTime: false,
  statType: 'stat',
  onClick: () => {},
};

CardTpl2.propTypes = {
  /**
   * 1. 录播课程
   * 2. 资料
   * 5. 金刚区
   * 6. 直播
   * 8. 考级
   * 9. 会员卡
   * 11. 考试
   * 12. 活动报名
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
  // 通用：是否需要展示时间,
  showTime: PropTypes.bool,
  // mode1：课程展示数据（desc/stat）
  statType: PropTypes.oneOf(['desc', 'stat']),
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

    // mode1：设置的展示数据
    showStat: PropTypes.arrayOf(PropTypes.string),

    // mode5，6：格式化后的时间/时间段
    timeText: PropTypes.string,

    // mode5：金刚区类型（暂时先用中文代替数值）
    objectType: PropTypes.string,

    // mode6：直播状态
    liveStatus: PropTypes.string,
    // mode6：直播状态样式
    liveStatusStyles: PropTypes.objectOf(PropTypes.string),

    // mode9：会员卡价格
    memberCardPrice: PropTypes.number,
  }).isRequired,

  onClick: PropTypes.func,
};

export default CardTpl2;
