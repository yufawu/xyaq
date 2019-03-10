/**
* @Description:    首页菜单
* @Author:         TSY
* @CreateDate:     2018/6/9 13:28
*/

<template>
    <div class="content">
        <div class="home" v-for="(item,index) in menuItems" v-show="user.isExperience || item.isShow"
             :class="{ select: index == selectMenuIndex }" :key="index" @click="changeMenu(item)">
            <img :src="index == selectMenuIndex ? item.iconCheck : item.icon" alt="">
            <span>{{ item.name }}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'homeMenu',
        data() {
            return {
                menuItems: [
                    {id: 0, name: '平台介绍', icon: require('../../assets/home/xiaoge.png'), iconCheck: require('../../assets/home/xiaoge_check.png'), router: 'homeBrief'},
                    {id: 1, name: '首页', icon: require('../../assets/home/home.png'), iconCheck: require('../../assets/home/home_check.png'), router: 'homePage', isShow: true},
                    {id: 2, name: '我的', icon: require('../../assets/home/mine.png'), iconCheck: require('../../assets/home/mine_check.png'), router: 'homeMine', isShow: true}
                ],
                selectMenuIndex: 1
            }
        },
        mounted() {
            //根据地址判断当前处于哪个菜单页
            if (window.location.href.includes('home/mine')) {
                this.selectMenuIndex = 2;
            } else if (window.location.href.includes('home/index')) {
                this.selectMenuIndex = 1;
            } else {
                this.selectMenuIndex = 0;
            }
        },
        computed: {
            user() {
                return this.$store.getters.userInfo;
            }
        },
        methods: {
            changeMenu(data) {//点击切换菜单
                this.selectMenuIndex = data.id;
                this.$router.replace({name: data.router});
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .content {
        position fixed
        width 100%
        bottom 0
        left 0
        display flex
        padding 2%
        border-top 1px solid bg-color
        background #ffffff
        z-index 2
    }

    .home {
        width 0
        flex-grow 1
        text-align center
        color vice-font-color
        display flex
        align-items center
        flex-direction column
        justify-content center
    }

    .select {
        color main-color
    }

    .mine {
        @extend .home
    }

    .home img {
        width 20%
    }

    .iconfont {
        font-size 6vw
        margin-bottom 1%
    }
</style>