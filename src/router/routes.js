/**
 * @Description:    路由列表
 * @Author:         TSY
 * @CreateDate:     2018/6/9 13:28
 */

//图片视频预览
const ImageVideoPreview = resolve => require(['../components/common/ImageVideoPreview'], resolve)

//登录
const Login = resolve => require(['../components/Login'], resolve)
//我的资料
const MyInformation = resolve => require(['../components/about/MyInformation'], resolve)
//意见反馈
const FeedBack = resolve => require(['../components/about/FeedBack'], resolve)
//关于校鸽
const About = resolve => require(['../components/about/About'], resolve)
//商务合作
const Business = resolve => require(['../components/about/Business'], resolve)

//首页
const Home = r => require.ensure([], () => r(require('../components/home/Home')), 'home')
const HomeBrief = r => require.ensure([], () => r(require('../components/home/HomeBrief')), 'home')
const HomePage = r => require.ensure([], () => r(require('../components/home/HomePage')), 'home')
const HomeMine = r => require.ensure([], () => r(require('../components/home/HomeMine')), 'home')

//隐患整改
const DangerChange = r => require.ensure([], () => r(require('../components/dangerChange/DangerChange')), 'danger-change')
const DangerDetail = r => require.ensure([], () => r(require('../components/dangerChange/DangerDetail')), 'danger-change')
const DangerNotice = r => require.ensure([], () => r(require('../components/dangerChange/DangerNotice')), 'danger-change')

//资料上报（问卷调查）
const UploadMaterial = r => require.ensure([], () => r(require('../components/uploadMaterial/UploadMaterial')), 'upload-material')
const QuestionnaireCheck = r => require.ensure([], () => r(require('../components/uploadMaterial/QuestionnaireCheck')), 'upload-material')
const QuestionnaireCount = r => require.ensure([], () => r(require('../components/uploadMaterial/QuestionnaireCount')), 'upload-material')
const QuestionnaireAdd = r => require.ensure([], () => r(require('../components/uploadMaterial/QuestionnaireAdd')), 'upload-material')

//专项检查
const SpecialCheck = r => require.ensure([], () => r(require('../components/specialCheck/SpecialCheck')), 'special-check')
const SpecialSchoolList = r => require.ensure([], () => r(require('../components/specialCheck/SpecialSchoolList')), 'special-check')
const SpecialCheckDetail = r => require.ensure([], () => r(require('../components/specialCheck/SpecialCheckDetail')), 'special-check')
const SpecialCheckRecord = r => require.ensure([], () => r(require('../components/specialCheck/SpecialCheckRecord')), 'special-check')
const SpecialCreateTable = r => require.ensure([], () => r(require('../components/specialCheck/SpecialCreateTable')), 'special-check')

//隐患上报
const DangerUpload = resolve => require(['../components/dangerUpload/DangerUpload'], resolve)

//社会督查
const SocialSupervision = r => require.ensure([], () => r(require('../components/socialSupervision/SocialSupervision')), 'social-supervision')
const SupervisionDetail = r => require.ensure([], () => r(require('../components/socialSupervision/SupervisionDetail')), 'social-supervision')

//事故管理
const DangerManagerList = r => require.ensure([], () => r(require('../components/dangerManager/DangerManagerList')), 'danger-manager')
const DangerManagerDetail = r => require.ensure([], () => r(require('../components/dangerManager/DangerManagerDetail')), 'danger-manager')
const DangerManagerUpload = r => require.ensure([], () => r(require('../components/dangerManager/DangerManagerUpload')), 'danger-manager')

