import React, { FC } from 'react';
import { connect } from 'dva';
import styles from './index.scss';

const mapStateToProps = (state: any) => ({
  browser: state.browser,
  correcting: state.correcting,
});

const mapDispatchToProps = (dispatch) => ({
  showPreviewVideo: (e) => dispatch({ type: 'popup/showPreviewVideo', payload: { e } }),

});
interface IProps {
  studentsInfo: any
  toCorrect: any
}

const state: any = {
  url: '',
};
state.url = 'https://qcdn.beautifulreading.com/upload_files/2020/12/28/fbcbe8a5410da3cef1863627252b410c.jpg';
const Index: FC<IProps> = (props: any): any => {
  const { showPreviewVideo, url } = props;
  return (
    <div className={styles.studentsCard} onClick={() => showPreviewVideo(url)}>
      <div
        className={styles.previewPic}
      />

    </div>
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(Index);
