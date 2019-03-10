/**
 * @Description:    区域选择导航栏
 * @Author:         TSY
 * @CreateDate:     2018/6/26 9:34
 */
<template>
        <div class="common_area" :class="{'flex_box': flex}">
            <div class="common_area_item" v-for="(item,index) in areaList" :key="index"
                 :class="{ common_area_select: clickAreaIndex == index, 'flex_box_item': flex }" @click="selectArea(index)">{{ item.areaName }}
            </div>
        </div>
</template>

<script>
    export default {
        name: "selectArea",
        props: ["areaList", "flex"],
        data(){
            return{
                clickAreaIndex: 0,//当前选中区域的index
            }
        },
        methods:{
            selectArea(index){
                this.clickAreaIndex = index;
                this.$emit("listenSelect",index);
            }
        }
    }
</script>

<style lang="stylus">
    @import "../../style/common.styl"

    .common_area {
        white-space nowrap
        overflow-x auto
        borderBottom()
        borderTop()
        &::-webkit-scrollbar {
            display none
        }
    }

    .common_area_item {
        display inline-block
        min-width 20vw
        text-align center
        padding 2%
        margin 0 2%
    }

    .common_area_select {
        color main-color
        borderBottom(main-color)
    }

    .flex_box {
        display flex
    }

    .flex_box_item {
        flex 1
    }
</style>