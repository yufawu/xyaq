/**
* @Description:    反馈意见
* @Author:         TSY
* @CreateDate:     2018/10/25 16:54
*/
<template>
    <div class="content">
        <div class="title">你的意见：</div>
        <textarea class="content_text" cols="30" rows="6" placeholder="留下您的宝贵意见，让我们做的更好！"></textarea>
        <div class="title">你的联系方式：</div>
        <input type="text" class="concat" placeholder="请留下您的联系方式">
        <div class="commit click_item">提交意见</div>
    </div>
</template>

<script>
    export default {
        name: "FeedBack",
        data() {
            return {}
        },
        mounted() {

        },
        computed: {},
        methods: {}
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .content {
        background bg-color
        height 100vh
        paddingAround()
    }

    .content_text {
        paddingAround()
        margin px2vw(30px) 0
        width 100%
        border none
        border-radius 5px
    }

    .concat {
        paddingAround()
        margin px2vw(30px) 0
        border none
        border-radius 5px
        width 100%
    }

    .commit {
        paddingSmall()
        margin-top px2vw(50px)
        width 100%
        text-align center
        background white
        border-radius 5px
    }
</style>