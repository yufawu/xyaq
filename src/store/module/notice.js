/**
 * @Description:    通知公告
 * @Author:         yufawu
 * @CreateDate:     2018/9/7 9:10
 */
import * as types from "../../constant/types";

const state = {
    noticeSelectEduPeopleID: JSON.parse(sessionStorage.getItem(types.SAVE_NOTICE_SELECT_EDU_PEOPLE_IDS)) || [],//保存选择的教育局接收人ID
    noticeSelectSchoolPeopleID: JSON.parse(sessionStorage.getItem(types.SAVE_NOTICE_SELECT_SCHOOL_PEOPLE_IDS)) || [],//保存选择的学校接收人ID
    noticeSelectEduPeople: JSON.parse(sessionStorage.getItem(types.SAVE_NOTICE_SELECT_EDU_PEOPLE)) || [],//保存选择的教育局接收人信息
    noticeSelectSchoolPeople: JSON.parse(sessionStorage.getItem(types.SAVE_NOTICE_SELECT_SCHOOL_PEOPLE)) || [],//保存选择的学校接收人信息
    getNoticeID: JSON.parse(sessionStorage.getItem(types.SAVE_NOTICE_ID)) || '',//保存选择的通知公告ID
}

const getters = {
    noticeSelectEduPeopleID: state => state.noticeSelectEduPeopleID,
    noticeSelectSchoolPeopleID: state => state.noticeSelectSchoolPeopleID,
    noticeSelectEduPeople: state => state.noticeSelectEduPeople,
    noticeSelectSchoolPeople: state => state.noticeSelectSchoolPeople,
    getNoticeID: state => state.getNoticeID,
}

const mutations = {
    [types.SAVE_NOTICE_SELECT_EDU_PEOPLE_IDS]: (state, data) => {//保存选择的教育局接收人ID
        state.noticeSelectEduPeopleID = data;
    },
    [types.SAVE_NOTICE_SELECT_SCHOOL_PEOPLE_IDS]: (state, data) => {//保存选择的学校接收人ID
        state.noticeSelectSchoolPeopleID = data;
    },
    [types.SAVE_NOTICE_SELECT_EDU_PEOPLE]: (state, data) => {//保存选择的教育局接收人信息
        state.noticeSelectEduPeople = data;
    },
    [types.SAVE_NOTICE_SELECT_SCHOOL_PEOPLE]: (state, data) => {//保存选择的学校接收人信息
        state.noticeSelectSchoolPeople = data;
    },
    [types.SAVE_NOTICE_ID]: (state, data) => {//保存选择的通知公告ID
        state.getNoticeID = data;
    },
}

const actions = {
    [types.SAVE_NOTICE_SELECT_EDU_PEOPLE_IDS]({commit}, data) {
        data = data || [];
        data = [...new Set(data)];//数据去重
        sessionStorage.setItem(types.SAVE_NOTICE_SELECT_EDU_PEOPLE_IDS, JSON.stringify(data));
        commit(types.SAVE_NOTICE_SELECT_EDU_PEOPLE_IDS, data);
    },
    [types.SAVE_NOTICE_SELECT_SCHOOL_PEOPLE_IDS]({commit}, data) {
        data = data || [];
        data = [...new Set(data)];//数据去重
        sessionStorage.setItem(types.SAVE_NOTICE_SELECT_SCHOOL_PEOPLE_IDS, JSON.stringify(data));
        commit(types.SAVE_NOTICE_SELECT_SCHOOL_PEOPLE_IDS, data);
    },
    [types.SAVE_NOTICE_SELECT_EDU_PEOPLE]({commit}, data) {
        data = data || [];
        data = [...new Set(data)];//数据去重
        sessionStorage.setItem(types.SAVE_NOTICE_SELECT_EDU_PEOPLE, JSON.stringify(data));
        commit(types.SAVE_NOTICE_SELECT_EDU_PEOPLE, data);
    },
    [types.SAVE_NOTICE_SELECT_SCHOOL_PEOPLE]({commit}, data) {
        data = data || [];
        data = [...new Set(data)];//数据去重
        sessionStorage.setItem(types.SAVE_NOTICE_SELECT_SCHOOL_PEOPLE, JSON.stringify(data));
        commit(types.SAVE_NOTICE_SELECT_SCHOOL_PEOPLE, data);
    },
    [types.SAVE_NOTICE_ID]({commit}, data) {
        data = data || '';
        sessionStorage.setItem(types.SAVE_NOTICE_ID, JSON.stringify(data));
        commit(types.SAVE_NOTICE_ID, data);
    },
}
export default {
    state,
    getters,
    mutations,
    actions,
}