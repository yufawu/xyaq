/**
* @Description:    页面底部蓝色操作按钮
* @Author:         TSY
* @CreateDate:     2018/8/15 11:11
*/
<template>
    <div class="footer_button">
        <div class="footer_item" @click="clickItem()">{{ text }}</div>
    </div>
</template>

<script>
    export default {
        name: "FooterButton",
        props: ["text"],
        methods: {
            clickItem() {
                this.$emit('click');
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .footer_button {
        position fixed
        display flex
        width 100%
        bottom 0
        left 0
        background main-color
        color white
        z-index 2
    }

    .footer_item {
        width 0
        flex-grow 1
        text-align center
        padding 3% 0
        fontSize(34px)
        borderRight(#ccc)
    }
</style>