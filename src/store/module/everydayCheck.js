/**
 * @Description:    日常检查模块（安全巡查）
 * @Author:          TSY
 * @CreateDate:     2018/6/27 11:52
 */
import * as types from '../../constant/types'

const state = {
    everydaySchoolList: JSON.parse(sessionStorage.getItem(types.SAVE_EVERYDAY_SCHOOL_LIST)) || [],//当前任务学校信息
    everydaySchoolItem: JSON.parse(sessionStorage.getItem(types.SAVE_EVERYDAY_SCHOOL_ITEM)) || {},//当前任务信息
    safeCheckDate: JSON.parse(sessionStorage.getItem(types.SAVE_EVERYDAY_CHECK_DATE)) || {},//用于查询巡查记录的时间
    everydayCheckRecord: JSON.parse(sessionStorage.getItem(types.SAVE_EVERYDAY_CHECK_RECORD)) || {},//当前巡查记录
    everydayCheckRecordItem: JSON.parse(sessionStorage.getItem(types.SAVE_EVERYDAY_CHECK_RECORD_ITEM)) || {},//当前巡查记录
}

const getters = {
    everydaySchoolList: state => state.everydaySchoolList,
    safeCheckDate: state => state.safeCheckDate,
    everydayCheckRecord: state => state.everydayCheckRecord,
    everydayCheckRecordItem: state => state.everydayCheckRecordItem,
    everydaySchoolItem: state => state.everydaySchoolItem
}

const mutations = {
    [types.SAVE_EVERYDAY_SCHOOL_LIST]: (state, data) => {//保存当前任务学校信息
        state.everydaySchoolList = data;
    },
    [types.SAVE_EVERYDAY_CHECK_DATE]: (state, data) => {//查询巡查记录的的时间
        state.safeCheckDate = data;
    },
    [types.SAVE_EVERYDAY_CHECK_RECORD]: (state, data) => {//当前巡查记录
        state.everydayCheckRecord = data;
    },
    [types.SAVE_EVERYDAY_CHECK_RECORD_ITEM]: (state, data) => {//当前巡查记录
        state.everydayCheckRecordItem = data;
    },
    [types.SAVE_EVERYDAY_SCHOOL_ITEM]: (state, data) => {//保存当前任务信息
        state.everydaySchoolItem = data;
    }
}

const actions = {
    [types.SAVE_EVERYDAY_SCHOOL_LIST]({commit},data){
        data = data || [];
        sessionStorage.setItem(types.SAVE_EVERYDAY_SCHOOL_LIST, JSON.stringify(data));
        commit(types.SAVE_EVERYDAY_SCHOOL_LIST,data);
    },
    [types.SAVE_EVERYDAY_CHECK_DATE]({commit},data){
        for (let k in data) { //避免存入undefined，导致获取数据时转JSON程序报错
            data[k] = data[k] || '';
        }
        sessionStorage.setItem(types.SAVE_EVERYDAY_CHECK_DATE, JSON.stringify(data));
        commit(types.SAVE_EVERYDAY_CHECK_DATE,data);
    },
    [types.SAVE_EVERYDAY_CHECK_RECORD]({commit},data){
        for (let k in data) { //避免存入undefined，导致获取数据时转JSON程序报错
            data[k] = data[k] || '';
        }
        sessionStorage.setItem(types.SAVE_EVERYDAY_CHECK_RECORD, JSON.stringify(data));
        commit(types.SAVE_EVERYDAY_CHECK_RECORD,data);
    },
    [types.SAVE_EVERYDAY_CHECK_RECORD_ITEM]({commit},data){
        for (let k in data) { //避免存入undefined，导致获取数据时转JSON程序报错
            data[k] = data[k] || '';
        }
        sessionStorage.setItem(types.SAVE_EVERYDAY_CHECK_RECORD_ITEM, JSON.stringify(data));
        commit(types.SAVE_EVERYDAY_CHECK_RECORD_ITEM,data);
    },
    [types.SAVE_EVERYDAY_SCHOOL_ITEM]({commit},data){
        for (let k in data) { //避免存入undefined，导致获取数据时转JSON程序报错
            data[k] = data[k] || '';
        }
        sessionStorage.setItem(types.SAVE_EVERYDAY_SCHOOL_ITEM, JSON.stringify(data));
        commit(types.SAVE_EVERYDAY_SCHOOL_ITEM,data);
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}