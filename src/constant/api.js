/**
 * @Description:    API接口列表
 * @Author:         TSY
 * @CreateDate:     2018/6/9 13:28
 */

//体验账号
// export const EXPERIENCE_ACCOUNT = process.env.NODE_ENV === 'production' ? '42100017644' : '23112112056';
export const EXPERIENCE_ACCOUNT = process.env.NODE_ENV === 'production' ? '23112112056' : '23112112056';

export const BASE_URL = process.env.NODE_ENV === 'production' ? '/' : 'http://testweb.paxy365.com/';
// export const BASE_URL = 'http://testweb.paxy365.com/';//测试testweb使用
// export const BASE_URL = 'https://login.paxy365.com/';//测试login使用

//选择服务器
export const CHOICE_SERVER = 'https://user.paxy365.com/index.php/api/user/commonLogin.html';
//登陆验证
export const CHECK_LOGIN = 'api/user/schoolLogin.html';
//一个手机号多用户，选择登录
export const CHOICE_PHONE_LOGIN = 'api/user/chooseIphone.html';


//获取问卷列表
export const GET_QUESTIONNAIRE_LIST = 'api/question/index.html';
//查看问卷详情
export const GET_QUESTIONNAIRE_DETAIL = 'api/Question/viewinfo.html';
//问卷统计
export const GET_QUESTIONNAIRE_COUNT = 'api/Question/countinfo.html';
//获取问卷报送状态
export const GET_QUESTIONNAIRE_SUBMIT_STATUS = 'api/question/submit_status.html';
//上传文件
// export const UPLOAD_FILES = 'api/File/upload.html';
export const UPLOAD_FILES = 'api/File/wap_upload.html';
//提交问卷
export const PUSH_QUESTIONNAIRE = 'api/Question/school_editinfo.html';


//获取专项检查任务列表
export const GET_SPECIAL_CHECK_TASK_LIST = 'Api/SafetySupervision/task_list.html';
//获取街道列表
export const GET_SPECIAL_CHECK_STREET_LIST = 'api/Street/index.html';
//获取专项检查学校列表
export const GET_SPECIAL_CHECK_SCHOOL_LIST = 'Api/SafetySupervision/get_school_list.html';
//获取专项检查任务详情
export const GET_SPECIAL_CHECK_SCHOOL_DETAIL = 'Api/SafetySupervision/get_detail.html';
//专项检查生成表单
export const GET_SPECIAL_CHECK_CREATE_TABLE = 'Api/SafetySupervision/create_table.html';
//专项检查任务提交
export const SPECIAL_CHECK_SUBMIT = 'Api/SafetySupervision/save_check.html';
//专项检查任务审核
export const SPECIAL_TASK_CHECK = 'Api/SafetySupervision/audit_task.html';


//隐患整改---base64图片上传
export const UPLOAD_DANGER_IMG = 'api/file/danger_web_upload.html';
//隐患上报
export const UPLOAD_DANGER = 'api/dangerwap/wapcreatedanger.html';
//获取隐患处理人列表
export const GET_DANGER_PERSON_LIST = 'Api/Danger/checkteam.html';
//隐患上报---上传视频
export const UPLOAD_VIDEO = 'api/uploadfile/upload.html';
//获取隐患列表---教育局
export const GET_DANGER_LIST = 'api/dangerwap/edu_getlist.html';
//获取隐患列表---新上报
export const GET_SCHOOL_DANGER_REPORT_LIST = 'api/dangerv2/reportList.html';
//获取隐患列表---未处理
export const GET_SCHOOL_DANGER_UNDO_LIST = 'api/dangerv2/undoList.html';
//获取隐患列表---已处理
export const GET_SCHOOL_DANGER_DONE_LIST = 'api/dangerv2/doneList.html';
//获取隐患列表---已验收
export const GET_SCHOOL_DANGER_ACCEPT_LIST = 'api/dangerv2/acceptList.html';
//获取隐患整改通知书
export const GET_DANGER_CHANGE_NOTICE = 'api/Dangerreform/get_reformdata.html';
//提醒处理隐患
export const DANGER_REMIND = 'api/danger/reminddanger.html';
//获取隐患详情
export const GET_DANGER_DETAIL = 'api/danger/detail.html';
//处理隐患
export const DANGER_DISPOSE = 'api/danger/changeordo.html';
//指派隐患
export const DANGER_ASSIGN = 'api/danger/sendsave.html';
//验收隐患
export const DANGER_CHECK = 'api/danger/changeaccept.html';
//撤销隐患
export const DANGER_CANCEL = 'api/dangerv2/cancel.html';


