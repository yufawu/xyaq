/**
* @Description:    标签和文字。也可以展开与折叠
* @Author:         TSY
* @CreateDate:     2018/7/13 10:59
*/
<template>
    <div @click="changeOpenState">
        <div class="danger_item click_item">
            <div class="danger_label">{{ label }}</div>
            <div class="danger_content">
                <span>{{ text }}</span>
                <i v-if="isParent" class="iconfont"
                   :class="{'icon-right-copy':!isOpenThis, 'icon-down-copy':isOpenThis}"></i>
            </div>
        </div>
        <div v-if="isParent" v-show="isOpenThis" class="open_item" @click.stop>
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "LabelText",
        props: {
            label: {//左边显示文字
                type: String,
                default: ''
            },
            text: {//右边显示文字
                type: String,
                default: ''
            },
            isParent: {//是否可以展开
                type: Boolean,
                default: false
            },
            isOpen: { //是否打开状态
                type: Boolean,
                default: false
            },
            isClick: { //是否把点击事件传递给父级处理
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                isOpenThis: this.isOpen
            }
        },
        methods: {
            changeOpenState() {//修改面板展开状态
                if (this.isClick) {
                    this.$emit('click');
                    return
                }
                if (this.isParent) {
                    this.isOpenThis = !this.isOpenThis;
                }
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "../../style/common.styl"

    .danger_item {
        padding 3% 4%
        borderBottom()
        display flex
        justify-content space-between
    }

    .danger_content {
        color vice-font-color
    }
</style>