//任务下发(工作任务)
const TaskPublish = r => require.ensure([], () => r(require('../components/taskPublish/TaskPublish')), 'task-publish')
const TaskReviewComplete = r => require.ensure([], () => r(require('../components/taskPublish/TaskReviewComplete')), 'task-publish')
const TaskPublishRelease = r => require.ensure([], () => r(require('../components/taskPublish/TaskPublishRelease')), 'task-publish')
const TaskPublishReleaseNext = r => require.ensure([], () => r(require('../components/taskPublish/TaskPublishReleaseNext')), 'task-publish')
const TaskNewBuild = r => require.ensure([], () => r(require('../components/taskPublish/TaskNewBuild')), 'task-publish')
const TaskSelectSchool = r => require.ensure([], () => r(require('../components/taskPublish/TaskSelectSchool')), 'task-publish')
const TaskNotice = r => require.ensure([], () => r(require('../components/taskPublish/TaskNotice')), 'task-publish')
const TaskWrite = r => require.ensure([], () => r(require('../components/taskPublish/TaskWrite')), 'task-publish')

//通知公告
const Notice = r => require.ensure([], () => r(require('../components/notice/Notice')), 'notice')
const NoticeDetail = r => require.ensure([], () => r(require('../components/notice/NoticeDetail')), 'notice')
const NoticeReviewComplete = r => require.ensure([], () => r(require('../components/notice/NoticeReviewComplete')), 'notice')
const NoticeSelectPeople = r => require.ensure([], () => r(require('../components/notice/NoticeSelectPeople')), 'notice')
const NoticeSelectEduPeople = r => require.ensure([], () => r(require('../components/notice/NoticeSelectEduPeople')), 'notice')
const NoticeSelectAccount = r => require.ensure([], () => r(require('../components/notice/NoticeSelectAccount')), 'notice')
const NoticeWrite = r => require.ensure([], () => r(require('../components/notice/NoticeWrite')), 'notice')

//绩效考核
const Performance = r => require.ensure([], () => r(require('../components/performance/Performance')), 'performance')
const PerformanceRule = r => require.ensure([], () => r(require('../components/performance/PerformanceRule')), 'performance')
const PerformanceDetail = r => require.ensure([], () => r(require('../components/performance/PerformanceDetail')), 'performance')
const PerformanceScoreSet = r => require.ensure([], () => r(require('../components/performance/PerformanceScoreSet')), 'performance')
const PerformanceScoreRecord = r => require.ensure([], () => r(require('../components/performance/PerformanceScoreRecord')), 'performance')
const PerformanceSchoolRank = r => require.ensure([], () => r(require('../components/performance/PerformanceSchoolRank')), 'performance')

//安全会议
const MeetingSigning = r => require.ensure([], () => r(require('../components/safeMeeting/MeetingSigning')), 'meeting-signing')
const MeetingSchoolList = r => require.ensure([], () => r(require('../components/safeMeeting/MeetingSchoolList')), 'meeting-signing')
const MeetingDetail = r => require.ensure([], () => r(require('../components/safeMeeting/MeetingDetail')), 'meeting-signing')
const MeetingList = r => require.ensure([], () => r(require('../components/safeMeeting/MeetingList')), 'meeting-signing')
const MeetingCount = r => require.ensure([], () => r(require('../components/safeMeeting/MeetingCount')), 'meeting-signing')

//安全知识库
const SafeKnowledge = resolve => require(['../components/safeKnowledge/SafeKnowledge'], resolve)

//代办事项
const TodoList = resolve => require(['../components/todoList/TodoList'], resolve)

//视频监控
const MonitorList = r => require.ensure([], () => r(require('../components/videoMonitor/MonitorList')), 'video-monitor')
const MonitorPlayer = r => require.ensure([], () => r(require('../components/videoMonitor/MonitorPlayer')), 'video-monitor')
const MonitorSchoolList = r => require.ensure([], () => r(require('../components/videoMonitor/MonitorSchoolList')), 'video-monitor')

