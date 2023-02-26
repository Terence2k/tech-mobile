import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Toast, Popover } from 'antd-mobile';

import ClipboardJS from 'clipboard';

import classNames from 'classnames';

// pic
import {
  Popup,
  ImageUploader,
  VideoUploader,
  VideoItems,
  PictureItem,
  AudioPlayerStyle2,
} from 'components';

import ADDTO from './image/addTo.png';
import STYLEONE from './image/styleOne.png';
import STYLETWO from './image/styleTwo.png';
import STYLEZERO from './image/styleThree.png';

import styles from './index.scss';
// pic
import AUDIO from './image/audio.png';
import PIC from './image/pic.png';
import VIDEO from './image/video.png';

const { Item } = Popover;
const mapStateToProps = (state: any) => ({
  browser: state.browser,
  correction: state.correction,
  iScore: state.correction.iScore,

});

const mapDispatchToProps = (dispatch: any) => ({
  updateiScore: (e) => {
    dispatch({ type: 'correction/updateState', payload: { iScore: e } });
  },
  updateiAnaylse: (e) => {
    dispatch({ type: 'correction/updateState', payload: { iAnaylse: e } });
  },
  updateHomework: (e) => {
    dispatch({ type: 'correction/updateState', payload: { homeScore: e } });
  },
  updateJoinSelect: (e) => {
    dispatch({ type: 'correction/updateState', payload: { joinSelect: e } });
  },

});

