/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import PropTypes from 'prop-types';
import { Slider } from 'antd-mobile';
import { connect } from 'dva';
import actions from 'actions';
import styles from './index.scss';

// 秒转化为hh:mm:ss格式
const numberFormat = (num: number = 0) => {
  const hours = Math.floor(num / 3600);
  let secs = num - hours * 3600;
  const minutes = Math.floor(secs / 60);

  secs = num - hours * 3600 - minutes * 60;
  let output = `${minutes > 9 ? minutes : `0${minutes}`}:${secs > 9 ? secs : `0${secs}`}`;

  if (hours) {
    output = `${hours > 9 ? hours : `0${hours}`}:${output}`;
  }
  return output;
};
// 毫秒 转

const formatTime = (time: any) => {
  const secondType = typeof time;

  let res;
  if (secondType === 'number') {
    let second = Math.ceil(time) / 1000;
    const hours = Math.floor(second / 3600);
    second -= hours * 3600;
    const mimute = Math.floor(second / 60);
    second -= mimute * 60;
    res = `${hours}:${(`0${mimute}`).slice(-2)}:${(`0${second}`).slice(-2)}`;
  } else if (secondType === 'string') {
    res = time;
  } else {
    res = '0:00:00';
  }
  return res;
};

const mapStateToProps = (state: any) => ({
  playUrl: state.media.playUrl,
});

const mapDispatchToProps = (dispatch: any) => ({
  mediaPlay: (url) => {
    dispatch(actions.media.mediaPlay(url));
  },
});

const AudioPlayer: React.FC<any> = (props: any) => {
  const {
    url,
    playUrl,
    mediaPlay,
    durationText,
    trans = false,
  } = props;

  const audioRef = React.useRef<any>(null);
  const [audioDuration, setAudioDuration] = React.useState(0);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [playingStatus, setPlayingStatus] = React.useState('pause');
  const [playerPosition, setPlayerPosition] = React.useState(0);
  const intervalRef = React.useRef<any>(null);
  const startCount = () => {
    intervalRef.current = setInterval(() => {
      setPlayerPosition((preCount) => preCount + 1);
    }, 1000);
  };
  const audioWrapperRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (playUrl && url !== playUrl) {
      audioRef.current.pause();
    }
  }, [url, playUrl]);

  React.useEffect(() => {
    if (audioRef && audioRef.current) {
      setIsLoaded(true);
    }
  }, [audioRef]);

  return (
    <div
      ref={audioWrapperRef}
    >
      <audio
        ref={audioRef}
        src={url}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setAudioDuration(audioRef.current.duration || 0);
          }
        }}
        onPause={() => {
          setPlayingStatus('pause');
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }}
        onPlay={() => {
          setPlayingStatus('playing');
          startCount();
        }}
        onEnded={() => {
          setPlayingStatus('ended');
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }}

      />
      {
        isLoaded && (
          <div className={`${styles.playerLayout} flexLayout center`}>
            <div onClick={() => {
              if (audioRef.current) {
                if (playingStatus === 'playing') {
                  audioRef.current.pause();
                } else {
                  if (playingStatus === 'ended') {
                    audioRef.current.currentTime = 0;
                    setPlayerPosition(0);
                  }
                  audioRef.current.play();
                  mediaPlay(url);
                }
              }
            }}
            >
              <i className={playingStatus === 'playing' ? 'iconfont iconzanting2' : 'iconfont iconbofang2'} style={{ color: '#0F8FFF' }} />

            </div>
            <div className={styles.playerBody}>
              <p
                className="flexLayout spaceBetween center"
                style={{
                  // border: '1px solid red',
                  // marginTop: '16px',
                  fontSize: '12px',
                  color: 'rgba(0, 0, 0, .85)',
                  fontWeight: 500,
                  position: 'absolute',
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  top: '-8px',
                  padding: '0 0 0  8px ',
                }}
              >
                <span>{numberFormat(playerPosition)}</span>
                {
                  trans ? (formatTime(durationText * 1000)) : (formatTime(durationText))
                }
                {/* {formatTime(durationText)} */}
              </p>
              <div style={{ marginLeft: 55, marginRight: 55 }}>
                <Slider
                  min={0}
                  max={Math.floor(audioDuration)}
                  value={playerPosition}
                  handleStyle={{
                    background: '#FFF',
                    boxShadow: '0px 1px 4px 0px rgba(204, 53, 34, 0.2)',
                    width: '2px',
                    height: '10px',
                    borderRadius: '10px',
                    marginLeft: '0px',
                    marginTop: '-4px',
                  }}
                  trackStyle={{
                    background: '#0F8FFF',
                  }}
                  onChange={(e) => {
                    console.log('onChange', e);
                    const pos = e || 0;
                    if (audioRef.current) {
                      setPlayerPosition(Math.floor(pos));
                      audioRef.current.currentTime = pos;
                    }
                    if (playingStatus === 'playing') {
                      if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                      }
                      startCount();
                    } else if (playingStatus === 'ended' && (pos < audioDuration)) {
                      setPlayingStatus('pause');
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};

AudioPlayer.propTypes = {
  url: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);
