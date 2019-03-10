/**
* @Description:    单条数据选择层
* @Author:         TSY
* @CreateDate:     2018/7/12 14:48
*/
<template>
    <div>
        <div class="select_time" :class="selectAnimation" v-show="showSelect">
            <p class="select_time_item" v-for="(item,index) in selectData"
               :key="index" @click="dateConfirm(index)">{{ item }}</p>
        </div>
        <!--灰色遮罩层-->
        <div class="mask" v-show="showSelect" @click="closeSelect" @touchmove.prevent></div>
    </div>
</template>

<script>
    export default {
        name: "DangerDisposeTime",
        data() {
            return {
                itemData: [],//选项数据
                showSelect: false,//是否弹窗选择层
                selectedIndex: -1//当前选择的数据的index
            }
        },
        props: {
            isShowSelect: {
                type: Boolean,
                default: false
            },
            selectData: {
                type: Array,
                default(){
                    return [];
                }
            }
        },
        watch: {
            isShowSelect(val) {
                this.showSelect = val;
            },
            selectData(val) {
                this.itemData = [];
                this.selectedIndex = -1;
                this.itemData = this.itemData.concat(val);
            }
        },
        computed: {
            selectAnimation() {
                return this.showSelect ? 'selectOpenAnimation' : 'selectCloseAnimation'
            }
        },
        methods: {
            dateConfirm(index) {//确认选择时间
                this.selectedIndex = index;
                this.$emit('listenSelect', this.selectedIndex);
            },
            closeSelect() {//关闭选择弹窗
                this.$emit('listenSelect', this.selectedIndex);
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .select_time {
        position fixed
        bottom 0
        left 0
        width 100vw
        max-height 50vh
        overflow-y auto
        background white
        z-index 1000
        borderTop()
    }

    .select_time_item {
        text-align center
        padding px2vw(20px) 0
        borderBottom()
    }

    .selectOpenAnimation {
        animation selectOpenAnimation 0.5s
        bottom 0
    }

    .selectCloseAnimation {
        animation selectCloseAnimation 0.5s
        bottom -50vh
    }

    @keyframes selectOpenAnimation {
        0% {
            bottom -50vh
        }

        100% {
            bottom 0
        }
    }

    @keyframes selectCloseAnimation {
        0% {
            bottom 0px
        }

        100% {
            bottom -50vh
        }
    }
</style>