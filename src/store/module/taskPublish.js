import * as types from "../../constant/types";

/**
 * @Description:    任务下发模块
 * @Author:         yufawu
 * @CreateDate:     2018/8/29 11:21
 */

const state = {
    taskPublishListID: JSON.parse(sessionStorage.getItem(types.SET_TASK_PUBLISH_ID)) || '',//教育局工作任务列表
    taskPublishListTitle: JSON.parse(sessionStorage.getItem(types.SET_TASK_PUBLISH_TITLE)) || '',//教育局工作任务列表标题
    taskPublishSchoolList: JSON.parse(sessionStorage.getItem(types.SET_TASK_PUBLISH_SCHOOL_LIST)) || [],//教育局工作任务学校列表
    taskPublishJobList: JSON.parse(sessionStorage.getItem(types.SET_TASK_PUBLISH_JOB_LIST)) || [],//教育局工作选择的职务列表
    taskSchoolListID: JSON.parse(sessionStorage.getItem(types.SET_TASK_SCHOOL_ID)) || '',//学校工作任务列表ID
    taskSchoolListTitle: JSON.parse(sessionStorage.getItem(types.SET_TASK_SCHOOL_TITLE)) || '',//学校工作任务标题
    taskPublishCreateUser: JSON.parse(sessionStorage.getItem(types.SET_TASK_PUBLISH_CREATE_USER)) || '',//任务创建人
}

const getters = {
    taskPublishListID: state => state.taskPublishListID,
    taskPublishListTitle: state => state.taskPublishListTitle,
    taskPublishSchoolList: state => state.taskPublishSchoolList,
    taskPublishJobList: state => state.taskPublishJobList,
    taskSchoolListID: state => state.taskSchoolListID,
    taskSchoolListTitle: state => state.taskSchoolListTitle,
    taskPublishCreateUser: state => state.taskPublishCreateUser,
}

const mutations = {
    [types.SET_TASK_PUBLISH_ID]: (state, data) => {//保存当前任务学校信息--教育局
        state.taskPublishListID = data;
    },
    [types.SET_TASK_PUBLISH_TITLE]: (state, data) => {//保存当前任务标题--教育局
        state.taskPublishListTitle = data;
    },
    [types.SET_TASK_PUBLISH_SCHOOL_LIST]: (state, data) => {//保存当前选择的学校列表--教育局
        state.taskPublishSchoolList = data;
    },
    [types.SET_TASK_PUBLISH_JOB_LIST]: (state, data) => {//保存当前选择的职务列表--教育局
        state.taskPublishJobList = data;
    },
    [types.SET_TASK_SCHOOL_ID]: (state, data) => {//保存当前任务信息--学校
        state.taskSchoolListID = data;
    },
    [types.SET_TASK_SCHOOL_TITLE]: (state, data) => {//保存当前任务标题--学校
        state.taskSchoolListTitle = data;
    },
    [types.SET_TASK_PUBLISH_CREATE_USER]: (state, data) => {//保存任务创建人
        state.taskPublishCreateUser = data;
    }
}

const actions = {
    [types.SET_TASK_PUBLISH_ID]({commit},data){
        data = data || '';
        sessionStorage.setItem(types.SET_TASK_PUBLISH_ID, JSON.stringify(data));
        commit(types.SET_TASK_PUBLISH_ID,data);
    },
    [types.SET_TASK_PUBLISH_TITLE]({commit},data){
        data = data || '';
        sessionStorage.setItem(types.SET_TASK_PUBLISH_TITLE, JSON.stringify(data));
        commit(types.SET_TASK_PUBLISH_TITLE,data);
    },
    [types.SET_TASK_PUBLISH_SCHOOL_LIST]({commit},data){
        data = data || [];
        sessionStorage.setItem(types.SET_TASK_PUBLISH_SCHOOL_LIST, JSON.stringify(data));
        commit(types.SET_TASK_PUBLISH_SCHOOL_LIST,data);
    },
    [types.SET_TASK_PUBLISH_JOB_LIST]({commit},data){
        data = data || [];
        sessionStorage.setItem(types.SET_TASK_PUBLISH_JOB_LIST, JSON.stringify(data));
        commit(types.SET_TASK_PUBLISH_JOB_LIST,data);
    },
    [types.SET_TASK_SCHOOL_ID]({commit},data){
        data = data || '';
        sessionStorage.setItem(types.SET_TASK_SCHOOL_ID, JSON.stringify(data));
        commit(types.SET_TASK_SCHOOL_ID,data);
    },
    [types.SET_TASK_SCHOOL_TITLE]({commit},data){
        data = data || '';
        sessionStorage.setItem(types.SET_TASK_SCHOOL_TITLE, JSON.stringify(data));
        commit(types.SET_TASK_SCHOOL_TITLE,data);
    },
    [types.SET_TASK_PUBLISH_CREATE_USER]({commit},data){
        data = data || '';
        sessionStorage.setItem(types.SET_TASK_PUBLISH_CREATE_USER, JSON.stringify(data));
        commit(types.SET_TASK_PUBLISH_CREATE_USER,data);
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}