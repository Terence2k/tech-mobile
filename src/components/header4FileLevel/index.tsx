import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const VIEW_ICON = require('./images/readIcon.png');

const Header4FileLevel: React.FC = (props: any) => {
  const {
    title, cover, author, desc, viewCount, showViewCount, price, originalPrice,
  } = props;

  return (
    <div className={styles.headerLayout}>
      <img src={cover} className={styles.headerCover} alt="" />
      <div className={styles.headerContent}>
        <p className={styles.headerTitle}>{title}</p>
        {
          author && (
          <p className={`${styles.headerDesc} ${styles.author}`}>
            作者：
            {author}
          </p>
          )
        }
        {
          desc && (
          <p className={`${styles.headerDesc} ${styles.desc}`}>
            {desc}
          </p>
          )
        }
        <div className={`${styles.headerBottom} flexLayout center`}>
          {
            showViewCount && (
            <span className={`${styles.headerDesc} ${styles.viewCount} flexLayout`}>
              <img src={VIEW_ICON} className={styles.headerDescIcon} alt="" />
              浏览数·
              {viewCount || 0}
            </span>
            )
          }
          {
            price > 0 && (
            <span className={styles.headerPrice}>
              {
                originalPrice > 0 && (
                <span className={styles.delPrice}>
                  ¥
                  {originalPrice}
                </span>
                )
              }
              <span className={styles.innerPrice}>
                ¥
                {price}
              </span>
            </span>
            )
          }
          {
            price === 0 && (
              <span className={styles.innerPrice}>免费</span>
            )
          }
        </div>
      </div>
    </div>
  );
};

Header4FileLevel.defaultProps = {
  title: '',
  cover: '',
  author: '',
  desc: '',
  showViewCount: false,
  viewCount: 0,
  price: 0,
  originalPrice: 0,
};

Header4FileLevel.propTypes = {
  title: PropTypes.string,
  cover: PropTypes.string,
  author: PropTypes.string,
  desc: PropTypes.string,
  showViewCount: PropTypes.bool,
  viewCount: PropTypes.number,
  price: PropTypes.number,
  originalPrice: PropTypes.number,
};

export default Header4FileLevel;
