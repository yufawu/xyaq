/**
 * @Description:
 * @Author:         TSY
 * @CreateDate:     2018/6/9 13:28
 */

import Vue from 'vue'
import Vuex from 'vuex'

import login from './module/login'
import specialCheck from './module/specialCheck'
import dangerChange from './module/dangerChange'
import socialSupervision from './module/socialSupervision'
import dangerManager from './module/dangerManager'
import safeMeeting from './module/safeMeeting'
import performance from './module/performance'
import taskPublish from './module/taskPublish'
import safeKnowledge from './module/safeKnowledge'
import notice from './module/notice'
import everydayCheck from './module/everydayCheck'
import monitor from './module/monitor'

Vue.use(Vuex)//全局配置Vuex

export const store = new Vuex.Store({
    modules: {
        login,
        specialCheck,
        dangerChange,
        socialSupervision,
        dangerManager,
        safeMeeting,
        performance,
        taskPublish,
        safeKnowledge,
        notice,
        everydayCheck,
        monitor,
    },
    state: {
        answersData: JSON.parse(sessionStorage.getItem('answersData')) || [],//所有问卷的答案
    },
    mutations: {
        saveAnswerData(state, data) {
            state.answersData = data;
            sessionStorage.setItem('answersData', JSON.stringify(data));
        }
    }
})