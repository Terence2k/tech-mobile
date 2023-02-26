import React from 'react';
import { connect } from 'dva';
import actions from 'actions';
import PropTypes from 'prop-types';

const mapStateToProps = (state: any) => ({
  isWeixinBrowser: state.browser.isWeixinBrowser,
});

const mapDispatchToProps = (dispatch: any) => ({
  uploadFile: (filePath, onUploaded) => {
    dispatch(actions.upload.uploadFile('video', filePath, onUploaded));
  },
  // jump: (type, objectIds) => {
  //   dispatch({ type: 'weixin/jump', payload: { type, objectIds } });
  // },
  // pullJumpRecord: (type, objectIds) => {
  //   dispatch({ type: 'weixin/pullJumpRecord', payload: { type, objectIds } });
  // },
  // jumpToPage: (path) => dispatch(actions.browser.jumpToPage(path)),
  // addEventReceive: () => {
  //   console.log('addEventReceive');
  // },
});

const Index: React.FC<any> = (props: any) => {
  const {
    isWeixinBrowser,
    children,
    uploadFile,
    onUploaded,
  } = props;

  const fileInput = React.useRef(null);

  return (
    <div style={{ position: 'relative' }}>
      {children}
      <input
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
        }}
        type="file"
        multiple
        accept="video/*"
        ref={fileInput}
        onChange={() => {
          const current: any = fileInput && fileInput.current;
          uploadFile(current && current.files, onUploaded);
          setTimeout(() => {
            fileInput.current.type = 'text';
            fileInput.current.type = 'file';
          }, 100);
        }}
      />
    </div>
  );
};

Index.defaultProps = {
};

Index.propTypes = {
  onUploaded: PropTypes.shape({
    type: PropTypes.string.isRequired,
    paylad: PropTypes.shape({}).isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
