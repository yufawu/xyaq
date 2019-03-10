/**
* @Description:
* @Author:         TSY
* @CreateDate:     2018/6/9 13:28
*/
<template>
    <div id="app">
        <!--页面路由 keepAlive保存页面状态、title设置页面标题-->
        <keep-alive>
            <router-view v-wechat-title="$route.meta.title" v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-wechat-title="$route.meta.title" v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>

<script>
    export default {
    }
</script>

<style lang="stylus">
    @import "./style/reset.styl";
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>
