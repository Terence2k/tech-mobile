import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

import DOC from './images/doc.png';
import PDF from './images/pdf.png';
import XLS from './images/xls.png';
import PPT from './images/ppt.png';
import ZIP from './images/zip.png';
import IMAGE from './images/image.png';
import AUDIO from './images/audio.png';
import VIDEO from './images/video.png';
import { WxJump } from '..';

const FileList: React.FC = (props: any) => {
  const {
    fileList, joinFlag, onDownloadClick, jumpInfo,
  } = props;

  return (
    <div className={styles.fileList}>
      {
        fileList.map((item, index) => (
          <div className={`${styles.fileItem} flexLayout center`} key={index.toString()}>
            { (item.extension === 'doc' || item.extension === 'docx')
                && <img src={DOC} alt="" className={styles.fileItemIcon} />}
            { (item.extension === 'xls' || item.extension === 'xlsx')
                && <img src={XLS} alt="" className={styles.fileItemIcon} />}
            { (item.extension === 'ppt' || item.extension === 'pptx')
                && <img src={PPT} alt="" className={styles.fileItemIcon} />}
            { item.extension === 'pdf'
                && <img src={PDF} alt="" className={styles.fileItemIcon} />}
            { (item.extension === 'zip' || item.extension === 'rar')
                && <img src={ZIP} alt="" className={styles.fileItemIcon} />}
            { item.extension === 'image'
                && <img src={IMAGE} alt="" className={styles.fileItemIcon} />}
            { item.extension === 'audio'
                && <img src={AUDIO} alt="" className={styles.fileItemIcon} />}
            { item.extension === 'video'
                && <img src={VIDEO} alt="" className={styles.fileItemIcon} />}
            <span className={`${styles.fileItemTitle} textOverflow2`}>{item.title || item.file_name}</span>
            {
              joinFlag === 'y' && item.downloadFlag === 'y'
              && (
              <div
                className={styles.fileItemBtn}
                onClick={() => { onDownloadClick(item); }}
              >
                下载
              </div>
              )
            }
            {
              joinFlag === 'y' && item.downloadFlag === 'n'
              && (
              <WxJump
                {...jumpInfo}
              >
                <div
                  className={styles.fileItemBtn}
                >
                  小程序查看
                </div>
              </WxJump>
              )
            }
          </div>
        ))
      }
    </div>
  );
};

FileList.defaultProps = {
  joinFlag: 'y',
  onDownloadClick: () => {},
  jumpInfo: {
    type: 'index',
    objectIds: {},
  },
};

FileList.propTypes = {
  fileList: PropTypes.arrayOf(PropTypes.object).isRequired,
  joinFlag: PropTypes.oneOf(['y', 'n']),
  onDownloadClick: PropTypes.func,
  jumpInfo: PropTypes.shape({
    type: PropTypes.string,
    objectIds: PropTypes.shape({}),
  }),
};

export default FileList;