//获取社会督查列表（随手拍）
export const GET_SOCIAL_SUPERVISION_LIST = 'api/pat/index.html';
//获取社会督查未分派和已分派的数量（随手拍）
export const GET_SOCIAL_SUPERVISION_NUMBER = 'api/pat/getnum.html';
//社会督查任务派发
export const SOCIAL_SUPERVISION_DISPATCH = 'api/pat/point.html';


//获取事故管理中事故列表
export const GET_DANGER_MANAGER_LIST = 'api/safeaccident/index.html';
//获取事故管理中事故详情
export const GET_DANGER_MANAGER_DETAIL = 'Api/safeaccident/accident_info.html';
//事故管理--事故上报
export const UPLOAD_DANGER_MANAGER = 'Api/safeaccident/addinfo.html';
//事故管理--教育局批示/学校续报
export const DANGER_MANAGER_APPROVE = 'api/safeaccident/common.html';
//事故管理--学校结案
export const DANGER_MANAGER_REPORT = 'api/Safeaccident/settle_a_case.html';


//安全知识库---获取一级分类
export const GET_KNOWLEDGE_TYPE = 'api/kbm/index.html';
//安全知识库---获取二级分类
export const GET_KNOWLEDGE_SECOND_TYPE = 'api/kbm/getCategoryList.html';
//安全知识库---获取列表
export const GET_KNOWLEDGE_LIST = 'api/kbm/getKbmList.html';


//教育局--获取任务下发中任务列表
export const GET_TASK_PUBLISH_LIST = 'api/edutask/index.html';
//教育局任务下发--获取学校列表
export const EDU_TASK_SCHOOL_LIST = 'api/edutask/edu_getallschool.html';
//教育局任务下发--任务详情
export const EDU_TASK_DETAIL = 'api/edutask/detail.html';
//教育局任务下发--任务发布提交
export const EDU_TASK_RELEASEINFO = 'api/edutask/releaseinfo.html';
//教育局任务下发--任务完成情况
export const EDU_TASK_VIEWSUMMARY = 'api/edutask/viewsummary.html';
//教育局任务下发--获取职务
export const EDU_TASK_DUTY = 'api/edutask/get_duties.html';
//学校任务下发--任务列表
export const SCHOOL_TASK_LIST = 'api/Schooltask/index.html';
//学校任务下发--任务详情
export const SCHOOL_TASK_VIEWINFO = 'api/Schooltask/viewinfo.html';
//学校任务下发--任务提交、补交
export const SCHOOL_TASK_SUBMITINFO= 'api/Schooltask/submitinfo.html';
//学校工作任务填报、修改
export const SCHOOL_TASK_SAVEINFO = 'api/Schooltask/saveinfo.html';
//学校工作任务附件上传
export const SCHOOL_TASK_FILE_UPLOAD = 'api/file/task_upload.html';


//绩效考核
export const PERFORMANCE_INDEX = 'api/Assessment/index.html';
//获取考评详情
export const GET_PERFORMANCE_DETAIL = 'api/Assessment/view_detail.html';
//获取/筛选学校列表
export const GET_PERFORMANCE_SCHOOL_LIST = 'api/Assessment/view_schoollist.html';
//获取评分规则
export const GET_PERFORMANCE_RULE = 'api/Assessment/edu_kpi_rule.html';
//设置学校评分---获取评分项
export const GET_PERFORMANCE_SCORE_ITEM = 'api/Assessment/get_shcool_item.html';
//设置学校评分---提交设置的评分项
export const SUBMIT_PERFORMANCE_SCORE_ITEM = 'api/Assessment/update_score.html';
//设置学校评分---提交设置的评分项
export const GET_PERFORMANCE_SCORE_RECORD = 'api/Assessment/reocrd_flow.html';


