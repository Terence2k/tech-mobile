import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import actions from 'actions';
import { Recorder } from 'utils/recorder';
import { connect } from 'dva';

import { Popup } from 'components';
import ClipboardJS from 'clipboard';
import classNames from 'classnames';

import styles from './audioMeus.scss';
import STAR from './image/star_icon.png';
import STOP from './image/stop_icon.png';

let recorder;
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

function startRecorder(useJsSdk, setRecorderStatus) {
  if (useJsSdk) {
    // eslint-disable-next-line no-undef
    wx.startRecord();
    setRecorderStatus('录音中');
    return;
  }
  if (recorder) {
    recorder.clear();
    recorder.record();
    setRecorderStatus('录音中');
  }
}

function stopRecorder(useJsSdk, setWxLocalId, setRecorderStatus) {
  if (useJsSdk) {
    wx.stopRecord({
      success(res) {
        const { localId } = res;
        setWxLocalId(localId);
        setRecorderStatus('');
      },
    });
    return;
  }

  if (recorder) {
    recorder.stop();
    setRecorderStatus('');
  }
}

const mapStateToProps = (state: any) => ({
  browser: state.browser,
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

// const mapStateToProps = (state: any) => ({
//   browser: state.browser,
//   correcting: state.correcting,
//   isWeixinBrowser: state.browser.isWeixinBrowser,
// });

// const mapDispatchToProps = (dispatch: any) => ({
//   uploadFile: async (file, onUploaded) => {
//     // const file = await fetch(mediaBlobUrl).then((r) => r.blob());
//     // console.log('!!!', file, mediaBlobUrl);
//     // dispatch(actions.upload.uploadFile('audio', [file], onUploaded));
//   },
//   uploadWxFile: async (localId, onUploaded) => {
//     dispatch(actions.upload.uploadWxFile('audio', localId, onUploaded));
//   },
// });

const Menus: React.FC<any> = (props: any) => {
  const {
    isMobileBrowser,
    onClose, remarkFileList, exitRecording,
    uploadFile,
    uploadWxFile,
    onUploaded,
  } = props;
  const [recorderStatus, setRecorderStatus] = React.useState('点击开始');
  const [wxLocalId, setWxLocalId] = React.useState('');
  const [save, setSave] = React.useState(false);
  const [maxRecordTimer, setMaxRecordTimer] = React.useState<any>(null);
  const [useJsSdk, setUseJsSdk] = React.useState(false);
  const [openClock, setOpenClock] = React.useState(false);
  const [recordStatus, setRecordStatus] = React.useState(false);
  const [num, setNum] = useState(0);
  const [isSend, setIsSend] = useState(false);

  const numberFormat = (numTime: number = 0) => {
    const hours = Math.floor(numTime / 3600);
    let secs = numTime - hours * 3600;
    const minutes = Math.floor(secs / 60);

    secs = numTime - hours * 3600 - minutes * 60;
    let output = `${minutes > 9 ? minutes : `0${minutes}`}:${secs > 9 ? secs : `0${secs}`}`;

    if (hours) {
      output = `${hours > 9 ? hours : `0${hours}`}:${output}`;
    }
    return output;
  };

  function uploadRecord() {
    if (recorder) {
      recorder.exportWAV((blob) => {
        uploadFile(blob, onUploaded);
      });
    } else if (useJsSdk && wxLocalId) {
      uploadWxFile(wxLocalId, onUploaded);
    }
  }

  const saveRecord = () => {
    console.log('shangchuan 1');

    if (save) {
      console.log('shangchuan 2');

      uploadRecord();
      exitRecording();
    }
  };

  useEffect(() => {
    if (isSend && !maxRecordTimer) {
      setMaxRecordTimer(setInterval(() => {
        // 这时候的num由于闭包的原因，一直是0，所以这里不能用setNum(num-1)
        setNum((n) => {
          console.log(n, '秒数');
          if (n === (useJsSdk ? 59 : 599)) {
            setIsSend(false);
            clearInterval(maxRecordTimer);
            stopRecorder(useJsSdk, setWxLocalId, setRecordStatus);
            setIsSend(false);
            setRecorderStatus('');
          }
          return n + 1;
        });
      }, 1000));
    } else if (!isSend && maxRecordTimer) {
      clearInterval(maxRecordTimer);
      setMaxRecordTimer(null);
    }
  }, [isSend, maxRecordTimer, useJsSdk]);

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
        setUseJsSdk(true);
      } else {
        getUserMedia({ audio: true }, startUserMedia, (e: any) => {
          console.log(`No live audio input: ${e}`);
        });
      }
    }
  }, []);

  React.useEffect(() => {
    const clipboard = new ClipboardJS('#clipboard-url');
    clipboard.on('success', (e) => {
      e.clearSelection();
      onClose();
    });
    return () => {
      clipboard.destroy();
    };
  }, [onClose, remarkFileList]);

  function starAction() {
    setRecordStatus(!recordStatus);
    setOpenClock(true);
    if (!recordStatus) {
      console.log('star');
      setSave(true);
      startRecorder(useJsSdk, setRecordStatus);
      setNum(0);
      setIsSend(true);
      setRecorderStatus('录制中');
    } else {
      stopRecorder(useJsSdk, setWxLocalId, setRecordStatus);
      setIsSend(false);
      console.log('stop');
      setRecorderStatus('');
    }
  }

  return (
    <div className={classNames(styles.layout, {
      [styles.pc]: !isMobileBrowser,
    })}
    >
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          { `单次录音最长可录制${useJsSdk ? 1 : 10}分钟，请注意录音时间`}
        </div>
        <div className={styles.content}>
          <div className={styles.reRecord}>重新录音</div>
          <div onClick={() => starAction()}>
            {
              recordStatus ? (
                <div><img className={styles.pic} src={STOP} alt="" /></div>
              ) : (<div><img className={styles.pic} src={STAR} alt="" /></div>)
            }
          </div>

          <div className={styles.saveRedorder} onClick={() => saveRecord()}>{openClock && !recordStatus ? '保存录音' : ''}</div>
        </div>
        <div className={styles.time}>
          {recorderStatus}
          {openClock && (
            <span>{numberFormat(num)}</span>
          )}
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.footerButton} onClick={() => exitRecording()}>取消</div>
      </div>
    </div>
  );
};

const Index: React.FC<any> = (props: any) => {
  const {
    browser, visible, onClose, onSubmit, remarkFileList, removeItem, exitRecording,
    uploadFile, uploadWxFile, onUploaded,
  } = props;

  return (
    <Popup
      type="bottom"
      isActive={visible}
      size={{ width: browser.isMobileBrowser ? '100%' : '375px', height: 'auto' }}
      content={(
        <Menus
          isMobileBrowser={browser.isMobileBrowser}
          onSubmit={onSubmit}
          onClose={onClose}
          remarkFileList={remarkFileList}
          removeItem={removeItem}
          exitRecording={exitRecording}
          uploadFile={uploadFile}
          uploadWxFile={uploadWxFile}
          onUploaded={onUploaded}
        />
      )}
    />
  );
};

Index.propTypes = {
  visible: PropTypes.bool.isRequired,
  // onClose: PropTypes.func.isRequired,
  // onSubmit: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
