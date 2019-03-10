/**
* @Description:    用户信息（单条）-----头像、名称、职务
* @Author:         TSY
* @CreateDate:     2018/10/19 10:08
*/
<template>
    <div class="user_item">
        <slot></slot>
        <label class="content-wrap" :for="pid && 'check'+pid">
            <img v-if="avatar" class="item_img" :src="avatar"/>
            <div v-else class="item_img" :style="{ background: headColor || showHeadColor }">
                {{ userName == '' ? '用户' : userName.substring(userName.length-2,userName.length) }}
            </div>
            <div class="content">
                <p class="content_name">
                    {{userName}}
                </p>
                <p class="vice">{{ job == '' ? '暂无职称' : job }}</p>
            </div>
        </label>
    </div>
</template>

<script>
    export default {
        name: "UserInfoItem",
        props: ["avatar", "userName", "job", "pid", "headColor"],
        data() {
            return {
                headColors: ['#1c71fb', '#f7aa47', '#00c182', '#ff6769', '#917ee6', '#2cb2eb'],//待选颜色
                showHeadColor: ''//当前显示的头像颜色
            }
        },
        mounted() {
            this.setHeadColor();
        },
        methods: {
            setHeadColor() {//头像设置随机背景颜色
                let length = this.headColors.length;
                this.showHeadColor = this.headColors[Math.floor(Math.random() * length)];
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .user_item {
        display flex
        align-items center
        width 100%
    }

    .content-wrap {
        display: flex;
        width: 100%
        align-items: center;
    }

    .item_img {
        display flex
        justify-content center
        align-items center
        width: px2vw(90px)
        height: px2vw(90px)
        border-radius: 50%
        margin-left px2vw(20px)
        margin-right px2vw(15px)
        color: #fff
        text-align: center
    }

    .content {
        display flex
        flex-direction column
        justify-content space-between
    }

    .content_name {
        font-weight: bold
        width 100%
        textOverflow()
    }

    .vice {
        color: vice-font-color
    }
</style>