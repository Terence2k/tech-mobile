import React, {
  forwardRef, useImperativeHandle, useRef, useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { v4 } from 'uuid';
import videojs from 'video.js';
import { connect } from 'dva';
import actions from 'actions';
// import classNames from 'classnames';

import styles from './index.scss';

interface IEvent {
  id: string;
}

type Subscription<T> = (val: T) => void;

const subscriptions = new Set<Subscription<IEvent>>();

// TODO：消息订阅未来考试做成独立的hook.
const useSubscription = (callback: Subscription<IEvent>) => {
  const callbackRef = useRef<Subscription<IEvent>>();
  callbackRef.current = callback;

  useEffect(() => {
    function subscription(val: IEvent) {
      if (callbackRef.current) {
        callbackRef.current(val);
      }
    }
    subscriptions.add(subscription);
    return () => {
      subscriptions.delete(subscription);
    };
  }, []);
};

const emit = (val: IEvent) => {
  subscriptions.forEach((subscription) => {
    subscription(val);
  });
};

/**
 * Mimetypes
 *
 * @see http://hul.harvard.edu/ois/////systems/wax/wax-public-help/mimetypes.htm
 * @typedef Mimetypes~Kind
 * @enum
 */
const MimetypesKind = {
  opus: 'video/ogg',
  ogv: 'video/ogg',
  mp4: 'video/mp4',
  mov: 'video/mp4',
  m4v: 'video/mp4',
  mkv: 'video/x-matroska',
  m4a: 'audio/mp4',
  mp3: 'audio/mpeg',
  aac: 'audio/aac',
  oga: 'audio/ogg',
  m3u8: 'application/x-mpegURL',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  png: 'image/png',
  svg: 'image/svg+xml',
  webp: 'image/webp',
};

/**
 * Returns the extension of the passed file name. It will return an empty string
 * if passed an invalid path.
 *
 * @function
 * @param   {string} path
 *           The fileName path like '/path/to/file.mp4'
 *
 * @return  {string}
 *           The extension in lower case or an empty string if no
 *           extension could be found.
 */
const getFileExtension = (path) => {
  if (typeof path === 'string') {
    // eslint-disable-next-line no-useless-escape
    const splitPathRe = /^(\/?)([\s\S]*?)((?:\.{1,2}|[^\/]+?)(\.([^\.\/\?]+)))(?:[\/]*|[\?].*)$/;
    const pathParts = splitPathRe.exec(path);

    if (pathParts) {
      return pathParts.pop()?.toLowerCase();
    }
  }

  return '';
};

const getMimetype = (src = '') => {
  const ext = getFileExtension(src) || '';
  const mimetype = MimetypesKind[ext.toLowerCase()];

  return mimetype || '';
};

const mapStateToProps = (state: any) => ({
  playUrl: state.media.playUrl,
});

const mapDispatchToProps = (dispatch: any) => ({
  mediaPlay: (url) => {
    dispatch(actions.media.mediaPlay(url));
  },
});

const Index = forwardRef((props: any, ref) => {
  const {
    style, poster, url, scale, playUrl, mediaPlay,
  } = props;

  const videojsRef = useRef<videojs.Player | null>(null);
  const [elementId] = useState(v4());
  const [uuid] = useState(v4());
  const [isInit, setIsInit] = useState(false);
  const [isReady, setIsready] = useState<boolean>(false);
  const [isPlay, setIsPlay] = useState<boolean>(false);

  const init = (player: videojs.Player, src) => {
    const type = getMimetype(src);
    const source: videojs.Tech.SourceObject = { src, type };

    player.pause();
    player.src(type ? source : src);
    player.load();
    player.play();
  };

  // 播放
  const handlePlay = () => {
    emit({ id: uuid });

    const player = videojsRef.current;
    if (isReady && player) {
      if (!isInit) {
        setIsInit(true);

        let src: string = url;
        if (document.location.protocol === 'http:') {
          src = url.replace(/https/, 'http');
        }
        init(player, src);
      }

      player.play();
      setIsPlay(true);
      mediaPlay(url);
    }
  };

  // 暂停
  const handlePause = () => {
    const player = videojsRef.current;
    if (player) {
      player.pause();
      setIsPlay(false);
    }
  };

  // 切换
  const handleToggle = () => {
    const player = videojsRef.current;
    if (player?.paused()) {
      handlePlay();
    } else {
      handlePause();
    }
  };

  // 订阅
  useSubscription(({ id }: IEvent) => {
    if (id !== uuid) {
      handlePause();
    }
  });

  useImperativeHandle(ref, () => ({
    play: () => {
      handlePlay();
    },
    pause: () => {
      handlePause();
    },
  }));

  useEffect(() => {
    if (!videojsRef.current) {
      return;
    }

    if (playUrl && url !== playUrl) {
      videojsRef.current.pause();
    }
  }, [url, playUrl]);

  useEffect(() => {
    const element = document.getElementById(elementId) as HTMLMediaElement;
    const options: videojs.PlayerOptions = {
      width: element.clientWidth,
      height: element.clientWidth * scale,
      controls: true,
      preload: 'auto',
      language: 'zh-CN',
      muted: false,
      poster,
    };

    const videoElement = document.getElementById(uuid) as HTMLMediaElement;
    const player: videojs.Player = videojs(videoElement, options, () => {
      setIsready(true);
    });

    player.on('play', () => {
      emit({ id: uuid });
      setIsPlay(true);
    });
    player.on('pause', () => {
      setIsPlay(false);
    });
    // player.on('canplay', () => {
    //   setIsready(true);
    // });
    player.on('ended', () => {
      setIsPlay(false);
    });

    videojsRef.current = player;

    return () => {
      videojsRef.current = null;

      if (player) {
        player.dispose();
      }
    };
  }, [uuid, url, elementId, poster, scale]);

  return (
    <div id={elementId} className={styles.layout} style={style}>
      <video id={uuid} className="video-js vjs-big-play-centered" muted />
      {
        (isReady && !isPlay) && (
          <div className={styles.buttonPlay} onClick={handleToggle} />
        )
      }
    </div>
  );
});

Index.defaultProps = {
  style: {},
  poster: '',
  scale: 500 / 900,
};

Index.propTypes = {
  // 样式
  style: PropTypes.objectOf(PropTypes.string),
  // 封面
  poster: PropTypes.string,
  // 链接
  url: PropTypes.string.isRequired,
  // 比例
  scale: PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
