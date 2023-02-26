import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

const FILE_ICON = require('./images/fileIcon.png');

const MyFileTag: React.FC<any> = (props: any) => {
  const { text, onClick } = props;

  return (
    <div className={`${styles.fileTag} flexLayout center`} onClick={() => onClick()}>
      <img src={FILE_ICON} className={styles.fileTagIcon} alt="" />
      {text}
    </div>
  );
};

MyFileTag.defaultProps = {
  onClick: () => {},
};

MyFileTag.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default MyFileTag;
