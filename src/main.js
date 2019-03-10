/**
 * @Description:
 * @Author:         TSY
 * @CreateDate:     2018/6/9 13:28
 */

import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import {store} from './store/store'
import axios from './http'
import Qs from 'qs'
//上拉加载、下拉刷新
import VueBetterScroll from 'vue2-better-scroll'
//通过配置router参数，设置页面标题
import VueWechatTitle from 'vue-wechat-title'
//引入轮播图插件及样式
import VueSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
//按需引入MintUI
import {Toast, Indicator, MessageBox, DatetimePicker, Loadmore, Picker} from 'mint-ui'
//按需引入ElementUI
import {Switch} from 'element-ui'
//使用animate动画库
import animate from 'animate.css'
//图片预览库
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'

Vue.use(preview)

Vue.use(VueSwiper)
Vue.use(VueWechatTitle)
Vue.use(Switch)
Vue.use(VueBetterScroll)
Vue.use(animate)

import VueJsonp from 'vue-jsonp'

Vue.use(VueJsonp)

Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Loadmore.name, Loadmore);
Vue.component(Picker.name, Picker);

//关闭生产模式下给出的提示
Vue.config.productionTip = false

Vue.prototype.$toast = Toast;
Vue.prototype.$bottomToast = (msg) => {
    Toast({position: 'bottom', message: msg})
}
Vue.prototype.$indicator = Indicator;
Vue.prototype.$messagebox = MessageBox;
//普通axios请求
Vue.prototype.$axios = (method, url, params, callback) => {
    Indicator.open();
    axios({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: method || 'post',
        url: url,
        data: Qs.stringify(params),
        withCredentials: true
    }).then(function (data) {
        Indicator.close();
        callback(data.data)
    }).catch(function (err) {
        Indicator.close();
        console.log(err);
        Toast({position: 'bottom', message: '服务器出错'})
    })
};
//axios上传文件
Vue.prototype.$axiosUpload = (url, params, callback) => {
    Indicator.open();
    let param = new FormData(); // 创建form对象
    if (params.filename) {
        param.append('filename', params.filename);
    } else {
        param.append('file', params.file); // 通过append向form对象添加数据
        param.append('fileName', params.fileName); // 通过append向form对象添加数据
    }
    param.append('webHost', params.webHost); // 通过append向form对象添加数据
    let config = {
        headers: {'Content-Type': 'multipart/form-data'}
    }// 添加请求头
    axios.post(url, param, config)
        .then(response => {
            Indicator.close();
            callback(response.data)
        }).catch(err => {
        Indicator.close();
        console.log(err);
        Toast({position: 'bottom', message: '服务器出错，文件上传失败'});
    })
};
//jsonp跨域请求
Vue.prototype.http = (_this, url, params, callback, isShowIndicator = true) => {
    if (isShowIndicator) {
        Indicator.open();
    }
    let paramsPre = {
        'jsonp': "callback",
        'jsonpCallback': "success_jsonpCallback",
        'platform': 'wap'
    }
    params = Object.assign(paramsPre, params);
    _this.$jsonp(url, params).then(json => {
        if (isShowIndicator) {
            Indicator.close();
        }
        callback(json);
    }).catch(err => {
        if (isShowIndicator) {
            Indicator.close();
        }
        console.log(err);
        Toast({position: 'bottom', message: '服务器出错'});
    })
}

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
