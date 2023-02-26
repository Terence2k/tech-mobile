/* eslint-disable indent */
import React, { FC } from 'react';
import { connect } from 'dva';
import actions from 'actions';
import { usePage } from 'hooks';
import { Toast } from 'antd-mobile';
import { AudioMeus } from 'components';

import Header from './components/header/index';
import TimeFence from './components/timeFence/index';
import QuestionsList from './components/questionList/index';
import RoleQuestionsList from './components/rolesQuestionList/index';
import StudentsCard from './components/studentsCard/index';
import RolesAnswer from './components/rolesAnswer/index';
import RolesQuestion from './components/rolesQuestion/index';
import SideQuestionList from './components/sideQuestionList/index';
import Bottom from './components/bottom/index';
import Calendar from './components/calendar/canlendar';
import RolesForm from './components/rolesForm/index';
import Correcting from './components/correcting/index';

import styles from './index.scss';
import SEARCHTIP from './images/searchsNoting.png';
import PAGETIP from './images/pageNoting.png';

const mapStateToProps = (state: any) => ({
  state: state.correction,
});

const mapDispatchToProps = (dispatch) => ({
  onLoad: () => dispatch(actions.onLoad({ namespace: 'correction' })),
  switchItem: () => dispatch({ type: 'correction/switchItem' }),
  pullDown: () => dispatch({ type: 'correction/pullDown' }),
  onloadPage: () => dispatch({ type: 'correction/onloadPage' }),
  getExamDealUserResult: () => dispatch({ type: 'correction/getExamDealUserResult' }),
  hideFn: () => dispatch({ type: 'correction/hideFn' }),
  updateDate: (e) => dispatch({ type: 'correction/updateDate', payload: { e } }),
  updateRole: (e) => dispatch({ type: 'correction/updateRole', payload: { e } }),
  changeQuestionsIndex: (e, pid, qid, score) => dispatch({
 type: 'correction/changeQuestionsIndex',
payload: {
 e, pid, qid, score,
},
}),
  changeRoleQuestionIndex: (e) => dispatch({ type: 'correction/changeRoleQuestionIndex', payload: { e } }),
  checkAll: (e) => dispatch({ type: 'correction/checkAll', payload: { e } }),
  childrenCheck: (e) => dispatch({ type: 'correction/childrenCheck', payload: { e } }),
  showCorrectMenu: (e, score, checkall) => dispatch({ type: 'correction/showCorrectMenu', payload: { e, score, checkall } }),
  hideCorrectMenu: () => dispatch({ type: 'correction/updateState', payload: { isMenuVisible: false } }),
  SumbitCorrectInfo: (e) => dispatch({ type: 'correction/SumbitCorrectInfo', payload: { e } }),
  SumbitCorrectInfoHomework: (e) => dispatch({ type: 'correction/SumbitCorrectInfoHomework', payload: { e } }),
  removeByUrl: (url) => dispatch({ type: 'correction/removeByUrl', payload: { url } }),
  cancleSelectArray: () => dispatch({ type: 'correction/cancleSelectArray' }),
  searchPaper: (e) => dispatch({ type: 'correction/searchPaper', payload: { e } }),
  hideSideQuestionList: () => dispatch({ type: 'correction/hideSideQuestionList' }),
  showSideQuestionList: () => dispatch({ type: 'correction/showSideQuestionList' }),
  sideQuestionsListClick: (e, title, detailId) => dispatch({ type: 'correction/sideQuestionsListClick', payload: { e, title, detailId } }),
  reloadPagedate: (e) => dispatch({ type: 'correction/reloadPagedate', payload: { e } }),
  changeExampaperType: (e) => dispatch({ type: 'correction/changeExampaperType', payload: { e } }),
  onReachBottom: () => dispatch({ type: 'correction/onReachBottom' }),
  showRecordMenu: () => dispatch({ type: 'correction/updateState', payload: { isRecording: true, isMenuVisible: false } }),
  hideRecordMenu: () => dispatch({ type: 'correction/updateState', payload: { isRecording: false, isMenuVisible: true } }),
  removeAudioItem: (url) => dispatch({ type: 'correction/removeAudioItem', payload: { url } }),
  clearAudioList: () => dispatch({ type: 'correction/clearAudioList' }),
  reloadPage: () => dispatch({ type: 'correction/reloadPage' }),
  changeHomeworkStyle: (style, type) => dispatch({ type: 'correction/changeHomeworkStyle', payload: { style, type } }),

});
type IProp = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Page: FC<any> = (props: any): any => {
  const {
    // models
    state,
    // action methods
    onLoad,
    switchItem,
    pullDown,
    hideFn,
    updateDate,
    updateRole,
    changeQuestionsIndex,
    changeRoleQuestionIndex,
    checkAll,
    childrenCheck,
    showCorrectMenu,
    hideCorrectMenu,
    cancleSelectArray,
    hideSideQuestionList,
    showSideQuestionList,
    searchPaper,
    sideQuestionsListClick,
    onReachBottom,
    SumbitCorrectInfo,
    SumbitCorrectInfoHomework,
    removeByUrl,
    showRecordMenu,
    hideRecordMenu,
    removeAudioItem,
    clearAudioList,
    changeExampaperType,
    changeHomeworkStyle,
  }: IProp = props;

  const calendarRef = React.useRef<HTMLDivElement>(null);
  const {
    showCalendar,
    correctNum,
    dateOrStudent,
    dateList,
    rolesList,
    questionsListInfo,
    studentsCardInfo,
    currentQuestionsIndex,
    hadSelectList,
    currentUser,
    roleQuestionList,
    currentRolesIndex,
    roleAnswerList,
    sidebar,
    calendarList,
    rolesForm,
    isMenuVisible,
    sideQuestionsListInfo,
    sideRoleQuestionList,
    remarkFileList,
    isRecording,
    remarkAudioFileList,
    score,
    iScore,
    iAnaylse,
    searchStatus,
    sideTitle,
    exampaperType,
    keyword,
    setCurrentStylePicStyles,
    currentRoleIndex,
    currentDateIndex,
  }: {
    showCalendar: any,
    correctNum: any,
    dateOrStudent: boolean,
    dateList: any,
    rolesList: any,
    questionsListInfo: any,
    studentsCardInfo: any,
    currentQuestionsIndex: number,
    hadSelectList: any,
    currentUser: any,
    roleQuestionList: any,
    currentRolesIndex: number,
    roleAnswerList: any,
    sidebar: boolean,
    currentPaperId: any,
    calendarList: [],
    hideFn: any,
    sideQuestionsListInfo: any,
    sideRoleQuestionList: any,
    roleDetailId: any,
    // visible: any
    rolesForm: [],
    isMenuVisible: boolean,
    remarkFileList: any,
    isRecording: boolean,
    remarkAudioFileList: any,
    score: any,
    iScore: any,
    iAnaylse: any,
    isSend: boolean,
    searchStatus: boolean,
    sideTitle:any,
    exampaperType:string,
    keyword:string,
    setCurrentStylePicStyles:any,
    currentRoleIndex:any,
    currentDateIndex:any,
  } = state;

  usePage({
    onLoad,
    onReachBottom,
  });
  // React.useEffect(() => {
  //   onLoad();
  // }, [searchStatus]);
  // React.useEffect(() => {
  //   if (isSend) {
  //     reloadPage();
  //   }
  // }, [isSend, reloadPage]);
  return (
    <div className="pageLayout__scrollLayout">
      <div className={styles.wrapper}>
        <Header
          exampaperType={exampaperType}
          rightTxt="已批改"
          correctNum={correctNum}
          tip="请输入试卷信息"
          // onClick={() => show()}
          searchPaper={(e) => searchPaper(e)}
          changeExampaperType={(e) => changeExampaperType(e)}
          keyword={keyword}
        />
        <TimeFence
          isShow={showCalendar}
          dateOrStudent={dateOrStudent}
          switchItem={switchItem}
          pullDown={pullDown}
          dateList={dateList}
          rolesList={rolesList}
          hideFn={hideFn}
          updateDate={updateDate}
          updateRole={updateRole}
          ref={(res) => {
            calendarRef.current = res;
          }}
        />

        {
          !dateOrStudent
          && showCalendar && calendarList && (
            <Calendar
              hideFn={() => hideFn()}
              updateDate={(e) => updateDate(e)}
              calendarList={calendarList}
              changIndex={(e) => calendarRef.current.countNum(e)}
            />
          )
        }
        {
          dateOrStudent
          && showCalendar && calendarList && (
            <RolesForm
              hideFn={() => hideFn()}
              rolesForm={rolesForm}
              updateRole={updateRole}
            />
          )
        }
        {/* 日期page */}
        {
          !dateOrStudent && searchStatus && questionsListInfo.length === 0 && (
            <div className={styles.pageTipWrapper}>
              <img className={styles.searchTip} src={SEARCHTIP} alt="" />
              没有找到匹配的结果
            </div>
          )
        }
        {
          !dateOrStudent && !searchStatus && questionsListInfo.length === 0 && (
            <div className={styles.pageTipWrapper}>
              <img className={styles.pageTip} src={PAGETIP} alt="" />
              暂无数据
            </div>
          )
        }
        {
          !dateOrStudent && questionsListInfo.length > 0 && (
            <div className={styles.pages} id="pageScroll">
              <div className={styles.allTestHeader}>
                <div className={styles.allTestTitle}>
                  {sideTitle}
                </div>
                <div
                  className={styles.other}
                  onClick={() => showSideQuestionList()}
                >
                  ···
                </div>
              </div>
              {
                hadSelectList.length > 0 && (
                  <Bottom
                    correctNum={hadSelectList}
                    toCorrect={showCorrectMenu}
                    cancleSelectArray={() => cancleSelectArray()}
                    score={score}
                  />
                )
              }
              <SideQuestionList
                onClose={hideSideQuestionList}
                visible={sidebar}
                sideQuestionsListInfo={sideQuestionsListInfo}
                currentIndex={currentDateIndex}
                sideQuestionsListClick={sideQuestionsListClick}
                exampaperType={exampaperType}
              />
              {
                questionsListInfo
                && questionsListInfo.length > 0
                && questionsListInfo.map((item, index) => (
                  <div className={styles.questionsItemWarpper} key={`${item.index + index}`}>
                    <QuestionsList
                      questionInfo={item}
                      currentQuestionsIndex={currentQuestionsIndex}
                      changeQuestionsIndex={changeQuestionsIndex}
                    />

                    {/* studentsCard */}
                    { currentQuestionsIndex === item.index
                      && studentsCardInfo.rows && (
                        <div className={styles.studentsWrapper}>
                          <div className={styles.studentsHeader}>
                            <div className={styles.left}>学员答案</div>
                            <div
                              className={styles.right}
                              onClick={() => checkAll(item.index)}
                            >
                              全选
                              <i className="iconfont iconhuabanbeifen60" style={item.checkAll ? { color: '#0F8FFF' } : {}} />
                            </div>
                          </div>
                        </div>
                      )}
                    {
                      currentQuestionsIndex === item.index
                      && studentsCardInfo.rows
                      && studentsCardInfo.rows.map((studentsInfo, idxSec) => (
                        <div key={`${studentsInfo.user.user_id + idxSec}`}>
                          <StudentsCard
                            key={studentsInfo.index + studentsInfo.user.user_id}
                            studentsInfo={studentsInfo}
                            childrenCheck={(e: any) => { childrenCheck(e); }}
                            toCorrect={showCorrectMenu}
                            hadSelectList={hadSelectList}
                            submitInfo={item}
                          />
                        </div>

                      ))
                    }
                  </div>
                ))
              }

            </div>
          )
        }

        {/* 学员page */}
        {
          dateOrStudent && searchStatus && roleQuestionList.length === 0 && (
            <div className={styles.pageTipWrapper}>
              <img className={styles.searchTip} src={SEARCHTIP} alt="" />
              没有找到匹配的结果
            </div>
          )
        }
        {
          dateOrStudent && !searchStatus && roleQuestionList.length === 0 && (
            <div className={styles.pageTipWrapper}>
              <img className={styles.pageTip} src={PAGETIP} alt="" />
              暂无数据

            </div>
          )
        }

        {
          dateOrStudent && roleQuestionList.length > 0 && (
            <div className={styles.rolePages}>
              <div className={styles.header}>
                <div className={styles.user}>
                  <img className={styles.headerURL} src={currentUser.headimgurl} alt="" />
                  <div className={styles.userName}>
                    {currentUser.nickname}
                  </div>
                </div>
                <div className={styles.right} onClick={() => showSideQuestionList()}>
                  <div className={styles.rightTxt}>
                    {sideTitle}
                  </div>
                  <div>
                    ···
                  </div>
                </div>
              </div>
              <SideQuestionList
                dateOrStudent={dateOrStudent}
                visible={sidebar}
                sideTitle={sideTitle}
                onClose={() => hideSideQuestionList()}
                questionList={sideRoleQuestionList}
                currentIndex={currentRoleIndex}
                sideQuestionsListClick={sideQuestionsListClick}
                exampaperType={exampaperType}
              />
              <div className={styles.rolesQuestion}>
                {
                  roleQuestionList && roleQuestionList.map((item, idx) => (
                    <div className={styles.questionsItemWarpper} key={item.index}>
                      <RoleQuestionsList
                        questionInfo={item}
                        currentRolesIndex={currentRolesIndex}
                        changeRoleQuestionIndex={changeRoleQuestionIndex}
                      />
                      {
                        currentRolesIndex === idx + 1 && (
                          <div className={styles.submitTime}>
                            提交时间:
                            {item && item.submit_time}
                          </div>
                        )
                      }
                      {
                        currentRolesIndex === item.index
                        && roleAnswerList.rows
                        && roleAnswerList.rows.map((studentsInfo) => (
                          <div className={styles.questionAndAnswer} key={studentsInfo.index}>

                            <RolesQuestion
                              questionInfo={studentsInfo}
                            />
                            <RolesAnswer
                              key={studentsInfo.group_id}
                              studentsInfo={studentsInfo}
                              toCorrect={showCorrectMenu}
                            />
                          </div>

                        ))
                      }
                    </div>
                  ))
                }

              </div>
            </div>
          )
        }
      </div>
      {/* 批改弹框 */}
      <Correcting
        visible={isMenuVisible && !isRecording}
        onClose={() => hideCorrectMenu()}
        onSubmit={(e) => SumbitCorrectInfo(e)}
        onSubmitHomework={(e) => SumbitCorrectInfoHomework(e)}
        remarkFileList={remarkFileList}
        remarkAudioFileList={remarkAudioFileList}
        removeItem={(e) => removeByUrl(e)}
        removeAudioItem={removeAudioItem}
        clearAudioList={clearAudioList}
        showRecordMenu={() => showRecordMenu()}
        score={score}
        iScore={iScore}
        iAnaylse={iAnaylse}
        exampaperType={exampaperType}
        setCurrentStylePicStyles={setCurrentStylePicStyles}
        changeHomeworkStyle={changeHomeworkStyle}
      />
      {/* // onClose={() => { }}
      // sendInfo={() => { }}
      // sendInfo={(anaylseInfo) => {
      //   sendCorrectionInfo(anaylseInfo);
      // }}
      // recording={recording}
      // uploadPic={(e) => uploadPic(e)} */}

      <AudioMeus
        visible={!isMenuVisible && isRecording}
        exitRecording={() => hideRecordMenu()}
        onUploaded={{ type: 'correction/audioUploaded', payload: {} }}
      />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
