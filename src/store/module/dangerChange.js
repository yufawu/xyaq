/**
 * @Description:    隐患整改
 * @Author:         TSY
 * @CreateDate:     2018/7/2 16:13
 */
import * as types from '../../constant/types'

const state = {
    dangerID: JSON.parse(sessionStorage.getItem(types.SET_DANGER_ID)) || '',//当前隐患ID
}

const getters = {
    dangerID: state => state.dangerID
}

const mutations = {
    [types.SET_DANGER_ID]: (state, data) => {
        state.dangerID = data;
    }
}

const actions = {
    [types.SET_DANGER_ID]({commit}, data){
        data = data || '';
        sessionStorage.setItem(types.SET_DANGER_ID,JSON.stringify(data));
        commit(types.SET_DANGER_ID,data);
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}