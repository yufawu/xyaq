/**
* @Description:    下拉选择框
* @Author:         TSY
* @CreateDate:     2018/10/18 15:42
*/
<template>
    <div>
        <div class="header" ref="header">
            <div class="selector" v-for="(item,index) in selector" :key="index" @click="selectItem(index)">
                <div class="selector_text" :class="{ text_changed: item != selectorText[index] }">{{ item }}</div>
                <div class="triangle"
                     :class="{ triangle_selected: (selectIndex == index && isShowDropSelector) }"></div>
            </div>
        </div>
        <div v-show="isShowDropSelector" class="drop mask" @click="closeDrop" :style="{'top': dropDownTop}">
            <ul class="drop_down">
                <slot></slot>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DropSelector",
        props: {
            selector: {//选项文字
                type: Array,
                default() {
                    return []
                }
            },
            isShowSelector: {
                type: Boolean,
                default: false
            },
            selectIndex: {
                type: Number,
                default: -1
            }
        },
        data() {
            return {
                selectorText: JSON.parse(JSON.stringify(this.selector)),//选项
                isShowDropSelector: false,//是否显示下拉框
                currentIndex: -1,//选项的index
                headerHeight: 0,//header的高度
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.headerHeight = this.$refs.header.offsetHeight + 'px';
            })
        },
        watch: {
            isShowSelector(val) {
                this.isShowDropSelector = val;
            }
        },
        computed: {
            dropDownTop() {//下拉选项位置
                return this.headerHeight;
            }
        },
        methods: {
            selectItem(index) {//点击筛选条目
                this.$emit('click', index)
                this.currentIndex = index;
            },
            closeDrop() { //关闭下拉面板
                this.selectItem(this.currentIndex);
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .header {
        position fixed
        top 0
        left 0
        width 100%
        display flex
        align-items center
        justify-content space-around
        background #fff
        paddingAround()
        z-index 1
        borderBottom()
    }

    .selector {
        display flex
        align-items center
        justify-content center
        width 0
        flex-grow 1
    }

    .text_changed {
        color main-color
    }

    .triangle {
        width px2vw(26px)
        height px2vw(26px)
        margin-top px2vw(13px)
        margin-left px2vw(10px)
        border-width px2vw(13px)
        border-style solid
        border-color vice-font-color #fff #fff #fff
    }

    .triangle_selected {
        border-color main-color #fff #fff #fff
    }

    .selector_text {
        textOverflow()
    }

    .drop {
        position fixed
        top 0
        left 0
        width 100vw
    }

    .drop_down {
        background #fff
        padding 0 px2vw(30px)
        borderTop()
        max-height 60vh
        overflow auto
        z-index 1000
    }

    .drop_down_item li {
        width 100%
    }
</style>