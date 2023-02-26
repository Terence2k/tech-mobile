import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import weixin from 'common/weixin';
import actions from 'actions';
import { useDimensions } from 'hooks';

// import styles from './index.scss';

const mapStateToProps = (state: any) => ({
  jumpRecords: state.weixin.jumpRecords,
  jumpId: state.weixin.jumpId,
  isWeixinBrowser: state.browser.isWeixinBrowser,
  isLogin: state.user.isLogin,
});

const mapDispatchToProps = (dispatch: any) => ({
  jump: (type, objectIds) => {
    dispatch({ type: 'weixin/jump', payload: { type, objectIds } });
  },
  pullJumpRecord: (type, objectIds) => {
    dispatch({ type: 'weixin/pullJumpRecord', payload: { type, objectIds } });
  },
  jumpToPage: (path) => dispatch(actions.browser.jumpToPage(path)),
  addEventReceive: () => {
    console.log('addEventReceive');
  },
});

const Index: React.FC<any> = (props: any) => {
  const {
    // jumpId,
    isWeixinBrowser,
    jumpRecords,
    children,
    jump,
    pullJumpRecord,
    jumpToPage,
    addEventReceive,
    type,
    objectIds,
    webUrl,
    style,
    isTeachingPlan,
    isLogin,
  } = props;

  // const [rect, setRect] = React.useState({ width: 0, height: 0 });
  // const [elemId] = React.useState(`${Math.random()}`);

  React.useEffect(() => {
    if (type && !webUrl) {
      pullJumpRecord(type, objectIds);
    }
  }, [pullJumpRecord, type, objectIds, webUrl]);

  const [ref, { width, height }] = useDimensions();

  // const elem = document.getElementById(elemId);
  // if (elem && rect.width === 0 && rect.height === 0
  //   && elem.clientWidth > 0 && elem.clientHeight > 0) {
  //   setRect({ width: elem.clientWidth, height: elem.clientHeight });
  // }

  if (!webUrl && !type) {
    return (
      <div style={style}>
        {children}
      </div>
    );
  }

  if (webUrl) {
    return (
      <div
        onClick={() => {
          if (isTeachingPlan) {
            addEventReceive();
          }
          jumpToPage(webUrl);
        }}
        style={style}
      >
        {children}
      </div>
    );
  }

  if (!isWeixinBrowser) {
    return (
      <div
        onClick={() => {
          if (isTeachingPlan) {
            addEventReceive();
          }
          jump(type, objectIds);
        }}
        style={style}
      >
        {children}
      </div>
    );
  }

  const record = jumpRecords[weixin.genJumpRecordKey(type, objectIds, isLogin)];
  let path = '';
  if (!record) {
    return (
      <div ref={ref} style={style}>
        {children}
      </div>
    );
  }

  // if (record.userName === 'gh_8420fce90a67') {
  //   // 美阅视频特殊处理, 不带h5_jump_id
  //   path = `${record.path}`;
  // } else if (record.path.indexOf('?') >= 0) {
  //   path = `${record.path}&h5_jump_id=${jumpId}`;
  // } else {
  //   path = `${record.path}?h5_jump_id=${jumpId}`;
  // }
  path = `${record.path}`;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {children}
      {/* @ts-ignore */}
      <wx-open-launch-weapp
        username={record.userName}
        path={path}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <script type="text/wxtag-template">
          <div style={{ width: `${width}px`, height: `${height}px` }} />
        </script>
        {/* @ts-ignorei */}
      </wx-open-launch-weapp>
    </div>
  );
};

Index.defaultProps = {
  style: {},
  webUrl: '',
  type: '',
  objectIds: {},
  isTeachingPlan: false,
};

// webUrl存在，则直接跳转网页；webUrl不存在，使用type和objectIds，获取跳转码或者渲染跳转控件
Index.propTypes = {
  type: PropTypes.string,
  objectIds: PropTypes.shape({}),
  webUrl: PropTypes.string,
  style: PropTypes.shape({}),
  isTeachingPlan: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
