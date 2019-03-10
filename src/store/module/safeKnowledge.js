/**
 * @Description:    安全知识库数据缓存
 * @Author:         TSY
 * @CreateDate:     2018/9/4 13:54
 */

import * as types from "../../constant/types"

const state = {
    homeSafeKnowledge: JSON.parse(sessionStorage.getItem(types.SAVE_HOME_SAFE_KNOWLEDGE)) || []//首页安全知识库数据缓存
}

const getters = {
    homeSafeKnowledge: state => state.homeSafeKnowledge
}

const mutations = {
    [types.SAVE_HOME_SAFE_KNOWLEDGE](state, data) {
        state.homeSafeKnowledge = data;
    }
}

const actions = {
    [types.SAVE_HOME_SAFE_KNOWLEDGE]({commit}, data) {
        data = data || [];
        sessionStorage.setItem(types.SAVE_HOME_SAFE_KNOWLEDGE, JSON.stringify(data));
        commit(types.SAVE_HOME_SAFE_KNOWLEDGE, data);
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}