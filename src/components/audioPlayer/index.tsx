import React from 'react';
import PropTypes from 'prop-types';
import { Slider } from 'antd-mobile';
import styles from './index.scss';

// 秒转化为hh:mm:ss格式
const numberFormat = (num: number = 0) => {
  const hours = Math.floor(num / 3600);
  let secs = num - hours * 3600;
  const minutes = Math.floor(secs / 60);
  secs = num - minutes * 60;
  let output = `${minutes > 9 ? minutes : `0${minutes}`}:${secs > 9 ? secs : `0${secs}`}`;
  if (hours) {
    output = `${hours > 9 ? hours : `0${hours}`}:${output}`;
  }
  return output;
};

const PLAY = require('./images/playIcon.png');
const PAUSE = require('./images/pauseIcon.png');

const AudioPlayer: React.FC<any> = (props: any) => {
  const { url, durationText } = props;

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

  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        src={url}
        onLoadedMetadata={() => {
          setIsLoaded(true);
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
                }
              }
            }}
            >
              <img src={playingStatus === 'playing' ? PAUSE : PLAY} alt="" className={styles.statusIcon} />
            </div>
            <div className={styles.playerBody}>
              <Slider
                min={0}
                max={audioDuration}
                value={playerPosition}
                handleStyle={{
                  border: '3px solid #FF7968',
                  background: '#FFF',
                  boxShadow: '0px 1px 4px 0px rgba(204, 53, 34, 0.2)',
                  width: '20px',
                  height: '20px',
                  borderRadius: '10px',
                }}
                trackStyle={{
                  background: '#FF7968',
                }}
                onChange={(e) => {
                  const pos = e || 0;
                  if (audioRef.current) {
                    setPlayerPosition(pos);
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
              <p
                className="flexLayout spaceBetween center"
                style={{
                  marginTop: '16px',
                  fontSize: '12px',
                  color: 'rgba(0, 0, 0, .85)',
                  fontWeight: 500,
                }}
              >
                <span>{numberFormat(playerPosition)}</span>
                <span>{durationText}</span>
              </p>
            </div>
          </div>
        )
      }
    </div>
  );
};

AudioPlayer.propTypes = {
  url: PropTypes.string.isRequired,
  durationText: PropTypes.string.isRequired,
};

export default AudioPlayer;
