/**
 * @Description:    绩效考核
 * @Author:         TSY
 * @CreateDate:     2018/8/22 16:31
 */

import * as types from "../../constant/types"

const state = {
    performanceSchoolItem: JSON.parse(sessionStorage.getItem(types.SET_PERFORMANCE_SCHOOL)) || {}//当前选择的学校信息
}

const getters = {
    performanceSchoolItem: state => state.performanceSchoolItem
}

const mutations = {
    [types.SET_PERFORMANCE_SCHOOL](state, data) {
        state.performanceSchoolItem = data;
    }
}

const actions = {
    [types.SET_PERFORMANCE_SCHOOL]({commit}, data) {
        for (let k in data) { //避免存入undefined，导致获取数据时转JSON程序报错
            data[k] = data[k] || '';
        }
        sessionStorage.setItem(types.SET_PERFORMANCE_SCHOOL, JSON.stringify(data));
        commit(types.SET_PERFORMANCE_SCHOOL, data);
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}