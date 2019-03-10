/**
* @Description:    头部按钮组
* @Author:         TSY
* @CreateDate:     2018/9/26 12:17
*/
<template>
    <div class="btn_group">
        <button class="btn_item" v-for="(item,index) in operateBtn" :class="{ active: currentIndex == index }"
                :key="index" @click="changeBtn(index,item)">{{ item.name }}</button>
    </div>
</template>

<script>
    export default {
        name: "TopButtonGroup",
        props: ["operateBtn", "selectIndex"],
        data() {
            return {
                currentIndex: 0,//被选中button的index
            }
        },
        watch: {
            selectIndex(val) {
                this.currentIndex = val;
            }
        },
        computed: {},
        methods: {
            changeBtn(index, item) {
                this.currentIndex = index;
                this.$emit('click',{'index': index, 'data': item})
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .btn_group {
        display flex
        align-items center
        paddingAround()
    }

    .btn_item {
        flex 1
        background none
        text-align center
        padding px2vw(10px) 0
        color main-color
        borderTop(main-color)
        borderBottom(main-color)
    }

    .btn_group>.btn_item:last-child {
        border-radius 0 5px 5px 0
        borderRight(main-color)
    }

    .btn_group>.btn_item:first-child {
        border-radius 5px 0 0 5px
        borderLeft(main-color)
    }

    .active {
        color white
        background main-color
    }
</style>