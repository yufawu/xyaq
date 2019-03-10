/**
 * @Description:    专项检查模块
 * @Author:         TSY
 * @CreateDate:     2018/6/27 11:52
 */
import * as types from '../../constant/types'

const state = {
    checkSchoolItem: JSON.parse(sessionStorage.getItem(types.SET_CHECK_SCHOOL_ITEM)) || {},//当前任务学校信息
    checkTaskItem: JSON.parse(sessionStorage.getItem(types.SET_CHECK_TASK_ITEM)) || {},//当前任务信息
    checkRecordData: JSON.parse(sessionStorage.getItem(types.SET_CHECK_SCHOOL_RECORD)) || {},//当前任务流水记录
    taskRecordID: JSON.parse(sessionStorage.getItem(types.SET_CHECK_SCHOOL_RECORD_ID)) || '',//当前任务记录ID
}

const getters = {
    checkSchoolItem: state => state.checkSchoolItem,
    checkTaskItem: state => state.checkTaskItem,
    checkRecordData: state => state.checkRecordData,
    taskRecordID: state => state.taskRecordID,
}

const mutations = {
    [types.SET_CHECK_SCHOOL_ITEM]: (state, data) => {//保存当前任务学校信息
        state.checkSchoolItem = data;
    },
    [types.SET_CHECK_TASK_ITEM]: (state, data) => {//保存当前任务信息
        state.checkTaskItem = data;
    },
    [types.SET_CHECK_SCHOOL_RECORD]: (state, data) => {//保存当前任务流水记录
        state.checkRecordData = data;
    },
    [types.SET_CHECK_SCHOOL_RECORD_ID]: (state, data) => {//保存当前任务记录ID
        state.taskRecordID = data;
    },
}

const actions = {
    [types.SET_CHECK_SCHOOL_ITEM]({commit},data){
        for (let k in data) { //避免存入undefined，导致获取数据时转JSON程序报错
            data[k] = data[k] || '';
        }
        sessionStorage.setItem(types.SET_CHECK_SCHOOL_ITEM, JSON.stringify(data));
        commit(types.SET_CHECK_SCHOOL_ITEM,data);
    },
    [types.SET_CHECK_TASK_ITEM]({commit},data){
        for (let k in data) { //避免存入undefined，导致获取数据时转JSON程序报错
            data[k] = data[k] || '';
        }
        sessionStorage.setItem(types.SET_CHECK_TASK_ITEM, JSON.stringify(data));
        commit(types.SET_CHECK_TASK_ITEM,data);
    },
    [types.SET_CHECK_SCHOOL_RECORD]({commit},data){
        for (let k in data) { //避免存入undefined，导致获取数据时转JSON程序报错
            data[k] = data[k] || '';
        }
        sessionStorage.setItem(types.SET_CHECK_SCHOOL_RECORD, JSON.stringify(data));
        commit(types.SET_CHECK_SCHOOL_RECORD,data);
    },
    [types.SET_CHECK_SCHOOL_RECORD_ID]({commit},data){
        data = data || '';
        sessionStorage.setItem(types.SET_CHECK_SCHOOL_RECORD_ID, JSON.stringify(data));
        commit(types.SET_CHECK_SCHOOL_RECORD_ID,data);
    },
}

export default {
    state,
    getters,
    mutations,
    actions
}