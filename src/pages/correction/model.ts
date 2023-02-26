import modelExtend from 'dva-model-extend';
import { model } from 'utils/model';
import actions from 'actions';
import api from 'api';
import moment from 'moment';
import { Toast } from 'antd-mobile';

// import STYLEONE from './images/styleOne.png';
// import STYLETWO from './images/styleTwo.png';
import STYLEZERO from './images/styleThree.png';

// import STYLEONE from './image/styleThree.png';
// 获取api 接口
const {
  getTeacherWaitDealCount,
  getExamDealCalendar,
  getExamWaitScoreQuestionByDate,
  getExamDealUser,
  getExamWaitScoreQuestionAnswer,
  getExamWaitScorePaperByStudent,
  getExamWaitScoreQuestionByStudent,
  getExamWaitScorePaperByDate,
  correctPapers,
} = api;
interface IRemarkFile {
  type: 'image' | 'audio' | 'video',
  url: string | null,
  fileObject: any,
  duration: number | null,
}
export default modelExtend(model, {
  namespace: 'correction',
  state: {
    // 头部气泡
    exampaperType: 'exam',
    score: 0,
    // 上传文件列表
    remarkAudioFileList: [],
    remarkFileList: [],
    recordingStatus: false,
    searchStatus: false,
    isLoading: true,
    sidebar: false,
    // header日历组件
    showCalendar: false,
    // 时间栏选择的index
    correctNum: {},
    // 学生日期切换
    dateOrStudent: false,
    // 按照时间数据获取的数据
    dateList: [],
    // 日历数据
    calendarList: [],
    sum: 0,
    roleSum: 0,
    rolesForm: [],
    // 按照角色排列的数据
    rolesList: [],
    // 问题的数据列表
    questionsListInfo: [],
    sideQuestionsListInfo: [],
    // 当前试卷的数据id
    currentPaperId: '',
    currentQuestion_id: '',
    currentDate: '',
    currentUser: {
      user_id: '',
      headimgurl: '',
      nickname: '',
    },
    // studentsCardInfo
    studentsCardInfo: [],
    // 当前问题显示index
    currentQuestionsIndex: 1,
    oldCurrentQuestionsIndex: 1,
    currentURL: '',
    // 已选择列表
    hadSelectList: [],
    // 角色题目列表
    roleQuestionList: [],
    sideRoleQuestionList: [],
    roleAnswerList: [],
    rolePaperId: '',
    currentRolesIndex: 1,
    oldCurrentRolesIndex: 1,
    // 是否弹出menu
    isMenuVisible: false,
    isRecording: false,
    roleDetailId: '',

    safeInfo: true,
    searchDateSum: 0,
    searchRoleSum: 0,
    keyword: '',
    sumbitPaperUser: [],
    iScore: null,
    iAnaylse: '',
    isSend: false,
    sideTitle: '全部试卷',
    homeScore: 0,
    joinSelect: false,
    justOne: true,
    lastSubmitTime: 0,
    // 翻页
    questionLoad: false,
    answerLoad: true,
    answerPageLimit: 20,
    answerSkip: 0,
    pageLimit: 5,
    pageSkip: 0,
    answerSum: 0,
    setCurrentStylePicStyles: STYLEZERO,
    currentRoleIndex: '',
    currentDateIndex: '',
    scoreType: 'star',
  },
  reducers: {

  },

  effects: {
    /**
     * 页面加载
     */
    * onLoad(_, { select, all, put }) {
      // yield put.resolve(actions.updateState({ isLoading: true }));
      yield put.resolve({ type: 'getTeacherWaitDealCountResult' }); //  50.58
      yield put.resolve({ type: 'getExamDealCalendarResult' }); // 77.17
      const types = [
        'initDateList',
        'getDateQuestionTitleList', // 77.20
        // 'getExamWaitScoreQuestionByDateResulet', // 77.19
        'getExamWaitScoreQuestionAnswerResult', // 77.21
      ];
      yield all(types.map((type) => put.resolve({ type })));
      const titleSide = yield select((s) => s.correction.exampaperType);
      const title = titleSide === 'set' ? '全部作业' : '全部考试';
      yield put(actions.updateState({ sideTitle: title }));
      // yield put.resolve(actions.updateState({ isLoading: false }));
      yield put.resolve({ type: 'getExamDealUserResult' });
      yield put.resolve({ type: 'initRolesList' });
      yield put.resolve({ type: 'getExamWaitScorePaperByStudentResult' });
      yield put.resolve({ type: 'getExamWaitScoreQuestionByStudentResult' });
    },
    /**
     * 获取待批改日期 栏目信息 77.17
     */
    * getExamDealCalendarResult(action, { call, select, put }) {
      // const isLoading = yield select((state) => state.correction.isLoading);
      // yield put.resolve(actions.updateState({
      //   isLoading: false,
      // }));
      const exampaperType = yield select((state) => state.correction.exampaperType);

      function weekDays(date) {
        const dt = new Date(date.split('-')[0], date.split('-')[1] - 1, date.split('-')[2]);
        const weekDay = ['周末', '周一', '周二', '周三', '周四', '周五', '周六'];
        return weekDay[dt.getDay()];
      }
      const { head: { code }, data: { rows } } = yield call(getExamDealCalendar, {
        exampaper_type: exampaperType,
        deal_type: 'wait_score',
      });
      if (code === 200) {
        const dealRows = rows.map((item, index) => {
          const newItem: any = {};
          newItem.weekDay = weekDays(item.date);
          const res = item.date.replace(/-/g, '/').slice(5);
          newItem.dateShow = res;
          newItem.num = index;
          return { ...item, ...newItem };
        });
        yield put(actions.updateState({
          calendarList: dealRows,
        }));
        yield put(actions.updateState({
          dateList: dealRows.slice(0, 5),
        }));
      }
      // console.log('77.17日期列表:', dealRows);
      // yield put(actions.updateState({
      //   isLoading: true,
      // }));
    },
    // 气泡修改
    * changeExampaperType({ payload: { e } }, { select, put, all }) {
      // console.log(e, 'changeExampaperType');
      yield put(actions.updateState({
        roleQuestionList: [], rolesList: [], currentDateIndex: '', currentRoleIndex: '',
      }));
      if (e === '作业') {
        yield put(actions.updateState({ exampaperType: 'set' }));
      }
      if (e === '试卷') {
        yield put(actions.updateState({ exampaperType: 'exam' }));
      }
      const titleSide = yield select((s) => s.correction.exampaperType);
      const title = titleSide === 'set' ? '全部作业' : '全部考试';
      yield put(actions.updateState({ sideTitle: title }));
      // // 日期页
      // yield put.resolve({ type: 'getTeacherWaitDealCountResult' }); //  50.58
      yield put.resolve({ type: 'getExamDealCalendarResult' }); // 77.17
      const types = [
        'initDateList',
        'getDateQuestionTitleList', // 77.20
        // 'getExamWaitScoreQuestionByDateResulet', // 77.19
        'initPidAndQid',
      ];
      yield all(types.map((type) => put.resolve({ type })));
      yield put.resolve({ type: 'getExamWaitScoreQuestionAnswerResult' }); // 77.21
      // 学员页
      yield put.resolve({ type: 'getExamDealUserResult' });
      yield put.resolve({ type: 'initRolesList' });
      yield put.resolve({ type: 'getExamWaitScorePaperByStudentResult' });
      yield put.resolve({ type: 'getExamWaitScoreQuestionByStudentResult' });
    },
    * initDateList(_, { put, select }) {
      const dealRows = yield select((state) => state.correction.dateList);
      // console.log(dealRows, 'dealRows');
      const trans = dealRows[0] || '';
      yield put(actions.updateState({
        currentDate: trans.date || '',
      }));
      // console.log(dealRows, 'init ------questionList');
    },
    /** *
     * 获取待批改数量 header 参数  50.58
     */
    * getTeacherWaitDealCountResult(action, { call, select, put }) {
      const { head: { code }, data } = yield call(getTeacherWaitDealCount, {
        deal_type: 'wait_score',
      });
      console.log(data, '50.58');
      if (code === 200) {
        yield put(actions.updateState({
          correctNum: data,
        }));
        const justOne = yield select((s) => s.correction.justOne);
        if (justOne) {
          if (data.exam === 0 && data.set > 0) {
            yield put(actions.updateState({
              exampaperType: 'set',
            }));
          }
          yield put(actions.updateState({ justOne: false }));
        }
      }
      // if (data.set === 2) {
      //   // yield put(actions.updateState({
      //   //   exampaperType: 'exam',
      //   // }));
      //   const res = yield select((s) => s.correction.exampaperType);
      //   console.log(res, 'exampaperType');
      // }
    },

    /** **
     * 获取显示试卷question信息 77.19
     * date默认不输入日期
     */
    * getExamWaitScoreQuestionByDateResulet(action, { call, select, put }) {
      const exampaperType = yield select((state) => state.correction.exampaperType);
      const pLimit = yield select((state) => state.correction.pageLimit);
      const pSkip = yield select((state) => state.correction.pageSkip);
      const cdate = yield select((state) => state.correction.currentDate);
      const nowIndex = yield select((state) => state.correction.currentQuestionsIndex);
      const { head: { code }, data } = yield call(getExamWaitScoreQuestionByDate, {
        date: cdate,
        paper_id: '',
        skip: pSkip,
        limit: pLimit,
        exampaper_type: exampaperType,
      });
      if (code === 200) {
        let answerSum = 0;
        if (data.rows[nowIndex - 1] && data.rows[nowIndex - 1].wait_score_count) {
          answerSum = data.rows[nowIndex - 1].wait_score_count;
        }
        yield put(actions.updateState({
          sum: data.count,
          answerSum,
        }));
        data.rows.map((item, index) => {
          const dealData = item;
          dealData.index = index + 1;
          dealData.checkAll = false;
          dealData.question.createTime = new Date(item.question.createTime);
          dealData.question.createTime = moment(item.question.createTime).format('YYYY/MM/DD h:mm');
          return { ...item, ...dealData };
        });
        yield put(actions.updateState({
          questionsListInfo: data.rows,
        }));
        console.log(77.19, '------------77.19--问题列表', data.rows[0], cdate);
      }
    },
    /**
     *  初始化开始数据 question
     */
    * initPidAndQid({ payload: index }, { call, select, put }) {
      yield put.resolve({ type: 'getExamWaitScoreQuestionByDateResulet' });// 77.19
      const getInfo = yield select(((state) => state.correction.questionsListInfo));
      console.log(getInfo, 'init');
      const pid = getInfo[0].exampaper.paper_id || '';
      const qid = getInfo[0].question.question_id || '';
      const num = getInfo[0].question.score || '';
      yield put(actions.updateState({
        currentPaperId: pid,
        currentQuestion_id: qid,
        score: num,
      }));
    },
    /**
     * 77.20
     */
    * getDateQuestionTitleList(_, { call, put, select }) {
      const exampaperType = yield select((state) => state.correction.exampaperType);
      const cdate = yield select((state) => state.correction.currentDate);
      const { head: { code }, data } = yield call(getExamWaitScorePaperByDate, {
        date: cdate,
        keyword: '',
        exampaper_type: exampaperType,
      });
      if (code === 200) {
        yield put(actions.updateState({
          sideQuestionsListInfo: data.rows || [],
        }));
        console.log(77.20, '77.20', data.rows);
      }
    },
    /** *
     * 获取用户答案信息 77.21
     */
    * getExamWaitScoreQuestionAnswerResult(action, { call, select, put }) {
      let pid = yield select((state) => state.correction.currentPaperId);
      let qid = yield select((state) => state.correction.currentQuestion_id);
      const pLimit = yield select((state) => state.correction.rolePageLimit);
      if (pid && qid) {
        console.log('had pid and qid', pid);
      } else {
        yield put.resolve({ type: 'initPidAndQid' });
        // console.log('初始化---------发送请求', '没有pid qid，重新获取');
        pid = yield select((state) => state.correction.currentPaperId);
        qid = yield select((state) => state.correction.currentQuestion_id);
      }
      const exampaperType = yield select((state) => state.correction.exampaperType);
      const { head: { code }, data } = yield call(getExamWaitScoreQuestionAnswer, {
        paper_id: pid,
        question_id: qid,
        exampaper_type: exampaperType,
        limit: pLimit,
        // last_submit_time: lastSubmitTime,
      });
      if (code === 200) {
        data.rows.map((item, index) => {
          const dealData = item;
          dealData.index = index;
          dealData.selectOption = false;
          dealData.subjective.submit_time = moment(item.subjective.submit_time).format('YYYY/MM/DD h:mm');
          return { ...item, ...dealData };
        });
        yield put(actions.updateState({
          studentsCardInfo: data,
          lastSubmitTime: data.last_submit_time,
        }));
        console.log(77.21, '77.21date学生答案列表：', data);
      }
    },
    /** *
   * 切换page按钮
   */
    * switchItem(action, { call, select, put }) {
      // yield put(actions.showLoading('加载中...'));
      const titleSide = yield select((s) => s.correction.exampaperType);
      const title = titleSide === 'set' ? '全部作业' : '全部考试';
      yield put(actions.updateState({
        sideTitle: title, pageSkip: 0, searchStatus: false, keyword: '', currentDateIndex: '', currentRoleIndex: '',
      }));
      const res = yield select((state) => state.correction.dateOrStudent);
      yield put(actions.updateState({
        dateOrStudent: !res,
      }));
      const res2 = yield select((state) => state.correction.dateOrStudent);
      if (res2) {
        yield put(actions.updateState({
          currentRolesIndex: 1,
          oldCurrentRolesIndex: 1,

        }));
        yield put.resolve({ type: 'getTeacherWaitDealCountResult' }); // 50.58
        // const ress = yield select((state) => state.correction.exampaperType);
        // const ress = yield select((s) => s.correction.exampaperType);
        yield put.resolve({ type: 'getExamDealUserResult' }); // 77.18
        yield put.resolve({ type: 'initRolesList' });
        yield put.resolve({ type: 'getExamWaitScorePaperByStudentResult' }); // 77.22
        yield put.resolve({ type: 'getExamWaitScoreQuestionByStudentResult' });
      } else {
        yield put.resolve({ type: 'initPidAndQid' });
      }
      // yield put(actions.hideLoading());
    },

    /** *
     * 修改currentDate,发送数据请求页面数据
     */
    * updateDate({ payload: { e } }, { call, select, put }) {
      // console.log(e, 'changedate');
      const titleSide = yield select((s) => s.correction.exampaperType);
      const title = titleSide === 'set' ? '全部作业' : '全部考试';
      yield put(actions.updateState({ sideTitle: title }));
      yield put(actions.updateState({
        currentQuestionsIndex: 1,
        oldCurrentQuestionsIndex: 1,
        hadSelectList: [],
        currentDate: e,
        keyword: '',
        currentDateIndex: '',
        currentRoleIndex: '',
      }));

      // 77.19
      yield put(actions.updateState({ pageSkip: 0 }));
      const exampaperType = yield select((state) => state.correction.exampaperType);
      const pLimit = yield select((state) => state.correction.pageLimit);
      const { head: { code }, data } = yield call(getExamWaitScoreQuestionByDate, {
        date: e,
        paper_id: '',
        skip: 0,
        limit: pLimit,
        exampaper_type: exampaperType,
      });
      if (code === 200) {
        yield put(actions.updateState({
          sum: data.count,
        }));
        data.rows.map((item, index) => {
          const dealData = item;
          dealData.index = index + 1;
          dealData.checkAll = false;
          dealData.question.createTime = new Date(item.question.createTime);
          dealData.question.createTime = moment(item.question.createTime).format('YYYY/MM/DD h:mm');
          return { ...item, ...dealData };
        });
        yield put(actions.updateState({
          questionsListInfo: data.rows,
          currentPaperId: data.rows[0].exampaper.paper_id,
          currentQuestion_id: data.rows[0].question.question_id,
          score: data.rows[0].question.score,
        }));
        yield put.resolve({ type: 'getDateQuestionTitleList' }); // 77.20
        yield put.resolve({ type: 'getExamWaitScoreQuestionAnswerResult' });// 77.21
      // console.log('cdate****跟新update date', '旧的', '新的：', e, data);
      }
    },
    /**
     * 切换questionsIndex  getExamWaitScoreQuestionByDateResulet
     */
    * changeQuestionsIndex({
      payload: {
        e, pid, qid, score,
      },
    }, { call, select, put }) {
      // console.log('_____________change success', e);

      yield put(actions.updateState({ hadSelectList: [] }));
      // 展开收起 功能
      // const nowIndex = yield select((state) => state.correction.currentQuestionsIndex);
      const oldIndex = yield select((state) => state.correction.oldCurrentQuestionsIndex);
      if (oldIndex === e) {
        yield put(actions.updateState({
          currentQuestionsIndex: 0,
          oldCurrentQuestionsIndex: 0,
          questionLoad: true,
          answerLoad: false,
        }));
      } else {
        yield put(actions.updateState({
          currentQuestionsIndex: e,
          oldCurrentQuestionsIndex: e,
          questionLoad: false,
          answerLoad: true,
        }));
        // console.log('当前的：', nowIndex, 'click :', e);
        // 切换学生答案数据
        // console.log(pid, qid);
        yield put(actions.updateState({
          currentPaperId: pid,
          currentQuestion_id: qid,
        }));
        // 取消 全选
        const qdate = yield select((state) => state.correction.questionsListInfo);

        const translate = JSON.parse(JSON.stringify(qdate));
        translate[e - 1].checkAll = false;
        yield put({ type: 'childrenCheckFalse' }, { payload: {} });
        yield put(actions.updateState({
          questionsListInfo: translate,
          score,
        }));
        // yield put.resolve({ type: 'getExamWaitScoreQuestionByDateResulet' }); // 77.19
        yield put({ type: 'getExamWaitScoreQuestionAnswerResult' }, { payload: {} }); // `77.21
      }
    },
    /**
     * 全选父函数，数据绑定在question上
     * @param param0 绑定在questionsListInfo的index传回来
     */
    * checkAll({ payload: { e } }, { all, select, put }) {
      // console.log(e, 'allselect');

      const qdate = yield select((state) => state.correction.questionsListInfo);

      const translate = JSON.parse(JSON.stringify(qdate));
      translate[e - 1].checkAll = !qdate[e - 1].checkAll;
      // console.log(translate, qdate);

      if (translate[e - 1].checkAll) {
        yield put({ type: 'childrenCheckTrues' }, { payload: {} });
      } else {
        yield put({ type: 'childrenCheckFalse' }, { payload: {} });
      }

      yield put(actions.updateState({
        questionsListInfo: translate,
      }));
      // } else {
      //   console.log('checkall list', isload, !isload);
      //   const translate: any = JSON.parse(JSON.stringify(isload));
      //   translate.rows[e - 1].checkAll = !isload.rows[e - 1].checkAll;
      //   yield put(actions.updateState({
      //     questionsListInfo: translate,
      //   }));
      if (translate[e - 1].checkAll) {
        yield put({ type: 'childrenCheckTrue' });
      } else {
        yield put({ type: 'childrenCheckFalse' });
      }
      // }
      yield put({ type: 'filterSelectArray' });
    },
    /**
     * 全选状态
     */
    * childrenCheckTrue(_, { select, put }) {
      // console.log('childrenCheckTrue');
      // 获取state数据
      const children = yield select((state) => state.correction.studentsCardInfo);
      // 深拷贝修改
      const translate: any = JSON.parse(JSON.stringify(children));
      translate.rows.map((item) => {
        const res = item;
        res.selectOption = true;
        return res;
      });
      yield put(actions.updateState({
        studentsCardInfo: translate,
      }));
    },
    /**
     *  全不选状态
     */
    * childrenCheckFalse(_, { select, put }) {
      // 获取state数据
      const children = yield select((state) => state.correction.studentsCardInfo);
      // 深拷贝修改
      const translate: any = JSON.parse(JSON.stringify(children));
      translate.rows.map((item) => {
        const res = item;
        res.selectOption = false;
        return res;
      });
      yield put(actions.updateState({
        studentsCardInfo: translate,
      }));
    },
    /**
     * 全选 子函数  数据绑定在studentsCardInfo上
     */
    * childrenCheck({ payload: { e } }, { all, select, put }) {
      // 获取state数据
      const children = yield select((state) => state.correction.studentsCardInfo);
      // 深拷贝修改
      const translate: any = JSON.parse(JSON.stringify(children));
      translate.rows[e].selectOption = !translate.rows[e].selectOption;

      yield put(actions.updateState({
        studentsCardInfo: translate,
      }));
      // 比较是否全选状态

      const newOne = yield select((state) => state.correction.studentsCardInfo);
      const res: any = newOne.rows.filter((item, index) => item.selectOption);
      const cIndex = yield select((state) => state.correction.currentQuestionsIndex);
      const isload = yield select((state) => state.correction.questionsListInfo);
      const reloaddate: any = JSON.parse(JSON.stringify(isload));

      if (res.length === newOne.rows.length) {
        reloaddate[cIndex - 1].checkAll = true;
      } else {
        reloaddate[cIndex - 1].checkAll = false;
      }
      yield put(actions.updateState({
        questionsListInfo: reloaddate,
      }));
      yield put({ type: 'filterSelectArray' });
    },
    * filterSelectArray(_, { select, put }) {
      const res = yield select((state) => state.correction.studentsCardInfo);
      // console.log('res, filter', res);

      const newList = res.rows.filter((item) => item.selectOption);
      const noNewList = res.rows.filter((item) => !item.selectOption);
      const resId = newList.map((i) => i.subjective.subjective_detail_id);
      const noResId = noNewList.map((i) => i.subjective.subjective_detail_id);
      yield put(actions.updateState({
        hadSelectList: resId,
        noSelectList: noResId,
      }));
      // console.log(res, 'filterSelectArray', resId);
    },
    /**
     * 取消bottom显示
     */
    * cancleSelectArray(_, { put, select }) {
      yield put(actions.updateState({
        hadSelectList: [],
        noSelectList: [],
      }));
      yield put({ type: 'childrenCheckFalse' });
      const questionList = yield select((state) => state.correction.questionsListInfo);
      const translate: any = JSON.parse(JSON.stringify(questionList));
      // console.log(translate, 'bottom,translate');

      translate.map((item) => {
        const i = item;
        i.checkAll = false;
        return { ...item, ...i };
      });
      yield put(actions.updateState({
        questionsListInfo: translate,
      }));
    },
    /** *
  * 按照学员排列信息  77.18
  */
    * getExamDealUserResult(action, { call, select, put }) {
      const exampaperType = yield select((state) => state.correction.exampaperType);

      const { data: { rows } } = yield call(getExamDealUser, {
        deal_type: 'wait_score',
        exampaper_type: exampaperType,
      });
      // console.log(rows, '77.18');

      yield put(actions.updateState({
        rolesList: rows.slice(0, 7),
        rolesForm: rows,
      }));
    },

    /**
     * 初始化rolesList 让currentUser 信息是rolesList[0]
     */
    * initRolesList(_, { select, put }) {
      // yield put.resolve({ type: 'getExamDealUserResult' });
      const res = yield select((state) => state.correction.rolesList);
      yield put(actions.updateState({
        currentUser: {
          user_id: res[0].user.user_id || '',
          headimgurl: res[0].user.headimgurl || '',
          nickname: res[0].user.nickname || '',
        },
        roleSum: res[0].count,
      }));
      // console.log(res[0].count, 'initROlesList');
    },
    /**
     * getExamWaitScorePaperByStudent 77.22
     */
    * getExamWaitScorePaperByStudentResult(_, { call, put, select }) {
      yield put(actions.updateState({ pageSkip: 0 }));
      const pLimit = yield select((state) => state.correction.pageLimit);
      const userInfo = yield select((state) => state.correction.currentUser);
      const exampaperType = yield select((state) => state.correction.exampaperType);
      const currentRolesIndex = yield select((state) => state.correction.currentRolesIndex);
      const { head: { code }, data } = yield call(getExamWaitScorePaperByStudent, {
        user_id: userInfo.user_id,
        skip: 0,
        limit: pLimit,
        exampaper_type: exampaperType,
      });
      if (code === 200) {
        data.rows.map((item, index) => {
          const newArray = item;
          newArray.index = index + 1;
          newArray.submit_time = moment(newArray.submit_time).format('YYYY/MM/DD h:mm');
          return { ...item, ...newArray };
        });

        if (currentRolesIndex >= 1) {
          const trans = data.rows[currentRolesIndex - 1];
          console.log(77.22, data, '77.22  题目', trans, 'pid');
          yield put(actions.updateState({
            roleQuestionList: data.rows || [],
            sideRoleQuestionList: data.rows,
            roleDetailId: trans.detail_id,
            rolePaperId: trans.paper_id,
            roleSum: data.count,
          }));
        }
      }
    },
    /**
     * 77.23  获取答案信息
     */
    * getExamWaitScoreQuestionByStudentResult(_, { call, put, select }) {
      // yield put.resolve({ type: 'getExamWaitScorePaperByStudentResult' });
      const did = yield select((state) => state.correction.roleDetailId);
      const exampaperType = yield select((state) => state.correction.exampaperType);
      console.log(exampaperType, 'exampaperType', 77.23);

      const { head: { code }, data } = yield call(getExamWaitScoreQuestionByStudent, ({
        exampaper_type: exampaperType,
        detail_id: did,
        // paper_id: pid,
      }));
      console.log(data, '77.23 data');
      if (code === 200) {
        data.rows.map((item, index) => {
          const newObj = item;
          newObj.index = index + 1;

          return { ...item, ...newObj };
        });
        yield put(actions.updateState({
          roleAnswerList: data,
        }));
      }

      // console.log('answer 77.23：', data, 'did:', did);
    },
    /**
     * 更新role
     */
    * updateRole({ payload: { e } }, { call, select, put }) {
      // console.log('change role', e);
      const titleSide = yield select((s) => s.correction.exampaperType);
      const title = titleSide === 'set' ? '全部作业' : '全部考试';
      // 切换到 search状态 重置的role和roleIndex的数据
      yield put(actions.updateState({
        sideTitle: title, keyword: '', currentRolesIndex: 1, oldCurrentQuestionsIndex: 1, searchStatus: false, currentDateIndex: '', currentRoleIndex: '',
      }));
      // yield put(actions.updateState({roleSum: res[0].count,}))
      yield put.resolve(actions.updateState({
        currentUser: e,
      }));
      // const cuser = yield select((state) => state.correction.currentUser);

      yield put.resolve({ type: 'getExamWaitScorePaperByStudentResult' }); // 77.22
      yield put.resolve({ type: 'getExamWaitScoreQuestionByStudentResult' }); // 77.23
      // console.log(e, 'updateRole---------', cuser, 'changerole');
    },
    /**
     * changeQuestionsIndex  roles
     */
    * changeRoleQuestionIndex({ payload: { e } }, { call, put, select }) {
      console.log(e, '这是改变题目的currentRolesIndex');
      yield select((state) => state.correction.rolesList);
      // 展开收起 功能
      // const nowIndex = yield select((state) => state.correction.currentRolesIndex);
      const oldIndex = yield select((state) => state.correction.oldCurrentRolesIndex);
      if (oldIndex === e) {
        yield put(actions.updateState({
          currentRolesIndex: 0,
          oldCurrentRolesIndex: 0,

        }));
      } else {
        yield put(actions.updateState({
          currentRolesIndex: e,
          oldCurrentRolesIndex: e,

        }));
        // console.log('当前的：', nowIndex, 'click :', e);
        // 切换学生答案数据
        const qlist = yield select((state) => state.correction.roleQuestionList);

        // console.log(qlist, 'qlist------------ ');
        yield put(actions.updateState({
          roleDetailId: qlist[e - 1].detail_id,
          rolePaperId: qlist[e - 1].paper_id,
        }));
        yield put({ type: 'changePaperID' });
      }
    },
    * changePaperID(_, { put, select, call }) {
      const did = yield select((state) => state.correction.roleDetailId);
      const { head: { code }, data } = yield call(getExamWaitScoreQuestionByStudent, ({
        detail_id: did,
      }));
      if (code === 200) {
        data.rows.map((item, index) => {
          const newObj = item;
          newObj.index = index + 1;
          return { ...item, ...newObj };
        });
        yield put(actions.updateState({
          roleAnswerList: data,
        }));
      }

      // console.log('更换后answer列表：', data);
    },

    /**
     *搜索栏改变页面
     */
    // eslint-disable-next-line consistent-return
    * searchPaper({ payload: { e } }, { call, put, select }) {
      // yield put(actions.showLoading('加载中...'));
      yield put(actions.updateState({ searchStatus: true, roleQuestionList: [] }));
      // 切换到 search状态
      yield put(actions.updateState({ keyword: e }));
      yield put(actions.updateState({ pageSkip: 0 }));
      const pLimit = yield select((state) => state.correction.pageLimit);
      const pageStatus = yield select((state) => state.correction.dateOrStudent);
      const exampaperType = yield select((state) => state.correction.exampaperType);
      if (pageStatus) {
        // 学员

        const userInfo = yield select((state) => state.correction.currentUser);
        const { head: { code }, data } = yield call(getExamWaitScorePaperByStudent, {
          user_id: userInfo.user_id,
          skip: 0,
          limit: pLimit,
          keyword: e,
          exampaper_type: exampaperType,
        });
        if (code === 200) {
          data.rows.map((item, index) => {
            const newArray = item;
            newArray.index = index + 1;
            return { ...item, ...newArray };
          });

          yield put(actions.updateState({
            roleQuestionList: data.rows,
            searchRoleSum: data.count,
          }));
          if (data.rows.length === 0) {
            return yield put(actions.updateState({
              roleQuestionList: [],
            }));
          }

          yield put(actions.updateState({
            rolePaperId: data.rows[0].paper_id,
          }));
        }

        // console.log('学员  问题的数据', data);
      } else {
        // console.log('进入 searchPaperFn date');

        const cdate = yield select((state) => state.correction.currentDate);
        // 77.19 接口
        const { head: { code }, data } = yield call(getExamWaitScoreQuestionByDate, ({
          date: cdate,
          paper_id: '',
          skip: 0,
          limit: pLimit,
          keyword: e,
          exampaper_type: exampaperType,
        }));
        if (code === 200) {
          if (data.rows.length === 0) {
            return yield put(actions.updateState({
              questionsListInfo: [],
            }));
          }
          data.rows.map((item, index) => {
            const dealData = item;
            dealData.index = index + 1;
            dealData.checkAll = false;
            dealData.question.createTime = new Date(item.question.createTime);
            dealData.question.createTime = moment(item.question.createTime).format('YYYY/MM/DD h:mm');
            return { ...item, ...dealData };
          });
          yield put(actions.updateState({
            questionsListInfo: data.rows,
            searchDateSum: data.count,
            score: data.rows[0].question.score,
          }));
          // console.log(data, 'data saer');

          yield put({ type: 'getExamWaitScoreQuestionAnswerResult' });
        }
      }
      return 'searchPaper';
    },

    /** *
     * 打开日历
     */
    * pullDown(action, { call, select, put }) {
      const res = yield select((state) => state.correction.showCalendar);
      yield put(actions.updateState({
        showCalendar: !res,
      }));
    },
    /** *
     * 关闭这个日历操作
     */
    * hideFn(action, { call, select, put }) {
      yield put(actions.updateState({
        showCalendar: false,
      }));
    },
    /**
     * 隐藏sideQuestionList
     */
    * hideSideQuestionList(_, { put }) {
      yield put(actions.updateState({
        sidebar: false,
      }));
    },
    /**
     * 显示sideQuestionList
     */
    * showSideQuestionList(_, { put, select }) {
      yield put(actions.updateState({
        sidebar: true,
      }));
      // const res = yield select((state) => state.correction.sidebar);
    },
    /**
    *   searchPaper
     * sideQuestionsListClick
     */
    * sideQuestionsListClick({ payload: { e, title, detailId } }, { put, select, call }) {
      // console.log(e, 'side', 77.22);

      yield put(actions.updateState({ sideTitle: title }));
      yield put(actions.updateState({ searchStatus: true, pageSkip: 0 }));
      const pageStatus = yield select((state) => state.correction.dateOrStudent);
      const exampaperType = yield select((state) => state.correction.exampaperType);
      if (pageStatus) {
        yield put(actions.updateState({ currentRoleIndex: detailId }));

        const userInfo = yield select((state) => state.correction.currentUser);
        const { head: { code }, data } = yield call(getExamWaitScorePaperByStudent, {
          user_id: userInfo.user_id,
          skip: 0,
          limit: 20,
          paper_id: e,
          exampaper_type: exampaperType,
        });
        if (code === 200) {
          data.rows.map((item, index) => {
            const newArray = item;
            newArray.index = index + 1;
            newArray.submit_time = moment(newArray.submit_time).format('YYYY/MM/DD h:mm');
            return { ...item, ...newArray };
          });
          // console.log('学员  问题的数据', data, 'detail_id:', data.rows[0].detail_id);
          yield put(actions.updateState({
            roleQuestionList: data.rows,
          }));
          yield put(actions.updateState({
            rolePaperId: data.rows[0].paper_id,
            roleDetailId: data.rows[0].detail_id,
          }));
        }

        // 77.23
        // yield put({ type: 'getExamWaitScoreQuestionByStudentResult' });
      } else {
        yield put(actions.updateState({ currentDateIndex: e }));

        const cdate = yield select((state) => state.correction.currentDate);
        const pLimit = yield select((state) => state.correction.pageLimit);
        // 77.19 接口
        const { head: { code }, data } = yield call(getExamWaitScoreQuestionByDate, ({
          date: cdate,
          paper_id: e,
          skip: 0,
          limit: pLimit,
          exampaper_type: exampaperType,
        }));
        yield put(actions.updateState({
          currentPaperId: e,
        }));
        if (code === 200) {
          data.rows.map((item, index) => {
            const dealData = item;
            dealData.index = index + 1;
            dealData.checkAll = false;
            dealData.question.createTime = new Date(item.question.createTime);
            dealData.question.createTime = moment(item.question.createTime).format('YYYY/MM/DD h:mm');
            return { ...item, ...dealData };
          });
          yield put(actions.updateState({
            questionsListInfo: data.rows,
          }));
        }
        // const test = yield select((state) => state.correction.questionsListInfo);
      }
    },
    /**
     *  翻页
     */
    * onReachBottom(_, { put, call, select }) {
      yield put(actions.showLoading('加载中...'));
      const questionLoad = yield select((s) => s.correction.questionLoad);
      const answerLoad = yield select((s) => s.correction.answerLoad);

      const searchStatus = yield select((state) => state.correction.searchStatus);
      const pageStatus = yield select((state) => state.correction.dateOrStudent);
      // 日期翻页
      if (!pageStatus && !searchStatus && questionLoad) {
        const sum = yield select((state) => state.correction.sum);
        const skip = yield select((state) => state.correction.pageSkip);
        const limit = yield select((state) => state.correction.pageLimit);
        const addList = yield select((state) => state.correction.questionsListInfo);
        let sumIndex;
        if (skip === 0) {
          sumIndex = 1;
        } else {
          sumIndex = ((skip / limit) + 1);
        }
        if (sum > (sumIndex * limit)) {
          // 可以累加
          yield put.resolve(actions.updateState({ pageSkip: sumIndex * limit }));
          // 77.19
          const pLimit = yield select((state) => state.correction.pageLimit);
          const pSkip = yield select((state) => state.correction.pageSkip);
          const cdate = yield select((state) => state.correction.currentDate);
          const exampaperType = yield select((state) => state.correction.exampaperType);
          const { head: { code }, data } = yield call(getExamWaitScoreQuestionByDate, {
            date: cdate,
            paper_id: '',
            skip: pSkip,
            limit: pLimit,
            exampaper_type: exampaperType,
          });
          if (code === 200) {
            data.rows.map((item, idx) => {
              const dealData = item;
              dealData.index = (sumIndex * limit) + idx + 1;
              dealData.checkAll = false;
              dealData.question.createTime = new Date(item.question.createTime);
              dealData.question.createTime = moment(item.question.createTime).format('YYYY/MM/DD h:mm');
              return { ...item, ...dealData };
            });

            yield put(actions.updateState({
              questionsListInfo: [...addList, ...data.rows],
            }));
          }
          // 77.21
          // yield put.resolve({ type: 'getExamWaitScoreQuestionAnswerResult' });
        }
      }
      // 学员页翻页
      if (pageStatus && !searchStatus) {
        const sum = yield select((state) => state.correction.roleSum);
        const pSkip = yield select((state) => state.correction.pageSkip);
        const pLimit = yield select((state) => state.correction.pageLimit);
        const userInfo = yield select((state) => state.correction.currentUser);
        const addList = yield select((state) => state.correction.roleQuestionList);
        const exampaperType = yield select((state) => state.correction.exampaperType);
        let sumIndex;
        if (pSkip === 0) {
          sumIndex = 1;
        } else {
          sumIndex = ((pSkip / pLimit) + 1);
        }

        if (sum > (sumIndex * pLimit)) {
          // 可以累加 增加skip
          yield put.resolve(actions.updateState({
            pageSkip: sumIndex * pLimit,
          }));
          // 77.22

          const { head: { code }, data: { rows } } = yield call(getExamWaitScorePaperByStudent, {
            user_id: userInfo.user_id,
            skip: pSkip,
            limit: pLimit,
            exampaper_type: exampaperType,
          });
          if (code === 200) {
            rows.map((qItem, idx) => {
              const newArray = qItem;
              newArray.index = (sumIndex * pLimit) + idx + 1;
              newArray.submit_time = moment(newArray.submit_time).format('YYYY/MM/DD h:mm');
              return [qItem, newArray];
            });
            // console.log([...addList, ...rows], 'newlist***********');

            yield put(actions.updateState({
              roleQuestionList: [...addList, ...rows],
              sideRoleQuestionList: [...addList, ...rows],
              roleDetailId: [...addList, ...rows][0].detail_id,
              rolePaperId: [...addList, ...rows][0].paper_id,
            }));
          }
          // yield put({ type: 'getExamWaitScoreQuestionByStudentResult' });
        }
      }
      // 日期下搜索翻页
      if (!pageStatus && searchStatus && questionLoad) {
        // console.log('日期下搜索翻页');
        const sum = yield select((state) => state.correction.searchDateSum);
        const skip = yield select((state) => state.correction.pageSkip);
        const limit = yield select((state) => state.correction.pageLimit);
        const addList = yield select((state) => state.correction.questionsListInfo);
        let sumIndex;
        if (skip === 0) {
          sumIndex = 1;
        } else {
          sumIndex = ((skip / limit) + 1);
        }
        if (sum > (sumIndex * limit)) {
          // 可以累加
          yield put.resolve(actions.updateState({
            pageSkip: sumIndex * limit,
          }));
          const keyword = yield select((state) => state.correction.keyword);
          // 77.19
          const pLimit = yield select((state) => state.correction.pageLimit);
          const pSkip = yield select((state) => state.correction.pageSkip);
          const cdate = yield select((state) => state.correction.currentDate);
          const exampaperType = yield select((state) => state.correction.exampaperType);
          const { head: { code }, data } = yield call(getExamWaitScoreQuestionByDate, {
            date: cdate,
            paper_id: '',
            skip: pSkip,
            limit: pLimit,
            keyword,
            exampaper_type: exampaperType,
          });
          if (code === 200) {
            data.rows.map((item, idx) => {
              const dealData = item;
              dealData.index = (sumIndex * limit) + idx + 1;
              dealData.checkAll = false;
              dealData.question.createTime = new Date(item.question.createTime);
              dealData.question.createTime = moment(item.question.createTime).format('YYYY/MM/DD h:mm');
              return { ...item, ...dealData };
            });

            yield put(actions.updateState({
              questionsListInfo: [...addList, ...data.rows],
            }));
          }
          // 77.21
          // yield put.resolve({ type: 'getExamWaitScoreQuestionAnswerResult' });
        }
      }
      // 学员下搜索翻页
      if (pageStatus && searchStatus) {
        const sum = yield select((state) => state.correction.searchRoleSum);
        const pSkip = yield select((state) => state.correction.pageSkip);
        const pLimit = yield select((state) => state.correction.pageLimit);
        const userInfo = yield select((state) => state.correction.currentUser);
        const addList = yield select((state) => state.correction.roleQuestionList);
        const exampaperType = yield select((state) => state.correction.exampaperType);
        let sumIndex;
        if (pSkip === 0) {
          sumIndex = 1;
        } else {
          sumIndex = ((pSkip / pLimit) + 1);
        }
        if (sum > (sumIndex * pLimit)) {
          // 可以累加 增加skip
          yield put.resolve(actions.updateState({
            pageSkip: sumIndex * pLimit,
          }));
          // 77.22
          const keyword = yield select((state) => state.correction.keyword);

          const { head: { code }, data: { rows } } = yield call(getExamWaitScorePaperByStudent, {
            user_id: userInfo.user_id,
            skip: pSkip,
            limit: pLimit,
            keyword,
            exampaper_type: exampaperType,
          });
          if (code === 200) {
            rows.map((qItem, idx) => {
              const newArray = qItem;
              newArray.index = (sumIndex * pLimit) + idx + 1;
              newArray.submit_time = moment(newArray.submit_time).format('YYYY/MM/DD h:mm');
              return [qItem, newArray];
            });

            yield put(actions.updateState({
              roleQuestionList: [...addList, ...rows],
              sideRoleQuestionList: [...addList, ...rows],
              roleDetailId: [...addList, ...rows][0].detail_id,
              rolePaperId: [...addList, ...rows][0].paper_id,
            }));
          }
          // yield put({ type: 'getExamWaitScoreQuestionByStudentResult' });
        }
      }
      // 日期下答案翻页
      if (!pageStatus && !searchStatus && answerLoad) {
        const sum = yield select((state) => state.correction.answerSum);
        const skip = yield select((state) => state.correction.answerSkip);
        const limit = yield select((state) => state.correction.answerPageLimit);
        const addList = yield select((state) => state.correction.studentsCardInfo);
        let sumIndex;
        if (skip === 0) {
          sumIndex = 1;
        } else {
          sumIndex = ((skip / limit) + 1);
        }
        if (sum > (sumIndex * limit)) {
          // 可以累加
          yield put.resolve(actions.updateState({ pageSkip: sumIndex * limit }));

          // 77.21
          const exampaperType = yield select((state) => state.correction.exampaperType);
          const pid = yield select((state) => state.correction.currentPaperId);
          const qid = yield select((state) => state.correction.currentQuestion_id);
          const roleLimit = yield select((state) => state.correction.rolePageLimit);
          const lastSubmitTime = yield select((state) => state.correction.lastSubmitTime);

          // if (pid && qid) {
          //   console.log('had pid and qid', pid);
          // } else {
          //   yield put.resolve({ type: 'initPidAndQid' });
          //   // console.log('初始化---------发送请求', '没有pid qid，重新获取');
          //   pid = yield select((state) => state.correction.currentPaperId);
          //   qid = yield select((state) => state.correction.currentQuestion_id);
          // }
          const { head: { code }, data } = yield call(getExamWaitScoreQuestionAnswer, {
            paper_id: pid,
            question_id: qid,
            exampaper_type: exampaperType,
            limit: roleLimit,
            last_submit_time: lastSubmitTime,
          });
          if (code === 200) {
            data.rows.map((item, index) => {
              const dealData = item;
              dealData.index = index;
              dealData.selectOption = false;
              dealData.subjective.submit_time = moment(item.subjective.submit_time).format('YYYY/MM/DD h:mm');
              return { ...item, ...dealData };
            });
            yield put(actions.updateState({
              studentsCardInfo: [...addList, data],
              lastSubmitTime: data.last_submit_time,
            }));
          }
          console.log('刷新 reload');
        }
      }
      // 日期下 答案 搜索 翻页
      if (!pageStatus && searchStatus && answerLoad) {
        const sum = yield select((state) => state.correction.answerSum);
        const skip = yield select((state) => state.correction.answerSkip);
        const limit = yield select((state) => state.correction.answerPageLimit);
        const addList = yield select((state) => state.correction.studentsCardInfo);
        let sumIndex;
        if (skip === 0) {
          sumIndex = 1;
        } else {
          sumIndex = ((skip / limit) + 1);
        }
        if (sum > (sumIndex * limit)) {
          // 可以累加
          yield put.resolve(actions.updateState({ pageSkip: sumIndex * limit }));

          // 77.21
          const exampaperType = yield select((state) => state.correction.exampaperType);
          const pid = yield select((state) => state.correction.currentPaperId);
          const qid = yield select((state) => state.correction.currentQuestion_id);
          const roleLimit = yield select((state) => state.correction.rolePageLimit);
          const lastSubmitTime = yield select((state) => state.correction.lastSubmitTime);

          // if (pid && qid) {
          //   console.log('had pid and qid', pid);
          // } else {
          //   yield put.resolve({ type: 'initPidAndQid' });
          //   // console.log('初始化---------发送请求', '没有pid qid，重新获取');
          //   pid = yield select((state) => state.correction.currentPaperId);
          //   qid = yield select((state) => state.correction.currentQuestion_id);
          // }
          const { head: { code }, data } = yield call(getExamWaitScoreQuestionAnswer, {
            paper_id: pid,
            question_id: qid,
            exampaper_type: exampaperType,
            limit: roleLimit,
            last_submit_time: lastSubmitTime,
          });
          if (code === 200) {
            data.rows.map((item, index) => {
              const dealData = item;
              dealData.index = index;
              dealData.selectOption = false;
              dealData.subjective.submit_time = moment(item.subjective.submit_time).format('YYYY/MM/DD h:mm');
              return { ...item, ...dealData };
            });
            yield put(actions.updateState({
              studentsCardInfo: [...addList, data],
              lastSubmitTime: data.last_submit_time,
            }));
            console.log('刷新 reload');
          }
        }
      }
      yield put(actions.hideLoading());
    },
    /**
     * 点击显示批改弹窗
     */
    * showCorrectMenu({ payload: { e, score, checkall } }, { call, put, select }) {
      console.log(e, score, 'showCorrectMenu');
      const pageStatus = yield select((state) => state.correction.dateOrStudent);
      yield put(actions.updateState({ isMenuVisible: true }));
      let pid;
      let qid;
      let detailId;
      // console.log(e, 'showMeus');
      if (pageStatus) {
        qid = e[0].question_id;
        pid = yield select((state) => state.correction.rolePaperId);
        detailId = [e[0].subjective.subjective_detail_id];
        yield put(actions.updateState({ score: e[0].score }));
        console.log(e, '学员', pid, qid);
      } else {
        yield put(actions.updateState({ score }));

        pid = yield select((state) => state.correction.currentPaperId);
        qid = yield select((state) => state.correction.currentQuestion_id);
        detailId = e;
        console.log(e, 'date page', pid, qid);
      }
      if (checkall === 'checkAll') {
        // const iscore = yield select((s) => s.correction.score);
        // yield put(actions.updateState({ score: num }));
      }
      const sumInfo = { pid, qid, detailId };
      // console.log(pid, qid, detailId, 'pid, qid, detailId ');

      yield put(actions.updateState({ sumbitPaperUser: sumInfo }));
    },

    /**
     * 上传音频、视频、图片 批改分数
     */
    // eslint-disable-next-line consistent-return
    * SumbitCorrectInfo({ payload: { e } }, { call, put, select }) {
      // yield put(actions.showLoading('上传中...'));
      const remarkList = yield select((s) => s.correction.remarkFileList);
      const remarkAudioList = yield select((s) => s.correction.remarkAudioFileList);
      const sumbitPaperUser = yield select((s) => s.correction.sumbitPaperUser);
      // let pid = yield select((state) => state.correction.currentPaperId);
      const sumRemarkList = [...remarkList, ...remarkAudioList];
      const allselect = yield select((state) => state.correction.hadSelectList);
      const noAllselect = yield select((state) => state.correction.noSelectList);
      let isAllSelect;

      if (allselect.length > 1) {
        isAllSelect = 'y';
      } else {
        isAllSelect = 'n';
      }
      const score = parseFloat(e.value);
      // 判断为空
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(score)) {
        return (Toast.info('请输入正确的分数'));
      }
      const { head: { code } } = yield call(correctPapers, {
        paper_id: sumbitPaperUser.pid,
        question_id: sumbitPaperUser.qid,
        score,
        select_all_flag: isAllSelect,
        remark_file_list: sumRemarkList, // 附件列表
        include_detail_ids: sumbitPaperUser.detailId,
        remark_content: e.analyse,
        exclude_detail_ids: noAllselect,
      });

      // console.log(e, 'asd_______SumbitCorrectInfo', sumbitPaperUser);
      // console.log('remarkList:', remarkList);
      // console.log('remarkAudioList:', remarkAudioList);
      // console.log('sumRemarkList:', sumRemarkList);
      // yield put(actions.updateState({ isMenuVisible: false, isSend: true }));

      // yield put.resolve({ type: 'reloadPage' });
      yield put(actions.updateState({ isMenuVisible: false, isSend: true }));
      if (code === 200) {
        yield put.resolve({ type: 'reloadPage' });
        yield put(actions.updateState({
          remarkFileList: [],
          remarkAudioFileList: [],
          sumbitPaperUser: {},
          hadSelectList: [],
          iAnaylse: '',
          iScore: null,
        }));
        Toast.info('批改成功');
      } else {
        Toast.info('失败');
      }
    },
    // eslint-disable-next-line consistent-return
    * SumbitCorrectInfoHomework({ payload: { e } }, { call, put, select }) {
      // yield put(actions.showLoading('上传中...'));
      const remarkList = yield select((s) => s.correction.remarkFileList);
      const remarkAudioList = yield select((s) => s.correction.remarkAudioFileList);
      const sumbitPaperUser = yield select((s) => s.correction.sumbitPaperUser);
      // let pid = yield select((state) => state.correction.currentPaperId);
      const noAllselect = yield select((state) => state.correction.noSelectList);
      const sumRemarkList = [...remarkList, ...remarkAudioList];
      const allselect = yield select((state) => state.correction.hadSelectList);
      const scoreType = yield select((s) => (s.correction.scoreType));

      let isAllSelect;

      if (allselect.length > 1) {
        isAllSelect = 'y';
      } else {
        isAllSelect = 'n';
      }
      const score = parseFloat(e.scorePic);
      const topFlag = e.joinSelect ? 'y' : 'n';
      // 判断为空
      // eslint-disable-next-line no-restricted-globals
      if (score === 0) {
        return (Toast.info('请先打分'));
      }

      const { head: { code, msg } } = yield call(correctPapers, {
        paper_id: sumbitPaperUser.pid,
        question_id: sumbitPaperUser.qid,
        score,
        select_all_flag: isAllSelect,
        remark_file_list: sumRemarkList, // 附件列表
        include_detail_ids: sumbitPaperUser.detailId,
        remark_content: e.analyse,
        exclude_detail_ids: noAllselect,
        top_flag: topFlag,
        score_type: scoreType,
      });

      if (code === 200) {
        yield put(actions.updateState({ isMenuVisible: false, isSend: true }));
        yield put.resolve({ type: 'reloadPageHome' });
        Toast.info('批改成功');
        yield put(actions.updateState({
          remarkFileList: [],
          remarkAudioFileList: [],
          sumbitPaperUser: {},
          hadSelectList: [],
          iAnaylse: '',
          // iScore: null,
          homeScore: 0,
          top_flag: false,
          joinSelect: false,
        }));
      } else {
        Toast.info(msg);
      }
    },
    * reloadPage(_, { call, select, put }) {
      const pageStatus = yield select((s) => s.correction.dateOrStudent);
      yield put.resolve({ type: 'getTeacherWaitDealCountResult' }); // 重新header
      yield put.resolve({ type: 'getExamDealUserResult' }); // 重新获取数据 77.18
      if (pageStatus) {
        // 重新获取数据 77.22
        yield put(actions.updateState({ pageSkip: 0 }));
        const pLimit = yield select((state) => state.correction.pageLimit);
        const userInfo = yield select((state) => state.correction.currentUser);
        const exampaperType = yield select((state) => state.correction.exampaperType);
        const { data } = yield call(getExamWaitScorePaperByStudent, {
          user_id: userInfo.user_id,
          skip: 0,
          limit: pLimit,
          exampaper_type: exampaperType,
        });
        data.rows.map((item, index) => {
          const newArray = item;
          newArray.index = index + 1;
          return { ...item, ...newArray };
        });
        const roleDetailId = yield select((s) => s.correction.roleDetailId);
        const rolePaperId = yield select((s) => s.correction.rolePaperId);
        yield put(actions.updateState({
          roleQuestionList: data.rows,
          sideRoleQuestionList: data.rows,
          roleDetailId,
          rolePaperId,
          roleSum: data.count,
        }));
        // console.log('更新 接口了', 77.22, 77.23);
        // 学员页
        yield put.resolve({ type: 'getExamWaitScoreQuestionByStudentResult' }); // 重新获取数据 77.23

        yield put.resolve({ type: 'getExamDealCalendarResult' }); // 重新获取数据 77.17

        yield put.resolve({ type: 'getExamWaitScoreQuestionByDateResulet' }); // 重新获取数据 77.19

        yield put.resolve({ type: 'getDateQuestionTitleList' }); // 重新获取数据 77.20
        yield put.resolve({ type: 'getExamWaitScoreQuestionAnswerResult' }); // 重新获取数据 77.21
      } else {
        yield put.resolve({ type: 'getExamDealCalendarResult' }); // 重新获取数据 77.17
        yield put.resolve({ type: 'getExamWaitScoreQuestionByDateResulet' }); // 重新获取数据 77.19

        // const psLimit = yield select((state) => state.correction.pageLimit);
        // const pSkip = yield select((state) => state.correction.pageSkip);
        // const cdate = yield select((state) => state.correction.currentDate);
        const exampaperType = yield select((state) => state.correction.exampaperType);

        yield put.resolve({ type: 'getDateQuestionTitleList' }); // 重新获取数据 77.20
        yield put.resolve({ type: 'getExamWaitScoreQuestionAnswerResult' }); // 重新获取数据 77.21
        // 重新获取数据 77.22

        yield put(actions.updateState({ pageSkip: 0 }));
        const pLimit = yield select((state) => state.correction.pageLimit);
        const userInfo = yield select((state) => state.correction.currentUser);
        const { data } = yield call(getExamWaitScorePaperByStudent, {
          user_id: userInfo.user_id,
          skip: 0,
          limit: pLimit,
          exampaper_type: exampaperType,
        });
        data.rows.map((item, index) => {
          const newArray = item;
          newArray.index = index + 1;
          return { ...item, ...newArray };
        });
        const roleDetailId = yield select((s) => s.correction.roleDetailId);
        const rolePaperId = yield select((s) => s.correction.rolePaperId);
        yield put(actions.updateState({
          roleQuestionList: data.rows,
          sideRoleQuestionList: data.rows,
          roleDetailId,
          rolePaperId,
          roleSum: data.count,
        }));
        console.log('更新 接口了', 77.22, 77.23);
        yield put.resolve({ type: 'getExamWaitScoreQuestionByStudentResult' }); // 重新获取数据 77.23
      }
      yield put(actions.updateState({ isSend: false }));
    },
    * reloadPageHome(_, { call, select, put }) {
      const pageStatus = yield select((s) => s.correction.dateOrStudent);
      const currentQuestionsIndex = yield select((s) => s.correction.currentQuestionsIndex);
      yield put.resolve({ type: 'getTeacherWaitDealCountResult' }); // 重新header
      yield put.resolve({ type: 'getExamDealUserResult' }); // 重新获取数据 77.18
      if (pageStatus) {
        // 重新获取数据 77.22

        yield put(actions.updateState({ pageSkip: 0 }));
        const pLimit = yield select((state) => state.correction.pageLimit);
        const userInfo = yield select((state) => state.correction.currentUser);
        const exampaperType = yield select((state) => state.correction.exampaperType);
        const { head: { code }, data } = yield call(getExamWaitScorePaperByStudent, {
          user_id: userInfo.user_id,
          skip: 0,
          limit: pLimit,
          exampaper_type: exampaperType,
        });
        if (code === 200) {
          data.rows.map((item, index) => {
            const newArray = item;
            newArray.index = index + 1;
            return { ...item, ...newArray };
          });
          const roleDetailId = yield select((s) => s.correction.roleDetailId);
          const rolePaperId = yield select((s) => s.correction.rolePaperId);
          yield put(actions.updateState({
            roleQuestionList: data.rows,
            sideRoleQuestionList: data.rows,
            roleDetailId,
            rolePaperId,
            roleSum: data.count,
          }));
          // console.log('更新 接口了', 77.22, 77.23);
          // 学员页
          yield put.resolve({ type: 'getExamWaitScoreQuestionByStudentResult' }); // 重新获取数据 77.23

          yield put.resolve({ type: 'getExamDealCalendarResult' }); // 重新获取数据 77.17
          yield put.resolve({ type: 'getExamWaitScoreQuestionByDateResulet' });// 77.19
          const getInfo = yield select(((state) => state.correction.questionsListInfo));
          if (currentQuestionsIndex >= 1) {
            const pid = getInfo[currentQuestionsIndex - 1].exampaper.paper_id;
            const qid = getInfo[currentQuestionsIndex - 1].question.question_id;
            const num = getInfo[currentQuestionsIndex - 1].question.score;
            yield put(actions.updateState({
              currentPaperId: pid,
              currentQuestion_id: qid,
              score: num,
            }));
          } else {
            return;
          }

          yield put.resolve({ type: 'getDateQuestionTitleList' }); // 重新获取数据 77.20
          yield put.resolve({ type: 'getExamWaitScoreQuestionAnswerResult' }); // 重新获取数据 77.21
        }
      } else {
        yield put.resolve({ type: 'getExamDealCalendarResult' }); // 重新获取数据 77.17
        // yield put.resolve({ type: 'getExamWaitScoreQuestionByDateResulet' }); // 重新获取数据 77.19
        // yield put.resolve({ type: 'initPidAndQid' }); // 初始化
        yield put.resolve({ type: 'getExamWaitScoreQuestionByDateResulet' });// 77.19
        const getInfo = yield select(((state) => state.correction.questionsListInfo));

        if (currentQuestionsIndex >= 1) {
          const pid = getInfo[currentQuestionsIndex - 1].exampaper.paper_id;
          const qid = getInfo[currentQuestionsIndex - 1].question.question_id;
          const num = getInfo[currentQuestionsIndex - 1].question.score;
          yield put(actions.updateState({
            currentPaperId: pid,
            currentQuestion_id: qid,
            score: num,
          }));
        } else {
          return;
        }
        const exampaperType = yield select((state) => state.correction.exampaperType);

        yield put.resolve({ type: 'getDateQuestionTitleList' }); // 重新获取数据 77.20
        yield put.resolve({ type: 'getExamWaitScoreQuestionAnswerResult' }); // 重新获取数据 77.21
        // 重新获取数据 77.22

        yield put(actions.updateState({ pageSkip: 0 }));
        const pLimit = yield select((state) => state.correction.pageLimit);
        const userInfo = yield select((state) => state.correction.currentUser);
        const { head: { code }, data } = yield call(getExamWaitScorePaperByStudent, {
          user_id: userInfo.user_id,
          skip: 0,
          limit: pLimit,
          exampaper_type: exampaperType,
        });
        if (code === 200) {
          data.rows.map((item, index) => {
            const newArray = item;
            newArray.index = index + 1;
            return { ...item, ...newArray };
          });
          const roleDetailId = yield select((s) => s.correction.roleDetailId);
          const rolePaperId = yield select((s) => s.correction.rolePaperId);
          yield put(actions.updateState({
            roleQuestionList: data.rows,
            sideRoleQuestionList: data.rows,
            roleDetailId,
            rolePaperId,
            roleSum: data.count,
          }));
          console.log('更新 接口了', 77.22, 77.23);
          yield put.resolve({ type: 'getExamWaitScoreQuestionByStudentResult' }); // 重新获取数据 77.23
        }
        yield put(actions.updateState({ isSend: false }));
      }
    },
    // 上传函数
    * imageUploaded({ payload: { files } }, { call, select, put }) {
      const remarkFileList = yield select((s) => (s.correction.remarkFileList));

      console.log('imageUploaded', remarkFileList, files, '返回的数据');

      const newRemarkFileList = [].concat(remarkFileList).concat(files.map(
        (file: IRemarkFile, index) => ({ type: 'image', url: file.url, fileObject: file.fileObject }),
      ));
      yield put(actions.updateState({ remarkFileList: newRemarkFileList }));
    },

    * videoUploaded({ payload: { files } }, { call, select, put }) {
      const remarkFileList = yield select((s) => (s.correction.remarkFileList));

      // console.log('videoUploaded', remarkFileList, files);

      const newRemarkFileList = [].concat(remarkFileList).concat(files.map(
        (file: IRemarkFile, index) => ({ type: 'video', url: file.url, fileObject: file.fileObject }),
      ));
      yield put(actions.updateState({ remarkFileList: newRemarkFileList }));
    },

    * audioUploaded({ payload: { files } }, { call, select, put }) {
      const remarkFileList = yield select((s) => (s.correction.remarkAudioFileList));
      // console.log('audioUploaded', remarkFileList, files);

      const newRemarkFileList = [].concat(remarkFileList).concat(files.map(
        (file: IRemarkFile, index) => (
          {
            type: 'audio', url: file.url, fileObject: file.fileObject, duration: (file.duration ? (file.duration * 1000) : 0),
          }
        ),
      ));
      yield put(actions.updateState({ remarkAudioFileList: newRemarkFileList }));
    },

    // 清空
    * clear(_, { put }) {
      yield put(actions.updateState({
        remarkFileList: [],
      }));
    },

    // 删除指定url的资源
    * removeByUrl({ payload: { url } }, { select, put }) {
      const remarkFileList: [] = yield select((s) => (s.correction.remarkFileList));
      yield put(actions.updateState({
        remarkFileList: remarkFileList.filter((item: any) => item.url !== url),
      }));
    },
    * removeAudioItem({ payload: { url } }, { select, put }) {
      const remarkFileList: [] = yield select((s) => (s.correction.remarkAudioFileList));
      yield put(actions.updateState({
        remarkAudioFileList: remarkFileList.filter((item: any) => item.url !== url),
      }));
    },

    * clearAudioList(_, { put, select }) {
      yield put(actions.updateState({
        remarkFileList: [],
        remarkAudioFileList: [],
        sumbitPaperUser: {},
        // hadSelectList: [],
      }));
    },
    * changeHomeworkStyle({ payload: { style, type } }, { select, put }) {
      const setCurrentStylePicStyles = yield select((s) => (s.correction.setCurrentStylePicStyles));

      let scoreType;
      if (type === 'STYLEZERO') scoreType = 'star';
      if (type === 'STYLEONE') scoreType = 'flower';
      if (type === 'STYLETWO') scoreType = 'thumb';
      console.log(setCurrentStylePicStyles, 'setCurrentStylePicStyles', scoreType, type);
      yield put(actions.updateState({ setCurrentStylePicStyles: style, scoreType }));
    },
  },

});
