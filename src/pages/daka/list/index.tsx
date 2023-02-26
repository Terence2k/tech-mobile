import React from 'react';
import { connect } from 'dva';
import actions from 'actions';
import { usePage } from 'hooks';
// import { Toast } from 'antd-mobile';
import classNames from 'classnames';
import getImageHeight from '@/common/getImageHeight';
import { WxJump } from '@/components';

// https://swiperjs.com/react/
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, {
  EffectFade, Navigation, Pagination, Scrollbar, A11y, Autoplay,
} from 'swiper';

import {
  ProductMembers,
  CardTpl3,
} from 'components';

import styles from './index.scss';
import { namespace } from './model';

import 'swiper/swiper.scss';
import 'swiper/components/effect-fade/effect-fade.scss';
// import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
// import 'swiper/components/scrollbar/scrollbar.scss';

SwiperCore.use([EffectFade, Navigation, Pagination, Scrollbar, A11y, Autoplay]);

const mapStateToProps = (res: any) => ({
  state: res[namespace],
});

const mapDispatchToProps = (dispatch: any) => ({
  jumpToPage: (path: string, params: object) => dispatch(actions.jumpToPage(path, params)),
  onLoad: () => dispatch(actions.onLoad({ namespace })),
  onReachBottom: () => dispatch(actions.onReachBottom({ namespace })),
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace })),
});

const tpl3Height = getImageHeight(3, 166 / 343);

type IProp = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const Page: React.FunctionComponent<any> = (props: any) => {
  const {
    // models
    state,
    // action methods
    onLoad,
    onReachBottom,
    onShareAppMessage,
  }: IProp = props;

  usePage({ onLoad, onReachBottom, onShareAppMessage });

  React.useEffect(() => {
    const { title = '打卡列表' } = state.IconNavigationDetail || {};
    document.title = title;
  }, [state.IconNavigationDetail]);

  return (
    <div className={styles.layout}>
      {
        state.todaylist && state.todaylist.length > 0 && (
          <>
            <div className={styles.sectionFlex}>
              <div className={styles.sectionFlex__bd}>今日打卡</div>
              <div className={styles.sectionFlex__ft} />
            </div>
            <Swiper
              autoplay
              pagination={{ clickable: true }}
              effect="coverflow"
              style={{ width: '100%', height: `${tpl3Height}px` }}
            >
              {state.todaylist.map((item, index) => {
                const members = item.member_list.map((m) => ({ headimgurl: m.headimgurl }));
                return (
                  <SwiperSlide key={index.toString()}>
                    <div key={index.toString()} className={styles.item}>
                      <WxJump {...item.jumpInfo}>
                        <div style={{ width: '100%', height: `${tpl3Height}px`, position: 'relative' }}>
                          <img
                            style={{
                              width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px',
                            }}
                            src={item.image}
                            alt=""
                          />
                          <div style={{
                            position: 'absolute', left: '15px', top: '24px', right: '25px', bottom: '0',
                          }}
                          >
                            <div style={{ fontSize: '18px', color: 'white' }}>{item.title}</div>
                            <ProductMembers style={{ marginTop: '12px' }} nameStyle={{ color: 'white' }} count={item.join_count} name="打卡" list={members} />
                            <div className={classNames(styles.buttondataka, {
                              [styles.done]: item.today_daka_flag === 'y',
                            })}
                            >
                              {item.today_daka_flag === 'n' ? '去打卡' : '已打卡'}
                            </div>
                          </div>
                        </div>
                      </WxJump>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </>
        )
      }
      {
        state.dakalist && state.dakalist.length > 0 && (
          <>
            <div className={styles.sectionFlex}>
              <div className={styles.sectionFlex__bd}>全部打卡</div>
              <div className={styles.sectionFlex__ft} />
            </div>
            {
              state.dakalist.map((item, index) => (
                <div
                  key={index.toString()}
                  className={styles.item}
                >
                  <WxJump
                    {...item.jumpInfo}
                  >
                    <CardTpl3
                      mode={10}
                      showPrice={false}
                      data={item}
                      imageHeight={tpl3Height}
                    />
                  </WxJump>
                </div>
              ))
            }
          </>
        )
      }
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
