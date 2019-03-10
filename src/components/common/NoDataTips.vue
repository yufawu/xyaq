/**
* @Description:    空数据提示
* @Author:         TSY
* @CreateDate:     2018/7/27 13:39
*/
<template>
    <div v-if="data.length <= 0" class="no_data_tips">
        <img src="../../assets/no_data.png" alt="">
        <span>{{ text }}</span>
    </div>
</template>

<script>
    export default {
        name: "NoDataTips",
        props: {
            data: {default: ''},
            text: {default: '暂无数据'}
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .no_data_tips {
        position absolute
        top 0
        left 0
        display flex
        align-items center
        justify-content center
        flex-direction column
        width 100%
        height 100vh
        background transparent
        pointer-events none
        z-index: 9;
    }

    .no_data_tips img {
        width 20%
        margin-bottom px2vw(5px)
    }
</style>