const Menus: React.FC<any> = (props: any) => {
  const {
    isMobileBrowser,
    onClose,
    onSubmit,
    remarkFileList,
    removeItem,
    showRecordMenu,
    remarkAudioFileList,
    removeAudioItem,
    score,
    updateiScore,
    updateiAnaylse,
    correction,
    clearAudioList,
    exampaperType,
    onSubmitHomework,
    updateHomework,
    updateJoinSelect,
    setCurrentStylePicStyles,
    changeHomeworkStyle,
  } = props;
  const [value, setValue] = React.useState('');
  const [analyse, setAnalyse] = React.useState('');
  const newObject = {
    value, analyse,
  };
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

  React.useEffect(() => {
    const filterCurrrntStyle = () => {
      let numbers = '0';
      if (setCurrentStylePicStyles === STYLEZERO) { numbers = '0'; }
      if (setCurrentStylePicStyles === STYLEONE) { numbers = '1'; }
      if (setCurrentStylePicStyles === STYLETWO) {
        numbers = '2';
      }
      setCurrentStyle(numbers);
    };
    filterCurrrntStyle();
    setValue(correction.iScore);
    setScorePic(correction.homeScore);
    setJoinSelect(correction.joinSelect);
    setCurrentStylePic(setCurrentStylePicStyles);
  }, [correction.iScore, correction.homeScore, correction.joinSelect,
    setCurrentStylePicStyles]);

  const closeCorrecting = () => {
    updateiScore('');
    setAnalyse('');
    updateiAnaylse('');
    onClose();
    clearAudioList();
    setScorePic(0);
    updateHomework(0);
    updateJoinSelect(false);
  };

  const socreChange = (e) => {
    console.log(e.target.value, 'score', score);

    setValue(e.target.value);
    updateiScore(e.target.value);
    if (e.target.value > score) {
      Toast.info('超过最大分值');
      setValue('');
      updateiScore('');
    }
  };

  const homeworkScore = () => {
    setJoinSelect(!joinSelect);
    updateJoinSelect(!joinSelect);
  };
  const changeanayles: any = (e) => {
    console.log(e.target.value, 'e');
    setAnalyse(e.target.value);
    updateiAnaylse(e.target.value);
  };
  const submitInfo = () => {
    onSubmit(newObject);
    setValue('');
    updateiScore('');
    // setAnalyse('');
    // updateiAnaylse('');
  };
  const submitInfoHomework = () => {
    onSubmitHomework({ scorePic, analyse, joinSelect });

    setValue('');
    updateiScore('');

    // updateiScore('');
    // setAnalyse('');
    // updateiAnaylse('');
  };
  const [isshowList, setIsshowList] = React.useState(false);
  const [currentStyle, setCurrentStyle] = React.useState('0');
  const [currentStylePic, setCurrentStylePic] = React.useState(STYLEZERO);
  const [scorePic, setScorePic] = React.useState(0);
  const [joinSelect, setJoinSelect] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const inputref = React.useRef<any>(null);
  const socreList = [1, 2, 3, 4, 5];

  const onSelect = (e) => {
    const list = [STYLEZERO, STYLEONE, STYLETWO];
    const listName = ['STYLEZERO', 'STYLEONE', 'STYLETWO'];
    setIsshowList(false);
    setCurrentStyle(e.key);
    console.log(e.key, 'e');
    setCurrentStylePic(list[e.key]);
    changeHomeworkStyle(list[e.key], listName[e.key]);
  };

  const markStyles: any = {
    position: 'absolute',
    right: '-5px',
    top: '-2px',
    fontSize: '8px',
    transform: 'scale(0.7)',
    color: '#595959',
  };
  return (
    <div className={classNames(styles.layout, {
      [styles.pc]: !isMobileBrowser,
    })}
    >
      <div className={classNames(styles.hideScrollBoxs, {
        [styles.pc]: !isMobileBrowser,
      })}
      >

        <div className={styles.contentWrapper}>
          {
            exampaperType === 'exam' && (
              <>
                <div className={styles.header}>
                  <div className={styles.txt}>打分</div>
                  <i className="iconfont iconguanbi" onClick={() => closeCorrecting()} />
                </div>
                <div className={styles.toMark}>
                  <div className={styles.input}>
                    {console.log(correction.iScore, 'iScore')}
                    <input className={styles.score} type="tel" maxLength={4} value={correction.iScore} onChange={(e) => socreChange(e)} />
                  </div>
                  <div className={styles.tips}>
                    /满分
                    {score}
                    分
                  </div>
                </div>
              </>
            )
          }
          {
            exampaperType === 'set' && (
              <>
                <div className={styles.header}>
                  <div className={styles.txt} onClick={() => setIsshowList(!isshowList)}>
                    打分
                    {
                      !isshowList ? <i className="iconfont iconshouqi" /> : <i className="iconfont iconzhankai" />
                    }

                  </div>
                  <i className="iconfont iconguanbi" onClick={() => closeCorrecting()} />
                </div>
                <Popover
                  visible={isshowList}
                  placement="bottomLeft"
                  onSelect={(e) => onSelect(e)}
                  overlay={[
                    (
                      <Item key="0" style={{ height: '40px', width: '54px', position: 'relative' }}>
                        {
                          currentStyle === '0' && (
                            <i className="iconfont iconxuanzezhengque" style={markStyles} />
                          )
                        }
                        <img className={styles.showMarkStyle} src={STYLEZERO} alt="" />

                      </Item>),
                    (
                      <Item key="1" style={{ height: '40px', width: '54px', position: 'relative' }}>
                        {
                          currentStyle === '1' && (
                            <i className="iconfont iconxuanzezhengque" style={markStyles} />
                          )
                        }
                        <img className={styles.showMarkStyle} src={STYLEONE} alt="" />
                      </Item>),
                    (
                      <Item key="2" style={{ height: '40px', width: '54px', position: 'relative' }}>
                        {
                          currentStyle === '2' && (
                            <i className="iconfont iconxuanzezhengque" style={markStyles} />
                          )
                        }
                        <img className={styles.showMarkStyle} src={STYLETWO} alt="" />
                      </Item>),
                  ]}
                >
                  <div style={{
                    height: '100%',
                    padding: '0 15px',
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '14px',
                  }}
                  />
                </Popover>
                <div className={styles.toMartByPic}>
                  {
                    socreList.map((markBox) => (
                      <div onClick={() => updateHomework(markBox)} key={markBox}>
                        <img
                          className={classNames(styles.markStyle, {
                            [styles.transpareant]: markBox > scorePic,
                          })}
                          src={currentStylePic}
                          alt=""
                        />
                      </div>
                    ))
                  }
                </div>
              </>
            )
          }
          <div className={styles.anaylse}>
            <div className={styles.anaylseTxt}>讲解</div>
          </div>
          {/* <AudioRecorder
          onUploaded={{ type: 'correction/audioUploaded', payload: {} }}
        /> */}
          <div className={styles.anaylseWay}>
            <div className={styles.anaylseWay_item} onClick={() => showRecordMenu()}>
              <img className={styles.pic} src={AUDIO} alt="" />
              <span>录音</span>
            </div>
            <ImageUploader
              onUploaded={{ type: 'correction/imageUploaded', payload: {} }}
            >
              <div className={styles.anaylseWay_item} onClick={() => { }}>
                <img className={styles.pic} src={PIC} alt="" />
                <span>图片</span>
              </div>
            </ImageUploader>
            <VideoUploader
              onUploaded={{ type: 'correction/videoUploaded', payload: {} }}
            >
              <div className={styles.anaylseWay_item}>
                <img className={styles.pic} src={VIDEO} alt="" />
                <span>视频</span>
              </div>
            </VideoUploader>
          </div>
          <div className={styles.textArea}>
            <textarea value={correction.iAnaylse} name="" id="" placeholder={exampaperType === 'exam' ? '请在这里填写讲解' : '请在这里填写点评'} onChange={(e) => changeanayles(e)} />
          </div>
          <div className={styles.showUploadFile}>
            <div className={styles.audioFile}>

              {
                remarkAudioFileList && remarkAudioFileList.map((audioFile) => (
                  <div key={audioFile.url} className={styles.file_audio}>
                    <AudioPlayerStyle2
                      url={audioFile.url}
                      durationText={audioFile.duration}
                    />
                    <i
                      className={`${styles.closeWrapper} iconfont iconyichu`}
                      style={{ width: '16px', height: '16px' }}
                      onClick={() => removeAudioItem(audioFile.url)}
                    />
                  </div>
                ))
              }
            </div>
            {
              exampaperType === 'exam' && (
                <div className={styles.fileWrapper}>
                  <div className={styles.hideScrollBox}>
                    {
                      remarkFileList && remarkFileList.map((fileItem, index) => (
                        <div className={styles.file_pic} key={`${index + fileItem.url}`}>
                          {
                            fileItem.type === 'video' && (
                              <div className={styles.fileItem}>
                                <VideoItems key={fileItem.url} style={{ marginTop: '10px' }} url={fileItem.url} />
                              </div>
                            )
                          }
                          {
                            fileItem.type === 'image' && (
                              <div className={styles.fileItem}>
                                <PictureItem key={fileItem.url} url={fileItem.url} />
                              </div>
                            )
                          }
                          <i
                            className={`${styles.closeWrapper} iconfont iconyichu`}
                            style={{ width: '16px', height: '16px' }}
                            onClick={() => removeItem(fileItem.url)}
                          />
                        </div>
                      ))
                    }

                  </div>
                </div>
              )
            }
            {/* <img src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1361135963,570304265&fm=26&gp=0.jpg" alt="" /> */}
            {/* 作业界面 */}
            {
              exampaperType === 'set' && (
                <div className={styles.fileWrapper}>
                  <div className={styles.hideScrollBox}>
                    {
                      remarkFileList && remarkFileList.map((fileItem, index) => (
                        <div className={styles.file_pic} key={`${index + fileItem.url}`}>
                          {
                            fileItem.type === 'video' && (
                              <div className={styles.fileItem}>
                                <VideoItems key={fileItem.url} style={{ marginTop: '10px' }} url={fileItem.url} />
                              </div>
                            )
                          }
                          {
                            fileItem.type === 'image' && (
                              <div className={styles.fileItem}>
                                <PictureItem key={fileItem.url} url={fileItem.url} />
                              </div>
                            )
                          }
                          <i
                            className={`${styles.closeWrapper} iconfont iconyichu`}
                            style={{ width: '16px', height: '16px' }}
                            onClick={() => removeItem(fileItem.url)}
                          />
                        </div>
                      ))
                    }

                  </div>
                </div>
              )
            }
          </div>
          {
            exampaperType === 'set' && (
              <span className={styles.joinSelectWrapper} onClick={() => homeworkScore()}>
                <img
                  className={classNames(styles.joinSelect, {
                    [styles.noSelect]: !joinSelect,
                  })}
                  src={ADDTO}
                  alt=""
                />
                {
                  !joinSelect ? '加入精选' : '取消精选'
                }
              </span>
            )
          }

        </div>

        <div className={styles.footer}>
          {
            exampaperType === 'set' && (
              <div className={styles.footerButton} onClick={() => submitInfoHomework()}>确定</div>
            )
          }
          {
            exampaperType === 'exam' && (
              <div className={styles.footerButton} onClick={() => submitInfo()}>确定</div>
            )
          }
        </div>

      </div>
    </div>
  );
};

