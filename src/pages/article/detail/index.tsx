import React from 'react';
import { connect } from 'dva';
import actions from 'actions';
import { usePage } from 'hooks';

import { ProductMediaList } from 'components';
import { IBrowser } from '@/models/types';
import styles from './index.scss';
import { namespace } from './model';

const LIKE_ICON = require('./images/likeIcon.png');
const LIKE_ICON_ACTIVE = require('./images/likeIconActive.png');
const POST_ICON = require('./images/postIcon.png');

const mapStateToProps = (state: any) => ({
  articleDetail: state.articleDetail,
  browser: state.browser as IBrowser,
});

const mapDispatchToProps = (dispatch) => ({
  getArticleDetail: () => {
    dispatch({ type: 'articleDetail/getArticleDetail' });
  },
  likeClick: () => {
    dispatch({ type: 'articleDetail/likeClick' });
  },
  postClick: () => {
    dispatch(actions.popup.showShareMenu('', [{
      label: '复制链接',
      type: 'link',
    }]));
  },
  onLoad: () => dispatch(actions.onLoad({ namespace })),
  onShareAppMessage: () => dispatch(actions.onShareAppMessage({ namespace })),
});

type IProp = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Page: React.FC = (props: any) => {
  const {
    articleDetail, likeClick, postClick, browser, onLoad, onShareAppMessage,
  }: IProp = props;
  const { articleContent } = articleDetail;

  usePage({ onLoad, onShareAppMessage });

  return (
    <div className={styles.articleLayout}>
      <p className={styles.articleTitle}>{articleDetail.title}</p>
      <p className={styles.articleAuthor}>
        作者：
        {articleDetail.author}
      </p>
      <p className={styles.articleData}>
        {articleDetail.createTime}
        · 浏览
        {articleDetail.viewCount}
        次
      </p>
      <div className={styles.articleDesc}>{articleDetail.desc}</div>
      <ProductMediaList {...articleContent[0]} />
      <div className={styles.articleOperation} style={{ width: browser.isMobileBrowser ? '100%' : '375px', left: browser.isMobileBrowser ? '0' : 'calc(50% - 187.5px)' }}>
        {/* <div className={styles.articleOperationInput}>发表你的评论...</div> */}
        <div className={`${styles.articleIcons} flexLayout center`}>
          <div className={`${styles.articleIconsItem} flexLayout center`} onClick={() => likeClick()}>
            <img src={articleDetail.likeFlag === 'y' ? LIKE_ICON_ACTIVE : LIKE_ICON} alt="" className={styles.articleIconsItemInner} />
            {articleDetail.likeCount}
          </div>
          <div className={`${styles.articleIconsItem} flexLayout center`} onClick={() => postClick()}>
            <img src={POST_ICON} alt="" className={styles.articleIconsItemInner} />
            {articleDetail.postCount}
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
