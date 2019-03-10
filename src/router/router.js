/**
 * @Description:    路由拦截器（导航守卫）
 * @Author:         TSY
 * @CreateDate:     2018/6/9 13:28
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes } from "./routes"
import { store } from "../store/store"
import { MessageBox } from 'mint-ui'

Vue.use(VueRouter)

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(r => r.meta.requireAuth)) { //判断该页面是否需要登录后才能进入
        if ((store.getters.isLogin && store.getters.userInfo.job != '******') || to.query.account_id) {
            next();
        } else {
            MessageBox.confirm('请登录您的账号！', '温馨提示').then(action => {
                if (action == 'confirm') {
                    next({
                        path: '/login',
                        query: {redirect: to.fullPath}
                    })
                }
            }).catch(e => {
                console.log(e)
            });
        }
    } else {
        next();
    }
})

export default router;