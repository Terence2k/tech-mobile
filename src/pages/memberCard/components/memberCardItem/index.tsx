import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import styles from './index.scss';

const MemberCardItem: React.FC<any> = (props: any) => {
  const {
    data, mode, isMobile, onClick,
  } = props;

  const cardSize = {
    width: ((isMobile ? document.body.scrollWidth : 375) - 30),
    height: (217 * ((isMobile ? document.body.scrollWidth : 375) - 30)) / 345,
  };

  return (
    <div
      className={styles.memberCard}
      style={{
        backgroundImage: `url(${data.background})`,
        width: cardSize.width,
        height: cardSize.height,
        color: data.color || '#FFF',
      }}
      onClick={() => onClick()}
    >
      {
        mode === 1
        && (
        <div className="flexLayout column spaceBetween" style={{ height: '100%' }}>
          <div>
            <p className={`${styles.title} textOverflow`}>{data.title}</p>
            <div>
              {
                data.desc
                && data.desc.slice(0, 2).map((descItem, descIndex) => (
                  <p className={styles.desc} key={descIndex.toString()}>
                    {descItem}
                  </p>
                ))
              }
              {
                data.desc.length > 2 && <p className={`${styles.desc} textOverflow`}>...</p>
              }
            </div>
          </div>
          <p className="flexLayout center spaceBetween">
            <span className={styles.price}>
              ¥
              {data.price || 0}
              {
                data.originalPrice > 0 && (
                <span className={styles.originalPrice}>
                  ¥
                  {data.originalPrice}
                </span>
                )
              }
            </span>
            <span className={styles.period}>
              {typeof (data.period) === 'number' ? `有效期${data.period}天` : data.period}
            </span>
          </p>
        </div>
        )
      }
      {
        (mode === 2 || mode === 3)
        && (
          <div className="flexLayout column spaceBetween" style={{ height: '100%' }}>
            <div className={`${styles.header} flexLayout start spaceBetween`}>
              <div className={`${styles.userLayout} flexLayout center`}>
                <img src={data.userImage} alt="" className={styles.userImage} />
                <div className={styles.userContent}>
                  <p className={`${styles.userTitle} textOverflow`}>{data.userName}</p>
                  <p className={`${styles.userClient} textOverflow`}>{data.subtitle}</p>
                </div>
              </div>
              {
                data.enabled === 'n' && <div className={`${styles.tag} ${styles.blackTag}`}>已失效</div>
              }
              {
                data.enabled === 'y' && data.expireFlag === 'y'
                && <div className={styles.tag}>已过期</div>
              }
              {
                data.enabled === 'y' && data.expireFlag === 'n'
                && (
                <div className={styles.tag}>
                  生效中·
                  {data.expiredTime > 0
                    ? `${moment(data.expiredTime).format('YYYY-MM-DD')}到期` : '永久有效'}
                </div>
                )
              }
            </div>
            <div className="flexLayout center spaceBetween">
              <span className={`${styles.userCardTitle} textOverflow`}>{data.title}</span>
              {
                mode === 2 && <span className={styles.userCardBtn}>查看详情 &gt;</span>
              }
              {
                mode === 3 && <span />
              }
            </div>
          </div>
        )
      }
    </div>
  );
};

MemberCardItem.defaultProps = {
  mode: 1,
  isMobile: true,
  onClick: () => {},
};

MemberCardItem.propTypes = {
  // 1未拥有，2拥有，3详情
  mode: PropTypes.number,
  data: PropTypes.shape({
    title: PropTypes.string,
    background: PropTypes.string,
    desc: PropTypes.arrayOf(PropTypes.string),
    price: PropTypes.number,
    originalPrice: PropTypes.number,
    period: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    expiredTime: PropTypes.number,
    enabled: PropTypes.string,
    expireFlag: PropTypes.string,
    userName: PropTypes.string,
    userImage: PropTypes.string,
    subtitle: PropTypes.string,
  }).isRequired,
  isMobile: PropTypes.bool,
  onClick: PropTypes.func,
};

export default MemberCardItem;
