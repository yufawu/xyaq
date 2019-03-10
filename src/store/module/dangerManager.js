/**
 * @Description:    事故管理
 * @Author:         TSY
 * @CreateDate:     2018/8/6 17:45
 */

import * as types from "../../constant/types"

const state = {
    dangerManagerItem: JSON.parse(sessionStorage.getItem(types.SET_DANGER_MANAGER_ITEM)) || {}//当前点击的事故信息
}

const getters = {
    dangerManagerItem: state => state.dangerManagerItem
}

const mutations = {
    [types.SET_DANGER_MANAGER_ITEM]: (state, data) => {
        state.dangerManagerItem = data; //保存当前点击的事故信息
    }
}

const actions = {
    [types.SET_DANGER_MANAGER_ITEM]({commit}, data) {
        for (let k in data) { //避免存入undefined，导致获取数据时转JSON程序报错
            data[k] = data[k] || '';
        }
        sessionStorage.setItem(types.SET_DANGER_MANAGER_ITEM, JSON.stringify(data));
        commit(types.SET_DANGER_MANAGER_ITEM, data);
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}