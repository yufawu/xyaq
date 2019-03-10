/**
 * @Description:    社会督查
 * @Author:         TSY
 * @CreateDate:     2018/8/6 17:45
 */

import * as types from "../../constant/types"

const state = {
    supervisionItem: JSON.parse(sessionStorage.getItem(types.SET_SUPERVISION_ITEM)) || {},//当前点击的社会督查信息
    supervisionBack: JSON.parse(sessionStorage.getItem(types.SET_SUPERVISION_BACK)) || false//是否通过路由从详情页返回   为true则刷新数据
}

const getters = {
    supervisionItem: state => state.supervisionItem,
    supervisionBack: state => state.supervisionBack,
}

const mutations = {
    [types.SET_SUPERVISION_ITEM]: (state, data) => {
        state.supervisionItem = data; //保存当前点击的社会督查信息
    },
    [types.SET_SUPERVISION_BACK]: (state, data) => {
        state.supervisionBack = data;
    }
}

const actions = {
    [types.SET_SUPERVISION_ITEM]({commit}, data) {
        for (let k in data) { //避免存入undefined，导致获取数据时转JSON程序报错
            data[k] = data[k] || '';
        }
        sessionStorage.setItem(types.SET_SUPERVISION_ITEM, JSON.stringify(data));
        commit(types.SET_SUPERVISION_ITEM, data);
    },
    [types.SET_SUPERVISION_BACK]({commit}, data) {
        data = data || false;
        sessionStorage.setItem(types.SET_SUPERVISION_BACK, JSON.stringify(data));
        commit(types.SET_SUPERVISION_BACK, data);
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}