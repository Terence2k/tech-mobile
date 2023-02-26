import React from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import { IBrowser } from '@/models/types';
import actions from 'actions';
import { usePage } from 'hooks';

// 全局组件
import {
  Banner,
  ProductTitle,
  ProductPrice,
  CountStat,
  ProductDesc,
  ProductTeachers,
  ProductModule,
  ProductSubmitBar,
  ProductMediaList,
  ProductRelatedProductList,
  ProductTicketList,
  ProductFavorites,
} from 'components';
// 私有组件
import SingleCourseList from './components/singleCourseList';
//
import styles from './index.scss';

// const isDevelopment = process.env.NODE_ENV === 'development';

const mapStateToProps = (state: any) => ({
  browser: state.browser as IBrowser,
  courseProduct: state.courseProduct,
});

const mapDispatchToProps = (dispatch: any) => ({
  getCourseDetail: () => {
    dispatch({ type: 'courseProduct/getCourseDetail' });
  },
  share: () => {
    dispatch({ type: 'courseProduct/share' });
  },
  clickHandler: (handler) => {
    dispatch(handler);
  },
  fav: () => {
    dispatch({ type: 'courseProduct/favoriteCourse' });
  },
  showProductTicketPopup: (productId: string) => {
    dispatch(actions.ticket.showProductTicketList(productId));
  },
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace: 'courseProduct' })),
});

type IProp = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Page: React.FC = (props: any) => {
  const {
    browser,
    courseProduct,
    getCourseDetail,
    clickHandler,
    share,
    fav,
    showProductTicketPopup,
    onShareAppMessage,
  }: IProp = props;

  usePage({ onShareAppMessage });

  // 课程内容 || 课程大纲
  const { productSinglecourseList: singlecourse } = courseProduct;

  React.useEffect(() => {
    if (['/course/product', '/course/product/'].findIndex((item) => item === browser.locationPathname) !== -1) {
      getCourseDetail();
    }
  }, [getCourseDetail, browser.locationQuery.course_id, browser.locationPathname]);

  if (courseProduct.isLoading) {
    return (<div />);
  }

  return (
    <div className="pageFixed">
      <div className="pageFixed_content">
        <Banner data={courseProduct.banner} />
        <div className={styles.infoLayout}>
          <ProductTitle style={{ padding: '15px 15px 0' }} title={courseProduct.productTitle} />
          <ProductPrice style={{ padding: '0 15px', marginTop: '8px' }} {...courseProduct.productPrice} />
          <CountStat style={{ padding: '0 15px' }} {...courseProduct.countStat} />
          <ProductDesc style={{ padding: '0 15px 5px 15px' }} {...courseProduct.productDesc} />
          {
            courseProduct.productTicketList && !!courseProduct.productTicketList.list.length
            && singlecourse.joinFlag === 'n' && (
              <ProductTicketList
                style={{ marginLeft: '15px', marginTop: '8px', borderBottom: 'none' }}
                onClick={() => showProductTicketPopup(courseProduct.productId)}
                {...courseProduct.productTicketList}
              />
            )
          }
        </div>
        {
          // 教师区块
          courseProduct.productTeachers && !!courseProduct.productTeachers.list.length && (
            <ProductModule title={courseProduct.productTeachers.name}>
              <ProductTeachers {...courseProduct.productTeachers} />
            </ProductModule>
          )
        }
        {
          // 课程内容 || 课程大纲
          singlecourse.list && !!singlecourse.list.length && (
            <ProductModule title={singlecourse.name}>
              <SingleCourseList {...singlecourse} courseId={browser.locationQuery.course_id || ''} />
            </ProductModule>
          )
        }
        {
          // 图文区块
          !!courseProduct.productMediaList
          && courseProduct.productMediaList.list.length > 0
          && courseProduct.productMediaList.list[0].node.length > 0 && (
            <ProductModule title={courseProduct.productMediaList.name} style={{ padding: '0 10px' }}>
              <ProductMediaList {...courseProduct.productMediaList.list[0]} />
            </ProductModule>
          )
        }
        {
          // 推荐商品
          !!courseProduct.productRelatedProductList
          && !!courseProduct.productRelatedProductList.list.length && (
            <ProductModule title={courseProduct.productRelatedProductList.name}>
              <ProductRelatedProductList
                {...courseProduct.productRelatedProductList}
              />
            </ProductModule>
          )
        }
      </div>
      <div className={classNames('pageFixed__bottomLayout', {
        pc: !browser.isMobileBrowser,
      })}
      >
        <ProductSubmitBar
          onShareClick={() => {
            share();
          }}
          onMenuClick={(res: any) => {
            clickHandler(res.handler);
          }}
          {...courseProduct.productSubmitBar}
        />
      </div>
      {/* 收藏 */}
      <ProductFavorites
        onClick={() => {
          fav();
        }}
        {...courseProduct.productFavorites}
      />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
