import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const PLAY_ICON = require('../../images/playIcon.png');

const MediaBlock: React.FC<any> = (props: any) => {
  const { mediaList } = props;

  return (
    <div className={`${styles.mediaLayout} flexLayout`}>
      {
        mediaList.map((item, index) => (
          <div className={`${styles.mediaItem} ${styles[item.type]} flexLayout`} key={index.toString()}>
            <img src={item.image} className={styles.mediaItemCover} alt="" />
            {
              (item.type === 'audio' || item.type === 'video') && <img src={PLAY_ICON} className={styles.opeIcon} alt="" />
            }
          </div>
        ))
      }
    </div>
  );
};

MediaBlock.propTypes = {
  mediaList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
};

export default MediaBlock;