//安全巡查（日常巡查）
const EverydayCheck = r => require.ensure([], () => r(require('../components/everydayCheck/EverydayCheck')), 'everyday-check')
const EverydayCheckDetail = r => require.ensure([], () => r(require('../components/everydayCheck/EverydayCheckDetail')), 'everyday-check')
const EverydaySchoolList = r => require.ensure([], () => r(require('../components/everydayCheck/EverydaySchoolList')), 'everyday-check')
const SchoolEverydayCheck = r => require.ensure([], () => r(require('../components/everydayCheck/SchoolEverydayCheck')), 'everyday-check')
const SchoolCheckDetail = r => require.ensure([], () => r(require('../components/everydayCheck/SchoolCheckDetail')), 'everyday-check')
const SchoolCheckRecord = r => require.ensure([], () => r(require('../components/everydayCheck/SchoolCheckRecord')), 'everyday-check')
const SchoolCheckRecordDetail = r => require.ensure([], () => r(require('../components/everydayCheck/SchoolCheckRecordDetail')), 'everyday-check')
const SchoolRecordCount = r => require.ensure([], () => r(require('../components/everydayCheck/SchoolRecordCount')), 'everyday-check')
const SchoolCheckRepairRecord = r => require.ensure([], () => r(require('../components/everydayCheck/SchoolCheckRepairRecord')), 'everyday-check')

//通讯录
const AddressList = r => require.ensure([], () => r(require('../components/addressList/AddressList')), 'address-list')
const UserInfo = r => require.ensure([], () => r(require('../components/addressList/UserInfo')), 'address-list')

