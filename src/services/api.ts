export default {
  // T06.1 [对外]发送验证码
  sendValidateCode: 'POST /svc/auth/api/validate/sendValidateCode',

  // T06.2 [对外]验证码登录
  validateCodeLogin: 'POST /svc/auth/api/login/validateCodeLogin',

  // T06.4 [对外]旧版h5验证码登录 oauthMobileUserLogin
  oauthMobileUserLogin: 'POST /svc/auth/h/login/oauthMobileUserLogin',

  // T06.5 [对外]旧版h5登出
  oauthMobileUserLogout: 'POST /svc/auth/h/login/oauthMobileUserLogout',

  // T06.6 [对外]新版h5验证码登录
  h5MobileUserLogin: 'POST /svc/auth/h/login/h5MobileUserLogin',

  // T06.m2 微信端手机号登录的登出
  wxMobileLogout: 'POST /svc/auth/m/wxMobileLogout',

  // T07.m1 [对外]修改用户信息 updateMinaUserInfo
  updateMinaUserInfo: 'POST /svc/user/m/updateMinaUserInfo',

  // 11.18 获取七牛上传音频token
  getAudioToken: 'POST /getAudioToken',

  // 50.34 获取小程序菜单 getMiniTarbar
  getMiniTarbar: 'GET /m/getMiniTarbar',

  // 50.1 获取用户信息
  getUserInfo: 'GET /m/getUserInfo',

  // 50.2 addUserBrowse
  addUserBrowse: 'POST /m/addUserBrowse',

  // 50.14 获取模块通用头部banner
  getBanner: 'GET /m/getBanner',

  // 50.27 对象点赞 upObject
  upObject: 'POST /m/upObject',

  // 50.33 获取小程序配置
  getMiniconfig: 'GET /m/getMiniconfig',

  // 50.37 获取小程序信息
  getClientInfoM: 'GET /m/getClientInfo_M',

  // 50.41 获取小程序权限列表
  getMiniResourceList: 'GET /m/getMiniResourceList',

  // 50.43 获取七牛上传
  getQiniuToken: 'POST /getQiniuToken',

  // 50.52 获取图标导航列表
  getIconNavigationList: 'GET /m/getIconNavigationList',

  // 50.53 获取分类内容列表
  getCatalogObjectList: 'GET /m/getCatalogObjectList',

  // 50.54 获取图标导航详情
  getIconNavigationDetail: 'GET /m/getIconNavigationDetail',

  // 50.55 获取分享对话框信息
  getShareInfo: 'GET /m/getShareInfo',

  // 50.56 获取页面路径信息
  getObjectPathList: 'POST /m/getObjectPathList',

  // 50.57 获取我的菜单
  getMineMenu: 'GET /m/getMineMenu',
  // 50.58 获取待处理总数
  getTeacherWaitDealCount: 'GET /m/getTeacherWaitDealCount',
  // 51.11 获取订单微信支付信息 pay
  pay: 'POST /pay',

  // 51.12 小程序订单列表
  selforderlist: 'GET /selforderlist',

  // 51.13 小程序获取订单详情 getorder
  getOrder: 'GET /getorder',

  // 51.23 提取码、兑换码兑换虚拟商品 exchangeVirtualProductByCode
  exchangeVirtualProductByCode: 'POST /m/exchangeVirtualProductByCode',

  // 51.30 订单预览
  previewOrder: 'POST /m/previewOrder',

  // 52.0 获取优惠券列表 getTicketListByClient
  getTicketListByClient: 'GET /getTicketListByClient',

  // 52.1 领取优惠券
  receiveTicket: 'POST /receiveTicket',

  // 52.2 获取我的优惠券 getMyTicketList
  getMyTicketList: 'GET /getMyTicketList',

  // 52.5 获取可用优惠券列表(新)
  getAvailableTicketList: 'POST /m/getAvailableTicketList_new',

  // 52.17 获取商品相关的优惠券列表
  getTicketInfoByProId: 'GET /getTicketInfoByProId',

  // 52.19 获取推荐弹框
  getPopMessageList: 'GET /m/getPopMessageList',

  // 52.20 查看推荐弹框
  viewPopMessage: 'POST /m/viewPopMessage',

  // 52.21 点击推荐弹框
  clickPopMessage: 'POST /m/clickPopMessage',

  // 58.1 小程序文章列表 getArticleList
  getArticleList: 'GET /m/getArticleList',

  // 58.2 添加文章浏览量 addArticleBrowse
  addArticleBrowse: 'POST /m/addArticleBrowse',

  // 58.12 小程序文章详情 getArticleDetail
  getArticleDetail: 'GET /m/getArticleDetail',

  // 63.3.1 获取我的课程列表
  getMyCourseList: 'GET /m/course/getMyCourseList',

  // 63.4 获取课程详情+
  getCourseDetail: 'GET /m/course/getCourseDetail',

  // 63.6 参加课程+ joinCourse
  joinCourse: 'POST /m/course/joinCourse',

  // 63.2.1 获取分类详情
  getSubjectDetail: 'GET /m/course/getSubjectDetail',

  // 63.2 获取首页课程分组
  getSubjectList: 'GET /m/course/getSubjectList',

  // 63.3 获取课程列表 getCourseList
  getCourseList: 'GET /m/course/getCourseList',

  // 63.12 收藏课程
  favoriteCourse: 'POST /m/course/favoriteCourse',

  // 63.18 获取收藏课程列表 getMyFavoriteCourse
  getMyFavoriteCourse: 'GET /m/course/getMyFavoriteCourse',
  // 68.15 获取我的收藏曲谱列表 getMyFavoriteOpern
  getMyFavoriteOpern: 'GET /m/opern/getMyFavoriteOpern',
  // 68.18 我的收藏曲谱集列表 getMyFavoriteOpernset
  getMyFavoriteOpernset: 'GET /m/opern/getMyFavoriteOpernset',

  // 63.30 获取课程分享图
  getCourseShareImg: 'URL /m/course/getCourseShareImg',

  // 63.39 获取我的学习信息
  getMyCourseInfo: 'GET /m/course/getMyCourseInfo',

  // 65.11. 获取通用H5校验token
  wxH5Login: 'POST /svc/auth/wxH5Login',

  // 65.12 获取H5通用店铺信息
  getH5ShopInfo: 'GET /getH5ShopInfo',

  // 65.13 获取H5用户信息
  getPublicUserInfo: 'GET /m/getPublicUserInfo',

  // 65.24 获取jssdk参数
  getJssdkConfig: 'POST /h/getJssdkConfig',

  // 65.26 获取临时素材的
  getWxMediaUrl: 'GET /m/getWxMediaUrl',

  // 68.11 我的已购买曲谱列表
  getMyOpernList: 'GET /m/opern/getMyOpernList',

  // 68.1 获取曲谱分类列表 getOpernSubjectList
  getOpernSubjectList: 'GET /m/opern/getOpernSubjectList',

  // 68.2 获取曲谱列表 getOpernList
  getOpernList: 'GET /m/opern/getOpernList',

  // 68.4 获取曲谱详情 getOpernDetail
  getOpernDetail: 'GET /m/opern/getOpernDetail',

  // 68.5 领取曲谱 joinOpern
  joinOpern: 'POST /m/opern/joinOpern',

  // 68.7 获取曲谱集详情 getOpernsetDetail
  getOpernsetDetail: 'GET /m/opern/getOpernsetDetail',

  // 68.6 获取曲谱集列表 getOpernsetList
  getOpernsetList: 'GET /m/opern/getOpernsetList',

  // 68.14 收藏曲谱 favoriteOpern
  favoriteOpern: 'POST /m/opern/favoriteOpern',

  // 68.17 收藏曲谱集 favoriteOpernset
  favoriteOpernset: 'POST /m/opern/favoriteOpernset',

  // 68.19 获取曲谱分享图 getOpernShareImg
  getOpernShareImg: 'GET /m/opern/getOpernShareImg',

  // 68.20 获取曲谱集分享图 getOpernsetShareImg
  getOpernsetShareImg: 'GET /m/opern/getOpernsetShareImg',

  // 70.1 获取考级主题列表
  getExamSubjectList: 'GET /m/exam/getSubjectList',

  // 70.19 获取考级排行榜
  getExamRanking: 'GET /m/exam/getExamRanking',

  // 70.2 获取考级主题详情
  getExamSubjectDetail: 'GET /m/exam/getSubjectDetail',

  // 70.3 获取等级详情
  getLevelDetail: 'GET /m/exam/getLevelDetail',

  // 70.4 领取考级
  joinExam: 'POST /m/exam/joinExam',

  // 72.1 获取今日打卡列表
  getTodayDaka: 'GET /m/daka/getTodayDaka',

  // 72.3 获取全部打卡列表
  getDakaList: 'GET /m/daka/getDakaList',

  // 72.4 获取打卡主题详情
  getDakaDetail: 'GET /m/daka/getDakaDetail',

  // 72.5 加入打卡
  joinDaka: 'POST /m/daka/joinDaka',

  // 75.1 获取直播课列表
  getLivecourseList: 'GET /m/live/getLivecourseList',

  // 75.2 获取直播课详情 getLivecourseDetail
  getLivecourseDetail: 'GET /m/live/getLivecourseDetail',

  // 75.3 参加直播课 joinLiveCourse
  joinLiveCourse: 'POST /m/live/joinLiveCourse',

  // 75.6 获取我的直播列表
  getMyLiveCourseList: 'GET /m/live/getMyLiveCourseList',

  // 75.7 收藏直播课 favoriteLiveCourse
  favoriteLiveCourse: 'POST /m/live/favoriteLiveCourse',

  // 75.8 获取直播课分享图 getLiveCourseShareImg
  getLiveCourseShareImg: 'GET /m/live/getLiveCourseShareImg',

  // 75.13 获取直播课pc端登陆url getPcLiveUrl
  getPcLiveUrl: 'GET /m/live/getPcLiveUrl',

  // 75.15 获取直播课列表
  getAllLivecourseList: 'GET /m/live/getAllLivecourseList',

  // 76.1 获取会员卡列表 getMemberCardList
  getMemberCardList: 'GET /m/membercard/getMemberCardList',

  // 76.2 我的会员卡列表 myMemberCardList
  myMemberCardList: 'GET /m/membercard/myMemberCardList',

  // 76.3 获取会员卡详情 getMembercardDetail
  getMembercardDetail: 'GET /m/membercard/getMembercardDetail',

  // 76.4 加入会员卡 joinMembercard
  joinMembercard: 'POST /m/membercard/joinMembercard',

  // 76.5 获取会员卡关联的课程列表 getMembercardCourseList
  getMembercardCourseList: 'GET /m/membercard/getMembercardCourseList',

  // 76.6 获取会员卡关联的直播列表 getMembercardLivecourseList
  getMembercardLivecourseList: 'GET /m/membercard/getMembercardLivecourseList',

  // 76.8 获取我的会员卡信息
  getMyMembercardInfo: 'GET /m/membercard/getMyMembercardInfo',

  // 76.9 获取当前会员卡关联的打卡主题列表 getMembercardDakaSubjectList
  getMembercardDakaSubjectList: 'GET /m/membercard/getMembercardDakaSubjectList',

  // 77.1 获取考试详情
  getExampaperDetail: 'GET /exampaper/m/getExampaperDetail',

  // 77.10 获取考试成员列表
  getExampaperUserList: 'GET /svc/exampaper/m/getExampaperUserList',
  // 77.15 提交批改 correctPapers
  correctPapers: 'POST /svc/exampaper/m/correctPapers',
  // 77.17 获取待处理日期列表
  getExamDealCalendar: 'GET /svc/exampaper/m/getExamDealCalendar',

  // 77.18 获取待处理考试学员列表
  getExamDealUser: 'GET /svc/exampaper/m/getExamDealUser',
  // 77.19  获取日期待批改题目
  getExamWaitScoreQuestionByDate: 'GET /svc/exampaper/m/getExamWaitScoreQuestionByDate',
  // 77.20  获取当前老师有待批改的考试列表
  getExamWaitScorePaperByDate: 'GET /svc/exampaper/m/getExamWaitScorePaperByDate',
  // 77.21  获取待批改题目回答列表
  getExamWaitScoreQuestionAnswer: 'GET /svc/exampaper/m/getExamWaitScoreQuestionAnswer',
  // 77.2 加入考试
  joinExampaper: 'POST /exampaper/m/joinExampaper',
  // 77.22 按学员按学员获取待批改试卷列表
  getExamWaitScorePaperByStudent: 'GET /svc/exampaper/m/getExamWaitScorePaperByStudent',
  // 77.23 获取学员考试下待批改题目列表
  getExamWaitScoreQuestionByStudent: 'GET /svc/exampaper/m/getExamWaitScoreQuestionByStudent',
  // 77.33 提交讲解

  // 77.14 获取考试列表
  getExampaperList: 'GET /exampaper/m/getExampaperList',

  // 605.m1 获取方案详情 getTeachingPlanDetail
  getTeachingPlanDetail: 'GET /teachingPlan/m/getTeachingPlanDetail',
  // 605.m2 获取方案大纲 getItemList
  getItemList: 'GET /teachingPlan/m/getItemList',
  // 605.m3 加入方案 joinTeachingPlan
  joinTeachingPlan: 'POST /teachingPlan/m/joinTeachingPlan',
  // 605.m4 我的方案列表
  getMyTeachingPlanList: 'GET /teachingPlan/m/getMyTeachingPlanList',
  // 605.m8 获取方案列表
  getTeachingPlanList: 'GET /teachingPlan/m/getTeachingPlanList',

  // 606.m1 获取预约详情 getReservationDetail
  getReservationDetail: 'GET /reservation/m/getReservationDetail',
  // 606.m2 获取老师列表 getTeacherList
  getTeacherList: 'GET /reservation/m/getTeacherList',
  // 606.m9 获取预约列表
  getReservationList: 'GET /reservation/m/getReservationList',

  // 609.m7 获取报名表列表
  getApplyFormList: 'GET /m/getApplyFormList',

};
