import React from 'react';
import { connect } from 'dva';
import actions from 'actions';
import PropTypes from 'prop-types';
import { Recorder } from 'utils/recorder';

let recorder;
let useJsSdk = false;
function startUserMedia(stream) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    const audioContext = new AudioContext();
    const input = audioContext.createMediaStreamSource(stream);
    recorder = new Recorder(input);
  } catch (e) {
    console.error('No web audio support in this browser!');
  }
}

const mapStateToProps = (state: any) => ({
  isWeixinBrowser: state.browser.isWeixinBrowser,
});

const mapDispatchToProps = (dispatch: any) => ({
  uploadFile: async (file, onUploaded) => {
    // const file = await fetch(mediaBlobUrl).then((r) => r.blob());
    // console.log('!!!', file, mediaBlobUrl);
    dispatch(actions.upload.uploadFile('audio', [file], onUploaded));
  },
  uploadWxFile: async (localId, onUploaded) => {
    dispatch(actions.upload.uploadWxFile('audio', localId, onUploaded));
  },
});

const Index: React.FC<any> = (props: any) => {
  const {
    uploadFile,
    uploadWxFile,
    onUploaded,
  } = props;
  const [recorderStatus, setRecorderStatus] = React.useState('开始');
  const [wxLocalId, setWxLocalId] = React.useState('');
  function startRecorder() {
    if (useJsSdk) {
      // eslint-disable-next-line no-undef
      wx.startRecord();
      setRecorderStatus('recording');
      return;
    }
    if (recorder) {
      recorder.record();
      setRecorderStatus('recording');
    }
  }

  function stopRecorder() {
    if (useJsSdk) {
      // eslint-disable-next-line no-undef
      wx.stopRecord({
        success(res) {
          const { localId } = res;
          setWxLocalId(localId);
          setRecorderStatus('stop');
        },
      });
      return;
    }

    if (recorder) {
      recorder.stop();
      setRecorderStatus('stop');
    }
  }

  function uploadRecord() {
    if (recorder) {
      recorder.exportWAV((blob) => { uploadFile(blob, onUploaded); });
    } else if (useJsSdk && wxLocalId) {
      uploadWxFile(wxLocalId, onUploaded);
    }
  }

  React.useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia !== undefined) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        startUserMedia(stream);
      });
    } else {
      const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
      if (!getUserMedia) {
        // 微信内, 不用处理
        // alert('no getUserMedia');
        useJsSdk = true;
      } else {
        getUserMedia({ audio: true }, startUserMedia, (e: any) => {
          console.log(`No live audio input: ${e}`);
        });
      }
    }
  }, []);

  return (
    <div>
      <p>{recorderStatus}</p>
      <button type="button" onClick={startRecorder}>开始</button>
      <button type="button" onClick={stopRecorder}>完成录音</button>
      <button
        type="button"
        onClick={uploadRecord}
      >
        保存
      </button>
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
