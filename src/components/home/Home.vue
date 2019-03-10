/**
* @Description:    首页页面路由
* @Author:         TSY
* @CreateDate:     2018/6/9 13:28
*/

<template>
    <div class="container">
        <!--页面路由 keepAlive保存页面状态、title设置页面标题-->
        <keep-alive>
            <router-view v-wechat-title="$route.meta.title" v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-wechat-title="$route.meta.title" v-if="!$route.meta.keepAlive"></router-view>
        <div class="footer">
            <home-menu></home-menu>
        </div>
    </div>
</template>

<script>
    import HomeMenu from "./HomeMenu";

    export default {
        name: 'Index',
        components: {HomeMenu}
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .container {
        background bg-color
        padding-bottom 20%
    }

</style>