//获取待办事项
export const GET_TODO_LIST = 'Api/Appmodule/getList.html';


//获取安全会议列表
export const GET_MEETING_LIST = 'api/BureauofEducationMeeting/index.html';
//获取安全会议签到统计
export const GET_MEETING_SINGING_COUNT = 'api/BureauofEducationMeeting/signIn.html';
//获取安全会议详情(访问这个接口不用登录，所以特别注意baseURL)
export const GET_MEETING_DETAIL = 'api/BureauofEducationMeeting/meetingDetials.html';
//获取安全会议所有学校和街道列表
export const GET_MEETING_STREET_SCHOOL = 'api/BureauofEducationMeeting/getAllStreet.html';
//学校会议签到
export const SCHOOL_SAFE_MEETING_SINGING = 'api/Meeting/readqrcode.html';
//微信扫码---会议签到
export const SAFE_MEETING_SINGING = 'api/BureauofEducationMeeting/readqrcode.html';
//安全会议签到---微信扫码获取参数
export const SAFE_MEETING_SCAN_SINGING = 'api/BureauofEducationMeeting/getSignPackage.html';
//安全会议签到---小程序扫码获取参数
export const SAFE_MEETING_MINI_SCAN_SINGING = 'api/BureauofEducationMeeting/getSmallProgramSignPackage.html';


//获取通知公告列表
export const GET_NOTICE_LIST = 'Api/Notice/list_notice_wap.html';
//发送通知公告
export const SEND_NOTICE = 'Api/Notice/addinfo.html';
//通知公告--选择收件人（学校列表）
export const GET_NOTICE_RECEIVER = 'Api/enterprise/get_edu_member.html';
//通知公告--获取部门人员列表
export const GET_NOTICE_DEPARTMENT_LIST = 'Api/enterprise/get_dept_list.html';
//通知公告--获取下属教育局列表
export const GET_NOTICE_EDU_LIST = 'Api/enterprise/get_edu_list.html';
//获取通知公告查看状态
export const GET_NOTICE_VIEW_STATE = 'Api/Notice/view_user_wap.html';


//获取视频监控列表
export const GET_VIDEO_MONITOR ='api/safevideo/get_video_list.html';
//获取视频监控街道学校列表
export const GET_VIDEO_SCHOOL_LIST ='api/safevideo/get_school_list.html';


//安全巡查首页(日常巡查)
export const GET_SAFE_CHECK_INDEX ='Api/inspectionew/index.html';
//安全巡查-记录（0待巡查，1已巡查，2未巡查）
export const GET_SAFE_CHECK_RECORD ='Api/inspectionew/inspectionflow.html';
//安全巡查-记录详情
export const GET_SAFE_CHECK_DETAIL ='Api/Inspection/detail.html';
//安全巡查-记录详情-补卡
export const SAFE_CHECK_REPAIR ='Api/Patrol/resubmit.html';
//安全巡查-获取扫描二维码的巡查数据
export const GET_SAFE_CHECK_CODE_DATA ='Api/Inspection/readqrcode.html';
//安全巡查-提交
export const COMMIT_SAFE_CHECK ='Api/Inspection/saveinfo.html';
//安全巡查-个人统计
export const GET_SAFE_CHECK_COUNT ='Api/patrol/personStat.html';
//安全巡查-补卡记录
export const GET_SAFE_CHECK_REPAIR_RECORD ='Api/patrol/resubmitList.html';


//商务合作-提交信息
export const COMMIT_BUSINESS_INFO ='';