const Index: React.FC<any> = (props: any) => {
  const {
    browser,
    visible,
    onClose, onSubmit, remarkFileList, removeItem, showRecordMenu, remarkAudioFileList, onUploaded,
    removeAudioItem, score, iScore, updateiScore, updateiAnaylse, clearAudioList,
    iAnaylse, correction, exampaperType, onSubmitHomework, updateHomework, updateJoinSelect,
    setCurrentStylePicStyles, changeHomeworkStyle,
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
          showRecordMenu={showRecordMenu}
          remarkAudioFileList={remarkAudioFileList}
          onUploaded={onUploaded}
          removeAudioItem={removeAudioItem}
          score={score}
          iScore={iScore}
          iAnaylse={iAnaylse}
          updateiScore={updateiScore}
          updateiAnaylse={updateiAnaylse}
          correction={correction}
          clearAudioList={clearAudioList}
          exampaperType={exampaperType}
          onSubmitHomework={onSubmitHomework}
          updateHomework={updateHomework}
          updateJoinSelect={updateJoinSelect}
          setCurrentStylePicStyles={setCurrentStylePicStyles}
          changeHomeworkStyle={changeHomeworkStyle}
        />
      )}
    />
  );
};

Index.propTypes = {
  visible: PropTypes.bool.isRequired,

};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
