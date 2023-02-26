import React from 'react';
// import PropTypes from 'prop-types';
import { withRouter } from 'umi';
import { connect } from 'dva';
import ClipboardJS from 'clipboard';

import { Popup } from 'components';
import styles from './index.scss';

const mapStateToProps = (state: any) => ({
  browser: state.browser,
});
interface IProps {
  onClose:any
  questionList:any
  currentIndex:any
  sideQuestionsListClick:any
  dateOrStudent:any
  sideQuestionsListInfo:any
  exampaperType:any
}
const Menus: React.FC<IProps> = (props: any) => {
  const {
    onClose,
    questionList,
    currentIndex,
    sideQuestionsListClick,
    dateOrStudent,
    sideQuestionsListInfo,
    exampaperType,
    // onLoad,
  }:any = props;
  React.useEffect(() => {
    const clipboard = new ClipboardJS('#clipboard-url');
    clipboard.on('success', (e) => {
      e.clearSelection();
      onClose();
    });

    return () => {
      clipboard.destroy();
    };
  }, [onClose]);
  const title = exampaperType === 'set' ? '全部作业' : '全部试卷';
  return (
    <div className={styles.layout} onClick={() => onClose()}>
      <div className={styles.contentWrapper}>
        {
          !dateOrStudent && (
            <div className={styles.contentItem} onClick={() => sideQuestionsListClick('', title, '')}>
              <span className={styles.text} style={{ marginLeft: '18px' }}>
                {
                  currentIndex === '' && (
                    <i
                      className="iconfont iconxuanzezhengque"
                      style={{ color: '#0F8FFF', position: 'absolute', left: '-8px' }}
                    />
                  )
                }
                {title}
              </span>
            </div>
          )
        }
        {!dateOrStudent && sideQuestionsListInfo
          && sideQuestionsListInfo.map((item) => (
            <div
              className={styles.contentItem}
              key={item.paper_id}
              onClick={() => sideQuestionsListClick(item.paper_id, item.title)}
            >
              <span className={styles.text} style={{ marginLeft: '18px' }}>
                {
                  currentIndex === item.paper_id && (
                    <i
                      className="iconfont iconxuanzezhengque"
                      style={{ color: '#0F8FFF', position: 'absolute', left: '-8px' }}
                    />
                  )
                }

                {item.title}
              </span>
            </div>
          ))}
        {
          dateOrStudent && (
            <div className={styles.contentItem} onClick={() => sideQuestionsListClick('', title, '')}>
              <span className={styles.text} style={{ marginLeft: '18px' }}>
                {
                  currentIndex === '' && (
                    <i
                      className="iconfont iconxuanzezhengque"
                      style={{ color: '#0F8FFF', position: 'absolute', left: '-8px' }}
                    />
                  )
                }
                {title}
              </span>
            </div>
          )
        }
        {
          dateOrStudent && questionList.map((item) => (
            <div
              className={styles.contentItem}
              key={item.index}
              onClick={() => sideQuestionsListClick(item.paper_id, item.title, item.detail_id)}
            >
              {
                console.log(item, 'dateOrStudent questionList', 'currentIndex', currentIndex)

              }
              <span className={styles.text} style={{ marginLeft: '18px' }}>
                {
                  currentIndex === item.detail_id && (
                    <i
                      className="iconfont iconxuanzezhengque"
                      style={{ color: '#0F8FFF', position: 'absolute', left: '-8px' }}
                    />
                  )
                }

                {item.title}
              </span>
            </div>
          ))
        }
      </div>

    </div>
  );
};

const Index: React.FC = (props: any) => {
  const {
    browser,
    visible,
    questionList,
    currentIndex,
    sideQuestionsListClick,
    dateOrStudent,
    sideQuestionsListInfo,
  } = props;

  return (
    <Popup
      type="bottom"
      dateOrStudent={dateOrStudent}
      questionList={questionList}
      isActive={visible}
      currentIndex={currentIndex}
      sideQuestionsListInfo={sideQuestionsListInfo}
      sideQuestionsListClick={() => sideQuestionsListClick()}
      size={{ width: browser.isMobileBrowser ? '100%' : '375px', height: 'auto' }}
      content={<Menus {...props} />}
    />
  );
};

// Index.defaultProps = {
//   onClick: () => { },
//   dateOrStudent: false,
//   currentIndex: 0,
//   exampaperType: '',
// };

// Index.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   dateOrStudent: PropTypes.bool,
//   sideQuestionsListClick: PropTypes.func.isRequired,
//   onClick: PropTypes.func,
//   currentIndex: PropTypes.number,
//   exampaperType: PropTypes.string,
// };

export default withRouter(connect(mapStateToProps)(Index));
