/**
 * @Description:    登录用户信息模块
 * @Author:         TSY
 * @CreateDate:     2018/6/18 13:28
 */
import * as types from '../../constant/types'

const state = {
    isLogin: localStorage.getItem('isLogin') == 'true' ? true : false,//是否为登录状态
    userInfo: JSON.parse(localStorage.getItem(types.SET_USER_INFO)) || {'headImg': require('../../assets/mine/head_default.png'),'job': '******'},//用户信息
}

const getters = {
    // 获取属性的状态
    userInfo: state => state.userInfo,
    isLogin: state => state.isLogin
}

const mutations = {
    [types.SET_USER_INFO](state, data) {//保存用户信息
        if (data.userName) {
            state.userInfo = data;
            state.isLogin = true;
            localStorage.setItem(types.SET_USER_INFO, JSON.stringify(data));
            localStorage.setItem('isLogin', true);
        } else {
            state.userInfo = '{}';
            state.isLogin = false;
            localStorage.setItem(types.SET_USER_INFO, "{}");
            localStorage.setItem('isLogin', false);
        }
    }
}

const actions = {
    [types.SET_USER_INFO]({commit}, user) {
        for (let k in user) { //避免存入undefined，导致获取数据时转JSON程序报错
            user[k] = user[k] || '';
        }
        commit(types.SET_USER_INFO, user);
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}