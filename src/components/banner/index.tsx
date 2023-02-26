import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { useDimensions } from 'hooks';

// https://swiperjs.com/react/
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, {
  EffectFade, Navigation, Pagination, Scrollbar, A11y, Autoplay,
} from 'swiper';

import { WxJump, VideojsPlayer } from 'components';

import styles from './index.scss';

// import 'swiper/swiper.scss';
// import 'swiper/components/effect-fade/effect-fade.scss';
// // import 'swiper/components/navigation/navigation.scss';
// import 'swiper/components/pagination/pagination.scss';
// // import 'swiper/components/scrollbar/scrollbar.scss';

SwiperCore.use([EffectFade, Navigation, Pagination, Scrollbar, A11y, Autoplay]);

const mapStateToProps = (state: any) => ({
  browser: state.browser,
});

const Index: React.FC = (props: any) => {
  const {
    style, data = [], scale,
    autoplay,
  } = props;

  const [ref, { width }] = useDimensions();
  const itemsRef = useRef<{ [key: string]: any }>([]);

  const banners = [...data];

  const media = (banner, key = 0) => (
    <>
      {
        banner.type === 'image' && (
          <img
            className={styles.image}
            src={banner.url}
            alt=""
          />
        )
      }
      {
        banner.type === 'video' && (
          <VideojsPlayer
            url={banner.url}
            ref={(el: any) => {
              itemsRef.current[String(key)] = el;
            }}
          />
        )
      }
    </>
  );

  const bannerLayout = (banner, key = 0) => {
    if (banner.jumpInfo) {
      return (
        <WxJump
          style={{ width: '100%', height: '100%' }}
          {...banner.jumpInfo}
        >
          {media(banner, key)}
        </WxJump>
      );
    }

    return (
      <>{media(banner, key)}</>
    );
  };
  return (
    <>
      {
        banners.length > 0 && (
          <div
            ref={ref}
            className={styles.swiper}
            style={{
              ...style,
              height: `calc(${width}px * ${scale})`,
            }}
          >
            {
              banners.length === 1 && bannerLayout(banners[0])
            }
            {
              banners.length > 1 && (
                <Swiper
                  autoplay={autoplay}
                  pagination={{ clickable: true }}
                  effect="coverflow"
                  onActiveIndexChange={(swiper) => {
                    const sw = swiper;
                    if (itemsRef.current[String(sw.activeIndex)]) {
                      sw.autoplay.stop();
                      sw.pagination.el.hidden = true;
                      itemsRef.current[String(sw.activeIndex)].play();
                    } else {
                      sw.pagination.el.hidden = false;
                    }
                  }}
                  style={{ width: '100%', height: '100%', borderRadius: '6px' }}
                >
                  {banners.map((i, el) => (
                    <SwiperSlide key={el.toString()}>
                      {bannerLayout(i, el)}
                    </SwiperSlide>
                  ))}
                </Swiper>
              )
            }
          </div>
        )
      }
    </>
  );
};

Index.defaultProps = {
  style: {},
  scale: 500 / 900,
  autoplay: true,
};

Index.propTypes = {
  style: PropTypes.objectOf(PropTypes.string),
  data: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    jumpInfo: PropTypes.shape({
      type: PropTypes.string,
      objectIds: PropTypes.shape({}),
      webUrl: PropTypes.string,
    }),
  }).isRequired).isRequired,
  // 比例
  scale: PropTypes.number,
  // 自动
  autoplay: PropTypes.bool,
};

export default connect(mapStateToProps)(Index);
