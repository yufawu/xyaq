/**
 * @Description:
 * @Author:         yufawu
 * @CreateDate:     2018/10/10 8:11
 */
import * as types from "../../constant/types"

const state = {
    monitorSchoolItem: JSON.parse(sessionStorage.getItem(types.SAVE_MONITOR_SCHOOL)) || {},//当前选择的学校信息
    monitorItem: JSON.parse(sessionStorage.getItem(types.SAVE_MONITOR_ITEM)) || {},//当前选择的监控信息
}

const getters = {
    monitorSchoolItem: state => state.monitorSchoolItem,
    monitorItem: state => state.monitorItem,
}

const mutations = {
    [types.SAVE_MONITOR_SCHOOL]: (state, data) => {
        state.monitorSchoolItem = data; //保存当前选择的学校信息
    },
    [types.SAVE_MONITOR_ITEM]: (state, data) => {
        state.monitorItem = data; //保存当前选择的学校信息
    },
}

const actions = {
    [types.SAVE_MONITOR_SCHOOL]({commit}, data) {
        for (let k in data) { //避免存入undefined，导致获取数据时转JSON程序报错
            data[k] = data[k] || '';
        }
        sessionStorage.setItem(types.SAVE_MONITOR_SCHOOL, JSON.stringify(data));
        commit(types.SAVE_MONITOR_SCHOOL, data);
    },
    [types.SAVE_MONITOR_ITEM]({commit}, data) {
        for (let k in data) { //避免存入undefined，导致获取数据时转JSON程序报错
            data[k] = data[k] || '';
        }
        sessionStorage.setItem(types.SAVE_MONITOR_ITEM, JSON.stringify(data));
        commit(types.SAVE_MONITOR_ITEM, data);
    },
}

export default {
    state,
    getters,
    mutations,
    actions
}