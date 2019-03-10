/**
 * @Description:    安全会议
 * @Author:         TSY
 * @CreateDate:     2018/8/22 16:31
 */

import * as types from "../../constant/types"

const state = {
    safeMeetingSchoolItem: JSON.parse(sessionStorage.getItem(types.SET_SAFE_MEETING_SCHOOL)) || {},//当前选择的学校信息
    safeMeetingID: JSON.parse(sessionStorage.getItem(types.SET_SAFE_MEETING_ID)) || ''//当前会议ID
}

const getters = {
    safeMeetingSchoolItem: state => state.safeMeetingSchoolItem,
    safeMeetingID: state => state.safeMeetingID,
}

const mutations = {
    [types.SET_SAFE_MEETING_SCHOOL]: (state, data) => {
        state.safeMeetingSchoolItem = data; //保存当前选择的学校信息
    },
    [types.SET_SAFE_MEETING_ID]: (state, data) => {
        state.safeMeetingID = data;
    },
}

const actions = {
    [types.SET_SAFE_MEETING_SCHOOL]({commit}, data) {
        for (let k in data) { //避免存入undefined，导致获取数据时转JSON程序报错
            data[k] = data[k] || '';
        }
        sessionStorage.setItem(types.SET_SAFE_MEETING_SCHOOL, JSON.stringify(data));
        commit(types.SET_SAFE_MEETING_SCHOOL, data);
    },
    [types.SET_SAFE_MEETING_ID]({commit}, data) {
        data = data || '';//避免存入undefined，导致获取数据时转JSON程序报错
        sessionStorage.setItem(types.SET_SAFE_MEETING_ID, JSON.stringify(data));
        commit(types.SET_SAFE_MEETING_ID, data);
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}