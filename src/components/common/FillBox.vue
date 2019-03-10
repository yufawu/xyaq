/**
* @Description:    数据不足一屏时，填充背景色
* @Author:         TSY
* @CreateDate:     2018/8/2 14:16
*/
<template>
    <div>
        <div class="html_box" :style="{ 'background': bgColor }"></div>
    </div>
</template>

<script>
    export default {
        name: "FillBox",
        props: {
            color: {
                type: String,
                default: '#f4f4f4'
            }
        },
        computed: {
            bgColor(){
                return this.color;
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .html_box {
        position fixed
        width 100%
        height 100%
        background bg-color
    }
</style>