export const routes = [
    {path: '/login', name: 'login', component: Login, meta: {title: '登录'}},
    {
        path: '/', name: 'home', component: Home, redirect: '/home/index', children: [
            {path: '/home/brief', name: 'homeBrief', component: HomeBrief, meta: {title: '校园安全综合管控云平台'}},
            {path: '/home/index', name: 'homePage', component: HomePage, meta: {title: '校园安全综合管控云平台'}},
            {path: '/home/mine', name: 'homeMine', component: HomeMine, meta: {title: '我的'}}
        ]
    },
    {
        path: '/dangerChange',
        name: 'dangerChange',
        component: DangerChange,
        meta: {title: '隐患整改', requireAuth: true, keepAlive: true, isBack: false}
    },
    {
        path: '/dangerDetail',
        name: 'dangerDetail',
        component: DangerDetail,
        meta: {title: '隐患详情', requireAuth: true, keepAlive: true, isBack: false}
    },
    {
        path: '/dangerNotice',
        name: 'dangerNotice',
        component: DangerNotice,
        meta: {title: '整改通知书', requireAuth: true}
    },
    {path: '/uploadMaterial', name: 'uploadMaterial', component: UploadMaterial, meta: {title: '问卷调查', requireAuth: true}},
    {path: '/questionnaireCheck/:id', name: 'questionnaireCheck', component: QuestionnaireCheck, meta: {title: '查看问卷', requireAuth: true}},
    {path: '/questionnaireCount/:id', name: 'questionnaireCount', component: QuestionnaireCount, meta: {title: '问卷统计', requireAuth: true}},
    {
        path: '/questionnaireAdd',
        name: 'questionnaireAdd',
        component: QuestionnaireAdd,
        meta: {title: '添加问卷', requireAuth: true}
    },
    {path: '/specialCheck', name: 'specialCheck', component: SpecialCheck, meta: {title: '专项检查', requireAuth: true}},
    {path: '/specialSchoolList', name: 'specialSchoolList', component: SpecialSchoolList, meta: {requireAuth: true}},
    {path: '/specialCheckDetail', name: 'specialCheckDetail', component: SpecialCheckDetail, meta: {requireAuth: true}},
    {
        path: '/specialCheckRecord',
        name: 'specialCheckRecord',
        component: SpecialCheckRecord,
        meta: {title: '流水记录', requireAuth: true}
    },
    {
        path: '/specialCreateTable',
        name: 'specialCreateTable',
        component: SpecialCreateTable,
        meta: {title: '生成表单', requireAuth: true}
    },
    {
        path: '/dangerUpload',
        name: 'dangerUpload',
        component: DangerUpload,
        meta: {title: '上报隐患', requireAuth: true}
    },
    {
        path: '/imageVideoPreview',
        name: 'imageVideoPreview',
        component: ImageVideoPreview,
        meta: {title: '预览'}
    },
    {
        path: '/socialSupervision',
        name: 'socialSupervision',
        component: SocialSupervision,
        meta: {title: '社会督查', requireAuth: true, keepAlive: true, isBack: false}
    },
    {
        path: '/supervisionDetail',
        name: 'supervisionDetail',
        component: SupervisionDetail,
        meta: {title: '社会督查', requireAuth: true}
    },
    {
        path: '/dangerManagerList',
        name: 'dangerManagerList',
        component: DangerManagerList,
        meta: {title: '事故管理', requireAuth: true, isBack: false}
    },
    {path: '/dangerManagerDetail', name: 'dangerManagerDetail', component: DangerManagerDetail, meta: {title: '事故详情', requireAuth: true}},
    {path: '/dangerManagerUpload', name: 'dangerManagerUpload', component: DangerManagerUpload, meta: {title: '事故上报', requireAuth: true}},
    {path: '/taskPublish', name: 'taskPublish', component: TaskPublish, meta: {title: '工作任务', requireAuth: true}},
    {
        path: '/taskPublishRelease',
        name: 'taskPublishRelease',
        component: TaskPublishRelease,
        meta: {title: '发布任务', requireAuth: true}
    },
    {
        path: '/taskPublishReleaseNext',
        name: 'taskPublishReleaseNext',
        component: TaskPublishReleaseNext,
        meta: {title: '发布任务', requireAuth: true}
    },
    {
        path: '/taskReviewComplete',
        name: 'taskReviewComplete',
        component: TaskReviewComplete,
        meta: {title: '完成情况', requireAuth: true}
    },
    {path: '/taskNewBuild', name: 'taskNewBuild', component: TaskNewBuild, meta: {title: '新建任务', requireAuth: true}},
    {
        path: '/taskSelectSchool',
        name: 'taskSelectSchool',
        component: TaskSelectSchool,
        meta: {title: '选择学校', requireAuth: true}
    },
    {path: '/taskWrite', name: 'taskWrite', component: TaskWrite, meta: {title: '任务详情', requireAuth: true, keepAlive: true, isBack: false}},
    {path: '/taskNotice', name: 'taskNotice', component: TaskNotice, meta: {title: '任务详情', requireAuth: true}},

    {path: '/notice', name: 'notice', component: Notice, meta: {title: '通知公告', requireAuth: true}},
    {path: '/noticeDetail', name: 'noticeDetail', component: NoticeDetail, meta: {title: '通知公告', requireAuth: true}},
    {path: '/noticeReviewComplete', name: 'noticeReviewComplete', component: NoticeReviewComplete, meta: {title: '通知公告查看情况', requireAuth: true}},
    {path: '/noticeSelectPeople', name: 'noticeSelectPeople', component: NoticeSelectPeople, meta: {title: '选择人员', requireAuth: true}},
    {path: '/noticeSelectEduPeople', name: 'noticeSelectEduPeople', component: NoticeSelectEduPeople, meta: {title: '选择人员', requireAuth: true}},
    {path: '/noticeSelectAccount', name: 'noticeSelectAccount', component: NoticeSelectAccount, meta: {title: '选择人员', requireAuth: true}},
    {path: '/noticeWrite', name: 'noticeWrite', component: NoticeWrite, meta: {title: '通知公告', requireAuth: true}},

    {path: '/performance', name: 'performance', component: Performance, meta: {title: '绩效考评', requireAuth: true}},
    {
        path: '/performanceRule',
        name: 'performanceRule',
        component: PerformanceRule,
        meta: {title: '评分规则', requireAuth: true}
    },
    {
        path: '/performanceDetail',
        name: 'performanceDetail',
        component: PerformanceDetail,
        meta: {title: '考评详情', requireAuth: true}
    },
    {
        path: '/performanceScoreRecord',
        name: 'performanceScoreRecord',
        component: PerformanceScoreRecord,
        meta: {title: '加/减分记录', requireAuth: true}
    },
    {
        path: '/performanceScoreSet',
        name: 'performanceScoreSet',
        component: PerformanceScoreSet,
        meta: {title: '加/减分设置', requireAuth: true}
    },
    {
        path: '/performanceSchoolRank',
        name: 'performanceSchoolRank',
        component: PerformanceSchoolRank,
        meta: {title: '学校排行', requireAuth: true}
    },
    {
        path: '/meetingSigning',
        name: 'meetingSigning',
        component: MeetingSigning,
        meta: {title: '会议签到'}
    },
    {
        path: '/meetingSchoolList',
        name: 'meetingSchoolList',
        component: MeetingSchoolList,
        meta: {title: '会议签到'}
    },
    {path: '/meetingDetail', name: 'meetingDetail', component: MeetingDetail, meta: {title: '会议详情'}},
    {path: '/meetingList', name: 'meetingList', component: MeetingList, meta: {title: '安全会议', requireAuth: true}},
    {path: '/meetingCount', name: 'meetingCount', component: MeetingCount, meta: {title: '会议统计', requireAuth: true}},
    {
        path: '/safeKnowledge',
        name: 'safeKnowledge',
        component: SafeKnowledge,
        meta: {title: '安全知识库', requireAuth: true}
    },
    {path: '/todoList', name: 'todoList', component: TodoList, meta: {title: '待办事项', requireAuth: true}},
    {path: '/monitorList', name: 'monitorList', component: MonitorList, meta: {title: '视频监控', requireAuth: true}},
    {path: '/monitorPlayer', name: 'monitorPlayer', component: MonitorPlayer, meta: {title: '视频监控', requireAuth: true}},
    {path: '/monitorSchoolList', name: 'monitorSchoolList', component: MonitorSchoolList, meta: {title: '视频监控', requireAuth: true}},
    {path: '/everydayCheck', name: 'everydayCheck', component: EverydayCheck, meta: {title: '日常巡查', requireAuth: true}},
    {path: '/everydaySchoolList', name: 'everydaySchoolList', component: EverydaySchoolList, meta: {title: '日常巡查', requireAuth: true}},
    {path: '/everydayCheckDetail', name: 'everydayCheckDetail', component: EverydayCheckDetail, meta: {requireAuth: true}},
    {path: '/schoolEverydayCheck', name: 'schoolEverydayCheck', component: SchoolEverydayCheck, meta: {title: '日常巡查', requireAuth: true}},
    {path: '/schoolCheckDetail', name: 'schoolCheckDetail', component: SchoolCheckDetail, meta: {title: '巡查详情', requireAuth: true}},
    {path: '/schoolCheckRecord', name: 'schoolCheckRecord', component: SchoolCheckRecord, meta: {requireAuth: true}},
    {path: '/schoolCheckRecordDetail', name: 'schoolCheckRecordDetail', component: SchoolCheckRecordDetail, meta: {title: '巡查记录详情', requireAuth: true}},
    {path: '/schoolRecordCount', name: 'schoolRecordCount', component: SchoolRecordCount, meta: {title: '记录统计', requireAuth: true}},
    {path: '/schoolCheckRepairRecord', name: 'schoolCheckRepairRecord', component: SchoolCheckRepairRecord, meta: {title: '巡查补卡记录', requireAuth: true}},
    {path: '/addressList', name: 'addressList', component: AddressList, meta: {title: '组织架构', requireAuth: true}},
    {path: '/userInfo', name: 'userInfo', component: UserInfo, meta: {title: '详细信息', requireAuth: true}},
    {path: '/myInformation', name: 'myInformation', component: MyInformation, meta: {title: '我的资料', requireAuth: true}},
    {path: '/feedBack', name: 'feedBack', component: FeedBack, meta: {title: '反馈意见'}},
    {path: '/about', name: 'about', component: About, meta: {title: '关于校鸽'}},
    {path: '/business', name: 'business', component: Business, meta: {title: '商务合作'}},
]